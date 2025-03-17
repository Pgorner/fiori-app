/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2260.ui.remote","sap/sac/df/firefly/ff4200.olap.api"
],
function(oFF)
{
"use strict";

oFF.SxActionsProvider = function() {};
oFF.SxActionsProvider.prototype = new oFF.XObject();
oFF.SxActionsProvider.prototype._ff_c = "SxActionsProvider";

oFF.SxActionsProvider.create = function(queryManager)
{
	let actionProvider = new oFF.SxActionsProvider();
	actionProvider.m_qManager = queryManager;
	return actionProvider;
};
oFF.SxActionsProvider.prototype.m_qManager = null;
oFF.SxActionsProvider.prototype.getActionWithParameters = function(cc, scriptString)
{
	let splitCommands = oFF.XStringTokenizer.splitString(scriptString, "$");
	let actionsWithParameters = oFF.XList.create();
	for (let actionsIndex = 1; actionsIndex < splitCommands.size(); actionsIndex++)
	{
		let cActionWP = splitCommands.get(actionsIndex);
		let actionContent = oFF.XStringTokenizer.splitString(cActionWP, "'");
		let currentAction = oFF.XList.create();
		for (let cIndex = 1; cIndex < actionContent.size(); cIndex = cIndex + 2)
		{
			currentAction.add(actionContent.get(cIndex));
		}
		if (currentAction.size() > 0)
		{
			this.processAction(cc, currentAction);
			actionsWithParameters.add(currentAction);
		}
	}
	return actionsWithParameters;
};
oFF.SxActionsProvider.prototype.processAction = function(cc, actionList)
{
	let command = actionList.get(0);
	let dimName = actionList.get(2);
	if (oFF.XString.isEqual(command, "axisColumn"))
	{
		cc.moveMeasureDimensionToAxis(oFF.AxisType.COLUMNS);
		let acctTest = cc.moveDimensionToAxis(dimName, oFF.AxisType.COLUMNS);
		if (oFF.notNull(acctTest))
		{
			this.setDimHierarchy(cc, dimName, actionList);
			this.setSingleMemberSel(cc, acctTest, actionList);
		}
		else
		{
			this.setDimHierarchy(cc, dimName, actionList);
			if (actionList.size() > 3 && !oFF.XString.isEqual(actionList.get(3), ""))
			{
				let measureNameY = actionList.get(3);
				cc.addSingleMeasureFilter(measureNameY);
			}
		}
	}
	else if (oFF.XString.isEqual(command, "axisRows"))
	{
		cc.moveDimensionToAxis(dimName, oFF.AxisType.ROWS);
		this.setDimHierarchy(cc, dimName, actionList);
	}
	else if (oFF.XString.isEqual(command, "filter"))
	{
		this.setFilter(cc, actionList);
	}
};
oFF.SxActionsProvider.prototype.processQueryDefinition = function(script)
{
	this.getActionWithParameters(this.m_qManager.getConvenienceCommands(), script);
	return this.m_qManager;
};
oFF.SxActionsProvider.prototype.setDimHierarchy = function(cc, dimensionName, actionList)
{
	if (actionList.size() > 4 && !oFF.XString.isEqual(actionList.get(4), ""))
	{
		cc.setDimensionHierarchy(dimensionName, actionList.get(4), true, 0);
	}
};
oFF.SxActionsProvider.prototype.setFilter = function(cc, actionList)
{
	if (actionList.size() > 3)
	{
		let comparisionType = actionList.get(2);
		for (let membersIndex = 3; membersIndex < actionList.size(); membersIndex++)
		{
			let member = actionList.get(membersIndex);
			if (!oFF.XString.isEqual(comparisionType, "") && oFF.XString.isEqual(comparisionType, "IN"))
			{
				cc.addSingleMemberFilterByDimension(cc.getDimension(actionList.get(1)), member, oFF.ComparisonOperator.EQUAL);
			}
		}
	}
};
oFF.SxActionsProvider.prototype.setSingleMemberSel = function(cc, dimension, actionList)
{
	if (actionList.size() > 3 && !oFF.XString.isEqual(actionList.get(3), ""))
	{
		let member = actionList.get(3);
		cc.addSingleMemberFilterByDimension(dimension, member, oFF.ComparisonOperator.EQUAL);
	}
};

oFF.SxBinding = function() {};
oFF.SxBinding.prototype = new oFF.XObject();
oFF.SxBinding.prototype._ff_c = "SxBinding";

oFF.SxBinding.create = function(reportingApp, isNeo)
{
	let binding = new oFF.SxBinding();
	binding.m_quasar = reportingApp;
	binding.m_isNeo = isNeo;
	if (binding.m_isNeo)
	{
		binding.m_isNeo = true;
	}
	return binding;
};
oFF.SxBinding.prototype.m_binding = null;
oFF.SxBinding.prototype.m_cacheIdentifier = null;
oFF.SxBinding.prototype.m_control = null;
oFF.SxBinding.prototype.m_dataprovider = null;
oFF.SxBinding.prototype.m_isNeo = false;
oFF.SxBinding.prototype.m_quasar = null;
oFF.SxBinding.prototype.m_receiver = null;
oFF.SxBinding.prototype.m_sender = null;
oFF.SxBinding.prototype.m_type = null;
oFF.SxBinding.prototype.getControl = function()
{
	return this.m_control;
};
oFF.SxBinding.prototype.getDataprovider = function()
{
	return this.m_dataprovider;
};
oFF.SxBinding.prototype.getSession = function()
{
	let application = this.m_quasar.getApplication();
	let session = application.getSession();
	return session;
};
oFF.SxBinding.prototype.getSource = function()
{
	return this.m_sender;
};
oFF.SxBinding.prototype.getTarget = function()
{
	return this.m_receiver;
};
oFF.SxBinding.prototype.getType = function()
{
	return this.m_type;
};
oFF.SxBinding.prototype.processInit = function()
{
	let bindingManager = this.m_quasar.getApplication().getBindingManager();
	this.m_binding = bindingManager.bindTogether(this.m_sender, oFF.SigSelDomain.UI, this.m_control, this.m_receiver, oFF.SigSelDomain.UI, this.m_control, this.m_type, this.m_cacheIdentifier, false, this.m_isNeo);
};
oFF.SxBinding.prototype.releaseObject = function()
{
	this.m_control = null;
	this.m_dataprovider = null;
	this.m_quasar = null;
	this.m_binding = oFF.XObjectExt.release(this.m_binding);
	this.m_binding = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SxBinding.prototype.setCacheIdentifier = function(identifier)
{
	this.m_cacheIdentifier = identifier;
};
oFF.SxBinding.prototype.setControl = function(control)
{
	this.m_control = control;
};
oFF.SxBinding.prototype.setDataprovider = function(dataprovider)
{
	this.m_dataprovider = dataprovider;
};
oFF.SxBinding.prototype.setSource = function(source)
{
	this.m_sender = source;
};
oFF.SxBinding.prototype.setTarget = function(target)
{
	this.m_receiver = target;
};
oFF.SxBinding.prototype.setType = function(type)
{
	this.m_type = type;
};

oFF.SxSelection = function() {};
oFF.SxSelection.prototype = new oFF.XObject();
oFF.SxSelection.prototype._ff_c = "SxSelection";

oFF.SxSelection.create = function(component, property)
{
	let newObj = new oFF.SxSelection();
	newObj.m_component = component;
	newObj.m_property = property;
	return newObj;
};
oFF.SxSelection.prototype.m_component = null;
oFF.SxSelection.prototype.m_property = null;
oFF.SxSelection.prototype.getComponent = function()
{
	return this.m_component;
};
oFF.SxSelection.prototype.getProperty = function()
{
	return this.m_property;
};

oFF.QsDataproviderFactory = function() {};
oFF.QsDataproviderFactory.prototype = new oFF.XObject();
oFF.QsDataproviderFactory.prototype._ff_c = "QsDataproviderFactory";

oFF.QsDataproviderFactory.s_factories = null;
oFF.QsDataproviderFactory.createDataprovider = function(dpType, engine, definition)
{
	let bindingProvider = null;
	if (oFF.notNull(dpType))
	{
		let factory = null;
		factory = oFF.QsDataproviderFactory.s_factories.getByKey(dpType.getName());
		if (oFF.notNull(factory))
		{
			bindingProvider = factory.newDataprovider(engine, definition);
		}
	}
	return bindingProvider;
};
oFF.QsDataproviderFactory.registerFactory = function(dpType, factory)
{
	if (oFF.notNull(dpType))
	{
		oFF.QsDataproviderFactory.s_factories.put(dpType.getName(), factory);
	}
};
oFF.QsDataproviderFactory.staticSetup = function()
{
	oFF.QsDataproviderFactory.s_factories = oFF.XHashMapByString.create();
};

oFF.ContentParserRegistration = {

	s_parser:null,
	getAllEntries:function()
	{
			return oFF.ContentParserRegistration.s_parser;
	},
	getCustomContentParser:function(name)
	{
			return oFF.ContentParserRegistration.s_parser.getByKey(name);
	},
	setCustomContentParser:function(name, contentParser)
	{
			oFF.ContentParserRegistration.s_parser.put(name, contentParser);
	},
	staticSetup:function()
	{
			oFF.ContentParserRegistration.s_parser = oFF.XHashMapByString.create();
	}
};

oFF.DfContentParser = function() {};
oFF.DfContentParser.prototype = new oFF.XObject();
oFF.DfContentParser.prototype._ff_c = "DfContentParser";

oFF.DfContentParser.prototype.getIdName = function()
{
	return "id";
};
oFF.DfContentParser.prototype.parseContent = function(element)
{
	let result = new oFF.InputControlContent();
	let contentStructure = oFF.PrFactory.createStructure();
	this.parseContentToStructure(element, this.getIdName(), contentStructure);
	result.setContent(contentStructure);
	return result;
};
oFF.DfContentParser.prototype.parseContentToStructure = function(element, myIdName, contentStructure)
{
	let subList = element.asList();
	if (oFF.notNull(subList))
	{
		for (let i = 0; i < subList.size(); i++)
		{
			let subItem = oFF.PrFactory.createStructure();
			let subOrig = subList.get(i).asStructure();
			if (oFF.notNull(subOrig))
			{
				subItem.copyFrom(subOrig, null);
				this.remapSubItem(subItem);
				let key = subItem.getStringByKey(myIdName);
				if (oFF.notNull(key))
				{
					contentStructure.put(key, subItem);
				}
			}
		}
	}
};
oFF.DfContentParser.prototype.remapSubItem = function(subItem) {};

oFF.QsOlapDpFactory = function() {};
oFF.QsOlapDpFactory.prototype = new oFF.QsDataproviderFactory();
oFF.QsOlapDpFactory.prototype._ff_c = "QsOlapDpFactory";

oFF.QsOlapDpFactory.staticSetupFactory = function()
{
	let newFactory = new oFF.QsOlapDpFactory();
	oFF.QsDataproviderFactory.registerFactory(oFF.QsDpType.OLAP, newFactory);
};
oFF.QsOlapDpFactory.prototype.newDataprovider = function(engine, definition)
{
	let olapDp = oFF.QsOlapDp.create(engine, definition);
	return olapDp;
};

oFF.QsRestDpFactory = function() {};
oFF.QsRestDpFactory.prototype = new oFF.QsDataproviderFactory();
oFF.QsRestDpFactory.prototype._ff_c = "QsRestDpFactory";

oFF.QsRestDpFactory.staticSetupFactory = function()
{
	let newFactory = new oFF.QsRestDpFactory();
	oFF.QsDataproviderFactory.registerFactory(oFF.QsDpType.REST, newFactory);
};
oFF.QsRestDpFactory.prototype.newDataprovider = function(engine, definition)
{
	let olapDp = oFF.QsRestDp.create(engine, definition);
	return olapDp;
};

oFF.AbstractGlobalContent = function() {};
oFF.AbstractGlobalContent.prototype = new oFF.GlobalValueHolder();
oFF.AbstractGlobalContent.prototype._ff_c = "AbstractGlobalContent";

oFF.AbstractGlobalContent.prototype.m_bnd = null;
oFF.AbstractGlobalContent.prototype.m_dps = null;
oFF.AbstractGlobalContent.prototype.fireChange = function(container)
{
	let dps = container.getListByKey("dpNames");
	if (oFF.notNull(dps) && oFF.notNull(this.m_dps) && oFF.notNull(this.m_bnd))
	{
		for (let j = 0; j < dps.size(); j++)
		{
			dps.getStringAt(j);
			this.m_dps.getByKey(dps.getStringAt(j)).reinit();
		}
	}
	for (let k = 0; k < this.m_bnd.size(); k++)
	{
		this.m_bnd.get(k).processInit();
	}
};
oFF.AbstractGlobalContent.prototype.setupDpsAndBindings = function(dataProviders, bindings)
{
	this.m_dps = oFF.XHashMapByString.create();
	for (let i = 0; i < dataProviders.size(); i++)
	{
		let qsdp = dataProviders.get(i);
		this.m_dps.put(qsdp.getName(), qsdp);
	}
	this.m_bnd = bindings;
};

oFF.FieldSelectionParser = function() {};
oFF.FieldSelectionParser.prototype = new oFF.DfContentParser();
oFF.FieldSelectionParser.prototype._ff_c = "FieldSelectionParser";

oFF.FieldSelectionParser.prototype.remapSubItem = function(subItem)
{
	if (oFF.notNull(subItem))
	{
		let fsiEntities = subItem.putNewStructure("entities");
		if (subItem.containsKey("entityIds"))
		{
			this.parseContentToStructure(subItem.getListByKey("entityIds"), "id", fsiEntities);
			this.parseContentToStructure(subItem.getListByKey("entityIds"), "dimension", fsiEntities);
		}
	}
};

oFF.PageFilterParser = function() {};
oFF.PageFilterParser.prototype = new oFF.DfContentParser();
oFF.PageFilterParser.prototype._ff_c = "PageFilterParser";

oFF.PageFilterParser.prototype.getIdName = function()
{
	return "source";
};

oFF.StoryFilterParser = function() {};
oFF.StoryFilterParser.prototype = new oFF.DfContentParser();
oFF.StoryFilterParser.prototype._ff_c = "StoryFilterParser";

oFF.StoryFilterParser.prototype.getIdName = function()
{
	return "filterId";
};

oFF.InputControlContent = function() {};
oFF.InputControlContent.prototype = new oFF.AbstractGlobalContent();
oFF.InputControlContent.prototype._ff_c = "InputControlContent";


oFF.CustomAbstractWidget = function() {};
oFF.CustomAbstractWidget.prototype = new oFF.XObject();
oFF.CustomAbstractWidget.prototype._ff_c = "CustomAbstractWidget";

oFF.CustomAbstractWidget.prototype.createCustomControl = function(genesis, customContent, globalContent)
{
	return this.mapFilterToWidget(genesis, customContent, customContent.getStringByKeyExt("id", customContent.getStringByKeyExt("source", customContent.getStringByKeyExt("name", "unknown"))), globalContent.getByKey(this.getGlobalId()));
};
oFF.CustomAbstractWidget.prototype.getGlobalId = function()
{
	return "";
};
oFF.CustomAbstractWidget.prototype.getPixelStringValue = function(struct, key)
{
	let element = struct.getByKey(key);
	if (oFF.isNull(element))
	{
		return "";
	}
	if (element.isInteger())
	{
		return oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(element.asInteger().getInteger()), "px");
	}
	if (element.isString())
	{
		return element.asString().getString();
	}
	return "";
};
oFF.CustomAbstractWidget.prototype.mapFilterToWidget = function(genesis, customContent, widgetName, globalContent)
{
	let filterDefinitionAt = globalContent.getContent().getByKey(customContent.getStringByKey(oFF.UiProperty.ID.getName()));
	if (filterDefinitionAt.containsKey("selectionInfos"))
	{
		filterDefinitionAt = filterDefinitionAt.getStructureByKey("selectionInfos");
	}
	let filterTokenInfo = filterDefinitionAt.getStructureByKey("filterTokenInfo");
	let possibleValues = filterDefinitionAt.getListByKey("possibleValues");
	let multiSelection = false;
	if (oFF.notNull(filterTokenInfo) && filterTokenInfo.hasStringByKey("selectionType") && oFF.XString.startsWith(filterTokenInfo.getStringByKey("selectionType"), "multiple"))
	{
		multiSelection = true;
	}
	let result = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	result.setX(oFF.UiCssLength.create(this.getPixelStringValue(customContent, "X")));
	result.setY(oFF.UiCssLength.create(this.getPixelStringValue(customContent, "Y")));
	result.setHeight(oFF.UiCssLength.create(this.getPixelStringValue(customContent, "Height")));
	result.setWidth(oFF.UiCssLength.create(this.getPixelStringValue(customContent, "Width")));
	let label = result.addNewItemOfType(oFF.UiType.LABEL);
	label.setName(oFF.XStringUtils.concatenate3("Label", "_", widgetName));
	label.setText(filterDefinitionAt.getStringByKeyExt("title", filterDefinitionAt.getStringByKeyExt("customizedTitle", "")));
	let customObject;
	let contentStructure = null;
	if (oFF.isNull(possibleValues) || possibleValues.size() === 0)
	{
		return null;
	}
	let keyStructure = null;
	if (possibleValues.size() === 1 && possibleValues.get(0).isStructure() && possibleValues.getStructureAt(0).getByKey("key").isStructure())
	{
		keyStructure = possibleValues.getStructureAt(0).getStructureByKey("key");
	}
	if (oFF.notNull(keyStructure))
	{
		let orgValueStructure = possibleValues.getStructureAt(0).getStructureByKey("originalValue");
		let originalRanges = null;
		if (filterTokenInfo.containsKey("originalRanges"))
		{
			originalRanges = filterTokenInfo.getListByKey("originalRanges").getStructureAt(0);
		}
		else
		{
			originalRanges = orgValueStructure;
		}
		if (multiSelection)
		{
			contentStructure = result.addNewItemOfType(oFF.UiType.RANGE_SLIDER);
			contentStructure.setSliderUpperValue(originalRanges.getIntegerByKey("end"));
		}
		else
		{
			contentStructure = result.addNewItemOfType(oFF.UiType.SLIDER);
		}
		contentStructure.setSliderMinimum(originalRanges.getIntegerByKey("start"));
		contentStructure.setSliderMaximum(originalRanges.getIntegerByKey("end"));
		contentStructure.setSliderStep(originalRanges.getIntegerByKey("icSliderIncrement"));
		contentStructure.setSliderValue(originalRanges.getIntegerByKey("start"));
		customObject = oFF.XHashMapByString.create();
		customObject.put("container", filterDefinitionAt);
		customObject.put("controller", globalContent);
		contentStructure.setCustomObject(customObject);
		contentStructure.registerOnChange(this);
	}
	else
	{
		if (multiSelection)
		{
			contentStructure = result.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
			for (let checkIndex = 0; checkIndex < possibleValues.size(); checkIndex++)
			{
				let possibleCheckValue = possibleValues.getStructureAt(checkIndex);
				let checkItem = contentStructure.addNewItemOfType(oFF.UiType.CHECKBOX);
				customObject = oFF.XHashMapByString.create();
				customObject.put("container", filterDefinitionAt);
				customObject.put("controller", globalContent);
				customObject.put("selection", possibleCheckValue);
				checkItem.setCustomObject(customObject);
				if (oFF.notNull(possibleCheckValue))
				{
					let keyList = possibleCheckValue.getListByKey("key");
					if (oFF.notNull(keyList) && keyList.isList())
					{
						checkItem.setName(keyList.getStringAt(0));
					}
					let originalStructure = possibleCheckValue.getStructureByKey("originalValue");
					if (oFF.notNull(originalStructure) && originalStructure.isStructure())
					{
						checkItem.setText(originalStructure.getStringByKey("displayName"));
					}
					checkItem.setChecked(possibleCheckValue.getBooleanByKeyExt("isSelected", false));
				}
				checkItem.registerOnChange(this);
			}
		}
		else
		{
			contentStructure = result.addNewItemOfType(oFF.UiType.DROPDOWN);
			for (let dropIndex = 0; dropIndex < possibleValues.size(); dropIndex++)
			{
				let possibleDropValue = possibleValues.getStructureAt(dropIndex);
				let dropItem = contentStructure.addNewItemOfType(oFF.UiType.DROPDOWN_ITEM);
				dropItem.setName(possibleDropValue.getListByKey("key").getStringAt(0));
				dropItem.setText(possibleDropValue.getStructureByKey("originalValue").getStringByKey("displayName"));
				customObject = oFF.XHashMapByString.create();
				customObject.put("container", filterDefinitionAt);
				customObject.put("controller", globalContent);
				customObject.put("selection", possibleDropValue);
				dropItem.setCustomObject(customObject);
				if (possibleDropValue.getBooleanByKey("isSelected"))
				{
					let dropKeyList = possibleDropValue.getListByKey("key");
					if (oFF.notNull(dropKeyList) && dropKeyList.isList())
					{
						contentStructure.setSelectedName(dropKeyList.getStringAt(0));
					}
				}
			}
			contentStructure.registerOnSelect(this);
		}
	}
	if (oFF.notNull(contentStructure))
	{
		contentStructure.setName(widgetName);
	}
	return result;
};
oFF.CustomAbstractWidget.prototype.onChange = function(event)
{
	let customObject = event.getControl().getCustomObject();
	let controller = customObject.getByKey("controller");
	let container = customObject.getByKey("container");
	let selection = customObject.getByKey("selection");
	if (oFF.notNull(selection))
	{
		let possibleValues = container.getListByKey("possibleValues");
		selection.putBoolean("isSelected", event.getControl().isChecked());
		let origValues = container.getListByKey("originalValues");
		origValues.clear();
		origValues.clear();
		let filterValues = container.getListByKey("filters").getStructureAt(0).getListByKey("answers").getStructureAt(0).getListByKey("arguments");
		filterValues.clear();
		for (let i = 0; i < possibleValues.size(); i++)
		{
			let curVal = possibleValues.getStructureAt(i);
			if (curVal.getBooleanByKey("isSelected"))
			{
				origValues.add(curVal.getStructureByKey("originalValue"));
				filterValues.add(curVal.getListByKey("key"));
			}
		}
	}
	else
	{
		let originalValues = container.getListByKey("originalValues").getStructureAt(0);
		let filters = container.getListByKey("filters").getStructureAt(0).getListByKey("answers").getStructureAt(0).getListByKey("arguments");
		filters.clear();
		let lower = event.getControl().getSliderValue();
		let upper = event.getControl().getSliderValue();
		if (oFF.XString.isEqual("multiple", container.getStructureByKey("filterTokenInfo").getStringByKey("selectionType")))
		{
			lower = oFF.XMath.min(lower, event.getControl().getSliderUpperValue());
			upper = oFF.XMath.max(upper, event.getControl().getSliderUpperValue());
		}
		filters.addNewList().addString(oFF.XInteger.convertToString(lower));
		filters.addNewList().addString(oFF.XInteger.convertToString(upper));
		originalValues.putString("end", oFF.XInteger.convertToString(upper));
		originalValues.putString("start", oFF.XInteger.convertToString(lower));
	}
	controller.fireChange(container);
};
oFF.CustomAbstractWidget.prototype.onSelect = function(event)
{
	let customObject = event.getSelectedItem().getCustomObject();
	let controller = customObject.getByKey("controller");
	let container = customObject.getByKey("container");
	let possibleValues = container.getListByKey("possibleValues");
	for (let i = 0; i < possibleValues.size(); i++)
	{
		possibleValues.getStructureAt(i).putBoolean("isSelected", false);
	}
	let selection = customObject.getByKey("selection");
	selection.putBoolean("isSelected", true);
	let origValues = container.getListByKey("originalValues");
	origValues.clear();
	let filterValues = container.getListByKey("filters").getStructureAt(0).getListByKey("answers").getStructureAt(0).getListByKey("arguments");
	filterValues.clear();
	filterValues.add(selection.getListByKey("key"));
	origValues.add(selection.getStructureByKey("originalValue"));
	controller.fireChange(container);
};

oFF.SxDataProvider = function() {};
oFF.SxDataProvider.prototype = new oFF.XComponent();
oFF.SxDataProvider.prototype._ff_c = "SxDataProvider";

oFF.SxDataProvider.create = function(reportingApp)
{
	let provider = new oFF.SxDataProvider();
	provider.setupDp(reportingApp);
	return provider;
};
oFF.SxDataProvider.prototype.m_dataProviderName = null;
oFF.SxDataProvider.prototype.m_dataSource = null;
oFF.SxDataProvider.prototype.m_globalDef = null;
oFF.SxDataProvider.prototype.m_quasar = null;
oFF.SxDataProvider.prototype.m_queryDef = null;
oFF.SxDataProvider.prototype.m_serviceConfig = null;
oFF.SxDataProvider.prototype.m_system = null;
oFF.SxDataProvider.prototype.m_vizDef = null;
oFF.SxDataProvider.prototype.getComponentType = function()
{
	return null;
};
oFF.SxDataProvider.prototype.getName = function()
{
	return this.m_dataProviderName;
};
oFF.SxDataProvider.prototype.processInit = function()
{
	this.m_serviceConfig = oFF.QueryServiceConfig.create(this.m_quasar.getApplication());
	this.m_serviceConfig.setName(this.m_dataProviderName);
	this.m_serviceConfig.setUseAsDataProvider(true);
	if (oFF.notNull(this.m_system))
	{
		this.m_serviceConfig.setSystemName(this.m_system);
	}
	else
	{
		this.m_serviceConfig.setSystemName(this.m_quasar.getMasterSystemName());
	}
	this.m_serviceConfig.setDataSourceByName(this.m_dataSource);
	let uqm = oFF.PrFactory.createStructure();
	if (oFF.notNull(this.m_vizDef))
	{
		uqm.put(oFF.UiQuasarConstants.QSA_VIZ_DEF, this.m_vizDef);
	}
	if (oFF.notNull(this.m_globalDef))
	{
		uqm.put(oFF.UiQuasarConstants.QSA_GLOBAL_DEF, this.m_globalDef);
	}
	if (oFF.notNull(this.m_queryDef))
	{
		uqm.putString(oFF.UiQuasarConstants.QSA_FF_QUERY, this.m_queryDef);
	}
	this.m_serviceConfig.setDefinitionByStructure(oFF.QModelFormat.UQM, uqm);
};
oFF.SxDataProvider.prototype.releaseObject = function()
{
	this.m_serviceConfig = oFF.XObjectExt.release(this.m_serviceConfig);
	this.m_quasar = null;
	oFF.XComponent.prototype.releaseObject.call( this );
};
oFF.SxDataProvider.prototype.setDataSource = function(dataSource)
{
	this.m_dataSource = dataSource;
};
oFF.SxDataProvider.prototype.setGlobalDef = function(globalDef)
{
	this.m_globalDef = globalDef;
};
oFF.SxDataProvider.prototype.setName = function(name)
{
	this.m_dataProviderName = name;
};
oFF.SxDataProvider.prototype.setQueryDefinition = function(queryDef)
{
	this.m_queryDef = queryDef;
};
oFF.SxDataProvider.prototype.setSystem = function(system)
{
	this.m_system = system;
};
oFF.SxDataProvider.prototype.setVizDef = function(vizDef)
{
	this.m_vizDef = vizDef;
};
oFF.SxDataProvider.prototype.setupDp = function(reportingApp)
{
	this.setup();
	this.m_quasar = reportingApp;
};

oFF.QsOlapDp = function() {};
oFF.QsOlapDp.prototype = new oFF.XComponent();
oFF.QsOlapDp.prototype._ff_c = "QsOlapDp";

oFF.QsOlapDp.create = function(reportingApp, definition)
{
	let provider = new oFF.QsOlapDp();
	provider.setupDp(reportingApp, definition);
	return provider;
};
oFF.QsOlapDp.prototype.m_dataProviderName = null;
oFF.QsOlapDp.prototype.m_dataSource = null;
oFF.QsOlapDp.prototype.m_globalDef = null;
oFF.QsOlapDp.prototype.m_globalObjects = null;
oFF.QsOlapDp.prototype.m_modelFormat = null;
oFF.QsOlapDp.prototype.m_quasar = null;
oFF.QsOlapDp.prototype.m_queryDef = null;
oFF.QsOlapDp.prototype.m_queryDocument = null;
oFF.QsOlapDp.prototype.m_queryMode = null;
oFF.QsOlapDp.prototype.m_serviceConfig = null;
oFF.QsOlapDp.prototype.m_system = null;
oFF.QsOlapDp.prototype.m_tagging = null;
oFF.QsOlapDp.prototype.m_variables = null;
oFF.QsOlapDp.prototype.m_vizDef = null;
oFF.QsOlapDp.prototype.getComponentType = function()
{
	return null;
};
oFF.QsOlapDp.prototype.getDataProviderName = function()
{
	return this.getName();
};
oFF.QsOlapDp.prototype.getName = function()
{
	return this.m_dataProviderName;
};
oFF.QsOlapDp.prototype.getTagging = function()
{
	return this.m_tagging;
};
oFF.QsOlapDp.prototype.getVariables = function()
{
	return this.m_variables;
};
oFF.QsOlapDp.prototype.processInit = function()
{
	this.m_serviceConfig = oFF.QueryServiceConfig.create(this.m_quasar.getApplication());
	this.m_serviceConfig.setName(this.m_dataProviderName);
	this.m_serviceConfig.setUseAsDataProvider(true);
	if (oFF.notNull(this.m_system))
	{
		this.m_serviceConfig.setSystemName(this.m_system);
	}
	else
	{
		this.m_serviceConfig.setSystemName(this.m_quasar.getMasterSystemName());
	}
	if (oFF.notNull(this.m_dataSource))
	{
		this.m_serviceConfig.setDataSourceByName(this.m_dataSource);
	}
	if (this.m_modelFormat === oFF.QModelFormat.UQM)
	{
		let uqm = oFF.PrFactory.createStructure();
		if (oFF.notNull(this.m_vizDef))
		{
			uqm.put(oFF.UiQuasarConstants.QSA_VIZ_DEF, this.m_vizDef);
		}
		if (oFF.notNull(this.m_globalDef))
		{
			uqm.put(oFF.UiQuasarConstants.QSA_GLOBAL_DEF, this.m_globalDef);
		}
		if (oFF.notNull(this.m_globalObjects))
		{
			let globalKeys = this.m_globalObjects.getKeysAsReadOnlyList();
			let globalStructure = uqm.putNewStructure(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS);
			for (let i = 0; i < globalKeys.size(); i++)
			{
				let key = globalKeys.get(i);
				globalStructure.put(key, this.m_globalObjects.getByKey(key).getContent());
			}
		}
		uqm.putStringNotNullAndNotEmpty("dpName", this.getName());
		if (oFF.notNull(this.m_queryDef))
		{
			uqm.putString(oFF.UiQuasarConstants.QSA_FF_QUERY, this.m_queryDef);
		}
		if (oFF.notNull(this.m_variables))
		{
			uqm.put(oFF.UiQuasarConstants.VARIABLES, this.m_variables);
		}
		this.m_serviceConfig.setDefinitionByStructure(oFF.QModelFormat.UQM, uqm);
	}
	else if (oFF.notNull(this.m_modelFormat))
	{
		this.m_serviceConfig.setDefinitionByStructure(this.m_modelFormat, this.m_queryDocument);
	}
	this.m_serviceConfig.setMode(this.m_queryMode);
};
oFF.QsOlapDp.prototype.reinit = function()
{
	let queryManager = this.m_serviceConfig.getQueryManager();
	let queryModel = queryManager.getQueryModel();
	if (oFF.notNull(queryModel))
	{
		queryModel.stopEventing();
		queryManager.resetPreparation();
		let vizManager = queryModel.getVizManager();
		let vizDefinitions = vizManager.getVizDefinitions();
		vizDefinitions.clear();
		vizDefinitions.stopEventing();
		queryModel.resumeEventing();
		if (vizDefinitions.isEventingStopped())
		{
			vizDefinitions.resumeEventing();
		}
		if (vizManager.isEventingStopped())
		{
			vizManager.resumeEventing();
		}
		vizDefinitions._notifyNodeChanged();
	}
};
oFF.QsOlapDp.prototype.releaseObject = function()
{
	this.m_serviceConfig = oFF.XObjectExt.release(this.m_serviceConfig);
	this.m_quasar = null;
	oFF.XComponent.prototype.releaseObject.call( this );
};
oFF.QsOlapDp.prototype.setDataProviderName = function(name)
{
	this.setName(name);
};
oFF.QsOlapDp.prototype.setDataSource = function(dataSource)
{
	this.m_dataSource = dataSource;
};
oFF.QsOlapDp.prototype.setGlobalDef = function(globalDef)
{
	this.m_globalDef = globalDef;
};
oFF.QsOlapDp.prototype.setGlobalObjects = function(globalObjects)
{
	this.m_globalObjects = globalObjects;
};
oFF.QsOlapDp.prototype.setName = function(name)
{
	this.m_dataProviderName = name;
};
oFF.QsOlapDp.prototype.setQueryDefinition = function(queryDef, modelFormat)
{
	this.m_queryDef = queryDef;
	this.m_modelFormat = modelFormat;
};
oFF.QsOlapDp.prototype.setQueryDocument = function(queryDocument, modelFormat)
{
	this.m_queryDocument = queryDocument;
	this.m_modelFormat = modelFormat;
};
oFF.QsOlapDp.prototype.setSystem = function(system)
{
	this.m_system = system;
};
oFF.QsOlapDp.prototype.setVariables = function(variables)
{
	this.m_variables = variables;
};
oFF.QsOlapDp.prototype.setVizDef = function(vizDef)
{
	this.m_vizDef = vizDef;
};
oFF.QsOlapDp.prototype.setupDp = function(reportingApp, definition)
{
	this.setup();
	this.m_quasar = reportingApp;
	this.m_tagging = oFF.XHashMapByString.create();
	let dataSource = definition.getStringByKey(oFF.UiQuasarConstants.QSA_DATA_SOURCE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataSource))
	{
		this.setDataSource(dataSource);
	}
	let name = definition.getStringByKey(oFF.UiQuasarConstants.QSA_NAME);
	this.setName(name);
	let system = definition.getStringByKey(oFF.UiQuasarConstants.QSA_SYSTEM);
	if (oFF.notNull(system))
	{
		this.setSystem(system);
	}
	let modelFormatValue = definition.getStringByKey("ModelFormat");
	let modelFormat = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(modelFormatValue))
	{
		modelFormat = oFF.ContentType.lookup(modelFormatValue);
	}
	let vizDef = definition.getStructureByKey(oFF.UiQuasarConstants.QSA_VIZ_DEF);
	if (oFF.isNull(modelFormat))
	{
		if (oFF.notNull(vizDef))
		{
			modelFormat = oFF.QModelFormat.UQM;
		}
	}
	if (modelFormat === oFF.QModelFormat.UQM)
	{
		this.setVizDef(vizDef);
		let variables = definition.getListByKey(oFF.UiQuasarConstants.VARIABLES);
		this.setVariables(variables);
		let globalDef = definition.getStructureByKey(oFF.UiQuasarConstants.QSA_GLOBAL_DEF);
		let globalDefs = definition.getStructureByKey(oFF.UiQuasarConstants.QSA_GLOBAL_DEFS);
		if (oFF.isNull(globalDef) && oFF.notNull(globalDefs))
		{
			globalDef = globalDefs;
		}
		this.setGlobalDef(globalDef);
		let ffQuery = definition.getStringByKey(oFF.UiQuasarConstants.QSA_FF_QUERY);
		if (oFF.notNull(ffQuery))
		{
			this.setQueryDefinition(ffQuery, oFF.QModelFormat.UQM);
		}
		this.m_queryMode = oFF.QueryManagerMode.DEFAULT;
	}
	else if (oFF.notNull(modelFormat))
	{
		let document = definition.getStructureByKey("QueryDocument");
		this.setQueryDocument(document, modelFormat);
		if (modelFormat.isTypeOf(oFF.QModelFormat.INA_DATA))
		{
			this.m_queryMode = oFF.QueryManagerMode.RAW_QUERY;
		}
	}
	this.m_modelFormat = modelFormat;
};

