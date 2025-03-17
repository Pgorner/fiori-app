/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2200.ui","sap/sac/df/firefly/ff4305.olap.model"
],
function(oFF)
{
"use strict";

oFF.FeConfigurationFactory = {

	create:function(dataProvider)
	{
			let datasourceType = dataProvider.getDatasourceType();
		let structureType = dataProvider.getStructureType();
		if (datasourceType.isEqualTo(oFF.FeDatasourceType.BW))
		{
			return oFF.FeConfigurationBW.create(structureType, dataProvider.getStructureDisplayName());
		}
		return oFF.FeConfiguration.create(structureType, dataProvider.getStructureDisplayName());
	}
};

oFF.FeConfigurationAccountMember = function() {};
oFF.FeConfigurationAccountMember.prototype = new oFF.XObject();
oFF.FeConfigurationAccountMember.prototype._ff_c = "FeConfigurationAccountMember";

oFF.FeConfigurationAccountMember.create = function()
{
	return new oFF.FeConfigurationAccountMember();
};
oFF.FeConfigurationAccountMember.prototype.getMeasureNotExistsError = function(memberName)
{
	return oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_ACCOUNT, memberName);
};
oFF.FeConfigurationAccountMember.prototype.getStructureMemberName = function()
{
	return oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_ACCOUNT_DATA_TYPE);
};
oFF.FeConfigurationAccountMember.prototype.getStructureName = function()
{
	return oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_ACCOUNTS);
};

oFF.FeConfigurationMeasure = function() {};
oFF.FeConfigurationMeasure.prototype = new oFF.XObject();
oFF.FeConfigurationMeasure.prototype._ff_c = "FeConfigurationMeasure";

oFF.FeConfigurationMeasure.create = function()
{
	return new oFF.FeConfigurationMeasure();
};
oFF.FeConfigurationMeasure.prototype.getMeasureNotExistsError = function(memberName)
{
	return oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_MEASURE, memberName);
};
oFF.FeConfigurationMeasure.prototype.getStructureMemberName = function()
{
	return oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_MEASURE_DATA_TYPE);
};
oFF.FeConfigurationMeasure.prototype.getStructureName = function()
{
	return oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_MEASURES);
};

oFF.FeConfigurationStructureFactory = {

	create:function(structureType, structureDisplayName)
	{
			if (structureType.isEqualTo(oFF.FeStructureType.ACCOUNT))
		{
			return oFF.FeConfigurationAccountMember.create();
		}
		if (structureType.isEqualTo(oFF.FeStructureType.STRUCTURE))
		{
			return oFF.FeConfigurationStructureMember.create(structureDisplayName);
		}
		return oFF.FeConfigurationMeasure.create();
	}
};

oFF.FeConfigurationStructureMember = function() {};
oFF.FeConfigurationStructureMember.prototype = new oFF.XObject();
oFF.FeConfigurationStructureMember.prototype._ff_c = "FeConfigurationStructureMember";

oFF.FeConfigurationStructureMember.create = function(structureDisplayName)
{
	let instance = new oFF.FeConfigurationStructureMember();
	instance.m_structureDisplayName = structureDisplayName;
	return instance;
};
oFF.FeConfigurationStructureMember.prototype.m_structureDisplayName = null;
oFF.FeConfigurationStructureMember.prototype.getMeasureNotExistsError = function(memberName)
{
	return oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_STRUCTURE, memberName);
};
oFF.FeConfigurationStructureMember.prototype.getStructureMemberName = function()
{
	return oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_STRUCTURE_DATA_TYPE);
};
oFF.FeConfigurationStructureMember.prototype.getStructureName = function()
{
	return oFF.notNull(this.m_structureDisplayName) ? this.m_structureDisplayName : oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_STRUCTURES);
};
oFF.FeConfigurationStructureMember.prototype.releaseObject = function()
{
	this.m_structureDisplayName = null;
};

oFF.FeDimensionBuilder = function() {};
oFF.FeDimensionBuilder.prototype = new oFF.XObject();
oFF.FeDimensionBuilder.prototype._ff_c = "FeDimensionBuilder";

oFF.FeDimensionBuilder.create = function()
{
	let instance = new oFF.FeDimensionBuilder();
	instance.m_hierarchies = oFF.XList.create();
	instance.m_properties = oFF.XList.create();
	instance.m_dimensionType = oFF.FeDimensionType.UNKNOWN;
	return instance;
};
oFF.FeDimensionBuilder.prototype.m_alias = null;
oFF.FeDimensionBuilder.prototype.m_datasourceName = null;
oFF.FeDimensionBuilder.prototype.m_description = null;
oFF.FeDimensionBuilder.prototype.m_dimensionType = null;
oFF.FeDimensionBuilder.prototype.m_flatKeyField = null;
oFF.FeDimensionBuilder.prototype.m_hierarchies = null;
oFF.FeDimensionBuilder.prototype.m_hierarchyKeyField = null;
oFF.FeDimensionBuilder.prototype.m_identifier = null;
oFF.FeDimensionBuilder.prototype.m_parentId = null;
oFF.FeDimensionBuilder.prototype.m_properties = null;
oFF.FeDimensionBuilder.prototype.build = function()
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(this.m_identifier);
	oFF.XObjectExt.assertNotNull(this.m_flatKeyField);
	return oFF.FeDimension.create(this.m_identifier, this.m_alias, this.m_description, this.m_hierarchies, this.m_properties, this.m_parentId, oFF.isNull(this.m_hierarchyKeyField) ? this.m_flatKeyField : this.m_hierarchyKeyField, this.m_flatKeyField, this.m_dimensionType, this.m_datasourceName);
};
oFF.FeDimensionBuilder.prototype.setAlias = function(alias)
{
	this.m_alias = alias;
	return this;
};
oFF.FeDimensionBuilder.prototype.setDatasourceName = function(datasourceName)
{
	this.m_datasourceName = datasourceName;
	return this;
};
oFF.FeDimensionBuilder.prototype.setDescription = function(description)
{
	this.m_description = description;
	return this;
};
oFF.FeDimensionBuilder.prototype.setDimensionType = function(dimensionType)
{
	this.m_dimensionType = dimensionType;
	return this;
};
oFF.FeDimensionBuilder.prototype.setFlatKeyField = function(flatKeyField)
{
	this.m_flatKeyField = flatKeyField;
	return this;
};
oFF.FeDimensionBuilder.prototype.setHierarchies = function(hierarchies)
{
	this.m_hierarchies = hierarchies.createListCopy();
	return this;
};
oFF.FeDimensionBuilder.prototype.setHierarchyKeyField = function(hierarchyKeyField)
{
	this.m_hierarchyKeyField = hierarchyKeyField;
	return this;
};
oFF.FeDimensionBuilder.prototype.setIdentifier = function(identifier)
{
	this.m_identifier = identifier;
	return this;
};
oFF.FeDimensionBuilder.prototype.setParentId = function(parentId)
{
	this.m_parentId = parentId;
	return this;
};
oFF.FeDimensionBuilder.prototype.setProperties = function(properties)
{
	this.m_properties = properties.createListCopy();
	return this;
};

oFF.FeConditions = {

	AND:"AND",
	EQUAL:"=",
	GREATER_THAN:">",
	GREATER_THAN_EQUAL:">=",
	LESS_THAN:"<",
	LESS_THAN_EQUAL:"<=",
	NOT_EQUAL:"!=",
	OR:"OR"
};

oFF.FeFunctions = {

	ABS:"ABS",
	CEIL:"CEIL",
	DATEDIFF:"DATEDIFF",
	DECFLOAT:"DECFLOAT",
	DOUBLE:"DOUBLE",
	EXP:"EXP",
	FLOAT:"FLOAT",
	FLOOR:"FLOOR",
	GRAND_TOTAL:"GRANDTOTAL",
	IF:"IF",
	INT:"INT",
	ISNULL:"ISNULL",
	LOG:"LOG",
	LOG10:"LOG10",
	MAX:"MAX",
	MIN:"MIN",
	MOD:"MOD",
	NOT:"NOT",
	PERCENTAGE_OF_GRAND_TOTAL:"%GRANDTOTAL",
	PERCENTAGE_OF_SUB_TOTAL:"%SUBTOTAL",
	POWER:"POWER",
	RESTRICT:"RESTRICT",
	RESULT_LOOKUP:"RESULTLOOKUP",
	ROUND:"ROUND",
	SQRT:"SQRT",
	SUB_TOTAL:"SUBTOTAL",
	TRUNC:"TRUNC"
};

oFF.FeOperators = {

	ADDITION:"+",
	DIVISION:"/",
	MULTIPLICATION:"*",
	POWER:"**",
	SUBTRACTION:"-"
};

oFF.FeAbstractDatasourceMetadataProvider = function() {};
oFF.FeAbstractDatasourceMetadataProvider.prototype = new oFF.XObject();
oFF.FeAbstractDatasourceMetadataProvider.prototype._ff_c = "FeAbstractDatasourceMetadataProvider";

oFF.FeAbstractDatasourceMetadataProvider.prototype.m_measures = null;
oFF.FeAbstractDatasourceMetadataProvider.prototype.m_queryModel = null;
oFF.FeAbstractDatasourceMetadataProvider.prototype.m_structure = null;
oFF.FeAbstractDatasourceMetadataProvider.prototype.m_structureMembersHierarchyNodes = null;
oFF.FeAbstractDatasourceMetadataProvider.prototype.createFeDimension = function(dimension, parentDimension)
{
	let feDimension = null;
	let groupInfoParent = oFF.isNull(parentDimension) ? null : parentDimension.generateUniqueKey();
	if (this.isDimensionValid(dimension))
	{
		let keyFieldPropertyGenerator = oFF.FeKeyFieldPropertyGenerator.create(this.m_queryModel);
		feDimension = oFF.FeDimensionBuilder.create().setIdentifier(dimension.getName()).setAlias(dimension.getDisplayName()).setDescription(dimension.getDisplayDescription()).setHierarchies(this.getHierarchies(dimension)).setProperties(this.getProperties(dimension)).setParentId(groupInfoParent).setFlatKeyField(keyFieldPropertyGenerator.createFlatKeyProperty(dimension)).setHierarchyKeyField(keyFieldPropertyGenerator.createHierarchyKeyProperty(dimension).orElse(null)).setDimensionType(this.getDimensionType(dimension.getName())).setDatasourceName(this.getDatasourceName(dimension)).build();
		if (oFF.notNull(parentDimension))
		{
			let feProperty = parentDimension.getPropertyById(feDimension.getId());
			if (feProperty.isPresent())
			{
				feDimension = oFF.FeDimension.createWithSelectedProperty(parentDimension, feProperty.get().getAlias());
			}
		}
	}
	return oFF.XOptional.ofNullable(feDimension);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.createFeMeasure = function(member)
{
	let feResultVisibility = oFF.FeResultVisibility.createFrom(member.getResultVisibility());
	let measureName = member.getName();
	let measureDescription = this.getMemberDescription(member);
	let measureAlias = this.getMemberAlias(member);
	let structureDimensionName = this.m_structure.getName();
	let datasourceName = this.getDatasourceName(member);
	if (member.getMemberType().isTypeOf(oFF.MemberType.FORMULA))
	{
		let formulaMeasure = member;
		if (formulaMeasure.getFormulaText().isPresent() && formulaMeasure.isEditable())
		{
			return oFF.FeFormulaMeasure.createWithAlias(measureName, measureDescription, measureAlias, formulaMeasure.getFormulaText().get(), oFF.FeValueType.createFromStructureMember(formulaMeasure, false), feResultVisibility, structureDimensionName, datasourceName);
		}
	}
	return oFF.FeMeasure.createWithAliasAndParent(measureName, measureDescription, measureAlias, oFF.FeValueType.createFromStructureMember(member, true), feResultVisibility, this.getStructureMemberParentId(member), structureDimensionName, datasourceName);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllDimensions = function()
{
	let dimensionGroupInfo = oFF.QDimensionUtil.getDimensionGroupInfoFilteredWithoutStructures(this.m_queryModel.getQueryManager());
	return this.getAllDimensionsRecursive(dimensionGroupInfo, null);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllDimensionsRecursive = function(groupInfos, parentDimension)
{
	let dimensions = oFF.XList.create();
	let groupInfoParent = oFF.isNull(parentDimension) ? null : parentDimension.generateUniqueKey();
	for (let i = 0; i < groupInfos.size(); i++)
	{
		let feDimension = null;
		let groupInfo = groupInfos.get(i);
		if (groupInfo.isDimension())
		{
			let dim = this.m_queryModel.getDimensionByName(groupInfo.getInternalName());
			feDimension = this.createFeDimension(dim, parentDimension).orElse(null);
		}
		else
		{
			let datasourceName = this.getDatasourceNameFromDimensionGroupInfo(groupInfo);
			feDimension = oFF.FeDimension.createVirtual(groupInfo.getDisplayName(), groupInfo.getDisplayText(), groupInfoParent, datasourceName);
		}
		if (oFF.notNull(feDimension))
		{
			dimensions.add(feDimension);
			dimensions.addAll(this.getAllDimensionsRecursive(groupInfo.getChildren(), feDimension));
		}
	}
	return dimensions;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllEditableCalculations = function()
{
	return oFF.XStream.of(this.getAllMeasures()).filter((m) => {
		return oFF.FeFormulaMeasure.cast(m).isPresent();
	}).map((m1) => {
		return oFF.FeFormulaMeasure.cast(m1).get();
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllMeasures = function()
{
	if (oFF.isNull(this.m_measures))
	{
		this.m_measures = oFF.XStream.of(this.getStructureMembers()).map((m) => {
			return this.createFeMeasure(this.m_structure.getStructureMember(m.getName()));
		}).collect(oFF.XStreamCollector.toList());
	}
	return this.m_measures;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllMemberIds = function()
{
	let primary = this.m_queryModel.getPrimaryCalculationDimension();
	let secondary = this.m_queryModel.getSecondaryCalculationDimension();
	let structureToBeAdded = null;
	if (primary === this.m_structure)
	{
		structureToBeAdded = secondary;
	}
	else if (secondary === this.m_structure)
	{
		structureToBeAdded = primary;
	}
	let allMeasureNames = oFF.XList.create();
	oFF.XStream.of(this.getAllMeasures()).forEach((measure) => {
		allMeasureNames.add(measure.getAlias());
	});
	if (oFF.notNull(structureToBeAdded))
	{
		allMeasureNames.addAll(this.getAllMemberIdsFromStructure(structureToBeAdded));
	}
	return allMeasureNames;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getAllMemberIdsFromStructure = function(structure)
{
	return oFF.XStream.of(structure.getAllStructureMembers()).mapToString((m) => {
		return m.getDimension().getDimensionType().isTypeOf(oFF.DimensionType.ACCOUNT) ? m.getStorageObjectName() : m.getName();
	}).collect(oFF.XStreamCollector.toListOfString((m2) => {
		return m2.getStringRepresentation();
	}));
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDatasourceName = function(dsCtx)
{
	let dSName = this.m_queryModel.getDatasetUIName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dSName))
	{
		return dSName;
	}
	return dsCtx.getDataSource().getDisplayName();
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDatasourceNameFromDimensionGroupInfo = function(groupInfo)
{
	let groupInfoChildren = groupInfo.getChildren();
	if (!groupInfoChildren.isEmpty())
	{
		let firstChildName = groupInfoChildren.get(0).getDisplayName();
		let dimension = this.m_queryModel.getDimensionByName(firstChildName);
		if (oFF.notNull(dimension))
		{
			return this.getDatasourceName(dimension);
		}
	}
	return null;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDatasourceType = function()
{
	if (this.m_queryModel.getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		return oFF.FeDatasourceType.BW;
	}
	return oFF.FeDatasourceType.HANA;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDependantMemberIds = function(memberName)
{
	let dependantMemberIdsSet = this.getDependantMemberIdsSet(memberName, oFF.XHashSetOfString.create());
	dependantMemberIdsSet.removeElement(memberName);
	return dependantMemberIdsSet.getValuesAsReadOnlyList();
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDependantMemberIdsSet = function(memberName, recursiveStack)
{
	if (recursiveStack.contains(memberName))
	{
		return recursiveStack;
	}
	recursiveStack.add(memberName);
	let allStructureMembers = this.m_structure.getAllStructureMembers();
	let iterator = allStructureMembers.getIterator();
	while (iterator.hasNext())
	{
		let member = iterator.next();
		if (member.getMemberType().isTypeOf(oFF.MemberType.FORMULA) && oFF.XString.isEqual(member.getName(), memberName))
		{
			let formulaMeasure = member;
			let formulaItemInfo = oFF.FormulaItemUtils.getFieldNamesFromFormula(formulaMeasure.getFormula());
			let topLevelDependentMemberNames = formulaItemInfo.getMemberNames();
			for (let i = 0; i < topLevelDependentMemberNames.size(); i++)
			{
				this.getDependantMemberIdsSet(topLevelDependentMemberNames.get(i), recursiveStack);
			}
			break;
		}
	}
	return recursiveStack;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDimensionType = function(dimensionName)
{
	let dimension = this.m_queryModel.getDimensionByName(dimensionName);
	return oFF.FeDimensionType.createFromDimension(dimension);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getDimensionValueType = function(dimensionName, field)
{
	let dimension = this.m_queryModel.getDimensionByName(dimensionName);
	return oFF.FeValueType.createFromDimension(dimension, field);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getFullPropId = function(field)
{
	return this.m_queryModel.getDimensionByName(field.getName()) !== null ? field.getName() : oFF.XStringUtils.concatenate3(field.getDimension().getName(), ".", field.getName());
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getFunctionNamesUsedInDependentCalculations = function(formulaMeasureName)
{
	let dependantMemberIds = this.getDependantMemberIdsSet(formulaMeasureName, oFF.XHashSetOfString.create()).getValuesAsReadOnlyList();
	return oFF.XStream.ofString(dependantMemberIds).map((memberId) => {
		return oFF.notNull(memberId) ? this.m_structure.getStructureMember(memberId.getString()) : null;
	}).filter((member) => {
		return oFF.notNull(member) && member.getMemberType().isEqualTo(oFF.MemberType.FORMULA);
	}).flatMap((formulaMember) => {
		return oFF.XStream.ofString(oFF.FormulaItemUtils.getFunctionNamesFromFormula(formulaMember.getFormula()));
	}).collect(oFF.XStreamCollector.toSetOfString((functionName) => {
		return functionName.getString();
	}));
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getHierarchies = function(dimension)
{
	if (dimension.getHierarchies() === null || dimension.getHierarchies().getObjects().isEmpty())
	{
		return oFF.XList.create();
	}
	let isDateTimeDimension = dimension.getFlatKeyField() !== null && dimension.getFlatKeyField().getValueType().isDateBased() || oFF.HierarchyLevelType.getHighestDateRangeGranularity(dimension) !== null;
	let defaultHierarchyName = dimension.getDefaultHierarchyName();
	let allHierarchies = oFF.XList.create();
	let hierarchies = oFF.XStream.of(dimension.getHierarchies().getObjects()).filter((h1) => {
		return isDateTimeDimension || !h1.getHierarchyType().isLeveledHierarchy();
	}).map((h2) => {
		return oFF.FeHierarchy.create(h2.getHierarchyName(), h2.getHierarchyName(), h2.getHierarchyDescription(), dimension.getName(), oFF.XString.isEqual(h2.getHierarchyName(), defaultHierarchyName));
	}).collect(oFF.XStreamCollector.toList());
	allHierarchies.add(oFF.FeHierarchy.create(null, oFF.FeHierarchy.FLAT_HIERARCHY, null, dimension.getName(), oFF.XStringUtils.isNullOrEmpty(defaultHierarchyName) || hierarchies.isEmpty()));
	allHierarchies.addAll(hierarchies);
	return allHierarchies;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getKeyFieldName = function(name)
{
	let fieldDimension = this.m_queryModel.getDimensionByName(name);
	return oFF.notNull(fieldDimension) && fieldDimension.getKeyField() !== null ? fieldDimension.getKeyField().getName() : name;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getMeasuresInActiveHierarchy = function()
{
	return oFF.XStream.of(this.getAllMeasures()).filter((feMeasure) => {
		return this.getStructureMembers().containsKey(feMeasure.getId());
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getMemberAlias = function(member)
{
	return null;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getMemberDescription = function(member)
{
	return member.getText();
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getPropAlias = function(field)
{
	let fullPropId = this.getFullPropId(field);
	let propPrefix = oFF.XStringUtils.concatenate2(field.getDimension().getDisplayName(), ".");
	return oFF.XString.indexOf(fullPropId, propPrefix) === 0 ? oFF.XString.substring(fullPropId, oFF.XString.size(field.getDimension().getDisplayName()) + 1, -1) : fullPropId;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getProperties = function(dimension)
{
	if (dimension.getFields() === null || dimension.getFields().isEmpty())
	{
		return oFF.XList.create();
	}
	return oFF.XStream.of(dimension.getFields().getValuesAsReadOnlyList()).filter(this.isFieldValid.bind(this)).map((f2) => {
		return oFF.FeProperty.create(this.getFullPropId(f2), this.getPropAlias(f2), f2.getText(), dimension.getName(), this.getKeyFieldName(this.getFullPropId(f2)), this.getDimensionValueType(this.getFullPropId(f2), f2));
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getStructureDisplayName = function()
{
	let text = this.m_structure.getOriginalText();
	if (this.m_queryModel.getProcess().hasFeature(oFF.FeatureToggleOlap.USE_ORIGINAL_STRUCTURE_TEXT_IN_UI) && oFF.XStringUtils.isNotNullAndNotEmpty(text))
	{
		return text;
	}
	return null;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getStructureMemberParentId = function(member)
{
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.HIERARCHICAL_OBJECTS))
	{
		let structMember = this.getStructureMembers().getByKey(member.getName());
		if (oFF.notNull(structMember) && structMember.getParentNode() !== null)
		{
			let parentNode = structMember.getParentNode();
			let parentMember = this.m_structure.getStructureMember(parentNode.getName());
			return this.getMemberAlias(parentMember);
		}
	}
	return null;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getStructureMembers = function()
{
	if (oFF.isNull(this.m_structureMembersHierarchyNodes))
	{
		throw oFF.XException.createRuntimeException("[FeAbstractDatasourceMetadataProvider] Structure members accessed before they were loaded");
	}
	return this.m_structureMembersHierarchyNodes;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.getStructureType = function()
{
	if (this.m_structure.getDimensionType().isTypeOf(oFF.DimensionType.ACCOUNT))
	{
		return oFF.FeStructureType.ACCOUNT;
	}
	return oFF.FeStructureType.MEASURE;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.isDimensionValid = function(dimension)
{
	return !oFF.QDimensionUtil.isStructureLike(dimension) && !oFF.QDimensionUtil.isAccountType(dimension) && oFF.QDimensionUtil.shouldDimensionBeShownForRowsOrColumns(dimension, true);
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.isFieldValid = function(field)
{
	return oFF.notNull(field) && field.getAttribute() !== null && field.getAttribute().getKeyField() !== null && !field.getAttribute().getKeyField().isNamePathField() && !field.getAttribute().getKeyField().isHierarchyPathField() && this.isValidVersionAttribute(field) && this.m_queryModel.getDimensionByName(this.getFullPropId(field)) !== null;
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.isValidVersionAttribute = function(field)
{
	if (!field.getDimensionMetadata().getDimensionType().isTypeOf(oFF.DimensionType.GENERAL_VERSION))
	{
		return true;
	}
	let INVALID_VERSION_ATTRIBUTES = oFF.XList.create();
	INVALID_VERSION_ATTRIBUTES.add("USER");
	INVALID_VERSION_ATTRIBUTES.add("SOURCE_VERSION");
	INVALID_VERSION_ATTRIBUTES.add("RATE_VERSION");
	INVALID_VERSION_ATTRIBUTES.add("CURRENCY_CONVERSION_CATEGORY");
	return !oFF.XCollectionUtils.contains(INVALID_VERSION_ATTRIBUTES, (attribute) => {
		return oFF.XString.isEqual(attribute, this.getPropAlias(field));
	});
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.setupCommon = function(queryModel, structure)
{
	this.m_queryModel = oFF.XObjectExt.assertNotNull(queryModel);
	this.m_structure = oFF.XObjectExt.assertNotNull(structure);
	let membersPromise = structure.getMemberManager().getMembers();
	membersPromise.onThen((membersHierarchyNodes) => {
		this.m_structureMembersHierarchyNodes = membersHierarchyNodes;
		this.m_measures = oFF.XObjectExt.release(this.m_measures);
	});
};
oFF.FeAbstractDatasourceMetadataProvider.prototype.setupCommonPromise = function(queryModel, structure)
{
	this.m_queryModel = oFF.XObjectExt.assertNotNull(queryModel);
	this.m_structure = oFF.XObjectExt.assertNotNull(structure);
	let membersPromise = structure.getMemberManager().getMembers();
	return membersPromise.onThenExt((membersHierarchyNodes) => {
		this.m_structureMembersHierarchyNodes = membersHierarchyNodes;
		return this;
	});
};

oFF.FeFormulaItemsProvider = function() {};
oFF.FeFormulaItemsProvider.prototype = new oFF.XObject();
oFF.FeFormulaItemsProvider.prototype._ff_c = "FeFormulaItemsProvider";

oFF.FeFormulaItemsProvider.create = function(items)
{
	oFF.XObjectExt.assertNotNull(items);
	oFF.XCollectionUtils.forEach(items, (item) => {
		oFF.XObjectExt.assertNotNull(item);
	});
	let instance = new oFF.FeFormulaItemsProvider();
	instance.m_items = items.createListCopy();
	return instance;
};
oFF.FeFormulaItemsProvider.createNonDeprecatedFormulaItemsProvider = function(formulaItemsProvider)
{
	let nonDeprecatedFunctions = oFF.XStream.of(formulaItemsProvider.getAllFormulaItems()).filter((func) => {
		return !func.isDeprecated();
	}).collect(oFF.XStreamCollector.toList());
	return oFF.FeFormulaItemsProvider.create(nonDeprecatedFunctions);
};
oFF.FeFormulaItemsProvider.prototype.m_items = null;
oFF.FeFormulaItemsProvider.prototype.getAllFormulaItems = function()
{
	return this.m_items;
};
oFF.FeFormulaItemsProvider.prototype.getConditions = function()
{
	return oFF.XStream.of(this.m_items).filter((operator) => {
		return operator.getCategory().isTypeOf(oFF.FeFormulaItemCategory.CONDITIONAL);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsProvider.prototype.getFunctions = function()
{
	return oFF.XStream.of(this.m_items).filter((operator) => {
		return operator.getCategory().isTypeOf(oFF.FeFormulaItemCategory.FUNCTION);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsProvider.prototype.getOperators = function()
{
	return oFF.XStream.of(this.m_items).filter((operator) => {
		return operator.getCategory().isTypeOf(oFF.FeFormulaItemCategory.OPERATOR);
	}).collect(oFF.XStreamCollector.toList());
};

oFF.FeKeyFieldPropertyGenerator = function() {};
oFF.FeKeyFieldPropertyGenerator.prototype = new oFF.XObject();
oFF.FeKeyFieldPropertyGenerator.prototype._ff_c = "FeKeyFieldPropertyGenerator";

oFF.FeKeyFieldPropertyGenerator.create = function(queryModel)
{
	let instance = new oFF.FeKeyFieldPropertyGenerator();
	instance.m_queryModel = queryModel;
	return instance;
};
oFF.FeKeyFieldPropertyGenerator.prototype.m_queryModel = null;
oFF.FeKeyFieldPropertyGenerator.prototype.createFlatKeyProperty = function(dimension)
{
	let name = dimension.getFlatKeyField() !== null ? dimension.getFlatKeyField().getName() : dimension.getName();
	let displayName = dimension.getFlatKeyField() !== null ? dimension.getFlatKeyField().getDisplayName() : dimension.getDisplayName();
	let text = dimension.getFlatKeyField() !== null ? dimension.getFlatKeyField().getDisplayDescription() : dimension.getDisplayDescription();
	let flatKeyFieldName = this.getKeyFieldName(name);
	return oFF.FeProperty.create(name, displayName, text, dimension.getName(), flatKeyFieldName, this.getDimensionValueType(dimension.getName(), dimension.getFlatKeyField()));
};
oFF.FeKeyFieldPropertyGenerator.prototype.createHierarchyKeyProperty = function(dimension)
{
	if (dimension.getHierarchyKeyField() === null)
	{
		return oFF.XOptional.empty();
	}
	let hierarchyKeyField = dimension.getHierarchyKeyField();
	return oFF.XOptional.of(oFF.FeProperty.create(hierarchyKeyField.getName(), hierarchyKeyField.getDisplayName(), hierarchyKeyField.getDisplayDescription(), dimension.getName(), this.getKeyFieldName(hierarchyKeyField.getName()), this.getDimensionValueType(dimension.getName(), dimension.getHierarchyKeyField())));
};
oFF.FeKeyFieldPropertyGenerator.prototype.getDimensionValueType = function(dimensionName, field)
{
	let dimension = this.m_queryModel.getDimensionByName(dimensionName);
	return oFF.FeValueType.createFromDimension(dimension, field);
};
oFF.FeKeyFieldPropertyGenerator.prototype.getKeyFieldName = function(name)
{
	let fieldDimension = this.m_queryModel.getDimensionByName(name);
	return oFF.notNull(fieldDimension) && fieldDimension.getKeyField() !== null ? fieldDimension.getKeyField().getName() : name;
};

oFF.FeCursorHelper = {

	getCursorIndex:function(text, row, column)
	{
			oFF.XObjectExt.assertStringNotNullAndNotEmpty(text);
		oFF.XObjectExt.assertTrue(row >= 0);
		oFF.XObjectExt.assertTrue(column >= 0);
		let cursorPosition = 0;
		for (let i = 0; i < row; i++)
		{
			let indexOfLineBreak = oFF.XString.indexOfFrom(text, "\r\n", cursorPosition);
			let lineBreakLength = 2;
			if (indexOfLineBreak === -1)
			{
				indexOfLineBreak = oFF.XString.indexOfFrom(text, "\n", cursorPosition);
				lineBreakLength = 1;
			}
			if (indexOfLineBreak === -1)
			{
				break;
			}
			cursorPosition = indexOfLineBreak + lineBreakLength;
		}
		return cursorPosition + column;
	},
	getCursorPosition:function(text, cursorIndex)
	{
			oFF.XObjectExt.assertStringNotNullAndNotEmpty(text);
		oFF.XObjectExt.assertTrue(cursorIndex >= 0);
		let row = 0;
		let column = 0;
		let textLength = oFF.XString.size(text);
		for (let i = 0; i < cursorIndex && i < textLength; i++)
		{
			if (oFF.FeCursorHelper.isLineBreak(oFF.XString.substring(text, i, i + 1)))
			{
				if (i !== 0 && !oFF.FeCursorHelper.isLineBreak(oFF.XString.substring(text, i - 1, i)))
				{
					row++;
				}
				column = 0;
			}
			else
			{
				column++;
			}
		}
		return oFF.UiCursorPosition.create(row, column);
	},
	isLineBreak:function(character)
	{
			return oFF.XString.isEqual(character, "\n") || oFF.XString.isEqual(character, "\r");
	}
};

oFF.FeCustomAceOverrides = function() {};
oFF.FeCustomAceOverrides.prototype = new oFF.XObject();
oFF.FeCustomAceOverrides.prototype._ff_c = "FeCustomAceOverrides";

oFF.FeCustomAceOverrides.m_feCustomHighlighter = null;
oFF.FeCustomAceOverrides.create = function()
{
	return new oFF.FeCustomAceOverrides();
};
oFF.FeCustomAceOverrides.getInstance = function()
{
	return oFF.FeCustomAceOverrides.m_feCustomHighlighter;
};
oFF.FeCustomAceOverrides.setInstance = function(customHighlighter)
{
	oFF.FeCustomAceOverrides.m_feCustomHighlighter = customHighlighter;
};
oFF.FeCustomAceOverrides.staticSetup = function()
{
	oFF.FeCustomAceOverrides.m_feCustomHighlighter = new oFF.FeCustomAceOverrides();
};
oFF.FeCustomAceOverrides.prototype.apply = function()
{
	oFF.FeCustomAceOverrides.getInstance().overrideFilteredListSetFilter();
};
oFF.FeCustomAceOverrides.prototype.overrideFilteredListSetFilter = function()
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};
oFF.FeCustomAceOverrides.prototype.reset = function()
{
	oFF.FeCustomAceOverrides.getInstance().resetFilteredListSetFilter();
};
oFF.FeCustomAceOverrides.prototype.resetFilteredListSetFilter = function()
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};

oFF.FeCustomHighlighter = function() {};
oFF.FeCustomHighlighter.prototype = new oFF.XObject();
oFF.FeCustomHighlighter.prototype._ff_c = "FeCustomHighlighter";

oFF.FeCustomHighlighter.m_feCustomHighlighter = null;
oFF.FeCustomHighlighter.create = function()
{
	let customHighlighter = new oFF.FeCustomHighlighter();
	return customHighlighter;
};
oFF.FeCustomHighlighter.getInstance = function()
{
	return oFF.FeCustomHighlighter.m_feCustomHighlighter;
};
oFF.FeCustomHighlighter.setInstance = function(customHighlighter)
{
	oFF.FeCustomHighlighter.m_feCustomHighlighter = customHighlighter;
};
oFF.FeCustomHighlighter.staticSetup = function()
{
	oFF.FeCustomHighlighter.m_feCustomHighlighter = new oFF.FeCustomHighlighter();
};
oFF.FeCustomHighlighter.prototype.register = function(name, rules)
{
	oFF.FeCustomHighlighter.getInstance().registerCustomHighlighterNative(name, rules);
};
oFF.FeCustomHighlighter.prototype.registerCustomHighlighterNative = function(name, rules)
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};

oFF.FeDataTypeListBuilder = function() {};
oFF.FeDataTypeListBuilder.prototype = new oFF.XObject();
oFF.FeDataTypeListBuilder.prototype._ff_c = "FeDataTypeListBuilder";

oFF.FeDataTypeListBuilder.create = function()
{
	let builder = new oFF.FeDataTypeListBuilder();
	builder.m_list = oFF.XList.create();
	return builder;
};
oFF.FeDataTypeListBuilder.prototype.m_list = null;
oFF.FeDataTypeListBuilder.prototype.add = function(dataType)
{
	this.m_list.add(dataType);
	return this;
};
oFF.FeDataTypeListBuilder.prototype.addAll = function(dataTypes)
{
	oFF.XCollectionUtils.forEach(dataTypes, (dt) => {
		this.add(dt);
	});
	return this;
};
oFF.FeDataTypeListBuilder.prototype.build = function()
{
	oFF.XObjectExt.assertNotNull(this.m_list);
	oFF.XCollectionUtils.forEach(this.m_list, (dt) => {
		oFF.XObjectExt.assertNotNull(dt);
	});
	return this.m_list;
};

oFF.FeDimensionFilterConverter = {

	flattenConditionTreeToFormulaMemberList:function(item)
	{
			let returnList = oFF.XList.create();
		if (oFF.FeDimensionFilterConverter.isLogicalOperator(item))
		{
			oFF.FeDimensionFilterConverter.processLogicalOperation(item, returnList);
		}
		else if (oFF.FeDimensionFilterConverter.isEqualityOperator(item))
		{
			oFF.FeDimensionFilterConverter.processEqualityOperation(item, returnList);
		}
		return returnList;
	},
	isEqualityOperator:function(item)
	{
			return oFF.notNull(item) && oFF.XString.isEqual(item.getFunctionName(), oFF.FormulaOperator.EQ.getName());
	},
	isLogicalOperator:function(item)
	{
			return oFF.notNull(item) && (oFF.XString.isEqual(item.getFunctionName(), oFF.FormulaOperator.AND.getName()) || oFF.XString.isEqual(item.getFunctionName(), oFF.FormulaOperator.OR.getName()));
	},
	processEqualityOperation:function(item, returnList)
	{
			let dimensionItemOpt = oFF.FeFormulaAttributeExtended.cast(item.getArgument(0));
		let dimensionMemberOpt = oFF.FeNumericConstantConverter.extractConstant(item.getArgument(1));
		if (!dimensionItemOpt.isPresent() || !dimensionMemberOpt.isPresent())
		{
			dimensionItemOpt = oFF.FeFormulaAttributeExtended.cast(item.getArgument(1));
			dimensionMemberOpt = oFF.FeNumericConstantConverter.extractConstant(item.getArgument(0));
		}
		if (dimensionItemOpt.isPresent() && dimensionMemberOpt.isPresent() && dimensionItemOpt.get().getFeContext().isPresent())
		{
			returnList.add(oFF.FeFormulaMemberExtended.create(dimensionMemberOpt.get().getConstantValue().get(), oFF.FeDataType.DIMENSION_MEMBER, dimensionItemOpt.get().getFeContext().get()));
		}
	},
	processLogicalOperation:function(item, returnList)
	{
			let firstFunctionOpt = oFF.FeFormulaFunctionExtended.cast(item.getArgument(0));
		let secondFunctionOpt = oFF.FeFormulaFunctionExtended.cast(item.getArgument(1));
		if (firstFunctionOpt.isPresent())
		{
			returnList.addAll(oFF.FeDimensionFilterConverter.flattenConditionTreeToFormulaMemberList(firstFunctionOpt.get()));
		}
		if (secondFunctionOpt.isPresent())
		{
			returnList.addAll(oFF.FeDimensionFilterConverter.flattenConditionTreeToFormulaMemberList(secondFunctionOpt.get()));
		}
	}
};

oFF.FeDimensionMembersConverter = {

	BACKSLASH:"\\",
	CLOSE_PARENTHESIS:" )",
	COMMA_SEPARATOR:", ",
	DOUBLE_QUOTE:"\"",
	EMPTY_VALUE:"\"\"",
	ESCAPED_BACKSLASH:"\\\\",
	ESCAPED_DOUBLE_QUOTE:"\\\"",
	ESCAPED_SINGLE_QUOTE:"\\'",
	MEMBER_REGEX:"null|[\"']((?:[^\"'\\\\]|\\\\.)*)[\"']",
	NULL_VALUE:"null",
	OPEN_PARENTHESIS:"( ",
	SEMICOLON_SEPARATOR:"; ",
	SINGLE_QUOTE:"'",
	SPACE:" ",
	appendMember:function(stringBuffer, member, useCommaSeparator)
	{
			if (oFF.isNull(member))
		{
			return;
		}
		if (stringBuffer.length() > 0)
		{
			stringBuffer.append(useCommaSeparator ? oFF.FeDimensionMembersConverter.COMMA_SEPARATOR : oFF.FeDimensionMembersConverter.SEMICOLON_SEPARATOR);
		}
		if (oFF.XString.isEqual(member, oFF.FeDimensionMembersConverter.EMPTY_VALUE) || oFF.XString.isEqual(member, oFF.FeDimensionMembersConverter.NULL_VALUE))
		{
			stringBuffer.append(member);
			return;
		}
		let escapedDimMember = oFF.FeDimensionMembersConverter.escape(member);
		if (escapedDimMember.isPresent())
		{
			stringBuffer.append(oFF.FeDimensionMembersConverter.DOUBLE_QUOTE);
			stringBuffer.append(escapedDimMember.get());
			stringBuffer.append(oFF.FeDimensionMembersConverter.DOUBLE_QUOTE);
		}
	},
	escape:function(input)
	{
			if (oFF.XStringUtils.isNullOrEmpty(input))
		{
			return oFF.XOptional.empty();
		}
		let escapedString = oFF.XString.replace(input, oFF.FeDimensionMembersConverter.DOUBLE_QUOTE, oFF.FeDimensionMembersConverter.ESCAPED_DOUBLE_QUOTE);
		return oFF.XOptional.of(escapedString);
	},
	parseMembers:function(membersString)
	{
			let searchStart = 0;
		let dimensionMembers = oFF.XList.create();
		while (searchStart < oFF.XString.size(membersString))
		{
			let match = oFF.XRegex.getInstance().getFirstMatchFrom(membersString, oFF.FeDimensionMembersConverter.MEMBER_REGEX, searchStart);
			if (oFF.isNull(match) || match.getGroup(0) === null)
			{
				break;
			}
			let member = match.getGroup(1);
			if (oFF.isNull(member))
			{
				dimensionMembers.add(oFF.FeDimensionMembersConverter.NULL_VALUE);
			}
			else if (oFF.XString.size(member) === 0)
			{
				dimensionMembers.add(member);
			}
			else
			{
				let unescapedMatch = oFF.FeDimensionMembersConverter.unescape(member);
				if (unescapedMatch.isPresent())
				{
					dimensionMembers.add(unescapedMatch.get());
				}
			}
			searchStart = match.getGroupEnd(0);
		}
		return dimensionMembers;
	},
	stringifyMembers:function(dimMembers, useCommaSeparator)
	{
			let membersStringBuffer = oFF.XStringBuffer.create();
		let resultStringBuffer;
		for (let i = 0; i < dimMembers.size(); i++)
		{
			oFF.FeDimensionMembersConverter.appendMember(membersStringBuffer, dimMembers.get(i), useCommaSeparator);
		}
		if (dimMembers.size() <= 1)
		{
			resultStringBuffer = membersStringBuffer;
		}
		else
		{
			resultStringBuffer = oFF.XStringBuffer.create();
			resultStringBuffer.append(oFF.FeDimensionMembersConverter.OPEN_PARENTHESIS);
			resultStringBuffer.append(membersStringBuffer.toString());
			resultStringBuffer.append(oFF.FeDimensionMembersConverter.CLOSE_PARENTHESIS);
		}
		resultStringBuffer.append(oFF.FeDimensionMembersConverter.SPACE);
		return resultStringBuffer.toString();
	},
	unescape:function(input)
	{
			if (oFF.XStringUtils.isNullOrEmpty(input))
		{
			return oFF.XOptional.empty();
		}
		let output = input;
		output = oFF.XString.replace(output, oFF.FeDimensionMembersConverter.ESCAPED_BACKSLASH, oFF.FeDimensionMembersConverter.BACKSLASH);
		output = oFF.XString.replace(output, oFF.FeDimensionMembersConverter.ESCAPED_DOUBLE_QUOTE, oFF.FeDimensionMembersConverter.DOUBLE_QUOTE);
		output = oFF.XString.replace(output, oFF.FeDimensionMembersConverter.ESCAPED_SINGLE_QUOTE, oFF.FeDimensionMembersConverter.SINGLE_QUOTE);
		return oFF.XOptional.of(output);
	}
};

oFF.FeDuplicateAliasHandler = function() {};
oFF.FeDuplicateAliasHandler.prototype = new oFF.XObject();
oFF.FeDuplicateAliasHandler.prototype._ff_c = "FeDuplicateAliasHandler";

oFF.FeDuplicateAliasHandler.ALIAS_NUMBER_SEPARATOR = ":";
oFF.FeDuplicateAliasHandler.create = function(measures)
{
	let handler = new oFF.FeDuplicateAliasHandler();
	handler.m_measures = measures;
	return handler;
};
oFF.FeDuplicateAliasHandler.prototype.m_measures = null;
oFF.FeDuplicateAliasHandler.prototype.generate = function()
{
	let duplicatedAliases = this.getDuplicatedAliases(this.m_measures);
	return duplicatedAliases.isEmpty() ? this.m_measures : this.getMeasuresWithUniqueAlias(this.m_measures, duplicatedAliases);
};
oFF.FeDuplicateAliasHandler.prototype.getAliasIndexMap = function(duplicatedAliases)
{
	let aliasIndexMap = oFF.XHashMapByString.create();
	for (let i = 0; i < duplicatedAliases.size(); i++)
	{
		aliasIndexMap.put(duplicatedAliases.get(i), oFF.XIntegerValue.create(1));
	}
	return aliasIndexMap;
};
oFF.FeDuplicateAliasHandler.prototype.getDuplicatedAliases = function(measures)
{
	let aliasSet = oFF.XHashSetOfString.create();
	let duplicatedAliases = oFF.XList.create();
	oFF.XStream.of(measures).forEach((measure) => {
		let alias = measure.getAlias();
		if (aliasSet.contains(alias))
		{
			duplicatedAliases.add(alias);
		}
		else
		{
			aliasSet.add(alias);
		}
	});
	return duplicatedAliases;
};
oFF.FeDuplicateAliasHandler.prototype.getMeasuresWithUniqueAlias = function(measures, duplicatedAliases)
{
	let aliasIndexMap = this.getAliasIndexMap(duplicatedAliases);
	let measuresWithUniqueAlias = oFF.XList.create();
	oFF.XStream.of(measures).forEach((measure) => {
		let alias = measure.getAlias();
		if (aliasIndexMap.containsKey(alias))
		{
			let aliasIdx = aliasIndexMap.getByKey(alias).getInteger();
			let uniqueAlias = this.getUniqueAlias(alias, aliasIdx);
			let parentId = measure.getParentId().isPresent() ? measure.getParentId().get() : null;
			let feMeasure = oFF.FeMeasure.createWithAliasAndParent(measure.getId(), measure.getDescription(), uniqueAlias, measure.getValueType(), measure.getResultVisibility(), parentId, measure.getDimensionName(), measure.getDatasourceName());
			measuresWithUniqueAlias.add(feMeasure);
			aliasIndexMap.put(alias, oFF.XIntegerValue.create(aliasIdx + 1));
		}
		else
		{
			measuresWithUniqueAlias.add(measure);
		}
	});
	return measuresWithUniqueAlias;
};
oFF.FeDuplicateAliasHandler.prototype.getUniqueAlias = function(alias, aliasIdx)
{
	return oFF.XStringUtils.concatenateWithInt(oFF.XStringUtils.concatenate2(alias, oFF.FeDuplicateAliasHandler.ALIAS_NUMBER_SEPARATOR), aliasIdx);
};

oFF.FeErrorCodes = {

	ARGUMENTS_DATA_TYPE_NOT_MATCHING:1201,
	ARGUMENTS_DIMENSION_NOT_SUPPORTED:1204,
	ARGUMENTS_INVALID_DATA_TYPE:1200,
	ARGUMENTS_INVALID_DATE_FORMAT:1206,
	ARGUMENTS_INVALID_GRANULARITY_FORMAT:1207,
	ARGUMENTS_LIST_DIFFERENT_VALUE_TYPES:1205,
	ARGUMENTS_NON_UNIQUE_DIMENSION:1208,
	ARGUMENTS_NUMBER_MISMATCH:1202,
	ARGUMENTS_SINGLE_VALUE_DIM_CONDITIONS:1211,
	ARGUMENTS_STRING_NOT_SUPPORTED:1203,
	ARGUMENTS_TOO_MANY_HIERARCHICAL_DIMENSIONS:1209,
	ARGUMENTS_VERSION_DIMENSION_USED_WHERE_INVALID:1210,
	CALCULATION_CYCLICAL_DEPENDENCY:9012,
	CALCULATION_ID_EXISTING:9004,
	CALCULATION_ID_INVALID_CHARS:9003,
	CALCULATION_ID_MANDATORY:9001,
	CALCULATION_ID_MAX_LENGTH:9002,
	CALCULATION_NAME_MAX_LENGTH:9011,
	CALCULATION_STRING_AT_ROOT:9013,
	DIVISION_CANNOT_DIVIDE_BY_ZERO:1301,
	FUNCTION_INVALID:1300,
	INVALID_DECIMAL_SEPARATOR:1001,
	INVALID_SYNTAX:1000,
	LOGARITHMS_CANNOT_BE_NEGATIVE_NUMBER_AND_ZERO:1305,
	MEMBER_DATE_DIMENSION_INVALID:1105,
	MEMBER_DATE_DIMENSION_PROPERTY_INVALID:1106,
	MEMBER_DIMENSION_FIELD_ID_INVALID:1101,
	MEMBER_FIELD_ID_INVALID:1100,
	MEMBER_HIERARCHY_FIELD_ID_INVALID:1102,
	MEMBER_PROPERTY_FIELD_ID_INVALID:1103,
	MEMBER_SECOND_FIELD_ID_INVALID:1104,
	POWER_NEGATIVE_NUMBER_TO_LESS_THAN_ONE:1304,
	POWER_ZERO_TO_NEGATIVE_NUMBER:1303,
	SQRT_CANNOT_BE_NEGATIVE_NUMBER:1302,
	UNSUPPORTED_NESTED_FUNCTION:1306
};

oFF.FeFieldConverter = {

	DIMENSION_START:"[d/",
	FIELD_END:"]",
	FIELD_NAME_PATTERN:"^\\[(d\\/)?[^\\]]+\\](\\.\\[([ph]?\\/)?[^\\]]*\\])?$",
	FIELD_NAME_PATTERN_WITH_DATASOURCE_NAME:"^\\[(d\\/)?(\"[^\"]*\":)([^\\]]+)\\](\\.\\[([ph]?\\/)?[^\\]]*\\])?$",
	HIERARCHY_START:"[h/",
	MEASURE_START:"[",
	PROPERTY_START:"[p/",
	SECOND_FIELD_START:"[",
	getFieldMemberType:function(fieldName)
	{
			if (oFF.XStringUtils.isNullOrEmpty(fieldName))
		{
			return oFF.FeDataType.UNKNOWN;
		}
		if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
		{
			if (oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.DIMENSION_START) === 0)
			{
				return oFF.FeDataType.DIMENSION;
			}
			if (oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.PROPERTY_START) === 0)
			{
				return oFF.FeDataType.PROPERTY;
			}
			if (oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.HIERARCHY_START) === 0)
			{
				return oFF.FeDataType.HIERARCHY;
			}
		}
		if (oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.MEASURE_START) === 0)
		{
			return oFF.FeDataType.MEASURE;
		}
		return oFF.FeDataType.UNKNOWN;
	},
	getHierarchy:function(fieldName)
	{
			let hierarchyStart = oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.HIERARCHY_START);
		if (hierarchyStart === -1)
		{
			return oFF.XOptional.empty();
		}
		let hierarchyEnd = oFF.XString.indexOfFrom(fieldName, oFF.FeFieldConverter.FIELD_END, hierarchyStart);
		return oFF.XOptional.ofNullable(oFF.XString.substring(fieldName, hierarchyStart + oFF.XString.size(oFF.FeFieldConverter.HIERARCHY_START), hierarchyEnd));
	},
	getMember:function(fieldName)
	{
			return oFF.FeFieldConverter.getMemberExt(fieldName, false);
	},
	getMemberExt:function(fieldName, withDatasourceName)
	{
			if (oFF.isNull(fieldName))
		{
			return oFF.XOptional.empty();
		}
		return withDatasourceName ? oFF.FeFieldConverter.getMemberWithDatasource(fieldName) : oFF.FeFieldConverter.getMemberWithoutDatasource(fieldName);
	},
	getMemberWithDatasource:function(fieldName)
	{
			let match = oFF.XRegex.getInstance().getFirstMatch(fieldName, oFF.FeFieldConverter.FIELD_NAME_PATTERN_WITH_DATASOURCE_NAME);
		if (oFF.isNull(match))
		{
			return oFF.XOptional.empty();
		}
		return oFF.XOptional.of(match.getGroup(3));
	},
	getMemberWithoutDatasource:function(fieldName)
	{
			if (oFF.isNull(fieldName))
		{
			return oFF.XOptional.empty();
		}
		let match = oFF.XRegex.getInstance().getFirstMatch(fieldName, oFF.FeFieldConverter.FIELD_NAME_PATTERN);
		if (oFF.isNull(match) || match.getGroup(0) === null)
		{
			return oFF.XOptional.empty();
		}
		let memberName;
		if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) && oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.DIMENSION_START) === 0)
		{
			memberName = oFF.XString.replace(fieldName, oFF.FeFieldConverter.DIMENSION_START, "");
		}
		else if (oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.MEASURE_START) === 0)
		{
			memberName = oFF.XString.substring(fieldName, 1, -1);
		}
		else
		{
			return oFF.XOptional.empty();
		}
		let endIndex = oFF.XString.indexOf(memberName, oFF.FeFieldConverter.FIELD_END);
		if (endIndex === -1)
		{
			return oFF.XOptional.empty();
		}
		return oFF.XOptional.of(oFF.XString.substring(memberName, 0, endIndex));
	},
	getProperty:function(fieldName)
	{
			let propertyStart = oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.PROPERTY_START);
		if (propertyStart === -1)
		{
			return oFF.XOptional.empty();
		}
		let propertyEnd = oFF.XString.indexOfFrom(fieldName, oFF.FeFieldConverter.FIELD_END, propertyStart);
		return oFF.XOptional.ofNullable(oFF.XString.substring(fieldName, propertyStart + oFF.XString.size(oFF.FeFieldConverter.PROPERTY_START), propertyEnd));
	},
	getSecondField:function(fieldName)
	{
			let dimStart = oFF.XString.indexOf(fieldName, oFF.FeFieldConverter.MEASURE_START);
		if (dimStart === -1)
		{
			return oFF.XOptional.empty();
		}
		let secondFieldStart = oFF.XString.indexOfFrom(fieldName, oFF.FeFieldConverter.SECOND_FIELD_START, dimStart + oFF.XString.size(oFF.FeFieldConverter.MEASURE_START));
		if (secondFieldStart === -1)
		{
			return oFF.XOptional.empty();
		}
		let secondFieldEnd = oFF.XString.indexOfFrom(fieldName, oFF.FeFieldConverter.FIELD_END, secondFieldStart);
		return oFF.XOptional.ofNullable(oFF.XString.substring(fieldName, secondFieldStart + oFF.XString.size(oFF.FeFieldConverter.SECOND_FIELD_START), secondFieldEnd));
	}
};

oFF.FeFormulaItemConstantHelper = {

	isValidBoolean:function(value)
	{
			return oFF.XString.isEqual(value, "true") || oFF.XString.isEqual(value, "false");
	},
	isValidBooleanConstant:function(fiExtended)
	{
			return fiExtended.getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidBoolean(fiExtended.getConstantValue().get());
	},
	isValidNumber:function(value)
	{
			try
		{
			let numberValue = oFF.XDouble.convertFromString(value);
			if (numberValue === oFF.XDouble.getNegativeInfinity() || numberValue === oFF.XDouble.getPositiveInfinity() || oFF.XMath.isNaN(numberValue))
			{
				return false;
			}
		}
		catch (e)
		{
			return false;
		}
		return true;
	},
	isValidNumberConstant:function(fiExtended)
	{
			return fiExtended.getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidNumber(fiExtended.getConstantValue().get());
	},
	isValidString:function(value)
	{
			return oFF.notNull(value);
	},
	isValidStringConstant:function(fiExtended)
	{
			return fiExtended.getReturnType().isTypeOf(oFF.FeDataType.STRING) && fiExtended.getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidString(fiExtended.getConstantValue().get());
	}
};

oFF.FeFormulaTextHandler = function() {};
oFF.FeFormulaTextHandler.prototype = new oFF.XObject();
oFF.FeFormulaTextHandler.prototype._ff_c = "FeFormulaTextHandler";

oFF.FeFormulaTextHandler.ACCOUNT_REGEX = "\\[(.*)\\]\\.\\[(.*)\\]\\.&\\[(.*)\\]";
oFF.FeFormulaTextHandler.create = function(measures)
{
	let handler = new oFF.FeFormulaTextHandler();
	handler.m_measures = measures;
	return handler;
};
oFF.FeFormulaTextHandler.prototype.m_measures = null;
oFF.FeFormulaTextHandler.prototype.generateFormulaText = function(internalFormulaText)
{
	return this.replaceFormulaMeasures(internalFormulaText, (measureText) => {
		let feMeasureById = oFF.XStream.of(this.m_measures).find((m) => {
			return oFF.XString.isEqual(m.getId(), measureText);
		});
		if (feMeasureById.isPresent())
		{
			return feMeasureById.get().getAlias();
		}
		let accountMatch = oFF.XRegex.getInstance().getFirstMatch(measureText, oFF.FeFormulaTextHandler.ACCOUNT_REGEX);
		if (oFF.notNull(accountMatch) && accountMatch.getGroup(3) !== null)
		{
			return accountMatch.getGroup(3);
		}
		return measureText;
	});
};
oFF.FeFormulaTextHandler.prototype.generateInternalFormulaText = function(formulaText)
{
	return this.replaceFormulaMeasures(formulaText, (measureText) => {
		let feMeasureByAlias = oFF.XStream.of(this.m_measures).find((m) => {
			return oFF.XString.isEqual(m.getAlias(), measureText);
		});
		if (feMeasureByAlias.isPresent())
		{
			return feMeasureByAlias.get().getId();
		}
		return measureText;
	});
};
oFF.FeFormulaTextHandler.prototype.replaceFormulaMeasures = function(formulaText, measureHandler)
{
	let internalTextBuilder = oFF.XStringBuffer.create();
	let measureBuffer = oFF.XStringBuffer.create();
	let bracketBalance = 0;
	for (let i = 0; i < oFF.XString.size(formulaText); i++)
	{
		let currentChar = oFF.XString.substring(formulaText, i, i + 1);
		if (oFF.XString.isEqual(currentChar, "["))
		{
			bracketBalance++;
		}
		if (bracketBalance === 0)
		{
			internalTextBuilder.append(currentChar);
		}
		else
		{
			measureBuffer.append(currentChar);
		}
		if (oFF.XString.isEqual(currentChar, "]"))
		{
			bracketBalance--;
			if (bracketBalance === 0)
			{
				let field = measureBuffer.toString();
				measureBuffer.clear();
				if (oFF.FeFieldConverter.getFieldMemberType(field).isTypeOf(oFF.FeDataType.MEASURE) && oFF.XString.size(field) > 2)
				{
					let measureText = oFF.XString.substring(field, 1, oFF.XString.size(field) - 1);
					internalTextBuilder.append("[");
					internalTextBuilder.append(measureHandler(measureText));
					internalTextBuilder.append("]");
				}
				else
				{
					internalTextBuilder.append(field);
				}
			}
		}
	}
	return internalTextBuilder.toString();
};

oFF.FeFunctionComparator = {

	compareFunctionName:function(firstName, secondName)
	{
			let lowercaseFirstName = oFF.XString.toLowerCase(firstName);
		let lowercaseSecondName = oFF.XString.toLowerCase(secondName);
		if ((oFF.XString.startsWith(lowercaseFirstName, "%") || oFF.XString.startsWith(lowercaseSecondName, "%")))
		{
			let comparisonValue = oFF.FeFunctionComparator.getComparisonValue(lowercaseFirstName, lowercaseSecondName);
			if (comparisonValue === 0)
			{
				let percentComparisonValue = oFF.XString.compare(lowercaseFirstName, lowercaseSecondName);
				return oFF.XIntegerValue.create(percentComparisonValue * -1);
			}
			return oFF.XIntegerValue.create(comparisonValue);
		}
		else
		{
			return oFF.XIntegerValue.create(oFF.XString.compare(lowercaseFirstName, lowercaseSecondName));
		}
	},
	getComparisonValue:function(firstName, secondName)
	{
			let percentLessFirstName = oFF.XString.replace(firstName, "%", "");
		let percentLessSecondName = oFF.XString.replace(secondName, "%", "");
		return oFF.XString.compare(percentLessFirstName, percentLessSecondName);
	}
};

oFF.FeKeyboardHandler = function() {};
oFF.FeKeyboardHandler.prototype = new oFF.XObject();
oFF.FeKeyboardHandler.prototype._ff_c = "FeKeyboardHandler";

oFF.FeKeyboardHandler.m_feKeyboardHandler = null;
oFF.FeKeyboardHandler.create = function()
{
	let keyboardHandler = new oFF.FeKeyboardHandler();
	return keyboardHandler;
};
oFF.FeKeyboardHandler.getInstance = function()
{
	return oFF.FeKeyboardHandler.m_feKeyboardHandler;
};
oFF.FeKeyboardHandler.getModuleName = function()
{
	return "ace/keyboard/fe_keyboard_handler";
};
oFF.FeKeyboardHandler.register = function()
{
	oFF.FeKeyboardHandler.getInstance().registerKeyboardHandlerNative();
};
oFF.FeKeyboardHandler.setInstance = function(keyboardHandler)
{
	oFF.FeKeyboardHandler.m_feKeyboardHandler = keyboardHandler;
};
oFF.FeKeyboardHandler.staticSetup = function()
{
	oFF.FeKeyboardHandler.m_feKeyboardHandler = new oFF.FeKeyboardHandler();
};
oFF.FeKeyboardHandler.prototype.m_feContext = null;
oFF.FeKeyboardHandler.prototype.getContext = function()
{
	return this.m_feContext;
};
oFF.FeKeyboardHandler.prototype.registerKeyboardHandlerNative = function()
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};
oFF.FeKeyboardHandler.prototype.setContext = function(context)
{
	this.m_feContext = context;
};

oFF.FeNumericConstantConverter = {

	extractConstant:function(arg)
	{
			let constOpt = oFF.FeFormulaConstantExtended.cast(arg);
		if (constOpt.isPresent())
		{
			return constOpt;
		}
		let funcOpt = oFF.FeFormulaFunctionExtended.cast(arg);
		if (funcOpt.isPresent() && oFF.XString.isEqual(funcOpt.get().getFunctionName(), oFF.FormulaOperator.DECFLOAT.getName()))
		{
			return oFF.FeNumericConstantConverter.extractConstant(funcOpt.get().getArgument(0));
		}
		return oFF.XOptional.empty();
	}
};

oFF.FeParser = function() {};
oFF.FeParser.prototype = new oFF.XObject();
oFF.FeParser.prototype._ff_c = "FeParser";

oFF.FeParser.SYNTAX_ERROR = "SYNTAX";
oFF.FeParser.m_formulaParser = null;
oFF.FeParser.create = function(datasource, calculationId, supportedFunctions, supportedOperators, feConfiguration, preferences)
{
	let parser = new oFF.FeParser();
	parser.m_datasource = oFF.XObjectExt.assertNotNull(datasource);
	parser.m_preferences = oFF.XObjectExt.assertNotNull(preferences);
	parser.m_treeBuilder = oFF.FeTreeBuilder.create(datasource, feConfiguration, preferences.isModelPrefixEnabled());
	parser.m_calculationId = calculationId;
	parser.m_supportedFunctions = supportedFunctions;
	parser.m_supportedOperators = supportedOperators;
	parser.m_feConfiguration = feConfiguration;
	return parser;
};
oFF.FeParser.getInstance = function()
{
	return oFF.FeParser.m_formulaParser;
};
oFF.FeParser.setInstance = function(formulaParser)
{
	oFF.FeParser.m_formulaParser = oFF.XObjectExt.assertNotNull(formulaParser);
};
oFF.FeParser.staticSetup = function()
{
	oFF.FeParser.m_formulaParser = new oFF.FeParser();
};
oFF.FeParser.prototype.m_calculationId = null;
oFF.FeParser.prototype.m_datasource = null;
oFF.FeParser.prototype.m_feConfiguration = null;
oFF.FeParser.prototype.m_preferences = null;
oFF.FeParser.prototype.m_supportedFunctions = null;
oFF.FeParser.prototype.m_supportedOperators = null;
oFF.FeParser.prototype.m_treeBuilder = null;
oFF.FeParser.prototype.m_validator = null;
oFF.FeParser.prototype.getMessages = function()
{
	if (oFF.notNull(this.m_validator))
	{
		return this.m_validator.getMessages();
	}
	return oFF.MessageManagerSimple.createMessageManager();
};
oFF.FeParser.prototype.parse = function(formula)
{
	this.m_validator = oFF.FeValidator.create(this.m_datasource, this.m_calculationId, this.m_supportedFunctions, this.m_supportedOperators, this.m_feConfiguration, this.m_preferences);
	this.m_treeBuilder.setValidator(this.m_validator);
	oFF.FeParser.m_formulaParser.setTreeBuilder(this.m_treeBuilder);
	this.m_validator.validateSeparators(formula);
	if (this.m_validator.getMessages().hasErrors())
	{
		return oFF.FeFormulaConstantExtended.createNull();
	}
	return oFF.FeParser.getInstance().parseNative(formula.getText());
};
oFF.FeParser.prototype.parseNative = function(text)
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};
oFF.FeParser.prototype.releaseObject = function()
{
	this.m_datasource = null;
	this.m_treeBuilder = oFF.XObjectExt.release(this.m_treeBuilder);
	this.m_calculationId = null;
	this.m_supportedFunctions = null;
	this.m_supportedOperators = null;
	this.m_feConfiguration = null;
	this.m_preferences = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeParser.prototype.setTreeBuilder = function(treeBuilder)
{
	throw oFF.XException.createRuntimeException("Implemented in native code");
};
oFF.FeParser.prototype.validate = function(formula)
{
	let messages = oFF.MessageManagerSimple.createMessageManager();
	if (!formula.isEmpty())
	{
		try
		{
			this.parse(formula);
			messages.addAllMessages(this.getMessages());
		}
		catch (e)
		{
			messages.addErrorExt(oFF.FeParser.SYNTAX_ERROR, oFF.FeErrorCodes.INVALID_SYNTAX, oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.ERROR_SYNTAX), null);
		}
	}
	return messages;
};

oFF.FeTreeBuilder = function() {};
oFF.FeTreeBuilder.prototype = new oFF.XObject();
oFF.FeTreeBuilder.prototype._ff_c = "FeTreeBuilder";

oFF.FeTreeBuilder.create = function(datasource, feConfiguration, enableModelPrefix)
{
	let treeBuilder = new oFF.FeTreeBuilder();
	treeBuilder.m_datasource = oFF.XObjectExt.assertNotNull(datasource);
	treeBuilder.m_feConfiguration = oFF.XObjectExt.assertNotNull(feConfiguration);
	treeBuilder.m_enableModelPrefix = enableModelPrefix;
	return treeBuilder;
};
oFF.FeTreeBuilder.prototype.m_datasource = null;
oFF.FeTreeBuilder.prototype.m_enableModelPrefix = false;
oFF.FeTreeBuilder.prototype.m_feConfiguration = null;
oFF.FeTreeBuilder.prototype.m_validator = null;
oFF.FeTreeBuilder.prototype.makeArray = function(expressions)
{
	oFF.XObjectExt.assertTrue(oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT));
	return oFF.FeFormulaListConstantExtended.create(expressions);
};
oFF.FeTreeBuilder.prototype.makeBoolean = function(isTrue)
{
	return oFF.FeFormulaConstantExtended.createBoolean(isTrue);
};
oFF.FeTreeBuilder.prototype.makeDimension = function(fieldName)
{
	this.m_validator.validateDimension(fieldName);
	let dimensionName = oFF.FeFieldConverter.getMemberExt(fieldName, this.m_enableModelPrefix).orElse(fieldName);
	let memberId = dimensionName;
	let memberRetriever = oFF.FeMemberRetriever.create(this.m_datasource);
	let feDimensionOpt = memberRetriever.getDimension(fieldName, this.m_enableModelPrefix);
	let feDimension = null;
	if (feDimensionOpt.isPresent())
	{
		feDimension = feDimensionOpt.get();
		memberId = feDimension.getKeyFieldName();
	}
	let type = oFF.FeDataType.DIMENSION;
	if (feDimensionOpt.isPresent() && feDimensionOpt.get().isDateDimension())
	{
		type = oFF.FeDataType.DATE_DIMENSION;
	}
	return oFF.FeFormulaAttributeExtended.create(memberId, type, feDimension);
};
oFF.FeTreeBuilder.prototype.makeDouble = function(value)
{
	oFF.XStringUtils.assertNotNullOrEmpty(value);
	let numberValue = oFF.FeFormulaConstantExtended.create(value, oFF.FeDataType.NUMBER);
	let args = oFF.XList.create();
	args.add(numberValue);
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), args, this.m_feConfiguration);
};
oFF.FeTreeBuilder.prototype.makeField = function(fieldName)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	let fieldDataType = oFF.FeFieldConverter.getFieldMemberType(fieldName);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) && fieldDataType.isTypeOf(oFF.FeDataType.DIMENSION))
	{
		return this.makeDimension(fieldName);
	}
	return this.makeMeasure(fieldName);
};
oFF.FeTreeBuilder.prototype.makeFunctionCall = function(fctName, args)
{
	return this.makeFunctionCallAndValidateArguments(fctName, args);
};
oFF.FeTreeBuilder.prototype.makeFunctionCallAndValidateArguments = function(fctName, args)
{
	return this.makeFunctionCallInternal(fctName, args, true);
};
oFF.FeTreeBuilder.prototype.makeFunctionCallInternal = function(fctName, args, validateArgs)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fctName);
	oFF.XObjectExt.assertNotNull(args);
	oFF.XCollectionUtils.forEach(args, (a) => {
		oFF.XObjectExt.assertNotNull(a);
	});
	let transformedArgs = args;
	let fi = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(fctName);
	if (fi.isPresent())
	{
		transformedArgs = fi.get().getMetadata().transformArgs(args, this.m_feConfiguration);
	}
	if (validateArgs)
	{
		this.m_validator.validateArguments(fctName, transformedArgs);
	}
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(fctName, transformedArgs, this.m_feConfiguration);
};
oFF.FeTreeBuilder.prototype.makeFunctionCallWithoutArgumentsValidation = function(fctName, args)
{
	return this.makeFunctionCallInternal(fctName, args, false);
};
oFF.FeTreeBuilder.prototype.makeInteger = function(value)
{
	oFF.XStringUtils.assertNotNullOrEmpty(value);
	let intValue = oFF.FeFormulaConstantExtended.createInteger(value);
	let args = oFF.XList.create();
	args.add(intValue);
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), args, this.m_feConfiguration);
};
oFF.FeTreeBuilder.prototype.makeMeasure = function(fieldName)
{
	this.m_validator.validateMember(fieldName);
	let alias = oFF.FeFieldConverter.getMemberExt(fieldName, this.m_enableModelPrefix).orElse(fieldName);
	let measure = oFF.XStream.of(this.m_datasource.getAllUsableMeasures()).find((m) => {
		return oFF.XString.isEqual(alias, m.getAlias());
	});
	let memberId = measure.isPresent() ? measure.get().getId() : alias;
	return oFF.FeFormulaMemberExtended.create(memberId, oFF.FeDataType.MEASURE, measure.orElse(null));
};
oFF.FeTreeBuilder.prototype.makeNull = function()
{
	let nullConstant = oFF.FeFormulaConstantExtended.createNull();
	return this.wrapWith(nullConstant, oFF.FormulaOperator.DECFLOAT);
};
oFF.FeTreeBuilder.prototype.makeRootFormula = function(root)
{
	this.m_validator.validateRoot(root);
	if (root.getReturnType().isTypeOf(oFF.FeDataType.BOOLEAN))
	{
		return this.wrapBooleanForRoot(root);
	}
	return root;
};
oFF.FeTreeBuilder.prototype.makeString = function(text)
{
	oFF.XObjectExt.assertTrueExt(oFF.notNull(text), "text cannot be null");
	return oFF.FeFormulaConstantExtended.createString(text);
};
oFF.FeTreeBuilder.prototype.setValidator = function(validator)
{
	this.m_validator = oFF.XObjectExt.assertNotNull(validator);
};
oFF.FeTreeBuilder.prototype.wrapBooleanForRoot = function(booleanNode)
{
	let integer = this.wrapWith(booleanNode, oFF.FormulaOperator.INT);
	let decfloat = this.wrapWith(integer, oFF.FormulaOperator.DECFLOAT);
	return decfloat;
};
oFF.FeTreeBuilder.prototype.wrapWith = function(node, _function)
{
	let formulaItemArgs = oFF.XList.create();
	formulaItemArgs.add(node);
	let wrapped = this.makeFunctionCallWithoutArgumentsValidation(_function.getName(), formulaItemArgs);
	return wrapped;
};

oFF.FeArgumentCustomData = function() {};
oFF.FeArgumentCustomData.prototype = new oFF.XObject();
oFF.FeArgumentCustomData.prototype._ff_c = "FeArgumentCustomData";

oFF.FeArgumentCustomData.create = function(parentFunction)
{
	let instance = new oFF.FeArgumentCustomData();
	instance.m_parentFunction = oFF.XObjectExt.assertNotNull(parentFunction);
	return instance;
};
oFF.FeArgumentCustomData.extractFromToken = function(token)
{
	oFF.XObjectExt.assertNotNull(token);
	if (!token.getTokenType().isEqualTo(oFF.FeTokenType.ARGUMENT) || !token.getCustomData().isPresent())
	{
		return oFF.XOptional.empty();
	}
	return oFF.XOptional.of(token.getCustomData().get());
};
oFF.FeArgumentCustomData.prototype.m_parentFunction = null;
oFF.FeArgumentCustomData.prototype.getParentFunction = function()
{
	return this.m_parentFunction;
};

oFF.FeContext = function() {};
oFF.FeContext.prototype = new oFF.XObject();
oFF.FeContext.prototype._ff_c = "FeContext";

oFF.FeContext.create = function()
{
	let context = new oFF.FeContext();
	context.resetTokens();
	return context;
};
oFF.FeContext.prototype.m_argumentTokens = null;
oFF.FeContext.prototype.m_dimensionTokens = null;
oFF.FeContext.prototype.m_entityTokens = null;
oFF.FeContext.prototype.m_functions = null;
oFF.FeContext.prototype.m_measureTokens = null;
oFF.FeContext.prototype.m_numberTokens = null;
oFF.FeContext.prototype.extractTokens = function(formula)
{
	oFF.XObjectExt.assertNotNull(formula);
	let formulaText = formula.getText();
	this.m_dimensionTokens = oFF.FeDimensionTokenExtractor.create().getTokens(formulaText);
	this.m_measureTokens = oFF.FeMeasureTokenExtractor.create().getTokens(formulaText);
	this.m_numberTokens = oFF.FeNumberTokenExtractor.create().getTokens(formulaText);
	this.m_functions = oFF.FeFunctionExtractor.create().getFunctions(formulaText, this.m_dimensionTokens);
	this.m_entityTokens = oFF.FeEntityTokenExtractor.create().getTokens(formulaText);
	if (this.m_functions.hasElements())
	{
		this.m_argumentTokens = oFF.XStream.of(this.m_functions).flatMap((_function) => {
			return oFF.XStream.of(_function.getArgumentTokens());
		}).collect(oFF.XStreamCollector.toList());
	}
};
oFF.FeContext.prototype.getEntityTokenAtPosition = function(position, useForwardDirection)
{
	let tokenPositionCheck = (token) => {
		return token.getContextStart() <= position && position <= token.getContextEnd();
	};
	let tokens = oFF.XStream.of(this.m_entityTokens).filter(tokenPositionCheck).collect(oFF.XStreamCollector.toList());
	let tokenAtPosition = null;
	if (tokens.size() === 2)
	{
		tokenAtPosition = useForwardDirection ? tokens.get(1) : tokens.get(0);
	}
	else if (tokens.size() === 1)
	{
		tokenAtPosition = tokens.get(0);
	}
	return oFF.XOptional.ofNullable(tokenAtPosition);
};
oFF.FeContext.prototype.getFunctionItemAtPosition = function(position)
{
	this.m_functions = this.sortFunctionsByLength(this.m_functions);
	let functionName = oFF.XStream.of(this.m_functions).find((_function) => {
		return _function.getStart() < position && position < _function.getEnd();
	}).map((_function) => {
		return _function.getName();
	});
	if (functionName.isPresent())
	{
		return oFF.FeFormulaItemProvider.getInstance().getFormulaItem(functionName.get());
	}
	return oFF.XOptional.empty();
};
oFF.FeContext.prototype.getTokenAtPosition = function(position)
{
	let tokenPositionCheck = (token1) => {
		return token1.getContextStart() <= position && position <= token1.getContextEnd();
	};
	let currentToken = oFF.XStream.of(this.m_dimensionTokens).find(tokenPositionCheck);
	if (currentToken.isPresent())
	{
		return currentToken;
	}
	currentToken = oFF.XStream.of(this.m_measureTokens).find(tokenPositionCheck);
	if (currentToken.isPresent())
	{
		return currentToken;
	}
	currentToken = oFF.XStream.of(this.m_numberTokens).find(tokenPositionCheck);
	if (currentToken.isPresent())
	{
		return currentToken;
	}
	this.m_argumentTokens = this.sortTokensByLength(this.m_argumentTokens);
	currentToken = oFF.XStream.of(this.m_argumentTokens).find(tokenPositionCheck);
	if (currentToken.isPresent())
	{
		return currentToken;
	}
	return oFF.XOptional.empty();
};
oFF.FeContext.prototype.resetTokens = function()
{
	this.m_dimensionTokens = oFF.XList.create();
	this.m_measureTokens = oFF.XList.create();
	this.m_functions = oFF.XList.create();
	this.m_argumentTokens = oFF.XList.create();
	this.m_numberTokens = oFF.XList.create();
	this.m_entityTokens = oFF.XList.create();
};
oFF.FeContext.prototype.sortFunctionsByLength = function(functions)
{
	let sortedFunctions = oFF.XList.create();
	sortedFunctions.addAll(functions);
	let compareFunction = (a, b) => {
		return oFF.XIntegerValue.create(a.getLength() - b.getLength());
	};
	sortedFunctions.sortByComparator(oFF.XComparatorLambda.create(compareFunction));
	return sortedFunctions;
};
oFF.FeContext.prototype.sortTokensByLength = function(tokens)
{
	let sortedTokens = oFF.XList.create();
	sortedTokens.addAll(tokens);
	let compareFunction = (a, b) => {
		return oFF.XIntegerValue.create(a.getContextLength() - b.getContextLength());
	};
	sortedTokens.sortByComparator(oFF.XComparatorLambda.create(compareFunction));
	return sortedTokens;
};

oFF.FeDimensionCustomData = function() {};
oFF.FeDimensionCustomData.prototype = new oFF.XObject();
oFF.FeDimensionCustomData.prototype._ff_c = "FeDimensionCustomData";

oFF.FeDimensionCustomData.create = function(dimensionName, exclude, multiselect)
{
	return oFF.FeDimensionCustomData.createExt(dimensionName, exclude, multiselect, null, null);
};
oFF.FeDimensionCustomData.createExt = function(dimensionName, exclude, multiselect, hierarchyName, memberString)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(dimensionName);
	let instance = new oFF.FeDimensionCustomData();
	instance.m_dimensionName = dimensionName;
	instance.m_isExclude = exclude;
	instance.m_isMultiselect = multiselect;
	instance.m_hierarchyName = hierarchyName;
	instance.m_memberString = memberString;
	return instance;
};
oFF.FeDimensionCustomData.createWithHierarchy = function(dimensionName, exclude, multiselect, hierarchyName)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(hierarchyName);
	return oFF.FeDimensionCustomData.createExt(dimensionName, exclude, multiselect, hierarchyName, null);
};
oFF.FeDimensionCustomData.createWithMemberString = function(dimensionName, exclude, multiselect, memberString)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(memberString);
	return oFF.FeDimensionCustomData.createExt(dimensionName, exclude, multiselect, null, memberString);
};
oFF.FeDimensionCustomData.extractFromToken = function(token)
{
	oFF.XObjectExt.assertNotNull(token);
	if (!token.getTokenType().isEqualTo(oFF.FeTokenType.DIMENSION) || !token.getDataTypes().contains(oFF.FeDataType.DIMENSION_MEMBER) || !token.getCustomData().isPresent())
	{
		return oFF.XOptional.empty();
	}
	return oFF.XOptional.ofNullable(token.getCustomData().get());
};
oFF.FeDimensionCustomData.prototype.m_dimensionName = null;
oFF.FeDimensionCustomData.prototype.m_hierarchyName = null;
oFF.FeDimensionCustomData.prototype.m_isExclude = false;
oFF.FeDimensionCustomData.prototype.m_isMultiselect = false;
oFF.FeDimensionCustomData.prototype.m_memberString = null;
oFF.FeDimensionCustomData.prototype.getDimensionName = function()
{
	return this.m_dimensionName;
};
oFF.FeDimensionCustomData.prototype.getHierarchyName = function()
{
	return oFF.XOptional.ofNullable(this.m_hierarchyName);
};
oFF.FeDimensionCustomData.prototype.getMemberString = function()
{
	return oFF.XOptional.ofNullable(this.m_memberString);
};
oFF.FeDimensionCustomData.prototype.isExclude = function()
{
	return this.m_isExclude;
};
oFF.FeDimensionCustomData.prototype.isMultiselect = function()
{
	return this.m_isMultiselect;
};

oFF.FeFunction = function() {};
oFF.FeFunction.prototype = new oFF.XObject();
oFF.FeFunction.prototype._ff_c = "FeFunction";

oFF.FeFunction.create = function(formulaText, fctName, start, end, interiorStart, separatorPositions, dimensionTokens)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(formulaText);
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(fctName);
	oFF.XObjectExt.assertTrue(start >= 0);
	oFF.XObjectExt.assertTrue(interiorStart >= 0);
	oFF.XObjectExt.assertTrue(end >= 0);
	oFF.XObjectExt.assertNotNull(separatorPositions);
	oFF.XObjectExt.assertNotNull(dimensionTokens);
	let feFunction = new oFF.FeFunction();
	feFunction.m_fctName = fctName;
	feFunction.m_fctStart = start;
	feFunction.m_fctEnd = end;
	feFunction.m_fctInteriorStart = interiorStart;
	let argumentTokenExtractor = oFF.FeArgumentTokenExtractor.create(fctName, interiorStart, end, separatorPositions, feFunction);
	feFunction.m_argumentTokens = argumentTokenExtractor.getTokens(formulaText);
	feFunction.m_dimensionTokens = dimensionTokens;
	return feFunction;
};
oFF.FeFunction.prototype.m_argumentTokens = null;
oFF.FeFunction.prototype.m_dimensionTokens = null;
oFF.FeFunction.prototype.m_fctEnd = 0;
oFF.FeFunction.prototype.m_fctInteriorStart = 0;
oFF.FeFunction.prototype.m_fctName = null;
oFF.FeFunction.prototype.m_fctStart = 0;
oFF.FeFunction.prototype.getArgumentTokens = function()
{
	return this.m_argumentTokens;
};
oFF.FeFunction.prototype.getDimensionTokens = function()
{
	return this.m_dimensionTokens;
};
oFF.FeFunction.prototype.getEnd = function()
{
	return this.m_fctEnd;
};
oFF.FeFunction.prototype.getInteriorStart = function()
{
	return this.m_fctInteriorStart;
};
oFF.FeFunction.prototype.getLength = function()
{
	return this.m_fctEnd - this.m_fctStart;
};
oFF.FeFunction.prototype.getName = function()
{
	return this.m_fctName;
};
oFF.FeFunction.prototype.getStart = function()
{
	return this.m_fctStart;
};

oFF.FeMemberRetriever = function() {};
oFF.FeMemberRetriever.prototype = new oFF.XObject();
oFF.FeMemberRetriever.prototype._ff_c = "FeMemberRetriever";

oFF.FeMemberRetriever.DIMENSION_FIELD = "(?:\\[d\\/([^\\]]+)\\])(?:\\.\\[(\\S+)\\])?";
oFF.FeMemberRetriever.DIMENSION_FIELD_WITH_DATASOURCE_NAME = "(?:\\[d\\/(\"[^\"]*\":)?([^\\]]+)\\])(?:\\.\\[(\\S+)\\])?";
oFF.FeMemberRetriever.HIERARCHY_PREFIX = "h/";
oFF.FeMemberRetriever.MEASURE_FIELD = "\\[([^\\]]+)\\]";
oFF.FeMemberRetriever.MEASURE_FIELD_WITH_DATASOURCE_NAME = "\\[(\"[^\"]*\":)([^\\]]+)\\]";
oFF.FeMemberRetriever.PROPERTY_PREFIX = "p/";
oFF.FeMemberRetriever.create = function(metadataProvider)
{
	let instance = new oFF.FeMemberRetriever();
	instance.m_datasourceProvider = metadataProvider;
	return instance;
};
oFF.FeMemberRetriever.prototype.m_datasourceProvider = null;
oFF.FeMemberRetriever.prototype.getDimension = function(field, enableModelPrefix)
{
	let match = oFF.XRegex.getInstance().getFirstMatch(field, enableModelPrefix ? oFF.FeMemberRetriever.DIMENSION_FIELD_WITH_DATASOURCE_NAME : oFF.FeMemberRetriever.DIMENSION_FIELD);
	let numOfGroup2 = enableModelPrefix ? 3 : 2;
	let indexOfDimNameGroup = enableModelPrefix ? 2 : 1;
	let indexOfDFieldNameGroup = enableModelPrefix ? 3 : 2;
	if (oFF.isNull(match) || match.getGroupCount() !== numOfGroup2 || oFF.XStringUtils.isNullOrEmpty(match.getGroup(0)) || oFF.XStringUtils.isNullOrEmpty(match.getGroup(indexOfDimNameGroup)))
	{
		return oFF.XOptional.empty();
	}
	let dimName = oFF.XString.trim(match.getGroup(indexOfDimNameGroup));
	let fieldName = match.getGroup(indexOfDFieldNameGroup) === null ? "" : oFF.XString.trim(match.getGroup(indexOfDFieldNameGroup));
	let datasourceName = enableModelPrefix ? match.getGroup(1) : null;
	let existingDimension = this.m_datasourceProvider.getDimensionByName(dimName);
	if (!existingDimension.isPresent() || (enableModelPrefix && !oFF.XStringUtils.containsString(datasourceName, existingDimension.get().getDatasourceName(), false)))
	{
		return oFF.XOptional.empty();
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fieldName))
	{
		if (oFF.XString.indexOf(fieldName, oFF.FeMemberRetriever.HIERARCHY_PREFIX) === 0)
		{
			return oFF.XOptional.of(oFF.FeDimension.createWithSelectedHierarchy(existingDimension.get(), oFF.XString.substring(fieldName, 2, -1)));
		}
		else if (oFF.XString.indexOf(fieldName, oFF.FeMemberRetriever.PROPERTY_PREFIX) === 0)
		{
			return oFF.XOptional.of(oFF.FeDimension.createWithSelectedProperty(existingDimension.get(), oFF.XString.substring(fieldName, 2, -1)));
		}
		else
		{
			return oFF.XOptional.empty();
		}
	}
	return existingDimension;
};
oFF.FeMemberRetriever.prototype.getMeasure = function(field, enableModelPrefix)
{
	if (this.getDimension(field, enableModelPrefix).isPresent())
	{
		return oFF.XOptional.empty();
	}
	let match = oFF.XRegex.getInstance().getFirstMatch(field, enableModelPrefix ? oFF.FeMemberRetriever.MEASURE_FIELD_WITH_DATASOURCE_NAME : oFF.FeMemberRetriever.MEASURE_FIELD);
	if (oFF.isNull(match) || oFF.XStringUtils.isNullOrEmpty(match.getGroup(0)) || oFF.XStringUtils.isNullOrEmpty(match.getGroup(1)))
	{
		return oFF.XOptional.empty();
	}
	let measureName = match.getGroup(1);
	return oFF.XStream.of(this.m_datasourceProvider.getAllMeasures()).find((measure) => {
		return oFF.XString.isEqual(measure.getId(), measureName);
	});
};

oFF.FeToken = function() {};
oFF.FeToken.prototype = new oFF.XObject();
oFF.FeToken.prototype._ff_c = "FeToken";

oFF.FeToken.create = function(tokenType, dataTypes, text, start, end, contextStart, contextEnd, customData)
{
	oFF.XObjectExt.assertNotNull(tokenType);
	oFF.XObjectExt.assertNotNull(dataTypes);
	oFF.XObjectExt.assertTrue(start <= end);
	let token = new oFF.FeToken();
	token.m_tokenType = tokenType;
	token.m_dataTypes = dataTypes.getValuesAsReadOnlyList();
	token.m_text = text;
	token.m_start = start >= 0 ? start : contextStart;
	token.m_end = end >= 0 ? end : contextEnd;
	token.m_contextStart = contextStart;
	token.m_contextEnd = contextEnd;
	token.m_customData = customData;
	return token;
};
oFF.FeToken.prototype.m_contextEnd = 0;
oFF.FeToken.prototype.m_contextStart = 0;
oFF.FeToken.prototype.m_customData = null;
oFF.FeToken.prototype.m_dataTypes = null;
oFF.FeToken.prototype.m_end = 0;
oFF.FeToken.prototype.m_start = 0;
oFF.FeToken.prototype.m_text = null;
oFF.FeToken.prototype.m_tokenType = null;
oFF.FeToken.prototype.getContextEnd = function()
{
	return this.m_contextEnd;
};
oFF.FeToken.prototype.getContextLength = function()
{
	return this.getContextEnd() - this.getContextStart();
};
oFF.FeToken.prototype.getContextStart = function()
{
	return this.m_contextStart;
};
oFF.FeToken.prototype.getCustomData = function()
{
	return oFF.XOptional.ofNullable(this.m_customData);
};
oFF.FeToken.prototype.getDataTypes = function()
{
	return this.m_dataTypes;
};
oFF.FeToken.prototype.getEnd = function()
{
	return this.m_end;
};
oFF.FeToken.prototype.getLength = function()
{
	return this.getEnd() - this.getStart();
};
oFF.FeToken.prototype.getStart = function()
{
	return this.m_start;
};
oFF.FeToken.prototype.getText = function()
{
	return this.m_text;
};
oFF.FeToken.prototype.getTokenType = function()
{
	return this.m_tokenType;
};

oFF.FeTokenBuilder = function() {};
oFF.FeTokenBuilder.prototype = new oFF.XObject();
oFF.FeTokenBuilder.prototype._ff_c = "FeTokenBuilder";

oFF.FeTokenBuilder.create = function()
{
	let tokenBuilder = new oFF.FeTokenBuilder();
	tokenBuilder.m_contextStart = -1;
	tokenBuilder.m_contextEnd = -1;
	tokenBuilder.m_start = -1;
	tokenBuilder.m_end = -1;
	tokenBuilder.m_customData = null;
	tokenBuilder.m_dataTypes = oFF.XList.create();
	return tokenBuilder;
};
oFF.FeTokenBuilder.prototype.m_contextEnd = 0;
oFF.FeTokenBuilder.prototype.m_contextStart = 0;
oFF.FeTokenBuilder.prototype.m_customData = null;
oFF.FeTokenBuilder.prototype.m_dataTypes = null;
oFF.FeTokenBuilder.prototype.m_end = 0;
oFF.FeTokenBuilder.prototype.m_start = 0;
oFF.FeTokenBuilder.prototype.m_text = null;
oFF.FeTokenBuilder.prototype.m_tokenType = null;
oFF.FeTokenBuilder.prototype.addDataType = function(dataType)
{
	this.m_dataTypes.add(dataType);
	return this;
};
oFF.FeTokenBuilder.prototype.build = function()
{
	this.validateInput();
	return oFF.FeToken.create(this.m_tokenType, this.m_dataTypes, this.m_text, this.m_start, this.m_end, this.m_contextStart, this.m_contextEnd, this.m_customData);
};
oFF.FeTokenBuilder.prototype.setContextEnd = function(contextEnd)
{
	this.m_contextEnd = contextEnd;
	return this;
};
oFF.FeTokenBuilder.prototype.setContextStart = function(contextStart)
{
	this.m_contextStart = contextStart;
	return this;
};
oFF.FeTokenBuilder.prototype.setCustomData = function(customData)
{
	this.m_customData = customData;
	return this;
};
oFF.FeTokenBuilder.prototype.setDataTypes = function(dataTypes)
{
	this.m_dataTypes = dataTypes.createListCopy();
	return this;
};
oFF.FeTokenBuilder.prototype.setEnd = function(end)
{
	this.m_end = end;
	return this;
};
oFF.FeTokenBuilder.prototype.setStart = function(start)
{
	this.m_start = start;
	return this;
};
oFF.FeTokenBuilder.prototype.setText = function(text)
{
	this.m_text = text;
	return this;
};
oFF.FeTokenBuilder.prototype.setTokenType = function(tokenType)
{
	this.m_tokenType = tokenType;
	return this;
};
oFF.FeTokenBuilder.prototype.validateInput = function()
{
	oFF.XObjectExt.assertNotNullExt(this.m_tokenType, "Token type is required to create a token.");
	oFF.XObjectExt.assertNotNullExt(this.m_dataTypes, "Token data type is required to create a token.");
	oFF.XObjectExt.assertTrueExt(this.m_contextStart >= 0, "Token context start is required to create a token.");
	oFF.XObjectExt.assertTrueExt(this.m_contextEnd >= 0, "Token context end is required to create a token.");
	oFF.XObjectExt.assertTrueExt(this.m_contextStart <= this.m_contextEnd, "Token context range must be a valid (contextStart <= contextEnd).");
	if (this.m_start >= 0 && this.m_end >= 0)
	{
		oFF.XObjectExt.assertTrueExt(this.m_start <= this.m_end, "Token range must be a valid (start <= end).");
	}
};

oFF.FeArgumentTokenExtractor = function() {};
oFF.FeArgumentTokenExtractor.prototype = new oFF.XObject();
oFF.FeArgumentTokenExtractor.prototype._ff_c = "FeArgumentTokenExtractor";

oFF.FeArgumentTokenExtractor.create = function(functionName, functionInteriorStart, functionEnd, separatorPositions, parentFunction)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(functionName);
	oFF.XObjectExt.assertTrue(functionInteriorStart >= 0);
	oFF.XObjectExt.assertTrue(functionEnd >= 0);
	oFF.XObjectExt.assertNotNull(separatorPositions);
	oFF.XObjectExt.assertNotNull(parentFunction);
	let extractor = new oFF.FeArgumentTokenExtractor();
	extractor.m_fctName = functionName;
	extractor.m_fctEnd = functionEnd;
	extractor.m_fctInteriorStart = functionInteriorStart;
	extractor.m_separatorPositions = separatorPositions.getValuesAsReadOnlyList();
	extractor.m_parentFunction = parentFunction;
	return extractor;
};
oFF.FeArgumentTokenExtractor.prototype.m_fctEnd = 0;
oFF.FeArgumentTokenExtractor.prototype.m_fctInteriorStart = 0;
oFF.FeArgumentTokenExtractor.prototype.m_fctName = null;
oFF.FeArgumentTokenExtractor.prototype.m_parentFunction = null;
oFF.FeArgumentTokenExtractor.prototype.m_separatorPositions = null;
oFF.FeArgumentTokenExtractor.prototype.createToken = function(formulaText, functionName, start, end, argIndex)
{
	let functionItem = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(functionName);
	let argDataTypes = functionItem.isPresent() ? this.getArgumentDataTypes(functionItem.get(), argIndex) : this.getDefaultDataTypes();
	let text = oFF.XString.substring(formulaText, start, end);
	return oFF.FeTokenBuilder.create().setTokenType(oFF.FeTokenType.ARGUMENT).setDataTypes(argDataTypes).setText(text).setContextStart(start).setContextEnd(end).setStart(start).setEnd(end).setCustomData(oFF.FeArgumentCustomData.create(this.m_parentFunction)).build();
};
oFF.FeArgumentTokenExtractor.prototype.getArgumentDataTypes = function(functionItem, argumentIndex)
{
	let metadata = functionItem.getMetadata();
	if (argumentIndex >= metadata.getArgumentsCount())
	{
		return this.getDefaultDataTypes();
	}
	return metadata.getArgument(argumentIndex).get().getSupportedArgumentTypes();
};
oFF.FeArgumentTokenExtractor.prototype.getDefaultDataTypes = function()
{
	let defaultDataTypes = oFF.XList.create();
	defaultDataTypes.add(oFF.FeDataType.UNKNOWN);
	return defaultDataTypes;
};
oFF.FeArgumentTokenExtractor.prototype.getTokens = function(formulaText)
{
	let argumentTokens = oFF.XList.create();
	let separatorPositions = this.m_separatorPositions;
	let functionInteriorStart = this.m_fctInteriorStart;
	let functionEnd = this.m_fctEnd;
	if (separatorPositions.isEmpty())
	{
		argumentTokens.add(this.createToken(formulaText, this.m_fctName, functionInteriorStart, functionEnd - 1, 0));
	}
	else
	{
		argumentTokens.addAll(this.processMultipleArgumentTokens(formulaText, this.m_fctName, separatorPositions, functionInteriorStart, functionEnd));
	}
	return argumentTokens;
};
oFF.FeArgumentTokenExtractor.prototype.processMultipleArgumentTokens = function(formulaText, functionName, separatorPositions, functionInteriorStart, functionEnd)
{
	let argumentTokens = oFF.XList.create();
	argumentTokens.add(this.createToken(formulaText, functionName, functionInteriorStart, separatorPositions.get(0).getInteger(), 0));
	for (let i = 1; i < separatorPositions.size(); i++)
	{
		argumentTokens.add(this.createToken(formulaText, functionName, separatorPositions.get(i - 1).getInteger() + 1, separatorPositions.get(i).getInteger(), i));
	}
	if (!separatorPositions.isEmpty())
	{
		argumentTokens.add(this.createToken(formulaText, functionName, separatorPositions.get(separatorPositions.size() - 1).getInteger() + 1, functionEnd - 1, separatorPositions.size()));
	}
	return argumentTokens;
};

oFF.FeDimensionTokenExtractor = function() {};
oFF.FeDimensionTokenExtractor.prototype = new oFF.XObject();
oFF.FeDimensionTokenExtractor.prototype._ff_c = "FeDimensionTokenExtractor";

oFF.FeDimensionTokenExtractor.DIMENSION_REGEX = "(\\[d\\/.+?\\])(\\.\\s*)*(\\[(?:(?:h|p)\\/.+?\\])*)*(?:(\\s*(?:!=|<=|>=|=|<|>))(\\s*)((?:\\([\\S\\s]+?\\))|null|(?:\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'))?)?\\s*";
oFF.FeDimensionTokenExtractor.create = function()
{
	return new oFF.FeDimensionTokenExtractor();
};
oFF.FeDimensionTokenExtractor.prototype.getDimensionMemberDataType = function()
{
	let dimensionMemberType = oFF.XList.create();
	dimensionMemberType.add(oFF.FeDataType.DIMENSION_MEMBER);
	return dimensionMemberType;
};
oFF.FeDimensionTokenExtractor.prototype.getDimensionOperatorDataType = function()
{
	let dimensionMemberType = oFF.XList.create();
	dimensionMemberType.add(oFF.FeDataType.OPERATOR);
	return dimensionMemberType;
};
oFF.FeDimensionTokenExtractor.prototype.getHierPropDataType = function()
{
	let hierPropDataType = oFF.XList.create();
	hierPropDataType.add(oFF.FeDataType.HIERARCHY);
	hierPropDataType.add(oFF.FeDataType.PROPERTY);
	return hierPropDataType;
};
oFF.FeDimensionTokenExtractor.prototype.getTokens = function(formulaText)
{
	let searchStart = 0;
	let dimensionTokens = oFF.XList.create();
	while (searchStart < oFF.XString.size(formulaText))
	{
		let matcher = oFF.XRegex.getInstance().getFirstMatchFrom(formulaText, oFF.FeDimensionTokenExtractor.DIMENSION_REGEX, searchStart);
		if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
		{
			break;
		}
		let token = this.handleDimensionToken(matcher);
		if (token.isPresent())
		{
			dimensionTokens.add(token.get());
		}
		searchStart = matcher.getGroupEnd(0);
	}
	return dimensionTokens;
};
oFF.FeDimensionTokenExtractor.prototype.handleDimensionToken = function(matcher)
{
	let tokenBuilder = oFF.FeTokenBuilder.create();
	tokenBuilder.setTokenType(oFF.FeTokenType.DIMENSION);
	let isValidSelector = matcher.getGroup(2) !== null && matcher.getGroup(3) !== null && !oFF.XString.isEqual(matcher.getGroup(3), "[");
	let isValidDot = matcher.getGroup(2) !== null && (matcher.getGroup(3) === null || oFF.XString.isEqual(matcher.getGroup(3), "["));
	let dimensionText = isValidSelector ? oFF.XStringUtils.concatenate3(matcher.getGroup(1), matcher.getGroup(2), matcher.getGroup(3)) : matcher.getGroup(1);
	if (isValidDot)
	{
		tokenBuilder.setDataTypes(this.getHierPropDataType());
		tokenBuilder.setText(matcher.getGroup(1));
		tokenBuilder.setContextStart(matcher.getGroupStart(2) + 1);
		tokenBuilder.setContextEnd(matcher.getGroup(3) !== null ? matcher.getGroupEnd(3) : matcher.getGroupEnd(2));
		return oFF.XOptional.of(tokenBuilder.build());
	}
	else if (matcher.getGroup(4) === null)
	{
		tokenBuilder.setDataTypes(this.getDimensionOperatorDataType());
		tokenBuilder.setText(dimensionText);
		tokenBuilder.setStart(matcher.getGroupStart(0));
		tokenBuilder.setEnd(matcher.getGroupEnd(0));
		tokenBuilder.setContextStart(matcher.getGroup(3) !== null ? matcher.getGroupEnd(3) : matcher.getGroupEnd(1));
		tokenBuilder.setContextEnd(matcher.getGroupEnd(0));
		return oFF.XOptional.of(tokenBuilder.build());
	}
	else if (matcher.getGroup(4) !== null && matcher.getGroup(5) !== null)
	{
		tokenBuilder.setDataTypes(this.getDimensionMemberDataType());
		tokenBuilder.setText(dimensionText);
		tokenBuilder.setStart(matcher.getGroupStart(0));
		tokenBuilder.setEnd(matcher.getGroupEnd(0));
		let hierarchyName = matcher.getGroup(3) !== null ? oFF.FeFieldConverter.getHierarchy(matcher.getGroup(3)).orElse(null) : null;
		let excludeMembers = matcher.getGroup(4) !== null && oFF.XString.containsString(matcher.getGroup(4), "!=");
		let multiselect = matcher.getGroup(4) !== null && !(oFF.XString.containsString(matcher.getGroup(4), "<") || oFF.XString.containsString(matcher.getGroup(4), "<=") || oFF.XString.containsString(matcher.getGroup(4), ">") || oFF.XString.containsString(matcher.getGroup(4), ">="));
		if (matcher.getGroup(6) !== null)
		{
			let memberString = matcher.getGroup(6);
			tokenBuilder.setContextStart(matcher.getGroupStart(5));
			tokenBuilder.setContextEnd(matcher.getGroupEnd(6) - 1);
			tokenBuilder.setCustomData(oFF.isNull(hierarchyName) ? oFF.FeDimensionCustomData.createWithMemberString(dimensionText, excludeMembers, multiselect, memberString) : oFF.FeDimensionCustomData.createExt(dimensionText, excludeMembers, multiselect, hierarchyName, memberString));
			return oFF.XOptional.of(tokenBuilder.build());
		}
		else
		{
			tokenBuilder.setContextStart(matcher.getGroupStart(5));
			tokenBuilder.setContextEnd(matcher.getGroupEnd(5));
			tokenBuilder.setCustomData(oFF.isNull(hierarchyName) ? oFF.FeDimensionCustomData.create(dimensionText, excludeMembers, multiselect) : oFF.FeDimensionCustomData.createWithHierarchy(dimensionText, excludeMembers, multiselect, hierarchyName));
			return oFF.XOptional.of(tokenBuilder.build());
		}
	}
	return oFF.XOptional.empty();
};

oFF.FeEntityTokenExtractor = function() {};
oFF.FeEntityTokenExtractor.prototype = new oFF.XObject();
oFF.FeEntityTokenExtractor.prototype._ff_c = "FeEntityTokenExtractor";

oFF.FeEntityTokenExtractor.REGEX = "(\\[[^\\[\\]]+?\\])";
oFF.FeEntityTokenExtractor.create = function()
{
	return new oFF.FeEntityTokenExtractor();
};
oFF.FeEntityTokenExtractor.prototype.getTokens = function(formulaText)
{
	let searchStart = 0;
	let tokens = oFF.XList.create();
	let dataTypes = oFF.XList.create();
	dataTypes.add(oFF.FeDataType.ANY);
	while (searchStart < oFF.XString.size(formulaText))
	{
		let matcher = oFF.XRegex.getInstance().getFirstMatchFrom(formulaText, oFF.FeEntityTokenExtractor.REGEX, searchStart);
		if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
		{
			break;
		}
		let text = matcher.getGroup(1);
		let contextStart = matcher.getGroupStart(1);
		let contextEnd = matcher.getGroupEnd(1);
		tokens.add(oFF.FeTokenBuilder.create().setTokenType(oFF.FeTokenType.GENERIC).setDataTypes(dataTypes).setText(text).setContextStart(contextStart).setContextEnd(contextEnd).setStart(contextStart).setEnd(contextEnd).build());
		searchStart = matcher.getGroupEnd(1);
	}
	return tokens;
};

oFF.FeFunctionExtractor = function() {};
oFF.FeFunctionExtractor.prototype = new oFF.XObject();
oFF.FeFunctionExtractor.prototype._ff_c = "FeFunctionExtractor";

oFF.FeFunctionExtractor.ARGUMENT_SEPARATOR = ",";
oFF.FeFunctionExtractor.FUNCTION_END = ")";
oFF.FeFunctionExtractor.FUNCTION_HEADER_REGEX = "(%?[a-zA-Z0-9]+)\\s*\\(";
oFF.FeFunctionExtractor.FUNCTION_START = "(";
oFF.FeFunctionExtractor.create = function()
{
	return new oFF.FeFunctionExtractor();
};
oFF.FeFunctionExtractor.prototype.findNextFunction = function(formulaText, dimensionTokens, startText, functions)
{
	let textToSearch = oFF.XString.substring(formulaText, startText, -1);
	let matcher = oFF.XRegex.getInstance().getFirstMatch(textToSearch, oFF.FeFunctionExtractor.FUNCTION_HEADER_REGEX);
	if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
	{
		return oFF.XString.size(formulaText);
	}
	let functionHeader = matcher.getGroup(0);
	let functionName = matcher.getGroup(1);
	let functionStart = oFF.XString.indexOfFrom(formulaText, functionHeader, startText);
	let functionEnd = oFF.XString.size(formulaText) + 1;
	let parenthesisOpened = 0;
	let separatorPositions = oFF.XList.create();
	for (let i = functionStart; i < oFF.XString.size(formulaText); i++)
	{
		let curChar = oFF.XString.substring(formulaText, i, i + 1);
		if (oFF.XString.isEqual(curChar, oFF.FeFunctionExtractor.FUNCTION_START))
		{
			parenthesisOpened++;
		}
		if (oFF.XString.isEqual(curChar, oFF.FeFunctionExtractor.FUNCTION_END))
		{
			if (parenthesisOpened > 1)
			{
				parenthesisOpened--;
			}
			else
			{
				functionEnd = i + 1;
				break;
			}
		}
		if (oFF.XString.isEqual(curChar, oFF.FeFunctionExtractor.ARGUMENT_SEPARATOR) && parenthesisOpened === 1)
		{
			separatorPositions.add(oFF.XIntegerValue.create(i));
		}
	}
	let fctInteriorStart = startText + oFF.XString.indexOf(textToSearch, oFF.FeFunctionExtractor.FUNCTION_START) + 1;
	functions.add(oFF.FeFunction.create(formulaText, functionName, functionStart, functionEnd, fctInteriorStart, separatorPositions, this.getDimensionTokensInFunction(dimensionTokens, fctInteriorStart, functionEnd)));
	return fctInteriorStart;
};
oFF.FeFunctionExtractor.prototype.getDimensionTokensInFunction = function(dimensionTokens, functionInteriorStart, functionEnd)
{
	return oFF.XCollectionUtils.filter(dimensionTokens, (token) => {
		return token.getStart() >= functionInteriorStart && token.getEnd() <= functionEnd;
	});
};
oFF.FeFunctionExtractor.prototype.getFunctions = function(formulaText, dimensionTokens)
{
	let startText = 0;
	let functions = oFF.XList.create();
	while (startText < oFF.XString.size(formulaText))
	{
		startText = this.findNextFunction(formulaText, dimensionTokens, startText, functions);
	}
	return functions.getValuesAsReadOnlyList();
};

oFF.FeMeasureTokenExtractor = function() {};
oFF.FeMeasureTokenExtractor.prototype = new oFF.XObject();
oFF.FeMeasureTokenExtractor.prototype._ff_c = "FeMeasureTokenExtractor";

oFF.FeMeasureTokenExtractor.MEASURE_REGEX = "(\\[.+?\\])(\\s*)";
oFF.FeMeasureTokenExtractor.create = function()
{
	return new oFF.FeMeasureTokenExtractor();
};
oFF.FeMeasureTokenExtractor.prototype.getTokens = function(formulaText)
{
	let searchStart = 0;
	let measureTokens = oFF.XList.create();
	let dataTypes = oFF.XList.create();
	dataTypes.add(oFF.FeDataType.OPERATOR);
	while (searchStart < oFF.XString.size(formulaText))
	{
		let matcher = oFF.XRegex.getInstance().getFirstMatchFrom(formulaText, oFF.FeMeasureTokenExtractor.MEASURE_REGEX, searchStart);
		if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
		{
			break;
		}
		let text = matcher.getGroup(1);
		let contextStart = matcher.getGroupStart(2);
		let contextEnd = matcher.getGroupEnd(2);
		measureTokens.add(oFF.FeTokenBuilder.create().setTokenType(oFF.FeTokenType.MEASURE).setDataTypes(dataTypes).setText(text).setContextStart(contextStart).setContextEnd(contextEnd).setStart(contextStart).setEnd(contextEnd).build());
		searchStart = matcher.getGroupEnd(0) + 1;
	}
	return measureTokens;
};

oFF.FeNumberTokenExtractor = function() {};
oFF.FeNumberTokenExtractor.prototype = new oFF.XObject();
oFF.FeNumberTokenExtractor.prototype._ff_c = "FeNumberTokenExtractor";

oFF.FeNumberTokenExtractor.NUMBER_REGEX = "(\\d+)(\\s*)";
oFF.FeNumberTokenExtractor.create = function()
{
	return new oFF.FeNumberTokenExtractor();
};
oFF.FeNumberTokenExtractor.prototype.getTokens = function(formulaText)
{
	let searchStart = 0;
	let numberToken = oFF.XList.create();
	let dataTypes = oFF.XList.create();
	dataTypes.add(oFF.FeDataType.OPERATOR);
	while (searchStart < oFF.XString.size(formulaText))
	{
		let matcher = oFF.XRegex.getInstance().getFirstMatchFrom(formulaText, oFF.FeNumberTokenExtractor.NUMBER_REGEX, searchStart);
		if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
		{
			break;
		}
		let text = matcher.getGroup(1);
		let contextStart = matcher.getGroupStart(2);
		let contextEnd = matcher.getGroupEnd(2);
		numberToken.add(oFF.FeTokenBuilder.create().setTokenType(oFF.FeTokenType.NUMBER).setDataTypes(dataTypes).setText(text).setContextStart(contextStart).setContextEnd(contextEnd).setStart(contextStart).setEnd(contextEnd).build());
		searchStart = matcher.getGroupEnd(0) + 1;
	}
	return numberToken;
};

oFF.FeAbstractDimensionMemberKeyConverter = function() {};
oFF.FeAbstractDimensionMemberKeyConverter.prototype = new oFF.XObject();
oFF.FeAbstractDimensionMemberKeyConverter.prototype._ff_c = "FeAbstractDimensionMemberKeyConverter";

oFF.FeAbstractDimensionMemberKeyConverter.DIMENSION_NAME_PLACEHOLDER = "{{dimensionName}}";
oFF.FeAbstractDimensionMemberKeyConverter.HIERARCHY_NAME_PLACEHOLDER = "{{hierarchyName}}";
oFF.FeAbstractDimensionMemberKeyConverter.prototype.m_feDimension = null;
oFF.FeAbstractDimensionMemberKeyConverter.prototype.m_hierarchyName = null;
oFF.FeAbstractDimensionMemberKeyConverter.prototype.constructPattern = function()
{
	return this.fillPlaceholders(this.getPatternTemplate());
};
oFF.FeAbstractDimensionMemberKeyConverter.prototype.convert = function(memberKey)
{
	if (!this.isDimensionValid())
	{
		return oFF.XOptional.empty();
	}
	let pattern = this.constructPattern();
	let match = oFF.XRegex.getInstance().getFirstMatch(memberKey, pattern);
	if (oFF.isNull(match))
	{
		return oFF.XOptional.empty();
	}
	return this.buildConvertedKeyFromPatternMatch(match);
};
oFF.FeAbstractDimensionMemberKeyConverter.prototype.fillPlaceholders = function(patternTemplate)
{
	let pattern = patternTemplate;
	pattern = oFF.XString.replace(pattern, oFF.FeAbstractDimensionMemberKeyConverter.DIMENSION_NAME_PLACEHOLDER, this.getDimensionName());
	pattern = oFF.XString.replace(pattern, oFF.FeAbstractDimensionMemberKeyConverter.HIERARCHY_NAME_PLACEHOLDER, this.getHierarchyName());
	return pattern;
};
oFF.FeAbstractDimensionMemberKeyConverter.prototype.fillPlaceholdersWithMatch = function(template, match)
{
	if (oFF.isNull(match))
	{
		return oFF.XOptional.empty();
	}
	let result = this.fillPlaceholders(template);
	let placeholder;
	for (let i = 1; i <= match.getGroupCount(); i++)
	{
		placeholder = oFF.XString.replace("{{groupN}}", "N", oFF.XInteger.convertToString(i));
		result = oFF.XString.replace(result, placeholder, match.getGroup(i));
	}
	return oFF.XOptional.of(result);
};
oFF.FeAbstractDimensionMemberKeyConverter.prototype.getDimensionName = function()
{
	return this.m_feDimension.getId();
};
oFF.FeAbstractDimensionMemberKeyConverter.prototype.setupInternal = function(dimension)
{
	this.m_feDimension = oFF.XObjectExt.assertNotNull(dimension);
};

oFF.FeMemberKeyToShortDateConverter = function() {};
oFF.FeMemberKeyToShortDateConverter.prototype = new oFF.XObject();
oFF.FeMemberKeyToShortDateConverter.prototype._ff_c = "FeMemberKeyToShortDateConverter";

oFF.FeMemberKeyToShortDateConverter.buildConverters = function(dimension, hierarchyName)
{
	let converters = oFF.XList.create();
	converters.add(oFF.FeHalfYearMemberKeyToShortDateConverter.create(dimension, hierarchyName));
	return converters;
};
oFF.FeMemberKeyToShortDateConverter.create = function(dimension, hierarchyName)
{
	let converter = new oFF.FeMemberKeyToShortDateConverter();
	converter.m_converters = oFF.FeMemberKeyToShortDateConverter.buildConverters(dimension, hierarchyName);
	return converter;
};
oFF.FeMemberKeyToShortDateConverter.prototype.m_converters = null;
oFF.FeMemberKeyToShortDateConverter.prototype.convert = function(memberKey)
{
	let converter = oFF.XCollectionUtils.findFirst(this.m_converters, (c) => {
		return c.convert(memberKey).isPresent();
	});
	if (oFF.isNull(converter))
	{
		return oFF.XOptional.empty();
	}
	return converter.convert(memberKey);
};

oFF.FeShortDateToMemberKeyConverter = function() {};
oFF.FeShortDateToMemberKeyConverter.prototype = new oFF.XObject();
oFF.FeShortDateToMemberKeyConverter.prototype._ff_c = "FeShortDateToMemberKeyConverter";

oFF.FeShortDateToMemberKeyConverter.buildConverters = function(dimension)
{
	let converters = oFF.XList.create();
	converters.add(oFF.FeHalfYearShortDateToMemberKeyConverter.create(dimension));
	return converters;
};
oFF.FeShortDateToMemberKeyConverter.create = function(dimension)
{
	let converter = new oFF.FeShortDateToMemberKeyConverter();
	converter.m_converters = oFF.FeShortDateToMemberKeyConverter.buildConverters(dimension);
	return converter;
};
oFF.FeShortDateToMemberKeyConverter.prototype.m_converters = null;
oFF.FeShortDateToMemberKeyConverter.prototype.convert = function(memberKey)
{
	let converter = oFF.XCollectionUtils.findFirst(this.m_converters, (c) => {
		return c.convert(memberKey).isPresent();
	});
	if (oFF.isNull(converter))
	{
		return oFF.XOptional.empty();
	}
	return converter.convert(memberKey);
};

oFF.FeDoc = function() {};
oFF.FeDoc.prototype = new oFF.XObject();
oFF.FeDoc.prototype._ff_c = "FeDoc";

oFF.FeDoc.create = function(summary, syntax, example, remark)
{
	oFF.XObjectExt.assertNotNull(summary);
	oFF.XCollectionUtils.forEach(summary, (s) => {
		oFF.XStringUtils.assertNotNullOrEmpty(s);
	});
	oFF.XObjectExt.assertNotNull(syntax);
	oFF.XCollectionUtils.forEach(syntax, (s) => {
		oFF.XStringUtils.assertNotNullOrEmpty(s);
	});
	oFF.XObjectExt.assertNotNull(example);
	oFF.XCollectionUtils.forEach(example, (s) => {
		oFF.XStringUtils.assertNotNullOrEmpty(s);
	});
	oFF.XObjectExt.assertNotNull(example);
	let obj = new oFF.FeDoc();
	obj.m_summary = summary;
	obj.m_syntax = syntax;
	obj.m_example = example;
	obj.m_remark = remark;
	return obj;
};
oFF.FeDoc.prototype.m_example = null;
oFF.FeDoc.prototype.m_remark = null;
oFF.FeDoc.prototype.m_summary = null;
oFF.FeDoc.prototype.m_syntax = null;
oFF.FeDoc.prototype.getExample = function()
{
	return this.m_example;
};
oFF.FeDoc.prototype.getRemark = function()
{
	return this.m_remark;
};
oFF.FeDoc.prototype.getSummary = function()
{
	return this.m_summary;
};
oFF.FeDoc.prototype.getSyntax = function()
{
	return this.m_syntax;
};
oFF.FeDoc.prototype.hasExample = function()
{
	return oFF.notNull(this.m_example) && this.m_example.size() > 0;
};
oFF.FeDoc.prototype.hasRemark = function()
{
	return oFF.notNull(this.m_remark) && this.m_remark.size() > 0;
};
oFF.FeDoc.prototype.hasSummary = function()
{
	return oFF.notNull(this.m_summary) && this.m_summary.size() > 0;
};
oFF.FeDoc.prototype.hasSyntax = function()
{
	return oFF.notNull(this.m_syntax) && this.m_syntax.size() > 0;
};

oFF.FeDocBuilder = function() {};
oFF.FeDocBuilder.prototype = new oFF.XObject();
oFF.FeDocBuilder.prototype._ff_c = "FeDocBuilder";

oFF.FeDocBuilder.create = function()
{
	let builder = new oFF.FeDocBuilder();
	builder.m_summary = oFF.XList.create();
	builder.m_syntax = oFF.XList.create();
	builder.m_example = oFF.XList.create();
	builder.m_remark = oFF.XList.create();
	return builder;
};
oFF.FeDocBuilder.prototype.m_example = null;
oFF.FeDocBuilder.prototype.m_remark = null;
oFF.FeDocBuilder.prototype.m_summary = null;
oFF.FeDocBuilder.prototype.m_syntax = null;
oFF.FeDocBuilder.prototype.addExampleLine = function(exampleLine)
{
	this.m_example.add(exampleLine);
	return this;
};
oFF.FeDocBuilder.prototype.addRemarkLine = function(remarkLine)
{
	this.m_remark.add(remarkLine);
	return this;
};
oFF.FeDocBuilder.prototype.addSummaryLine = function(summaryLine)
{
	this.m_summary.add(summaryLine);
	return this;
};
oFF.FeDocBuilder.prototype.addSyntaxLine = function(syntaxLine)
{
	this.m_syntax.add(syntaxLine);
	return this;
};
oFF.FeDocBuilder.prototype.build = function()
{
	oFF.XObjectExt.assertNotNullExt(this.m_summary, "Summary must not be null");
	oFF.XObjectExt.assertNotNullExt(this.m_syntax, "Syntax must not be null");
	oFF.XObjectExt.assertNotNullExt(this.m_example, "Example must not be null");
	oFF.XObjectExt.assertNotNullExt(this.m_remark, "Remark must not be null");
	oFF.XCollectionUtils.forEach(this.m_summary, (s) => {
		oFF.XStringUtils.assertNotNullOrEmpty(s);
	});
	oFF.XCollectionUtils.forEach(this.m_syntax, (s) => {
		oFF.XStringUtils.assertNotNullOrEmpty(s);
	});
	oFF.XCollectionUtils.forEach(this.m_example, (e) => {
		oFF.XStringUtils.assertNotNullOrEmpty(e);
	});
	oFF.XCollectionUtils.forEach(this.m_remark, (r) => {
		oFF.XStringUtils.assertNotNullOrEmpty(r);
	});
	return oFF.FeDoc.create(this.m_summary, this.m_syntax, this.m_example, this.m_remark);
};

oFF.FeFormula = function() {};
oFF.FeFormula.prototype = new oFF.XObject();
oFF.FeFormula.prototype._ff_c = "FeFormula";

oFF.FeFormula.EMPTY_FORMULA_TEXT = "";
oFF.FeFormula.create = function(formulaText, formulaPresentation)
{
	let instance = new oFF.FeFormula();
	instance.m_text = formulaText;
	instance.m_formulaPresentation = formulaPresentation;
	return instance;
};
oFF.FeFormula.createWithDisplayFormula = function(displayFormulaText, formulaPresentation)
{
	let instance = new oFF.FeFormula();
	instance.m_displayText = displayFormulaText;
	instance.m_formulaPresentation = formulaPresentation;
	return instance;
};
oFF.FeFormula.prototype.m_displayText = null;
oFF.FeFormula.prototype.m_formulaPresentation = null;
oFF.FeFormula.prototype.m_text = null;
oFF.FeFormula.prototype.getDisplayText = function()
{
	if (this.isEmpty())
	{
		return oFF.FeFormula.EMPTY_FORMULA_TEXT;
	}
	if (oFF.isNull(this.m_displayText))
	{
		this.m_displayText = this.m_formulaPresentation.getDisplayText(this.m_text);
	}
	return this.m_displayText;
};
oFF.FeFormula.prototype.getText = function()
{
	if (this.isEmpty())
	{
		return oFF.FeFormula.EMPTY_FORMULA_TEXT;
	}
	if (oFF.isNull(this.m_text))
	{
		this.m_text = this.m_formulaPresentation.getInternalText(this.m_displayText);
	}
	return this.m_text;
};
oFF.FeFormula.prototype.isCommaDecimalSeparator = function()
{
	return this.m_formulaPresentation.isCommaDecimalSeparator();
};
oFF.FeFormula.prototype.isEmpty = function()
{
	return oFF.XStringUtils.isNullOrEmpty(this.m_text) && oFF.XStringUtils.isNullOrEmpty(this.m_displayText);
};

oFF.FeFormulaPresentation = function() {};
oFF.FeFormulaPresentation.prototype = new oFF.XObject();
oFF.FeFormulaPresentation.prototype._ff_c = "FeFormulaPresentation";

oFF.FeFormulaPresentation.COMMA = ",";
oFF.FeFormulaPresentation.DOT = ".";
oFF.FeFormulaPresentation.SEMICOLON = ";";
oFF.FeFormulaPresentation.create = function(isCommaDecimalSeparator)
{
	let instance = new oFF.FeFormulaPresentation();
	instance.m_isCommaDecimalSeparator = isCommaDecimalSeparator;
	let protectedCharsPatterns = oFF.XList.create();
	protectedCharsPatterns.add(oFF.FeFormulaProtectedCharsRetriever.REGEX_STRINGS);
	protectedCharsPatterns.add(oFF.FeFormulaProtectedCharsRetriever.REGEX_FIELDS);
	instance.m_protectedCharsRetriever = oFF.FeFormulaProtectedCharsRetriever.create(protectedCharsPatterns);
	return instance;
};
oFF.FeFormulaPresentation.prototype.m_isCommaDecimalSeparator = false;
oFF.FeFormulaPresentation.prototype.m_protectedCharsRetriever = null;
oFF.FeFormulaPresentation.prototype.getCharsToReplace = function(text, toInternal)
{
	if (!this.m_isCommaDecimalSeparator)
	{
		return oFF.XSimpleMap.create();
	}
	let charsToReplace = oFF.XSimpleMap.create();
	let match = oFF.XRegex.getInstance().getFirstMatch(text, toInternal ? oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_COMMA : oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_DOT);
	while (oFF.notNull(match) && match.getGroup(0) !== null)
	{
		let commaStart = match.getGroup(2) !== null ? match.getGroupStart(2) : match.getGroupStart(5);
		if (commaStart !== -1)
		{
			charsToReplace.put(oFF.XIntegerValue.create(commaStart), oFF.XStringValue.create(toInternal ? oFF.FeFormulaPresentation.DOT : oFF.FeFormulaPresentation.COMMA));
		}
		match = oFF.XRegex.getInstance().getFirstMatchFrom(text, toInternal ? oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_COMMA : oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_DOT, match.getGroupEnd(0));
	}
	for (let i = 0; i < oFF.XString.size(text); i++)
	{
		let currentChar = oFF.XString.substring(text, i, i + 1);
		if (oFF.XString.isEqual(currentChar, toInternal ? oFF.FeFormulaPresentation.SEMICOLON : oFF.FeFormulaPresentation.COMMA))
		{
			charsToReplace.put(oFF.XIntegerValue.create(i), oFF.XStringValue.create(toInternal ? oFF.FeFormulaPresentation.COMMA : oFF.FeFormulaPresentation.SEMICOLON));
		}
	}
	return charsToReplace;
};
oFF.FeFormulaPresentation.prototype.getDisplayText = function(internalText)
{
	return this.getText(internalText, false);
};
oFF.FeFormulaPresentation.prototype.getInternalText = function(presentationText)
{
	return this.getText(presentationText, true);
};
oFF.FeFormulaPresentation.prototype.getText = function(text, toInternal)
{
	if (oFF.XStringUtils.isNullOrEmpty(text) || !this.m_isCommaDecimalSeparator)
	{
		return text;
	}
	let protectedChars = this.m_protectedCharsRetriever.getProtectedChars(text);
	let charsToReplace = this.getCharsToReplace(text, toInternal);
	let stringBuilder = oFF.XStringBuffer.create();
	for (let i = 0; i < oFF.XString.size(text); i++)
	{
		let currentChar = oFF.XString.substring(text, i, i + 1);
		let charIndex = oFF.XIntegerValue.create(i);
		if (!protectedChars.contains(charIndex) && charsToReplace.containsKey(charIndex))
		{
			stringBuilder.append(charsToReplace.getByKey(charIndex).toString());
		}
		else
		{
			stringBuilder.append(currentChar);
		}
	}
	return stringBuilder.toString();
};
oFF.FeFormulaPresentation.prototype.isCommaDecimalSeparator = function()
{
	return this.m_isCommaDecimalSeparator;
};

oFF.FeFormulaProtectedCharsRetriever = function() {};
oFF.FeFormulaProtectedCharsRetriever.prototype = new oFF.XObject();
oFF.FeFormulaProtectedCharsRetriever.prototype._ff_c = "FeFormulaProtectedCharsRetriever";

oFF.FeFormulaProtectedCharsRetriever.REGEX_FIELDS = "\\[.+?\\]";
oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_COMMA = "(\\d+)(,)(\\d+)|(\\d+)(,)";
oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_DOT = "(\\d+)(\\.)(\\d+)|(\\d+)(\\.)";
oFF.FeFormulaProtectedCharsRetriever.REGEX_STRINGS = "\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'";
oFF.FeFormulaProtectedCharsRetriever.create = function(protectedCharsPatterns)
{
	let instance = new oFF.FeFormulaProtectedCharsRetriever();
	instance.m_protectedCharsPatterns = protectedCharsPatterns;
	return instance;
};
oFF.FeFormulaProtectedCharsRetriever.prototype.m_protectedCharsPatterns = null;
oFF.FeFormulaProtectedCharsRetriever.prototype.getProtectedChars = function(text)
{
	let protectedCommas = oFF.XList.create();
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		return protectedCommas;
	}
	oFF.XCollectionUtils.forEach(this.m_protectedCharsPatterns, (pattern) => {
		protectedCommas.addAll(this.getProtectedCharsWithPattern(text, pattern));
	});
	return protectedCommas;
};
oFF.FeFormulaProtectedCharsRetriever.prototype.getProtectedCharsWithPattern = function(internalText, pattern)
{
	let protectedCommas = oFF.XList.create();
	let match = oFF.XRegex.getInstance().getFirstMatch(internalText, pattern);
	while (oFF.notNull(match) && match.getGroup(0) !== null)
	{
		for (let i = match.getGroupStart(0); i < match.getGroupEnd(0); i++)
		{
			protectedCommas.add(oFF.XIntegerValue.create(i));
		}
		match = oFF.XRegex.getInstance().getFirstMatchFrom(internalText, pattern, match.getGroupEnd(0));
	}
	return protectedCommas;
};

oFF.FeGenAiServiceMocked = function() {};
oFF.FeGenAiServiceMocked.prototype = new oFF.XObject();
oFF.FeGenAiServiceMocked.prototype._ff_c = "FeGenAiServiceMocked";

oFF.FeGenAiServiceMocked.create = function()
{
	return new oFF.FeGenAiServiceMocked();
};
oFF.FeGenAiServiceMocked.prototype.explainFormula = function(formulaText)
{
	return this.returnDelayedResponse("This formula is adding two integer values together");
};
oFF.FeGenAiServiceMocked.prototype.generateFormula = function(description)
{
	return this.returnDelayedResponse("2 + 2");
};
oFF.FeGenAiServiceMocked.prototype.returnDelayedResponse = function(response)
{
	return oFF.XPromise.create((resolve, reject) => {
		oFF.XTimeout.timeout(2000, () => {
			resolve(response);
		});
	});
};

oFF.FeFormulaItem = function() {};
oFF.FeFormulaItem.prototype = new oFF.XObject();
oFF.FeFormulaItem.prototype._ff_c = "FeFormulaItem";

oFF.FeFormulaItem.create = function(operator, metadata, category, hintScore)
{
	let instance = new oFF.FeFormulaItem();
	instance.m_operator = oFF.XObjectExt.assertNotNull(operator);
	instance.m_metadata = oFF.XObjectExt.assertNotNull(metadata);
	instance.m_category = oFF.XObjectExt.assertNotNull(category);
	instance.m_hintScore = hintScore;
	return instance;
};
oFF.FeFormulaItem.prototype.m_category = null;
oFF.FeFormulaItem.prototype.m_hintScore = 0;
oFF.FeFormulaItem.prototype.m_metadata = null;
oFF.FeFormulaItem.prototype.m_operator = null;
oFF.FeFormulaItem.prototype.getCategory = function()
{
	return this.m_category;
};
oFF.FeFormulaItem.prototype.getDescription = function()
{
	return this.m_operator.getDescription();
};
oFF.FeFormulaItem.prototype.getDisplayName = function()
{
	return this.m_metadata.getName();
};
oFF.FeFormulaItem.prototype.getHintScore = function()
{
	return this.m_hintScore;
};
oFF.FeFormulaItem.prototype.getMetadata = function()
{
	return this.m_metadata;
};
oFF.FeFormulaItem.prototype.getName = function()
{
	return this.m_operator.getName();
};
oFF.FeFormulaItem.prototype.getSyntax = function()
{
	return this.m_metadata.getSyntax();
};
oFF.FeFormulaItem.prototype.isDeprecated = function()
{
	return this.m_metadata.isDeprecated();
};

oFF.FeFormulaItemProvider = function() {};
oFF.FeFormulaItemProvider.prototype = new oFF.XObject();
oFF.FeFormulaItemProvider.prototype._ff_c = "FeFormulaItemProvider";

oFF.FeFormulaItemProvider.instance = null;
oFF.FeFormulaItemProvider.getInstance = function()
{
	if (oFF.notNull(oFF.FeFormulaItemProvider.instance))
	{
		return oFF.FeFormulaItemProvider.instance;
	}
	oFF.FeFormulaItemProvider.instance = new oFF.FeFormulaItemProvider();
	oFF.FeFormulaItemProvider.instance.validFormulaItems = oFF.XList.create();
	return oFF.FeFormulaItemProvider.instance;
};
oFF.FeFormulaItemProvider.prototype.validFormulaItems = null;
oFF.FeFormulaItemProvider.prototype.getFormulaItem = function(formulaItemName)
{
	let fi = null;
	oFF.XStringUtils.assertNotNullOrEmpty(formulaItemName);
	let formulaItemNameUpperCase = oFF.XString.toUpperCase(formulaItemName);
	let iterator = this.validFormulaItems.getIterator();
	while (iterator.hasNext())
	{
		let next = iterator.next();
		if (oFF.XString.isEqual(next.getDisplayName(), formulaItemNameUpperCase))
		{
			fi = next;
			break;
		}
	}
	return oFF.XOptional.ofNullable(fi);
};
oFF.FeFormulaItemProvider.prototype.setValidFormulaItems = function(validFormulaItems)
{
	this.validFormulaItems = validFormulaItems;
};

oFF.FeCalcCreateCalculationResponse = function() {};
oFF.FeCalcCreateCalculationResponse.prototype = new oFF.XObject();
oFF.FeCalcCreateCalculationResponse.prototype._ff_c = "FeCalcCreateCalculationResponse";

oFF.FeCalcCreateCalculationResponse.create = function(formula)
{
	oFF.XObjectExt.assertNotNull(formula);
	let response = new oFF.FeCalcCreateCalculationResponse();
	response.m_formula = formula;
	return response;
};
oFF.FeCalcCreateCalculationResponse.prototype.m_formula = null;
oFF.FeCalcCreateCalculationResponse.prototype.getCustomMeasures = function()
{
	let typeOfFormula = this.getFormula().getType();
	let customMeasuresList = oFF.XList.create();
	if (typeOfFormula.isTypeOf(oFF.FeFormulaItemType.RESTRICT))
	{
		let feFormulaRestrictedMember = oFF.FeFormulaRestrictedMemberExtended.castRestrict(this.getFormula());
		if (feFormulaRestrictedMember.isPresent())
		{
			let customMeasure = feFormulaRestrictedMember.get().getCustomMeasure();
			if (customMeasure.isPresent())
			{
				let feFormulaCustomMeasure = customMeasure.get();
				customMeasuresList.add(feFormulaCustomMeasure);
			}
		}
	}
	else if (typeOfFormula.isTypeOf(oFF.FeFormulaItemType.FUNCTION))
	{
		oFF.FeFormulaCustomMeasureUtil.collectCustomMeasures(this.getFormula().getChildren(), customMeasuresList);
	}
	return customMeasuresList;
};
oFF.FeCalcCreateCalculationResponse.prototype.getFormula = function()
{
	return this.m_formula;
};

oFF.FeFormulaBaseCustomMeasure = function() {};
oFF.FeFormulaBaseCustomMeasure.prototype = new oFF.XObject();
oFF.FeFormulaBaseCustomMeasure.prototype._ff_c = "FeFormulaBaseCustomMeasure";

oFF.FeFormulaBaseCustomMeasure.prototype.m_dimensionFilters = null;
oFF.FeFormulaBaseCustomMeasure.prototype.m_measureName = null;
oFF.FeFormulaBaseCustomMeasure.prototype.m_name = null;
oFF.FeFormulaBaseCustomMeasure.prototype.getDimensionFilters = function()
{
	return this.m_dimensionFilters;
};
oFF.FeFormulaBaseCustomMeasure.prototype.getMeasureName = function()
{
	return this.m_measureName;
};
oFF.FeFormulaBaseCustomMeasure.prototype.getName = function()
{
	return this.m_name;
};
oFF.FeFormulaBaseCustomMeasure.prototype.setCustomMeasureName = function(customMemberName)
{
	this.m_name = customMemberName;
};

oFF.FeFormulaCustomMeasureAggregationTypeConstants = {

	AVERAGE:"Average",
	AVERAGE_EXCL_NULL:"AverageExclNull",
	MAX:"Max",
	MAX_EXCL_NULL:"MaxExclNull",
	MIN:"Min",
	MIN_EXCL_NULL:"MinExclNull",
	NONE:"NONE",
	SUM:"SUM"
};

oFF.FeFormulaCustomMeasureDimensionFilter = function() {};
oFF.FeFormulaCustomMeasureDimensionFilter.prototype = new oFF.XObject();
oFF.FeFormulaCustomMeasureDimensionFilter.prototype._ff_c = "FeFormulaCustomMeasureDimensionFilter";

oFF.FeFormulaCustomMeasureDimensionFilter.create = function(dimensionName, dimensionValues)
{
	oFF.XObjectExt.assertNotNull(dimensionValues);
	oFF.XObjectExt.assertFalse(dimensionValues.isEmpty());
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(dimensionName);
	let filter = new oFF.FeFormulaCustomMeasureDimensionFilter();
	filter.dimensionName = dimensionName;
	filter.dimensionValues = dimensionValues;
	return filter;
};
oFF.FeFormulaCustomMeasureDimensionFilter.prototype.dimensionName = null;
oFF.FeFormulaCustomMeasureDimensionFilter.prototype.dimensionValues = null;
oFF.FeFormulaCustomMeasureDimensionFilter.prototype.getDimensionName = function()
{
	return this.dimensionName;
};
oFF.FeFormulaCustomMeasureDimensionFilter.prototype.getDimensionValues = function()
{
	return this.dimensionValues.createListCopy();
};

oFF.FeFormulaCustomMeasureUtil = {

	collectCustomMeasures:function(children, customMeasuresList)
	{
			oFF.XObjectExt.assertNotNull(children);
		oFF.XObjectExt.assertNotNull(customMeasuresList);
		oFF.FeFormulaCustomMeasureUtil.processChildren(children, customMeasuresList);
	},
	createAndSetupDimensionFiltersForRestrictedMeasures:function(queryModel, calcStructure, feFormulaCustomMeasure, restrictedMeasure)
	{
			let filterAnd = oFF.QFactory.createFilterAnd(queryModel);
		let dimensionFilters = feFormulaCustomMeasure.getDimensionFilters();
		let iterator = dimensionFilters.getIterator();
		while (iterator.hasNext())
		{
			let dimFilter = iterator.next();
			let dimensionFilter = oFF.FeFormulaCustomMeasureUtil.createDimensionFilter(dimFilter.getDimensionValues(), dimFilter.getDimensionName(), queryModel);
			filterAnd.add(dimensionFilter);
		}
		let keyField = calcStructure.getKeyField();
		let filterOpAccount = oFF.QFactory.createFilterOperationWithOperator(queryModel, keyField, oFF.ComparisonOperator.EQUAL);
		filterOpAccount.getLow().setString(feFormulaCustomMeasure.getMeasureName());
		if (calcStructure.getHierarchy() !== null)
		{
			filterOpAccount.setHierarchyName(calcStructure.getHierarchy().getName());
		}
		filterAnd.add(filterOpAccount);
		restrictedMeasure.getFilter().setComplexRoot(filterAnd);
	},
	createAndSetupRestrictedMeasure:function(calcStructure, feFormulaCustomMeasure, allRestrictedMeasure)
	{
			let customMemberName = feFormulaCustomMeasure.getName();
		let restrictedMeasure = calcStructure.addNewRestrictedMeasure(customMemberName, customMemberName);
		allRestrictedMeasure.add(restrictedMeasure);
		restrictedMeasure.setResultVisibility(oFF.ResultVisibility.HIDDEN);
		return restrictedMeasure;
	},
	createDimensionFilter:function(dimensionValueStrings, dimensionName, queryModel)
	{
			let filterOr = oFF.QFactory.createFilterOr(queryModel);
		let dimensionField = queryModel.getDimensionByName(dimensionName).getKeyField();
		let dimensionValues = dimensionValueStrings.getIterator();
		while (dimensionValues.hasNext())
		{
			let filterOpDimension = oFF.QFactory.createFilterOperationWithOperator(queryModel, dimensionField, oFF.ComparisonOperator.EQUAL);
			filterOpDimension.getLow().setString(dimensionValues.next());
			filterOr.add(filterOpDimension);
		}
		return filterOr;
	},
	createRestrictedMeasures:function(queryModel, calcStructure, customMeasuresList)
	{
			oFF.XObjectExt.assertNotNull(queryModel);
		oFF.XObjectExt.assertNotNull(calcStructure);
		oFF.XObjectExt.assertNotNull(customMeasuresList);
		let allRestrictedMeasures = customMeasuresList.getIterator();
		let allRestrictedMeasure = oFF.XList.create();
		while (allRestrictedMeasures.hasNext())
		{
			let feFormulaCustomMeasure = allRestrictedMeasures.next();
			if (oFF.XString.isEqual(feFormulaCustomMeasure.getType(), oFF.FeRestrict.NAME))
			{
				let restrictedMeasure = oFF.FeFormulaCustomMeasureUtil.createAndSetupRestrictedMeasure(calcStructure, feFormulaCustomMeasure, allRestrictedMeasure);
				oFF.FeFormulaCustomMeasureUtil.createAndSetupDimensionFiltersForRestrictedMeasures(queryModel, calcStructure, feFormulaCustomMeasure, restrictedMeasure);
			}
		}
		return allRestrictedMeasure;
	},
	deleteCustomMeasures:function(calculationIdToDelete, dimension)
	{
			oFF.XObjectExt.assertStringNotNullAndNotEmpty(calculationIdToDelete);
		oFF.XObjectExt.assertNotNull(dimension);
		let structureMember = dimension.getStructureMember(calculationIdToDelete);
		if (oFF.notNull(structureMember))
		{
			let restrictedMeasureNamesOpt = structureMember.getCustomMeasureNames();
			if (restrictedMeasureNamesOpt.isPresent())
			{
				let restrictedMeasuresIterator = restrictedMeasureNamesOpt.get().getIterator();
				while (restrictedMeasuresIterator.hasNext())
				{
					dimension.removeMeasure(restrictedMeasuresIterator.next());
				}
			}
		}
	},
	getCustomMeasureNames:function(restrictedMeasures)
	{
			let restrictedMeasureNames = oFF.XList.create();
		oFF.XStream.of(restrictedMeasures).forEach((measure) => {
			restrictedMeasureNames.add(measure.getName());
		});
		return restrictedMeasureNames;
	},
	isRestrictType:function(component)
	{
			return component.getType().isTypeOf(oFF.FeFormulaItemType.RESTRICT);
	},
	processChildren:function(children, customMeasuresList)
	{
			while (children.hasNext())
		{
			let nextChild = children.next();
			let componentType = nextChild.getComponentType();
			if (componentType.isTypeOf(oFF.OlapComponentType.FORMULA_ITEM_MEMBER) && oFF.FeFormulaCustomMeasureUtil.isRestrictType(nextChild))
			{
				oFF.FeFormulaCustomMeasureUtil.processRestrictType(nextChild, customMeasuresList);
			}
			else if (componentType.isEqualTo(oFF.OlapComponentType.FORMULA_FUNCTION))
			{
				oFF.FeFormulaCustomMeasureUtil.processChildren(nextChild.getChildren(), customMeasuresList);
			}
		}
	},
	processRestrictType:function(nextChild, customMeasuresList)
	{
			let customMeasure = oFF.FeFormulaRestrictedMemberExtended.castRestrict(nextChild).get().getCustomMeasure();
		if (!customMeasure.isPresent())
		{
			return;
		}
		customMeasuresList.add(customMeasure.get());
		oFF.FeFormulaCustomMeasureUtil.processChildren(nextChild.getChildren(), customMeasuresList);
	}
};

oFF.FeFormulaItemsFactory = function() {};
oFF.FeFormulaItemsFactory.prototype = new oFF.XObject();
oFF.FeFormulaItemsFactory.prototype._ff_c = "FeFormulaItemsFactory";

oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE = 10;
oFF.FeFormulaItemsFactory.create = function(datasourceType)
{
	let factory = new oFF.FeFormulaItemsFactory();
	factory.datasourceType = datasourceType;
	return factory;
};
oFF.FeFormulaItemsFactory.prototype.datasourceType = null;
oFF.FeFormulaItemsFactory.prototype.generate = function(operator, metadata, category, hintScore)
{
	oFF.XObjectExt.assertNotNull(operator);
	oFF.XObjectExt.assertNotNull(metadata);
	oFF.XObjectExt.assertNotNull(category);
	return oFF.FeFormulaItem.create(operator, metadata, category, hintScore);
};
oFF.FeFormulaItemsFactory.prototype.getAllFormulaItems = function()
{
	let allAvailableFormulaItems = oFF.XList.create();
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.ADDITION, oFF.FeAddition.create(), oFF.FeFormulaItemCategory.MATHEMATICAL, 103));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SUBTRACTION, oFF.FeSubtraction.create(), oFF.FeFormulaItemCategory.MATHEMATICAL, 102));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.MULTIPLICATION, oFF.FeMultiplication.create(), oFF.FeFormulaItemCategory.MATHEMATICAL, 101));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.DIVISION, oFF.FeDivision.create(), oFF.FeFormulaItemCategory.MATHEMATICAL, 100));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.POWER_OF, oFF.FePowerOperator.create(), oFF.FeFormulaItemCategory.MATHEMATICAL, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SUBTRACTION, oFF.FeSubtraction.create(), oFF.FeFormulaItemCategory.TRANSIENT, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SUBTRACTION, oFF.FeUnaryMinus.create(), oFF.FeFormulaItemCategory.TRANSIENT, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FeTransientFormulaOperator.PARENTHESIS_GROUP, oFF.FeParenthesis.create(), oFF.FeFormulaItemCategory.TRANSIENT, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.AND, oFF.FeAnd.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.OR, oFF.FeOr.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 0));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.EQ, oFF.FeEqual.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 115));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.NE, oFF.FeNotEqual.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 114));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.LT, oFF.FeLessThan.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 112));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.LE, oFF.FeLessThanEqual.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 110));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.GT, oFF.FeGreaterThan.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 113));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.GE, oFF.FeGreaterThanEqual.create(), oFF.FeFormulaItemCategory.CONDITIONAL, 111));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.IF, oFF.FeIf.create(), oFF.FeFormulaItemCategory.LOGICAL, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.NOT, oFF.FeNot.create(), oFF.FeFormulaItemCategory.LOGICAL, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.ABS, oFF.FeAbs.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.EXP, oFF.FeExp.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SQRT, oFF.FeSqrt.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.MOD_MDS, oFF.FeMod.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FeTransientFormulaOperator.POWER, oFF.FePowerFunction.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.GRAND_TOTAL, oFF.FeGrandTotal.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.LOG, oFF.FeLog.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.LOG_10, oFF.FeLog10.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.TRUNCATE, oFF.FeTruncBW.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.TRUNCATE, oFF.FeTruncHana.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.INT, oFF.FeIntBW.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.INT, oFF.FeIntHana.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.DECFLOAT, oFF.FeDecfloatHana.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.DECFLOAT, oFF.FeDecfloatBW.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.MIN, oFF.FeMin.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.MAX, oFF.FeMax.create(), oFF.FeFormulaItemCategory.MATHEMATICAL_FN, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.ISNULL, oFF.FeIsNull.create(), oFF.FeFormulaItemCategory.LOGICAL, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CEIL, oFF.FeCeil.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.ROUND, oFF.FeRound.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.DOUBLE, oFF.FeDouble.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.FLOOR, oFF.FeFloor.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.FLOAT, oFF.FeFloat.create(), oFF.FeFormulaItemCategory.CONVERSION, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.PERCENT_GRAND_TOTAL, oFF.FePercentOfGrandTotalBW.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.PERCENT_GRAND_TOTAL, oFF.FePercentOfGrandTotalHana.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FeTransientFormulaOperator.DATE_DIFFERENCE, oFF.FeDateDiff.create(), oFF.FeFormulaItemCategory.DATE_AND_TIME, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CALCDAYSBETWEEN, oFF.FeCalcDaysBetween.create(), oFF.FeFormulaItemCategory.DATE_AND_TIME, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CALCMONTHSBETWEEN, oFF.FeCalcMonthsBetween.create(), oFF.FeFormulaItemCategory.DATE_AND_TIME, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CALCYEARSBETWEEN, oFF.FeCalcYearsBetween.create(), oFF.FeFormulaItemCategory.DATE_AND_TIME, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SUB_TOTAL, oFF.FeSubtotalHana.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.SUB_TOTAL, oFF.FeSubtotalInternal.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FeTransientFormulaOperator.PERCENT_SUB_TOTAL, oFF.FePercentOfSubtotalHana.create(), oFF.FeFormulaItemCategory.BUSINESS, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CELL_VALUE, oFF.FeResultLookup.create(), oFF.FeFormulaItemCategory.LOOKUP_AND_REFERENCE, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FormulaOperator.CELL_VALUE, oFF.FeCellValue.create(), oFF.FeFormulaItemCategory.LOOKUP_AND_REFERENCE, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	allAvailableFormulaItems.add(this.generate(oFF.FeTransientFormulaOperator.RESTRICT, oFF.FeRestrict.create(), oFF.FeFormulaItemCategory.LOOKUP_AND_REFERENCE, oFF.FeFormulaItemsFactory.DEFAULT_FUNCTION_SCORE));
	return allAvailableFormulaItems;
};
oFF.FeFormulaItemsFactory.prototype.getAllSupportedFormulaItems = function()
{
	oFF.FeFormulaItemProvider.getInstance().setValidFormulaItems(this.getSupportedAndInternalFormulaItems());
	return oFF.XStream.of(this.getAllFormulaItems()).filter(this.isValid.bind(this)).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsFactory.prototype.getRequestedSupportedFormulaItems = function(requestedFormulaItems)
{
	oFF.FeFormulaItemProvider.getInstance().setValidFormulaItems(this.getSupportedAndInternalFormulaItems());
	return oFF.XStream.of(this.getAllFormulaItems()).filter((feItem) => {
		return this.isValid(feItem) && requestedFormulaItems.contains(feItem.getDisplayName());
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsFactory.prototype.getSupportedAndInternalFormulaItems = function()
{
	return oFF.XStream.of(this.getAllFormulaItems()).filter((feItem) => {
		return feItem.getMetadata().isSupported(this.datasourceType);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsFactory.prototype.getSupportedFormulaItemsByCategory = function(category)
{
	oFF.FeFormulaItemProvider.getInstance().setValidFormulaItems(this.getSupportedAndInternalFormulaItems());
	return oFF.XStream.of(this.getAllSupportedFormulaItems()).filter((feItem) => {
		return feItem.getCategory().isTypeOf(category);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaItemsFactory.prototype.isValid = function(feItem)
{
	return feItem.getMetadata().isEnabled() && feItem.getMetadata().isSupported(this.datasourceType) && !feItem.getMetadata().isInternalOnly();
};

oFF.FeArgumentMetadata = function() {};
oFF.FeArgumentMetadata.prototype = new oFF.XObject();
oFF.FeArgumentMetadata.prototype._ff_c = "FeArgumentMetadata";

oFF.FeArgumentMetadata.create = function(argumentTypes, isOptional, argumentIndexWithSameType)
{
	oFF.XObjectExt.assertNotNull(argumentTypes);
	oFF.XCollectionUtils.forEach(argumentTypes, (at) => {
		oFF.XObjectExt.assertNotNull(at);
	});
	oFF.XObjectExt.assertTrue(argumentIndexWithSameType >= -1);
	let argMetadata = new oFF.FeArgumentMetadata();
	argMetadata.m_supportedArgumentTypes = oFF.XStream.of(argumentTypes.getValuesAsReadOnlyList()).filter((argType1) => {
		return argType1.supportsGenericTypeValidation();
	}).collect(oFF.XStreamCollector.toList());
	argMetadata.m_argumentTypesSkippingValidation = oFF.XStream.of(argumentTypes.getValuesAsReadOnlyList()).filter((argType2) => {
		return !argType2.supportsGenericTypeValidation();
	}).collect(oFF.XStreamCollector.toList());
	argMetadata.m_isOptional = isOptional;
	argMetadata.m_argIndexSameType = argumentIndexWithSameType;
	return argMetadata;
};
oFF.FeArgumentMetadata.prototype.m_argIndexSameType = 0;
oFF.FeArgumentMetadata.prototype.m_argumentTypesSkippingValidation = null;
oFF.FeArgumentMetadata.prototype.m_isOptional = false;
oFF.FeArgumentMetadata.prototype.m_supportedArgumentTypes = null;
oFF.FeArgumentMetadata.prototype.getArgumentIndexWithSameType = function()
{
	return this.m_argIndexSameType;
};
oFF.FeArgumentMetadata.prototype.getSupportedArgumentTypes = function()
{
	return this.m_supportedArgumentTypes;
};
oFF.FeArgumentMetadata.prototype.isArgumentTypeSkippingGenericErrorValidation = function(argumentType)
{
	oFF.XObjectExt.assertNotNull(argumentType);
	return oFF.XStream.of(this.m_argumentTypesSkippingValidation).anyMatch((supportedType) => {
		return argumentType.isTypeOf(supportedType);
	});
};
oFF.FeArgumentMetadata.prototype.isArgumentTypeSupported = function(argumentType)
{
	oFF.XObjectExt.assertNotNull(argumentType);
	return oFF.XStream.of(this.m_supportedArgumentTypes).anyMatch((supportedType) => {
		return argumentType.isTypeOf(supportedType);
	});
};
oFF.FeArgumentMetadata.prototype.isOptional = function()
{
	return this.m_isOptional;
};
oFF.FeArgumentMetadata.prototype.isRequired = function()
{
	return !this.m_isOptional;
};

oFF.FeArgumentMetadataBuilder = function() {};
oFF.FeArgumentMetadataBuilder.prototype = new oFF.XObject();
oFF.FeArgumentMetadataBuilder.prototype._ff_c = "FeArgumentMetadataBuilder";

oFF.FeArgumentMetadataBuilder.NO_VALUE = -1;
oFF.FeArgumentMetadataBuilder.create = function()
{
	let builder = new oFF.FeArgumentMetadataBuilder();
	builder.m_argTypes = oFF.XSetOfNameObject.create();
	builder.m_isOptional = false;
	builder.m_argIndexSameType = oFF.FeArgumentMetadataBuilder.NO_VALUE;
	return builder;
};
oFF.FeArgumentMetadataBuilder.prototype.m_argIndexSameType = 0;
oFF.FeArgumentMetadataBuilder.prototype.m_argTypes = null;
oFF.FeArgumentMetadataBuilder.prototype.m_isOptional = false;
oFF.FeArgumentMetadataBuilder.prototype.add = function(dataType)
{
	oFF.XObjectExt.assertNotNullExt(dataType, "Data type must be defined");
	this.m_argTypes.add(dataType);
	return this;
};
oFF.FeArgumentMetadataBuilder.prototype.build = function()
{
	oFF.XObjectExt.assertNotNullExt(this.m_argTypes, "Supported argument types not defined");
	oFF.XObjectExt.assertTrueExt(this.m_argTypes.hasElements(), "At least one supported data type is needed");
	return oFF.FeArgumentMetadata.create(this.m_argTypes, this.m_isOptional, this.m_argIndexSameType);
};
oFF.FeArgumentMetadataBuilder.prototype.setArgumentIndexWithSameType = function(argumentIndexWithSameType)
{
	this.m_argIndexSameType = argumentIndexWithSameType;
	return this;
};
oFF.FeArgumentMetadataBuilder.prototype.setOptional = function()
{
	this.m_isOptional = true;
	return this;
};

oFF.FeAbstractSimplifier = function() {};
oFF.FeAbstractSimplifier.prototype = new oFF.XObject();
oFF.FeAbstractSimplifier.prototype._ff_c = "FeAbstractSimplifier";

oFF.FeAbstractSimplifier.prototype.m_args = null;
oFF.FeAbstractSimplifier.prototype.m_feConfiguration = null;
oFF.FeAbstractSimplifier.prototype.m_metadata = null;
oFF.FeAbstractSimplifier.prototype.simplify = function(resultSupplier)
{
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.SIMPLIFY))
	{
		return oFF.XOptional.empty();
	}
	if (!this.validInput())
	{
		return oFF.XOptional.empty();
	}
	try
	{
		let result = resultSupplier();
		if (this.validOutput(result))
		{
			return oFF.XOptional.of(this.wrapResult(result));
		}
	}
	catch (e)
	{
		return oFF.XOptional.empty();
	}
	return oFF.XOptional.empty();
};
oFF.FeAbstractSimplifier.prototype.simplifyOrFallback = function(resultSupplier, fallback)
{
	let result = this.simplify(resultSupplier);
	return result.isPresent() ? result : fallback;
};
oFF.FeAbstractSimplifier.prototype.validInput = function()
{
	return oFF.notNull(this.m_args) && this.m_args.size() >= this.m_metadata.getRequiredArgumentsCount() && this.m_args.size() <= this.m_metadata.getArgumentsCount();
};

oFF.FeAbstractTransformer = function() {};
oFF.FeAbstractTransformer.prototype = new oFF.XObject();
oFF.FeAbstractTransformer.prototype._ff_c = "FeAbstractTransformer";

oFF.FeAbstractTransformer.prototype.m_args = null;
oFF.FeAbstractTransformer.prototype.m_feConfiguration = null;
oFF.FeAbstractTransformer.prototype.m_metadata = null;
oFF.FeAbstractTransformer.prototype.transform = function()
{
	if (!this.validInput())
	{
		return oFF.XOptional.empty();
	}
	return this.transformInternal();
};
oFF.FeAbstractTransformer.prototype.transformOrFallback = function(fallback)
{
	let result = this.transform();
	return result.isPresent() ? result : fallback;
};
oFF.FeAbstractTransformer.prototype.validInput = function()
{
	return oFF.notNull(this.m_args) && this.m_args.size() >= this.m_metadata.getRequiredArgumentsCount() && this.m_args.size() <= this.m_metadata.getArgumentsCount();
};

oFF.FeValidationMessage = function() {};
oFF.FeValidationMessage.prototype = new oFF.XObject();
oFF.FeValidationMessage.prototype._ff_c = "FeValidationMessage";

oFF.FeValidationMessage.create = function(msg)
{
	let instance = new oFF.FeValidationMessage();
	instance.m_msg = msg;
	return instance;
};
oFF.FeValidationMessage.prototype.m_msg = null;
oFF.FeValidationMessage.prototype.getMessage = function()
{
	return this.m_msg.getText();
};
oFF.FeValidationMessage.prototype.getSeverity = function()
{
	return this.m_msg.getSeverity().getName();
};

oFF.FeValidationMessageManager = function() {};
oFF.FeValidationMessageManager.prototype = new oFF.XObject();
oFF.FeValidationMessageManager.prototype._ff_c = "FeValidationMessageManager";

oFF.FeValidationMessageManager.NO_ERROR_CODE = 0;
oFF.FeValidationMessageManager.create = function()
{
	return oFF.FeValidationMessageManager.createWithMessageCollection(oFF.MessageManagerSimple.createMessageManager());
};
oFF.FeValidationMessageManager.createWithMessageCollection = function(messageCollection)
{
	let instance = new oFF.FeValidationMessageManager();
	instance.m_messageCollection = oFF.MessageManagerSimple.createMessageManager();
	instance.m_messageCollection.addAllMessages(messageCollection);
	return instance;
};
oFF.FeValidationMessageManager.prototype.m_messageCollection = null;
oFF.FeValidationMessageManager.prototype.addError = function(msg)
{
	this.m_messageCollection.addError(oFF.FeValidationMessageManager.NO_ERROR_CODE, msg);
	return this;
};
oFF.FeValidationMessageManager.prototype.addInfo = function(msg)
{
	this.m_messageCollection.addInfo(oFF.FeValidationMessageManager.NO_ERROR_CODE, msg);
	return this;
};
oFF.FeValidationMessageManager.prototype.addWarning = function(msg)
{
	this.m_messageCollection.addWarning(oFF.FeValidationMessageManager.NO_ERROR_CODE, msg);
	return this;
};
oFF.FeValidationMessageManager.prototype.getValidationMessages = function()
{
	return oFF.XStream.of(this.m_messageCollection.getMessages()).map((iXMessage) => {
		return oFF.FeValidationMessage.create(iXMessage);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeValidationMessageManager.prototype.getValidationMessagesAsCollection = function()
{
	return this.m_messageCollection;
};

oFF.FeCalculationValidator = function() {};
oFF.FeCalculationValidator.prototype = new oFF.XObject();
oFF.FeCalculationValidator.prototype._ff_c = "FeCalculationValidator";

oFF.FeCalculationValidator.CALCULATION = "Calculation";
oFF.FeCalculationValidator.create = function(maxLength, regexp, measureIds)
{
	let instance = new oFF.FeCalculationValidator();
	instance.m_messageManager = oFF.MessageManagerSimple.createMessageManager();
	instance.m_maxLength = maxLength;
	instance.m_idPredicates = oFF.XList.create();
	instance.m_idPredicates.add(oFF.FeMandatoryStringPredicate.create(oFF.FeErrorCodes.CALCULATION_ID_MANDATORY));
	instance.m_idPredicates.add(oFF.FeUniqueStringPredicate.create(oFF.FeErrorCodes.CALCULATION_ID_EXISTING, measureIds));
	instance.m_idPredicates.add(oFF.FeMaxLengthPredicate.create(oFF.FeErrorCodes.CALCULATION_ID_MAX_LENGTH, maxLength));
	instance.m_idPredicates.add(oFF.FeRegExPredicate.create(oFF.FeErrorCodes.CALCULATION_ID_INVALID_CHARS, regexp));
	instance.m_namePredicates = oFF.XList.create();
	instance.m_namePredicates.add(oFF.FeMaxLengthPredicate.create(oFF.FeErrorCodes.CALCULATION_NAME_MAX_LENGTH, maxLength));
	instance.m_isDirty = true;
	return instance;
};
oFF.FeCalculationValidator.createEmpty = function()
{
	let instance = new oFF.FeCalculationValidator();
	instance.m_messageManager = oFF.MessageManagerSimple.createMessageManager();
	instance.m_idPredicates = oFF.XList.create();
	instance.m_namePredicates = oFF.XList.create();
	instance.m_maxLength = oFF.XInteger.getMaximumValue();
	return instance;
};
oFF.FeCalculationValidator.prototype.m_id = null;
oFF.FeCalculationValidator.prototype.m_idPredicates = null;
oFF.FeCalculationValidator.prototype.m_isDirty = false;
oFF.FeCalculationValidator.prototype.m_maxLength = 0;
oFF.FeCalculationValidator.prototype.m_messageManager = null;
oFF.FeCalculationValidator.prototype.m_name = null;
oFF.FeCalculationValidator.prototype.m_namePredicates = null;
oFF.FeCalculationValidator.prototype.addError = function(predicate)
{
	this.m_messageManager.addErrorExt(oFF.FeCalculationValidator.CALCULATION, predicate.getErrorCode(), predicate.getErrorMsg(), null);
};
oFF.FeCalculationValidator.prototype.getFailingPredicate = function(predicates, text)
{
	return oFF.XStream.of(predicates).find((predicate) => {
		return !predicate.test(text);
	});
};
oFF.FeCalculationValidator.prototype.getMaxLength = function()
{
	return this.m_maxLength;
};
oFF.FeCalculationValidator.prototype.releaseObject = function()
{
	this.m_messageManager.clearMessages();
	this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
	this.m_idPredicates.clear();
	this.m_idPredicates = oFF.XObjectExt.release(this.m_idPredicates);
	this.m_namePredicates.clear();
	this.m_namePredicates = oFF.XObjectExt.release(this.m_namePredicates);
};
oFF.FeCalculationValidator.prototype.setId = function(id)
{
	this.m_id = id;
	this.m_isDirty = true;
};
oFF.FeCalculationValidator.prototype.setName = function(name)
{
	this.m_name = name;
	this.m_isDirty = true;
};
oFF.FeCalculationValidator.prototype.validate = function()
{
	if (this.m_isDirty)
	{
		this.m_messageManager.clearMessages();
		this.validateId();
		this.validateName();
		this.m_isDirty = false;
	}
	return this.m_messageManager;
};
oFF.FeCalculationValidator.prototype.validateId = function()
{
	let failingPredicate = this.getFailingPredicate(this.m_idPredicates, this.m_id);
	if (failingPredicate.isPresent())
	{
		this.addError(failingPredicate.get());
	}
};
oFF.FeCalculationValidator.prototype.validateName = function()
{
	let failingPredicate = this.getFailingPredicate(this.m_namePredicates, this.m_name);
	if (failingPredicate.isPresent())
	{
		this.addError(failingPredicate.get());
	}
};

oFF.FeValidator = function() {};
oFF.FeValidator.prototype = new oFF.XObject();
oFF.FeValidator.prototype._ff_c = "FeValidator";

oFF.FeValidator.create = function(datasource, calculationId, supportedFunctions, supportedOperators, feConfiguration, preferences)
{
	let validator = new oFF.FeValidator();
	validator.m_datasource = oFF.XObjectExt.assertNotNull(datasource);
	validator.m_messageManager = oFF.MessageManagerSimple.createMessageManager();
	validator.m_calculationId = calculationId;
	validator.m_supportedFunctions = supportedFunctions;
	validator.m_supportedOperators = supportedOperators;
	validator.m_feConfiguration = feConfiguration;
	validator.m_preferences = oFF.XObjectExt.assertNotNull(preferences);
	return validator;
};
oFF.FeValidator.prototype.m_calculationId = null;
oFF.FeValidator.prototype.m_datasource = null;
oFF.FeValidator.prototype.m_feConfiguration = null;
oFF.FeValidator.prototype.m_messageManager = null;
oFF.FeValidator.prototype.m_preferences = null;
oFF.FeValidator.prototype.m_supportedFunctions = null;
oFF.FeValidator.prototype.m_supportedOperators = null;
oFF.FeValidator.prototype.getMessages = function()
{
	return this.m_messageManager;
};
oFF.FeValidator.prototype.messageManagerHasInvalidFunctionError = function()
{
	return oFF.XStream.of(this.m_messageManager.getErrors()).anyMatch((message) => {
		return message.getCode() === oFF.FeErrorCodes.FUNCTION_INVALID;
	});
};
oFF.FeValidator.prototype.releaseObject = function()
{
	this.m_datasource = null;
	this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
	this.m_calculationId = null;
	this.m_supportedFunctions = null;
	this.m_supportedOperators = null;
	this.m_feConfiguration = null;
	this.m_preferences = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeValidator.prototype.validateArguments = function(formulaType, args)
{
	oFF.XStringUtils.assertNotNullOrEmpty(formulaType);
	oFF.XObjectExt.assertNotNull(args);
	oFF.XCollectionUtils.forEach(args, (a) => {
		oFF.XObjectExt.assertNotNull(a);
	});
	let messages = oFF.MessageManagerSimple.createMessageManager();
	messages.addAllMessages(oFF.FeFunctionValidator.create(this.m_supportedFunctions, this.m_supportedOperators).validate(formulaType));
	if (!messages.hasErrors())
	{
		messages.addAllMessages(oFF.FeNestedFunctionValidator.create(this.m_datasource).validate(formulaType, args));
		messages.addAllMessages(oFF.FeArgumentValidator.create(this.m_feConfiguration).validate(formulaType, args));
	}
	this.m_messageManager.addAllMessages(messages);
};
oFF.FeValidator.prototype.validateDimension = function(fieldName)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	let messages = oFF.FeDimensionValidator.create(this.m_datasource, this.m_feConfiguration, this.m_preferences.isModelPrefixEnabled()).validate(fieldName);
	this.m_messageManager.addAllMessages(messages);
};
oFF.FeValidator.prototype.validateMember = function(fieldName)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	let messages = oFF.FeMemberValidator.create(this.m_datasource, this.m_calculationId, this.m_feConfiguration, this.m_preferences.isModelPrefixEnabled()).validate(fieldName);
	this.m_messageManager.addAllMessages(messages);
};
oFF.FeValidator.prototype.validateRoot = function(root)
{
	oFF.XObjectExt.assertNotNull(root);
	if (!this.messageManagerHasInvalidFunctionError())
	{
		this.m_messageManager.addAllMessages(oFF.FeRootDataTypeValidator.create().validate(root));
	}
};
oFF.FeValidator.prototype.validateSeparators = function(formula)
{
	this.m_messageManager.addAllMessages(oFF.FeSeparatorValidator.create(formula.isCommaDecimalSeparator()).validate(formula));
};

oFF.FePredicateWithError = function() {};
oFF.FePredicateWithError.prototype = new oFF.XObject();
oFF.FePredicateWithError.prototype._ff_c = "FePredicateWithError";

oFF.FePredicateWithError.prototype.m_errorCode = 0;
oFF.FePredicateWithError.prototype.m_errorMsg = null;
oFF.FePredicateWithError.prototype.getErrorCode = function()
{
	return this.m_errorCode;
};
oFF.FePredicateWithError.prototype.getErrorMsg = function()
{
	return this.m_errorMsg;
};
oFF.FePredicateWithError.prototype.setupInternal = function(errorCode, errorMsg)
{
	this.m_errorCode = errorCode;
	this.m_errorMsg = errorMsg;
};

oFF.FeAbstractRule = function() {};
oFF.FeAbstractRule.prototype = new oFF.XObject();
oFF.FeAbstractRule.prototype._ff_c = "FeAbstractRule";

oFF.FeAbstractRule.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};

oFF.FeFunctionValidator = function() {};
oFF.FeFunctionValidator.prototype = new oFF.XObject();
oFF.FeFunctionValidator.prototype._ff_c = "FeFunctionValidator";

oFF.FeFunctionValidator.create = function(supportedFunctions, supportedOperators)
{
	let ruleValidator = new oFF.FeFunctionValidator();
	ruleValidator.m_supportedFunctions = supportedFunctions;
	ruleValidator.m_supportedOperators = supportedOperators;
	return ruleValidator;
};
oFF.FeFunctionValidator.prototype.m_supportedFunctions = null;
oFF.FeFunctionValidator.prototype.m_supportedOperators = null;
oFF.FeFunctionValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeFunctionValidator.prototype.isInSupportedList = function(supportedList, formulaItem)
{
	return oFF.XCollectionUtils.contains(supportedList, (fItem) => {
		return oFF.XString.isEqual(formulaItem.getName(), fItem.getName());
	});
};
oFF.FeFunctionValidator.prototype.isSupported = function(formulaItem)
{
	let isSupportedFunction = this.isInSupportedList(this.m_supportedFunctions, formulaItem);
	let isSupportedOperator = this.isInSupportedList(this.m_supportedOperators, formulaItem);
	let isTransient = formulaItem.getCategory().isEqualTo(oFF.FeFormulaItemCategory.TRANSIENT);
	return isSupportedFunction || isSupportedOperator || isTransient;
};
oFF.FeFunctionValidator.prototype.validate = function(formulaType)
{
	oFF.XStringUtils.assertNotNullOrEmpty(formulaType);
	let validationMsgs = oFF.MessageManagerSimple.createMessageManager();
	let formulaItem = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(formulaType);
	if (!formulaItem.isPresent() || !this.isSupported(formulaItem.get()))
	{
		validationMsgs.addErrorExt("FUNCTION", oFF.FeErrorCodes.FUNCTION_INVALID, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_FUNCTION, formulaType), null);
	}
	return validationMsgs;
};

oFF.FeNestedFunctionValidator = function() {};
oFF.FeNestedFunctionValidator.prototype = new oFF.XObject();
oFF.FeNestedFunctionValidator.prototype._ff_c = "FeNestedFunctionValidator";

oFF.FeNestedFunctionValidator.create = function(provider)
{
	let ruleValidator = new oFF.FeNestedFunctionValidator();
	ruleValidator.m_provider = oFF.XObjectExt.assertNotNull(provider);
	return ruleValidator;
};
oFF.FeNestedFunctionValidator.prototype.m_provider = null;
oFF.FeNestedFunctionValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeNestedFunctionValidator.prototype.validate = function(formulaType, args)
{
	oFF.XStringUtils.assertNotNullOrEmpty(formulaType);
	oFF.XObjectExt.assertNotNull(args);
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	let formulaItem = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(formulaType);
	if (formulaItem.isPresent())
	{
		let unsupportedNestedFunctions = formulaItem.get().getMetadata().getUnsupportedNestedFunctions();
		if (unsupportedNestedFunctions.hasElements())
		{
			let functionNames = oFF.XStream.of(args).flatMap((arg) => {
				return oFF.XStream.ofString(oFF.FormulaItemUtils.getFunctionNamesFromFormula(arg));
			}).collect(oFF.XStreamCollector.toSetOfString((functionName) => {
				return functionName.getString();
			}));
			let measureNamesInFormula = oFF.XStream.of(args).filter((arg) => {
				return oFF.FeFormulaFunctionExtended.cast(arg).isPresent() || (oFF.FeFormulaMemberExtended.cast(arg).isPresent() && oFF.FeFormulaMemberExtended.cast(arg).get().getFeContext().isPresent());
			}).flatMap((measureOrFunction) => {
				if (oFF.FeFormulaFunctionExtended.cast(measureOrFunction).isPresent())
				{
					return oFF.XStream.ofString(oFF.FeFormulaFunctionExtended.cast(measureOrFunction).get().getNestedMeasureNames());
				}
				else
				{
					let measureNames = oFF.XList.create();
					measureNames.add(oFF.FeFormulaMemberExtended.cast(measureOrFunction).get().getFeContext().get().getId());
					return oFF.XStream.ofString(measureNames);
				}
			}).collect(oFF.XStreamCollector.toSetOfString((measureName) => {
				return measureName.getString();
			}));
			oFF.XStream.ofString(measureNamesInFormula).forEach((measureNameInFormula) => {
				functionNames.addAll(this.m_provider.getFunctionNamesUsedInDependentCalculations(measureNameInFormula.getString()));
			});
			oFF.XStream.ofString(unsupportedNestedFunctions).forEach((unsupportedFunction) => {
				if (functionNames.contains(unsupportedFunction.toString()))
				{
					let replacementList = oFF.XList.create();
					replacementList.add(unsupportedFunction.getString());
					replacementList.add(unsupportedFunction.getString());
					replacementList.add(unsupportedFunction.getString());
					validationMessages.addErrorExt("FUNCTION", oFF.FeErrorCodes.UNSUPPORTED_NESTED_FUNCTION, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_FCT_NESTED, replacementList), null);
				}
			});
		}
	}
	return validationMessages;
};

oFF.FeRootDataTypeValidator = function() {};
oFF.FeRootDataTypeValidator.prototype = new oFF.XObject();
oFF.FeRootDataTypeValidator.prototype._ff_c = "FeRootDataTypeValidator";

oFF.FeRootDataTypeValidator.create = function()
{
	return new oFF.FeRootDataTypeValidator();
};
oFF.FeRootDataTypeValidator.prototype.validate = function(rootFormulaItem)
{
	oFF.XObjectExt.assertNotNull(rootFormulaItem);
	let messages = oFF.MessageManagerSimple.createMessageManager();
	let supportedRootDataTypes = oFF.XList.create();
	supportedRootDataTypes.add(oFF.FeDataType.NUMBER);
	supportedRootDataTypes.add(oFF.FeDataType.MEASURE);
	supportedRootDataTypes.add(oFF.FeDataType.BOOLEAN);
	supportedRootDataTypes.add(oFF.FeDataType.UNKNOWN);
	if (!oFF.XStream.of(supportedRootDataTypes).anyMatch((dataType) => {
		return rootFormulaItem.getReturnType().isTypeOf(dataType);
	}))
	{
		let errorMessageDataTypes = oFF.XList.create();
		errorMessageDataTypes.add(oFF.FeDataType.NUMBER.getName());
		errorMessageDataTypes.add(oFF.FeDataType.BOOLEAN.getName());
		errorMessageDataTypes.add(oFF.FeDataType.STRING.getName());
		messages.addErrorExt("ROOT", oFF.FeErrorCodes.CALCULATION_STRING_AT_ROOT, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholders(oFF.FeI18n.ERROR_STRING_AT_ROOT, errorMessageDataTypes), null);
	}
	return messages;
};

oFF.FeSeparatorValidator = function() {};
oFF.FeSeparatorValidator.prototype = new oFF.XObject();
oFF.FeSeparatorValidator.prototype._ff_c = "FeSeparatorValidator";

oFF.FeSeparatorValidator.ALT_ARG_SEPARATOR = ";";
oFF.FeSeparatorValidator.DEFAULT_ARG_SEPARATOR = ",";
oFF.FeSeparatorValidator.create = function(isCommaDecimalSeparator)
{
	let rule = new oFF.FeSeparatorValidator();
	rule.m_decimalSeparator = isCommaDecimalSeparator ? "," : ".";
	rule.m_argumentSeparator = isCommaDecimalSeparator ? ";" : ",";
	rule.m_isCommaDecimalSeparator = isCommaDecimalSeparator;
	let protectedCharsPatterns = oFF.XList.create();
	protectedCharsPatterns.add(oFF.FeFormulaProtectedCharsRetriever.REGEX_STRINGS);
	protectedCharsPatterns.add(oFF.FeFormulaProtectedCharsRetriever.REGEX_FIELDS);
	protectedCharsPatterns.add(isCommaDecimalSeparator ? oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_COMMA : oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_DOT);
	rule.m_protectedCharsRetriever = oFF.FeFormulaProtectedCharsRetriever.create(protectedCharsPatterns);
	return rule;
};
oFF.FeSeparatorValidator.prototype.m_argumentSeparator = null;
oFF.FeSeparatorValidator.prototype.m_decimalSeparator = null;
oFF.FeSeparatorValidator.prototype.m_isCommaDecimalSeparator = false;
oFF.FeSeparatorValidator.prototype.m_protectedCharsRetriever = null;
oFF.FeSeparatorValidator.prototype.validate = function(formula)
{
	let validationMsgs = oFF.MessageManagerSimple.createMessageManager();
	if (oFF.isNull(formula) || formula.isEmpty())
	{
		return validationMsgs;
	}
	let errorMessage = oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder2(oFF.FeI18n.ERROR_INVALID_DECIMAL_OR_ARGUMENT_SEPARATOR, this.m_decimalSeparator, this.m_argumentSeparator);
	let formulaText = formula.getDisplayText();
	let protectedChars = this.m_protectedCharsRetriever.getProtectedChars(formulaText);
	if (this.m_isCommaDecimalSeparator)
	{
		let match = oFF.XRegex.getInstance().getFirstMatch(formulaText, oFF.FeFormulaProtectedCharsRetriever.REGEX_NUMBER_DOT);
		if (oFF.notNull(match) && match.getGroup(0) !== null && !protectedChars.contains(oFF.XIntegerValue.create(match.getGroupStart(1))))
		{
			validationMsgs.addErrorExt("SEPARATOR", oFF.FeErrorCodes.INVALID_DECIMAL_SEPARATOR, errorMessage, null);
			return validationMsgs;
		}
	}
	for (let i = 0; i < oFF.XString.size(formulaText); i++)
	{
		let currentChar = oFF.XString.substring(formulaText, i, i + 1);
		if (!protectedChars.contains(oFF.XIntegerValue.create(i)) && oFF.XString.isEqual(currentChar, this.m_isCommaDecimalSeparator ? oFF.FeSeparatorValidator.DEFAULT_ARG_SEPARATOR : oFF.FeSeparatorValidator.ALT_ARG_SEPARATOR))
		{
			validationMsgs.addErrorExt("SEPARATOR", oFF.FeErrorCodes.INVALID_DECIMAL_SEPARATOR, errorMessage, null);
			return validationMsgs;
		}
	}
	return validationMsgs;
};

oFF.FeArgumentArrayValidator = function() {};
oFF.FeArgumentArrayValidator.prototype = new oFF.XObject();
oFF.FeArgumentArrayValidator.prototype._ff_c = "FeArgumentArrayValidator";

oFF.FeArgumentArrayValidator.create = function()
{
	return new oFF.FeArgumentArrayValidator();
};
oFF.FeArgumentArrayValidator.prototype.checkArrayContents = function(metadata, args, arrayArgumentPosition)
{
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	if (args.get(arrayArgumentPosition).getReturnType().isTypeOf(oFF.FeDataType.LIST_MIXED))
	{
		let arrayPosition = oFF.XInteger.convertToString(arrayArgumentPosition + 1);
		validationMessages.addErrorExt("ARRAY", oFF.FeErrorCodes.ARGUMENTS_LIST_DIFFERENT_VALUE_TYPES, this.getLocalization().getTextWithPlaceholder2(oFF.FeI18n.ERROR_LIST_DIFFERENT_VALUE_TYPES, arrayPosition, metadata.getName()), null);
	}
	return validationMessages;
};
oFF.FeArgumentArrayValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentArrayValidator.prototype.validate = function(metadata, args)
{
	oFF.XObjectExt.assertNotNullExt(metadata, "Metadata must be given to validate arguments.");
	oFF.XObjectExt.assertNotNullExt(args, "Args object must be given to validate arguments.");
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() >= 2)
	{
		if (args.get(1).getReturnType().isTypeOf(oFF.FeDataType.LIST))
		{
			validationMessages.addAllMessages(this.checkArrayContents(metadata, args, 1));
		}
		else if (args.get(0).getReturnType().isTypeOf(oFF.FeDataType.LIST))
		{
			validationMessages.addAllMessages(this.checkArrayContents(metadata, args, 0));
		}
	}
	return validationMessages;
};

oFF.FeArgumentCountValidator = function() {};
oFF.FeArgumentCountValidator.prototype = new oFF.XObject();
oFF.FeArgumentCountValidator.prototype._ff_c = "FeArgumentCountValidator";

oFF.FeArgumentCountValidator.NO_ERROR_MESSAGE = "";
oFF.FeArgumentCountValidator.create = function()
{
	return new oFF.FeArgumentCountValidator();
};
oFF.FeArgumentCountValidator.prototype.getArgumentCountMismatchMessage = function(metadata, args)
{
	let hasTooManyArguments = args.size() > metadata.getArgumentsCount();
	let hasTooFewArguments = args.size() < metadata.getRequiredArgumentsCount();
	if (hasTooManyArguments || hasTooFewArguments)
	{
		let locArguments = oFF.XList.create();
		locArguments.add(metadata.getName());
		if (!metadata.hasOptionalArgs())
		{
			locArguments.add(oFF.XInteger.convertToString(metadata.getRequiredArgumentsCount()));
			locArguments.add(oFF.XInteger.convertToString(args.size()));
			return this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH, locArguments);
		}
		else if (metadata.getOptionalArgumentsCount() === 1)
		{
			locArguments.add(oFF.XInteger.convertToString(metadata.getRequiredArgumentsCount()));
			locArguments.add(oFF.XInteger.convertToString(metadata.getArgumentsCount()));
			locArguments.add(oFF.XInteger.convertToString(args.size()));
			return this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH_OR, locArguments);
		}
		if (hasTooFewArguments)
		{
			locArguments.add(oFF.XInteger.convertToString(metadata.getRequiredArgumentsCount() - 1));
			locArguments.add(oFF.XInteger.convertToString(args.size()));
			return this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_NOT_ENOUGH_ARGUMENTS, locArguments);
		}
		locArguments.add(oFF.XInteger.convertToString(metadata.getArgumentsCount() + 1));
		locArguments.add(oFF.XInteger.convertToString(args.size()));
		return this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_TOO_MANY_ARGUMENTS, locArguments);
	}
	return oFF.FeArgumentCountValidator.NO_ERROR_MESSAGE;
};
oFF.FeArgumentCountValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentCountValidator.prototype.validate = function(metadata, args)
{
	oFF.XObjectExt.assertNotNullExt(metadata, "Metadata must be given to validate arguments.");
	oFF.XObjectExt.assertNotNullExt(args, "Args object must be given to validate arguments.");
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	let argumentMismatchMessage = this.getArgumentCountMismatchMessage(metadata, args);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(argumentMismatchMessage))
	{
		validationMessages.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_NUMBER_MISMATCH, argumentMismatchMessage, null);
	}
	return validationMessages;
};

oFF.FeArgumentDataTypeValidator = function() {};
oFF.FeArgumentDataTypeValidator.prototype = new oFF.XObject();
oFF.FeArgumentDataTypeValidator.prototype._ff_c = "FeArgumentDataTypeValidator";

oFF.FeArgumentDataTypeValidator.NO_ARGUMENT_TYPES = "";
oFF.FeArgumentDataTypeValidator.create = function(feConfiguration)
{
	let validator = new oFF.FeArgumentDataTypeValidator();
	validator.m_feConfiguration = feConfiguration;
	return validator;
};
oFF.FeArgumentDataTypeValidator.prototype.m_feConfiguration = null;
oFF.FeArgumentDataTypeValidator.prototype.getDataTypeName = function(dataType)
{
	if (dataType.isEqualTo(oFF.FeDataType.MEASURE))
	{
		return this.m_feConfiguration.getStructureMemberName();
	}
	return dataType.getName();
};
oFF.FeArgumentDataTypeValidator.prototype.getExpectedArgumentsTypes = function(supportedArgumentTypes)
{
	let expectedDataTypes = oFF.XStream.of(supportedArgumentTypes).filter(this.isBasicTypeSupported.bind(this)).mapToString(this.getDataTypeName.bind(this)).collect(oFF.XStreamCollector.toListOfString((dataType) => {
		return dataType.getString();
	}));
	if (expectedDataTypes.isEmpty())
	{
		if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_FILTERS) && supportedArgumentTypes.contains(oFF.FeDataType.DIMENSION_FILTER))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.DIMENSION_FILTER));
		}
		else if (supportedArgumentTypes.contains(oFF.FeDataType.MEASURE))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.MEASURE));
		}
		else if (this.m_feConfiguration.dimensionsSupported() && supportedArgumentTypes.contains(oFF.FeDataType.DIMENSION))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.DIMENSION));
		}
		else if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF) && supportedArgumentTypes.contains(oFF.FeDataType.DATE_DIMENSION))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.DATE_DIMENSION));
		}
		else if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF) && supportedArgumentTypes.contains(oFF.FeDataType.DATE))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.DATE));
		}
		else if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF) && supportedArgumentTypes.contains(oFF.FeDataType.GRANULARITY))
		{
			expectedDataTypes.add(this.getDataTypeName(oFF.FeDataType.GRANULARITY));
		}
		else
		{
			return oFF.FeArgumentDataTypeValidator.NO_ARGUMENT_TYPES;
		}
	}
	if (expectedDataTypes.size() === 1)
	{
		return expectedDataTypes.get(0);
	}
	let locArgs = oFF.XList.create();
	locArgs.add(expectedDataTypes.get(0));
	locArgs.add(expectedDataTypes.get(1));
	let expectedDataTypeStr = this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.EXPECTED_DATA_TYPES_OR, locArgs);
	for (let i = 2; i < expectedDataTypes.size(); i++)
	{
		locArgs.clear();
		locArgs.add(expectedDataTypeStr);
		locArgs.add(expectedDataTypes.get(2));
		expectedDataTypeStr = this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.EXPECTED_DATA_TYPES_OR, locArgs);
	}
	return expectedDataTypeStr;
};
oFF.FeArgumentDataTypeValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentDataTypeValidator.prototype.getMismatchedArgsMap = function(metadata, args)
{
	let mismatchedArgsMap = oFF.XHashMapByString.create();
	for (let i = 0; i < args.size(); i++)
	{
		let actualDataType = args.get(i).getReturnType();
		let argMetadataAtPosition = metadata.getArgument(i);
		if (argMetadataAtPosition.isPresent() && !actualDataType.isEqualTo(oFF.FeDataType.UNKNOWN) && !(argMetadataAtPosition.get().isArgumentTypeSupported(actualDataType) || argMetadataAtPosition.get().isArgumentTypeSkippingGenericErrorValidation(actualDataType)))
		{
			let expectedArgumentTypes = this.getExpectedArgumentsTypes(argMetadataAtPosition.get().getSupportedArgumentTypes());
			if (oFF.XStringUtils.isNotNullAndNotEmpty(expectedArgumentTypes))
			{
				if (!mismatchedArgsMap.containsKey(expectedArgumentTypes))
				{
					mismatchedArgsMap.put(expectedArgumentTypes, oFF.XList.create());
				}
				mismatchedArgsMap.getByKey(expectedArgumentTypes).add(oFF.XIntegerValue.create(i));
			}
		}
	}
	return mismatchedArgsMap;
};
oFF.FeArgumentDataTypeValidator.prototype.isBasicTypeSupported = function(supportedArgumentType)
{
	return supportedArgumentType.isEqualTo(oFF.FeDataType.NUMBER) || supportedArgumentType.isEqualTo(oFF.FeDataType.BOOLEAN) || supportedArgumentType.isEqualTo(oFF.FeDataType.STRING);
};
oFF.FeArgumentDataTypeValidator.prototype.releaseObject = function()
{
	this.m_feConfiguration = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeArgumentDataTypeValidator.prototype.validate = function(metadata, args)
{
	oFF.XObjectExt.assertNotNullExt(metadata, "Metadata must be given to validate arguments.");
	oFF.XObjectExt.assertNotNullExt(args, "Args object must be given to validate arguments.");
	let mismatchedArgsMap = this.getMismatchedArgsMap(metadata, args);
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	let mismatchedArgsIterator = mismatchedArgsMap.getKeysAsIterator();
	while (mismatchedArgsIterator.hasNext())
	{
		let expectedArgType = mismatchedArgsIterator.next();
		let argIndexesWithMismatchedType = mismatchedArgsMap.getByKey(expectedArgType);
		if (argIndexesWithMismatchedType.size() === 2)
		{
			let firstArgIndex = argIndexesWithMismatchedType.get(0).getInteger();
			let secondArgIndex = argIndexesWithMismatchedType.get(1).getInteger();
			let locArgs = oFF.XList.create();
			locArgs.add(metadata.getName());
			locArgs.add(oFF.XInteger.convertToString(firstArgIndex + 1));
			locArgs.add(oFF.XInteger.convertToString(secondArgIndex + 1));
			locArgs.add(expectedArgType);
			locArgs.add(this.getDataTypeName(args.get(firstArgIndex).getReturnType()));
			locArgs.add(this.getDataTypeName(args.get(secondArgIndex).getReturnType()));
			validationMessages.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_INVALID_DATA_TYPE, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPES_INVALID, locArgs), null);
		}
		else
		{
			oFF.XCollectionUtils.forEach(argIndexesWithMismatchedType, (argIndex) => {
				let arg = argIndex.getInteger();
				let locArgs = oFF.XList.create();
				locArgs.add(metadata.getName());
				locArgs.add(oFF.XInteger.convertToString(arg + 1));
				locArgs.add(expectedArgType);
				locArgs.add(this.getDataTypeName(args.get(arg).getReturnType()));
				validationMessages.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_INVALID_DATA_TYPE, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPE_INVALID, locArgs), null);
			});
		}
	}
	return validationMessages;
};

oFF.FeArgumentDimensionSupportValidator = function() {};
oFF.FeArgumentDimensionSupportValidator.prototype = new oFF.XObject();
oFF.FeArgumentDimensionSupportValidator.prototype._ff_c = "FeArgumentDimensionSupportValidator";

oFF.FeArgumentDimensionSupportValidator.create = function(feConfiguration)
{
	let validator = new oFF.FeArgumentDimensionSupportValidator();
	validator.m_feConfiguration = feConfiguration;
	return validator;
};
oFF.FeArgumentDimensionSupportValidator.prototype.m_feConfiguration = null;
oFF.FeArgumentDimensionSupportValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentDimensionSupportValidator.prototype.releaseObject = function()
{
	this.m_feConfiguration = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeArgumentDimensionSupportValidator.prototype.validate = function(metadata, args)
{
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) || this.m_feConfiguration.dimensionsSupported())
	{
		return validationMessages;
	}
	oFF.XObjectExt.assertNotNullExt(metadata, "Metadata must be given to validate arguments.");
	oFF.XObjectExt.assertNotNullExt(args, "Args object must be given to validate arguments.");
	for (let i = 0; i < args.size() && metadata.getArgument(i).isPresent(); i++)
	{
		if (args.get(i).getReturnType().isTypeOf(oFF.FeDataType.DIMENSION) && metadata.getArgument(i).get().isArgumentTypeSupported(oFF.FeDataType.DIMENSION))
		{
			validationMessages.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_DIMENSION_NOT_SUPPORTED, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_DIMENSION_NOT_SUPPORTED, metadata.getName()), null);
		}
	}
	return validationMessages;
};

oFF.FeArgumentStringSupportValidator = function() {};
oFF.FeArgumentStringSupportValidator.prototype = new oFF.XObject();
oFF.FeArgumentStringSupportValidator.prototype._ff_c = "FeArgumentStringSupportValidator";

oFF.FeArgumentStringSupportValidator.create = function(feConfiguration)
{
	let validator = new oFF.FeArgumentStringSupportValidator();
	validator.m_feConfiguration = feConfiguration;
	return validator;
};
oFF.FeArgumentStringSupportValidator.prototype.m_feConfiguration = null;
oFF.FeArgumentStringSupportValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentStringSupportValidator.prototype.releaseObject = function()
{
	this.m_feConfiguration = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeArgumentStringSupportValidator.prototype.validate = function(metadata, args)
{
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2) || this.m_feConfiguration.stringsSupported())
	{
		return validationMessages;
	}
	oFF.XObjectExt.assertNotNullExt(metadata, "Metadata must be given to validate arguments.");
	oFF.XObjectExt.assertNotNullExt(args, "Args object must be given to validate arguments.");
	for (let i = 0; i < args.size() && metadata.getArgument(i).isPresent(); i++)
	{
		if (args.get(i).getReturnType().isTypeOf(oFF.FeDataType.STRING) && metadata.getArgument(i).get().isArgumentTypeSupported(oFF.FeDataType.STRING))
		{
			validationMessages.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_STRING_NOT_SUPPORTED, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_STRING_NOT_SUPPORTED, metadata.getName()), null);
		}
	}
	return validationMessages;
};

oFF.FeArgumentValidator = function() {};
oFF.FeArgumentValidator.prototype = new oFF.XObject();
oFF.FeArgumentValidator.prototype._ff_c = "FeArgumentValidator";

oFF.FeArgumentValidator.create = function(feConfiguration)
{
	let ruleValidator = new oFF.FeArgumentValidator();
	ruleValidator.m_feConfiguration = feConfiguration;
	ruleValidator.m_argumentCountValidator = oFF.FeArgumentCountValidator.create();
	ruleValidator.m_argumentStringSupportValidator = oFF.FeArgumentStringSupportValidator.create(feConfiguration);
	ruleValidator.m_argumentDimensionSupportValidator = oFF.FeArgumentDimensionSupportValidator.create(feConfiguration);
	ruleValidator.m_argumentDataTypeValidator = oFF.FeArgumentDataTypeValidator.create(feConfiguration);
	ruleValidator.m_argumentArrayValidator = oFF.FeArgumentArrayValidator.create();
	return ruleValidator;
};
oFF.FeArgumentValidator.prototype.m_argumentArrayValidator = null;
oFF.FeArgumentValidator.prototype.m_argumentCountValidator = null;
oFF.FeArgumentValidator.prototype.m_argumentDataTypeValidator = null;
oFF.FeArgumentValidator.prototype.m_argumentDimensionSupportValidator = null;
oFF.FeArgumentValidator.prototype.m_argumentStringSupportValidator = null;
oFF.FeArgumentValidator.prototype.m_feConfiguration = null;
oFF.FeArgumentValidator.prototype.checkArgsWithSameDataType = function(metadata, args, argDataType, argIndex, argMetadata)
{
	let validationMsgs = oFF.MessageManagerSimple.createMessageManager();
	let argIndexWithSameType = argMetadata.getArgumentIndexWithSameType();
	if (oFF.notNull(argDataType) && !argDataType.isEqualTo(oFF.FeDataType.UNKNOWN) && argIndexWithSameType >= 0 && argIndexWithSameType < args.size())
	{
		let argWithSameDataType = args.get(argIndexWithSameType);
		let arg2DataType = argWithSameDataType.getReturnType();
		if (!arg2DataType.isEqualTo(oFF.FeDataType.UNKNOWN) && !argWithSameDataType.getReturnType().isTypeOf(argDataType) && !oFF.FeDataType.isCompatible(argDataType, arg2DataType))
		{
			let locArgs = oFF.XList.create();
			locArgs.add(metadata.getName());
			locArgs.add(oFF.XInteger.convertToString(argIndexWithSameType + 1));
			locArgs.add(oFF.XInteger.convertToString(argIndex + 1));
			locArgs.add(this.getDataTypeName(arg2DataType));
			locArgs.add(this.getDataTypeName(argDataType));
			validationMsgs.addErrorExt(metadata.getName(), oFF.FeErrorCodes.ARGUMENTS_DATA_TYPE_NOT_MATCHING, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.ERROR_SAME_DATA_TYPE_EXPECTED, locArgs), null);
		}
	}
	return validationMsgs;
};
oFF.FeArgumentValidator.prototype.getDataTypeName = function(dataType)
{
	if (dataType.isEqualTo(oFF.FeDataType.MEASURE))
	{
		return this.m_feConfiguration.getStructureMemberName();
	}
	return dataType.getName();
};
oFF.FeArgumentValidator.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeArgumentValidator.prototype.releaseObject = function()
{
	this.m_feConfiguration = null;
	this.m_argumentCountValidator = oFF.XObjectExt.release(this.m_argumentCountValidator);
	this.m_argumentStringSupportValidator = oFF.XObjectExt.release(this.m_argumentStringSupportValidator);
	this.m_argumentDimensionSupportValidator = oFF.XObjectExt.release(this.m_argumentDimensionSupportValidator);
	this.m_argumentDataTypeValidator = oFF.XObjectExt.release(this.m_argumentDataTypeValidator);
	this.m_argumentArrayValidator = oFF.XObjectExt.release(this.m_argumentArrayValidator);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.FeArgumentValidator.prototype.validate = function(formulaType, args)
{
	oFF.XStringUtils.assertNotNullOrEmpty(formulaType);
	oFF.XObjectExt.assertNotNull(args);
	oFF.XCollectionUtils.forEach(args, (a) => {
		oFF.XObjectExt.assertNotNull(a);
	});
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	let metadata = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(formulaType).get().getMetadata();
	validationMessages.addAllMessages(this.m_argumentCountValidator.validate(metadata, args));
	if (validationMessages.hasErrors())
	{
		return validationMessages;
	}
	validationMessages.addAllMessages(this.m_argumentStringSupportValidator.validate(metadata, args));
	validationMessages.addAllMessages(this.m_argumentDimensionSupportValidator.validate(metadata, args));
	validationMessages.addAllMessages(this.m_argumentDataTypeValidator.validate(metadata, args));
	validationMessages.addAllMessages(this.m_argumentArrayValidator.validate(metadata, args));
	validationMessages.addAllMessages(metadata.validateArguments(args).orElse(null));
	for (let argIndex = 0; argIndex < args.size(); argIndex++)
	{
		let argMetadata = metadata.getArgument(argIndex).get();
		let arg = args.get(argIndex);
		let argDataType = arg.getReturnType();
		validationMessages.addAllMessages(this.checkArgsWithSameDataType(metadata, args, argDataType, argIndex, argMetadata));
	}
	return validationMessages;
};

oFF.FeMemberValidator = function() {};
oFF.FeMemberValidator.prototype = new oFF.XObject();
oFF.FeMemberValidator.prototype._ff_c = "FeMemberValidator";

oFF.FeMemberValidator.create = function(datasource, calculationId, feConfiguration, enableModelPrefix)
{
	let ruleValidator = new oFF.FeMemberValidator();
	ruleValidator.validationRules = oFF.XList.create();
	ruleValidator.validationRules.add(oFF.FeMemberDataTypeRule.create(datasource, feConfiguration, enableModelPrefix));
	ruleValidator.validationRules.add(oFF.FeCyclicalDependencyRule.create(datasource, enableModelPrefix));
	ruleValidator.m_calculationId = calculationId;
	return ruleValidator;
};
oFF.FeMemberValidator.prototype.m_calculationId = null;
oFF.FeMemberValidator.prototype.validationRules = null;
oFF.FeMemberValidator.prototype.validate = function(fieldName)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	let validationMsgs = oFF.MessageManagerSimple.createMessageManager();
	let rulesIterator = this.validationRules.getIterator();
	while (rulesIterator.hasNext())
	{
		rulesIterator.next().apply(fieldName, this.m_calculationId, validationMsgs);
	}
	return validationMsgs;
};

oFF.FeConfigurationAbstract = function() {};
oFF.FeConfigurationAbstract.prototype = new oFF.XObject();
oFF.FeConfigurationAbstract.prototype._ff_c = "FeConfigurationAbstract";

oFF.FeConfigurationAbstract.prototype.m_structureConfiguration = null;
oFF.FeConfigurationAbstract.prototype.getMeasureNotExistsError = function(memberName)
{
	return this.m_structureConfiguration.getMeasureNotExistsError(memberName);
};
oFF.FeConfigurationAbstract.prototype.getStructureMemberName = function()
{
	return this.m_structureConfiguration.getStructureMemberName();
};
oFF.FeConfigurationAbstract.prototype.getStructureName = function()
{
	return this.m_structureConfiguration.getStructureName();
};
oFF.FeConfigurationAbstract.prototype.setupInternal = function(structureType, structureDisplayName)
{
	this.m_structureConfiguration = oFF.FeConfigurationStructureFactory.create(structureType, structureDisplayName);
};

oFF.FeDatasourceMetadataProvider = function() {};
oFF.FeDatasourceMetadataProvider.prototype = new oFF.FeAbstractDatasourceMetadataProvider();
oFF.FeDatasourceMetadataProvider.prototype._ff_c = "FeDatasourceMetadataProvider";

oFF.FeDatasourceMetadataProvider.create = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProvider();
	provider.setupCommon(queryModel, structure);
	return provider;
};
oFF.FeDatasourceMetadataProvider.createPromise = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProvider();
	return provider.setupCommonPromise(queryModel, structure);
};

oFF.FeDatasourceMetadataProviderBW = function() {};
oFF.FeDatasourceMetadataProviderBW.prototype = new oFF.FeAbstractDatasourceMetadataProvider();
oFF.FeDatasourceMetadataProviderBW.prototype._ff_c = "FeDatasourceMetadataProviderBW";

oFF.FeDatasourceMetadataProviderBW.create = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderBW();
	provider.setupCommon(queryModel, structure);
	oFF.XObjectExt.assertTrue(queryModel.getSystemType().isTypeOf(oFF.SystemType.BW));
	return provider;
};
oFF.FeDatasourceMetadataProviderBW.createPromise = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderBW();
	oFF.XObjectExt.assertTrue(queryModel.getSystemType().isTypeOf(oFF.SystemType.BW));
	return provider.setupCommonPromise(queryModel, structure);
};
oFF.FeDatasourceMetadataProviderBW.prototype.getAllDimensions = function()
{
	return oFF.XList.create();
};
oFF.FeDatasourceMetadataProviderBW.prototype.getAllMemberIdsFromStructure = function(structure)
{
	return oFF.XStream.of(structure.getAllStructureMembers()).mapToString((m) => {
		let displayKeyValue = m.getFieldValue(m.getDimension().getDisplayKeyField());
		if (oFF.isNull(displayKeyValue))
		{
			return m.getName();
		}
		else
		{
			let alias = displayKeyValue.getValue().getStringRepresentation();
			alias = oFF.XStringUtils.isNullOrEmpty(alias) ? m.getName() : alias;
			return alias;
		}
	}).collect(oFF.XStreamCollector.toListOfString((m2) => {
		return m2.getStringRepresentation();
	}));
};
oFF.FeDatasourceMetadataProviderBW.prototype.getMemberAlias = function(member)
{
	let preventTechnicalKeys = member.getSession().hasFeature(oFF.FeatureToggleOlap.PREVENT_TECHNICAL_KEYS_IN_UI) && !member.getMemberType().isTypeOf(oFF.MemberType.FORMULA);
	let technicalKey = preventTechnicalKeys ? null : member.getName();
	let displayKeyValue = member.getFieldValue(member.getDimension().getDisplayKeyField());
	if (oFF.isNull(displayKeyValue))
	{
		return technicalKey;
	}
	let alias = displayKeyValue.getValue().getStringRepresentation();
	return oFF.XStringUtils.isNullOrEmpty(alias) ? technicalKey : alias;
};
oFF.FeDatasourceMetadataProviderBW.prototype.getStructureType = function()
{
	if (this.m_queryModel.getSecondaryCalculationDimension() === this.m_structure)
	{
		return oFF.FeStructureType.STRUCTURE;
	}
	return oFF.FeStructureType.MEASURE;
};

oFF.FeDatasourceMetadataProviderInternalImpl = function() {};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype = new oFF.XObject();
oFF.FeDatasourceMetadataProviderInternalImpl.prototype._ff_c = "FeDatasourceMetadataProviderInternalImpl";

oFF.FeDatasourceMetadataProviderInternalImpl.NOT_IN_HIERARCHIES = "#NotInHierarchies#";
oFF.FeDatasourceMetadataProviderInternalImpl.create = function(dataProvider)
{
	return oFF.FeDatasourceMetadataProviderInternalImpl.createExt(dataProvider, null);
};
oFF.FeDatasourceMetadataProviderInternalImpl.createExt = function(dataProvider, editingCalculationId)
{
	let instance = new oFF.FeDatasourceMetadataProviderInternalImpl();
	instance.m_dataProvider = dataProvider;
	instance.m_editingCalculationId = editingCalculationId;
	return instance;
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_allDimensions = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_dataProvider = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_editingCalculationId = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_measuresInActiveHierarchyMap = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_usableMeasures = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.m_visibleMeasures = null;
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllDimensions = function()
{
	if (oFF.isNull(this.m_allDimensions))
	{
		this.m_allDimensions = oFF.XList.create();
		this.m_allDimensions.addAll(this.m_dataProvider.getAllDimensions());
	}
	return this.m_allDimensions;
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllEditableCalculations = function()
{
	return this.m_dataProvider.getAllEditableCalculations();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllMeasures = function()
{
	return oFF.FeDuplicateAliasHandler.create(this.m_dataProvider.getAllMeasures()).generate();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllMemberIds = function()
{
	return this.m_dataProvider.getAllMemberIds();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllUsableDimensions = function()
{
	return oFF.XStream.of(this.m_dataProvider.getAllDimensions()).filter((d) => {
		return !d.getSelectedProperty().isPresent() && (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATE_DIMENSIONS) || !d.getValueType().isDateLike()) && !d.isVirtual();
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllUsableMeasures = function()
{
	if (oFF.isNull(this.m_usableMeasures))
	{
		let visibleMeasures = this.getAllVisibleMeasures();
		this.m_usableMeasures = oFF.XList.create();
		for (let i = 0; i < visibleMeasures.size(); i++)
		{
			let feM = visibleMeasures.get(i);
			if (!feM.getValueType().isDateLike())
			{
				this.m_usableMeasures.add(feM);
			}
		}
	}
	return this.m_usableMeasures;
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getAllVisibleMeasures = function()
{
	if (oFF.isNull(this.m_visibleMeasures))
	{
		let allMeasures = this.getAllMeasures();
		this.m_visibleMeasures = oFF.XList.create();
		for (let i = 0; i < allMeasures.size(); i++)
		{
			let feM = allMeasures.get(i);
			if (this.isVisibleMeasure(feM))
			{
				this.m_visibleMeasures.add(feM);
			}
		}
	}
	return this.m_visibleMeasures;
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getDatasourceType = function()
{
	return this.m_dataProvider.getDatasourceType();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getDependantMemberIds = function(memberName)
{
	return this.m_dataProvider.getDependantMemberIds(memberName);
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getDimensionByName = function(dimensionName)
{
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		return oFF.XOptional.empty();
	}
	return oFF.XStream.of(this.getAllUsableDimensions()).find((d) => {
		return oFF.XString.isEqual(d.getAlias(), dimensionName);
	});
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getFunctionNamesUsedInDependentCalculations = function(formulaMeasureName)
{
	return this.m_dataProvider.getFunctionNamesUsedInDependentCalculations(formulaMeasureName);
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getMeasureByField = function(field, withPrefixModel)
{
	return oFF.XStream.of(this.getAllUsableMeasures()).find((measure) => {
		return oFF.XString.isEqual(measure.getField(withPrefixModel), field);
	});
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getMeasuresInActiveHierarchy = function()
{
	return this.m_dataProvider.getMeasuresInActiveHierarchy();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getParentDimension = function(dimension)
{
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) || !dimension.getParentId().isPresent())
	{
		return oFF.XOptional.empty();
	}
	return oFF.XStream.of(this.getAllDimensions()).find((d) => {
		return oFF.XString.isEqual(d.generateUniqueKey(), dimension.getParentId().get());
	});
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getStructureDisplayName = function()
{
	return this.m_dataProvider.getStructureDisplayName();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.getStructureType = function()
{
	return this.m_dataProvider.getStructureType();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isHidden = function(feMeasure)
{
	return feMeasure.getResultVisibility() === oFF.FeResultVisibility.HIDDEN;
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isInActiveHierarchy = function(feMeasure)
{
	if (oFF.isNull(this.m_measuresInActiveHierarchyMap))
	{
		this.m_measuresInActiveHierarchyMap = oFF.XHashMapByString.create();
		oFF.XStream.of(this.getMeasuresInActiveHierarchy()).forEach((measureInActiveHierarchy) => {
			this.m_measuresInActiveHierarchyMap.put(measureInActiveHierarchy.getId(), measureInActiveHierarchy);
		});
	}
	return this.m_measuresInActiveHierarchyMap.containsKey(feMeasure.getId());
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isMeasureEditingCalculation = function(feMeasure)
{
	return oFF.notNull(this.m_editingCalculationId) && oFF.XString.isEqual(feMeasure.getAlias(), this.m_editingCalculationId);
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isSacNotInHierarchiesMeasure = function(feMeasure)
{
	return oFF.XString.isEqual(feMeasure.getAlias(), oFF.FeDatasourceMetadataProviderInternalImpl.NOT_IN_HIERARCHIES);
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isValidDimension = function(dimensionName)
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) && this.getDimensionByName(dimensionName).isPresent();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isValidHierarchy = function(dimensionName, hierarchyName)
{
	let dimension = this.getDimensionByName(dimensionName);
	if (!dimension.isPresent())
	{
		return false;
	}
	return dimension.get().getHierarchyByName(hierarchyName).isPresent();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isValidMeasure = function(measureName)
{
	return oFF.XStream.of(this.getAllUsableMeasures()).anyMatch((m) => {
		return oFF.XString.isEqual(m.getAlias(), measureName);
	});
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isValidProperty = function(dimensionName, propertyName)
{
	let dimension = this.getDimensionByName(dimensionName);
	if (!dimension.isPresent())
	{
		return false;
	}
	return dimension.get().getPropertyByAlias(propertyName).isPresent();
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.isVisibleMeasure = function(feMeasure)
{
	return !this.isSacNotInHierarchiesMeasure(feMeasure) && !this.isMeasureEditingCalculation(feMeasure) && this.isInActiveHierarchy(feMeasure) && !this.isHidden(feMeasure);
};
oFF.FeDatasourceMetadataProviderInternalImpl.prototype.releaseObject = function()
{
	this.m_dataProvider = null;
	this.m_editingCalculationId = null;
	if (oFF.notNull(this.m_usableMeasures))
	{
		this.m_usableMeasures.clear();
		this.m_usableMeasures = oFF.XObjectExt.release(this.m_usableMeasures);
	}
	if (oFF.notNull(this.m_visibleMeasures))
	{
		this.m_visibleMeasures.clear();
		this.m_visibleMeasures = oFF.XObjectExt.release(this.m_visibleMeasures);
	}
	if (oFF.notNull(this.m_measuresInActiveHierarchyMap))
	{
		this.m_measuresInActiveHierarchyMap.clear();
		this.m_measuresInActiveHierarchyMap = oFF.XObjectExt.release(this.m_measuresInActiveHierarchyMap);
	}
	if (oFF.notNull(this.m_allDimensions))
	{
		this.m_allDimensions.clear();
		this.m_allDimensions = oFF.XObjectExt.release(this.m_allDimensions);
	}
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.FeDatasourceMetadataProviderModelAccount = function() {};
oFF.FeDatasourceMetadataProviderModelAccount.prototype = new oFF.FeAbstractDatasourceMetadataProvider();
oFF.FeDatasourceMetadataProviderModelAccount.prototype._ff_c = "FeDatasourceMetadataProviderModelAccount";

oFF.FeDatasourceMetadataProviderModelAccount.create = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderModelAccount();
	provider.setupCommon(queryModel, structure);
	oFF.XObjectExt.assertTrueExt(structure.getDimensionType().isEqualTo(oFF.DimensionType.ACCOUNT), "This provider only support account structures");
	return provider;
};
oFF.FeDatasourceMetadataProviderModelAccount.createPromise = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderModelAccount();
	oFF.XObjectExt.assertTrueExt(structure.getDimensionType().isEqualTo(oFF.DimensionType.ACCOUNT), "This provider only support account structures");
	return provider.setupCommonPromise(queryModel, structure);
};
oFF.FeDatasourceMetadataProviderModelAccount.prototype.getMemberAlias = function(member)
{
	return member.getDisplayName();
};
oFF.FeDatasourceMetadataProviderModelAccount.prototype.getMemberDescription = function(member)
{
	return member.getDisplayDescription();
};

oFF.FeDatasourceMetadataProviderModelMeasure = function() {};
oFF.FeDatasourceMetadataProviderModelMeasure.prototype = new oFF.FeAbstractDatasourceMetadataProvider();
oFF.FeDatasourceMetadataProviderModelMeasure.prototype._ff_c = "FeDatasourceMetadataProviderModelMeasure";

oFF.FeDatasourceMetadataProviderModelMeasure.create = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderModelMeasure();
	provider.setupCommon(queryModel, structure);
	oFF.XObjectExt.assertTrue(queryModel.hasUserDefinedMeasures());
	oFF.XObjectExt.assertTrueExt(!structure.getDimensionType().isEqualTo(oFF.DimensionType.ACCOUNT), "This provider handles the measures structure in acquired models");
	return provider;
};
oFF.FeDatasourceMetadataProviderModelMeasure.createPromise = function(queryModel, structure)
{
	let provider = new oFF.FeDatasourceMetadataProviderModelMeasure();
	oFF.XObjectExt.assertTrue(queryModel.hasUserDefinedMeasures());
	oFF.XObjectExt.assertTrueExt(!structure.getDimensionType().isEqualTo(oFF.DimensionType.ACCOUNT), "This provider handles the measures structure in acquired models");
	return provider.setupCommonPromise(queryModel, structure);
};
oFF.FeDatasourceMetadataProviderModelMeasure.prototype.getMemberAlias = function(member)
{
	return member.getDisplayName();
};
oFF.FeDatasourceMetadataProviderModelMeasure.prototype.getMemberDescription = function(member)
{
	return member.getDisplayDescription();
};

oFF.FeHalfYearMemberKeyToShortDateConverter = function() {};
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype = new oFF.FeAbstractDimensionMemberKeyConverter();
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype._ff_c = "FeHalfYearMemberKeyToShortDateConverter";

oFF.FeHalfYearMemberKeyToShortDateConverter.PATTERN_TEMPLATE = "^\\[{{dimensionName}}\\]\\.\\[{{hierarchyName}}\\]\\.\\[\\(all\\)\\]\\.\\[(\\d*)\\]\\.\\[(\\w*)\\]$";
oFF.FeHalfYearMemberKeyToShortDateConverter.create = function(dimension, hierarchyName)
{
	let converter = new oFF.FeHalfYearMemberKeyToShortDateConverter();
	converter.setupInternal(dimension);
	converter.m_hierarchyName = hierarchyName;
	return converter;
};
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype.buildConvertedKeyFromPatternMatch = function(match)
{
	if (oFF.isNull(match) || match.getGroupCount() !== 2)
	{
		return oFF.XOptional.empty();
	}
	return oFF.XOptional.of(oFF.XStringUtils.concatenate2(match.getGroup(1), match.getGroup(2)));
};
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype.getHierarchyName = function()
{
	return this.m_hierarchyName;
};
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype.getPatternTemplate = function()
{
	return oFF.FeHalfYearMemberKeyToShortDateConverter.PATTERN_TEMPLATE;
};
oFF.FeHalfYearMemberKeyToShortDateConverter.prototype.isDimensionValid = function()
{
	return this.m_feDimension.getValueType().isDateLike() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_hierarchyName);
};

oFF.FeHalfYearShortDateToMemberKeyConverter = function() {};
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype = new oFF.FeAbstractDimensionMemberKeyConverter();
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype._ff_c = "FeHalfYearShortDateToMemberKeyConverter";

oFF.FeHalfYearShortDateToMemberKeyConverter.MEMBER_KEY_TEMPLATE = "[{{dimensionName}}].[{{hierarchyName}}].[(all)].[{{group1}}].[{{group2}}]";
oFF.FeHalfYearShortDateToMemberKeyConverter.PATTERN_TEMPLATE = "^(\\d\\d\\d\\d)(H\\d)$";
oFF.FeHalfYearShortDateToMemberKeyConverter.create = function(dimension)
{
	let converter = new oFF.FeHalfYearShortDateToMemberKeyConverter();
	converter.setupInternal(dimension);
	return converter;
};
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype.buildConvertedKeyFromPatternMatch = function(match)
{
	return this.fillPlaceholdersWithMatch(oFF.FeHalfYearShortDateToMemberKeyConverter.MEMBER_KEY_TEMPLATE, match);
};
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype.getHierarchyName = function()
{
	let selectedHierarchy = this.m_feDimension.getSelectedHierarchy();
	if (selectedHierarchy.isPresent())
	{
		return selectedHierarchy.get().getId();
	}
	return this.m_feDimension.getDefaultHierarchy();
};
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype.getPatternTemplate = function()
{
	return oFF.FeHalfYearShortDateToMemberKeyConverter.PATTERN_TEMPLATE;
};
oFF.FeHalfYearShortDateToMemberKeyConverter.prototype.isDimensionValid = function()
{
	return this.m_feDimension.getValueType().isDateLike() && oFF.XStringUtils.isNotNullAndNotEmpty(this.getHierarchyName());
};

oFF.FeFormulaRestrictedMeasure = function() {};
oFF.FeFormulaRestrictedMeasure.prototype = new oFF.FeFormulaBaseCustomMeasure();
oFF.FeFormulaRestrictedMeasure.prototype._ff_c = "FeFormulaRestrictedMeasure";

oFF.FeFormulaRestrictedMeasure.create = function(customMemberName, measureName, dimensionFilters)
{
	oFF.XStringUtils.assertNotNullOrEmpty(customMemberName);
	oFF.XStringUtils.assertNotNullOrEmpty(measureName);
	oFF.XObjectExt.assertNotNull(dimensionFilters);
	let restrictedMeasure = new oFF.FeFormulaRestrictedMeasure();
	restrictedMeasure.m_name = customMemberName;
	restrictedMeasure.m_measureName = measureName;
	restrictedMeasure.m_dimensionFilters = dimensionFilters;
	return restrictedMeasure;
};
oFF.FeFormulaRestrictedMeasure.prototype.getAggregationType = function()
{
	return oFF.FeFormulaCustomMeasureAggregationTypeConstants.NONE;
};
oFF.FeFormulaRestrictedMeasure.prototype.getType = function()
{
	return oFF.FeRestrict.NAME;
};

oFF.FeBooleanToBooleanSimplifier = function() {};
oFF.FeBooleanToBooleanSimplifier.prototype = new oFF.FeAbstractSimplifier();
oFF.FeBooleanToBooleanSimplifier.prototype._ff_c = "FeBooleanToBooleanSimplifier";

oFF.FeBooleanToBooleanSimplifier.create = function(args, feConfiguration, metadata)
{
	let simplifier = new oFF.FeBooleanToBooleanSimplifier();
	simplifier.m_args = args;
	simplifier.m_feConfiguration = feConfiguration;
	simplifier.m_metadata = metadata;
	return simplifier;
};
oFF.FeBooleanToBooleanSimplifier.prototype.validInput = function()
{
	return this.m_feConfiguration.isBooleanSimplifierSupported() && oFF.FeAbstractSimplifier.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).allMatch((arg) => {
		return oFF.FeFormulaItemConstantHelper.isValidBooleanConstant(arg);
	});
};
oFF.FeBooleanToBooleanSimplifier.prototype.validOutput = function(result)
{
	return result.getValueType().isBoolean() && oFF.FeFormulaItemConstantHelper.isValidBoolean(result.getStringRepresentation());
};
oFF.FeBooleanToBooleanSimplifier.prototype.wrapResult = function(result)
{
	return oFF.FeFormulaConstantExtended.createBoolean(oFF.XValueUtil.getBoolean(result, true, true));
};

oFF.FeNumberToBooleanSimplifier = function() {};
oFF.FeNumberToBooleanSimplifier.prototype = new oFF.FeAbstractSimplifier();
oFF.FeNumberToBooleanSimplifier.prototype._ff_c = "FeNumberToBooleanSimplifier";

oFF.FeNumberToBooleanSimplifier.create = function(args, feConfiguration, metadata)
{
	let simplifier = new oFF.FeNumberToBooleanSimplifier();
	simplifier.m_args = args;
	simplifier.m_feConfiguration = feConfiguration;
	simplifier.m_metadata = metadata;
	return simplifier;
};
oFF.FeNumberToBooleanSimplifier.prototype.validInput = function()
{
	return this.m_feConfiguration.isBooleanSimplifierSupported() && oFF.FeAbstractSimplifier.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).allMatch((arg) => {
		return oFF.FeFormulaItemConstantHelper.isValidNumberConstant(arg);
	});
};
oFF.FeNumberToBooleanSimplifier.prototype.validOutput = function(result)
{
	return result.getValueType().isBoolean() && oFF.FeFormulaItemConstantHelper.isValidBoolean(result.getStringRepresentation());
};
oFF.FeNumberToBooleanSimplifier.prototype.wrapResult = function(result)
{
	return oFF.FeFormulaConstantExtended.createBoolean(oFF.XValueUtil.getBoolean(result, true, true));
};

oFF.FeNumberToNumberSimplifier = function() {};
oFF.FeNumberToNumberSimplifier.prototype = new oFF.FeAbstractSimplifier();
oFF.FeNumberToNumberSimplifier.prototype._ff_c = "FeNumberToNumberSimplifier";

oFF.FeNumberToNumberSimplifier.create = function(args, feConfiguration, metadata)
{
	let simplifier = new oFF.FeNumberToNumberSimplifier();
	simplifier.m_args = args;
	simplifier.m_feConfiguration = feConfiguration;
	simplifier.m_metadata = metadata;
	return simplifier;
};
oFF.FeNumberToNumberSimplifier.prototype.validInput = function()
{
	return oFF.FeAbstractSimplifier.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).allMatch((arg) => {
		return oFF.FeFormulaItemConstantHelper.isValidNumberConstant(arg);
	});
};
oFF.FeNumberToNumberSimplifier.prototype.validOutput = function(result)
{
	return result.getValueType().isNumber() && oFF.FeFormulaItemConstantHelper.isValidNumber(result.getStringRepresentation());
};
oFF.FeNumberToNumberSimplifier.prototype.wrapResult = function(result)
{
	let argsForDecFloat = oFF.XList.create();
	argsForDecFloat.add(oFF.FeFormulaConstantExtended.createNumber(result.getStringRepresentation()));
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), argsForDecFloat, this.m_feConfiguration);
};

oFF.FeStringToBooleanSimplifier = function() {};
oFF.FeStringToBooleanSimplifier.prototype = new oFF.FeAbstractSimplifier();
oFF.FeStringToBooleanSimplifier.prototype._ff_c = "FeStringToBooleanSimplifier";

oFF.FeStringToBooleanSimplifier.create = function(args, feConfiguration, metadata)
{
	let simplifier = new oFF.FeStringToBooleanSimplifier();
	simplifier.m_args = args;
	simplifier.m_feConfiguration = feConfiguration;
	simplifier.m_metadata = metadata;
	return simplifier;
};
oFF.FeStringToBooleanSimplifier.prototype.validInput = function()
{
	return this.m_feConfiguration.isBooleanSimplifierSupported() && oFF.FeAbstractSimplifier.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).allMatch((arg) => {
		return oFF.FeFormulaItemConstantHelper.isValidStringConstant(arg);
	});
};
oFF.FeStringToBooleanSimplifier.prototype.validOutput = function(result)
{
	return result.getValueType().isBoolean() && oFF.FeFormulaItemConstantHelper.isValidBoolean(result.getStringRepresentation());
};
oFF.FeStringToBooleanSimplifier.prototype.wrapResult = function(result)
{
	return oFF.FeFormulaConstantExtended.createBoolean(oFF.XValueUtil.getBoolean(result, true, true));
};

oFF.FeStringToStringSimplifier = function() {};
oFF.FeStringToStringSimplifier.prototype = new oFF.FeAbstractSimplifier();
oFF.FeStringToStringSimplifier.prototype._ff_c = "FeStringToStringSimplifier";

oFF.FeStringToStringSimplifier.create = function(args, feConfiguration, metadata)
{
	let simplifier = new oFF.FeStringToStringSimplifier();
	simplifier.m_args = args;
	simplifier.m_feConfiguration = feConfiguration;
	simplifier.m_metadata = metadata;
	return simplifier;
};
oFF.FeStringToStringSimplifier.prototype.validInput = function()
{
	return oFF.FeAbstractSimplifier.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).allMatch((arg) => {
		return oFF.FeFormulaItemConstantHelper.isValidStringConstant(arg);
	});
};
oFF.FeStringToStringSimplifier.prototype.validOutput = function(result)
{
	return result.getValueType().isString() && oFF.FeFormulaItemConstantHelper.isValidString(result.getStringRepresentation());
};
oFF.FeStringToStringSimplifier.prototype.wrapResult = function(result)
{
	return oFF.FeFormulaConstantExtended.createString(result.getStringRepresentation());
};

oFF.FeArrayTransformer = function() {};
oFF.FeArrayTransformer.prototype = new oFF.FeAbstractTransformer();
oFF.FeArrayTransformer.prototype._ff_c = "FeArrayTransformer";

oFF.FeArrayTransformer.create = function(args, feConfiguration, metadata, chainingOperator)
{
	oFF.XObjectExt.assertNotNull(args);
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(chainingOperator);
	let transformer = new oFF.FeArrayTransformer();
	transformer.m_args = args;
	transformer.m_feConfiguration = oFF.XObjectExt.assertNotNull(feConfiguration);
	transformer.m_metadata = oFF.XObjectExt.assertNotNull(metadata);
	transformer.m_chainingOperator = chainingOperator;
	transformer.m_comparisonCondition = metadata.getName();
	return transformer;
};
oFF.FeArrayTransformer.prototype.m_chainingOperator = null;
oFF.FeArrayTransformer.prototype.m_comparisonCondition = null;
oFF.FeArrayTransformer.prototype.createChainedBooleanTree = function(equalityConditions)
{
	let currentChainingNode = null;
	while (equalityConditions.size() > 1)
	{
		let argsForChain = oFF.XList.create();
		argsForChain.add(equalityConditions.removeAt(equalityConditions.size() - 1));
		if (oFF.notNull(currentChainingNode))
		{
			argsForChain.add(currentChainingNode);
		}
		else
		{
			argsForChain.insert(0, equalityConditions.removeAt(equalityConditions.size() - 1));
		}
		currentChainingNode = oFF.FeFormulaFunctionExtended.createFunctionWithName(this.m_chainingOperator, argsForChain, this.m_feConfiguration);
	}
	let argsForRoot = oFF.XList.create();
	argsForRoot.add(equalityConditions.get(0));
	argsForRoot.add(currentChainingNode);
	return oFF.FeFormulaArrayExtended.createArray(this.m_chainingOperator, argsForRoot, this.m_feConfiguration);
};
oFF.FeArrayTransformer.prototype.createEqualityConditions = function(memberItem, formulaList)
{
	oFF.XObjectExt.assertTrue(formulaList.hasElements());
	return oFF.XStream.of(formulaList).map((listElement) => {
		let argsForEqual = oFF.XList.create();
		argsForEqual.add(memberItem);
		argsForEqual.add(listElement);
		return oFF.FeFormulaFunctionExtended.createFunctionWithName(this.m_comparisonCondition, argsForEqual, this.m_feConfiguration);
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeArrayTransformer.prototype.expandTree = function(memberItem, listItem)
{
	this.validateTransformationSettings();
	let formulaList = this.validateListConstant(listItem);
	let equalityConditions = this.createEqualityConditions(memberItem, formulaList.getElements());
	if (equalityConditions.size() === 1)
	{
		return equalityConditions.get(0);
	}
	else if (equalityConditions.size() === 2)
	{
		return oFF.FeFormulaArrayExtended.createArray(this.m_chainingOperator, equalityConditions, this.m_feConfiguration);
	}
	return this.createChainedBooleanTree(equalityConditions);
};
oFF.FeArrayTransformer.prototype.transformInternal = function()
{
	let transformedTree = null;
	if (this.m_args.get(1).getReturnType().isTypeOf(oFF.FeDataType.LIST))
	{
		transformedTree = this.expandTree(this.m_args.get(0), this.m_args.get(1));
	}
	else if (this.m_args.get(0).getReturnType().isTypeOf(oFF.FeDataType.LIST))
	{
		transformedTree = this.expandTree(this.m_args.get(1), this.m_args.get(0));
	}
	return oFF.XOptional.ofNullable(transformedTree);
};
oFF.FeArrayTransformer.prototype.validInput = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) && oFF.FeAbstractTransformer.prototype.validInput.call( this );
};
oFF.FeArrayTransformer.prototype.validateListConstant = function(listItem)
{
	let formulaListOpt = oFF.FeFormulaListConstantExtended.cast(listItem);
	oFF.XObjectExt.assertTrue(formulaListOpt.isPresent());
	return formulaListOpt.get();
};
oFF.FeArrayTransformer.prototype.validateTransformationSettings = function()
{
	oFF.XObjectExt.assertTrue(oFF.XString.isEqual(this.m_comparisonCondition, oFF.FeEqual.NAME) || oFF.XString.isEqual(this.m_comparisonCondition, oFF.FeNotEqual.NAME));
	oFF.XObjectExt.assertTrue(oFF.XString.isEqual(this.m_chainingOperator, oFF.FeOr.NAME) || oFF.XString.isEqual(this.m_chainingOperator, oFF.FeAnd.NAME));
};

oFF.FeDateDimensionTransformer = function() {};
oFF.FeDateDimensionTransformer.prototype = new oFF.FeAbstractTransformer();
oFF.FeDateDimensionTransformer.prototype._ff_c = "FeDateDimensionTransformer";

oFF.FeDateDimensionTransformer.create = function(args, feConfiguration, metadata)
{
	oFF.XObjectExt.assertNotNull(args);
	let transformer = new oFF.FeDateDimensionTransformer();
	transformer.m_args = args;
	transformer.m_feConfiguration = oFF.XObjectExt.assertNotNull(feConfiguration);
	transformer.m_metadata = oFF.XObjectExt.assertNotNull(metadata);
	return transformer;
};
oFF.FeDateDimensionTransformer.prototype.transformInternal = function()
{
	let dimensionArgIndex = oFF.XCollectionUtils.getIndexByMatchingPredicate(this.m_args, (arg) => {
		return arg.getReturnType().isTypeOf(oFF.FeDataType.DATE_DIMENSION);
	});
	let dimensionArg = this.m_args.get(dimensionArgIndex);
	let stringArgIndex = oFF.XCollectionUtils.getIndexByMatchingPredicate(this.m_args, (arg) => {
		return arg.getReturnType().isTypeOf(oFF.FeDataType.STRING);
	});
	let stringArg = this.m_args.get(stringArgIndex);
	let feFormulaAttributeExtOpt = oFF.FeFormulaAttributeExtended.cast(dimensionArg);
	let stringArgValueOpt = stringArg.getConstantValue();
	if (!feFormulaAttributeExtOpt.isPresent() || !stringArgValueOpt.isPresent() || !feFormulaAttributeExtOpt.get().getFeDimension().isPresent())
	{
		return oFF.XOptional.empty();
	}
	let feDimension = feFormulaAttributeExtOpt.get().getFeDimension().get();
	let stringArgValue = stringArgValueOpt.get();
	let convertedStringArgValueOpt = oFF.FeShortDateToMemberKeyConverter.create(feDimension).convert(stringArgValue);
	if (!convertedStringArgValueOpt.isPresent())
	{
		return oFF.XOptional.empty();
	}
	let convertedStringArgValue = convertedStringArgValueOpt.get();
	let convertedStringArg = oFF.FeFormulaConstantExtended.create(convertedStringArgValue, oFF.FeDataType.STRING);
	let transformedArgs = this.m_args.createListCopy();
	transformedArgs.set(stringArgIndex, convertedStringArg);
	return oFF.XOptional.of(oFF.FeFormulaFunctionExtended.createFunctionWithoutPreprocessing(this.m_metadata.getName(), transformedArgs, this.m_feConfiguration));
};
oFF.FeDateDimensionTransformer.prototype.validInput = function()
{
	let argumentsType = oFF.XCollectionUtils.map(this.m_args, (arg) => {
		return arg.getReturnType();
	});
	let hasDateDimension = oFF.XStream.of(argumentsType).anyMatch((type) => {
		return oFF.FeDataType.DATE_DIMENSION.isEqualTo(type);
	});
	let hasStringArg = oFF.XStream.of(argumentsType).anyMatch((type) => {
		return oFF.FeDataType.STRING.isEqualTo(type);
	});
	let hasDimensionMemberArg = oFF.XStream.of(argumentsType).anyMatch((type) => {
		return oFF.FeDataType.DIMENSION_MEMBER.isEqualTo(type);
	});
	return this.m_feConfiguration.dimensionsSupported() && oFF.FeAbstractTransformer.prototype.validInput.call( this ) && hasDateDimension && (hasDimensionMemberArg || hasStringArg);
};

oFF.FeNumericDimensionTransformer = function() {};
oFF.FeNumericDimensionTransformer.prototype = new oFF.FeAbstractTransformer();
oFF.FeNumericDimensionTransformer.prototype._ff_c = "FeNumericDimensionTransformer";

oFF.FeNumericDimensionTransformer.create = function(args, feConfiguration, metadata)
{
	oFF.XObjectExt.assertNotNull(args);
	let transformer = new oFF.FeNumericDimensionTransformer();
	transformer.m_args = args;
	transformer.m_feConfiguration = oFF.XObjectExt.assertNotNull(feConfiguration);
	transformer.m_metadata = oFF.XObjectExt.assertNotNull(metadata);
	return transformer;
};
oFF.FeNumericDimensionTransformer.prototype.transformComparison = function(dimensionItem, otherItem, feConfiguration, comparisonCondition, isDimensionFirst)
{
	oFF.XObjectExt.assertNotNull(dimensionItem);
	oFF.XObjectExt.assertNotNull(otherItem);
	oFF.XObjectExt.assertNotNull(feConfiguration);
	oFF.XObjectExt.assertStringNotNullAndNotEmpty(comparisonCondition);
	let argsForDecfloat = oFF.XList.create();
	argsForDecfloat.add(otherItem);
	let decfloatOtherItem = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeDecfloatAbstract.NAME, argsForDecfloat, feConfiguration);
	let newArgs = oFF.XList.create();
	if (isDimensionFirst)
	{
		newArgs.add(dimensionItem);
		newArgs.add(decfloatOtherItem);
	}
	else
	{
		newArgs.add(decfloatOtherItem);
		newArgs.add(dimensionItem);
	}
	return oFF.FeFormulaFunctionExtended.createFunctionWithoutPreprocessing(comparisonCondition, newArgs, feConfiguration);
};
oFF.FeNumericDimensionTransformer.prototype.transformInternal = function()
{
	let arg0Dim = oFF.FeFormulaAttributeExtended.cast(this.m_args.get(0));
	if (arg0Dim.isPresent())
	{
		let arg0FeDimension = arg0Dim.get().getFeDimension();
		if (arg0FeDimension.isPresent() && arg0FeDimension.get().isNumeric())
		{
			return oFF.XOptional.of(this.transformComparison(arg0Dim.get(), this.m_args.get(1), this.m_feConfiguration, this.m_metadata.getName(), true));
		}
	}
	let arg1Dim = oFF.FeFormulaAttributeExtended.cast(this.m_args.get(1));
	if (arg1Dim.isPresent())
	{
		let arg1FeDimension = arg1Dim.get().getFeDimension();
		if (arg1FeDimension.isPresent() && arg1FeDimension.get().isNumeric())
		{
			return oFF.XOptional.of(this.transformComparison(arg1Dim.get(), this.m_args.get(0), this.m_feConfiguration, this.m_metadata.getName(), false));
		}
	}
	return oFF.XOptional.empty();
};
oFF.FeNumericDimensionTransformer.prototype.validInput = function()
{
	return this.m_feConfiguration.dimensionsSupported() && oFF.FeAbstractTransformer.prototype.validInput.call( this ) && oFF.XStream.of(this.m_args).anyMatch((arg) => {
		return arg.getType().isEqualTo(oFF.FeFormulaItemType.ATTRIBUTE);
	});
};

oFF.FeMandatoryStringPredicate = function() {};
oFF.FeMandatoryStringPredicate.prototype = new oFF.FePredicateWithError();
oFF.FeMandatoryStringPredicate.prototype._ff_c = "FeMandatoryStringPredicate";

oFF.FeMandatoryStringPredicate.ERROR_MSG = "Mandatory";
oFF.FeMandatoryStringPredicate.create = function(errorCode)
{
	let instance = new oFF.FeMandatoryStringPredicate();
	instance.setupInternal(errorCode, oFF.FeMandatoryStringPredicate.ERROR_MSG);
	return instance;
};
oFF.FeMandatoryStringPredicate.prototype.test = function(obj)
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(obj);
};

oFF.FeMaxLengthPredicate = function() {};
oFF.FeMaxLengthPredicate.prototype = new oFF.FePredicateWithError();
oFF.FeMaxLengthPredicate.prototype._ff_c = "FeMaxLengthPredicate";

oFF.FeMaxLengthPredicate.ERROR_MSG = "Max length";
oFF.FeMaxLengthPredicate.create = function(errorCode, maxLength)
{
	oFF.XObjectExt.assertTrueExt(maxLength > 0, "max length > 0");
	let instance = new oFF.FeMaxLengthPredicate();
	instance.m_maxLength = maxLength;
	instance.setupInternal(errorCode, oFF.FeMaxLengthPredicate.ERROR_MSG);
	return instance;
};
oFF.FeMaxLengthPredicate.prototype.m_maxLength = 0;
oFF.FeMaxLengthPredicate.prototype.getMaxLength = function()
{
	return this.m_maxLength;
};
oFF.FeMaxLengthPredicate.prototype.test = function(obj)
{
	return oFF.isNull(obj) || oFF.XString.size(obj) <= this.m_maxLength;
};

oFF.FeRegExPredicate = function() {};
oFF.FeRegExPredicate.prototype = new oFF.FePredicateWithError();
oFF.FeRegExPredicate.prototype._ff_c = "FeRegExPredicate";

oFF.FeRegExPredicate.ERROR_MSG = "Invalid characters";
oFF.FeRegExPredicate.create = function(errorCode, regex)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmptyExt(regex, "regexp must not be empty");
	let instance = new oFF.FeRegExPredicate();
	instance.m_regex = regex;
	instance.setupInternal(errorCode, oFF.FeRegExPredicate.ERROR_MSG);
	return instance;
};
oFF.FeRegExPredicate.prototype.m_regex = null;
oFF.FeRegExPredicate.prototype.test = function(obj)
{
	return oFF.isNull(obj) || oFF.XString.match(obj, this.m_regex);
};

oFF.FeUniqueStringPredicate = function() {};
oFF.FeUniqueStringPredicate.prototype = new oFF.FePredicateWithError();
oFF.FeUniqueStringPredicate.prototype._ff_c = "FeUniqueStringPredicate";

oFF.FeUniqueStringPredicate.ERROR_MSG = "Not Unique";
oFF.FeUniqueStringPredicate.create = function(errorCode, names)
{
	let instance = new oFF.FeUniqueStringPredicate();
	instance.setupInternal(errorCode, oFF.FeUniqueStringPredicate.ERROR_MSG);
	instance.m_names = names;
	return instance;
};
oFF.FeUniqueStringPredicate.prototype.m_names = null;
oFF.FeUniqueStringPredicate.prototype.test = function(obj)
{
	if (oFF.isNull(this.m_names) || oFF.isNull(obj))
	{
		return true;
	}
	for (let i = 0; i < this.m_names.size(); i++)
	{
		if (oFF.XString.isEqual(obj, this.m_names.get(i)))
		{
			return false;
		}
	}
	return true;
};

oFF.FeCyclicalDependencyRule = function() {};
oFF.FeCyclicalDependencyRule.prototype = new oFF.FeAbstractRule();
oFF.FeCyclicalDependencyRule.prototype._ff_c = "FeCyclicalDependencyRule";

oFF.FeCyclicalDependencyRule.create = function(datasource, enableModelPrefix)
{
	let instance = new oFF.FeCyclicalDependencyRule();
	instance.m_datasource = datasource;
	instance.m_enableModelPrefix = enableModelPrefix;
	return instance;
};
oFF.FeCyclicalDependencyRule.prototype.m_datasource = null;
oFF.FeCyclicalDependencyRule.prototype.m_enableModelPrefix = false;
oFF.FeCyclicalDependencyRule.prototype.apply = function(fieldName, currentCalculationId, validationMsgs)
{
	if (!validationMsgs.hasErrors() && oFF.XStringUtils.isNotNullAndNotEmpty(currentCalculationId))
	{
		let memberNameOpt = oFF.FeFieldConverter.getMemberExt(fieldName, this.m_enableModelPrefix);
		let memberName = memberNameOpt.isPresent() ? memberNameOpt.get() : fieldName;
		let dependantObjects = this.m_datasource.getDependantMemberIds(memberName);
		if (oFF.notNull(dependantObjects) && dependantObjects.contains(currentCalculationId))
		{
			let errorMessage = this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_CYCLICAL_DEPENDENCY, memberName);
			validationMsgs.addErrorExt("MEMBER", oFF.FeErrorCodes.CALCULATION_CYCLICAL_DEPENDENCY, errorMessage, null);
		}
	}
};

oFF.FeMemberDataTypeRule = function() {};
oFF.FeMemberDataTypeRule.prototype = new oFF.FeAbstractRule();
oFF.FeMemberDataTypeRule.prototype._ff_c = "FeMemberDataTypeRule";

oFF.FeMemberDataTypeRule.create = function(datasource, feConfiguration, enableModelPrefix)
{
	let rule = new oFF.FeMemberDataTypeRule();
	rule.m_datasource = datasource;
	rule.m_feConfiguration = feConfiguration;
	rule.m_enableModelPrefix = enableModelPrefix;
	return rule;
};
oFF.FeMemberDataTypeRule.prototype.m_datasource = null;
oFF.FeMemberDataTypeRule.prototype.m_enableModelPrefix = false;
oFF.FeMemberDataTypeRule.prototype.m_feConfiguration = null;
oFF.FeMemberDataTypeRule.prototype.apply = function(fieldName, currentCalculationId, validationMsgs)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	let measureNameOpt = oFF.FeFieldConverter.getMemberExt(fieldName, this.m_enableModelPrefix);
	let measureName = measureNameOpt.isPresent() ? measureNameOpt.get() : fieldName;
	let invalidSecondField = oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) && oFF.FeFieldConverter.getSecondField(fieldName).isPresent();
	if (invalidSecondField || !this.isValidMeasure(fieldName, measureName))
	{
		validationMsgs.addErrorExt("MEMBER", oFF.FeErrorCodes.MEMBER_FIELD_ID_INVALID, this.m_feConfiguration.getMeasureNotExistsError(measureName), null);
	}
};
oFF.FeMemberDataTypeRule.prototype.isValidMeasure = function(fieldName, measureName)
{
	return this.m_enableModelPrefix ? this.m_datasource.getMeasureByField(fieldName, this.m_enableModelPrefix).isPresent() : this.m_datasource.isValidMeasure(measureName);
};

oFF.FeConfiguration = function() {};
oFF.FeConfiguration.prototype = new oFF.FeConfigurationAbstract();
oFF.FeConfiguration.prototype._ff_c = "FeConfiguration";

oFF.FeConfiguration.create = function(structureType, structureDisplayName)
{
	let instance = new oFF.FeConfiguration();
	instance.setupInternal(structureType, structureDisplayName);
	return instance;
};
oFF.FeConfiguration.prototype.dimensionsSupported = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT);
};
oFF.FeConfiguration.prototype.hideTechnicalKeys = function()
{
	return false;
};
oFF.FeConfiguration.prototype.isBooleanSimplifierSupported = function()
{
	return true;
};
oFF.FeConfiguration.prototype.isIntSupported = function()
{
	return true;
};
oFF.FeConfiguration.prototype.isTruncTwoArgumentsSupported = function()
{
	return true;
};
oFF.FeConfiguration.prototype.stringsSupported = function()
{
	return true;
};

oFF.FeConfigurationBW = function() {};
oFF.FeConfigurationBW.prototype = new oFF.FeConfigurationAbstract();
oFF.FeConfigurationBW.prototype._ff_c = "FeConfigurationBW";

oFF.FeConfigurationBW.create = function(structureType, structureDisplayName)
{
	let instance = new oFF.FeConfigurationBW();
	instance.setupInternal(structureType, structureDisplayName);
	return instance;
};
oFF.FeConfigurationBW.prototype.dimensionsSupported = function()
{
	return false;
};
oFF.FeConfigurationBW.prototype.hideTechnicalKeys = function()
{
	return true;
};
oFF.FeConfigurationBW.prototype.isBooleanSimplifierSupported = function()
{
	return false;
};
oFF.FeConfigurationBW.prototype.isIntSupported = function()
{
	return false;
};
oFF.FeConfigurationBW.prototype.isTruncTwoArgumentsSupported = function()
{
	return false;
};
oFF.FeConfigurationBW.prototype.stringsSupported = function()
{
	return false;
};

oFF.FeModelComponent = function() {};
oFF.FeModelComponent.prototype = new oFF.XObjectExt();
oFF.FeModelComponent.prototype._ff_c = "FeModelComponent";

oFF.FeModelComponent.MODEL_NAME_ENCLOSE_CHAR = "\"";
oFF.FeModelComponent.MODEL_PREFIX_SEPARATOR = ":";
oFF.FeModelComponent.prototype.m_alias = null;
oFF.FeModelComponent.prototype.m_datasourceName = null;
oFF.FeModelComponent.prototype.m_description = null;
oFF.FeModelComponent.prototype.m_fieldEnd = null;
oFF.FeModelComponent.prototype.m_fieldStart = null;
oFF.FeModelComponent.prototype.m_identifier = null;
oFF.FeModelComponent.prototype.m_parentId = null;
oFF.FeModelComponent.prototype.getAlias = function()
{
	return oFF.notNull(this.m_alias) ? this.m_alias : this.m_identifier;
};
oFF.FeModelComponent.prototype.getDatasourceName = function()
{
	return this.m_datasourceName;
};
oFF.FeModelComponent.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.FeModelComponent.prototype.getField = function(withDatasource)
{
	let stringBuilder = oFF.XStringBuffer.create();
	stringBuilder.append(this.m_fieldStart);
	if (withDatasource && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_datasourceName))
	{
		stringBuilder.append(oFF.FeModelComponent.MODEL_NAME_ENCLOSE_CHAR);
		stringBuilder.append(this.m_datasourceName);
		stringBuilder.append(oFF.FeModelComponent.MODEL_NAME_ENCLOSE_CHAR);
		stringBuilder.append(oFF.FeModelComponent.MODEL_PREFIX_SEPARATOR);
	}
	stringBuilder.append(this.getAlias());
	stringBuilder.append(this.m_fieldEnd);
	return stringBuilder.toString();
};
oFF.FeModelComponent.prototype.getId = function()
{
	return this.m_identifier;
};
oFF.FeModelComponent.prototype.getParentId = function()
{
	return oFF.XOptional.ofNullable(this.m_parentId);
};
oFF.FeModelComponent.prototype.getValueType = function()
{
	return oFF.FeValueType.UNKNOWN;
};
oFF.FeModelComponent.prototype.hasAlias = function()
{
	return oFF.notNull(this.m_alias);
};
oFF.FeModelComponent.prototype.normalizeString = function(text)
{
	if (oFF.XStringUtils.isNullOrEmpty(text))
	{
		return text;
	}
	let normalizedString = oFF.XString.replace(text, "\r\n", " ");
	return oFF.XString.replace(normalizedString, "\n", " ");
};
oFF.FeModelComponent.prototype.releaseObject = function()
{
	this.m_identifier = null;
	this.m_alias = null;
	this.m_description = null;
	this.m_fieldStart = null;
	this.m_fieldEnd = null;
	this.m_parentId = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.FeModelComponent.prototype.setupCommon = function(identifier, alias, description, fieldStart, fieldEnd, parentId)
{
	this.setupCommonExt(identifier, alias, description, fieldStart, fieldEnd, parentId, null);
};
oFF.FeModelComponent.prototype.setupCommonExt = function(identifier, alias, description, fieldStart, fieldEnd, parentId, datasourceName)
{
	this.m_identifier = oFF.XStringUtils.assertNotNullOrEmpty(identifier);
	this.m_alias = alias;
	this.m_description = this.normalizeString(description);
	this.m_fieldStart = oFF.XStringUtils.assertNotNullOrEmpty(fieldStart);
	this.m_fieldEnd = oFF.XStringUtils.assertNotNullOrEmpty(fieldEnd);
	this.m_parentId = parentId;
	this.m_datasourceName = datasourceName;
};

oFF.FePreferences = function() {};
oFF.FePreferences.prototype = new oFF.XObjectExt();
oFF.FePreferences.prototype._ff_c = "FePreferences";

oFF.FePreferences.ALT_ARGUMENT_SEPARATOR = ";";
oFF.FePreferences.DECIMAL_COMMA = ",";
oFF.FePreferences.DECIMAL_PERIOD = ".";
oFF.FePreferences.DECIMAL_SPACE = " ";
oFF.FePreferences.DEFAULT_ARGUMENT_SEPARATOR = ",";
oFF.FePreferences.create = function(userProfile, enableValidation, enableModelPrefix, enableDetails)
{
	let preferences = new oFF.FePreferences();
	let decimalSeparator = oFF.notNull(userProfile) ? oFF.XString.trim(userProfile.getDecimalSeparator()) : null;
	let decimalGroupingSeparator = oFF.notNull(userProfile) ? userProfile.getDecimalGroupingSeparator() : null;
	if (oFF.isNull(decimalSeparator))
	{
		preferences.logWarning("Decimal separator not set in user profile");
	}
	if (oFF.isNull(decimalGroupingSeparator))
	{
		preferences.logWarning("Decimal grouping separator not set in user profile");
	}
	if (!oFF.XString.isEqual(decimalSeparator, oFF.FePreferences.DECIMAL_COMMA) && !oFF.XString.isEqual(decimalSeparator, oFF.FePreferences.DECIMAL_PERIOD))
	{
		preferences.logWarning2("Invalid decimal separator in user profile: ", preferences.m_decimalSeparator);
	}
	if (!oFF.XString.isEqual(decimalGroupingSeparator, oFF.FePreferences.DECIMAL_COMMA) && !oFF.XString.isEqual(decimalGroupingSeparator, oFF.FePreferences.DECIMAL_PERIOD) && !oFF.XString.isEqual(decimalGroupingSeparator, oFF.FePreferences.DECIMAL_SPACE))
	{
		preferences.logWarning2("Invalid decimal grouping separator in user profile: ", preferences.m_decimalGroupingSeparator);
	}
	return oFF.FePreferences.createExt(decimalSeparator, decimalGroupingSeparator, enableValidation, enableModelPrefix, enableDetails);
};
oFF.FePreferences.createDefault = function()
{
	return oFF.FePreferences.createExt(null, null, true, false, true);
};
oFF.FePreferences.createExt = function(decimalSeparator, decimalGroupingSeparator, enableValidation, enableModelPrefix, enableDetails)
{
	let preferences = new oFF.FePreferences();
	preferences.m_decimalSeparator = oFF.XStringUtils.isNullOrEmpty(decimalSeparator) ? oFF.FePreferences.DECIMAL_PERIOD : decimalSeparator;
	preferences.m_decimalGroupingSeparator = oFF.XStringUtils.isNullOrEmpty(decimalGroupingSeparator) ? oFF.FePreferences.DECIMAL_COMMA : decimalGroupingSeparator;
	preferences.m_enableValidation = enableValidation;
	preferences.m_enableModelPrefix = enableModelPrefix;
	preferences.m_enableDetails = enableDetails;
	return preferences;
};
oFF.FePreferences.prototype.m_decimalGroupingSeparator = null;
oFF.FePreferences.prototype.m_decimalSeparator = null;
oFF.FePreferences.prototype.m_enableDetails = false;
oFF.FePreferences.prototype.m_enableModelPrefix = false;
oFF.FePreferences.prototype.m_enableValidation = false;
oFF.FePreferences.prototype.getArgumentSeparator = function()
{
	return this.isCommaDecimalSeparator() ? oFF.FePreferences.ALT_ARGUMENT_SEPARATOR : oFF.FePreferences.DEFAULT_ARGUMENT_SEPARATOR;
};
oFF.FePreferences.prototype.getDecimalGroupingSeparator = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_decimalGroupingSeparator) ? this.m_decimalGroupingSeparator : oFF.FePreferences.DECIMAL_COMMA;
};
oFF.FePreferences.prototype.getDecimalSeparator = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_decimalSeparator) ? this.m_decimalSeparator : oFF.FePreferences.DECIMAL_PERIOD;
};
oFF.FePreferences.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.FePreferences.prototype.isCommaDecimalSeparator = function()
{
	return oFF.XString.isEqual(this.getDecimalSeparator(), oFF.FePreferences.DECIMAL_COMMA);
};
oFF.FePreferences.prototype.isDetailsEnabled = function()
{
	return this.m_enableDetails;
};
oFF.FePreferences.prototype.isModelPrefixEnabled = function()
{
	return this.m_enableModelPrefix;
};
oFF.FePreferences.prototype.isValidationEnabled = function()
{
	return this.m_enableValidation;
};
oFF.FePreferences.prototype.releaseObject = function()
{
	this.m_decimalSeparator = null;
	this.m_decimalGroupingSeparator = null;
	this.m_enableValidation = false;
	this.m_enableModelPrefix = false;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};

oFF.FeGenAiServiceImpl = function() {};
oFF.FeGenAiServiceImpl.prototype = new oFF.XObjectExt();
oFF.FeGenAiServiceImpl.prototype._ff_c = "FeGenAiServiceImpl";

oFF.FeGenAiServiceImpl.EMPTY_STRING = "";
oFF.FeGenAiServiceImpl.EXPLAIN_FORMULA_PATH = "/chat/api/firefly/calculations/explain";
oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_FORMULA = "formula";
oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_FORMULA_DETAILS = "formula_details";
oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_METADATA = "metadata";
oFF.FeGenAiServiceImpl.EXPLAIN_RESONSE_EXPLANATION_KEY = "CALC_FORMULA_EXPLANATION";
oFF.FeGenAiServiceImpl.GENERATE_FORMULA_PATH = "/chat/api/firefly/calculations/generate";
oFF.FeGenAiServiceImpl.GENERATE_REQUEST_DESCRIPTION_KEY = "natural_language_query";
oFF.FeGenAiServiceImpl.GENERATE_REQUEST_FORMULA_DETAILS = "formula_details";
oFF.FeGenAiServiceImpl.GENERATE_REQUEST_METADATA = "metadata";
oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_EXPLANATION_KEY = "FORMULA_EXPLANATION";
oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_DETAILS_KEY = "CALC_FORMULA_CREATION_OUTPUT";
oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_KEY = "CREATED_CALCULATION_FORMULA";
oFF.FeGenAiServiceImpl.METADATA_DIMENSIONS_KEY = "dimensions";
oFF.FeGenAiServiceImpl.METADATA_MEASURES_KEY = "measures";
oFF.FeGenAiServiceImpl.METADATA_MEASURE_DESCRIPTION = "Description";
oFF.FeGenAiServiceImpl.METADATA_MEASURE_NAME = "Name";
oFF.FeGenAiServiceImpl.create = function(process, datasource)
{
	let instance = new oFF.FeGenAiServiceImpl();
	instance.m_process = oFF.XObjectExt.assertNotNull(process);
	instance.datasource = oFF.XObjectExt.assertNotNull(datasource);
	let system = oFF.XStringUtils.assertNotNullOrEmpty(instance.m_process.getEnvironment().getStringByKey(oFF.XEnvironmentConstants.FIREFLY_JUSTASK_SYS));
	instance.log3("System specified='", system, "'");
	let application = instance.m_process.getParentProcess().getApplication();
	let systemLandscape = application.getSystemLandscape();
	instance.systemUrl = oFF.XStringUtils.assertNotNullOrEmpty(systemLandscape.getSystemDescription(system).getUrl());
	instance.log3("System url is '", instance.systemUrl, "'");
	instance.basePath = oFF.XStringUtils.assertNotNullOrEmpty(instance.m_process.getEnvironment().getStringByKey(oFF.XEnvironmentConstants.FIREFLY_JUSTASK_BASE_PATH));
	instance.log3("Base path for JustAsk specified='", instance.basePath, "'");
	return instance;
};
oFF.FeGenAiServiceImpl.prototype.basePath = null;
oFF.FeGenAiServiceImpl.prototype.datasource = null;
oFF.FeGenAiServiceImpl.prototype.m_process = null;
oFF.FeGenAiServiceImpl.prototype.systemUrl = null;
oFF.FeGenAiServiceImpl.prototype.explainFormula = function(formulaText)
{
	if (oFF.XStringUtils.isNullOrEmpty(formulaText))
	{
		return oFF.XPromise.resolve(oFF.FeGenAiServiceImpl.EMPTY_STRING);
	}
	let url = this.getEndpoint(oFF.FeGenAiServiceImpl.EXPLAIN_FORMULA_PATH);
	let jsonContent = oFF.PrFactory.createStructure();
	let formulaDetails = jsonContent.putNewStructure(oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_FORMULA_DETAILS);
	formulaDetails.putString(oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_FORMULA, formulaText);
	formulaDetails.put(oFF.FeGenAiServiceImpl.EXPLAIN_REQUEST_METADATA, this.generateMetadata());
	return this.sendRequest(url, jsonContent).then(this.parseDescriptionJson.bind(this), (error) => {
		throw oFF.XException.createRuntimeException(error.getText());
	});
};
oFF.FeGenAiServiceImpl.prototype.generateFormula = function(description)
{
	if (oFF.XStringUtils.isNullOrEmpty(description))
	{
		return oFF.XPromise.resolve(oFF.FeGenAiServiceImpl.EMPTY_STRING);
	}
	let url = this.getEndpoint(oFF.FeGenAiServiceImpl.GENERATE_FORMULA_PATH);
	let jsonContent = oFF.PrFactory.createStructure();
	let formulaDetails = jsonContent.putNewStructure(oFF.FeGenAiServiceImpl.GENERATE_REQUEST_FORMULA_DETAILS);
	formulaDetails.putString(oFF.FeGenAiServiceImpl.GENERATE_REQUEST_DESCRIPTION_KEY, description);
	formulaDetails.put(oFF.FeGenAiServiceImpl.GENERATE_REQUEST_METADATA, this.generateMetadata());
	return this.sendRequest(url, jsonContent).then(this.parseFormulaJson.bind(this), (error) => {
		throw oFF.XException.createRuntimeException(error.getText());
	});
};
oFF.FeGenAiServiceImpl.prototype.generateMetadata = function()
{
	let metadata = oFF.PrFactory.createStructure();
	let measureDisplayNameList = metadata.putNewList(oFF.FeGenAiServiceImpl.METADATA_MEASURES_KEY);
	oFF.XStream.of(this.datasource.getAllUsableMeasures()).forEach((measure) => {
		let measureJSON = oFF.PrFactory.createStructure();
		measureJSON.putString(oFF.FeGenAiServiceImpl.METADATA_MEASURE_DESCRIPTION, measure.getDescription());
		measureJSON.putString(oFF.FeGenAiServiceImpl.METADATA_MEASURE_NAME, measure.getAlias());
		measureDisplayNameList.add(measureJSON);
	});
	let dimensionStruct = metadata.putNewStructure(oFF.FeGenAiServiceImpl.METADATA_DIMENSIONS_KEY);
	let measureKeyList = dimensionStruct.putNewList(oFF.FeGenAiServiceImpl.METADATA_MEASURES_KEY);
	measureKeyList.addString(oFF.FeGenAiServiceImpl.EMPTY_STRING);
	return metadata;
};
oFF.FeGenAiServiceImpl.prototype.getEndpoint = function(path)
{
	return oFF.XStringUtils.concatenate3(this.systemUrl, this.basePath, path);
};
oFF.FeGenAiServiceImpl.prototype.parseDescriptionJson = function(json)
{
	if (oFF.notNull(json) && !json.isEmpty() && json.containsKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_EXPLANATION_KEY))
	{
		let formulaExplanation = json.getStructureByKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_EXPLANATION_KEY);
		if (formulaExplanation.containsKey(oFF.FeGenAiServiceImpl.EXPLAIN_RESONSE_EXPLANATION_KEY))
		{
			return formulaExplanation.getStringByKey(oFF.FeGenAiServiceImpl.EXPLAIN_RESONSE_EXPLANATION_KEY);
		}
	}
	throw oFF.XException.createRuntimeException("Failed to parse formula explanation response");
};
oFF.FeGenAiServiceImpl.prototype.parseFormulaJson = function(json)
{
	if (oFF.notNull(json) && !json.isEmpty() && json.containsKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_DETAILS_KEY))
	{
		let formulaDetails = json.getStructureByKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_DETAILS_KEY);
		if (formulaDetails.containsKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_KEY))
		{
			return formulaDetails.getStringByKey(oFF.FeGenAiServiceImpl.GENERATE_RESPONSE_FORMULA_KEY);
		}
	}
	if (oFF.notNull(json) && !json.isEmpty())
	{
		return json.toString();
	}
	throw oFF.XException.createRuntimeException("Failed to parse formula generation response");
};
oFF.FeGenAiServiceImpl.prototype.sendRequest = function(url, jsonContent)
{
	let tmpRequest = oFF.HttpRequest.createByUrl(url);
	tmpRequest.setUrl(url);
	tmpRequest.setCorsSecured(false);
	tmpRequest.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	tmpRequest.setProxyType(oFF.ProxyType.NONE);
	tmpRequest.setJsonObject(jsonContent);
	tmpRequest.setTimeout(300000);
	return oFF.XFetch.request(this.m_process, tmpRequest);
};

oFF.FeFormulaItemMetadata = function() {};
oFF.FeFormulaItemMetadata.prototype = new oFF.XObjectExt();
oFF.FeFormulaItemMetadata.prototype._ff_c = "FeFormulaItemMetadata";

oFF.FeFormulaItemMetadata.prototype.m_arguments = null;
oFF.FeFormulaItemMetadata.prototype.getArgument = function(index)
{
	if (oFF.notNull(this.m_arguments) && index < this.m_arguments.size())
	{
		return oFF.XOptional.ofNullable(this.m_arguments.get(index));
	}
	else if (oFF.notNull(this.m_arguments) && index < this.getOptionalArgumentsCount())
	{
		return oFF.XOptional.ofNullable(this.m_arguments.get(this.m_arguments.size() - 1));
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaItemMetadata.prototype.getArgumentsCount = function()
{
	return this.getOptionalArgumentsCount() === oFF.XInteger.getMaximumValue() ? oFF.XInteger.getMaximumValue() : this.m_arguments.size();
};
oFF.FeFormulaItemMetadata.prototype.getDocumentation = function()
{
	return oFF.FeDocBuilder.create().build();
};
oFF.FeFormulaItemMetadata.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.FeFormulaItemMetadata.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.FeFormulaItemMetadata.prototype.getOptionalArgumentsCount = function()
{
	return 0;
};
oFF.FeFormulaItemMetadata.prototype.getReturnType = function(args)
{
	let supportedDataTypes = this.getSupportedReturnTypes();
	return supportedDataTypes.get(0);
};
oFF.FeFormulaItemMetadata.prototype.getUnsupportedNestedFunctions = function()
{
	return oFF.XHashSetOfString.create();
};
oFF.FeFormulaItemMetadata.prototype.hasOptionalArgs = function()
{
	return this.getOptionalArgumentsCount() > 0;
};
oFF.FeFormulaItemMetadata.prototype.isDeprecated = function()
{
	return false;
};
oFF.FeFormulaItemMetadata.prototype.isEnabled = function()
{
	return true;
};
oFF.FeFormulaItemMetadata.prototype.isInternalOnly = function()
{
	return false;
};
oFF.FeFormulaItemMetadata.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW) || datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeFormulaItemMetadata.prototype.requiresExternalSignFlip = function()
{
	return false;
};
oFF.FeFormulaItemMetadata.prototype.showUniqueDimensionsOnly = function()
{
	return false;
};
oFF.FeFormulaItemMetadata.prototype.simplify = function(args, feConfiguration)
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaItemMetadata.prototype.transform = function(args, feConfiguration)
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaItemMetadata.prototype.transformArgs = function(args, feConfiguration)
{
	return args;
};
oFF.FeFormulaItemMetadata.prototype.validateArguments = function(args)
{
	return oFF.XOptional.empty();
};

oFF.FeDimensionValidator = function() {};
oFF.FeDimensionValidator.prototype = new oFF.XObjectExt();
oFF.FeDimensionValidator.prototype._ff_c = "FeDimensionValidator";

oFF.FeDimensionValidator.create = function(datasource, feConfiguration, enableModelPrefix)
{
	let rule = new oFF.FeDimensionValidator();
	rule.m_datasource = datasource;
	rule.m_feConfiguration = feConfiguration;
	rule.m_enableModelPrefix = enableModelPrefix;
	return rule;
};
oFF.FeDimensionValidator.prototype.m_datasource = null;
oFF.FeDimensionValidator.prototype.m_enableModelPrefix = false;
oFF.FeDimensionValidator.prototype.m_feConfiguration = null;
oFF.FeDimensionValidator.prototype.validate = function(fieldName)
{
	oFF.XStringUtils.assertNotNullOrEmpty(fieldName);
	oFF.XObjectExt.assertEquals(oFF.FeFieldConverter.getFieldMemberType(fieldName), oFF.FeDataType.DIMENSION);
	let validationMsgs = oFF.MessageManagerSimple.createMessageManager();
	if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT) || !this.m_feConfiguration.dimensionsSupported())
	{
		return validationMsgs;
	}
	let dimensionName = oFF.FeFieldConverter.getMemberExt(fieldName, this.m_enableModelPrefix);
	let propertyName = oFF.FeFieldConverter.getProperty(fieldName);
	let hierarchyName = oFF.FeFieldConverter.getHierarchy(fieldName);
	let secondFieldName = oFF.FeFieldConverter.getSecondField(fieldName);
	if (!dimensionName.isPresent())
	{
		throw oFF.XException.createIllegalStateException("[FeDimensionValidator] field shouldn't be validated if it doesn't conform to the field syntax");
	}
	else if (!this.m_datasource.isValidDimension(dimensionName.get()))
	{
		let feDimension = oFF.XStream.of(this.m_datasource.getAllDimensions()).find((d) => {
			return oFF.XString.isEqual(d.getAlias(), dimensionName.get());
		});
		if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATE_DIMENSIONS) && feDimension.isPresent() && feDimension.get().getValueType().isDateLike())
		{
			validationMsgs.addErrorExt("DIMENSION", oFF.FeErrorCodes.MEMBER_DATE_DIMENSION_INVALID, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_DATE_DIMENSIONS_NOT_SUPPORTED, dimensionName.get()), null);
		}
		else
		{
			validationMsgs.addErrorExt("DIMENSION", oFF.FeErrorCodes.MEMBER_DIMENSION_FIELD_ID_INVALID, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_DIMENSION, dimensionName.get()), null);
		}
	}
	else if (propertyName.isPresent() && !this.m_datasource.isValidProperty(dimensionName.get(), propertyName.get()))
	{
		let feInvalidProperty = null;
		if (!oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATE_DIMENSIONS))
		{
			let feDimension = this.m_datasource.getDimensionByName(dimensionName.get());
			if (feDimension.isPresent())
			{
				feInvalidProperty = oFF.XCollectionUtils.findFirst(feDimension.get().getInvalidProperties(), (p) => {
					return oFF.XString.isEqual(p.getAlias(), propertyName.get());
				});
			}
		}
		if (oFF.notNull(feInvalidProperty) && feInvalidProperty.getValueType().isDateLike())
		{
			validationMsgs.addErrorExt("PROPERTY", oFF.FeErrorCodes.MEMBER_DATE_DIMENSION_INVALID, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_DATE_DIMENSIONS_NOT_SUPPORTED, propertyName.get()), null);
		}
		else
		{
			validationMsgs.addErrorExt("PROPERTY", oFF.FeErrorCodes.MEMBER_PROPERTY_FIELD_ID_INVALID, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder2(oFF.FeI18n.ERROR_INVALID_PROPERTY, dimensionName.get(), propertyName.get()), null);
		}
	}
	else if (hierarchyName.isPresent() && !this.m_datasource.isValidHierarchy(dimensionName.get(), hierarchyName.get()))
	{
		validationMsgs.addErrorExt("HIERARCHY", oFF.FeErrorCodes.MEMBER_HIERARCHY_FIELD_ID_INVALID, oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder2(oFF.FeI18n.ERROR_INVALID_HIERARCHY, dimensionName.get(), hierarchyName.get()), null);
	}
	else if (secondFieldName.isPresent() && !propertyName.isPresent() && !hierarchyName.isPresent())
	{
		let invalidSecondFieldError = oFF.XStringUtils.isNullOrEmpty(secondFieldName.get()) ? oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.ERROR_INVALID_SECOND_FIELD_EMPTY) : oFF.XLocalizationCenter.getCenter().getTextWithPlaceholder(oFF.FeI18n.ERROR_INVALID_SECOND_FIELD, secondFieldName.get());
		validationMsgs.addErrorExt("SECOND_FIELD", oFF.FeErrorCodes.MEMBER_SECOND_FIELD_ID_INVALID, invalidSecondFieldError, null);
	}
	return validationMsgs;
};

oFF.FeAbstractMeasure = function() {};
oFF.FeAbstractMeasure.prototype = new oFF.FeModelComponent();
oFF.FeAbstractMeasure.prototype._ff_c = "FeAbstractMeasure";

oFF.FeAbstractMeasure.MEASURE_END = "]";
oFF.FeAbstractMeasure.MEASURE_START = "[";
oFF.FeAbstractMeasure.prototype.m_feResultVisibility = null;
oFF.FeAbstractMeasure.prototype.m_structureDimensionName = null;
oFF.FeAbstractMeasure.prototype.m_valueType = null;
oFF.FeAbstractMeasure.prototype.getDimensionName = function()
{
	return this.m_structureDimensionName;
};
oFF.FeAbstractMeasure.prototype.getInternalField = function()
{
	return oFF.XStringUtils.concatenate3(this.m_fieldStart, this.getId(), this.m_fieldEnd);
};
oFF.FeAbstractMeasure.prototype.getResultVisibility = function()
{
	return this.m_feResultVisibility;
};
oFF.FeAbstractMeasure.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.FeAbstractMeasure.prototype.releaseObject = function()
{
	this.m_valueType = null;
	this.m_feResultVisibility = null;
	this.m_structureDimensionName = null;
	oFF.FeModelComponent.prototype.releaseObject.call( this );
};
oFF.FeAbstractMeasure.prototype.setupMeasure = function(identifier, description, alias, valueType, resultVisibility, parentId, structureDimensionName, datasourceName)
{
	this.setupCommonExt(identifier, alias, description, oFF.FeAbstractMeasure.MEASURE_START, oFF.FeAbstractMeasure.MEASURE_END, parentId, datasourceName);
	this.m_valueType = oFF.XObjectExt.assertNotNull(valueType);
	this.m_feResultVisibility = resultVisibility;
	this.m_structureDimensionName = oFF.XStringUtils.assertNotNullOrEmpty(structureDimensionName);
};

oFF.FeDimension = function() {};
oFF.FeDimension.prototype = new oFF.FeModelComponent();
oFF.FeDimension.prototype._ff_c = "FeDimension";

oFF.FeDimension.DEFAULT_SUFFIX = "_DIM";
oFF.FeDimension.DIMENSION_START = "[d/";
oFF.FeDimension.FIELD_END = "]";
oFF.FeDimension.PROPERTY_SUFFIX = "_PROP";
oFF.FeDimension.SEPARATOR = ".";
oFF.FeDimension.VIRTUAL_SUFFIX = "_VIRTUAL";
oFF.FeDimension.cast = function(component)
{
	if (oFF.notNull(component) && component.getType().isTypeOf(oFF.FeModelComponentType.DIMENSION))
	{
		return oFF.XOptional.of(component);
	}
	return oFF.XOptional.empty();
};
oFF.FeDimension.create = function(identifier, alias, description, hierarchies, properties, parentId, hierarchyKeyField, flatKeyField, dimensionType, datasourceName)
{
	oFF.XObjectExt.assertNotNull(hierarchies);
	oFF.XObjectExt.assertNotNull(properties);
	let instance = new oFF.FeDimension();
	instance.setupCommonExt(identifier, alias, description, oFF.FeDimension.DIMENSION_START, oFF.FeDimension.FIELD_END, parentId, datasourceName);
	instance.m_hierarchies = hierarchies;
	instance.m_properties = properties;
	instance.m_defaultHierarchy = oFF.XStream.of(hierarchies).find((h1) => {
		return h1.isDefault();
	}).map((h2) => {
		return h2.getId();
	}).orElse(null);
	instance.m_hierarchyKeyField = oFF.XObjectExt.assertNotNull(hierarchyKeyField);
	instance.m_flatKeyField = oFF.XObjectExt.assertNotNull(flatKeyField);
	instance.m_isVirtual = false;
	instance.m_dimensionType = dimensionType;
	return instance;
};
oFF.FeDimension.createVirtual = function(identifier, description, parentId, datasourceName)
{
	let virtualProperty = oFF.FeProperty.create(oFF.FeDimension.VIRTUAL_SUFFIX, oFF.FeDimension.VIRTUAL_SUFFIX, oFF.FeDimension.VIRTUAL_SUFFIX, oFF.FeDimension.VIRTUAL_SUFFIX, oFF.FeDimension.VIRTUAL_SUFFIX, oFF.FeValueType.UNKNOWN);
	let instance = oFF.FeDimension.create(identifier, identifier, description, oFF.XList.create(), oFF.XList.create(), parentId, virtualProperty, virtualProperty, oFF.FeDimensionType.UNKNOWN, datasourceName);
	instance.m_isVirtual = true;
	return instance;
};
oFF.FeDimension.createWithSelectedHierarchy = function(dimension, selectedHierarchyName)
{
	let selectedHierarchy = oFF.XStream.of(dimension.getHierarchies()).find((h) => {
		return oFF.XString.isEqual(h.getAlias(), selectedHierarchyName);
	});
	if (!selectedHierarchy.isPresent())
	{
		dimension.log4("Hierarchy ", selectedHierarchyName, " not found in dimension ", dimension.getId());
		return dimension;
	}
	let dimWithHier = oFF.FeDimension.create(dimension.getId(), dimension.getAlias(), dimension.getDescription(), dimension.getHierarchies(), dimension.getProperties(), null, dimension.m_hierarchyKeyField, dimension.m_flatKeyField, dimension.m_dimensionType, dimension.getDatasourceName());
	dimWithHier.m_selectedHierarchy = selectedHierarchy.get();
	return dimWithHier;
};
oFF.FeDimension.createWithSelectedProperty = function(dimension, selectedPropertyName)
{
	let selectedProperty = oFF.XStream.of(dimension.getProperties()).find((h) => {
		return oFF.XString.isEqual(h.getAlias(), selectedPropertyName);
	});
	if (!selectedProperty.isPresent())
	{
		dimension.log4("Property ", selectedPropertyName, " not found in dimension ", dimension.getId());
		return dimension;
	}
	let instance = oFF.FeDimension.create(dimension.getId(), dimension.getAlias(), dimension.getDescription(), dimension.getHierarchies(), dimension.getProperties(), dimension.generateUniqueKey(), dimension.m_hierarchyKeyField, dimension.m_flatKeyField, dimension.m_dimensionType, dimension.getDatasourceName());
	instance.m_selectedProperty = selectedProperty.get();
	return instance;
};
oFF.FeDimension.prototype.m_defaultHierarchy = null;
oFF.FeDimension.prototype.m_dimensionType = null;
oFF.FeDimension.prototype.m_flatKeyField = null;
oFF.FeDimension.prototype.m_hierarchies = null;
oFF.FeDimension.prototype.m_hierarchyKeyField = null;
oFF.FeDimension.prototype.m_isVirtual = false;
oFF.FeDimension.prototype.m_properties = null;
oFF.FeDimension.prototype.m_selectedHierarchy = null;
oFF.FeDimension.prototype.m_selectedProperty = null;
oFF.FeDimension.prototype.appendToField = function(buffer, withDatasource)
{
	if (this.getSelectedHierarchy().isPresent())
	{
		buffer.append(oFF.FeDimension.SEPARATOR);
		buffer.append(this.getSelectedHierarchy().get().getField(withDatasource));
	}
	else if (this.getSelectedProperty().isPresent())
	{
		buffer.append(oFF.FeDimension.SEPARATOR);
		buffer.append(this.getSelectedProperty().get().getField(withDatasource));
	}
};
oFF.FeDimension.prototype.generateUniqueKey = function()
{
	if (this.isVirtual())
	{
		return oFF.XStringUtils.concatenate2(this.getId(), oFF.FeDimension.VIRTUAL_SUFFIX);
	}
	else if (this.getSelectedProperty().isPresent())
	{
		return oFF.XStringUtils.concatenate2(this.getSelectedProperty().get().getId(), oFF.FeDimension.PROPERTY_SUFFIX);
	}
	return oFF.XStringUtils.concatenate2(this.getId(), oFF.FeDimension.DEFAULT_SUFFIX);
};
oFF.FeDimension.prototype.getDefaultHierarchy = function()
{
	return this.m_defaultHierarchy;
};
oFF.FeDimension.prototype.getDimensionDescription = function()
{
	let description = null;
	if (this.getSelectedProperty().isPresent())
	{
		let property = this.getSelectedProperty().get();
		description = property.getDescription();
		if (oFF.XStringUtils.isNullOrEmpty(description))
		{
			description = property.getAlias();
		}
	}
	if (oFF.XStringUtils.isNullOrEmpty(description))
	{
		description = this.getDescription();
	}
	if (oFF.XStringUtils.isNullOrEmpty(description))
	{
		description = this.getAlias();
	}
	return description;
};
oFF.FeDimension.prototype.getDimensionName = function()
{
	let property = this.getSelectedProperty();
	if (property.isPresent())
	{
		return property.get().getDimensionName();
	}
	return this.m_identifier;
};
oFF.FeDimension.prototype.getField = function(withDatasource)
{
	let stringBuilder = oFF.XStringBuffer.create();
	stringBuilder.append(oFF.FeModelComponent.prototype.getField.call( this , withDatasource));
	this.appendToField(stringBuilder, withDatasource);
	return stringBuilder.toString();
};
oFF.FeDimension.prototype.getFlatKeyField = function()
{
	return this.m_flatKeyField;
};
oFF.FeDimension.prototype.getHierarchies = function()
{
	return this.m_hierarchies;
};
oFF.FeDimension.prototype.getHierarchyByName = function(hierarchyName)
{
	return oFF.XStream.of(this.getHierarchies()).find((h) => {
		return oFF.XString.isEqual(h.getAlias(), hierarchyName);
	});
};
oFF.FeDimension.prototype.getInvalidProperties = function()
{
	return oFF.XCollectionUtils.filter(this.m_properties, (p) => {
		return !p.isValid();
	});
};
oFF.FeDimension.prototype.getKeyField = function()
{
	if (oFF.notNull(this.m_selectedProperty))
	{
		return this.m_selectedProperty;
	}
	if (oFF.notNull(this.m_selectedHierarchy))
	{
		return this.m_selectedHierarchy.isFlat() ? this.m_flatKeyField : this.m_hierarchyKeyField;
	}
	if (this.m_hierarchies.isEmpty() || (this.m_hierarchies.size() === 1 && this.m_hierarchies.get(0).isFlat()))
	{
		return this.m_flatKeyField;
	}
	return this.m_hierarchyKeyField;
};
oFF.FeDimension.prototype.getKeyFieldName = function()
{
	return this.getKeyField() !== null ? this.getKeyField().getKeyFieldName() : this.getId();
};
oFF.FeDimension.prototype.getProperties = function()
{
	return oFF.XCollectionUtils.filter(this.m_properties, (p) => {
		return p.isValid();
	});
};
oFF.FeDimension.prototype.getPropertyByAlias = function(propertyAlias)
{
	return oFF.XStream.of(this.getProperties()).find((p) => {
		return oFF.XString.isEqual(p.getAlias(), propertyAlias);
	});
};
oFF.FeDimension.prototype.getPropertyById = function(propertyId)
{
	return oFF.XStream.of(this.getProperties()).find((p) => {
		return oFF.XString.isEqual(p.getId(), propertyId);
	});
};
oFF.FeDimension.prototype.getSelectedHierarchy = function()
{
	return oFF.XOptional.ofNullable(this.m_selectedHierarchy);
};
oFF.FeDimension.prototype.getSelectedProperty = function()
{
	return oFF.XOptional.ofNullable(this.m_selectedProperty);
};
oFF.FeDimension.prototype.getType = function()
{
	return oFF.FeModelComponentType.DIMENSION;
};
oFF.FeDimension.prototype.getValueType = function()
{
	return this.getKeyField().getValueType();
};
oFF.FeDimension.prototype.isDateDimension = function()
{
	return this.getValueType().isDate();
};
oFF.FeDimension.prototype.isNumeric = function()
{
	return this.getValueType().isNumber();
};
oFF.FeDimension.prototype.isVersionDimension = function()
{
	return this.m_dimensionType.isVersionLike();
};
oFF.FeDimension.prototype.isVirtual = function()
{
	return this.m_isVirtual;
};
oFF.FeDimension.prototype.releaseObject = function()
{
	this.m_selectedHierarchy = null;
	this.m_selectedProperty = null;
	this.m_defaultHierarchy = null;
	this.m_hierarchies = null;
	this.m_properties = null;
	this.m_hierarchyKeyField = null;
	this.m_flatKeyField = null;
	oFF.FeModelComponent.prototype.releaseObject.call( this );
};

oFF.FeHierarchy = function() {};
oFF.FeHierarchy.prototype = new oFF.FeModelComponent();
oFF.FeHierarchy.prototype._ff_c = "FeHierarchy";

oFF.FeHierarchy.FLAT_HIERARCHY = "-";
oFF.FeHierarchy.HIERARCHY_END = "]";
oFF.FeHierarchy.HIERARCHY_START = "[h/";
oFF.FeHierarchy.create = function(identifier, alias, description, parentDimensionId, isDefault)
{
	let instance = new oFF.FeHierarchy();
	instance.m_identifier = identifier;
	instance.m_description = oFF.XString.isEqual(alias, oFF.FeHierarchy.FLAT_HIERARCHY) ? oFF.XLocalizationCenter.getCenter().getText(oFF.FeI18n.FE_FLAT_PRESENTATION) : description;
	instance.m_fieldStart = oFF.XStringUtils.assertNotNullOrEmpty(oFF.FeHierarchy.HIERARCHY_START);
	instance.m_fieldEnd = oFF.XStringUtils.assertNotNullOrEmpty(oFF.FeHierarchy.HIERARCHY_END);
	instance.m_parentId = oFF.XStringUtils.assertNotNullOrEmpty(parentDimensionId);
	instance.m_alias = alias;
	instance.m_isDefault = isDefault;
	return instance;
};
oFF.FeHierarchy.prototype.m_isDefault = false;
oFF.FeHierarchy.prototype.getDimensionName = function()
{
	return this.m_parentId;
};
oFF.FeHierarchy.prototype.getType = function()
{
	return oFF.FeModelComponentType.HIERARCHY;
};
oFF.FeHierarchy.prototype.isDefault = function()
{
	return this.m_isDefault;
};
oFF.FeHierarchy.prototype.isFlat = function()
{
	return oFF.XStringUtils.isNullOrEmpty(this.getId());
};
oFF.FeHierarchy.prototype.releaseObject = function()
{
	this.m_alias = null;
	oFF.FeModelComponent.prototype.releaseObject.call( this );
};

oFF.FeProperty = function() {};
oFF.FeProperty.prototype = new oFF.FeModelComponent();
oFF.FeProperty.prototype._ff_c = "FeProperty";

oFF.FeProperty.PROPERTY_END = "]";
oFF.FeProperty.PROPERTY_START = "[p/";
oFF.FeProperty.create = function(identifier, alias, description, parentDimensionId, flatKeyFieldName, valueType)
{
	oFF.XObjectExt.assertStringNotNullAndNotEmptyExt(flatKeyFieldName, "Flat key field name should not be empty or null");
	let instance = new oFF.FeProperty();
	instance.setupCommon(identifier, alias, description, oFF.FeProperty.PROPERTY_START, oFF.FeProperty.PROPERTY_END, parentDimensionId);
	instance.m_flatKeyFieldName = flatKeyFieldName;
	instance.m_valueType = oFF.XObjectExt.assertNotNull(valueType);
	return instance;
};
oFF.FeProperty.prototype.m_flatKeyFieldName = null;
oFF.FeProperty.prototype.m_valueType = null;
oFF.FeProperty.prototype.getDimensionName = function()
{
	return this.m_identifier;
};
oFF.FeProperty.prototype.getKeyFieldName = function()
{
	return this.m_flatKeyFieldName;
};
oFF.FeProperty.prototype.getType = function()
{
	return oFF.FeModelComponentType.PROPERTY;
};
oFF.FeProperty.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.FeProperty.prototype.isValid = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATE_DIMENSIONS) || !this.m_valueType.isDateLike();
};
oFF.FeProperty.prototype.releaseObject = function()
{
	this.m_alias = null;
	this.m_valueType = null;
	oFF.FeModelComponent.prototype.releaseObject.call( this );
};

oFF.FeI18n = function() {};
oFF.FeI18n.prototype = new oFF.DfXLocalizationProvider();
oFF.FeI18n.prototype._ff_c = "FeI18n";

oFF.FeI18n.ABS_EXAMPLE_CODE = "FF_FE_ABS_EXAMPLE_CODE";
oFF.FeI18n.ABS_EXAMPLE_RESULT = "FF_FE_ABS_EXAMPLE_RESULT";
oFF.FeI18n.ABS_REMARK_TYPES = "FF_FE_ABS_REMARK_TYPES";
oFF.FeI18n.ABS_SUMMARY = "FF_FE_ABS_SUMMARY";
oFF.FeI18n.ABS_SYNTAX = "FF_FE_ABS_SYNTAX";
oFF.FeI18n.CEIL_EXAMPLE_CODE = "FF_FE_CEIL_EXAMPLE_CODE";
oFF.FeI18n.CEIL_EXAMPLE_RESULT = "FF_FE_CEIL_EXAMPLE_RESULT";
oFF.FeI18n.CEIL_REMARK_TYPES_LINE1 = "FF_FE_CEIL_REMARK_TYPES_LINE1";
oFF.FeI18n.CEIL_REMARK_TYPES_LINE2 = "FF_FE_CEIL_REMARK_TYPES_LINE2";
oFF.FeI18n.CEIL_SUMMARY = "FF_FE_CEIL_SUMMARY";
oFF.FeI18n.CEIL_SYNTAX = "FF_FE_CEIL_SYNTAX";
oFF.FeI18n.COMMON_DIMENSION_CITY = "FF_FE_COMMON_DIMENSION_CITY";
oFF.FeI18n.COMMON_FALSE = "FF_FE_COMMON_FALSE";
oFF.FeI18n.COMMON_FILTERS = "FF_FE_COMMON_FILTERS";
oFF.FeI18n.COMMON_MEASURE_NETREVENUE = "FF_FE_COMMON_MEASURE_NETREVENUE";
oFF.FeI18n.COMMON_MEASURE_PRICE = "FF_FE_COMMON_MEASURE_PRICE";
oFF.FeI18n.COMMON_MEASURE_SALES = "FF_FE_COMMON_MEASURE_SALES";
oFF.FeI18n.COMMON_TABLE_CLOSE = "FF_FE_COMMON_TABLE_CLOSE";
oFF.FeI18n.COMMON_TABLE_OPEN = "FF_FE_COMMON_TABLE_OPEN";
oFF.FeI18n.COMMON_TRUE = "FF_FE_COMMON_TRUE";
oFF.FeI18n.COMMON_VALUE_CITY = "FF_FE_COMMON_VALUE_CITY";
oFF.FeI18n.COMMON_VALUE_FALSE = "FF_FE_COMMON_VALUE_FALSE";
oFF.FeI18n.COMMON_VALUE_TRUE = "FF_FE_COMMON_VALUE_TRUE";
oFF.FeI18n.DATEDIFF_DATE_FORMAT = "FF_FE_DATEDIFF_DATE_FORMAT";
oFF.FeI18n.DATEDIFF_ERROR_DATES_PARAMETER = "FF_FE_DATEDIFF_ERROR_DATES_PARAMETER";
oFF.FeI18n.DATEDIFF_ERROR_DATE_PARAMETER = "FF_FE_DATEDIFF_ERROR_DATE_PARAMETER";
oFF.FeI18n.DATEDIFF_ERROR_GRANULARITY_PARAMETER = "FF_FE_DATEDIFF_ERROR_GRANULARITY_PARAMETER";
oFF.FeI18n.DATEDIFF_EXAMPLE_CODE = "FF_FE_DATEDIFF_EXAMPLE_CODE";
oFF.FeI18n.DATEDIFF_EXAMPLE_RESULT = "FF_FE_DATEDIFF_EXAMPLE_RESULT";
oFF.FeI18n.DATEDIFF_GRANULARITY = "FF_FE_DATEDIFF_GRANULARITY";
oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE1 = "FF_FE_DATEDIFF_REMARK_TYPES_LINE1";
oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE2 = "FF_FE_DATEDIFF_REMARK_TYPES_LINE2";
oFF.FeI18n.DATEDIFF_SUMMARY = "FF_FE_DATEDIFF_SUMMARY";
oFF.FeI18n.DATEDIFF_SYNTAX = "FF_FE_DATEDIFF_SYNTAX";
oFF.FeI18n.DECFLOAT_EXAMPLE_CODE = "FF_FE_DECFLOAT_EXAMPLE_CODE";
oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT = "FF_FE_DECFLOAT_EXAMPLE_RESULT";
oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT_NUMBER = "FF_FE_DECFLOAT_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.DECFLOAT_REMARK_TYPES = "FF_FE_DECFLOAT_REMARK_TYPES";
oFF.FeI18n.DECFLOAT_SUMMARY = "FF_FE_DECFLOAT_SUMMARY";
oFF.FeI18n.DECFLOAT_SYNTAX = "FF_FE_DECFLOAT_SYNTAX";
oFF.FeI18n.DIVISION_BY_ZERO = "FF_FE_DIVISION_BY_ZERO";
oFF.FeI18n.DOUBLE_EXAMPLE_CODE = "FF_FE_DOUBLE_EXAMPLE_CODE";
oFF.FeI18n.DOUBLE_EXAMPLE_RESULT = "FF_FE_DOUBLE_EXAMPLE_RESULT";
oFF.FeI18n.DOUBLE_EXAMPLE_RESULT_NUMBER = "FF_FE_DOUBLE_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.DOUBLE_REMARK_TYPES = "FF_FE_DOUBLE_REMARK_TYPES";
oFF.FeI18n.DOUBLE_SUMMARY = "FF_FE_DOUBLE_SUMMARY";
oFF.FeI18n.DOUBLE_SYNTAX = "FF_FE_DOUBLE_SYNTAX";
oFF.FeI18n.ERROR_ARGUMENT_DIMENSION_NOT_SUPPORTED = "FF_FE_ERROR_ARGUMENT_DIMENSION_NOT_SUPPORTED";
oFF.FeI18n.ERROR_ARGUMENT_NEGATIVE_NUMBER_AND_ZERO_NOT_ALLOWED = "FF_FE_ERROR_ARGUMENT_NEGATIVE_NUMBER_AND_ZERO_NOT_ALLOWED";
oFF.FeI18n.ERROR_ARGUMENT_NON_UNIQUE_DIMENSIONS = "FF_FE_ERROR_ARGUMENT_NON_UNIQUE_DIMENSIONS";
oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH = "FF_FE_ERROR_ARGUMENT_NO_MISMATCH";
oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH_OR = "FF_FE_ERROR_ARGUMENT_NO_MISMATCH_OR";
oFF.FeI18n.ERROR_ARGUMENT_SINGLE_VALUE_DIM_CONDITIONS = "FF_FE_ERROR_ARGUMENT_SINGLE_VALUE_DIM_CONDITIONS";
oFF.FeI18n.ERROR_ARGUMENT_STRING_NOT_SUPPORTED = "FF_FE_ERROR_ARGUMENT_STRING_NOT_SUPPORTED";
oFF.FeI18n.ERROR_ARGUMENT_TOO_MANY_HIERARCHICAL_DIMENSIONS = "FF_FE_ERROR_ARGUMENT_TOO_MANY_HIERARCHICAL_DIMENSIONS";
oFF.FeI18n.ERROR_ARGUMENT_VERSION_DIMENSION_NOT_SUPPORTED = "FF_FE_ERROR_ARGUMENT_VERSION_DIMENSION_NOT_SUPPORTED";
oFF.FeI18n.ERROR_CYCLICAL_DEPENDENCY = "FF_FE_ERROR_CYCLICAL_DEPENDENCY";
oFF.FeI18n.ERROR_DATE_DIMENSIONS_NOT_SUPPORTED = "FF_FE_ERROR_DATE_DIMENSIONS_NOT_SUPPORTED";
oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPES_INVALID = "FF_FE_ERROR_FCT_ARGUMENT_TYPES_INVALID";
oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPE_INVALID = "FF_FE_ERROR_FCT_ARGUMENT_TYPE_INVALID";
oFF.FeI18n.ERROR_FCT_NESTED = "FF_FE_ERROR_FCT_NESTED";
oFF.FeI18n.ERROR_INVALID_ACCOUNT = "FF_FE_ERROR_INVALID_ACCOUNT";
oFF.FeI18n.ERROR_INVALID_DECIMAL_OR_ARGUMENT_SEPARATOR = "FF_FE_ERROR_INVALID_DECIMAL_OR_ARGUMENT_SEPARATOR";
oFF.FeI18n.ERROR_INVALID_DIMENSION = "FF_FE_ERROR_INVALID_DIMENSION";
oFF.FeI18n.ERROR_INVALID_FUNCTION = "FF_FE_ERROR_INVALID_FUNCTION";
oFF.FeI18n.ERROR_INVALID_HIERARCHY = "FF_FE_ERROR_INVALID_HIERARCHY";
oFF.FeI18n.ERROR_INVALID_MEASURE = "FF_FE_ERROR_INVALID_MEASURE";
oFF.FeI18n.ERROR_INVALID_PROPERTY = "FF_FE_ERROR_INVALID_PROPERTY";
oFF.FeI18n.ERROR_INVALID_SECOND_FIELD = "FF_FE_ERROR_INVALID_SECOND_FIELD";
oFF.FeI18n.ERROR_INVALID_SECOND_FIELD_EMPTY = "FF_FE_ERROR_INVALID_SECOND_FIELD_EMPTY";
oFF.FeI18n.ERROR_INVALID_STRUCTURE = "FF_FE_ERROR_INVALID_STRUCTURE";
oFF.FeI18n.ERROR_LIST_DIFFERENT_VALUE_TYPES = "FF_FE_ERROR_LIST_DIFFERENT_VALUE_TYPES";
oFF.FeI18n.ERROR_NOT_ENOUGH_ARGUMENTS = "FF_FE_ERROR_NOT_ENOUGH_ARGUMENTS";
oFF.FeI18n.ERROR_SAME_DATA_TYPE_EXPECTED = "FF_FE_ERROR_SAME_DATA_EXPECTED";
oFF.FeI18n.ERROR_STRING_AT_ROOT = "FF_ERROR_STRING_AT_ROOT";
oFF.FeI18n.ERROR_SYNTAX = "FF_FE_ERROR_SYNTAX";
oFF.FeI18n.ERROR_TOO_MANY_ARGUMENTS = "FF_FE_ERROR_TOO_MANY_ARGUMENTS";
oFF.FeI18n.EXPECTED_DATA_TYPES_OR = "FF_FE_DATA_TYPES_OR";
oFF.FeI18n.EXP_EXAMPLE_CODE = "FF_FE_EXP_EXAMPLE_CODE";
oFF.FeI18n.EXP_EXAMPLE_RESULT = "FF_FE_EXP_EXAMPLE_RESULT";
oFF.FeI18n.EXP_EXAMPLE_RESULT_NUMBER = "FF_FE_EXP_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.EXP_REMARK_TYPES = "FF_FE_EXP_REMARK_TYPES";
oFF.FeI18n.EXP_SUMMARY = "FF_FE_EXP_SUMMARY";
oFF.FeI18n.EXP_SYNTAX = "FF_FE_EXP_SYNTAX";
oFF.FeI18n.FE_ACCOUNTS = "FF_FE_ACCOUNTS";
oFF.FeI18n.FE_ACCOUNT_DATA_TYPE = "FF_FE_ACCOUNT_DATA_TYPE";
oFF.FeI18n.FE_FLAT_PRESENTATION = "FF_FE_FLAT_PRESENTATION";
oFF.FeI18n.FE_MEASURES = "FF_FE_MEASURES";
oFF.FeI18n.FE_MEASURE_DATA_TYPE = "FF_FE_MEASURE_DATA_TYPE";
oFF.FeI18n.FE_STRUCTURES = "FF_FE_STRUCTURES";
oFF.FeI18n.FE_STRUCTURE_DATA_TYPE = "FF_FE_STRUCTURE_DATA_TYPE";
oFF.FeI18n.FLOAT_EXAMPLE_CODE = "FF_FE_FLOAT_EXAMPLE_CODE";
oFF.FeI18n.FLOAT_EXAMPLE_RESULT = "FF_FE_FLOAT_EXAMPLE_RESULT";
oFF.FeI18n.FLOAT_EXAMPLE_RESULT_NUMBER = "FF_FE_FLOAT_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.FLOAT_REMARK_TYPES = "FF_FE_FLOAT_REMARK_TYPES";
oFF.FeI18n.FLOAT_SUMMARY = "FF_FE_FLOAT_SUMMARY";
oFF.FeI18n.FLOAT_SYNTAX = "FF_FE_FLOAT_SYNTAX";
oFF.FeI18n.FLOOR_EXAMPLE_CODE = "FF_FE_FLOOR_EXAMPLE_CODE";
oFF.FeI18n.FLOOR_EXAMPLE_RESULT = "FF_FE_FLOOR_EXAMPLE_RESULT";
oFF.FeI18n.FLOOR_REMARK_TYPES_LINE1 = "FF_FE_FLOOR_REMARK_TYPES_LINE1";
oFF.FeI18n.FLOOR_REMARK_TYPES_LINE2 = "FF_FE_FLOOR_REMARK_TYPES_LINE2";
oFF.FeI18n.FLOOR_SUMMARY = "FF_FE_FLOOR_SUMMARY";
oFF.FeI18n.FLOOR_SYNTAX = "FF_FE_FLOOR_SYNTAX";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_CODE = "FF_FE_GRANDTOTAL_EXAMPLE_CODE";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_RESULT = "FF_FE_GRANDTOTAL_EXAMPLE_RESULT";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_HEADER = "FF_FE_GRANDTOTAL_EXAMPLE_TABLE_HEADER";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_1 = "FF_FE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_2 = "FF_FE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_3 = "FF_FE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3";
oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_4 = "FF_FE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4";
oFF.FeI18n.GRANDTOTAL_REMARK_LINE_1 = "FF_FE_GRANDTOTAL_REMARK_LINE_1";
oFF.FeI18n.GRANDTOTAL_REMARK_LINE_2 = "FF_FE_GRANDTOTAL_REMARK_LINE_2";
oFF.FeI18n.GRANDTOTAL_SUMMARY = "FF_FE_GRANDTOTAL_SUMMARY";
oFF.FeI18n.GRANDTOTAL_SYNTAX = "FF_FE_GRANDTOTAL_SYNTAX";
oFF.FeI18n.IF_EXAMPLE_CODE = "FF_FE_IF_EXAMPLE_CODE";
oFF.FeI18n.IF_EXAMPLE_RESULT = "FF_FE_IF_EXAMPLE_RESULT";
oFF.FeI18n.IF_REMARK_OPTIONAL_ELSE = "FF_FE_IF_REMARK_OPTIONAL_ELSE";
oFF.FeI18n.IF_REMARK_TYPES = "FF_FE_IF_REMARK_TYPES";
oFF.FeI18n.IF_SUMMARY = "FF_FE_IF_SUMMARY";
oFF.FeI18n.IF_SYNTAX = "FF_FE_IF_SYNTAX";
oFF.FeI18n.INT_EXAMPLE_CODE = "FF_FE_INT_EXAMPLE_CODE";
oFF.FeI18n.INT_EXAMPLE_RESULT = "FF_FE_INT_EXAMPLE_RESULT";
oFF.FeI18n.INT_REMARK_TYPES = "FF_FE_INT_REMARK_TYPES";
oFF.FeI18n.INT_SUMMARY = "FF_FE_INT_SUMMARY";
oFF.FeI18n.INT_SUMMARY_MAX_NUMBER = "FF_FE_INT_SUMMARY_BIG_NUMBER";
oFF.FeI18n.INT_SUMMARY_MIN_NUMBER = "FF_FE_INT_SUMMARY_SMALL_NUMBER";
oFF.FeI18n.INT_SYNTAX = "FF_FE_INT_SYNTAX";
oFF.FeI18n.ISNULL_EXAMPLE_CODE = "FF_FE_ISNULL_EXAMPLE_CODE";
oFF.FeI18n.ISNULL_EXAMPLE_RESULT = "FF_FE_ISNULL_EXAMPLE_RESULT";
oFF.FeI18n.ISNULL_SUMMARY = "FF_FE_ISNULL_SUMMARY";
oFF.FeI18n.ISNULL_SYNTAX = "FF_FE_ISNULL_SYNTAX";
oFF.FeI18n.LOCAL_NAME = "FeI18n";
oFF.FeI18n.LOG10_EXAMPLE_CODE = "FF_FE_LOG10_EXAMPLE_CODE";
oFF.FeI18n.LOG10_EXAMPLE_RESULT = "FF_FE_LOG10_EXAMPLE_RESULT";
oFF.FeI18n.LOG10_REMARK_TYPES = "FF_FE_LOG10_REMARK_TYPES";
oFF.FeI18n.LOG10_SUMMARY = "FF_FE_LOG10_SUMMARY";
oFF.FeI18n.LOG10_SYNTAX = "FF_FE_LOG10_SYNTAX";
oFF.FeI18n.LOG_EXAMPLE_CODE = "FF_FE_LOG_EXAMPLE_CODE";
oFF.FeI18n.LOG_EXAMPLE_RESULT = "FF_FE_LOG_EXAMPLE_RESULT";
oFF.FeI18n.LOG_EXAMPLE_RESULT_NUMBER = "FF_FE_LOG_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.LOG_REMARK_TYPES = "FF_FE_LOG_REMARK_TYPES";
oFF.FeI18n.LOG_SUMMARY = "FF_FE_LOG_SUMMARY";
oFF.FeI18n.LOG_SYNTAX = "FF_FE_LOG_SYNTAX";
oFF.FeI18n.MAX_EXAMPLE_CODE = "FF_FE_MAX_EXAMPLE_CODE";
oFF.FeI18n.MAX_EXAMPLE_RESULT = "FF_FE_MAX_EXAMPLE_RESULT";
oFF.FeI18n.MAX_REMARK_TYPES_LINE1 = "FF_FE_MAX_REMARK_TYPES_LINE1";
oFF.FeI18n.MAX_REMARK_TYPES_LINE2 = "FF_FE_MAX_REMARK_TYPES_LINE2";
oFF.FeI18n.MAX_SUMMARY = "FF_FE_MAX_SUMMARY";
oFF.FeI18n.MAX_SYNTAX = "FF_FE_MAX_SYNTAX";
oFF.FeI18n.MIN_EXAMPLE_CODE = "FF_FE_MIN_EXAMPLE_CODE";
oFF.FeI18n.MIN_EXAMPLE_RESULT = "FF_FE_MIN_EXAMPLE_RESULT";
oFF.FeI18n.MIN_REMARK_TYPES_LINE1 = "FF_FE_MIN_REMARK_TYPES_LINE1";
oFF.FeI18n.MIN_REMARK_TYPES_LINE2 = "FF_FE_MIN_REMARK_TYPES_LINE2";
oFF.FeI18n.MIN_SUMMARY = "FF_FE_MIN_SUMMARY";
oFF.FeI18n.MIN_SYNTAX = "FF_FE_MIN_SYNTAX";
oFF.FeI18n.MOD_EXAMPLE_CODE = "FF_FE_MOD_EXAMPLE_CODE";
oFF.FeI18n.MOD_EXAMPLE_RESULT = "FF_FE_MOD_EXAMPLE_RESULT";
oFF.FeI18n.MOD_REMARK_TYPES = "FF_FE_MOD_REMARK_TYPES";
oFF.FeI18n.MOD_SUMMARY = "FF_FE_MOD_SUMMARY";
oFF.FeI18n.MOD_SYNTAX = "FF_FE_MOD_SYNTAX";
oFF.FeI18n.NOT_EXAMPLE_CODE = "FF_FE_NOT_EXAMPLE_CODE";
oFF.FeI18n.NOT_EXAMPLE_RESULT = "FF_FE_NOT_EXAMPLE_RESULT";
oFF.FeI18n.NOT_SUMMARY = "FF_FE_NOT_SUMMARY";
oFF.FeI18n.NOT_SYNTAX = "FF_FE_NOT_SYNTAX";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_CODE = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_CODE";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_RESULT_LINE_1 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_RESULT_LINE_1";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_HEADER = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_HEADER";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_5 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_5";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_6 = "FF_FE_PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_6";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_1 = "FF_FE_PERCENTAGE_GRANDTOTAL_REMARK_LINE_1";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_2 = "FF_FE_PERCENTAGE_GRANDTOTAL_REMARK_LINE_2";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SUMMARY = "FF_FE_PERCENTAGE_GRANDTOTAL_SUMMARY";
oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SYNTAX = "FF_FE_PERCENTAGE_GRANDTOTAL_SYNTAX";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_CODE = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_CODE";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_RESULT = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_RESULT";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_HEADER = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_HEADER";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_1 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_1";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_2 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_2";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_1 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_1";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_2 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_2";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_3 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_3";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_4 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_4";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_5 = "FF_FE_PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_5";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_1 = "FF_FE_PERCENTAGE_SUBTOTAL_REMARK_LINE_1";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_2 = "FF_FE_PERCENTAGE_SUBTOTAL_REMARK_LINE_2";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_3 = "FF_FE_PERCENTAGE_SUBTOTAL_REMARK_LINE_3";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_SUMMARY = "FF_FE_PERCENTAGE_SUBTOTAL_SUMMARY";
oFF.FeI18n.PERCENTAGE_SUBTOTAL_SYNTAX = "FF_FE_PERCENTAGE_SUBTOTAL_SYNTAX";
oFF.FeI18n.POWER_ERROR_NEGATIVE_NUMBER_TO_LESS_ONE_VALUE = "FF_POWER_ERROR_NEGATIVE_NUMBER_TO_LESS_ONE_VALUE";
oFF.FeI18n.POWER_ERROR_ZERO_TO_NEGATIVE_NUMBER = "FF_POWER_ERROR_ZERO_TO_NEGATIVE_NUMBER";
oFF.FeI18n.POWER_EXAMPLE_CODE = "FF_FE_POWER_EXAMPLE_CODE";
oFF.FeI18n.POWER_EXAMPLE_RESULT = "FF_FE_POWER_EXAMPLE_RESULT";
oFF.FeI18n.POWER_REMARK_TYPES = "FF_FE_POWER_REMARK_TYPES";
oFF.FeI18n.POWER_SUMMARY = "FF_FE_POWER_SUMMARY";
oFF.FeI18n.POWER_SYNTAX = "FF_FE_POWER_SYNTAX";
oFF.FeI18n.RESTRICT_EXAMPLE_CODE = "FF_FE_RESTRICT_EXAMPLE_CODE";
oFF.FeI18n.RESTRICT_EXAMPLE_RESULT = "FF_FE_RESTRICT_EXAMPLE_RESULT";
oFF.FeI18n.RESTRICT_REMARK_TYPES = "FF_FE_RESTRICT_REMARK_TYPES";
oFF.FeI18n.RESTRICT_REMARK_TYPES2 = "FF_FE_RESTRICT_REMARK_TYPES2";
oFF.FeI18n.RESTRICT_SUMMARY = "FF_FE_RESTRICT_SUMMARY";
oFF.FeI18n.RESTRICT_SYNTAX = "FF_FE_RESTRICT_SYNTAX";
oFF.FeI18n.RESULTLOOKUP_EXAMPLE_CODE = "FF_FE_RESULTLOOKUP_EXAMPLE_CODE";
oFF.FeI18n.RESULTLOOKUP_EXAMPLE_RESULT = "FF_FE_RESULTLOOKUP_EXAMPLE_RESULT";
oFF.FeI18n.RESULTLOOKUP_SUMMARY = "FF_FE_RESULTLOOKUP_SUMMARY";
oFF.FeI18n.RESULTLOOKUP_SYNTAX = "FF_FE_RESULTLOOKUP_SYNTAX";
oFF.FeI18n.ROUND_EXAMPLE_CODE = "FF_FE_ROUND_EXAMPLE_CODE";
oFF.FeI18n.ROUND_EXAMPLE_RESULT = "FF_FE_ROUND_EXAMPLE_RESULT";
oFF.FeI18n.ROUND_EXAMPLE_RESULT_NUMBER = "FF_FE_ROUND_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.ROUND_REMARK_TYPES = "FF_FE_ROUND_REMARK_TYPES";
oFF.FeI18n.ROUND_SUMMARY = "FF_FE_ROUND_SUMMARY";
oFF.FeI18n.ROUND_SYNTAX = "FF_FE_ROUND_SYNTAX";
oFF.FeI18n.SQRT_ERROR_ARGUMENT_NEGATIVE_NUMBER_NOT_ALLOWED = "FF_FE_ERROR_ARGUMENT_NEGATIVE_NUMBER_NOT_ALLOWED";
oFF.FeI18n.SQRT_EXAMPLE_CODE = "FF_FE_SQRT_EXAMPLE_CODE";
oFF.FeI18n.SQRT_EXAMPLE_RESULT = "FF_FE_SQRT_EXAMPLE_RESULT";
oFF.FeI18n.SQRT_REMARK_TYPES = "FF_FE_SQRT_REMARK_TYPES";
oFF.FeI18n.SQRT_SUMMARY = "FF_FE_SQRT_SUMMARY";
oFF.FeI18n.SQRT_SYNTAX = "FF_FE_SQRT_SYNTAX";
oFF.FeI18n.SUBTOTAL_EXAMPLE_CODE = "FF_FE_SUBTOTAL_EXAMPLE_CODE";
oFF.FeI18n.SUBTOTAL_EXAMPLE_RESULT = "FF_FE_SUBTOTAL_EXAMPLE_RESULT";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_HEADER = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_HEADER";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_1 = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_ROW_1";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_2 = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_ROW_2";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_3 = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_ROW_3";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_4 = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_ROW_4";
oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_5 = "FF_FE_SUBTOTAL_EXAMPLE_TABLE_ROW_5";
oFF.FeI18n.SUBTOTAL_REMARK_LINE_1 = "FF_FE_SUBTOTAL_REMARK_LINE_1";
oFF.FeI18n.SUBTOTAL_REMARK_LINE_2 = "FF_FE_SUBTOTAL_REMARK_LINE_2";
oFF.FeI18n.SUBTOTAL_REMARK_LINE_3 = "FF_FE_SUBTOTAL_REMARK_LINE_3";
oFF.FeI18n.SUBTOTAL_SUMMARY = "FF_FE_SUBTOTAL_SUMMARY";
oFF.FeI18n.SUBTOTAL_SYNTAX = "FF_FE_SUBTOTAL_SYNTAX";
oFF.FeI18n.TRUNC_EXAMPLE_CODE = "FF_FE_TRUNC_EXAMPLE_CODE";
oFF.FeI18n.TRUNC_EXAMPLE_RESULT = "FF_FE_TRUNC_EXAMPLE_RESULT";
oFF.FeI18n.TRUNC_EXAMPLE_RESULT_NUMBER = "FF_FE_TRUNC_EXAMPLE_RESULT_NUMBER";
oFF.FeI18n.TRUNC_REMARK_TYPES = "FF_FE_TRUNC_REMARK_TYPES";
oFF.FeI18n.TRUNC_SUMMARY = "FF_FE_TRUNC_SUMMARY";
oFF.FeI18n.TRUNC_SYNTAX = "FF_FE_TRUNC_SYNTAX";
oFF.FeI18n.addABSi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.ABS_SYNTAX, "<func>ABS(</func> <param>Number</param> <func>)</func>", "#NOTR: ABS function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.ABS_SUMMARY, "Returns the absolute value / non-negative of a number.", "#XMSG: ABS function documentation summary");
	tmpProvider.addTextWithComment(oFF.FeI18n.ABS_EXAMPLE_CODE, "<func>ABS(</func> <param>-14</param> <func>)</func>", "#NOTR: ABS function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.ABS_EXAMPLE_RESULT, "Returns 14.", "#XMSG: ABS function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.ABS_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: ABS function documentation remark");
};
oFF.FeI18n.addCEILi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_SYNTAX, "<func>CEIL(</func> <param>Number</param><argsep> <param>Number of places after decimal point</param> <func>)</func>", "#NOTR: CEIL function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_SUMMARY, "Returns a real number that is greater or equal to the entered number.", "#XMSG: CEIL function documentation summary. Do not translate content enclosed in (<>) and 'CEIL'");
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_EXAMPLE_CODE, "<func>CEIL(</func> <param>14<decsep>2</param> <func>)</func>", "#NOTR: CEIL function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_EXAMPLE_RESULT, "Returns 15.", "#XMSG: CEIL function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_REMARK_TYPES_LINE1, "The second parameter is optional.", "#XMSG: CEIL function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.CEIL_REMARK_TYPES_LINE2, "Select your preferred scaling in the formatting section.", "#XMSG: CEIL function documentation remark");
};
oFF.FeI18n.addDATEDIFFi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_SYNTAX, "<func>DATEDIFF(</func> <param>Date 1</param><argsep> <param>Date 2</param><argsep> <param>Granularity</param> <func>)</func>", "#NOTR: DATEDIFF function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_SUMMARY, "Returns the period of time between different dates.", "#XMSG: DATEDIFF function documentation summary. Do not translate content enclosed in (<>) and 'DATEDIFF'");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_EXAMPLE_CODE, "<func>DATEDIFF(</func> <param>[d/ShipDate]</param><argsep> <param>[d/OrderDate]</param><argsep> <param>\"Day\"</param> <func>)</func>", "#NOTR: DATEDIFF function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_EXAMPLE_RESULT, "Returns the number of days between OrderDate and ShipDate by calculating the difference: ShipDate - OrderDate = Number of days.", "#XMSG: DATEDIFF function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE1, "Available granularities for this function: \"{0}\", \"{1}\", \"{2}\".", "#XMSG: DATEDIFF function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE2, "Date 1 and Date 2 can either be a String with format YYYY-MM-DD or a Date dimension.", "#XMSG: DATEDIFF function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_ERROR_DATE_PARAMETER, "Function \"{0}\" expects parameter {1} of type \"{2}\" with format \"{3}\" or \"{4}\", but receives \"{5}\" with the incorrect format (\"{6}\"). Please use the expected parameter type.", "#XMSG: Error shown when parameter data type is invalid due to format. {0} is the function name, {1} is the parameter position, {2} is the expected type, {3} is the expected format, {4} is the second expected type, {5} is the received type and {6} is the input.");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_ERROR_DATES_PARAMETER, "Function \"{0}\" expects parameter {1} and {2} of type \"{3}\" with format \"{4}\" or \"{5}\", but receives \"{6}\" and \"{7}\" with the incorrect format (\"{8}\") and (\"{9}\"). Please use the expected parameter type.", "#XMSG: Error shown when parameter data type is invalid due to format. {0} is the function name, {1} is the first parameter position, {2} is the second parameter position, {3} is the expected type, {4} is the expected format, {5} is the second expected type, {6} is the first received type, {7} is the second received type, {8} is the first input and {9} is the second input.");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_ERROR_GRANULARITY_PARAMETER, "Function \"{0}\" expects parameter {1} of type \"{2}\" with value {3}, but receives \"{4}\" with the incorrect value (\"{5}\"). Please use the expected parameter type.", "#XMSG: Error shown when parameter data type is invalid due to format. {0} is the function name, {1} is the parameter position and {2} is the input.");
};
oFF.FeI18n.addDECFLOATi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_SYNTAX, "<func>DECFLOAT(</func> <paramStringNumber> <func>)</func>", "#NOTR: DECFLOAT function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_SUMMARY, "Returns decimal floating-point representation of the specified <paramStringNumber>.", "#XMSG: DECFLOAT function documentation summary. Do not translate content enclosed in (<>) and 'DECFLOAT'");
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_EXAMPLE_CODE, "<func>DECFLOAT(</func> <param>14<decsep>6</param> <func>)</func>", "#NOTR: DECFLOAT function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: DECFLOAT function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT_NUMBER, "14<decsep>6", "#NOTR: DECFLOAT function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.DECFLOAT_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: DECFLOAT function documentation remark");
};
oFF.FeI18n.addDOUBLEi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_SYNTAX, "<func>DOUBLE(</func> <param>Number</param> <func>)</func>", "#NOTR: DOUBLE function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_SUMMARY, "Returns double floating-point representation of a specified number.", "#XMSG: DOUBLE function documentation summary. Do not translate content enclosed in (<>) and 'DOUBLE'");
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_EXAMPLE_CODE, "<func>DOUBLE(</func> <param>14</param> <func>)</func>", "#NOTR: DOUBLE function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: DOUBLE function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_EXAMPLE_RESULT_NUMBER, "14<decsep>0", "#NOTR: DOUBLE function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.DOUBLE_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: DOUBLE function documentation remark");
};
oFF.FeI18n.addERRORSi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_DIMENSION, "Dimension \"{0}\" does not exist.", "#XMSG: Error shown if dimension does not exist, {0} is the dimension name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_MEASURE, "Measure \"{0}\" does not exist.", "#XMSG: Error shown if measure does not exist, {0} is the measure name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_ACCOUNT, "Account Member \"{0}\" does not exist.", "#XMSG: Error shown if account member does not exist, {0} is the account member name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_STRUCTURE, "Structure Member \"{0}\" does not exist.", "#XMSG: Error shown if structure member does not exist, {0} is the structure member name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_PROPERTY, "Dimension \"{0}\" does not have a property \"{1}\".", "#XMSG: Error shown if property does not exist, {0} is the dimension name and {1} is the property name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_HIERARCHY, "Dimension \"{0}\" does not have a hierarchy \"{1}\".", "#XMSG: Error shown if hierarchy does not exist, {0} is the dimension name and {1} is the hierarchy name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_SECOND_FIELD, "\"{0}\" does not exist.", "#XMSG: Error shown if there is an invalid second field after the dimension. {0} is the content of the invalid field");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_SECOND_FIELD_EMPTY, "\"\" does not exist.", "#XMSG: Error shown if there is an invalid second field after the dimension.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH, "Function \"{0}\" expects {1} parameter(s), but receives {2}. Please use the expected number of parameters.", "#XMSG: Error shown when the number of parameters does not match the expected number. {0} is the function name, {1} is the expected number of arguments and {2} is the actual number of arguments.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_NO_MISMATCH_OR, "Function \"{0}\" expects {1} or {2} parameter(s), but receives {3}. Please use the expected number of parameters.", "#XMSG: Error shown when the number of parameters does not match the expected number. {0} is the function name, {1} is the first expected argument number, {2} is the second expected argument number, and {3} is the actual number of arguments.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_TOO_MANY_ARGUMENTS, "Function \"{0}\" expects less than {1} parameter(s), but receives {2}. Please use the expected number of parameters.", "#XMSG: Error shown when there are too many arguments. {0} is the function name, {1} is the maximum expected number of arguments, and {2} is the actual number of arguments.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_NOT_ENOUGH_ARGUMENTS, "Function \"{0}\" expects more than {1} parameter(s), but receives {2}. Please use the expected number of parameters.", "#XMSG: Error shown when there are not enough arguments. {0} is the function name, {1} is the minimum expected number of arguments, and {2} is the actual number of arguments.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPE_INVALID, "Function \"{0}\" expects parameter {1} of type \"{2}\", but receives \"{3}\". Please use the expected parameter type.", "#XMSG: Error shown when parameter data type is invalid. {0} is the function name, {1} is the parameter position, {2} is the expected type/types, and {3} is the received argument type.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_FCT_ARGUMENT_TYPES_INVALID, "Function \"{0}\" expects parameter {1} and {2} of type \"{3}\", but receives \"{4}\" and \"{5}\". Please use the expected parameter type.", "#XMSG: Error shown when parameter data type is invalid. {0} is the function name, {1} is the first parameter position, {2} is the second parameter position, {3} is the expected type/types, {4} is the first received argument type, and {5} is the second argument type");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_FCT_NESTED, "Nesting \"{0}\" formulas isn't supported. Please make sure your \"{1}\" formula doesn't reference another \"{2}\" formula.", "#XMSG: This is shown when a function is nested within a function and that is not supported. e.g. SUBTOTAL or %SUBTOTAL formula is nested within each-other.");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXPECTED_DATA_TYPES_OR, "{0} or {1}", "#XMSG: Concatenation of two expected argument types");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_SAME_DATA_TYPE_EXPECTED, "Function \"{0}\" expects parameters {1} and {2} to be of compatible types (found \"{3}\" vs. \"{4}\")", "#XMSG: Error shown when two arguments that should have the same data type are different. {0} is the function name, {1} first parameter, {2} second parameter, {3} first parameter data type, {4} second parameter data type");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_SYNTAX, "Formula could not be calculated. Please complete or rewrite the formula.", "#XMSG: Error shown when there is a syntax error in the formula");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_CYCLICAL_DEPENDENCY, "The formula could not be calculated due to a cyclical dependency found in the calculation. You can\u2019t use [{0}] in the formula as it has a reference to the current calculation being edited.", "#XMSG: Error shown when a cyclical dependency is found in the formula");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_FUNCTION, "Function \"{0}\" cannot be used in the formula as it is either not supported or doesn\u2019t exist on the system.", "#XMSG: Error shown when an invalid function is types into the formula. {0} is the function name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_STRING_AT_ROOT, "The output of the formula you have entered in the editor should be of type \"{0}\" or \"{1}\" not \"{2}\". Please modify the formula accordingly.", "#XMSG: Error shown when the returning value at the root level is a string, {0}, {1}, and {2} are the expected and received data types");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_STRING_NOT_SUPPORTED, "The use of strings for \"{0}\" is not supported.", "#XMSG: Error shown when a function does not support string arguments. {0} is the function name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_DIMENSION_NOT_SUPPORTED, "The use of dimensions for \"{0}\" is not supported.", "#XMSG: Error shown when a function does not support dimension arguments. {0} is the function name");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_DATE_DIMENSIONS_NOT_SUPPORTED, "The use of date dimension \"{0}\" is not supported.", "#XMSG: Error shown when a date dimension is used. {0} is the name of the date dimension.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_LIST_DIFFERENT_VALUE_TYPES, "Parameter \"{0}\" of function \"{1}\" is a list of values with different types. Please use the same type for all values.", "#XMSG: Error shown when a list has different value types. {0} is a number, {1} is the function name.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_NON_UNIQUE_DIMENSIONS, "In function \"{0}\" there is one or more dimensions used several times. Please don\u2019t use the same dimension more than once.", "#XMSG: Error shown when a function has multiple of the same dimensions, where that is not supported. {0} is the function name.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_TOO_MANY_HIERARCHICAL_DIMENSIONS, "In function \"{0}\" more than three hierarchical dimensions are used. Please change some dimensions in the list.", "#XMSG: Error shown when a function has over three hierarchical dimensions, where that is not supported. {0} is the function name.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_VERSION_DIMENSION_NOT_SUPPORTED, "Dimension \"{0}\" is not supported in the function \"{1}\". Please complete or rewrite the formula.", "#XMSG: Error shown when a function is using a version dimension which isn't supported. {1} is the function name.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_INVALID_DECIMAL_OR_ARGUMENT_SEPARATOR, "Following your number formatting user preferences, you have set \"{0}\" as the decimal separator. As a result, \"{1}\" is used as the parameter separator. Please adjust the formatting accordingly.", "#XMSG: Error shown when the incorrect decimal or argument separator is used in the formula editor. {0} is the expected decimal separator and {1} is the expected parameter separator");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_SINGLE_VALUE_DIM_CONDITIONS, "Function \"{0}\" expects parameter {1} to be a list of single value dimension conditions. Please ensure that each dimension condition contains only a single value.", "#XMSG: Error shown when a function has a list of dimension members dimension=(one, two), where that is not supported. {0} is the function name, {1} is the parameter number.");
};
oFF.FeI18n.addEXPi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_SYNTAX, "<func>EXP(</func> <param>Number</param> <func>)</func>", "#NOTR: EXP function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_SUMMARY, "Returns the value of the base of the natural logarithm (e) raised to the power of a specified number.", "#XMSG: EXP function documentation summary");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_EXAMPLE_CODE, "<func>EXP(</func> <param>2</param> <func>)</func>", "#NOTR: EXP function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: EXP function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_EXAMPLE_RESULT_NUMBER, "7<decsep>3890561", "#NOTR: EXP function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.EXP_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: EXP function documentation remark");
};
oFF.FeI18n.addFLOATi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_SYNTAX, "<func>FLOAT(</func> <param>Number</param> <func>)</func>", "#NOTR: FLOAT function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_SUMMARY, "Returns floating-point representation of a specified number.", "#XMSG: FLOAT function documentation summary. Do not translate content enclosed in (<>) and 'FLOAT'");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_EXAMPLE_CODE, "<func>FLOAT(</func> <param>14</param> <func>)</func>", "#NOTR: FLOAT function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: FLOAT function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_EXAMPLE_RESULT_NUMBER, "14<decsep>0", "#NOTR: FLOAT function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOAT_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: FLOAT function documentation remark");
};
oFF.FeI18n.addFLOORi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_SYNTAX, "<func>FLOOR(</func> <param>Number</param><argsep> <param>Number of places after decimal point</param> <func>)</func>", "#NOTR: FLOOR function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_SUMMARY, "Returns a real number that is smaller than the entered number.", "#XMSG: FLOOR function documentation summary. Do not translate content enclosed in (<>) and 'FLOOR'");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_EXAMPLE_CODE, "<func>FLOOR(</func> <param>24<decsep>04</param> <func>)</func>", "#NOTR: FLOOR function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_EXAMPLE_RESULT, "Returns 24.", "#XMSG: FLOOR function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_REMARK_TYPES_LINE1, "The second parameter is optional.", "#XMSG: FLOOR function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.FLOOR_REMARK_TYPES_LINE2, "Select your preferred scaling in the formatting section.", "#XMSG: FLOOR function documentation remark");
};
oFF.FeI18n.addGRANDTOTALi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_SUMMARY, "Returns the grand total of all the <measuretype> values in the result set. Filters are included in the calculation of the grand total.", "#XMSG: GrandTotal function documentation summary. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_SYNTAX, "<func>GRANDTOTAL(</func> <measuretype> <func>)</func>", "#NOTR: GrandTotal function documentation syntax.");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_CODE, "<func>GRANDTOTAL(</func> <measure>[Sales]</measure> <func>)</func>", "#NOTR: GrandTotal function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_RESULT, "Returns the aggregated value of {0}.", "#XMSG: GrandTotal function example result explanation. {0} is <measure>[Sales]</measure>");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_HEADER, "<th>Year|Region|Sales|GrandTotal(Sales)", "#XMSG: GrandTotal function example result table header. do not translate 'Sales' or 'GrandTotal', or content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_1, "<tr>2016|North|30|180", "#XMSG: GrandTotal function example result table row 1. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_2, "<tr>|South|30|180", "#XMSG: GrandTotal function example result table row 2. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_3, "<tr>2017|North|60|180", "#XMSG: GrandTotal function example result table row 3. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_4, "<tr>|South|60|180", "#XMSG: GrandTotal function example result table row 4. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_REMARK_LINE_1, "The function does not aggregate values over non-aggregable dimensions (e.g. Account Dimension, Category/Version Dimension) and will produce a separate grand total for each dimension member of these dimensions.", "#XMSG: GrandTotal function documentation remark line 1");
	tmpProvider.addTextWithComment(oFF.FeI18n.GRANDTOTAL_REMARK_LINE_2, "Select your preferred scaling in the formatting section.", "#XMSG: GrandTotal function documentation remark line 2");
};
oFF.FeI18n.addIFi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_SYNTAX, "<func>IF(</func> <param>Condition</param><argsep> <param>Value If True</param><argsep> <param>Value If False</param> <func>)</func>", "#NOTR: IF function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_SUMMARY, "Checks the <param>Condition</param> and if it evaluates to true, then calculate the {0}. Otherwise, calculate the {1}.", "#XMSG: IF function documentation summary. {0} the true value, {1} the false value. do not translate content enclosed in (<>) and 'Condition'");
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_EXAMPLE_CODE, "<code><func>IF(</func> {0}>100<argsep> {1}*0<decsep>8<argsep> {1}*0<decsep>6 <func>)</func></code>", "#NOTR: IF function example code.");
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_EXAMPLE_RESULT, "If {0} is greater than 100, then discount {1} by 20%. Otherwise, discount {1} by 40%.", "#XMSG: IF function example result explanation. {0} is the measure used in the condition, {1} is teh measure used in the output");
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_REMARK_TYPES, "The {0} and {1} parameters accept any valid numeric constant, account/measure, or formula expression including <func>IF</func>.", "#XMSG: IF function documentation remark. {0} is the Value if true and  {1} is the Value if false used in the condition. do not translate content enclosed in (<>) and 'IF'");
	tmpProvider.addTextWithComment(oFF.FeI18n.IF_REMARK_OPTIONAL_ELSE, "The {0} parameter is optional on HANA 1.0 SPS12 Patch 14 or later.", "#XMSG: IF function documentation remark.{0} is the Value if true");
};
oFF.FeI18n.addINTi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_SYNTAX, "<func>INT(</func> <param>Number</param> <func>)</func>", "#NOTR: INT function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_SUMMARY, "Returns the integer part of a number. It removes all the decimal places.<br>Valid integer values are from {0} to {1}.", "#XMSG: INT function documentation summary. Do not translate content enclosed in (<>) and 'INT'. {0} is the minimum int value, {1} is the maximum int value.");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_SUMMARY_MIN_NUMBER, "-2<decgroupsep>147<decgroupsep>483<decgroupsep>648", "#NOTR: Min integer number");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_SUMMARY_MAX_NUMBER, "2<decgroupsep>147<decgroupsep>483<decgroupsep>647", "#NOTR: Max integer number");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_EXAMPLE_CODE, "<func>INT(</func> <param>17<decsep>10</param> <func>)</func>", "#NOTR: INT function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_EXAMPLE_RESULT, "Returns 17.", "#XMSG: INT function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.INT_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: INT function documentation remark");
};
oFF.FeI18n.addISNULLi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.ISNULL_SYNTAX, "<func>ISNULL(</func> <param>Expression</param> <func>)</func>", "#NOTR: ISNULL function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.ISNULL_SUMMARY, "Returns {0} if the specified expression evaluates to null", "#XMSG: ISNULL function documentation summary. {0} is the true value.");
	tmpProvider.addTextWithComment(oFF.FeI18n.ISNULL_EXAMPLE_CODE, "<func>ISNULL(</func> <param>8</param> <func>)</func>", "#NOTR: ISNULL function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.ISNULL_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: ISNULL function example result explanation. {0} is the false value.");
};
oFF.FeI18n.addLOG10i18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG10_SYNTAX, "<func>LOG10(</func> <param>Number</param> <func>)</func>", "#NOTR: LOG10 function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG10_SUMMARY, "Returns the base 10 logarithm of a number.", "#XMSG: LOG10 function documentation summary. do not translate content enclosed in (<>) and 'LOG10'");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG10_EXAMPLE_CODE, "<func>LOG10(</func> <param>100</param> <func>)</func>", "#NOTR: LOG10 function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG10_EXAMPLE_RESULT, "Returns 2.", "#XMSG: LOG10 function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG10_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: LOG10 function documentation remark");
};
oFF.FeI18n.addLOGi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_SYNTAX, "<func>LOG(</func> <param>Number</param> <func>)</func>", "#NOTR: LOG function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_SUMMARY, "Returns the natural logarithm of a number.", "#XMSG: LOG function documentation summary. do not translate content enclosed in (<>) and 'LOG'");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_EXAMPLE_CODE, "<func>LOG(</func> <param>100</param> <func>)</func>", "#NOTR: LOG function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: LOG function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_EXAMPLE_RESULT_NUMBER, "4<decsep>605", "#NOTR: LOG function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.LOG_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: LOG function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.ERROR_ARGUMENT_NEGATIVE_NUMBER_AND_ZERO_NOT_ALLOWED, "Function \"{0}\" expects the parameter to be greater than 0. Please use the correct numeric value for the parameter.", "#XMSG: Error shown when a negative number or zero is supplied as parameter.");
};
oFF.FeI18n.addMAXi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_SYNTAX, "<func>MAX(</func> <param>Number</param><argsep> <param>Number</param> <func>)</func>", "#NOTR: MAX function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_SUMMARY, "Returns the <strong>largest</strong> of two or more numbers.", "#XMSG: MAX function documentation summary.do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_EXAMPLE_CODE, "<func>MAX(</func> <param>2014</param><argsep> <param>2016</param> <func>)</func>", "#NOTR: MAX function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_EXAMPLE_RESULT, "Returns 2016.", "#XMSG: MAX function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_REMARK_TYPES_LINE1, "Any number of parameters can be specified after the <strong>second</strong> parameter.", "#XMSG: MAX function documentation remark.do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.MAX_REMARK_TYPES_LINE2, "Select your preferred scaling in the formatting section.", "#XMSG: MAX function documentation remark");
};
oFF.FeI18n.addMINi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_SYNTAX, "<func>MIN(</func> <param>Number</param><argsep> <param>Number</param> <func>)</func>", "#NOTR: MIN function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_SUMMARY, "Returns the <strong>smallest</strong> of two or more numbers.", "#XMSG: MIN function documentation summary.do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_EXAMPLE_CODE, "<func>MIN(</func> <param>2014</param><argsep> <param>2016</param> <func>)</func>", "#NOTR: MIN function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_EXAMPLE_RESULT, "Returns 2014.", "#XMSG: MIN function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_REMARK_TYPES_LINE1, "Any number of parameters can be specified after the <strong>second</strong> parameter.", "#XMSG: MIN function documentation remark.do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.MIN_REMARK_TYPES_LINE2, "Select your preferred scaling in the formatting section.", "#XMSG: MIN function documentation remark");
};
oFF.FeI18n.addMODi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.MOD_SYNTAX, "<func>MOD(</func> <param>Number</param><argsep> <param>Divisor</param> <func>)</func>", "#NOTR: MOD function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.MOD_SUMMARY, "Returns the remainder of the division between two numbers.", "#XMSG: MOD function documentation summary. do not translate content enclosed in (<>) and 'MOD'");
	tmpProvider.addTextWithComment(oFF.FeI18n.MOD_EXAMPLE_CODE, "<func>MOD(</func> <param>15</param><argsep> <param>2</param> <func>)</func>", "#NOTR: MOD function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.MOD_EXAMPLE_RESULT, "Returns the remainder of the calculation 15/2, which is 1.", "#XMSG: MOD function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.MOD_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: MOD function documentation remark");
};
oFF.FeI18n.addNOTi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.NOT_SUMMARY, "Returns the negative of a specified boolean expression.", "#XMSG: documentation summary for NOT function");
	tmpProvider.addTextWithComment(oFF.FeI18n.NOT_SYNTAX, "<func>NOT(</func>  <param>boolean expression</param> <func>)</func>", "#NOTR: NOT function syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.NOT_EXAMPLE_CODE, "<func>NOT(</func> {0} <func>)</func>", "#NOTR: NOT function example code. {0} is the false value.");
	tmpProvider.addTextWithComment(oFF.FeI18n.NOT_EXAMPLE_RESULT, "Returns {0}", "#XMSG: NOT function example result explanation. {0} is the true value.");
};
oFF.FeI18n.addPERCENTAGEGRANDTOTALi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SUMMARY, "Returns what percentage of the grand total for all <measuretype> values the current <measuretype> value represents. The grand total is the aggregation of all the <measuretype> values in the result set. Filters are included in the calculation of grand total.", "#XMSG: %GrandTotal function documentation summary. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SYNTAX, "<func>%GRANDTOTAL(</func> <measuretype> <func>)</func>", "#NOTR: %GrandTotal function documentation syntax.");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_CODE, "<func>%GRANDTOTAL(</func> <measure>[Sales]</measure> <func>)</func>", "#XMSG: %GrandTotal function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_RESULT_LINE_1, "Returns the percentage of the grand total that each value represents.", "#XMSG: %GrandTotal function example result explanation line 1");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_HEADER, "<th>Year|Region|Sales|%GrandTotal(Sales)", "#XMSG: GrandTotal function example result table header.do not translate 'Sales' or 'GrandTotal', or content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1, "<tr>2016|North|30|16<decsep>67%", "#XMSG: GrandTotal function example result table row 1. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2, "<tr>|South|30|16<decsep>67%", "#XMSG: GrandTotal function example result table row 2. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3, "<tr>|Region Total|60|33<decsep>33%", "#XMSG: GrandTotal function example result table row 3. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4, "<tr>2017|North|60|33<decsep>33%", "#XMSG: GrandTotal function example result table row 4. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_5, "<tr>|South|60|33<decsep>33%", "#XMSG: GrandTotal function example result table row 5. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_6, "<tr>|Region Total|120|66<decsep>67%", "#XMSG: GrandTotal function example result table row 6. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_1, "The function does not aggregate values over non-aggregable dimensions (e.g. Account Dimension, Category/Version Dimension) and will produce a separate grand total for each dimension member of these dimensions.", "#XMSG: %GrandTotal function documentation remark line 1");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_2, "Select your preferred scaling in the formatting section.", "#XMSG: %GrandTotal function documentation remark line 2");
};
oFF.FeI18n.addPERCENTAGESUBTOTALi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_SUMMARY, "Returns the percentage of the subtotal for the <strong><measuretype></strong> broken down by a <strong>Dimension</strong> or multiple <strong>Dimensions</strong>.", "#XMSG: Percentage of Subtotal function documentation summary. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_SYNTAX, "<func>%SUBTOTAL(</func> <measuretype><argsep> <dimension>Dimension1</dimension><argsep> ... <dimension>Dimension10</dimension> <func>)</func>", "#NOTR: Percentage of Subtotal function documentation syntax. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_CODE, "<func>%SUBTOTAL(</func> <measure>[Sales]</measure><argsep>   <dimension>[d/Location]</dimension> <func>)</func>", "#NOTR: Percentage of Subtotal function example code. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_RESULT, "Returns the percentage value of <strong>Sales</strong> broken down by <strong>Location</strong>.", "#XMSG: Percentage of Subtotal function example result explanation.  Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_HEADER, "<th>Region|Location|Sales|%SubTotal(Sales)", "#XMSG: Percentage of Subtotal function example result table header. do not translate 'Sales' or '%SubTotal', or content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_1, "<tr>NA|US|30|50%", "#XMSG: Percentage of Subtotal function example result table row 1. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_2, "<tr>|CA|30|50%", "#XMSG: Percentage of Subtotal function example result table row 2. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_3, "<tr>EU|DE|10|25%", "#XMSG: Percentage of Subtotal function example result table row 3. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_4, "<tr>|FR|20|50%", "#XMSG: Percentage of Subtotal function example result table row 4. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_5, "<tr>|IT|10|25%", "#XMSG: Percentage of Subtotal function example result table row 5. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_1, "Example above can be achieved by setting the calculation scale to \"Percent\".", "#XMSG: Percentage of Subtotal function example result table remark line 1. do not translate content with \\\"");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_2, "Results are normalized between 0 and 1 by default.", "#XMSG: Percentage of Subtotal function example result table remark line 2.");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_1, "The function does not aggregate values over non-aggregable dimensions (for example, Account Dimension, Category/Version Dimension) and will produce a separate subtotal for each dimension member of these dimensions.", "#XMSG: Percentage of Subtotal function documentation remark line 1");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_2, "The number of dimensions that can be passed as an argument is limited to 10.", "#XMSG: Percentage of Subtotal function documentation remark line 2");
	tmpProvider.addTextWithComment(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_3, "Select your preferred scaling in the formatting section.", "#XMSG: Percentage of Subtotal function documentation remark line 3");
};
oFF.FeI18n.addPOWERi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_SYNTAX, "<func>POWER(</func> <param>Number</param><argsep> <param>Exponent</param> <func>)</func>", "#NOTR: POWER function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_SUMMARY, "Returns the result of a number raised to a specified exponent.", "#XMSG: POWER function documentation summary. do not translate content enclosed in (<>) and 'POWER'");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_EXAMPLE_CODE, "<func>POWER(</func> <param>2</param><argsep> <param>3</param> <func>)</func>", "#NOTR: POWER function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_EXAMPLE_RESULT, "Returns 8.", "#XMSG: POWER function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: POWER function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_ERROR_ZERO_TO_NEGATIVE_NUMBER, "Zero cannot be raised to any negative exponent. Please use different numbers.", "#XMSG: Error shown when zero is raised to the power of a negative number");
	tmpProvider.addTextWithComment(oFF.FeI18n.POWER_ERROR_NEGATIVE_NUMBER_TO_LESS_ONE_VALUE, "Negative numbers cannot be raised to any exponent between -1 and 1, with the exception of -1, 0, and 1. Please use different values.", "#XMSG: Error shown when a negative number is raised to the power of a value between -1 and 0, or between 0 and 1.");
};
oFF.FeI18n.addRESTRICTi8nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_SYNTAX, "<func>RESTRICT(</func> <param><measuretype><argsep>Filters</param> <func>)</func>", "#NOTR: RESTRICT function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_SUMMARY, "Returns a measure value restricted to an account and a list of dimension members.", "#XMSG: RESTRICT function documentation summary. do not translate content enclosed in (<>) and 'ROUND'");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_EXAMPLE_CODE, "<func>RESTRICT(</func> <param><measure>[NetRevenue]</measure><argsep><dimension>[d/Product]</dimension>=\"Shoes\"</param> <func>)</func>", "#NOTR: RESTRICT function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_EXAMPLE_RESULT, "Returns the <strong>NetRevenue</strong> of <strong>Shoes</strong> for dimension Product.", "#XMSG: RESTRICT function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_REMARK_TYPES, "The functionality of Restrict and Lookup formula is very similar. They differ in the way the results are displayed, showing a breakdown of aggregated numbers.", "#XMSG: RESTRICT function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESTRICT_REMARK_TYPES2, "Restrict shows no value for rows or columns where no data has been selected.", "#XMSG: RESTRICT function documentation remark");
};
oFF.FeI18n.addRESULTLOOKUPi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.RESULTLOOKUP_SYNTAX, "<func>RESULTLOOKUP(</func> <measuretype><argsep> {0} <func>)</func>", "#NOTR: RESULTLOOKUP function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESULTLOOKUP_SUMMARY, "Returns a cell value based on the <measuretype> and a list of dimension members. It supports one or more dimension attributes or properties.", "#XMSG: RESULTLOOKUP function documentation summary. Do not translate content enclosed in (<>) and 'RESULTLOOKUP'");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESULTLOOKUP_EXAMPLE_CODE, "<func>RESULTLOOKUP(</func> {0}<argsep> {1} <operator>=</operator> {2} <func>)</func>", "#NOTR: RESULTLOOKUP function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.RESULTLOOKUP_EXAMPLE_RESULT, "Returns the cell value of {0} where {1} is equal to {2}.", "#XMSG: RESULTLOOKUP function example result explanation");
};
oFF.FeI18n.addROUNDi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_SYNTAX, "<func>ROUND(</func> <param>Number<argsep> Number of places after decimal point </param> <func>)</func>", "#NOTR: ROUND function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_SUMMARY, "Returns the value rounded to a specified number of decimal places.", "#XMSG: ROUND function documentation summary. do not translate content enclosed in (<>) and 'ROUND'");
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_EXAMPLE_CODE, "<func>ROUND(</func> <param>9<decsep>1218<argsep> 1</param> <func>)</func>", "#NOTR: ROUND function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: ROUND function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_EXAMPLE_RESULT_NUMBER, "9<decsep>1", "#NOTR: ROUND function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.ROUND_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: ROUND function documentation remark");
};
oFF.FeI18n.addSQRTi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_SYNTAX, "<func>SQRT(</func> <param>Number</param> <func>)</func>", "#NOTR: SQRT function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_SUMMARY, "Returns the square root of a value.", "#XMSG: SQRT function documentation summary. do not translate content enclosed in (<>) and 'SQRT'");
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_EXAMPLE_CODE, "<func>SQRT(</func> <param>81</param> <func>)</func>", "#NOTR: SQRT function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_EXAMPLE_RESULT, "Returns 9.", "#XMSG: SQRT function example result explanation");
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: SQRT function documentation remark");
	tmpProvider.addTextWithComment(oFF.FeI18n.SQRT_ERROR_ARGUMENT_NEGATIVE_NUMBER_NOT_ALLOWED, "Square roots of negative numbers can\u2019t be determined. Please use different numbers.", "#XMSG: Error shown when the a negative number is supplied as parameter.");
};
oFF.FeI18n.addSUBTOTALi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_SUMMARY, "Returns the subtotal of the <strong><measuretype></strong> broken down by a <strong>Dimension</strong> or multiple <strong>Dimensions</strong>. This function applies to both classic account models and models with measures. Make sure to use the relevant syntax depending on the model type: refer to an account member for a classic account model, or a measure for the new model type.", "#XMSG: Subtotal function documentation summary. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_SYNTAX, "<func>SUBTOTAL(</func> <measuretype><argsep> <dimension>Dimension1</dimension><argsep> ... <dimension>Dimension10</dimension> <func>)</func>", "#NOTR: Subtotal function documentation syntax. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_CODE, "<func>SUBTOTAL(</func> <measure>[Sales]</measure><argsep> <dimension>[d/Location]</dimension> <func>)</func>", "#NOTR: Subtotal function example code. Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_RESULT, "Returns the aggregated value of <strong>Sales</strong> broken down by <strong>Location</strong>.", "#XMSG: Subtotal function example result explanation.  Do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_HEADER, "<th>Region|Location|Sales|SubTotal(Sales)", "#XMSG: Subtotal function example result table header. do not translate 'Sales' or 'SubTotal', or content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_1, "<tr>NA|US|30|60", "#XMSG: Subtotal function example result table row 1. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_2, "<tr>|CA|30|60", "#XMSG: Subtotal function example result table row 2. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_3, "<tr>EU|DE|10|40", "#XMSG: Subtotal function example result table row 3. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_4, "<tr>|FR|20|40", "#XMSG: Subtotal function example result table row 4. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_5, "<tr>|IT|10|40", "#XMSG: Subtotal function example result table row 5. do not translate content enclosed in (<>)");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_REMARK_LINE_1, "The function does not aggregate values over non-aggregable dimensions (for example, Account Dimension, Category/Version Dimension) and will produce a separate subtotal for each dimension member of these dimensions.", "#XMSG: Subtotal function documentation remark line 1");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_REMARK_LINE_2, "The number of dimensions that can be passed as an argument is limited to 10.", "#XMSG: Subtotal function documentation remark line 2");
	tmpProvider.addTextWithComment(oFF.FeI18n.SUBTOTAL_REMARK_LINE_3, "Select your preferred scaling in the formatting section.", "#XMSG: Subtotal function documentation remark line 3");
};
oFF.FeI18n.addTRUNCi18nTexts = function(tmpProvider)
{
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_SYNTAX, "<func>TRUNC(</func> <param>Number</param><argsep> <param>Precision</param> <func>)</func>", "#NOTR: TRUNC function documentation syntax");
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_SUMMARY, "Returns a numeric value truncated to a specified number of decimal places.", "#XMSG: TRUNC function documentation summary. Do not translate content enclosed in (<>) and 'TRUNC'");
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_EXAMPLE_CODE, "<func>TRUNC(</func> <param>17<decsep>1219</param><argsep> <param>1</param> <func>)</func>", "#NOTR: TRUNC function example code");
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_EXAMPLE_RESULT, "Returns {0}.", "#XMSG: TRUNC function example result explanation. {0} is the returned number");
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_EXAMPLE_RESULT_NUMBER, "17<decsep>1", "#NOTR: TRUNC function example result number");
	tmpProvider.addTextWithComment(oFF.FeI18n.TRUNC_REMARK_TYPES, "Select your preferred scaling in the formatting section.", "#XMSG: TRUNC function documentation remark");
};
oFF.FeI18n.staticSetup = function()
{
	let tmpProvider = new oFF.FeI18n();
	tmpProvider.setupProvider(oFF.FeI18n.LOCAL_NAME, true);
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_MEASURE_SALES, "<measure>[Sales]</measure>", "#NOTR: Sales measure");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_MEASURE_PRICE, "<measure>[Price]</measure>", "#NOTR: Price measure");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_MEASURE_NETREVENUE, "<measure>[NetRevenue]</measure>", "#NOTR: Net revenue measure");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_DIMENSION_CITY, "<dimension>[d/City]</dimension>", "#NOTR: City dimension");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_VALUE_TRUE, "<param>Value If True</param>", "#NOTR: True value");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_VALUE_FALSE, "<param>Value If False</param>", "#NOTR: False value");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_VALUE_CITY, "<param>\"Istanbul\"</param>", "#NOTR: Common city name. Do not translate content enclosed in (<>). Double quotes are necessary in given position");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_TABLE_OPEN, "<table>", "#NOTR: Table open tag");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_TABLE_CLOSE, "</table>", "#NOTR: Table close tag");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_TRUE, "<param>true</param>", "#NOTR: true");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_FALSE, "<param>false</param>", "#NOTR: false");
	tmpProvider.addTextWithComment(oFF.FeI18n.COMMON_FILTERS, "<param>Filters</param>", "#NOTR: Parameter describing a list of dimension members used as filters in the function");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_MEASURES, "Measures", "#XMSG: Measures panel name");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_STRUCTURES, "Structure", "#XMSG: Structure members panel name");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_ACCOUNTS, "Accounts", "#XMSG: Accounts panel name");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_ACCOUNT_DATA_TYPE, "Account Member", "#NOTR: Account data type");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_MEASURE_DATA_TYPE, "Measure", "#NOTR: Measure data type");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_STRUCTURE_DATA_TYPE, "Structure Member", "#NOTR: Secondary structure data type");
	tmpProvider.addTextWithComment(oFF.FeI18n.FE_FLAT_PRESENTATION, "Flat presentation", "#XMSG: Flat presentation");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_DATE_FORMAT, "YYYY-MM-DD", "#NOTR: DateDiff date format");
	tmpProvider.addTextWithComment(oFF.FeI18n.DATEDIFF_GRANULARITY, "\"{0}\", \"{1}\" or \"{2}\"", "#XMSG: DateDiff granularity options");
	oFF.FeI18n.addIFi18nTexts(tmpProvider);
	oFF.FeI18n.addNOTi18nTexts(tmpProvider);
	oFF.FeI18n.addISNULLi18nTexts(tmpProvider);
	oFF.FeI18n.addSQRTi18nTexts(tmpProvider);
	oFF.FeI18n.addLOGi18nTexts(tmpProvider);
	oFF.FeI18n.addLOG10i18nTexts(tmpProvider);
	oFF.FeI18n.addMODi18nTexts(tmpProvider);
	oFF.FeI18n.addPOWERi18nTexts(tmpProvider);
	oFF.FeI18n.addEXPi18nTexts(tmpProvider);
	oFF.FeI18n.addABSi18nTexts(tmpProvider);
	oFF.FeI18n.addMINi18nTexts(tmpProvider);
	oFF.FeI18n.addMAXi18nTexts(tmpProvider);
	oFF.FeI18n.addCEILi18nTexts(tmpProvider);
	oFF.FeI18n.addTRUNCi18nTexts(tmpProvider);
	oFF.FeI18n.addDOUBLEi18nTexts(tmpProvider);
	oFF.FeI18n.addROUNDi18nTexts(tmpProvider);
	oFF.FeI18n.addINTi18nTexts(tmpProvider);
	oFF.FeI18n.addFLOATi18nTexts(tmpProvider);
	oFF.FeI18n.addFLOORi18nTexts(tmpProvider);
	oFF.FeI18n.addDECFLOATi18nTexts(tmpProvider);
	oFF.FeI18n.addDATEDIFFi18nTexts(tmpProvider);
	oFF.FeI18n.addRESULTLOOKUPi18nTexts(tmpProvider);
	tmpProvider.addTextWithComment(oFF.FeI18n.DIVISION_BY_ZERO, "Division by zero is not allowed in formula", "#XMSG: Cannot divide by zero");
	oFF.FeI18n.addGRANDTOTALi18nTexts(tmpProvider);
	oFF.FeI18n.addPERCENTAGEGRANDTOTALi18nTexts(tmpProvider);
	oFF.FeI18n.addSUBTOTALi18nTexts(tmpProvider);
	oFF.FeI18n.addPERCENTAGESUBTOTALi18nTexts(tmpProvider);
	oFF.FeI18n.addRESTRICTi8nTexts(tmpProvider);
	oFF.FeI18n.addERRORSi18nTexts(tmpProvider);
	return tmpProvider;
};

oFF.FeAnd = function() {};
oFF.FeAnd.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeAnd.prototype._ff_c = "FeAnd";

oFF.FeAnd.NAME = "AND";
oFF.FeAnd.SYNTAX = "AND";
oFF.FeAnd.create = function()
{
	let feAnd = new oFF.FeAnd();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).add(oFF.FeDataType.NULL).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).add(oFF.FeDataType.NULL).build());
	feAnd.m_arguments = args;
	return feAnd;
};
oFF.FeAnd.prototype.getName = function()
{
	return oFF.FeAnd.NAME;
};
oFF.FeAnd.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeAnd.prototype.getReturnType = function(args)
{
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_FILTERS) && args.size() === 2 && this.isDimensionFilterTree(args))
	{
		return oFF.FeDataType.DIMENSION_FILTER;
	}
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeAnd.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeAnd.prototype.getSyntax = function()
{
	return oFF.FeAnd.SYNTAX;
};
oFF.FeAnd.prototype.getType = function()
{
	return oFF.FormulaOperator.AND;
};
oFF.FeAnd.prototype.isDimensionFilterTree = function(args)
{
	let isArg0DimensionFilter = args.get(0).getReturnType().isTypeOf(oFF.FeDataType.DIMENSION_FILTER);
	let isArg1DimensionFilter = args.get(1).getReturnType().isTypeOf(oFF.FeDataType.DIMENSION_FILTER);
	let arg0ArrayOpt = oFF.FeFormulaArrayExtended.castToArray(args.get(0));
	let arg1ArrayOpt = oFF.FeFormulaArrayExtended.castToArray(args.get(1));
	return isArg0DimensionFilter || isArg1DimensionFilter || arg0ArrayOpt.isPresent() || arg1ArrayOpt.isPresent();
};
oFF.FeAnd.prototype.simplify = function(args, feConfiguration)
{
	if (args.size() === this.getRequiredArgumentsCount() && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.SIMPLIFY))
	{
		let returnTypeArg0 = args.get(0).getReturnType();
		let returnTypeArg1 = args.get(1).getReturnType();
		let arg0 = returnTypeArg0.isTypeOf(oFF.FeDataType.BOOLEAN) && args.get(0).getConstantValue().isPresent() && oFF.XBoolean.convertFromStringWithDefault(args.get(0).getConstantValue().get(), false);
		let arg1 = returnTypeArg1.isTypeOf(oFF.FeDataType.BOOLEAN) && args.get(1).getConstantValue().isPresent() && oFF.XBoolean.convertFromStringWithDefault(args.get(1).getConstantValue().get(), false);
		if (returnTypeArg0.isTypeOf(oFF.FeDataType.NULL) && returnTypeArg1.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(args.get(0));
		}
		else if (returnTypeArg0.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(arg1 === true ? args.get(0) : args.get(1));
		}
		else if (returnTypeArg1.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(arg0 === true ? args.get(1) : args.get(0));
		}
	}
	return oFF.FeBooleanToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XBoolean.convertFromString(args.get(0).getConstantValue().get()) && oFF.XBoolean.convertFromString(args.get(1).getConstantValue().get()));
	});
};

oFF.FeEqual = function() {};
oFF.FeEqual.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeEqual.prototype._ff_c = "FeEqual";

oFF.FeEqual.NAME = "=";
oFF.FeEqual.SYNTAX = "=";
oFF.FeEqual.create = function()
{
	let feEqual = new oFF.FeEqual();
	let args = oFF.XList.create();
	let feArgsBuilder = oFF.FeArgumentMetadataBuilder.create();
	feArgsBuilder.add(oFF.FeDataType.BOOLEAN);
	feArgsBuilder.add(oFF.FeDataType.STRING);
	feArgsBuilder.add(oFF.FeDataType.NUMBER);
	feArgsBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		feArgsBuilder.add(oFF.FeDataType.DIMENSION);
		feArgsBuilder.add(oFF.FeDataType.LIST_STRING);
		feArgsBuilder.add(oFF.FeDataType.LIST_NUMBER);
	}
	args.add(feArgsBuilder.build());
	args.add(feArgsBuilder.setArgumentIndexWithSameType(0).build());
	feEqual.m_arguments = args;
	return feEqual;
};
oFF.FeEqual.prototype.getName = function()
{
	return oFF.FeEqual.NAME;
};
oFF.FeEqual.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeEqual.prototype.getReturnType = function(args)
{
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_FILTERS) && args.size() === 2 && (args.get(0).getReturnType().isTypeOf(oFF.FeDataType.DIMENSION) && this.isDimensionFilterSupportedArg(args.get(1))) || (args.get(1).getReturnType().isTypeOf(oFF.FeDataType.DIMENSION) && this.isDimensionFilterSupportedArg(args.get(0))))
	{
		return oFF.FeDataType.DIMENSION_FILTER;
	}
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeEqual.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeEqual.prototype.getSyntax = function()
{
	return oFF.FeEqual.SYNTAX;
};
oFF.FeEqual.prototype.getType = function()
{
	return oFF.FormulaOperator.EQ;
};
oFF.FeEqual.prototype.isDimensionFilterSupportedArg = function(arg)
{
	return arg.getReturnType().isTypeOf(oFF.FeDataType.STRING) || arg.getReturnType().isTypeOf(oFF.FeDataType.LIST_STRING);
};
oFF.FeEqual.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplifyOrFallback(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) === oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	}, oFF.FeBooleanToBooleanSimplifier.create(args, feConfiguration, this).simplifyOrFallback(() => {
		return oFF.XBooleanValue.create(oFF.XBoolean.convertFromString(args.get(0).getConstantValue().get()) === oFF.XBoolean.convertFromString(args.get(1).getConstantValue().get()));
	}, oFF.FeStringToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XString.isEqual(args.get(0).getConstantValue().get(), args.get(1).getConstantValue().get()));
	})));
};
oFF.FeEqual.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeArrayTransformer.create(args, feConfiguration, this, oFF.FeOr.NAME).transformOrFallback(oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform()));
};

oFF.FeGreaterThan = function() {};
oFF.FeGreaterThan.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeGreaterThan.prototype._ff_c = "FeGreaterThan";

oFF.FeGreaterThan.NAME = ">";
oFF.FeGreaterThan.SYNTAX = ">";
oFF.FeGreaterThan.create = function()
{
	let feGreaterThan = new oFF.FeGreaterThan();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create();
	argBuilder.add(oFF.FeDataType.NUMBER);
	argBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argBuilder.add(oFF.FeDataType.DIMENSION);
		argBuilder.add(oFF.FeDataType.STRING);
	}
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feGreaterThan.m_arguments = args;
	return feGreaterThan;
};
oFF.FeGreaterThan.prototype.getName = function()
{
	return oFF.FeGreaterThan.NAME;
};
oFF.FeGreaterThan.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeGreaterThan.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeGreaterThan.prototype.getSyntax = function()
{
	return oFF.FeGreaterThan.SYNTAX;
};
oFF.FeGreaterThan.prototype.getType = function()
{
	return oFF.FormulaOperator.GT;
};
oFF.FeGreaterThan.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) > oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};
oFF.FeGreaterThan.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform());
};

oFF.FeGreaterThanEqual = function() {};
oFF.FeGreaterThanEqual.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeGreaterThanEqual.prototype._ff_c = "FeGreaterThanEqual";

oFF.FeGreaterThanEqual.NAME = ">=";
oFF.FeGreaterThanEqual.SYNTAX = ">=";
oFF.FeGreaterThanEqual.create = function()
{
	let feGreaterThanEqual = new oFF.FeGreaterThanEqual();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create();
	argBuilder.add(oFF.FeDataType.NUMBER);
	argBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argBuilder.add(oFF.FeDataType.DIMENSION);
		argBuilder.add(oFF.FeDataType.STRING);
	}
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feGreaterThanEqual.m_arguments = args;
	return feGreaterThanEqual;
};
oFF.FeGreaterThanEqual.prototype.getName = function()
{
	return oFF.FeGreaterThanEqual.NAME;
};
oFF.FeGreaterThanEqual.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeGreaterThanEqual.prototype.getReturnType = function(args)
{
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeGreaterThanEqual.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeGreaterThanEqual.prototype.getSyntax = function()
{
	return oFF.FeGreaterThanEqual.SYNTAX;
};
oFF.FeGreaterThanEqual.prototype.getType = function()
{
	return oFF.FormulaOperator.GE;
};
oFF.FeGreaterThanEqual.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) >= oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};
oFF.FeGreaterThanEqual.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform());
};

oFF.FeLessThan = function() {};
oFF.FeLessThan.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeLessThan.prototype._ff_c = "FeLessThan";

oFF.FeLessThan.NAME = "<";
oFF.FeLessThan.SYNTAX = "<";
oFF.FeLessThan.create = function()
{
	let feLessThan = new oFF.FeLessThan();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create();
	argBuilder.add(oFF.FeDataType.NUMBER);
	argBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argBuilder.add(oFF.FeDataType.DIMENSION);
		argBuilder.add(oFF.FeDataType.STRING);
	}
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feLessThan.m_arguments = args;
	return feLessThan;
};
oFF.FeLessThan.prototype.getName = function()
{
	return oFF.FeLessThan.NAME;
};
oFF.FeLessThan.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeLessThan.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeLessThan.prototype.getSyntax = function()
{
	return oFF.FeLessThan.SYNTAX;
};
oFF.FeLessThan.prototype.getType = function()
{
	return oFF.FormulaOperator.LT;
};
oFF.FeLessThan.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) < oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};
oFF.FeLessThan.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform());
};

oFF.FeLessThanEqual = function() {};
oFF.FeLessThanEqual.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeLessThanEqual.prototype._ff_c = "FeLessThanEqual";

oFF.FeLessThanEqual.NAME = "<=";
oFF.FeLessThanEqual.SYNTAX = "<=";
oFF.FeLessThanEqual.create = function()
{
	let feLessThanEqual = new oFF.FeLessThanEqual();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create();
	argBuilder.add(oFF.FeDataType.NUMBER);
	argBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argBuilder.add(oFF.FeDataType.DIMENSION);
		argBuilder.add(oFF.FeDataType.STRING);
	}
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feLessThanEqual.m_arguments = args;
	return feLessThanEqual;
};
oFF.FeLessThanEqual.prototype.getName = function()
{
	return oFF.FeLessThanEqual.NAME;
};
oFF.FeLessThanEqual.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeLessThanEqual.prototype.getReturnType = function(args)
{
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeLessThanEqual.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeLessThanEqual.prototype.getSyntax = function()
{
	return oFF.FeLessThanEqual.SYNTAX;
};
oFF.FeLessThanEqual.prototype.getType = function()
{
	return oFF.FormulaOperator.LE;
};
oFF.FeLessThanEqual.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) <= oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};
oFF.FeLessThanEqual.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform());
};

oFF.FeNot = function() {};
oFF.FeNot.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeNot.prototype._ff_c = "FeNot";

oFF.FeNot.NAME = "NOT";
oFF.FeNot.SYNTAX = "NOT($1)";
oFF.FeNot.create = function()
{
	let feNot = new oFF.FeNot();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).build());
	feNot.m_arguments = args;
	return feNot;
};
oFF.FeNot.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let trueStr = this.getLocalization().getText(oFF.FeI18n.COMMON_TRUE);
	let falseStr = this.getLocalization().getText(oFF.FeI18n.COMMON_FALSE);
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.NOT_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.NOT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.NOT_EXAMPLE_CODE, trueStr));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.NOT_EXAMPLE_RESULT, falseStr));
	return docBuilder.build();
};
oFF.FeNot.prototype.getName = function()
{
	return oFF.FeNot.NAME;
};
oFF.FeNot.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeNot.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeNot.prototype.getSyntax = function()
{
	return oFF.FeNot.SYNTAX;
};
oFF.FeNot.prototype.getType = function()
{
	return oFF.FormulaOperator.NOT;
};
oFF.FeNot.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeBooleanToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(!oFF.XBoolean.convertFromString(args.get(0).getConstantValue().get()));
	});
};

oFF.FeNotEqual = function() {};
oFF.FeNotEqual.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeNotEqual.prototype._ff_c = "FeNotEqual";

oFF.FeNotEqual.NAME = "!=";
oFF.FeNotEqual.SYNTAX = "!=";
oFF.FeNotEqual.create = function()
{
	let feNotEqual = new oFF.FeNotEqual();
	let args = oFF.XList.create();
	let feArgsBuilder = oFF.FeArgumentMetadataBuilder.create();
	feArgsBuilder.add(oFF.FeDataType.BOOLEAN);
	feArgsBuilder.add(oFF.FeDataType.STRING);
	feArgsBuilder.add(oFF.FeDataType.NUMBER);
	feArgsBuilder.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		feArgsBuilder.add(oFF.FeDataType.DIMENSION);
		feArgsBuilder.add(oFF.FeDataType.LIST_STRING);
		feArgsBuilder.add(oFF.FeDataType.LIST_NUMBER);
	}
	args.add(feArgsBuilder.build());
	args.add(feArgsBuilder.setArgumentIndexWithSameType(0).build());
	feNotEqual.m_arguments = args;
	return feNotEqual;
};
oFF.FeNotEqual.prototype.getName = function()
{
	return oFF.FeNotEqual.NAME;
};
oFF.FeNotEqual.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeNotEqual.prototype.getReturnType = function(args)
{
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeNotEqual.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeNotEqual.prototype.getSyntax = function()
{
	return oFF.FeNotEqual.SYNTAX;
};
oFF.FeNotEqual.prototype.getType = function()
{
	return oFF.FormulaOperator.NE;
};
oFF.FeNotEqual.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToBooleanSimplifier.create(args, feConfiguration, this).simplifyOrFallback(() => {
		return oFF.XBooleanValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) !== oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	}, oFF.FeBooleanToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XBoolean.convertFromString(args.get(0).getConstantValue().get()) !== oFF.XBoolean.convertFromString(args.get(1).getConstantValue().get()));
	}));
};
oFF.FeNotEqual.prototype.transform = function(args, feConfiguration)
{
	return oFF.FeArrayTransformer.create(args, feConfiguration, this, oFF.FeAnd.NAME).transformOrFallback(oFF.FeNumericDimensionTransformer.create(args, feConfiguration, this).transformOrFallback(oFF.FeDateDimensionTransformer.create(args, feConfiguration, this).transform()));
};

oFF.FeOr = function() {};
oFF.FeOr.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeOr.prototype._ff_c = "FeOr";

oFF.FeOr.NAME = "OR";
oFF.FeOr.SYNTAX = "OR";
oFF.FeOr.create = function()
{
	let feOr = new oFF.FeOr();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).add(oFF.FeDataType.NULL).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).add(oFF.FeDataType.NULL).build());
	feOr.m_arguments = args;
	return feOr;
};
oFF.FeOr.prototype.getName = function()
{
	return oFF.FeOr.NAME;
};
oFF.FeOr.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeOr.prototype.getReturnType = function(args)
{
	return oFF.FeDataType.BOOLEAN;
};
oFF.FeOr.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeOr.prototype.getSyntax = function()
{
	return oFF.FeOr.SYNTAX;
};
oFF.FeOr.prototype.getType = function()
{
	return oFF.FormulaOperator.OR;
};
oFF.FeOr.prototype.simplify = function(args, feConfiguration)
{
	if (args.size() === this.getRequiredArgumentsCount() && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.SIMPLIFY))
	{
		let returnTypeArg0 = args.get(0).getReturnType();
		let returnTypeArg1 = args.get(1).getReturnType();
		let arg0 = returnTypeArg0.isTypeOf(oFF.FeDataType.BOOLEAN) && args.get(0).getConstantValue().isPresent() && oFF.XBoolean.convertFromStringWithDefault(args.get(0).getConstantValue().get(), false);
		let arg1 = returnTypeArg1.isTypeOf(oFF.FeDataType.BOOLEAN) && args.get(1).getConstantValue().isPresent() && oFF.XBoolean.convertFromStringWithDefault(args.get(1).getConstantValue().get(), false);
		if (returnTypeArg0.isTypeOf(oFF.FeDataType.NULL) && returnTypeArg1.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(args.get(0));
		}
		else if (returnTypeArg0.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(arg1 === false ? args.get(0) : args.get(1));
		}
		else if (returnTypeArg1.isTypeOf(oFF.FeDataType.NULL))
		{
			return oFF.XOptional.of(arg0 === false ? args.get(1) : args.get(0));
		}
	}
	return oFF.FeBooleanToBooleanSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XBooleanValue.create(oFF.XBoolean.convertFromString(args.get(0).getConstantValue().get()) || oFF.XBoolean.convertFromString(args.get(1).getConstantValue().get()));
	});
};

oFF.FeAbs = function() {};
oFF.FeAbs.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeAbs.prototype._ff_c = "FeAbs";

oFF.FeAbs.NAME = "ABS";
oFF.FeAbs.SYNTAX = "ABS($1)";
oFF.FeAbs.create = function()
{
	let feAbs = new oFF.FeAbs();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feAbs.m_arguments = args;
	return feAbs;
};
oFF.FeAbs.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.ABS_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.ABS_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.ABS_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.ABS_EXAMPLE_RESULT));
	return docBuilder.build();
};
oFF.FeAbs.prototype.getName = function()
{
	return oFF.FeAbs.NAME;
};
oFF.FeAbs.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeAbs.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeAbs.prototype.getSyntax = function()
{
	return oFF.FeAbs.SYNTAX;
};
oFF.FeAbs.prototype.getType = function()
{
	return oFF.FormulaOperator.ABS;
};
oFF.FeAbs.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.abs(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
	});
};

oFF.FeCeil = function() {};
oFF.FeCeil.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeCeil.prototype._ff_c = "FeCeil";

oFF.FeCeil.NAME = "CEIL";
oFF.FeCeil.SYNTAX = "CEIL($1,)";
oFF.FeCeil.create = function()
{
	let feCeil = new oFF.FeCeil();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.INTEGER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.INTEGER).setOptional().build());
	feCeil.m_arguments = args;
	return feCeil;
};
oFF.FeCeil.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.CEIL_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.CEIL_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.CEIL_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.CEIL_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.CEIL_REMARK_TYPES_LINE1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.CEIL_REMARK_TYPES_LINE2));
	return docBuilder.build();
};
oFF.FeCeil.prototype.getName = function()
{
	return oFF.FeCeil.NAME;
};
oFF.FeCeil.prototype.getOptionalArgumentsCount = function()
{
	return 1;
};
oFF.FeCeil.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeCeil.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeCeil.prototype.getSyntax = function()
{
	return oFF.FeCeil.SYNTAX;
};
oFF.FeCeil.prototype.getType = function()
{
	return oFF.FormulaOperator.CEIL;
};
oFF.FeCeil.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
};
oFF.FeCeil.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeCeil.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() > (this.getRequiredArgumentsCount() + this.getOptionalArgumentsCount()) || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	let numberSimplify = oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		if (args.size() === 1)
		{
			return oFF.XDoubleValue.create(oFF.XMath.ceil(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
		}
		else
		{
			let firstParam = oFF.XDouble.convertFromString(args.get(0).getConstantValue().get());
			let secondParam = oFF.XInteger.convertFromString(args.get(1).getConstantValue().get());
			return oFF.XDoubleValue.create(oFF.XMath.ceil(firstParam * oFF.XMath.pow(10, secondParam)) * oFF.XMath.pow(10, (secondParam * -1)));
		}
	});
	if (numberSimplify.isPresent())
	{
		return numberSimplify;
	}
	return oFF.XOptional.empty();
};

oFF.FeCellValue = function() {};
oFF.FeCellValue.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeCellValue.prototype._ff_c = "FeCellValue";

oFF.FeCellValue.NAME = "CELLVALUE";
oFF.FeCellValue.SYNTAX = "RESULTLOOKUP($1,)";
oFF.FeCellValue.create = function()
{
	let cellValue = new oFF.FeCellValue();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION_MEMBER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION_MEMBER).setOptional().build());
	cellValue.m_arguments = args;
	return cellValue;
};
oFF.FeCellValue.prototype.getName = function()
{
	return oFF.FeCellValue.NAME;
};
oFF.FeCellValue.prototype.getOptionalArgumentsCount = function()
{
	return oFF.XInteger.getMaximumValue();
};
oFF.FeCellValue.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeCellValue.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeCellValue.prototype.getSyntax = function()
{
	return oFF.FeCellValue.SYNTAX;
};
oFF.FeCellValue.prototype.getType = function()
{
	return oFF.FormulaOperator.CELL_VALUE;
};
oFF.FeCellValue.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeCellValue.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeCellValue.prototype.requiresExternalSignFlip = function()
{
	return true;
};
oFF.FeCellValue.prototype.showUniqueDimensionsOnly = function()
{
	return true;
};

oFF.FeDecfloatAbstract = function() {};
oFF.FeDecfloatAbstract.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeDecfloatAbstract.prototype._ff_c = "FeDecfloatAbstract";

oFF.FeDecfloatAbstract.NAME = "DECFLOAT";
oFF.FeDecfloatAbstract.SYNTAX = "DECFLOAT($1)";
oFF.FeDecfloatAbstract.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.DECFLOAT_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.DECFLOAT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.DECFLOAT_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.DECFLOAT_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.DECFLOAT_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeDecfloatAbstract.prototype.getName = function()
{
	return oFF.FeDecfloatAbstract.NAME;
};
oFF.FeDecfloatAbstract.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeDecfloatAbstract.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.NULL).build();
};
oFF.FeDecfloatAbstract.prototype.getSyntax = function()
{
	return oFF.FeDecfloatAbstract.SYNTAX;
};
oFF.FeDecfloatAbstract.prototype.getType = function()
{
	return oFF.FormulaOperator.DECFLOAT;
};
oFF.FeDecfloatAbstract.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
};
oFF.FeDecfloatAbstract.prototype.setupInternal = function()
{
	let args = oFF.XList.create();
	let feArgsBuilder = oFF.FeArgumentMetadataBuilder.create();
	feArgsBuilder.add(oFF.FeDataType.NUMBER);
	feArgsBuilder.add(oFF.FeDataType.MEASURE);
	feArgsBuilder.add(oFF.FeDataType.STRING);
	feArgsBuilder.add(oFF.FeDataType.NULL);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		feArgsBuilder.add(oFF.FeDataType.DIMENSION);
	}
	args.add(feArgsBuilder.build());
	this.m_arguments = args;
};

oFF.FeDouble = function() {};
oFF.FeDouble.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeDouble.prototype._ff_c = "FeDouble";

oFF.FeDouble.NAME = "DOUBLE";
oFF.FeDouble.SYNTAX = "DOUBLE($1)";
oFF.FeDouble.create = function()
{
	let feDouble = new oFF.FeDouble();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feDouble.m_arguments = args;
	return feDouble;
};
oFF.FeDouble.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.DOUBLE_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.DOUBLE_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.DOUBLE_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.DOUBLE_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.DOUBLE_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.DOUBLE_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeDouble.prototype.getName = function()
{
	return oFF.FeDouble.NAME;
};
oFF.FeDouble.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeDouble.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeDouble.prototype.getSyntax = function()
{
	return oFF.FeDouble.SYNTAX;
};
oFF.FeDouble.prototype.getType = function()
{
	return oFF.FormulaOperator.DOUBLE;
};
oFF.FeDouble.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
};
oFF.FeDouble.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeExp = function() {};
oFF.FeExp.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeExp.prototype._ff_c = "FeExp";

oFF.FeExp.NAME = "EXP";
oFF.FeExp.SYNTAX = "EXP($1)";
oFF.FeExp.create = function()
{
	let feExp = new oFF.FeExp();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feExp.m_arguments = args;
	return feExp;
};
oFF.FeExp.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.EXP_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.EXP_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.EXP_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.EXP_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.EXP_EXAMPLE_RESULT_NUMBER)));
	return docBuilder.build();
};
oFF.FeExp.prototype.getName = function()
{
	return oFF.FeExp.NAME;
};
oFF.FeExp.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeExp.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeExp.prototype.getSyntax = function()
{
	return oFF.FeExp.SYNTAX;
};
oFF.FeExp.prototype.getType = function()
{
	return oFF.FormulaOperator.EXP;
};

oFF.FeFloat = function() {};
oFF.FeFloat.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeFloat.prototype._ff_c = "FeFloat";

oFF.FeFloat.NAME = "FLOAT";
oFF.FeFloat.SYNTAX = "FLOAT($1)";
oFF.FeFloat.create = function()
{
	let feFloat = new oFF.FeFloat();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	feFloat.m_arguments = args;
	return feFloat;
};
oFF.FeFloat.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.FLOAT_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.FLOAT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.FLOAT_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.FLOAT_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.FLOAT_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.FLOAT_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeFloat.prototype.getName = function()
{
	return oFF.FeFloat.NAME;
};
oFF.FeFloat.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeFloat.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeFloat.prototype.getSyntax = function()
{
	return oFF.FeFloat.SYNTAX;
};
oFF.FeFloat.prototype.getType = function()
{
	return oFF.FormulaOperator.FLOAT;
};
oFF.FeFloat.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
};
oFF.FeFloat.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeFloor = function() {};
oFF.FeFloor.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeFloor.prototype._ff_c = "FeFloor";

oFF.FeFloor.NAME = "FLOOR";
oFF.FeFloor.SYNTAX = "FLOOR($1,)";
oFF.FeFloor.create = function()
{
	let feFloor = new oFF.FeFloor();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.INTEGER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.INTEGER).setOptional().build());
	feFloor.m_arguments = args;
	return feFloor;
};
oFF.FeFloor.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_REMARK_TYPES_LINE1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.FLOOR_REMARK_TYPES_LINE2));
	return docBuilder.build();
};
oFF.FeFloor.prototype.getName = function()
{
	return oFF.FeFloor.NAME;
};
oFF.FeFloor.prototype.getOptionalArgumentsCount = function()
{
	return 1;
};
oFF.FeFloor.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeFloor.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeFloor.prototype.getSyntax = function()
{
	return oFF.FeFloor.SYNTAX;
};
oFF.FeFloor.prototype.getType = function()
{
	return oFF.FormulaOperator.FLOOR;
};
oFF.FeFloor.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
};
oFF.FeFloor.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeFloor.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() > (this.getRequiredArgumentsCount() + this.getOptionalArgumentsCount()) || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		if (args.size() === 1)
		{
			return oFF.XDoubleValue.create(oFF.XMath.floor(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
		}
		else
		{
			let firstParam = oFF.XDouble.convertFromString(args.get(0).getConstantValue().get());
			let secondParam = oFF.XInteger.convertFromString(args.get(1).getConstantValue().get());
			return oFF.XDoubleValue.create(oFF.XMath.floor(firstParam * oFF.XMath.pow(10, secondParam)) / oFF.XMath.pow(10, secondParam));
		}
	});
};

oFF.FeGrandTotal = function() {};
oFF.FeGrandTotal.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeGrandTotal.prototype._ff_c = "FeGrandTotal";

oFF.FeGrandTotal.NAME = "GRANDTOTAL";
oFF.FeGrandTotal.SYNTAX = "GRANDTOTAL($1)";
oFF.FeGrandTotal.create = function()
{
	let grandTotal = new oFF.FeGrandTotal();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	args.add(argsBuilder.build());
	grandTotal.m_arguments = args;
	return grandTotal;
};
oFF.FeGrandTotal.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let tableOpen = i18n.getText(oFF.FeI18n.COMMON_TABLE_OPEN);
	let salesMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_SALES);
	let exampleCode = i18n.getText(oFF.FeI18n.GRANDTOTAL_EXAMPLE_CODE);
	docBuilder.addSyntaxLine(i18n.getText(oFF.FeI18n.GRANDTOTAL_SYNTAX));
	docBuilder.addSummaryLine(i18n.getText(oFF.FeI18n.GRANDTOTAL_SUMMARY));
	docBuilder.addExampleLine(exampleCode);
	docBuilder.addExampleLine(i18n.getTextWithPlaceholder(oFF.FeI18n.GRANDTOTAL_EXAMPLE_RESULT, salesMeasure));
	let tableDoc = oFF.XStringBuffer.create();
	tableDoc.append(tableOpen);
	tableDoc.append(i18n.getTextWithPlaceholder2(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_HEADER, salesMeasure, exampleCode));
	tableDoc.append(i18n.getText(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_1));
	tableDoc.append(i18n.getText(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_2));
	tableDoc.append(i18n.getText(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_3));
	tableDoc.append(i18n.getText(oFF.FeI18n.GRANDTOTAL_EXAMPLE_TABLE_ROW_4));
	docBuilder.addExampleLine(tableDoc.toString());
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.GRANDTOTAL_REMARK_LINE_1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.GRANDTOTAL_REMARK_LINE_2));
	return docBuilder.build();
};
oFF.FeGrandTotal.prototype.getName = function()
{
	return oFF.FeGrandTotal.NAME;
};
oFF.FeGrandTotal.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeGrandTotal.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeGrandTotal.prototype.getSyntax = function()
{
	return oFF.FeGrandTotal.SYNTAX;
};
oFF.FeGrandTotal.prototype.getType = function()
{
	return oFF.FormulaOperator.GRAND_TOTAL;
};
oFF.FeGrandTotal.prototype.requiresExternalSignFlip = function()
{
	return true;
};

oFF.FeIf = function() {};
oFF.FeIf.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeIf.prototype._ff_c = "FeIf";

oFF.FeIf.NAME = "IF";
oFF.FeIf.SYNTAX = "IF($1,,)";
oFF.FeIf.create = function()
{
	let fItem = new oFF.FeIf();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.BOOLEAN).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.NULL).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.NULL).setArgumentIndexWithSameType(1).setOptional().build());
	fItem.m_arguments = args;
	return fItem;
};
oFF.FeIf.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let trueValue = i18n.getText(oFF.FeI18n.COMMON_VALUE_TRUE);
	let falseValue = i18n.getText(oFF.FeI18n.COMMON_VALUE_FALSE);
	let salesMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_SALES);
	let priceMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_PRICE);
	docBuilder.addSummaryLine(i18n.getTextWithPlaceholder2(oFF.FeI18n.IF_SUMMARY, trueValue, falseValue));
	docBuilder.addSyntaxLine(i18n.getText(oFF.FeI18n.IF_SYNTAX));
	docBuilder.addExampleLine(i18n.getTextWithPlaceholder2(oFF.FeI18n.IF_EXAMPLE_CODE, salesMeasure, priceMeasure));
	docBuilder.addExampleLine(i18n.getTextWithPlaceholder2(oFF.FeI18n.IF_EXAMPLE_RESULT, salesMeasure, priceMeasure));
	docBuilder.addRemarkLine(i18n.getTextWithPlaceholder2(oFF.FeI18n.IF_REMARK_TYPES, trueValue, falseValue));
	docBuilder.addRemarkLine(i18n.getTextWithPlaceholder(oFF.FeI18n.IF_REMARK_OPTIONAL_ELSE, falseValue));
	return docBuilder.build();
};
oFF.FeIf.prototype.getName = function()
{
	return oFF.FeIf.NAME;
};
oFF.FeIf.prototype.getOptionalArgumentsCount = function()
{
	return 1;
};
oFF.FeIf.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeIf.prototype.getReturnType = function(args)
{
	if (oFF.isNull(args) || args.size() < 2)
	{
		return oFF.FeDataType.UNKNOWN;
	}
	let supportedDataTypes = this.getSupportedReturnTypes();
	let firstArgumentDataType = args.get(1).getReturnType();
	if (oFF.XStream.of(supportedDataTypes).find(firstArgumentDataType.isTypeOf.bind(firstArgumentDataType)).isPresent())
	{
		return firstArgumentDataType;
	}
	return supportedDataTypes.get(0);
};
oFF.FeIf.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.NULL).build();
};
oFF.FeIf.prototype.getSyntax = function()
{
	return oFF.FeIf.SYNTAX;
};
oFF.FeIf.prototype.getType = function()
{
	return oFF.FormulaOperator.IF;
};
oFF.FeIf.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() < this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	let arg1 = args.get(0);
	let arg2 = args.get(1);
	let arg3 = args.size() === 3 ? args.get(2) : null;
	if (arg1.getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidBoolean(arg1.getConstantValue().get()))
	{
		if (oFF.XBoolean.convertFromString(arg1.getConstantValue().get()))
		{
			return oFF.XOptional.of(arg2);
		}
		else if (oFF.notNull(arg3))
		{
			return oFF.XOptional.of(arg3);
		}
		else
		{
			let functionArguments = oFF.XList.create();
			functionArguments.add(oFF.FeFormulaConstantExtended.createNull());
			return oFF.XOptional.of(oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), functionArguments, feConfiguration));
		}
	}
	return oFF.XOptional.empty();
};

oFF.FeIntAbstract = function() {};
oFF.FeIntAbstract.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeIntAbstract.prototype._ff_c = "FeIntAbstract";

oFF.FeIntAbstract.NAME = "INT";
oFF.FeIntAbstract.SYNTAX = "INT($1)";
oFF.FeIntAbstract.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getTextWithPlaceholder2(oFF.FeI18n.INT_SUMMARY, this.getLocalization().getText(oFF.FeI18n.INT_SUMMARY_MIN_NUMBER), this.getLocalization().getText(oFF.FeI18n.INT_SUMMARY_MAX_NUMBER)));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.INT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.INT_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.INT_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.INT_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeIntAbstract.prototype.getName = function()
{
	return oFF.FeIntAbstract.NAME;
};
oFF.FeIntAbstract.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeIntAbstract.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeIntAbstract.prototype.getSyntax = function()
{
	return oFF.FeIntAbstract.SYNTAX;
};
oFF.FeIntAbstract.prototype.getType = function()
{
	return oFF.FormulaOperator.INT;
};
oFF.FeIntAbstract.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
};

oFF.FeIsNull = function() {};
oFF.FeIsNull.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeIsNull.prototype._ff_c = "FeIsNull";

oFF.FeIsNull.NAME = "ISNULL";
oFF.FeIsNull.SYNTAX = "ISNULL($1)";
oFF.FeIsNull.create = function()
{
	let feIsNull = new oFF.FeIsNull();
	let args = oFF.XList.create();
	let argumentMetadataBuilder = oFF.FeArgumentMetadataBuilder.create();
	argumentMetadataBuilder.add(oFF.FeDataType.NUMBER);
	argumentMetadataBuilder.add(oFF.FeDataType.INTEGER);
	argumentMetadataBuilder.add(oFF.FeDataType.BOOLEAN);
	argumentMetadataBuilder.add(oFF.FeDataType.STRING);
	argumentMetadataBuilder.add(oFF.FeDataType.MEASURE);
	argumentMetadataBuilder.add(oFF.FeDataType.ATTRIBUTE);
	argumentMetadataBuilder.add(oFF.FeDataType.VARIABLE);
	argumentMetadataBuilder.add(oFF.FeDataType.NULL);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argumentMetadataBuilder.add(oFF.FeDataType.DIMENSION);
	}
	args.add(argumentMetadataBuilder.build());
	feIsNull.m_arguments = args;
	return feIsNull;
};
oFF.FeIsNull.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let trueStr = this.getLocalization().getText(oFF.FeI18n.COMMON_TRUE);
	let falseStr = this.getLocalization().getText(oFF.FeI18n.COMMON_FALSE);
	docBuilder.addSummaryLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ISNULL_SUMMARY, trueStr));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.ISNULL_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.ISNULL_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ISNULL_EXAMPLE_RESULT, falseStr));
	return docBuilder.build();
};
oFF.FeIsNull.prototype.getName = function()
{
	return oFF.FeIsNull.NAME;
};
oFF.FeIsNull.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeIsNull.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.BOOLEAN).build();
};
oFF.FeIsNull.prototype.getSyntax = function()
{
	return oFF.FeIsNull.SYNTAX;
};
oFF.FeIsNull.prototype.getType = function()
{
	return oFF.FormulaOperator.ISNULL;
};
oFF.FeIsNull.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeIsNull.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() < this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	let arg1 = args.get(0);
	if (!arg1.getConstantValue().isPresent() && arg1.getReturnType().isTypeOf(oFF.FeDataType.NULL))
	{
		return oFF.XOptional.of(oFF.FeFormulaConstantExtended.createBoolean(true));
	}
	if (arg1.getConstantValue().isPresent())
	{
		return oFF.XOptional.of(oFF.FeFormulaConstantExtended.createBoolean(false));
	}
	return oFF.XOptional.empty();
};

oFF.FeLog = function() {};
oFF.FeLog.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeLog.prototype._ff_c = "FeLog";

oFF.FeLog.NAME = "LOG";
oFF.FeLog.SYNTAX = "LOG($1)";
oFF.FeLog.create = function()
{
	let feLog = new oFF.FeLog();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feLog.m_arguments = args;
	return feLog;
};
oFF.FeLog.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.LOG_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.LOG_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.LOG_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.LOG_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.LOG_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.LOG_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeLog.prototype.getName = function()
{
	return oFF.FeLog.NAME;
};
oFF.FeLog.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeLog.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeLog.prototype.getSyntax = function()
{
	return oFF.FeLog.SYNTAX;
};
oFF.FeLog.prototype.getType = function()
{
	return oFF.FormulaOperator.LOG;
};
oFF.FeLog.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
};
oFF.FeLog.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.log(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
	});
};
oFF.FeLog.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() === 1 && args.get(0).getReturnType().isTypeOf(oFF.FeDataType.NUMBER) && args.get(0).getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(0)))
	{
		try
		{
			if (oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) <= 0)
			{
				messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.LOGARITHMS_CANNOT_BE_NEGATIVE_NUMBER_AND_ZERO, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_NEGATIVE_NUMBER_AND_ZERO_NOT_ALLOWED, oFF.XString.toUpperCase(this.getName())), null);
			}
		}
		catch (t)
		{
			this.logError2("Log by non-number formulaItem where FI return type is NUMBER", "This is not a throwable error as validation is only looking for a negative number or zero");
		}
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FeLog10 = function() {};
oFF.FeLog10.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeLog10.prototype._ff_c = "FeLog10";

oFF.FeLog10.NAME = "LOG10";
oFF.FeLog10.SYNTAX = "LOG10($1)";
oFF.FeLog10.create = function()
{
	let feLog10 = new oFF.FeLog10();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feLog10.m_arguments = args;
	return feLog10;
};
oFF.FeLog10.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.LOG10_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.LOG10_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.LOG10_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.LOG10_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.LOG10_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeLog10.prototype.getName = function()
{
	return oFF.FeLog10.NAME;
};
oFF.FeLog10.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeLog10.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeLog10.prototype.getSyntax = function()
{
	return oFF.FeLog10.SYNTAX;
};
oFF.FeLog10.prototype.getType = function()
{
	return oFF.FormulaOperator.LOG_10;
};
oFF.FeLog10.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
};
oFF.FeLog10.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.log10(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
	});
};
oFF.FeLog10.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() === 1 && args.get(0).getReturnType().isTypeOf(oFF.FeDataType.NUMBER) && args.get(0).getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(0)))
	{
		try
		{
			if (oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) <= 0)
			{
				messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.LOGARITHMS_CANNOT_BE_NEGATIVE_NUMBER_AND_ZERO, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_NEGATIVE_NUMBER_AND_ZERO_NOT_ALLOWED, oFF.XString.toUpperCase(this.getName())), null);
			}
		}
		catch (t)
		{
			this.logError2("Log10 by non-number formulaItem where FI return type is NUMBER", "This is not a throwable error as validation is only looking for a negative number and zero");
		}
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FeMax = function() {};
oFF.FeMax.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeMax.prototype._ff_c = "FeMax";

oFF.FeMax.NAME = "MAX";
oFF.FeMax.SYNTAX = "MAX($1,)";
oFF.FeMax.create = function()
{
	let max = new oFF.FeMax();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER);
	args.add(argsBuilder.build());
	args.add(argsBuilder.build());
	args.add(argsBuilder.setOptional().build());
	max.m_arguments = args;
	return max;
};
oFF.FeMax.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.MAX_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.MAX_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MAX_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MAX_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.MAX_REMARK_TYPES_LINE1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.MAX_REMARK_TYPES_LINE2));
	return docBuilder.build();
};
oFF.FeMax.prototype.getName = function()
{
	return oFF.FeMax.NAME;
};
oFF.FeMax.prototype.getOptionalArgumentsCount = function()
{
	return oFF.XInteger.getMaximumValue();
};
oFF.FeMax.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeMax.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeMax.prototype.getSyntax = function()
{
	return oFF.FeMax.SYNTAX;
};
oFF.FeMax.prototype.getType = function()
{
	return oFF.FormulaOperator.MAX;
};
oFF.FeMax.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.MAX);
};
oFF.FeMax.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW) && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.MAX_BW) || datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeMin = function() {};
oFF.FeMin.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeMin.prototype._ff_c = "FeMin";

oFF.FeMin.NAME = "MIN";
oFF.FeMin.SYNTAX = "MIN($1,)";
oFF.FeMin.create = function()
{
	let min = new oFF.FeMin();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER);
	args.add(argsBuilder.build());
	args.add(argsBuilder.build());
	args.add(argsBuilder.setOptional().build());
	min.m_arguments = args;
	return min;
};
oFF.FeMin.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.MIN_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.MIN_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MIN_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MIN_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.MIN_REMARK_TYPES_LINE1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.MIN_REMARK_TYPES_LINE2));
	return docBuilder.build();
};
oFF.FeMin.prototype.getName = function()
{
	return oFF.FeMin.NAME;
};
oFF.FeMin.prototype.getOptionalArgumentsCount = function()
{
	return oFF.XInteger.getMaximumValue();
};
oFF.FeMin.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeMin.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeMin.prototype.getSyntax = function()
{
	return oFF.FeMin.SYNTAX;
};
oFF.FeMin.prototype.getType = function()
{
	return oFF.FormulaOperator.MIN;
};
oFF.FeMin.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.MIN);
};
oFF.FeMin.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW) && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.MIN_BW) || datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeMod = function() {};
oFF.FeMod.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeMod.prototype._ff_c = "FeMod";

oFF.FeMod.NAME = "MOD";
oFF.FeMod.SYNTAX = "MOD($1,)";
oFF.FeMod.create = function()
{
	let feMod = new oFF.FeMod();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER);
	args.add(argsBuilder.build());
	args.add(argsBuilder.build());
	feMod.m_arguments = args;
	return feMod;
};
oFF.FeMod.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.MOD_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.MOD_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MOD_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.MOD_EXAMPLE_RESULT));
	return docBuilder.build();
};
oFF.FeMod.prototype.getName = function()
{
	return oFF.FeMod.NAME;
};
oFF.FeMod.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeMod.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeMod.prototype.getSyntax = function()
{
	return oFF.FeMod.SYNTAX;
};
oFF.FeMod.prototype.getType = function()
{
	return oFF.FormulaOperator.MOD_MDS;
};
oFF.FeMod.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.doubleMod(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()), oFF.XDouble.convertFromString(args.get(1).getConstantValue().get())));
	});
};
oFF.FeMod.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() === 2 && args.get(1).getReturnType().isTypeOf(oFF.FeDataType.NUMBER) && oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(1)))
	{
		try
		{
			if (oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()) === 0)
			{
				messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.DIVISION_CANNOT_DIVIDE_BY_ZERO, this.getLocalization().getText(oFF.FeI18n.DIVISION_BY_ZERO), null);
			}
		}
		catch (t)
		{
			this.logError2("Division by non-number formulaItem where FI return type is NUMBER", "This is not a throwable error as validation is only looking for a number 0");
		}
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FePercentOfGrandTotalBW = function() {};
oFF.FePercentOfGrandTotalBW.prototype = new oFF.FeFormulaItemMetadata();
oFF.FePercentOfGrandTotalBW.prototype._ff_c = "FePercentOfGrandTotalBW";

oFF.FePercentOfGrandTotalBW.NAME = "%GRANDTOTAL";
oFF.FePercentOfGrandTotalBW.SYNTAX = "%GRANDTOTAL($1)";
oFF.FePercentOfGrandTotalBW.create = function()
{
	let percentGrandTotal = new oFF.FePercentOfGrandTotalBW();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	args.add(argsBuilder.build());
	percentGrandTotal.m_arguments = args;
	return percentGrandTotal;
};
oFF.FePercentOfGrandTotalBW.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let tableOpen = i18n.getText(oFF.FeI18n.COMMON_TABLE_OPEN);
	let salesMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_SALES);
	let exampleCode = i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_CODE);
	docBuilder.addSummaryLine(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SUMMARY));
	docBuilder.addSyntaxLine(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SYNTAX));
	docBuilder.addExampleLine(exampleCode);
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_RESULT_LINE_1));
	let tableDoc = oFF.XStringBuffer.create();
	tableDoc.append(tableOpen);
	tableDoc.append(i18n.getTextWithPlaceholder2(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_HEADER, salesMeasure, exampleCode));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_5));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_6));
	docBuilder.addExampleLine(tableDoc.toString());
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_2));
	return docBuilder.build();
};
oFF.FePercentOfGrandTotalBW.prototype.getName = function()
{
	return oFF.FePercentOfGrandTotalBW.NAME;
};
oFF.FePercentOfGrandTotalBW.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FePercentOfGrandTotalBW.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FePercentOfGrandTotalBW.prototype.getSyntax = function()
{
	return oFF.FePercentOfGrandTotalBW.SYNTAX;
};
oFF.FePercentOfGrandTotalBW.prototype.getType = function()
{
	return oFF.FormulaOperator.PERCENT_GRAND_TOTAL;
};
oFF.FePercentOfGrandTotalBW.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW);
};

oFF.FePercentOfGrandTotalHana = function() {};
oFF.FePercentOfGrandTotalHana.prototype = new oFF.FeFormulaItemMetadata();
oFF.FePercentOfGrandTotalHana.prototype._ff_c = "FePercentOfGrandTotalHana";

oFF.FePercentOfGrandTotalHana.NAME = "%GRANDTOTAL";
oFF.FePercentOfGrandTotalHana.SYNTAX = "%GRANDTOTAL($1)";
oFF.FePercentOfGrandTotalHana.create = function()
{
	let percentGrandTotal = new oFF.FePercentOfGrandTotalHana();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	args.add(argsBuilder.build());
	percentGrandTotal.m_arguments = args;
	return percentGrandTotal;
};
oFF.FePercentOfGrandTotalHana.prototype.getCustomFormulaItem = function(args, feConfiguration)
{
	let grandTotal = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeGrandTotal.NAME, args, feConfiguration);
	let argsForDivision = oFF.XList.create();
	argsForDivision.add(args.get(0));
	argsForDivision.add(grandTotal);
	let formulaFunction = oFF.FeFormulaFunctionExtended.cast(oFF.FeFormulaFunctionExtended.createFunctionWithNameAndNumericShift(oFF.FormulaOperator.DIVISION.getName(), argsForDivision, feConfiguration, oFF.XIntegerValue.create(2))).get();
	let percentOfGrandTotalFormulaItem = oFF.XOptional.of(formulaFunction);
	return percentOfGrandTotalFormulaItem;
};
oFF.FePercentOfGrandTotalHana.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let tableOpen = i18n.getText(oFF.FeI18n.COMMON_TABLE_OPEN);
	let salesMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_SALES);
	let exampleCode = i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_CODE);
	docBuilder.addSummaryLine(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SUMMARY));
	docBuilder.addSyntaxLine(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_SYNTAX));
	docBuilder.addExampleLine(exampleCode);
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_RESULT_LINE_1));
	let tableDoc = oFF.XStringBuffer.create();
	tableDoc.append(tableOpen);
	tableDoc.append(i18n.getTextWithPlaceholder2(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_HEADER, salesMeasure, exampleCode));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_1));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_2));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_3));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_4));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_5));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_EXAMPLE_TABLE_ROW_6));
	docBuilder.addExampleLine(tableDoc.toString());
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_GRANDTOTAL_REMARK_LINE_2));
	return docBuilder.build();
};
oFF.FePercentOfGrandTotalHana.prototype.getName = function()
{
	return oFF.FePercentOfGrandTotalHana.NAME;
};
oFF.FePercentOfGrandTotalHana.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FePercentOfGrandTotalHana.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FePercentOfGrandTotalHana.prototype.getSyntax = function()
{
	return oFF.FePercentOfGrandTotalHana.SYNTAX;
};
oFF.FePercentOfGrandTotalHana.prototype.getType = function()
{
	return oFF.FormulaOperator.PERCENT_GRAND_TOTAL;
};
oFF.FePercentOfGrandTotalHana.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FePercentOfGrandTotalHana.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	return this.getCustomFormulaItem(args, feConfiguration);
};

oFF.FeRestrict = function() {};
oFF.FeRestrict.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeRestrict.prototype._ff_c = "FeRestrict";

oFF.FeRestrict.NAME = "RESTRICT";
oFF.FeRestrict.SYNTAX = "RESTRICT($1,)";
oFF.FeRestrict.create = function()
{
	let feRestrict = new oFF.FeRestrict();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION_FILTER).build());
	feRestrict.m_arguments = args;
	return feRestrict;
};
oFF.FeRestrict.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_REMARK_TYPES));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.RESTRICT_REMARK_TYPES2));
	return docBuilder.build();
};
oFF.FeRestrict.prototype.getName = function()
{
	return oFF.FeRestrict.NAME;
};
oFF.FeRestrict.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeRestrict.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeRestrict.prototype.getSyntax = function()
{
	return oFF.FeRestrict.SYNTAX;
};
oFF.FeRestrict.prototype.getType = function()
{
	return oFF.FeTransientFormulaOperator.RESTRICT;
};
oFF.FeRestrict.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.RESTRICT);
};
oFF.FeRestrict.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeRestrict.prototype.transform = function(args, feConfiguration)
{
	return oFF.XOptional.of(oFF.FeFormulaRestrictedMemberExtended.createWithRestrict(args));
};

oFF.FeResultLookup = function() {};
oFF.FeResultLookup.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeResultLookup.prototype._ff_c = "FeResultLookup";

oFF.FeResultLookup.NAME = "RESULTLOOKUP";
oFF.FeResultLookup.SYNTAX = "RESULTLOOKUP($1,)";
oFF.FeResultLookup.create = function()
{
	let resultLookup = new oFF.FeResultLookup();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	let listTypeWithoutGenericTypeValidation = oFF.FeDataType.createWithSettings(oFF.FeDataType.LIST, false);
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION_FILTER).add(listTypeWithoutGenericTypeValidation).build());
	resultLookup.m_arguments = args;
	return resultLookup;
};
oFF.FeResultLookup.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let filters = i18n.getText(oFF.FeI18n.COMMON_FILTERS);
	let netRevenue = i18n.getText(oFF.FeI18n.COMMON_MEASURE_NETREVENUE);
	let cityDimension = i18n.getText(oFF.FeI18n.COMMON_DIMENSION_CITY);
	let cityValue = i18n.getText(oFF.FeI18n.COMMON_VALUE_CITY);
	docBuilder.addSyntaxLine(i18n.getTextWithPlaceholder(oFF.FeI18n.RESULTLOOKUP_SYNTAX, filters));
	docBuilder.addSummaryLine(i18n.getText(oFF.FeI18n.RESULTLOOKUP_SUMMARY));
	let placeholders = oFF.XList.create();
	placeholders.add(netRevenue);
	placeholders.add(cityDimension);
	placeholders.add(cityValue);
	docBuilder.addExampleLine(i18n.getTextWithPlaceholders(oFF.FeI18n.RESULTLOOKUP_EXAMPLE_CODE, placeholders));
	docBuilder.addExampleLine(i18n.getTextWithPlaceholders(oFF.FeI18n.RESULTLOOKUP_EXAMPLE_RESULT, placeholders));
	return docBuilder.build();
};
oFF.FeResultLookup.prototype.getName = function()
{
	return oFF.FeResultLookup.NAME;
};
oFF.FeResultLookup.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeResultLookup.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeResultLookup.prototype.getSyntax = function()
{
	return oFF.FeResultLookup.SYNTAX;
};
oFF.FeResultLookup.prototype.getType = function()
{
	return oFF.FormulaOperator.CELL_VALUE;
};
oFF.FeResultLookup.prototype.isArrayInTree = function(item)
{
	let arrayOpt = oFF.FeFormulaArrayExtended.castToArray(item);
	if (arrayOpt.isPresent())
	{
		return true;
	}
	let functionOpt = oFF.FeFormulaFunctionExtended.cast(item);
	if (!functionOpt.isPresent() || !functionOpt.get().getReturnType().isTypeOf(oFF.FeDataType.BOOLEAN))
	{
		return false;
	}
	return this.isArrayInTree(functionOpt.get().get(0)) || this.isArrayInTree(functionOpt.get().get(1));
};
oFF.FeResultLookup.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.RESULTLOOKUP) && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.FORMULA_CONFIG);
};
oFF.FeResultLookup.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeResultLookup.prototype.requiresExternalSignFlip = function()
{
	return true;
};
oFF.FeResultLookup.prototype.showUniqueDimensionsOnly = function()
{
	return true;
};
oFF.FeResultLookup.prototype.transform = function(args, feConfiguration)
{
	let measureMemberOpt = oFF.FeFormulaMemberExtended.cast(args.get(0));
	let dimensionFilterFunctionOpt = oFF.FeFormulaFunctionExtended.cast(args.get(1));
	if (!measureMemberOpt.isPresent() || !dimensionFilterFunctionOpt.isPresent() || dimensionFilterFunctionOpt.get().getReturnType() !== oFF.FeDataType.DIMENSION_FILTER)
	{
		return oFF.XOptional.empty();
	}
	let dimensionMembers = oFF.FeDimensionFilterConverter.flattenConditionTreeToFormulaMemberList(dimensionFilterFunctionOpt.get()).createListCopy();
	if (dimensionMembers.isEmpty())
	{
		return oFF.XOptional.empty();
	}
	dimensionMembers.insert(0, measureMemberOpt.get());
	let processedArgs = oFF.XStream.of(dimensionMembers).map((dimensionMember) => {
		dimensionMember.setDimensionName(dimensionMember.getFeContext().get().getDimensionName());
		return dimensionMember;
	}).collect(oFF.XStreamCollector.toList());
	let simplifiedItem = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeCellValue.NAME, processedArgs, feConfiguration);
	return oFF.XOptional.of(simplifiedItem);
};
oFF.FeResultLookup.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	let functionOpt = oFF.FeFormulaFunctionExtended.cast(args.get(1));
	if (functionOpt.isPresent() && functionOpt.get().getReturnType().isTypeOf(oFF.FeDataType.DIMENSION_FILTER))
	{
		if (this.isArrayInTree(functionOpt.get()))
		{
			messageManager.addErrorExt(oFF.FeResultLookup.NAME, oFF.FeErrorCodes.ARGUMENTS_SINGLE_VALUE_DIM_CONDITIONS, this.getLocalization().getTextWithPlaceholder2(oFF.FeI18n.ERROR_ARGUMENT_SINGLE_VALUE_DIM_CONDITIONS, oFF.FeResultLookup.NAME, "2"), null);
		}
		else
		{
			this.validateForUniqueDimensions(functionOpt.get(), messageManager);
		}
	}
	return oFF.XOptional.of(messageManager);
};
oFF.FeResultLookup.prototype.validateForUniqueDimensions = function(func, messageManager)
{
	let dimensionMembers = oFF.FeDimensionFilterConverter.flattenConditionTreeToFormulaMemberList(func);
	let dimensionNames = oFF.XHashSetOfString.create();
	for (let i = 0; i < dimensionMembers.size(); i++)
	{
		let dimensionMember = dimensionMembers.get(i);
		if (dimensionMember.getFeContext().isPresent())
		{
			let dimensionName = dimensionMember.getFeContext().get().getDimensionName();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(dimensionName))
			{
				if (dimensionNames.contains(dimensionName))
				{
					messageManager.addErrorExt(oFF.FeResultLookup.NAME, oFF.FeErrorCodes.ARGUMENTS_NON_UNIQUE_DIMENSION, this.getLocalization().getTextWithPlaceholder2(oFF.FeI18n.ERROR_ARGUMENT_NON_UNIQUE_DIMENSIONS, oFF.FeResultLookup.NAME, dimensionName), null);
					break;
				}
				else
				{
					dimensionNames.add(dimensionName);
				}
			}
		}
	}
};

oFF.FeRound = function() {};
oFF.FeRound.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeRound.prototype._ff_c = "FeRound";

oFF.FeRound.NAME = "ROUND";
oFF.FeRound.SYNTAX = "ROUND($1,)";
oFF.FeRound.create = function()
{
	let feRound = new oFF.FeRound();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).build());
	feRound.m_arguments = args;
	return feRound;
};
oFF.FeRound.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.ROUND_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.ROUND_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.ROUND_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ROUND_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.ROUND_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.ROUND_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeRound.prototype.getName = function()
{
	return oFF.FeRound.NAME;
};
oFF.FeRound.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeRound.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeRound.prototype.getSyntax = function()
{
	return oFF.FeRound.SYNTAX;
};
oFF.FeRound.prototype.getType = function()
{
	return oFF.FormulaOperator.ROUND;
};
oFF.FeRound.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
};
oFF.FeRound.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeRound.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.round(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()), oFF.XInteger.convertFromString(args.get(1).getConstantValue().get())));
	});
};

oFF.FeSqrt = function() {};
oFF.FeSqrt.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeSqrt.prototype._ff_c = "FeSqrt";

oFF.FeSqrt.NAME = "SQRT";
oFF.FeSqrt.SYNTAX = "SQRT($1)";
oFF.FeSqrt.create = function()
{
	let feSqrt = new oFF.FeSqrt();
	let args = oFF.XList.create();
	let argsBuilder = oFF.FeArgumentMetadataBuilder.create();
	argsBuilder.add(oFF.FeDataType.MEASURE);
	argsBuilder.add(oFF.FeDataType.NUMBER);
	argsBuilder.add(oFF.FeDataType.INTEGER);
	args.add(argsBuilder.build());
	feSqrt.m_arguments = args;
	return feSqrt;
};
oFF.FeSqrt.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.SQRT_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.SQRT_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.SQRT_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.SQRT_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.SQRT_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeSqrt.prototype.getName = function()
{
	return oFF.FeSqrt.NAME;
};
oFF.FeSqrt.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeSqrt.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeSqrt.prototype.getSyntax = function()
{
	return oFF.FeSqrt.SYNTAX;
};
oFF.FeSqrt.prototype.getType = function()
{
	return oFF.FormulaOperator.SQRT;
};
oFF.FeSqrt.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.sqrt(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get())));
	});
};
oFF.FeSqrt.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() === 1 && args.get(0).getReturnType().isTypeOf(oFF.FeDataType.NUMBER) && args.get(0).getConstantValue().isPresent() && oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(0)))
	{
		try
		{
			if (oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) < 0)
			{
				messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.SQRT_CANNOT_BE_NEGATIVE_NUMBER, this.getLocalization().getText(oFF.FeI18n.SQRT_ERROR_ARGUMENT_NEGATIVE_NUMBER_NOT_ALLOWED), null);
			}
		}
		catch (t)
		{
			this.logError2("Sqrt by non-number formulaItem where FI return type is NUMBER", "This is not a throwable error as validation is only looking for a negative number");
		}
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FeSubtotalAbstract = function() {};
oFF.FeSubtotalAbstract.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeSubtotalAbstract.prototype._ff_c = "FeSubtotalAbstract";

oFF.FeSubtotalAbstract.prototype.getArgumentsCount = function()
{
	return this.getRequiredArgumentsCount();
};
oFF.FeSubtotalAbstract.prototype.getOptionalArgumentsCount = function()
{
	return 9;
};
oFF.FeSubtotalAbstract.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeSubtotalAbstract.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeSubtotalAbstract.prototype.getType = function()
{
	return oFF.FormulaOperator.SUB_TOTAL;
};
oFF.FeSubtotalAbstract.prototype.getUnsupportedNestedFunctions = function()
{
	let unsupportedNestedFunctions = oFF.XHashSetOfString.create();
	unsupportedNestedFunctions.add(oFF.XString.toUpperCase(oFF.FeSubtotalHana.NAME));
	unsupportedNestedFunctions.add(oFF.XString.toUpperCase(oFF.FePercentOfSubtotalHana.NAME));
	return unsupportedNestedFunctions;
};
oFF.FeSubtotalAbstract.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.SUBTOTAL_FUNCTIONS) && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.FORMULA_CONFIG);
};
oFF.FeSubtotalAbstract.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeSubtotalAbstract.prototype.showUniqueDimensionsOnly = function()
{
	return true;
};
oFF.FeSubtotalAbstract.prototype.validateArguments = function(args)
{
	let validationMessages = oFF.MessageManagerSimple.createMessageManager();
	let dimensionArgList = oFF.XCollectionUtils.sliceList(args, 1, args.size());
	let hasNonDimensionArg = oFF.XStream.of(dimensionArgList).anyMatch((dimensionArg) => {
		return !oFF.FeFormulaAttributeExtended.cast(dimensionArg).isPresent();
	});
	if (!hasNonDimensionArg)
	{
		let dimensionList = oFF.XStream.of(dimensionArgList).map((dimension) => {
			return oFF.FeFormulaAttributeExtended.cast(dimension).get();
		}).collect(oFF.XStreamCollector.toList());
		this.validateUniqueDimensions(dimensionList, validationMessages);
		this.validateNumberOfHierarchicalDimensions(dimensionList, validationMessages);
		this.validateNoVersionDimension(dimensionList, validationMessages);
	}
	return oFF.XOptional.of(validationMessages);
};
oFF.FeSubtotalAbstract.prototype.validateNoVersionDimension = function(dimensionList, validationMessages)
{
	oFF.XStream.of(dimensionList).map((formulaDimension) => {
		return formulaDimension.getFeDimension();
	}).filter((feDimensionOpt) => {
		return feDimensionOpt.isPresent() && feDimensionOpt.get().isVersionDimension();
	}).forEach((versionFeDimension) => {
		validationMessages.addErrorExt("SUBTOTAL", oFF.FeErrorCodes.ARGUMENTS_VERSION_DIMENSION_USED_WHERE_INVALID, this.getLocalization().getTextWithPlaceholder2(oFF.FeI18n.ERROR_ARGUMENT_VERSION_DIMENSION_NOT_SUPPORTED, versionFeDimension.get().getDimensionName(), this.getName()), null);
	});
};
oFF.FeSubtotalAbstract.prototype.validateNumberOfHierarchicalDimensions = function(dimensionList, validationMessages)
{
	let hierarchicalDimensionsCount = oFF.XStream.of(dimensionList).filter((formulaDimension) => {
		let feDimension = formulaDimension.getFeDimension();
		return feDimension.isPresent() && feDimension.get().getHierarchies().hasElements();
	}).countItems();
	if (hierarchicalDimensionsCount > 3)
	{
		validationMessages.addErrorExt("SUBTOTAL", oFF.FeErrorCodes.ARGUMENTS_TOO_MANY_HIERARCHICAL_DIMENSIONS, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_TOO_MANY_HIERARCHICAL_DIMENSIONS, this.getName()), null);
	}
};
oFF.FeSubtotalAbstract.prototype.validateUniqueDimensions = function(dimensionList, validationMessages)
{
	let setOfDimensions = oFF.XHashSetOfString.create();
	let dimensionIterator = dimensionList.getIterator();
	while (dimensionIterator.hasNext())
	{
		let formulaDimension = dimensionIterator.next();
		if (!setOfDimensions.contains(formulaDimension.getName()))
		{
			setOfDimensions.add(formulaDimension.getName());
		}
		else
		{
			validationMessages.addErrorExt("SUBTOTAL", oFF.FeErrorCodes.ARGUMENTS_NON_UNIQUE_DIMENSION, this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.ERROR_ARGUMENT_NON_UNIQUE_DIMENSIONS, this.getName()), null);
			break;
		}
	}
};

oFF.FeSubtotalInternal = function() {};
oFF.FeSubtotalInternal.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeSubtotalInternal.prototype._ff_c = "FeSubtotalInternal";

oFF.FeSubtotalInternal.NAME = "SUBTOTAL_INTERNAL";
oFF.FeSubtotalInternal.SYNTAX = "SUBTOTAL($1,)";
oFF.FeSubtotalInternal.create = function()
{
	let subTotalInternal = new oFF.FeSubtotalInternal();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.LIST_STRING).build());
	subTotalInternal.m_arguments = args;
	return subTotalInternal;
};
oFF.FeSubtotalInternal.prototype.getArgumentsCount = function()
{
	return this.getRequiredArgumentsCount();
};
oFF.FeSubtotalInternal.prototype.getName = function()
{
	return oFF.FeSubtotalInternal.NAME;
};
oFF.FeSubtotalInternal.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeSubtotalInternal.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeSubtotalInternal.prototype.getSyntax = function()
{
	return oFF.FeSubtotalInternal.SYNTAX;
};
oFF.FeSubtotalInternal.prototype.getType = function()
{
	return oFF.FormulaOperator.SUB_TOTAL;
};
oFF.FeSubtotalInternal.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.SUBTOTAL_FUNCTIONS) && oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.FORMULA_CONFIG);
};
oFF.FeSubtotalInternal.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeSubtotalInternal.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeSubtotalInternal.prototype.requiresExternalSignFlip = function()
{
	return true;
};

oFF.FeTruncAbstract = function() {};
oFF.FeTruncAbstract.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeTruncAbstract.prototype._ff_c = "FeTruncAbstract";

oFF.FeTruncAbstract.NAME = "TRUNC";
oFF.FeTruncAbstract.SYNTAX = "TRUNC($1,)";
oFF.FeTruncAbstract.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.TRUNC_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.TRUNC_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.TRUNC_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getTextWithPlaceholder(oFF.FeI18n.TRUNC_EXAMPLE_RESULT, this.getLocalization().getText(oFF.FeI18n.TRUNC_EXAMPLE_RESULT_NUMBER)));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.TRUNC_REMARK_TYPES));
	return docBuilder.build();
};
oFF.FeTruncAbstract.prototype.getName = function()
{
	return oFF.FeTruncAbstract.NAME;
};
oFF.FeTruncAbstract.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeTruncAbstract.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeTruncAbstract.prototype.getSyntax = function()
{
	return oFF.FeTruncAbstract.SYNTAX;
};
oFF.FeTruncAbstract.prototype.getType = function()
{
	return oFF.FormulaOperator.TRUNCATE;
};
oFF.FeTruncAbstract.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
};

oFF.FeCalcDaysBetween = function() {};
oFF.FeCalcDaysBetween.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeCalcDaysBetween.prototype._ff_c = "FeCalcDaysBetween";

oFF.FeCalcDaysBetween.NAME = "CALCDAYSBETWEEN";
oFF.FeCalcDaysBetween.SYNTAX = "CALCDAYSBETWEEN($1,)";
oFF.FeCalcDaysBetween.create = function()
{
	let feCalcDaysBetween = new oFF.FeCalcDaysBetween();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	feCalcDaysBetween.m_arguments = args;
	return feCalcDaysBetween;
};
oFF.FeCalcDaysBetween.prototype.getName = function()
{
	return oFF.FeCalcDaysBetween.NAME;
};
oFF.FeCalcDaysBetween.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeCalcDaysBetween.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeCalcDaysBetween.prototype.getSyntax = function()
{
	return oFF.FeCalcDaysBetween.SYNTAX;
};
oFF.FeCalcDaysBetween.prototype.getType = function()
{
	return oFF.FormulaOperator.CALCDAYSBETWEEN;
};
oFF.FeCalcDaysBetween.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF);
};
oFF.FeCalcDaysBetween.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeCalcDaysBetween.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeCalcMonthsBetween = function() {};
oFF.FeCalcMonthsBetween.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeCalcMonthsBetween.prototype._ff_c = "FeCalcMonthsBetween";

oFF.FeCalcMonthsBetween.NAME = "CALCMONTHSBETWEEN";
oFF.FeCalcMonthsBetween.SYNTAX = "CALCMONTHSBETWEEN($1,)";
oFF.FeCalcMonthsBetween.create = function()
{
	let feCalcMonthsBetween = new oFF.FeCalcMonthsBetween();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	feCalcMonthsBetween.m_arguments = args;
	return feCalcMonthsBetween;
};
oFF.FeCalcMonthsBetween.prototype.getName = function()
{
	return oFF.FeCalcMonthsBetween.NAME;
};
oFF.FeCalcMonthsBetween.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeCalcMonthsBetween.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeCalcMonthsBetween.prototype.getSyntax = function()
{
	return oFF.FeCalcMonthsBetween.SYNTAX;
};
oFF.FeCalcMonthsBetween.prototype.getType = function()
{
	return oFF.FormulaOperator.CALCMONTHSBETWEEN;
};
oFF.FeCalcMonthsBetween.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF);
};
oFF.FeCalcMonthsBetween.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeCalcMonthsBetween.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeCalcYearsBetween = function() {};
oFF.FeCalcYearsBetween.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeCalcYearsBetween.prototype._ff_c = "FeCalcYearsBetween";

oFF.FeCalcYearsBetween.NAME = "CALCYEARSBETWEEN";
oFF.FeCalcYearsBetween.SYNTAX = "CALCYEARSBETWEEN($1,)";
oFF.FeCalcYearsBetween.create = function()
{
	let feCalcYearsBetween = new oFF.FeCalcYearsBetween();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).build());
	feCalcYearsBetween.m_arguments = args;
	return feCalcYearsBetween;
};
oFF.FeCalcYearsBetween.prototype.getName = function()
{
	return oFF.FeCalcYearsBetween.NAME;
};
oFF.FeCalcYearsBetween.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeCalcYearsBetween.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeCalcYearsBetween.prototype.getSyntax = function()
{
	return oFF.FeCalcYearsBetween.SYNTAX;
};
oFF.FeCalcYearsBetween.prototype.getType = function()
{
	return oFF.FormulaOperator.CALCYEARSBETWEEN;
};
oFF.FeCalcYearsBetween.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF);
};
oFF.FeCalcYearsBetween.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeCalcYearsBetween.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeDateDiff = function() {};
oFF.FeDateDiff.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeDateDiff.prototype._ff_c = "FeDateDiff";

oFF.FeDateDiff.NAME = "DATEDIFF";
oFF.FeDateDiff.SYNTAX = "DATEDIFF($1,,)";
oFF.FeDateDiff.create = function()
{
	let feDatediff = new oFF.FeDateDiff();
	let args = oFF.XList.create();
	let stringTypeWithoutGenericTypeValidation = oFF.FeDataType.createWithSettings(oFF.FeDataType.STRING, false);
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).add(stringTypeWithoutGenericTypeValidation).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DATE).add(oFF.FeDataType.DATE_DIMENSION).add(stringTypeWithoutGenericTypeValidation).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.GRANULARITY).add(stringTypeWithoutGenericTypeValidation).build());
	feDatediff.m_arguments = args;
	return feDatediff;
};
oFF.FeDateDiff.prototype.getArgToPassDown = function(arg)
{
	let formulaAttribute = oFF.FeFormulaAttributeExtended.cast(arg);
	if (arg.getReturnType().isEqualTo(oFF.FeDataType.DATE_DIMENSION) && formulaAttribute.isPresent() && formulaAttribute.get().getFeDimension().isPresent())
	{
		let feDimension = formulaAttribute.get().getFeDimension().get();
		return oFF.XOptional.of(oFF.FeFormulaAttributeExtended.create(feDimension.getFlatKeyField().getId(), arg.getReturnType(), feDimension));
	}
	else
	{
		return oFF.XOptional.of(arg);
	}
};
oFF.FeDateDiff.prototype.getArgsToPassDown = function(args)
{
	let argsToPassDown = oFF.XList.create();
	let arg0 = this.getArgToPassDown(args.get(0));
	if (arg0.isPresent())
	{
		argsToPassDown.add(arg0.get());
	}
	let arg1 = this.getArgToPassDown(args.get(1));
	if (arg1.isPresent())
	{
		argsToPassDown.add(arg1.get());
	}
	return argsToPassDown;
};
oFF.FeDateDiff.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_EXAMPLE_RESULT));
	docBuilder.addRemarkLine(this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE1, this.getGranularityList()));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_REMARK_TYPES_LINE2));
	return docBuilder.build();
};
oFF.FeDateDiff.prototype.getGranularityFromArg = function(arg)
{
	let optionalGranularityString = arg.getConstantValue();
	if (optionalGranularityString.isPresent())
	{
		let granularity = oFF.FeDateGranularityConstants.lookup(optionalGranularityString.get());
		if (oFF.notNull(granularity))
		{
			return granularity;
		}
	}
	return oFF.FeDateGranularityConstants.DAY;
};
oFF.FeDateDiff.prototype.getGranularityList = function()
{
	let locArgs = oFF.XList.create();
	locArgs.add(oFF.FeDateGranularityConstants.YEAR.getName());
	locArgs.add(oFF.FeDateGranularityConstants.MONTH.getName());
	locArgs.add(oFF.FeDateGranularityConstants.DAY.getName());
	return locArgs;
};
oFF.FeDateDiff.prototype.getGranularityToDateDifferenceMap = function()
{
	let granularityToDateDifferenceMap = oFF.XHashMapByString.create();
	granularityToDateDifferenceMap.put(oFF.FeDateGranularityConstants.DAY.getName(), oFF.FeCalcDaysBetween.NAME);
	granularityToDateDifferenceMap.put(oFF.FeDateGranularityConstants.MONTH.getName(), oFF.FeCalcMonthsBetween.NAME);
	granularityToDateDifferenceMap.put(oFF.FeDateGranularityConstants.YEAR.getName(), oFF.FeCalcYearsBetween.NAME);
	return granularityToDateDifferenceMap;
};
oFF.FeDateDiff.prototype.getName = function()
{
	return oFF.FeDateDiff.NAME;
};
oFF.FeDateDiff.prototype.getRequiredArgumentsCount = function()
{
	return 3;
};
oFF.FeDateDiff.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.INTEGER).build();
};
oFF.FeDateDiff.prototype.getSyntax = function()
{
	return oFF.FeDateDiff.SYNTAX;
};
oFF.FeDateDiff.prototype.getType = function()
{
	return oFF.FeTransientFormulaOperator.DATE_DIFFERENCE;
};
oFF.FeDateDiff.prototype.hasArgConstantValue = function(args, index)
{
	return args.get(index).getReturnType().isEqualTo(oFF.FeDataType.STRING) && args.get(index).getConstantValue().isPresent();
};
oFF.FeDateDiff.prototype.isEnabled = function()
{
	return oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DATEDIFF);
};
oFF.FeDateDiff.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeDateDiff.prototype.transform = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	let granularity = this.getGranularityFromArg(args.get(2));
	let granularityMap = this.getGranularityToDateDifferenceMap();
	if (granularityMap.containsKey(granularity.getName()))
	{
		return oFF.XOptional.of(oFF.FeFormulaFunctionExtended.createFunctionWithName(granularityMap.getByKey(granularity.getName()), this.getArgsToPassDown(args), feConfiguration));
	}
	else
	{
		return oFF.XOptional.empty();
	}
};
oFF.FeDateDiff.prototype.transformArgs = function(args, feConfiguration)
{
	let transformedArgs = oFF.XList.createWithList(args);
	if (args.size() === this.getRequiredArgumentsCount())
	{
		for (let i = 0; i < 2; i++)
		{
			let stringConstantOpt = oFF.FeFormulaConstantExtended.cast(args.get(i));
			if (stringConstantOpt.isPresent())
			{
				transformedArgs.set(i, this.transformDateStringArg(stringConstantOpt.get()));
			}
		}
		let granularityConstantOpt = oFF.FeFormulaConstantExtended.cast(args.get(2));
		if (granularityConstantOpt.isPresent())
		{
			transformedArgs.set(2, this.transformGranularityStringArg(granularityConstantOpt.get()));
		}
	}
	return transformedArgs;
};
oFF.FeDateDiff.prototype.transformDateStringArg = function(arg)
{
	let text = arg.getString();
	if (oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.DAY || oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.MONTH || oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.YEAR)
	{
		return oFF.FeFormulaConstantExtended.create(text, oFF.FeDataType.GRANULARITY);
	}
	else if (oFF.XDate.isDateIsoFormat(text))
	{
		return oFF.FeFormulaConstantExtended.createDate(oFF.XDate.createDateFromIsoFormat(text));
	}
	else
	{
		return arg;
	}
};
oFF.FeDateDiff.prototype.transformGranularityStringArg = function(arg)
{
	let text = arg.getString();
	if (oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.DAY || oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.MONTH || oFF.FeDateGranularityConstants.lookup(text) === oFF.FeDateGranularityConstants.YEAR)
	{
		return oFF.FeFormulaConstantExtended.create(text, oFF.FeDataType.GRANULARITY);
	}
	else
	{
		return arg;
	}
};
oFF.FeDateDiff.prototype.validateArguments = function(args)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (this.hasArgConstantValue(args, 0) && this.hasArgConstantValue(args, 1))
	{
		this.validateDateFormatForTwoArgs(args, messageManager);
	}
	else if (this.hasArgConstantValue(args, 0))
	{
		this.validateDateFormatForSingleArg(args, messageManager, 0);
	}
	else if (this.hasArgConstantValue(args, 1))
	{
		this.validateDateFormatForSingleArg(args, messageManager, 1);
	}
	if (this.hasArgConstantValue(args, 2))
	{
		this.validateGranularity(args, messageManager);
	}
	if (!messageManager.getMessages().isEmpty())
	{
		return oFF.XOptional.of(messageManager);
	}
	else
	{
		return oFF.XOptional.empty();
	}
};
oFF.FeDateDiff.prototype.validateDateFormatForSingleArg = function(args, messageManager, index)
{
	let locArgs = oFF.XList.create();
	locArgs.add(oFF.FeDateDiff.NAME);
	locArgs.add(oFF.XInteger.convertToString(index + 1));
	locArgs.add(oFF.FeDataType.STRING.getName());
	locArgs.add(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_DATE_FORMAT));
	locArgs.add(oFF.FeDataType.DATE_DIMENSION.getName());
	locArgs.add(oFF.FeDataType.STRING.getName());
	locArgs.add(args.get(index).getConstantValue().get());
	messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.ARGUMENTS_INVALID_DATE_FORMAT, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.DATEDIFF_ERROR_DATE_PARAMETER, locArgs), null);
};
oFF.FeDateDiff.prototype.validateDateFormatForTwoArgs = function(args, messageManager)
{
	let locArgsFor2Params = oFF.XList.create();
	locArgsFor2Params.add(oFF.FeDateDiff.NAME);
	locArgsFor2Params.add("1");
	locArgsFor2Params.add("2");
	locArgsFor2Params.add(oFF.FeDataType.STRING.getName());
	locArgsFor2Params.add(this.getLocalization().getText(oFF.FeI18n.DATEDIFF_DATE_FORMAT));
	locArgsFor2Params.add(oFF.FeDataType.DATE_DIMENSION.getName());
	locArgsFor2Params.add(oFF.FeDataType.STRING.getName());
	locArgsFor2Params.add(oFF.FeDataType.STRING.getName());
	locArgsFor2Params.add(args.get(0).getConstantValue().get());
	locArgsFor2Params.add(args.get(1).getConstantValue().get());
	messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.ARGUMENTS_INVALID_DATE_FORMAT, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.DATEDIFF_ERROR_DATES_PARAMETER, locArgsFor2Params), null);
};
oFF.FeDateDiff.prototype.validateGranularity = function(args, messageManager)
{
	let locArgs = oFF.XList.create();
	locArgs.add(oFF.FeDateDiff.NAME);
	locArgs.add("3");
	locArgs.add(oFF.FeDataType.STRING.getName());
	locArgs.add(this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.DATEDIFF_GRANULARITY, this.getGranularityList()));
	locArgs.add(oFF.FeDataType.STRING.getName());
	locArgs.add(args.get(2).getConstantValue().get());
	messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.ARGUMENTS_INVALID_GRANULARITY_FORMAT, this.getLocalization().getTextWithPlaceholders(oFF.FeI18n.DATEDIFF_ERROR_GRANULARITY_PARAMETER, locArgs), null);
};

oFF.FeAddition = function() {};
oFF.FeAddition.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeAddition.prototype._ff_c = "FeAddition";

oFF.FeAddition.NAME = "+";
oFF.FeAddition.SYNTAX = "+";
oFF.FeAddition.create = function()
{
	let feAddition = new oFF.FeAddition();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.STRING);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		argBuilder.add(oFF.FeDataType.DIMENSION);
	}
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feAddition.m_arguments = args;
	return feAddition;
};
oFF.FeAddition.prototype.getName = function()
{
	return oFF.FeAddition.NAME;
};
oFF.FeAddition.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeAddition.prototype.getReturnType = function(args)
{
	if (oFF.isNull(args) || args.size() !== 2)
	{
		return oFF.FeDataType.UNKNOWN;
	}
	let supportedDataTypes = this.getSupportedReturnTypes();
	let firstArgumentDataType = args.get(0).getReturnType();
	let supportedDataType = oFF.XStream.of(supportedDataTypes).find((dataType) => {
		return oFF.FeDataType.isCompatible(dataType, firstArgumentDataType);
	});
	if (supportedDataType.isPresent())
	{
		return supportedDataType.get();
	}
	return oFF.FeDataType.UNKNOWN;
};
oFF.FeAddition.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.STRING).build();
};
oFF.FeAddition.prototype.getSyntax = function()
{
	return oFF.FeAddition.SYNTAX;
};
oFF.FeAddition.prototype.getType = function()
{
	return oFF.FormulaOperator.ADDITION;
};
oFF.FeAddition.prototype.simplify = function(args, feConfiguration)
{
	let numberSimplify = oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) + oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
	if (numberSimplify.isPresent())
	{
		return numberSimplify;
	}
	return oFF.FeStringToStringSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XStringValue.create(oFF.XStringUtils.concatenate2(args.get(0).getConstantValue().get(), args.get(1).getConstantValue().get()));
	});
};

oFF.FeDivision = function() {};
oFF.FeDivision.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeDivision.prototype._ff_c = "FeDivision";

oFF.FeDivision.NAME = "/";
oFF.FeDivision.SYNTAX = "/";
oFF.FeDivision.create = function()
{
	let feDivision = new oFF.FeDivision();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE);
	args.add(argBuilder.build());
	args.add(argBuilder.build());
	feDivision.m_arguments = args;
	return feDivision;
};
oFF.FeDivision.prototype.getName = function()
{
	return oFF.FeDivision.NAME;
};
oFF.FeDivision.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeDivision.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeDivision.prototype.getSyntax = function()
{
	return oFF.FeDivision.SYNTAX;
};
oFF.FeDivision.prototype.getType = function()
{
	return oFF.FormulaOperator.DIVISION;
};
oFF.FeDivision.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) / oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};
oFF.FeDivision.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (args.size() === 2 && args.get(1).getReturnType().isTypeOf(oFF.FeDataType.NUMBER) && oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(1)))
	{
		try
		{
			if (oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()) === 0)
			{
				messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.DIVISION_CANNOT_DIVIDE_BY_ZERO, this.getLocalization().getText(oFF.FeI18n.DIVISION_BY_ZERO), null);
			}
		}
		catch (t)
		{
			this.logError2("Division by non-number formulaItem where FI return type is NUMBER", "This is not a throwable error as validation is only looking for a number 0");
		}
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FeMultiplication = function() {};
oFF.FeMultiplication.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeMultiplication.prototype._ff_c = "FeMultiplication";

oFF.FeMultiplication.NAME = "*";
oFF.FeMultiplication.SYNTAX = "*";
oFF.FeMultiplication.create = function()
{
	let feMultiplication = new oFF.FeMultiplication();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE);
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feMultiplication.m_arguments = args;
	return feMultiplication;
};
oFF.FeMultiplication.prototype.getName = function()
{
	return oFF.FeMultiplication.NAME;
};
oFF.FeMultiplication.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeMultiplication.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeMultiplication.prototype.getSyntax = function()
{
	return oFF.FeMultiplication.SYNTAX;
};
oFF.FeMultiplication.prototype.getType = function()
{
	return oFF.FormulaOperator.MULTIPLICATION;
};
oFF.FeMultiplication.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) * oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};

oFF.FeParenthesis = function() {};
oFF.FeParenthesis.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeParenthesis.prototype._ff_c = "FeParenthesis";

oFF.FeParenthesis.NAME = "PARENTH_GROUP";
oFF.FeParenthesis.SYNTAX = "()";
oFF.FeParenthesis.create = function()
{
	let feParenthesis = new oFF.FeParenthesis();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.ANY);
	args.add(argBuilder.build());
	feParenthesis.m_arguments = args;
	return feParenthesis;
};
oFF.FeParenthesis.prototype.getName = function()
{
	return oFF.FeParenthesis.NAME;
};
oFF.FeParenthesis.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeParenthesis.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.ANY).build();
};
oFF.FeParenthesis.prototype.getSyntax = function()
{
	return oFF.FeParenthesis.SYNTAX;
};
oFF.FeParenthesis.prototype.getType = function()
{
	return null;
};
oFF.FeParenthesis.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	return oFF.XOptional.of(args.get(0));
};

oFF.FeSubtraction = function() {};
oFF.FeSubtraction.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeSubtraction.prototype._ff_c = "FeSubtraction";

oFF.FeSubtraction.NAME = "-";
oFF.FeSubtraction.SYNTAX = "-";
oFF.FeSubtraction.create = function()
{
	let feSubtraction = new oFF.FeSubtraction();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE);
	args.add(argBuilder.build());
	args.add(argBuilder.setArgumentIndexWithSameType(0).build());
	feSubtraction.m_arguments = args;
	return feSubtraction;
};
oFF.FeSubtraction.prototype.getName = function()
{
	return oFF.FeSubtraction.NAME;
};
oFF.FeSubtraction.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FeSubtraction.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeSubtraction.prototype.getSyntax = function()
{
	return oFF.FeSubtraction.SYNTAX;
};
oFF.FeSubtraction.prototype.getType = function()
{
	return oFF.FormulaOperator.SUBTRACTION;
};
oFF.FeSubtraction.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()) - oFF.XDouble.convertFromString(args.get(1).getConstantValue().get()));
	});
};

oFF.FeUnaryMinus = function() {};
oFF.FeUnaryMinus.prototype = new oFF.FeFormulaItemMetadata();
oFF.FeUnaryMinus.prototype._ff_c = "FeUnaryMinus";

oFF.FeUnaryMinus.MINUS_ONE = "-1";
oFF.FeUnaryMinus.NAME = "UNARY_MINUS";
oFF.FeUnaryMinus.SYNTAX = "-";
oFF.FeUnaryMinus.create = function()
{
	let feUnaryMinus = new oFF.FeUnaryMinus();
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE);
	args.add(argBuilder.build());
	feUnaryMinus.m_arguments = args;
	return feUnaryMinus;
};
oFF.FeUnaryMinus.prototype.argumentIsConstantValue = function(value)
{
	return value.getConstantValue().isPresent();
};
oFF.FeUnaryMinus.prototype.createMultiplicationFunction = function(value, feConfiguration)
{
	let argsForDecFloat = oFF.XList.create();
	argsForDecFloat.add(oFF.FeFormulaConstantExtended.createInteger(oFF.FeUnaryMinus.MINUS_ONE));
	let minusOne = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), argsForDecFloat, feConfiguration);
	let argsForMultiplication = oFF.XList.create();
	argsForMultiplication.add(minusOne);
	argsForMultiplication.add(value);
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.MULTIPLICATION.getName(), argsForMultiplication, feConfiguration);
};
oFF.FeUnaryMinus.prototype.getName = function()
{
	return oFF.FeUnaryMinus.NAME;
};
oFF.FeUnaryMinus.prototype.getRequiredArgumentsCount = function()
{
	return 1;
};
oFF.FeUnaryMinus.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FeUnaryMinus.prototype.getSyntax = function()
{
	return oFF.FeUnaryMinus.SYNTAX;
};
oFF.FeUnaryMinus.prototype.getType = function()
{
	return oFF.FormulaOperator.SUBTRACTION;
};
oFF.FeUnaryMinus.prototype.isDouble = function(value)
{
	let isDouble = false;
	try
	{
		oFF.XDouble.convertFromString(value);
		isDouble = true;
	}
	catch (e)
	{
		isDouble = false;
	}
	return isDouble;
};
oFF.FeUnaryMinus.prototype.multiplyConstantValueByMinusOne = function(value, feConfiguration)
{
	let negativeValue = oFF.XDouble.convertFromString(value) * -1;
	let argsForDecFloat = oFF.XList.create();
	argsForDecFloat.add(oFF.FeFormulaConstantExtended.createNumber(oFF.XDouble.convertToString(negativeValue)));
	return oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), argsForDecFloat, feConfiguration);
};
oFF.FeUnaryMinus.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount())
	{
		return oFF.XOptional.empty();
	}
	let result = oFF.XOptional.empty();
	let value = args.get(0);
	if (this.argumentIsConstantValue(value) && this.isDouble(value.getConstantValue().get()))
	{
		let constantNumbericValue = value.getConstantValue().get();
		result = oFF.XOptional.of(this.multiplyConstantValueByMinusOne(constantNumbericValue, feConfiguration));
	}
	else
	{
		result = oFF.XOptional.of(this.createMultiplicationFunction(value, feConfiguration));
	}
	return result;
};

oFF.FePowerAbstract = function() {};
oFF.FePowerAbstract.prototype = new oFF.FeFormulaItemMetadata();
oFF.FePowerAbstract.prototype._ff_c = "FePowerAbstract";

oFF.FePowerAbstract.prototype.getRequiredArgumentsCount = function()
{
	return 2;
};
oFF.FePowerAbstract.prototype.getSupportedReturnTypes = function()
{
	return oFF.FeDataTypeListBuilder.create().add(oFF.FeDataType.NUMBER).build();
};
oFF.FePowerAbstract.prototype.isAbsLessThanOne = function(arg)
{
	if (!oFF.FeFormulaItemConstantHelper.isValidNumberConstant(arg))
	{
		return false;
	}
	let constantValue = oFF.XDouble.convertFromString(arg.getConstantValue().get());
	return constantValue > -1 && constantValue < 1 && constantValue !== 0;
};
oFF.FePowerAbstract.prototype.isNegativeNumber = function(arg)
{
	return oFF.FeFormulaItemConstantHelper.isValidNumberConstant(arg) && oFF.XDouble.convertFromString(arg.getConstantValue().get()) < 0;
};
oFF.FePowerAbstract.prototype.isZero = function(arg)
{
	return oFF.FeFormulaItemConstantHelper.isValidNumberConstant(arg) && oFF.XDouble.convertFromString(arg.getConstantValue().get()) === 0;
};
oFF.FePowerAbstract.prototype.setupArguments = function()
{
	let args = oFF.XList.create();
	let argBuilder = oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.MEASURE);
	args.add(argBuilder.build());
	args.add(argBuilder.build());
	this.m_arguments = args;
};
oFF.FePowerAbstract.prototype.simplify = function(args, feConfiguration)
{
	return oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		return oFF.XDoubleValue.create(oFF.XMath.pow(oFF.XDouble.convertFromString(args.get(0).getConstantValue().get()), oFF.XDouble.convertFromString(args.get(1).getConstantValue().get())));
	});
};
oFF.FePowerAbstract.prototype.validateArguments = function(args)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	if (this.isZero(args.get(0)) && this.isNegativeNumber(args.get(1)))
	{
		messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.POWER_ZERO_TO_NEGATIVE_NUMBER, this.getLocalization().getText(oFF.FeI18n.POWER_ERROR_ZERO_TO_NEGATIVE_NUMBER), null);
	}
	if (this.isNegativeNumber(args.get(0)) && this.isAbsLessThanOne(args.get(1)))
	{
		messageManager.addErrorExt(this.getName(), oFF.FeErrorCodes.POWER_NEGATIVE_NUMBER_TO_LESS_THAN_ONE, this.getLocalization().getText(oFF.FeI18n.POWER_ERROR_NEGATIVE_NUMBER_TO_LESS_ONE_VALUE), null);
	}
	return oFF.XOptional.of(messageManager);
};

oFF.FeDatasourceType = function() {};
oFF.FeDatasourceType.prototype = new oFF.XConstant();
oFF.FeDatasourceType.prototype._ff_c = "FeDatasourceType";

oFF.FeDatasourceType.BW = null;
oFF.FeDatasourceType.HANA = null;
oFF.FeDatasourceType.staticSetup = function()
{
	oFF.FeDatasourceType.HANA = oFF.XConstant.setupName(new oFF.FeDatasourceType(), "HANA");
	oFF.FeDatasourceType.BW = oFF.XConstant.setupName(new oFF.FeDatasourceType(), "BW");
};

oFF.FeFormulaMeasure = function() {};
oFF.FeFormulaMeasure.prototype = new oFF.FeAbstractMeasure();
oFF.FeFormulaMeasure.prototype._ff_c = "FeFormulaMeasure";

oFF.FeFormulaMeasure.MEASURE_WITH_NO_DATASOURCE_PREFIX = "#";
oFF.FeFormulaMeasure.cast = function(component)
{
	if (oFF.notNull(component) && component.getType().isEqualTo(oFF.FeModelComponentType.FORMULA_MEASURE))
	{
		return oFF.XOptional.of(component);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaMeasure.create = function(identifier, description, formulaText, valueType, resultVisibility, structureDimensionName, datasourceName)
{
	return oFF.FeFormulaMeasure.createWithAlias(identifier, description, null, formulaText, valueType, resultVisibility, structureDimensionName, datasourceName);
};
oFF.FeFormulaMeasure.createWithAlias = function(identifier, description, alias, formulaText, valueType, resultVisibility, structureDimensionName, datasourceName)
{
	let formulaMeasure = new oFF.FeFormulaMeasure();
	formulaMeasure.setupMeasure(identifier, description, alias, valueType, resultVisibility, null, structureDimensionName, datasourceName);
	formulaMeasure.m_formulaText = formulaText;
	return formulaMeasure;
};
oFF.FeFormulaMeasure.prototype.m_formulaText = null;
oFF.FeFormulaMeasure.prototype.getField = function(withDatasource)
{
	if (withDatasource && oFF.XStringUtils.isNullOrEmpty(this.m_datasourceName))
	{
		let stringBuilder = oFF.XStringBuffer.create();
		stringBuilder.append(this.m_fieldStart);
		stringBuilder.append(oFF.FeFormulaMeasure.MEASURE_WITH_NO_DATASOURCE_PREFIX);
		stringBuilder.append(this.getAlias());
		stringBuilder.append(this.m_fieldEnd);
		return stringBuilder.toString();
	}
	else
	{
		return oFF.FeAbstractMeasure.prototype.getField.call( this , withDatasource);
	}
};
oFF.FeFormulaMeasure.prototype.getFormulaText = function()
{
	return oFF.XOptional.ofNullable(this.m_formulaText);
};
oFF.FeFormulaMeasure.prototype.getType = function()
{
	return oFF.FeModelComponentType.FORMULA_MEASURE;
};
oFF.FeFormulaMeasure.prototype.releaseObject = function()
{
	this.m_formulaText = null;
	oFF.FeAbstractMeasure.prototype.releaseObject.call( this );
};

oFF.FeMeasure = function() {};
oFF.FeMeasure.prototype = new oFF.FeAbstractMeasure();
oFF.FeMeasure.prototype._ff_c = "FeMeasure";

oFF.FeMeasure.cast = function(component)
{
	if (oFF.notNull(component) && component.getType().isEqualTo(oFF.FeModelComponentType.MEASURE))
	{
		return oFF.XOptional.of(component);
	}
	return oFF.XOptional.empty();
};
oFF.FeMeasure.create = function(identifier, description, valueType, feResultVisibility, structureDimensionName, datasourceName)
{
	return oFF.FeMeasure.createWithAlias(identifier, description, null, valueType, feResultVisibility, structureDimensionName, datasourceName);
};
oFF.FeMeasure.createWithAlias = function(identifier, description, alias, valueType, feResultVisibility, structureDimensionName, datasourceName)
{
	return oFF.FeMeasure.createWithAliasAndParent(identifier, description, alias, valueType, feResultVisibility, null, structureDimensionName, datasourceName);
};
oFF.FeMeasure.createWithAliasAndParent = function(identifier, description, alias, valueType, feResultVisibility, parentId, structureDimensionName, datasourceName)
{
	let instance = new oFF.FeMeasure();
	instance.setupMeasure(identifier, description, alias, valueType, feResultVisibility, parentId, structureDimensionName, datasourceName);
	return instance;
};
oFF.FeMeasure.createWithParent = function(identifier, description, valueType, feResultVisibility, parentId, structureDimensionName, datasourceName)
{
	return oFF.FeMeasure.createWithAliasAndParent(identifier, description, null, valueType, feResultVisibility, parentId, structureDimensionName, datasourceName);
};
oFF.FeMeasure.prototype.getType = function()
{
	return oFF.FeModelComponentType.MEASURE;
};

oFF.FeResultVisibility = function() {};
oFF.FeResultVisibility.prototype = new oFF.XConstant();
oFF.FeResultVisibility.prototype._ff_c = "FeResultVisibility";

oFF.FeResultVisibility.HIDDEN = null;
oFF.FeResultVisibility.VISIBLE = null;
oFF.FeResultVisibility.create = function(name)
{
	let instance = new oFF.FeResultVisibility();
	instance.m_name = name;
	return instance;
};
oFF.FeResultVisibility.createFrom = function(resultVisibility)
{
	if (oFF.isNull(resultVisibility) || !resultVisibility.isEqualTo(oFF.ResultVisibility.HIDDEN))
	{
		return oFF.FeResultVisibility.VISIBLE;
	}
	return oFF.FeResultVisibility.HIDDEN;
};
oFF.FeResultVisibility.staticSetup = function()
{
	oFF.FeResultVisibility.HIDDEN = oFF.FeResultVisibility.create("Hidden");
	oFF.FeResultVisibility.VISIBLE = oFF.FeResultVisibility.create("Visible");
};
oFF.FeResultVisibility.prototype.isHidden = function()
{
	return this === oFF.FeResultVisibility.HIDDEN;
};

oFF.FeStructureType = function() {};
oFF.FeStructureType.prototype = new oFF.XConstant();
oFF.FeStructureType.prototype._ff_c = "FeStructureType";

oFF.FeStructureType.ACCOUNT = null;
oFF.FeStructureType.DIMENSION = null;
oFF.FeStructureType.MEASURE = null;
oFF.FeStructureType.STRUCTURE = null;
oFF.FeStructureType.staticSetup = function()
{
	oFF.FeStructureType.MEASURE = oFF.XConstant.setupName(new oFF.FeStructureType(), "Measure");
	oFF.FeStructureType.ACCOUNT = oFF.XConstant.setupName(new oFF.FeStructureType(), "Account");
	oFF.FeStructureType.STRUCTURE = oFF.XConstant.setupName(new oFF.FeStructureType(), "Structure");
	oFF.FeStructureType.DIMENSION = oFF.XConstant.setupName(new oFF.FeStructureType(), "Dimension");
};

oFF.FeTokenType = function() {};
oFF.FeTokenType.prototype = new oFF.XConstant();
oFF.FeTokenType.prototype._ff_c = "FeTokenType";

oFF.FeTokenType.ARGUMENT = null;
oFF.FeTokenType.DIMENSION = null;
oFF.FeTokenType.GENERIC = null;
oFF.FeTokenType.MEASURE = null;
oFF.FeTokenType.NUMBER = null;
oFF.FeTokenType.UNKNOWN = null;
oFF.FeTokenType.staticSetup = function()
{
	oFF.FeTokenType.GENERIC = oFF.XConstant.setupName(new oFF.FeTokenType(), "GENERIC");
	oFF.FeTokenType.MEASURE = oFF.XConstant.setupName(new oFF.FeTokenType(), "MEASURE");
	oFF.FeTokenType.DIMENSION = oFF.XConstant.setupName(new oFF.FeTokenType(), "DIMENSION");
	oFF.FeTokenType.ARGUMENT = oFF.XConstant.setupName(new oFF.FeTokenType(), "ARGUMENT");
	oFF.FeTokenType.NUMBER = oFF.XConstant.setupName(new oFF.FeTokenType(), "NUMBER");
	oFF.FeTokenType.UNKNOWN = oFF.XConstant.setupName(new oFF.FeTokenType(), "UNKNOWN");
};

oFF.FeDecfloatBW = function() {};
oFF.FeDecfloatBW.prototype = new oFF.FeDecfloatAbstract();
oFF.FeDecfloatBW.prototype._ff_c = "FeDecfloatBW";

oFF.FeDecfloatBW.create = function()
{
	let feDecfloatBW = new oFF.FeDecfloatBW();
	feDecfloatBW.setupInternal();
	return feDecfloatBW;
};
oFF.FeDecfloatBW.prototype.isInternalOnly = function()
{
	return true;
};
oFF.FeDecfloatBW.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW);
};
oFF.FeDecfloatBW.prototype.transform = function(args, feConfiguration)
{
	if (args.size() < 1)
	{
		return oFF.XOptional.of(oFF.FeFormulaConstantExtended.createNull());
	}
	return oFF.XOptional.of(args.get(0));
};

oFF.FeDecfloatHana = function() {};
oFF.FeDecfloatHana.prototype = new oFF.FeDecfloatAbstract();
oFF.FeDecfloatHana.prototype._ff_c = "FeDecfloatHana";

oFF.FeDecfloatHana.create = function()
{
	let feDecfloatHana = new oFF.FeDecfloatHana();
	feDecfloatHana.setupInternal();
	return feDecfloatHana;
};
oFF.FeDecfloatHana.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FeIntBW = function() {};
oFF.FeIntBW.prototype = new oFF.FeIntAbstract();
oFF.FeIntBW.prototype._ff_c = "FeIntBW";

oFF.FeIntBW.create = function()
{
	let feIntBW = new oFF.FeIntBW();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	feIntBW.m_arguments = args;
	return feIntBW;
};
oFF.FeIntBW.prototype.getCustomFormulaItem = function(args, feConfiguration)
{
	let argsForTrunc = oFF.XList.create();
	argsForTrunc.add(args.get(0));
	argsForTrunc.add(oFF.FeFormulaConstantExtended.createInteger("0"));
	let truncatedNumber = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeTruncAbstract.NAME, argsForTrunc, feConfiguration);
	let intArgument = oFF.XList.create();
	intArgument.add(truncatedNumber);
	let result = oFF.FeFormulaFunctionExtended.createFunctionWithoutPreprocessing(oFF.FeIntAbstract.NAME, intArgument, feConfiguration);
	return oFF.XOptional.of(result);
};
oFF.FeIntBW.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW);
};
oFF.FeIntBW.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	return this.getCustomFormulaItem(args, feConfiguration);
};

oFF.FeIntHana = function() {};
oFF.FeIntHana.prototype = new oFF.FeIntAbstract();
oFF.FeIntHana.prototype._ff_c = "FeIntHana";

oFF.FeIntHana.create = function()
{
	let feIntHana = new oFF.FeIntHana();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	feIntHana.m_arguments = args;
	return feIntHana;
};
oFF.FeIntHana.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};

oFF.FePercentOfSubtotalHana = function() {};
oFF.FePercentOfSubtotalHana.prototype = new oFF.FeSubtotalAbstract();
oFF.FePercentOfSubtotalHana.prototype._ff_c = "FePercentOfSubtotalHana";

oFF.FePercentOfSubtotalHana.NAME = "%SUBTOTAL";
oFF.FePercentOfSubtotalHana.SYNTAX = "%SUBTOTAL($1,)";
oFF.FePercentOfSubtotalHana.create = function()
{
	let percentSubTotal = new oFF.FePercentOfSubtotalHana();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION).build());
	for (let i = 0; i < 9; i++)
	{
		args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION).setOptional().build());
	}
	percentSubTotal.m_arguments = args;
	return percentSubTotal;
};
oFF.FePercentOfSubtotalHana.prototype.getArgumentsCount = function()
{
	return this.getRequiredArgumentsCount() + this.getOptionalArgumentsCount();
};
oFF.FePercentOfSubtotalHana.prototype.getCustomFormulaItem = function(args, feConfiguration)
{
	let subTotal = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeSubtotalHana.NAME, args, feConfiguration);
	let argsForDivision = oFF.XList.create();
	argsForDivision.add(args.get(0));
	argsForDivision.add(subTotal);
	let divFunction = oFF.FeFormulaFunctionExtended.cast(oFF.FeFormulaFunctionExtended.createFunctionWithNameAndNumericShift(oFF.FormulaOperator.DIVISION.getName(), argsForDivision, feConfiguration, oFF.XIntegerValue.create(2))).get();
	let percentOfSubTotalFormulaItem = oFF.XOptional.of(divFunction);
	return percentOfSubTotalFormulaItem;
};
oFF.FePercentOfSubtotalHana.prototype.getDocumentation = function()
{
	let docbuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let tableOpen = i18n.getText(oFF.FeI18n.COMMON_TABLE_OPEN);
	let exampleCode = i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_CODE);
	docbuilder.addSyntaxLine(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_SYNTAX));
	docbuilder.addSummaryLine(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_SUMMARY));
	docbuilder.addExampleLine(exampleCode);
	docbuilder.addExampleLine(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_RESULT));
	let tableDoc = oFF.XStringBuffer.create();
	tableDoc.append(tableOpen);
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_HEADER));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_1));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_2));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_3));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_4));
	tableDoc.append(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_ROW_5));
	docbuilder.addExampleLine(tableDoc.toString());
	docbuilder.addExampleLine(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_1));
	docbuilder.addExampleLine(i18n.getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_EXAMPLE_TABLE_REMARK_LINE_2));
	docbuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_1));
	docbuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_2));
	docbuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.PERCENTAGE_SUBTOTAL_REMARK_LINE_3));
	return docbuilder.build();
};
oFF.FePercentOfSubtotalHana.prototype.getName = function()
{
	return oFF.FePercentOfSubtotalHana.NAME;
};
oFF.FePercentOfSubtotalHana.prototype.getSyntax = function()
{
	return oFF.FePercentOfSubtotalHana.SYNTAX;
};
oFF.FePercentOfSubtotalHana.prototype.getType = function()
{
	return oFF.FeTransientFormulaOperator.PERCENT_SUB_TOTAL;
};
oFF.FePercentOfSubtotalHana.prototype.transform = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() < this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	return this.getCustomFormulaItem(args, feConfiguration);
};
oFF.FePercentOfSubtotalHana.prototype.validateArguments = function(args)
{
	return oFF.FeSubtotalAbstract.prototype.validateArguments.call( this , args);
};

oFF.FePowerFunction = function() {};
oFF.FePowerFunction.prototype = new oFF.FePowerAbstract();
oFF.FePowerFunction.prototype._ff_c = "FePowerFunction";

oFF.FePowerFunction.NAME = "POWER";
oFF.FePowerFunction.SYNTAX = "POWER($1,)";
oFF.FePowerFunction.create = function()
{
	let fePowerFunction = new oFF.FePowerFunction();
	fePowerFunction.setupArguments();
	return fePowerFunction;
};
oFF.FePowerFunction.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	docBuilder.addSummaryLine(this.getLocalization().getText(oFF.FeI18n.POWER_SUMMARY));
	docBuilder.addSyntaxLine(this.getLocalization().getText(oFF.FeI18n.POWER_SYNTAX));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.POWER_EXAMPLE_CODE));
	docBuilder.addExampleLine(this.getLocalization().getText(oFF.FeI18n.POWER_EXAMPLE_RESULT));
	return docBuilder.build();
};
oFF.FePowerFunction.prototype.getName = function()
{
	return oFF.FePowerFunction.NAME;
};
oFF.FePowerFunction.prototype.getSyntax = function()
{
	return oFF.FePowerFunction.SYNTAX;
};
oFF.FePowerFunction.prototype.getType = function()
{
	return oFF.FeTransientFormulaOperator.POWER;
};
oFF.FePowerFunction.prototype.simplify = function(args, feConfiguration)
{
	return oFF.XOptional.of(oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.POWER_OF.getName(), args, feConfiguration));
};

oFF.FeSubtotalHana = function() {};
oFF.FeSubtotalHana.prototype = new oFF.FeSubtotalAbstract();
oFF.FeSubtotalHana.prototype._ff_c = "FeSubtotalHana";

oFF.FeSubtotalHana.NAME = "SUBTOTAL";
oFF.FeSubtotalHana.SYNTAX = "SUBTOTAL($1,)";
oFF.FeSubtotalHana.create = function()
{
	let subTotal = new oFF.FeSubtotalHana();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION).build());
	for (let i = 0; i < 9; i++)
	{
		args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.DIMENSION).setOptional().build());
	}
	subTotal.m_arguments = args;
	return subTotal;
};
oFF.FeSubtotalHana.prototype.getArgumentsCount = function()
{
	return this.getRequiredArgumentsCount() + this.getOptionalArgumentsCount();
};
oFF.FeSubtotalHana.prototype.getDocumentation = function()
{
	let docBuilder = oFF.FeDocBuilder.create();
	let i18n = this.getLocalization();
	let tableOpen = i18n.getText(oFF.FeI18n.COMMON_TABLE_OPEN);
	let salesMeasure = i18n.getText(oFF.FeI18n.COMMON_MEASURE_SALES);
	let exampleCode = i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_CODE);
	docBuilder.addSyntaxLine(i18n.getText((oFF.FeI18n.SUBTOTAL_SYNTAX)));
	docBuilder.addSummaryLine(i18n.getText(oFF.FeI18n.SUBTOTAL_SUMMARY));
	docBuilder.addExampleLine(exampleCode);
	docBuilder.addExampleLine(i18n.getTextWithPlaceholder(oFF.FeI18n.SUBTOTAL_EXAMPLE_RESULT, salesMeasure));
	let tableDoc = oFF.XStringBuffer.create();
	tableDoc.append(tableOpen);
	tableDoc.append(i18n.getTextWithPlaceholder2(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_HEADER, salesMeasure, exampleCode));
	tableDoc.append(i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_1));
	tableDoc.append(i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_2));
	tableDoc.append(i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_3));
	tableDoc.append(i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_4));
	tableDoc.append(i18n.getText(oFF.FeI18n.SUBTOTAL_EXAMPLE_TABLE_ROW_5));
	docBuilder.addExampleLine(tableDoc.toString());
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.SUBTOTAL_REMARK_LINE_1));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.SUBTOTAL_REMARK_LINE_2));
	docBuilder.addRemarkLine(this.getLocalization().getText(oFF.FeI18n.SUBTOTAL_REMARK_LINE_3));
	return docBuilder.build();
};
oFF.FeSubtotalHana.prototype.getName = function()
{
	return oFF.FeSubtotalHana.NAME;
};
oFF.FeSubtotalHana.prototype.getSyntax = function()
{
	return oFF.FeSubtotalHana.SYNTAX;
};
oFF.FeSubtotalHana.prototype.transform = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() < this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration) || args.get(1).getReturnType().isEqualTo(oFF.FeDataType.LIST_STRING))
	{
		return oFF.XOptional.empty();
	}
	let dimensionsList = oFF.XCollectionUtils.sliceList(args, 1, args.size());
	let dimensionIdList = oFF.XStream.of(dimensionsList).map(oFF.FeFormulaAttributeExtended.cast).filter((formulaDimensionOpt) => {
		return formulaDimensionOpt.isPresent();
	}).mapToString((formulaDimension) => {
		let feDimension = formulaDimension.get().getFeDimension();
		return feDimension.isPresent() ? feDimension.get().getId() : formulaDimension.get().getName();
	}).collect(oFF.XStreamCollector.toListOfString((dimensionId) => {
		return dimensionId.getStringRepresentation();
	}));
	let stringArray = oFF.FeFormulaConstantExtended.createStringArray(dimensionIdList);
	let newArgs = oFF.XList.create();
	newArgs.add(args.get(0));
	newArgs.add(stringArray);
	let internalSubtotal = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeSubtotalInternal.NAME, newArgs, feConfiguration);
	return oFF.XOptional.of(internalSubtotal);
};
oFF.FeSubtotalHana.prototype.validateArguments = function(args)
{
	return oFF.FeSubtotalAbstract.prototype.validateArguments.call( this , args);
};

oFF.FeTruncBW = function() {};
oFF.FeTruncBW.prototype = new oFF.FeTruncAbstract();
oFF.FeTruncBW.prototype._ff_c = "FeTruncBW";

oFF.FeTruncBW.create = function()
{
	let feTruncBW = new oFF.FeTruncBW();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	feTruncBW.m_arguments = args;
	return feTruncBW;
};
oFF.FeTruncBW.prototype.getCustomFormulaItem = function(args, feConfiguration)
{
	let tenToThePowerOfSecondParam;
	if (oFF.FeFormulaItemConstantHelper.isValidNumberConstant(args.get(1)))
	{
		let numberToMultiplyFirstParam = oFF.XMath.pow(10, oFF.XInteger.convertFromString(args.get(1).getConstantValue().get()));
		tenToThePowerOfSecondParam = oFF.FeFormulaConstantExtended.createInteger(oFF.XDouble.convertToString(numberToMultiplyFirstParam));
	}
	else
	{
		let argsForPowerSecondParam = oFF.XList.create();
		argsForPowerSecondParam.add(oFF.FeFormulaConstantExtended.createInteger("10"));
		argsForPowerSecondParam.add(args.get(1));
		tenToThePowerOfSecondParam = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FePowerOperator.NAME, argsForPowerSecondParam, feConfiguration);
	}
	let argsForMultiplication = oFF.XList.create();
	argsForMultiplication.add(args.get(0));
	argsForMultiplication.add(tenToThePowerOfSecondParam);
	let truncOneArgParam = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeMultiplication.create().getName(), argsForMultiplication, feConfiguration);
	let argForTrunc = oFF.XList.create();
	argForTrunc.add(truncOneArgParam);
	let truncWithOnlyOneArgument = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeTruncAbstract.NAME, argForTrunc, feConfiguration);
	let argsForDivision = oFF.XList.create();
	argsForDivision.add(truncWithOnlyOneArgument);
	argsForDivision.add(tenToThePowerOfSecondParam);
	let result = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FeDivision.create().getName(), argsForDivision, feConfiguration);
	return oFF.XOptional.of(result);
};
oFF.FeTruncBW.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.BW);
};
oFF.FeTruncBW.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	let numberSimplify = oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		let firstParam = oFF.XDouble.convertFromString(args.get(0).getConstantValue().get());
		let secondParam = oFF.XInteger.convertFromString(args.get(1).getConstantValue().get());
		let result = oFF.XDoubleValue.create(oFF.XMath.trunc(firstParam * oFF.XMath.pow(10, secondParam)) * oFF.XMath.pow(10, (secondParam * -1)));
		if (result.isEqualTo(oFF.XIntegerValue.create(0)))
		{
			return oFF.XIntegerValue.create(0);
		}
		else
		{
			return result;
		}
	});
	if (numberSimplify.isPresent())
	{
		return numberSimplify;
	}
	else
	{
		return this.getCustomFormulaItem(args, feConfiguration);
	}
};

oFF.FeTruncHana = function() {};
oFF.FeTruncHana.prototype = new oFF.FeTruncAbstract();
oFF.FeTruncHana.prototype._ff_c = "FeTruncHana";

oFF.FeTruncHana.create = function()
{
	let feTruncHana = new oFF.FeTruncHana();
	let args = oFF.XList.create();
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	args.add(oFF.FeArgumentMetadataBuilder.create().add(oFF.FeDataType.MEASURE).add(oFF.FeDataType.NUMBER).add(oFF.FeDataType.INTEGER).build());
	feTruncHana.m_arguments = args;
	return feTruncHana;
};
oFF.FeTruncHana.prototype.isSupported = function(datasourceType)
{
	return datasourceType.isEqualTo(oFF.FeDatasourceType.HANA);
};
oFF.FeTruncHana.prototype.simplify = function(args, feConfiguration)
{
	if (oFF.isNull(args) || args.size() !== this.getRequiredArgumentsCount() || oFF.isNull(feConfiguration))
	{
		return oFF.XOptional.empty();
	}
	let numberSimplify = oFF.FeNumberToNumberSimplifier.create(args, feConfiguration, this).simplify(() => {
		let firstParam = oFF.XDouble.convertFromString(args.get(0).getConstantValue().get());
		let secondParam = oFF.XInteger.convertFromString(args.get(1).getConstantValue().get());
		let result = oFF.XDoubleValue.create(oFF.XMath.trunc(firstParam * oFF.XMath.pow(10, secondParam)) * oFF.XMath.pow(10, (secondParam * -1)));
		if (result.isEqualTo(oFF.XIntegerValue.create(0)))
		{
			return oFF.XIntegerValue.create(0);
		}
		else
		{
			return result;
		}
	});
	if (numberSimplify.isPresent())
	{
		return numberSimplify;
	}
	else
	{
		return oFF.XOptional.empty();
	}
};

oFF.FePowerOperator = function() {};
oFF.FePowerOperator.prototype = new oFF.FePowerAbstract();
oFF.FePowerOperator.prototype._ff_c = "FePowerOperator";

oFF.FePowerOperator.NAME = "**";
oFF.FePowerOperator.SYNTAX = "**";
oFF.FePowerOperator.create = function()
{
	let fePowerOperator = new oFF.FePowerOperator();
	fePowerOperator.setupArguments();
	return fePowerOperator;
};
oFF.FePowerOperator.prototype.getName = function()
{
	return oFF.FePowerOperator.NAME;
};
oFF.FePowerOperator.prototype.getSyntax = function()
{
	return oFF.FePowerOperator.SYNTAX;
};
oFF.FePowerOperator.prototype.getType = function()
{
	return oFF.FormulaOperator.POWER_OF;
};

oFF.FeDateGranularityConstants = function() {};
oFF.FeDateGranularityConstants.prototype = new oFF.XConstant();
oFF.FeDateGranularityConstants.prototype._ff_c = "FeDateGranularityConstants";

oFF.FeDateGranularityConstants.DAY = null;
oFF.FeDateGranularityConstants.MONTH = null;
oFF.FeDateGranularityConstants.YEAR = null;
oFF.FeDateGranularityConstants.s_instances = null;
oFF.FeDateGranularityConstants.lookup = function(name)
{
	return oFF.FeDateGranularityConstants.s_instances.getByKey(oFF.XString.trim(oFF.XString.toLowerCase(name)));
};
oFF.FeDateGranularityConstants.staticSetup = function()
{
	oFF.FeDateGranularityConstants.s_instances = oFF.XHashMapByString.create();
	oFF.FeDateGranularityConstants.YEAR = oFF.XConstant.setupName(new oFF.FeDateGranularityConstants(), "Year");
	oFF.FeDateGranularityConstants.MONTH = oFF.XConstant.setupName(new oFF.FeDateGranularityConstants(), "Month");
	oFF.FeDateGranularityConstants.DAY = oFF.XConstant.setupName(new oFF.FeDateGranularityConstants(), "Day");
	oFF.FeDateGranularityConstants.s_instances.put(oFF.XString.toLowerCase(oFF.FeDateGranularityConstants.YEAR.getName()), oFF.FeDateGranularityConstants.YEAR);
	oFF.FeDateGranularityConstants.s_instances.put(oFF.XString.toLowerCase(oFF.FeDateGranularityConstants.MONTH.getName()), oFF.FeDateGranularityConstants.MONTH);
	oFF.FeDateGranularityConstants.s_instances.put(oFF.XString.toLowerCase(oFF.FeDateGranularityConstants.DAY.getName()), oFF.FeDateGranularityConstants.DAY);
};

oFF.FeModelComponentType = function() {};
oFF.FeModelComponentType.prototype = new oFF.XConstantWithParent();
oFF.FeModelComponentType.prototype._ff_c = "FeModelComponentType";

oFF.FeModelComponentType.DIMENSION = null;
oFF.FeModelComponentType.FORMULA_MEASURE = null;
oFF.FeModelComponentType.HIERARCHY = null;
oFF.FeModelComponentType.MEASURE = null;
oFF.FeModelComponentType.PROPERTY = null;
oFF.FeModelComponentType.s_instances = null;
oFF.FeModelComponentType.create = function(name)
{
	return oFF.FeModelComponentType.createWithParent(name, null);
};
oFF.FeModelComponentType.createWithParent = function(name, parent)
{
	let instance = new oFF.FeModelComponentType();
	instance.setupExt(name, parent);
	oFF.FeModelComponentType.s_instances.put(name, instance);
	return instance;
};
oFF.FeModelComponentType.lookup = function(name)
{
	return oFF.FeModelComponentType.s_instances.getByKey(name);
};
oFF.FeModelComponentType.staticSetup = function()
{
	oFF.FeModelComponentType.s_instances = oFF.XLinkedHashMapByString.create();
	oFF.FeModelComponentType.DIMENSION = oFF.FeModelComponentType.create("DIMENSION");
	oFF.FeModelComponentType.MEASURE = oFF.FeModelComponentType.create("MEASURE");
	oFF.FeModelComponentType.FORMULA_MEASURE = oFF.FeModelComponentType.createWithParent("FORMULA_MEASURE", oFF.FeModelComponentType.MEASURE);
	oFF.FeModelComponentType.HIERARCHY = oFF.FeModelComponentType.create("HIERARCHY");
	oFF.FeModelComponentType.PROPERTY = oFF.FeModelComponentType.create("PROPERTY");
};

oFF.FeDataType = function() {};
oFF.FeDataType.prototype = new oFF.XConstantWithParent();
oFF.FeDataType.prototype._ff_c = "FeDataType";

oFF.FeDataType.ANY = null;
oFF.FeDataType.ATTRIBUTE = null;
oFF.FeDataType.BOOLEAN = null;
oFF.FeDataType.DATE = null;
oFF.FeDataType.DATE_DIMENSION = null;
oFF.FeDataType.DIMENSION = null;
oFF.FeDataType.DIMENSION_FILTER = null;
oFF.FeDataType.DIMENSION_MEMBER = null;
oFF.FeDataType.GRANULARITY = null;
oFF.FeDataType.HIERARCHY = null;
oFF.FeDataType.INTEGER = null;
oFF.FeDataType.LIST = null;
oFF.FeDataType.LIST_MIXED = null;
oFF.FeDataType.LIST_NUMBER = null;
oFF.FeDataType.LIST_STRING = null;
oFF.FeDataType.MEASURE = null;
oFF.FeDataType.NULL = null;
oFF.FeDataType.NUMBER = null;
oFF.FeDataType.OPERATOR = null;
oFF.FeDataType.PROPERTY = null;
oFF.FeDataType.STRING = null;
oFF.FeDataType.STRING_NUMBER = null;
oFF.FeDataType.UNKNOWN = null;
oFF.FeDataType.VARIABLE = null;
oFF.FeDataType.s_instances = null;
oFF.FeDataType.create = function(name)
{
	return oFF.FeDataType.createWithParent(name, oFF.FeDataType.ANY);
};
oFF.FeDataType.createExt = function(name, parent)
{
	oFF.XStringUtils.assertNotNullOrEmpty(name);
	let argType = new oFF.FeDataType();
	argType.setupExt(name, parent);
	argType.m_supportsGenericTypeValidation = true;
	oFF.FeDataType.s_instances.put(name, argType);
	return argType;
};
oFF.FeDataType.createRoot = function(name)
{
	return oFF.FeDataType.createExt(name, null);
};
oFF.FeDataType.createWithParent = function(name, parent)
{
	oFF.XObjectExt.assertNotNull(parent);
	return oFF.FeDataType.createExt(name, parent);
};
oFF.FeDataType.createWithSettings = function(dataType, supportsGenericTypeValidation)
{
	if (oFF.isNull(dataType) || !oFF.FeDataType.s_instances.contains(dataType))
	{
		throw oFF.XException.createRuntimeException("Cannot create formula editor data type without base type.");
	}
	let type = new oFF.FeDataType();
	type.setupExt(dataType.getName(), dataType.getParent());
	type.m_supportsGenericTypeValidation = supportsGenericTypeValidation;
	return type;
};
oFF.FeDataType.isCompatible = function(type1, type2)
{
	return oFF.FeDataType.isCompatibleInternal(type1, type2, false);
};
oFF.FeDataType.isCompatibleInternal = function(type1, type2, strict)
{
	let typeGroups = oFF.XList.create();
	let stringCompatibleTypes = oFF.XList.create();
	stringCompatibleTypes.add(oFF.FeDataType.STRING);
	stringCompatibleTypes.add(oFF.FeDataType.ATTRIBUTE);
	stringCompatibleTypes.add(oFF.FeDataType.DIMENSION);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		stringCompatibleTypes.add(oFF.FeDataType.DIMENSION_MEMBER);
		stringCompatibleTypes.add(oFF.FeDataType.LIST_STRING);
	}
	typeGroups.add(stringCompatibleTypes);
	let numberCompatibleTypes = oFF.XList.create();
	numberCompatibleTypes.add(oFF.FeDataType.NUMBER);
	numberCompatibleTypes.add(oFF.FeDataType.INTEGER);
	numberCompatibleTypes.add(oFF.FeDataType.MEASURE);
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.DIMENSION_SUPPORT))
	{
		numberCompatibleTypes.add(oFF.FeDataType.LIST_NUMBER);
	}
	typeGroups.add(numberCompatibleTypes);
	let dateCompatibleTypes = oFF.XList.create();
	dateCompatibleTypes.add(oFF.FeDataType.DATE);
	dateCompatibleTypes.add(oFF.FeDataType.DATE_DIMENSION);
	typeGroups.add(dateCompatibleTypes);
	let filterPredicate = strict ? (group) => {
		return type1.isEqualAny(group) && type2.isEqualAny(group);
	} : (group) => {
		return type1.isTypeOfAny(group) && type2.isTypeOfAny(group);
	};
	if (oFF.FeFeatureToggle.isActive(oFF.FeFeatureToggle.RESULTLOOKUP))
	{
		let dimensionFilterCompatibleTypes = oFF.XList.create();
		dimensionFilterCompatibleTypes.add(oFF.FeDataType.DIMENSION_FILTER);
		dimensionFilterCompatibleTypes.add(oFF.FeDataType.DIMENSION);
		typeGroups.add(dimensionFilterCompatibleTypes);
	}
	return oFF.XCollectionUtils.filter(typeGroups, filterPredicate).hasElements();
};
oFF.FeDataType.isStrictlyCompatible = function(type1, type2)
{
	return oFF.FeDataType.isCompatibleInternal(type1, type2, true);
};
oFF.FeDataType.staticSetup = function()
{
	oFF.FeDataType.s_instances = oFF.XHashMapByString.create();
	oFF.FeDataType.ANY = oFF.FeDataType.createRoot("Any");
	oFF.FeDataType.UNKNOWN = oFF.FeDataType.createRoot("Unknown");
	oFF.FeDataType.BOOLEAN = oFF.FeDataType.create("Bool");
	oFF.FeDataType.DIMENSION_FILTER = oFF.FeDataType.createWithParent("Dimension Filter", oFF.FeDataType.BOOLEAN);
	oFF.FeDataType.MEASURE = oFF.FeDataType.create("Measure");
	oFF.FeDataType.NUMBER = oFF.FeDataType.create("Number");
	oFF.FeDataType.INTEGER = oFF.FeDataType.createWithParent("Integer", oFF.FeDataType.NUMBER);
	oFF.FeDataType.STRING = oFF.FeDataType.create("String");
	oFF.FeDataType.DATE = oFF.FeDataType.createWithParent("Date", oFF.FeDataType.STRING);
	oFF.FeDataType.GRANULARITY = oFF.FeDataType.createWithParent("Granularity", oFF.FeDataType.STRING);
	oFF.FeDataType.DIMENSION = oFF.FeDataType.create("Dimension");
	oFF.FeDataType.DATE_DIMENSION = oFF.FeDataType.createWithParent("Date dimension", oFF.FeDataType.DIMENSION);
	oFF.FeDataType.DIMENSION_MEMBER = oFF.FeDataType.create("Dimension Member");
	oFF.FeDataType.HIERARCHY = oFF.FeDataType.create("Hierarchy");
	oFF.FeDataType.PROPERTY = oFF.FeDataType.create("Property");
	oFF.FeDataType.LIST = oFF.FeDataType.create("Array");
	oFF.FeDataType.LIST_STRING = oFF.FeDataType.createWithParent("Dimension String Array", oFF.FeDataType.LIST);
	oFF.FeDataType.LIST_NUMBER = oFF.FeDataType.createWithParent("Measure Number Array", oFF.FeDataType.LIST);
	oFF.FeDataType.LIST_MIXED = oFF.FeDataType.createWithParent("Mixed Array", oFF.FeDataType.LIST);
	oFF.FeDataType.OPERATOR = oFF.FeDataType.create("Operator");
	oFF.FeDataType.ATTRIBUTE = oFF.FeDataType.create("Attribute");
	oFF.FeDataType.VARIABLE = oFF.FeDataType.create("Variable");
	oFF.FeDataType.NULL = oFF.FeDataType.create("Null");
	oFF.FeDataType.STRING_NUMBER = oFF.FeDataType.create("String/Number");
};
oFF.FeDataType.prototype.m_supportsGenericTypeValidation = false;
oFF.FeDataType.prototype.isEqualAny = function(group)
{
	return oFF.XCollectionUtils.filter(group, (groupMember) => {
		return this.isEqualTo(groupMember);
	}).hasElements();
};
oFF.FeDataType.prototype.isTypeOf = function(type)
{
	return this.isEqualTo(type) || oFF.XConstantWithParent.prototype.isTypeOf.call( this , type);
};
oFF.FeDataType.prototype.isTypeOfAny = function(group)
{
	return oFF.XCollectionUtils.filter(group, (groupMember) => {
		return this.isTypeOf(groupMember);
	}).hasElements();
};
oFF.FeDataType.prototype.supportsGenericTypeValidation = function()
{
	return this.m_supportsGenericTypeValidation;
};

oFF.FeFeatureToggle = function() {};
oFF.FeFeatureToggle.prototype = new oFF.XConstantWithParent();
oFF.FeFeatureToggle.prototype._ff_c = "FeFeatureToggle";

oFF.FeFeatureToggle.DATEDIFF = null;
oFF.FeFeatureToggle.DATE_DIMENSIONS = null;
oFF.FeFeatureToggle.DIALOG_NEW_LAYOUT = null;
oFF.FeFeatureToggle.DIMENSION_ARRAY = null;
oFF.FeFeatureToggle.DIMENSION_FILTERS = null;
oFF.FeFeatureToggle.DIMENSION_SUPPORT = null;
oFF.FeFeatureToggle.FORMULA_CONFIG = null;
oFF.FeFeatureToggle.GEN_AI = null;
oFF.FeFeatureToggle.GEN_AI_PHASE1 = null;
oFF.FeFeatureToggle.HIERARCHICAL_DIMENSIONS = null;
oFF.FeFeatureToggle.HIERARCHICAL_OBJECTS = null;
oFF.FeFeatureToggle.ITERATION = null;
oFF.FeFeatureToggle.LIST_FUNCTIONS_BY_CATEGORY = null;
oFF.FeFeatureToggle.LIST_ITEMS_SEARCH = null;
oFF.FeFeatureToggle.MAX = null;
oFF.FeFeatureToggle.MAX_BW = null;
oFF.FeFeatureToggle.MIN = null;
oFF.FeFeatureToggle.MIN_BW = null;
oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1 = null;
oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2 = null;
oFF.FeFeatureToggle.RESTRICT = null;
oFF.FeFeatureToggle.RESTRICT_HINTS = null;
oFF.FeFeatureToggle.RESULTLOOKUP = null;
oFF.FeFeatureToggle.SIMPLIFY = null;
oFF.FeFeatureToggle.SUBTOTAL_FUNCTIONS = null;
oFF.FeFeatureToggle.TOKENIZATION = null;
oFF.FeFeatureToggle.m_featureToggles = null;
oFF.FeFeatureToggle.m_initialConfig = null;
oFF.FeFeatureToggle.create = function(name)
{
	return oFF.FeFeatureToggle.createWithParent(name, null);
};
oFF.FeFeatureToggle.createExperimental = function(name)
{
	return oFF.FeFeatureToggle.createExt(name, null, true);
};
oFF.FeFeatureToggle.createExt = function(name, parent, isExperimental)
{
	let newObj = new oFF.FeFeatureToggle();
	newObj.setupExt(name, parent);
	newObj.m_isActive = false;
	newObj.m_isExperimental = isExperimental;
	oFF.FeFeatureToggle.m_featureToggles.put(name, newObj);
	return newObj;
};
oFF.FeFeatureToggle.createWithParent = function(name, parent)
{
	return oFF.FeFeatureToggle.createExt(name, parent, false);
};
oFF.FeFeatureToggle.disable = function(featureToggle)
{
	if (oFF.notNull(featureToggle))
	{
		featureToggle.m_isActive = false;
	}
};
oFF.FeFeatureToggle.disableAll = function()
{
	oFF.XStream.of(oFF.FeFeatureToggle.m_featureToggles).forEach(oFF.FeFeatureToggle.disable);
};
oFF.FeFeatureToggle.enable = function(featureToggle)
{
	if (oFF.notNull(featureToggle))
	{
		featureToggle.m_isActive = true;
	}
};
oFF.FeFeatureToggle.enableAll = function()
{
	oFF.XStream.of(oFF.FeFeatureToggle.m_featureToggles).forEach((featureToggle) => {
		if (!featureToggle.m_isExperimental)
		{
			oFF.FeFeatureToggle.enable(featureToggle);
		}
	});
};
oFF.FeFeatureToggle.isActive = function(featureToggle)
{
	let isActive = oFF.notNull(featureToggle) && featureToggle.m_isActive;
	if (isActive)
	{
		let parent = featureToggle.getParent();
		isActive = oFF.isNull(parent) || oFF.FeFeatureToggle.isActive(parent);
	}
	return isActive;
};
oFF.FeFeatureToggle.load = function(process)
{
	return oFF.XPromise.create((resolve, reject) => {
		if (process.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_FORMULA_EDITOR_USE_CONFIG_FRAMEWORK, false))
		{
			oFF.CoFormulaEditorConfigurationUtils.loadFeatureConfiguration(process).onThen((configuration) => {
				oFF.FeFeatureToggle.loadFromConfig(configuration);
				resolve(oFF.XBooleanValue.create(true));
			}).onCatch((error) => {
				reject(error);
			});
		}
		else
		{
			resolve(oFF.XBooleanValue.create(true));
		}
	});
};
oFF.FeFeatureToggle.loadFromConfig = function(config)
{
	if (oFF.notNull(config))
	{
		oFF.FeFeatureToggle.m_initialConfig = config;
		let featureTogglesState = config.getStructureByKey(oFF.CoFormulaEditorConfigurationUtils.FEATURE_TOGGLES);
		if (oFF.notNull(featureTogglesState))
		{
			oFF.XStream.of(oFF.FeFeatureToggle.m_featureToggles).forEach((featureToggle) => {
				featureToggle.m_isActive = featureTogglesState.getBooleanByKeyExt(featureToggle.getName(), false);
			});
		}
	}
};
oFF.FeFeatureToggle.lookup = function(name)
{
	return oFF.FeFeatureToggle.m_featureToggles.getByKey(name);
};
oFF.FeFeatureToggle.restore = function(featureToggle)
{
	if (oFF.notNull(featureToggle))
	{
		if (oFF.notNull(oFF.FeFeatureToggle.m_initialConfig))
		{
			let featureTogglesState = oFF.FeFeatureToggle.m_initialConfig.getStructureByKey(oFF.CoFormulaEditorConfigurationUtils.FEATURE_TOGGLES);
			if (oFF.notNull(featureTogglesState))
			{
				featureToggle.m_isActive = featureTogglesState.getBooleanByKeyExt(featureToggle.getName(), false);
			}
		}
		else
		{
			featureToggle.m_isActive = false;
		}
	}
};
oFF.FeFeatureToggle.restoreAll = function()
{
	if (oFF.notNull(oFF.FeFeatureToggle.m_initialConfig))
	{
		oFF.FeFeatureToggle.loadFromConfig(oFF.FeFeatureToggle.m_initialConfig);
	}
	else
	{
		oFF.FeFeatureToggle.disableAll();
	}
};
oFF.FeFeatureToggle.staticSetup = function()
{
	oFF.FeFeatureToggle.m_featureToggles = oFF.XHashMapByString.create();
	oFF.FeFeatureToggle.SIMPLIFY = oFF.FeFeatureToggle.create("SIMPLIFY");
	oFF.FeFeatureToggle.TOKENIZATION = oFF.FeFeatureToggle.create("TOKENIZATION");
	oFF.FeFeatureToggle.DIMENSION_SUPPORT = oFF.FeFeatureToggle.create("DIMENSION_SUPPORT");
	oFF.FeFeatureToggle.DATE_DIMENSIONS = oFF.FeFeatureToggle.createWithParent("DATE_DIMENSIONS", oFF.FeFeatureToggle.DIMENSION_SUPPORT);
	oFF.FeFeatureToggle.DATEDIFF = oFF.FeFeatureToggle.createWithParent("DATEDIFF", oFF.FeFeatureToggle.DATE_DIMENSIONS);
	oFF.FeFeatureToggle.DIMENSION_ARRAY = oFF.FeFeatureToggle.create("DIMENSION_ARRAY");
	oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1 = oFF.FeFeatureToggle.create("NEW_FUNCTIONS_PHASE1");
	oFF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2 = oFF.FeFeatureToggle.create("NEW_FUNCTIONS_PHASE2");
	oFF.FeFeatureToggle.ITERATION = oFF.FeFeatureToggle.create("ITERATION");
	oFF.FeFeatureToggle.SUBTOTAL_FUNCTIONS = oFF.FeFeatureToggle.createWithParent("SUBTOTAL_FUNCTIONS", oFF.FeFeatureToggle.DIMENSION_SUPPORT);
	oFF.FeFeatureToggle.HIERARCHICAL_OBJECTS = oFF.FeFeatureToggle.create("HIERARCHICAL_OBJECTS");
	oFF.FeFeatureToggle.HIERARCHICAL_DIMENSIONS = oFF.FeFeatureToggle.createWithParent("HIERARCHICAL_DIMENSIONS", oFF.FeFeatureToggle.DIMENSION_SUPPORT);
	oFF.FeFeatureToggle.LIST_ITEMS_SEARCH = oFF.FeFeatureToggle.create("LIST_ITEMS_SEARCH");
	oFF.FeFeatureToggle.LIST_FUNCTIONS_BY_CATEGORY = oFF.FeFeatureToggle.create("LIST_FUNCTIONS_BY_CATEGORY");
	oFF.FeFeatureToggle.MIN = oFF.FeFeatureToggle.create("MIN");
	oFF.FeFeatureToggle.MAX = oFF.FeFeatureToggle.create("MAX");
	oFF.FeFeatureToggle.MIN_BW = oFF.FeFeatureToggle.create("MIN_BW");
	oFF.FeFeatureToggle.MAX_BW = oFF.FeFeatureToggle.create("MAX_BW");
	oFF.FeFeatureToggle.DIMENSION_FILTERS = oFF.FeFeatureToggle.createWithParent("DIMENSION_FILTERS", oFF.FeFeatureToggle.DIMENSION_SUPPORT);
	oFF.FeFeatureToggle.RESULTLOOKUP = oFF.FeFeatureToggle.createWithParent("RESULTLOOKUP", oFF.FeFeatureToggle.DIMENSION_FILTERS);
	oFF.FeFeatureToggle.FORMULA_CONFIG = oFF.FeFeatureToggle.create("FORMULA_CONFIG");
	oFF.FeFeatureToggle.DIALOG_NEW_LAYOUT = oFF.FeFeatureToggle.create("DIALOG_NEW_LAYOUT");
	oFF.FeFeatureToggle.RESTRICT_HINTS = oFF.FeFeatureToggle.create("RESTRICT_HINTS");
	oFF.FeFeatureToggle.RESTRICT = oFF.FeFeatureToggle.createWithParent("RESTRICT", oFF.FeFeatureToggle.DIMENSION_FILTERS);
	oFF.FeFeatureToggle.GEN_AI = oFF.FeFeatureToggle.createExperimental("GEN_AI");
	oFF.FeFeatureToggle.GEN_AI_PHASE1 = oFF.FeFeatureToggle.createExt("GEN_AI_PHASE1", oFF.FeFeatureToggle.GEN_AI, true);
};
oFF.FeFeatureToggle.prototype.m_isActive = false;
oFF.FeFeatureToggle.prototype.m_isExperimental = false;

oFF.FeFormulaItemType = function() {};
oFF.FeFormulaItemType.prototype = new oFF.XConstantWithParent();
oFF.FeFormulaItemType.prototype._ff_c = "FeFormulaItemType";

oFF.FeFormulaItemType.ATTRIBUTE = null;
oFF.FeFormulaItemType.CONSTANT = null;
oFF.FeFormulaItemType.FUNCTION = null;
oFF.FeFormulaItemType.FUNCTION_ARRAY = null;
oFF.FeFormulaItemType.LIST_CONSTANT = null;
oFF.FeFormulaItemType.MEMBER = null;
oFF.FeFormulaItemType.RESTRICT = null;
oFF.FeFormulaItemType.s_instances = null;
oFF.FeFormulaItemType.create = function(name)
{
	return oFF.FeFormulaItemType.createExt(name, null);
};
oFF.FeFormulaItemType.createExt = function(name, parent)
{
	oFF.XStringUtils.assertNotNullOrEmpty(name);
	let type = new oFF.FeFormulaItemType();
	type.setupExt(name, parent);
	oFF.FeFormulaItemType.s_instances.put(name, type);
	return type;
};
oFF.FeFormulaItemType.createWithParent = function(name, parent)
{
	oFF.XObjectExt.assertNotNull(parent);
	return oFF.FeFormulaItemType.createExt(name, parent);
};
oFF.FeFormulaItemType.staticSetup = function()
{
	oFF.FeFormulaItemType.s_instances = oFF.XHashMapByString.create();
	oFF.FeFormulaItemType.ATTRIBUTE = oFF.FeFormulaItemType.create("Attribute");
	oFF.FeFormulaItemType.CONSTANT = oFF.FeFormulaItemType.create("Constant");
	oFF.FeFormulaItemType.LIST_CONSTANT = oFF.FeFormulaItemType.create("List");
	oFF.FeFormulaItemType.FUNCTION = oFF.FeFormulaItemType.create("Function");
	oFF.FeFormulaItemType.FUNCTION_ARRAY = oFF.FeFormulaItemType.createWithParent("Array", oFF.FeFormulaItemType.FUNCTION);
	oFF.FeFormulaItemType.MEMBER = oFF.FeFormulaItemType.create("Member");
	oFF.FeFormulaItemType.RESTRICT = oFF.FeFormulaItemType.create("Restrict");
};

oFF.FeDimensionType = function() {};
oFF.FeDimensionType.prototype = new oFF.XConstantWithParent();
oFF.FeDimensionType.prototype._ff_c = "FeDimensionType";

oFF.FeDimensionType.UNKNOWN = null;
oFF.FeDimensionType.VERSION = null;
oFF.FeDimensionType.VERSION_DIMENSION = null;
oFF.FeDimensionType.VERSION_GENERAL = null;
oFF.FeDimensionType.VERSION_IBP = null;
oFF.FeDimensionType.create = function(name)
{
	return oFF.FeDimensionType.createWithParent(name, null);
};
oFF.FeDimensionType.createFromDimension = function(dimension)
{
	if (oFF.isNull(dimension) || dimension.getDimensionType() === null)
	{
		return oFF.FeDimensionType.UNKNOWN;
	}
	let dimensionType = dimension.getDimensionType().getName();
	if (oFF.XString.isEqual(dimensionType, oFF.FeDimensionType.VERSION_DIMENSION.getName()))
	{
		return oFF.FeDimensionType.VERSION_DIMENSION;
	}
	else if (oFF.XString.isEqual(dimensionType, oFF.FeDimensionType.VERSION_GENERAL.getName()))
	{
		return oFF.FeDimensionType.VERSION_GENERAL;
	}
	else if (oFF.XString.isEqual(dimensionType, oFF.FeDimensionType.VERSION_IBP.getName()))
	{
		return oFF.FeDimensionType.VERSION_IBP;
	}
	return oFF.FeDimensionType.UNKNOWN;
};
oFF.FeDimensionType.createWithParent = function(name, parent)
{
	let instance = new oFF.FeDimensionType();
	instance.setupExt(name, parent);
	return instance;
};
oFF.FeDimensionType.staticSetup = function()
{
	oFF.FeDimensionType.VERSION = oFF.FeDimensionType.create("Version");
	oFF.FeDimensionType.VERSION_GENERAL = oFF.FeDimensionType.createWithParent("GeneralVersion", oFF.FeDimensionType.VERSION);
	oFF.FeDimensionType.VERSION_DIMENSION = oFF.FeDimensionType.createWithParent("VersionDimension", oFF.FeDimensionType.VERSION);
	oFF.FeDimensionType.VERSION_IBP = oFF.FeDimensionType.createWithParent("VersionIBP", oFF.FeDimensionType.VERSION);
	oFF.FeDimensionType.UNKNOWN = oFF.FeDimensionType.create("UNKNOWN");
};
oFF.FeDimensionType.prototype.isVersionLike = function()
{
	return this.isTypeOf(oFF.FeDimensionType.VERSION);
};

oFF.FeValueType = function() {};
oFF.FeValueType.prototype = new oFF.XConstantWithParent();
oFF.FeValueType.prototype._ff_c = "FeValueType";

oFF.FeValueType.DATE = null;
oFF.FeValueType.DATE_BASED = null;
oFF.FeValueType.DATE_TIME = null;
oFF.FeValueType.NUMBER = null;
oFF.FeValueType.UNKNOWN = null;
oFF.FeValueType.s_instances = null;
oFF.FeValueType.create = function(name)
{
	return oFF.FeValueType.createWithParent(name, null);
};
oFF.FeValueType.createFromDimension = function(dimension, keyField)
{
	if (oFF.isNull(dimension) || oFF.isNull(keyField) || keyField.getValueType() === null)
	{
		return oFF.FeValueType.UNKNOWN;
	}
	let valueType = keyField.getValueType();
	if (valueType === oFF.XValueType.DATE || oFF.HierarchyLevelType.getHighestDateRangeGranularity(dimension) !== null)
	{
		return oFF.FeValueType.DATE;
	}
	else if (valueType.isDateTime())
	{
		return oFF.FeValueType.DATE_TIME;
	}
	else if (valueType.isDateBased())
	{
		return oFF.FeValueType.DATE_BASED;
	}
	else if (valueType.isNumber())
	{
		return oFF.FeValueType.NUMBER;
	}
	return oFF.FeValueType.UNKNOWN;
};
oFF.FeValueType.createFromStructureMember = function(member, useCellValueType)
{
	if (oFF.notNull(member))
	{
		let type = useCellValueType ? member.getCellValueType() : member.getValueType();
		if (oFF.notNull(type))
		{
			if (type.isDateTime())
			{
				return oFF.FeValueType.DATE_TIME;
			}
			else if (type.isDateBased())
			{
				return oFF.FeValueType.DATE_BASED;
			}
		}
	}
	return oFF.FeValueType.UNKNOWN;
};
oFF.FeValueType.createWithParent = function(name, parent)
{
	let instance = new oFF.FeValueType();
	instance.setupExt(name, parent);
	oFF.FeValueType.s_instances.put(name, instance);
	return instance;
};
oFF.FeValueType.lookup = function(name)
{
	return oFF.FeValueType.s_instances.getByKey(name);
};
oFF.FeValueType.staticSetup = function()
{
	oFF.FeValueType.s_instances = oFF.XLinkedHashMapByString.create();
	oFF.FeValueType.NUMBER = oFF.FeValueType.create("NUMBER");
	oFF.FeValueType.DATE = oFF.FeValueType.create("DATE");
	oFF.FeValueType.DATE_TIME = oFF.FeValueType.createWithParent("DATE_TIME", oFF.FeValueType.DATE);
	oFF.FeValueType.DATE_BASED = oFF.FeValueType.createWithParent("DATE_BASED", oFF.FeValueType.DATE);
	oFF.FeValueType.UNKNOWN = oFF.FeValueType.create("UNKNOWN");
};
oFF.FeValueType.prototype.isDate = function()
{
	return this === oFF.FeValueType.DATE;
};
oFF.FeValueType.prototype.isDateLike = function()
{
	return this.isTypeOf(oFF.FeValueType.DATE);
};
oFF.FeValueType.prototype.isNumber = function()
{
	return this === oFF.FeValueType.NUMBER;
};

oFF.FeFormulaItemCategory = function() {};
oFF.FeFormulaItemCategory.prototype = new oFF.XConstantWithParent();
oFF.FeFormulaItemCategory.prototype._ff_c = "FeFormulaItemCategory";

oFF.FeFormulaItemCategory.BUSINESS = null;
oFF.FeFormulaItemCategory.CONDITIONAL = null;
oFF.FeFormulaItemCategory.CONVERSION = null;
oFF.FeFormulaItemCategory.DATE_AND_TIME = null;
oFF.FeFormulaItemCategory.DYNAMIC_TIME = null;
oFF.FeFormulaItemCategory.FUNCTION = null;
oFF.FeFormulaItemCategory.LOGICAL = null;
oFF.FeFormulaItemCategory.LOOKUP_AND_REFERENCE = null;
oFF.FeFormulaItemCategory.MATHEMATICAL = null;
oFF.FeFormulaItemCategory.MATHEMATICAL_FN = null;
oFF.FeFormulaItemCategory.OPERATOR = null;
oFF.FeFormulaItemCategory.TRANSIENT = null;
oFF.FeFormulaItemCategory.s_instances = null;
oFF.FeFormulaItemCategory.create = function(name, parent)
{
	oFF.XStringUtils.assertNotNullOrEmpty(name);
	let newConstant = new oFF.FeFormulaItemCategory();
	newConstant.setupExt(name, parent);
	oFF.FeFormulaItemCategory.s_instances.put(name, newConstant);
	return newConstant;
};
oFF.FeFormulaItemCategory.staticSetup = function()
{
	oFF.FeFormulaItemCategory.s_instances = oFF.XHashMapByString.create();
	oFF.FeFormulaItemCategory.OPERATOR = oFF.FeFormulaItemCategory.create("OPERATOR", null);
	oFF.FeFormulaItemCategory.FUNCTION = oFF.FeFormulaItemCategory.create("FUNCTION", null);
	oFF.FeFormulaItemCategory.TRANSIENT = oFF.FeFormulaItemCategory.create("TRANSIENT", null);
	oFF.FeFormulaItemCategory.CONDITIONAL = oFF.FeFormulaItemCategory.create("CONDITIONAL", oFF.FeFormulaItemCategory.OPERATOR);
	oFF.FeFormulaItemCategory.MATHEMATICAL = oFF.FeFormulaItemCategory.create("MATHEMATICAL", oFF.FeFormulaItemCategory.OPERATOR);
	oFF.FeFormulaItemCategory.CONVERSION = oFF.FeFormulaItemCategory.create("CONVERSION", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.LOGICAL = oFF.FeFormulaItemCategory.create("LOGICAL", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.DATE_AND_TIME = oFF.FeFormulaItemCategory.create("DATE_AND_TIME", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.MATHEMATICAL_FN = oFF.FeFormulaItemCategory.create("MATHEMATICAL_FN", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.LOOKUP_AND_REFERENCE = oFF.FeFormulaItemCategory.create("LOOKUP_AND_REFERENCE", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.BUSINESS = oFF.FeFormulaItemCategory.create("BUSINESS", oFF.FeFormulaItemCategory.FUNCTION);
	oFF.FeFormulaItemCategory.DYNAMIC_TIME = oFF.FeFormulaItemCategory.create("DYNAMIC_TIME", oFF.FeFormulaItemCategory.FUNCTION);
};

oFF.FeTransientFormulaOperator = function() {};
oFF.FeTransientFormulaOperator.prototype = new oFF.FormulaOperator();
oFF.FeTransientFormulaOperator.prototype._ff_c = "FeTransientFormulaOperator";

oFF.FeTransientFormulaOperator.DATE_DIFFERENCE = null;
oFF.FeTransientFormulaOperator.PARENTHESIS_GROUP = null;
oFF.FeTransientFormulaOperator.PERCENT_SUB_TOTAL = null;
oFF.FeTransientFormulaOperator.POWER = null;
oFF.FeTransientFormulaOperator.RESTRICT = null;
oFF.FeTransientFormulaOperator.createInternal = function(name, description)
{
	let newOperator = oFF.XConstant.setupName(new oFF.FeTransientFormulaOperator(), name);
	newOperator.m_formulaDescription = description;
	return newOperator;
};
oFF.FeTransientFormulaOperator.staticSetupTransFormulaOperator = function()
{
	oFF.FeTransientFormulaOperator.PARENTHESIS_GROUP = oFF.FeTransientFormulaOperator.createInternal(oFF.FeParenthesis.NAME, "Parenthesis Group");
	oFF.FeTransientFormulaOperator.POWER = oFF.FeTransientFormulaOperator.createInternal("POW", "Power Function");
	oFF.FeTransientFormulaOperator.DATE_DIFFERENCE = oFF.FeTransientFormulaOperator.createInternal("DATE_DIFFERENCE", "Date difference");
	oFF.FeTransientFormulaOperator.PERCENT_SUB_TOTAL = oFF.FeTransientFormulaOperator.createInternal("%Subtotal", "Percent Subtotal");
	oFF.FeTransientFormulaOperator.RESTRICT = oFF.FeTransientFormulaOperator.createInternal("RESTRICT", "Restricts dataset");
};
oFF.FeTransientFormulaOperator.prototype.m_formulaDescription = null;
oFF.FeTransientFormulaOperator.prototype.getDescription = function()
{
	return this.m_formulaDescription;
};

oFF.FeFormulaConstantExtended = function() {};
oFF.FeFormulaConstantExtended.prototype = new oFF.QFormulaItemConstant();
oFF.FeFormulaConstantExtended.prototype._ff_c = "FeFormulaConstantExtended";

oFF.FeFormulaConstantExtended.cast = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isEqualTo(oFF.FeFormulaItemType.CONSTANT))
	{
		return oFF.XOptional.of(toCast);
	}
	else
	{
		return oFF.XOptional.empty();
	}
};
oFF.FeFormulaConstantExtended.create = function(value, dataType)
{
	oFF.XObjectExt.assertNotNull(dataType);
	let formula = oFF.FeFormulaConstantExtended.createEmpty();
	formula.setDataType(dataType);
	formula.setString(value);
	return formula;
};
oFF.FeFormulaConstantExtended.createBoolean = function(value)
{
	let formula = oFF.FeFormulaConstantExtended.createEmpty();
	formula.setDataType(oFF.FeDataType.BOOLEAN);
	formula.setBoolean(value);
	return formula;
};
oFF.FeFormulaConstantExtended.createDate = function(value)
{
	let formula = oFF.FeFormulaConstantExtended.createEmpty();
	formula.setDataType(oFF.FeDataType.DATE);
	formula.setDate(value);
	return formula;
};
oFF.FeFormulaConstantExtended.createEmpty = function()
{
	let formula = new oFF.FeFormulaConstantExtended();
	formula.setupFormula(null, null);
	return formula;
};
oFF.FeFormulaConstantExtended.createInteger = function(value)
{
	return oFF.FeFormulaConstantExtended.create(value, oFF.FeDataType.INTEGER);
};
oFF.FeFormulaConstantExtended.createNull = function()
{
	let formula = oFF.FeFormulaConstantExtended.createEmpty();
	formula.setDataType(oFF.FeDataType.NULL);
	formula.setNullByType(oFF.XValueType.STRING);
	return formula;
};
oFF.FeFormulaConstantExtended.createNumber = function(value)
{
	return oFF.FeFormulaConstantExtended.create(value, oFF.FeDataType.NUMBER);
};
oFF.FeFormulaConstantExtended.createString = function(value)
{
	return oFF.FeFormulaConstantExtended.create(value, oFF.FeDataType.STRING);
};
oFF.FeFormulaConstantExtended.createStringArray = function(args)
{
	let formula = oFF.FeFormulaConstantExtended.createEmpty();
	formula.setDataType(oFF.FeDataType.LIST_STRING);
	let stringList = args.createListCopy();
	formula.setStringValues(stringList);
	return formula;
};
oFF.FeFormulaConstantExtended.prototype.m_argumentsType = null;
oFF.FeFormulaConstantExtended.prototype.m_returnType = null;
oFF.FeFormulaConstantExtended.prototype.getArgumentType = function(index)
{
	return oFF.XOptional.ofNullable(this.m_argumentsType.get(index));
};
oFF.FeFormulaConstantExtended.prototype.getConstantValue = function()
{
	return oFF.XOptional.ofNullable(this.getString());
};
oFF.FeFormulaConstantExtended.prototype.getNumericShift = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaConstantExtended.prototype.getReturnType = function()
{
	return this.m_returnType;
};
oFF.FeFormulaConstantExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.CONSTANT;
};
oFF.FeFormulaConstantExtended.prototype.releaseObject = function()
{
	this.m_argumentsType = oFF.XObjectExt.release(this.m_argumentsType);
	this.m_returnType = null;
	oFF.QFormulaItemConstant.prototype.releaseObject.call( this );
};
oFF.FeFormulaConstantExtended.prototype.setDataType = function(dataType)
{
	let argDataType = oFF.XList.create();
	argDataType.add(dataType);
	this.m_argumentsType = argDataType;
	this.m_returnType = dataType;
};

oFF.FeFormulaListConstantExtended = function() {};
oFF.FeFormulaListConstantExtended.prototype = new oFF.QFormulaItemConstant();
oFF.FeFormulaListConstantExtended.prototype._ff_c = "FeFormulaListConstantExtended";

oFF.FeFormulaListConstantExtended.cast = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isEqualTo(oFF.FeFormulaItemType.LIST_CONSTANT))
	{
		return oFF.XOptional.of(toCast);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaListConstantExtended.create = function(expressions)
{
	let formula = oFF.FeFormulaListConstantExtended.createEmpty();
	formula.m_formulaItems = oFF.XList.createWithList(expressions);
	formula.m_arrayType = formula.determineArrayType(expressions);
	return formula;
};
oFF.FeFormulaListConstantExtended.createEmpty = function()
{
	let formula = new oFF.FeFormulaListConstantExtended();
	formula.setupFormula(null, null);
	return formula;
};
oFF.FeFormulaListConstantExtended.prototype.m_arrayType = null;
oFF.FeFormulaListConstantExtended.prototype.m_formulaItems = null;
oFF.FeFormulaListConstantExtended.prototype.determineArrayType = function(expressions)
{
	if (oFF.isNull(expressions))
	{
		return oFF.FeDataType.UNKNOWN;
	}
	let stringArguments = oFF.XStream.of(expressions).filter((expression) => {
		return oFF.FeDataType.isCompatible(expression.getReturnType(), oFF.FeDataType.STRING);
	}).countItems();
	let numberArguments = oFF.XStream.of(expressions).filter((expression2) => {
		return oFF.FeDataType.isCompatible(expression2.getReturnType(), oFF.FeDataType.NUMBER);
	}).countItems();
	if (stringArguments === expressions.size())
	{
		return oFF.FeDataType.LIST_STRING;
	}
	else if (numberArguments === expressions.size())
	{
		return oFF.FeDataType.LIST_NUMBER;
	}
	else
	{
		return oFF.FeDataType.LIST_MIXED;
	}
};
oFF.FeFormulaListConstantExtended.prototype.get = function(index)
{
	return this.m_formulaItems.get(index);
};
oFF.FeFormulaListConstantExtended.prototype.getArgumentType = function(index)
{
	return oFF.XOptional.ofNullable(this.m_formulaItems.get(index).getReturnType());
};
oFF.FeFormulaListConstantExtended.prototype.getConstantValue = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaListConstantExtended.prototype.getElements = function()
{
	return this.m_formulaItems;
};
oFF.FeFormulaListConstantExtended.prototype.getNumericShift = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaListConstantExtended.prototype.getReturnType = function()
{
	return this.m_arrayType;
};
oFF.FeFormulaListConstantExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.LIST_CONSTANT;
};
oFF.FeFormulaListConstantExtended.prototype.releaseObject = function()
{
	this.m_formulaItems = oFF.XObjectExt.release(this.m_formulaItems);
	this.m_arrayType = null;
	oFF.QFormulaItemConstant.prototype.releaseObject.call( this );
};

oFF.FeFormulaAttributeExtended = function() {};
oFF.FeFormulaAttributeExtended.prototype = new oFF.QFormulaItemAttribute();
oFF.FeFormulaAttributeExtended.prototype._ff_c = "FeFormulaAttributeExtended";

oFF.FeFormulaAttributeExtended.cast = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isEqualTo(oFF.FeFormulaItemType.ATTRIBUTE))
	{
		return oFF.XOptional.of(toCast);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaAttributeExtended.create = function(attributeName, returnType, context)
{
	let formula = new oFF.FeFormulaAttributeExtended();
	formula.setupModelComponent(null, null);
	formula.setName(attributeName);
	formula.setFieldByName(attributeName);
	formula.m_argumentsType = oFF.XList.create();
	formula.m_returnType = oFF.XObjectExt.assertNotNull(returnType);
	formula.m_feContext = context;
	return formula;
};
oFF.FeFormulaAttributeExtended.prototype.m_argumentsType = null;
oFF.FeFormulaAttributeExtended.prototype.m_feContext = null;
oFF.FeFormulaAttributeExtended.prototype.m_returnType = null;
oFF.FeFormulaAttributeExtended.prototype.getArgumentType = function(index)
{
	return oFF.XOptional.ofNullable(this.m_argumentsType.get(index));
};
oFF.FeFormulaAttributeExtended.prototype.getConstantValue = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaAttributeExtended.prototype.getFeContext = function()
{
	return oFF.XOptional.ofNullable(this.m_feContext);
};
oFF.FeFormulaAttributeExtended.prototype.getFeDimension = function()
{
	if (oFF.isNull(this.m_feContext))
	{
		return oFF.XOptional.empty();
	}
	return oFF.FeDimension.cast(this.m_feContext);
};
oFF.FeFormulaAttributeExtended.prototype.getNumericShift = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaAttributeExtended.prototype.getReturnType = function()
{
	return this.m_returnType;
};
oFF.FeFormulaAttributeExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.ATTRIBUTE;
};
oFF.FeFormulaAttributeExtended.prototype.releaseObject = function()
{
	this.m_argumentsType = oFF.XObjectExt.release(this.m_argumentsType);
	this.m_returnType = null;
	this.m_feContext = null;
	oFF.QFormulaItemAttribute.prototype.releaseObject.call( this );
};

oFF.FeFormulaMemberExtended = function() {};
oFF.FeFormulaMemberExtended.prototype = new oFF.QFormulaItemMember();
oFF.FeFormulaMemberExtended.prototype._ff_c = "FeFormulaMemberExtended";

oFF.FeFormulaMemberExtended.cast = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isEqualTo(oFF.FeFormulaItemType.MEMBER))
	{
		return oFF.XOptional.of(toCast);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaMemberExtended.create = function(memberName, returnType, context)
{
	let formula = new oFF.FeFormulaMemberExtended();
	formula.setupInternal(memberName, returnType, context, formula);
	return formula;
};
oFF.FeFormulaMemberExtended.prototype.m_argumentsType = null;
oFF.FeFormulaMemberExtended.prototype.m_feContext = null;
oFF.FeFormulaMemberExtended.prototype.m_returnType = null;
oFF.FeFormulaMemberExtended.prototype.getArgumentType = function(index)
{
	return oFF.XOptional.ofNullable(this.m_argumentsType.get(index));
};
oFF.FeFormulaMemberExtended.prototype.getConstantValue = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaMemberExtended.prototype.getFeContext = function()
{
	return oFF.XOptional.ofNullable(this.m_feContext);
};
oFF.FeFormulaMemberExtended.prototype.getNumericShift = function()
{
	return oFF.XOptional.empty();
};
oFF.FeFormulaMemberExtended.prototype.getReturnType = function()
{
	return this.m_returnType;
};
oFF.FeFormulaMemberExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.MEMBER;
};
oFF.FeFormulaMemberExtended.prototype.releaseObject = function()
{
	this.m_argumentsType = oFF.XObjectExt.release(this.m_argumentsType);
	this.m_returnType = null;
	this.m_feContext = null;
	oFF.QFormulaItemMember.prototype.releaseObject.call( this );
};
oFF.FeFormulaMemberExtended.prototype.setupInternal = function(memberName, returnType, context, formula)
{
	formula.setupModelComponent(null, null);
	formula.setMemberName(oFF.XStringUtils.assertNotNullOrEmpty(memberName));
	formula.m_argumentsType = oFF.XList.create();
	formula.m_returnType = oFF.XObjectExt.assertNotNull(returnType);
	formula.m_feContext = context;
};
oFF.FeFormulaMemberExtended.prototype.setupInternalWithName = function(memberName, returnType, context)
{
	this.setupInternal(memberName, returnType, context, this);
};

oFF.FeFormulaRestrictedMemberExtended = function() {};
oFF.FeFormulaRestrictedMemberExtended.prototype = new oFF.FeFormulaMemberExtended();
oFF.FeFormulaRestrictedMemberExtended.prototype._ff_c = "FeFormulaRestrictedMemberExtended";

oFF.FeFormulaRestrictedMemberExtended.castRestrict = function(toCast)
{
	if (toCast.getType().isEqualTo(oFF.FeFormulaItemType.RESTRICT))
	{
		return oFF.XOptional.ofNullable(toCast);
	}
	else
	{
		return oFF.XOptional.empty();
	}
};
oFF.FeFormulaRestrictedMemberExtended.collectDimensionMembers = function(formulaMembers, dimensionName)
{
	let dimensionMembers = oFF.XList.create();
	for (let j = 0; j < formulaMembers.size(); j++)
	{
		let member = formulaMembers.get(j);
		let currentDimension = member.getFeContext().get().getDimensionName();
		if (oFF.XString.isEqual(dimensionName, currentDimension))
		{
			dimensionMembers.add(member.getMemberName());
		}
	}
	return dimensionMembers;
};
oFF.FeFormulaRestrictedMemberExtended.createWithRestrict = function(args)
{
	oFF.XObjectExt.assertNotNull(args);
	let restrictedMemberExtended = oFF.FeFormulaRestrictedMemberExtended.initializeRestrictedMember();
	let measureName = "";
	let dimensionFilters = oFF.XList.create();
	for (let i = 0; i < args.size(); ++i)
	{
		let feFormulaItemExtended = args.get(i);
		let type = feFormulaItemExtended.getType();
		if (type.isTypeOf(oFF.FeFormulaItemType.MEMBER))
		{
			measureName = oFF.FeFormulaMemberExtended.cast(feFormulaItemExtended).get().getMemberName();
		}
		else if (type.isTypeOf(oFF.FeFormulaItemType.FUNCTION))
		{
			oFF.FeFormulaRestrictedMemberExtended.processFunction(feFormulaItemExtended, dimensionFilters);
		}
	}
	restrictedMemberExtended.customMeasure = oFF.FeFormulaRestrictedMeasure.create(restrictedMemberExtended.getMemberName(), measureName, dimensionFilters);
	return restrictedMemberExtended;
};
oFF.FeFormulaRestrictedMemberExtended.dimensionFilterExists = function(dimensionFilters, dimensionName)
{
	return oFF.XStream.of(dimensionFilters).find((d) => {
		return oFF.XString.isEqual(d.getDimensionName(), dimensionName);
	}).isPresent();
};
oFF.FeFormulaRestrictedMemberExtended.initializeRestrictedMember = function()
{
	let restrictedMemberExtended = new oFF.FeFormulaRestrictedMemberExtended();
	let restrictedMemberName = oFF.XGuid.getGuid();
	restrictedMemberExtended.setupInternalWithName(restrictedMemberName, oFF.FeDataType.NUMBER, null);
	return restrictedMemberExtended;
};
oFF.FeFormulaRestrictedMemberExtended.processFunction = function(feFormulaItemExtended, dimensionFilters)
{
	let formulaMembers = oFF.FeDimensionFilterConverter.flattenConditionTreeToFormulaMemberList(oFF.FeFormulaFunctionExtended.cast(feFormulaItemExtended).get());
	let memberIterator = formulaMembers.getIterator();
	while (memberIterator.hasNext())
	{
		let member = memberIterator.next();
		let dimensionName = member.getFeContext().get().getDimensionName();
		if (!oFF.FeFormulaRestrictedMemberExtended.dimensionFilterExists(dimensionFilters, dimensionName))
		{
			let dimensionMembers = oFF.FeFormulaRestrictedMemberExtended.collectDimensionMembers(formulaMembers, dimensionName);
			let filter = oFF.FeFormulaCustomMeasureDimensionFilter.create(dimensionName, dimensionMembers);
			dimensionFilters.add(filter);
		}
	}
};
oFF.FeFormulaRestrictedMemberExtended.prototype.customMeasure = null;
oFF.FeFormulaRestrictedMemberExtended.prototype.getCustomMeasure = function()
{
	return oFF.XOptional.ofNullable(this.customMeasure);
};
oFF.FeFormulaRestrictedMemberExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.RESTRICT;
};

oFF.FeFormulaFunctionExtended = function() {};
oFF.FeFormulaFunctionExtended.prototype = new oFF.QFormulaItemFunction();
oFF.FeFormulaFunctionExtended.prototype._ff_c = "FeFormulaFunctionExtended";

oFF.FeFormulaFunctionExtended.cast = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isTypeOf(oFF.FeFormulaItemType.FUNCTION))
	{
		return oFF.XOptional.of(toCast);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaFunctionExtended.createFunctionWithName = function(name, args, feConfiguration)
{
	let formulaFunction = new oFF.FeFormulaFunctionExtended();
	return formulaFunction.setupFunctionInternal(name, args, feConfiguration, true, null);
};
oFF.FeFormulaFunctionExtended.createFunctionWithNameAndNumericShift = function(name, args, feConfiguration, numericShift)
{
	let formulaFunction = new oFF.FeFormulaFunctionExtended();
	return formulaFunction.setupFunctionInternal(name, args, feConfiguration, true, numericShift);
};
oFF.FeFormulaFunctionExtended.createFunctionWithoutPreprocessing = function(name, args, feConfiguration)
{
	let formulaFunction = new oFF.FeFormulaFunctionExtended();
	return formulaFunction.setupFunctionInternal(name, args, feConfiguration, false, null);
};
oFF.FeFormulaFunctionExtended.prototype.m_argumentsType = null;
oFF.FeFormulaFunctionExtended.prototype.m_constantValue = null;
oFF.FeFormulaFunctionExtended.prototype.m_numericShift = null;
oFF.FeFormulaFunctionExtended.prototype.m_returnType = null;
oFF.FeFormulaFunctionExtended.prototype.addOptionalArguments = function(metadata, args, feConfiguration)
{
	if (metadata.hasOptionalArgs() && metadata.getOptionalArgumentsCount() !== oFF.XInteger.getMaximumValue() && args.size() < metadata.getArgumentsCount())
	{
		for (let argIndex = args.size(); argIndex < metadata.getArgumentsCount(); argIndex++)
		{
			if (this.argumentExistsAndSupportsNull(metadata, argIndex))
			{
				this.add(this.createOptionalArgument(metadata, args, argIndex, feConfiguration));
			}
		}
	}
};
oFF.FeFormulaFunctionExtended.prototype.argumentExists = function(args, argumentIndex)
{
	return !(argumentIndex >= args.size() || argumentIndex === -1);
};
oFF.FeFormulaFunctionExtended.prototype.argumentExistsAndSupportsNull = function(metadata, argIndex)
{
	return metadata.getArgument(argIndex).isPresent() && metadata.getArgument(argIndex).get().isArgumentTypeSupported(oFF.FeDataType.NULL);
};
oFF.FeFormulaFunctionExtended.prototype.createOptionalArgument = function(metadata, args, argIndex, feConfiguration)
{
	let optionalArgument = oFF.FeFormulaConstantExtended.createNull();
	let argumentIndex = metadata.getArgument(argIndex).get().getArgumentIndexWithSameType();
	if (this.argumentExists(args, argumentIndex) && this.hasNumberReturnType(args, argumentIndex))
	{
		let nullConstant = oFF.FeFormulaConstantExtended.createNull();
		let functionArguments = oFF.XList.create();
		functionArguments.add(nullConstant);
		optionalArgument = oFF.FeFormulaFunctionExtended.createFunctionWithName(oFF.FormulaOperator.DECFLOAT.getName(), functionArguments, feConfiguration);
	}
	return optionalArgument;
};
oFF.FeFormulaFunctionExtended.prototype.getArgument = function(index)
{
	return this.get(index);
};
oFF.FeFormulaFunctionExtended.prototype.getArgumentType = function(index)
{
	return oFF.XOptional.ofNullable(this.m_argumentsType.get(index));
};
oFF.FeFormulaFunctionExtended.prototype.getArguments = function()
{
	return oFF.XStream.of(this.createListCopy()).map((item) => {
		return item;
	}).collect(oFF.XStreamCollector.toList());
};
oFF.FeFormulaFunctionExtended.prototype.getConstantValue = function()
{
	if (oFF.notNull(this.m_constantValue))
	{
		return this.m_constantValue;
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaFunctionExtended.prototype.getNestedMeasureNames = function()
{
	let measureNames = oFF.XHashSetOfString.create();
	let iterator = this.getIterator();
	while (iterator.hasNext())
	{
		let formulaItem = iterator.next();
		let measureOpt = oFF.FeFormulaMemberExtended.cast(formulaItem);
		let functionOpt = oFF.FeFormulaFunctionExtended.cast(formulaItem);
		if (measureOpt.isPresent() && measureOpt.get().getFeContext().isPresent())
		{
			measureNames.add(measureOpt.get().getFeContext().get().getId());
		}
		else if (functionOpt.isPresent())
		{
			measureNames.addAll(functionOpt.get().getNestedMeasureNames());
		}
	}
	return measureNames;
};
oFF.FeFormulaFunctionExtended.prototype.getNumericShift = function()
{
	return oFF.XOptional.ofNullable(this.m_numericShift);
};
oFF.FeFormulaFunctionExtended.prototype.getReturnType = function()
{
	return this.m_returnType;
};
oFF.FeFormulaFunctionExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.FUNCTION;
};
oFF.FeFormulaFunctionExtended.prototype.hasNumberReturnType = function(args, argumentIndex)
{
	return oFF.FeDataType.isCompatible(args.get(argumentIndex).getReturnType(), oFF.FeDataType.NUMBER);
};
oFF.FeFormulaFunctionExtended.prototype.releaseObject = function()
{
	this.m_returnType = null;
	this.m_argumentsType = oFF.XObjectExt.release(this.m_argumentsType);
	this.m_constantValue = null;
	this.m_numericShift = oFF.XObjectExt.release(this.m_numericShift);
	oFF.QFormulaItemFunction.prototype.releaseObject.call( this );
};
oFF.FeFormulaFunctionExtended.prototype.setupFunctionInternal = function(name, args, feConfiguration, preprocess, numericShift)
{
	oFF.XStringUtils.assertNotNullOrEmpty(name);
	oFF.XObjectExt.assertNotNull(args);
	oFF.XCollectionUtils.forEach(args, (a) => {
		oFF.XObjectExt.assertNotNull(a);
	});
	let fi = oFF.FeFormulaItemProvider.getInstance().getFormulaItem(name);
	if (!fi.isPresent())
	{
		return oFF.FeFormulaConstantExtended.createNull();
	}
	let metadata = fi.get().getMetadata();
	if (preprocess)
	{
		let transform = metadata.transform(args, feConfiguration);
		if (transform.isPresent())
		{
			return transform.get();
		}
		let formulaItem = metadata.simplify(args, feConfiguration);
		if (formulaItem.isPresent())
		{
			return formulaItem.get();
		}
	}
	this.setupOlapList(null, null, false, null, oFF.XCollectionFactory.LOOKUP_LIST, false);
	this.setFunctionName(metadata.getType().getName());
	oFF.XStream.of(args).forEach((arg1) => {
		this.add(arg1);
	});
	this.addOptionalArguments(metadata, args, feConfiguration);
	this.m_argumentsType = oFF.XStream.of(args).map((arg2) => {
		return arg2.getReturnType();
	}).collect(oFF.XStreamCollector.toList());
	this.m_returnType = metadata.getReturnType(args);
	this.m_constantValue = oFF.XOptional.empty();
	if (oFF.XString.isEqual(metadata.getName(), oFF.FeDecfloatAbstract.NAME))
	{
		this.m_constantValue = args.get(0).getConstantValue();
		if (args.get(0).getReturnType().isTypeOf(oFF.FeDataType.NULL))
		{
			this.m_returnType = oFF.FeDataType.NULL;
		}
	}
	if (metadata.requiresExternalSignFlip())
	{
		this.setRequiresExternalSignFlip(true);
	}
	this.m_numericShift = numericShift;
	return this;
};

oFF.FeFormulaArrayExtended = function() {};
oFF.FeFormulaArrayExtended.prototype = new oFF.FeFormulaFunctionExtended();
oFF.FeFormulaArrayExtended.prototype._ff_c = "FeFormulaArrayExtended";

oFF.FeFormulaArrayExtended.castToArray = function(toCast)
{
	if (oFF.notNull(toCast) && toCast.getType().isEqualTo(oFF.FeFormulaItemType.FUNCTION_ARRAY))
	{
		return oFF.XOptional.of(toCast);
	}
	return oFF.XOptional.empty();
};
oFF.FeFormulaArrayExtended.createArray = function(chainingOperator, args, feConfiguration)
{
	let arrayFunction = new oFF.FeFormulaArrayExtended();
	arrayFunction.setupFunctionInternal(chainingOperator, args, feConfiguration, true, null);
	return arrayFunction;
};
oFF.FeFormulaArrayExtended.prototype.getType = function()
{
	return oFF.FeFormulaItemType.FUNCTION_ARRAY;
};
oFF.FeFormulaArrayExtended.prototype.setupFunctionInternal = function(name, args, feConfiguration, preprocess, numericShift)
{
	oFF.FeFormulaFunctionExtended.prototype.setupFunctionInternal.call( this , name, args, feConfiguration, preprocess, numericShift);
	if (oFF.XStream.of(this.getArguments()).allMatch((formulaItem) => {
		return formulaItem.getReturnType().isTypeOf(oFF.FeDataType.BOOLEAN);
	}))
	{
		this.m_returnType = oFF.FeDataType.DIMENSION_FILTER;
	}
	return this;
};

oFF.FormulaEditorModule = function() {};
oFF.FormulaEditorModule.prototype = new oFF.DfModule();
oFF.FormulaEditorModule.prototype._ff_c = "FormulaEditorModule";

oFF.FormulaEditorModule.s_module = null;
oFF.FormulaEditorModule.getInstance = function()
{
	if (oFF.isNull(oFF.FormulaEditorModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapApiModule.getInstance());
		oFF.FormulaEditorModule.s_module = oFF.DfModule.startExt(new oFF.FormulaEditorModule());
		oFF.FeFeatureToggle.staticSetup();
		oFF.FeDataType.staticSetup();
		oFF.FeResultVisibility.staticSetup();
		oFF.FeModelComponentType.staticSetup();
		oFF.FeValueType.staticSetup();
		oFF.FeDimensionType.staticSetup();
		oFF.FeFormulaItemCategory.staticSetup();
		oFF.FeTokenType.staticSetup();
		oFF.FeTransientFormulaOperator.staticSetupTransFormulaOperator();
		oFF.FeDatasourceType.staticSetup();
		oFF.FeStructureType.staticSetup();
		oFF.FeFormulaItemType.staticSetup();
		oFF.FeDateGranularityConstants.staticSetup();
		oFF.FeI18n.staticSetup();
		oFF.FeParser.staticSetup();
		oFF.FeCustomHighlighter.staticSetup();
		oFF.FeCustomAceOverrides.staticSetup();
		oFF.FeKeyboardHandler.staticSetup();
		oFF.DfModule.stopExt(oFF.FormulaEditorModule.s_module);
	}
	return oFF.FormulaEditorModule.s_module;
};
oFF.FormulaEditorModule.prototype.getName = function()
{
	return "ff5400.formula.editor";
};

oFF.FormulaEditorModule.getInstance();

return oFF;
} );