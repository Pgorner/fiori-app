/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff4000.protocol.ina","sap/sac/df/firefly/ff4205.olap.api.base"
],
function(oFF)
{
"use strict";

oFF.LovRestoreSettings = function() {};
oFF.LovRestoreSettings.prototype = new oFF.XObject();
oFF.LovRestoreSettings.prototype._ff_c = "LovRestoreSettings";

oFF.LovRestoreSettings.create = function(dimension)
{
	let lovRestoreSettings = new oFF.LovRestoreSettings();
	lovRestoreSettings.setupRestoreSettings(dimension);
	return lovRestoreSettings;
};
oFF.LovRestoreSettings.prototype.m_hierarchy = null;
oFF.LovRestoreSettings.prototype.m_readModeResultSet = null;
oFF.LovRestoreSettings.prototype.m_readModeSelector = null;
oFF.LovRestoreSettings.prototype.m_sorting = null;
oFF.LovRestoreSettings.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_hierarchy = oFF.XObjectExt.release(this.m_hierarchy);
	this.m_sorting = oFF.XObjectExt.release(this.m_sorting);
	this.m_readModeResultSet = null;
	this.m_readModeSelector = null;
};
oFF.LovRestoreSettings.prototype.restore = function(dimension)
{
	if (oFF.notNull(this.m_hierarchy))
	{
		dimension.getHierarchyManager().deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY_DATA, this.m_hierarchy);
	}
	if (oFF.notNull(this.m_sorting))
	{
		let sorting = dimension.getResultSetSorting();
		sorting.copyFrom(sorting.deserializeFromElementExt(oFF.QModelFormat.INA_REPOSITORY_DATA, this.m_sorting).getData(), null);
	}
	if (oFF.notNull(this.m_readModeResultSet))
	{
		dimension.setReadModeGraceful(oFF.QContextType.RESULT_SET, this.m_readModeResultSet);
	}
	if (oFF.notNull(this.m_readModeSelector))
	{
		dimension.setReadModeGraceful(oFF.QContextType.SELECTOR, this.m_readModeSelector);
	}
};
oFF.LovRestoreSettings.prototype.setupRestoreSettings = function(dimension)
{
	this.m_hierarchy = dimension.getHierarchyManager().serializeToElement(oFF.QModelFormat.INA_REPOSITORY_DATA);
	this.m_sorting = dimension.getResultSetSorting().serializeToElement(oFF.QModelFormat.INA_REPOSITORY_DATA);
	this.m_readModeResultSet = dimension.getReadMode(oFF.QContextType.RESULT_SET);
	this.m_readModeSelector = dimension.getReadMode(oFF.QContextType.SELECTOR);
};

oFF.LovSortRestoreSettings = function() {};
oFF.LovSortRestoreSettings.prototype = new oFF.XObject();
oFF.LovSortRestoreSettings.prototype._ff_c = "LovSortRestoreSettings";

oFF.LovSortRestoreSettings.create = function(dimension, useSelectorReadMode, useSelectorInitialDrillLevel)
{
	let lovRestoreSettings = new oFF.LovSortRestoreSettings();
	lovRestoreSettings.setupRestoreSettings(dimension, useSelectorReadMode, useSelectorInitialDrillLevel);
	return lovRestoreSettings;
};
oFF.LovSortRestoreSettings.prototype.m_conditions = null;
oFF.LovSortRestoreSettings.prototype.m_initialDrillLevel = 0;
oFF.LovSortRestoreSettings.prototype.m_readModeResultSet = null;
oFF.LovSortRestoreSettings.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_conditions = oFF.XObjectExt.release(this.m_conditions);
	this.m_readModeResultSet = null;
};
oFF.LovSortRestoreSettings.prototype.restore = function(dimension)
{
	if (oFF.notNull(dimension))
	{
		if (oFF.notNull(this.m_readModeResultSet))
		{
			dimension.setReadModeGraceful(oFF.QContextType.RESULT_SET, this.m_readModeResultSet);
		}
		dimension.setInitialDrillLevel(this.m_initialDrillLevel);
		let queryModel = dimension.getQueryModel();
		if (oFF.notNull(this.m_conditions) && oFF.notNull(queryModel))
		{
			queryModel.getConditionManager().deserializeFromElementExt(oFF.QModelFormat.INA_CLONE, this.m_conditions);
		}
	}
};
oFF.LovSortRestoreSettings.prototype.setupRestoreSettings = function(dimension, useSelectorReadMode, useSelectorInitialDrillLevel)
{
	if (oFF.notNull(dimension))
	{
		if (useSelectorReadMode && !dimension.getReadMode(oFF.QContextType.SELECTOR).isEqualTo(dimension.getReadMode(oFF.QContextType.RESULT_SET)))
		{
			this.m_readModeResultSet = dimension.getReadMode(oFF.QContextType.RESULT_SET);
			dimension.setReadModeGraceful(oFF.QContextType.RESULT_SET, dimension.getReadModeDefault(oFF.QContextType.SELECTOR));
		}
		this.m_initialDrillLevel = dimension.getInitialDrillLevel();
		if (useSelectorInitialDrillLevel && dimension.getInitialDrillLevel() !== dimension.getSelectorRootLevel())
		{
			dimension.setInitialDrillLevel(dimension.getSelectorRootLevel());
		}
		let queryModel = dimension.getQueryModel();
		let conditionsManager = oFF.notNull(queryModel) ? queryModel.getConditionManager() : null;
		if (oFF.notNull(queryModel) && oFF.notNull(conditionsManager) && conditionsManager.hasConditions())
		{
			this.m_conditions = queryModel.getConditionManager().serializeToElement(oFF.QModelFormat.INA_CLONE);
			conditionsManager.clear();
		}
	}
};

oFF.RsDefStructureMemberProperties = function() {};
oFF.RsDefStructureMemberProperties.prototype = new oFF.XObject();
oFF.RsDefStructureMemberProperties.prototype._ff_c = "RsDefStructureMemberProperties";

oFF.RsDefStructureMemberProperties.create = function(placeholderAliasMappings, minimumDrillStateMap, unsatisfiedRequiredDimensionNames, availableFormulaExceptionIds, outOfContextMembers)
{
	let result = new oFF.RsDefStructureMemberProperties();
	result.m_placeholderAliasMappings = oFF.XHashMapByString.create();
	if (oFF.notNull(placeholderAliasMappings))
	{
		result.m_placeholderAliasMappings.putAll(placeholderAliasMappings);
	}
	result.m_minimumDrillStateMap = oFF.XHashMapByString.create();
	if (oFF.notNull(minimumDrillStateMap))
	{
		result.m_minimumDrillStateMap.putAll(minimumDrillStateMap);
	}
	result.m_unsatisfiedRequiredDimensionNames = oFF.XHashMapByString.create();
	if (oFF.notNull(unsatisfiedRequiredDimensionNames))
	{
		result.m_unsatisfiedRequiredDimensionNames.putAll(unsatisfiedRequiredDimensionNames);
	}
	result.m_availableFormulaExceptionIds = oFF.XHashMapByString.create();
	if (oFF.notNull(availableFormulaExceptionIds))
	{
		result.m_availableFormulaExceptionIds.putAll(availableFormulaExceptionIds);
	}
	result.m_outOfContextMembers = outOfContextMembers;
	return result;
};
oFF.RsDefStructureMemberProperties.prototype.m_availableFormulaExceptionIds = null;
oFF.RsDefStructureMemberProperties.prototype.m_minimumDrillStateMap = null;
oFF.RsDefStructureMemberProperties.prototype.m_outOfContextMembers = null;
oFF.RsDefStructureMemberProperties.prototype.m_placeholderAliasMappings = null;
oFF.RsDefStructureMemberProperties.prototype.m_unsatisfiedRequiredDimensionNames = null;
oFF.RsDefStructureMemberProperties.prototype.getAllMemberNames = function()
{
	let memberNames = oFF.XHashSetOfString.create();
	memberNames.addAll(this.m_placeholderAliasMappings.getKeysAsReadOnlyList());
	memberNames.addAll(this.m_minimumDrillStateMap.getKeysAsReadOnlyList());
	memberNames.addAll(this.m_unsatisfiedRequiredDimensionNames.getKeysAsReadOnlyList());
	memberNames.addAll(this.m_availableFormulaExceptionIds.getKeysAsReadOnlyList());
	let aliasNames = this.m_placeholderAliasMappings.getValuesAsReadOnlyList();
	let iterator = aliasNames.getIterator();
	while (iterator.hasNext())
	{
		memberNames.removeElement(iterator.next());
	}
	return memberNames;
};
oFF.RsDefStructureMemberProperties.prototype.getAvailableFormulaExceptionIds = function()
{
	return this.m_availableFormulaExceptionIds;
};
oFF.RsDefStructureMemberProperties.prototype.getMinimumDrillState = function()
{
	return this.m_minimumDrillStateMap;
};
oFF.RsDefStructureMemberProperties.prototype.getOutOfContextMembers = function()
{
	return this.m_outOfContextMembers;
};
oFF.RsDefStructureMemberProperties.prototype.getPlaceholderAliasMappings = function()
{
	return this.m_placeholderAliasMappings;
};
oFF.RsDefStructureMemberProperties.prototype.getUnsatisfiedRequiredDimensionNames = function()
{
	return this.m_unsatisfiedRequiredDimensionNames;
};
oFF.RsDefStructureMemberProperties.prototype.releaseObject = function()
{
	this.m_placeholderAliasMappings = oFF.XObjectExt.release(this.m_placeholderAliasMappings);
	this.m_minimumDrillStateMap = oFF.XObjectExt.release(this.m_minimumDrillStateMap);
	this.m_unsatisfiedRequiredDimensionNames = oFF.XObjectExt.release(this.m_unsatisfiedRequiredDimensionNames);
	this.m_availableFormulaExceptionIds = oFF.XObjectExt.release(this.m_availableFormulaExceptionIds);
	this.m_outOfContextMembers = oFF.XObjectExt.release(this.m_outOfContextMembers);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.RsLbhToUdhConversionProperties = function() {};
oFF.RsLbhToUdhConversionProperties.prototype = new oFF.XObject();
oFF.RsLbhToUdhConversionProperties.prototype._ff_c = "RsLbhToUdhConversionProperties";

oFF.RsLbhToUdhConversionProperties.create = function(dimensionName, hierarchyName, dimensionAxisType, udhName)
{
	let properties = new oFF.RsLbhToUdhConversionProperties();
	properties.setupProperties(dimensionName, hierarchyName, dimensionAxisType, udhName);
	return properties;
};
oFF.RsLbhToUdhConversionProperties.createByDimension = function(dimension)
{
	let properties = new oFF.RsLbhToUdhConversionProperties();
	let universalDisplayHierarchies = dimension.getQueryModel().getUniversalDisplayHierarchies();
	properties.setupProperties(dimension.getName(), dimension.getHierarchyName(), dimension.getAxisType(), universalDisplayHierarchies.getByAxisType(dimension.getAxisType()).getName());
	return properties;
};
oFF.RsLbhToUdhConversionProperties.prototype.m_dimensionAxisType = null;
oFF.RsLbhToUdhConversionProperties.prototype.m_dimensionName = null;
oFF.RsLbhToUdhConversionProperties.prototype.m_hierarchyName = null;
oFF.RsLbhToUdhConversionProperties.prototype.m_udhName = null;
oFF.RsLbhToUdhConversionProperties.prototype.cloneExt = function(flags)
{
	return oFF.RsLbhToUdhConversionProperties.create(this.m_dimensionName, this.m_hierarchyName, this.m_dimensionAxisType, this.m_udhName);
};
oFF.RsLbhToUdhConversionProperties.prototype.getAxisType = function()
{
	return this.m_dimensionAxisType;
};
oFF.RsLbhToUdhConversionProperties.prototype.getDimensionName = function()
{
	return this.m_dimensionName;
};
oFF.RsLbhToUdhConversionProperties.prototype.getHierarchyName = function()
{
	return this.m_hierarchyName;
};
oFF.RsLbhToUdhConversionProperties.prototype.getUdhName = function()
{
	return this.m_udhName;
};
oFF.RsLbhToUdhConversionProperties.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_dimensionName = null;
	this.m_hierarchyName = null;
	this.m_udhName = null;
};
oFF.RsLbhToUdhConversionProperties.prototype.setupProperties = function(dimensionName, hierarchyName, dimensionAxisType, udhName)
{
	this.m_dimensionName = dimensionName;
	this.m_hierarchyName = hierarchyName;
	this.m_dimensionAxisType = dimensionAxisType;
	this.m_udhName = udhName;
};

oFF.RsComplexUnit = function() {};
oFF.RsComplexUnit.prototype = new oFF.XObject();
oFF.RsComplexUnit.prototype._ff_c = "RsComplexUnit";

oFF.RsComplexUnit.create = function(types, values, descriptions, exponents)
{
	let complexUnit = new oFF.RsComplexUnit();
	complexUnit.setupExt(types, values, descriptions, exponents);
	return complexUnit;
};
oFF.RsComplexUnit.prototype.m_descriptions = null;
oFF.RsComplexUnit.prototype.m_exponents = null;
oFF.RsComplexUnit.prototype.m_numberOfSubUnits = 0;
oFF.RsComplexUnit.prototype.m_types = null;
oFF.RsComplexUnit.prototype.m_values = null;
oFF.RsComplexUnit.prototype.cloneExt = function(flags)
{
	return oFF.RsComplexUnit.create(this.m_types.createListCopy(), this.m_values.createListCopy(), this.m_descriptions.createListCopy(), this.m_exponents.createListCopy());
};
oFF.RsComplexUnit.prototype.getNumberOfSubUnits = function()
{
	return this.m_numberOfSubUnits;
};
oFF.RsComplexUnit.prototype.getUnitDescriptions = function()
{
	return this.m_descriptions;
};
oFF.RsComplexUnit.prototype.getUnitExponents = function()
{
	return this.m_exponents;
};
oFF.RsComplexUnit.prototype.getUnitTypes = function()
{
	return this.m_types;
};
oFF.RsComplexUnit.prototype.getUnitValues = function()
{
	return this.m_values;
};
oFF.RsComplexUnit.prototype.releaseObject = function()
{
	this.m_types = oFF.XObjectExt.release(this.m_types);
	this.m_values = oFF.XObjectExt.release(this.m_values);
	this.m_descriptions = oFF.XObjectExt.release(this.m_descriptions);
	this.m_exponents = oFF.XObjectExt.release(this.m_exponents);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsComplexUnit.prototype.setupExt = function(types, values, descriptions, exponents)
{
	this.m_types = types;
	this.m_values = values;
	this.m_descriptions = descriptions;
	this.m_exponents = exponents;
	if (oFF.notNull(values))
	{
		this.m_numberOfSubUnits = values.size();
	}
};

oFF.RsUdhKey = function() {};
oFF.RsUdhKey.prototype = new oFF.XObject();
oFF.RsUdhKey.prototype._ff_c = "RsUdhKey";

oFF.RsUdhKey.create = function(udhKeyFieldValue, udhDimensionNames, drillGroupDimensionName)
{
	let rsUdhKey = new oFF.RsUdhKey();
	rsUdhKey.setupExt(udhKeyFieldValue, udhDimensionNames, drillGroupDimensionName);
	return rsUdhKey;
};
oFF.RsUdhKey.createEmpty = function()
{
	return new oFF.RsUdhKey();
};
oFF.RsUdhKey.prototype.m_drillGroupIndex = 0;
oFF.RsUdhKey.prototype.m_fieldValue = null;
oFF.RsUdhKey.prototype.m_udhDimensionNames = null;
oFF.RsUdhKey.prototype.cloneExt = function(flags)
{
	let clone = oFF.RsUdhKey.createEmpty();
	clone.m_fieldValue = this.m_fieldValue.clone();
	clone.m_udhDimensionNames = this.m_udhDimensionNames.createListCopy();
	clone.m_drillGroupIndex = this.m_drillGroupIndex;
	return clone;
};
oFF.RsUdhKey.prototype.getDrillGroupDimensionName = function()
{
	return oFF.XCollectionUtils.getOptionalAtIndex(this.m_udhDimensionNames, this.m_drillGroupIndex).orElse(null);
};
oFF.RsUdhKey.prototype.getHierarchyIdByDimension = function(dimension)
{
	let index = this.m_udhDimensionNames.getIndex(dimension.getName());
	return oFF.PrUtils.getStringValueElement(this.m_fieldValue.getListByKey("UDH_ID"), index, null);
};
oFF.RsUdhKey.prototype.getHierarchyKey = function()
{
	return oFF.PrUtils.getStringValueElement(this.m_fieldValue.getListByKey("UDH_KEY"), this.m_drillGroupIndex, null);
};
oFF.RsUdhKey.prototype.getHierarchyKeyByDimension = function(dimension)
{
	let index = this.m_udhDimensionNames.getIndex(dimension.getName());
	return oFF.PrUtils.getStringValueElement(this.m_fieldValue.getListByKey("UDH_KEY"), index, null);
};
oFF.RsUdhKey.prototype.getId = function()
{
	return oFF.PrUtils.getStringValueElement(this.m_fieldValue.getListByKey("UDH_ID"), this.m_drillGroupIndex, null);
};
oFF.RsUdhKey.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_fieldValue = oFF.XObjectExt.release(this.m_fieldValue);
	this.m_udhDimensionNames = oFF.XObjectExt.release(this.m_udhDimensionNames);
	this.m_drillGroupIndex = -1;
};
oFF.RsUdhKey.prototype.setupExt = function(udhKeyFieldValue, udhDimensionNames, drillGroupDimensionName)
{
	this.m_fieldValue = oFF.JsonParserFactory.createFromSafeString(udhKeyFieldValue).asStructure();
	this.m_udhDimensionNames = udhDimensionNames.createListCopy();
	this.m_drillGroupIndex = udhDimensionNames.getIndex(drillGroupDimensionName);
};

oFF.RsRequestDecoratorFactory = function() {};
oFF.RsRequestDecoratorFactory.prototype = new oFF.XObject();
oFF.RsRequestDecoratorFactory.prototype._ff_c = "RsRequestDecoratorFactory";

oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER = "RESULTSET_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION";
oFF.RsRequestDecoratorFactory.getResultsetRequestDecorator = function(application, systemDescription, requestStructure)
{
	let sessionSingletons = application.getSession().getSessionSingletons();
	let factoryObject = sessionSingletons.getByKey(oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER);
	let factory;
	if (oFF.isNull(factoryObject))
	{
		factory = new oFF.RsRequestDecoratorFactory();
		factory.initProviders();
		sessionSingletons.put(oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER, factory);
	}
	else
	{
		factory = factoryObject;
	}
	return factory.getResultsetRequestDecoratorInternal(application, systemDescription, requestStructure);
};
oFF.RsRequestDecoratorFactory.prototype.m_providers = null;
oFF.RsRequestDecoratorFactory.prototype.getResultsetRequestDecoratorInternal = function(application, systemDescription, requestStructure)
{
	let result = null;
	for (let i = 0; i < this.m_providers.size(); i++)
	{
		let provider = this.m_providers.get(i);
		let decorator = provider.getResultsetRequestDecorator(application, systemDescription, requestStructure);
		if (oFF.isNull(decorator))
		{
			continue;
		}
		if (oFF.notNull(result))
		{
			throw oFF.XException.createIllegalStateException("duplicate decorator");
		}
		result = decorator;
	}
	return result;
};
oFF.RsRequestDecoratorFactory.prototype.initProviders = function()
{
	if (oFF.notNull(this.m_providers))
	{
		return;
	}
	this.m_providers = oFF.XList.create();
	let registrationService = oFF.RegistrationService.getInstance();
	if (oFF.notNull(registrationService))
	{
		let clazzes = registrationService.getReferences(oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER);
		if (oFF.notNull(clazzes))
		{
			for (let i = 0; i < clazzes.size(); i++)
			{
				let clazz = clazzes.get(i);
				let provider = clazz.newInstance(this);
				this.m_providers.add(provider);
			}
		}
	}
};

oFF.RsInputReadinessState = function() {};
oFF.RsInputReadinessState.prototype = new oFF.XObject();
oFF.RsInputReadinessState.prototype._ff_c = "RsInputReadinessState";

oFF.RsInputReadinessState.create = function(inputStateIndex, typeList)
{
	if (oFF.isNull(typeList))
	{
		return null;
	}
	let types = oFF.XList.create();
	let parameterMap = oFF.XHashMapByString.create();
	for (let i = typeList.size() - 1; i >= 0; i--)
	{
		let typeStructure = typeList.getStructureAt(i);
		let type = oFF.RsInputReadinessState.getTypeFromStructure(typeStructure);
		if (oFF.isNull(type))
		{
			continue;
		}
		types.add(type);
		let parameter = oFF.RsInputReadinessState.getParametersFromStructure(typeStructure);
		if (oFF.notNull(parameter))
		{
			parameterMap.put(type.getName(), parameter);
		}
	}
	if (types.isEmpty())
	{
		return null;
	}
	let state = new oFF.RsInputReadinessState();
	state.m_rsStateIndex = inputStateIndex;
	state.m_types = types;
	state.m_paramterMap = parameterMap;
	return state;
};
oFF.RsInputReadinessState.getParametersFromStructure = function(flagStructure)
{
	if (oFF.isNull(flagStructure))
	{
		return null;
	}
	let parameterList = flagStructure.getListByKey("Parameters");
	if (oFF.isNull(parameterList))
	{
		return null;
	}
	let parameters = oFF.XList.create();
	for (let j = 0; j < parameterList.size(); j++)
	{
		let parameter = parameterList.getStringAtExt(j, null);
		if (oFF.XStringUtils.isNullOrEmpty(parameter))
		{
			continue;
		}
		parameters.add(parameter);
	}
	if (parameters.isEmpty())
	{
		return null;
	}
	return parameters;
};
oFF.RsInputReadinessState.getTypeFromStructure = function(flagStructure)
{
	if (oFF.isNull(flagStructure))
	{
		return null;
	}
	let typeString = flagStructure.getStringByKeyExt("Flag", null);
	return oFF.InputReadinessType.getOrCreate(typeString);
};
oFF.RsInputReadinessState.prototype.m_paramterMap = null;
oFF.RsInputReadinessState.prototype.m_rsStateIndex = 0;
oFF.RsInputReadinessState.prototype.m_types = null;
oFF.RsInputReadinessState.prototype.getIndex = function()
{
	return this.m_rsStateIndex;
};
oFF.RsInputReadinessState.prototype.getInputReadinessTypes = function()
{
	return this.m_types;
};
oFF.RsInputReadinessState.prototype.getParameterByType = function(type)
{
	return this.m_paramterMap.getByKey(type.getName());
};
oFF.RsInputReadinessState.prototype.hasInputReadinessType = function(type)
{
	return this.m_types.contains(type);
};
oFF.RsInputReadinessState.prototype.hasSingleInputReadinessType = function(type)
{
	return this.m_types.size() === 1 && this.hasInputReadinessType(type);
};
oFF.RsInputReadinessState.prototype.isInputEnabled = function()
{
	return this.hasSingleInputReadinessType(oFF.InputReadinessType.INPUT_ENABLED);
};

oFF.RsCellIndexInfo = function() {};
oFF.RsCellIndexInfo.prototype = new oFF.XObject();
oFF.RsCellIndexInfo.prototype._ff_c = "RsCellIndexInfo";

oFF.RsCellIndexInfo.create = function()
{
	return new oFF.RsCellIndexInfo();
};
oFF.RsCellIndexInfo.prototype.m_columnIndex = 0;
oFF.RsCellIndexInfo.prototype.m_rowIndex = 0;
oFF.RsCellIndexInfo.prototype.getColumnIndex = function()
{
	return this.m_columnIndex;
};
oFF.RsCellIndexInfo.prototype.getRowIndex = function()
{
	return this.m_rowIndex;
};
oFF.RsCellIndexInfo.prototype.initialize = function(rowIndex, columnIndex)
{
	this.m_rowIndex = rowIndex;
	this.m_columnIndex = columnIndex;
	return this;
};

oFF.RsDataCellEntry = function() {};
oFF.RsDataCellEntry.prototype = new oFF.XObject();
oFF.RsDataCellEntry.prototype._ff_c = "RsDataCellEntry";

oFF.RsDataCellEntry.create = function(name)
{
	let value = new oFF.RsDataCellEntry();
	value.m_name = name;
	return value;
};
oFF.RsDataCellEntry.prototype.m_disaggregationCellRefName = null;
oFF.RsDataCellEntry.prototype.m_disaggregationMode = null;
oFF.RsDataCellEntry.prototype.m_name = null;
oFF.RsDataCellEntry.prototype.getDisaggregationMode = function()
{
	return this.m_disaggregationMode;
};
oFF.RsDataCellEntry.prototype.getDisaggregationRefCellName = function()
{
	return this.m_disaggregationCellRefName;
};
oFF.RsDataCellEntry.prototype.getName = function()
{
	return this.m_name;
};
oFF.RsDataCellEntry.prototype.releaseObject = function()
{
	this.m_name = null;
	this.m_disaggregationMode = null;
	this.m_disaggregationCellRefName = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDataCellEntry.prototype.setDisaggregationMode = function(disaggregationMode)
{
	this.m_disaggregationMode = disaggregationMode;
};
oFF.RsDataCellEntry.prototype.setDisaggregationRefCellName = function(disaggregationRefCellName)
{
	this.m_disaggregationCellRefName = disaggregationRefCellName;
};

oFF.RsDocumentId = function() {};
oFF.RsDocumentId.prototype = new oFF.XObject();
oFF.RsDocumentId.prototype._ff_c = "RsDocumentId";

oFF.RsDocumentId.create = function(documentIdCollection, documentCellId, columnsTuple, rowsTuple)
{
	let documentId = new oFF.RsDocumentId();
	documentId.setupExt(documentIdCollection, documentCellId, columnsTuple, rowsTuple);
	return documentId;
};
oFF.RsDocumentId.prototype.m_dimensionMembers = null;
oFF.RsDocumentId.prototype.m_documentCellId = 0;
oFF.RsDocumentId.prototype.m_documentIdActionMap = null;
oFF.RsDocumentId.prototype.m_documentIdCollection = null;
oFF.RsDocumentId.prototype.clear = function()
{
	this.m_dimensionMembers = oFF.XObjectExt.release(this.m_dimensionMembers);
	this.m_documentIdActionMap = oFF.XObjectExt.release(this.m_documentIdActionMap);
};
oFF.RsDocumentId.prototype.getDimensionMembers = function()
{
	let result = oFF.XList.create();
	let keys = oFF.XList.createWithList(this.m_dimensionMembers.getKeysAsReadOnlyList());
	keys.sortByDirection(oFF.XSortDirection.ASCENDING);
	for (let i = 0; i < keys.size(); i++)
	{
		result.add(this.m_dimensionMembers.getByKey(keys.get(i)));
	}
	return result;
};
oFF.RsDocumentId.prototype.getDocumentCellId = function()
{
	return this.m_documentCellId;
};
oFF.RsDocumentId.prototype.getDocumentIdAction = function(dataCell)
{
	let collection = this.getDocumentIdCollection();
	let rowsAxis = collection.getRowsAxis();
	let queryModel = rowsAxis.getQueryModel();
	let dataCells = queryModel.getQueryDataCells();
	if (!dataCells.contains(dataCell))
	{
		return null;
	}
	if (!this.m_documentIdActionMap.containsKey(dataCell.getName()))
	{
		let documentIdAction = oFF.RsDocumentIdAction.create(this, dataCell.getName());
		this.m_documentIdActionMap.put(dataCell.getName(), documentIdAction);
	}
	return this.m_documentIdActionMap.getByKey(dataCell.getName());
};
oFF.RsDocumentId.prototype.getDocumentIdActionByDataCellReference = function(dataCellReference)
{
	if (!this.m_documentIdActionMap.containsKey(dataCellReference))
	{
		let documentIdAction = oFF.RsDocumentIdAction.create(this, dataCellReference);
		this.m_documentIdActionMap.put(dataCellReference, documentIdAction);
	}
	return this.m_documentIdActionMap.getByKey(dataCellReference);
};
oFF.RsDocumentId.prototype.getDocumentIdActions = function()
{
	return this.m_documentIdActionMap.getValuesAsReadOnlyList();
};
oFF.RsDocumentId.prototype.getDocumentIdCollection = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_documentIdCollection);
};
oFF.RsDocumentId.prototype.isValid = function()
{
	let iterator = this.m_dimensionMembers.getIterator();
	while (iterator.hasNext())
	{
		let dimensionMember = iterator.next();
		if (oFF.isNull(dimensionMember))
		{
			return false;
		}
		let keyFieldValue = dimensionMember.getKeyFieldValue();
		if (oFF.isNull(keyFieldValue))
		{
			return false;
		}
	}
	return true;
};
oFF.RsDocumentId.prototype.releaseObject = function()
{
	this.m_dimensionMembers = oFF.XObjectExt.release(this.m_dimensionMembers);
	this.m_documentIdActionMap = oFF.XObjectExt.release(this.m_documentIdActionMap);
	this.m_documentIdCollection = oFF.XObjectExt.release(this.m_documentIdCollection);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDocumentId.prototype.setDimensionMember = function(dimensionMember)
{
	this.m_dimensionMembers.put(dimensionMember.getDimension().getName(), dimensionMember);
	return true;
};
oFF.RsDocumentId.prototype.setupDimensionMembers = function(tuple)
{
	if (oFF.notNull(tuple))
	{
		for (let i = 0; i < tuple.size(); i++)
		{
			let dimensionMember = tuple.get(i).getDimensionMember();
			let dimension = dimensionMember.getDimension();
			if (!dimension.getDimensionType().isTypeOf(oFF.DimensionType.ABSTRACT_STRUCTURE) && !dimensionMember.getMemberType().isTypeOf(oFF.MemberType.RESULT))
			{
				this.m_dimensionMembers.put(dimension.getName(), dimensionMember);
			}
		}
	}
};
oFF.RsDocumentId.prototype.setupExt = function(documentIdCollection, documentCellId, columnsTuple, rowsTuple)
{
	this.m_documentIdCollection = oFF.XWeakReferenceUtil.getWeakRef(documentIdCollection);
	this.m_documentIdActionMap = oFF.XHashMapByString.create();
	this.m_documentCellId = documentCellId;
	this.m_dimensionMembers = oFF.XHashMapByString.create();
	this.setupDimensionMembers(columnsTuple);
	this.setupDimensionMembers(rowsTuple);
};

oFF.RsDocumentIdAction = function() {};
oFF.RsDocumentIdAction.prototype = new oFF.XObject();
oFF.RsDocumentIdAction.prototype._ff_c = "RsDocumentIdAction";

oFF.RsDocumentIdAction.create = function(documentId, queryDataCellReference)
{
	let documentsIdsAction = new oFF.RsDocumentIdAction();
	documentsIdsAction.setupExt(documentId, queryDataCellReference);
	return documentsIdsAction;
};
oFF.RsDocumentIdAction.prototype.m_action = null;
oFF.RsDocumentIdAction.prototype.m_documentId = null;
oFF.RsDocumentIdAction.prototype.m_queryDataCellReference = null;
oFF.RsDocumentIdAction.prototype.getAction = function()
{
	return this.m_action;
};
oFF.RsDocumentIdAction.prototype.getDocumentId = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_documentId);
};
oFF.RsDocumentIdAction.prototype.getQueryDataCellReference = function()
{
	return this.m_queryDataCellReference;
};
oFF.RsDocumentIdAction.prototype.releaseObject = function()
{
	this.m_queryDataCellReference = null;
	this.m_documentId = oFF.XObjectExt.release(this.m_documentId);
	this.m_action = oFF.XObjectExt.release(this.m_action);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDocumentIdAction.prototype.setAction = function(action)
{
	this.m_action = action;
};
oFF.RsDocumentIdAction.prototype.setupExt = function(documentId, queryDataCellReference)
{
	this.m_queryDataCellReference = queryDataCellReference;
	this.m_documentId = oFF.XWeakReferenceUtil.getWeakRef(documentId);
};

oFF.RsDocumentIdCollection = function() {};
oFF.RsDocumentIdCollection.prototype = new oFF.XObject();
oFF.RsDocumentIdCollection.prototype._ff_c = "RsDocumentIdCollection";

oFF.RsDocumentIdCollection.m_documentActionIdCounter = 4710;
oFF.RsDocumentIdCollection.create = function(queryManager, rowsAxis, columnsAxis)
{
	let documentIdCollection = new oFF.RsDocumentIdCollection();
	documentIdCollection.setupExt(queryManager, rowsAxis, columnsAxis);
	return documentIdCollection;
};
oFF.RsDocumentIdCollection.prototype.m_columnsAxis = null;
oFF.RsDocumentIdCollection.prototype.m_documentIds = null;
oFF.RsDocumentIdCollection.prototype.m_queryManager = null;
oFF.RsDocumentIdCollection.prototype.m_rowsAxis = null;
oFF.RsDocumentIdCollection.prototype.clear = function()
{
	if (oFF.isNull(this.m_documentIds))
	{
		return;
	}
	for (let k = 0; k < this.m_documentIds.size(); k++)
	{
		this.m_documentIds.get(k).clear();
	}
	oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_documentIds);
	this.m_documentIds.clear();
};
oFF.RsDocumentIdCollection.prototype.createDocumentId = function(columnsTuple, rowsTuple)
{
	oFF.RsDocumentIdCollection.m_documentActionIdCounter++;
	if (oFF.isNull(this.m_documentIds))
	{
		this.m_documentIds = oFF.XList.create();
	}
	let documentId = oFF.RsDocumentId.create(this, oFF.RsDocumentIdCollection.m_documentActionIdCounter, columnsTuple, rowsTuple);
	this.m_documentIds.add(documentId);
	return documentId;
};
oFF.RsDocumentIdCollection.prototype.getColumnsAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_columnsAxis);
};
oFF.RsDocumentIdCollection.prototype.getDocumentIds = function()
{
	return this.m_documentIds;
};
oFF.RsDocumentIdCollection.prototype.getResultSetContainer = function()
{
	let queryManager = oFF.XWeakReferenceUtil.getHardRef(this.m_queryManager);
	return queryManager.getActiveResultSetContainer();
};
oFF.RsDocumentIdCollection.prototype.getRowsAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_rowsAxis);
};
oFF.RsDocumentIdCollection.prototype.getValidDocumentIds = function()
{
	if (!this.hasValidDocumentIds())
	{
		return null;
	}
	let validDocumentIds = oFF.XList.create();
	for (let k = 0; k < this.m_documentIds.size(); k++)
	{
		let validDocumentId = this.m_documentIds.get(k);
		if (validDocumentId.isValid())
		{
			validDocumentIds.add(validDocumentId);
		}
	}
	return validDocumentIds;
};
oFF.RsDocumentIdCollection.prototype.hasDocumentIds = function()
{
	return oFF.notNull(this.m_documentIds);
};
oFF.RsDocumentIdCollection.prototype.hasValidDocumentIds = function()
{
	if (oFF.isNull(this.m_documentIds))
	{
		return false;
	}
	for (let k = 0; k < this.m_documentIds.size(); k++)
	{
		if (this.m_documentIds.get(k).isValid())
		{
			return true;
		}
	}
	return false;
};
oFF.RsDocumentIdCollection.prototype.isEmpty = function()
{
	if (oFF.isNull(this.m_documentIds))
	{
		return true;
	}
	return this.m_documentIds.isEmpty();
};
oFF.RsDocumentIdCollection.prototype.releaseObject = function()
{
	this.m_documentIds = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_documentIds);
	this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
	this.m_columnsAxis = oFF.XObjectExt.release(this.m_columnsAxis);
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDocumentIdCollection.prototype.remove = function(element)
{
	if (oFF.isNull(this.m_documentIds))
	{
		return false;
	}
	let changed = false;
	if (this.m_documentIds.contains(element))
	{
		element.clear();
		this.m_documentIds.removeElement(element);
		changed = true;
	}
	return changed;
};
oFF.RsDocumentIdCollection.prototype.retainAll = function(collection)
{
	let changed = false;
	for (let k = 0; k < this.m_documentIds.size(); k++)
	{
		let documentId = this.m_documentIds.get(k);
		if (!collection.contains(documentId))
		{
			documentId.clear();
			this.m_documentIds.removeElement(documentId);
			changed = true;
		}
	}
	return changed;
};
oFF.RsDocumentIdCollection.prototype.setupExt = function(queryManager, rowsAxis, columnsAxis)
{
	this.m_rowsAxis = oFF.XWeakReferenceUtil.getWeakRef(rowsAxis);
	this.m_columnsAxis = oFF.XWeakReferenceUtil.getWeakRef(columnsAxis);
	this.m_queryManager = oFF.XWeakReferenceUtil.getWeakRef(queryManager);
};
oFF.RsDocumentIdCollection.prototype.size = function()
{
	if (oFF.isNull(this.m_documentIds))
	{
		return 0;
	}
	return this.m_documentIds.size();
};

oFF.RsDocumentIdManager = function() {};
oFF.RsDocumentIdManager.prototype = new oFF.XObject();
oFF.RsDocumentIdManager.prototype._ff_c = "RsDocumentIdManager";

oFF.RsDocumentIdManager.create = function(queryManager)
{
	let documentIdManager = new oFF.RsDocumentIdManager();
	documentIdManager.setupExt(queryManager);
	return documentIdManager;
};
oFF.RsDocumentIdManager.prototype.m_queryManager = null;
oFF.RsDocumentIdManager.prototype.createCellDocumentId = function(syncType, listener, indexInfo)
{
	return oFF.RsCellDocumentIdCreateAction.createAndRunAction(this.m_queryManager, syncType, listener, indexInfo);
};
oFF.RsDocumentIdManager.prototype.deleteCellDocumentId = function(syncType, listener, indexInfo)
{
	return oFF.RsCellDocumentIdDeleteAction.createAndRunAction(this.m_queryManager, syncType, listener, indexInfo);
};
oFF.RsDocumentIdManager.prototype.getCellDocumentId = function(syncType, listener, indexInfo)
{
	return oFF.RsCellDocumentIdGetAction.createAndRunAction(this.m_queryManager, syncType, listener, indexInfo);
};
oFF.RsDocumentIdManager.prototype.releaseObject = function()
{
	this.m_queryManager = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDocumentIdManager.prototype.setupExt = function(queryManager)
{
	this.m_queryManager = queryManager;
};

oFF.RsNewLine = function() {};
oFF.RsNewLine.prototype = new oFF.XObject();
oFF.RsNewLine.prototype._ff_c = "RsNewLine";

oFF.RsNewLine.create = function(newLineCollection, newLineId, templateTuple)
{
	let newLine = new oFF.RsNewLine();
	newLine.setupExt(newLineCollection, newLineId, templateTuple);
	return newLine;
};
oFF.RsNewLine.prototype.m_dataEntryMap = null;
oFF.RsNewLine.prototype.m_dimensionMembers = null;
oFF.RsNewLine.prototype.m_newLineCollection = null;
oFF.RsNewLine.prototype.m_newLineId = 0;
oFF.RsNewLine.prototype.clear = function()
{
	this.m_dimensionMembers = oFF.XObjectExt.release(this.m_dimensionMembers);
	this.m_dataEntryMap = oFF.XObjectExt.release(this.m_dataEntryMap);
};
oFF.RsNewLine.prototype.getDataEntry = function(dataCell)
{
	let dataCells = this.getInputEnabledQueryDataCells();
	if (!dataCells.contains(dataCell))
	{
		return null;
	}
	if (!this.m_dataEntryMap.containsKey(dataCell.getName()))
	{
		let newLineEntry = oFF.RsNewLineEntry.create(this, dataCell);
		this.m_dataEntryMap.put(dataCell.getName(), newLineEntry);
	}
	return this.m_dataEntryMap.getByKey(dataCell.getName());
};
oFF.RsNewLine.prototype.getDimensionAt = function(index)
{
	if (index < 0 || index >= this.getDimensionCount())
	{
		return null;
	}
	return this.getNewLineCollection().getRowsAxis().getDimensions().get(index);
};
oFF.RsNewLine.prototype.getDimensionCount = function()
{
	return this.getNewLineCollection().getRowsAxis().getDimensions().size();
};
oFF.RsNewLine.prototype.getDimensionMembers = function()
{
	let result = oFF.XList.create();
	let keys = oFF.XList.createWithList(this.m_dimensionMembers.getKeysAsReadOnlyList());
	keys.sortByDirection(oFF.XSortDirection.ASCENDING);
	for (let i = 0; i < keys.size(); i++)
	{
		result.add(this.m_dimensionMembers.getByKey(keys.get(i)));
	}
	return result;
};
oFF.RsNewLine.prototype.getInputEnabledQueryDataCells = function()
{
	let collection = this.getNewLineCollection();
	let rowsAxis = collection.getRowsAxis();
	let queryModel = rowsAxis.getQueryModel();
	let qDataCells = queryModel.getQueryDataCells();
	let resultSetContainer = collection.getResultSetContainer();
	let resultSet = resultSetContainer.getClassicResultSet();
	let dataEntryMask = resultSet.getDataEntryMask();
	let inputEnabledQueryDataCellList = oFF.XListOfNameObject.create();
	for (let k = 0; k < qDataCells.size(); k++)
	{
		let dataCell = qDataCells.get(k);
		for (let n = 0; n < dataEntryMask.size(); n++)
		{
			let dataEntryName = dataEntryMask.get(n);
			if (oFF.XString.isEqual(dataEntryName, dataCell.getName()))
			{
				inputEnabledQueryDataCellList.add(dataCell);
				dataEntryMask.removeElement(dataEntryName);
				break;
			}
		}
	}
	return inputEnabledQueryDataCellList;
};
oFF.RsNewLine.prototype.getLineId = function()
{
	return this.m_newLineId;
};
oFF.RsNewLine.prototype.getNewLineCollection = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_newLineCollection);
};
oFF.RsNewLine.prototype.getNewLineEntries = function()
{
	return this.m_dataEntryMap.getValuesAsReadOnlyList();
};
oFF.RsNewLine.prototype.isValid = function()
{
	let iterator = this.m_dimensionMembers.getIterator();
	while (iterator.hasNext())
	{
		let dimensionMember = iterator.next();
		if (oFF.isNull(dimensionMember))
		{
			return false;
		}
		let keyFieldValue = dimensionMember.getKeyFieldValue();
		if (oFF.isNull(keyFieldValue))
		{
			return false;
		}
	}
	return true;
};
oFF.RsNewLine.prototype.releaseObject = function()
{
	this.m_dimensionMembers = oFF.XObjectExt.release(this.m_dimensionMembers);
	this.m_dataEntryMap = oFF.XObjectExt.release(this.m_dataEntryMap);
	this.m_newLineCollection = oFF.XObjectExt.release(this.m_newLineCollection);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsNewLine.prototype.setDimensionMember = function(dimensionMember)
{
	this.m_dimensionMembers.put(dimensionMember.getDimension().getName(), dimensionMember);
	return true;
};
oFF.RsNewLine.prototype.setupExt = function(newLineCollection, newLineId, templateTuple)
{
	this.m_newLineCollection = oFF.XWeakReferenceUtil.getWeakRef(newLineCollection);
	this.m_dataEntryMap = oFF.XHashMapByString.create();
	this.m_newLineId = newLineId;
	this.m_dimensionMembers = oFF.XHashMapByString.create();
	let dimensions = newLineCollection.getRowsAxis().getDimensions();
	for (let i = 0; i < dimensions.size(); i++)
	{
		let dimension = dimensions.get(i);
		if (oFF.notNull(templateTuple))
		{
			this.m_dimensionMembers.put(dimension.getName(), templateTuple.get(i).getDimensionMember());
		}
	}
};

oFF.RsNewLineCollection = function() {};
oFF.RsNewLineCollection.prototype = new oFF.XObject();
oFF.RsNewLineCollection.prototype._ff_c = "RsNewLineCollection";

oFF.RsNewLineCollection.m_newLineIdCounter = 4710;
oFF.RsNewLineCollection.create = function(queryManager, rowsAxis)
{
	let newLineCollection = new oFF.RsNewLineCollection();
	newLineCollection.setupExt(queryManager, rowsAxis);
	return newLineCollection;
};
oFF.RsNewLineCollection.prototype.m_newLines = null;
oFF.RsNewLineCollection.prototype.m_queryManager = null;
oFF.RsNewLineCollection.prototype.m_rowsAxis = null;
oFF.RsNewLineCollection.prototype.clear = function()
{
	if (oFF.isNull(this.m_newLines))
	{
		return;
	}
	for (let k = 0; k < this.m_newLines.size(); k++)
	{
		this.m_newLines.get(k).clear();
	}
	oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_newLines);
	this.m_newLines.clear();
};
oFF.RsNewLineCollection.prototype.createNewLine = function(templateTuple)
{
	oFF.RsNewLineCollection.m_newLineIdCounter++;
	if (oFF.isNull(this.m_newLines))
	{
		this.m_newLines = oFF.XList.create();
	}
	let newLine = oFF.RsNewLine.create(this, oFF.RsNewLineCollection.m_newLineIdCounter, templateTuple);
	this.m_newLines.add(newLine);
	return newLine;
};
oFF.RsNewLineCollection.prototype.getNewLines = function()
{
	return this.m_newLines;
};
oFF.RsNewLineCollection.prototype.getResultSetContainer = function()
{
	let queryManager = oFF.XWeakReferenceUtil.getHardRef(this.m_queryManager);
	return queryManager.getActiveResultSetContainer();
};
oFF.RsNewLineCollection.prototype.getRowsAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_rowsAxis);
};
oFF.RsNewLineCollection.prototype.getValidNewLines = function()
{
	if (!this.hasValidNewLines())
	{
		return null;
	}
	let validNewLines = oFF.XList.create();
	for (let k = 0; k < this.m_newLines.size(); k++)
	{
		let validNewLine = this.m_newLines.get(k);
		if (validNewLine.isValid())
		{
			validNewLines.add(validNewLine);
		}
	}
	return validNewLines;
};
oFF.RsNewLineCollection.prototype.hasNewLines = function()
{
	return oFF.notNull(this.m_newLines);
};
oFF.RsNewLineCollection.prototype.hasValidNewLines = function()
{
	if (oFF.isNull(this.m_newLines))
	{
		return false;
	}
	for (let k = 0; k < this.m_newLines.size(); k++)
	{
		if (this.m_newLines.get(k).isValid())
		{
			return true;
		}
	}
	return false;
};
oFF.RsNewLineCollection.prototype.isEmpty = function()
{
	if (oFF.isNull(this.m_newLines))
	{
		return true;
	}
	return this.m_newLines.isEmpty();
};
oFF.RsNewLineCollection.prototype.releaseObject = function()
{
	this.m_newLines = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_newLines);
	this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsNewLineCollection.prototype.remove = function(element)
{
	if (oFF.isNull(this.m_newLines))
	{
		return false;
	}
	let changed = false;
	if (this.m_newLines.contains(element))
	{
		element.clear();
		this.m_newLines.removeElement(element);
		changed = true;
	}
	return changed;
};
oFF.RsNewLineCollection.prototype.retainAll = function(collection)
{
	let changed = false;
	for (let k = 0; k < this.m_newLines.size(); k++)
	{
		let newLine = this.m_newLines.get(k);
		if (!collection.contains(newLine))
		{
			newLine.clear();
			this.m_newLines.removeElement(newLine);
			changed = true;
		}
	}
	return changed;
};
oFF.RsNewLineCollection.prototype.setupExt = function(queryManager, rowsAxis)
{
	this.m_rowsAxis = oFF.XWeakReferenceUtil.getWeakRef(rowsAxis);
	this.m_queryManager = oFF.XWeakReferenceUtil.getWeakRef(queryManager);
};
oFF.RsNewLineCollection.prototype.size = function()
{
	if (oFF.isNull(this.m_newLines))
	{
		return 0;
	}
	return this.m_newLines.size();
};

oFF.RsNewLineEntry = function() {};
oFF.RsNewLineEntry.prototype = new oFF.XObject();
oFF.RsNewLineEntry.prototype._ff_c = "RsNewLineEntry";

oFF.RsNewLineEntry.create = function(newLine, qDataCell)
{
	let newLineEntry = new oFF.RsNewLineEntry();
	newLineEntry.setupExt(newLine, qDataCell);
	return newLineEntry;
};
oFF.RsNewLineEntry.prototype.m_newLine = null;
oFF.RsNewLineEntry.prototype.m_queryDataCell = null;
oFF.RsNewLineEntry.prototype.m_xvalue = null;
oFF.RsNewLineEntry.prototype.getNewLine = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_newLine);
};
oFF.RsNewLineEntry.prototype.getNewXValue = function()
{
	return this.m_xvalue;
};
oFF.RsNewLineEntry.prototype.getQueryDataCell = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_queryDataCell);
};
oFF.RsNewLineEntry.prototype.isValueChanged = function()
{
	return oFF.notNull(this.m_xvalue);
};
oFF.RsNewLineEntry.prototype.releaseObject = function()
{
	this.m_queryDataCell = oFF.XObjectExt.release(this.m_queryDataCell);
	this.m_newLine = oFF.XObjectExt.release(this.m_newLine);
	this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsNewLineEntry.prototype.resetNewValue = function()
{
	this.m_xvalue = null;
};
oFF.RsNewLineEntry.prototype.setNewValue = function(value)
{
	this.m_xvalue = oFF.XDoubleValue.create(value);
};
oFF.RsNewLineEntry.prototype.setNewValueExternal = function(valueExternal)
{
	this.m_xvalue = oFF.XStringValue.create(valueExternal);
};
oFF.RsNewLineEntry.prototype.setupExt = function(newLine, qDataCell)
{
	this.m_queryDataCell = oFF.XWeakReferenceUtil.getWeakRef(qDataCell);
	this.m_newLine = oFF.XWeakReferenceUtil.getWeakRef(newLine);
};

oFF.LovProcessValueHelp = function() {};
oFF.LovProcessValueHelp.prototype = new oFF.XObject();
oFF.LovProcessValueHelp.prototype._ff_c = "LovProcessValueHelp";

oFF.LovProcessValueHelp.createFilterFromValueHelpResult = function(valueHelpResult, lovProcessConfig)
{
	let dimension = lovProcessConfig.getDimension();
	let keyField = dimension.getKeyField();
	let valueHelpFilter = oFF.QFactory.createFilterCartesianListWithField(dimension.getQueryModel(), keyField);
	if (dimension.isHierarchyActive() && dimension.getHierarchyName() !== null)
	{
		valueHelpFilter.setHierarchyName(dimension.getHierarchyName());
	}
	let rowsAxis = valueHelpResult.getCursorResultSet().getCursorRowsAxis();
	for (let i = 0; i < rowsAxis.getTuplesCount(); i++)
	{
		rowsAxis.nextTuple();
		for (let k = 0; k < rowsAxis.getTupleElementsCount(); k++)
		{
			rowsAxis.nextTupleElement();
			while (rowsAxis.hasNextFieldValue())
			{
				let fieldValue = rowsAxis.nextFieldValue();
				if (fieldValue.getField() === keyField)
				{
					let cartesianElement = valueHelpFilter.addNewCartesianElement();
					cartesianElement.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
					cartesianElement.getLow().setValue(fieldValue.getValue().clone());
					break;
				}
			}
		}
	}
	return valueHelpFilter;
};
oFF.LovProcessValueHelp.processValueHelpExecution = function(lovProcess, syncType)
{
	let lovValueHelp = new oFF.LovProcessValueHelp();
	lovValueHelp.m_lovProcess = lovProcess;
	lovValueHelp.execute(syncType, lovProcess.getQueryManager());
};
oFF.LovProcessValueHelp.serializeValueHelpForPersistedInA = function(lovProcess)
{
	let lovValueHelp = new oFF.LovProcessValueHelp();
	lovValueHelp.m_lovProcess = lovProcess;
	let dimension = lovProcess.getConfig().getDimension();
	let replacedFilters = lovValueHelp.preConfigure(lovProcess.getQueryManager());
	let serializeForValueHelp = dimension.serializeValueHelpForPersistedInA();
	lovValueHelp.resetFilter(replacedFilters, lovProcess.getQueryManager());
	return serializeForValueHelp;
};
oFF.LovProcessValueHelp.prototype.m_lovProcess = null;
oFF.LovProcessValueHelp.prototype.m_sameDimensionFiltersIgnored = false;
oFF.LovProcessValueHelp.prototype.configureFields = function(dimension)
{
	let fieldLayoutType = dimension.getFieldLayoutType();
	dimension.setSelectorFieldLayoutType(fieldLayoutType);
	if (fieldLayoutType === oFF.FieldLayoutType.FIELD_BASED)
	{
		let selectorFields = dimension.getSelectorFields();
		if (!selectorFields.isFixed())
		{
			selectorFields.clear();
			selectorFields.addAll(dimension.getResultSetFields());
		}
	}
	else
	{
		let selectorAttributes = dimension.getSelectorAttributes();
		selectorAttributes.clear();
		selectorAttributes.addAll(dimension.getResultSetAttributes());
		for (let i = 0; i < selectorAttributes.size(); i++)
		{
			let attribute = selectorAttributes.get(i);
			let attributeSelectorFields = attribute.getSelectorFields();
			attributeSelectorFields.clear();
			attributeSelectorFields.addAll(attribute.getResultSetFields());
		}
	}
};
oFF.LovProcessValueHelp.prototype.configureFilter = function(dimension, queryManager)
{
	dimension.setSelectorFilterUsage(oFF.QueryFilterUsage.QUERY_FILTER_EFFECTIVE);
	if (this.isBw(queryManager))
	{
		let filter = queryManager.getQueryModel().getFilter();
		let linkedFilters = filter.getLinkedFilters();
		if (oFF.XCollectionUtils.hasElements(linkedFilters))
		{
			let isHierarchyActive = dimension.isSelectorHierarchyActive();
			let isLovOnStructure = dimension.isStructure();
			let matchFilter = this.m_lovProcess.getConfig().getMatchFilter(filter.getEffectiveFilter(), dimension);
			let replacedFilters = oFF.XHashMapByString.create();
			let linkedFilterNames = linkedFilters.getKeysAsReadOnlyList();
			filter.stopEventing();
			for (let i = 0; i < linkedFilterNames.size(); i++)
			{
				let linkedFilterName = linkedFilterNames.get(i);
				let linkedFilter = linkedFilters.getByKey(linkedFilterName);
				if (isHierarchyActive && filter.getInternalLinkedFilterIds().contains(linkedFilterName) && linkedFilter.getDimensionsUsedInFilter().contains(dimension.getName()) || isLovOnStructure && !linkedFilter.getDimensionsUsedInFilter().contains(dimension.getName()))
				{
					replacedFilters.put(linkedFilterName, linkedFilter);
					filter.linkFilter(linkedFilterName, null);
				}
				else if (oFF.notNull(matchFilter))
				{
					let dimensionFilter = linkedFilter.getCartesianList(dimension);
					if (oFF.notNull(dimensionFilter) && !dimensionFilter.contains(matchFilter))
					{
						replacedFilters.put(linkedFilterName, linkedFilter);
						filter.linkFilter(linkedFilterName, this.copyLinkedFilterWithoutDimFilter(linkedFilter, dimensionFilter));
						this.m_sameDimensionFiltersIgnored = true;
					}
				}
			}
			filter.resumeEventing();
			return replacedFilters;
		}
	}
	return null;
};
oFF.LovProcessValueHelp.prototype.configureHierarchy = function(dimension)
{
	let processConfig = this.m_lovProcess.getConfig();
	dimension.setSelectorHierarchyActive(dimension.isHierarchyActive());
	if (processConfig.isAutomaticValueHelpDrillLevelConfigurationEnabled())
	{
		dimension.setSelectorInitialDrillLevel(dimension.getInitialDrillLevel());
	}
	dimension.setSelectorHierarchyNodeByName(null);
	dimension.setSelectorUseQueryDrillOperations(processConfig.supportsSeveralDrillOperationsInValueHelp() || !processConfig.hasSeveralDrillOperations());
	dimension.setSelectorLowerLevelNodeAlignment(oFF.Alignment.isExplicit(dimension.getLowerLevelNodeAlignment()) ? dimension.getLowerLevelNodeAlignment() : null);
};
oFF.LovProcessValueHelp.prototype.configurePaging = function(queryManager, dimension)
{
	let start = queryManager.getOffsetRows();
	let end = queryManager.getMaxRows();
	if (end > 0)
	{
		end = end + start;
	}
	if (this.isTupleCountTotalNotSupported(queryManager))
	{
		end++;
	}
	dimension.setSelectorPaging(start, end);
};
oFF.LovProcessValueHelp.prototype.configureSorting = function(dimension)
{
	if (dimension.hasSorting())
	{
		dimension.setSelectorOrder(dimension.getResultSetSorting().getDirection());
		dimension.setSelectorSortType(dimension.getResultSetSorting().getSortingType());
	}
	else
	{
		dimension.setSelectorOrder(oFF.XSortDirection.DEFAULT_VALUE);
		dimension.setSelectorSortType(null);
	}
};
oFF.LovProcessValueHelp.prototype.copyLinkedFilterWithoutDimFilter = function(linkedFilter, dimensionFilter)
{
	let modifiedFilter = oFF.QFactory.createFilterExpression(linkedFilter.getContext(), linkedFilter.getParent());
	modifiedFilter.copyFrom(linkedFilter, null);
	modifiedFilter.removeFilterById(dimensionFilter.getUniqueId());
	return modifiedFilter;
};
oFF.LovProcessValueHelp.prototype.execute = function(syncType, queryManager)
{
	let dimension = this.m_lovProcess.getConfig().getDimension();
	let replacedFilters = this.preConfigure(queryManager);
	dimension.processValueHelpResultSet(syncType, this, null);
	this.resetFilter(replacedFilters, queryManager);
};
oFF.LovProcessValueHelp.prototype.isBw = function(queryManager)
{
	return queryManager.getSystemType().isTypeOf(oFF.SystemType.BW);
};
oFF.LovProcessValueHelp.prototype.isTupleCountTotalNotSupported = function(queryManager)
{
	return oFF.notNull(queryManager) && this.isBw(queryManager) && queryManager.getMaxRows() > 0 && !this.m_lovProcess.getConfig().getDimension().isStructure();
};
oFF.LovProcessValueHelp.prototype.onValuehelpExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (oFF.notNull(resultSetContainer) && this.m_sameDimensionFiltersIgnored)
	{
		resultSetContainer.addWarning(oFF.ErrorCodes.SAME_DIMENSION_FILTERS_IGNORED, "Same dimension filters have been ignored");
	}
	this.revertPagingSettings(this.m_lovProcess.getQueryManager(), resultSetContainer);
	this.m_lovProcess.onValuehelpExecuted(extResult, resultSetContainer, customIdentifier);
	oFF.XObjectExt.release(this);
};
oFF.LovProcessValueHelp.prototype.preConfigure = function(queryManager)
{
	let dimension = this.m_lovProcess.getConfig().getDimension();
	if (this.m_lovProcess.getConfig().isAutomaticValueHelpReadModeConfigurationEnabled())
	{
		dimension.setReadModeGraceful(oFF.QContextType.SELECTOR, dimension.getReadMode(oFF.QContextType.RESULT_SET));
	}
	this.configurePaging(queryManager, dimension);
	this.configureSorting(dimension);
	this.configureFields(dimension);
	this.configureHierarchy(dimension);
	return this.configureFilter(dimension, queryManager);
};
oFF.LovProcessValueHelp.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_lovProcess = null;
};
oFF.LovProcessValueHelp.prototype.resetFilter = function(replacedFilters, queryManager)
{
	if (oFF.XCollectionUtils.hasElements(replacedFilters))
	{
		let filter = queryManager.getQueryModel().getFilter();
		let replacedFilterNames = replacedFilters.getKeysAsReadOnlyList();
		filter.stopEventing();
		for (let i = 0; i < replacedFilterNames.size(); i++)
		{
			let replacedFilterName = replacedFilterNames.get(i);
			oFF.XObjectExt.release(filter.getLinkedFilter(replacedFilterName));
			filter.linkFilter(replacedFilterName, replacedFilters.getByKey(replacedFilterName));
		}
		filter.resumeEventing();
		oFF.XObjectExt.release(replacedFilterNames);
	}
};
oFF.LovProcessValueHelp.prototype.revertPagingSettings = function(queryManager, resultSetContainer)
{
	if (oFF.notNull(resultSetContainer) && this.isTupleCountTotalNotSupported(queryManager))
	{
		let maxRows = resultSetContainer.getMaxRows() - 1;
		resultSetContainer.setMaxRows(maxRows);
		let cursorRowsAxis = resultSetContainer.getCursorResultSet().getCursorRowsAxis();
		let newTuplesCount = cursorRowsAxis.getTuplesCount();
		let moreTuplesAvailable = newTuplesCount > maxRows;
		if (moreTuplesAvailable)
		{
			newTuplesCount--;
		}
		let newTuplesCountTotal = cursorRowsAxis.getTuplesCountTotal();
		if (newTuplesCountTotal <= 0 || !moreTuplesAvailable && newTuplesCountTotal > resultSetContainer.getOffsetRows() + newTuplesCount)
		{
			newTuplesCountTotal = resultSetContainer.getOffsetRows() + cursorRowsAxis.getTuplesCount();
		}
		cursorRowsAxis.setTuplesCount(newTuplesCount, newTuplesCountTotal);
	}
};

oFF.RsMinimumDrillStateValidationContext = function() {};
oFF.RsMinimumDrillStateValidationContext.prototype = new oFF.XObject();
oFF.RsMinimumDrillStateValidationContext.prototype._ff_c = "RsMinimumDrillStateValidationContext";

oFF.RsMinimumDrillStateValidationContext.create = function(axisType, tupleElementIndex)
{
	let result = new oFF.RsMinimumDrillStateValidationContext();
	result.setupValidationContext(axisType, tupleElementIndex);
	return result;
};
oFF.RsMinimumDrillStateValidationContext.prototype.m_axisType = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_dimensionMemberNamesInOrder = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_nestedMinimumDrillStateMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_outOfContextNestedMinimumDrillStateMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_outOfContextRequiredDimensionNamesMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_outOfContextUnsatisfiedRequiredDimensionNamesMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_requiredDimensionNamesMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_rsDimensionInOrder = null;
oFF.RsMinimumDrillStateValidationContext.prototype.m_tupleElementIndex = 0;
oFF.RsMinimumDrillStateValidationContext.prototype.m_unsatisfiedRequiredDimensionNamesMap = null;
oFF.RsMinimumDrillStateValidationContext.prototype.addDimensionMemberNameInResultSetTupleOrder = function(memberName)
{
	this.m_dimensionMemberNamesInOrder.add(memberName);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addNestedMinimumDrillState = function(memberName, nestedMinimumDrillState)
{
	if (oFF.isNull(nestedMinimumDrillState) || nestedMinimumDrillState.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_nestedMinimumDrillStateMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_nestedMinimumDrillStateMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(nestedMinimumDrillState);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addOutOfContextNestedMinimumDrillState = function(memberName, nestedMinimumDrillState)
{
	if (oFF.isNull(nestedMinimumDrillState) || nestedMinimumDrillState.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_outOfContextNestedMinimumDrillStateMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_outOfContextNestedMinimumDrillStateMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(nestedMinimumDrillState);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addOutOfContextRequiredDimensionNames = function(memberName, names)
{
	if (oFF.isNull(names) || names.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_outOfContextRequiredDimensionNamesMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_outOfContextRequiredDimensionNamesMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addOutOfContextUnsatisfiedRequiredDimensionNames = function(memberName, names)
{
	if (oFF.isNull(names) || names.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addRequiredDimensionNames = function(memberName, names)
{
	if (oFF.isNull(names) || names.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_requiredDimensionNamesMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_requiredDimensionNamesMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addRsDimensionInResultSetTupleOrder = function(rsDimension)
{
	this.m_rsDimensionInOrder.add(rsDimension);
};
oFF.RsMinimumDrillStateValidationContext.prototype.addUnsatisfiedRequiredDimensionNames = function(memberName, names)
{
	if (oFF.isNull(names) || names.isEmpty())
	{
		return;
	}
	let requiredDimensionNames = this.m_unsatisfiedRequiredDimensionNamesMap.getByKey(memberName);
	if (oFF.isNull(requiredDimensionNames))
	{
		requiredDimensionNames = oFF.XHashSetOfString.create();
		this.m_unsatisfiedRequiredDimensionNamesMap.put(memberName, requiredDimensionNames);
	}
	requiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationContext.prototype.getAxisType = function()
{
	return this.m_axisType;
};
oFF.RsMinimumDrillStateValidationContext.prototype.getDimensionMemberNameAtTupleIndex = function(index)
{
	return this.m_dimensionMemberNamesInOrder.get(index);
};
oFF.RsMinimumDrillStateValidationContext.prototype.getDimensionNamesWithLeafNodeValidation = function()
{
	let dimensionNames = oFF.XHashSetOfString.create();
	oFF.XCollectionUtils.forEach(this.m_nestedMinimumDrillStateMap, (minDrillStateDims) => {
		dimensionNames.addAll(minDrillStateDims);
	});
	oFF.XCollectionUtils.forEach(this.m_outOfContextNestedMinimumDrillStateMap, (outOfContextMinDrillDims) => {
		dimensionNames.addAll(outOfContextMinDrillDims);
	});
	return dimensionNames.getValuesAsReadOnlyList();
};
oFF.RsMinimumDrillStateValidationContext.prototype.getNestedMinimumDrillState = function(memberName)
{
	return this.m_nestedMinimumDrillStateMap.getByKey(memberName);
};
oFF.RsMinimumDrillStateValidationContext.prototype.getOutOfContextNestedMinimumDrillStateMap = function()
{
	return this.m_outOfContextNestedMinimumDrillStateMap;
};
oFF.RsMinimumDrillStateValidationContext.prototype.getOutOfContextRequiredDimensionNamesMap = function()
{
	return this.m_outOfContextRequiredDimensionNamesMap;
};
oFF.RsMinimumDrillStateValidationContext.prototype.getOutOfContextUnsatisfiedRequiredDimensionNamesMap = function()
{
	return this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap;
};
oFF.RsMinimumDrillStateValidationContext.prototype.getRequiredDimensionNames = function(memberName)
{
	return this.m_requiredDimensionNamesMap.getByKey(memberName);
};
oFF.RsMinimumDrillStateValidationContext.prototype.getRsDimensionAtTupleIndex = function(index)
{
	return this.m_rsDimensionInOrder.get(index);
};
oFF.RsMinimumDrillStateValidationContext.prototype.getTupleElementIndex = function()
{
	return this.m_tupleElementIndex;
};
oFF.RsMinimumDrillStateValidationContext.prototype.getUnsatisfiedRequiredDimensionNames = function(memberName)
{
	return this.m_unsatisfiedRequiredDimensionNamesMap.getByKey(memberName);
};
oFF.RsMinimumDrillStateValidationContext.prototype.isEmpty = function()
{
	return this.m_requiredDimensionNamesMap.isEmpty() && this.m_unsatisfiedRequiredDimensionNamesMap.isEmpty() && this.m_outOfContextRequiredDimensionNamesMap.isEmpty() && this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap.isEmpty() && this.m_nestedMinimumDrillStateMap.isEmpty() && this.m_outOfContextNestedMinimumDrillStateMap.isEmpty();
};
oFF.RsMinimumDrillStateValidationContext.prototype.releaseObject = function()
{
	this.m_requiredDimensionNamesMap = oFF.XObjectExt.release(this.m_requiredDimensionNamesMap);
	this.m_unsatisfiedRequiredDimensionNamesMap = oFF.XObjectExt.release(this.m_unsatisfiedRequiredDimensionNamesMap);
	this.m_nestedMinimumDrillStateMap = oFF.XObjectExt.release(this.m_nestedMinimumDrillStateMap);
	this.m_outOfContextRequiredDimensionNamesMap = oFF.XObjectExt.release(this.m_outOfContextRequiredDimensionNamesMap);
	this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap = oFF.XObjectExt.release(this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap);
	this.m_outOfContextNestedMinimumDrillStateMap = oFF.XObjectExt.release(this.m_outOfContextNestedMinimumDrillStateMap);
	this.m_dimensionMemberNamesInOrder = oFF.XObjectExt.release(this.m_dimensionMemberNamesInOrder);
	this.m_rsDimensionInOrder = oFF.XObjectExt.release(this.m_rsDimensionInOrder);
	this.m_axisType = null;
	this.m_tupleElementIndex = -1;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsMinimumDrillStateValidationContext.prototype.setupValidationContext = function(axisType, tupleElementIndex)
{
	this.m_requiredDimensionNamesMap = oFF.XHashMapByString.create();
	this.m_nestedMinimumDrillStateMap = oFF.XHashMapByString.create();
	this.m_unsatisfiedRequiredDimensionNamesMap = oFF.XHashMapByString.create();
	this.m_outOfContextRequiredDimensionNamesMap = oFF.XHashMapByString.create();
	this.m_outOfContextUnsatisfiedRequiredDimensionNamesMap = oFF.XHashMapByString.create();
	this.m_outOfContextNestedMinimumDrillStateMap = oFF.XHashMapByString.create();
	this.m_dimensionMemberNamesInOrder = oFF.XList.create();
	this.m_rsDimensionInOrder = oFF.XList.create();
	this.m_axisType = axisType;
	this.m_tupleElementIndex = tupleElementIndex;
};

oFF.RsMinimumDrillStateValidationResult = function() {};
oFF.RsMinimumDrillStateValidationResult.prototype = new oFF.XObject();
oFF.RsMinimumDrillStateValidationResult.prototype._ff_c = "RsMinimumDrillStateValidationResult";

oFF.RsMinimumDrillStateValidationResult.create = function()
{
	let result = new oFF.RsMinimumDrillStateValidationResult();
	result.m_isMinimumDrillValid = true;
	result.m_validationContextMap = oFF.XHashMapByString.create();
	return result;
};
oFF.RsMinimumDrillStateValidationResult.prototype.m_isMinimumDrillValid = false;
oFF.RsMinimumDrillStateValidationResult.prototype.m_validationContextMap = null;
oFF.RsMinimumDrillStateValidationResult.prototype.addMissingRequiredDimensionNames = function(dimensionName, memberName, names)
{
	let resultValidationContext = this.getValidationContextMapBaseByDimensionAndMemberName(dimensionName, memberName);
	resultValidationContext.addMissingRequiredDimensionNames(names);
	this.m_isMinimumDrillValid = false;
};
oFF.RsMinimumDrillStateValidationResult.prototype.addNonLeafRequiredDimensionName = function(dimensionName, memberName, name)
{
	let resultValidationContext = this.getValidationContextMapBaseByDimensionAndMemberName(dimensionName, memberName);
	resultValidationContext.addNonLeafRequiredDimensionName(name);
	this.m_isMinimumDrillValid = false;
};
oFF.RsMinimumDrillStateValidationResult.prototype.addRequiredDimensionNames = function(dimensionName, memberName, names)
{
	let resultValidationContext = this.getValidationContextMapBaseByDimensionAndMemberName(dimensionName, memberName);
	resultValidationContext.addRequiredDimensionNames(names);
};
oFF.RsMinimumDrillStateValidationResult.prototype.getValidationContext = function()
{
	let result = oFF.XHashMapByString.create();
	let dimNameIterator = this.m_validationContextMap.getKeysAsIterator();
	while (dimNameIterator.hasNext())
	{
		let dimensionName = dimNameIterator.next();
		let contextByMemberName = oFF.XHashMapByString.create();
		let validationResultContextMap = this.m_validationContextMap.getByKey(dimensionName);
		let memberNameIterator = validationResultContextMap.getKeysAsIterator();
		while (memberNameIterator.hasNext())
		{
			let memberName = memberNameIterator.next();
			contextByMemberName.put(memberName, validationResultContextMap.getByKey(memberName));
		}
		result.put(dimensionName, contextByMemberName);
	}
	return result;
};
oFF.RsMinimumDrillStateValidationResult.prototype.getValidationContextMapBaseByDimensionAndMemberName = function(dimensionName, memberName)
{
	let validationResultContextMap = this.m_validationContextMap.getByKey(dimensionName);
	if (oFF.isNull(validationResultContextMap))
	{
		validationResultContextMap = oFF.XHashMapByString.create();
		this.m_validationContextMap.put(dimensionName, validationResultContextMap);
	}
	let validationResultContext = validationResultContextMap.getByKey(memberName);
	if (oFF.isNull(validationResultContext))
	{
		validationResultContext = oFF.RsMinimumDrillStateValidationResultContext.create();
		validationResultContextMap.put(memberName, validationResultContext);
	}
	return validationResultContext;
};
oFF.RsMinimumDrillStateValidationResult.prototype.isMinimumDrillValid = function()
{
	return this.m_isMinimumDrillValid;
};
oFF.RsMinimumDrillStateValidationResult.prototype.releaseObject = function()
{
	this.m_validationContextMap = oFF.XObjectExt.release(this.m_validationContextMap);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.RsMinimumDrillStateValidationResultContext = function() {};
oFF.RsMinimumDrillStateValidationResultContext.prototype = new oFF.XObject();
oFF.RsMinimumDrillStateValidationResultContext.prototype._ff_c = "RsMinimumDrillStateValidationResultContext";

oFF.RsMinimumDrillStateValidationResultContext.create = function()
{
	let result = new oFF.RsMinimumDrillStateValidationResultContext();
	result.setupValidationResultContext();
	return result;
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.m_missingRequiredDimensionNames = null;
oFF.RsMinimumDrillStateValidationResultContext.prototype.m_nonLeafRequiredDimensionNames = null;
oFF.RsMinimumDrillStateValidationResultContext.prototype.m_requiredDimensionNames = null;
oFF.RsMinimumDrillStateValidationResultContext.prototype.addMissingRequiredDimensionNames = function(names)
{
	this.m_missingRequiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.addNonLeafRequiredDimensionName = function(name)
{
	this.m_nonLeafRequiredDimensionNames.add(name);
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.addRequiredDimensionNames = function(names)
{
	this.m_requiredDimensionNames.addAll(names);
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.getMissingRequiredDimensionNames = function()
{
	return this.m_missingRequiredDimensionNames;
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.getNonLeafRequiredDimensionNames = function()
{
	return this.m_nonLeafRequiredDimensionNames;
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.getRequiredDimensionNames = function()
{
	return this.m_requiredDimensionNames;
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.releaseObject = function()
{
	this.m_requiredDimensionNames = oFF.XObjectExt.release(this.m_requiredDimensionNames);
	this.m_missingRequiredDimensionNames = oFF.XObjectExt.release(this.m_missingRequiredDimensionNames);
	this.m_nonLeafRequiredDimensionNames = oFF.XObjectExt.release(this.m_nonLeafRequiredDimensionNames);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsMinimumDrillStateValidationResultContext.prototype.setupValidationResultContext = function()
{
	this.m_requiredDimensionNames = oFF.XHashSetOfString.create();
	this.m_missingRequiredDimensionNames = oFF.XHashSetOfString.create();
	this.m_nonLeafRequiredDimensionNames = oFF.XHashSetOfString.create();
};

oFF.RsCursorCurrencyUnit = function() {};
oFF.RsCursorCurrencyUnit.prototype = new oFF.XObject();
oFF.RsCursorCurrencyUnit.prototype._ff_c = "RsCursorCurrencyUnit";

oFF.RsCursorCurrencyUnit.createCopy = function(origin)
{
	let newObject = new oFF.RsCursorCurrencyUnit();
	if (oFF.notNull(origin))
	{
		if (origin.hasFormatted())
		{
			newObject.setFormatted(origin.getFormatted());
		}
		if (origin.hasPrefix())
		{
			newObject.setPrefix(origin.getPrefix());
		}
		if (origin.hasSuffix())
		{
			newObject.setSuffix(origin.getSuffix());
		}
		newObject.m_isEmpty = origin.isEmpty();
		newObject.m_hasCurrency = origin.hasCurrency();
		newObject.m_hasUnit = origin.hasUnit();
		newObject.m_isMixed = origin.isMixed();
	}
	return newObject;
};
oFF.RsCursorCurrencyUnit.createCurrencyUnit = function()
{
	return new oFF.RsCursorCurrencyUnit();
};
oFF.RsCursorCurrencyUnit.prototype.m_formattedCurrencyUnit = null;
oFF.RsCursorCurrencyUnit.prototype.m_hasCurrency = false;
oFF.RsCursorCurrencyUnit.prototype.m_hasUnit = false;
oFF.RsCursorCurrencyUnit.prototype.m_isEmpty = false;
oFF.RsCursorCurrencyUnit.prototype.m_isMixed = false;
oFF.RsCursorCurrencyUnit.prototype.m_prefix = null;
oFF.RsCursorCurrencyUnit.prototype.m_suffix = null;
oFF.RsCursorCurrencyUnit.prototype.getFormatted = function()
{
	return this.m_formattedCurrencyUnit;
};
oFF.RsCursorCurrencyUnit.prototype.getPrefix = function()
{
	return this.m_prefix;
};
oFF.RsCursorCurrencyUnit.prototype.getSuffix = function()
{
	return this.m_suffix;
};
oFF.RsCursorCurrencyUnit.prototype.hasCurrency = function()
{
	return this.m_hasCurrency;
};
oFF.RsCursorCurrencyUnit.prototype.hasFormatted = function()
{
	return oFF.notNull(this.m_formattedCurrencyUnit);
};
oFF.RsCursorCurrencyUnit.prototype.hasPrefix = function()
{
	return oFF.notNull(this.m_prefix);
};
oFF.RsCursorCurrencyUnit.prototype.hasSuffix = function()
{
	return oFF.notNull(this.m_suffix);
};
oFF.RsCursorCurrencyUnit.prototype.hasUnit = function()
{
	return this.m_hasUnit;
};
oFF.RsCursorCurrencyUnit.prototype.isEmpty = function()
{
	return this.m_isEmpty;
};
oFF.RsCursorCurrencyUnit.prototype.isInitial = function()
{
	return !this.m_hasCurrency && !this.m_hasUnit && !this.m_isMixed && !this.m_isEmpty && oFF.XStringUtils.isNullOrEmpty(this.m_formattedCurrencyUnit) && oFF.XStringUtils.isNullOrEmpty(this.m_prefix = null) && oFF.XStringUtils.isNullOrEmpty(this.m_suffix);
};
oFF.RsCursorCurrencyUnit.prototype.isMixed = function()
{
	return this.m_isMixed;
};
oFF.RsCursorCurrencyUnit.prototype.releaseObject = function()
{
	this.m_formattedCurrencyUnit = null;
	this.m_prefix = null;
	this.m_suffix = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsCursorCurrencyUnit.prototype.reset = function()
{
	this.m_hasCurrency = false;
	this.m_hasUnit = false;
	this.m_isMixed = false;
	this.m_isEmpty = false;
	this.m_formattedCurrencyUnit = null;
	this.m_prefix = null;
	this.m_suffix = null;
};
oFF.RsCursorCurrencyUnit.prototype.setFormatted = function(formattedCurrencyUnit)
{
	this.m_formattedCurrencyUnit = formattedCurrencyUnit;
};
oFF.RsCursorCurrencyUnit.prototype.setHasCurrency = function(hasCurrency)
{
	this.m_hasCurrency = hasCurrency;
};
oFF.RsCursorCurrencyUnit.prototype.setHasUnit = function(hasUnit)
{
	this.m_hasUnit = hasUnit;
};
oFF.RsCursorCurrencyUnit.prototype.setIsEmpty = function(isEmpty)
{
	this.m_isEmpty = isEmpty;
};
oFF.RsCursorCurrencyUnit.prototype.setIsMixed = function(isMixed)
{
	this.m_isMixed = isMixed;
};
oFF.RsCursorCurrencyUnit.prototype.setPrefix = function(prefix)
{
	this.m_prefix = prefix;
};
oFF.RsCursorCurrencyUnit.prototype.setSuffix = function(suffix)
{
	this.m_suffix = suffix;
};

oFF.RsDataEntryCollection = function() {};
oFF.RsDataEntryCollection.prototype = new oFF.XObject();
oFF.RsDataEntryCollection.prototype._ff_c = "RsDataEntryCollection";

oFF.RsDataEntryCollection.create = function(resultSetContainer)
{
	let entryCollection = new oFF.RsDataEntryCollection();
	entryCollection.m_rsContainer = oFF.XWeakReference.create(resultSetContainer);
	entryCollection.m_entries = oFF.XHashMapByString.create();
	entryCollection.m_cellEntries = oFF.XHashMapByString.create();
	entryCollection.m_entriesViaMember = oFF.XList.create();
	return entryCollection;
};
oFF.RsDataEntryCollection.prototype.m_cellEntries = null;
oFF.RsDataEntryCollection.prototype.m_dataEntryDescription = null;
oFF.RsDataEntryCollection.prototype.m_entries = null;
oFF.RsDataEntryCollection.prototype.m_entriesViaMember = null;
oFF.RsDataEntryCollection.prototype.m_rsContainer = null;
oFF.RsDataEntryCollection.prototype.clear = function()
{
	this.m_entries.clear();
	this.m_cellEntries.clear();
	this.m_entriesViaMember.clear();
};
oFF.RsDataEntryCollection.prototype.getAllEntries = function()
{
	let all = oFF.XList.create();
	oFF.XCollectionUtils.addAll(all, this.m_entries);
	oFF.XCollectionUtils.addAll(all, this.m_entriesViaMember);
	return all;
};
oFF.RsDataEntryCollection.prototype.getChangedDataEntries = function()
{
	let result = oFF.XList.create();
	let entries = this.getDataEntriesByProcessingOrder();
	if (entries.isEmpty())
	{
		return result;
	}
	let orders = oFF.XCollectionUtils.sortListAsIntegers(entries.getKeysAsReadOnlyList(), oFF.XSortDirection.ASCENDING);
	for (let i = 0; i < orders.size(); i++)
	{
		let entriesByOrder = entries.getByKey(orders.get(i));
		result.addAll(entriesByOrder);
	}
	return result;
};
oFF.RsDataEntryCollection.prototype.getDataCellEntry = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	let cellEntry = this.m_cellEntries.getByKey(name);
	if (oFF.isNull(cellEntry))
	{
		cellEntry = oFF.RsDataCellEntry.create(name);
		this.m_cellEntries.put(name, cellEntry);
	}
	return cellEntry;
};
oFF.RsDataEntryCollection.prototype.getDataCellEntryDescription = function()
{
	return this.m_dataEntryDescription;
};
oFF.RsDataEntryCollection.prototype.getDataCellEntryIfExisting = function(name)
{
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		return null;
	}
	return this.m_cellEntries.getByKey(name);
};
oFF.RsDataEntryCollection.prototype.getDataEntriesByProcessingOrder = function()
{
	let result = oFF.XHashMapByString.create();
	let keys = oFF.XCollectionUtils.sortListAsIntegers(this.m_entries.getKeysAsReadOnlyList(), oFF.XSortDirection.ASCENDING);
	for (let i = 0; i < keys.size(); i++)
	{
		let entry = this.m_entries.getByKey(keys.get(i));
		if (!entry.isNewValueForced() && !entry.isValueChanged() && !entry.isValueLockChanged() && !entry.isValueLocked() && entry.getPlanningCommand() === null)
		{
			continue;
		}
		let processingOrder = oFF.XInteger.convertToString(entry.getProcessingOrder());
		let entriesByOrder = result.getByKey(processingOrder);
		if (oFF.isNull(entriesByOrder))
		{
			entriesByOrder = oFF.XList.create();
			result.put(processingOrder, entriesByOrder);
		}
		entriesByOrder.add(entry);
	}
	return result;
};
oFF.RsDataEntryCollection.prototype.getDataEntriesViaMember = function()
{
	return this.m_entriesViaMember;
};
oFF.RsDataEntryCollection.prototype.getDataEntry = function(columnIndex, rowIndex, dataCell)
{
	return this.getDataEntryInternal(columnIndex, rowIndex, dataCell, true);
};
oFF.RsDataEntryCollection.prototype.getDataEntryIfExisting = function(columnIndex, rowIndex, dataCell)
{
	return this.getDataEntryInternal(columnIndex, rowIndex, dataCell, false);
};
oFF.RsDataEntryCollection.prototype.getDataEntryInternal = function(columnIndex, rowIndex, dataCell, createNew)
{
	if (oFF.isNull(dataCell))
	{
		return null;
	}
	let container = oFF.XWeakReferenceUtil.getHardRef(this.m_rsContainer);
	let resultSet = container.getCursorResultSet();
	let index = oFF.XInteger.convertToString(columnIndex * resultSet.getDataRows() + rowIndex);
	let entry = this.m_entries.getByKey(index);
	if (oFF.isNull(entry) && createNew)
	{
		let fallbackToZero = !container.getResultSetManager().getSystemType().isTypeOf(oFF.SystemType.ABAP);
		entry = oFF.RsDataEntry.create(this, columnIndex, rowIndex, dataCell, fallbackToZero);
		this.m_entries.put(index, entry);
	}
	return entry;
};
oFF.RsDataEntryCollection.prototype.getNewDataEntryViaMember = function()
{
	let entry = oFF.RsDataEntryViaMember.create(this);
	this.m_entriesViaMember.add(entry);
	return entry;
};
oFF.RsDataEntryCollection.prototype.hasChangedDataEntries = function()
{
	let allEntries = this.getAllEntries();
	for (let i = 0; i < allEntries.size(); i++)
	{
		let entry = allEntries.get(i);
		if (entry.isValueChanged() || entry.isNewValueForced() || entry.isValueLockChanged() || entry.isValueLocked() || entry.getPlanningCommand() !== null)
		{
			return true;
		}
	}
	return false;
};
oFF.RsDataEntryCollection.prototype.hasChangedValueLocks = function()
{
	let allEntries = this.getAllEntries();
	for (let i = 0; i < allEntries.size(); i++)
	{
		let entry = allEntries.get(i);
		if (entry.isValueLockChanged() || entry.isValueLocked())
		{
			return true;
		}
	}
	return false;
};
oFF.RsDataEntryCollection.prototype.hasChangedValues = function()
{
	let allEntries = this.getAllEntries();
	for (let i = 0; i < allEntries.size(); i++)
	{
		let entry = allEntries.get(i);
		if (entry.isValueChanged() || entry.isNewValueForced())
		{
			return true;
		}
	}
	return false;
};
oFF.RsDataEntryCollection.prototype.hasPlanningCommands = function()
{
	let allEntries = this.getAllEntries();
	for (let i = 0; i < allEntries.size(); i++)
	{
		if (allEntries.get(i).getPlanningCommand() !== null)
		{
			return true;
		}
	}
	return false;
};
oFF.RsDataEntryCollection.prototype.releaseObject = function()
{
	this.m_rsContainer = oFF.XObjectExt.release(this.m_rsContainer);
	this.m_entries = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_entries);
	this.m_cellEntries = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_cellEntries);
	this.m_entriesViaMember = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_entriesViaMember);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsDataEntryCollection.prototype.setDataCellEntryDescription = function(description)
{
	this.m_dataEntryDescription = description;
};

oFF.AbstractRsDataEntry = function() {};
oFF.AbstractRsDataEntry.prototype = new oFF.XObject();
oFF.AbstractRsDataEntry.prototype._ff_c = "AbstractRsDataEntry";

oFF.AbstractRsDataEntry.prototype.m_collection = null;
oFF.AbstractRsDataEntry.prototype.m_dataEntryGroup = null;
oFF.AbstractRsDataEntry.prototype.m_forceNewValue = false;
oFF.AbstractRsDataEntry.prototype.m_lock = false;
oFF.AbstractRsDataEntry.prototype.m_lockSet = false;
oFF.AbstractRsDataEntry.prototype.m_originXValue = null;
oFF.AbstractRsDataEntry.prototype.m_originalLock = false;
oFF.AbstractRsDataEntry.prototype.m_planningCommands = null;
oFF.AbstractRsDataEntry.prototype.m_priority = 0;
oFF.AbstractRsDataEntry.prototype.m_processingOrder = 0;
oFF.AbstractRsDataEntry.prototype.m_processingType = null;
oFF.AbstractRsDataEntry.prototype.m_xvalue = null;
oFF.AbstractRsDataEntry.prototype.addPlanningCommand = function(planningCommand)
{
	if (oFF.notNull(planningCommand))
	{
		this.getPlanningCommands().add(planningCommand);
	}
};
oFF.AbstractRsDataEntry.prototype.assertType = function(valueType)
{
	if (!this.m_xvalue.getValueType().isTypeOf(valueType))
	{
		oFF.noSupport();
	}
};
oFF.AbstractRsDataEntry.prototype.clearPlanningCommands = function()
{
	if (oFF.notNull(this.m_planningCommands))
	{
		this.getPlanningCommands().clear();
	}
};
oFF.AbstractRsDataEntry.prototype.forceNewValue = function(forceNewValue)
{
	this.m_forceNewValue = forceNewValue;
};
oFF.AbstractRsDataEntry.prototype.getCollection = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_collection);
};
oFF.AbstractRsDataEntry.prototype.getDataCellEntryDescription = function()
{
	return this.getCollection().getDataCellEntryDescription();
};
oFF.AbstractRsDataEntry.prototype.getDataEntryGroup = function()
{
	return this.m_dataEntryGroup;
};
oFF.AbstractRsDataEntry.prototype.getDate = function()
{
	this.assertType(oFF.XValueType.DATE);
	return this.m_xvalue;
};
oFF.AbstractRsDataEntry.prototype.getDateTime = function()
{
	this.assertType(oFF.XValueType.DATE_TIME);
	return this.m_xvalue;
};
oFF.AbstractRsDataEntry.prototype.getDecFloat = function()
{
	this.assertType(oFF.XValueType.DOUBLE);
	return oFF.XValueUtil.getDecFloat(this.m_xvalue, true, false);
};
oFF.AbstractRsDataEntry.prototype.getDouble = function()
{
	this.assertType(oFF.XValueType.DOUBLE);
	return oFF.XValueUtil.getDouble(this.m_xvalue, true, false);
};
oFF.AbstractRsDataEntry.prototype.getNewValueExternal = function()
{
	this.assertType(oFF.XValueType.STRING);
	let newXString = this.m_xvalue;
	return newXString.getString();
};
oFF.AbstractRsDataEntry.prototype.getPlanningCommand = function()
{
	if (!oFF.XCollectionUtils.hasElements(this.m_planningCommands))
	{
		return null;
	}
	return this.m_planningCommands.get(0);
};
oFF.AbstractRsDataEntry.prototype.getPlanningCommands = function()
{
	if (oFF.isNull(this.m_planningCommands))
	{
		this.m_planningCommands = oFF.XList.create();
	}
	return this.m_planningCommands;
};
oFF.AbstractRsDataEntry.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.AbstractRsDataEntry.prototype.getProcessingOrder = function()
{
	return this.m_processingOrder;
};
oFF.AbstractRsDataEntry.prototype.getProcessingType = function()
{
	return this.m_processingType;
};
oFF.AbstractRsDataEntry.prototype.getString = function()
{
	this.assertType(oFF.XValueType.STRING);
	return this.m_xvalue.getString();
};
oFF.AbstractRsDataEntry.prototype.getTime = function()
{
	this.assertType(oFF.XValueType.TIME);
	return this.m_xvalue;
};
oFF.AbstractRsDataEntry.prototype.getXValue = function()
{
	return this.m_xvalue;
};
oFF.AbstractRsDataEntry.prototype.hasPlanningCommands = function()
{
	return oFF.XCollectionUtils.hasElements(this.m_planningCommands);
};
oFF.AbstractRsDataEntry.prototype.isNewValueForced = function()
{
	return this.m_forceNewValue;
};
oFF.AbstractRsDataEntry.prototype.isValueChanged = function()
{
	if (oFF.isNull(this.m_originXValue))
	{
		return true;
	}
	return !this.m_originXValue.isEqualTo(this.m_xvalue);
};
oFF.AbstractRsDataEntry.prototype.isValueLockChanged = function()
{
	return this.m_lockSet;
};
oFF.AbstractRsDataEntry.prototype.isValueLocked = function()
{
	return this.m_lock;
};
oFF.AbstractRsDataEntry.prototype.releaseObject = function()
{
	this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
	this.m_originXValue = oFF.XObjectExt.release(this.m_originXValue);
	this.m_planningCommands = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_planningCommands);
	this.m_dataEntryGroup = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.AbstractRsDataEntry.prototype.resetAllChanges = function()
{
	this.resetNewValue();
	this.resetValueLock();
	this.clearPlanningCommands();
	this.setProcessingOrder(0);
	this.setPriority(0);
};
oFF.AbstractRsDataEntry.prototype.resetNewValue = function()
{
	this.m_xvalue.resetValue(this.m_originXValue);
};
oFF.AbstractRsDataEntry.prototype.resetValueLock = function()
{
	this.m_lock = this.m_originalLock;
	this.m_lockSet = false;
};
oFF.AbstractRsDataEntry.prototype.setDataCellEntryDescription = function(description)
{
	this.getCollection().setDataCellEntryDescription(description);
};
oFF.AbstractRsDataEntry.prototype.setDataEntryGroup = function(dataEntryGroup)
{
	this.m_dataEntryGroup = dataEntryGroup;
};
oFF.AbstractRsDataEntry.prototype.setDate = function(value)
{
	this.m_xvalue = value;
};
oFF.AbstractRsDataEntry.prototype.setDateTime = function(value)
{
	this.m_xvalue = value;
};
oFF.AbstractRsDataEntry.prototype.setDouble = function(value)
{
	this.m_xvalue = oFF.XDoubleValue.create(value);
};
oFF.AbstractRsDataEntry.prototype.setNewValueExternal = function(valueExternal)
{
	if (this.m_xvalue.getValueType() === oFF.XValueType.STRING)
	{
		this.m_xvalue.setString(valueExternal);
	}
	else
	{
		this.m_xvalue = oFF.XStringValue.create(valueExternal);
	}
};
oFF.AbstractRsDataEntry.prototype.setPlanningCommand = function(planningCommand)
{
	if (oFF.isNull(planningCommand) && oFF.isNull(this.m_planningCommands))
	{
		return;
	}
	this.getPlanningCommands().clear();
	if (oFF.notNull(planningCommand))
	{
		this.m_planningCommands.add(planningCommand);
	}
};
oFF.AbstractRsDataEntry.prototype.setPriority = function(priority)
{
	this.m_priority = priority;
};
oFF.AbstractRsDataEntry.prototype.setProcessingOrder = function(processingOrder)
{
	if (processingOrder < 0)
	{
		throw oFF.XException.createIllegalArgumentException("processing order must not be negative");
	}
	this.m_processingOrder = processingOrder;
};
oFF.AbstractRsDataEntry.prototype.setProcessingType = function(dataEntryProcessingType)
{
	this.m_processingType = dataEntryProcessingType;
};
oFF.AbstractRsDataEntry.prototype.setString = function(value)
{
	this.m_xvalue = oFF.XStringValue.create(value);
};
oFF.AbstractRsDataEntry.prototype.setTime = function(value)
{
	this.m_xvalue = value;
};
oFF.AbstractRsDataEntry.prototype.setValueLock = function(lock)
{
	if (lock === this.m_originalLock)
	{
		this.resetValueLock();
	}
	else
	{
		this.m_lock = lock;
		this.m_lockSet = true;
	}
};
oFF.AbstractRsDataEntry.prototype.setXValue = function(value)
{
	this.m_xvalue = value;
};
oFF.AbstractRsDataEntry.prototype.setupEntry = function(collection)
{
	this.m_collection = oFF.XWeakReferenceUtil.getWeakRef(collection);
};

oFF.RsAxisTuple = function() {};
oFF.RsAxisTuple.prototype = new oFF.XObject();
oFF.RsAxisTuple.prototype._ff_c = "RsAxisTuple";

oFF.RsAxisTuple.create = function(axis, axisIndex)
{
	let object = new oFF.RsAxisTuple();
	object.setupExt(axis, axisIndex);
	return object;
};
oFF.RsAxisTuple.prototype.m_attributeMembers = null;
oFF.RsAxisTuple.prototype.m_axis = null;
oFF.RsAxisTuple.prototype.m_axisIndex = 0;
oFF.RsAxisTuple.prototype.m_elements = null;
oFF.RsAxisTuple.prototype.m_valueCount = 0;
oFF.RsAxisTuple.prototype.get = function(index)
{
	return this.m_elements.get(index);
};
oFF.RsAxisTuple.prototype.getAttributeMemberAt = function(index)
{
	if (oFF.isNull(this.m_attributeMembers))
	{
		this.m_attributeMembers = oFF.XList.create();
		let size = this.m_elements.size();
		for (let idxTupleElement = 0; idxTupleElement < size; idxTupleElement++)
		{
			let element = this.m_elements.get(idxTupleElement);
			let dimensionMember = element.getDimensionMember();
			let resultSetAttributeMembers = dimensionMember.getResultSetFieldValues();
			this.m_attributeMembers.addAll(resultSetAttributeMembers);
		}
	}
	return this.m_attributeMembers.get(index);
};
oFF.RsAxisTuple.prototype.getAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_axis);
};
oFF.RsAxisTuple.prototype.getAxisIndex = function()
{
	return this.m_axisIndex;
};
oFF.RsAxisTuple.prototype.getBooleanAt = function(index)
{
	return this.getAttributeMemberAt(index).getBoolean();
};
oFF.RsAxisTuple.prototype.getBooleanAtExt = function(index, defaultValue)
{
	return this.getBooleanAt(index);
};
oFF.RsAxisTuple.prototype.getBooleanByField = function(field)
{
	let valueByField = this.getValueByField(field);
	return oFF.isNull(valueByField) ? false : valueByField.getBoolean();
};
oFF.RsAxisTuple.prototype.getDoubleAt = function(index)
{
	return this.getAttributeMemberAt(index).getDouble();
};
oFF.RsAxisTuple.prototype.getDoubleAtExt = function(index, defaultValue)
{
	return this.getDoubleAt(index);
};
oFF.RsAxisTuple.prototype.getDoubleByField = function(field)
{
	let valueByField = this.getValueByField(field);
	return oFF.isNull(valueByField) ? 0.0 : valueByField.getDouble();
};
oFF.RsAxisTuple.prototype.getElements = function()
{
	return this.m_elements;
};
oFF.RsAxisTuple.prototype.getIntegerAt = function(index)
{
	return this.getAttributeMemberAt(index).getInteger();
};
oFF.RsAxisTuple.prototype.getIntegerAtExt = function(index, defaultValue)
{
	return this.getIntegerAt(index);
};
oFF.RsAxisTuple.prototype.getIntegerByField = function(field)
{
	let valueByField = this.getValueByField(field);
	return oFF.isNull(valueByField) ? 0 : valueByField.getInteger();
};
oFF.RsAxisTuple.prototype.getLongAt = function(index)
{
	return this.getAttributeMemberAt(index).getLong();
};
oFF.RsAxisTuple.prototype.getLongAtExt = function(index, defaultValue)
{
	return this.getLongAt(index);
};
oFF.RsAxisTuple.prototype.getScalingFactor = function()
{
	let axis = this.getAxis();
	let isColumns = axis.getType() === oFF.AxisType.COLUMNS;
	let resultSet = axis.getResultSet();
	let size = isColumns ? resultSet.getDataRows() : resultSet.getDataColumns();
	if (size > 0)
	{
		let dataCell = isColumns ? resultSet.getDataCell(this.m_axisIndex, 0) : resultSet.getDataCell(0, this.m_axisIndex);
		let scalingFactor = dataCell.getScalingFactor();
		for (let i = 1; i < size; i++)
		{
			dataCell = isColumns ? resultSet.getDataCell(this.m_axisIndex, i) : resultSet.getDataCell(i, this.m_axisIndex);
			if (scalingFactor !== dataCell.getScalingFactor())
			{
				return null;
			}
		}
		return oFF.XIntegerValue.create(scalingFactor);
	}
	return null;
};
oFF.RsAxisTuple.prototype.getStringAt = function(index)
{
	return this.getAttributeMemberAt(index).getString();
};
oFF.RsAxisTuple.prototype.getStringAtExt = function(index, defaultValue)
{
	return this.getStringAt(index);
};
oFF.RsAxisTuple.prototype.getStringByField = function(field)
{
	let valueByField = this.getValueByField(field);
	return oFF.isNull(valueByField) ? null : valueByField.getString();
};
oFF.RsAxisTuple.prototype.getTristateByField = function(field)
{
	let valueByField = this.getValueByField(field);
	return oFF.isNull(valueByField) ? oFF.TriStateBool._DEFAULT : oFF.TriStateBool.lookup(valueByField.getBoolean());
};
oFF.RsAxisTuple.prototype.getTupleElementAt = function(index)
{
	return this.get(index);
};
oFF.RsAxisTuple.prototype.getTupleElementByDimension = function(dimension)
{
	let name;
	let udhWithThisDimensionIncluded = dimension.getUDHWithThisDimensionIncluded();
	if (oFF.notNull(udhWithThisDimensionIncluded) && udhWithThisDimensionIncluded.isActive())
	{
		name = udhWithThisDimensionIncluded.getName();
	}
	else
	{
		name = dimension.getName();
	}
	let rsDimensions = this.getAxis().getRsDimensions();
	let indexByName = oFF.XCollectionUtils.getIndexByName(rsDimensions, name);
	return indexByName === -1 ? null : this.m_elements.get(indexByName);
};
oFF.RsAxisTuple.prototype.getValueByField = function(field)
{
	let size = this.size();
	let dimension = field.getDimension();
	for (let i = 0; i < size; i++)
	{
		let element = this.m_elements.get(i);
		if (element.getDimension() === dimension)
		{
			return element.getDimensionMember().getFieldValue(field);
		}
	}
	return null;
};
oFF.RsAxisTuple.prototype.getValueCount = function()
{
	if (this.m_valueCount === -1)
	{
		this.m_valueCount = 0;
		let size = this.m_elements.size();
		for (let i = 0; i < size; i++)
		{
			let element = this.m_elements.get(i);
			this.m_valueCount = this.m_valueCount + element.getDimension().getResultSetFields().size();
		}
	}
	return this.m_valueCount;
};
oFF.RsAxisTuple.prototype.getValueTypeAt = function(index)
{
	return this.getAttributeMemberAt(index).getValueType();
};
oFF.RsAxisTuple.prototype.hasElements = function()
{
	return this.m_elements.hasElements();
};
oFF.RsAxisTuple.prototype.isEmpty = function()
{
	return this.m_elements.isEmpty();
};
oFF.RsAxisTuple.prototype.releaseObject = function()
{
	this.m_axis = null;
	if (oFF.notNull(this.m_elements))
	{
		let size = this.m_elements.size();
		for (let i = 0; i < size; i++)
		{
			let tupleElement = this.m_elements.get(i);
			oFF.XObjectExt.release(tupleElement);
		}
		this.m_elements = oFF.XObjectExt.release(this.m_elements);
	}
	this.m_attributeMembers = oFF.XObjectExt.release(this.m_attributeMembers);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsAxisTuple.prototype.setTupleElements = function(elements)
{
	this.m_elements = elements;
};
oFF.RsAxisTuple.prototype.setupExt = function(axis, axisIndex)
{
	this.m_axis = oFF.XWeakReferenceUtil.getWeakRef(axis);
	this.m_axisIndex = axisIndex;
	this.m_valueCount = -1;
};
oFF.RsAxisTuple.prototype.size = function()
{
	return this.m_elements.size();
};
oFF.RsAxisTuple.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	let size = this.m_elements.size();
	for (let i = 0; i < size; i++)
	{
		if (i > 0)
		{
			buffer.append("\r\n");
		}
		let element = this.get(i);
		buffer.append(element.toString());
	}
	return buffer.toString();
};

oFF.RsDataEntry = function() {};
oFF.RsDataEntry.prototype = new oFF.AbstractRsDataEntry();
oFF.RsDataEntry.prototype._ff_c = "RsDataEntry";

oFF.RsDataEntry.create = function(collection, column, row, originalCell, fallbackToZero)
{
	let value = new oFF.RsDataEntry();
	value.setupEntry(collection);
	value.m_column = column;
	value.m_row = row;
	let originalXValue2 = originalCell.getXValue();
	if (oFF.notNull(originalXValue2))
	{
		value.m_originXValue = originalXValue2.clone();
		value.m_xvalue = originalXValue2.clone();
	}
	else
	{
		if (fallbackToZero)
		{
			value.m_originXValue = oFF.XDoubleValue.create(0.0);
		}
		value.m_xvalue = oFF.XDoubleValue.create(0.0);
	}
	value.m_originalLock = originalCell.getOriginalValueLock();
	value.m_lock = originalCell.getOriginalValueLock();
	value.getPlanningCommands().addAll(originalCell.getPlanningCommands());
	value.m_forceNewValue = originalCell.isNewValueForced();
	return value;
};
oFF.RsDataEntry.prototype.m_column = 0;
oFF.RsDataEntry.prototype.m_row = 0;
oFF.RsDataEntry.prototype.getColumn = function()
{
	return this.m_column;
};
oFF.RsDataEntry.prototype.getRow = function()
{
	return this.m_row;
};

oFF.RsDataEntryViaMember = function() {};
oFF.RsDataEntryViaMember.prototype = new oFF.AbstractRsDataEntry();
oFF.RsDataEntryViaMember.prototype._ff_c = "RsDataEntryViaMember";

oFF.RsDataEntryViaMember.create = function(collection)
{
	let obj = new oFF.RsDataEntryViaMember();
	obj.setupEntry(collection);
	obj.m_memberContext = oFF.XHashMapByString.create();
	return obj;
};
oFF.RsDataEntryViaMember.prototype.m_memberContext = null;
oFF.RsDataEntryViaMember.prototype.addMemberContext = function(dimensionName, memberName)
{
	this.m_memberContext.put(dimensionName, memberName);
};
oFF.RsDataEntryViaMember.prototype.getMemberContext = function()
{
	return this.m_memberContext;
};
oFF.RsDataEntryViaMember.prototype.releaseObject = function()
{
	this.m_memberContext = oFF.XObjectExt.release(this.m_memberContext);
	oFF.AbstractRsDataEntry.prototype.releaseObject.call( this );
};

oFF.RsPagingType = function() {};
oFF.RsPagingType.prototype = new oFF.XConstant();
oFF.RsPagingType.prototype._ff_c = "RsPagingType";

oFF.RsPagingType.MULTIPLE_REQUESTS = null;
oFF.RsPagingType.SINGLE_REQUEST = null;
oFF.RsPagingType.TWO_REQUESTS = null;
oFF.RsPagingType.staticSetup = function()
{
	oFF.RsPagingType.SINGLE_REQUEST = oFF.XConstant.setupName(new oFF.RsPagingType(), "SingleRequest");
	oFF.RsPagingType.TWO_REQUESTS = oFF.XConstant.setupName(new oFF.RsPagingType(), "TwoRequests");
	oFF.RsPagingType.MULTIPLE_REQUESTS = oFF.XConstant.setupName(new oFF.RsPagingType(), "MultipleRequests");
};

oFF.RsCursorAxisTupleElementContent = function() {};
oFF.RsCursorAxisTupleElementContent.prototype = new oFF.DfApplicationContext();
oFF.RsCursorAxisTupleElementContent.prototype._ff_c = "RsCursorAxisTupleElementContent";

oFF.RsCursorAxisTupleElementContent.create = function(application, dimension, rsDimension)
{
	let object = new oFF.RsCursorAxisTupleElementContent();
	object.setupExt(application, dimension, rsDimension);
	return object;
};
oFF.RsCursorAxisTupleElementContent.prototype.m_absoluteLevel = 0;
oFF.RsCursorAxisTupleElementContent.prototype.m_childCount = 0;
oFF.RsCursorAxisTupleElementContent.prototype.m_currentAttributeMember = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_dimension = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_dimensionMemberName = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_dimensionMemberType = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_displayLevel = 0;
oFF.RsCursorAxisTupleElementContent.prototype.m_drillGroupDimension = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_drillGroupDimensionInfo = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_drillState = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_fieldIndex = 0;
oFF.RsCursorAxisTupleElementContent.prototype.m_nameValueException = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_nodeId = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_parentDimensionMemberName = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_parentNodeIndex = 0;
oFF.RsCursorAxisTupleElementContent.prototype.m_rsDimension = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_rsFieldValues = null;
oFF.RsCursorAxisTupleElementContent.prototype.m_valueOfHierarchyNavigationKey = null;
oFF.RsCursorAxisTupleElementContent.prototype.addRsFieldValue = function(rsFieldValue)
{
	this.m_rsFieldValues.add(rsFieldValue);
};
oFF.RsCursorAxisTupleElementContent.prototype.cloneExt = function(flags)
{
	let clone = oFF.RsCursorAxisTupleElementContent.create(this.getApplication(), this.getDimensionAtCurrentPositionFromQueryModel(), this.getRsDimensionAtCurrentPosition());
	clone.setDrillGroupDimensionAtCurrentPosition(oFF.XWeakReferenceUtil.getHardRef(this.m_drillGroupDimension));
	clone.setDrillGroupDimensionInfoAtCurrentPosition(oFF.XWeakReferenceUtil.getHardRef(this.m_drillGroupDimensionInfo));
	clone.m_dimensionMemberName = this.m_dimensionMemberName;
	clone.m_parentDimensionMemberName = this.m_parentDimensionMemberName;
	clone.m_valueOfHierarchyNavigationKey = this.m_valueOfHierarchyNavigationKey;
	clone.m_nameValueException = this.m_nameValueException;
	let size = this.m_rsFieldValues.size();
	for (let i = 0; i < size; i++)
	{
		let rsFieldValue = oFF.RsCursorFieldValue.create(this.m_rsFieldValues.get(i).getField(), this.m_rsFieldValues.get(i).getRsField());
		clone.addRsFieldValue(rsFieldValue);
	}
	clone.m_fieldIndex = this.m_fieldIndex;
	clone.m_dimensionMemberType = this.m_dimensionMemberType;
	clone.m_drillState = this.m_drillState;
	clone.m_displayLevel = this.m_displayLevel;
	clone.m_absoluteLevel = this.m_absoluteLevel;
	clone.m_parentNodeIndex = this.m_parentNodeIndex;
	clone.m_nodeId = this.m_nodeId;
	clone.m_childCount = this.m_childCount;
	return clone;
};
oFF.RsCursorAxisTupleElementContent.prototype.createDimensionMemberFromCurrentPosition = function()
{
	return oFF.QFactory.createDimensionMemberFromTupleElement(this);
};
oFF.RsCursorAxisTupleElementContent.prototype.createRsFieldValue = function(field, rsField)
{
	return oFF.RsCursorFieldValue.create(field, rsField);
};
oFF.RsCursorAxisTupleElementContent.prototype.getAbsoluteLevel = function()
{
	return this.m_absoluteLevel;
};
oFF.RsCursorAxisTupleElementContent.prototype.getChildCount = function()
{
	return this.m_childCount;
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionAtCurrentPosition = function()
{
	let dimension = oFF.XWeakReferenceUtil.getHardRef(this.m_dimension);
	return oFF.notNull(dimension) ? dimension : this.getRsDimensionAtCurrentPosition();
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionAtCurrentPositionFromQueryModel = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_dimension);
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberAliasOrName = function()
{
	let dimension = this.getRsDimensionAtCurrentPosition();
	if (oFF.notNull(dimension))
	{
		let queryModel = dimension.getQueryModel();
		if (oFF.notNull(queryModel))
		{
			let aliasName = dimension.getConvenienceCommands().getMeasureMemberAliasByName(queryModel, this.m_dimensionMemberName);
			if (oFF.notNull(aliasName))
			{
				return aliasName;
			}
		}
	}
	return this.getDimensionMemberName();
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberName = function()
{
	let dimension = this.getRsDimensionAtCurrentPosition();
	if (oFF.notNull(dimension) && (dimension.getDimensionType() === oFF.DimensionType.ACCOUNT || dimension.getDimensionType() === oFF.DimensionType.MEASURE_STRUCTURE))
	{
		let dimensionMember = dimension.getStructureMember(this.m_dimensionMemberName);
		if (oFF.notNull(dimensionMember) && dimensionMember.getAliasName() !== null)
		{
			return dimensionMember.getAliasName();
		}
	}
	return this.m_dimensionMemberName;
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberNameValueException = function()
{
	return this.m_nameValueException;
};
oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberType = function()
{
	return this.m_dimensionMemberType;
};
oFF.RsCursorAxisTupleElementContent.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.RsCursorAxisTupleElementContent.prototype.getDrillGroupDimensionAtCurrentPosition = function()
{
	let dimension = oFF.XWeakReferenceUtil.getHardRef(this.m_drillGroupDimension);
	return oFF.notNull(dimension) ? dimension : this.getDimensionAtCurrentPosition();
};
oFF.RsCursorAxisTupleElementContent.prototype.getDrillGroupDimensionInfoAtCurrentPosition = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_drillGroupDimensionInfo);
};
oFF.RsCursorAxisTupleElementContent.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.RsCursorAxisTupleElementContent.prototype.getFieldValue = function()
{
	return this.m_currentAttributeMember;
};
oFF.RsCursorAxisTupleElementContent.prototype.getFieldValueList = function()
{
	return this.m_rsFieldValues;
};
oFF.RsCursorAxisTupleElementContent.prototype.getNodeId = function()
{
	return this.m_nodeId;
};
oFF.RsCursorAxisTupleElementContent.prototype.getParentDimensionMemberAliasOrName = function()
{
	let dimension = this.getRsDimensionAtCurrentPosition();
	if (oFF.notNull(dimension))
	{
		let queryModel = dimension.getQueryModel();
		if (oFF.notNull(queryModel))
		{
			let aliasName = dimension.getConvenienceCommands().getMeasureMemberAliasByName(queryModel, this.m_parentDimensionMemberName);
			if (oFF.notNull(aliasName))
			{
				return aliasName;
			}
		}
	}
	return this.getParentDimensionMemberName();
};
oFF.RsCursorAxisTupleElementContent.prototype.getParentDimensionMemberName = function()
{
	let dimension = this.getRsDimensionAtCurrentPosition();
	if (oFF.notNull(dimension) && (dimension.getDimensionType() === oFF.DimensionType.ACCOUNT || dimension.getDimensionType() === oFF.DimensionType.MEASURE_STRUCTURE))
	{
		let dimensionMember = dimension.getStructureMember(this.m_parentDimensionMemberName);
		if (oFF.notNull(dimensionMember) && dimensionMember.getAliasName() !== null)
		{
			return dimensionMember.getAliasName();
		}
	}
	return this.m_parentDimensionMemberName;
};
oFF.RsCursorAxisTupleElementContent.prototype.getParentNodeIndex = function()
{
	return this.m_parentNodeIndex;
};
oFF.RsCursorAxisTupleElementContent.prototype.getRsDimensionAtCurrentPosition = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_rsDimension);
};
oFF.RsCursorAxisTupleElementContent.prototype.getValueOfHierarchyNavigationKey = function()
{
	return this.m_valueOfHierarchyNavigationKey;
};
oFF.RsCursorAxisTupleElementContent.prototype.hasNextFieldValue = function()
{
	return this.m_fieldIndex < this.m_rsFieldValues.size() - 1;
};
oFF.RsCursorAxisTupleElementContent.prototype.nextFieldValue = function()
{
	this.m_fieldIndex++;
	this.m_currentAttributeMember = this.m_rsFieldValues.get(this.m_fieldIndex);
	return this.m_currentAttributeMember;
};
oFF.RsCursorAxisTupleElementContent.prototype.releaseObject = function()
{
	this.m_dimension = oFF.XObjectExt.release(this.m_dimension);
	this.m_drillGroupDimension = oFF.XObjectExt.release(this.m_drillGroupDimension);
	this.m_drillGroupDimensionInfo = oFF.XObjectExt.release(this.m_drillGroupDimensionInfo);
	this.m_rsDimension = oFF.XObjectExt.release(this.m_rsDimension);
	this.m_dimensionMemberName = null;
	this.m_parentDimensionMemberName = null;
	this.m_valueOfHierarchyNavigationKey = null;
	this.m_nameValueException = null;
	this.m_rsFieldValues = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rsFieldValues);
	this.m_currentAttributeMember = null;
	this.m_dimensionMemberType = null;
	this.m_drillState = null;
	this.m_nodeId = null;
	oFF.DfApplicationContext.prototype.releaseObject.call( this );
};
oFF.RsCursorAxisTupleElementContent.prototype.setAbsoluteLevel = function(absoluteLevel)
{
	this.m_absoluteLevel = absoluteLevel;
};
oFF.RsCursorAxisTupleElementContent.prototype.setChildCount = function(childCount)
{
	this.m_childCount = childCount;
};
oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberName = function(name)
{
	this.m_dimensionMemberName = name;
};
oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberNameValueException = function(valueException)
{
	this.m_nameValueException = valueException;
};
oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberType = function(type)
{
	this.m_dimensionMemberType = type;
};
oFF.RsCursorAxisTupleElementContent.prototype.setDisplayLevel = function(displayLevel)
{
	this.m_displayLevel = displayLevel;
};
oFF.RsCursorAxisTupleElementContent.prototype.setDrillGroupDimensionAtCurrentPosition = function(dimension)
{
	this.m_drillGroupDimension = oFF.XWeakReferenceUtil.getWeakRef(dimension);
};
oFF.RsCursorAxisTupleElementContent.prototype.setDrillGroupDimensionInfoAtCurrentPosition = function(dimensionInfo)
{
	this.m_drillGroupDimensionInfo = oFF.XWeakReferenceUtil.getWeakRef(dimensionInfo);
};
oFF.RsCursorAxisTupleElementContent.prototype.setDrillState = function(drillState)
{
	this.m_drillState = drillState;
};
oFF.RsCursorAxisTupleElementContent.prototype.setFieldValueCursorBeforeStart = function()
{
	this.m_fieldIndex = -1;
	this.m_currentAttributeMember = null;
};
oFF.RsCursorAxisTupleElementContent.prototype.setNodeId = function(nodeId)
{
	this.m_nodeId = nodeId;
};
oFF.RsCursorAxisTupleElementContent.prototype.setParentDimensionMemberName = function(name)
{
	this.m_parentDimensionMemberName = name;
};
oFF.RsCursorAxisTupleElementContent.prototype.setParentNodeIndex = function(parentIndex)
{
	this.m_parentNodeIndex = parentIndex;
};
oFF.RsCursorAxisTupleElementContent.prototype.setValueOfHierarchyNavigationKey = function(value)
{
	this.m_valueOfHierarchyNavigationKey = value;
};
oFF.RsCursorAxisTupleElementContent.prototype.setupExt = function(application, dimension, rsDimension)
{
	this.setupApplicationContext(application);
	this.m_dimension = oFF.XWeakReferenceUtil.getWeakRef(dimension);
	this.m_rsDimension = oFF.XWeakReferenceUtil.getWeakRef(rsDimension);
	this.m_fieldIndex = -1;
	this.m_rsFieldValues = oFF.XList.create();
	this.m_dimensionMemberType = oFF.MemberType.MEMBER;
	this.m_parentNodeIndex = -1;
};

oFF.DfRsAxisProvider = function() {};
oFF.DfRsAxisProvider.prototype = new oFF.DfApplicationContext();
oFF.DfRsAxisProvider.prototype._ff_c = "DfRsAxisProvider";

oFF.DfRsAxisProvider.prototype.m_cursorAxis = null;
oFF.DfRsAxisProvider.prototype.getCursorAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorAxis);
};
oFF.DfRsAxisProvider.prototype.releaseObject = function()
{
	this.m_cursorAxis = oFF.XObjectExt.release(this.m_cursorAxis);
	oFF.DfApplicationContext.prototype.releaseObject.call( this );
};
oFF.DfRsAxisProvider.prototype.setCursorAxis = function(axis)
{
	this.m_cursorAxis = oFF.XWeakReferenceUtil.getWeakRef(axis);
};

oFF.BLOBContainer = function() {};
oFF.BLOBContainer.prototype = new oFF.SyncAction();
oFF.BLOBContainer.prototype._ff_c = "BLOBContainer";

oFF.BLOBContainer.createBLOBContainer = function(manager, rpcFunction)
{
	let blobContainer = new oFF.BLOBContainer();
	blobContainer.setupAction(null, null, null, manager);
	blobContainer.m_rpcFunction = rpcFunction;
	blobContainer.setData(blobContainer);
	blobContainer.m_resourcePath = manager.getResourcePath();
	return blobContainer;
};
oFF.BLOBContainer.prototype.m_listener = null;
oFF.BLOBContainer.prototype.m_resourcePath = null;
oFF.BLOBContainer.prototype.m_rpcFunction = null;
oFF.BLOBContainer.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onBLOBAvailable(extResult, data, customIdentifier);
};
oFF.BLOBContainer.prototype.getContext = function()
{
	let actionContext = this.getActionContext();
	if (oFF.isNull(actionContext))
	{
		return null;
	}
	return actionContext.getContext();
};
oFF.BLOBContainer.prototype.getQueryManager = function()
{
	let context = this.getContext();
	if (oFF.isNull(context))
	{
		return null;
	}
	return context.getQueryManager();
};
oFF.BLOBContainer.prototype.getResourceDetails = function()
{
	return this.getQueryManager().getResourceDetailsFromResourceIdentifier(this.m_resourcePath);
};
oFF.BLOBContainer.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		this.setResultStructureForBLOB(response);
	}
	this.endSync();
};
oFF.BLOBContainer.prototype.processExecution = function(syncType, listener, customIdentifier)
{
	this.m_listener = listener;
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.BLOBContainer.prototype.processSynchronization = function(syncType)
{
	this.setSyncChild(this.m_rpcFunction);
	this.m_rpcFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.BLOBContainer.prototype.releaseObjectInternal = function()
{
	this.m_listener = oFF.XObjectExt.release(this.m_listener);
	this.m_rpcFunction = oFF.XObjectExt.release(this.m_rpcFunction);
	this.m_resourcePath = null;
};
oFF.BLOBContainer.prototype.setResultStructureForBLOB = function(response)
{
	let rootElementAsString = response.getRootElementAsString();
	if (oFF.notNull(rootElementAsString))
	{
		let queryManager = this.getQueryManager();
		let rootElement = response.getRootElement();
		let keys = rootElement.getKeysAsReadOnlyList();
		for (let i = 0; i < keys.size(); i++)
		{
			let resourceKey = keys.get(i);
			let contentAndMime = rootElement.getStructureByKey(resourceKey);
			let thingsOfInterest = oFF.XHashMapByString.create();
			thingsOfInterest.put("Content-Type", contentAndMime.getStringByKey("Content-Type"));
			thingsOfInterest.put("ContentString", contentAndMime.getStringByKey("ContentString"));
			thingsOfInterest.put("Content-Length", contentAndMime.getStringByKey("Content-Length"));
			queryManager.getOlapEnv().addBLOBDetailsToCache(this.getQueryManager().getResourcePath(), thingsOfInterest);
		}
		this.endProfileStep();
	}
};

oFF.ResultSet = function() {};
oFF.ResultSet.prototype = new oFF.DfApplicationContext();
oFF.ResultSet.prototype._ff_c = "ResultSet";

oFF.ResultSet.create = function(resultSetContainer, cursor)
{
	let resultSet = new oFF.ResultSet();
	resultSet.setupExt(resultSetContainer, cursor);
	return resultSet;
};
oFF.ResultSet.prototype.m_columnsAxis = null;
oFF.ResultSet.prototype.m_complexUnitsSetting = null;
oFF.ResultSet.prototype.m_cursorResultSet = null;
oFF.ResultSet.prototype.m_dataCells = null;
oFF.ResultSet.prototype.m_dataColumns = 0;
oFF.ResultSet.prototype.m_dataRows = 0;
oFF.ResultSet.prototype.m_queryModel = null;
oFF.ResultSet.prototype.m_resultSetContainer = null;
oFF.ResultSet.prototype.m_rowsAxis = null;
oFF.ResultSet.prototype.m_state = null;
oFF.ResultSet.prototype.containsCode = function(severity, code)
{
	return this.getCursorResultSet().containsCode(severity, code);
};
oFF.ResultSet.prototype.getAvailableDataCellCount = function()
{
	return this.getCursorResultSet().getAvailableDataCellCount();
};
oFF.ResultSet.prototype.getAxis = function(axis)
{
	return axis === oFF.AxisType.ROWS ? this.m_rowsAxis : this.m_columnsAxis;
};
oFF.ResultSet.prototype.getClientStatusCode = function()
{
	return this.getCursorResultSet().getClientStatusCode();
};
oFF.ResultSet.prototype.getColumnsAxis = function()
{
	return this.m_columnsAxis;
};
oFF.ResultSet.prototype.getComplexUnitsSetting = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_complexUnitsSetting);
};
oFF.ResultSet.prototype.getCursorResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
};
oFF.ResultSet.prototype.getDataCell = function(column, row)
{
	let invalidCol = column < 0 || column >= this.m_dataColumns;
	let invalidRow = row < 0 || row >= this.m_dataRows;
	let maxCol = this.m_dataColumns - 1;
	let maxRow = this.m_dataRows - 1;
	oFF.XBooleanUtils.checkFalse(invalidCol, oFF.XStringUtils.concatenate3("Column index is invalid, valid indices are [0, ", oFF.XIntegerValue.create(maxCol).toString(), "]"));
	oFF.XBooleanUtils.checkFalse(invalidRow, oFF.XStringUtils.concatenate3("Row index is invalid, valid indices are [0, ", oFF.XIntegerValue.create(maxRow).toString(), "]"));
	if (oFF.isNull(this.m_dataCells))
	{
		this.setupDataCells();
	}
	return this.m_dataCells.get(column + row * this.m_dataColumns);
};
oFF.ResultSet.prototype.getDataCellByTuples = function(columnTuple, rowTuple)
{
	return this.getDataCell(columnTuple.getAxisIndex(), rowTuple.getAxisIndex());
};
oFF.ResultSet.prototype.getDataColumns = function()
{
	return this.m_dataColumns;
};
oFF.ResultSet.prototype.getDataEntryMask = function()
{
	return this.getCursorResultSet().getDataEntryMask();
};
oFF.ResultSet.prototype.getDataRows = function()
{
	return this.m_dataRows;
};
oFF.ResultSet.prototype.getErrors = function()
{
	return this.getCursorResultSet().getErrors();
};
oFF.ResultSet.prototype.getFirstError = function()
{
	return this.getCursorResultSet().getFirstError();
};
oFF.ResultSet.prototype.getFirstWithSeverity = function(severity)
{
	return this.getCursorResultSet().getFirstWithSeverity(severity);
};
oFF.ResultSet.prototype.getInfos = function()
{
	return this.getCursorResultSet().getInfos();
};
oFF.ResultSet.prototype.getInputReadinessStateAt = function(index)
{
	let cursorResultSet = this.getCursorResultSet();
	return cursorResultSet.getInputReadinessStateAt(index);
};
oFF.ResultSet.prototype.getInputReadinessStates = function()
{
	return this.getCursorResultSet().getInputReadinessStates();
};
oFF.ResultSet.prototype.getMessage = function(severity, code)
{
	return this.getCursorResultSet().getMessage(severity, code);
};
oFF.ResultSet.prototype.getMessages = function()
{
	return this.getCursorResultSet().getMessages();
};
oFF.ResultSet.prototype.getNewDataEntryViaMember = function()
{
	return this.getCursorResultSet().getNewDataEntryViaMember();
};
oFF.ResultSet.prototype.getNumberOfErrors = function()
{
	return this.getCursorResultSet().getNumberOfErrors();
};
oFF.ResultSet.prototype.getNumberOfSeverity = function(severity)
{
	return this.getCursorResultSet().getNumberOfSeverity(severity);
};
oFF.ResultSet.prototype.getNumberOfWarnings = function()
{
	return this.getCursorResultSet().getNumberOfWarnings();
};
oFF.ResultSet.prototype.getQueryManager = function()
{
	return this.getResultSetContainer().getQueryManager();
};
oFF.ResultSet.prototype.getQueryModel = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_queryModel);
};
oFF.ResultSet.prototype.getResultSetContainer = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_resultSetContainer);
};
oFF.ResultSet.prototype.getResultSetType = function()
{
	return oFF.ResultSetType.CLASSIC;
};
oFF.ResultSet.prototype.getRootProfileNode = function()
{
	return this.getCursorResultSet().getRootProfileNode();
};
oFF.ResultSet.prototype.getRowsAxis = function()
{
	return this.m_rowsAxis;
};
oFF.ResultSet.prototype.getRsQueryModelDef = function()
{
	return this.getCursorResultSet().getRsQueryModelDef();
};
oFF.ResultSet.prototype.getSemanticalErrors = function()
{
	return this.getCursorResultSet().getSemanticalErrors();
};
oFF.ResultSet.prototype.getServerStatusCode = function()
{
	return this.getCursorResultSet().getServerStatusCode();
};
oFF.ResultSet.prototype.getServerStatusDetails = function()
{
	return this.getCursorResultSet().getServerStatusDetails();
};
oFF.ResultSet.prototype.getState = function()
{
	return this.m_state;
};
oFF.ResultSet.prototype.getSummary = function()
{
	return this.getCursorResultSet().getSummary();
};
oFF.ResultSet.prototype.getWarnings = function()
{
	return this.getCursorResultSet().getWarnings();
};
oFF.ResultSet.prototype.hasErrors = function()
{
	return this.getCursorResultSet().hasErrors();
};
oFF.ResultSet.prototype.hasSeverity = function(severity)
{
	return this.getCursorResultSet().hasSeverity(severity);
};
oFF.ResultSet.prototype.hasWarnings = function()
{
	return this.getCursorResultSet().hasWarnings();
};
oFF.ResultSet.prototype.isActive = function()
{
	return this.getResultSetContainer() !== null;
};
oFF.ResultSet.prototype.isDataEntryEnabled = function()
{
	return this.getCursorResultSet().isDataEntryEnabled();
};
oFF.ResultSet.prototype.isNewLinePossible = function()
{
	return !this.isDataEntryEnabled() ? false : this.getDataEntryMask().hasElements();
};
oFF.ResultSet.prototype.isValid = function()
{
	return this.getCursorResultSet().isValid();
};
oFF.ResultSet.prototype.releaseObject = function()
{
	this.m_resultSetContainer = null;
	this.m_queryModel = null;
	this.m_state = oFF.ResultSetState.TERMINATED;
	this.m_dataColumns = -1;
	this.m_dataRows = -1;
	if (oFF.notNull(this.m_dataCells))
	{
		let size = this.m_dataCells.size();
		for (let i = 0; i < size; i++)
		{
			let dataCell = this.m_dataCells.get(i);
			oFF.XObjectExt.release(dataCell);
		}
		this.m_dataCells = oFF.XObjectExt.release(this.m_dataCells);
	}
	this.m_columnsAxis = oFF.XObjectExt.release(this.m_columnsAxis);
	this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
	this.m_cursorResultSet = null;
	this.m_complexUnitsSetting = oFF.XObjectExt.release(this.m_complexUnitsSetting);
	oFF.DfApplicationContext.prototype.releaseObject.call( this );
};
oFF.ResultSet.prototype.resetNewValues = function()
{
	if (oFF.notNull(this.m_dataCells))
	{
		for (let i = 0; i < this.m_dataCells.size(); i++)
		{
			let dataCell = this.m_dataCells.get(i);
			dataCell.resetAllChanges();
		}
	}
};
oFF.ResultSet.prototype.setResultSetContainer = function(resultSetContainer)
{
	this.m_resultSetContainer = oFF.XWeakReferenceUtil.getWeakRef(resultSetContainer);
};
oFF.ResultSet.prototype.setupDataCells = function()
{
	let size = this.m_dataColumns * this.m_dataRows;
	this.m_dataCells = oFF.XArray.create(size);
	let index = 0;
	let cursorResultSet = this.getCursorResultSet();
	for (let y = 0; y < this.m_dataRows; y++)
	{
		for (let x = 0; x < this.m_dataColumns; x++)
		{
			this.m_dataCells.set(index, oFF.RsDataCell.createCopy(this, cursorResultSet.getDataCell(x, y)));
			++index;
		}
	}
};
oFF.ResultSet.prototype.setupExt = function(resultSetContainer, cursor)
{
	this.setupApplicationContext(resultSetContainer.getApplication());
	this.setResultSetContainer(resultSetContainer);
	this.m_queryModel = oFF.XWeakReferenceUtil.getWeakRef(cursor.getQueryModel());
	this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(cursor);
	this.m_columnsAxis = oFF.RsAxis.create(this, oFF.AxisType.COLUMNS, cursor.getCursorColumnsAxis());
	this.m_rowsAxis = oFF.RsAxis.create(this, oFF.AxisType.ROWS, cursor.getCursorRowsAxis());
	this.m_complexUnitsSetting = oFF.XWeakReferenceUtil.getWeakRef(cursor.getComplexUnitsSetting());
	this.m_state = cursor.getState();
	this.m_dataColumns = cursor.getDataColumns();
	this.m_dataRows = cursor.getDataRows();
};

oFF.DfRsSyncAction = function() {};
oFF.DfRsSyncAction.prototype = new oFF.SyncActionExt();
oFF.DfRsSyncAction.prototype._ff_c = "DfRsSyncAction";

oFF.DfRsSyncAction.prototype.getApplication = function()
{
	if (this.getActionContext() === null)
	{
		return null;
	}
	return this.getActionContext().getApplication();
};
oFF.DfRsSyncAction.prototype.getContext = function()
{
	let actionContext = this.getActionContext();
	if (oFF.isNull(actionContext))
	{
		return null;
	}
	return actionContext.getContext();
};
oFF.DfRsSyncAction.prototype.getOlapEnv = function()
{
	if (this.getActionContext() === null)
	{
		return null;
	}
	return this.getActionContext().getOlapEnv();
};
oFF.DfRsSyncAction.prototype.getQueryManager = function()
{
	let context = this.getContext();
	if (oFF.isNull(context))
	{
		return null;
	}
	return context.getQueryManager();
};
oFF.DfRsSyncAction.prototype.getQueryModel = function()
{
	let context = this.getContext();
	if (oFF.isNull(context))
	{
		return null;
	}
	return context.getQueryModel();
};
oFF.DfRsSyncAction.prototype.isEventingStopped = function()
{
	return false;
};
oFF.DfRsSyncAction.prototype.queueEventing = function() {};
oFF.DfRsSyncAction.prototype.releaseObjectInternal = function() {};
oFF.DfRsSyncAction.prototype.resumeEventing = function() {};
oFF.DfRsSyncAction.prototype.stopEventing = function() {};

oFF.RsDataCell = function() {};
oFF.RsDataCell.prototype = new oFF.XAbstractValue();
oFF.RsDataCell.prototype._ff_c = "RsDataCell";

oFF.RsDataCell.createCopy = function(classicResultSet, origin)
{
	let cell = new oFF.RsDataCell();
	cell.setupCopy(classicResultSet, origin);
	return cell;
};
oFF.RsDataCell.createDefault = function(cursorResultSet)
{
	let cell = new oFF.RsDataCell();
	cell.setupDefault(cursorResultSet);
	return cell;
};
oFF.RsDataCell.prototype.m_classicResultSet = null;
oFF.RsDataCell.prototype.m_column = 0;
oFF.RsDataCell.prototype.m_complexUnitIndex = 0;
oFF.RsDataCell.prototype.m_currencyUnit = null;
oFF.RsDataCell.prototype.m_cursorResultSet = null;
oFF.RsDataCell.prototype.m_dataEntry = null;
oFF.RsDataCell.prototype.m_dataEntryEnabled = false;
oFF.RsDataCell.prototype.m_decimalPlaces = 0;
oFF.RsDataCell.prototype.m_documentId = null;
oFF.RsDataCell.prototype.m_exceptionPriorities = null;
oFF.RsDataCell.prototype.m_exceptionSettings = null;
oFF.RsDataCell.prototype.m_explainQueryName = null;
oFF.RsDataCell.prototype.m_formatString = null;
oFF.RsDataCell.prototype.m_formattedValue = null;
oFF.RsDataCell.prototype.m_inputReadinessIndex = 0;
oFF.RsDataCell.prototype.m_maxAlertLevel = null;
oFF.RsDataCell.prototype.m_maxAlertLevelName = null;
oFF.RsDataCell.prototype.m_originalValueLock = false;
oFF.RsDataCell.prototype.m_planningCommandIds = null;
oFF.RsDataCell.prototype.m_queryDataCellReference = null;
oFF.RsDataCell.prototype.m_row = 0;
oFF.RsDataCell.prototype.m_scalingFactor = 0;
oFF.RsDataCell.prototype.m_valueException = null;
oFF.RsDataCell.prototype.m_valueType = null;
oFF.RsDataCell.prototype.m_xvalue = null;
oFF.RsDataCell.prototype.addPlanningCommand = function(planningCommand)
{
	if (oFF.notNull(planningCommand))
	{
		let checkDataEntryEnabled = true;
		let commandType = planningCommand.getCommandType();
		if (commandType === oFF.PlanningCommandType.PLANNING_ACTION)
		{
			let planningAction = planningCommand;
			let actionForQueryIdentifier = planningAction.getActionForQueryIdentifier();
			let planningActionType = actionForQueryIdentifier.getActionType();
			if (planningActionType.isTypeOf(oFF.PlanningActionType.QUERY_SINGLE))
			{
				checkDataEntryEnabled = false;
			}
		}
		let dataEntry = this.getDataEntryCheckEnabled(true, checkDataEntryEnabled);
		dataEntry.addPlanningCommand(planningCommand);
	}
};
oFF.RsDataCell.prototype.assertValueException = function()
{
	if (this.getValueException() === oFF.ValueException.UNDEFINED || this.getValueException() === oFF.ValueException.NULL_VALUE)
	{
		oFF.noSupport();
	}
};
oFF.RsDataCell.prototype.clearPlanningCommands = function()
{
	let existingDataEntry = this.getDataEntry(false);
	if (oFF.notNull(existingDataEntry))
	{
		existingDataEntry.clearPlanningCommands();
	}
};
oFF.RsDataCell.prototype.forceNewValue = function(forceNewValue)
{
	let dataEntry = this.getDataEntry(true);
	if (oFF.notNull(dataEntry))
	{
		dataEntry.forceNewValue(forceNewValue);
	}
};
oFF.RsDataCell.prototype.getApplication = function()
{
	let queryModel = this.getQueryModel();
	return oFF.isNull(queryModel) ? null : queryModel.getApplication();
};
oFF.RsDataCell.prototype.getColumn = function()
{
	return this.m_column;
};
oFF.RsDataCell.prototype.getComplexUnit = function()
{
	if (this.m_complexUnitIndex < 0)
	{
		return null;
	}
	let unitsSettings = null;
	let rsCursor = this.getCursorResultSet();
	if (oFF.notNull(rsCursor))
	{
		unitsSettings = rsCursor.getComplexUnitsSetting();
	}
	return oFF.isNull(unitsSettings) ? null : unitsSettings.get(this.m_complexUnitIndex);
};
oFF.RsDataCell.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.RD_DATA_CELL;
};
oFF.RsDataCell.prototype.getCurrencyUnit = function()
{
	return this.m_currencyUnit;
};
oFF.RsDataCell.prototype.getCurrencyUnitBase = function()
{
	return this.m_currencyUnit;
};
oFF.RsDataCell.prototype.getCursorResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
};
oFF.RsDataCell.prototype.getDataCell = function()
{
	let queryModel = this.getQueryModel();
	return oFF.isNull(queryModel) ? null : queryModel.getQueryDataCell(this.m_queryDataCellReference);
};
oFF.RsDataCell.prototype.getDataCellEntryDescription = function()
{
	let entryCollection = this.getDataEntryCollectionInternal(false);
	return oFF.isNull(entryCollection) ? null : entryCollection.getDataCellEntryDescription();
};
oFF.RsDataCell.prototype.getDataEntry = function(createNew)
{
	return this.getDataEntryCheckEnabled(createNew, true);
};
oFF.RsDataCell.prototype.getDataEntryCheckEnabled = function(createNew, checkDataEntryEnabled)
{
	if (checkDataEntryEnabled && !this.isDataEntryEnabled())
	{
		return null;
	}
	if (oFF.isNull(this.m_dataEntry))
	{
		this.m_dataEntry = this.getDataEntryInternal(createNew);
	}
	return this.m_dataEntry;
};
oFF.RsDataCell.prototype.getDataEntryCheckEnabledWithAssert = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(true, true);
	oFF.XObjectExt.assertNotNullExt(dataEntry, "DataCell is not inputEnabled");
	return dataEntry;
};
oFF.RsDataCell.prototype.getDataEntryCollectionInternal = function(createNew)
{
	let resultSetContainer = this.getResultSetContainer();
	if (oFF.isNull(resultSetContainer))
	{
		return null;
	}
	if (createNew || resultSetContainer.hasDataEntryCollection())
	{
		return resultSetContainer.getDataEntryCollection();
	}
	return null;
};
oFF.RsDataCell.prototype.getDataEntryGroup = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? null : dataEntry.getDataEntryGroup();
};
oFF.RsDataCell.prototype.getDataEntryInternal = function(createNew)
{
	let dataEntryCollection = this.getDataEntryCollectionInternal(createNew);
	if (oFF.isNull(dataEntryCollection))
	{
		return null;
	}
	if (createNew)
	{
		return dataEntryCollection.getDataEntry(this.m_column, this.m_row, this);
	}
	return dataEntryCollection.getDataEntryIfExisting(this.m_column, this.m_row, this);
};
oFF.RsDataCell.prototype.getDate = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		this.assertValueType(oFF.XValueType.DATE);
		return this.m_xvalue;
	}
	return dataEntry.getDate();
};
oFF.RsDataCell.prototype.getDateTime = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		this.assertValueType(oFF.XValueType.DATE_TIME);
		return this.m_xvalue;
	}
	return dataEntry.getDateTime();
};
oFF.RsDataCell.prototype.getDecFloat = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		if (oFF.isNull(this.m_xvalue))
		{
			return oFF.XDecFloatByString.createZeroValue();
		}
		let valueType = this.m_xvalue.getValueType();
		if (!valueType.isNumber())
		{
			oFF.noSupport();
		}
		return oFF.XValueUtil.getDecFloat(this.m_xvalue, true, false);
	}
	return dataEntry.getDecFloat();
};
oFF.RsDataCell.prototype.getDecimalPlaces = function()
{
	return this.m_decimalPlaces;
};
oFF.RsDataCell.prototype.getDisplayCurrencyUnit = function()
{
	let queryManager = this.getResultSetContainer().getQueryManager();
	if (this.isHideData(queryManager))
	{
		return "";
	}
	if (queryManager.getSystemType() === oFF.SystemType.BW && queryManager.getModelCapabilities().supportsUnifiedDataCells())
	{
		if (this.getValueType() === oFF.XValueType.PERCENT)
		{
			return "%";
		}
	}
	return this.getCurrencyUnit() !== null ? this.getCurrencyUnit().getSuffix() : null;
};
oFF.RsDataCell.prototype.getDisplayFormattedString = function()
{
	let originalValue = this.getFormatString();
	let queryManager = this.getResultSetContainer().getQueryManager();
	if (queryManager.getSystemType() === oFF.SystemType.BW && queryManager.getModelCapabilities().supportsUnifiedDataCells())
	{
		let isCellValueTypePercent = this.getValueType() === oFF.XValueType.PERCENT;
		let isSuffixPercent = oFF.XString.isEqual(this.getCurrencyUnit().getSuffix(), "%");
		if (isCellValueTypePercent || isSuffixPercent && !isCellValueTypePercent)
		{
			return oFF.XStringUtils.concatenate2(originalValue, " \"c\"");
		}
		let magnitude = this.getDisplayMagnitude();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(magnitude))
		{
			return oFF.XStringUtils.concatenate4(originalValue, " \" ", magnitude, "\"");
		}
	}
	return originalValue;
};
oFF.RsDataCell.prototype.getDisplayLabel = function()
{
	if (this.getResultSetContainer().getQueryManager().getModelCapabilities().supportsUnifiedDataCells())
	{
		if (this.getValueType() === oFF.XValueType.PERCENT)
		{
			return "%";
		}
	}
	let label = this.getCurrencyUnit() !== null ? this.getCurrencyUnit().getFormatted() : null;
	return oFF.XStringUtils.isNotNullAndNotEmpty(label) ? label : "";
};
oFF.RsDataCell.prototype.getDisplayMagnitude = function()
{
	let magnitude = "";
	let queryManager = this.getResultSetContainer().getQueryManager();
	if (queryManager.getSystemType() === oFF.SystemType.BW && queryManager.getModelCapabilities().supportsUnifiedDataCells())
	{
		switch (this.getScalingFactor())
		{
			case -3:
				magnitude = "Thousand";
				break;

			case -6:
				magnitude = "Million";
				break;

			case -9:
				magnitude = "Billion";
				break;

			default:
				magnitude = "";
		}
	}
	else
	{
		let formatString = this.getFormatString();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(formatString))
		{
			let lastQuote = oFF.XString.lastIndexOf(formatString, "\"");
			if (lastQuote > 0)
			{
				let secondLastQuote = oFF.XString.lastIndexOf(oFF.XString.substring(formatString, 0, lastQuote), "\"");
				if (secondLastQuote > 0)
				{
					let lastFormatString = oFF.XString.substring(formatString, secondLastQuote + 1, lastQuote);
					if (oFF.XString.match(lastFormatString, "([\\sA-Za-z]*)"))
					{
						magnitude = oFF.XString.trim(lastFormatString);
					}
				}
			}
		}
	}
	return magnitude;
};
oFF.RsDataCell.prototype.getDisplayValue = function()
{
	let queryManager = this.getResultSetContainer().getQueryManager();
	if (this.isHideData(queryManager))
	{
		return null;
	}
	let value = this.getDouble();
	if (queryManager.getSystemType() === oFF.SystemType.BW && queryManager.getModelCapabilities().supportsUnifiedDataCells())
	{
		if (oFF.XString.isEqual(this.getCurrencyUnit().getSuffix(), "%") && this.getValueType() !== oFF.XValueType.PERCENT)
		{
			value = value / 100;
		}
	}
	return oFF.XDoubleValue.create(value);
};
oFF.RsDataCell.prototype.getDocumentId = function()
{
	return this.m_documentId;
};
oFF.RsDataCell.prototype.getDouble = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		if (oFF.isNull(this.m_xvalue))
		{
			return 0.0;
		}
		let valueType = this.m_xvalue.getValueType();
		if (!valueType.isNumber())
		{
			oFF.noSupport();
		}
		return oFF.XValueUtil.getDouble(this.m_xvalue, true, false);
	}
	return dataEntry.getDouble();
};
oFF.RsDataCell.prototype.getExceptionPriorities = function()
{
	return this.m_exceptionPriorities;
};
oFF.RsDataCell.prototype.getExceptionSettingPriorityByName = function(exceptionSettingName)
{
	return this.m_exceptionPriorities.getByKey(exceptionSettingName);
};
oFF.RsDataCell.prototype.getExceptionSettingValueByName = function(exceptionSettingName)
{
	return oFF.isNull(this.m_exceptionSettings) ? null : this.m_exceptionSettings.getByKey(exceptionSettingName);
};
oFF.RsDataCell.prototype.getExceptionSettings = function()
{
	return this.m_exceptionSettings;
};
oFF.RsDataCell.prototype.getExplainQueryDataSourceFullQualifiedName = function()
{
	return oFF.isNull(this.m_explainQueryName) ? null : oFF.XStringUtils.concatenate3("query:[][][", this.m_explainQueryName, "]");
};
oFF.RsDataCell.prototype.getExplainQueryName = function()
{
	return this.m_explainQueryName;
};
oFF.RsDataCell.prototype.getFormatString = function()
{
	return this.m_formatString;
};
oFF.RsDataCell.prototype.getFormattedValue = function()
{
	return this.m_formattedValue;
};
oFF.RsDataCell.prototype.getInputReadinessState = function()
{
	if (this.getQueryManager() === null || !this.getQueryManager().supportsInputReadinessStates())
	{
		return null;
	}
	let cursorResultSet = this.getCursorResultSet();
	return oFF.isNull(cursorResultSet) ? null : cursorResultSet.getInputReadinessStateAt(this.m_inputReadinessIndex);
};
oFF.RsDataCell.prototype.getMaxAlertLevel = function()
{
	return this.m_maxAlertLevel;
};
oFF.RsDataCell.prototype.getMaxAlertLevelName = function()
{
	return this.m_maxAlertLevelName;
};
oFF.RsDataCell.prototype.getMinimumDrillStateValidationResult = function()
{
	return this.getCursorResultSet().validateCellMinimumDrillState(this.m_column, this.m_row);
};
oFF.RsDataCell.prototype.getNewValueExternal = function()
{
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		return this.getString();
	}
	return dataEntry.getNewValueExternal();
};
oFF.RsDataCell.prototype.getOriginalValueLock = function()
{
	return this.m_originalValueLock;
};
oFF.RsDataCell.prototype.getPlanningCommand = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? null : dataEntry.getPlanningCommand();
};
oFF.RsDataCell.prototype.getPlanningCommandIds = function()
{
	if (oFF.isNull(this.m_planningCommandIds) || this.m_planningCommandIds.isEmpty())
	{
		return null;
	}
	return this.m_planningCommandIds;
};
oFF.RsDataCell.prototype.getPlanningCommandIdsBase = function()
{
	if (oFF.isNull(this.m_planningCommandIds))
	{
		this.m_planningCommandIds = oFF.XList.create();
	}
	return this.m_planningCommandIds;
};
oFF.RsDataCell.prototype.getPlanningCommands = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? null : dataEntry.getPlanningCommands();
};
oFF.RsDataCell.prototype.getPriority = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? 0 : dataEntry.getPriority();
};
oFF.RsDataCell.prototype.getProcess = function()
{
	let queryModel = this.getQueryModel();
	return oFF.isNull(queryModel) ? null : queryModel.getProcess();
};
oFF.RsDataCell.prototype.getProcessingOrder = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? 0 : dataEntry.getProcessingOrder();
};
oFF.RsDataCell.prototype.getProcessingType = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.isNull(dataEntry) ? null : dataEntry.getProcessingType();
};
oFF.RsDataCell.prototype.getQueryDataCellReference = function()
{
	return this.m_queryDataCellReference;
};
oFF.RsDataCell.prototype.getQueryManager = function()
{
	let cursorResultSet = this.getCursorResultSet();
	if (oFF.notNull(cursorResultSet))
	{
		return cursorResultSet.getQueryManager();
	}
	let classicResultSet = this.getResultSet();
	if (oFF.notNull(classicResultSet))
	{
		return classicResultSet.getQueryManager();
	}
	let queryModel = this.getQueryModel();
	if (oFF.notNull(queryModel))
	{
		return queryModel.getQueryManager();
	}
	return null;
};
oFF.RsDataCell.prototype.getQueryModel = function()
{
	let cursorResultSet = this.getCursorResultSet();
	if (oFF.notNull(cursorResultSet))
	{
		return cursorResultSet.getQueryModel();
	}
	let classicResultSet = this.getResultSet();
	if (oFF.notNull(classicResultSet))
	{
		return classicResultSet.getQueryModel();
	}
	return null;
};
oFF.RsDataCell.prototype.getResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_classicResultSet);
};
oFF.RsDataCell.prototype.getResultSetContainer = function()
{
	let cursorResultSet = this.getCursorResultSet();
	if (oFF.notNull(cursorResultSet))
	{
		return cursorResultSet.getResultSetContainer();
	}
	let classicResultSet = this.getResultSet();
	if (oFF.notNull(classicResultSet))
	{
		return classicResultSet.getResultSetContainer();
	}
	return null;
};
oFF.RsDataCell.prototype.getRow = function()
{
	return this.m_row;
};
oFF.RsDataCell.prototype.getScalingFactor = function()
{
	return this.m_scalingFactor;
};
oFF.RsDataCell.prototype.getSession = function()
{
	return this.getProcess();
};
oFF.RsDataCell.prototype.getString = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		this.assertValueType(oFF.XValueType.STRING);
		let sv = this.m_xvalue;
		return sv.getString();
	}
	return dataEntry.getString();
};
oFF.RsDataCell.prototype.getStringRepresentation = function()
{
	return oFF.isNull(this.m_xvalue) ? null : this.getXValue().getStringRepresentation();
};
oFF.RsDataCell.prototype.getTime = function()
{
	this.assertValueException();
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		this.assertValueType(oFF.XValueType.TIME);
		return this.m_xvalue;
	}
	return dataEntry.getTime();
};
oFF.RsDataCell.prototype.getUnitIndex = function()
{
	return this.m_complexUnitIndex;
};
oFF.RsDataCell.prototype.getValue = function()
{
	return this.getDouble();
};
oFF.RsDataCell.prototype.getValueException = function()
{
	return this.m_valueException;
};
oFF.RsDataCell.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.RsDataCell.prototype.getXValue = function()
{
	let dataEntry = this.getDataEntry(false);
	return oFF.isNull(dataEntry) ? this.m_xvalue : dataEntry.getXValue();
};
oFF.RsDataCell.prototype.hasPlanningCommands = function()
{
	let dataEntry = this.getDataEntryCheckEnabled(false, false);
	return oFF.notNull(dataEntry) && dataEntry.hasPlanningCommands();
};
oFF.RsDataCell.prototype.isDataEntryEnabled = function()
{
	let queryManager = this.getQueryManager();
	if (oFF.isNull(queryManager))
	{
		return this.m_dataEntryEnabled;
	}
	if (queryManager.supportsInputReadinessStates())
	{
		let inputState = this.getInputReadinessState();
		if (oFF.isNull(inputState))
		{
			return false;
		}
		if (queryManager.isPublicVersionEditPossible() && inputState.hasSingleInputReadinessType(oFF.InputReadinessType.PUBLIC_VERSION))
		{
			return true;
		}
		return inputState.isInputEnabled();
	}
	return this.m_dataEntryEnabled;
};
oFF.RsDataCell.prototype.isHideData = function(queryManager)
{
	let valueException = this.getValueException();
	return valueException === oFF.ValueException.NULL_VALUE || valueException === oFF.ValueException.UNDEFINED || valueException === oFF.ValueException.ERROR || queryManager.getSystemType() === oFF.SystemType.BW && (valueException === oFF.ValueException.OVERFLOW || valueException === oFF.ValueException.DIFF0 || valueException === oFF.ValueException.NO_PRESENTATION) || oFF.notNull(this.m_valueType) && !this.m_valueType.isNumber();
};
oFF.RsDataCell.prototype.isNewValueForced = function()
{
	let dataEntry = this.getDataEntry(false);
	return oFF.isNull(dataEntry) ? false : dataEntry.isNewValueForced();
};
oFF.RsDataCell.prototype.isValueChanged = function()
{
	let dataEntry = this.getDataEntry(false);
	return oFF.isNull(dataEntry) ? false : dataEntry.isValueChanged();
};
oFF.RsDataCell.prototype.isValueLockChanged = function()
{
	let dataEntry = this.getDataEntry(false);
	return oFF.isNull(dataEntry) ? false : dataEntry.isValueLockChanged();
};
oFF.RsDataCell.prototype.isValueLocked = function()
{
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry))
	{
		return this.getOriginalValueLock();
	}
	return dataEntry.isValueLocked();
};
oFF.RsDataCell.prototype.releaseObject = function()
{
	this.m_dataEntry = oFF.XObjectExt.release(this.m_dataEntry);
	this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
	this.m_classicResultSet = oFF.XObjectExt.release(this.m_classicResultSet);
	this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
	this.m_currencyUnit = oFF.XObjectExt.release(this.m_currencyUnit);
	this.m_exceptionSettings = oFF.XObjectExt.release(this.m_exceptionSettings);
	this.m_exceptionPriorities = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_exceptionPriorities);
	this.m_planningCommandIds = oFF.XObjectExt.release(this.m_planningCommandIds);
	this.m_queryDataCellReference = null;
	this.m_valueType = null;
	this.m_formatString = null;
	this.m_maxAlertLevel = null;
	this.m_maxAlertLevelName = null;
	this.m_valueException = null;
	this.m_formattedValue = null;
	this.m_explainQueryName = null;
	this.m_documentId = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.RsDataCell.prototype.reset = function()
{
	this.m_dataEntry = null;
	this.getCurrencyUnitBase().reset();
};
oFF.RsDataCell.prototype.resetAllChanges = function()
{
	if (oFF.notNull(this.m_dataEntry))
	{
		this.m_dataEntry.resetAllChanges();
		this.m_dataEntry = null;
	}
};
oFF.RsDataCell.prototype.resetNewValue = function()
{
	let dataEntry = this.getDataEntry(false);
	if (oFF.notNull(dataEntry))
	{
		dataEntry.resetNewValue();
	}
};
oFF.RsDataCell.prototype.resetValue = oFF.noSupport;
oFF.RsDataCell.prototype.resetValueLock = function()
{
	let dataEntry = this.getDataEntry(false);
	if (oFF.notNull(dataEntry))
	{
		dataEntry.resetValueLock();
	}
};
oFF.RsDataCell.prototype.setColumn = function(column)
{
	this.m_column = column;
};
oFF.RsDataCell.prototype.setDataCellEntryDescription = function(description)
{
	let entryCollection = this.getDataEntryCollectionInternal(true);
	if (oFF.notNull(entryCollection))
	{
		entryCollection.setDataCellEntryDescription(description);
	}
};
oFF.RsDataCell.prototype.setDataEntryEnabled = function(dataEntryEnabled)
{
	this.m_dataEntryEnabled = dataEntryEnabled;
};
oFF.RsDataCell.prototype.setDataEntryGroup = function(dataEntryGroup)
{
	let dataEntry = this.getDataEntry(false);
	if (oFF.isNull(dataEntry) && oFF.XStringUtils.isNotNullAndNotEmpty(dataEntryGroup))
	{
		dataEntry = this.getDataEntry(true);
	}
	if (oFF.notNull(dataEntry))
	{
		dataEntry.setDataEntryGroup(dataEntryGroup);
	}
};
oFF.RsDataCell.prototype.setDate = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setDate(value);
	this.updateValueException(value);
};
oFF.RsDataCell.prototype.setDateTime = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setDateTime(value);
	this.updateValueException(value);
};
oFF.RsDataCell.prototype.setDecimalPlaces = function(decimalPlaces)
{
	this.m_decimalPlaces = decimalPlaces;
};
oFF.RsDataCell.prototype.setDocumentId = function(documentId)
{
	this.m_documentId = documentId;
};
oFF.RsDataCell.prototype.setDouble = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setDouble(value);
	this.setValueException(oFF.ValueException.NORMAL);
};
oFF.RsDataCell.prototype.setExceptionPriorities = function(exceptionPriorities)
{
	if (oFF.isNull(exceptionPriorities))
	{
		this.m_exceptionPriorities = null;
	}
	else
	{
		this.m_exceptionPriorities = exceptionPriorities.createMapByStringCopy();
	}
};
oFF.RsDataCell.prototype.setExceptionSettings = function(exceptionSettings)
{
	if (oFF.isNull(exceptionSettings))
	{
		this.m_exceptionSettings = null;
	}
	else
	{
		this.m_exceptionSettings = exceptionSettings.createMapByStringCopy();
	}
};
oFF.RsDataCell.prototype.setExplainQueryName = function(explainQueryName)
{
	this.m_explainQueryName = explainQueryName;
};
oFF.RsDataCell.prototype.setFormatString = function(formatString)
{
	this.m_formatString = formatString;
};
oFF.RsDataCell.prototype.setFormattedValue = function(value)
{
	this.m_formattedValue = value;
};
oFF.RsDataCell.prototype.setInitialValue = function(value)
{
	this.m_xvalue = value;
};
oFF.RsDataCell.prototype.setInputReadinessIndex = function(index)
{
	this.m_inputReadinessIndex = index;
};
oFF.RsDataCell.prototype.setMaxAlertLevel = function(alertLevel)
{
	this.m_maxAlertLevel = alertLevel;
};
oFF.RsDataCell.prototype.setMaxAlertLevelName = function(name)
{
	this.m_maxAlertLevelName = name;
};
oFF.RsDataCell.prototype.setNewValueExternal = function(valueExternal)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setNewValueExternal(valueExternal);
};
oFF.RsDataCell.prototype.setOriginalValueLock = function(valueLock)
{
	this.m_originalValueLock = valueLock;
};
oFF.RsDataCell.prototype.setPlanningCommand = function(planningCommand)
{
	if (oFF.isNull(planningCommand))
	{
		let existingDataEntry = this.getDataEntry(false);
		if (oFF.notNull(existingDataEntry))
		{
			existingDataEntry.setPlanningCommand(null);
		}
		return;
	}
	let checkDataEntryEnabled = true;
	let commandType = planningCommand.getCommandType();
	if (commandType === oFF.PlanningCommandType.PLANNING_ACTION)
	{
		let planningAction = planningCommand;
		let actionForQueryIdentifier = planningAction.getActionForQueryIdentifier();
		let planningActionType = actionForQueryIdentifier.getActionType();
		if (planningActionType.isTypeOf(oFF.PlanningActionType.QUERY_SINGLE))
		{
			checkDataEntryEnabled = false;
		}
	}
	let dataEntry = this.getDataEntryCheckEnabled(true, checkDataEntryEnabled);
	dataEntry.setPlanningCommand(planningCommand);
};
oFF.RsDataCell.prototype.setPriority = function(priority)
{
	let dataEntry = this.getDataEntryCheckEnabled(true, false);
	dataEntry.setPriority(priority);
};
oFF.RsDataCell.prototype.setProcessingOrder = function(processingOrder)
{
	let dataEntry = this.getDataEntryCheckEnabled(true, false);
	dataEntry.setProcessingOrder(processingOrder);
};
oFF.RsDataCell.prototype.setProcessingType = function(dataEntryProcessingType)
{
	let dataEntry = this.getDataEntryCheckEnabled(true, false);
	dataEntry.setProcessingType(dataEntryProcessingType);
};
oFF.RsDataCell.prototype.setQueryDataCellReference = function(reference)
{
	this.m_queryDataCellReference = reference;
};
oFF.RsDataCell.prototype.setRow = function(row)
{
	this.m_row = row;
};
oFF.RsDataCell.prototype.setScalingFactor = function(scalingFactor)
{
	this.m_scalingFactor = scalingFactor;
};
oFF.RsDataCell.prototype.setString = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setString(value);
	this.setValueException(oFF.isNull(value) ? oFF.ValueException.NULL_VALUE : oFF.ValueException.NORMAL);
};
oFF.RsDataCell.prototype.setTime = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setTime(value);
	this.updateValueException(value);
};
oFF.RsDataCell.prototype.setUnitIndex = function(unitIndex)
{
	this.m_complexUnitIndex = unitIndex;
};
oFF.RsDataCell.prototype.setValueException = function(valueException)
{
	this.m_valueException = valueException;
};
oFF.RsDataCell.prototype.setValueLock = function(lock)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setValueLock(lock);
};
oFF.RsDataCell.prototype.setValueType = function(valueType)
{
	this.m_valueType = valueType;
};
oFF.RsDataCell.prototype.setXValue = function(value)
{
	let dataEntry = this.getDataEntryCheckEnabledWithAssert();
	dataEntry.setXValue(value);
};
oFF.RsDataCell.prototype.setupCopy = function(classicResultSet, origin)
{
	this.m_classicResultSet = oFF.XWeakReferenceUtil.getWeakRef(classicResultSet);
	this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(origin.getCursorResultSet());
	this.m_xvalue = oFF.XObjectExt.cloneIfNotNull(origin.getXValue());
	this.m_column = origin.getColumn();
	this.m_row = origin.getRow();
	this.m_maxAlertLevel = origin.getMaxAlertLevel();
	this.setExceptionSettings(origin.getExceptionSettings());
	this.setExceptionPriorities(origin.getExceptionPriorities());
	this.m_maxAlertLevelName = origin.getMaxAlertLevelName();
	this.m_valueType = origin.getValueType();
	this.m_queryDataCellReference = origin.getQueryDataCellReference();
	this.m_formattedValue = origin.getFormattedValue();
	this.m_formatString = origin.getFormatString();
	this.m_valueException = origin.getValueException();
	this.m_dataEntryEnabled = origin.isDataEntryEnabled();
	this.m_originalValueLock = origin.getOriginalValueLock();
	this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCopy(origin.getCurrencyUnit());
	this.m_decimalPlaces = origin.getDecimalPlaces();
	this.m_scalingFactor = origin.getScalingFactor();
	this.m_complexUnitIndex = origin.getUnitIndex();
	this.m_documentId = origin.getDocumentId();
	this.m_explainQueryName = origin.getExplainQueryName();
	let originPlanningCommandIds = origin.getPlanningCommandIds();
	if (oFF.notNull(originPlanningCommandIds))
	{
		this.m_planningCommandIds = oFF.XList.createWithList(originPlanningCommandIds);
	}
	let readinessState = origin.getInputReadinessState();
	if (oFF.notNull(readinessState))
	{
		this.m_inputReadinessIndex = readinessState.getIndex();
	}
};
oFF.RsDataCell.prototype.setupDefault = function(cursorResultSet)
{
	this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(cursorResultSet);
	this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCurrencyUnit();
	this.m_maxAlertLevel = oFF.AlertLevel.NORMAL;
	this.m_queryDataCellReference = null;
	this.m_valueType = oFF.XValueType.DOUBLE;
	this.m_column = -1;
	this.m_row = -1;
	this.m_complexUnitIndex = -1;
	this.m_documentId = null;
};
oFF.RsDataCell.prototype.toString = function()
{
	return oFF.isNull(this.m_formattedValue) ? "DataCell" : this.m_formattedValue;
};
oFF.RsDataCell.prototype.updateValueException = function(value)
{
	this.setValueException(oFF.isNull(value) ? oFF.ValueException.NULL_VALUE : oFF.ValueException.NORMAL);
};

oFF.RsAxis = function() {};
oFF.RsAxis.prototype = new oFF.XObject();
oFF.RsAxis.prototype._ff_c = "RsAxis";

oFF.RsAxis.create = function(resultset, axisType, cursor)
{
	let object = new oFF.RsAxis();
	object.setupExt(resultset, axisType, cursor);
	return object;
};
oFF.RsAxis.prototype.m_axisType = null;
oFF.RsAxis.prototype.m_cursor = null;
oFF.RsAxis.prototype.m_dataCount = 0;
oFF.RsAxis.prototype.m_indexLookupViaName = null;
oFF.RsAxis.prototype.m_indexLookupViaType = null;
oFF.RsAxis.prototype.m_resultset = null;
oFF.RsAxis.prototype.m_rsDimensions = null;
oFF.RsAxis.prototype.m_tupleElementCount = 0;
oFF.RsAxis.prototype.m_tuples = null;
oFF.RsAxis.prototype.m_tuplesCount = 0;
oFF.RsAxis.prototype.m_tuplesCountTotal = 0;
oFF.RsAxis.prototype.buildFieldIndex = function(buildByPresentation)
{
	if (buildByPresentation)
	{
		this.m_indexLookupViaType = oFF.XHashMapByString.create();
	}
	else
	{
		this.m_indexLookupViaName = oFF.XHashMapByString.create();
	}
	let dimCount = this.m_rsDimensions.size();
	let indexPos = 0;
	for (let idxDim = 0; idxDim < dimCount; idxDim++)
	{
		let dim = this.m_rsDimensions.get(idxDim);
		let resultSetAttributes = dim.getResultSetFields();
		let attCount = resultSetAttributes.size();
		for (let idxField = 0; idxField < attCount; idxField++)
		{
			let attribute = resultSetAttributes.get(idxField);
			let newKey;
			if (buildByPresentation)
			{
				newKey = this.getDimensionPresentationKey(dim.getName(), attribute.getPresentationType());
				this.m_indexLookupViaType.put(newKey, oFF.XIntegerValue.create(indexPos));
			}
			else
			{
				newKey = this.getDimensionFieldKey(dim.getName(), attribute.getName());
				this.m_indexLookupViaName.put(newKey, oFF.XIntegerValue.create(indexPos));
			}
			++indexPos;
		}
	}
};
oFF.RsAxis.prototype.createCursorAccessor = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursor);
};
oFF.RsAxis.prototype.getAllMembers = function(dimension)
{
	let selectName;
	let udhWithThisDimensionIncluded = dimension.getUDHWithThisDimensionIncluded();
	if (oFF.notNull(udhWithThisDimensionIncluded) && udhWithThisDimensionIncluded.isActive())
	{
		selectName = udhWithThisDimensionIncluded.getName();
	}
	else
	{
		selectName = dimension.getName();
	}
	let indexByName = oFF.XCollectionUtils.getIndexByName(this.m_rsDimensions, selectName);
	if (indexByName === -1)
	{
		return null;
	}
	let memberMap = this.setupStorage();
	if (oFF.notNull(memberMap))
	{
		let list = oFF.XList.create();
		list.addAll(memberMap.get(indexByName));
		return list;
	}
	else if (oFF.notNull(this.m_tuples))
	{
		let list2 = oFF.XList.create();
		let tupleSize = this.m_tuples.size();
		for (let idxTuple = 0; idxTuple < tupleSize; idxTuple++)
		{
			list2.add(this.m_tuples.get(idxTuple).getTupleElementByDimension(dimension).getDimensionMember());
		}
		return list2;
	}
	return null;
};
oFF.RsAxis.prototype.getApplication = function()
{
	return this.getResultSet().getApplication();
};
oFF.RsAxis.prototype.getConvenienceCommands = function()
{
	return this.getQueryModel().getConvenienceCommands();
};
oFF.RsAxis.prototype.getDataCount = function()
{
	return this.m_dataCount;
};
oFF.RsAxis.prototype.getDimensionFieldKey = function(dimensionName, fieldName)
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append("[");
	buffer.append(dimensionName);
	buffer.append("].[");
	buffer.append(fieldName);
	buffer.append("]");
	return buffer.toString();
};
oFF.RsAxis.prototype.getDimensionPresentationKey = function(dimensionName, presentationType)
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append("[");
	buffer.append(dimensionName);
	buffer.append("].[");
	buffer.append(presentationType.getName());
	buffer.append("]");
	return buffer.toString();
};
oFF.RsAxis.prototype.getDrillPath = function(tupleIndex, elementIndex)
{
	let tuple = this.getTupleAt(tupleIndex);
	let element = tuple.get(elementIndex);
	return element.getDrillPath();
};
oFF.RsAxis.prototype.getEffectiveRsFields = function()
{
	let effectiveFields = oFF.XList.create();
	let size = this.m_rsDimensions.size();
	for (let i = 0; i < size; i++)
	{
		effectiveFields.addAll(this.m_rsDimensions.get(i).getResultSetFields());
	}
	return effectiveFields;
};
oFF.RsAxis.prototype.getFieldIndex = function(dimensionName, fieldName)
{
	if (oFF.isNull(this.m_indexLookupViaName))
	{
		this.buildFieldIndex(false);
	}
	let someKey = this.getDimensionFieldKey(dimensionName, fieldName);
	let indexObj = this.m_indexLookupViaName.getByKey(someKey);
	return oFF.isNull(indexObj) ? -1 : indexObj.getInteger();
};
oFF.RsAxis.prototype.getFieldIndexViaPresentation = function(dimensionName, presentationType)
{
	if (oFF.isNull(this.m_indexLookupViaType))
	{
		this.buildFieldIndex(true);
	}
	let someKey = this.getDimensionPresentationKey(dimensionName, presentationType);
	let indexObj = this.m_indexLookupViaType.getByKey(someKey);
	return oFF.isNull(indexObj) ? -1 : indexObj.getInteger();
};
oFF.RsAxis.prototype.getNewLineCollection = function()
{
	if (this.getType() !== oFF.AxisType.ROWS)
	{
		return null;
	}
	if (oFF.isNull(this.m_resultset))
	{
		return null;
	}
	let resultSetContainer = this.getResultSet().getResultSetContainer();
	return oFF.isNull(resultSetContainer) ? null : resultSetContainer.getNewLineCollection();
};
oFF.RsAxis.prototype.getProcess = function()
{
	return this.getApplication().getProcess();
};
oFF.RsAxis.prototype.getQueryManager = function()
{
	return this.getResultSet().getQueryManager();
};
oFF.RsAxis.prototype.getQueryModel = function()
{
	return this.getResultSet().getQueryModel();
};
oFF.RsAxis.prototype.getResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_resultset);
};
oFF.RsAxis.prototype.getRsAxisDef = function()
{
	return this;
};
oFF.RsAxis.prototype.getRsDimensions = function()
{
	return this.m_rsDimensions;
};
oFF.RsAxis.prototype.getSession = function()
{
	return this.getApplication().getSession();
};
oFF.RsAxis.prototype.getTupleAt = function(index)
{
	this.setupStorage();
	return this.m_tuples.get(index);
};
oFF.RsAxis.prototype.getTupleElementsCount = function()
{
	return this.m_tupleElementCount;
};
oFF.RsAxis.prototype.getTuplesCount = function()
{
	return this.m_tuplesCount;
};
oFF.RsAxis.prototype.getTuplesCountTotal = function()
{
	return this.m_tuplesCountTotal;
};
oFF.RsAxis.prototype.getTuplesIterator = function()
{
	this.setupStorage();
	return this.m_tuples.getIterator();
};
oFF.RsAxis.prototype.getType = function()
{
	return this.m_axisType;
};
oFF.RsAxis.prototype.releaseObject = function()
{
	this.m_tuples = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tuples);
	this.m_indexLookupViaName = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_indexLookupViaName);
	this.m_indexLookupViaType = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_indexLookupViaType);
	this.m_resultset = null;
	this.m_axisType = null;
	this.m_cursor = null;
	this.m_dataCount = -1;
	this.m_tuplesCount = -1;
	this.m_tuplesCountTotal = -1;
	this.m_tupleElementCount = -1;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsAxis.prototype.setDrillState = function(tupleIndex, elementIndex, drillState)
{
	let tuple = this.getTupleAt(tupleIndex);
	let element = tuple.get(elementIndex);
	element.setNextDrillState(drillState);
};
oFF.RsAxis.prototype.setParentNodes = function()
{
	if (this.getTuplesCount() > 0)
	{
		let cursor = this.createCursorAccessor();
		cursor.setTupleCursorToIndex(0);
		cursor.setTupleCursorBeforeStart();
		for (let idxTuple = 0; cursor.hasNextTuple(); idxTuple++)
		{
			cursor.nextTuple();
			for (let idxTupleElement = 0; cursor.hasNextTupleElement(); idxTupleElement++)
			{
				cursor.nextTupleElement();
				let parentIndex = cursor.getParentNodeIndex();
				if (parentIndex > -1)
				{
					let tupleElement = this.m_tuples.get(idxTuple).get(idxTupleElement);
					tupleElement.setParentNode(this.m_tuples.get(parentIndex).get(idxTupleElement));
				}
			}
		}
	}
};
oFF.RsAxis.prototype.setResultSet = function(resultSet)
{
	this.m_resultset = oFF.XWeakReferenceUtil.getWeakRef(resultSet);
};
oFF.RsAxis.prototype.setupExt = function(resultset, axisType, cursor)
{
	this.setResultSet(resultset);
	this.m_axisType = axisType;
	this.m_cursor = oFF.XWeakReferenceUtil.getWeakRef(cursor);
	this.m_rsDimensions = cursor.getRsDimensions();
	this.m_tupleElementCount = cursor.getTupleElementsCount();
	this.m_tuplesCount = cursor.getTuplesCount();
	this.m_tuplesCountTotal = cursor.getTuplesCountTotal();
	this.m_dataCount = cursor.getDataCount();
};
oFF.RsAxis.prototype.setupStorage = function()
{
	let memberMap = null;
	if (oFF.isNull(this.m_tuples))
	{
		this.m_tuples = oFF.XList.create();
		let cursor = this.createCursorAccessor();
		cursor.setTupleCursorBeforeStart();
		cursor.loadDimensionStructureMembers();
		let dimensionsOnAxis = cursor.getTupleElementsCount();
		memberMap = oFF.XArray.create(dimensionsOnAxis);
		for (let dimIndex = 0; dimIndex < dimensionsOnAxis; dimIndex++)
		{
			let dimMemberMap = oFF.XLinkedHashMapByString.create();
			memberMap.set(dimIndex, dimMemberMap);
		}
		let elements = oFF.XArray.create(dimensionsOnAxis);
		for (let positionOnAxis = 0; cursor.hasNextTuple(); positionOnAxis++)
		{
			cursor.nextTuple();
			let axisTuple = oFF.RsAxisTuple.create(this, positionOnAxis);
			for (let tupleElementPosition = 0; cursor.hasNextTupleElement(); tupleElementPosition++)
			{
				cursor.nextTupleElement();
				let currentMemberType = cursor.getDimensionMemberType();
				let isResultMember = currentMemberType.isRequestedInResultStructure();
				let hierarchyNavigationKey = cursor.getValueOfHierarchyNavigationKey();
				let dimensionMemberKey;
				if (cursor.getDimensionMemberNameValueException() === oFF.ValueException.NULL_VALUE)
				{
					dimensionMemberKey = "$$NullKey$$";
				}
				else if (!isResultMember && oFF.notNull(hierarchyNavigationKey))
				{
					dimensionMemberKey = hierarchyNavigationKey;
				}
				else
				{
					dimensionMemberKey = cursor.getDimensionMemberName();
				}
				let lastTupleElement = elements.get(tupleElementPosition);
				if (oFF.notNull(lastTupleElement))
				{
					let lastDimensionMember = lastTupleElement.getDimensionMember();
					let lastDimMemberName = lastDimensionMember.getName();
					let isNewMemberName = !oFF.XString.isEqual(dimensionMemberKey, lastDimMemberName);
					let lastDimMemberType = lastDimensionMember.getMemberType();
					let isNewMemberType = lastDimMemberType !== currentMemberType;
					if (isNewMemberName || isNewMemberType || lastDimensionMember.getDimensionMemberNameValueException() === oFF.ValueException.NULL_VALUE)
					{
						lastTupleElement = null;
					}
					if (isNewMemberType && !isNewMemberName && isResultMember)
					{
						dimensionMemberKey = currentMemberType.getName();
					}
				}
				else
				{
					if (isResultMember)
					{
						dimensionMemberKey = currentMemberType.getName();
					}
				}
				if (oFF.isNull(lastTupleElement))
				{
					let allResponseMembers = memberMap.get(tupleElementPosition);
					let dimensionMember = allResponseMembers.getByKey(dimensionMemberKey);
					if (oFF.isNull(dimensionMember))
					{
						dimensionMember = cursor.createDimensionMemberFromCurrentPosition();
						allResponseMembers.put(dimensionMemberKey, dimensionMember);
					}
					let nodeId = cursor.getNodeId();
					let rsDimension = cursor.getRsDimensionAtCurrentPosition();
					if (currentMemberType.isTypeOf(oFF.MemberType.RESULT) && oFF.XStringUtils.isNullOrEmpty(nodeId) || rsDimension.getStructureMember(nodeId) !== null && rsDimension.getStructureMember(nodeId).getAliasName() !== null)
					{
						nodeId = cursor.getDimensionMemberName();
					}
					let isCorrectDrillState = this.getResultSet().getSession().hasFeature(oFF.FeatureToggleOlap.CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET);
					let tupleElement = oFF.RsAxisTupleElement.create(this, nodeId, dimensionMember, tupleElementPosition, cursor.getDrillState(), cursor.getDisplayLevel(), cursor.getChildCount(), cursor.getAbsoluteLevel(), isCorrectDrillState);
					tupleElement.setFirstTuple(axisTuple);
					tupleElement.setExceptionName(cursor.getExceptionName());
					tupleElement.setAlertLevel(cursor.getAlertLevel());
					tupleElement.setComplexUnit(cursor.getComplexUnit());
					tupleElement.setCurrencyUnit(cursor.getCurrencyUnit());
					tupleElement.setDecimalPlaces(cursor.getDecimalPlaces());
					tupleElement.setScalingFactor(cursor.getScalingFactor());
					tupleElement.setCellValueType(cursor.getCellValueType());
					tupleElement.setLongestCellValueRounded(cursor.getLongestCellValueRounded());
					tupleElement.setLongestCellValueFormatted(cursor.getLongestCellValueFormatted());
					tupleElement.setDrillGroupDimension(cursor.getDrillGroupDimensionAtCurrentPosition());
					elements.set(tupleElementPosition, tupleElement);
					for (let k = tupleElementPosition + 1; k < dimensionsOnAxis; k++)
					{
						elements.set(k, null);
					}
				}
			}
			axisTuple.setTupleElements(elements.createArrayCopy());
			this.m_tuples.add(axisTuple);
		}
		this.setParentNodes();
	}
	return memberMap;
};
oFF.RsAxis.prototype.toString = function()
{
	return this.getType().toString();
};

oFF.RsCursorFieldValue = function() {};
oFF.RsCursorFieldValue.prototype = new oFF.XObject();
oFF.RsCursorFieldValue.prototype._ff_c = "RsCursorFieldValue";

oFF.RsCursorFieldValue.create = function(field, rsField)
{
	let object = new oFF.RsCursorFieldValue();
	object.m_field = field;
	object.m_rsField = rsField;
	return object;
};
oFF.RsCursorFieldValue.prototype.m_booleanValue = null;
oFF.RsCursorFieldValue.prototype.m_currentValue = null;
oFF.RsCursorFieldValue.prototype.m_dateTimeValue = null;
oFF.RsCursorFieldValue.prototype.m_dateValue = null;
oFF.RsCursorFieldValue.prototype.m_decimalFloatValue = null;
oFF.RsCursorFieldValue.prototype.m_doubleValue = null;
oFF.RsCursorFieldValue.prototype.m_errorValue = null;
oFF.RsCursorFieldValue.prototype.m_field = null;
oFF.RsCursorFieldValue.prototype.m_formattedValue = null;
oFF.RsCursorFieldValue.prototype.m_intValue = null;
oFF.RsCursorFieldValue.prototype.m_lineStringValue = null;
oFF.RsCursorFieldValue.prototype.m_longValue = null;
oFF.RsCursorFieldValue.prototype.m_multiLineStringValue = null;
oFF.RsCursorFieldValue.prototype.m_multiPointValue = null;
oFF.RsCursorFieldValue.prototype.m_multiPolygonValue = null;
oFF.RsCursorFieldValue.prototype.m_pointValue = null;
oFF.RsCursorFieldValue.prototype.m_polygonValue = null;
oFF.RsCursorFieldValue.prototype.m_propertiesValue = null;
oFF.RsCursorFieldValue.prototype.m_rsField = null;
oFF.RsCursorFieldValue.prototype.m_stringValue = null;
oFF.RsCursorFieldValue.prototype.m_structureListValue = null;
oFF.RsCursorFieldValue.prototype.m_structureValue = null;
oFF.RsCursorFieldValue.prototype.m_timeValue = null;
oFF.RsCursorFieldValue.prototype.m_timespanValue = null;
oFF.RsCursorFieldValue.prototype.m_udhKey = null;
oFF.RsCursorFieldValue.prototype.m_valueException = null;
oFF.RsCursorFieldValue.prototype.createFieldValueFromCurrentPosition = function()
{
	if (oFF.isNull(this.m_currentValue))
	{
		return oFF.QFactory.createFieldValueEmpty(this.m_field, this.m_valueException, this.m_formattedValue);
	}
	let copy = this.getValue().clone();
	return oFF.QFactory.createFieldValue(this.m_field, this.m_valueException, copy, this.m_formattedValue);
};
oFF.RsCursorFieldValue.prototype.getBoolean = function()
{
	return oFF.isNull(this.m_booleanValue) ? false : this.m_booleanValue.getBoolean();
};
oFF.RsCursorFieldValue.prototype.getDate = function()
{
	return this.m_dateValue;
};
oFF.RsCursorFieldValue.prototype.getDateTime = function()
{
	return this.m_dateTimeValue;
};
oFF.RsCursorFieldValue.prototype.getDecFloat = function()
{
	return this.m_decimalFloatValue;
};
oFF.RsCursorFieldValue.prototype.getDimensionMember = oFF.noSupport;
oFF.RsCursorFieldValue.prototype.getDouble = function()
{
	return oFF.isNull(this.m_doubleValue) ? 0.0 : this.m_doubleValue.getDouble();
};
oFF.RsCursorFieldValue.prototype.getErrorValue = function()
{
	return this.m_errorValue;
};
oFF.RsCursorFieldValue.prototype.getField = function()
{
	return this.m_field;
};
oFF.RsCursorFieldValue.prototype.getFormattedValue = function()
{
	if (oFF.notNull(this.m_field) && this.m_field.getPresentationType() === oFF.PresentationType.URL)
	{
		return oFF.XHttpUtils.decodeURIComponent(this.m_formattedValue);
	}
	if (oFF.notNull(this.m_field) && this.m_field.getPresentationType() === oFF.PresentationType.BLOB && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_formattedValue))
	{
		let queryManager = this.m_field.getQueryManager();
		let connection = queryManager.getConnection();
		let xxlPathWithSchemeHostPortPrefix = connection.getXXLPathWithSchemeHostPortPrefix();
		return oFF.XStringUtils.concatenate2(xxlPathWithSchemeHostPortPrefix, this.m_formattedValue);
	}
	return this.m_formattedValue;
};
oFF.RsCursorFieldValue.prototype.getGeometry = function()
{
	return this.getValue();
};
oFF.RsCursorFieldValue.prototype.getInteger = function()
{
	return oFF.isNull(this.m_intValue) ? 0 : this.m_intValue.getInteger();
};
oFF.RsCursorFieldValue.prototype.getLineString = function()
{
	return this.m_lineStringValue;
};
oFF.RsCursorFieldValue.prototype.getLong = function()
{
	return oFF.isNull(this.m_longValue) ? 0 : this.m_longValue.getLong();
};
oFF.RsCursorFieldValue.prototype.getMultiLineString = function()
{
	return this.m_multiLineStringValue;
};
oFF.RsCursorFieldValue.prototype.getMultiPoint = function()
{
	return this.m_multiPointValue;
};
oFF.RsCursorFieldValue.prototype.getMultiPolygon = function()
{
	return this.m_multiPolygonValue;
};
oFF.RsCursorFieldValue.prototype.getNull = oFF.noSupport;
oFF.RsCursorFieldValue.prototype.getPoint = function()
{
	return this.m_pointValue;
};
oFF.RsCursorFieldValue.prototype.getPolygon = function()
{
	return this.m_polygonValue;
};
oFF.RsCursorFieldValue.prototype.getPropertiesValue = function()
{
	return this.m_propertiesValue;
};
oFF.RsCursorFieldValue.prototype.getRsField = function()
{
	return this.m_rsField;
};
oFF.RsCursorFieldValue.prototype.getString = function()
{
	let value = this.getValue();
	return oFF.notNull(value) ? value.toString() : this.m_formattedValue;
};
oFF.RsCursorFieldValue.prototype.getStructureListValue = function()
{
	return this.m_structureListValue;
};
oFF.RsCursorFieldValue.prototype.getStructureValue = function()
{
	return this.m_structureValue;
};
oFF.RsCursorFieldValue.prototype.getTime = function()
{
	return this.m_timeValue;
};
oFF.RsCursorFieldValue.prototype.getTimeSpan = function()
{
	return this.m_timespanValue;
};
oFF.RsCursorFieldValue.prototype.getUdhKey = function()
{
	return this.m_udhKey;
};
oFF.RsCursorFieldValue.prototype.getValue = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_currentValue);
};
oFF.RsCursorFieldValue.prototype.getValueException = function()
{
	return this.m_valueException;
};
oFF.RsCursorFieldValue.prototype.getValueType = function()
{
	return this.m_field.getValueType();
};
oFF.RsCursorFieldValue.prototype.hasValue = oFF.noSupport;
oFF.RsCursorFieldValue.prototype.parseString = oFF.noSupport;
oFF.RsCursorFieldValue.prototype.releaseObject = function()
{
	this.m_field = null;
	this.m_rsField = oFF.XObjectExt.release(this.m_rsField);
	this.m_intValue = oFF.XObjectExt.release(this.m_intValue);
	this.m_longValue = oFF.XObjectExt.release(this.m_longValue);
	this.m_doubleValue = oFF.XObjectExt.release(this.m_doubleValue);
	this.m_decimalFloatValue = oFF.XObjectExt.release(this.m_decimalFloatValue);
	this.m_booleanValue = oFF.XObjectExt.release(this.m_booleanValue);
	this.m_timeValue = oFF.XObjectExt.release(this.m_timeValue);
	this.m_stringValue = oFF.XObjectExt.release(this.m_stringValue);
	this.m_udhKey = oFF.XObjectExt.release(this.m_udhKey);
	this.m_formattedValue = null;
	this.m_valueException = null;
	this.m_currentValue = null;
	this.m_dateValue = oFF.XObjectExt.release(this.m_dateValue);
	this.m_errorValue = oFF.XObjectExt.release(this.m_errorValue);
	this.m_dateTimeValue = oFF.XObjectExt.release(this.m_dateTimeValue);
	this.m_timespanValue = oFF.XObjectExt.release(this.m_timespanValue);
	this.m_propertiesValue = oFF.XObjectExt.release(this.m_propertiesValue);
	this.m_structureValue = oFF.XObjectExt.release(this.m_structureValue);
	this.m_lineStringValue = oFF.XObjectExt.release(this.m_lineStringValue);
	this.m_multiLineStringValue = oFF.XObjectExt.release(this.m_multiLineStringValue);
	this.m_polygonValue = oFF.XObjectExt.release(this.m_polygonValue);
	this.m_multiPolygonValue = oFF.XObjectExt.release(this.m_multiPolygonValue);
	this.m_pointValue = oFF.XObjectExt.release(this.m_pointValue);
	this.m_multiPointValue = oFF.XObjectExt.release(this.m_multiPointValue);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RsCursorFieldValue.prototype.setBoolean = function(value)
{
	if (oFF.isNull(this.m_booleanValue))
	{
		this.m_booleanValue = oFF.XBooleanValue.create(value);
	}
	else
	{
		this.m_booleanValue.setBoolean(value);
	}
	this.setCurrentValue(this.m_booleanValue);
};
oFF.RsCursorFieldValue.prototype.setCurrentValue = function(currentValue)
{
	this.m_currentValue = oFF.XWeakReferenceUtil.getWeakRef(currentValue);
};
oFF.RsCursorFieldValue.prototype.setDate = function(value)
{
	this.m_dateValue = value;
	this.setCurrentValue(value);
};
oFF.RsCursorFieldValue.prototype.setDateTime = function(value)
{
	this.m_dateTimeValue = value;
	this.setCurrentValue(this.m_dateTimeValue);
};
oFF.RsCursorFieldValue.prototype.setDecFloat = function(value)
{
	this.m_decimalFloatValue = value;
	this.setCurrentValue(this.m_decimalFloatValue);
};
oFF.RsCursorFieldValue.prototype.setDouble = function(value)
{
	if (oFF.isNull(this.m_doubleValue))
	{
		this.m_doubleValue = oFF.XDoubleValue.create(value);
	}
	else
	{
		this.m_doubleValue.setDouble(value);
	}
	this.setCurrentValue(this.m_doubleValue);
};
oFF.RsCursorFieldValue.prototype.setErrorValue = function(value)
{
	this.m_errorValue = value;
	this.setCurrentValue(this.m_errorValue);
};
oFF.RsCursorFieldValue.prototype.setFormattedValue = function(formattedValue)
{
	this.m_formattedValue = formattedValue;
};
oFF.RsCursorFieldValue.prototype.setInteger = function(value)
{
	if (oFF.isNull(this.m_intValue))
	{
		this.m_intValue = oFF.XIntegerValue.create(value);
	}
	else
	{
		this.m_intValue.setInteger(value);
	}
	this.setCurrentValue(this.m_intValue);
};
oFF.RsCursorFieldValue.prototype.setLineString = function(value)
{
	this.m_lineStringValue = value;
	this.setCurrentValue(this.m_lineStringValue);
};
oFF.RsCursorFieldValue.prototype.setLong = function(value)
{
	if (oFF.isNull(this.m_longValue))
	{
		this.m_longValue = oFF.XLongValue.create(value);
	}
	else
	{
		this.m_longValue.setLong(value);
	}
	this.setCurrentValue(this.m_longValue);
};
oFF.RsCursorFieldValue.prototype.setMultiLineString = function(value)
{
	this.m_multiLineStringValue = value;
	this.setCurrentValue(this.m_multiLineStringValue);
};
oFF.RsCursorFieldValue.prototype.setMultiPoint = function(value)
{
	this.m_multiPointValue = value;
	this.setCurrentValue(this.m_multiPointValue);
};
oFF.RsCursorFieldValue.prototype.setMultiPolygon = function(value)
{
	this.m_multiPolygonValue = value;
	this.setCurrentValue(this.m_multiPolygonValue);
};
oFF.RsCursorFieldValue.prototype.setNullByType = function(nullValueType)
{
	this.setCurrentValue(oFF.XValueAccess.createWithType(nullValueType).getValue());
};
oFF.RsCursorFieldValue.prototype.setPoint = function(value)
{
	this.m_pointValue = value;
	this.setCurrentValue(this.m_pointValue);
};
oFF.RsCursorFieldValue.prototype.setPolygon = function(value)
{
	this.m_polygonValue = value;
	this.setCurrentValue(this.m_polygonValue);
};
oFF.RsCursorFieldValue.prototype.setPropertiesValue = function(properties)
{
	this.m_propertiesValue = properties;
	this.setCurrentValue(this.m_propertiesValue);
};
oFF.RsCursorFieldValue.prototype.setString = function(value)
{
	if (oFF.isNull(this.m_stringValue))
	{
		this.m_stringValue = oFF.XStringValue.create(value);
	}
	else
	{
		this.m_stringValue.setString(value);
	}
	this.setCurrentValue(this.m_stringValue);
};
oFF.RsCursorFieldValue.prototype.setStructureListValue = function(value)
{
	this.m_structureListValue = value;
	this.setCurrentValue(this.m_structureListValue);
};
oFF.RsCursorFieldValue.prototype.setStructureValue = function(value)
{
	this.m_structureValue = value;
	this.setCurrentValue(this.m_structureValue);
};
oFF.RsCursorFieldValue.prototype.setTime = function(value)
{
	this.m_timeValue = value;
	this.setCurrentValue(this.m_timeValue);
};
oFF.RsCursorFieldValue.prototype.setTimeSpan = function(value)
{
	this.m_timespanValue = value;
	this.setCurrentValue(this.m_timespanValue);
};
oFF.RsCursorFieldValue.prototype.setUdhKey = function(udhKey)
{
	this.m_udhKey = udhKey;
};
oFF.RsCursorFieldValue.prototype.setValueException = function(valueException)
{
	this.m_valueException = valueException;
};
oFF.RsCursorFieldValue.prototype.setXValue = function(value)
{
	this.copyFrom(oFF.XValueAccess.createWithValue(value), null);
};

oFF.RsDefModelComponent = function() {};
oFF.RsDefModelComponent.prototype = new oFF.DfQContext();
oFF.RsDefModelComponent.prototype._ff_c = "RsDefModelComponent";

oFF.RsDefModelComponent.prototype.m_name = null;
oFF.RsDefModelComponent.prototype.m_text = null;
oFF.RsDefModelComponent.prototype.canHaveExtensions = function()
{
	return false;
};
oFF.RsDefModelComponent.prototype.canMaterializeCompleteObject = function()
{
	return false;
};
oFF.RsDefModelComponent.prototype.cloneOlapComponent = oFF.noSupport;
oFF.RsDefModelComponent.prototype.deserializeExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.deserializeFromContent = oFF.noSupport;
oFF.RsDefModelComponent.prototype.deserializeFromElementExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.deserializeNewComponentExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.deserializeNewComponentFromElementExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getChangedProperties = function()
{
	return null;
};
oFF.RsDefModelComponent.prototype.getChangedPropertiesFromModellerMetadata = function()
{
	return null;
};
oFF.RsDefModelComponent.prototype.getChangedPropertiesInDetail = function()
{
	return null;
};
oFF.RsDefModelComponent.prototype.getChildren = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getChildrenIterator = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getContentConstant = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getContentElement = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getDisplayDescription = function()
{
	let text = this.getText();
	return oFF.XStringUtils.isNotNullAndNotEmpty(text) ? text : this.getName();
};
oFF.RsDefModelComponent.prototype.getDisplayName = function()
{
	return this.getName();
};
oFF.RsDefModelComponent.prototype.getExtensionByName = function(key)
{
	return null;
};
oFF.RsDefModelComponent.prototype.getExtensions = function()
{
	return null;
};
oFF.RsDefModelComponent.prototype.getIndexedChildren = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getMetaValue = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getModCounter = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getName = function()
{
	return this.m_name;
};
oFF.RsDefModelComponent.prototype.getNamedChildren = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getOlapComponentType = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getParent = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getStorageGroupName = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getStorageName = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getStorageObjectName = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getTagValue = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getTagging = oFF.noSupport;
oFF.RsDefModelComponent.prototype.getText = function()
{
	return this.m_text;
};
oFF.RsDefModelComponent.prototype.hasPropertyChanged = function(propertyName)
{
	return false;
};
oFF.RsDefModelComponent.prototype.hasPropertyChangedForInAData = function(propertyName)
{
	return false;
};
oFF.RsDefModelComponent.prototype.isComponentNode = oFF.noSupport;
oFF.RsDefModelComponent.prototype.isEventingStopped = oFF.noSupport;
oFF.RsDefModelComponent.prototype.isLeaf = oFF.noSupport;
oFF.RsDefModelComponent.prototype.isNode = oFF.noSupport;
oFF.RsDefModelComponent.prototype.isRRIAffectedComponent = function()
{
	return false;
};
oFF.RsDefModelComponent.prototype.processDeserializeExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.queueEventing = oFF.noSupport;
oFF.RsDefModelComponent.prototype.reconfigure = function(procedure)
{
	procedure();
};
oFF.RsDefModelComponent.prototype.registerChangedListener = oFF.noSupport;
oFF.RsDefModelComponent.prototype.releaseObject = function()
{
	this.m_text = null;
	this.m_name = null;
	oFF.DfQContext.prototype.releaseObject.call( this );
};
oFF.RsDefModelComponent.prototype.resumeEventing = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serialize = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serializeToContent = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serializeToContentExt = function(modelFormat, capabilities)
{
	return null;
};
oFF.RsDefModelComponent.prototype.serializeToElement = function(modelFormat)
{
	return this.serializeToElementExt(modelFormat, null);
};
oFF.RsDefModelComponent.prototype.serializeToElementExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serializeToFormat = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serializeToString = oFF.noSupport;
oFF.RsDefModelComponent.prototype.serializeToStringExt = oFF.noSupport;
oFF.RsDefModelComponent.prototype.setChangedProperties = oFF.noSupport;
oFF.RsDefModelComponent.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.RsDefModelComponent.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.RsDefModelComponent.prototype.stopEventing = oFF.noSupport;
oFF.RsDefModelComponent.prototype.toString = function()
{
	return this.m_name;
};
oFF.RsDefModelComponent.prototype.unregisterChangedListener = oFF.noSupport;

oFF.LovProcess = function() {};
oFF.LovProcess.prototype = new oFF.DfRsSyncAction();
oFF.LovProcess.prototype._ff_c = "LovProcess";

oFF.LovProcess.VALUEHELP_RESULT_FILTER_NAME = "LOVProcessValueHelpResultFilter";
oFF.LovProcess.create = function(queryManager, lovProcessConfig)
{
	oFF.XObjectExt.assertNotNullExt(queryManager, "QueryManager must not be null");
	oFF.XObjectExt.assertNotNullExt(lovProcessConfig, "LOV capabilities must not be null");
	let lovProcess = new oFF.LovProcess();
	lovProcess.m_lovProcessConfig = lovProcessConfig;
	lovProcess.setupAction(null, null, null, queryManager);
	return lovProcess;
};
oFF.LovProcess.prototype.m_dimFilter = null;
oFF.LovProcess.prototype.m_lovProcessConfig = null;
oFF.LovProcess.prototype.m_lovSortRestoreSettings = null;
oFF.LovProcess.prototype.m_offsetRows = 0;
oFF.LovProcess.prototype.m_skipEntries = 0;
oFF.LovProcess.prototype.m_topEntries = 0;
oFF.LovProcess.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onQueryExecuted(extResult, data, customIdentifier);
};
oFF.LovProcess.prototype.deserializeExt = function(modelFormat, expression)
{
	return null;
};
oFF.LovProcess.prototype.deserializeFromContent = function(content)
{
	return null;
};
oFF.LovProcess.prototype.deserializeFromElementExt = function(modelFormat, element)
{
	return null;
};
oFF.LovProcess.prototype.deserializeNewComponentExt = function(componentType, modelFormat, expression)
{
	return null;
};
oFF.LovProcess.prototype.deserializeNewComponentFromElementExt = function(componentType, modelFormat, element)
{
	return null;
};
oFF.LovProcess.prototype.execute = function(syncType, listener, customIdentifier)
{
	this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.LovProcess.prototype.executeRequest = function()
{
	let queryManager = this.getQueryManager();
	if (oFF.notNull(queryManager))
	{
		this.prepareQuery();
		if (this.m_lovProcessConfig.requiresValueHelpRequest())
		{
			oFF.LovProcessValueHelp.processValueHelpExecution(this, this.getActiveSyncType());
		}
		else if (this.m_lovProcessConfig.requiresResultSetRequest())
		{
			queryManager.processQueryExecutionAsLovProcess(this.m_lovProcessConfig, this.getActiveSyncType(), this, null);
		}
	}
};
oFF.LovProcess.prototype.getConfig = function()
{
	return this.m_lovProcessConfig;
};
oFF.LovProcess.prototype.getDimension = function()
{
	return this.m_lovProcessConfig.getDimension();
};
oFF.LovProcess.prototype.isResultSetForcedForSort = function()
{
	let isBw = this.getQueryManager() !== null && this.getQueryManager().getConvenienceCommands().isBw();
	let isResultSetForcedForSort = this.m_lovProcessConfig.requiresResultSetRequest() && this.m_lovProcessConfig.isResultSetForcedForSort();
	return isBw && isResultSetForcedForSort;
};
oFF.LovProcess.prototype.onProcessExecuted = function(extResult)
{
	this.revertQueryChanges();
	this.addAllMessages(extResult);
	if (this.isValid())
	{
		this.setData(extResult.getData());
	}
	this.endSync();
};
oFF.LovProcess.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (!this.isReleased())
	{
		let queryModel = this.getQueryModel();
		let filter = oFF.notNull(queryModel) ? queryModel.getFilter() : null;
		let valueHelpResultFilter = oFF.notNull(filter) ? filter.getLinkedFilter(oFF.LovProcess.VALUEHELP_RESULT_FILTER_NAME) : null;
		if (oFF.notNull(valueHelpResultFilter))
		{
			filter.stopEventing();
			filter.linkFilter(oFF.LovProcess.VALUEHELP_RESULT_FILTER_NAME, null);
			oFF.XObjectExt.release(valueHelpResultFilter);
			if (oFF.notNull(this.m_dimFilter))
			{
				filter.getDynamicFilter().getCartesianProductWithDefault().add(this.m_dimFilter);
				this.m_dimFilter = null;
			}
			filter.resumeEventing();
		}
		this.onProcessExecuted(extResult);
	}
};
oFF.LovProcess.prototype.onValuehelpExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (!this.isReleased() && oFF.notNull(this.m_lovProcessConfig))
	{
		let queryManager = this.getQueryManager();
		if (oFF.notNull(queryManager) && this.m_lovProcessConfig.requiresResultSetRequest() && extResult.isValid() && oFF.notNull(resultSetContainer))
		{
			let filter = queryManager.getQueryModel().getFilter();
			let dynamicFilter = filter.getDynamicFilter();
			filter.stopEventing();
			this.m_dimFilter = dynamicFilter.isCartesianProduct() ? this.getDimension().getFilter() : null;
			if (oFF.notNull(this.m_dimFilter))
			{
				dynamicFilter.removeFilterById(this.m_dimFilter.getUniqueId());
			}
			filter.linkFilterElement(oFF.LovProcess.VALUEHELP_RESULT_FILTER_NAME, oFF.LovProcessValueHelp.createFilterFromValueHelpResult(resultSetContainer, this.m_lovProcessConfig));
			filter.resumeEventing();
			queryManager.processQueryExecutionAsLovProcess(this.m_lovProcessConfig, this.getActiveSyncType(), this, null);
		}
		else
		{
			if (this.m_lovProcessConfig.isUseActiveResultSetContainer() && oFF.notNull(queryManager) && oFF.notNull(resultSetContainer) && !queryManager.getActiveResultSetContainer().getSyncState().isTypeOf(oFF.SyncState.PROCESSING))
			{
				queryManager.setActiveResultSetContainer(resultSetContainer);
			}
			this.onProcessExecuted(extResult);
		}
	}
};
oFF.LovProcess.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	this.addAllMessages(extResult);
	if (!this.isValid())
	{
		this.endSync();
		return;
	}
	if (oFF.notNull(customIdentifier))
	{
		customIdentifier.restore(this.getDimension());
		oFF.XObjectExt.release(customIdentifier);
	}
	this.executeRequest();
};
oFF.LovProcess.prototype.prepareQuery = function()
{
	let queryManager = this.getQueryManager();
	let dimension = this.getDimension();
	dimension.stopEventing();
	if (oFF.notNull(queryManager) && queryManager.getConvenienceCommands().isHana())
	{
		let maxRows = queryManager.getMaxRows();
		this.m_offsetRows = queryManager.getOffsetRows();
		this.m_skipEntries = dimension.getSkipEntries();
		this.m_topEntries = dimension.getTopEntries();
		queryManager.getActiveResultSetContainer().setOffsetRows(0);
		dimension.setSkipEntries(this.m_offsetRows);
		dimension.setTopEntries(maxRows > 0 ? maxRows + 1 : -1);
	}
	if (oFF.notNull(queryManager) && queryManager.getConvenienceCommands().isBw() && this.isResultSetForcedForSort())
	{
		this.m_lovSortRestoreSettings = oFF.LovSortRestoreSettings.create(dimension, !this.m_lovProcessConfig.isAutomaticValueHelpReadModeConfigurationEnabled(), !this.m_lovProcessConfig.isAutomaticValueHelpDrillLevelConfigurationEnabled());
	}
	dimension.resumeEventing();
};
oFF.LovProcess.prototype.processDeserializeExt = function(syncType, componentImportedListener, customIdentifier, modelFormat, expression)
{
	return null;
};
oFF.LovProcess.prototype.processSynchronization = function(syncType)
{
	if (!this.m_lovProcessConfig.isValid())
	{
		this.addAllMessages(this.m_lovProcessConfig);
		this.endSync();
		return false;
	}
	let queryManager = this.getQueryManager();
	if (oFF.isNull(queryManager) || !this.m_lovProcessConfig.requiresValueHelpRequest() && !this.m_lovProcessConfig.requiresResultSetRequest())
	{
		return false;
	}
	let queryManagerBase = queryManager;
	let valueHelp = this.m_lovProcessConfig.requiresValueHelpRequest();
	if (valueHelp && queryManagerBase.variablesRequireImplicitSubmitForValueHelp(this.getDimension()) || !valueHelp && queryManagerBase.variablesRequireImplicitSubmit())
	{
		let lovRestoreSettings = this.m_lovProcessConfig.isRestoreSettingsAfterImplicitSubmit() ? oFF.LovRestoreSettings.create(this.getDimension()) : null;
		queryManager.submitVariables(syncType, this, lovRestoreSettings);
		return this.isValid();
	}
	this.executeRequest();
	return true;
};
oFF.LovProcess.prototype.releaseObjectInternal = function()
{
	this.m_lovProcessConfig = oFF.XObjectExt.release(this.m_lovProcessConfig);
	this.m_dimFilter = null;
	this.m_lovSortRestoreSettings = oFF.XObjectExt.release(this.m_lovSortRestoreSettings);
};
oFF.LovProcess.prototype.revertQueryChanges = function()
{
	let queryManager = this.getQueryManager();
	let dimension = this.getDimension();
	dimension.stopEventing();
	if (oFF.notNull(queryManager) && queryManager.getConvenienceCommands().isHana())
	{
		queryManager.getActiveResultSetContainer().setOffsetRows(this.m_offsetRows);
		dimension.setSkipEntries(this.m_skipEntries);
		dimension.setTopEntries(this.m_topEntries);
	}
	if (oFF.notNull(queryManager) && queryManager.getConvenienceCommands().isBw() && this.isResultSetForcedForSort() && oFF.notNull(this.m_lovSortRestoreSettings))
	{
		this.m_lovSortRestoreSettings.restore(dimension);
	}
	dimension.resumeEventing();
};
oFF.LovProcess.prototype.serialize = function(modelFormat, capabilities)
{
	return this.serializeToElementExt(modelFormat, capabilities).toString();
};
oFF.LovProcess.prototype.serializeToContent = function(modelFormat)
{
	let element = this.serializeToElementExt(modelFormat, null);
	let content = oFF.XContent.createJsonObjectContent(modelFormat, element);
	return content;
};
oFF.LovProcess.prototype.serializeToContentExt = function(modelFormat, capabilities)
{
	let element = this.serializeToElementExt(modelFormat, capabilities);
	let content = oFF.XContent.createJsonObjectContent(modelFormat, element);
	return content;
};
oFF.LovProcess.prototype.serializeToElement = function(modelFormat)
{
	let queryManager = this.getQueryManager();
	if (queryManager.getModelCapabilities().supportsPersistedInA())
	{
		return this.serializeToElementExt(modelFormat, null);
	}
	return null;
};
oFF.LovProcess.prototype.serializeToElementExt = function(modelFormat, capabilities)
{
	let queryManager = this.getQueryManager();
	let serializedValHelpRequest = null;
	if (oFF.notNull(queryManager))
	{
		this.prepareQuery();
		if (this.m_lovProcessConfig.requiresValueHelpRequest())
		{
			serializedValHelpRequest = oFF.LovProcessValueHelp.serializeValueHelpForPersistedInA(this);
		}
		else if (this.m_lovProcessConfig.requiresResultSetRequest())
		{
			serializedValHelpRequest = queryManager.serializeToElementExt(oFF.QModelFormat.INA_DATA, capabilities);
		}
		this.revertQueryChanges();
	}
	return serializedValHelpRequest;
};
oFF.LovProcess.prototype.serializeToFormat = function(modelFormat)
{
	return this.serializeToElementExt(modelFormat, null).toString();
};
oFF.LovProcess.prototype.serializeToString = function(modelFormat)
{
	return this.serializeToElementExt(modelFormat, null).toString();
};
oFF.LovProcess.prototype.serializeToStringExt = function(modelFormat, capabilities)
{
	return this.serializeToElementExt(modelFormat, capabilities).toString();
};
oFF.LovProcess.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	sb.append("LOV Process[");
	sb.append("Config: ").append(this.m_lovProcessConfig.toString());
	sb.append("]");
	return sb.toString();
};

oFF.ResultSetContainer = function() {};
oFF.ResultSetContainer.prototype = new oFF.DfRsSyncAction();
oFF.ResultSetContainer.prototype._ff_c = "ResultSetContainer";

oFF.ResultSetContainer.MAX_RECORDS_DEFAULT = -1;
oFF.ResultSetContainer.create = function(manager, template)
{
	let rsContainer = new oFF.ResultSetContainer();
	rsContainer.setupContainer(manager, null, null, null, template);
	return rsContainer;
};
oFF.ResultSetContainer.createWithRequest = function(queryManagerBase, resultSetProviderFactory, request, rsDefQueryModel)
{
	let rsContainer = new oFF.ResultSetContainer();
	rsContainer.setupContainer(queryManagerBase, resultSetProviderFactory, request, rsDefQueryModel, null);
	return rsContainer;
};
oFF.ResultSetContainer.prototype.m_activeRemoteQueries = null;
oFF.ResultSetContainer.prototype.m_activeRemoteRuntimeQueries = null;
oFF.ResultSetContainer.prototype.m_classicResultSet = null;
oFF.ResultSetContainer.prototype.m_currentSyncType = null;
oFF.ResultSetContainer.prototype.m_cursorResultSet = null;
oFF.ResultSetContainer.prototype.m_cursorResultSetInSync = null;
oFF.ResultSetContainer.prototype.m_customHierarchiesReCreated = false;
oFF.ResultSetContainer.prototype.m_customIdentifier = null;
oFF.ResultSetContainer.prototype.m_dataCellContextResults = null;
oFF.ResultSetContainer.prototype.m_dataEntryCollection = null;
oFF.ResultSetContainer.prototype.m_dataRefreshEnabled = null;
oFF.ResultSetContainer.prototype.m_documentIdCollection = null;
oFF.ResultSetContainer.prototype.m_documentIdManager = null;
oFF.ResultSetContainer.prototype.m_enableHierarchyToUDHConversion = false;
oFF.ResultSetContainer.prototype.m_executeRequestOnOldResultSet = false;
oFF.ResultSetContainer.prototype.m_isContinueFromRemotePrequeryExecution = false;
oFF.ResultSetContainer.prototype.m_isRemotePreQuery = false;
oFF.ResultSetContainer.prototype.m_isResultSetTransportEnabled = false;
oFF.ResultSetContainer.prototype.m_isWaitingForRemotePrequeryExecution = false;
oFF.ResultSetContainer.prototype.m_lbhToUdhConversionProperties = null;
oFF.ResultSetContainer.prototype.m_listener = null;
oFF.ResultSetContainer.prototype.m_lovConfig = null;
oFF.ResultSetContainer.prototype.m_maxColumns = 0;
oFF.ResultSetContainer.prototype.m_maxResultRecords = 0;
oFF.ResultSetContainer.prototype.m_maxRows = 0;
oFF.ResultSetContainer.prototype.m_mergeId = null;
oFF.ResultSetContainer.prototype.m_newLineCollection = null;
oFF.ResultSetContainer.prototype.m_offsetColumns = 0;
oFF.ResultSetContainer.prototype.m_offsetRows = 0;
oFF.ResultSetContainer.prototype.m_rawRequest = null;
oFF.ResultSetContainer.prototype.m_rawResponse = null;
oFF.ResultSetContainer.prototype.m_renderInfo = null;
oFF.ResultSetContainer.prototype.m_request = null;
oFF.ResultSetContainer.prototype.m_resultSetId = null;
oFF.ResultSetContainer.prototype.m_resultSetIdSet = false;
oFF.ResultSetContainer.prototype.m_resultSetPersistenceIdentifier = null;
oFF.ResultSetContainer.prototype.m_resultSetPersistenceSchema = null;
oFF.ResultSetContainer.prototype.m_resultSetPersistenceTable = null;
oFF.ResultSetContainer.prototype.m_resultSetPersistenceType = null;
oFF.ResultSetContainer.prototype.m_resultSetProviderFactory = null;
oFF.ResultSetContainer.prototype.m_rsDataArea = null;
oFF.ResultSetContainer.prototype.m_rsDefQueryModel = null;
oFF.ResultSetContainer.prototype.m_rsDocumentServicePath = null;
oFF.ResultSetContainer.prototype.m_runtimeQuery = null;
oFF.ResultSetContainer.prototype.m_serializedCube = null;
oFF.ResultSetContainer.prototype.m_serializedView = null;
oFF.ResultSetContainer.prototype.m_suppressCalculatedMembersWithoutBookedData = 0;
oFF.ResultSetContainer.prototype.m_suppressKeyfigureCalculation = false;
oFF.ResultSetContainer.prototype.m_transientPrequeries = null;
oFF.ResultSetContainer.prototype._executeRuntimeRemotePreQueries = function(runtimeQuery, queries)
{
	let preQueries = runtimeQuery.getPreQueries();
	if (oFF.XCollectionUtils.hasElements(preQueries))
	{
		let size = preQueries.size();
		for (let i = 0; i < size; i++)
		{
			let preQuery = preQueries.get(i);
			let isRemoteQueryTriggered = this._executeRuntimeRemotePreQueries(preQuery, queries);
			if (isRemoteQueryTriggered)
			{
				return true;
			}
		}
	}
	let queryForLocal = runtimeQuery.getQueryForLocal();
	if (queries.contains(queryForLocal))
	{
		return false;
	}
	if (runtimeQuery.isRemotePreQuery() && !runtimeQuery.isProcessed())
	{
		let preQueryExecutor = this.getQueryManager().getPreQueryExecutor();
		this.m_isWaitingForRemotePrequeryExecution = true;
		this.m_activeRemoteRuntimeQueries.add(runtimeQuery);
		preQueryExecutor.processExecutionRuntimePrequery(this.m_currentSyncType, runtimeQuery, this);
		return true;
	}
	oFF.InAQueryMergeUtils.cleanTagsFromRequest(queryForLocal, true);
	queries.add(queryForLocal);
	return false;
};
oFF.ResultSetContainer.prototype._getSpatialClusteringDimension = function()
{
	let queryModel = this.getQueryModel();
	if (oFF.isNull(queryModel))
	{
		return null;
	}
	let spatialClusterSettings = queryModel.getSpatialClusterSettings();
	if (oFF.isNull(spatialClusterSettings) || !spatialClusterSettings.isActive())
	{
		return null;
	}
	let clusterField = spatialClusterSettings.getClusterField();
	if (oFF.isNull(clusterField))
	{
		this.addError(oFF.ErrorCodes.INVALID_FIELD, "The cluster field must not be null!");
		return null;
	}
	return clusterField.getDimension();
};
oFF.ResultSetContainer.prototype._onPreQueryExecuted = function()
{
	this.m_isWaitingForRemotePrequeryExecution = false;
	this.m_isContinueFromRemotePrequeryExecution = true;
	this.processExecution(this.m_currentSyncType, this.m_listener, this.m_customIdentifier);
};
oFF.ResultSetContainer.prototype._resetSyncStateInternal = function(requiresReExecution)
{
	if (requiresReExecution || this.getSyncState().isInSync())
	{
		this.m_classicResultSet = null;
		this.m_cursorResultSet = null;
		this.m_cursorResultSetInSync = null;
	}
	oFF.DfRsSyncAction.prototype._resetSyncStateInternal.call( this , requiresReExecution);
};
oFF.ResultSetContainer.prototype.addQueryManagerToBatch = function(queryManager, isPreQuery, preQueryName, isMicroCube)
{
	if (isPreQuery)
	{
		queryManager.setPreQueryName(preQueryName);
	}
	let queryModel = null;
	if (isMicroCube)
	{
		queryModel = queryManager.getQueryModel();
		queryModel.setBatchModeForMicroCube(true);
	}
	let tmpResultSetTransportEnabled = queryManager.isResultSetTransportEnabled();
	queryManager.setResultSetTransportEnabled(false);
	queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, null, null);
	if (isPreQuery)
	{
		queryManager.setPreQueryName(null);
	}
	if (isMicroCube)
	{
		queryModel.setBatchModeForMicroCube(false);
	}
	queryManager.setResultSetTransportEnabled(tmpResultSetTransportEnabled);
};
oFF.ResultSetContainer.prototype.areAllPrequeriesInSync = function()
{
	let preQueries = this.isSerializedRemotePreQuery() ? null : oFF.QueryModelUtils.getPreQueries(this.getQueryModel());
	if (oFF.XCollectionUtils.hasElements(preQueries))
	{
		let size = preQueries.size();
		for (let i = 0; i < size; i++)
		{
			let prequeryResultSetContainer = preQueries.get(i).getObject().getQueryManager().getActiveResultSetContainer();
			if (prequeryResultSetContainer.getSyncState().isNotInSync() || !prequeryResultSetContainer.areAllPrequeriesInSync())
			{
				return false;
			}
		}
	}
	return true;
};
oFF.ResultSetContainer.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onQueryExecuted(extResult, data, customIdentifier);
};
oFF.ResultSetContainer.prototype.cancelSynchronization = function()
{
	oFF.XBooleanUtils.checkTrue(this.getSyncState() === oFF.SyncState.PROCESSING, "Cannot cancel action that is not processing");
	oFF.DfRsSyncAction.prototype.cancelSynchronization.call( this );
	let queryManager = this.getQueryManager();
	if (oFF.notNull(queryManager))
	{
		let lifeCycleState = queryManager.getLifeCycleState();
		if (lifeCycleState === oFF.LifeCycleState.ACTIVE)
		{
			let activeSyncType = this.getActiveSyncType();
			queryManager.processCancel(activeSyncType);
		}
	}
};
oFF.ResultSetContainer.prototype.clearCellContexts = function()
{
	this.m_dataCellContextResults.clear();
};
oFF.ResultSetContainer.prototype.enableHierarchyToUDHConversion = function(enableConversion)
{
	let queryManager = this.getQueryManager();
	if (oFF.notNull(queryManager) && queryManager.getSystemType().isTypeOf(oFF.SystemType.BW) && queryManager.getModelCapabilities().supportsUniversalDisplayHierarchiesCustomDimensions())
	{
		this.m_enableHierarchyToUDHConversion = enableConversion;
	}
};
oFF.ResultSetContainer.prototype.executeBlendingSource = function(syncType, source, blendingPersistenceType, queryManager)
{
	this.resetSyncState();
	this.m_activeRemoteQueries.add(source);
	queryManager.processQueryExecutionAsBlendingSource(syncType, blendingPersistenceType, this, source);
};
oFF.ResultSetContainer.prototype.executeMicroCubeBatch = function(syncType, listener, customIdentifier, microCubeQueryManager)
{
	let connectionPool = this.getApplication().getConnectionPool();
	let systemName = this.getQueryManager().getSystemName();
	let implicitBatchStarted = this.startBatch(connectionPool, systemName);
	let batchReqManager = connectionPool.getConnection(systemName).getBatchRequestManager();
	if (!implicitBatchStarted)
	{
		let microCubeName = microCubeQueryManager.getNameForMicroCubeUse();
		if (!batchReqManager.getMicroCubesNames().contains(microCubeName))
		{
			this.addQueryManagerToBatch(microCubeQueryManager, false, null, true);
			batchReqManager.addMicroCubeName(microCubeName);
		}
	}
	else
	{
		this.addQueryManagerToBatch(microCubeQueryManager, false, null, true);
	}
	let processSyncAction = this.processSyncAction(oFF.SyncType.NON_BLOCKING, listener, customIdentifier);
	if (implicitBatchStarted)
	{
		connectionPool.disableBatchMode(syncType, systemName);
	}
	return processSyncAction;
};
oFF.ResultSetContainer.prototype.executePreQueries = function(syncType, listener, customIdentifier, preQueries)
{
	let connectionPool = this.getApplication().getConnectionPool();
	let queryManager = this.getQueryManager();
	let systemName = queryManager.getSystemName();
	let preQueryExecutor = queryManager.getPreQueryExecutor();
	if (queryManager.getPreQueryName() === null)
	{
		let remotePreQuerySyncType = connectionPool.isBatchModeEnabled(systemName) ? oFF.SyncType.BLOCKING : syncType;
		if (!preQueryExecutor.serializeRemotePreQueries(remotePreQuerySyncType, systemName, preQueries, this))
		{
			if (preQueryExecutor.getMessages().hasElements())
			{
				this.clearMessages();
				this.addAllMessages(preQueryExecutor);
				this.handleErrorsBeforeProcessExecution();
			}
			else
			{
				this.m_isWaitingForRemotePrequeryExecution = true;
			}
			return this;
		}
	}
	let implicitBatchStarted = this.startBatch(connectionPool, systemName);
	let connection = connectionPool.getConnection(systemName);
	let size = preQueries.size();
	for (let i = 0; i < size; i++)
	{
		let preQueryPair = preQueries.get(i);
		let preQueryManager = preQueryPair.getObject().getQueryManager();
		let preQueryName = preQueryPair.getName();
		if (connection.getBatchRequestManager().containsPreQueryName(preQueryName))
		{
			continue;
		}
		preQueryManager.getPreQueryExecutor().processExecutionAsPreQueryInBatch(systemName, preQueryName, this);
		connection.getBatchRequestManager().addPreQueryName(preQueryName);
	}
	let processSyncAction = this.processSyncAction(oFF.SyncType.NON_BLOCKING, listener, customIdentifier);
	if (implicitBatchStarted && queryManager.getPreQueryName() === null)
	{
		connectionPool.disableBatchMode(syncType, systemName);
	}
	return processSyncAction;
};
oFF.ResultSetContainer.prototype.executeRemoteQueries = function(queryModel)
{
	if (oFF.notNull(queryModel) && queryModel.isBlendingModel())
	{
		let blendingDefinition = queryModel.getBlendingDefinition();
		let blendingHost = blendingDefinition.getBlendingHost();
		let isRemoteBlending = blendingDefinition.isRemoteBlending();
		let sources = queryModel.getBlendingSources().getIterator();
		let olapEnv = this.getOlapEnv();
		while (sources.hasNext())
		{
			let source = sources.next();
			let model = source.getQueryModel();
			model.setShouldUseActualTextField(true);
			if (!this.executeRemoteQueries(model))
			{
				return false;
			}
			let manager = model.getQueryManager();
			if (source.isRemoteSource())
			{
				let persistanceType = source.getRequiredRemoteExecutionPersistenceType(blendingHost);
				if (oFF.notNull(persistanceType) || manager.getResultSetSyncState().isNotInSync())
				{
					let syncType = manager.getResultSetSyncState() === oFF.SyncState.PROCESSING && source.isRemoteQueryPersistenceIdentifierUpToDate(blendingHost) ? oFF.SyncType.REGISTER : this.m_currentSyncType;
					source.updatePersistenceIdentifier(blendingHost);
					let cache = !blendingHost.getSystemDescription().isSystemMappingValid(manager.getSystemDescription()) ? olapEnv.getCachedRemoteBlendingData(manager.getResultSetPersistenceIdentifier()) : null;
					if (oFF.isNull(cache) || oFF.XStringUtils.isNullOrEmpty(cache.getView()) || oFF.XStringUtils.isNullOrEmpty(cache.getCube()))
					{
						this.executeBlendingSource(syncType, source, persistanceType, manager);
						return false;
					}
					else
					{
						manager.getActiveResultSetContainer().setSerializedData(cache.getView(), cache.getCube());
					}
				}
			}
			else if (isRemoteBlending && model.getModelCapabilities().supportsCubeCache() && !source.isRemoteQueryPersistenceIdentifierUpToDate(blendingHost))
			{
				source.updatePersistenceIdentifier(null);
				this.executeBlendingSource(this.m_currentSyncType, source, oFF.BlendingPersistenceType.ALL_DATA, manager);
				return false;
			}
			model.setShouldUseActualTextField(false);
		}
	}
	return true;
};
oFF.ResultSetContainer.prototype.executeRuntime = function(syncType, listener, customIdentifier)
{
	if (this.hasErrors())
	{
		this.handleErrorsBeforeProcessExecution();
		return this;
	}
	let queryManager = this.getQueryManager();
	let inaRequest = queryManager.getQueryServiceConfig().getDefinitionAsStructure();
	let inaBatch = inaRequest.getListByKey(oFF.ConnectionConstants.INA_BATCH);
	if (oFF.isNull(inaBatch))
	{
		let analytics = oFF.PrUtils.getStructureProperty(inaRequest, "Analytics");
		let definition = oFF.PrUtils.getStructureProperty(analytics, "Definition");
		let udhs = oFF.PrUtils.getListProperty(definition, "UniversalDisplayHierarchies");
		if (oFF.notNull(udhs))
		{
			let lbhToUdhConversionProperties = oFF.XStream.of(udhs).map((udh1) => {
				return udh1.asStructure();
			}).filter((udh2) => {
				return udh2.getBooleanByKeyExt("Active", false) && udh2.containsKey("LevelDimensionName") && udh2.containsKey("LevelHierarchyName");
			}).map((udh3) => {
				return oFF.RsLbhToUdhConversionProperties.create(udh3.getStringByKey("LevelDimensionName"), udh3.getStringByKey("LevelHierarchyName"), this.getDimensionAxisTypeFromRequest(oFF.PrUtils.getListProperty(definition, "Dimensions"), udh3.getStringByKey("LevelDimensionName")), udh3.getStringByKey("Name"));
			}).findAny();
			this.m_lbhToUdhConversionProperties = lbhToUdhConversionProperties.orElse(null);
			this.enableHierarchyToUDHConversion(lbhToUdhConversionProperties.isPresent());
		}
		return this.processSyncAction(syncType, listener, customIdentifier);
	}
	let originalDefinition = oFF.PrUtils.createDeepCopy(inaRequest).asStructure();
	if (oFF.isNull(this.m_runtimeQuery))
	{
		this.m_runtimeQuery = oFF.QFactory.createRuntimeQuery(inaBatch, queryManager);
	}
	let queries = oFF.XList.create();
	let isRemoteQueryTriggered = this._executeRuntimeRemotePreQueries(this.m_runtimeQuery, queries);
	if (isRemoteQueryTriggered)
	{
		return this;
	}
	let implicitBatchStarted = false;
	let systemName = queryManager.getSystemName();
	if (this.getSyncState() === oFF.SyncState.OUT_OF_SYNC)
	{
		let connectionPool = this.getApplication().getConnectionPool();
		implicitBatchStarted = this.startBatch(connectionPool, systemName);
		let connection = connectionPool.getConnection(systemName);
		let inAPath = queryManager.getSystemType().getInAPath();
		let size = queries.size() - 1;
		for (let i = 0; i < size; i++)
		{
			let queryName = oFF.InARuntimeUtils.getQueryNameFromContext(oFF.InARuntimeUtils.getRequestContext(queries.get(i)));
			if (oFF.isNull(queryName) || connection.getBatchRequestManager().containsPreQueryName(queryName))
			{
				continue;
			}
			connection.getBatchRequestManager().addPreQueryName(queryName);
			let _function = connection.newRpcFunction(inAPath);
			let rpcRequest = _function.getRpcRequest();
			rpcRequest.setSapPassportConnectionId(queryManager.getInstanceId());
			rpcRequest.setRequestStructure(queries.get(i));
			_function.processFunctionExecution(oFF.SyncType.NON_BLOCKING, null, null);
		}
		oFF.PrUtils.createDeepCopyExt(queries.get(size), inaRequest);
	}
	let processSyncAction = this.processSyncAction(oFF.SyncType.NON_BLOCKING, listener, customIdentifier);
	this.m_runtimeQuery = oFF.XObjectExt.release(this.m_runtimeQuery);
	if (implicitBatchStarted)
	{
		this.getApplication().getConnectionPool().disableBatchMode(syncType, systemName);
	}
	queryManager.getQueryServiceConfig().setDefinitionByStructure(queryManager.getQueryServiceConfig().getDefinitionType(), originalDefinition);
	return processSyncAction;
};
oFF.ResultSetContainer.prototype.getAbstractRendering = function(type, protocol)
{
	let result = null;
	if (type.isTypeOf(oFF.SemanticBindingType.CHART))
	{
		result = oFF.ChartRendererFactory.createRenderer(protocol).render(type, this.getCursorResultSet());
	}
	else if (type.isTypeOf(oFF.SemanticBindingType.KPI))
	{
		result = oFF.KpiRendererFactory.createRenderer(protocol).render(this.getCursorResultSet());
	}
	else if (type.isTypeOf(oFF.SemanticBindingType.TABLE) && protocol.isTypeOf(oFF.ProtocolBindingType.SAC_TABLE_GRID))
	{
		let renderer = oFF.GridRendererFactory.createRenderer(oFF.ProtocolBindingType.SAC_TABLE_GRID);
		let tableDefinition = this.getQueryModel().getVisualizationManager().getOrCreateVisualisationDefinition("TABLE_DEFINITION", oFF.ProtocolBindingType.SAC_TABLE_GRID, oFF.SemanticBindingType.TABLE);
		let tableContainer = tableDefinition.getActiveTableContainer();
		tableContainer.processExecution(oFF.SyncType.BLOCKING, null, null);
		result = renderer.render(tableContainer);
	}
	else
	{
		result = oFF.ReferenceGridFactory.createForVizGrid(this.getClassicResultSet()).exportForProtocol(protocol);
	}
	return result;
};
oFF.ResultSetContainer.prototype.getCellContextByName = function(name)
{
	return oFF.isNull(this.m_dataCellContextResults) ? null : this.m_dataCellContextResults.getByKey(name);
};
oFF.ResultSetContainer.prototype.getCellContextNames = function()
{
	return this.m_dataCellContextResults.getKeysAsReadOnlyList();
};
oFF.ResultSetContainer.prototype.getCellContextResults = function()
{
	return this.m_dataCellContextResults;
};
oFF.ResultSetContainer.prototype.getClassicResultSet = function()
{
	if (oFF.isNull(this.m_classicResultSet))
	{
		let rs = this.getCursorResultSet();
		if (oFF.notNull(rs))
		{
			this.m_classicResultSet = oFF.ResultSet.create(this, rs);
		}
	}
	return this.m_classicResultSet;
};
oFF.ResultSetContainer.prototype.getCursorResultSet = function()
{
	if (oFF.isNull(this.m_cursorResultSetInSync))
	{
		let syncState = this.getSyncState();
		if (syncState === oFF.SyncState.PROCESSING)
		{
			throw oFF.XException.createIllegalStateException("Cannot retrieve the resultset while processing");
		}
		if (syncState === oFF.SyncState.OUT_OF_SYNC)
		{
			this.processExecution(oFF.SyncType.BLOCKING, null, null);
		}
	}
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSetInSync);
};
oFF.ResultSetContainer.prototype.getDataEntryCollection = function()
{
	if (oFF.isNull(this.m_dataEntryCollection))
	{
		this.m_dataEntryCollection = oFF.RsDataEntryCollection.create(this);
	}
	return this.m_dataEntryCollection;
};
oFF.ResultSetContainer.prototype.getDataRefreshEnabled = function()
{
	return this.m_dataRefreshEnabled;
};
oFF.ResultSetContainer.prototype.getDimensionAxisTypeFromRequest = function(inaDimensions, dimensionName)
{
	return oFF.XStream.of(inaDimensions).filter((inaDimension1) => {
		return oFF.XString.isEqual(inaDimension1.asStructure().getStringByKey("Name"), dimensionName);
	}).map((inaDimension2) => {
		return oFF.AxisType.lookup(inaDimension2.asStructure().getStringByKey("Axis"));
	}).findAny().orElse(oFF.AxisType.ROWS);
};
oFF.ResultSetContainer.prototype.getDocumentIdCollection = function()
{
	if (oFF.isNull(this.m_documentIdCollection))
	{
		this.m_documentIdCollection = oFF.RsDocumentIdCollection.create(this.getQueryManager(), this.getQueryModel().getRowsAxis(), this.getQueryModel().getColumnsAxis());
	}
	return this.m_documentIdCollection;
};
oFF.ResultSetContainer.prototype.getDocumentIdManager = function()
{
	if (oFF.isNull(this.m_documentIdManager))
	{
		this.m_documentIdManager = oFF.RsDocumentIdManager.create(this.getQueryManager());
	}
	return this.m_documentIdManager;
};
oFF.ResultSetContainer.prototype.getExecuteRequestOnOldResultSet = function()
{
	return this.m_executeRequestOnOldResultSet;
};
oFF.ResultSetContainer.prototype.getFilteredPreQueries = function(queryModel)
{
	let emptyList = oFF.XList.create();
	let preQueries = this.isSerializedRemotePreQuery() || this.getSyncState().isInSync() ? emptyList : oFF.QueryModelUtils.getPreQueries(queryModel);
	if (oFF.XCollectionUtils.hasElements(preQueries))
	{
		let mutablePreQueries = preQueries.createListCopy();
		let usedDimensions = null;
		for (let i = preQueries.size() - 1; i >= 0; i--)
		{
			let preQueryName = preQueries.get(i).getName();
			let dimension = queryModel.getDimensionByName(preQueryName);
			if (oFF.notNull(dimension) && dimension.getTagging().containsKey(oFF.QTransientConstants.TAG_IS_INTEROP_GENERATED))
			{
				if (oFF.isNull(usedDimensions))
				{
					usedDimensions = queryModel.getConvenienceCommands().getCalculatedDimensionsInUse();
				}
				if (!usedDimensions.contains(preQueryName))
				{
					mutablePreQueries.removeAt(i);
				}
			}
		}
		return mutablePreQueries;
	}
	return preQueries;
};
oFF.ResultSetContainer.prototype.getId = function()
{
	if (!this.m_resultSetIdSet)
	{
		this.setId(oFF.XGuid.getGuid());
	}
	return this.m_resultSetId;
};
oFF.ResultSetContainer.prototype.getLbhToUdhConversionProperties = function(axisType)
{
	return oFF.notNull(this.m_lbhToUdhConversionProperties) && this.m_lbhToUdhConversionProperties.getAxisType() === axisType ? this.m_lbhToUdhConversionProperties : null;
};
oFF.ResultSetContainer.prototype.getLovConfig = function()
{
	return this.m_lovConfig;
};
oFF.ResultSetContainer.prototype.getMaxColumns = function()
{
	return this.m_maxColumns;
};
oFF.ResultSetContainer.prototype.getMaxResultRecords = function()
{
	return this.m_maxResultRecords;
};
oFF.ResultSetContainer.prototype.getMaxRows = function()
{
	return this.m_maxRows;
};
oFF.ResultSetContainer.prototype.getMergeId = function()
{
	return this.m_mergeId;
};
oFF.ResultSetContainer.prototype.getNewLineCollection = function()
{
	if (oFF.isNull(this.m_newLineCollection))
	{
		this.m_newLineCollection = oFF.RsNewLineCollection.create(this.getQueryManager(), this.getQueryModel().getRowsAxis());
	}
	return this.m_newLineCollection;
};
oFF.ResultSetContainer.prototype.getOffsetColumns = function()
{
	return this.m_offsetColumns;
};
oFF.ResultSetContainer.prototype.getOffsetRows = function()
{
	return this.m_offsetRows;
};
oFF.ResultSetContainer.prototype.getRawRequest = function()
{
	return this.m_rawRequest;
};
oFF.ResultSetContainer.prototype.getRawResponse = function()
{
	return this.m_rawResponse;
};
oFF.ResultSetContainer.prototype.getRenderInfo = function()
{
	return this.m_renderInfo;
};
oFF.ResultSetContainer.prototype.getRequest = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_request);
};
oFF.ResultSetContainer.prototype.getResultSetManager = function()
{
	return this.getActionContext();
};
oFF.ResultSetContainer.prototype.getResultSetMessages = function()
{
	return this;
};
oFF.ResultSetContainer.prototype.getResultSetPersistenceIdentifier = function()
{
	return this.m_resultSetPersistenceIdentifier;
};
oFF.ResultSetContainer.prototype.getResultSetPersistenceSchema = function()
{
	return this.m_resultSetPersistenceSchema;
};
oFF.ResultSetContainer.prototype.getResultSetPersistenceTable = function()
{
	return this.m_resultSetPersistenceTable;
};
oFF.ResultSetContainer.prototype.getResultSetPersistenceType = function()
{
	return this.m_resultSetPersistenceType;
};
oFF.ResultSetContainer.prototype.getResultSetSyncState = function()
{
	return this.getSyncState();
};
oFF.ResultSetContainer.prototype.getRsDataArea = function()
{
	return this.m_rsDataArea;
};
oFF.ResultSetContainer.prototype.getRsDocumentServicePath = function()
{
	return this.m_rsDocumentServicePath;
};
oFF.ResultSetContainer.prototype.getRsQueryModelDef = function()
{
	return this.m_rsDefQueryModel;
};
oFF.ResultSetContainer.prototype.getSerializedCube = function()
{
	return this.m_serializedCube;
};
oFF.ResultSetContainer.prototype.getSerializedView = function()
{
	return this.m_serializedView;
};
oFF.ResultSetContainer.prototype.getSuppressCalculatedMembersWithoutBookedData = function()
{
	return this.m_suppressCalculatedMembersWithoutBookedData;
};
oFF.ResultSetContainer.prototype.handleErrorsBeforeProcessExecution = function()
{
	if (!this.isValid())
	{
		this.attachListener(this.m_listener, oFF.ListenerType.SPECIFIC, this.m_customIdentifier);
		this.callListeners(true);
	}
};
oFF.ResultSetContainer.prototype.hasDataEntryCollection = function()
{
	return oFF.notNull(this.m_dataEntryCollection);
};
oFF.ResultSetContainer.prototype.hasDocumentIdCollection = function()
{
	return oFF.notNull(this.m_documentIdCollection);
};
oFF.ResultSetContainer.prototype.hasMoreColumnRecordsAvailable = function()
{
	let currentMaxTuple = this.m_offsetColumns + this.m_maxColumns;
	if (currentMaxTuple === -1)
	{
		return false;
	}
	let cursorColumnsAxis = this.m_cursorResultSet.getCursorColumnsAxis();
	return currentMaxTuple < cursorColumnsAxis.getTuplesCountTotal();
};
oFF.ResultSetContainer.prototype.hasMoreRowRecordsAvailable = function()
{
	let currentMaxTuple = this.m_offsetRows + this.m_maxRows;
	if (currentMaxTuple === -1)
	{
		return false;
	}
	let cursorRowsAxis = this.m_cursorResultSet.getCursorRowsAxis();
	return currentMaxTuple < cursorRowsAxis.getTuplesCountTotal();
};
oFF.ResultSetContainer.prototype.hasNewLineCollection = function()
{
	return oFF.notNull(this.m_newLineCollection);
};
oFF.ResultSetContainer.prototype.isClassicResultSetAvailable = function()
{
	return oFF.notNull(this.m_classicResultSet);
};
oFF.ResultSetContainer.prototype.isCursorResultSetAvailable = function()
{
	return oFF.notNull(this.m_cursorResultSetInSync);
};
oFF.ResultSetContainer.prototype.isHierarchyToUDHConversionEnabled = function()
{
	return this.m_enableHierarchyToUDHConversion || this.getQueryManager() !== null && this.getQueryManager().isHierarchyToUDHConversionEnabled();
};
oFF.ResultSetContainer.prototype.isKeyfigureCalculationSuppressed = function()
{
	return this.m_suppressKeyfigureCalculation;
};
oFF.ResultSetContainer.prototype.isRemotePreQuery = function()
{
	return this.m_isRemotePreQuery;
};
oFF.ResultSetContainer.prototype.isResultSetTransportEnabled = function()
{
	return this.m_isResultSetTransportEnabled;
};
oFF.ResultSetContainer.prototype.isSerializedRemotePreQuery = function()
{
	let queryManager = this.getQueryManager();
	if (oFF.notNull(queryManager) && this.m_isRemotePreQuery)
	{
		return queryManager.getResultSetPersistenceIdentifier() !== null && queryManager.getPreQueryName() !== null;
	}
	return false;
};
oFF.ResultSetContainer.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.copyAllMessages(extResult);
	if (extResult.getData() !== null)
	{
		oFF.InAHelper.importMessages(extResult.getData().getRootElementGeneric(), this);
	}
	let runtimeQuery = customIdentifier;
	if (!runtimeQuery.isSdiRemote() && this.isValid())
	{
		let serializedData = response.getRootElement().getStructureByKey("SerializedData");
		let view = serializedData.getStringByKey("View");
		let cube = serializedData.getStringByKey("Cube");
		runtimeQuery.setBrowserBasedPersistency(cube, view);
	}
	this.m_activeRemoteRuntimeQueries.removeElement(runtimeQuery);
	this._onPreQueryExecuted();
};
oFF.ResultSetContainer.prototype.onPreQueryExecuted = function()
{
	this._onPreQueryExecuted();
};
oFF.ResultSetContainer.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	let source = customIdentifier;
	source.getQueryModel().addQueryModelIdToMessages(extResult.getMessages());
	this.addAllMessages(extResult);
	this.m_activeRemoteQueries.removeElement(source);
	let queryManager = source.getQueryManager();
	queryManager.processQueryExecution(oFF.SyncType.UNREGISTER, this, null);
	if (this.isValid())
	{
		if (queryManager.getModelCapabilities().supportsAutoVariableSubmit() && this.getQueryModel() !== null && this.getQueryModel().isBlendingModel())
		{
			let oldPersistenceIdentifier = queryManager.getResultSetPersistenceIdentifier();
			source.updatePersistenceIdentifierOnTarget(this.getQueryModel().getBlendingDefinition().getBlendingHost(), queryManager.getActiveResultSetContainer());
			queryManager.getOlapEnv().updateRemoteBlendingCacheId(queryManager, oldPersistenceIdentifier);
		}
		this.processExecution(this.m_currentSyncType, this.m_listener, this.m_customIdentifier);
	}
	else
	{
		this.handleErrorsBeforeProcessExecution();
	}
};
oFF.ResultSetContainer.prototype.onResultSetFetch = function(extResult, resultset, customIdentifier)
{
	if (!this.m_customHierarchiesReCreated && this.requiresCustomHierarchyRecreate(extResult.getErrors()) && this.getQueryManager() !== null)
	{
		this.m_customHierarchiesReCreated = true;
		this.resetSyncStateForReExecution();
		this.getQueryManager().retriggerQueryExecutionWithCustomHierarchies(this.getActiveSyncType(), this.m_listener, this.m_customIdentifier, this);
		return;
	}
	this.addAllMessages(extResult);
	this.setDataEntryCollection(null);
	this.setDocumentIdCollection(null);
	if (extResult.isValid())
	{
		this.m_cursorResultSetInSync = oFF.XWeakReferenceUtil.getWeakRef(this.m_cursorResultSet);
		if (this.m_dataRefreshEnabled === oFF.ActionChoice.ONCE)
		{
			this.m_dataRefreshEnabled = oFF.ActionChoice.OFF;
		}
		this.setData(this);
	}
	else
	{
		this.m_cursorResultSetInSync = null;
	}
	this.endSync();
};
oFF.ResultSetContainer.prototype.processExecution = function(syncType, listener, customIdentifier)
{
	if (this.m_isWaitingForRemotePrequeryExecution || this.m_activeRemoteQueries.hasElements() || this.m_activeRemoteRuntimeQueries.hasElements())
	{
		this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
		return this;
	}
	this.m_currentSyncType = syncType;
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	if (this.getQueryManager().isShallow())
	{
		return this.executeRuntime(syncType, listener, customIdentifier);
	}
	let queryModel = this.getQueryModel();
	if (oFF.notNull(queryModel))
	{
		if (!this.m_isContinueFromRemotePrequeryExecution && this.getSyncState().isNotInSync() && this.getSyncState() !== oFF.SyncState.PROCESSING)
		{
			this.getQueryManager().clearMessages();
			queryModel.generateTransientObjects();
		}
		this.m_renderInfo = queryModel.serializeToElement(oFF.QModelFormat.RENDER_INFO);
	}
	if (!this.executeRemoteQueries(queryModel))
	{
		return this;
	}
	let preQueries = this.getFilteredPreQueries(queryModel);
	if (preQueries.size() > 0)
	{
		return this.executePreQueries(syncType, listener, customIdentifier, preQueries);
	}
	if (oFF.notNull(queryModel) && queryModel.isBasedOnMicroCube())
	{
		let qm = queryModel.getDataSource().getMicroCube();
		return this.executeMicroCubeBatch(syncType, listener, customIdentifier, qm.getQueryManager());
	}
	let queryManager = this.getQueryManager();
	queryManager.maintainStateForRsWithAutoSubmit(this);
	let syncAction = this.processSyncAction(syncType, listener, customIdentifier);
	this.m_isContinueFromRemotePrequeryExecution = false;
	return syncAction;
};
oFF.ResultSetContainer.prototype.processSynchronization = function(syncType)
{
	let resultSetProviderFactory = oFF.XWeakReferenceUtil.getHardRef(this.m_resultSetProviderFactory);
	let queryManager = this.getQueryManager();
	if (oFF.isNull(resultSetProviderFactory))
	{
		resultSetProviderFactory = queryManager.getResultSetProviderFactory();
	}
	let queryModel = this.getQueryModel();
	if (oFF.isNull(this.m_rsDefQueryModel))
	{
		let clusteringDimension = this._getSpatialClusteringDimension();
		let rowsAxis = null;
		let columnsAxis = null;
		let visualizationManager = null;
		let isExecuteAutoVariableSubmit = queryManager.isExecuteAutoVariableSubmit();
		if (oFF.notNull(queryModel))
		{
			rowsAxis = queryModel.getRowsAxis();
			columnsAxis = queryModel.getColumnsAxis();
			visualizationManager = queryModel.getVisualizationManager();
		}
		this.m_rsDefQueryModel = oFF.RsDefQueryModel.create(queryManager, visualizationManager, rowsAxis, columnsAxis, clusteringDimension, isExecuteAutoVariableSubmit);
	}
	if (this.hasErrors())
	{
		return false;
	}
	this.m_cursorResultSet = oFF.RsCursorResultSet.create(this, resultSetProviderFactory, this.getRequest(), this.m_rsDefQueryModel);
	this.setSyncChild(this.m_cursorResultSet);
	this.m_cursorResultSet.processResultSetFetch(syncType, this, null);
	if (oFF.notNull(queryModel) && !queryModel.isReleased())
	{
		this.validateQueryModel(queryModel);
		queryModel.destroyTransientObjects();
	}
	return true;
};
oFF.ResultSetContainer.prototype.putCellContext = function(name, filterElement)
{
	this.m_dataCellContextResults.put(name, filterElement);
};
oFF.ResultSetContainer.prototype.releaseObjectInternal = function()
{
	this.m_resultSetId = null;
	this.m_resultSetPersistenceTable = null;
	this.m_resultSetPersistenceSchema = null;
	this.m_resultSetPersistenceType = null;
	this.m_resultSetPersistenceIdentifier = null;
	this.m_serializedView = null;
	this.m_serializedCube = null;
	this.m_request = oFF.XObjectExt.release(this.m_request);
	this.m_resultSetProviderFactory = oFF.XObjectExt.release(this.m_resultSetProviderFactory);
	this.m_dataCellContextResults = oFF.XObjectExt.release(this.m_dataCellContextResults);
	this.m_rsDefQueryModel = oFF.XObjectExt.release(this.m_rsDefQueryModel);
	this.m_renderInfo = oFF.XObjectExt.release(this.m_renderInfo);
	this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
	this.m_cursorResultSetInSync = oFF.XObjectExt.release(this.m_cursorResultSetInSync);
	this.m_classicResultSet = oFF.XObjectExt.release(this.m_classicResultSet);
	this.m_dataEntryCollection = oFF.XObjectExt.release(this.m_dataEntryCollection);
	this.m_newLineCollection = oFF.XObjectExt.release(this.m_newLineCollection);
	this.m_documentIdCollection = oFF.XObjectExt.release(this.m_documentIdCollection);
	this.m_documentIdManager = oFF.XObjectExt.release(this.m_documentIdManager);
	this.m_currentSyncType = null;
	this.m_listener = null;
	this.m_customIdentifier = null;
	this.m_activeRemoteQueries = oFF.XObjectExt.release(this.m_activeRemoteQueries);
	this.m_activeRemoteRuntimeQueries = oFF.XObjectExt.release(this.m_activeRemoteRuntimeQueries);
	this.m_runtimeQuery = oFF.XObjectExt.release(this.m_runtimeQuery);
	this.m_transientPrequeries = oFF.XObjectExt.release(this.m_transientPrequeries);
	this.m_lbhToUdhConversionProperties = oFF.XObjectExt.release(this.m_lbhToUdhConversionProperties);
	this.m_lovConfig = null;
	this.m_rawRequest = null;
	this.m_rawResponse = null;
	this.m_mergeId = null;
	this.m_rsDataArea = null;
	this.m_rsDocumentServicePath = null;
};
oFF.ResultSetContainer.prototype.requiresCustomHierarchyRecreate = function(errors)
{
	let olapEnv = this.getOlapEnv();
	if (oFF.isNull(olapEnv))
	{
		return false;
	}
	let customHierarchyDefinitions = olapEnv.getCustomHierarchyRepository().getCustomHierarchyDefinitions();
	for (let i = 0; i < errors.size(); i++)
	{
		let error = errors.get(i);
		if (error.getCode() === oFF.ErrorCodes.CUSTOM_HIERARCHY_EXPIRED)
		{
			for (let j = 0; j < customHierarchyDefinitions.size(); j++)
			{
				if (oFF.XStringUtils.containsString(error.getText(), customHierarchyDefinitions.get(j).getName(), false))
				{
					return true;
				}
			}
		}
	}
	return false;
};
oFF.ResultSetContainer.prototype.resetDataEntryCollection = function()
{
	if (oFF.notNull(this.m_cursorResultSet))
	{
		this.m_cursorResultSet.resetNewValues();
	}
	if (oFF.notNull(this.m_classicResultSet))
	{
		this.m_classicResultSet.resetNewValues();
	}
	if (oFF.notNull(this.m_dataEntryCollection))
	{
		this.m_dataEntryCollection.clear();
	}
};
oFF.ResultSetContainer.prototype.resetDocumentIdCollection = function()
{
	if (oFF.notNull(this.m_documentIdCollection))
	{
		this.m_documentIdCollection.clear();
	}
};
oFF.ResultSetContainer.prototype.resetMaxResultRecords = function()
{
	this.m_maxResultRecords = -1;
	return null;
};
oFF.ResultSetContainer.prototype.resetNewLineCollection = function()
{
	if (oFF.notNull(this.m_newLineCollection))
	{
		this.m_newLineCollection.clear();
	}
};
oFF.ResultSetContainer.prototype.setDataEntryCollection = function(dataEntryCollection)
{
	this.m_dataEntryCollection = dataEntryCollection;
};
oFF.ResultSetContainer.prototype.setDataRefreshEnabled = function(dataRefreshEnabled)
{
	this.m_dataRefreshEnabled = dataRefreshEnabled;
};
oFF.ResultSetContainer.prototype.setDocumentIdCollection = function(documentIdCollection)
{
	this.m_documentIdCollection = documentIdCollection;
};
oFF.ResultSetContainer.prototype.setExecuteRequestOnOldResultSet = function(executeRequestOnOldResultSet)
{
	this.m_executeRequestOnOldResultSet = executeRequestOnOldResultSet;
	return null;
};
oFF.ResultSetContainer.prototype.setId = function(identifier)
{
	this.m_resultSetId = identifier;
	this.m_resultSetIdSet = true;
};
oFF.ResultSetContainer.prototype.setIsRemotePreQuery = function(isRemotePreQuery)
{
	this.m_isRemotePreQuery = isRemotePreQuery;
};
oFF.ResultSetContainer.prototype.setLovConfig = function(config)
{
	this.m_lovConfig = config;
};
oFF.ResultSetContainer.prototype.setMaxColumns = function(max)
{
	this.m_maxColumns = max;
	return null;
};
oFF.ResultSetContainer.prototype.setMaxResultRecords = function(maxResultRecords)
{
	this.m_maxResultRecords = maxResultRecords;
	return null;
};
oFF.ResultSetContainer.prototype.setMaxRows = function(max)
{
	this.m_maxRows = max;
	return null;
};
oFF.ResultSetContainer.prototype.setMergeId = function(mergeId)
{
	this.m_mergeId = mergeId;
};
oFF.ResultSetContainer.prototype.setNewLineCollection = function(newLineCollection)
{
	this.m_newLineCollection = newLineCollection;
};
oFF.ResultSetContainer.prototype.setOffsetColumns = function(offset)
{
	this.m_offsetColumns = offset;
	return null;
};
oFF.ResultSetContainer.prototype.setOffsetRows = function(offset)
{
	this.m_offsetRows = offset;
	return null;
};
oFF.ResultSetContainer.prototype.setRawRequest = function(rawRequest)
{
	this.m_rawRequest = rawRequest;
};
oFF.ResultSetContainer.prototype.setRawResponse = function(rawResponse)
{
	this.m_rawResponse = rawResponse;
};
oFF.ResultSetContainer.prototype.setResultSetPersistanceTargetSchema = function(resultSetPersistenceSchema)
{
	this.m_resultSetPersistenceSchema = resultSetPersistenceSchema;
	return null;
};
oFF.ResultSetContainer.prototype.setResultSetPersistanceTargetTable = function(resultSetPersistenceTable)
{
	this.m_resultSetPersistenceTable = resultSetPersistenceTable;
	return null;
};
oFF.ResultSetContainer.prototype.setResultSetPersistenceIdentifier = function(resultSetPersistenceIdentifier)
{
	this.m_resultSetPersistenceIdentifier = resultSetPersistenceIdentifier;
	return null;
};
oFF.ResultSetContainer.prototype.setResultSetPersistenceTargetType = function(resultSetPersistenceType)
{
	this.m_resultSetPersistenceType = resultSetPersistenceType;
	return null;
};
oFF.ResultSetContainer.prototype.setResultSetTransportEnabled = function(isEnabled)
{
	this.m_isResultSetTransportEnabled = isEnabled;
	return null;
};
oFF.ResultSetContainer.prototype.setRsDataArea = function(dataArea)
{
	this.m_rsDataArea = dataArea;
};
oFF.ResultSetContainer.prototype.setRsDocumentServicePath = function(documentServicePath)
{
	this.m_rsDocumentServicePath = documentServicePath;
};
oFF.ResultSetContainer.prototype.setSerializedData = function(view, cube)
{
	this.m_serializedView = view;
	this.m_serializedCube = cube;
};
oFF.ResultSetContainer.prototype.setSuppressCalculatedMembersWithoutBookedData = function(suppressIndicator)
{
	this.m_suppressCalculatedMembersWithoutBookedData = suppressIndicator;
};
oFF.ResultSetContainer.prototype.setSuppressKeyfigureCalculation = function(doSupress)
{
	if (this.getQueryManager().getModelCapabilities().supportsSuppressKeyfigureCalculation())
	{
		this.m_suppressKeyfigureCalculation = doSupress;
	}
	return null;
};
oFF.ResultSetContainer.prototype.setupContainer = function(queryManager, resultSetProviderFactory, request, rsDefQueryModel, template)
{
	oFF.DfRsSyncAction.prototype.setupAction.call( this , null, null, null, queryManager);
	this.m_rsDefQueryModel = rsDefQueryModel;
	if (oFF.isNull(template))
	{
		this.m_offsetRows = 0;
		this.m_offsetColumns = 0;
		this.m_maxRows = -1;
		this.m_maxColumns = -1;
		this.m_maxResultRecords = oFF.ResultSetContainer.MAX_RECORDS_DEFAULT;
		this.m_isResultSetTransportEnabled = true;
		this.m_dataRefreshEnabled = oFF.ActionChoice.OFF;
		this.m_suppressCalculatedMembersWithoutBookedData = -1;
	}
	else
	{
		this.m_offsetRows = template.getOffsetRows();
		this.m_offsetColumns = template.getOffsetColumns();
		this.m_maxRows = template.getMaxRows();
		this.m_maxColumns = template.getMaxColumns();
		this.m_maxResultRecords = template.getMaxResultRecords();
		this.m_isResultSetTransportEnabled = template.isResultSetTransportEnabled();
		this.m_resultSetPersistenceTable = template.getResultSetPersistenceTable();
		this.m_resultSetPersistenceType = template.getResultSetPersistenceType();
		this.m_resultSetPersistenceIdentifier = template.getResultSetPersistenceIdentifier();
		this.m_resultSetPersistenceSchema = template.getResultSetPersistenceSchema();
		this.m_executeRequestOnOldResultSet = template.getExecuteRequestOnOldResultSet();
		this.m_dataRefreshEnabled = template.getDataRefreshEnabled();
		this.m_serializedView = template.getSerializedView();
		this.m_serializedCube = template.getSerializedCube();
		this.m_suppressCalculatedMembersWithoutBookedData = template.getSuppressCalculatedMembersWithoutBookedData();
		this.m_lovConfig = template.getLovConfig();
	}
	this.m_dataCellContextResults = oFF.XHashMapByString.create();
	this.m_resultSetProviderFactory = oFF.XWeakReferenceUtil.getWeakRef(resultSetProviderFactory);
	this.m_request = oFF.XWeakReferenceUtil.getWeakRef(request);
	this.m_activeRemoteQueries = oFF.XList.create();
	this.m_activeRemoteRuntimeQueries = oFF.XList.create();
	this.m_transientPrequeries = oFF.XListOfNameObject.create();
};
oFF.ResultSetContainer.prototype.startBatch = function(connectionPool, systemName)
{
	let implicitBatchStarted = false;
	if (!connectionPool.isBatchModeEnabled(systemName))
	{
		connectionPool.enableBatchMode(systemName);
		implicitBatchStarted = true;
	}
	return implicitBatchStarted;
};
oFF.ResultSetContainer.prototype.validateQueryModel = function(queryModel)
{
	queryModel.validateRequiredVersionDimension();
	let dimensionsIterator = queryModel.getLoadedDimensions().getIterator();
	while (dimensionsIterator.hasNext())
	{
		let dimension = dimensionsIterator.next();
		if (dimension.getDimensionType().isTypeOf(oFF.DimensionType.CALCULATED_DIMENSION))
		{
			let calculatedDimension = dimension;
			calculatedDimension.validateJoinFields(queryModel, this);
		}
	}
};

oFF.RsCursorAxis = function() {};
oFF.RsCursorAxis.prototype = new oFF.DfOlapEnvContext();
oFF.RsCursorAxis.prototype._ff_c = "RsCursorAxis";

oFF.RsCursorAxis.create = function(cursorResultSet, provider, rsDefAxis)
{
	let object = new oFF.RsCursorAxis();
	object.setupExt(cursorResultSet, provider, rsDefAxis);
	return object;
};
oFF.RsCursorAxis.prototype.m_alertLevel = 0;
oFF.RsCursorAxis.prototype.m_areAllTupleElementsDrilledToLeaf = null;
oFF.RsCursorAxis.prototype.m_cellValueType = null;
oFF.RsCursorAxis.prototype.m_currencyUnit = null;
oFF.RsCursorAxis.prototype.m_currentCursorFieldValue = null;
oFF.RsCursorAxis.prototype.m_currentMetadataTupleElement = null;
oFF.RsCursorAxis.prototype.m_currentRsDimension = null;
oFF.RsCursorAxis.prototype.m_currentTupleElement = null;
oFF.RsCursorAxis.prototype.m_cursorResultSet = null;
oFF.RsCursorAxis.prototype.m_decimalPlaces = 0;
oFF.RsCursorAxis.prototype.m_dimensionNameToTupleIndicesWithNonLeafDrillState = null;
oFF.RsCursorAxis.prototype.m_dimensions = null;
oFF.RsCursorAxis.prototype.m_exceptionName = null;
oFF.RsCursorAxis.prototype.m_globalFieldIndex = 0;
oFF.RsCursorAxis.prototype.m_globalFieldValueCount = 0;
oFF.RsCursorAxis.prototype.m_longestCellValueFormatted = null;
oFF.RsCursorAxis.prototype.m_longestCellValueRounded = null;
oFF.RsCursorAxis.prototype.m_model = null;
oFF.RsCursorAxis.prototype.m_provider = null;
oFF.RsCursorAxis.prototype.m_rsDefAxis = null;
oFF.RsCursorAxis.prototype.m_scalingFactor = null;
oFF.RsCursorAxis.prototype.m_transientRequiredDimensionIndexes = null;
oFF.RsCursorAxis.prototype.m_tupleElementCount = 0;
oFF.RsCursorAxis.prototype.m_tupleElementIndex = 0;
oFF.RsCursorAxis.prototype.m_tupleElements = null;
oFF.RsCursorAxis.prototype.m_tupleIndex = 0;
oFF.RsCursorAxis.prototype.m_unitIndex = 0;
oFF.RsCursorAxis.prototype.addNextFieldMetadata = function(fieldName, fieldText, isVisible, presentationType, valueType, mimeType, isHierarchyNavigationField, longestAttribute)
{
	let dimension = this.m_currentMetadataTupleElement.getDimensionAtCurrentPositionFromQueryModel();
	let field = null;
	if (oFF.notNull(dimension))
	{
		field = dimension.getFieldByName(fieldName);
	}
	if (oFF.isNull(field))
	{
		if (oFF.notNull(dimension))
		{
			this.getCursorResultSet().getResultSetContainer().addWarning(oFF.ErrorCodes.INVALID_FIELD, oFF.XStringUtils.concatenate3("The field '", fieldName, "' was not part of the metadata document"));
		}
		let queryManager = this.getCursorResultSet().getQueryManager();
		field = oFF.QFactory.createField(queryManager, fieldName);
		if (queryManager.isShallow())
		{
			field._setPresentationType(presentationType);
			field._setMimeType(mimeType);
			field._setHierarchyNavigationField(isHierarchyNavigationField);
		}
	}
	let rsField = this.m_currentRsDimension.addRsField2(fieldName, fieldText, presentationType === oFF.PresentationType.UNDEFINED ? field.getPresentationType() : presentationType, valueType, field.getMimeType(), field.isHierarchyNavigationField(), longestAttribute);
	if (isVisible)
	{
		this.m_currentRsDimension.addRsField(rsField);
	}
	this.m_currentMetadataTupleElement.addRsFieldValue(this.m_currentMetadataTupleElement.createRsFieldValue(field, rsField));
	this.m_globalFieldValueCount++;
};
oFF.RsCursorAxis.prototype.addNextTupleElementMetadata = function(index, inaRsDimension)
{
	let queryModel = this.getQueryModel();
	let dimension = null;
	if (oFF.notNull(queryModel))
	{
		dimension = queryModel.getDimensionByNameFromExistingMetadata(inaRsDimension.getName());
		if (oFF.isNull(dimension))
		{
			dimension = queryModel.getMeasureDimension();
		}
	}
	let currentRsDimension = dimension;
	if (oFF.notNull(dimension) && dimension.getDimensionType() === oFF.DimensionType.ACCOUNT)
	{
		let rsDimensions = this.getRsAxisDef().getRsDimensions();
		for (let i = 0; i < rsDimensions.size(); i++)
		{
			if (oFF.XString.isEqual(rsDimensions.get(i).getName(), dimension.getName()))
			{
				currentRsDimension = rsDimensions.get(i);
			}
		}
	}
	this.m_currentRsDimension = this.getRsAxisDef().newRsDimensionWithInADimension(currentRsDimension, inaRsDimension);
	let tupleElement = oFF.RsCursorAxisTupleElementContent.create(this.getApplication(), dimension, this.m_currentRsDimension);
	this.m_tupleElements.add(tupleElement);
	this.m_currentMetadataTupleElement = tupleElement;
	this.m_dimensions.add(this.m_currentRsDimension);
	this.m_areAllTupleElementsDrilledToLeaf.add(oFF.XBooleanValue.create(true));
};
oFF.RsCursorAxis.prototype.areAllTupleElementsDrilledToLeaf = function(tupleElementCursorIndex)
{
	return this.m_areAllTupleElementsDrilledToLeaf.get(tupleElementCursorIndex).getBoolean();
};
oFF.RsCursorAxis.prototype.cacheCurrentTupleElementForMinimumDrillStateValidation = function()
{
	let resultSet = this.getCursorResultSet();
	let currentTupleElement = this.getCurrentTupleElement();
	if (oFF.notNull(resultSet) && oFF.notNull(currentTupleElement))
	{
		if (this.m_dimensionNameToTupleIndicesWithNonLeafDrillState.isEmpty())
		{
			let validationContexts = resultSet.collectRequiredDimensions();
			oFF.XCollectionUtils.forEach(validationContexts, (validationContext) => {
				oFF.XCollectionUtils.forEach(validationContext.getDimensionNamesWithLeafNodeValidation(), (requiredDimensionName) => {
					this.m_dimensionNameToTupleIndicesWithNonLeafDrillState.put(requiredDimensionName, oFF.XHashSetOfString.create());
				});
			});
		}
		let dimensionAtCurrentPos = currentTupleElement.getDimensionAtCurrentPosition();
		if (oFF.notNull(dimensionAtCurrentPos) && currentTupleElement.getDrillState() !== null && currentTupleElement.getDrillState() !== oFF.DrillState.LEAF && this.m_dimensionNameToTupleIndicesWithNonLeafDrillState.containsKey(dimensionAtCurrentPos.getName()))
		{
			let tupleIndexToDrillState = this.m_dimensionNameToTupleIndicesWithNonLeafDrillState.getByKey(dimensionAtCurrentPos.getName());
			tupleIndexToDrillState.add(oFF.XInteger.convertToString(this.getTupleCursorIndex()));
		}
	}
};
oFF.RsCursorAxis.prototype.clearTransientRequiredDimensionIndexes = function()
{
	this.m_transientRequiredDimensionIndexes = oFF.XObjectExt.release(this.m_transientRequiredDimensionIndexes);
};
oFF.RsCursorAxis.prototype.collectAreAllTupleElementsDrilledToLeaf = function()
{
	let tupleElementCursorIndex = this.getTupleElementCursorIndex();
	if (tupleElementCursorIndex > -1 && this.m_areAllTupleElementsDrilledToLeaf.get(tupleElementCursorIndex).getBoolean() && this.getDrillState() !== null && this.getDrillState() !== oFF.DrillState.LEAF)
	{
		this.m_areAllTupleElementsDrilledToLeaf.set(tupleElementCursorIndex, oFF.XBooleanValue.create(false));
	}
};
oFF.RsCursorAxis.prototype.copyFrom = function(other, flags) {};
oFF.RsCursorAxis.prototype.createDimensionMemberFromCurrentPosition = function()
{
	return this.getCurrentTupleElement().createDimensionMemberFromCurrentPosition();
};
oFF.RsCursorAxis.prototype.createFieldValueFromCurrentPosition = function()
{
	return this.m_currentCursorFieldValue.createFieldValueFromCurrentPosition();
};
oFF.RsCursorAxis.prototype.endAddMetadata = function()
{
	this.m_currentMetadataTupleElement = null;
	this.m_currentRsDimension = null;
};
oFF.RsCursorAxis.prototype.getAbsoluteLevel = function()
{
	return this.getCurrentTupleElement().getAbsoluteLevel();
};
oFF.RsCursorAxis.prototype.getAlertLevel = function()
{
	return this.m_alertLevel;
};
oFF.RsCursorAxis.prototype.getBoolean = function()
{
	return this.m_currentCursorFieldValue.getBoolean();
};
oFF.RsCursorAxis.prototype.getCellValueType = function()
{
	return this.m_cellValueType;
};
oFF.RsCursorAxis.prototype.getChildCount = function()
{
	return this.getCurrentTupleElement().getChildCount();
};
oFF.RsCursorAxis.prototype.getComplexUnit = function()
{
	if (this.m_unitIndex < 0)
	{
		return null;
	}
	let unitsSettings = null;
	let rsCursor = this.getCursorResultSet();
	if (oFF.notNull(rsCursor))
	{
		unitsSettings = rsCursor.getComplexUnitsSetting();
	}
	return oFF.isNull(unitsSettings) || this.m_unitIndex >= unitsSettings.size() ? null : unitsSettings.get(this.m_unitIndex);
};
oFF.RsCursorAxis.prototype.getConvenienceCommands = function()
{
	return this.getQueryModel().getConvenienceCommands();
};
oFF.RsCursorAxis.prototype.getCurrencyUnit = function()
{
	return this.m_currencyUnit;
};
oFF.RsCursorAxis.prototype.getCurrencyUnitBase = function()
{
	return this.m_currencyUnit;
};
oFF.RsCursorAxis.prototype.getCurrentTupleElement = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_currentTupleElement);
};
oFF.RsCursorAxis.prototype.getCursorAxisRequiredDimensionIndexes = function(requiredDimensionNames, memberName)
{
	if (oFF.notNull(this.m_transientRequiredDimensionIndexes) && this.m_transientRequiredDimensionIndexes.containsKey(memberName))
	{
		return this.m_transientRequiredDimensionIndexes.getByKey(memberName);
	}
	let requiredDimNameToIndexMap = oFF.XHashMapByString.create();
	if (!requiredDimensionNames.isEmpty())
	{
		for (let i = 0; i < this.getRsDimensions().size(); ++i)
		{
			let dimension = this.getRsDimensions().get(i);
			if (requiredDimensionNames.contains(dimension.getName()))
			{
				requiredDimNameToIndexMap.put(dimension.getName(), oFF.XIntegerValue.create(i));
			}
			else
			{
				requiredDimNameToIndexMap.put(dimension.getName(), null);
			}
		}
	}
	if (oFF.isNull(this.m_transientRequiredDimensionIndexes))
	{
		this.m_transientRequiredDimensionIndexes = oFF.XHashMapByString.create();
	}
	this.m_transientRequiredDimensionIndexes.put(memberName, requiredDimNameToIndexMap);
	return requiredDimNameToIndexMap;
};
oFF.RsCursorAxis.prototype.getCursorResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
};
oFF.RsCursorAxis.prototype.getDataCount = function()
{
	return this.getProvider().getDataCount();
};
oFF.RsCursorAxis.prototype.getDate = function()
{
	return this.m_currentCursorFieldValue.getDate();
};
oFF.RsCursorAxis.prototype.getDateTime = function()
{
	return this.m_currentCursorFieldValue.getDateTime();
};
oFF.RsCursorAxis.prototype.getDecFloat = function()
{
	return this.m_currentCursorFieldValue.getDecFloat();
};
oFF.RsCursorAxis.prototype.getDecimalPlaces = function()
{
	return this.m_decimalPlaces;
};
oFF.RsCursorAxis.prototype.getDimensionAtCurrentPosition = function()
{
	let currentTupleElement = this.getCurrentTupleElement();
	return oFF.isNull(currentTupleElement) ? null : currentTupleElement.getDimensionAtCurrentPosition();
};
oFF.RsCursorAxis.prototype.getDimensionAtCurrentPositionFromQueryModel = function()
{
	let currentTupleElement = this.getCurrentTupleElement();
	return oFF.isNull(currentTupleElement) ? null : currentTupleElement.getDimensionAtCurrentPositionFromQueryModel();
};
oFF.RsCursorAxis.prototype.getDimensionMember = function()
{
	return this.m_currentCursorFieldValue.getDimensionMember();
};
oFF.RsCursorAxis.prototype.getDimensionMemberAliasOrName = function()
{
	return this.getCurrentTupleElement().getDimensionMemberAliasOrName();
};
oFF.RsCursorAxis.prototype.getDimensionMemberName = function()
{
	return this.getCurrentTupleElement().getDimensionMemberName();
};
oFF.RsCursorAxis.prototype.getDimensionMemberNameValueException = function()
{
	return this.getCurrentTupleElement().getDimensionMemberNameValueException();
};
oFF.RsCursorAxis.prototype.getDimensionMemberType = function()
{
	return this.getCurrentTupleElement().getDimensionMemberType();
};
oFF.RsCursorAxis.prototype.getDisplayLevel = function()
{
	return this.getCurrentTupleElement().getDisplayLevel();
};
oFF.RsCursorAxis.prototype.getDouble = function()
{
	return this.m_currentCursorFieldValue.getDouble();
};
oFF.RsCursorAxis.prototype.getDrillGroupDimensionAtCurrentPosition = function()
{
	let currentTupleElement = this.getCurrentTupleElement();
	return oFF.isNull(currentTupleElement) ? null : currentTupleElement.getDrillGroupDimensionAtCurrentPosition();
};
oFF.RsCursorAxis.prototype.getDrillGroupDimensionInfoAtCurrentPosition = function()
{
	let currentTupleElement = this.getCurrentTupleElement();
	return oFF.isNull(currentTupleElement) ? null : currentTupleElement.getDrillGroupDimensionInfoAtCurrentPosition();
};
oFF.RsCursorAxis.prototype.getDrillState = function()
{
	return this.getCurrentTupleElement().getDrillState();
};
oFF.RsCursorAxis.prototype.getEffectiveRsFields = function()
{
	return this.getRsAxisDef().getEffectiveRsFields();
};
oFF.RsCursorAxis.prototype.getErrorValue = function()
{
	return this.m_currentCursorFieldValue.getErrorValue();
};
oFF.RsCursorAxis.prototype.getExceptionName = function()
{
	return this.m_exceptionName;
};
oFF.RsCursorAxis.prototype.getField = function()
{
	return this.m_currentCursorFieldValue.getField();
};
oFF.RsCursorAxis.prototype.getFieldValue = function()
{
	return this.m_currentCursorFieldValue;
};
oFF.RsCursorAxis.prototype.getFieldValueList = function()
{
	return this.getCurrentTupleElement().getFieldValueList();
};
oFF.RsCursorAxis.prototype.getFieldValues = function(dimensionName, fieldName)
{
	return this.getProvider().getFieldValues(dimensionName, fieldName);
};
oFF.RsCursorAxis.prototype.getFormattedValue = function()
{
	return this.m_currentCursorFieldValue.getFormattedValue();
};
oFF.RsCursorAxis.prototype.getGeometry = function()
{
	return this.m_currentCursorFieldValue.getGeometry();
};
oFF.RsCursorAxis.prototype.getGlobalFieldValueCount = function()
{
	return this.m_globalFieldValueCount;
};
oFF.RsCursorAxis.prototype.getInteger = function()
{
	return this.m_currentCursorFieldValue.getInteger();
};
oFF.RsCursorAxis.prototype.getLineString = function()
{
	return this.m_currentCursorFieldValue.getLineString();
};
oFF.RsCursorAxis.prototype.getLong = function()
{
	return this.m_currentCursorFieldValue.getLong();
};
oFF.RsCursorAxis.prototype.getLongestCellValueFormatted = function()
{
	return this.m_longestCellValueFormatted;
};
oFF.RsCursorAxis.prototype.getLongestCellValueRounded = function()
{
	return this.m_longestCellValueRounded;
};
oFF.RsCursorAxis.prototype.getMultiLineString = function()
{
	return this.m_currentCursorFieldValue.getMultiLineString();
};
oFF.RsCursorAxis.prototype.getMultiPoint = function()
{
	return this.m_currentCursorFieldValue.getMultiPoint();
};
oFF.RsCursorAxis.prototype.getMultiPolygon = function()
{
	return this.m_currentCursorFieldValue.getMultiPolygon();
};
oFF.RsCursorAxis.prototype.getNewLineCollection = function()
{
	if (this.getType() !== oFF.AxisType.ROWS)
	{
		return null;
	}
	if (oFF.isNull(this.m_cursorResultSet))
	{
		return null;
	}
	let resultSetContainer = this.getCursorResultSet().getResultSetContainer();
	return oFF.isNull(resultSetContainer) ? null : resultSetContainer.getNewLineCollection();
};
oFF.RsCursorAxis.prototype.getNodeId = function()
{
	return this.getCurrentTupleElement().getNodeId();
};
oFF.RsCursorAxis.prototype.getNull = function()
{
	return this.m_currentCursorFieldValue.getNull();
};
oFF.RsCursorAxis.prototype.getParentDimensionMemberAliasOrName = function()
{
	return this.getCurrentTupleElement().getParentDimensionMemberAliasOrName();
};
oFF.RsCursorAxis.prototype.getParentDimensionMemberName = function()
{
	return this.getCurrentTupleElement().getParentDimensionMemberName();
};
oFF.RsCursorAxis.prototype.getParentNodeIndex = function()
{
	return this.getCurrentTupleElement().getParentNodeIndex();
};
oFF.RsCursorAxis.prototype.getPoint = function()
{
	return this.m_currentCursorFieldValue.getPoint();
};
oFF.RsCursorAxis.prototype.getPolygon = function()
{
	return this.m_currentCursorFieldValue.getPolygon();
};
oFF.RsCursorAxis.prototype.getPropertiesValue = function()
{
	return this.m_currentCursorFieldValue.getPropertiesValue();
};
oFF.RsCursorAxis.prototype.getProvider = function()
{
	return this.m_provider;
};
oFF.RsCursorAxis.prototype.getQueryModel = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_model);
};
oFF.RsCursorAxis.prototype.getRsAxisDef = function()
{
	return this.m_rsDefAxis;
};
oFF.RsCursorAxis.prototype.getRsDimensionAtCurrentPosition = function()
{
	let currentTupleElement = this.getCurrentTupleElement();
	return oFF.isNull(currentTupleElement) ? null : currentTupleElement.getRsDimensionAtCurrentPosition();
};
oFF.RsCursorAxis.prototype.getRsDimensions = function()
{
	return this.m_dimensions;
};
oFF.RsCursorAxis.prototype.getRsField = function()
{
	return this.m_currentCursorFieldValue.getRsField();
};
oFF.RsCursorAxis.prototype.getScalingFactor = function()
{
	return this.m_scalingFactor;
};
oFF.RsCursorAxis.prototype.getString = function()
{
	return this.m_currentCursorFieldValue.getString();
};
oFF.RsCursorAxis.prototype.getStructureListValue = function()
{
	return this.m_currentCursorFieldValue.getStructureListValue();
};
oFF.RsCursorAxis.prototype.getStructureValue = function()
{
	return this.m_currentCursorFieldValue.getStructureValue();
};
oFF.RsCursorAxis.prototype.getTime = function()
{
	return this.m_currentCursorFieldValue.getTime();
};
oFF.RsCursorAxis.prototype.getTimeSpan = function()
{
	return this.m_currentCursorFieldValue.getTimeSpan();
};
oFF.RsCursorAxis.prototype.getTupleCursorIndex = function()
{
	return this.m_tupleIndex;
};
oFF.RsCursorAxis.prototype.getTupleElementCursorIndex = function()
{
	return this.m_tupleElementIndex;
};
oFF.RsCursorAxis.prototype.getTupleElementsCount = function()
{
	return this.m_tupleElementCount;
};
oFF.RsCursorAxis.prototype.getTuplesCount = function()
{
	return this.getProvider().getTuplesCount();
};
oFF.RsCursorAxis.prototype.getTuplesCountTotal = function()
{
	return this.getProvider().getTuplesCountTotal();
};
oFF.RsCursorAxis.prototype.getType = function()
{
	return this.getRsAxisDef().getType();
};
oFF.RsCursorAxis.prototype.getUdhKey = function()
{
	return this.m_currentCursorFieldValue.getUdhKey();
};
oFF.RsCursorAxis.prototype.getValue = function()
{
	return this.m_currentCursorFieldValue.getValue();
};
oFF.RsCursorAxis.prototype.getValueException = function()
{
	return this.m_currentCursorFieldValue.getValueException();
};
oFF.RsCursorAxis.prototype.getValueOfHierarchyNavigationKey = function()
{
	return this.getCurrentTupleElement().getValueOfHierarchyNavigationKey();
};
oFF.RsCursorAxis.prototype.getValueType = function()
{
	return this.m_currentCursorFieldValue.getField().getValueType();
};
oFF.RsCursorAxis.prototype.hasNextFieldValue = function()
{
	return oFF.isNull(this.m_currentTupleElement) ? false : this.getCurrentTupleElement().hasNextFieldValue();
};
oFF.RsCursorAxis.prototype.hasNextGlobalFieldValue = function()
{
	return this.m_globalFieldIndex < this.m_globalFieldValueCount - 1;
};
oFF.RsCursorAxis.prototype.hasNextTuple = function()
{
	return this.m_tupleIndex < this.getTuplesCount() - 1;
};
oFF.RsCursorAxis.prototype.hasNextTupleElement = function()
{
	return this.m_tupleElementIndex < this.m_tupleElementCount - 1;
};
oFF.RsCursorAxis.prototype.hasUniqueCellValueType = function()
{
	return oFF.notNull(this.m_cellValueType);
};
oFF.RsCursorAxis.prototype.hasUniqueComplexUnit = function()
{
	return this.m_unitIndex > -1;
};
oFF.RsCursorAxis.prototype.hasUniqueCurrencyUnit = function()
{
	return oFF.notNull(this.m_currencyUnit) && !this.m_currencyUnit.isInitial();
};
oFF.RsCursorAxis.prototype.hasUniqueDecimalPlaces = function()
{
	return this.m_decimalPlaces > -1;
};
oFF.RsCursorAxis.prototype.hasUniqueScalingFactor = function()
{
	return oFF.notNull(this.m_scalingFactor);
};
oFF.RsCursorAxis.prototype.hasValue = oFF.noSupport;
oFF.RsCursorAxis.prototype.isDimensionMemberDrillStateLeafAtIndex = function(dimensionName, tupleIndex)
{
	let tupleIndicesWithNonLeafDrillState = this.m_dimensionNameToTupleIndicesWithNonLeafDrillState.getByKey(dimensionName);
	if (oFF.isNull(tupleIndicesWithNonLeafDrillState))
	{
		throw oFF.XException.createIllegalStateException("setCollectDrillStateForDimensions must be called first when processing the result set in order to use this method");
	}
	return !tupleIndicesWithNonLeafDrillState.contains(oFF.XInteger.convertToString(tupleIndex));
};
oFF.RsCursorAxis.prototype.loadDimensionStructureMembers = function()
{
	let queryModel = this.getQueryModel();
	let rsDimensions = this.getRsDimensions();
	if (oFF.notNull(queryModel) && rsDimensions.hasElements())
	{
		let dimensionNames = oFF.XHashMapByString.create();
		let lazyLoaders = oFF.XHashMapByString.create();
		oFF.XCollectionUtils.forEach(rsDimensions, (rsDimension) => {
			let dimension = queryModel.getDimensionByName(rsDimension.getName());
			if (oFF.notNull(dimension) && dimension.isStructureMemberLazyLoadSupported())
			{
				dimensionNames.put(dimension.getName(), oFF.XList.create());
				lazyLoaders.put(dimension.getName(), dimension.getStructureMemberLazyLoader());
				dimension.setStructureMemberLazyLoader(null);
			}
		});
		if (dimensionNames.hasElements())
		{
			while (this.hasNextTuple())
			{
				this.nextTuple();
				while (this.hasNextTupleElement())
				{
					let tupleElement = this.nextTupleElement();
					let dimension = tupleElement.getDimensionAtCurrentPositionFromQueryModel();
					let memberNames = oFF.notNull(dimension) ? dimensionNames.getByKey(dimension.getName()) : null;
					if (oFF.notNull(memberNames))
					{
						memberNames.add(tupleElement.getDimensionMemberName());
					}
				}
			}
			this.setTupleCursorBeforeStart();
			oFF.XCollectionUtils.forEach(dimensionNames.getKeysAsReadOnlyList(), (dimensionName) => {
				let dimension = queryModel.getDimensionByName(dimensionName);
				dimension.setStructureMemberLazyLoader(lazyLoaders.getByKey(dimensionName));
				dimension.loadStructureMembers(dimensionNames.getByKey(dimensionName));
			});
		}
	}
};
oFF.RsCursorAxis.prototype.nextFieldValue = function()
{
	if (oFF.notNull(this.m_currentTupleElement))
	{
		this.m_currentCursorFieldValue = this.getCurrentTupleElement().nextFieldValue();
	}
	return this.m_currentCursorFieldValue;
};
oFF.RsCursorAxis.prototype.nextGlobalFieldValue = function()
{
	if (!this.hasNextFieldValue())
	{
		oFF.XBooleanUtils.checkTrue(this.hasNextTupleElement(), "No more tuple elements");
		this.nextTupleElement();
	}
	this.m_globalFieldIndex++;
	return this.nextFieldValue();
};
oFF.RsCursorAxis.prototype.nextTuple = function()
{
	++this.m_tupleIndex;
	this.setGlobalFieldCursorBeforeStart();
	this.getProvider().notifyAxisCursorChange(this.m_tupleIndex);
	this.setGlobalFieldCursorBeforeStart();
};
oFF.RsCursorAxis.prototype.nextTupleElement = function()
{
	this.m_tupleElementIndex++;
	this.setCurrentTupleElement().setFieldValueCursorBeforeStart();
	return this.getCurrentTupleElement();
};
oFF.RsCursorAxis.prototype.parseString = oFF.noSupport;
oFF.RsCursorAxis.prototype.releaseObject = function()
{
	this.m_tupleElements = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tupleElements);
	this.m_currentCursorFieldValue = oFF.XObjectExt.release(this.m_currentCursorFieldValue);
	this.m_currentMetadataTupleElement = oFF.XObjectExt.release(this.m_currentMetadataTupleElement);
	this.m_currentRsDimension = oFF.XObjectExt.release(this.m_currentRsDimension);
	this.m_dimensions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimensions);
	this.m_currentTupleElement = oFF.XObjectExt.release(this.m_currentTupleElement);
	this.m_rsDefAxis = oFF.XObjectExt.release(this.m_rsDefAxis);
	this.m_exceptionName = null;
	this.m_model = oFF.XObjectExt.release(this.m_model);
	this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
	this.m_provider = oFF.XObjectExt.release(this.m_provider);
	this.m_transientRequiredDimensionIndexes = oFF.XObjectExt.release(this.m_transientRequiredDimensionIndexes);
	this.m_areAllTupleElementsDrilledToLeaf = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_areAllTupleElementsDrilledToLeaf);
	this.m_dimensionNameToTupleIndicesWithNonLeafDrillState = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_dimensionNameToTupleIndicesWithNonLeafDrillState);
	this.m_unitIndex = -1;
	this.m_currencyUnit = oFF.XObjectExt.release(this.m_currencyUnit);
	this.m_decimalPlaces = -1;
	this.m_scalingFactor = null;
	this.m_cellValueType = null;
	this.m_longestCellValueRounded = null;
	this.m_longestCellValueFormatted = null;
	oFF.DfOlapEnvContext.prototype.releaseObject.call( this );
};
oFF.RsCursorAxis.prototype.resetAreAllTupleElementsDrilledToLeaf = function()
{
	let iterator = this.m_areAllTupleElementsDrilledToLeaf.getIterator();
	while (iterator.hasNext())
	{
		let areAllTupleElementsDrilledToLeaf = iterator.next();
		areAllTupleElementsDrilledToLeaf.setBoolean(true);
	}
};
oFF.RsCursorAxis.prototype.setAbsoluteLevel = function(absoluteLevel)
{
	this.getCurrentTupleElement().setAbsoluteLevel(absoluteLevel);
};
oFF.RsCursorAxis.prototype.setAlertLevel = function(alertLevel)
{
	this.m_alertLevel = alertLevel;
};
oFF.RsCursorAxis.prototype.setBoolean = function(value)
{
	this.m_currentCursorFieldValue.setBoolean(value);
};
oFF.RsCursorAxis.prototype.setCellValueType = function(valueType)
{
	this.m_cellValueType = valueType;
};
oFF.RsCursorAxis.prototype.setChildCount = function(childCount)
{
	this.getCurrentTupleElement().setChildCount(childCount);
};
oFF.RsCursorAxis.prototype.setCurrentTupleElement = function()
{
	let newCurrent = this.m_tupleElements.get(this.m_tupleElementIndex);
	this.m_currentTupleElement = oFF.XWeakReferenceUtil.getWeakRef(newCurrent);
	return newCurrent;
};
oFF.RsCursorAxis.prototype.setDate = function(value)
{
	this.m_currentCursorFieldValue.setDate(value);
};
oFF.RsCursorAxis.prototype.setDateTime = function(value)
{
	this.m_currentCursorFieldValue.setDateTime(value);
};
oFF.RsCursorAxis.prototype.setDecFloat = function(value)
{
	this.m_currentCursorFieldValue.setDecFloat(value);
};
oFF.RsCursorAxis.prototype.setDecimalPlaces = function(decimalPlaces)
{
	this.m_decimalPlaces = decimalPlaces;
};
oFF.RsCursorAxis.prototype.setDimensionMemberName = function(name)
{
	this.getCurrentTupleElement().setDimensionMemberName(name);
};
oFF.RsCursorAxis.prototype.setDimensionMemberNameValueException = function(valueException)
{
	this.getCurrentTupleElement().setDimensionMemberNameValueException(valueException);
};
oFF.RsCursorAxis.prototype.setDimensionMemberType = function(type)
{
	this.getCurrentTupleElement().setDimensionMemberType(type);
};
oFF.RsCursorAxis.prototype.setDisplayLevel = function(displayLevel)
{
	this.getCurrentTupleElement().setDisplayLevel(displayLevel);
};
oFF.RsCursorAxis.prototype.setDouble = function(value)
{
	this.m_currentCursorFieldValue.setDouble(value);
};
oFF.RsCursorAxis.prototype.setDrillGroupDimensionAtCurrentPosition = function(dimension)
{
	let currentTupleElement = this.getCurrentTupleElement();
	if (oFF.notNull(currentTupleElement))
	{
		currentTupleElement.setDrillGroupDimensionAtCurrentPosition(dimension);
	}
};
oFF.RsCursorAxis.prototype.setDrillGroupDimensionInfoAtCurrentPosition = function(dimensionInfo)
{
	let currentTupleElement = this.getCurrentTupleElement();
	if (oFF.notNull(currentTupleElement))
	{
		currentTupleElement.setDrillGroupDimensionInfoAtCurrentPosition(dimensionInfo);
	}
};
oFF.RsCursorAxis.prototype.setDrillGroupIndex = function(drillGroupIndex)
{
	let dimension = this.getDimensionAtCurrentPositionFromQueryModel();
	if (oFF.notNull(dimension) && dimension.isUniversalDisplayHierarchyDimension())
	{
		let groupIndex = drillGroupIndex - this.m_tupleElementIndex;
		let udhDimensionNames = dimension.getUniversalDisplayHierarchy().getDimensionNames();
		let queryModel = this.getQueryModel();
		let drillGroupDimension = null;
		if (groupIndex >= 0 && udhDimensionNames.size() > groupIndex && oFF.notNull(queryModel))
		{
			drillGroupDimension = queryModel.getDimensionByNameFromExistingMetadata(udhDimensionNames.get(groupIndex));
		}
		this.setDrillGroupDimensionAtCurrentPosition(drillGroupDimension);
	}
};
oFF.RsCursorAxis.prototype.setDrillState = function(drillState)
{
	this.getCurrentTupleElement().setDrillState(drillState);
};
oFF.RsCursorAxis.prototype.setErrorValue = function(value)
{
	this.m_currentCursorFieldValue.setErrorValue(value);
};
oFF.RsCursorAxis.prototype.setExceptionName = function(exceptionName)
{
	this.m_exceptionName = exceptionName;
};
oFF.RsCursorAxis.prototype.setFieldValueCursorBeforeStart = function()
{
	if (oFF.notNull(this.m_currentTupleElement))
	{
		this.getCurrentTupleElement().setFieldValueCursorBeforeStart();
	}
	this.m_currentCursorFieldValue = null;
};
oFF.RsCursorAxis.prototype.setFormattedValue = function(formattedValue)
{
	this.m_currentCursorFieldValue.setFormattedValue(formattedValue);
};
oFF.RsCursorAxis.prototype.setGlobalFieldCursorBeforeStart = function()
{
	this.m_globalFieldIndex = -1;
	this.setTupleElementCursorBeforeStart();
};
oFF.RsCursorAxis.prototype.setInteger = function(value)
{
	this.m_currentCursorFieldValue.setInteger(value);
};
oFF.RsCursorAxis.prototype.setLineString = function(value)
{
	this.m_currentCursorFieldValue.setLineString(value);
};
oFF.RsCursorAxis.prototype.setLong = function(value)
{
	this.m_currentCursorFieldValue.setLong(value);
};
oFF.RsCursorAxis.prototype.setLongestCellValueFormatted = function(formatted)
{
	this.m_longestCellValueFormatted = formatted;
};
oFF.RsCursorAxis.prototype.setLongestCellValueRounded = function(rounded)
{
	this.m_longestCellValueRounded = rounded;
};
oFF.RsCursorAxis.prototype.setMultiLineString = function(value)
{
	this.m_currentCursorFieldValue.setMultiLineString(value);
};
oFF.RsCursorAxis.prototype.setMultiPoint = function(value)
{
	this.m_currentCursorFieldValue.setMultiPoint(value);
};
oFF.RsCursorAxis.prototype.setMultiPolygon = function(value)
{
	this.m_currentCursorFieldValue.setMultiPolygon(value);
};
oFF.RsCursorAxis.prototype.setNodeId = function(nodeId)
{
	this.getCurrentTupleElement().setNodeId(nodeId);
};
oFF.RsCursorAxis.prototype.setNullByType = function(nullValueType)
{
	this.m_currentCursorFieldValue.setNullByType(nullValueType);
};
oFF.RsCursorAxis.prototype.setParentDimensionMemberName = function(name)
{
	this.getCurrentTupleElement().setParentDimensionMemberName(name);
};
oFF.RsCursorAxis.prototype.setParentNodeIndex = function(parentIndex)
{
	this.getCurrentTupleElement().setParentNodeIndex(parentIndex);
};
oFF.RsCursorAxis.prototype.setPoint = function(value)
{
	this.m_currentCursorFieldValue.setPoint(value);
};
oFF.RsCursorAxis.prototype.setPolygon = function(value)
{
	this.m_currentCursorFieldValue.setPolygon(value);
};
oFF.RsCursorAxis.prototype.setPropertiesValue = function(properties)
{
	this.m_currentCursorFieldValue.setPropertiesValue(properties);
};
oFF.RsCursorAxis.prototype.setQueryModel = function(model)
{
	this.m_model = oFF.XWeakReferenceUtil.getWeakRef(model);
};
oFF.RsCursorAxis.prototype.setScalingFactor = function(scalingFactor)
{
	this.m_scalingFactor = scalingFactor;
};
oFF.RsCursorAxis.prototype.setString = function(value)
{
	this.m_currentCursorFieldValue.setString(value);
};
oFF.RsCursorAxis.prototype.setStructureListValue = function(value)
{
	this.m_currentCursorFieldValue.setStructureListValue(value);
};
oFF.RsCursorAxis.prototype.setStructureValue = function(value)
{
	this.m_currentCursorFieldValue.setStructureValue(value);
};
oFF.RsCursorAxis.prototype.setTime = function(value)
{
	this.m_currentCursorFieldValue.setTime(value);
};
oFF.RsCursorAxis.prototype.setTimeSpan = function(value)
{
	this.m_currentCursorFieldValue.setTimeSpan(value);
};
oFF.RsCursorAxis.prototype.setTupleAndTupleElementCursor = function(tupleCursorIndex, tupleElementCursorIndex)
{
	if (this.getTupleCursorIndex() !== tupleCursorIndex)
	{
		this.setTupleCursorBeforeStart();
		if (tupleCursorIndex !== -1)
		{
			while (this.hasNextTuple() && this.getTupleCursorIndex() !== tupleCursorIndex)
			{
				this.nextTuple();
			}
		}
	}
	if (this.getTupleElementCursorIndex() !== tupleElementCursorIndex)
	{
		this.setTupleElementCursorBeforeStart();
		if (tupleElementCursorIndex !== -1)
		{
			this.m_tupleElementIndex = tupleElementCursorIndex;
			this.setCurrentTupleElement().setFieldValueCursorBeforeStart();
		}
	}
};
oFF.RsCursorAxis.prototype.setTupleCursorBeforeStart = function()
{
	this.m_tupleIndex = -1;
	this.setGlobalFieldCursorBeforeStart();
};
oFF.RsCursorAxis.prototype.setTupleCursorToIndex = function(index)
{
	this.m_tupleIndex = index;
	this.setGlobalFieldCursorBeforeStart();
	this.getProvider().notifyAxisCursorChange(this.m_tupleIndex);
	this.setGlobalFieldCursorBeforeStart();
};
oFF.RsCursorAxis.prototype.setTupleElementCursorBeforeStart = function()
{
	this.m_tupleElementIndex = -1;
	this.m_currentTupleElement = null;
	this.setFieldValueCursorBeforeStart();
};
oFF.RsCursorAxis.prototype.setTuplesCount = function(tuplesCount, tuplesCountTotal)
{
	this.getProvider().setTuplesCount(tuplesCount, tuplesCountTotal);
};
oFF.RsCursorAxis.prototype.setUdhKey = function(udhKey)
{
	this.m_currentCursorFieldValue.setUdhKey(udhKey);
};
oFF.RsCursorAxis.prototype.setUnitIndex = function(unitIndex)
{
	this.m_unitIndex = unitIndex;
};
oFF.RsCursorAxis.prototype.setValueException = function(valueException)
{
	this.m_currentCursorFieldValue.setValueException(valueException);
};
oFF.RsCursorAxis.prototype.setValueOfHierarchyNavigationKey = function(value)
{
	this.getCurrentTupleElement().setValueOfHierarchyNavigationKey(value);
};
oFF.RsCursorAxis.prototype.setXValue = function(value)
{
	this.copyFrom(oFF.XValueAccess.createWithValue(value), null);
};
oFF.RsCursorAxis.prototype.setupExt = function(cursorResultSet, provider, rsDefAxis)
{
	this.setupOlapApplicationContext(cursorResultSet.getOlapEnv());
	this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCurrencyUnit();
	this.m_rsDefAxis = rsDefAxis;
	this.m_provider = provider;
	provider.setCursorAxis(this);
	this.m_tupleIndex = -1;
	this.m_tupleElementCount = provider.getTupleElementsCount();
	this.m_tupleElementIndex = -1;
	this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(cursorResultSet);
	this.setQueryModel(cursorResultSet.getQueryModel());
	this.m_globalFieldValueCount = 0;
	this.m_globalFieldIndex = -1;
	this.m_unitIndex = -1;
	this.m_decimalPlaces = -1;
	this.m_dimensionNameToTupleIndicesWithNonLeafDrillState = oFF.XHashMapByString.create();
	provider.notifySetAxisMetadata();
};
oFF.RsCursorAxis.prototype.startAddMetadata = function(dimensionsSize)
{
	this.m_tupleElements = oFF.XList.create();
	this.m_globalFieldValueCount = 0;
	this.m_dimensions = oFF.XList.create();
	this.m_areAllTupleElementsDrilledToLeaf = oFF.XList.create();
};
oFF.RsCursorAxis.prototype.validateMinimumDrillStateLeafNodes = function(result, index, requiredDimensionNames, dimensionName, memberName)
{
	let reqDimIndexes = this.getCursorAxisRequiredDimensionIndexes(requiredDimensionNames, memberName);
	if (reqDimIndexes.isEmpty())
	{
		return;
	}
	let iterator = reqDimIndexes.getKeysAsIterator();
	let originalTupleIndex = this.getTupleCursorIndex();
	let originalTupleElementIndex = this.getTupleElementCursorIndex();
	while (iterator.hasNext())
	{
		let reqDimName = iterator.next();
		let tupleElementIndex = reqDimIndexes.getByKey(reqDimName);
		if (oFF.notNull(tupleElementIndex))
		{
			if (index > -1)
			{
				try
				{
					if (!this.isDimensionMemberDrillStateLeafAtIndex(reqDimName, index))
					{
						result.addNonLeafRequiredDimensionName(dimensionName, memberName, reqDimName);
					}
				}
				catch (t)
				{
					this.setTupleAndTupleElementCursor(index, tupleElementIndex.getInteger());
					if (this.getDrillState() !== null && this.getDrillState() !== oFF.DrillState.LEAF)
					{
						result.addNonLeafRequiredDimensionName(dimensionName, memberName, reqDimName);
					}
				}
			}
			else
			{
				if (!this.areAllTupleElementsDrilledToLeaf(tupleElementIndex.getInteger()))
				{
					result.addNonLeafRequiredDimensionName(dimensionName, memberName, reqDimName);
				}
			}
		}
	}
	this.setTupleAndTupleElementCursor(originalTupleIndex, originalTupleElementIndex);
};

oFF.RsCursorResultSet = function() {};
oFF.RsCursorResultSet.prototype = new oFF.DfRsSyncAction();
oFF.RsCursorResultSet.prototype._ff_c = "RsCursorResultSet";

oFF.RsCursorResultSet.create = function(resultSetManager, providerFactory, request, rsDefQueryModel)
{
	let resultSet = new oFF.RsCursorResultSet();
	resultSet.setupResultSet(resultSetManager, providerFactory, request, rsDefQueryModel);
	return resultSet;
};
oFF.RsCursorResultSet.prototype.m_availableDataCellCount = 0;
oFF.RsCursorResultSet.prototype.m_columnAxis = null;
oFF.RsCursorResultSet.prototype.m_complexUnitsSetting = null;
oFF.RsCursorResultSet.prototype.m_currentColumn = 0;
oFF.RsCursorResultSet.prototype.m_currentRow = 0;
oFF.RsCursorResultSet.prototype.m_dataCell = null;
oFF.RsCursorResultSet.prototype.m_dataCellProvider = null;
oFF.RsCursorResultSet.prototype.m_dataColumns = 0;
oFF.RsCursorResultSet.prototype.m_dataEntryEnabled = false;
oFF.RsCursorResultSet.prototype.m_dataEntryMask = null;
oFF.RsCursorResultSet.prototype.m_dataRows = 0;
oFF.RsCursorResultSet.prototype.m_inputReadinessStates = null;
oFF.RsCursorResultSet.prototype.m_memberOverrideTexts = null;
oFF.RsCursorResultSet.prototype.m_provider = null;
oFF.RsCursorResultSet.prototype.m_providerFactory = null;
oFF.RsCursorResultSet.prototype.m_request = null;
oFF.RsCursorResultSet.prototype.m_resultsetContainer = null;
oFF.RsCursorResultSet.prototype.m_rowsAxis = null;
oFF.RsCursorResultSet.prototype.m_rsDefQueryModel = null;
oFF.RsCursorResultSet.prototype.m_state = null;
oFF.RsCursorResultSet.prototype.m_totalOverrideText = null;
oFF.RsCursorResultSet.prototype.m_transientRequiredDimensionNamesByMeasureNameMap = null;
oFF.RsCursorResultSet.prototype.addTupleDimensionInfoToValidationContext = function(cursorAxis, validationContext)
{
	let originalTupleIndex = cursorAxis.getTupleCursorIndex();
	let originalTupleElementIndex = cursorAxis.getTupleElementCursorIndex();
	cursorAxis.setTupleCursorBeforeStart();
	while (cursorAxis.hasNextTuple())
	{
		cursorAxis.nextTuple();
		while (cursorAxis.hasNextTupleElement())
		{
			cursorAxis.nextTupleElement();
			if (cursorAxis.getTupleElementCursorIndex() === validationContext.getTupleElementIndex())
			{
				validationContext.addDimensionMemberNameInResultSetTupleOrder(cursorAxis.getDimensionMemberName());
				validationContext.addRsDimensionInResultSetTupleOrder(cursorAxis.getRsDimensionAtCurrentPosition());
				break;
			}
		}
	}
	cursorAxis.setTupleAndTupleElementCursor(originalTupleIndex, originalTupleElementIndex);
};
oFF.RsCursorResultSet.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onResultSetFetch(extResult, data, customIdentifier);
};
oFF.RsCursorResultSet.prototype.clearTransientRequiredDimensionMap = function()
{
	this.m_transientRequiredDimensionNamesByMeasureNameMap = oFF.XObjectExt.release(this.m_transientRequiredDimensionNamesByMeasureNameMap);
	this.m_rowsAxis.clearTransientRequiredDimensionIndexes();
	this.m_columnAxis.clearTransientRequiredDimensionIndexes();
};
oFF.RsCursorResultSet.prototype.cloneExt = function(flags)
{
	return this.cloneRsCursorResultSet();
};
oFF.RsCursorResultSet.prototype.cloneRsCursorResultSet = function()
{
	let clone = oFF.RsCursorResultSet.create(this.getResultSetContainer(), this.getProviderFactory(), this.getRequest(), this.getRsQueryModelDef());
	clone.m_provider = this.m_provider.clone();
	clone.m_provider.setResultSet(this);
	clone.setupFromProvider();
	if (oFF.notNull(this.m_inputReadinessStates))
	{
		clone.m_inputReadinessStates = this.m_inputReadinessStates.createListCopy();
	}
	clone.m_state = this.m_state;
	if (oFF.notNull(this.m_dataEntryMask))
	{
		clone.m_dataEntryMask = this.m_dataEntryMask.createListCopy();
	}
	if (oFF.notNull(this.m_memberOverrideTexts))
	{
		clone.m_memberOverrideTexts = this.m_memberOverrideTexts.createMapByStringCopy();
	}
	return clone;
};
oFF.RsCursorResultSet.prototype.collectDimensionMemberNamesInTuples = function(cursorAxis, dimensionName)
{
	let inUseMemberNames = oFF.XHashSetOfString.create();
	let rsDimension = oFF.XCollectionUtils.findFirst(cursorAxis.getRsDimensions(), (dimension) => {
		return oFF.XString.isEqual(dimension.getName(), dimensionName);
	});
	let allFields = rsDimension.getAllFields();
	let hierarchyKeyField = oFF.XCollectionUtils.findFirst(allFields, (field1) => {
		return field1.getPresentationType() === oFF.PresentationType.HIERARCHY_KEY;
	});
	if (oFF.notNull(hierarchyKeyField))
	{
		inUseMemberNames.addAll(cursorAxis.getFieldValues(rsDimension.getName(), hierarchyKeyField.getName()));
	}
	if (inUseMemberNames.isEmpty())
	{
		let flatKeyField = oFF.XCollectionUtils.findFirst(allFields, (field2) => {
			return field2.getPresentationType() === oFF.PresentationType.KEY;
		});
		if (oFF.notNull(flatKeyField))
		{
			inUseMemberNames.addAll(cursorAxis.getFieldValues(rsDimension.getName(), flatKeyField.getName()));
		}
	}
	return inUseMemberNames;
};
oFF.RsCursorResultSet.prototype.collectRequiredDimensions = function()
{
	if (oFF.notNull(this.m_transientRequiredDimensionNamesByMeasureNameMap))
	{
		return this.m_transientRequiredDimensionNamesByMeasureNameMap;
	}
	this.m_transientRequiredDimensionNamesByMeasureNameMap = oFF.XHashMapByString.create();
	this.collectRequiredDimensionsForAxis(oFF.AxisType.ROWS, this.m_transientRequiredDimensionNamesByMeasureNameMap);
	this.collectRequiredDimensionsForAxis(oFF.AxisType.COLUMNS, this.m_transientRequiredDimensionNamesByMeasureNameMap);
	return this.m_transientRequiredDimensionNamesByMeasureNameMap;
};
oFF.RsCursorResultSet.prototype.collectRequiredDimensionsForAxis = function(axisType, reqDimensionNamesMap)
{
	let cursorAxis = this.getCursorAxis(axisType);
	let rsDimensions = cursorAxis.getRsDimensions();
	if (this.getRsQueryModelDef() !== null)
	{
		let axisDef = this.getRsQueryModelDef().getAxisDef(axisType);
		if (oFF.notNull(axisDef) && axisDef.getRsDimensions().size() > 0)
		{
			rsDimensions = axisDef.getRsDimensions();
		}
	}
	for (let i = 0; i < rsDimensions.size(); ++i)
	{
		let rsDimension = rsDimensions.get(i);
		let dimensionType = rsDimension.getDimensionType();
		if (dimensionType === oFF.DimensionType.ACCOUNT || dimensionType === oFF.DimensionType.MEASURE_STRUCTURE)
		{
			let inUseMemberNames = this.collectDimensionMemberNamesInTuples(cursorAxis, rsDimension.getName());
			let validationContext = oFF.RsMinimumDrillStateValidationContext.create(axisType, i);
			let allStructureMembers = rsDimension.getAllStructureMembers();
			let rsDefIterator = allStructureMembers.getIterator();
			let rsDefStructureMember;
			let allAvailableFormulaExceptionIds = oFF.XHashSetOfString.create();
			while (rsDefIterator.hasNext())
			{
				rsDefStructureMember = rsDefIterator.next();
				allAvailableFormulaExceptionIds.addAll(rsDefStructureMember.getAvailableFormulaExceptionIds(null));
			}
			rsDefIterator = allStructureMembers.getIterator();
			while (rsDefIterator.hasNext())
			{
				rsDefStructureMember = rsDefIterator.next();
				let rsDefStructureMemberAliasOrName = rsDefStructureMember.getAliasOrMemberName();
				let nestedRsAllRequiredDimensionProperties = rsDefStructureMember.getNestedAllRequiredDimensionProperties(null, null, true, null);
				let nestedRsMemberQueryProperties = nestedRsAllRequiredDimensionProperties.getFirstObject();
				let isOutOfContextValue = nestedRsAllRequiredDimensionProperties.getSecondObject();
				if (inUseMemberNames.contains(rsDefStructureMember.getName()) || allAvailableFormulaExceptionIds.contains(rsDefStructureMemberAliasOrName) || allAvailableFormulaExceptionIds.contains(rsDefStructureMember.getName()))
				{
					validationContext.addRequiredDimensionNames(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.ALL_REQUIRED_DIMENSIONS.getName()));
					validationContext.addUnsatisfiedRequiredDimensionNames(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.UNSATISFIED_REQUIRED_DIMENSIONS.getName()));
					validationContext.addNestedMinimumDrillState(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.MINIMUM_DRILL_STATE_DIMENSIONS.getName()));
				}
				else if (oFF.isNull(isOutOfContextValue) || isOutOfContextValue.getBoolean())
				{
					validationContext.addOutOfContextRequiredDimensionNames(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.ALL_REQUIRED_DIMENSIONS.getName()));
					validationContext.addOutOfContextUnsatisfiedRequiredDimensionNames(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.UNSATISFIED_REQUIRED_DIMENSIONS.getName()));
					validationContext.addOutOfContextNestedMinimumDrillState(rsDefStructureMemberAliasOrName, nestedRsMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.MINIMUM_DRILL_STATE_DIMENSIONS.getName()));
				}
			}
			let queryModel = this.getQueryModel();
			if (oFF.notNull(queryModel) && dimensionType === oFF.DimensionType.ACCOUNT)
			{
				let dimension = queryModel.getDimensionByName(rsDimension.getName());
				let inUseMemberIterator = inUseMemberNames.getIterator();
				while (inUseMemberIterator.hasNext())
				{
					let inUseMemberName = inUseMemberIterator.next();
					let structureMember = dimension.getStructureMember(inUseMemberName);
					if (oFF.notNull(structureMember))
					{
						let memberName = structureMember.getAliasOrMemberName();
						let nestedAllRequiredDimensionProperties = structureMember.getNestedAllRequiredDimensionProperties(cursorAxis.getRsAxisDef(), null, false, null);
						let nestedMemberQueryProperties = nestedAllRequiredDimensionProperties.getFirstObject();
						validationContext.addRequiredDimensionNames(memberName, nestedMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.ALL_REQUIRED_DIMENSIONS.getName()));
						validationContext.addUnsatisfiedRequiredDimensionNames(memberName, nestedMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.UNSATISFIED_REQUIRED_DIMENSIONS.getName()));
						validationContext.addNestedMinimumDrillState(memberName, nestedMemberQueryProperties.getByKey(oFF.QStructureMemberQueryProperties.MINIMUM_DRILL_STATE_DIMENSIONS.getName()));
					}
				}
			}
			if (!validationContext.isEmpty())
			{
				this.addTupleDimensionInfoToValidationContext(cursorAxis, validationContext);
				reqDimensionNamesMap.put(rsDimension.getName(), validationContext);
			}
		}
	}
};
oFF.RsCursorResultSet.prototype.createRuntimeRsDefStructureMembers = function(runtimeStructureMemberPropertiesMap)
{
	if (oFF.isNull(runtimeStructureMemberPropertiesMap) || runtimeStructureMemberPropertiesMap.isEmpty())
	{
		return;
	}
	let rsDimensions = oFF.XList.create();
	rsDimensions.addAll(this.m_rowsAxis.getRsDimensions());
	rsDimensions.addAll(this.m_columnAxis.getRsDimensions());
	let rsDimensionsIter = rsDimensions.getIterator();
	while (rsDimensionsIter.hasNext())
	{
		let rsDimension = rsDimensionsIter.next();
		let dimensionType = rsDimension.getDimensionType();
		if (dimensionType === oFF.DimensionType.ACCOUNT || dimensionType === oFF.DimensionType.MEASURE_STRUCTURE)
		{
			let runtimeStructureMemberProperties = runtimeStructureMemberPropertiesMap.getByKey(rsDimension.getName());
			if (oFF.notNull(runtimeStructureMemberProperties))
			{
				this.createRuntimeRsDefStructureMembersForDimension(rsDimension, runtimeStructureMemberProperties);
			}
		}
	}
	this.clearTransientRequiredDimensionMap();
};
oFF.RsCursorResultSet.prototype.createRuntimeRsDefStructureMembersForDimension = function(dimension, runtimeStructureMemberProperties)
{
	let memberNames = runtimeStructureMemberProperties.getAllMemberNames();
	let outOfContextMembers = runtimeStructureMemberProperties.getOutOfContextMembers();
	let memberNamesIter = memberNames.getIterator();
	while (memberNamesIter.hasNext())
	{
		let memberName = memberNamesIter.next();
		let aliasName = runtimeStructureMemberProperties.getPlaceholderAliasMappings().getByKey(memberName);
		let memberOrAliasName = oFF.XStringUtils.isNotNullAndNotEmpty(aliasName) ? aliasName : memberName;
		let minimumDrillState = runtimeStructureMemberProperties.getMinimumDrillState().getByKey(memberOrAliasName);
		let unsatisfiedRequiredDimensionNames = runtimeStructureMemberProperties.getUnsatisfiedRequiredDimensionNames().getByKey(memberOrAliasName);
		let availableFormulaExceptionIds = runtimeStructureMemberProperties.getAvailableFormulaExceptionIds().getByKey(memberOrAliasName);
		let nestedMemberQueryProperties = oFF.XHashMapByString.create();
		nestedMemberQueryProperties.put(oFF.QStructureMemberQueryProperties.ALL_REQUIRED_DIMENSIONS.getName(), minimumDrillState);
		nestedMemberQueryProperties.put(oFF.QStructureMemberQueryProperties.UNSATISFIED_REQUIRED_DIMENSIONS.getName(), unsatisfiedRequiredDimensionNames);
		nestedMemberQueryProperties.put(oFF.QStructureMemberQueryProperties.MINIMUM_DRILL_STATE_DIMENSIONS.getName(), minimumDrillState);
		let isOutOfContextValue = null;
		if (oFF.notNull(outOfContextMembers))
		{
			isOutOfContextValue = oFF.XBooleanValue.create(outOfContextMembers.contains(memberOrAliasName));
		}
		let nestedAllRequiredDimensionProperties = oFF.XPair.create(nestedMemberQueryProperties, isOutOfContextValue);
		dimension.addMeasure(oFF.RsDefStructureMember.create(memberName, aliasName, nestedAllRequiredDimensionProperties, availableFormulaExceptionIds, dimension.getContext(), dimension.getName(), dimension.getCacheKey()));
	}
};
oFF.RsCursorResultSet.prototype.getAllAvailableDocumentIds = function()
{
	return this.m_provider.getDataCellProvider().getAllAvailableDocumentIds();
};
oFF.RsCursorResultSet.prototype.getAvailableDataCellCount = function()
{
	return this.m_availableDataCellCount;
};
oFF.RsCursorResultSet.prototype.getComplexUnitsSetting = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_complexUnitsSetting);
};
oFF.RsCursorResultSet.prototype.getCursorAxis = function(axis)
{
	if (axis === oFF.AxisType.COLUMNS)
	{
		return this.m_columnAxis;
	}
	return this.m_rowsAxis;
};
oFF.RsCursorResultSet.prototype.getCursorColumnsAxis = function()
{
	return this.getCursorAxis(oFF.AxisType.COLUMNS);
};
oFF.RsCursorResultSet.prototype.getCursorRowsAxis = function()
{
	return this.getCursorAxis(oFF.AxisType.ROWS);
};
oFF.RsCursorResultSet.prototype.getDataCell = function(column, row)
{
	if (column !== this.m_currentColumn || row !== this.m_currentRow)
	{
		let invalidCol = column < 0 || column >= this.m_dataColumns;
		let invalidRow = row < 0 || row >= this.m_dataRows;
		let maxCol = this.m_dataColumns - 1;
		let maxRow = this.m_dataRows - 1;
		oFF.XBooleanUtils.checkFalse(invalidCol, oFF.XStringUtils.concatenate3("Column index is invalid, valid indices are [0, ", oFF.XIntegerValue.create(maxCol).toString(), "]"));
		oFF.XBooleanUtils.checkFalse(invalidRow, oFF.XStringUtils.concatenate3("Row index is invalid, valid indices are [0, ", oFF.XIntegerValue.create(maxRow).toString(), "]"));
		this.getDataCellProvider().notifyCursorChange(this.m_dataCell, column, row);
		this.m_currentColumn = column;
		this.m_currentRow = row;
	}
	return this.m_dataCell;
};
oFF.RsCursorResultSet.prototype.getDataCellProvider = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_dataCellProvider);
};
oFF.RsCursorResultSet.prototype.getDataColumns = function()
{
	return this.m_dataColumns;
};
oFF.RsCursorResultSet.prototype.getDataEntryMask = function()
{
	if (oFF.isNull(this.m_dataEntryMask))
	{
		return null;
	}
	return this.m_dataEntryMask.createListCopy();
};
oFF.RsCursorResultSet.prototype.getDataRows = function()
{
	return this.m_dataRows;
};
oFF.RsCursorResultSet.prototype.getDimensionMemberOverrideText = function(dimensionName, memberName)
{
	let overrideText = null;
	if (oFF.notNull(this.m_memberOverrideTexts) && oFF.notNull(dimensionName) && oFF.notNull(memberName))
	{
		let memberOverrideTexts = this.m_memberOverrideTexts.getByKey(dimensionName);
		if (oFF.notNull(memberOverrideTexts))
		{
			overrideText = memberOverrideTexts.getByKey(memberName);
		}
	}
	return overrideText;
};
oFF.RsCursorResultSet.prototype.getInputReadinessStateAt = function(index)
{
	if (oFF.isNull(this.m_inputReadinessStates))
	{
		return null;
	}
	return this.m_inputReadinessStates.get(index);
};
oFF.RsCursorResultSet.prototype.getInputReadinessStates = function()
{
	return this.m_inputReadinessStates;
};
oFF.RsCursorResultSet.prototype.getNewDataEntryViaMember = function()
{
	let container = this.getResultSetContainer();
	return container.getDataEntryCollection().getNewDataEntryViaMember();
};
oFF.RsCursorResultSet.prototype.getProviderFactory = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_providerFactory);
};
oFF.RsCursorResultSet.prototype.getRequest = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_request);
};
oFF.RsCursorResultSet.prototype.getResultSetContainer = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_resultsetContainer);
};
oFF.RsCursorResultSet.prototype.getResultSetType = function()
{
	return oFF.ResultSetType.CURSOR;
};
oFF.RsCursorResultSet.prototype.getRsQueryModelDef = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_rsDefQueryModel);
};
oFF.RsCursorResultSet.prototype.getState = function()
{
	return this.m_state;
};
oFF.RsCursorResultSet.prototype.getTotalsOverrideText = function()
{
	return this.m_totalOverrideText;
};
oFF.RsCursorResultSet.prototype.isActive = function()
{
	return oFF.notNull(this.m_resultsetContainer);
};
oFF.RsCursorResultSet.prototype.isDataEntryEnabled = function()
{
	return this.m_dataEntryEnabled;
};
oFF.RsCursorResultSet.prototype.isNewLinePossible = function()
{
	let mask = this.getDataEntryMask();
	if (oFF.isNull(mask))
	{
		return false;
	}
	return mask.size() > 0;
};
oFF.RsCursorResultSet.prototype.onProviderFetch = function(extResult, resultset, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.hasErrors() || oFF.isNull(resultset) || resultset.getApplication() === null)
	{
		this.m_state = oFF.ResultSetState.DATA_ACCESS_PROBLEMS;
	}
	else
	{
		this.setupFromProvider();
	}
	this.endSync();
};
oFF.RsCursorResultSet.prototype.processResultSetFetch = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.RsCursorResultSet.prototype.processSynchronization = function(syncType)
{
	this.setNewProvider();
	this.m_provider.setResultSet(this);
	let syncAction = this.m_provider.processResultSet(syncType, this, null);
	this.setSyncChild(syncAction);
	return true;
};
oFF.RsCursorResultSet.prototype.releaseObjectInternal = function()
{
	this.m_provider = oFF.XObjectExt.release(this.m_provider);
	this.m_request = oFF.XObjectExt.release(this.m_request);
	this.m_rsDefQueryModel = oFF.XObjectExt.release(this.m_rsDefQueryModel);
	this.m_resultsetContainer = oFF.XObjectExt.release(this.m_resultsetContainer);
	this.m_providerFactory = oFF.XObjectExt.release(this.m_providerFactory);
	this.m_dataCellProvider = oFF.XObjectExt.release(this.m_dataCellProvider);
	this.m_dataCell = oFF.XObjectExt.release(this.m_dataCell);
	this.m_currentRow = -1;
	this.m_currentColumn = -1;
	this.m_columnAxis = oFF.XObjectExt.release(this.m_columnAxis);
	this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
	this.m_inputReadinessStates = oFF.XObjectExt.release(this.m_inputReadinessStates);
	this.m_availableDataCellCount = 0;
	this.m_dataColumns = 0;
	this.m_dataRows = 0;
	this.m_dataEntryMask = null;
	this.m_state = null;
	this.m_complexUnitsSetting = oFF.XObjectExt.release(this.m_complexUnitsSetting);
	this.m_transientRequiredDimensionNamesByMeasureNameMap = oFF.XObjectExt.release(this.m_transientRequiredDimensionNamesByMeasureNameMap);
	this.m_memberOverrideTexts = oFF.XObjectExt.release(this.m_memberOverrideTexts);
};
oFF.RsCursorResultSet.prototype.resetNewValues = function()
{
	if (oFF.notNull(this.m_dataCell))
	{
		this.m_dataCell.resetAllChanges();
	}
};
oFF.RsCursorResultSet.prototype.setDataEntryEnabled = function(dataEntryEnabled)
{
	this.m_dataEntryEnabled = dataEntryEnabled;
};
oFF.RsCursorResultSet.prototype.setDataEntryMask = function(dataEntryMask)
{
	this.m_dataEntryMask = dataEntryMask;
};
oFF.RsCursorResultSet.prototype.setDimensionMemberOverrideTexts = function(overrideTexts)
{
	this.m_memberOverrideTexts = overrideTexts;
};
oFF.RsCursorResultSet.prototype.setDimensionOverrideTexts = function(overrideTexts)
{
	if (oFF.notNull(overrideTexts))
	{
		let rsDimensions = oFF.XList.create();
		rsDimensions.addAll(this.m_rowsAxis.getRsDimensions());
		rsDimensions.addAll(this.m_columnAxis.getRsDimensions());
		let rsDimensionsIter = rsDimensions.getIterator();
		while (rsDimensionsIter.hasNext())
		{
			let rsDimension = rsDimensionsIter.next();
			let overrideText = overrideTexts.getByKey(rsDimension.getName());
			if (oFF.notNull(overrideText))
			{
				rsDimension.setOverrideText(overrideText);
			}
		}
	}
};
oFF.RsCursorResultSet.prototype.setInputReadinessStates = function(states)
{
	this.m_inputReadinessStates = states;
};
oFF.RsCursorResultSet.prototype.setNewProvider = function()
{
	if (oFF.isNull(this.m_request))
	{
		this.m_provider = this.getProviderFactory().createResultSetProvider(oFF.ProviderInitProcedure.REQUEST_BY_MODEL, null, this.getRsQueryModelDef());
	}
	else
	{
		this.m_provider = this.getProviderFactory().createResultSetProvider(oFF.ProviderInitProcedure.REQUEST_BY_STRUCTURE, this.getRequest(), this.getRsQueryModelDef());
	}
};
oFF.RsCursorResultSet.prototype.setResultSetContainer = function(resultsetContainer)
{
	this.m_resultsetContainer = oFF.XWeakReferenceUtil.getWeakRef(resultsetContainer);
};
oFF.RsCursorResultSet.prototype.setState = function(state)
{
	this.m_state = state;
};
oFF.RsCursorResultSet.prototype.setTotalsOverrideText = function(overrideText)
{
	this.m_totalOverrideText = overrideText;
};
oFF.RsCursorResultSet.prototype.setupFromProvider = function()
{
	let dataCellProvider = this.m_provider.getDataCellProvider();
	this.m_dataCellProvider = oFF.XWeakReferenceUtil.getWeakRef(dataCellProvider);
	this.m_dataColumns = dataCellProvider.getAvailableDataCellColumns();
	this.m_dataRows = dataCellProvider.getAvailableDataCellRows();
	this.m_availableDataCellCount = dataCellProvider.getAvailableDataCellCount();
	this.m_dataCell = oFF.RsDataCell.createDefault(this);
	let rsQueryModelDef = this.getRsQueryModelDef();
	this.m_columnAxis = oFF.RsCursorAxis.create(this, this.m_provider.getColumnAxisProvider(), rsQueryModelDef.getColumnsAxisDef());
	this.m_rowsAxis = oFF.RsCursorAxis.create(this, this.m_provider.getRowsAxisProvider(), rsQueryModelDef.getRowsAxisDef());
	this.m_complexUnitsSetting = oFF.XWeakReferenceUtil.getWeakRef(this.m_provider.getComplexUnitsSetting());
};
oFF.RsCursorResultSet.prototype.setupResultSet = function(resultSetContainer, providerFactory, request, rsDefQueryModel)
{
	this.setupAction(null, null, null, resultSetContainer.getQueryManager());
	this.setResultSetContainer(resultSetContainer);
	this.m_rsDefQueryModel = oFF.XWeakReferenceUtil.getWeakRef(rsDefQueryModel);
	this.m_providerFactory = oFF.XWeakReferenceUtil.getWeakRef(providerFactory);
	this.m_currentRow = -1;
	this.m_currentColumn = -1;
	this.m_dataColumns = -1;
	this.m_dataRows = -1;
	this.m_request = oFF.XWeakReferenceUtil.getWeakRef(request);
	this.m_state = oFF.ResultSetState.INITIAL;
};
oFF.RsCursorResultSet.prototype.validateCellMinimumDrillState = function(column, row)
{
	let result = oFF.RsMinimumDrillStateValidationResult.create();
	let requiredDimensionNamesByMemberNameMap = this.collectRequiredDimensions();
	let iterator = requiredDimensionNamesByMemberNameMap.getKeysAsIterator();
	while (iterator.hasNext())
	{
		let dimensionName = iterator.next();
		let validationContext = requiredDimensionNamesByMemberNameMap.getByKey(dimensionName);
		if (!validationContext.isEmpty())
		{
			let tupleIndex = validationContext.getAxisType() === oFF.AxisType.COLUMNS ? column : row;
			let memberName = validationContext.getDimensionMemberNameAtTupleIndex(tupleIndex);
			let rsDimension = validationContext.getRsDimensionAtTupleIndex(tupleIndex);
			this.validateMinimumDrillStateInternal(result, validationContext, column, row, rsDimension, memberName);
		}
	}
	return result;
};
oFF.RsCursorResultSet.prototype.validateMinimumDrillStateAtCurrentAxisPosition = function(axisType)
{
	let result = oFF.RsMinimumDrillStateValidationResult.create();
	let cursorAxis = this.getCursorAxis(axisType);
	let rsDimension = cursorAxis.getRsDimensionAtCurrentPosition();
	let memberName = cursorAxis.getDimensionMemberName();
	if (oFF.notNull(rsDimension) && oFF.notNull(memberName))
	{
		let dimensionName = rsDimension.getName();
		let requiredDimensionNamesByMemberNameMap = this.collectRequiredDimensions();
		let validationContext = requiredDimensionNamesByMemberNameMap.getByKey(dimensionName);
		if (oFF.notNull(validationContext))
		{
			this.validateMinimumDrillStateInternal(result, validationContext, -1, -1, rsDimension, memberName);
		}
	}
	return result;
};
oFF.RsCursorResultSet.prototype.validateMinimumDrillStateInternal = function(result, validationContext, column, row, rsDimension, memberName)
{
	let dimensionName = rsDimension.getName();
	let allInContextMemberNames = oFF.XHashSetOfString.create();
	allInContextMemberNames.add(memberName);
	let rsDefStructureMember = rsDimension.getStructureMemberByAliasOrMember(memberName);
	if (oFF.notNull(rsDefStructureMember))
	{
		allInContextMemberNames.addAll(rsDefStructureMember.getAvailableFormulaExceptionIds(null));
	}
	let allInContextMemberNamesIterator = allInContextMemberNames.getIterator();
	let unsatisfiedRequiredDimensionNames;
	let requiredDimensionNames;
	let nestedMinimumDrillState;
	while (allInContextMemberNamesIterator.hasNext())
	{
		let inContextMemberName = allInContextMemberNamesIterator.next();
		unsatisfiedRequiredDimensionNames = validationContext.getUnsatisfiedRequiredDimensionNames(inContextMemberName);
		if (oFF.notNull(unsatisfiedRequiredDimensionNames) && !unsatisfiedRequiredDimensionNames.isEmpty())
		{
			result.addMissingRequiredDimensionNames(dimensionName, inContextMemberName, unsatisfiedRequiredDimensionNames);
		}
		requiredDimensionNames = validationContext.getRequiredDimensionNames(inContextMemberName);
		if (oFF.notNull(requiredDimensionNames) && !requiredDimensionNames.isEmpty())
		{
			result.addRequiredDimensionNames(dimensionName, inContextMemberName, requiredDimensionNames);
			nestedMinimumDrillState = validationContext.getNestedMinimumDrillState(inContextMemberName);
			this.validateMinimumDrillStateLeafNodes(column, row, nestedMinimumDrillState, dimensionName, inContextMemberName, result);
		}
	}
	let outOfContextUnsatisfiedRequiredDimensionNamesMap = validationContext.getOutOfContextUnsatisfiedRequiredDimensionNamesMap();
	let unsatisfiedReqDimIterator = outOfContextUnsatisfiedRequiredDimensionNamesMap.getKeysAsIterator();
	while (unsatisfiedReqDimIterator.hasNext())
	{
		let outOfContextUnsatisfiedMemberName = unsatisfiedReqDimIterator.next();
		unsatisfiedRequiredDimensionNames = outOfContextUnsatisfiedRequiredDimensionNamesMap.getByKey(outOfContextUnsatisfiedMemberName);
		if (oFF.notNull(unsatisfiedRequiredDimensionNames) && !unsatisfiedRequiredDimensionNames.isEmpty())
		{
			result.addMissingRequiredDimensionNames(dimensionName, outOfContextUnsatisfiedMemberName, unsatisfiedRequiredDimensionNames);
		}
	}
	let outOfContextRequiredDimensionNamesMap = validationContext.getOutOfContextRequiredDimensionNamesMap();
	let reqDimIterator = outOfContextRequiredDimensionNamesMap.getKeysAsIterator();
	let outOfContextMemberName;
	while (reqDimIterator.hasNext())
	{
		outOfContextMemberName = reqDimIterator.next();
		requiredDimensionNames = outOfContextRequiredDimensionNamesMap.getByKey(outOfContextMemberName);
		if (oFF.notNull(requiredDimensionNames) && !requiredDimensionNames.isEmpty())
		{
			result.addRequiredDimensionNames(dimensionName, outOfContextMemberName, requiredDimensionNames);
		}
	}
	let outOfContextNestedMinimumDrillStateMap = validationContext.getOutOfContextNestedMinimumDrillStateMap();
	reqDimIterator = outOfContextNestedMinimumDrillStateMap.getKeysAsIterator();
	while (reqDimIterator.hasNext())
	{
		outOfContextMemberName = reqDimIterator.next();
		nestedMinimumDrillState = outOfContextNestedMinimumDrillStateMap.getByKey(outOfContextMemberName);
		this.validateMinimumDrillStateLeafNodes(column, row, nestedMinimumDrillState, dimensionName, outOfContextMemberName, result);
	}
};
oFF.RsCursorResultSet.prototype.validateMinimumDrillStateLeafNodes = function(column, row, requiredDimensionNames, dimensionName, memberName, result)
{
	if (oFF.notNull(requiredDimensionNames) && !requiredDimensionNames.isEmpty())
	{
		this.m_rowsAxis.validateMinimumDrillStateLeafNodes(result, row, requiredDimensionNames, dimensionName, memberName);
		this.m_columnAxis.validateMinimumDrillStateLeafNodes(result, column, requiredDimensionNames, dimensionName, memberName);
	}
};

oFF.RsDefAxis = function() {};
oFF.RsDefAxis.prototype = new oFF.RsDefModelComponent();
oFF.RsDefAxis.prototype._ff_c = "RsDefAxis";

oFF.RsDefAxis.create = function(context, axisType, rsQueryModel)
{
	let object = new oFF.RsDefAxis();
	object.setupExt(context, axisType, rsQueryModel);
	return object;
};
oFF.RsDefAxis.prototype.m_axisType = null;
oFF.RsDefAxis.prototype.m_resultAlignment = null;
oFF.RsDefAxis.prototype.m_rsDimensions = null;
oFF.RsDefAxis.prototype.m_rsQueryModel = null;
oFF.RsDefAxis.prototype.addAllDimensions = function(axis)
{
	let size = axis.getDimensionCount();
	for (let i = 0; i < size; i++)
	{
		this.addDimension(axis.get(i));
	}
};
oFF.RsDefAxis.prototype.addDimension = function(dimension)
{
	this.m_rsDimensions.add(this.newRsDimension(dimension));
};
oFF.RsDefAxis.prototype.clearDimensions = function()
{
	this.m_rsDimensions.clear();
};
oFF.RsDefAxis.prototype.getConvenienceCommands = function()
{
	return this.m_rsQueryModel.getConvenienceCommands();
};
oFF.RsDefAxis.prototype.getEffectiveRsFields = function()
{
	let effectiveFields = oFF.XList.create();
	let size = this.m_rsDimensions.size();
	for (let i = 0; i < size; i++)
	{
		effectiveFields.addAll(this.m_rsDimensions.get(i).getResultSetFields());
	}
	return effectiveFields;
};
oFF.RsDefAxis.prototype.getResultAlignment = function()
{
	return this.m_resultAlignment;
};
oFF.RsDefAxis.prototype.getRsDimensions = function()
{
	return this.m_rsDimensions;
};
oFF.RsDefAxis.prototype.getType = function()
{
	return this.m_axisType;
};
oFF.RsDefAxis.prototype.newRsDimension = function(dimension)
{
	return oFF.RsDefDimension.create(this, dimension, this);
};
oFF.RsDefAxis.prototype.newRsDimensionWithInADimension = function(dimension, inaDimension)
{
	return oFF.RsDefDimension.createWithInADimension(this, dimension, this, inaDimension);
};
oFF.RsDefAxis.prototype.releaseObject = function()
{
	this.m_rsDimensions = oFF.XObjectExt.release(this.m_rsDimensions);
	this.m_rsQueryModel = null;
	this.m_axisType = null;
	this.m_resultAlignment = null;
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefAxis.prototype.setResultAlignment = function(resultAlignment)
{
	this.m_resultAlignment = resultAlignment;
};
oFF.RsDefAxis.prototype.setupExt = function(context, axisType, rsQueryModel)
{
	this.setupContext(context);
	this.setName(axisType.getName());
	this.m_axisType = axisType;
	this.m_resultAlignment = oFF.ResultAlignment.NONE;
	this.m_rsDimensions = oFF.XList.create();
	this.m_rsQueryModel = rsQueryModel;
};

oFF.RsDefField = function() {};
oFF.RsDefField.prototype = new oFF.RsDefModelComponent();
oFF.RsDefField.prototype._ff_c = "RsDefField";

oFF.RsDefField.create = function(name, text, presentationType, valueType, rsDefDimension, mimeType, isHierarchyNavigationField, longestAttribute)
{
	let rsDefField = new oFF.RsDefField();
	rsDefField.setName(name);
	rsDefField.setText(text);
	rsDefField.m_presentationType = presentationType;
	rsDefField.m_valueType = valueType;
	rsDefField.m_dimension = rsDefDimension;
	rsDefField.m_mimeType = mimeType;
	rsDefField.m_isHierarchyNavigationField = isHierarchyNavigationField;
	rsDefField.m_longestAttribute = longestAttribute;
	return rsDefField;
};
oFF.RsDefField.prototype.m_dimension = null;
oFF.RsDefField.prototype.m_isHierarchyNavigationField = false;
oFF.RsDefField.prototype.m_longestAttribute = null;
oFF.RsDefField.prototype.m_mimeType = null;
oFF.RsDefField.prototype.m_presentationType = null;
oFF.RsDefField.prototype.m_valueType = null;
oFF.RsDefField.prototype.createFieldLiteralValue = oFF.noSupport;
oFF.RsDefField.prototype.getAliasName = oFF.noSupport;
oFF.RsDefField.prototype.getAttribute = oFF.noSupport;
oFF.RsDefField.prototype.getAttributeType = oFF.noSupport;
oFF.RsDefField.prototype.getConvenienceCommands = function()
{
	return this.m_dimension.getConvenienceCommands();
};
oFF.RsDefField.prototype.getConversionRoutine = oFF.noSupport;
oFF.RsDefField.prototype.getDecimals = oFF.noSupport;
oFF.RsDefField.prototype.getDependencyFields = oFF.noSupport;
oFF.RsDefField.prototype.getDimension = function()
{
	return this.m_dimension;
};
oFF.RsDefField.prototype.getDimensionMetadata = oFF.noSupport;
oFF.RsDefField.prototype.getDisplayFormat = oFF.noSupport;
oFF.RsDefField.prototype.getFixedLength = oFF.noSupport;
oFF.RsDefField.prototype.getInfoObjectType = oFF.noSupport;
oFF.RsDefField.prototype.getInitialValue = oFF.noSupport;
oFF.RsDefField.prototype.getIsLowerCaseEnabled = function()
{
	return this.isLowerCaseEnabled();
};
oFF.RsDefField.prototype.getLength = oFF.noSupport;
oFF.RsDefField.prototype.getLongestAttribute = function()
{
	return this.m_longestAttribute;
};
oFF.RsDefField.prototype.getLowerBound = oFF.noSupport;
oFF.RsDefField.prototype.getMappedColumnName = oFF.noSupport;
oFF.RsDefField.prototype.getMetadata = oFF.noSupport;
oFF.RsDefField.prototype.getMimeType = function()
{
	return this.m_mimeType;
};
oFF.RsDefField.prototype.getNavigationalAttributeDescription = oFF.noSupport;
oFF.RsDefField.prototype.getObtainability = oFF.noSupport;
oFF.RsDefField.prototype.getPrecision = oFF.noSupport;
oFF.RsDefField.prototype.getPresentationType = function()
{
	return this.m_presentationType;
};
oFF.RsDefField.prototype.getResultSetSorting = oFF.noSupport;
oFF.RsDefField.prototype.getSemanticType = oFF.noSupport;
oFF.RsDefField.prototype.getSqlType = oFF.noSupport;
oFF.RsDefField.prototype.getTextTransformation = oFF.noSupport;
oFF.RsDefField.prototype.getUpperBound = oFF.noSupport;
oFF.RsDefField.prototype.getUsageType = oFF.noSupport;
oFF.RsDefField.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.RsDefField.prototype.getVisibilityType = oFF.noSupport;
oFF.RsDefField.prototype.hasComparisonGroups = oFF.noSupport;
oFF.RsDefField.prototype.hasSorting = oFF.noSupport;
oFF.RsDefField.prototype.isAlwaysRequested = oFF.noSupport;
oFF.RsDefField.prototype.isCubeBlendingPropertiesField = oFF.noSupport;
oFF.RsDefField.prototype.isDefaultTextField = oFF.noSupport;
oFF.RsDefField.prototype.isDisplayAttributeField = oFF.noSupport;
oFF.RsDefField.prototype.isExcludedFromValueHelp = oFF.noSupport;
oFF.RsDefField.prototype.isFilterable = oFF.noSupport;
oFF.RsDefField.prototype.isFilterableForValueHelpAndReadMode = oFF.noSupport;
oFF.RsDefField.prototype.isFlatKeyField = oFF.noSupport;
oFF.RsDefField.prototype.isHierarchyKeyField = oFF.noSupport;
oFF.RsDefField.prototype.isHierarchyNavigationField = function()
{
	return this.m_isHierarchyNavigationField;
};
oFF.RsDefField.prototype.isHierarchyPathField = function()
{
	return this.m_presentationType === oFF.PresentationType.HIERARCHY_PATH;
};
oFF.RsDefField.prototype.isKeyField = oFF.noSupport;
oFF.RsDefField.prototype.isLowerCaseEnabled = oFF.noSupport;
oFF.RsDefField.prototype.isNamePathField = function()
{
	return this.m_presentationType === oFF.PresentationType.NAME_PATH;
};
oFF.RsDefField.prototype.isVirtualDescription = oFF.noSupport;
oFF.RsDefField.prototype.releaseObject = function()
{
	this.m_dimension = null;
	this.m_presentationType = null;
	this.m_valueType = null;
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefField.prototype.setAlwaysRequested = oFF.noSupport;
oFF.RsDefField.prototype.setDisplayFormat = oFF.noSupport;
oFF.RsDefField.prototype.setObtainability = oFF.noSupport;
oFF.RsDefField.prototype.setTextTransformation = oFF.noSupport;
oFF.RsDefField.prototype.supportsSorting = oFF.noSupport;
oFF.RsDefField.prototype.usedInFieldOrComplexSorting = oFF.noSupport;

oFF.RsCellDocumentIdAction = function() {};
oFF.RsCellDocumentIdAction.prototype = new oFF.DfRsSyncAction();
oFF.RsCellDocumentIdAction.prototype._ff_c = "RsCellDocumentIdAction";

oFF.RsCellDocumentIdAction.prototype.m_action = null;
oFF.RsCellDocumentIdAction.prototype.m_cellDocumentId = null;
oFF.RsCellDocumentIdAction.prototype.m_documentsService = null;
oFF.RsCellDocumentIdAction.prototype.m_gridCollector = null;
oFF.RsCellDocumentIdAction.prototype.m_indexInfo = null;
oFF.RsCellDocumentIdAction.prototype.m_isCellDocIdSet = false;
oFF.RsCellDocumentIdAction.prototype.m_queryManager = null;
oFF.RsCellDocumentIdAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	this.addAllMessages(extResult);
	listener.onCellDocumentIdActionCompleted(extResult, data, customIdentifier);
};
oFF.RsCellDocumentIdAction.prototype.endSyncTask = function()
{
	this.setData(this);
	this.endSync();
};
oFF.RsCellDocumentIdAction.prototype.getCellDocumentId = function()
{
	if (this.m_isCellDocIdSet)
	{
		return this.m_cellDocumentId;
	}
	else
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Could not retrieve cell document ID");
		return null;
	}
};
oFF.RsCellDocumentIdAction.prototype.isCellDocumentIdCreated = function()
{
	return this.m_isCellDocIdSet && oFF.notNull(this.m_cellDocumentId);
};
oFF.RsCellDocumentIdAction.prototype.isCellDocumentIdDeleted = function()
{
	return this.m_isCellDocIdSet && oFF.isNull(this.m_cellDocumentId);
};
oFF.RsCellDocumentIdAction.prototype.isDeleteOperationSupported = function()
{
	let documentsInfo = this.m_queryManager.getQueryModel().getDocumentsInfo();
	let isValid = documentsInfo.getSupportsDocuments() === oFF.DocumentsSupportType.READ_WRITE;
	if (!isValid)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Document does not support DELTETE operation.");
	}
	return isValid;
};
oFF.RsCellDocumentIdAction.prototype.isWriteOperationSupported = function()
{
	let documentsInfo = this.m_queryManager.getQueryModel().getDocumentsInfo();
	let isValid = documentsInfo.getSupportsDocuments() === oFF.DocumentsSupportType.READ_WRITE || documentsInfo.getSupportsDocuments() === oFF.DocumentsSupportType.READ_CREATE_CHANGE;
	if (!isValid)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Document does not support WRITE operation.");
	}
	return isValid;
};
oFF.RsCellDocumentIdAction.prototype.onCommandProcessed = function(extPlanningCommandResult)
{
	this.endSyncTask();
};
oFF.RsCellDocumentIdAction.prototype.onGridCollectorFilled = function(extResult, gridContainer, customIdentifier)
{
	if (extResult.isValid())
	{
		this.m_cellDocumentId = this.m_gridCollector.getGridContainer().getCellValueReference(this.m_indexInfo.getColumnIndex(), this.m_indexInfo.getRowIndex()).getDocumentId();
		this.m_isCellDocIdSet = true;
		this.endSyncTask();
	}
	else
	{
		this.addAllMessages(extResult);
		let dataAreaCommand = this.m_queryManager.createDataAreaCommandDocReset();
		dataAreaCommand.processCommand(this.getActiveSyncType(), this, null);
	}
};
oFF.RsCellDocumentIdAction.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	let hasExecutionFailed = false;
	if (extResult.isValid())
	{
		let resultSet = resultSetContainer.getCursorResultSet();
		if (oFF.notNull(resultSet) && resultSet.getState().hasData())
		{
			if (oFF.notNull(this.m_gridCollector))
			{
				this.m_gridCollector.processExecution(this.getActiveSyncType(), this, null, null);
			}
			else
			{
				this.m_cellDocumentId = resultSet.getDataCell(this.m_indexInfo.getColumnIndex(), this.m_indexInfo.getRowIndex()).getDocumentId();
				this.m_isCellDocIdSet = true;
				this.endSyncTask();
			}
		}
		else
		{
			hasExecutionFailed = true;
			let messages = this.m_queryManager.getActiveResultSetContainer().getMessages();
			if (!messages.isEmpty())
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, messages.get(0).getText());
			}
		}
	}
	else
	{
		hasExecutionFailed = true;
		this.addAllMessages(extResult);
	}
	if (hasExecutionFailed)
	{
		let dataAreaCommand = this.m_queryManager.createDataAreaCommandDocReset();
		dataAreaCommand.processCommand(this.getActiveSyncType(), this, null);
	}
};
oFF.RsCellDocumentIdAction.prototype.processSynchronization = function(syncType)
{
	try
	{
		if (this.m_queryManager.getModelCapabilities().supportsCellDocumentId())
		{
			let columnIndex = this.m_indexInfo.getColumnIndex();
			let rowIndex = this.m_indexInfo.getRowIndex();
			let documentsIdCollection;
			let documentId;
			if (columnIndex < 0)
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Negative column indices are not allowed.");
			}
			else if (rowIndex < 0)
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Negative row indices are not allowed.");
			}
			else if (oFF.notNull(this.m_gridCollector) && this.m_gridCollector.getGridContainer().isOriginInitialized())
			{
				let gridContainer = this.m_gridCollector.getGridContainer();
				let cellValueReference = gridContainer.getCellValueReferenceStrict(columnIndex, rowIndex);
				if (oFF.notNull(cellValueReference) && this.isOperationValid(cellValueReference.getDocumentId()))
				{
					documentsIdCollection = this.m_queryManager.getActiveResultSetContainer().getDocumentIdCollection();
					documentId = documentsIdCollection.createDocumentId(this.m_gridCollector.getColumnTuples().get(columnIndex), this.m_gridCollector.getRowTuples().get(rowIndex));
					documentId.getDocumentIdActionByDataCellReference(cellValueReference.getDataCellName()).setAction(this.m_action);
					this.m_queryManager.transferNewDocuments();
					this.m_gridCollector.executeWindowedRequest(syncType, this, null, null, rowIndex, rowIndex, columnIndex, columnIndex);
					return true;
				}
			}
			else
			{
				let classicResultSet = this.m_queryManager.getClassicResultSet();
				if (oFF.notNull(classicResultSet))
				{
					let cell = classicResultSet.getDataCell(columnIndex, rowIndex);
					if (this.isOperationValid(cell.getDocumentId()))
					{
						documentsIdCollection = this.m_queryManager.getActiveResultSetContainer().getDocumentIdCollection();
						documentId = documentsIdCollection.createDocumentId(classicResultSet.getColumnsAxis().getTupleAt(columnIndex), classicResultSet.getRowsAxis().getTupleAt(rowIndex));
						documentId.getDocumentIdActionByDataCellReference(cell.getQueryDataCellReference()).setAction(this.m_action);
						this.m_queryManager.transferNewDocuments();
						this.m_queryManager.processQueryExecution(syncType, this, null);
						return true;
					}
				}
				else
				{
					this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, this.m_queryManager.getActiveResultSetContainer().getMessages().get(0).getText());
				}
			}
		}
		else
		{
			this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Cell document ID capability is not supported.");
		}
	}
	catch (ex)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, oFF.XException.getMessage(ex));
	}
	this.setData(this);
	return false;
};
oFF.RsCellDocumentIdAction.prototype.releaseObjectInternal = function()
{
	this.m_queryManager = null;
	this.m_indexInfo = null;
	this.m_cellDocumentId = null;
	this.m_action = null;
	this.m_documentsService = null;
	this.m_gridCollector = null;
	oFF.DfRsSyncAction.prototype.releaseObjectInternal.call( this );
};
oFF.RsCellDocumentIdAction.prototype.setupSetActionAndRun = function(syncType, listener, indexInfo, queryManager, actionType)
{
	this.m_queryManager = queryManager;
	this.m_indexInfo = indexInfo;
	this.m_action = actionType;
	this.m_gridCollector = queryManager.getQueryModel().getVisualizationManager().getGridCollector();
	this.m_documentsService = queryManager.getQueryModel().getDocumentsInfo().getOrCreateDocumentsStoreService(true);
	this.m_isCellDocIdSet = false;
	oFF.DfRsSyncAction.prototype.setupActionAndRun.call( this , syncType, listener, indexInfo, null);
};

oFF.DfResultSetProvider = function() {};
oFF.DfResultSetProvider.prototype = new oFF.DfRsSyncAction();
oFF.DfResultSetProvider.prototype._ff_c = "DfResultSetProvider";

oFF.DfResultSetProvider.prototype.m_resultSet = null;
oFF.DfResultSetProvider.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onProviderFetch(extResult, data, customIdentifier);
};
oFF.DfResultSetProvider.prototype.getData = function()
{
	return this;
};
oFF.DfResultSetProvider.prototype.getResultSet = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_resultSet);
};
oFF.DfResultSetProvider.prototype.processResultSet = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfResultSetProvider.prototype.releaseObjectInternal = function()
{
	this.m_resultSet = oFF.XObjectExt.release(this.m_resultSet);
};
oFF.DfResultSetProvider.prototype.setResultSet = function(resultSet)
{
	this.m_resultSet = oFF.XWeakReferenceUtil.getWeakRef(resultSet);
};

oFF.RsVizVisualizationContainer = function() {};
oFF.RsVizVisualizationContainer.prototype = new oFF.DfRsSyncAction();
oFF.RsVizVisualizationContainer.prototype._ff_c = "RsVizVisualizationContainer";

oFF.RsVizVisualizationContainer.prototype.m_pendingReset = false;
oFF.RsVizVisualizationContainer.prototype.m_postProcessSyncActionProcedure = null;
oFF.RsVizVisualizationContainer.prototype.m_reEntryListener = null;
oFF.RsVizVisualizationContainer.prototype.m_timerId = null;
oFF.RsVizVisualizationContainer.prototype.m_valid = false;
oFF.RsVizVisualizationContainer.prototype.m_visualizationData = null;
oFF.RsVizVisualizationContainer.prototype.m_visualizationDefinition = null;
oFF.RsVizVisualizationContainer.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onVisualizationObjectFilled(extResult, data, customIdentifier);
};
oFF.RsVizVisualizationContainer.prototype.cancelSynchronization = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_timerId))
	{
		oFF.XTimeout.clear(this.m_timerId);
		this.m_timerId = null;
		this.addError(0, "Canceled");
		oFF.DfRsSyncAction.prototype.cancelSynchronization.call( this );
	}
};
oFF.RsVizVisualizationContainer.prototype.checkPendingResets = function()
{
	let isBeingReset = false;
	if (this.m_pendingReset)
	{
		let curSyncState = this.getSyncState();
		if (curSyncState !== oFF.SyncState.PROCESSING)
		{
			if (curSyncState.isInSync())
			{
				this._resetSyncStateInternal(false);
				isBeingReset = true;
			}
			this.m_pendingReset = false;
		}
	}
	return isBeingReset;
};
oFF.RsVizVisualizationContainer.prototype.endSync = function()
{
	let queryModel = this.getQueryModel();
	let visualizationManager = oFF.isNull(queryModel) ? null : queryModel.getVisualizationManager();
	let gridCollector = oFF.isNull(visualizationManager) ? null : visualizationManager.getGridCollector();
	if (oFF.notNull(gridCollector))
	{
		let messageCollection = this.getMessages();
		oFF.XCollectionUtils.forEach(gridCollector.getMessages(), (rmsg) => {
			if (!messageCollection.contains(rmsg))
			{
				if (rmsg.getSeverity() === oFF.Severity.ERROR && gridCollector.getGridContainer() !== null && gridCollector.getGridContainer().isFilled())
				{
					this.addWarning(rmsg.getCode(), rmsg.getText());
				}
				else
				{
					this.addMessage(rmsg);
				}
			}
		});
	}
	oFF.DfRsSyncAction.prototype.endSync.call( this );
};
oFF.RsVizVisualizationContainer.prototype.executePostProcessSyncActionProcedure = function()
{
	if (oFF.notNull(this.m_postProcessSyncActionProcedure))
	{
		this.m_postProcessSyncActionProcedure();
		this.m_postProcessSyncActionProcedure = null;
	}
};
oFF.RsVizVisualizationContainer.prototype.getVisualizationData = function()
{
	return this.m_visualizationData;
};
oFF.RsVizVisualizationContainer.prototype.getVisualizationDefinition = function()
{
	return this.m_visualizationDefinition;
};
oFF.RsVizVisualizationContainer.prototype.invalidate = function()
{
	this.m_valid = false;
	this.resetState();
};
oFF.RsVizVisualizationContainer.prototype.isValidContainer = function()
{
	return this.m_valid;
};
oFF.RsVizVisualizationContainer.prototype.performPendingRequests = function(syncType, listener, customIdentifier) {};
oFF.RsVizVisualizationContainer.prototype.processExecution = function(syncType, listener, customIdentifier)
{
	this.checkPendingResets();
	let queryModel = this.getQueryManager().getQueryModel();
	let visualizationManager = oFF.isNull(queryModel) ? null : queryModel.getVisualizationManager();
	let gridCollector = oFF.isNull(visualizationManager) ? null : visualizationManager.getGridCollector();
	if (oFF.notNull(gridCollector))
	{
		let rscSyncState = gridCollector.getSyncState();
		let rsSyncState = this.getQueryManager().getActiveResultSetContainer().getSyncState();
		this.setActiveSyncType(syncType);
		this.attachAllListeners(this.getVisualizationDefinition().getVisualizationProvidedListeners());
		if (!gridCollector.isValid() && rscSyncState === oFF.SyncState.PROCESSING)
		{
			throw oFF.XException.createIllegalStateException("Cannot retrieve the result set while processing");
		}
		else if (rscSyncState === oFF.SyncState.PROCESSING)
		{
			gridCollector.attachListener(this, oFF.ListenerType.SPECIFIC, customIdentifier);
			if (oFF.notNull(listener))
			{
				this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
			}
		}
		else if (rsSyncState === oFF.SyncState.OUT_OF_SYNC)
		{
			this.resetPaging();
			this.m_reEntryListener = listener;
			gridCollector.processExecution(syncType, this, null, customIdentifier);
		}
		else if (rscSyncState === oFF.SyncState.OUT_OF_SYNC)
		{
			this.m_reEntryListener = listener;
			gridCollector.processExecution(syncType, this, null, customIdentifier);
		}
		else if (gridCollector.isSyncCanceled())
		{
			this.cancelSynchronization();
		}
		else
		{
			this.processVisualizationActionInternal(syncType, listener, customIdentifier);
		}
	}
	return this;
};
oFF.RsVizVisualizationContainer.prototype.processSynchronization = function(syncType)
{
	if (syncType === oFF.SyncType.BLOCKING)
	{
		let inSync = this.createVisualizationData();
		this.setData(this);
		if (!inSync)
		{
			this.resetState();
		}
		this.executePostProcessSyncActionProcedure();
	}
	else
	{
		this.m_timerId = oFF.XTimeout.timeout(10, () => {
			try
			{
				let inSyncInternal = true;
				if (this.isSyncCanceled())
				{
					this.addError(2, "Action has been canceled");
				}
				else
				{
					inSyncInternal = this.createVisualizationData();
					this.setData(this);
				}
				this.m_timerId = null;
				this.endSync();
				if (!inSyncInternal)
				{
					this.resetState();
				}
				this.executePostProcessSyncActionProcedure();
			}
			catch (t)
			{
				this.addError(1, oFF.XException.getStackTrace(t, 0));
				this.endSync();
			}
		});
	}
	return syncType !== oFF.SyncType.BLOCKING;
};
oFF.RsVizVisualizationContainer.prototype.processVisualizationActionInternal = function(syncType, listener, customIdentifier)
{
	this.m_postProcessSyncActionProcedure = () => {
		if (this.checkPendingResets())
		{
			this.processExecution(syncType, listener, customIdentifier);
		}
		else
		{
			this.performPendingRequests(syncType, listener, customIdentifier);
		}
	};
	this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.RsVizVisualizationContainer.prototype.releaseObjectInternal = function()
{
	oFF.XTimeout.clear(this.m_timerId);
	this.m_timerId = null;
	this.m_visualizationData = oFF.XObjectExt.release(this.m_visualizationData);
	oFF.DfRsSyncAction.prototype.releaseObjectInternal.call( this );
};
oFF.RsVizVisualizationContainer.prototype.resetLocalPaging = function() {};
oFF.RsVizVisualizationContainer.prototype.resetPaging = function()
{
	let queryManager = this.getQueryManager();
	if (oFF.XObjectExt.isValidObject(queryManager))
	{
		queryManager.setOffsetColumns(0);
		queryManager.setOffsetRows(0);
	}
};
oFF.RsVizVisualizationContainer.prototype.resetState = function()
{
	let curSyncState = this.getSyncState();
	if (curSyncState.isInSync())
	{
		this._resetSyncStateInternal(false);
	}
	else if (curSyncState === oFF.SyncState.PROCESSING)
	{
		this.m_pendingReset = true;
	}
};
oFF.RsVizVisualizationContainer.prototype.setReEntryListener = function(reEntryListener)
{
	this.m_reEntryListener = reEntryListener;
};
oFF.RsVizVisualizationContainer.prototype.setVisualizationData = function(visualizationData)
{
	this.m_visualizationData = visualizationData;
};
oFF.RsVizVisualizationContainer.prototype.setVisualizationDefinition = function(visualizationDefinition)
{
	let wasInitial = oFF.isNull(this.m_visualizationDefinition);
	this.m_visualizationDefinition = visualizationDefinition;
	this.m_valid = true;
	if (wasInitial)
	{
		this.resetLocalPaging();
	}
};

oFF.RsAxisTupleElement = function() {};
oFF.RsAxisTupleElement.prototype = new oFF.DfApplicationContext();
oFF.RsAxisTupleElement.prototype._ff_c = "RsAxisTupleElement";

oFF.RsAxisTupleElement.create = function(axis, name, member, tupleElementPosition, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState)
{
	let object = new oFF.RsAxisTupleElement();
	object.setupExt(axis, name, member, tupleElementPosition, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState);
	return object;
};
oFF.RsAxisTupleElement.prototype.m_absoluteLevel = 0;
oFF.RsAxisTupleElement.prototype.m_alertLevel = 0;
oFF.RsAxisTupleElement.prototype.m_axis = null;
oFF.RsAxisTupleElement.prototype.m_cellValueType = null;
oFF.RsAxisTupleElement.prototype.m_childCount = 0;
oFF.RsAxisTupleElement.prototype.m_complexUnit = null;
oFF.RsAxisTupleElement.prototype.m_currencyUnit = null;
oFF.RsAxisTupleElement.prototype.m_decimalPlaces = 0;
oFF.RsAxisTupleElement.prototype.m_displayLevel = 0;
oFF.RsAxisTupleElement.prototype.m_drillGroupDimension = null;
oFF.RsAxisTupleElement.prototype.m_drillState = null;
oFF.RsAxisTupleElement.prototype.m_exceptionName = null;
oFF.RsAxisTupleElement.prototype.m_firstTuple = null;
oFF.RsAxisTupleElement.prototype.m_longestCellValueFormatted = null;
oFF.RsAxisTupleElement.prototype.m_longestCellValueRounded = null;
oFF.RsAxisTupleElement.prototype.m_member = null;
oFF.RsAxisTupleElement.prototype.m_name = null;
oFF.RsAxisTupleElement.prototype.m_osid = null;
oFF.RsAxisTupleElement.prototype.m_parentNode = null;
oFF.RsAxisTupleElement.prototype.m_scalingFactor = null;
oFF.RsAxisTupleElement.prototype.m_tupleElementPosition = 0;
oFF.RsAxisTupleElement.prototype.canHaveExtensions = function()
{
	return false;
};
oFF.RsAxisTupleElement.prototype.canMaterializeCompleteObject = function()
{
	return false;
};
oFF.RsAxisTupleElement.prototype.cloneOlapComponent = oFF.noSupport;
oFF.RsAxisTupleElement.prototype.compareTo = function(objectToCompare)
{
	if (oFF.isNull(objectToCompare))
	{
		return -1;
	}
	if (objectToCompare === this)
	{
		return 0;
	}
	let otherTuple = objectToCompare;
	let compare = oFF.XString.compare(this.m_name, otherTuple.getName());
	if (compare === 0)
	{
		compare = this.m_member.compareTo(otherTuple.getDimensionMember());
	}
	return compare;
};
oFF.RsAxisTupleElement.prototype.getAbsoluteLevel = function()
{
	return this.m_absoluteLevel;
};
oFF.RsAxisTupleElement.prototype.getAlertLevel = function()
{
	return this.m_alertLevel;
};
oFF.RsAxisTupleElement.prototype.getAxis = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_axis);
};
oFF.RsAxisTupleElement.prototype.getCellValueType = function()
{
	return this.m_cellValueType;
};
oFF.RsAxisTupleElement.prototype.getChangedProperties = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getChangedPropertiesFromModellerMetadata = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getChangedPropertiesInDetail = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getChildCount = function()
{
	return this.m_childCount;
};
oFF.RsAxisTupleElement.prototype.getComplexUnit = function()
{
	return this.m_complexUnit;
};
oFF.RsAxisTupleElement.prototype.getComponentType = function()
{
	return this.getMemberType();
};
oFF.RsAxisTupleElement.prototype.getCurrencyUnit = function()
{
	return this.m_currencyUnit;
};
oFF.RsAxisTupleElement.prototype.getDecimalPlaces = function()
{
	return this.m_decimalPlaces;
};
oFF.RsAxisTupleElement.prototype.getDimension = function()
{
	return this.m_member.getDimension();
};
oFF.RsAxisTupleElement.prototype.getDimensionMember = function()
{
	return this.m_member;
};
oFF.RsAxisTupleElement.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.RsAxisTupleElement.prototype.getDrillGroupDimension = function()
{
	let dimension = oFF.XWeakReferenceUtil.getHardRef(this.m_drillGroupDimension);
	return oFF.notNull(dimension) ? dimension : this.getDimension();
};
oFF.RsAxisTupleElement.prototype.getDrillPath = function()
{
	return this.getDrillPathExt(true);
};
oFF.RsAxisTupleElement.prototype.getDrillPathExt = function(includeTotalMembers)
{
	let drillPath = oFF.XList.create();
	let firstTuple = this.getFirstTuple();
	let isSapFormat = this.getQueryModel().getModelCapabilities().supportsSapDate();
	let hasSidPresentation = this.getQueryModel().getModelCapabilities().supportsSidPresentation();
	let supportsUdhKey = this.getQueryModel().getModelCapabilities().supportsUdhKey();
	for (let i = 0; i <= this.m_tupleElementPosition; i++)
	{
		let tupleElement = firstTuple.get(i);
		let dimension = tupleElement.getDimension();
		let dimensionMember = tupleElement.getDimensionMember();
		if (!includeTotalMembers && oFF.XConstantWithParent.isObjectTypeOf(dimensionMember.getMemberType(), oFF.MemberType.RESULT))
		{
			continue;
		}
		let isUdhDimensionWithUdhKey = supportsUdhKey && dimension.isUniversalDisplayHierarchyDimension();
		let keyFieldValue = null;
		let hierarchyNavigationOverwriteName = null;
		if (isUdhDimensionWithUdhKey)
		{
			hierarchyNavigationOverwriteName = dimension.getUniversalDisplayHierarchy().getUdhKeyName();
			keyFieldValue = dimensionMember.getAllFieldValues().getByKey(hierarchyNavigationOverwriteName);
		}
		else if (hasSidPresentation)
		{
			hierarchyNavigationOverwriteName = dimension.getHierarchyNavigationField().getName();
			keyFieldValue = dimensionMember.getFieldValue(dimension.getHierarchyNavigationField());
		}
		if (oFF.isNull(keyFieldValue))
		{
			keyFieldValue = dimensionMember.getKeyFieldValue();
			hierarchyNavigationOverwriteName = null;
		}
		let valueException = keyFieldValue.getValueException();
		let value;
		if (oFF.notNull(valueException) && valueException === oFF.ValueException.NULL_VALUE)
		{
			value = null;
		}
		else if (isSapFormat)
		{
			let valueType = keyFieldValue.getValueType();
			if (valueType === oFF.XValueType.DATE)
			{
				value = keyFieldValue.getDate().toSAPFormat();
			}
			else if (valueType === oFF.XValueType.DATE_TIME)
			{
				value = keyFieldValue.getDateTime().toSAPFormat();
			}
			else if (valueType === oFF.XValueType.TIME)
			{
				value = keyFieldValue.getTime().toSAPFormat();
			}
			else
			{
				value = keyFieldValue.getString();
			}
		}
		else
		{
			value = keyFieldValue.getString();
		}
		let element = oFF.QFactory.createDrillPathElement(null, value, dimension);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyNavigationOverwriteName))
		{
			element.setZoomKeyFieldName(element.getFieldName());
			element.setZoomKeyFieldValue(dimensionMember.getKeyFieldValue().getSelectValue());
			element.setFieldName(hierarchyNavigationOverwriteName);
		}
		drillPath.add(element);
	}
	return drillPath;
};
oFF.RsAxisTupleElement.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.RsAxisTupleElement.prototype.getExceptionName = function()
{
	return this.m_exceptionName;
};
oFF.RsAxisTupleElement.prototype.getFirstTuple = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_firstTuple);
};
oFF.RsAxisTupleElement.prototype.getIndexOnAxis = function()
{
	let rsDimensions = this.getAxis().getRsDimensions();
	return oFF.XCollectionUtils.getIndexByName(rsDimensions, this.m_member.getDimension().getName());
};
oFF.RsAxisTupleElement.prototype.getLongestCellValueFormatted = function()
{
	return this.m_longestCellValueFormatted;
};
oFF.RsAxisTupleElement.prototype.getLongestCellValueRounded = function()
{
	return this.m_longestCellValueRounded;
};
oFF.RsAxisTupleElement.prototype.getMemberType = function()
{
	if (oFF.notNull(this.m_drillState) && this.m_drillState !== oFF.DrillState.LEAF)
	{
		return oFF.MemberType.TUPLE_ELEMENT_AS_NODE;
	}
	return oFF.MemberType.TUPLE_ELEMENT_AS_MEMBER;
};
oFF.RsAxisTupleElement.prototype.getName = function()
{
	return this.m_name;
};
oFF.RsAxisTupleElement.prototype.getOlapComponentType = function()
{
	return this.getMemberType();
};
oFF.RsAxisTupleElement.prototype.getOsid = function()
{
	if (oFF.isNull(this.m_osid))
	{
		let buffer = oFF.XStringBuffer.create();
		buffer.append(this.getName());
		buffer.append("_");
		buffer.appendInt(this.m_member.getSession().getNextSid());
		this.m_osid = buffer.toString();
	}
	return this.m_osid;
};
oFF.RsAxisTupleElement.prototype.getParentNode = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parentNode);
};
oFF.RsAxisTupleElement.prototype.getQueryModel = function()
{
	return this.getAxis().getQueryModel();
};
oFF.RsAxisTupleElement.prototype.getScalingFactor = function()
{
	return this.m_scalingFactor;
};
oFF.RsAxisTupleElement.prototype.getSelectableElement = function()
{
	return this.m_member;
};
oFF.RsAxisTupleElement.prototype.getStorageGroupName = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getStorageName = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getStorageObjectName = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getTagging = function()
{
	return null;
};
oFF.RsAxisTupleElement.prototype.getType = function()
{
	return this.getMemberType();
};
oFF.RsAxisTupleElement.prototype.hasUniqueCellValueType = function()
{
	return oFF.notNull(this.m_cellValueType);
};
oFF.RsAxisTupleElement.prototype.hasUniqueComplexUnit = function()
{
	return oFF.notNull(this.m_complexUnit);
};
oFF.RsAxisTupleElement.prototype.hasUniqueCurrencyUnit = function()
{
	return oFF.notNull(this.m_currencyUnit) && !this.m_currencyUnit.isInitial();
};
oFF.RsAxisTupleElement.prototype.hasUniqueDecimalPlaces = function()
{
	return this.m_decimalPlaces > -1;
};
oFF.RsAxisTupleElement.prototype.hasUniqueScalingFactor = function()
{
	return oFF.notNull(this.m_scalingFactor);
};
oFF.RsAxisTupleElement.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let otherTuple = other;
	if (!oFF.XString.isEqual(this.m_name, otherTuple.getName()))
	{
		return false;
	}
	if (this.m_displayLevel !== otherTuple.getDisplayLevel())
	{
		return false;
	}
	if (this.m_absoluteLevel !== otherTuple.getAbsoluteLevel())
	{
		return false;
	}
	if (this.m_drillState !== otherTuple.getDrillState() && (oFF.isNull(this.m_drillState) || !this.m_drillState.isEqualTo(otherTuple.getDrillState())))
	{
		return false;
	}
	return this.m_member.isEqualTo(otherTuple.getDimensionMember());
};
oFF.RsAxisTupleElement.prototype.isEventingStopped = function()
{
	return false;
};
oFF.RsAxisTupleElement.prototype.isLeaf = function()
{
	return this.getMemberType().isLeaf();
};
oFF.RsAxisTupleElement.prototype.isNode = function()
{
	return this.getMemberType().isNode();
};
oFF.RsAxisTupleElement.prototype.queueEventing = function() {};
oFF.RsAxisTupleElement.prototype.registerChangedListener = oFF.noSupport;
oFF.RsAxisTupleElement.prototype.releaseObject = function()
{
	this.m_axis = null;
	this.m_firstTuple = null;
	this.m_parentNode = null;
	this.m_currencyUnit = oFF.XObjectExt.release(this.m_currencyUnit);
	this.m_member = null;
	this.m_drillGroupDimension = oFF.XObjectExt.release(this.m_drillGroupDimension);
	this.m_drillState = null;
	this.m_name = null;
	this.m_exceptionName = null;
	oFF.DfApplicationContext.prototype.releaseObject.call( this );
};
oFF.RsAxisTupleElement.prototype.resumeEventing = function() {};
oFF.RsAxisTupleElement.prototype.setAlertLevel = function(alertLevel)
{
	this.m_alertLevel = alertLevel;
};
oFF.RsAxisTupleElement.prototype.setCellValueType = function(valueType)
{
	this.m_cellValueType = valueType;
};
oFF.RsAxisTupleElement.prototype.setChangedProperties = oFF.noSupport;
oFF.RsAxisTupleElement.prototype.setComplexUnit = function(complexUnit)
{
	this.m_complexUnit = complexUnit;
};
oFF.RsAxisTupleElement.prototype.setCurrencyUnit = function(currencyUnit)
{
	this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCopy(currencyUnit);
};
oFF.RsAxisTupleElement.prototype.setDecimalPlaces = function(decimalPlaces)
{
	this.m_decimalPlaces = decimalPlaces;
};
oFF.RsAxisTupleElement.prototype.setDrillGroupDimension = function(drillGroupDimension)
{
	this.m_drillGroupDimension = oFF.XWeakReferenceUtil.getWeakRef(drillGroupDimension);
};
oFF.RsAxisTupleElement.prototype.setExceptionName = function(exceptionName)
{
	this.m_exceptionName = exceptionName;
};
oFF.RsAxisTupleElement.prototype.setFirstTuple = function(tuple)
{
	this.m_firstTuple = oFF.XWeakReferenceUtil.getWeakRef(tuple);
};
oFF.RsAxisTupleElement.prototype.setLongestCellValueFormatted = function(longestCellValueFormatted)
{
	this.m_longestCellValueFormatted = longestCellValueFormatted;
};
oFF.RsAxisTupleElement.prototype.setLongestCellValueRounded = function(longestCellValueRounded)
{
	this.m_longestCellValueRounded = longestCellValueRounded;
};
oFF.RsAxisTupleElement.prototype.setNextDrillState = function(drillState)
{
	let drillManager = this.getQueryModel().getDrillManager();
	if (drillManager.isDrillStateValid(this, drillState))
	{
		let drillPath = this.getDrillPath();
		return drillManager.setDrillState(drillPath, drillState);
	}
	return null;
};
oFF.RsAxisTupleElement.prototype.setParentNode = function(parentNode)
{
	this.m_parentNode = oFF.XWeakReferenceUtil.getWeakRef(parentNode);
};
oFF.RsAxisTupleElement.prototype.setScalingFactor = function(scalingFactor)
{
	this.m_scalingFactor = scalingFactor;
};
oFF.RsAxisTupleElement.prototype.setupExt = function(axis, name, member, tupleElementPosition, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState)
{
	if (oFF.notNull(axis))
	{
		oFF.DfApplicationContext.prototype.setupApplicationContext.call( this , axis.getApplication());
	}
	this.m_axis = oFF.XWeakReferenceUtil.getWeakRef(axis);
	this.m_member = member;
	this.m_tupleElementPosition = tupleElementPosition;
	if (oFF.isNull(drillState) && !isCorrectDrillState)
	{
		this.m_drillState = oFF.DrillState.LEAF;
	}
	else
	{
		this.m_drillState = drillState;
	}
	this.m_absoluteLevel = absoluteLevel;
	this.m_displayLevel = displayLevel;
	this.m_name = name;
	this.m_childCount = childCount;
};
oFF.RsAxisTupleElement.prototype.stopEventing = function() {};
oFF.RsAxisTupleElement.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3(this.m_name, ":\t", this.m_member.toString());
};
oFF.RsAxisTupleElement.prototype.unregisterChangedListener = oFF.noSupport;

oFF.RsDefDimension = function() {};
oFF.RsDefDimension.prototype = new oFF.RsDefModelComponent();
oFF.RsDefDimension.prototype._ff_c = "RsDefDimension";

oFF.RsDefDimension.create = function(context, dimension, rsDefAxis)
{
	let object = new oFF.RsDefDimension();
	object.setupExt(context, dimension, rsDefAxis);
	return object;
};
oFF.RsDefDimension.createWithInADimension = function(context, dimension, rsDefAxis, inaDimension)
{
	let object = new oFF.RsDefDimension();
	object.setupExt(context, dimension, rsDefAxis);
	object.setupInADimension(inaDimension);
	return object;
};
oFF.RsDefDimension.prototype.m_allFields = null;
oFF.RsDefDimension.prototype.m_allStructureMembers = null;
oFF.RsDefDimension.prototype.m_axis = null;
oFF.RsDefDimension.prototype.m_cacheKey = null;
oFF.RsDefDimension.prototype.m_childAlignment = null;
oFF.RsDefDimension.prototype.m_dimensionType = null;
oFF.RsDefDimension.prototype.m_hasTimeDependentHierarchies = false;
oFF.RsDefDimension.prototype.m_hasVersionDependentHierarchies = false;
oFF.RsDefDimension.prototype.m_hierarchyName = null;
oFF.RsDefDimension.prototype.m_isClustered = false;
oFF.RsDefDimension.prototype.m_isHierarchyActive = false;
oFF.RsDefDimension.prototype.m_isMeasureDimension = false;
oFF.RsDefDimension.prototype.m_isSelectorHierarchyActive = false;
oFF.RsDefDimension.prototype.m_isStructure = false;
oFF.RsDefDimension.prototype.m_isUdhDimension = false;
oFF.RsDefDimension.prototype.m_maxDrillLevel = 0;
oFF.RsDefDimension.prototype.m_maxRuntimeLevel = 0;
oFF.RsDefDimension.prototype.m_overrideText = null;
oFF.RsDefDimension.prototype.m_placeholderIdMemberMap = null;
oFF.RsDefDimension.prototype.m_rsFields = null;
oFF.RsDefDimension.prototype.m_selectorHierarchyName = null;
oFF.RsDefDimension.prototype._getFieldByPresentation = function(flatType, hierarchyType)
{
	let size = this.m_rsFields.size();
	for (let i = 0; i < size; i++)
	{
		let rsField = this.m_rsFields.get(i);
		if (this.m_isUdhDimension)
		{
			if (rsField.getPresentationType().isTypeOf(flatType))
			{
				return rsField;
			}
		}
		else
		{
			if (this.m_isHierarchyActive && rsField.getPresentationType() === hierarchyType)
			{
				return rsField;
			}
			if (!this.m_isHierarchyActive && rsField.getPresentationType() === flatType)
			{
				return rsField;
			}
		}
	}
	return null;
};
oFF.RsDefDimension.prototype.activateHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.addMeasure = function(newMeasure)
{
	this.m_allStructureMembers.add(newMeasure);
};
oFF.RsDefDimension.prototype.addNewCurrencyMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewExceptionAggregationMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewFormulaMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewRestrictedMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewRunningTotalMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewUnitMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addNewVarianceMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.addPlaceholderId = oFF.noSupport;
oFF.RsDefDimension.prototype.addRsField = function(field)
{
	this.m_rsFields.add(field);
};
oFF.RsDefDimension.prototype.addRsField2 = function(fieldName, fieldText, presentationType, valueType, mimeType, isHierarchyNavigationField, longestAttribute)
{
	let rsField = oFF.RsDefField.create(fieldName, fieldText, presentationType, valueType, this, mimeType, isHierarchyNavigationField, longestAttribute);
	this.m_allFields.add(rsField);
	return rsField;
};
oFF.RsDefDimension.prototype.addSearchForKey = oFF.noSupport;
oFF.RsDefDimension.prototype.addSearchForKeyUsingDynamicFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.addSearchForText = oFF.noSupport;
oFF.RsDefDimension.prototype.addSearchForTextUsingDynamicFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterForFields = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterForKey = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterForSpecificKeys = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterForText = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterInterval = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorFilterIntervalForKey = oFF.noSupport;
oFF.RsDefDimension.prototype.addSelectorForValuesAndExternalFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.addStickyMember = oFF.noSupport;
oFF.RsDefDimension.prototype.assignPlaceholderIdByAlias = oFF.noSupport;
oFF.RsDefDimension.prototype.canBeAggregated = oFF.noSupport;
oFF.RsDefDimension.prototype.clearOrphanKeyRefs = oFF.noSupport;
oFF.RsDefDimension.prototype.clearOthersFromConditionsVisibilitySettings = oFF.noSupport;
oFF.RsDefDimension.prototype.clearPlaceholderIds = oFF.noSupport;
oFF.RsDefDimension.prototype.clearResultVisibilitySettings = oFF.noSupport;
oFF.RsDefDimension.prototype.clearSelectorFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.clearSelectorFilterByDimension = oFF.noSupport;
oFF.RsDefDimension.prototype.clearSelectorHierarchyNode = oFF.noSupport;
oFF.RsDefDimension.prototype.clearSelectorSettings = oFF.noSupport;
oFF.RsDefDimension.prototype.clearStickyMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.configureSelectorFilters = oFF.noSupport;
oFF.RsDefDimension.prototype.containsStructureMember = oFF.noSupport;
oFF.RsDefDimension.prototype.convertToFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.createFilterList = oFF.noSupport;
oFF.RsDefDimension.prototype.customHierarchiesIncluded = oFF.noSupport;
oFF.RsDefDimension.prototype.determineBestReadMode = oFF.noSupport;
oFF.RsDefDimension.prototype.effectivelyUseHierarchyDueDateVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.effectivelyUseHierarchyNameVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.effectivelyUseHierarchyVersionVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.fetchHierarchyCatalog = oFF.noSupport;
oFF.RsDefDimension.prototype.fetchHierarchyLevels = oFF.noSupport;
oFF.RsDefDimension.prototype.getAccountTypeAttributeName = oFF.noSupport;
oFF.RsDefDimension.prototype.getAdditionalPeriods = oFF.noSupport;
oFF.RsDefDimension.prototype.getAdvancedResultStructure = oFF.noSupport;
oFF.RsDefDimension.prototype.getAlignmentPriority = oFF.noSupport;
oFF.RsDefDimension.prototype.getAllDimensionMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.getAllFields = function()
{
	return this.m_allFields;
};
oFF.RsDefDimension.prototype.getAllStructureMembers = function()
{
	return this.m_allStructureMembers;
};
oFF.RsDefDimension.prototype.getAlternativeFieldValue = oFF.noSupport;
oFF.RsDefDimension.prototype.getAlternativeFieldValueFields = oFF.noSupport;
oFF.RsDefDimension.prototype.getAlternativeFieldValueLanguageOption = oFF.noSupport;
oFF.RsDefDimension.prototype.getAlternativeFieldValueLanguages = oFF.noSupport;
oFF.RsDefDimension.prototype.getAlternativeFieldValueMemberKeys = oFF.noSupport;
oFF.RsDefDimension.prototype.getAttributeByName = oFF.noSupport;
oFF.RsDefDimension.prototype.getAttributeContainer = oFF.noSupport;
oFF.RsDefDimension.prototype.getAttributeViewName = oFF.noSupport;
oFF.RsDefDimension.prototype.getAttributes = oFF.noSupport;
oFF.RsDefDimension.prototype.getAttributesExt = oFF.noSupport;
oFF.RsDefDimension.prototype.getAxis = oFF.noSupport;
oFF.RsDefDimension.prototype.getAxisType = function()
{
	return this.m_axis.getType();
};
oFF.RsDefDimension.prototype.getBasicStructureMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.getCacheKey = function()
{
	return this.m_cacheKey;
};
oFF.RsDefDimension.prototype.getCatalogItemHierarchyUniqueName = oFF.noSupport;
oFF.RsDefDimension.prototype.getClientDefaultKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getClientDefaultTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.getConvenienceCommands = function()
{
	return this.m_axis.getConvenienceCommands();
};
oFF.RsDefDimension.prototype.getCubeBlendingPropertiesField = oFF.noSupport;
oFF.RsDefDimension.prototype.getCustomHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.getCustomHierarchyDefinition = oFF.noSupport;
oFF.RsDefDimension.prototype.getCustomStructureMembers = function()
{
	return oFF.XStream.of(this.getAllStructureMembers()).filter((member) => {
		return !member.isModelDefinedMember() && !member.isCreatedFromMetadata();
	}).collect(oFF.XStreamCollector.toListOfNameObject());
};
oFF.RsDefDimension.prototype.getDefaultAxisType = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultHierarchyName = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultInitialDrillLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultMemberValue = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultResultSetAttributes = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultResultSetFields = oFF.noSupport;
oFF.RsDefDimension.prototype.getDefaultResultSetTextField = function()
{
	return null;
};
oFF.RsDefDimension.prototype.getDesignDisplayGroupName = oFF.noSupport;
oFF.RsDefDimension.prototype.getDesignDisplayGroupText = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimension = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMember = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberByDate = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberByDouble = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberByInt = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberByLong = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberWithFormat = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionMemberWithValue = oFF.noSupport;
oFF.RsDefDimension.prototype.getDimensionType = function()
{
	return this.m_dimensionType;
};
oFF.RsDefDimension.prototype.getDisplayDescription = function()
{
	return this.getText();
};
oFF.RsDefDimension.prototype.getDisplayKeyField = function()
{
	return this._getFieldByPresentation(oFF.PresentationType.DISPLAY_KEY, oFF.PresentationType.HIERARCHY_DISPLAY_KEY);
};
oFF.RsDefDimension.prototype.getDisplayName = function()
{
	return this.getName();
};
oFF.RsDefDimension.prototype.getEffectiveHierarchyDueDate = oFF.noSupport;
oFF.RsDefDimension.prototype.getEffectiveHierarchyVersion = oFF.noSupport;
oFF.RsDefDimension.prototype.getEffectiveResultSetFields = oFF.noSupport;
oFF.RsDefDimension.prototype.getExtendedStructureMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.getExternalName = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldByName = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldByNameOrAlias = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldByPresentationType = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldBySemanticType = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldBySuffix = function(suffix)
{
	let size = this.m_rsFields.size();
	for (let i = 0; i < size; i++)
	{
		let field = this.m_rsFields.get(i);
		let isFieldWithSuffix = oFF.XString.endsWith(field.getName(), suffix);
		if (isFieldWithSuffix)
		{
			return field;
		}
	}
	return null;
};
oFF.RsDefDimension.prototype.getFieldContainer = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldIterator = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldLayoutTypeExt = oFF.noSupport;
oFF.RsDefDimension.prototype.getFields = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldsExt = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldsListByActiveUsageType = oFF.noSupport;
oFF.RsDefDimension.prototype.getFieldsListByActiveUsageTypeExt = oFF.noSupport;
oFF.RsDefDimension.prototype.getFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.getFilterCapabilities = oFF.noSupport;
oFF.RsDefDimension.prototype.getFilterConsideringLinkedFilters = oFF.noSupport;
oFF.RsDefDimension.prototype.getFirstFieldByType = oFF.noSupport;
oFF.RsDefDimension.prototype.getFirstWeekDay = oFF.noSupport;
oFF.RsDefDimension.prototype.getFirstYearWeekIndicator = oFF.noSupport;
oFF.RsDefDimension.prototype.getFiscalDisplayPeriod = oFF.noSupport;
oFF.RsDefDimension.prototype.getFiscalEnabled = oFF.noSupport;
oFF.RsDefDimension.prototype.getFiscalPeriodPrefix = oFF.noSupport;
oFF.RsDefDimension.prototype.getFiscalShift = oFF.noSupport;
oFF.RsDefDimension.prototype.getFlatDisplayKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getFlatFieldsList = oFF.noSupport;
oFF.RsDefDimension.prototype.getFlatKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getFlatTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.getFreePlaceholderIds = oFF.noSupport;
oFF.RsDefDimension.prototype.getGeoAreaNameField = oFF.noSupport;
oFF.RsDefDimension.prototype.getGeoLevelField = oFF.noSupport;
oFF.RsDefDimension.prototype.getGeoPointField = oFF.noSupport;
oFF.RsDefDimension.prototype.getGeoShapeField = oFF.noSupport;
oFF.RsDefDimension.prototype.getGeoShapeHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.getGroupedDimensions = oFF.noSupport;
oFF.RsDefDimension.prototype.getGroupingDimensionNames = oFF.noSupport;
oFF.RsDefDimension.prototype.getGroupingDimensions = oFF.noSupport;
oFF.RsDefDimension.prototype.getHasCheckTable = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyDisplayKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyDueDate = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyDueDateVariableName = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyFieldsList = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyManager = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyName = function()
{
	return this.m_hierarchyName;
};
oFF.RsDefDimension.prototype.getHierarchyNameVariableName = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyNavigationField = function()
{
	if (this.getQueryManager().getSystemType() !== oFF.SystemType.BW)
	{
		return null;
	}
	return this.getConvenienceCommands().getDimension(this.getName()).getHierarchyNavigationField();
};
oFF.RsDefDimension.prototype.getHierarchyPathField = function()
{
	if (this.getConvenienceCommands().getQueryModel() !== null)
	{
		return this.getConvenienceCommands().getDimension(this.getName()).getHierarchyPathField();
	}
	return this.getFieldBySuffix(".path");
};
oFF.RsDefDimension.prototype.getHierarchyTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyUniqueName = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyValueHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyVersion = oFF.noSupport;
oFF.RsDefDimension.prototype.getHierarchyVersionVariableName = oFF.noSupport;
oFF.RsDefDimension.prototype.getId = oFF.noSupport;
oFF.RsDefDimension.prototype.getIndexOnAxis = function()
{
	return oFF.XStream.of(this.m_axis.getRsDimensions()).collect(oFF.XStreamCollector.toListOfString((dim) => {
		return dim.getName();
	})).getIndex(this.getName());
};
oFF.RsDefDimension.prototype.getInitialDrillLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.getInitialDrillOffset = oFF.noSupport;
oFF.RsDefDimension.prototype.getInitialHierarchyDueDate = oFF.noSupport;
oFF.RsDefDimension.prototype.getInitialHierarchyName = oFF.noSupport;
oFF.RsDefDimension.prototype.getInitialHierarchyVersion = oFF.noSupport;
oFF.RsDefDimension.prototype.getKeyAttributesNames = oFF.noSupport;
oFF.RsDefDimension.prototype.getKeyField = function()
{
	return this._getFieldByPresentation(oFF.PresentationType.KEY, oFF.PresentationType.HIERARCHY_KEY);
};
oFF.RsDefDimension.prototype.getKeyFieldExt = oFF.noSupport;
oFF.RsDefDimension.prototype.getLeveledHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.getLeveledHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.getLoadedStructureMembers = function()
{
	return this.m_allStructureMembers;
};
oFF.RsDefDimension.prototype.getLowerLevelNodeAlignment = function()
{
	return this.m_childAlignment;
};
oFF.RsDefDimension.prototype.getMainAttribute = oFF.noSupport;
oFF.RsDefDimension.prototype.getMaxDrillLevel = function()
{
	return this.m_maxDrillLevel;
};
oFF.RsDefDimension.prototype.getMaxRuntimeLevel = function()
{
	return this.m_maxRuntimeLevel;
};
oFF.RsDefDimension.prototype.getMeasureHelpMetadataSelector = oFF.noSupport;
oFF.RsDefDimension.prototype.getMemberManager = oFF.noSupport;
oFF.RsDefDimension.prototype.getMemberOfPostedNodeVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.getMetadata = oFF.noSupport;
oFF.RsDefDimension.prototype.getMixedDisplayKeyField = function()
{
	return this._getFieldByPresentation(oFF.PresentationType.DISPLAY_KEY_MIXED_COMPOUNDMENT, oFF.PresentationType.DISPLAY_KEY_MIXED_COMPOUNDMENT);
};
oFF.RsDefDimension.prototype.getMixedDisplayKeyFieldExt = function()
{
	return this.getModelCapabilities().supportsMixedDisplayKey() ? this.getMixedDisplayKeyField() : this.getDisplayKeyField();
};
oFF.RsDefDimension.prototype.getModelLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.getNamePathField = oFF.noSupport;
oFF.RsDefDimension.prototype.getNameValuePair = oFF.noSupport;
oFF.RsDefDimension.prototype.getNameValuePairs = oFF.noSupport;
oFF.RsDefDimension.prototype.getNavigationNodes = oFF.noSupport;
oFF.RsDefDimension.prototype.getNestedAllRequiredDimensionProperties = function(context, rsDefAxisDimension, structureMember, inUseFormulaExceptionIds, memberNamesUsedInFilters)
{
	if (!context.getSession().hasFeature(oFF.FeatureToggleOlap.SFX_MINIMUM_DRILL_STATE))
	{
		return null;
	}
	let checkInUsemeasures = !inUseFormulaExceptionIds.contains(structureMember.getAliasOrMemberName()) && !memberNamesUsedInFilters.contains(structureMember.getAliasOrMemberName());
	if (oFF.notNull(rsDefAxisDimension))
	{
		let rsDefAxisStructureMember = rsDefAxisDimension.getStructureMember(structureMember.getName());
		if (oFF.notNull(rsDefAxisStructureMember))
		{
			return rsDefAxisStructureMember.getNestedAllRequiredDimensionProperties(context, null, checkInUsemeasures, memberNamesUsedInFilters);
		}
	}
	return structureMember.getNestedAllRequiredDimensionProperties(context, null, checkInUsemeasures, memberNamesUsedInFilters);
};
oFF.RsDefDimension.prototype.getNextFreePlaceholderId = oFF.noSupport;
oFF.RsDefDimension.prototype.getNumberOfHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.getOriginalText = function()
{
	return oFF.RsDefModelComponent.prototype.getText.call( this );
};
oFF.RsDefDimension.prototype.getOverdefinedMemberManager = oFF.noSupport;
oFF.RsDefDimension.prototype.getOverrideText = function()
{
	return this.m_overrideText;
};
oFF.RsDefDimension.prototype.getPeriodPrefix = oFF.noSupport;
oFF.RsDefDimension.prototype.getPlaceholderIdByAlias = function(aliasName)
{
	let structureMember = this.getStructureMemberByAlias(aliasName);
	if (oFF.notNull(structureMember))
	{
		return structureMember.getName();
	}
	return null;
};
oFF.RsDefDimension.prototype.getPlaceholderIdMemberMap = function()
{
	if (oFF.isNull(this.m_placeholderIdMemberMap))
	{
		return null;
	}
	return this.m_placeholderIdMemberMap;
};
oFF.RsDefDimension.prototype.getPlaceholderIds = oFF.noSupport;
oFF.RsDefDimension.prototype.getReadMode = oFF.noSupport;
oFF.RsDefDimension.prototype.getReadModeDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.getRestNodeName = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultMember = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultSetAttributes = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultSetFields = function()
{
	return this.m_rsFields;
};
oFF.RsDefDimension.prototype.getResultSetSorting = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultStructureController = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultVisibilityByElement = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultVisibilityByElementAndAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.getResultVisibilitySettings = oFF.noSupport;
oFF.RsDefDimension.prototype.getRuntimeDisplayGroupName = oFF.noSupport;
oFF.RsDefDimension.prototype.getRuntimeDisplayGroupText = oFF.noSupport;
oFF.RsDefDimension.prototype.getRuntimePlaceholderIdByAlias = function(aliasName)
{
	return this.getPlaceholderIdByAlias(aliasName);
};
oFF.RsDefDimension.prototype.getRuntimePlaceholderIdMemberMap = function()
{
	return this.getPlaceholderIdMemberMap();
};
oFF.RsDefDimension.prototype.getSelector = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorAttributes = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorContainer = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorDisplayKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorFields = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorFilterUsage = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorHierarchyName = function()
{
	return this.m_selectorHierarchyName;
};
oFF.RsDefDimension.prototype.getSelectorHierarchyNode = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorHierarchyNodeName = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorHierarchyNodeSid = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorLowerLevelNodeAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorMaxResultRecords = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorOrder = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorPagingEnd = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorPagingStart = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorRootLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorSortType = oFF.noSupport;
oFF.RsDefDimension.prototype.getSelectorTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.getSemanticObject = oFF.noSupport;
oFF.RsDefDimension.prototype.getSharedOverrideText = function()
{
	let overrideText = null;
	if (this.getQueryModel() !== null && this.getQueryModel().isBlendingModel())
	{
		let blendedQueryManager = this.getQueryModel().getQueryManager();
		let leafQueryModels = oFF.BlendingBaseUtils.getLeafQueryModels(blendedQueryManager);
		let leafDimension = oFF.BlendingBaseUtils.findLeafDimensionFromBlendedDimension(leafQueryModels, this);
		if (oFF.notNull(leafDimension))
		{
			overrideText = leafDimension.getText();
		}
	}
	else if (this.getOlapEnv() !== null && this.getApplication() !== null && this.getSession() !== null && this.getSession().hasFeature(oFF.FeatureToggleOlap.MEMBER_OVERRIDE_TEXTS))
	{
		if (this.getQueryModel() !== null && oFF.notNull(this.m_cacheKey))
		{
			let olapEnvCube = this.getOlapEnv().getCubeContainer(this.m_cacheKey);
			if (oFF.notNull(olapEnvCube))
			{
				let storageName = this.getQueryModel().getQueryManager().getClientQueryObjectStorageName();
				let datasetId = this.getQueryModel().getDatasetId();
				overrideText = olapEnvCube.getDimensionOverrideTextByDatasetId(storageName, this.getName(), datasetId);
			}
		}
	}
	return overrideText;
};
oFF.RsDefDimension.prototype.getShouldUseActualTextField = function()
{
	return false;
};
oFF.RsDefDimension.prototype.getSkipEntries = oFF.noSupport;
oFF.RsDefDimension.prototype.getSkipMetadataValidationOnRepoImport = oFF.noSupport;
oFF.RsDefDimension.prototype.getStickyMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.getStructureLayout = oFF.noSupport;
oFF.RsDefDimension.prototype.getStructureMember = function(name)
{
	if (oFF.isNull(this.m_allStructureMembers))
	{
		return null;
	}
	return this.m_allStructureMembers.getByKey(name);
};
oFF.RsDefDimension.prototype.getStructureMemberByAlias = function(aliasName)
{
	if (oFF.isNull(this.m_allStructureMembers) || oFF.XStringUtils.isNullOrEmpty(aliasName))
	{
		return null;
	}
	let iterator = this.m_allStructureMembers.getIterator();
	while (iterator.hasNext())
	{
		let member = iterator.next();
		if (oFF.XString.isEqual(member.getAliasName(), aliasName))
		{
			return member;
		}
	}
	return null;
};
oFF.RsDefDimension.prototype.getStructureMemberByAliasOrMember = function(name)
{
	if (oFF.isNull(this.m_allStructureMembers))
	{
		return null;
	}
	let foundMember = this.m_allStructureMembers.getByKey(name);
	if (oFF.isNull(foundMember))
	{
		return this.getStructureMemberByAlias(name);
	}
	return foundMember;
};
oFF.RsDefDimension.prototype.getSupportedAxesTypes = oFF.noSupport;
oFF.RsDefDimension.prototype.getSupportedReadModes = oFF.noSupport;
oFF.RsDefDimension.prototype.getText = function()
{
	let text = oFF.RsDefModelComponent.prototype.getText.call( this );
	let overrideText = this.m_overrideText;
	if (oFF.isNull(overrideText))
	{
		overrideText = this.getSharedOverrideText();
	}
	if (oFF.notNull(overrideText))
	{
		text = overrideText;
	}
	return text;
};
oFF.RsDefDimension.prototype.getTextField = function()
{
	return this._getFieldByPresentation(oFF.PresentationType.TEXT, oFF.PresentationType.HIERARCHY_TEXT);
};
oFF.RsDefDimension.prototype.getTimeConfigPattern = oFF.noSupport;
oFF.RsDefDimension.prototype.getTopEntries = oFF.noSupport;
oFF.RsDefDimension.prototype.getTotalsStructure = oFF.noSupport;
oFF.RsDefDimension.prototype.getUDHWithThisDimensionIncluded = function()
{
	return null;
};
oFF.RsDefDimension.prototype.getUnassignedMember = oFF.noSupport;
oFF.RsDefDimension.prototype.getUniversalDisplayHierarchy = function()
{
	return null;
};
oFF.RsDefDimension.prototype.getUseMonthLabel = oFF.noSupport;
oFF.RsDefDimension.prototype.getValueHelpDimensionMemberWithFormat = oFF.noSupport;
oFF.RsDefDimension.prototype.getValueType = oFF.noSupport;
oFF.RsDefDimension.prototype.getVirtualRootNodeName = oFF.noSupport;
oFF.RsDefDimension.prototype.getVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.hasAlternativeFieldValuesDefined = oFF.noSupport;
oFF.RsDefDimension.prototype.hasDayTimeYYYYMMDDFormat = oFF.noSupport;
oFF.RsDefDimension.prototype.hasDefaultLowerLevelNodeAlignment = function()
{
	return this.m_childAlignment === oFF.Alignment.DEFAULT_VALUE;
};
oFF.RsDefDimension.prototype.hasExternalHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.hasFixedResultSetFields = oFF.noSupport;
oFF.RsDefDimension.prototype.hasFunctionalVariables = oFF.noSupport;
oFF.RsDefDimension.prototype.hasNodeCondensation = oFF.noSupport;
oFF.RsDefDimension.prototype.hasPlaceHolderForHierarchyInfo = oFF.noSupport;
oFF.RsDefDimension.prototype.hasPreviousMasterReadModes = oFF.noSupport;
oFF.RsDefDimension.prototype.hasReadModeDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.hasSorting = oFF.noSupport;
oFF.RsDefDimension.prototype.hasStickyMember = oFF.noSupport;
oFF.RsDefDimension.prototype.hasStickyMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.hasSubsequentBookedReadModes = oFF.noSupport;
oFF.RsDefDimension.prototype.hasTimeDependentHierarchies = function()
{
	return this.m_hasTimeDependentHierarchies;
};
oFF.RsDefDimension.prototype.hasVersionDependentHierarchies = function()
{
	return this.m_hasVersionDependentHierarchies;
};
oFF.RsDefDimension.prototype.hasZoomDrill = oFF.noSupport;
oFF.RsDefDimension.prototype.isClustered = function()
{
	return this.m_isClustered;
};
oFF.RsDefDimension.prototype.isCompound = oFF.noSupport;
oFF.RsDefDimension.prototype.isCumulative = oFF.noSupport;
oFF.RsDefDimension.prototype.isDesignTimeMode = oFF.noSupport;
oFF.RsDefDimension.prototype.isDisplayHierarchyFixInFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.isEnforceAnyHierarchyInfoVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.isEnforceHierarchyDueDateVariableOrDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isEnforceHierarchyNameVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.isEnforceHierarchyVersionVariableOrDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isEnforcedDynamicValue = oFF.noSupport;
oFF.RsDefDimension.prototype.isExplicitDrillOnFilteredNodes = oFF.noSupport;
oFF.RsDefDimension.prototype.isGroupingDimension = oFF.noSupport;
oFF.RsDefDimension.prototype.isHierarchyActive = function()
{
	return this.m_isHierarchyActive;
};
oFF.RsDefDimension.prototype.isHierarchyActiveByDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isHierarchyAssigned = oFF.noSupport;
oFF.RsDefDimension.prototype.isHierarchyAssignedAndActive = oFF.noSupport;
oFF.RsDefDimension.prototype.isHierarchyMandatory = oFF.noSupport;
oFF.RsDefDimension.prototype.isHierarchyNavigationDeltaMode = oFF.noSupport;
oFF.RsDefDimension.prototype.isIgnoredOnOptimizedExport = oFF.noSupport;
oFF.RsDefDimension.prototype.isInitialDrillLevelZeroBased = function()
{
	return !this.m_isStructure || !this.getQueryManager().getSystemType().isTypeOf(oFF.SystemType.BW);
};
oFF.RsDefDimension.prototype.isMeasureStructure = function()
{
	return this.m_isMeasureDimension;
};
oFF.RsDefDimension.prototype.isOwnerDimension = oFF.noSupport;
oFF.RsDefDimension.prototype.isPartOfActiveUDH = oFF.noSupport;
oFF.RsDefDimension.prototype.isPrivate = oFF.noSupport;
oFF.RsDefDimension.prototype.isSelectable = oFF.noSupport;
oFF.RsDefDimension.prototype.isSelectorFilteringOnDisplayKey = oFF.noSupport;
oFF.RsDefDimension.prototype.isSelectorGettingInterval = oFF.noSupport;
oFF.RsDefDimension.prototype.isSelectorHierarchyActive = function()
{
	return this.m_isSelectorHierarchyActive;
};
oFF.RsDefDimension.prototype.isSelectorUseQueryDrillOperations = oFF.noSupport;
oFF.RsDefDimension.prototype.isStructure = function()
{
	return this.m_isStructure;
};
oFF.RsDefDimension.prototype.isTechnicalDimension = oFF.noSupport;
oFF.RsDefDimension.prototype.isTimeConfigEnablePattern = oFF.noSupport;
oFF.RsDefDimension.prototype.isTotalsAlignmentOnDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isTotalsStructureOnDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isTotalsVisibilityOnDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.isUniversalDisplayHierarchyDimension = function()
{
	return this.m_isUdhDimension;
};
oFF.RsDefDimension.prototype.isUseServerDefaultKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.isUseServerDefaultTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.isUsedInFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.isUserManaged = oFF.noSupport;
oFF.RsDefDimension.prototype.newDimensionMemberEmpty = oFF.noSupport;
oFF.RsDefDimension.prototype.newHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.newValueHelpMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.processFunctionalVariableHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.processIsNodeChildOfParent = oFF.noSupport;
oFF.RsDefDimension.prototype.processMemberHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.processValueHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.processValueHelpResultSet = oFF.noSupport;
oFF.RsDefDimension.prototype.processVarHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.processVarHelpWithVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.processVariableHelp = oFF.noSupport;
oFF.RsDefDimension.prototype.processVariableHelpWithVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.releaseObject = function()
{
	this.m_allFields = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_allFields);
	this.m_rsFields = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_rsFields);
	this.m_allStructureMembers = oFF.XObjectExt.release(this.m_allStructureMembers);
	this.m_placeholderIdMemberMap = oFF.XObjectExt.release(this.m_placeholderIdMemberMap);
	this.m_axis = oFF.XObjectExt.release(this.m_axis);
	this.m_hierarchyName = null;
	this.m_dimensionType = null;
	this.m_childAlignment = null;
	this.m_overrideText = null;
	this.m_cacheKey = null;
	this.m_selectorHierarchyName = null;
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefDimension.prototype.removeAssignedPlaceholderId = oFF.noSupport;
oFF.RsDefDimension.prototype.removeCustomMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.removeCustomMembersWithWhiteList = oFF.noSupport;
oFF.RsDefDimension.prototype.removeMeasure = oFF.noSupport;
oFF.RsDefDimension.prototype.removeMeasureWithNoValidation = oFF.noSupport;
oFF.RsDefDimension.prototype.removeOverdefinedAccount = oFF.noSupport;
oFF.RsDefDimension.prototype.removeStickyMember = oFF.noSupport;
oFF.RsDefDimension.prototype.reorderPlaceholderIds = oFF.noSupport;
oFF.RsDefDimension.prototype.resetFieldsToDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.resetHierarchyCatalogFetched = oFF.noSupport;
oFF.RsDefDimension.prototype.resetToDefaultReadMode = oFF.noSupport;
oFF.RsDefDimension.prototype.restoreTotalsAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.restoreTotalsVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.serializeValueHelpForPersistedInA = oFF.noSupport;
oFF.RsDefDimension.prototype.setAlignmentPriority = oFF.noSupport;
oFF.RsDefDimension.prototype.setAlternativeFieldValue = oFF.noSupport;
oFF.RsDefDimension.prototype.setClientDefaultKeyField = oFF.noSupport;
oFF.RsDefDimension.prototype.setClientDefaultTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.setCustomHierarchyDefinition = oFF.noSupport;
oFF.RsDefDimension.prototype.setDesignTimeMode = oFF.noSupport;
oFF.RsDefDimension.prototype.setEnforceHierarchyDueDateVariableOrDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.setEnforceHierarchyNameVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.setEnforceHierarchyVersionVariableOrDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.setExplicitDrillOnFilteredNodes = oFF.noSupport;
oFF.RsDefDimension.prototype.setFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.setHasNodeCondensation = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchyActive = function(active)
{
	this.m_isHierarchyActive = active;
	return true;
};
oFF.RsDefDimension.prototype.setHierarchyCatalogKeyDate = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchyDueDate = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchyDueDateVariableName = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchyName = function(name)
{
	this.m_hierarchyName = name;
};
oFF.RsDefDimension.prototype.setHierarchySelection = oFF.noSupport;
oFF.RsDefDimension.prototype.setHierarchyVersion = oFF.noSupport;
oFF.RsDefDimension.prototype.setIgnoreOnOptimizedExport = oFF.noSupport;
oFF.RsDefDimension.prototype.setIncludeCustomHierarchies = oFF.noSupport;
oFF.RsDefDimension.prototype.setInitialDrillLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.setInitialDrillOffset = oFF.noSupport;
oFF.RsDefDimension.prototype.setIsClustered = function(isClustered)
{
	this.m_isClustered = isClustered;
};
oFF.RsDefDimension.prototype.setIsCumulative = oFF.noSupport;
oFF.RsDefDimension.prototype.setLowerLevelNodeAlignment = function(alignment)
{
	this.m_childAlignment = alignment;
};
oFF.RsDefDimension.prototype.setMeasureHelpMetadataSelector = oFF.noSupport;
oFF.RsDefDimension.prototype.setMemberOfPostedNodeVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.setOverrideText = function(overrideText)
{
	if (!oFF.XString.isEqual(overrideText, "") && !oFF.XString.isEqual(overrideText, this.m_overrideText))
	{
		this.m_overrideText = overrideText;
	}
};
oFF.RsDefDimension.prototype.setPlaceholderIds = oFF.noSupport;
oFF.RsDefDimension.prototype.setReadMode = oFF.noSupport;
oFF.RsDefDimension.prototype.setReadModeGraceful = oFF.noSupport;
oFF.RsDefDimension.prototype.setResultAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.setResultVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.setResultVisibilityByElement = oFF.noSupport;
oFF.RsDefDimension.prototype.setResultVisibilityByElementAndAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.setRsDimensionType = function(dimensionType)
{
	this.m_dimensionType = dimensionType;
};
oFF.RsDefDimension.prototype.setSelectorCascadingReadModeAndFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorComplexSelectionRoot = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorCustomTextField = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorFields = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorFilterOnDisplayKey = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorFilterUsage = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorGettingInterval = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorHierarchyActive = function(isActive)
{
	this.m_isSelectorHierarchyActive = isActive;
};
oFF.RsDefDimension.prototype.setSelectorHierarchyName = function(hierarchyName)
{
	this.m_selectorHierarchyName = hierarchyName;
};
oFF.RsDefDimension.prototype.setSelectorHierarchyNode = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorHierarchyNodeByName = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorHierarchyWithNodeSid = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorInitialDrillLevel = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorLowerLevelNodeAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorMaxResultRecords = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorOrder = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorPaging = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorPagingDefault = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorPagingEnd = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorPagingStart = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorSortType = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorUseQueryDrillOperations = oFF.noSupport;
oFF.RsDefDimension.prototype.setSelectorUseVisibilityFilter = oFF.noSupport;
oFF.RsDefDimension.prototype.setSkipEntries = oFF.noSupport;
oFF.RsDefDimension.prototype.setSkipMetadataValidationOnRepoImport = oFF.noSupport;
oFF.RsDefDimension.prototype.setStructuredLayout = oFF.noSupport;
oFF.RsDefDimension.prototype.setTopEntries = oFF.noSupport;
oFF.RsDefDimension.prototype.setUseDefaultDrillLevelOnChange = oFF.noSupport;
oFF.RsDefDimension.prototype.setUseHierarchyDueDateVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.setupExt = function(context, dimension, rsDefAxis)
{
	this.setupContext(context);
	this.m_axis = rsDefAxis;
	this.m_allStructureMembers = oFF.XListOfNameObject.create();
	this.m_placeholderIdMemberMap = oFF.XHashMapByString.create();
	this.m_maxDrillLevel = oFF.isNull(dimension) ? -1 : dimension.getMaxDrillLevel();
	this.m_maxRuntimeLevel = oFF.isNull(dimension) ? -1 : dimension.getMaxRuntimeLevel();
	if (oFF.notNull(dimension))
	{
		this.m_isUdhDimension = dimension.isUniversalDisplayHierarchyDimension();
		this.setName(dimension.getName());
		this.setText(dimension.getOriginalText());
		this.setOverrideText(dimension.getOverrideText());
		this.m_cacheKey = dimension.getCacheKey();
		this.m_isMeasureDimension = dimension.isMeasureStructure();
		this.m_isStructure = dimension.isStructure();
		this.m_isHierarchyActive = dimension.isHierarchyActive();
		this.m_isSelectorHierarchyActive = dimension.isSelectorHierarchyActive();
		this.m_selectorHierarchyName = dimension.getSelectorHierarchyName();
		this.m_hierarchyName = dimension.getHierarchyName();
		this.m_dimensionType = dimension.getDimensionType();
		this.m_childAlignment = dimension.getLowerLevelNodeAlignment();
		if (dimension.getDimensionType() === oFF.DimensionType.ACCOUNT || dimension.getDimensionType() === oFF.DimensionType.MEASURE_STRUCTURE)
		{
			let rsDefAxisDimension = oFF.XCollectionUtils.findFirst(rsDefAxis.getRsDimensions(), (rsDim) => {
				return oFF.XString.isEqual(rsDim.getName(), dimension.getName());
			});
			let structureMembers = dimension.getLoadedStructureMembers();
			let inUseFormulaExceptionIds = oFF.XHashSetOfString.create();
			let structureMember;
			if (context.getSession().hasFeature(oFF.FeatureToggleOlap.SFX_MINIMUM_DRILL_STATE))
			{
				for (let j = 0; j < structureMembers.size(); j++)
				{
					structureMember = structureMembers.get(j);
					if (oFF.notNull(structureMember))
					{
						inUseFormulaExceptionIds.addAll(structureMember.getAvailableFormulaExceptionIds(context));
					}
				}
			}
			let membersUsedInFilters = oFF.QFilterUtilBase.getMembersInUseFromList(structureMembers, dimension.getQueryModel().getFilter(), dimension);
			let memberNamesUsedInFilters = oFF.XStream.of(membersUsedInFilters).collect(oFF.XStreamCollector.toListOfString((memberUsedInFilters) => {
				return memberUsedInFilters.getAliasOrMemberName();
			}));
			for (let i = 0; i < structureMembers.size(); i++)
			{
				structureMember = structureMembers.get(i);
				if (oFF.notNull(structureMember) && !structureMember.isReleased())
				{
					let placeholderName = dimension.getRuntimePlaceholderIdByAlias(structureMember.getAliasName());
					if (oFF.isNull(placeholderName))
					{
						placeholderName = structureMember.getName();
					}
					let nestedMemberQueryProperties = this.getNestedAllRequiredDimensionProperties(context, rsDefAxisDimension, structureMember, inUseFormulaExceptionIds, memberNamesUsedInFilters);
					let rsStructureMember = oFF.RsDefStructureMember.create(placeholderName, structureMember.getAliasName(), nestedMemberQueryProperties, structureMember.getAvailableFormulaExceptionIds(context), context, dimension.getName(), this.m_cacheKey);
					rsStructureMember.setText(structureMember.getOriginalText());
					rsStructureMember.setOverrideText(structureMember.getOverrideText());
					this.m_allStructureMembers.add(rsStructureMember);
					this.m_placeholderIdMemberMap.put(placeholderName, rsStructureMember);
				}
			}
		}
	}
	this.m_rsFields = oFF.RsDefFieldList.create();
	this.m_allFields = oFF.RsDefFieldList.create();
	this.setIsClustered(false);
};
oFF.RsDefDimension.prototype.setupInADimension = function(inaDimension)
{
	this.setName(inaDimension.getName());
	if (this.getQueryManager() === null || this.getQueryManager().isShallow())
	{
		this.setText(inaDimension.getText());
	}
	this.setHierarchyName(inaDimension.getHierarchyName());
	this.setRsDimensionType(inaDimension.getDimensionType());
	this.setHierarchyActive(inaDimension.isHierarchyActive());
	this.setLowerLevelNodeAlignment(inaDimension.getLowerLevelNodeAlignment());
	this.setIsClustered(inaDimension.isClustered());
	this.m_maxDrillLevel = inaDimension.getMaxDrillLevel();
	this.m_maxRuntimeLevel = inaDimension.getMaxRuntimeLevel();
	this.m_hasTimeDependentHierarchies = inaDimension.hasTimeDependentHierarchies();
	this.m_hasVersionDependentHierarchies = inaDimension.hasVersionDependentHierarchies();
};
oFF.RsDefDimension.prototype.supportsAdvancedResultStructure = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsAxis = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsBasicStructureMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsCalculatedBeforeAggregation = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsCumulative = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsCurrencyTranslationMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsCustomMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsFieldLayoutType = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsHierarchy = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsLowerCase = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsReadMode = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsResultAlignment = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsResultVisibility = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsRunningTotalMeasures = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsSorting = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsTotals = oFF.noSupport;
oFF.RsDefDimension.prototype.supportsUnitTranslationMembers = oFF.noSupport;
oFF.RsDefDimension.prototype.useDefaultDrillLevelOnChange = oFF.noSupport;
oFF.RsDefDimension.prototype.useHierarchyDueDateVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.useHierarchyNameVariable = oFF.noSupport;
oFF.RsDefDimension.prototype.useHierarchyVersionVariable = oFF.noSupport;

oFF.RsDefQueryModel = function() {};
oFF.RsDefQueryModel.prototype = new oFF.RsDefModelComponent();
oFF.RsDefQueryModel.prototype._ff_c = "RsDefQueryModel";

oFF.RsDefQueryModel.create = function(queryManager, visualizationManager, rowsAxis, columnsAxis, dimension, isExecuteAutoVariableSubmit)
{
	let object = new oFF.RsDefQueryModel();
	object.setupExt(queryManager, visualizationManager, rowsAxis, columnsAxis, dimension, isExecuteAutoVariableSubmit);
	return object;
};
oFF.RsDefQueryModel.prototype.m_cols = null;
oFF.RsDefQueryModel.prototype.m_isExecuteAutoVariableSubmit = false;
oFF.RsDefQueryModel.prototype.m_queryManager = null;
oFF.RsDefQueryModel.prototype.m_rows = null;
oFF.RsDefQueryModel.prototype.m_visualizationManager = null;
oFF.RsDefQueryModel.prototype.addDimension = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addInputReadinessFilterState = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addNewCalculatedDimensionWithName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addNewCalculatedDimensionWithNameAndPreQueryName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addNewMeasureCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addNewMeasureUnitTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addNewModellingMeasureCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addOptimizerHint = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addPreQueryWithName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.addQueryModelIdToMessages = oFF.noSupport;
oFF.RsDefQueryModel.prototype.assertHierarchyUniqueName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.augmentSFXMetadata = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearAllOptimizerHints = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearCalculatedDimensions = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearClientInfo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearExternalVariablesRepresentations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearInputReadinessFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearMeasureCurrencyTranslations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearMeasureUnitTranslations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearOthersFromConditionsVisibilitySettings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearPreQueries = oFF.noSupport;
oFF.RsDefQueryModel.prototype.clearResultVisibilitySettings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.convertToFieldLayoutType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.deactivateCumulative = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAccountDimension = function()
{
	let columnRsDimensions = this.m_cols.getRsDimensions();
	for (let columnIndex = 0; columnIndex < columnRsDimensions.size(); columnIndex++)
	{
		if (columnRsDimensions.get(columnIndex).getDimensionType() === oFF.DimensionType.ACCOUNT)
		{
			return columnRsDimensions.get(columnIndex);
		}
	}
	let rowRsDimensions = this.m_rows.getRsDimensions();
	for (let rowIndex = 0; rowIndex < rowRsDimensions.size(); rowIndex++)
	{
		if (rowRsDimensions.get(rowIndex).getDimensionType() === oFF.DimensionType.ACCOUNT)
		{
			return rowRsDimensions.get(rowIndex);
		}
	}
	return null;
};
oFF.RsDefQueryModel.prototype.getAlignmentPriority = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAllDisabledReturnedDataSelectionConstants = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAllEnabledReturnedDataSelectionConstants = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAllReturnedDataSelections = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableCategories = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableCurrencies = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableCurrencyTranslationObjects = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableRateNames = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableRateTypes = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAvailableRateVersions = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAxesManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getAxisDef = function(axis)
{
	if (axis === oFF.AxisType.ROWS)
	{
		return this.m_rows;
	}
	return this.m_cols;
};
oFF.RsDefQueryModel.prototype.getBaseDataSource = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getBlendingDefinition = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getBlendingSources = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getChartCommands = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getClientComponent = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getClientIdentifier = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getClientInfo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getClientVersion = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getColumnsAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getColumnsAxisDef = function()
{
	return this.m_cols;
};
oFF.RsDefQueryModel.prototype.getConditionManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getContext = function()
{
	return this;
};
oFF.RsDefQueryModel.prototype.getConvenienceCommands = function()
{
	let queryManager = this.getQueryManager();
	return oFF.notNull(queryManager) ? queryManager.getConvenienceCommands() : null;
};
oFF.RsDefQueryModel.prototype.getCubeInfo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getCurrencyRateTableId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getCurrencyTranslationDetails = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getCurrencyTranslationDetailsReset = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getCurrencyTranslationEnabledType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getCurrencyTranslationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDataArea = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDataSource = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDatasetEpmObject = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDatasetId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDatasetShortDescriptionOrName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDatasetUIName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDefaultCurrency = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDefinitionName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionAccessor = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionByName = function(name)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name))
	{
		let rsDimension = null;
		let rowRsDimensions = this.m_rows.getRsDimensions();
		for (let rowIndex = 0; rowIndex < rowRsDimensions.size(); rowIndex++)
		{
			rsDimension = rowRsDimensions.get(rowIndex);
			if (oFF.XString.isEqual(rsDimension.getName(), name))
			{
				return rsDimension;
			}
		}
		let columnRsDimensions = this.m_cols.getRsDimensions();
		for (let columnIndex = 0; columnIndex < columnRsDimensions.size(); columnIndex++)
		{
			rsDimension = columnRsDimensions.get(columnIndex);
			if (oFF.XString.isEqual(rsDimension.getName(), name))
			{
				return rsDimension;
			}
		}
	}
	return null;
};
oFF.RsDefQueryModel.prototype.getDimensionByNameFromExistingMetadata = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionByNameFromExistingMetadataOrFormulaCalcDim = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionByType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionCount = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionMemberVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionNameByType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionNames = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensions = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDimensionsByType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDocumentsIdsRequest = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDocumentsInfo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDrillManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDueDate = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getDynamicAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getExceptionManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getExplainQueryContext = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getExtendedDimensions = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFieldAccessorSingle = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFieldByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFieldByNameOrAlias = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFilterAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFormulaExceptionManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getFreeAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getHierarchyNameVariable = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getHierarchyNameVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getHierarchyNodeVariable = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInfoProvider = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInputEnabledAndNonTechnicalVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInputEnabledVariable = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInputEnabledVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInputReadinessFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getInteropManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getKeyRefStorage = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getLanguageLocale = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getLoadedDimensions = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMaxNumberOfTranslations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMeasureCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMeasureCurrencyTranslations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMeasureDimension = function()
{
	let columnRsDimensions = this.m_cols.getRsDimensions();
	for (let columnIndex = 0; columnIndex < columnRsDimensions.size(); columnIndex++)
	{
		if (columnRsDimensions.get(columnIndex).getDimensionType() === oFF.DimensionType.MEASURE_STRUCTURE)
		{
			return columnRsDimensions.get(columnIndex);
		}
	}
	let rowRsDimensions = this.m_rows.getRsDimensions();
	for (let rowIndex = 0; rowIndex < rowRsDimensions.size(); rowIndex++)
	{
		if (rowRsDimensions.get(rowIndex).getDimensionType() === oFF.DimensionType.MEASURE_STRUCTURE)
		{
			return rowRsDimensions.get(rowIndex);
		}
	}
	return null;
};
oFF.RsDefQueryModel.prototype.getMeasureUnitTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMeasureUnitTranslations = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getMetadataProperties = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getModelCapabilities = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getModelLevel = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getModellingCurrencyTranslationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getNonMeasureDimension = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getNonMeasureDimension2 = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getNonStructureCount = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getOlapEnv = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getOlapSystemContainer = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getOptimizerHintsByExecutionEngine = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getPlanningMode = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getPreQueries = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getPreQueryByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getPrimaryCalculationDimension = function()
{
	let accountDimension = this.getAccountDimension();
	if (oFF.isNull(accountDimension))
	{
		return this.getMeasureDimension();
	}
	return accountDimension;
};
oFF.RsDefQueryModel.prototype.getPrimaryCalculationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryCellManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryDataCell = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryDataCells = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryManager = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_queryManager);
};
oFF.RsDefQueryModel.prototype.getQueryManagerBase = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getQueryModel = function()
{
	return this;
};
oFF.RsDefQueryModel.prototype.getQuickActionManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getRepositoryAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultStructureController = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultVisibility = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultVisibilityByElement = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultVisibilityByElementAndAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getResultVisibilitySettings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getReturnedUniqueAxisProperties = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getRowsAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getRowsAxisDef = function()
{
	return this.m_rows;
};
oFF.RsDefQueryModel.prototype.getRunningAggregationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getRuntimePlaceholderIdMappings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSecondaryCalculationDimension = function()
{
	if (this.getAccountDimension() !== null)
	{
		return this.getMeasureDimension();
	}
	return this.getNonMeasureDimension();
};
oFF.RsDefQueryModel.prototype.getSemanticObject = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getShouldUseActualTextField = function()
{
	return false;
};
oFF.RsDefQueryModel.prototype.getSimulationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSortingManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSpatialClusterSettings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getStaticRriTargets = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getStoryId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getStoryName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getStructureByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getStructureCount = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSystemDescription = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSystemName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getSystemType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getTechnicalAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getUnitTranslationManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getUniversalDisplayHierarchies = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVariable = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVariableContainer = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVariableManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVariableMode = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVersionDimension = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVersionDimensionName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVirtualAxis = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVirtualRootNodeName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getVisualizationManager = function()
{
	return this.m_visualizationManager;
};
oFF.RsDefQueryModel.prototype.getVizManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.getWidgetId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasDynamicRriTarget = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasExplainQueryContext = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasInputEnabledAndNonTechnicalVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasInputEnabledVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasMandatoryVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasProcessingStep = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasQuickActionManager = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasRriTarget = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasRuntimeDimensionGroupName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasStaticRriTarget = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasUserDefinedMeasures = oFF.noSupport;
oFF.RsDefQueryModel.prototype.hasVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isAccountModel = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isAutoSubmitDisabledByMetadata = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isBasedOnMicroCube = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isBasicMeasureAggregationExportedInRepo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isBasicMeasureSettingsExportedInRepo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isBlendingModel = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isCumulativeDeactive = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isDataEntryEnabled = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isDataEntryReadOnly = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isDataExportRestricted = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isExecuteAutoVariableSubmit = function()
{
	return this.m_isExecuteAutoVariableSubmit;
};
oFF.RsDefQueryModel.prototype.isExportingEachMeasure = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isExportingFixedFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isExportingVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isKeepingOriginalTexts = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isLeadingStructureAccount = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isLeadingStructureMeasure = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isMetadataUpdatedByAutoSubmit = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isOptimizedExportModeActive = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isPlanning = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isReturnTupleCountTotal = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isSelectorReadModeMasterOnly = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isTotalsAlignmentOnDefault = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isTotalsStructureOnDefault = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isTotalsVisibilityOnDefault = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isUniversalAccountModel = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isValueHelpIgnoreQueryDynamicFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isValueHelpUseCompleteEffectiveFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.isVersionDimensionValidationEnabled = oFF.noSupport;
oFF.RsDefQueryModel.prototype.releaseObject = function()
{
	this.m_cols = oFF.XObjectExt.release(this.m_cols);
	this.m_rows = oFF.XObjectExt.release(this.m_rows);
	this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefQueryModel.prototype.removeCalculatedDimensionByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removeDimension = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removeMeasureCurrencyTranslationByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removeMeasureUnitTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removeMeasureUnitTranslationByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removeOptimizerHint = oFF.noSupport;
oFF.RsDefQueryModel.prototype.removePreQueryByName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.resetCurrencyTranslationDetails = oFF.noSupport;
oFF.RsDefQueryModel.prototype.restoreTotalsAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.restoreTotalsVisibility = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setAlignmentPriority = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setBasicMeasureAggregationExportForRepo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setBasicMeasureSettingsExportedInRepo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setBatchModeForMicroCube = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setClientInfo = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setDataEntryReadOnly = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setDefinitionName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setExportEachMeasure = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setExportFixedFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setExportVariables = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setHasProcessingStep = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setIgnoreQueryDynamicFilterInValueHelp = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setInputReadinessFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setKeepOriginalTexts = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setLanguageLocale = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setOptimizedExportMode = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setPlanningMode = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setResultAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setResultVisibility = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setResultVisibilityByElement = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setResultVisibilityByElementAndAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setReturnTupleCountTotal = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setSelectorReadModeMasterOnly = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setShouldUseActualTextField = function(shouldUseActualField) {};
oFF.RsDefQueryModel.prototype.setSpatialClusterSettings = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setStoryId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setStoryName = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setValueHelpUseCompleteEffectiveFilter = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setVersionDimensionValidationEnabled = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setWidgetId = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setWinControlInAutoSubmitByType = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setupBwCatalogs = oFF.noSupport;
oFF.RsDefQueryModel.prototype.setupExt = function(queryManager, visualizationManager, rowsAxis, columnsAxis, dimension, isExecuteAutoVariableSubmit)
{
	this.setupContext(queryManager);
	this.m_queryManager = oFF.XWeakReferenceUtil.getWeakRef(queryManager);
	this.m_rows = oFF.RsDefAxis.create(queryManager, oFF.AxisType.ROWS, this);
	this.m_cols = oFF.RsDefAxis.create(queryManager, oFF.AxisType.COLUMNS, this);
	this.m_isExecuteAutoVariableSubmit = isExecuteAutoVariableSubmit;
	if (oFF.notNull(dimension))
	{
		this.m_rows.addDimension(dimension);
	}
	else
	{
		if (oFF.notNull(rowsAxis))
		{
			this.m_rows.addAllDimensions(rowsAxis);
		}
		if (oFF.notNull(columnsAxis))
		{
			this.m_cols.addAllDimensions(columnsAxis);
		}
	}
	this.m_visualizationManager = visualizationManager;
};
oFF.RsDefQueryModel.prototype.supportsCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsDataEntryReadOnly = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsEpmModelledCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsGlobalQueryCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsMeasureBasedCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsResultAlignment = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsResultVisibility = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsSimpleFixedTargetCurrencyTranslation = oFF.noSupport;
oFF.RsDefQueryModel.prototype.supportsTotals = oFF.noSupport;
oFF.RsDefQueryModel.prototype.toggleReturnedDataSelection = oFF.noSupport;

oFF.RsDefStructureMember = function() {};
oFF.RsDefStructureMember.prototype = new oFF.RsDefModelComponent();
oFF.RsDefStructureMember.prototype._ff_c = "RsDefStructureMember";

oFF.RsDefStructureMember.create = function(name, aliasName, nestedAllRequiredDimensionProperties, availableFormulaExceptionIds, context, dimensionName, dimensionCacheKey)
{
	let rsDefStructureMember = new oFF.RsDefStructureMember();
	rsDefStructureMember.setupContext(context);
	rsDefStructureMember.setName(name);
	rsDefStructureMember.m_aliasName = aliasName;
	rsDefStructureMember.m_nestedAllRequiredDimensionProperties = nestedAllRequiredDimensionProperties;
	rsDefStructureMember.m_availableFormulaExceptionIds = availableFormulaExceptionIds;
	rsDefStructureMember.m_dimensionName = dimensionName;
	rsDefStructureMember.m_dimensionCacheKey = dimensionCacheKey;
	rsDefStructureMember.m_overrideText = null;
	return rsDefStructureMember;
};
oFF.RsDefStructureMember.prototype.m_aliasName = null;
oFF.RsDefStructureMember.prototype.m_availableFormulaExceptionIds = null;
oFF.RsDefStructureMember.prototype.m_dimensionCacheKey = null;
oFF.RsDefStructureMember.prototype.m_dimensionName = null;
oFF.RsDefStructureMember.prototype.m_nestedAllRequiredDimensionProperties = null;
oFF.RsDefStructureMember.prototype.m_overrideText = null;
oFF.RsDefStructureMember.prototype.acceptsMoreExceptionAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.addExceptionAggregationDimension = oFF.noSupport;
oFF.RsDefStructureMember.prototype.addExceptionAggregationDimensionName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.addExternalDimensionToIgnore = oFF.noSupport;
oFF.RsDefStructureMember.prototype.addPostAggregationDimension = oFF.noSupport;
oFF.RsDefStructureMember.prototype.addPostAggregationDimensionName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.clearExceptionAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.clearIgnoredExternalDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.clearPostAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.copyAttributesFromDimensionMember = oFF.noSupport;
oFF.RsDefStructureMember.prototype.copySharableProperties = oFF.noSupport;
oFF.RsDefStructureMember.prototype.createFilterOperation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.destroyTransientObjects = oFF.noSupport;
oFF.RsDefStructureMember.prototype.exportRuntimeObject = oFF.noSupport;
oFF.RsDefStructureMember.prototype.generateTransientObjects = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getAccountType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getAliasName = function()
{
	return this.m_aliasName;
};
oFF.RsDefStructureMember.prototype.getAliasOrMemberName = function()
{
	if (oFF.notNull(this.m_aliasName))
	{
		return this.m_aliasName;
	}
	return this.getName();
};
oFF.RsDefStructureMember.prototype.getAllFieldValues = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getAvailableFormulaExceptionIds = function(context)
{
	return this.m_availableFormulaExceptionIds;
};
oFF.RsDefStructureMember.prototype.getBoolean = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellChartBarColor = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellChartLineColor = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellChartOrientation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellChartOrientationEffective = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellChartType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCellValueType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getContext = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getConvenienceCommands = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCurrencyPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCurrencyTranslation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getCurrencyTranslationName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDataSource = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDataType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDataTypeInternal = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDataTypePrecision = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDataTypeScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDate = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDateByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDateTime = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDecFloat = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDefaultAggregationType = function()
{
	return null;
};
oFF.RsDefStructureMember.prototype.getDefaultNumericScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDefaultNumericShift = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDefaultNumericShiftExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDefaultSelectedDimensionNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDimension = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDimensionAccessor = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDimensionMember = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDimensionMemberNameValueException = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDimensionsUsedByMember = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDisplayDescription = function()
{
	return this.getText();
};
oFF.RsDefStructureMember.prototype.getDisplayName = function()
{
	return this.getAliasName();
};
oFF.RsDefStructureMember.prototype.getDouble = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDoubleByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getDrillManager = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getErrorValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getExceptionAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getExceptionAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getExceptions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getFieldAccessorSingle = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getFieldValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getFormattedValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getGeometry = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getIgnoredExternalDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getIntByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getInteger = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getKeyFieldValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getKeyRefStorage = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getLineString = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getLong = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMaxNumberOfDimensionsForExceptionAggregation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMemberType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMinimumDrillstate = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getModelCapabilities = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMultiLineString = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMultiPoint = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getMultiPolygon = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNestedAllRequiredDimensionProperties = function(context, messageManager, checkInUsemeasures, memberNamesUsedInFilters)
{
	return this.m_nestedAllRequiredDimensionProperties;
};
oFF.RsDefStructureMember.prototype.getNestedDependentCrossCalculationMeasureNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNestedDependentMemberNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNestedDependentMembers = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNestedMemberQueryProperties = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNull = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNumericPrecision = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNumericScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNumericShift = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getNumericShiftExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getOriginalText = function()
{
	return oFF.RsDefModelComponent.prototype.getText.call( this );
};
oFF.RsDefStructureMember.prototype.getOverrideText = function()
{
	return this.m_overrideText;
};
oFF.RsDefStructureMember.prototype.getPoint = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPolygon = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPolygonByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPostAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPostAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPreferredHierarchy = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPresentationSignReversal = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getPropertiesValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getQueryDataCells = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getRateType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getRequiredDimensionAndFieldNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getResultCalculation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getResultSetFieldValues = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getResultVisibility = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getRunningAggregationInitDimension = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getRunningAggregationOperator = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getScaleAndUnitPlacement = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getScaleFormat = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSelectField = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSelectHierarchyName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSelectMemberType = function()
{
	return null;
};
oFF.RsDefStructureMember.prototype.getSelectValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSelectableElement = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSemanticObject = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSharedOverrideText = function()
{
	let overrideText = null;
	if (this.getOlapEnv() !== null && this.getApplication() !== null && this.getSession() !== null && this.getSession().hasFeature(oFF.FeatureToggleOlap.MEMBER_OVERRIDE_TEXTS) && this.getQueryModel() !== null && oFF.notNull(this.m_dimensionName) && oFF.notNull(this.m_dimensionCacheKey))
	{
		let olapEnvCube = this.getOlapEnv().getCubeContainer(this.m_dimensionCacheKey);
		if (oFF.notNull(olapEnvCube))
		{
			let storageName = this.getQueryModel().getQueryManager().getClientQueryObjectStorageName();
			let datasetId = this.getQueryModel().getDatasetId();
			overrideText = olapEnvCube.getDimensionMemberOverrideTextByDatasetId(storageName, this.m_dimensionName, this.getName(), datasetId);
		}
	}
	return overrideText;
};
oFF.RsDefStructureMember.prototype.getSignPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSingleValueCalculation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSolveOrder = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getString = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getStringByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getStructureListValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getStructureValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSupportedDimensionsForExceptionAggregation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getSupportedExceptionAggregationTypes = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getText = function()
{
	let text = oFF.RsDefModelComponent.prototype.getText.call( this );
	let overrideText = this.m_overrideText;
	if (oFF.isNull(overrideText))
	{
		overrideText = this.getSharedOverrideText();
	}
	if (oFF.notNull(overrideText))
	{
		text = overrideText;
	}
	return text;
};
oFF.RsDefStructureMember.prototype.getTime = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getTimeSpan = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getTimeSpanByPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getTopLevelDependentFieldNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUdhKey = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitDimensionName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitDimensionProperty = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitFixed = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitTextName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitTranslation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitTranslationName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnitType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getUnsatisfiedRequiredDimensionNames = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getValueAsString = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getValueType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getVariableContainer = oFF.noSupport;
oFF.RsDefStructureMember.prototype.getWindowFunction = oFF.noSupport;
oFF.RsDefStructureMember.prototype.hasOverrideTextDefined = function()
{
	return oFF.notNull(this.m_overrideText) || this.getSharedOverrideText() !== null;
};
oFF.RsDefStructureMember.prototype.hasValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isAggregationTypeDefault = function()
{
	return false;
};
oFF.RsDefStructureMember.prototype.isAutoSignFlip = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isCellChartShowValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isCreatedFromMetadata = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isCumulation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isCurrencyPresentationDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isCustomDefaultSolveOrderApplicable = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isDisplayDescriptionSet = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isDisplayNameSet = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isHideNumberForCellChart = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isIgnoringAllExternalDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isMultiDataSourceMember = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isNumericScaleDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isNumericShiftDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isNumericShiftDefaultExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isNumericShiftPercent = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isPostAggregationIgnoringHierarchy = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isRunningAggregationDefined = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isRunningAggregationSupported = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isScaleAndUnitPlacementDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isScaleFormatDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isSelectionCandidate = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isShowCellChart = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isSignPresentationDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isSolveOrderOverDefined = oFF.noSupport;
oFF.RsDefStructureMember.prototype.isVersionAggregated = oFF.noSupport;
oFF.RsDefStructureMember.prototype.loadBLOBForField = oFF.noSupport;
oFF.RsDefStructureMember.prototype.releaseObject = function()
{
	this.m_aliasName = null;
	this.m_nestedAllRequiredDimensionProperties = oFF.XObjectExt.release(this.m_nestedAllRequiredDimensionProperties);
	this.m_availableFormulaExceptionIds = oFF.XObjectExt.release(this.m_availableFormulaExceptionIds);
	this.m_overrideText = null;
	this.m_dimensionName = null;
	this.m_dimensionCacheKey = null;
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefStructureMember.prototype.removeExceptionAggregationDimension = oFF.noSupport;
oFF.RsDefStructureMember.prototype.removeExternalDimensionToIgnore = oFF.noSupport;
oFF.RsDefStructureMember.prototype.removePostAggregationDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.requireRuntimeExport = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetNumericPrecision = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetNumericScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetNumericShift = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetNumericShiftExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefault = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultAggregationType = function() {};
oFF.RsDefStructureMember.prototype.resetToDefaultCurrencyPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultNumericPrecision = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultNumericScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultNumericShift = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultNumericShiftExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultScaleAndUnitPlacement = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultScaleFormat = oFF.noSupport;
oFF.RsDefStructureMember.prototype.resetToDefaultSignPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setAccountType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setAliasName = function(aliasName)
{
	this.m_aliasName = aliasName;
};
oFF.RsDefStructureMember.prototype.setAutoSignFlip = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCellChartBarColor = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCellChartLineColor = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCellChartOrientation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCellChartShowValue = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCellChartType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCurrencyPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCurrencyTranslation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setCurrencyTranslationName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setExceptionAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setHideNumberForCellChart = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setIgnoreAllExternalDimensions = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setNumericPrecision = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setNumericScale = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setNumericShift = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setNumericShiftExt = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setNumericShiftPercent = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setOverrideText = function(overrideText)
{
	if (!oFF.XString.isEqual(overrideText, "") && !oFF.XString.isEqual(overrideText, this.m_overrideText))
	{
		this.m_overrideText = overrideText;
	}
};
oFF.RsDefStructureMember.prototype.setPostAggregationIgnoreHierarchy = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setPostAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setPreferredHierarchy = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setPresentationSignReversal = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setResultVisibility = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setScaleAndUnitPlacement = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setScaleFormat = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setShowCellChart = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setSignPresentation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setSolveOrder = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setUnitFixed = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setUnitTranslation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setUnitTranslationName = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setUnitType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.setWindowFunction = oFF.noSupport;
oFF.RsDefStructureMember.prototype.supportsCalculatedBeforeAggregation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.supportsDimensionForExceptionAggregation = oFF.noSupport;
oFF.RsDefStructureMember.prototype.supportsExceptionAggregationType = oFF.noSupport;
oFF.RsDefStructureMember.prototype.validate = oFF.noSupport;
oFF.RsDefStructureMember.prototype.validateWithDataModelScope = oFF.noSupport;
oFF.RsDefStructureMember.prototype.validateWithQueryModelScope = oFF.noSupport;

oFF.RsCellDocumentIdCreateAction = function() {};
oFF.RsCellDocumentIdCreateAction.prototype = new oFF.RsCellDocumentIdAction();
oFF.RsCellDocumentIdCreateAction.prototype._ff_c = "RsCellDocumentIdCreateAction";

oFF.RsCellDocumentIdCreateAction.createAndRunAction = function(queryManager, syncType, listener, indexInfo)
{
	let obj = new oFF.RsCellDocumentIdCreateAction();
	obj.setupSetActionAndRun(syncType, listener, indexInfo, queryManager, oFF.DocumentsIdsAction.CREATE);
	return obj;
};
oFF.RsCellDocumentIdCreateAction.prototype.isOperationValid = function(cellDocumentId)
{
	let isValid = oFF.XStringUtils.isNullOrEmpty(cellDocumentId);
	if (!isValid)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Cell document ID already exists.");
	}
	return this.isWriteOperationSupported() && isValid;
};

oFF.RsCellDocumentIdDeleteAction = function() {};
oFF.RsCellDocumentIdDeleteAction.prototype = new oFF.RsCellDocumentIdAction();
oFF.RsCellDocumentIdDeleteAction.prototype._ff_c = "RsCellDocumentIdDeleteAction";

oFF.RsCellDocumentIdDeleteAction.createAndRunAction = function(queryManager, syncType, listener, indexInfo)
{
	let obj = new oFF.RsCellDocumentIdDeleteAction();
	obj.setupSetActionAndRun(syncType, listener, indexInfo, queryManager, oFF.DocumentsIdsAction.DELETE);
	return obj;
};
oFF.RsCellDocumentIdDeleteAction.prototype.isOperationValid = function(cellDocumentId)
{
	let isValid = oFF.XStringUtils.isNotNullAndNotEmpty(cellDocumentId);
	if (!isValid)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Cell document ID does not exist.");
	}
	return this.isDeleteOperationSupported() && isValid;
};

oFF.RsCellDocumentIdGetAction = function() {};
oFF.RsCellDocumentIdGetAction.prototype = new oFF.RsCellDocumentIdAction();
oFF.RsCellDocumentIdGetAction.prototype._ff_c = "RsCellDocumentIdGetAction";

oFF.RsCellDocumentIdGetAction.createAndRunAction = function(queryManager, syncType, listener, indexInfo)
{
	let obj = new oFF.RsCellDocumentIdGetAction();
	obj.setupGetActionAndRun(syncType, listener, indexInfo, queryManager);
	return obj;
};
oFF.RsCellDocumentIdGetAction.prototype.isOperationValid = oFF.noSupport;
oFF.RsCellDocumentIdGetAction.prototype.onGridCollectorFilled = function(extResult, gridContainer, customIdentifier)
{
	if (extResult.isValid())
	{
		let cellValueReference = gridContainer.getCellValueReference(this.m_indexInfo.getColumnIndex(), this.m_indexInfo.getRowIndex());
		if (oFF.notNull(cellValueReference))
		{
			this.m_cellDocumentId = cellValueReference.getDocumentId();
			this.m_isCellDocIdSet = true;
		}
		else
		{
			let messages = this.m_queryManager.getActiveResultSetContainer().getMessages();
			if (messages.size() > 0)
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, messages.get(0).getText());
			}
		}
	}
	else
	{
		this.addAllMessages(extResult);
		let dataAreaCommand = this.m_queryManager.createDataAreaCommandDocReset();
		dataAreaCommand.processCommand(this.getActiveSyncType(), this, null);
	}
};
oFF.RsCellDocumentIdGetAction.prototype.processSynchronization = function(syncType)
{
	try
	{
		if (this.m_queryManager.getModelCapabilities().supportsCellDocumentId())
		{
			let columnIndex = this.m_indexInfo.getColumnIndex();
			let rowIndex = this.m_indexInfo.getRowIndex();
			if (columnIndex < 0)
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Negative column indices are not allowed.");
			}
			else if (rowIndex < 0)
			{
				this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, "Negative row indices are not allowed.");
			}
			else if (oFF.notNull(this.m_gridCollector) && this.m_gridCollector.getGridContainer().isOriginInitialized())
			{
				let gridContainer = this.m_gridCollector.getGridContainer();
				let cellValueReference = gridContainer.getCellValueReference(columnIndex, rowIndex);
				if (this.m_gridCollector.getSyncState().isInSync() && oFF.notNull(cellValueReference))
				{
					this.m_cellDocumentId = cellValueReference.getDocumentId();
					this.m_isCellDocIdSet = true;
				}
				else
				{
					this.m_gridCollector.executeWindowedRequest(syncType, this, null, null, rowIndex, rowIndex, columnIndex, columnIndex);
				}
			}
			else
			{
				let resultSet = this.m_queryManager.getCursorResultSet();
				if (oFF.notNull(resultSet) && resultSet.getState().hasData())
				{
					this.m_cellDocumentId = resultSet.getDataCell(this.m_indexInfo.getColumnIndex(), this.m_indexInfo.getRowIndex()).getDocumentId();
					this.m_isCellDocIdSet = true;
				}
				else
				{
					let messages = this.m_queryManager.getActiveResultSetContainer().getMessages();
					if (messages.size() > 0)
					{
						this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, messages.get(0).getText());
					}
				}
			}
		}
	}
	catch (ex)
	{
		this.addError(oFF.ErrorCodes.CELL_DOCUMENT_ID_ACTION_FAILED, oFF.XException.getMessage(ex));
	}
	this.setData(this);
	return false;
};
oFF.RsCellDocumentIdGetAction.prototype.setupGetActionAndRun = function(syncType, listener, indexInfo, queryManager)
{
	this.m_isCellDocIdSet = false;
	this.m_queryManager = queryManager;
	this.m_gridCollector = queryManager.getQueryModel().getVisualizationManager().getGridCollector();
	this.m_indexInfo = indexInfo;
	oFF.RsCellDocumentIdAction.prototype.setupActionAndRun.call( this , syncType, listener, indexInfo, null);
};

oFF.QValueHelpNode = function() {};
oFF.QValueHelpNode.prototype = new oFF.DfRsSyncAction();
oFF.QValueHelpNode.prototype._ff_c = "QValueHelpNode";

oFF.QValueHelpNode.SPLITTER_SIZE = 100;
oFF.QValueHelpNode.STRATEGY = 0;
oFF.QValueHelpNode.STRATEGY_SPLITTER = 1;
oFF.QValueHelpNode.STRATEGY_WINDOWING = 0;
oFF.QValueHelpNode.WINDOW_SIZE = 100;
oFF.QValueHelpNode.create = function(valueHelp, parentNode, member, displayLevel, absoluteLevel)
{
	let newObj = new oFF.QValueHelpNode();
	newObj.setupNode(valueHelp, parentNode, member, displayLevel, 1, absoluteLevel);
	return newObj;
};
oFF.QValueHelpNode.prototype.m_absoluteLevel = 0;
oFF.QValueHelpNode.prototype.m_aggregatedChildCount = 0;
oFF.QValueHelpNode.prototype.m_childSetState = null;
oFF.QValueHelpNode.prototype.m_children = null;
oFF.QValueHelpNode.prototype.m_displayLevel = 0;
oFF.QValueHelpNode.prototype.m_member = null;
oFF.QValueHelpNode.prototype.m_osid = null;
oFF.QValueHelpNode.prototype.m_parentNode = null;
oFF.QValueHelpNode.prototype.m_requestSettings = null;
oFF.QValueHelpNode.prototype.m_splittingSize = 0;
oFF.QValueHelpNode.prototype.addChild = function(node, childState)
{
	if (oFF.isNull(this.m_children))
	{
		this.m_children = oFF.XList.create();
	}
	if (oFF.QValueHelpNode.STRATEGY === oFF.QValueHelpNode.STRATEGY_WINDOWING)
	{
		this.m_children.add(node);
	}
	else
	{
		let size2 = this.m_children.size();
		if (this.m_splittingSize === -1)
		{
			let currentWindowNode = this.m_children.get(size2 - 1);
			currentWindowNode.addChild(node, childState);
		}
		else
		{
			if (size2 >= oFF.QValueHelpNode.SPLITTER_SIZE)
			{
				let childNode = this.m_children.get(size2 - 1);
				let aggregatedChildCount = childNode.getAggregatedChildCount();
				if (aggregatedChildCount === this.m_splittingSize)
				{
					let myChildren2 = this.m_children;
					this.m_children = oFF.XList.create();
					let startIndex2 = this.getStartIndex();
					let splitterNode = oFF.QValueHelpSplitterNode.createSplitterNode(this.getActionContext(), this, 0, startIndex2, 1, -1);
					splitterNode.setChildSetState(oFF.ChildSetState.COMPLETE);
					this.m_children.add(splitterNode);
					let mySize3 = myChildren2.size();
					for (let k = 0; k < mySize3; k++)
					{
						splitterNode.addChild(myChildren2.get(k), childState);
					}
					this.m_splittingSize = this.m_splittingSize * oFF.QValueHelpNode.SPLITTER_SIZE;
					size2 = this.m_children.size();
				}
			}
			if (this.m_splittingSize === 1)
			{
				this.m_children.add(node);
			}
			else
			{
				let splitterNode2 = this.m_children.get(size2 - 1);
				let childSetState = splitterNode2.getChildSetState();
				if (childSetState === oFF.ChildSetState.INITIAL)
				{
					splitterNode2.setChildSetState(oFF.ChildSetState.COMPLETE);
				}
				let aggregatedChildCount2 = splitterNode2.getAggregatedChildCount();
				if (aggregatedChildCount2 >= this.m_splittingSize)
				{
					let startIndex3 = splitterNode2.getEndIndex() + 1;
					splitterNode2 = oFF.QValueHelpSplitterNode.createSplitterNode(this.getActionContext(), this, 0, startIndex3, 1, -1);
					splitterNode2.setChildSetState(oFF.ChildSetState.COMPLETE);
					this.m_children.add(splitterNode2);
				}
				splitterNode2.addChild(node, childState);
			}
		}
	}
	this.m_aggregatedChildCount = this.m_aggregatedChildCount + node.getAggregatedChildCount();
};
oFF.QValueHelpNode.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	let nodes = data;
	listener.onValueHelpFetched(extResult, this, nodes, customIdentifier);
};
oFF.QValueHelpNode.prototype.canHaveExtensions = function()
{
	return false;
};
oFF.QValueHelpNode.prototype.canMaterializeCompleteObject = function()
{
	return false;
};
oFF.QValueHelpNode.prototype.cloneOlapComponent = oFF.noSupport;
oFF.QValueHelpNode.prototype.getAbsoluteLevel = function()
{
	return this.m_absoluteLevel;
};
oFF.QValueHelpNode.prototype.getAggregatedChildCount = function()
{
	if (oFF.isNull(this.m_children) && oFF.notNull(this.m_member))
	{
		return 1;
	}
	return this.m_aggregatedChildCount;
};
oFF.QValueHelpNode.prototype.getChangedProperties = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getChangedPropertiesFromModellerMetadata = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getChangedPropertiesInDetail = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getChildCount = oFF.noSupport;
oFF.QValueHelpNode.prototype.getChildElements = function()
{
	if (oFF.isNull(this.m_children))
	{
		return oFF.XList.create();
	}
	return oFF.XReadOnlyListWrapper.create(this.m_children);
};
oFF.QValueHelpNode.prototype.getChildSetState = function()
{
	return this.m_childSetState;
};
oFF.QValueHelpNode.prototype.getChildren = function()
{
	return this.m_children;
};
oFF.QValueHelpNode.prototype.getComponentType = function()
{
	return this.getMemberType();
};
oFF.QValueHelpNode.prototype.getContentConstant = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getContentElement = function()
{
	return this;
};
oFF.QValueHelpNode.prototype.getDimension = function()
{
	return this.getActionContext().getValueHelpDimension();
};
oFF.QValueHelpNode.prototype.getDimensionMember = function()
{
	return this.m_member;
};
oFF.QValueHelpNode.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.QValueHelpNode.prototype.getDrillPath = function()
{
	return oFF.XList.create();
};
oFF.QValueHelpNode.prototype.getDrillState = oFF.noSupport;
oFF.QValueHelpNode.prototype.getEndIndex = function()
{
	let startIndex = this.getStartIndex();
	let aggregatedChildCount = this.getAggregatedChildCount();
	return startIndex + aggregatedChildCount - 1;
};
oFF.QValueHelpNode.prototype.getFirstText = function()
{
	return this.getName();
};
oFF.QValueHelpNode.prototype.getLastText = function()
{
	return this.getName();
};
oFF.QValueHelpNode.prototype.getMemberType = function()
{
	if (oFF.isNull(this.m_parentNode))
	{
		return oFF.MemberType.VALUE_HELP_ROOT_NODE;
	}
	return oFF.MemberType.VALUE_HELP_NODE;
};
oFF.QValueHelpNode.prototype.getName = function()
{
	if (oFF.notNull(this.m_member))
	{
		let name = this.m_member.getName();
		let text = this.m_member.getText();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(text))
		{
			let buffer = oFF.XStringBuffer.create();
			buffer.append(text);
			buffer.append(" [");
			buffer.append(name);
			buffer.append("]");
			return buffer.toString();
		}
		return name;
	}
	else if (oFF.isNull(this.m_parentNode))
	{
		return "Root";
	}
	else
	{
		return "[undefined]";
	}
};
oFF.QValueHelpNode.prototype.getOlapComponentType = function()
{
	return this.getMemberType();
};
oFF.QValueHelpNode.prototype.getOsid = function()
{
	if (oFF.isNull(this.m_osid))
	{
		let buffer = oFF.XStringBuffer.create();
		buffer.append(this.getName());
		buffer.append("_");
		buffer.appendInt(this.m_member.getSession().getNextSid());
		this.m_osid = buffer.toString();
	}
	return this.m_osid;
};
oFF.QValueHelpNode.prototype.getParentNode = function()
{
	return this.m_parentNode;
};
oFF.QValueHelpNode.prototype.getParentValueHelpNode = function()
{
	return this.m_parentNode;
};
oFF.QValueHelpNode.prototype.getSelectableElement = function()
{
	return this.m_member;
};
oFF.QValueHelpNode.prototype.getStartIndex = function()
{
	return 0;
};
oFF.QValueHelpNode.prototype.getStorageGroupName = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getStorageName = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getStorageObjectName = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.QValueHelpNode.prototype.getTagging = function()
{
	return null;
};
oFF.QValueHelpNode.prototype.getText = function()
{
	return this.getName();
};
oFF.QValueHelpNode.prototype.getType = function()
{
	return this.getMemberType();
};
oFF.QValueHelpNode.prototype.hasChildren = function()
{
	return true;
};
oFF.QValueHelpNode.prototype.isLeaf = function()
{
	return this.getMemberType().isLeaf();
};
oFF.QValueHelpNode.prototype.isNode = function()
{
	return this.getMemberType().isNode();
};
oFF.QValueHelpNode.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	let valueHelpDimension = this.getDimension();
	this.clearMessages();
	this.addAllMessages(extResult);
	let level0Children = oFF.XList.create();
	let allChildren = oFF.XList.create();
	if (extResult.isValid())
	{
		let cursorResultSet = resultSetContainer.getCursorResultSet();
		let cursorRowsAxis = cursorResultSet.getCursorRowsAxis();
		let currentParent;
		let peerNode;
		let tuplesCount = cursorRowsAxis.getTuplesCount();
		let myTargetState;
		let childTargetState;
		if (tuplesCount < this.m_requestSettings.getWindowSize())
		{
			myTargetState = oFF.ChildSetState.COMPLETE;
		}
		else
		{
			myTargetState = oFF.ChildSetState.INCOMPLETE;
		}
		let previousChildren = null;
		let rootExpandingLevels = valueHelpDimension.getInitialDrillLevel();
		if (oFF.QValueHelpNode.STRATEGY === oFF.QValueHelpNode.STRATEGY_WINDOWING)
		{
			if (this.m_requestSettings.isHierarchyAssignedAndActive() && rootExpandingLevels >= 0)
			{
				childTargetState = oFF.ChildSetState.INITIAL;
			}
			else
			{
				childTargetState = myTargetState;
			}
		}
		else
		{
			if (this.m_requestSettings.isHierarchyAssignedAndActive() && rootExpandingLevels >= 0)
			{
				childTargetState = oFF.ChildSetState.INCOMPLETE;
			}
			else
			{
				childTargetState = oFF.ChildSetState.COMPLETE;
			}
			if (oFF.notNull(this.m_children))
			{
				previousChildren = this.m_children;
				this.m_children = oFF.XList.create();
				let lastPos = previousChildren.size() - 1;
				let lastElement = previousChildren.get(lastPos);
				this.m_children.add(lastElement);
				previousChildren.removeAt(lastPos);
			}
		}
		if (this.m_requestSettings.isDeltaDrill())
		{
			if (cursorRowsAxis.hasNextTuple())
			{
				cursorRowsAxis.nextTuple();
				allChildren.add(this);
			}
		}
		while (cursorRowsAxis.hasNextTuple())
		{
			cursorRowsAxis.nextTuple();
			let tupleElement = cursorRowsAxis.nextTupleElement();
			let displayLevel = tupleElement.getDisplayLevel();
			let absoluteLevel = tupleElement.getAbsoluteLevel();
			let parentIndex = tupleElement.getParentNodeIndex();
			if (parentIndex === -1)
			{
				currentParent = this;
			}
			else
			{
				currentParent = allChildren.get(parentIndex);
			}
			let dimMember = tupleElement.createDimensionMemberFromCurrentPosition();
			let node;
			peerNode = oFF.QValueHelpNode.create(this.getActionContext(), currentParent, dimMember, displayLevel, absoluteLevel);
			peerNode.setChildSetState(childTargetState);
			node = peerNode;
			currentParent.addChild(node, childTargetState);
			allChildren.add(node);
			if (displayLevel === 0)
			{
				level0Children.add(node);
			}
		}
		if (oFF.QValueHelpNode.STRATEGY === oFF.QValueHelpNode.STRATEGY_SPLITTER && myTargetState === oFF.ChildSetState.INCOMPLETE)
		{
			let endIndex = this.getEndIndex() + 1;
			let emptySplitter = oFF.QValueHelpSplitterNode.createSplitterNode(this.getActionContext(), this, 0, endIndex, 1, -1);
			this.m_children.add(emptySplitter);
		}
		this.m_childSetState = myTargetState;
	}
	else
	{
		this.m_childSetState = oFF.ChildSetState.COMPLETE;
	}
	this.setData(level0Children);
	this.endSync();
};
oFF.QValueHelpNode.prototype.processChildFetch = oFF.noSupport;
oFF.QValueHelpNode.prototype.processSynchronization = function(syncType)
{
	let valueHelpDimension = this.getActionContext().getValueHelpDimension();
	let name = valueHelpDimension.getName();
	let hierarchyAssignedAndActive = valueHelpDimension.isHierarchyAssignedAndActive();
	let endIndex = 0;
	if (this.m_childSetState === oFF.ChildSetState.INCOMPLETE)
	{
		endIndex = this.getEndIndex() + 1;
	}
	this.m_requestSettings = oFF.QFactory.createRequestSettings(endIndex, oFF.QValueHelpNode.WINDOW_SIZE, hierarchyAssignedAndActive);
	let queryManager = this.getActionContext().getQueryManager();
	let valueHelpModel = queryManager.getQueryModel();
	let selector = valueHelpModel.getFilter();
	let selectionStateContainer = selector.getDynamicFilter();
	if (!selectionStateContainer.isCartesianProduct())
	{
		selectionStateContainer.setComplexRoot(null);
	}
	let cmds = valueHelpModel.getConvenienceCommands();
	cmds.clearFiltersByDimensionName(name);
	if (this.m_requestSettings.isHierarchyAssignedAndActive())
	{
		if (this.getMemberType() === oFF.MemberType.VALUE_HELP_ROOT_NODE)
		{
			valueHelpDimension.setInitialDrillLevel(0);
		}
		else
		{
			let memberName = this.m_member.getName();
			cmds.addSingleMemberFilterByDimension(valueHelpDimension, memberName, oFF.ComparisonOperator.EQUAL);
			this.m_requestSettings.setDeltaDrill(true);
			valueHelpDimension.setInitialDrillLevel(1);
		}
	}
	queryManager.setOffsetRows(this.m_requestSettings.getOffset());
	queryManager.setMaxRows(this.m_requestSettings.getWindowSize());
	queryManager.processQueryExecution(syncType, this, this.m_requestSettings);
	return true;
};
oFF.QValueHelpNode.prototype.processValueHelpFetch = function(syncType, listener, customIdentifier)
{
	if (this.m_childSetState === oFF.ChildSetState.INCOMPLETE)
	{
		this.resetSyncState();
	}
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.QValueHelpNode.prototype.registerChangedListener = oFF.noSupport;
oFF.QValueHelpNode.prototype.setChangedProperties = oFF.noSupport;
oFF.QValueHelpNode.prototype.setChildSetState = function(state)
{
	this.m_childSetState = state;
};
oFF.QValueHelpNode.prototype.setupNode = function(valueHelp, parentNode, member, displayLevel, splittingSize, absoluteLevel)
{
	this.setupAction(null, null, null, valueHelp);
	this.m_parentNode = parentNode;
	this.m_displayLevel = displayLevel;
	this.m_absoluteLevel = absoluteLevel;
	this.m_childSetState = oFF.ChildSetState.INITIAL;
	this.m_splittingSize = splittingSize;
	this.m_member = member;
};
oFF.QValueHelpNode.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	buffer.appendLine(oFF.DfRsSyncAction.prototype.toString.call( this ));
	buffer.append("Name: ").appendLine(this.getName());
	buffer.append("Type: ").appendLine(this.getMemberType().getName());
	buffer.append("ChildState: ").appendLine(this.m_childSetState.getName());
	buffer.append("DisplayLevel: ").appendInt(this.getDisplayLevel());
	return buffer.toString();
};
oFF.QValueHelpNode.prototype.unregisterChangedListener = oFF.noSupport;

oFF.QValueHelpNode2 = function() {};
oFF.QValueHelpNode2.prototype = new oFF.RsAxisTupleElement();
oFF.QValueHelpNode2.prototype._ff_c = "QValueHelpNode2";

oFF.QValueHelpNode2.CHILD_FETCH_IDENTIFIER_PREFIX = "ChildId_";
oFF.QValueHelpNode2.PARENT_FETCH_IDENTIFIER_PREFIX = "ParentId_";
oFF.QValueHelpNode2.createValueHelpNode = function(name, member, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState)
{
	let node = new oFF.QValueHelpNode2();
	node.setupValueHelpNode(name, member, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState);
	return node;
};
oFF.QValueHelpNode2.prototype.m_childSetState = null;
oFF.QValueHelpNode2.prototype.m_children = null;
oFF.QValueHelpNode2.prototype.m_customIdentifiers = null;
oFF.QValueHelpNode2.prototype.m_listeners = null;
oFF.QValueHelpNode2.prototype.m_results = null;
oFF.QValueHelpNode2.prototype.valueHelpIdentifier = 0;
oFF.QValueHelpNode2.prototype.addChildNode = function(childNode)
{
	if (oFF.notNull(childNode) && oFF.notNull(this.m_children))
	{
		this.m_children.add(childNode);
		childNode.setParentNode(this);
		this.m_childSetState = oFF.ChildSetState.INCOMPLETE;
	}
};
oFF.QValueHelpNode2.prototype.addChildNodes = function(childNodes, offset)
{
	let validChildNodes = oFF.XList.create();
	if (oFF.XCollectionUtils.hasElements(childNodes))
	{
		for (let i = 0; i < childNodes.size(); i++)
		{
			let child = childNodes.get(i);
			if (child.getParentNode() !== null && child.getParentNode() !== this)
			{
				continue;
			}
			child.setParentNode(this);
			validChildNodes.add(child);
			let index = offset + i;
			if (this.m_children.size() > index)
			{
				child.getDimensionMember().copyAttributesFromDimensionMember(this.m_children.get(index).getDimensionMember());
				this.m_children.set(index, child);
			}
			else
			{
				this.m_children.add(child);
			}
		}
	}
	return validChildNodes;
};
oFF.QValueHelpNode2.prototype.callListenerForParentFetch = function(messages, resultSetContainer, identifier)
{
	let customListener = this.m_listeners.getByKey(identifier);
	if (oFF.notNull(customListener))
	{
		let data = oFF.XList.create();
		data.add(this.getParentNode());
		customListener.onValuehelpExecuted(oFF.ExtResult.create(data, messages), resultSetContainer, this.m_customIdentifiers.getByKey(identifier));
	}
};
oFF.QValueHelpNode2.prototype.cleanParentFetchResult = function(child, originChild)
{
	let parent = child.getParentNode();
	if (oFF.notNull(parent))
	{
		parent.m_children.clear();
		parent.addChildNode(originChild);
		originChild.setParentNode(parent);
		this.cleanParentFetchResult(parent, parent);
	}
};
oFF.QValueHelpNode2.prototype.createIdentifier = function(listener, customIdentifier, identifierPrefix)
{
	let identifier = oFF.XStringUtils.concatenate2(identifierPrefix, oFF.XInteger.convertToString(this.valueHelpIdentifier));
	this.valueHelpIdentifier++;
	this.m_listeners.put(identifier, listener);
	this.m_customIdentifiers.put(identifier, customIdentifier);
	return identifier;
};
oFF.QValueHelpNode2.prototype.getChildNodes = function(start, end)
{
	if (this.m_childSetState === oFF.ChildSetState.NONE)
	{
		return oFF.XList.create();
	}
	if (this.m_childSetState === oFF.ChildSetState.COMPLETE || this.hasChildren() && start < this.m_children.size() && end > 0 && end <= this.m_children.size())
	{
		if (oFF.isNull(this.m_children) || start >= this.m_children.size())
		{
			return oFF.XList.create();
		}
		let result = this.m_children.sublist(start, oFF.XMath.min(end, this.m_children.size()));
		let selectorFields = this.getSelectorFields();
		for (let i = 0; i < result.size(); i++)
		{
			let dimMember = result.get(i).getDimensionMember();
			for (let k = 0; k < selectorFields.size(); k++)
			{
				if (dimMember.getFieldValue(selectorFields.get(k)) === null)
				{
					return null;
				}
			}
		}
		return result;
	}
	return null;
};
oFF.QValueHelpNode2.prototype.getChildSetState = function()
{
	return this.m_childSetState;
};
oFF.QValueHelpNode2.prototype.getChildren = function()
{
	return this.m_children;
};
oFF.QValueHelpNode2.prototype.getSelectorFields = function()
{
	let dimension = this.getDimension();
	if (dimension.getSelectorFieldLayoutType() === oFF.FieldLayoutType.FIELD_BASED)
	{
		return dimension.getSelectorFields();
	}
	return dimension.getSelectorAttributes().getEffectiveFields(oFF.QContextType.SELECTOR);
};
oFF.QValueHelpNode2.prototype.getSidValue = function()
{
	let dimension = this.getDimension();
	let queryModel = dimension.getQueryModel();
	let modelCapabilities = oFF.notNull(queryModel) ? queryModel.getModelCapabilities() : null;
	if (oFF.notNull(modelCapabilities) && modelCapabilities.supportsSidPresentation())
	{
		let hierarchyNavigationField = dimension.getHierarchyNavigationField();
		if (oFF.notNull(hierarchyNavigationField) && hierarchyNavigationField !== dimension.getHierarchyKeyField() && (hierarchyNavigationField.isFilterableForValueHelpAndReadMode(dimension.getReadMode(oFF.QContextType.SELECTOR))))
		{
			return this.getDimensionMember().getFieldValue(hierarchyNavigationField);
		}
	}
	return null;
};
oFF.QValueHelpNode2.prototype.hasChildren = function()
{
	return oFF.notNull(this.m_children) && !this.m_children.isEmpty();
};
oFF.QValueHelpNode2.prototype.onChildFetchExecuted = function(extResult, resultSetContainer, identifier)
{
	let result = extResult;
	if (extResult.hasErrors())
	{
		this.m_childSetState = oFF.XCollectionUtils.hasElements(this.m_children) ? oFF.ChildSetState.INCOMPLETE : oFF.ChildSetState.INITIAL;
	}
	else if (oFF.notNull(resultSetContainer))
	{
		let offset = resultSetContainer.getOffsetRows() - 1;
		let maxRows = resultSetContainer.getMaxRows();
		let resultList = this.addChildNodes(extResult.getData(), offset);
		result = oFF.ExtResult.create(resultList, extResult);
		this.m_results.put(identifier, result);
		if (!oFF.XCollectionUtils.hasElements(this.m_children))
		{
			this.m_childSetState = oFF.ChildSetState.NONE;
		}
		else if (this.m_childSetState !== oFF.ChildSetState.COMPLETE && (offset > 0 || maxRows > 0) && (maxRows < 0 || resultList.size() >= maxRows))
		{
			this.m_childSetState = oFF.ChildSetState.INCOMPLETE;
		}
		else
		{
			this.m_childSetState = oFF.ChildSetState.COMPLETE;
		}
	}
	let customListener = this.m_listeners.getByKey(identifier);
	if (oFF.notNull(customListener))
	{
		customListener.onValuehelpExecuted(result, resultSetContainer, this.m_customIdentifiers.getByKey(identifier));
	}
};
oFF.QValueHelpNode2.prototype.onParentFetchExecuted = function(extResult, resultSetContainer, identifier)
{
	if (extResult.isValid())
	{
		let nodes = extResult.getData();
		let size = nodes.size();
		for (let i = 1; i < size; i++)
		{
			let node = nodes.get(i);
			if (oFF.XString.isEqual(node.getName(), this.getName()))
			{
				this.cleanParentFetchResult(node, this);
				break;
			}
		}
	}
	this.callListenerForParentFetch(extResult, resultSetContainer, identifier);
};
oFF.QValueHelpNode2.prototype.onValuehelpExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (oFF.notNull(customIdentifier))
	{
		let identifier = customIdentifier.getString();
		if (oFF.XString.startsWith(identifier, oFF.QValueHelpNode2.CHILD_FETCH_IDENTIFIER_PREFIX))
		{
			this.onChildFetchExecuted(extResult, resultSetContainer, identifier);
		}
		else if (oFF.XString.startsWith(identifier, oFF.QValueHelpNode2.PARENT_FETCH_IDENTIFIER_PREFIX))
		{
			this.onParentFetchExecuted(extResult, resultSetContainer, identifier);
		}
		this.m_listeners.remove(identifier);
		this.m_customIdentifiers.remove(identifier);
	}
};
oFF.QValueHelpNode2.prototype.processChildFetchInternal = function(syncType, listener, customIdentifier, variableName, variable)
{
	let identifier = oFF.XStringValue.create(this.createIdentifier(listener, customIdentifier, oFF.QValueHelpNode2.CHILD_FETCH_IDENTIFIER_PREFIX));
	let dimension = this.getDimension();
	if (dimension.isSelectorHierarchyActive())
	{
		let pagingStart = dimension.getSelectorPagingStart();
		let pagingEnd = dimension.getSelectorPagingEnd();
		let childNodes = this.getChildNodes(pagingStart, pagingEnd);
		if (oFF.notNull(childNodes))
		{
			let result = oFF.ExtResult.create(childNodes, null);
			this.onValuehelpExecuted(result, null, identifier);
			return result;
		}
		let selectorHierarchyNode = dimension.getSelectorHierarchyNode();
		let initialDrillLevel = dimension.getInitialDrillLevel();
		let sidValue = this.getSidValue();
		if (oFF.notNull(sidValue))
		{
			dimension.setSelectorHierarchyWithNodeSid(sidValue.getString(), this.getName());
		}
		else
		{
			dimension.setSelectorHierarchyNode(this);
		}
		dimension.setSelectorInitialDrillLevel(1);
		dimension.setSelectorLowerLevelNodeAlignment(oFF.Alignment.CHILDREN_BELOW_PARENT);
		dimension.setSelectorPaging(pagingStart + 1, pagingEnd !== -1 ? pagingEnd + 1 : pagingEnd);
		let valueHelpResult;
		if (oFF.notNull(variable))
		{
			valueHelpResult = dimension.processVarHelpWithVariable(variable, syncType, this, identifier);
		}
		else if (oFF.notNull(variableName))
		{
			valueHelpResult = dimension.processVarHelp(variableName, syncType, this, identifier);
		}
		else
		{
			valueHelpResult = dimension.processValueHelp(syncType, this, identifier);
		}
		dimension.setSelectorPaging(pagingStart, pagingEnd);
		dimension.setSelectorHierarchyNode(selectorHierarchyNode);
		dimension.setSelectorInitialDrillLevel(initialDrillLevel);
		return this.m_results.containsKey(identifier.getString()) ? this.m_results.remove(identifier.getString()) : valueHelpResult;
	}
	let errorResult = oFF.ExtResult.createWithErrorMessage("No hierarchy active for value help");
	this.onValuehelpExecuted(errorResult, null, identifier);
	return errorResult;
};
oFF.QValueHelpNode2.prototype.processParentFetchInternal = function(syncType, listener, customIdentifier, variableName)
{
	let identifier = this.createIdentifier(listener, customIdentifier, oFF.QValueHelpNode2.PARENT_FETCH_IDENTIFIER_PREFIX);
	if (this.getParentNode() !== null)
	{
		this.callListenerForParentFetch(null, null, identifier);
		return oFF.ExtResult.create(this.getParentNode(), null);
	}
	let dimension = this.getDimension();
	if (!dimension.isSelectorHierarchyActive())
	{
		return oFF.ExtResult.createWithErrorMessage("No hierarchy active for value help");
	}
	dimension.setSelectorHierarchyNode(this);
	dimension.setSelectorInitialDrillLevel(0);
	dimension.setSelectorPagingStart(0);
	let valuehelpFilter = dimension.getQueryModel().getFilter().getValuehelpFilter();
	let dimFilter = valuehelpFilter.getCartesianProduct().getCartesianList(dimension);
	dimFilter.setConvertToFlatFilter(true);
	let result;
	if (oFF.notNull(variableName))
	{
		result = dimension.processVarHelp(variableName, syncType, this, oFF.XStringValue.create(identifier));
	}
	else
	{
		result = dimension.processValueHelp(syncType, this, oFF.XStringValue.create(identifier));
	}
	return oFF.ExtResult.create(this.getParentNode(), result);
};
oFF.QValueHelpNode2.prototype.processValueHelpChildFetch = function(syncType, listener, customIdentifier)
{
	return this.processChildFetchInternal(syncType, listener, customIdentifier, null, null);
};
oFF.QValueHelpNode2.prototype.processValueHelpParentFetch = function(syncType, listener, customIdentifier)
{
	return this.processParentFetchInternal(syncType, listener, customIdentifier, null);
};
oFF.QValueHelpNode2.prototype.processVarHelpChildFetch = function(variableName, syncType, listener, customIdentifier)
{
	return this.processChildFetchInternal(syncType, listener, customIdentifier, variableName, null);
};
oFF.QValueHelpNode2.prototype.processVarHelpChildFetchWithVariable = function(variable, syncType, listener, customIdentifier)
{
	return this.processChildFetchInternal(syncType, listener, customIdentifier, variable.getName(), variable);
};
oFF.QValueHelpNode2.prototype.processVarHelpParentFetch = function(variableName, syncType, listener, customIdentifier)
{
	return this.processParentFetchInternal(syncType, listener, customIdentifier, variableName);
};
oFF.QValueHelpNode2.prototype.releaseObject = function()
{
	oFF.RsAxisTupleElement.prototype.releaseObject.call( this );
	this.m_children = oFF.XObjectExt.release(this.m_children);
	this.m_childSetState = null;
	this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
	this.m_customIdentifiers = oFF.XObjectExt.release(this.m_customIdentifiers);
	this.m_results = oFF.XObjectExt.release(this.m_results);
};
oFF.QValueHelpNode2.prototype.removeChildNode = function(childNode)
{
	if (oFF.notNull(childNode) && oFF.notNull(this.m_children))
	{
		this.m_children.removeElement(childNode);
	}
};
oFF.QValueHelpNode2.prototype.setupValueHelpNode = function(name, member, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState)
{
	oFF.RsAxisTupleElement.prototype.setupExt.call( this , null, name, member, -1, drillState, displayLevel, childCount, absoluteLevel, isCorrectDrillState);
	if (drillState === oFF.DrillState.LEAF)
	{
		this.m_childSetState = oFF.ChildSetState.NONE;
	}
	else
	{
		this.m_childSetState = oFF.ChildSetState.INITIAL;
		this.m_children = oFF.XList.create();
	}
	this.m_listeners = oFF.XHashMapByString.create();
	this.m_customIdentifiers = oFF.XHashMapByString.create();
	this.m_results = oFF.XHashMapByString.create();
	this.valueHelpIdentifier = 0;
};

oFF.QValueHelpSplitterNode = function() {};
oFF.QValueHelpSplitterNode.prototype = new oFF.QValueHelpNode();
oFF.QValueHelpSplitterNode.prototype._ff_c = "QValueHelpSplitterNode";

oFF.QValueHelpSplitterNode.createSplitterNode = function(valueHelp, parentNode, displayLevel, startIndex, splittingSize, absoluteLevel)
{
	let newObj = new oFF.QValueHelpSplitterNode();
	newObj.setupSplitterNode(valueHelp, parentNode, displayLevel, startIndex, splittingSize, absoluteLevel);
	return newObj;
};
oFF.QValueHelpSplitterNode.prototype.m_startIndex = 0;
oFF.QValueHelpSplitterNode.prototype.getFirstText = function()
{
	if (oFF.notNull(this.m_children))
	{
		let size = this.m_children.size();
		if (size > 0)
		{
			let first = this.m_children.get(0);
			return first.getFirstText();
		}
	}
	return null;
};
oFF.QValueHelpSplitterNode.prototype.getLastText = function()
{
	if (oFF.notNull(this.m_children))
	{
		let size = this.m_children.size();
		if (size > 1)
		{
			let first = this.m_children.get(size - 1);
			return first.getLastText();
		}
	}
	return null;
};
oFF.QValueHelpSplitterNode.prototype.getMemberType = function()
{
	return oFF.MemberType.VALUE_HELP_SPLITTER_NODE;
};
oFF.QValueHelpSplitterNode.prototype.getName = function()
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append("[#");
	let startIndex = this.getStartIndex();
	buffer.appendInt(startIndex);
	if (this.m_childSetState !== oFF.ChildSetState.INITIAL)
	{
		let endIndex = this.getEndIndex();
		if (endIndex !== startIndex)
		{
			buffer.append("...");
			buffer.append("#");
			buffer.appendInt(endIndex);
		}
	}
	else
	{
		buffer.append("...");
	}
	buffer.append("]");
	let firstText = this.getFirstText();
	if (oFF.notNull(firstText))
	{
		buffer.append(" ");
		buffer.append(firstText);
		let lastText = this.getLastText();
		if (oFF.notNull(lastText))
		{
			buffer.append(" ... ");
			buffer.append(lastText);
		}
	}
	return buffer.toString();
};
oFF.QValueHelpSplitterNode.prototype.getStartIndex = function()
{
	return this.m_startIndex;
};
oFF.QValueHelpSplitterNode.prototype.processValueHelpFetch = function(syncType, listener, customIdentifier)
{
	let parentNode = this.getParentNode();
	let type = parentNode.getMemberType();
	oFF.XBooleanUtils.checkFalse(type === oFF.MemberType.VALUE_HELP_SPLITTER_NODE, "Cannot execute child fetch");
	let processNode = parentNode;
	return processNode.processValueHelpFetch(syncType, listener, customIdentifier);
};
oFF.QValueHelpSplitterNode.prototype.setupSplitterNode = function(valueHelp, parentNode, displayLevel, startIndex, splittingSize, absoluteLevel)
{
	oFF.QValueHelpNode.prototype.setupNode.call( this , valueHelp, parentNode, null, displayLevel, splittingSize, absoluteLevel);
	this.m_startIndex = startIndex;
};

oFF.RsDefFieldList = function() {};
oFF.RsDefFieldList.prototype = new oFF.RsDefModelComponent();
oFF.RsDefFieldList.prototype._ff_c = "RsDefFieldList";

oFF.RsDefFieldList.create = function()
{
	let newObj = new oFF.RsDefFieldList();
	newObj.m_fields = oFF.XLinkedMap.createLinkedMap();
	return newObj;
};
oFF.RsDefFieldList.prototype.m_fields = null;
oFF.RsDefFieldList.prototype._notifyNodeChanged = oFF.noSupport;
oFF.RsDefFieldList.prototype.add = function(element)
{
	this.m_fields.add(element);
};
oFF.RsDefFieldList.prototype.addAll = function(other)
{
	this.m_fields.addAll(other);
};
oFF.RsDefFieldList.prototype.addKeyRef = oFF.noSupport;
oFF.RsDefFieldList.prototype.clear = function()
{
	this.m_fields.clear();
};
oFF.RsDefFieldList.prototype.contains = function(element)
{
	return this.m_fields.contains(element);
};
oFF.RsDefFieldList.prototype.containsKey = function(key)
{
	return this.m_fields.containsKey(key);
};
oFF.RsDefFieldList.prototype.createArrayCopy = function()
{
	return this.m_fields.createArrayCopy();
};
oFF.RsDefFieldList.prototype.createListCopy = function()
{
	return this.m_fields.createListCopy();
};
oFF.RsDefFieldList.prototype.createMapByStringCopy = function()
{
	return this.m_fields.createMapByStringCopy();
};
oFF.RsDefFieldList.prototype.get = function(index)
{
	return this.m_fields.get(index);
};
oFF.RsDefFieldList.prototype.getByKey = function(key)
{
	return this.m_fields.getByKey(key);
};
oFF.RsDefFieldList.prototype.getFieldAt = function(index)
{
	return this.m_fields.get(index);
};
oFF.RsDefFieldList.prototype.getFieldByName = function(name)
{
	return this.m_fields.getByKey(name);
};
oFF.RsDefFieldList.prototype.getFieldByNameOrAlias = oFF.noSupport;
oFF.RsDefFieldList.prototype.getFirstFieldByType = oFF.noSupport;
oFF.RsDefFieldList.prototype.getIndex = function(element)
{
	return this.m_fields.getIndex(element);
};
oFF.RsDefFieldList.prototype.getIterator = function()
{
	return this.m_fields.getIterator();
};
oFF.RsDefFieldList.prototype.getKeysAsIterator = function()
{
	return this.m_fields.getKeysAsIterator();
};
oFF.RsDefFieldList.prototype.getKeysAsReadOnlyList = function()
{
	return this.m_fields.getKeysAsReadOnlyList();
};
oFF.RsDefFieldList.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_fields;
};
oFF.RsDefFieldList.prototype.hasElements = function()
{
	return this.m_fields.hasElements();
};
oFF.RsDefFieldList.prototype.insert = function(index, element)
{
	this.m_fields.insert(index, element);
};
oFF.RsDefFieldList.prototype.insertKeyRef = oFF.noSupport;
oFF.RsDefFieldList.prototype.isEmpty = function()
{
	return this.m_fields.isEmpty();
};
oFF.RsDefFieldList.prototype.isFixed = oFF.noSupport;
oFF.RsDefFieldList.prototype.moveElement = function(fromIndex, toIndex)
{
	this.m_fields.moveElement(fromIndex, toIndex);
};
oFF.RsDefFieldList.prototype.releaseObject = function()
{
	this.m_fields = null;
	oFF.RsDefModelComponent.prototype.releaseObject.call( this );
};
oFF.RsDefFieldList.prototype.removeAt = function(index)
{
	return this.m_fields.removeAt(index);
};
oFF.RsDefFieldList.prototype.removeElement = function(element)
{
	return this.m_fields.removeElement(element);
};
oFF.RsDefFieldList.prototype.removeFieldAt = function(index)
{
	this.m_fields.removeAt(index);
};
oFF.RsDefFieldList.prototype.removeKeyRef = oFF.noSupport;
oFF.RsDefFieldList.prototype.set = function(index, element)
{
	this.m_fields.set(index, element);
};
oFF.RsDefFieldList.prototype.size = function()
{
	return this.m_fields.size();
};
oFF.RsDefFieldList.prototype.sortByComparator = function(comparator)
{
	this.m_fields.sortByComparator(comparator);
};
oFF.RsDefFieldList.prototype.sortByDirection = function(sortDirection)
{
	this.m_fields.sortByDirection(sortDirection);
};
oFF.RsDefFieldList.prototype.sublist = function(beginIndex, endIndex)
{
	return this.m_fields.sublist(beginIndex, endIndex);
};

oFF.QMeasureHelpNode = function() {};
oFF.QMeasureHelpNode.prototype = new oFF.QValueHelpNode2();
oFF.QMeasureHelpNode.prototype._ff_c = "QMeasureHelpNode";

oFF.QMeasureHelpNode.createMeasureHelpNode = function(name, measure, drillState)
{
	if (!measure.getOlapComponentType().isTypeOf(oFF.MemberType.MEASURE))
	{
		throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate3("Invalid member type for measure value help node: ", measure.getOlapComponentType().getName(), "."));
	}
	let node = new oFF.QMeasureHelpNode();
	let isCorrectDrillState = measure.getContext().getSession().hasFeature(oFF.FeatureToggleOlap.CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET);
	node.setupValueHelpNode(name, measure, drillState, 0, -1, -1, isCorrectDrillState);
	return node;
};
oFF.QMeasureHelpNode.prototype.getDataType = function()
{
	return this.getDimensionMember().getDataType();
};
oFF.QMeasureHelpNode.prototype.getDataTypeInternal = function()
{
	return this.getDimensionMember().getDataTypeInternal();
};
oFF.QMeasureHelpNode.prototype.getDataTypePrecision = function()
{
	return this.getDimensionMember().getDataTypePrecision();
};
oFF.QMeasureHelpNode.prototype.getDataTypeScale = function()
{
	return this.getDimensionMember().getDataTypeScale();
};
oFF.QMeasureHelpNode.prototype.getMeasureType = function()
{
	return this.getDimensionMember().getMemberType();
};
oFF.QMeasureHelpNode.prototype.getNumericPrecision = function()
{
	return this.getDimensionMember().getNumericPrecision();
};
oFF.QMeasureHelpNode.prototype.getNumericScale = function()
{
	return this.getDimensionMember().getNumericScale();
};
oFF.QMeasureHelpNode.prototype.getNumericShift = function()
{
	return this.getDimensionMember().getNumericShift();
};
oFF.QMeasureHelpNode.prototype.getRateType = function()
{
	return this.getDimensionMember().getRateType();
};
oFF.QMeasureHelpNode.prototype.getUnitDimensionName = function()
{
	return this.getDimensionMember().getUnitDimensionName();
};
oFF.QMeasureHelpNode.prototype.getUnitDimensionProperty = function()
{
	return this.getDimensionMember().getUnitDimensionProperty();
};
oFF.QMeasureHelpNode.prototype.getUnitFixed = function()
{
	return this.getDimensionMember().getUnitFixed();
};
oFF.QMeasureHelpNode.prototype.getUnitName = function()
{
	return this.getDimensionMember().getUnitName();
};
oFF.QMeasureHelpNode.prototype.getUnitTextName = function()
{
	return this.getDimensionMember().getUnitTextName();
};
oFF.QMeasureHelpNode.prototype.getUnitType = function()
{
	return this.getDimensionMember().getUnitType();
};

oFF.ResultsetModule = function() {};
oFF.ResultsetModule.prototype = new oFF.DfModule();
oFF.ResultsetModule.prototype._ff_c = "ResultsetModule";

oFF.ResultsetModule.s_module = null;
oFF.ResultsetModule.getInstance = function()
{
	if (oFF.isNull(oFF.ResultsetModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapApiModule.getInstance());
		oFF.ResultsetModule.s_module = oFF.DfModule.startExt(new oFF.ResultsetModule());
		oFF.RsPagingType.staticSetup();
		oFF.DfModule.stopExt(oFF.ResultsetModule.s_module);
	}
	return oFF.ResultsetModule.s_module;
};
oFF.ResultsetModule.prototype.getName = function()
{
	return "ff4250.olap.resultset";
};

oFF.ResultsetModule.getInstance();

return oFF;
} );