oFF.QsRestDp = function() {};
oFF.QsRestDp.prototype = new oFF.SxRestDp();
oFF.QsRestDp.prototype._ff_c = "QsRestDp";

oFF.QsRestDp.create = function(reportingApp, definition)
{
	let provider = new oFF.QsRestDp();
	provider.setupDp(reportingApp, definition);
	return provider;
};
oFF.QsRestDp.prototype.m_quasar = null;
oFF.QsRestDp.prototype.getName = function()
{
	return this.getDataProviderName();
};
oFF.QsRestDp.prototype.processInit = function()
{
	this.updateData();
};
oFF.QsRestDp.prototype.releaseObject = function()
{
	this.m_quasar = null;
	oFF.SxRestDp.prototype.releaseObject.call( this );
};
oFF.QsRestDp.prototype.setGlobalObjects = function(globalObjects) {};
oFF.QsRestDp.prototype.setName = function(name)
{
	this.setDataProviderName(name);
};
oFF.QsRestDp.prototype.setupDp = function(reportingApp, definition)
{
	this.m_quasar = reportingApp;
	let name = definition.getStringByKey(oFF.UiQuasarConstants.QSA_NAME);
	let endpointUrl = definition.getStringByKey(oFF.UiQuasarConstants.QSA_ENDPOINT);
	this.setupExt(name, endpointUrl, this.m_quasar.getApplication());
};

oFF.CustomCalcVarWidget = function() {};
oFF.CustomCalcVarWidget.prototype = new oFF.CustomAbstractWidget();
oFF.CustomCalcVarWidget.prototype._ff_c = "CustomCalcVarWidget";

oFF.CustomCalcVarWidget.prototype.getGlobalId = function()
{
	return oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_CALCULATION_VARIABLES;
};

oFF.CustomFieldSelectionWidget = function() {};
oFF.CustomFieldSelectionWidget.prototype = new oFF.CustomAbstractWidget();
oFF.CustomFieldSelectionWidget.prototype._ff_c = "CustomFieldSelectionWidget";

oFF.CustomFieldSelectionWidget.prototype.getGlobalId = function()
{
	return oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_FIELD_SELECTIONS;
};

oFF.CustomPageFilterWidget = function() {};
oFF.CustomPageFilterWidget.prototype = new oFF.CustomAbstractWidget();
oFF.CustomPageFilterWidget.prototype._ff_c = "CustomPageFilterWidget";

oFF.CustomPageFilterWidget.prototype.getGlobalId = function()
{
	return oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_PAGE_FILTERS;
};

oFF.QuasarEngine = function() {};
oFF.QuasarEngine.prototype = new oFF.DfApplicationContext();
oFF.QuasarEngine.prototype._ff_c = "QuasarEngine";

oFF.QuasarEngine.DOC_RENDER_TEXT = "Loading document...";
oFF.QuasarEngine.create = function(application)
{
	let newObj = new oFF.QuasarEngine();
	newObj.setupEngine(application);
	return newObj;
};
oFF.QuasarEngine.createEmbedded = function(application, nativeParentId, nativeParentObject, nativeJson)
{
	let newObj = oFF.QuasarEngine.create(application);
	newObj.setDocumentByNativeJson(nativeJson);
	newObj.setNativeParent(nativeParentId, nativeParentObject);
	let uiManager = application.getUiManager();
	if (oFF.notNull(uiManager))
	{
		uiManager.invokeOnEventingThread(newObj);
	}
	return newObj;
};
oFF.QuasarEngine.prototype.m_anchorGuid = null;
oFF.QuasarEngine.prototype.m_bindings = null;
oFF.QuasarEngine.prototype.m_customLoadingText = null;
oFF.QuasarEngine.prototype.m_dataProviders = null;
oFF.QuasarEngine.prototype.m_document = null;
oFF.QuasarEngine.prototype.m_file = null;
oFF.QuasarEngine.prototype.m_fileLoadedListener = null;
oFF.QuasarEngine.prototype.m_genesis = null;
oFF.QuasarEngine.prototype.m_globalLookupObjects = null;
oFF.QuasarEngine.prototype.m_globalStyleClass = null;
oFF.QuasarEngine.prototype.m_masterSystemName = null;
oFF.QuasarEngine.prototype.m_messages = null;
oFF.QuasarEngine.prototype.m_nativeAnchorId = null;
oFF.QuasarEngine.prototype.m_nativeAnchorObject = null;
oFF.QuasarEngine.prototype.m_quasarMode = null;
oFF.QuasarEngine.prototype.m_recursiveExtend = false;
oFF.QuasarEngine.prototype.m_renderFinishedProcedure = null;
oFF.QuasarEngine.prototype.m_uiManager = null;
oFF.QuasarEngine.prototype.afterScriptExecution = function(interpreter) {};
oFF.QuasarEngine.prototype.beforeScriptExecution = function(interpreter) {};
oFF.QuasarEngine.prototype.bindGlobalObjects = function()
{
	let keys = this.m_globalLookupObjects.getKeysAsReadOnlyList();
	for (let i = 0; i < keys.size(); i++)
	{
		this.m_globalLookupObjects.getByKey(keys.get(i)).setupDpsAndBindings(this.m_dataProviders, this.m_bindings);
	}
};
oFF.QuasarEngine.prototype.clearBindings = function()
{
	if (oFF.notNull(this.m_bindings))
	{
		for (let j = 0; j < this.m_bindings.size(); j++)
		{
			let binding = this.m_bindings.get(j);
			oFF.XObjectExt.release(binding);
		}
		this.m_bindings.clear();
	}
	if (oFF.notNull(this.m_dataProviders))
	{
		for (let i = 0; i < this.m_dataProviders.size(); i++)
		{
			let dataProvider = this.m_dataProviders.get(i);
			oFF.XObjectExt.release(dataProvider);
		}
		this.m_dataProviders.clear();
	}
};
oFF.QuasarEngine.prototype.doExecute = function()
{
	this.m_uiManager = this.getApplication().getUiManager();
	this.initializeUi(this.m_uiManager);
};
oFF.QuasarEngine.prototype.fillParameters = function(stack, parameterCount)
{
	let parameters = oFF.PrFactory.createList();
	let offset = stack.size() - parameterCount;
	let stackObj;
	let entry;
	let valueType;
	for (let i = 0; i < parameterCount; i++)
	{
		stackObj = stack.get(offset + i);
		if (oFF.notNull(stackObj))
		{
			entry = stackObj;
			valueType = entry.getComponentType();
			if (valueType === oFF.XValueType.STRING)
			{
				parameters.addString(entry.toString());
			}
			else if (valueType === oFF.XValueType.BOOLEAN)
			{
				parameters.addBoolean(entry.getBoolean());
			}
			else if (valueType === oFF.XValueType.INTEGER)
			{
				parameters.addInteger(entry.getInteger());
			}
			else if (valueType.isTypeOf(oFF.XComponentType._UI))
			{
				parameters.addString(entry.toString());
			}
		}
		else
		{
			parameters.add(null);
		}
	}
	return parameters;
};
oFF.QuasarEngine.prototype.getDocument = function()
{
	return this.m_document;
};
oFF.QuasarEngine.prototype.getDocumentLoadingText = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_customLoadingText))
	{
		return this.m_customLoadingText;
	}
	return oFF.QuasarEngine.DOC_RENDER_TEXT;
};
oFF.QuasarEngine.prototype.getLogSeverity = function()
{
	return oFF.DfApplicationContext.prototype.getLogSeverity.call( this );
};
oFF.QuasarEngine.prototype.getMasterSystemName = function()
{
	return this.m_masterSystemName;
};
oFF.QuasarEngine.prototype.initBindings = function()
{
	for (let j = 0; j < this.m_bindings.size(); j++)
	{
		let binding = this.m_bindings.get(j);
		binding.processInit();
	}
};
oFF.QuasarEngine.prototype.initDataProviders = function()
{
	for (let i = 0; i < this.m_dataProviders.size(); i++)
	{
		let dataProvider = this.m_dataProviders.get(i);
		dataProvider.processInit();
	}
};
oFF.QuasarEngine.prototype.initializeUi = function(uiManager)
{
	if (oFF.notNull(this.m_nativeAnchorId) || oFF.notNull(this.m_nativeAnchorObject))
	{
		this.m_anchorGuid = oFF.XGuid.getGuid();
		this.m_uiManager.registerNativeAnchor(this.m_anchorGuid, this.m_nativeAnchorId, this.m_nativeAnchorObject);
	}
	let root;
	if (oFF.notNull(this.m_anchorGuid))
	{
		root = this.m_uiManager.getAnchorByName(this.m_anchorGuid);
	}
	else
	{
		root = this.m_uiManager.getAnchor();
	}
	let genesis = oFF.UiGenesis.create(root);
	this.renderUi(genesis);
};
oFF.QuasarEngine.prototype.isPlatformSupported = function(docElement)
{
	let docSupportedPlatformsStr = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_SUPPORTED_PLATFORMS);
	let supportedPlatformsListStrs = oFF.XStringTokenizer.splitString(docSupportedPlatformsStr, ",");
	let uiManager = this.m_genesis.getUiManager();
	if (oFF.notNull(supportedPlatformsListStrs) && oFF.notNull(uiManager))
	{
		let activePlatform = uiManager.getPlatform();
		let platformStrIterator = supportedPlatformsListStrs.getIterator();
		while (platformStrIterator.hasNext())
		{
			let tmpPlatformStr = platformStrIterator.next();
			let tmpPlatform = oFF.XPlatform.lookup(tmpPlatformStr);
			if (oFF.notNull(tmpPlatform) && activePlatform.isTypeOf(tmpPlatform) === true)
			{
				return true;
			}
		}
		return false;
	}
	return true;
};
oFF.QuasarEngine.prototype.loadDocumentFromFile = function(file)
{
	if (oFF.notNull(file) && oFF.notNull(this.m_genesis))
	{
		if (file.isExisting())
		{
			file.processLoad(oFF.SyncType.NON_BLOCKING, this, null, oFF.CompressionType.NONE);
		}
		else
		{
			this.m_messages.addError(0, oFF.XStringUtils.concatenate2("File does not exist: ", file.getNativePath()));
		}
	}
	return null;
};
oFF.QuasarEngine.prototype.nativeCall = function(interpreter, name, registerObj, stack, parameterCount)
{
	let parameters = this.fillParameters(stack, parameterCount);
	if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_DOLLAR, name))
	{
		let sigSel = parameters.getStringAtExt(0, null);
		let select = this.m_genesis.getUiManager().select(sigSel);
		return select;
	}
	else if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_DOLLAR_D, name))
	{
		let sigSel2 = parameters.getStringAtExt(0, null);
		let olapApplication = this.getApplication().getOlapEnvironment();
		let commands = olapApplication.select(sigSel2);
		return commands;
	}
	else
	{
		let component = registerObj;
		if (oFF.isNull(component))
		{
			component = interpreter.getCustomObject("uicontext");
		}
		if (oFF.isNull(component))
		{
			component = interpreter.getCustomObject("dpcontext");
		}
		let componentType = component.getComponentType();
		if (oFF.notNull(componentType))
		{
			if (componentType.isTypeOf(oFF.XComponentType._UI))
			{
				let uiContext = component;
				let operation = oFF.UiAllOperations.lookupOp(name);
				if (oFF.notNull(operation))
				{
					return operation.executeOperation(null, uiContext, parameters, 0);
				}
			}
			else if (componentType.isTypeOf(oFF.OlapComponentType.CONVENIENCE_CMDS))
			{
				let dpContext = component;
				let dpCmd = oFF.QFactory.createReflectionCommand(name, null, null, null);
				if (oFF.notNull(dpCmd))
				{
					let retObj = dpCmd.executeOnContext(dpContext, parameters);
					return retObj;
				}
			}
		}
		return null;
	}
};
oFF.QuasarEngine.prototype.onAfterClose = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_AFTER_CLOSE);
};
oFF.QuasarEngine.prototype.onAfterOpen = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_AFTER_OPEN);
};
oFF.QuasarEngine.prototype.onAfterRender = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_AFTER_RENDER);
};
oFF.QuasarEngine.prototype.onBack = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_BACK);
};
oFF.QuasarEngine.prototype.onBeforeClose = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_BEFORE_CLOSE);
};
oFF.QuasarEngine.prototype.onBeforeOpen = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_BEFORE_OPEN);
};
oFF.QuasarEngine.prototype.onBeforePageChanged = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_BEFORE_PAGE_CHANGED);
};
oFF.QuasarEngine.prototype.onButtonPress = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_BUTTON_PRESS);
};
oFF.QuasarEngine.prototype.onChange = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CHANGE);
};
oFF.QuasarEngine.prototype.onChipUpdate = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CHIP_UPDATE);
};
oFF.QuasarEngine.prototype.onClick = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CLICK);
};
oFF.QuasarEngine.prototype.onClose = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CLOSE);
};
oFF.QuasarEngine.prototype.onCollapse = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_COLLAPSE);
};
oFF.QuasarEngine.prototype.onColorSelect = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_COLOR_SELECT);
};
oFF.QuasarEngine.prototype.onColumnResize = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_COLUMN_RESIZE);
};
oFF.QuasarEngine.prototype.onContextMenu = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CONTEXT_MENU);
};
oFF.QuasarEngine.prototype.onCursorChange = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_CURSOR_CHANGE);
};
oFF.QuasarEngine.prototype.onDelete = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DELETE);
};
oFF.QuasarEngine.prototype.onDeselect = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DESELECT);
};
oFF.QuasarEngine.prototype.onDetailPress = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DETAIL_PRESS);
};
oFF.QuasarEngine.prototype.onDoubleClick = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DOUBLE_CLICK);
};
oFF.QuasarEngine.prototype.onDragEnd = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DRAG_END);
};
oFF.QuasarEngine.prototype.onDragEnter = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DRAG_ENTER);
};
oFF.QuasarEngine.prototype.onDragOver = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DRAG_OVER);
};
oFF.QuasarEngine.prototype.onDragStart = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DRAG_START);
};
oFF.QuasarEngine.prototype.onDrop = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_DROP);
};
oFF.QuasarEngine.prototype.onEditingBegin = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_EDITING_BEGIN);
};
oFF.QuasarEngine.prototype.onEditingEnd = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_EDITING_END);
};
oFF.QuasarEngine.prototype.onEnter = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ENTER);
};
oFF.QuasarEngine.prototype.onError = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ERROR);
};
oFF.QuasarEngine.prototype.onEscape = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ESCAPE);
};
oFF.QuasarEngine.prototype.onExecute = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_EXECUTE);
};
oFF.QuasarEngine.prototype.onExpand = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_EXPAND);
};
oFF.QuasarEngine.prototype.onFileDrop = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_FILE_DROP);
};
oFF.QuasarEngine.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	if (oFF.notNull(this.m_fileLoadedListener))
	{
		this.m_fileLoadedListener.onFileLoaded(extResult, file, fileContent, customIdentifier);
	}
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent))
		{
			let stringContent = fileContent.getString();
			let aEnv = this.getSession().getEnvironment();
			let aVars = this.getSession().getEnvironment().getVariableNames();
			for (let aIndex = 0; aIndex < aVars.size(); ++aIndex)
			{
				let aName = aVars.get(aIndex);
				let aValue = aEnv.getVariable(aName);
				let aReplName = oFF.XStringUtils.concatenate3("${", aName, "}");
				stringContent = oFF.XString.replace(stringContent, aReplName, aValue);
			}
			let parser = oFF.JsonParserFactory.newInstance();
			let proxyContent = parser.parse(stringContent);
			if (parser.isValid() && oFF.notNull(proxyContent))
			{
				let jsonContent = proxyContent;
				if (jsonContent.isProxy())
				{
					jsonContent = jsonContent.clone();
				}
				oFF.XObjectExt.release(parser);
				if (oFF.notNull(jsonContent) && jsonContent.isStructure())
				{
					if (this.m_recursiveExtend)
					{
						let parent = this.m_file.getParent();
						if (oFF.notNull(parent))
						{
							jsonContent = this.recursiveExtend(parent, jsonContent);
						}
					}
					this.setDocument(jsonContent);
					this.renderDocument();
				}
			}
			else
			{
				let description = null;
				if (parser.hasErrors())
				{
					this.m_messages.copyAllMessages(parser);
					description = parser.getFirstError().getText();
				}
				this.showErrorMessage("Failed to parse quasar document!", description);
				oFF.XObjectExt.release(parser);
			}
		}
		else
		{
			this.showErrorMessage("Something went wrong! File content is empty!", extResult.getSummary());
		}
	}
	else
	{
		this.showErrorMessage("Error while fetching the specified file!", extResult.getFirstError().getText());
	}
};
oFF.QuasarEngine.prototype.onHover = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_HOVER);
};
oFF.QuasarEngine.prototype.onHoverEnd = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_HOVER_END);
};
oFF.QuasarEngine.prototype.onItemClose = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ITEM_CLOSE);
};
oFF.QuasarEngine.prototype.onItemDelete = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ITEM_DELETE);
};
oFF.QuasarEngine.prototype.onItemPress = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ITEM_PRESS);
};
oFF.QuasarEngine.prototype.onItemSelect = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ITEM_SELECT);
};
oFF.QuasarEngine.prototype.onKeyDown = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_KEY_DOWN);
};
oFF.QuasarEngine.prototype.onKeyUp = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_KEY_UP);
};
oFF.QuasarEngine.prototype.onLiveChange = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_LIVE_CHANGE);
};
oFF.QuasarEngine.prototype.onLoadFinished = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_LOAD_FINISHED);
};
oFF.QuasarEngine.prototype.onMenuPress = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_MENU_PRESS);
};
oFF.QuasarEngine.prototype.onMove = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_MOVE);
};
oFF.QuasarEngine.prototype.onMoveEnd = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_MOVE_END);
};
oFF.QuasarEngine.prototype.onMoveStart = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_MOVE_START);
};
oFF.QuasarEngine.prototype.onOpen = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_OPEN);
};
oFF.QuasarEngine.prototype.onPageChanged = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_PAGE_CHANGED);
};
oFF.QuasarEngine.prototype.onPaste = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_PASTE);
};
oFF.QuasarEngine.prototype.onPress = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_PRESS);
};
oFF.QuasarEngine.prototype.onReadLineFinished = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_READ_LINE_FINISHED);
};
oFF.QuasarEngine.prototype.onRefresh = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_REFRESH);
};
oFF.QuasarEngine.prototype.onResize = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_RESIZE);
};
oFF.QuasarEngine.prototype.onRowResize = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_ROW_RESIZE);
};
oFF.QuasarEngine.prototype.onScroll = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SCROLL);
};
oFF.QuasarEngine.prototype.onScrollLoad = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SCROLL_LOAD);
};
oFF.QuasarEngine.prototype.onSearch = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SEARCH);
};
oFF.QuasarEngine.prototype.onSelect = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SELECT);
};
oFF.QuasarEngine.prototype.onSelectionChange = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SELECTION_CHANGE);
};
oFF.QuasarEngine.prototype.onSelectionFinish = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SELECTION_FINISH);
};
oFF.QuasarEngine.prototype.onSuggestionSelect = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_SUGGESTION_SELECT);
};
oFF.QuasarEngine.prototype.onTableDragAndDrop = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_TABLE_DRAG_AND_DROP);
};
oFF.QuasarEngine.prototype.onTerminate = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_TERMINATE);
};
oFF.QuasarEngine.prototype.onToggle = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_TOGGLE);
};
oFF.QuasarEngine.prototype.onValueHelpRequest = function(event)
{
	this.sendEventWithName(event, oFF.UiEvent.ON_VALUE_HELP_REQUEST);
};
oFF.QuasarEngine.prototype.parseBinding = function(docElement, isNeo)
{
	let binding = oFF.SxBinding.create(this, isNeo);
	let cacheId = null;
	if (docElement.isStructure())
	{
		let bindingStructure = docElement;
		cacheId = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_CACHE_ID);
		if (oFF.XStringUtils.isNullOrEmpty(cacheId))
		{
			let cacheIdentifier1 = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_SOURCE);
			let cacheIdentifier2 = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_TYPE);
			cacheId = oFF.XStringUtils.concatenate2(cacheIdentifier1, cacheIdentifier2);
		}
		binding.setCacheIdentifier(cacheId);
		let source = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_SOURCE);
		binding.setSource(source);
		let target = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_TARGET);
		if (oFF.notNull(target))
		{
			binding.setTarget(target);
		}
		let bindingType = bindingStructure.getStringByKey(oFF.UiQuasarConstants.QSA_TYPE);
		if (oFF.notNull(bindingType))
		{
			let dataBindingType = oFF.SemanticBindingType.lookup(bindingType);
			binding.setType(dataBindingType);
		}
	}
	else if (docElement.isString())
	{
		let bindingString = docElement;
		let source2 = bindingString.getString();
		binding.setSource(source2);
		cacheId = source2;
	}
	if (oFF.notNull(cacheId))
	{
		cacheId = this.replaceAllNonAlphaNum(cacheId);
		binding.setCacheIdentifier(cacheId);
	}
	return binding;
};
oFF.QuasarEngine.prototype.parseBindings = function(bindings)
{
	for (let i = 0; i < bindings.size(); i++)
	{
		let docBinding = bindings.get(i);
		let binding = this.parseBinding(docBinding, false);
		this.m_bindings.add(binding);
	}
};
oFF.QuasarEngine.prototype.parseControl = function(docElement, itemUiType)
{
	if (this.isPlatformSupported(docElement) === false)
	{
		let controlName = docElement.getStringByKey(oFF.UiProperty.NAME.getName());
		if (oFF.XStringUtils.isNullOrEmpty(controlName))
		{
			this.log2("Current platform for the document element is not supported. Supported platforms: ", docElement.getStringByKey(oFF.UiQuasarConstants.QSA_SUPPORTED_PLATFORMS));
		}
		else
		{
			this.log4("Current platform for the document element with name ", controlName, " is not supported. Supported platforms: ", docElement.getStringByKey(oFF.UiQuasarConstants.QSA_SUPPORTED_PLATFORMS));
		}
		return null;
	}
	let uiType = oFF.UiType.lookupUiType(docElement.getStringByKey(oFF.UiQuasarConstants.QSA_CTYPE));
	if (oFF.isNull(uiType))
	{
		uiType = itemUiType;
	}
	let customControlString = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_CUSTOM_CONTROL);
	let styleClass = oFF.UiStyleClass.lookup(docElement.getStringByKey(oFF.UiQuasarConstants.QSA_STYLE));
	if (oFF.isNull(styleClass) && oFF.notNull(this.m_globalStyleClass))
	{
		styleClass = this.m_globalStyleClass;
	}
	let theId = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_ID);
	let uiInnerContent = null;
	if (oFF.notNull(uiType))
	{
		uiInnerContent = this.m_genesis.newControlExt(uiType, theId, styleClass);
		if (oFF.isNull(uiInnerContent))
		{
			this.printQuasarParsingError(oFF.XStringUtils.concatenate2("Failed to create control with type: ", uiType.getName()));
			return null;
		}
		uiInnerContent.setName(docElement.getStringByKey(oFF.UiQuasarConstants.QSA_NAME));
		uiInnerContent.setCustomObject(docElement);
		let keys = docElement.getKeysAsReadOnlyList();
		let dp = null;
		let binding = null;
		let listenerAggregation = this;
		let scriptListener = oFF.SxEventScriptingDp.createListener(this.m_genesis.getUiManager(), this.getApplication().getOlapEnvironment());
		listenerAggregation = scriptListener;
		for (let i = 0; i < keys.size(); i++)
		{
			let key = keys.get(i);
			if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_ID, key) === false)
			{
				if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_DATA_PROVIDER, key))
				{
					let docDp = docElement.getStructureByKey(key);
					dp = this.parseDataprovider(docDp);
				}
				else if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_BINDING, key))
				{
					let docBinding = docElement.getByKey(key);
					binding = this.parseBinding(docBinding, false);
					this.m_bindings.add(binding);
				}
				else if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_BINDINGS, key))
				{
					let multiplyBindings = docElement.getListByKey(key);
					for (let a = 0; a < multiplyBindings.size(); a++)
					{
						let docBinding2 = multiplyBindings.get(a);
						let tmpBinding = this.parseBinding(docBinding2, false);
						tmpBinding.setControl(uiInnerContent);
						this.m_bindings.add(tmpBinding);
					}
				}
				else if (oFF.UiEvent.lookup(key) !== null)
				{
					let tmpEventdef = oFF.UiEvent.lookup(key);
					if (oFF.notNull(tmpEventdef))
					{
						let registerListenerOp = new oFF.UiClientOpRegisterEventListener();
						registerListenerOp.executeRegisterListener(uiInnerContent, tmpEventdef, listenerAggregation);
					}
				}
				else if (oFF.UiAllOperations.lookupSetterProperty(key) !== null)
				{
					let value = oFF.UiUtils.getElementAsString(docElement, key);
					oFF.UiUtils.setPropertyStringValue(uiInnerContent, key, value);
				}
				else if (oFF.UiAggregation.lookup(key) !== null)
				{
					let tmpAggrDef = oFF.UiAggregation.lookup(key);
					if (uiInnerContent.hasAggregation(tmpAggrDef))
					{
						let addAgrOp = tmpAggrDef.getAddOp();
						let aggregationItems = docElement.getListByKey(key);
						if (oFF.notNull(aggregationItems) && aggregationItems.size() > 0)
						{
							let agrItemType = tmpAggrDef.getItemType();
							let isItemsAggr = tmpAggrDef === oFF.UiAggregation.ITEMS;
							if (isItemsAggr && oFF.isNull(agrItemType))
							{
								agrItemType = uiInnerContent.getDefaultItemType();
							}
							for (let m = 0; m < aggregationItems.size(); m++)
							{
								let docItem4 = aggregationItems.getStructureAt(m);
								let retContext0 = this.parseControl(docItem4, agrItemType);
								if (oFF.notNull(retContext0))
								{
									addAgrOp.executeAddIntoAggregation(uiInnerContent, retContext0);
								}
							}
							if (isItemsAggr)
							{
								let selectedName = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_SELECTED_NAME);
								if (oFF.notNull(selectedName) && aggregationItems.size() > 0)
								{
									uiInnerContent.setSelectedName(selectedName);
								}
							}
						}
					}
					else
					{
						this.printQuasarParsingError(oFF.XStringUtils.concatenate4("The control type ", uiInnerContent.getUiType().getName(), " does not have an aggregation with name ", key));
					}
				}
			}
		}
		let theContent = docElement.getStructureByKey(oFF.UiProperty.CONTENT.getName());
		if (oFF.notNull(theContent))
		{
			let retContext8 = this.parseDocument(theContent, null);
			uiInnerContent.setContent(retContext8);
		}
		let theFooter = docElement.getStructureByKey(oFF.UiProperty.FOOTER.getName());
		if (oFF.notNull(theFooter))
		{
			let retContextFooter = this.parseDocument(theFooter, null);
			uiInnerContent.setFooter(retContextFooter);
		}
		let theSubHeader = docElement.getStructureByKey(oFF.UiProperty.SUB_HEADER.getName());
		if (oFF.notNull(theSubHeader))
		{
			let retContextSubHeader = this.parseDocument(theSubHeader, null);
			uiInnerContent.setSubHeader(retContextSubHeader);
		}
		let theHeader = docElement.getStructureByKey(oFF.UiProperty.HEADER.getName());
		if (oFF.notNull(theHeader))
		{
			let retContextHeader = this.parseDocument(theHeader, null);
			uiInnerContent.setHeader(retContextHeader);
		}
		let theMenuStruct = docElement.getStructureByKey(oFF.UiProperty.MENU.getName());
		if (oFF.notNull(theMenuStruct))
		{
			let retContextMenu = this.parseDocument(theMenuStruct, null);
			uiInnerContent.setMenu(retContextMenu);
		}
		let theNavList = docElement.getStructureByKey(oFF.UiProperty.NAV_LIST.getName());
		if (oFF.notNull(theNavList))
		{
			let retContextNavList = this.parseDocument(theNavList, null);
			uiInnerContent.setNavList(retContextNavList);
		}
		let theFixedNavList = docElement.getStructureByKey(oFF.UiProperty.FIXED_NAV_LIST.getName());
		if (oFF.notNull(theFixedNavList))
		{
			let retContextFixedNavList = this.parseDocument(theFixedNavList, null);
			uiInnerContent.setFixedNavList(retContextFixedNavList);
		}
		let theHeaderToolbar = docElement.getStructureByKey(oFF.UiProperty.HEADER_TOOLBAR.getName());
		if (oFF.notNull(theHeaderToolbar))
		{
			let retContextHeaderToolbar = this.parseDocument(theHeaderToolbar, null);
			uiInnerContent.setHeaderToolbar(retContextHeaderToolbar);
		}
		if (oFF.notNull(binding))
		{
			binding.setControl(uiInnerContent);
			binding.setDataprovider(dp);
		}
	}
	else if (oFF.notNull(customControlString))
	{
		let customControl = oFF.CustomControlRegistration.getCustomControl(customControlString);
		if (oFF.notNull(customControl))
		{
			uiInnerContent = customControl.createCustomControl(this.m_genesis, docElement, this.m_globalLookupObjects);
		}
		else
		{
			uiInnerContent = this.m_genesis.newControlExt(uiType, theId, styleClass);
			uiInnerContent.setText(oFF.XStringUtils.concatenate2("Could not find custom control with name: ", customControlString));
		}
	}
	else
	{
		let ctype = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_CTYPE);
		if (oFF.XStringUtils.isNullOrEmpty(ctype))
		{
			this.printQuasarParsingError("A CType was not specified, cannot create control!");
		}
		else
		{
			this.printQuasarParsingError(oFF.XStringUtils.concatenate3("Cannot find a UiType with the name ", ctype, ". The specified control does not exist!"));
		}
	}
	return uiInnerContent;
};
oFF.QuasarEngine.prototype.parseDataprovider = function(docElement)
{
	let dpTypeStr = docElement.getStringByKey(oFF.UiQuasarConstants.QSA_TYPE);
	let dpType = oFF.QsDpType.lookup(dpTypeStr);
	if (oFF.isNull(dpType))
	{
		dpType = oFF.QsDpType.OLAP;
	}
	let dp = oFF.QsDataproviderFactory.createDataprovider(dpType, this, docElement);
	dp.setGlobalObjects(this.m_globalLookupObjects);
	this.m_dataProviders.add(dp);
	return dp;
};
oFF.QuasarEngine.prototype.parseDocument = function(document, itemUiType)
{
	let floatingControls = document.getListByKey(oFF.UiQuasarConstants.QSA_FLOATING_CONTROLS);
	if (oFF.notNull(floatingControls))
	{
		for (let h = 0; h < floatingControls.size(); h++)
		{
			let floatingControlStruct = floatingControls.getStructureAt(h);
			this.parseControl(floatingControlStruct, null);
		}
	}
	let docElement = document.getStructureByKey(oFF.UiQuasarConstants.QSA_CONTENT);
	if (oFF.isNull(docElement))
	{
		docElement = document;
	}
	let uiInnerContent = this.parseControl(docElement, itemUiType);
	let dpContent = document.getListByKey(oFF.UiQuasarConstants.QSA_DATA_PROVIDERS);
	if (oFF.notNull(dpContent))
	{
		for (let p = 0; p < dpContent.size(); p++)
		{
			let dpStructure = dpContent.getStructureAt(p);
			this.parseDataprovider(dpStructure);
		}
	}
	let dpStructure2 = document.getStructureByKey(oFF.UiQuasarConstants.QSA_DATA_PROVIDER);
	if (oFF.notNull(dpStructure2))
	{
		this.parseDataprovider(dpStructure2);
	}
	let bindings = document.getListByKey(oFF.UiQuasarConstants.QSA_BINDINGS);
	if (oFF.notNull(bindings))
	{
		this.parseBindings(bindings);
	}
	return uiInnerContent;
};
oFF.QuasarEngine.prototype.parseGlobalObjects = function(globalObjects)
{
	let keys = globalObjects.getKeysAsReadOnlyList();
	for (let i = 0; i < keys.size(); i++)
	{
		let key = keys.get(i);
		let customContentParser = oFF.ContentParserRegistration.getCustomContentParser(key);
		if (oFF.notNull(customContentParser))
		{
			let globalObject = customContentParser.parseContent(globalObjects.getByKey(key));
			this.m_globalLookupObjects.put(key, globalObject);
		}
	}
};
oFF.QuasarEngine.prototype.prepareRendering = function(genesis)
{
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.clearUi();
	}
	this.m_genesis = genesis;
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.clearUi();
	}
	this.m_dataProviders = oFF.XList.create();
	this.m_bindings = oFF.XList.create();
	if (oFF.notNull(this.m_messages))
	{
		this.m_messages.clearMessages();
	}
};
oFF.QuasarEngine.prototype.printQuasarParsingError = function(errorMsg)
{
	if (this.m_quasarMode === oFF.QsMode.DEVELOPMENT)
	{
		this.showErrorMessage(errorMsg, null);
		throw oFF.XException.createRuntimeException(errorMsg);
	}
	else
	{
		this.logError(errorMsg);
	}
};
oFF.QuasarEngine.prototype.recursiveExtend = function(directory, element)
{
	if (oFF.notNull(element))
	{
		if (element.isStructure())
		{
			let structure = element;
			let iterator = structure.getKeysAsIterator();
			while (iterator.hasNext())
			{
				let key = iterator.next();
				let child = structure.getByKey(key);
				let newChild = this.recursiveExtend(directory, child);
				if (newChild !== child)
				{
					structure.put(key, newChild);
				}
			}
			let resourceRef = structure.getStringByKey(oFF.UiQuasarConstants.QSA_RESOURCE_REF);
			if (oFF.notNull(resourceRef))
			{
				let subFile = directory.newChild(resourceRef);
				let newElement = this.loadDocumentFromFile(subFile);
				if (oFF.notNull(newElement) && newElement.isStructure())
				{
					let newElementStructure = newElement;
					iterator = structure.getKeysAsIterator();
					while (iterator.hasNext())
					{
						let key2 = iterator.next();
						let child2 = structure.getByKey(key2);
						newElementStructure.put(key2, child2);
					}
					return newElement;
				}
			}
		}
		else if (element.isList())
		{
			let list = element;
			for (let i = 0; i < list.size(); i++)
			{
				let child3 = list.get(i);
				let newChild3 = this.recursiveExtend(directory, child3);
				if (newChild3 !== child3)
				{
					list.set(i, newChild3);
				}
			}
		}
	}
	return element;
};
oFF.QuasarEngine.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.setRoot(null);
	}
	this.clearBindings();
	this.m_genesis = null;
	this.m_document = null;
	this.m_messages = oFF.XObjectExt.release(this.m_messages);
	this.m_uiManager = oFF.XObjectExt.release(this.m_uiManager);
	this.m_dataProviders = oFF.XObjectExt.release(this.m_dataProviders);
	this.m_bindings = oFF.XObjectExt.release(this.m_bindings);
	this.m_file = null;
	this.m_fileLoadedListener = null;
	this.m_renderFinishedProcedure = null;
	oFF.DfApplicationContext.prototype.releaseObject.call( this );
};
oFF.QuasarEngine.prototype.renderDocument = function()
{
	let document = this.getDocument();
	if (this.m_messages.hasErrors())
	{
		this.showErrorMessage("Failed to render document!", this.m_messages.getSummary());
	}
	else
	{
		if (this.validateDocument(document) === false)
		{
			this.showErrorMessage("Cannot render! Not a valid quasar document!", null);
		}
		else
		{
			if (document.containsKey(oFF.UiQuasarConstants.QSA_MODE))
			{
				this.m_quasarMode = oFF.QsMode.lookupWithDefault(document.getStringByKey(oFF.UiQuasarConstants.QSA_MODE), oFF.QsMode.PRODUCTION);
			}
			if (document.containsKey(oFF.UiQuasarConstants.QSA_MASTER_SYSTEM))
			{
				let type = document.getElementTypeByKey(oFF.UiQuasarConstants.QSA_MASTER_SYSTEM);
				if (type === oFF.PrElementType.STRING)
				{
					this.m_masterSystemName = document.getStringByKey(oFF.UiQuasarConstants.QSA_MASTER_SYSTEM);
				}
				else if (type === oFF.PrElementType.STRUCTURE)
				{
					let masterStructure = document.getStructureByKey(oFF.UiQuasarConstants.QSA_MASTER_SYSTEM);
					this.m_masterSystemName = masterStructure.getStringByKey(oFF.UiQuasarConstants.QSA_NAME);
					let sharedConnections = masterStructure.getIntegerByKeyExt(oFF.UiQuasarConstants.QSA_MAX_SHARED_CONNECTIONS, -1);
					if (sharedConnections !== -1 && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_masterSystemName))
					{
						let connectionPool = this.getApplication().getConnectionPool();
						if (connectionPool.getSystemLandscape().getSystemDescription(this.m_masterSystemName) !== null)
						{
							connectionPool.setMaximumSharedConnections(this.m_masterSystemName, sharedConnections);
						}
					}
				}
			}
			if (document.containsKey(oFF.UiQuasarConstants.QSA_STYLE))
			{
				this.m_globalStyleClass = oFF.UiStyleClass.lookup(document.getStringByKey(oFF.UiQuasarConstants.QSA_STYLE));
			}
			this.m_globalLookupObjects = oFF.XHashMapByString.create();
			let globalObjects = document.getStructureByKey(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS);
			if (oFF.notNull(globalObjects))
			{
				this.parseGlobalObjects(globalObjects);
			}
			let newRoot = this.parseDocument(document, null);
			this.m_genesis.setRoot(newRoot);
			this.initDataProviders();
			this.initBindings();
			this.bindGlobalObjects();
		}
	}
	this.renderFinished();
};
oFF.QuasarEngine.prototype.renderDocumentHeadless = function(document, uiMgr)
{
	if (oFF.notNull(document) && oFF.notNull(uiMgr))
	{
		this.m_genesis = oFF.UiGenesis.create(uiMgr.getAnchor());
		this.prepareRendering(this.m_genesis);
		this.setDocument(document);
		this.renderDocument();
	}
};
oFF.QuasarEngine.prototype.renderFinished = function()
{
	if (oFF.notNull(this.m_renderFinishedProcedure))
	{
		this.m_renderFinishedProcedure();
	}
};
oFF.QuasarEngine.prototype.renderUi = function(genesis)
{
	this.prepareRendering(genesis);
	try
	{
		let activityIndicator = genesis.newControl(oFF.UiType.ACTIVITY_INDICATOR);
		activityIndicator.useMaxSpace();
		activityIndicator.setText("Loading...");
		genesis.setRoot(activityIndicator);
		if (oFF.notNull(this.m_document))
		{
			activityIndicator.setText(this.getDocumentLoadingText());
			oFF.XTimeout.timeout(10, () => {
				this.renderDocument();
			});
		}
		else if (oFF.notNull(this.m_file))
		{
			activityIndicator.setText("Loading file...");
			oFF.XTimeout.timeout(10, () => {
				this.loadDocumentFromFile(this.m_file);
			});
		}
		else
		{
			this.showErrorMessage("No document given", null);
		}
	}
	catch (e)
	{
		this.showErrorMessage(oFF.XErrorHelper.convertExceptionToString(e), null);
		this.log(oFF.XException.getStackTrace(e, 0));
	}
};
oFF.QuasarEngine.prototype.replaceAllNonAlphaNum = function(source)
{
	let size = oFF.XString.size(source);
	let buffer = oFF.XStringBuffer.create();
	for (let i = 0; i < size; i++)
	{
		let charAt = oFF.XString.getCharAt(source, i);
		if ((charAt >= 65 && charAt <= 90 || charAt >= 97 && charAt <= 122 || charAt >= 48 && charAt <= 57 || charAt === 95) === false)
		{
			charAt = 95;
		}
		buffer.appendChar(charAt);
	}
	return buffer.toString();
};
oFF.QuasarEngine.prototype.reset = function()
{
	this.clearBindings();
	if (oFF.notNull(this.m_genesis))
	{
		this.m_genesis.setRoot(null);
	}
};
oFF.QuasarEngine.prototype.sendEventWithName = function(event, eventDef)
{
	if (oFF.isNull(eventDef))
	{
		throw oFF.XException.createRuntimeException("Missing event! Please specify an event!");
	}
	let control = event.getControl();
	let docElement = control.getCustomObject();
	let script = docElement.getStringByKey(eventDef.getName());
	let interpreter = oFF.ScriptEngine.create();
	interpreter.setVmCallback(this);
	interpreter.setCustomObject("event", event);
	interpreter.setCustomObject("uicontext", control);
	interpreter.setInitialRegister(control);
	interpreter.compile(script);
	interpreter.execute();
};
oFF.QuasarEngine.prototype.setCustomLoadingText = function(loadingText)
{
	this.m_customLoadingText = loadingText;
};
oFF.QuasarEngine.prototype.setDocument = function(document)
{
	this.m_document = document;
};
oFF.QuasarEngine.prototype.setDocumentByFile = function(file, fileLoadedListener)
{
	this.m_file = file;
	this.m_fileLoadedListener = fileLoadedListener;
};
oFF.QuasarEngine.prototype.setDocumentByNativeJson = function(nativeJson)
{
	let parser = oFF.JsonParserFactory.newInstance();
	let proxyDocument = parser.convertFromNative(nativeJson);
	oFF.XObjectExt.release(parser);
	let document = oFF.PrUtils.deepCopyElement(proxyDocument);
	if (oFF.notNull(document) && document.isStructure())
	{
		this.setDocument(document);
	}
};
oFF.QuasarEngine.prototype.setNativeParent = function(nativeParentId, nativeParentObject)
{
	this.m_nativeAnchorId = nativeParentId;
	this.m_nativeAnchorObject = nativeParentObject;
};
oFF.QuasarEngine.prototype.setRenderFinishedProcedure = function(procedure)
{
	this.m_renderFinishedProcedure = procedure;
};
oFF.QuasarEngine.prototype.setupEngine = function(application)
{
	this.setupApplicationContext(application);
	this.m_messages = oFF.MessageManager.createMessageManagerExt(this.getSession());
	this.m_recursiveExtend = true;
	this.m_quasarMode = oFF.QsMode.PRODUCTION;
};
oFF.QuasarEngine.prototype.showErrorMessage = function(text, description)
{
	if (oFF.notNull(this.m_genesis))
	{
		oFF.UiMessageUtils.showErrorWithMessageAndDescription(this.m_genesis, text, description);
	}
	else
	{
		this.log("ERROR!");
		this.log(text);
		this.log(description);
	}
};
oFF.QuasarEngine.prototype.validateDocument = function(document)
{
	if (oFF.isNull(document))
	{
		return false;
	}
	if (document.isStructure() === false)
	{
		return false;
	}
	if (document.containsKey(oFF.UiQuasarConstants.QSA_CONTENT) === false)
	{
		return false;
	}
	return true;
};

oFF.SxEventScriptingDp = function() {};
oFF.SxEventScriptingDp.prototype = new oFF.SxEventScripting();
oFF.SxEventScriptingDp.prototype._ff_c = "SxEventScriptingDp";

oFF.SxEventScriptingDp.createListener = function(uiManager, olapEnvironment)
{
	let newObj = new oFF.SxEventScriptingDp();
	newObj.setupEventScriptingDp(uiManager, olapEnvironment);
	return newObj;
};
oFF.SxEventScriptingDp.prototype.m_olapEnvironment = null;
oFF.SxEventScriptingDp.prototype.executeByKeyword = function(name, parameters, executedFlag)
{
	if (oFF.XString.isEqual(oFF.UiQuasarConstants.QSA_DOLLAR_D, name))
	{
		let sigSel2 = parameters.getStringAtExt(0, null);
		let commands = this.m_olapEnvironment.select(sigSel2);
		executedFlag.setBoolean(true);
		return commands;
	}
	return oFF.SxEventScripting.prototype.executeByKeyword.call( this , name, parameters, executedFlag);
};
oFF.SxEventScriptingDp.prototype.executeOperation = function(componentType, component, name, parameters)
{
	let retObj = null;
	if (componentType.isTypeOf(oFF.OlapComponentType.CONVENIENCE_CMDS))
	{
		let dpContext = component;
		let dpCmd = oFF.QFactory.createReflectionCommand(name, null, null, null);
		if (oFF.notNull(dpCmd))
		{
			retObj = dpCmd.executeOnContext(dpContext, parameters);
		}
	}
	else
	{
		retObj = oFF.SxEventScripting.prototype.executeOperation.call( this , componentType, component, name, parameters);
	}
	return retObj;
};
oFF.SxEventScriptingDp.prototype.lookupComponent = function(interpreter, component)
{
	let theComponent = oFF.SxEventScripting.prototype.lookupComponent.call( this , interpreter, component);
	if (oFF.isNull(theComponent))
	{
		theComponent = interpreter.getCustomObject("dpcontext");
	}
	return theComponent;
};
oFF.SxEventScriptingDp.prototype.setupEventScriptingDp = function(uiManager, olapEnvironment)
{
	oFF.SxEventScripting.prototype.setupEventScripting.call( this , uiManager, null);
	this.m_olapEnvironment = olapEnvironment;
};

oFF.QsDpType = function() {};
oFF.QsDpType.prototype = new oFF.UiBaseConstant();
oFF.QsDpType.prototype._ff_c = "QsDpType";

oFF.QsDpType.OLAP = null;
oFF.QsDpType.REST = null;
oFF.QsDpType.s_lookup = null;
oFF.QsDpType.create = function(name)
{
	return oFF.UiBaseConstant.createUiConstant(new oFF.QsDpType(), name, oFF.QsDpType.s_lookup);
};
oFF.QsDpType.lookup = function(name)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.QsDpType.s_lookup);
};
oFF.QsDpType.staticSetup = function()
{
	oFF.QsDpType.s_lookup = oFF.XHashMapByString.create();
	oFF.QsDpType.OLAP = oFF.QsDpType.create("Olap");
	oFF.QsDpType.REST = oFF.QsDpType.create("Rest");
};

oFF.QsMode = function() {};
oFF.QsMode.prototype = new oFF.UiBaseConstant();
oFF.QsMode.prototype._ff_c = "QsMode";

oFF.QsMode.DEVELOPMENT = null;
oFF.QsMode.PRODUCTION = null;
oFF.QsMode.s_lookup = null;
oFF.QsMode.create = function(name)
{
	return oFF.UiBaseConstant.createUiConstant(new oFF.QsMode(), name, oFF.QsMode.s_lookup);
};
oFF.QsMode.lookup = function(name)
{
	return oFF.QsMode.s_lookup.getByKey(name);
};
oFF.QsMode.lookupWithDefault = function(name, defaultQuasarMode)
{
	return oFF.UiBaseConstant.lookupConstant(name, oFF.QsMode.s_lookup);
};
oFF.QsMode.staticSetup = function()
{
	oFF.QsMode.s_lookup = oFF.XHashMapByString.create();
	oFF.QsMode.DEVELOPMENT = oFF.QsMode.create("Development");
	oFF.QsMode.PRODUCTION = oFF.QsMode.create("Production");
};

oFF.QuasarProgram = function() {};
oFF.QuasarProgram.prototype = new oFF.DfUiProgram();
oFF.QuasarProgram.prototype._ff_c = "QuasarProgram";

oFF.QuasarProgram.DEFAULT_PROGRAM_NAME = "Quasar";
oFF.QuasarProgram.createQuasar = function(application, systemType, nativeQuasarTemplate, quasarTemplate, quasarTemplateFile)
{
	let theApplication = application;
	if (oFF.notNull(theApplication))
	{
		theApplication = theApplication.newSubApplication(null);
	}
	let client = new oFF.QuasarProgram();
	client.setInitialSystemType(systemType);
	client.setApplication(theApplication);
	client.initializeProgram();
	client.m_quasarTemplateNative = nativeQuasarTemplate;
	client.m_quasarTemplate = quasarTemplate;
	client.m_quasarTemplateFile = quasarTemplateFile;
	return client;
};
oFF.QuasarProgram.createRunner = function()
{
	let runner = oFF.KernelBoot.createByName(oFF.QuasarProgram.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.QuasarProgram.prototype.m_core = null;
oFF.QuasarProgram.prototype.m_quasarTemplate = null;
oFF.QuasarProgram.prototype.m_quasarTemplateFile = null;
oFF.QuasarProgram.prototype.m_quasarTemplateNative = null;
oFF.QuasarProgram.prototype.m_subApplication = null;
oFF.QuasarProgram.prototype.buildUi = function(genesis)
{
	this.resolveArgs();
	this.m_core = oFF.QuasarEngine.create(this.getApplication());
	if (oFF.notNull(this.m_quasarTemplateNative))
	{
		this.m_core.setDocumentByNativeJson(this.m_quasarTemplateNative);
	}
	else if (oFF.notNull(this.m_quasarTemplate))
	{
		this.m_core.setDocument(this.m_quasarTemplate);
	}
	else
	{
		if (oFF.notNull(this.m_quasarTemplateFile))
		{
			this.m_core.setDocumentByFile(this.m_quasarTemplateFile, null);
		}
		else
		{
			this.log("Core is not initialized due to missing document");
		}
	}
	this.m_core.renderUi(genesis);
};
oFF.QuasarProgram.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.QuasarProgram.prototype.getMenuBarDisplayName = function()
{
	return "Quasar";
};
oFF.QuasarProgram.prototype.getProgramName = function()
{
	return oFF.QuasarProgram.DEFAULT_PROGRAM_NAME;
};
oFF.QuasarProgram.prototype.newProgram = function()
{
	let prg = new oFF.QuasarProgram();
	prg.setup();
	return prg;
};
oFF.QuasarProgram.prototype.prepareProgramMetadata = function(metadata)
{
	metadata.addParameter(oFF.DfProgram.PARAM_FILE, "The file");
};
oFF.QuasarProgram.prototype.processArguments = function(args) {};
oFF.QuasarProgram.prototype.processConfiguration = function(configuration) {};
oFF.QuasarProgram.prototype.releaseObject = function()
{
	this.m_quasarTemplateNative = null;
	this.m_quasarTemplateFile = null;
	this.m_quasarTemplate = null;
	this.m_subApplication = oFF.XObjectExt.release(this.m_subApplication);
	this.m_core = oFF.XObjectExt.release(this.m_core);
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.QuasarProgram.prototype.reset = function()
{
	if (oFF.notNull(this.m_core))
	{
		this.m_core.reset();
	}
	this.buildUi(this.getGenesis());
};
oFF.QuasarProgram.prototype.resolveArgs = function()
{
	let prgArgs = this.getArguments();
	let buffer = oFF.XStringBuffer.create().append("Quasar");
	if (oFF.notNull(prgArgs))
	{
		let normalizedFilePath = prgArgs.getStringByKey(oFF.DfProgram.PARAM_FILE);
		if (oFF.notNull(normalizedFilePath))
		{
			let process = this.getProcess();
			this.m_quasarTemplateFile = oFF.XFile.createWithVars(process, normalizedFilePath);
			if (this.m_quasarTemplateFile.isExisting() === false)
			{
				this.log2("File does not exist: ", this.m_quasarTemplateFile.getTargetUriPath());
			}
			buffer.append("@").append(this.m_quasarTemplateFile.getName());
		}
	}
	this.setTitle(buffer.toString());
};
oFF.QuasarProgram.prototype.setFile = function(file)
{
	this.m_quasarTemplateFile = file;
};
oFF.QuasarProgram.prototype.setupProgram = function()
{
	return null;
};

oFF.QuasarModule = function() {};
oFF.QuasarModule.prototype = new oFF.DfModule();
oFF.QuasarModule.prototype._ff_c = "QuasarModule";

oFF.QuasarModule.s_module = null;
oFF.QuasarModule.getInstance = function()
{
	if (oFF.isNull(oFF.QuasarModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiRemoteModule.getInstance());
		oFF.QuasarModule.s_module = oFF.DfModule.startExt(new oFF.QuasarModule());
		oFF.QsMode.staticSetup();
		oFF.QsDpType.staticSetup();
		oFF.QsDataproviderFactory.staticSetup();
		oFF.QsOlapDpFactory.staticSetupFactory();
		oFF.QsRestDpFactory.staticSetupFactory();
		oFF.ProgramRegistry.setProgramFactory(new oFF.QuasarProgram());
		oFF.ContentParserRegistration.staticSetup();
		oFF.ContentParserRegistration.setCustomContentParser(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_FIELD_SELECTIONS, new oFF.FieldSelectionParser());
		oFF.ContentParserRegistration.setCustomContentParser(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_STORY_FILTERS, new oFF.StoryFilterParser());
		oFF.ContentParserRegistration.setCustomContentParser(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_PAGE_FILTERS, new oFF.PageFilterParser());
		oFF.ContentParserRegistration.setCustomContentParser(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_CALCULATION_VARIABLES, new oFF.DfContentParser());
		oFF.ContentParserRegistration.setCustomContentParser(oFF.UiQuasarConstants.QSA_GLOBAL_OBJECTS_CALCULATIONS, new oFF.DfContentParser());
		oFF.CustomControlRegistration.setCustomControl("FieldSelectionInputControl", new oFF.CustomFieldSelectionWidget());
		oFF.CustomControlRegistration.setCustomControl("PageFilter", new oFF.CustomPageFilterWidget());
		oFF.CustomControlRegistration.setCustomControl("CalculationInputControl", new oFF.CustomCalcVarWidget());
		oFF.DfModule.stopExt(oFF.QuasarModule.s_module);
	}
	return oFF.QuasarModule.s_module;
};
oFF.QuasarModule.prototype.getName = function()
{
	return "ff8000.quasar";
};

oFF.QuasarModule.getInstance();

return oFF;
} );