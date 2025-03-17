/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff3400.contextmenu.engine"
],
function(oFF)
{
"use strict";

oFF.CMEMenuActionUtil = {

	getContextExecutor:function(executionKey, key)
	{
			return (contextAccess) => {
			oFF.CMEMenuActionUtil.resolveStringConsumer(contextAccess, executionKey).ifPresent((c) => {
				c.accept(contextAccess, key);
			});
		};
	},
	getContextPredicate:function(contextKey, actionKey)
	{
			return (contextAccess) => {
			return oFF.CMEMenuActionUtil.resolveBooleanFunctionByString(contextAccess, contextKey).map((m) => {
				return m.apply(contextAccess, actionKey);
			}).orElse(oFF.XBooleanValue.create(false)).getBoolean();
		};
	},
	getNameProvider:function(name)
	{
			return (context) => {
			return name;
		};
	},
	getSimpleContextConsumer:function(executionKey, key)
	{
			return (contextAccess, state) => {
			oFF.CMEMenuActionUtil.resolveStringConsumer(contextAccess, executionKey).ifPresent((c) => {
				c.accept(contextAccess, key);
			});
		};
	},
	resolveBooleanFunctionByString:function(contextAccess, contextKey)
	{
			let context = contextAccess.getSingleSubContext(contextKey);
		return oFF.isNull(context) ? oFF.XOptional.empty() : oFF.XOptional.of(context.getCustomObject());
	},
	resolveStringConsumer:function(contextAccess, contextKey)
	{
			let context = contextAccess.getSingleSubContext(contextKey);
		return oFF.isNull(context) ? oFF.XOptional.empty() : oFF.XOptional.of(context.getCustomObject());
	}
};

oFF.CMEAbstractAction = function() {};
oFF.CMEAbstractAction.prototype = new oFF.XObject();
oFF.CMEAbstractAction.prototype._ff_c = "CMEAbstractAction";

oFF.CMEAbstractAction.prototype.m_aliasNames = null;
oFF.CMEAbstractAction.prototype.m_availableProvider = null;
oFF.CMEAbstractAction.prototype.m_dataHelpIdProvider = null;
oFF.CMEAbstractAction.prototype.m_enabledProvider = null;
oFF.CMEAbstractAction.prototype.m_explanationProvider = null;
oFF.CMEAbstractAction.prototype.m_highlightProcedure = null;
oFF.CMEAbstractAction.prototype.m_iconProvider = null;
oFF.CMEAbstractAction.prototype.m_localizableExplanationCreator = null;
oFF.CMEAbstractAction.prototype.m_localizableTextCreator = null;
oFF.CMEAbstractAction.prototype.m_longDescription = null;
oFF.CMEAbstractAction.prototype.m_mediumDescription = null;
oFF.CMEAbstractAction.prototype.m_nameProvider = null;
oFF.CMEAbstractAction.prototype.m_shortDescription = null;
oFF.CMEAbstractAction.prototype.m_textProvider = null;
oFF.CMEAbstractAction.prototype.m_unHighlightProcedure = null;
oFF.CMEAbstractAction.prototype.addAliasName = function(aliasName)
{
	this.m_aliasNames.add(aliasName);
};
oFF.CMEAbstractAction.prototype.asMultiSelectAction = function()
{
	return null;
};
oFF.CMEAbstractAction.prototype.asSelectOption = function()
{
	return null;
};
oFF.CMEAbstractAction.prototype.asSingleSelectAction = function()
{
	return null;
};
oFF.CMEAbstractAction.prototype.asToggleAction = function()
{
	return null;
};
oFF.CMEAbstractAction.prototype.asTriggerAction = function()
{
	return null;
};
oFF.CMEAbstractAction.prototype.ensureNameProvider = function(name)
{
	if (oFF.isNull(this.m_nameProvider))
	{
		this.m_nameProvider = (c) => {
			return name;
		};
	}
};
oFF.CMEAbstractAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.ABSTRACT;
};
oFF.CMEAbstractAction.prototype.getAliasNames = function()
{
	return this.m_aliasNames;
};
oFF.CMEAbstractAction.prototype.getDataHelpId = function(context)
{
	return oFF.isNull(this.m_dataHelpIdProvider) ? null : this.m_dataHelpIdProvider(context);
};
oFF.CMEAbstractAction.prototype.getIcon = function(context)
{
	return oFF.isNull(this.m_iconProvider) ? null : this.m_iconProvider(context);
};
oFF.CMEAbstractAction.prototype.getLocalizedExplanation = function(context)
{
	return oFF.isNull(this.m_explanationProvider) ? null : this.m_explanationProvider(context);
};
oFF.CMEAbstractAction.prototype.getLocalizedText = function(context)
{
	return oFF.isNull(this.m_textProvider) ? null : this.m_textProvider(context);
};
oFF.CMEAbstractAction.prototype.getLongDescription = function()
{
	return this.m_longDescription;
};
oFF.CMEAbstractAction.prototype.getMediumDescription = function()
{
	return this.m_mediumDescription;
};
oFF.CMEAbstractAction.prototype.getName = function(context)
{
	return oFF.isNull(this.m_nameProvider) ? null : this.m_nameProvider(context);
};
oFF.CMEAbstractAction.prototype.getShortDescription = function()
{
	return this.m_shortDescription;
};
oFF.CMEAbstractAction.prototype.highlight = function(context)
{
	if (oFF.notNull(this.m_highlightProcedure))
	{
		this.m_highlightProcedure(context);
	}
};
oFF.CMEAbstractAction.prototype.isAvailable = function(context)
{
	return oFF.isNull(this.m_availableProvider) ? true : this.m_availableProvider(context);
};
oFF.CMEAbstractAction.prototype.isEnabled = function(context)
{
	return oFF.isNull(this.m_enabledProvider) ? true : this.m_enabledProvider(context);
};
oFF.CMEAbstractAction.prototype.isSelectOption = function()
{
	return this.getActionType().isTypeOf(oFF.CmeActionType.OPTION);
};
oFF.CMEAbstractAction.prototype.isSimpleAction = function()
{
	return this.getActionType().isTypeOf(oFF.CmeActionType.SIMPLE);
};
oFF.CMEAbstractAction.prototype.mapGenericPropertiesToMenuCreator = function(controller, menuItemCreator)
{
	if (oFF.notNull(controller))
	{
		let stringResolver = oFF.CMEValueStringFunctionalResolver.create();
		stringResolver.setFunction((nameContext) => {
			return controller.retrieveName(this, nameContext);
		});
		menuItemCreator.setName(stringResolver);
		stringResolver = oFF.CMEValueStringFunctionalResolver.create();
		stringResolver.setFunction((textContext) => {
			return controller.retrieveText(this, textContext);
		});
		menuItemCreator.setText(stringResolver);
		stringResolver = oFF.CMEValueStringFunctionalResolver.create();
		stringResolver.setFunction((iconContext) => {
			return controller.retrieveIcon(this, iconContext);
		});
		menuItemCreator.setIcon(stringResolver);
		stringResolver = oFF.CMEValueStringFunctionalResolver.create();
		stringResolver.setFunction((explanationContext) => {
			return controller.retrieveExplanation(this, explanationContext);
		});
		menuItemCreator.setExplanation(stringResolver);
		let functionalResolver = oFF.CMEValueFunctionalResolver.create();
		functionalResolver.setFunction((enabledContext) => {
			return oFF.XBooleanValue.create(controller.checkEnabled(this, enabledContext));
		});
		menuItemCreator.addEnabledConstraint(functionalResolver);
		functionalResolver = oFF.CMEValueFunctionalResolver.create();
		functionalResolver.setFunction((availableContext) => {
			return oFF.XBooleanValue.create(controller.checkAvailable(this, availableContext));
		});
		menuItemCreator.addVisibleConstraint(functionalResolver);
		menuItemCreator.setHighlightProcedure((highlightContext) => {
			controller.onHighlight(this, highlightContext);
		});
		menuItemCreator.setUnHighlightProcedure((unHighlightContext) => {
			controller.onUnHighlight(this, unHighlightContext);
		});
	}
	else
	{
		if (oFF.notNull(this.m_nameProvider))
		{
			let nameResolver = oFF.CMEValueStringFunctionalResolver.create();
			nameResolver.setFunction(this.m_nameProvider);
			menuItemCreator.setName(nameResolver);
		}
		if (oFF.notNull(this.m_iconProvider))
		{
			let iconResolver = oFF.CMEValueStringFunctionalResolver.create();
			iconResolver.setFunction(this.m_iconProvider);
			menuItemCreator.setIcon(iconResolver);
		}
		if (oFF.notNull(this.m_dataHelpIdProvider))
		{
			let dataHelpIdResolver = oFF.CMEValueStringFunctionalResolver.create();
			dataHelpIdResolver.setFunction(this.m_dataHelpIdProvider);
			menuItemCreator.setDataHelpId(dataHelpIdResolver);
		}
		if (oFF.notNull(this.m_textProvider))
		{
			let textResolver = oFF.CMEValueStringFunctionalResolver.create();
			textResolver.setFunction(this.m_textProvider);
			menuItemCreator.setText(textResolver);
		}
		else if (oFF.notNull(this.m_localizableTextCreator))
		{
			menuItemCreator.setLocalizableText(this.m_localizableTextCreator);
		}
		if (oFF.notNull(this.m_explanationProvider))
		{
			let explanationResolver = oFF.CMEValueStringFunctionalResolver.create();
			explanationResolver.setFunction(this.m_explanationProvider);
			menuItemCreator.setExplanation(explanationResolver);
		}
		else if (oFF.notNull(this.m_localizableExplanationCreator))
		{
			menuItemCreator.setLocalizableExplanation(this.m_localizableExplanationCreator);
		}
		let enablementResolver = oFF.CMEValueFunctionalResolver.create();
		enablementResolver.setFunction((input) => {
			return oFF.XBooleanValue.create(oFF.isNull(this.m_enabledProvider) || this.m_enabledProvider(input));
		});
		menuItemCreator.addEnabledConstraint(enablementResolver);
		let availableResolver = oFF.CMEValueFunctionalResolver.create();
		availableResolver.setFunction((input2) => {
			return oFF.XBooleanValue.create(oFF.isNull(this.m_availableProvider) || this.m_availableProvider(input2));
		});
		menuItemCreator.addVisibleConstraint(availableResolver);
		menuItemCreator.setHighlightProcedure(this.m_highlightProcedure);
		menuItemCreator.setUnHighlightProcedure(this.m_unHighlightProcedure);
	}
};
oFF.CMEAbstractAction.prototype.resolveHighlightProcedure = function(contextAccess)
{
	let result = null;
	if (oFF.notNull(this.m_highlightProcedure))
	{
		result = () => {
			this.m_highlightProcedure(contextAccess);
		};
	}
	return result;
};
oFF.CMEAbstractAction.prototype.resolveUnHighlightProcedure = function(contextAccess)
{
	let result = null;
	if (oFF.notNull(this.m_unHighlightProcedure))
	{
		result = () => {
			this.m_unHighlightProcedure(contextAccess);
		};
	}
	return result;
};
oFF.CMEAbstractAction.prototype.setAvailableProvider = function(availableProvider)
{
	this.m_availableProvider = availableProvider;
};
oFF.CMEAbstractAction.prototype.setDataHelpIdProvider = function(dataHelpIdProvider)
{
	this.m_dataHelpIdProvider = dataHelpIdProvider;
};
oFF.CMEAbstractAction.prototype.setEnabledProvider = function(enabledProvider)
{
	this.m_enabledProvider = enabledProvider;
};
oFF.CMEAbstractAction.prototype.setExplanationProvider = function(explanationProvider)
{
	this.m_explanationProvider = explanationProvider;
};
oFF.CMEAbstractAction.prototype.setHighlightProcedure = function(highlightProcedure)
{
	this.m_highlightProcedure = highlightProcedure;
};
oFF.CMEAbstractAction.prototype.setIconProvider = function(iconProvider)
{
	this.m_iconProvider = iconProvider;
};
oFF.CMEAbstractAction.prototype.setLocalizableExplanationCreator = function(localizableExplanationCreator)
{
	this.m_localizableExplanationCreator = localizableExplanationCreator;
};
oFF.CMEAbstractAction.prototype.setLocalizableTextCreator = function(localizableTextCreator)
{
	this.m_localizableTextCreator = localizableTextCreator;
};
oFF.CMEAbstractAction.prototype.setLongDescription = function(description)
{
	this.m_longDescription = description;
};
oFF.CMEAbstractAction.prototype.setMediumDescription = function(description)
{
	this.m_mediumDescription = description;
};
oFF.CMEAbstractAction.prototype.setNameProvider = function(nameProvider)
{
	this.m_nameProvider = nameProvider;
};
oFF.CMEAbstractAction.prototype.setShortDescription = function(description)
{
	this.m_shortDescription = description;
};
oFF.CMEAbstractAction.prototype.setTextProvider = function(textProvider)
{
	this.m_textProvider = textProvider;
};
oFF.CMEAbstractAction.prototype.setUnHighlightProcedure = function(unHighlightProcedure)
{
	this.m_unHighlightProcedure = unHighlightProcedure;
};
oFF.CMEAbstractAction.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_aliasNames = oFF.XHashSetOfString.create();
};
oFF.CMEAbstractAction.prototype.unHighlight = function(context)
{
	if (oFF.notNull(this.m_unHighlightProcedure))
	{
		this.m_unHighlightProcedure(context);
	}
};

oFF.CMEActionProviderMapper = function() {};
oFF.CMEActionProviderMapper.prototype = new oFF.XObject();
oFF.CMEActionProviderMapper.prototype._ff_c = "CMEActionProviderMapper";

oFF.CMEActionProviderMapper.create = function(provider)
{
	let instance = new oFF.CMEActionProviderMapper();
	instance.m_provider = provider;
	return instance;
};
oFF.CMEActionProviderMapper.prototype.m_provider = null;
oFF.CMEActionProviderMapper.prototype.checkAvailable = function(action, context)
{
	return this.m_provider.isActionVisible(action.getName(context), context);
};
oFF.CMEActionProviderMapper.prototype.checkEnabled = function(action, context)
{
	return this.m_provider.isActionEnabled(action.getName(context), context);
};
oFF.CMEActionProviderMapper.prototype.checkToggled = function(action, context)
{
	return null;
};
oFF.CMEActionProviderMapper.prototype.onActionMultiSelect = function(action, option, selected, context) {};
oFF.CMEActionProviderMapper.prototype.onActionSingleSelect = function(action, option, context) {};
oFF.CMEActionProviderMapper.prototype.onActionToggled = function(action, context) {};
oFF.CMEActionProviderMapper.prototype.onActionTriggered = function(action, context)
{
	this.m_provider.onActionTriggered(action.getName(context), context);
};
oFF.CMEActionProviderMapper.prototype.onHighlight = function(action, context) {};
oFF.CMEActionProviderMapper.prototype.onUnHighlight = function(action, context) {};
oFF.CMEActionProviderMapper.prototype.releaseObject = function()
{
	this.m_provider = oFF.XObjectExt.release(this.m_provider);
};
oFF.CMEActionProviderMapper.prototype.retrieveExplanation = function(action, context)
{
	return null;
};
oFF.CMEActionProviderMapper.prototype.retrieveIcon = function(action, context)
{
	return null;
};
oFF.CMEActionProviderMapper.prototype.retrieveName = function(action, context)
{
	return null;
};
oFF.CMEActionProviderMapper.prototype.retrieveText = function(action, context)
{
	return null;
};

oFF.CMEDataProviderMenuActionCommand = function() {};
oFF.CMEDataProviderMenuActionCommand.prototype = new oFF.XObject();
oFF.CMEDataProviderMenuActionCommand.prototype._ff_c = "CMEDataProviderMenuActionCommand";

oFF.CMEDataProviderMenuActionCommand.create = function(commandName)
{
	let action = new oFF.CMEDataProviderMenuActionCommand();
	action.m_commandName = commandName;
	action.m_parameters = oFF.XList.create();
	return action;
};
oFF.CMEDataProviderMenuActionCommand.prototype.m_commandName = null;
oFF.CMEDataProviderMenuActionCommand.prototype.m_parameters = null;
oFF.CMEDataProviderMenuActionCommand.prototype.addCollectParameter = function(name, contextString)
{
	let parameter = oFF.CMEDataProviderParameterMulti.create(name, contextString, oFF.CmeCardinalityType.COLLECT);
	this.m_parameters.add(parameter);
	return parameter;
};
oFF.CMEDataProviderMenuActionCommand.prototype.addListParameter = function(name, contextString)
{
	let parameter = oFF.CMEDataProviderParameterMulti.create(name, contextString, oFF.CmeCardinalityType.LIST);
	this.m_parameters.add(parameter);
	return parameter;
};
oFF.CMEDataProviderMenuActionCommand.prototype.addSingleValueParameter = function(name, value, contextString)
{
	let parameter = oFF.CMEDataProviderParameterSingle.create(name, value, contextString);
	this.m_parameters.add(parameter);
	return parameter;
};
oFF.CMEDataProviderMenuActionCommand.prototype.addSplitParameter = function(name, contextString)
{
	let parameter = oFF.CMEDataProviderParameterMulti.create(name, contextString, oFF.CmeCardinalityType.SPLIT);
	this.m_parameters.add(parameter);
	return parameter;
};
oFF.CMEDataProviderMenuActionCommand.prototype.executeWithContext = function(context, commandConsumer)
{
	let propertiez = this.expandProperties(context);
	for (let i = 0; i < propertiez.size(); i++)
	{
		let properties = propertiez.get(i);
		commandConsumer.accept(this.m_commandName, properties);
	}
};
oFF.CMEDataProviderMenuActionCommand.prototype.expandProperties = function(context)
{
	let properties = oFF.XList.create();
	let propList = oFF.XList.create();
	propList.add(properties);
	for (let i = 0; i < this.m_parameters.size(); i++)
	{
		let parameter = this.m_parameters.get(i);
		if (parameter.getCardinalityType() === oFF.CmeCardinalityType.SINGLE)
		{
			let parameterOptional = parameter.resolveParameter(context);
			let nameToAdd;
			if (parameterOptional.isPresent())
			{
				nameToAdd = parameterOptional.get().getName();
			}
			else
			{
				nameToAdd = null;
			}
			oFF.XCollectionUtils.forEach(propList, (pl) => {
				pl.add(nameToAdd);
			});
		}
		else if (parameter.getCardinalityType() === oFF.CmeCardinalityType.COLLECT)
		{
			propList = this.expandPropertiesMultiply(propList, parameter, context);
		}
	}
	return propList;
};
oFF.CMEDataProviderMenuActionCommand.prototype.expandPropertiesMultiply = function(propList, parameter, context)
{
	let result = oFF.XList.create();
	let resolvedParameters = parameter.resolveParameters(context);
	for (let i = 0; i < resolvedParameters.size(); i++)
	{
		let resolvedParameter = resolvedParameters.get(i);
		for (let j = 0; j < propList.size(); j++)
		{
			let newProp = oFF.XList.createWithList(propList.get(j));
			newProp.add(resolvedParameter.getName());
			result.add(newProp);
		}
	}
	return result;
};
oFF.CMEDataProviderMenuActionCommand.prototype.getCommandName = function()
{
	return this.m_commandName;
};
oFF.CMEDataProviderMenuActionCommand.prototype.getParameters = function()
{
	return this.m_parameters;
};
oFF.CMEDataProviderMenuActionCommand.prototype.isEnabledInContext = function(contextAccess)
{
	return oFF.XStream.of(this.m_parameters).allMatch((param) => {
		return param.isAvailable(contextAccess);
	});
};

oFF.CMEKeyboardShortcut = function() {};
oFF.CMEKeyboardShortcut.prototype = new oFF.XObject();
oFF.CMEKeyboardShortcut.prototype._ff_c = "CMEKeyboardShortcut";

oFF.CMEKeyboardShortcut.create = function()
{
	return new oFF.CMEKeyboardShortcut();
};
oFF.CMEKeyboardShortcut.prototype.m_altPressed = false;
oFF.CMEKeyboardShortcut.prototype.m_code = null;
oFF.CMEKeyboardShortcut.prototype.m_commandOrControlPressedSystemSpecific = false;
oFF.CMEKeyboardShortcut.prototype.m_ctrlPressed = false;
oFF.CMEKeyboardShortcut.prototype.m_key = null;
oFF.CMEKeyboardShortcut.prototype.m_metaPressed = false;
oFF.CMEKeyboardShortcut.prototype.m_shiftPressed = false;
oFF.CMEKeyboardShortcut.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	this.m_code = orig.m_code;
	this.m_key = orig.m_key;
	this.m_altPressed = orig.m_altPressed;
	this.m_ctrlPressed = orig.m_ctrlPressed;
	this.m_shiftPressed = orig.m_shiftPressed;
	this.m_metaPressed = orig.m_metaPressed;
	this.m_commandOrControlPressedSystemSpecific = orig.m_commandOrControlPressedSystemSpecific;
};
oFF.CMEKeyboardShortcut.prototype.getCode = function()
{
	return this.m_code;
};
oFF.CMEKeyboardShortcut.prototype.getKey = function()
{
	return this.m_key;
};
oFF.CMEKeyboardShortcut.prototype.isAltPressed = function()
{
	return this.m_altPressed;
};
oFF.CMEKeyboardShortcut.prototype.isCommandOrControlPressedSystemSpecific = function()
{
	return this.m_commandOrControlPressedSystemSpecific;
};
oFF.CMEKeyboardShortcut.prototype.isCtrlPressed = function()
{
	return this.m_ctrlPressed;
};
oFF.CMEKeyboardShortcut.prototype.isMetaPressed = function()
{
	return this.m_metaPressed;
};
oFF.CMEKeyboardShortcut.prototype.isShiftPressed = function()
{
	return this.m_shiftPressed;
};
oFF.CMEKeyboardShortcut.prototype.setAltPressed = function(altPressed)
{
	this.m_altPressed = altPressed;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setCode = function(code)
{
	this.m_code = code;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setCommandOrControlPressedSystemSpecific = function(commandOrControlPressedSystemSpecific)
{
	this.m_commandOrControlPressedSystemSpecific = commandOrControlPressedSystemSpecific;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setCtrlPressed = function(ctrlPressed)
{
	this.m_ctrlPressed = ctrlPressed;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setKey = function(key)
{
	this.m_key = key;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setMetaPressed = function(metaPressed)
{
	this.m_metaPressed = metaPressed;
	return this;
};
oFF.CMEKeyboardShortcut.prototype.setShiftPressed = function(shiftPressed)
{
	this.m_shiftPressed = shiftPressed;
	return this;
};

oFF.CMEConstants = {

	DOUBLE_QUOTE:"\"",
	ENV_PREFIX:"$env.",
	ENV_PREFIX_SIZE:5,
	FALSE:"false",
	NULL:"null",
	SINGLE_QUOTE:"'",
	TRUE:"true",
	VAR_PREFIX:"$",
	VAR_PREFIX_SIZE:1
};

oFF.CMELocalizableTextContextCompound = function() {};
oFF.CMELocalizableTextContextCompound.prototype = new oFF.XObject();
oFF.CMELocalizableTextContextCompound.prototype._ff_c = "CMELocalizableTextContextCompound";

oFF.CMELocalizableTextContextCompound.create = function(match, creator)
{
	let instance = new oFF.CMELocalizableTextContextCompound();
	instance.setupExt(match, creator);
	return instance;
};
oFF.CMELocalizableTextContextCompound.prototype.m_contextMatchConstant = null;
oFF.CMELocalizableTextContextCompound.prototype.m_localizableTextCreator = null;
oFF.CMELocalizableTextContextCompound.prototype.getMatch = function(contextAccess)
{
	if (contextAccess.resolveValue(this.m_contextMatchConstant) !== null || oFF.XCollectionUtils.hasElements(contextAccess.getSubContexts(this.m_contextMatchConstant)))
	{
		return this.m_localizableTextCreator;
	}
	return null;
};
oFF.CMELocalizableTextContextCompound.prototype.releaseObject = function()
{
	this.m_localizableTextCreator = oFF.XObjectExt.release(this.m_localizableTextCreator);
	this.m_contextMatchConstant = null;
};
oFF.CMELocalizableTextContextCompound.prototype.setupExt = function(match, creator)
{
	this.m_contextMatchConstant = match;
	this.m_localizableTextCreator = creator;
};

oFF.CMELocalizableTextCreatorAbstract = function() {};
oFF.CMELocalizableTextCreatorAbstract.prototype = new oFF.XObject();
oFF.CMELocalizableTextCreatorAbstract.prototype._ff_c = "CMELocalizableTextCreatorAbstract";


oFF.CMEMenuCreator = function() {};
oFF.CMEMenuCreator.prototype = new oFF.XObject();
oFF.CMEMenuCreator.prototype._ff_c = "CMEMenuCreator";

oFF.CMEMenuCreator.prototype.m_subContexts = null;
oFF.CMEMenuCreator.prototype.getSubContext = function(context)
{
	return context.getSubContext(this.m_subContexts);
};
oFF.CMEMenuCreator.prototype.isGroupCreator = function()
{
	return false;
};
oFF.CMEMenuCreator.prototype.resolveBoolean = function(parameter, context)
{
	let element = this.resolveElement(parameter, context);
	if (oFF.notNull(element))
	{
		return element.asBoolean().getBoolean();
	}
	else
	{
		return oFF.XBoolean.convertFromString(parameter);
	}
};
oFF.CMEMenuCreator.prototype.resolveElement = function(parameter, context)
{
	if (oFF.XString.startsWith(parameter, oFF.CMEConstants.VAR_PREFIX))
	{
		return context.getByKey(oFF.XString.substring(parameter, oFF.CMEConstants.VAR_PREFIX_SIZE, oFF.XString.size(parameter)));
	}
	else if (oFF.XString.isEqual(parameter, oFF.CMEConstants.NULL))
	{
		return null;
	}
	else if (oFF.XString.isEqual(parameter, oFF.CMEConstants.TRUE))
	{
		return oFF.PrFactory.createBoolean(true);
	}
	else if (oFF.XString.isEqual(parameter, oFF.CMEConstants.FALSE))
	{
		return oFF.PrFactory.createBoolean(false);
	}
	else if (oFF.XString.match(parameter, "([0-9]*\\.[0-9]+)|[0-9]+"))
	{
		return oFF.PrFactory.createDouble(oFF.XDouble.convertFromString(parameter));
	}
	else if (oFF.XString.startsWith(parameter, oFF.CMEConstants.DOUBLE_QUOTE) && oFF.XString.endsWith(parameter, oFF.CMEConstants.DOUBLE_QUOTE) || oFF.XString.startsWith(parameter, oFF.CMEConstants.SINGLE_QUOTE) && oFF.XString.endsWith(parameter, oFF.CMEConstants.SINGLE_QUOTE))
	{
		return oFF.PrFactory.createString(oFF.XString.substring(parameter, 1, oFF.XString.size(parameter) - 1));
	}
	else
	{
		return oFF.JsonParserFactory.createFromString(parameter);
	}
};
oFF.CMEMenuCreator.prototype.resolveList = function(parameter, context)
{
	let element = this.resolveElement(parameter, context);
	if (oFF.notNull(element))
	{
		return element.asList();
	}
	else
	{
		return null;
	}
};
oFF.CMEMenuCreator.prototype.resolveNumber = function(parameter, context)
{
	let element = this.resolveElement(parameter, context);
	if (oFF.notNull(element))
	{
		return element.asDouble().getDouble();
	}
	else
	{
		return oFF.XDouble.convertFromString(parameter);
	}
};
oFF.CMEMenuCreator.prototype.resolveString = function(parameter, context)
{
	let element = this.resolveElement(parameter, context);
	if (oFF.notNull(element))
	{
		return element.asString().getString();
	}
	else
	{
		return parameter;
	}
};
oFF.CMEMenuCreator.prototype.resolveStructure = function(parameter, context)
{
	let element = this.resolveElement(parameter, context);
	if (oFF.notNull(element))
	{
		return element.asStructure();
	}
	else
	{
		return null;
	}
};
oFF.CMEMenuCreator.prototype.setSubContextReference = function(context)
{
	this.m_subContexts = context;
};

oFF.CMEValueContextCompound = function() {};
oFF.CMEValueContextCompound.prototype = new oFF.XObject();
oFF.CMEValueContextCompound.prototype._ff_c = "CMEValueContextCompound";

oFF.CMEValueContextCompound.create = function(contextExpression, resolver)
{
	let instance = new oFF.CMEValueContextCompound();
	instance.setupExpression(contextExpression, resolver);
	return instance;
};
oFF.CMEValueContextCompound.prototype.m_contextExpression = null;
oFF.CMEValueContextCompound.prototype.m_resolver = null;
oFF.CMEValueContextCompound.prototype.getExpression = function(contextAccess)
{
	if (contextAccess.resolveValue(this.m_contextExpression) !== null || oFF.XCollectionUtils.hasElements(contextAccess.getSubContexts(this.m_contextExpression)))
	{
		return this.m_resolver;
	}
	return null;
};
oFF.CMEValueContextCompound.prototype.releaseObject = function()
{
	this.m_resolver = oFF.XObjectExt.release(this.m_resolver);
	this.m_contextExpression = null;
};
oFF.CMEValueContextCompound.prototype.setupExpression = function(contextExpression, resolver)
{
	this.m_resolver = resolver;
	this.m_contextExpression = contextExpression;
};

oFF.CMEValueResolver = function() {};
oFF.CMEValueResolver.prototype = new oFF.XObject();
oFF.CMEValueResolver.prototype._ff_c = "CMEValueResolver";

oFF.CMEValueResolver.prototype.resolveBoolean = function(context)
{
	return oFF.XValueUtil.getBoolean(this.resolve(context), false, true);
};
oFF.CMEValueResolver.prototype.resolveInteger = function(context)
{
	return oFF.XValueUtil.getInteger(this.resolve(context), false, true);
};
oFF.CMEValueResolver.prototype.resolveNumber = function(context)
{
	return oFF.XValueUtil.getDouble(this.resolve(context), false, true);
};
oFF.CMEValueResolver.prototype.resolveString = function(context)
{
	return oFF.XValueUtil.getString(this.resolve(context));
};

oFF.CMECreatorJsonConstants = {

	CME_ACQUIRE_TEXT_FROM_CONTEXT:"AcquireTextFromContext",
	CME_ACTION:"Action",
	CME_ACTIONS_FILTER:"ActionFilter",
	CME_ACTION_COMMANDS:"Commands",
	CME_ACTION_COMMAND_EXECUTOR_CONTEXT:"CommandExecutorContext",
	CME_ACTION_COMMAND_NAME:"CommandName",
	CME_ACTION_GROUP:"ActionGroup",
	CME_ACTION_PARAMETERS:"Parameters",
	CME_ACTION_SPLIT_PARAMETER_CONTEXT:"SplitParameterContext",
	CME_AND:"And",
	CME_CONFIG_ENVIRONMENT:"Environment",
	CME_CONTEXT_ITERATION:"ContextIteration",
	CME_CONTEXT_PATH_SEPARATOR:"/",
	CME_CONTEXT_REFOCUS:"RefocusContext",
	CME_CONTEXT_TEXT_SUFFIX:".TEXT",
	CME_DATA_CONTEXT:"DataContext",
	CME_DEFAULT_TEXT:"DefaultText",
	CME_ENGINE_VERSION:"EngineVersion",
	CME_EQUAL:"Equal",
	CME_EXCLUDE:"Exclude",
	CME_EXISTS:"Exists",
	CME_EXTENSION:"Extension",
	CME_GLOBAL_SHORTCUT_ACTIONS:"GlobalShortcutActions",
	CME_INCLUDE:"Include",
	CME_ITEM:"Item",
	CME_ITEMS:"Items",
	CME_LOCALIZATION_KEY:"LocalizationKey",
	CME_LOGGING_ENABLED:"LoggingEnabled",
	CME_MATCH:"Match",
	CME_MATCH_CONTEXT:"MatchContext",
	CME_MAX_SIZE:"MaxSize",
	CME_MENUS:"Menus",
	CME_MENU_ACTIONS:"MenuActions",
	CME_MENU_EXTENSIONS:"MenuExtensions",
	CME_MENU_FILTERS:"MenuFilters",
	CME_MENU_NAMES:"MenuNames",
	CME_MIN_SIZE:"MinSize",
	CME_NAME:"Name",
	CME_NONE:"None",
	CME_NOT:"Not",
	CME_NOT_EQUAL:"NotEqual",
	CME_NOT_EXISTS:"NotExists",
	CME_OPERATION:"Operation",
	CME_OPERATION_REDEFINE:"Redefine",
	CME_OPTION:"Option",
	CME_OR:"Or",
	CME_OVERFLOW_PRIORITY:"OverflowPriority",
	CME_OVERFLOW_PRIORITY_ALWAYS:"Always",
	CME_OVERFLOW_PRIORITY_ALWAYS_VALUE:4,
	CME_OVERFLOW_PRIORITY_DISAPPEAR:"Disappear",
	CME_OVERFLOW_PRIORITY_DISAPPEAR_VALUE:3,
	CME_OVERFLOW_PRIORITY_HIGH:"High",
	CME_OVERFLOW_PRIORITY_HIGH_VALUE:2,
	CME_OVERFLOW_PRIORITY_LOW:"Low",
	CME_OVERFLOW_PRIORITY_LOW_VALUE:1,
	CME_OVERFLOW_PRIORITY_NEVER:"Never",
	CME_OVERFLOW_PRIORITY_NEVER_VALUE:0,
	CME_PARAMETER_ACTIVE:"Active",
	CME_PARAMETER_DATA_HELP_ID:"DataHelpId",
	CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ENABLED_ITEMS:"DisableIfLessThanNEnabledItems",
	CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ITEMS:"DisableIfLessThanNItems",
	CME_PARAMETER_EAGER:"Eager",
	CME_PARAMETER_ENABLED:"Enabled",
	CME_PARAMETER_EXPLANATION:"Explanation",
	CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY:"ExplanationKey",
	CME_PARAMETER_FIRST_SUBOPTION_IS_DEFAULT:"FirstSubOptionIsDefault",
	CME_PARAMETER_FLAT:"Flat",
	CME_PARAMETER_FLAT_IF_LESS_THAN_N_ITEMS:"FlatIfLessThanNItems",
	CME_PARAMETER_HIDE_IF_LESS_THAN_N_ITEMS:"HideIfLessThanNItems",
	CME_PARAMETER_ICON:"Icon",
	CME_PARAMETER_KEEP_TITLE_FOR_FLAT:"KeepTitleForFlat",
	CME_PARAMETER_KEY:"Key",
	CME_PARAMETER_LOCALIZATION_KEY:"LocalizationKey",
	CME_PARAMETER_NAME:"Name",
	CME_PARAMETER_OVERFLOW_IF_MORE_THAN_N_ITEMS:"OverflowIfMoreThanNItems",
	CME_PARAMETER_OVERFLOW_LOCALIZATION_KEY:"OverflowLocalizationKey",
	CME_PARAMETER_OVERFLOW_TEXT:"OverflowText",
	CME_PARAMETER_RESOLVE:"Resolve",
	CME_PARAMETER_TEXT:"Text",
	CME_PARAMETER_TYPE:"Type",
	CME_PARAMETER_TYPE_COLLECT:"Collect",
	CME_PARAMETER_TYPE_LIST:"List",
	CME_PARAMETER_TYPE_SINGLE:"Single",
	CME_PARAMETER_TYPE_SPLIT:"Split",
	CME_PARAMETER_VALUE:"Value",
	CME_PARAMETER_VALUES:"Values",
	CME_PARAMETER_VALUE_CONTEXT:"ValueContext",
	CME_PARAMETER_VISIBLE:"Visible",
	CME_REFERENCE:"Reference",
	CME_REFERENCE_ROOT:"$Root",
	CME_REPLACEMENTS:"Replacements",
	CME_SEPARATOR:"Separator",
	CME_SHORTCUT_ALT:"Alt",
	CME_SHORTCUT_CODE:"Code",
	CME_SHORTCUT_COMMAND_OR_CTRL:"CommandOrCtrl",
	CME_SHORTCUT_CTRL:"Ctrl",
	CME_SHORTCUT_KEY:"Key",
	CME_SHORTCUT_META:"Meta",
	CME_SHORTCUT_SHIFT:"Shift",
	CME_SORTED:"Sorted",
	CME_STRUCTURE_CONFIG:"StructureConfig",
	CME_SUBMENU:"Submenu",
	CME_SUBMENUS:"Submenus",
	CME_TYPE:"Type",
	CME_UI_CONTEXT:"UiContext"
};

oFF.CMECreatorJsonHelper = {

	addChildCreators:function(menuCreator, structure, subMenuMap, shortcutActions, cmeRegistry, controller)
	{
			let children = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_ITEMS);
		for (let i = 0; i < children.size(); i++)
		{
			let menuItemStructure = children.getStructureAt(i);
			let condition = oFF.CMECreatorJsonHelper.getCondition(menuItemStructure);
			if (oFF.notNull(condition))
			{
				let condCreator = oFF.CMEConditionalMenuCreator.create();
				condCreator.setContextCondition(condition);
				oFF.CMECreatorJsonHelper.createMenuCreator(condCreator, menuItemStructure, subMenuMap, shortcutActions, cmeRegistry, controller);
				menuCreator.addMenuCreator(condCreator);
			}
			else
			{
				oFF.CMECreatorJsonHelper.createMenuCreator(menuCreator, menuItemStructure, subMenuMap, shortcutActions, cmeRegistry, controller);
			}
		}
	},
	addParameterValues:function(dataProviderParameter, parameterStructure)
	{
			let valueList = parameterStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VALUES);
		if (oFF.XCollectionUtils.hasElements(valueList))
		{
			oFF.XCollectionUtils.forEach(valueList, (value) => {
				dataProviderParameter.addValue(value.asStructure().getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_NAME), value.asStructure().getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT));
			});
		}
	},
	checkCreateLoopCreator:function(menuCreator, menuItemStructure)
	{
			let resultCreator = menuCreator;
		if (menuItemStructure.hasStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_ITERATION))
		{
			let loopMenuCreator = oFF.CMELoopedMenuCreator.createLoop();
			loopMenuCreator.setLoopParameter(menuItemStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_ITERATION));
			loopMenuCreator.setSortLooping(menuItemStructure.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SORTED, true));
			menuCreator.addMenuCreator(loopMenuCreator);
			resultCreator = loopMenuCreator;
		}
		return resultCreator;
	},
	checkCreateRefocusCreator:function(menuCreator, menuItemStructure)
	{
			let resultCreator = menuCreator;
		if (menuItemStructure.hasStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_REFOCUS))
		{
			let refocusedMenuCreator = oFF.CMERefocusedMenuCreator.createRefocus();
			refocusedMenuCreator.setRefocusParameter(menuItemStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_REFOCUS));
			menuCreator.addMenuCreator(refocusedMenuCreator);
			resultCreator = refocusedMenuCreator;
		}
		return resultCreator;
	},
	createConditionLeaf:function(matchString, resolver, conditionalType)
	{
			let result = oFF.CMEContextConditionLeaf.create();
		result.setConditionalType(conditionalType);
		result.setComparison(resolver);
		result.setMatchString(matchString);
		return result;
	},
	createConditionalMenuCreator:function(structure, subMenuMap, shortcutActions, cmeRegistry, controller)
	{
			let menuCreator = oFF.CMEConditionalMenuCreator.create();
		let condition = oFF.CMEContextCondition.create();
		oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, structure);
		menuCreator.setContextCondition(condition);
		let name = structure.getStringByKey(oFF.CMECreatorJsonConstants.CME_NAME);
		if (oFF.isNull(name))
		{
			name = oFF.XGuid.getGuid();
		}
		menuCreator.setName(oFF.CMEValueLiteralResolver.create(oFF.XStringValue.create(name)));
		oFF.CMECreatorJsonHelper.addChildCreators(menuCreator, structure, subMenuMap, shortcutActions, cmeRegistry, controller);
		return menuCreator;
	},
	createConditionalMenuCreatorGroup:function(menus, subMenuMap, shortcutActions, cmeRegistry, controller)
	{
			let menuCreatorGroup = oFF.CMEConditionalMenuCreatorGroup.create();
		for (let i = 0; i < menus.size(); i++)
		{
			let structure = menus.getStructureAt(i);
			let conditionalMenuCreator = oFF.CMECreatorJsonHelper.createConditionalMenuCreator(structure, subMenuMap, shortcutActions, cmeRegistry, controller);
			menuCreatorGroup.addConditionalMenuCreator(conditionalMenuCreator);
		}
		return menuCreatorGroup;
	},
	createContextPathText:function(contextString)
	{
			let lastContextPathSegment = oFF.XString.substring(contextString, oFF.XString.lastIndexOf(contextString, oFF.CMECreatorJsonConstants.CME_CONTEXT_PATH_SEPARATOR) + 1, -1);
		return oFF.CMEValuePathResolver.create(oFF.XStringUtils.concatenate2(lastContextPathSegment, oFF.CMECreatorJsonConstants.CME_CONTEXT_TEXT_SUFFIX));
	},
	createLocalizableText:function(element)
	{
			let result = null;
		let simple;
		if (oFF.notNull(element) && element.isStructure())
		{
			simple = oFF.CMELocalizableTextCreatorSimple.create();
			result = simple;
			let structure = element.asStructure();
			simple.setKey(structure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_KEY));
			let list = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_REPLACEMENTS);
			if (oFF.XCollectionUtils.hasElements(list))
			{
				for (let i = 0; i < list.size(); i++)
				{
					simple.addReplacement(oFF.CMECreatorJsonHelper.createResolver(list.get(i)));
				}
			}
		}
		else if (oFF.notNull(element) && element.isList())
		{
			let compound = oFF.CMELocalizableTextCreatorContextCompound.create();
			result = compound;
			let elementList = element.asList();
			for (let j = 0; j < elementList.size(); j++)
			{
				let listElement = elementList.getStructureAt(j);
				compound.addReplacer(listElement.getStringByKey(oFF.CMECreatorJsonConstants.CME_MATCH_CONTEXT), oFF.CMECreatorJsonHelper.createLocalizableText(listElement));
			}
		}
		else if (oFF.notNull(element) && element.isString())
		{
			simple = oFF.CMELocalizableTextCreatorSimple.create();
			result = simple;
			simple.setKey(element.asString().getString());
		}
		return result;
	},
	createMatchCondition:function(conditionItem)
	{
			let condition = null;
		if (conditionItem.isString())
		{
			condition = oFF.CMECreatorJsonHelper.createConditionLeaf(conditionItem.asString().getString(), oFF.CMEValueLiteralResolver.getNullResolver(), oFF.CMEConditionalType.EXISTS);
		}
		else if (conditionItem.isStructure())
		{
			let conditionStructure = conditionItem.asStructure();
			if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_AND))
			{
				condition = oFF.CMECreatorJsonHelper.decorateAlgebraParameters(oFF.CMEContextConditionAlgebra.createAnd(), conditionStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_AND));
			}
			else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_OR))
			{
				condition = oFF.CMECreatorJsonHelper.decorateAlgebraParameters(oFF.CMEContextConditionAlgebra.createOr(), conditionStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_OR));
			}
			else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_NONE))
			{
				condition = oFF.CMECreatorJsonHelper.decorateAlgebraParameters(oFF.CMEContextConditionAlgebra.createNone(), conditionStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_NONE));
			}
			else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_NOT))
			{
				let notCondition = oFF.CMEContextConditionNot.create();
				notCondition.setBaseCondition(oFF.CMECreatorJsonHelper.createMatchCondition(conditionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_NOT)));
				condition = notCondition;
			}
			else
			{
				let conditionalType = oFF.CMEConditionalType.EXISTS;
				let resolver = oFF.CMEValueLiteralResolver.getNullResolver();
				let matchString = conditionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_MATCH);
				if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_MIN_SIZE))
				{
					conditionalType = oFF.CMEConditionalType.MIN_SIZE;
					resolver = oFF.CMECreatorJsonHelper.createResolver(conditionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_MIN_SIZE));
				}
				else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_MAX_SIZE))
				{
					conditionalType = oFF.CMEConditionalType.MAX_SIZE;
					resolver = oFF.CMECreatorJsonHelper.createResolver(conditionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_MAX_SIZE));
				}
				else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_EQUAL))
				{
					conditionalType = oFF.CMEConditionalType.EQUAL;
					resolver = oFF.CMECreatorJsonHelper.createResolver(conditionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_EQUAL));
				}
				else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_NOT_EQUAL))
				{
					conditionalType = oFF.CMEConditionalType.NOT_EQUAL;
					resolver = oFF.CMECreatorJsonHelper.createResolver(conditionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_NOT_EQUAL));
				}
				else if (conditionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_NOT_EXISTS))
				{
					conditionalType = oFF.CMEConditionalType.NOT_EXISTS;
				}
				condition = oFF.CMECreatorJsonHelper.createConditionLeaf(matchString, resolver, conditionalType);
			}
		}
		return condition;
	},
	createMenuCreator:function(menuCreator, menuItemStructure, subMenuMap, shortcutActions, cmeRegistry, controller)
	{
			let groupCreator;
		let remappedCreator;
		if (menuItemStructure.hasStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION))
		{
			remappedCreator = oFF.CMECreatorJsonHelper.checkCreateRefocusCreator(menuCreator, menuItemStructure);
			remappedCreator = oFF.CMECreatorJsonHelper.checkCreateLoopCreator(remappedCreator, menuItemStructure);
			oFF.CMECreatorJsonHelper.mapAction(remappedCreator, menuItemStructure, shortcutActions, cmeRegistry, controller);
		}
		else if (menuItemStructure.hasStringByKey(oFF.CMECreatorJsonConstants.CME_SUBMENU))
		{
			let submenuString = menuItemStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_SUBMENU);
			let subMenuStructure = subMenuMap.getByKey(submenuString);
			if (oFF.isNull(subMenuStructure) && controller.isLoggingEnabled())
			{
				oFF.XLogger.println(oFF.XStringUtils.concatenate2("Missing submenu config for: ", submenuString));
			}
			else
			{
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateRefocusCreator(menuCreator, menuItemStructure);
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateLoopCreator(remappedCreator, menuItemStructure);
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateRefocusCreator(remappedCreator, subMenuStructure);
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateLoopCreator(remappedCreator, subMenuStructure);
				groupCreator = oFF.CMEGroupCreator.create();
				remappedCreator.addMenuCreator(groupCreator);
				oFF.CMECreatorJsonHelper.setOverrideProperties(groupCreator, subMenuStructure);
				oFF.CMECreatorJsonHelper.setOverrideProperties(groupCreator, menuItemStructure);
				oFF.CMECreatorJsonHelper.addChildCreators(groupCreator, subMenuStructure, subMenuMap, shortcutActions, cmeRegistry, controller);
			}
		}
		else if (menuItemStructure.hasStringByKey(oFF.CMECreatorJsonConstants.CME_TYPE))
		{
			let typeString = menuItemStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_TYPE);
			if (oFF.XString.isEqual(typeString, oFF.CMECreatorJsonConstants.CME_SEPARATOR))
			{
				let separatorCreator = oFF.CMESeparatorCreator.create();
				menuCreator.addMenuCreator(separatorCreator);
				oFF.CMECreatorJsonHelper.setOverrideProperties(separatorCreator, menuItemStructure);
			}
			else if (oFF.XString.isEqual(typeString, oFF.CMECreatorJsonConstants.CME_SUBMENU))
			{
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateRefocusCreator(menuCreator, menuItemStructure);
				remappedCreator = oFF.CMECreatorJsonHelper.checkCreateLoopCreator(remappedCreator, menuItemStructure);
				groupCreator = oFF.CMEGroupCreator.create();
				remappedCreator.addMenuCreator(groupCreator);
				oFF.CMECreatorJsonHelper.setOverrideProperties(groupCreator, menuItemStructure);
				oFF.CMECreatorJsonHelper.addChildCreators(groupCreator, menuItemStructure, subMenuMap, shortcutActions, cmeRegistry, controller);
			}
		}
	},
	createMenuExtender:function(menuMenuExtensions, subMenuMap, globalShortcuts, cmeRegistry, controller)
	{
			let result = oFF.CMEMenuExtensionGroup.create();
		for (let i = 0; i < menuMenuExtensions.size(); i++)
		{
			let structure = menuMenuExtensions.getStructureAt(i);
			let extension = result.addNewExtension();
			let condition = oFF.CMEContextCondition.create();
			oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, structure);
			extension.setCondition(condition);
			let list = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_EXTENSION);
			if (oFF.XCollectionUtils.hasElements(list))
			{
				for (let j = 0; j < list.size(); j++)
				{
					let operation = extension.addNewOperation();
					let operationStructure = list.getStructureAt(j);
					let operationType = oFF.CMEMenuExtensionOperationType.lookup(operationStructure.getStringByKeyExt(oFF.CMECreatorJsonConstants.CME_OPERATION, oFF.CMECreatorJsonConstants.CME_OPERATION_REDEFINE));
					operation.setOperationType(operationType);
					operation.setReference(operationStructure.getStringByKeyExt(oFF.CMECreatorJsonConstants.CME_REFERENCE, oFF.CMECreatorJsonConstants.CME_REFERENCE_ROOT));
					condition = oFF.CMEContextCondition.create();
					oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, operationStructure);
					operation.setCondition(condition);
					let groupCreator = oFF.CMEGroupCreator.create();
					oFF.CMECreatorJsonHelper.addChildCreators(groupCreator, operationStructure, subMenuMap, globalShortcuts, cmeRegistry, controller);
					operation.setGroupCreator(groupCreator);
				}
			}
		}
		return result;
	},
	createMenuFilter:function(menuFilters)
	{
			let result = oFF.CMEMenuFilterList.create();
		for (let i = 0; i < menuFilters.size(); i++)
		{
			let j;
			let structure = menuFilters.getStructureAt(i);
			let filter = result.addNewMenuFilter();
			let condition = oFF.CMEContextCondition.create();
			oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, structure);
			filter.setCondition(condition);
			let list;
			if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_EXCLUDE))
			{
				list = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_EXCLUDE);
				for (j = 0; j < list.size(); j++)
				{
					oFF.CMECreatorJsonHelper.setupFilterOperation(filter.addNewExcludeOperation(), list.getStructureAt(j));
				}
			}
			if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_INCLUDE))
			{
				list = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_INCLUDE);
				for (j = 0; j < list.size(); j++)
				{
					oFF.CMECreatorJsonHelper.setupFilterOperation(filter.addNewIncludeOperation(), list.getStructureAt(j));
				}
			}
		}
		return result;
	},
	createMenuGenerator:function(menus, subMenuMap, shortcutActions, cmeRegistry, controller)
	{
			return oFF.CMECreatorJsonHelper.createConditionalMenuCreatorGroup(menus, subMenuMap, shortcutActions, cmeRegistry, controller);
	},
	createResolver:function(element)
	{
			return oFF.CMECreatorJsonHelper.createResolverExt(element, oFF.CMEValueLiteralResolver.getNullResolver());
	},
	createResolverExt:function(element, defaultResolver)
	{
			if (oFF.isNull(element))
		{
			return defaultResolver;
		}
		else if (element.isStructure() && element.asStructure().containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_RESOLVE))
		{
			return oFF.CMEValuePathResolver.create(element.asStructure().getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_RESOLVE));
		}
		else if (element.isList())
		{
			let elementList = element.asList();
			let resolver = oFF.CMEValueContextSwitchResolver.create();
			for (let i = 0; i < elementList.size(); i++)
			{
				let listElement = elementList.getStructureAt(i);
				resolver.addConditionalValue(listElement.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_RESOLVE), oFF.CMECreatorJsonHelper.createResolverExt(listElement, defaultResolver));
			}
			return resolver;
		}
		else
		{
			return oFF.CMEValueLiteralResolver.create(element.copyAsPrimitiveXValue());
		}
	},
	decorateAlgebraParameters:function(condition, subConditionList)
	{
			for (let i = 0; i < subConditionList.size(); i++)
		{
			condition.addSubCondition(oFF.CMECreatorJsonHelper.createMatchCondition(subConditionList.get(i)));
		}
		return condition;
	},
	defineActionParameter:function(command, parameterStructure)
	{
			let cardinalityType = parameterStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TYPE);
		let name = parameterStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_NAME);
		let valueContext = parameterStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VALUE_CONTEXT);
		if (oFF.XString.isEqual(cardinalityType, oFF.CMECreatorJsonConstants.CME_PARAMETER_TYPE_SINGLE))
		{
			command.addSingleValueParameter(name, parameterStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VALUE), valueContext);
		}
		else if (oFF.XString.isEqual(cardinalityType, oFF.CMECreatorJsonConstants.CME_PARAMETER_TYPE_SPLIT))
		{
			oFF.CMECreatorJsonHelper.addParameterValues(command.addSplitParameter(name, valueContext), parameterStructure);
		}
		else if (oFF.XString.isEqual(cardinalityType, oFF.CMECreatorJsonConstants.CME_PARAMETER_TYPE_LIST))
		{
			oFF.CMECreatorJsonHelper.addParameterValues(command.addListParameter(name, valueContext), parameterStructure);
		}
		else if (oFF.XString.isEqual(cardinalityType, oFF.CMECreatorJsonConstants.CME_PARAMETER_TYPE_COLLECT))
		{
			oFF.CMECreatorJsonHelper.addParameterValues(command.addCollectParameter(name, valueContext), parameterStructure);
		}
	},
	defineActionParameters:function(command, parameterList)
	{
			let size = oFF.XCollectionUtils.size(parameterList);
		for (let i = 0; i < size; i++)
		{
			oFF.CMECreatorJsonHelper.defineActionParameter(command, parameterList.getStructureAt(i));
		}
	},
	defineCommand:function(action, commandStructure)
	{
			let command = action.addNewCommand(commandStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_NAME));
		if (commandStructure.containsKey(oFF.CMECreatorJsonConstants.CME_ACTION_PARAMETERS))
		{
			oFF.CMECreatorJsonHelper.defineActionParameters(command, commandStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_ACTION_PARAMETERS));
		}
	},
	defineCommands:function(action, commandList)
	{
			let size = oFF.XCollectionUtils.size(commandList);
		for (let i = 0; i < size; i++)
		{
			oFF.CMECreatorJsonHelper.defineCommand(action, commandList.getStructureAt(i));
		}
	},
	defineCustomAction:function(actionStructure, registry)
	{
			let name = actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_NAME);
		let commandExecutorContext = actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION_COMMAND_EXECUTOR_CONTEXT);
		let action = oFF.CMEDataProviderMenuAction.create(name, commandExecutorContext);
		action.setSplitParameter(actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION_SPLIT_PARAMETER_CONTEXT));
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY))
		{
			action.setLocalizableTextCreator(oFF.CMECreatorJsonHelper.createLocalizableText(actionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY)));
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT))
		{
			action.setTextProvider((t) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION))
		{
			action.setExplanationProvider((expl) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY))
		{
			action.setLocalizableExplanationCreator(oFF.CMECreatorJsonHelper.createLocalizableText(actionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY)));
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON))
		{
			action.setIconProvider((ic) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID))
		{
			action.setDataHelpIdProvider((ic) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VISIBLE))
		{
			let visible = oFF.CMEContextCondition.create();
			oFF.CMECreatorJsonHelper.setupConditionFromStructure(visible, actionStructure.getStructureByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VISIBLE));
			action.setVisibleCondition(visible);
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ENABLED))
		{
			let enabled = oFF.CMEContextCondition.create();
			oFF.CMECreatorJsonHelper.setupConditionFromStructure(enabled, actionStructure.getStructureByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ENABLED));
			action.setEnabledCondition(enabled);
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_ACTION_COMMANDS))
		{
			oFF.CMECreatorJsonHelper.defineCommands(action, actionStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_ACTION_COMMANDS));
		}
		registry.registerAction(name, action);
		return action;
	},
	defineCustomActionGroup:function(actionStructure, registry)
	{
			let name = actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_NAME);
		let group = oFF.CMEActionGroup.create();
		group.setNameProvider((n) => {
			return name;
		});
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY))
		{
			group.setLocalizableTextCreator(oFF.CMECreatorJsonHelper.createLocalizableText(actionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY)));
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT))
		{
			group.setTextProvider((t) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION))
		{
			group.setExplanationProvider((expl) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY))
		{
			group.setLocalizableExplanationCreator(oFF.CMECreatorJsonHelper.createLocalizableText(actionStructure.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY)));
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON))
		{
			group.setIconProvider((ic) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON);
			});
		}
		if (actionStructure.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID))
		{
			group.setDataHelpIdProvider((ic) => {
				return actionStructure.getStringByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID);
			});
		}
		let itemList = actionStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_ITEMS);
		let listSize = oFF.XCollectionUtils.size(itemList);
		for (let i = 0; i < listSize; i++)
		{
			let action = itemList.getStructureAt(i);
			if (oFF.XString.isEqual(action.getStringByKey(oFF.CMECreatorJsonConstants.CME_TYPE), oFF.CMECreatorJsonConstants.CME_ACTION_GROUP))
			{
				group.addAction(oFF.CMECreatorJsonHelper.defineCustomActionGroup(action, registry));
			}
			else if (action.containsKey(oFF.CMECreatorJsonConstants.CME_ACTION))
			{
				group.addAction(registry.getAction(action.getStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION)));
			}
			else
			{
				group.addAction(oFF.CMECreatorJsonHelper.defineCustomAction(action, registry));
			}
		}
		registry.registerAction(name, group);
		return group;
	},
	defineCustomActions:function(actionList, registry)
	{
			let size = oFF.XCollectionUtils.size(actionList);
		for (let i = 0; i < size; i++)
		{
			let action = actionList.getStructureAt(i);
			if (oFF.XString.isEqual(action.getStringByKey(oFF.CMECreatorJsonConstants.CME_TYPE), oFF.CMECreatorJsonConstants.CME_ACTION_GROUP))
			{
				oFF.CMECreatorJsonHelper.defineCustomActionGroup(action, registry);
			}
			else
			{
				oFF.CMECreatorJsonHelper.defineCustomAction(action, registry);
			}
		}
	},
	getCondition:function(structure)
	{
			let condition = null;
		if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_MENU_NAMES) || structure.containsKey(oFF.CMECreatorJsonConstants.CME_UI_CONTEXT) || structure.containsKey(oFF.CMECreatorJsonConstants.CME_DATA_CONTEXT))
		{
			condition = oFF.CMEContextCondition.create();
			oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, structure);
		}
		return condition;
	},
	lookupShortcutAction:function(subItem, registry, controller)
	{
			let actionString = subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION);
		let action = registry.getAction(actionString);
		if (oFF.isNull(action))
		{
			if (controller.isLoggingEnabled())
			{
				oFF.XLogger.println(oFF.XStringUtils.concatenate3("Adding dummy action ", actionString, " to registry"));
			}
			action = oFF.CMETriggerAction.create();
			action.setNameProvider((c) => {
				return actionString;
			});
			registry.registerAction(actionString, action);
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_SHORTCUT_KEY) && subItem.containsKey(oFF.CMECreatorJsonConstants.CME_SHORTCUT_CODE))
		{
			let shortCut = action.setupKeyboardShortcut();
			shortCut.setKey(subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_SHORTCUT_KEY));
			shortCut.setCode(subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_SHORTCUT_CODE));
			shortCut.setAltPressed(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SHORTCUT_ALT, false));
			shortCut.setMetaPressed(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SHORTCUT_META, false));
			shortCut.setShiftPressed(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SHORTCUT_SHIFT, false));
			shortCut.setCtrlPressed(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SHORTCUT_CTRL, false));
			shortCut.setCommandOrControlPressedSystemSpecific(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_SHORTCUT_COMMAND_OR_CTRL, false));
		}
		return action;
	},
	mapAction:function(groupCreator, subItem, shortcutActions, registry, controller)
	{
			let actionString = subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_ACTION);
		let action = registry.getAction(actionString);
		let subCreator;
		if (oFF.isNull(action))
		{
			if (controller.isLoggingEnabled())
			{
				oFF.XLogger.println(oFF.XStringUtils.concatenate3("Adding dummy action ", actionString, " to registry"));
			}
			action = oFF.CMETriggerAction.create();
			action.setNameProvider((c) => {
				return actionString;
			});
			registry.registerAction(actionString, action);
			subCreator = action.mapToMenuCreator(controller);
		}
		else
		{
			subCreator = action.mapToMenuCreator(controller);
			if (action.isSimpleAction() && shortcutActions.contains(action))
			{
				subCreator.transferShortcut(action.getKeyboardShortcut());
			}
			if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_ITEMS) && subCreator.isGroupCreator())
			{
				let optionList = subItem.getListByKey(oFF.CMECreatorJsonConstants.CME_ITEMS);
				for (let i = 0; i < optionList.size(); i++)
				{
					let optionElement = optionList.getStructureAt(i);
					if (optionElement.hasStringByKey(oFF.CMECreatorJsonConstants.CME_OPTION))
					{
						let option = registry.getOption(optionElement.getStringByKey(oFF.CMECreatorJsonConstants.CME_OPTION));
						if (oFF.notNull(option))
						{
							let optionSub = option.mapToMenuCreator(controller);
							oFF.CMECreatorJsonHelper.setOverrideProperties(optionSub, optionElement);
							subCreator.addMenuCreator(optionSub);
						}
					}
				}
			}
		}
		groupCreator.addMenuCreator(subCreator);
		oFF.CMECreatorJsonHelper.setOverrideProperties(subCreator, subItem);
	},
	remapShortcutActions:function(globalShortcuts, registry, controller)
	{
			let simpleActions = oFF.XList.create();
		if (oFF.XCollectionUtils.hasElements(globalShortcuts))
		{
			for (let i = 0; i < globalShortcuts.size(); i++)
			{
				simpleActions.add(oFF.CMECreatorJsonHelper.lookupShortcutAction(globalShortcuts.getStructureAt(i), registry, controller));
			}
		}
		return simpleActions;
	},
	remapSubMenuDefinitions:function(subMenusList)
	{
			let subMenuMap = oFF.XHashMapByString.create();
		if (oFF.XCollectionUtils.hasElements(subMenusList))
		{
			for (let i = 0; i < subMenusList.size(); i++)
			{
				let subMenuStruct = subMenusList.getStructureAt(i);
				subMenuMap.put(subMenuStruct.getStringByKey(oFF.CMECreatorJsonConstants.CME_NAME), subMenuStruct);
			}
		}
		return subMenuMap;
	},
	setOverrideProperties:function(subCreator, subItem)
	{
			if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_REFOCUS) && (subCreator.getText() === null || subCreator.getText() === oFF.CMEValueLiteralResolver.getNullResolver() || subItem.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_ACQUIRE_TEXT_FROM_CONTEXT)))
		{
			subCreator.setLocalizableText(null);
			subCreator.setText(oFF.CMECreatorJsonHelper.createContextPathText(subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_REFOCUS)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_ITERATION) && (subCreator.getText() === null || subCreator.getText() === oFF.CMEValueLiteralResolver.getNullResolver() || subItem.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_ACQUIRE_TEXT_FROM_CONTEXT)))
		{
			subCreator.setLocalizableText(null);
			subCreator.setText(oFF.CMECreatorJsonHelper.createContextPathText(subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_CONTEXT_ITERATION)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_NAME))
		{
			subCreator.setName(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_NAME)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY))
		{
			subCreator.setText(null);
			subCreator.setLocalizableText(oFF.CMECreatorJsonHelper.createLocalizableText(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_LOCALIZATION_KEY)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT))
		{
			subCreator.setLocalizableText(null);
			subCreator.setText(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_TEXT)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION))
		{
			subCreator.setLocalizableExplanation(null);
			subCreator.setExplanation(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON))
		{
			subCreator.setIcon(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ICON)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID))
		{
			subCreator.setDataHelpId(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DATA_HELP_ID)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ENABLED))
		{
			subCreator.addEnabledConstraint(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_ENABLED), oFF.CMEValueLiteralResolver.getTrueResolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VISIBLE))
		{
			subCreator.addVisibleConstraint(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_VISIBLE), oFF.CMEValueLiteralResolver.getTrueResolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FLAT))
		{
			subCreator.setFlatIfLessThanNItems(subItem.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FLAT) ? oFF.CMEValueLiteralResolver.getMinus1Resolver() : oFF.CMEValueLiteralResolver.getPlus1Resolver());
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EAGER))
		{
			subCreator.setEager(subItem.getBooleanByKeyExt(oFF.CMECreatorJsonConstants.CME_PARAMETER_EAGER, false));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FLAT_IF_LESS_THAN_N_ITEMS))
		{
			subCreator.setFlatIfLessThanNItems(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FLAT_IF_LESS_THAN_N_ITEMS), oFF.CMEValueLiteralResolver.getPlus1Resolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_KEEP_TITLE_FOR_FLAT))
		{
			subCreator.setKeepTitleForFlat(subItem.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_KEEP_TITLE_FOR_FLAT));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FIRST_SUBOPTION_IS_DEFAULT))
		{
			subCreator.setFirstSubOptionIsDefault(subItem.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_FIRST_SUBOPTION_IS_DEFAULT));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_HIDE_IF_LESS_THAN_N_ITEMS))
		{
			subCreator.setHideIfLessThanNItems(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_HIDE_IF_LESS_THAN_N_ITEMS), oFF.CMEValueLiteralResolver.getPlus1Resolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ITEMS))
		{
			subCreator.setDisableIfLessThanNItems(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ITEMS), oFF.CMEValueLiteralResolver.getPlus1Resolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ENABLED_ITEMS))
		{
			subCreator.setDisableIfLessThanNEnabledItems(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_DISABLE_IF_LESS_THAN_N_ENABLED_ITEMS), oFF.CMEValueLiteralResolver.getPlus1Resolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY))
		{
			switch (subItem.getStringByKey(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY))
			{
				case oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_ALWAYS:
					subCreator.setOverflowPriority(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_ALWAYS_VALUE);
					break;

				case oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_DISAPPEAR:
					subCreator.setOverflowPriority(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_DISAPPEAR_VALUE);
					break;

				case oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_HIGH:
					subCreator.setOverflowPriority(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_HIGH_VALUE);
					break;

				case oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_LOW:
					subCreator.setOverflowPriority(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_LOW_VALUE);
					break;

				case oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_NEVER:
					subCreator.setOverflowPriority(oFF.CMECreatorJsonConstants.CME_OVERFLOW_PRIORITY_NEVER_VALUE);
					break;
			}
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_IF_MORE_THAN_N_ITEMS))
		{
			subCreator.setOverflowIfMoreThanNItems(oFF.CMECreatorJsonHelper.createResolverExt(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_IF_MORE_THAN_N_ITEMS), oFF.CMEValueLiteralResolver.getMinus1Resolver()));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_TEXT))
		{
			subCreator.setOverflowText(oFF.CMECreatorJsonHelper.createResolver(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_TEXT)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_LOCALIZATION_KEY))
		{
			subCreator.setOverflowLocalizableText(oFF.CMECreatorJsonHelper.createLocalizableText(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_OVERFLOW_LOCALIZATION_KEY)));
		}
		if (subItem.containsKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY))
		{
			subCreator.setLocalizableExplanation(oFF.CMECreatorJsonHelper.createLocalizableText(subItem.getByKey(oFF.CMECreatorJsonConstants.CME_PARAMETER_EXPLANATION_LOCALIZATION_KEY)));
		}
	},
	setupConditionFromStructure:function(condition, structure)
	{
			let j;
		if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_MENU_NAMES))
		{
			let menuNames = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_MENU_NAMES);
			for (j = 0; j < menuNames.size(); j++)
			{
				condition.addMatchingMenuName(menuNames.getStringAt(j));
			}
		}
		if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_UI_CONTEXT))
		{
			let uiContext = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_UI_CONTEXT);
			for (j = 0; j < uiContext.size(); j++)
			{
				condition.addMatchingUiContext(uiContext.getStringAt(j));
			}
		}
		if (structure.containsKey(oFF.CMECreatorJsonConstants.CME_DATA_CONTEXT))
		{
			let dataContext = structure.getListByKey(oFF.CMECreatorJsonConstants.CME_DATA_CONTEXT);
			for (j = 0; j < dataContext.size(); j++)
			{
				condition.addMatchingDataContext(dataContext.getStringAt(j));
			}
		}
	},
	setupFilterOperation:function(operation, structure)
	{
			let condition = oFF.CMEContextCondition.create();
		oFF.CMECreatorJsonHelper.setupConditionFromStructure(condition, structure);
		operation.setCondition(condition);
		operation.setPath(structure.getStringByKey(oFF.CMECreatorJsonConstants.CME_ITEM));
	}
};

oFF.CMEContextAccess = function() {};
oFF.CMEContextAccess.prototype = new oFF.XObject();
oFF.CMEContextAccess.prototype._ff_c = "CMEContextAccess";

oFF.CMEContextAccess.ENVIRONMENT = "ENVIRONMENT";
oFF.CMEContextAccess.NAME = "NAME";
oFF.CMEContextAccess.PARAMETERS = "PARAMETERS";
oFF.CMEContextAccess.TEXT = "TEXT";
oFF.CMEContextAccess.TYPE = "TYPE";
oFF.CMEContextAccess.VALUE = "VALUE";
oFF.CMEContextAccess.createFromPrototype = function(context)
{
	let instance = new oFF.CMEContextAccess();
	instance.m_prStructure = oFF.PrFactory.createStructureDeepCopy(context.m_prStructure);
	instance.m_globalContext = context.m_globalContext;
	instance.m_localContext = context.m_localContext;
	instance.m_uiContext = context.m_uiContext;
	return instance;
};
oFF.CMEContextAccess.createWithContextAndEnvironment = function(globalContext, environment)
{
	let instance = new oFF.CMEContextAccess();
	instance.setup();
	instance.setGlobalContext(globalContext);
	instance.setLocalContext(globalContext);
	instance.setEnvironment(environment);
	return instance;
};
oFF.CMEContextAccess.createWithDataAndUiContext = function(dataContext, uiContext)
{
	let instance = new oFF.CMEContextAccess();
	instance.setup();
	instance.setGlobalContext(dataContext);
	instance.setLocalContext(dataContext);
	instance.setUiContext(uiContext);
	return instance;
};
oFF.CMEContextAccess.prototype.m_globalContext = null;
oFF.CMEContextAccess.prototype.m_localContext = null;
oFF.CMEContextAccess.prototype.m_prStructure = null;
oFF.CMEContextAccess.prototype.m_uiContext = null;
oFF.CMEContextAccess.prototype.getCopy = function()
{
	return oFF.CMEContextAccess.createFromPrototype(this);
};
oFF.CMEContextAccess.prototype.getEnvironment = function()
{
	return this.m_prStructure.getStructureByKey(oFF.CMEContextAccess.ENVIRONMENT);
};
oFF.CMEContextAccess.prototype.getGlobalContext = function()
{
	return this.m_globalContext;
};
oFF.CMEContextAccess.prototype.getGlobalSubContexts = function(accessor)
{
	return this.m_globalContext.filterSubContextsRecursive(accessor);
};
oFF.CMEContextAccess.prototype.getLocalContext = function()
{
	return this.m_localContext;
};
oFF.CMEContextAccess.prototype.getLocalSubContexts = function(accessor)
{
	return this.m_localContext.filterSubContextsRecursive(accessor);
};
oFF.CMEContextAccess.prototype.getParameters = function()
{
	return this.m_prStructure.getStructureByKey(oFF.CMEContextAccess.PARAMETERS);
};
oFF.CMEContextAccess.prototype.getSingleGlobalSubContext = function(accessor)
{
	let subContexts = this.getGlobalSubContexts(accessor);
	let result = null;
	if (oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() === 1)
	{
		result = subContexts.get(0);
	}
	return result;
};
oFF.CMEContextAccess.prototype.getSingleLocalSubContext = function(accessor)
{
	let subContexts = this.getLocalSubContexts(accessor);
	let result = null;
	if (oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() === 1)
	{
		result = subContexts.get(0);
	}
	return result;
};
oFF.CMEContextAccess.prototype.getSingleSubContext = function(accessor)
{
	let subContexts = this.getSubContexts(accessor);
	let result = null;
	if (oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() === 1)
	{
		result = subContexts.get(0);
	}
	return result;
};
oFF.CMEContextAccess.prototype.getStructure = function()
{
	return this.m_prStructure;
};
oFF.CMEContextAccess.prototype.getSubContext = function(subContextKeys)
{
	let subContext = this;
	if (oFF.XCollectionUtils.hasElements(subContextKeys))
	{
		subContext = this.getCopy();
		for (let i = 0; i < subContextKeys.size(); i++)
		{
			let subContextKey = subContextKeys.get(i);
			let subContexts = this.getSubContexts(subContextKey);
			if (oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() === 1)
			{
				subContext.setLocalContext(subContexts.get(0));
			}
			else
			{
				subContext = null;
				break;
			}
		}
	}
	return subContext;
};
oFF.CMEContextAccess.prototype.getSubContexts = function(accessor)
{
	let subContexts = this.m_localContext.filterSubContextsRecursive(accessor);
	if (!oFF.XCollectionUtils.hasElements(subContexts))
	{
		subContexts = this.m_globalContext.filterSubContextsRecursive(accessor);
	}
	return subContexts;
};
oFF.CMEContextAccess.prototype.getUiContext = function()
{
	return this.m_uiContext;
};
oFF.CMEContextAccess.prototype.getValue = function()
{
	return this.m_prStructure.getByKey(oFF.CMEContextAccess.VALUE);
};
oFF.CMEContextAccess.prototype.resolveValue = function(expression)
{
	let result = null;
	if (oFF.XString.startsWith(expression, oFF.CMEConstants.VAR_PREFIX))
	{
		let contextPath = oFF.PrUtilsJsonPath.getJsonPathElements(this.getStructure(), expression);
		let jsonResult = oFF.PrUtilsJsonPath.getJsonPathSingleElement(contextPath);
		result = oFF.isNull(jsonResult) ? null : jsonResult.copyAsPrimitiveXValue();
	}
	else
	{
		let endsWithType = oFF.XString.endsWith(expression, oFF.CMEContextAccess.TYPE);
		let endsWithName = !endsWithType && oFF.XString.endsWith(expression, oFF.CMEContextAccess.NAME);
		let endsWithText = !endsWithType && !endsWithName && oFF.XString.endsWith(expression, oFF.CMEContextAccess.TEXT);
		let size = oFF.XString.size(expression);
		let subContexts = null;
		if (endsWithType)
		{
			subContexts = this.getSubContexts(oFF.XString.substring(expression, 0, size - oFF.XString.size(oFF.CMEContextAccess.TYPE) - 1));
		}
		else if (endsWithName)
		{
			subContexts = this.getSubContexts(oFF.XString.substring(expression, 0, size - oFF.XString.size(oFF.CMEContextAccess.NAME) - 1));
		}
		else if (endsWithText)
		{
			subContexts = this.getSubContexts(oFF.XString.substring(expression, 0, size - oFF.XString.size(oFF.CMEContextAccess.TEXT) - 1));
		}
		if (oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() === 1)
		{
			let subContext = subContexts.get(0);
			if (endsWithType)
			{
				result = oFF.XStringValue.create(subContext.getType());
			}
			else if (endsWithName)
			{
				result = oFF.XStringValue.create(subContext.getName());
			}
			else if (endsWithText)
			{
				result = oFF.XStringValue.create(subContext.getText());
			}
		}
	}
	return result;
};
oFF.CMEContextAccess.prototype.setEnvironment = function(environment)
{
	this.m_prStructure.put(oFF.CMEContextAccess.ENVIRONMENT, environment);
};
oFF.CMEContextAccess.prototype.setGlobalContext = function(globalContext)
{
	this.m_globalContext = globalContext;
};
oFF.CMEContextAccess.prototype.setLocalContext = function(localContext)
{
	this.m_localContext = localContext;
};
oFF.CMEContextAccess.prototype.setParameters = function(parameters)
{
	this.m_prStructure.put(oFF.CMEContextAccess.PARAMETERS, parameters);
};
oFF.CMEContextAccess.prototype.setUiContext = function(uiContext)
{
	this.m_uiContext = uiContext;
};
oFF.CMEContextAccess.prototype.setValue = function(value)
{
	this.m_prStructure.put(oFF.CMEContextAccess.VALUE, value);
};
oFF.CMEContextAccess.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_prStructure = oFF.PrFactory.createStructure();
};

oFF.CMEContextCondition = function() {};
oFF.CMEContextCondition.prototype = new oFF.XObject();
oFF.CMEContextCondition.prototype._ff_c = "CMEContextCondition";

oFF.CMEContextCondition.AND_OPERATOR_STRING = "&&";
oFF.CMEContextCondition.NOT_OPERATOR_STRING = "!";
oFF.CMEContextCondition.create = function()
{
	let instance = new oFF.CMEContextCondition();
	instance.setup();
	return instance;
};
oFF.CMEContextCondition.prototype.m_dataContextCondition = null;
oFF.CMEContextCondition.prototype.m_menuNames = null;
oFF.CMEContextCondition.prototype.m_uiContexts = null;
oFF.CMEContextCondition.prototype.addMatchingDataContext = function(dataContextString)
{
	let tokenizationResult = oFF.XStringTokenizer.splitString(dataContextString, oFF.CMEContextCondition.AND_OPERATOR_STRING);
	if (oFF.XCollectionUtils.hasElements(tokenizationResult))
	{
		if (tokenizationResult.size() === 1)
		{
			this.m_dataContextCondition.addSubCondition(this.parseLeafCondition(tokenizationResult.get(0)));
		}
		else
		{
			let conditionList = oFF.CMEContextConditionAlgebra.createAnd();
			for (let i = 0; i < tokenizationResult.size(); i++)
			{
				conditionList.addSubCondition(this.parseLeafCondition(tokenizationResult.get(i)));
			}
			this.m_dataContextCondition.addSubCondition(conditionList);
		}
	}
};
oFF.CMEContextCondition.prototype.addMatchingMenuName = function(menuName)
{
	this.m_menuNames.add(menuName);
};
oFF.CMEContextCondition.prototype.addMatchingUiContext = function(uiContext)
{
	this.m_uiContexts.add(uiContext);
};
oFF.CMEContextCondition.prototype.checkStringWithWildCardListMatch = function(list, matchElement)
{
	let match = true;
	if (oFF.XCollectionUtils.hasElements(list))
	{
		match = false;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(matchElement))
		{
			for (let i = 0; i < list.size(); i++)
			{
				if (oFF.XStringUtils.isWildcardPatternMatching(matchElement, list.get(i)))
				{
					match = true;
					break;
				}
			}
		}
	}
	return match;
};
oFF.CMEContextCondition.prototype.matches = function(contextAccess, menuName)
{
	let match = true;
	match = match && this.m_dataContextCondition.checkCondition(contextAccess);
	match = match && this.checkStringWithWildCardListMatch(this.m_uiContexts, contextAccess.getUiContext());
	match = match && this.checkStringWithWildCardListMatch(this.m_menuNames, menuName);
	return match;
};
oFF.CMEContextCondition.prototype.parseLeafCondition = function(string)
{
	let trimmedString = oFF.XString.trim(string);
	let result;
	let leafCondition;
	if (oFF.XString.startsWith(trimmedString, oFF.CMEContextCondition.NOT_OPERATOR_STRING))
	{
		let notCondition = oFF.CMEContextConditionNot.create();
		leafCondition = oFF.CMEContextConditionLeaf.create();
		leafCondition.setMatchString(oFF.XString.trim(oFF.XString.substring(trimmedString, oFF.XString.size(oFF.CMEContextCondition.NOT_OPERATOR_STRING), oFF.XString.size(trimmedString))));
		leafCondition.setConditionalType(oFF.CMEConditionalType.EXISTS);
		notCondition.setBaseCondition(leafCondition);
		result = notCondition;
	}
	else
	{
		leafCondition = oFF.CMEContextConditionLeaf.create();
		leafCondition.setMatchString(oFF.XString.trim(trimmedString));
		leafCondition.setConditionalType(oFF.CMEConditionalType.EXISTS);
		result = leafCondition;
	}
	return result;
};
oFF.CMEContextCondition.prototype.releaseObject = function()
{
	this.m_uiContexts = oFF.XObjectExt.release(this.m_uiContexts);
	this.m_menuNames = oFF.XObjectExt.release(this.m_menuNames);
	this.m_dataContextCondition = oFF.XObjectExt.release(this.m_dataContextCondition);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEContextCondition.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_uiContexts = oFF.XList.create();
	this.m_menuNames = oFF.XList.create();
	this.m_dataContextCondition = oFF.CMEContextConditionAlgebra.createOr();
};

oFF.CMEContextConditionAbstract = function() {};
oFF.CMEContextConditionAbstract.prototype = new oFF.XObject();
oFF.CMEContextConditionAbstract.prototype._ff_c = "CMEContextConditionAbstract";


oFF.CMEMenuDefinition = function() {};
oFF.CMEMenuDefinition.prototype = new oFF.XObject();
oFF.CMEMenuDefinition.prototype._ff_c = "CMEMenuDefinition";

oFF.CMEMenuDefinition.create = function()
{
	let instance = new oFF.CMEMenuDefinition();
	instance.setup();
	return instance;
};
oFF.CMEMenuDefinition.prototype.m_condition = null;
oFF.CMEMenuDefinition.prototype.m_groupCreator = null;
oFF.CMEMenuDefinition.prototype.m_menuName = null;
oFF.CMEMenuDefinition.prototype.createMenu = function(contextAccess)
{
	let groupingMenuItem = oFF.CMEGroupingMenuItem.create();
	groupingMenuItem.setName(this.m_menuName);
	this.m_groupCreator.transform(contextAccess, groupingMenuItem);
	return groupingMenuItem;
};
oFF.CMEMenuDefinition.prototype.getCondition = function()
{
	return this.m_condition;
};
oFF.CMEMenuDefinition.prototype.getMenuName = function()
{
	return this.m_menuName;
};
oFF.CMEMenuDefinition.prototype.isApplicableTo = function(contextAccess)
{
	return this.m_condition.matches(contextAccess, null);
};
oFF.CMEMenuDefinition.prototype.releaseObject = function()
{
	this.m_groupCreator = oFF.XObjectExt.release(this.m_groupCreator);
	this.m_menuName = null;
	this.m_condition = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuDefinition.prototype.setCondition = function(condition)
{
	this.m_condition = condition;
};
oFF.CMEMenuDefinition.prototype.setMenuName = function(menuName)
{
	this.m_menuName = menuName;
};
oFF.CMEMenuDefinition.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
};

oFF.CMEMenuDefinitionGroup = function() {};
oFF.CMEMenuDefinitionGroup.prototype = new oFF.XObject();
oFF.CMEMenuDefinitionGroup.prototype._ff_c = "CMEMenuDefinitionGroup";

oFF.CMEMenuDefinitionGroup.create = function()
{
	let instance = new oFF.CMEMenuDefinitionGroup();
	instance.setup();
	return instance;
};
oFF.CMEMenuDefinitionGroup.prototype.m_definitions = null;
oFF.CMEMenuDefinitionGroup.prototype.addNewDefinition = function()
{
	let newExtension = oFF.CMEMenuDefinition.create();
	this.m_definitions.add(newExtension);
	return newExtension;
};
oFF.CMEMenuDefinitionGroup.prototype.createMenu = function(contextAccess)
{
	let result = oFF.CMEGroupingMenuItem.create();
	for (let i = 0; i < this.m_definitions.size(); i++)
	{
		let definition = this.m_definitions.get(i);
		if (definition.isApplicableTo(contextAccess))
		{
			result = definition.createMenu(contextAccess);
			break;
		}
	}
	return result;
};
oFF.CMEMenuDefinitionGroup.prototype.releaseObject = function()
{
	this.m_definitions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_definitions);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuDefinitionGroup.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_definitions = oFF.XList.create();
};

oFF.CMEMenuExtension = function() {};
oFF.CMEMenuExtension.prototype = new oFF.XObject();
oFF.CMEMenuExtension.prototype._ff_c = "CMEMenuExtension";

oFF.CMEMenuExtension.create = function()
{
	let instance = new oFF.CMEMenuExtension();
	instance.setup();
	return instance;
};
oFF.CMEMenuExtension.prototype.m_condition = null;
oFF.CMEMenuExtension.prototype.m_operations = null;
oFF.CMEMenuExtension.prototype.addNewOperation = function()
{
	let newOperation = oFF.CMEMenuExtensionOperation.create();
	this.m_operations.add(newOperation);
	return newOperation;
};
oFF.CMEMenuExtension.prototype.extend = function(inputItem)
{
	for (let i = 0; i < this.m_operations.size(); i++)
	{
		let operation = this.m_operations.get(i);
		if (operation.isApplicableTo(inputItem))
		{
			operation.extend(inputItem);
		}
	}
};
oFF.CMEMenuExtension.prototype.getCondition = function()
{
	return this.m_condition;
};
oFF.CMEMenuExtension.prototype.isApplicableTo = function(inputItem)
{
	return this.m_condition.matches(inputItem.getContext(), inputItem.getName());
};
oFF.CMEMenuExtension.prototype.releaseObject = function()
{
	this.m_operations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_operations);
	this.m_condition = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuExtension.prototype.setCondition = function(condition)
{
	this.m_condition = condition;
};
oFF.CMEMenuExtension.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_operations = oFF.XList.create();
};

oFF.CMEMenuExtensionGroup = function() {};
oFF.CMEMenuExtensionGroup.prototype = new oFF.XObject();
oFF.CMEMenuExtensionGroup.prototype._ff_c = "CMEMenuExtensionGroup";

oFF.CMEMenuExtensionGroup.create = function()
{
	let instance = new oFF.CMEMenuExtensionGroup();
	instance.setup();
	return instance;
};
oFF.CMEMenuExtensionGroup.prototype.m_extensions = null;
oFF.CMEMenuExtensionGroup.prototype.addNewExtension = function()
{
	let newExtension = oFF.CMEMenuExtension.create();
	this.m_extensions.add(newExtension);
	return newExtension;
};
oFF.CMEMenuExtensionGroup.prototype.extendMenu = function(inputItem)
{
	for (let i = 0; i < this.m_extensions.size(); i++)
	{
		let extension = this.m_extensions.get(i);
		if (extension.isApplicableTo(inputItem))
		{
			extension.extend(inputItem);
			break;
		}
	}
};
oFF.CMEMenuExtensionGroup.prototype.releaseObject = function()
{
	this.m_extensions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_extensions);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuExtensionGroup.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_extensions = oFF.XList.create();
};

oFF.CMEMenuExtensionOperation = function() {};
oFF.CMEMenuExtensionOperation.prototype = new oFF.XObject();
oFF.CMEMenuExtensionOperation.prototype._ff_c = "CMEMenuExtensionOperation";

oFF.CMEMenuExtensionOperation.create = function()
{
	let instance = new oFF.CMEMenuExtensionOperation();
	instance.setup();
	return instance;
};
oFF.CMEMenuExtensionOperation.prototype.m_condition = null;
oFF.CMEMenuExtensionOperation.prototype.m_groupCreator = null;
oFF.CMEMenuExtensionOperation.prototype.m_operationType = null;
oFF.CMEMenuExtensionOperation.prototype.m_reference = null;
oFF.CMEMenuExtensionOperation.prototype.applyOperation = function(abstractItem, subItems)
{
	if (this.m_operationType === oFF.CMEMenuExtensionOperationType.INSERT_BEFORE)
	{
		abstractItem.addSubItemsBefore(subItems);
	}
	else if (this.m_operationType === oFF.CMEMenuExtensionOperationType.INSERT_AFTER)
	{
		abstractItem.addSubItemsAfter(subItems);
	}
	else if (this.m_operationType === oFF.CMEMenuExtensionOperationType.PREPEND_INTO)
	{
		abstractItem.addSubItemsAtStart(subItems);
	}
	else if (this.m_operationType === oFF.CMEMenuExtensionOperationType.APPEND_INTO)
	{
		abstractItem.addSubItemsAtEnd(subItems);
	}
	else if (this.m_operationType === oFF.CMEMenuExtensionOperationType.REDEFINE)
	{
		abstractItem.clearSubItems();
		abstractItem.addSubItemsAtEnd(subItems);
	}
};
oFF.CMEMenuExtensionOperation.prototype.extend = function(inputItem)
{
	let referenceItems = inputItem.findItemsByNameOrAlias(this.m_reference, true);
	if (oFF.XCollectionUtils.hasElements(referenceItems))
	{
		for (let i = 0; i < referenceItems.size(); i++)
		{
			let groupingItem = oFF.CMEGroupingMenuItem.create();
			this.m_groupCreator.transform(inputItem.getContext(), groupingItem);
			let subItems = groupingItem.getSubItems();
			if (oFF.XCollectionUtils.hasElements(subItems))
			{
				this.applyOperation(referenceItems.get(i), subItems.get(0).getActionGroup().getSubItems());
			}
		}
	}
};
oFF.CMEMenuExtensionOperation.prototype.getCondition = function()
{
	return this.m_condition;
};
oFF.CMEMenuExtensionOperation.prototype.getGroupCreator = function()
{
	return this.m_groupCreator;
};
oFF.CMEMenuExtensionOperation.prototype.getOperationType = function()
{
	return this.m_operationType;
};
oFF.CMEMenuExtensionOperation.prototype.getReference = function()
{
	return this.m_reference;
};
oFF.CMEMenuExtensionOperation.prototype.isApplicableTo = function(inputItem)
{
	return this.m_condition.matches(inputItem.getContext(), inputItem.getName());
};
oFF.CMEMenuExtensionOperation.prototype.releaseObject = function()
{
	this.m_operationType = null;
	this.m_reference = null;
	this.m_condition = oFF.XObjectExt.release(this.m_condition);
	this.m_groupCreator = oFF.XObjectExt.release(this.m_groupCreator);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuExtensionOperation.prototype.setCondition = function(condition)
{
	this.m_condition = condition;
};
oFF.CMEMenuExtensionOperation.prototype.setGroupCreator = function(groupCreator)
{
	this.m_groupCreator = groupCreator;
};
oFF.CMEMenuExtensionOperation.prototype.setOperationType = function(operationType)
{
	this.m_operationType = operationType;
};
oFF.CMEMenuExtensionOperation.prototype.setReference = function(reference)
{
	this.m_reference = reference;
};

oFF.CMEFactoryImpl = function() {};
oFF.CMEFactoryImpl.prototype = new oFF.XObject();
oFF.CMEFactoryImpl.prototype._ff_c = "CMEFactoryImpl";

oFF.CMEFactoryImpl.create = function()
{
	return new oFF.CMEFactoryImpl();
};
oFF.CMEFactoryImpl.prototype.m_showNamesInMenu = false;
oFF.CMEFactoryImpl.prototype.newContext = function()
{
	return oFF.CMEContext.create();
};
oFF.CMEFactoryImpl.prototype.newContextAccess = function(dataContext, uiContext)
{
	return oFF.CMEContextAccess.createWithDataAndUiContext(dataContext, uiContext);
};
oFF.CMEFactoryImpl.prototype.newGroupingMenuItem = function()
{
	return oFF.CMEGroupingMenuItem.create();
};
oFF.CMEFactoryImpl.prototype.newGroupingMenuItemFromPrStructure = function(input)
{
	return oFF.CMEMenuJsonHelper.deserialiseGroupingMenuItem(input);
};
oFF.CMEFactoryImpl.prototype.newMenuTreeGenerator = function()
{
	return oFF.CMEMenuTreeGenerator.create();
};
oFF.CMEFactoryImpl.prototype.newMenuTreePopulator = function(widgetsFactory, uiCache)
{
	let result = oFF.CMEMenuTreePopulatorSelfRef.create(widgetsFactory, uiCache);
	result.setShowNames(() => {
		return this.m_showNamesInMenu;
	});
	return result;
};
oFF.CMEFactoryImpl.prototype.newMenuTreePopulatorWithSubMapper = function(widgetsFactory, subMapper, uiCache)
{
	let result = oFF.CMEMenuTreePopulatorBranching.createWithSubMapper(widgetsFactory, subMapper, uiCache);
	result.setShowNames(() => {
		return this.m_showNamesInMenu;
	});
	return result;
};
oFF.CMEFactoryImpl.prototype.newMultiSelectAction = function()
{
	return oFF.CMEMultiSelectAction.create();
};
oFF.CMEFactoryImpl.prototype.newSelectionOption = function()
{
	return oFF.CMESelectionOption.create();
};
oFF.CMEFactoryImpl.prototype.newSimpleToggleAction = function(name, key, availabilityKey, enablementKey, toggledKey, executionKey)
{
	let toggleAction = oFF.CMEToggleAction.create();
	toggleAction.setNameProvider(oFF.CMEMenuActionUtil.getNameProvider(name));
	toggleAction.setAvailableProvider(oFF.CMEMenuActionUtil.getContextPredicate(availabilityKey, key));
	toggleAction.setEnabledProvider(oFF.CMEMenuActionUtil.getContextPredicate(enablementKey, key));
	toggleAction.setProvider(oFF.CMEMenuActionUtil.getContextPredicate(toggledKey, key));
	toggleAction.setConsumer(oFF.CMEMenuActionUtil.getSimpleContextConsumer(executionKey, key));
	return toggleAction;
};
oFF.CMEFactoryImpl.prototype.newSimpleTriggerAction = function(name, key, availabilityKey, enablementKey, executionKey)
{
	let triggerAction = oFF.CMETriggerAction.create();
	triggerAction.setNameProvider(oFF.CMEMenuActionUtil.getNameProvider(name));
	triggerAction.setAvailableProvider(oFF.CMEMenuActionUtil.getContextPredicate(availabilityKey, key));
	triggerAction.setEnabledProvider(oFF.CMEMenuActionUtil.getContextPredicate(enablementKey, key));
	triggerAction.setTrigger(oFF.CMEMenuActionUtil.getContextExecutor(executionKey, key));
	return triggerAction;
};
oFF.CMEFactoryImpl.prototype.newSingleSelectAction = function()
{
	return oFF.CMESingleSelectAction.create();
};
oFF.CMEFactoryImpl.prototype.newToggleAction = function()
{
	return oFF.CMEToggleAction.create();
};
oFF.CMEFactoryImpl.prototype.newTriggerAction = function()
{
	return oFF.CMETriggerAction.create();
};
oFF.CMEFactoryImpl.prototype.newUiCache = function()
{
	return oFF.CMEUiCache.create();
};
oFF.CMEFactoryImpl.prototype.serializeGroupingMenuItemToPaths = function(groupingMenuItem)
{
	return oFF.CMEMenuJsonHelper.serializeGroupingMenuItemToPaths(groupingMenuItem);
};
oFF.CMEFactoryImpl.prototype.serializeGroupingMenuItemToPrStructure = function(groupingMenuItem)
{
	return oFF.CMEMenuJsonHelper.serializeGroupingMenuItem(groupingMenuItem, true);
};
oFF.CMEFactoryImpl.prototype.setShowNamesInMenu = function(showNamesInMenu)
{
	this.m_showNamesInMenu = showNamesInMenu;
};

oFF.CMEMenuFilter = function() {};
oFF.CMEMenuFilter.prototype = new oFF.XObject();
oFF.CMEMenuFilter.prototype._ff_c = "CMEMenuFilter";

oFF.CMEMenuFilter.create = function()
{
	let instance = new oFF.CMEMenuFilter();
	instance.setup();
	return instance;
};
oFF.CMEMenuFilter.prototype.m_condition = null;
oFF.CMEMenuFilter.prototype.m_excludeOperations = null;
oFF.CMEMenuFilter.prototype.m_includeOperations = null;
oFF.CMEMenuFilter.prototype.addNewExcludeOperation = function()
{
	let operation = oFF.CMEMenuFilterOperation.create();
	this.m_excludeOperations.add(operation);
	return operation;
};
oFF.CMEMenuFilter.prototype.addNewIncludeOperation = function()
{
	let operation = oFF.CMEMenuFilterOperation.create();
	this.m_includeOperations.add(operation);
	return operation;
};
oFF.CMEMenuFilter.prototype.filter = function(inputItem)
{
	if (oFF.XCollectionUtils.hasElements(this.m_includeOperations))
	{
		inputItem.hideIncludingChildren();
		oFF.CMEMenuFilterUtil.setVisibleMatchingPathResults(inputItem, this.m_includeOperations, true);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_excludeOperations))
	{
		oFF.CMEMenuFilterUtil.setVisibleMatchingPathResults(inputItem, this.m_excludeOperations, false);
	}
	return inputItem;
};
oFF.CMEMenuFilter.prototype.getCondition = function()
{
	return this.m_condition;
};
oFF.CMEMenuFilter.prototype.isApplicableTo = function(inputItem)
{
	return this.m_condition.matches(inputItem.getContext(), inputItem.getName());
};
oFF.CMEMenuFilter.prototype.releaseObject = function()
{
	this.m_excludeOperations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_excludeOperations);
	this.m_includeOperations = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_includeOperations);
	this.m_condition = oFF.XObjectExt.release(this.m_condition);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuFilter.prototype.setCondition = function(condition)
{
	this.m_condition = condition;
};
oFF.CMEMenuFilter.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_excludeOperations = oFF.XList.create();
	this.m_includeOperations = oFF.XList.create();
};

oFF.CMEMenuFilterList = function() {};
oFF.CMEMenuFilterList.prototype = new oFF.XObject();
oFF.CMEMenuFilterList.prototype._ff_c = "CMEMenuFilterList";

oFF.CMEMenuFilterList.create = function()
{
	let instance = new oFF.CMEMenuFilterList();
	instance.setup();
	return instance;
};
oFF.CMEMenuFilterList.prototype.m_filters = null;
oFF.CMEMenuFilterList.prototype.addNewMenuFilter = function()
{
	let newFilter = oFF.CMEMenuFilter.create();
	this.m_filters.add(newFilter);
	return newFilter;
};
oFF.CMEMenuFilterList.prototype.filterMenu = function(inputItem)
{
	let result = inputItem;
	for (let i = 0; i < this.m_filters.size(); i++)
	{
		let filter = this.m_filters.get(i);
		if (filter.isApplicableTo(inputItem))
		{
			result = filter.filter(inputItem);
			break;
		}
	}
	return result;
};
oFF.CMEMenuFilterList.prototype.releaseObject = function()
{
	this.m_filters = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_filters);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuFilterList.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_filters = oFF.XList.create();
};

oFF.CMEMenuFilterOperation = function() {};
oFF.CMEMenuFilterOperation.prototype = new oFF.XObject();
oFF.CMEMenuFilterOperation.prototype._ff_c = "CMEMenuFilterOperation";

oFF.CMEMenuFilterOperation.create = function()
{
	let instance = new oFF.CMEMenuFilterOperation();
	instance.setup();
	return instance;
};
oFF.CMEMenuFilterOperation.prototype.m_condition = null;
oFF.CMEMenuFilterOperation.prototype.m_path = null;
oFF.CMEMenuFilterOperation.prototype.getCondition = function()
{
	return this.m_condition;
};
oFF.CMEMenuFilterOperation.prototype.getPath = function()
{
	return this.m_path;
};
oFF.CMEMenuFilterOperation.prototype.isApplicableTo = function(inputItem)
{
	return this.m_condition.matches(inputItem.getContext(), inputItem.getName());
};
oFF.CMEMenuFilterOperation.prototype.releaseObject = function()
{
	this.m_path = null;
	this.m_condition = oFF.XObjectExt.release(this.m_condition);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuFilterOperation.prototype.setCondition = function(condition)
{
	this.m_condition = condition;
};
oFF.CMEMenuFilterOperation.prototype.setPath = function(path)
{
	this.m_path = path;
};

oFF.CMEMenuFilterUtil = {

	PATH_SEPARATOR:"/",
	WILDCARD:"*",
	itemMatchesPath:function(menuItem, matchPath, partialMatch, visible)
	{
			let abstractMenuItem = menuItem.getMenuItem();
		let separator = menuItem.getMenuSeparator();
		return oFF.notNull(separator) || oFF.notNull(abstractMenuItem) && oFF.CMEMenuFilterUtil.menuItemMatchesPath(abstractMenuItem, matchPath, partialMatch, visible);
	},
	menuItemMatchesPath:function(menuItem, matchPath, partialMatch, visible)
	{
			let result = false;
		let index = oFF.XString.indexOf(matchPath, oFF.CMEMenuFilterUtil.PATH_SEPARATOR);
		let head;
		let tail;
		if (index > -1)
		{
			head = oFF.XString.substring(matchPath, 0, index);
			tail = oFF.XString.substring(matchPath, index + 1, oFF.XString.size(matchPath));
		}
		else
		{
			head = matchPath;
			tail = null;
		}
		let menuItemName = menuItem.getName();
		let menuItemAlias = menuItem.getAlias();
		let groupMenuItem = menuItem.getActionGroup();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(menuItemName) && oFF.XStringUtils.isWildcardPatternMatching(menuItemName, head) || oFF.XStringUtils.isNotNullAndNotEmpty(menuItemAlias) && oFF.XStringUtils.isWildcardPatternMatching(menuItemAlias, head) || oFF.XString.isEqual(head, oFF.CMEMenuFilterUtil.WILDCARD))
		{
			if (oFF.XStringUtils.isNullOrEmpty(tail))
			{
				if (visible)
				{
					menuItem.showIncludingParents();
				}
				else
				{
					menuItem.hideIncludingChildren();
				}
			}
			else if (oFF.XStringUtils.isNotNullAndNotEmpty(tail) && oFF.notNull(groupMenuItem))
			{
				result = oFF.CMEMenuFilterUtil.oneOfSubItemsMatchesPath(groupMenuItem, tail, false, visible);
			}
		}
		else if (partialMatch && oFF.notNull(groupMenuItem))
		{
			result = oFF.CMEMenuFilterUtil.oneOfSubItemsMatchesPath(groupMenuItem, matchPath, true, visible);
		}
		return result;
	},
	oneOfSubItemsMatchesPath:function(gmi, matchPath, partialMatch, visible)
	{
			let result = false;
		let subItems = gmi.getSubItems();
		for (let i = 0; i < subItems.size(); i++)
		{
			let subItem = subItems.get(i);
			if (oFF.CMEMenuFilterUtil.itemMatchesPath(subItem, matchPath, partialMatch, visible))
			{
				result = true;
			}
		}
		return result;
	},
	setVisibleMatchingPathResults:function(menuItem, filterOperation, visible)
	{
			let matched = false;
		let iterator = filterOperation.getIterator();
		while (iterator.hasNext())
		{
			let operation = iterator.next();
			if (operation.isApplicableTo(menuItem))
			{
				matched = oFF.CMEMenuFilterUtil.subItemsMatchPathExt(menuItem, operation.getPath(), visible);
			}
		}
		return matched;
	},
	subItemsMatchPathExt:function(menuItem, matchPath, visible)
	{
			let result;
		if (oFF.XString.startsWith(matchPath, oFF.CMEMenuFilterUtil.PATH_SEPARATOR))
		{
			result = oFF.CMEMenuFilterUtil.oneOfSubItemsMatchesPath(menuItem, oFF.XString.substring(matchPath, oFF.XString.size(oFF.CMEMenuFilterUtil.PATH_SEPARATOR), oFF.XString.size(matchPath)), false, visible);
		}
		else
		{
			result = oFF.CMEMenuFilterUtil.oneOfSubItemsMatchesPath(menuItem, matchPath, true, visible);
		}
		return result;
	}
};

oFF.CMEMenuCarrier = function() {};
oFF.CMEMenuCarrier.prototype = new oFF.XObject();
oFF.CMEMenuCarrier.prototype._ff_c = "CMEMenuCarrier";

oFF.CMEMenuCarrier.create = function(menuTreeConsumer, menuTree)
{
	let instance = new oFF.CMEMenuCarrier();
	instance.m_menuTreeConsumer = menuTreeConsumer;
	instance.m_menuTree = menuTree;
	instance.m_pluginMenuConfigs = oFF.XHashMapByString.create();
	return instance;
};
oFF.CMEMenuCarrier.prototype.m_menuTree = null;
oFF.CMEMenuCarrier.prototype.m_menuTreeConsumer = null;
oFF.CMEMenuCarrier.prototype.m_pluginMenuConfigs = null;
oFF.CMEMenuCarrier.prototype.getMenuTree = function()
{
	return this.m_menuTree;
};
oFF.CMEMenuCarrier.prototype.getMenuTreeConsumer = function()
{
	return this.m_menuTreeConsumer;
};
oFF.CMEMenuCarrier.prototype.getPluginMenuConfigs = function()
{
	return this.m_pluginMenuConfigs;
};
oFF.CMEMenuCarrier.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_menuTreeConsumer = null;
	this.m_menuTree = null;
	this.m_pluginMenuConfigs = oFF.XObjectExt.release(this.m_pluginMenuConfigs);
};

oFF.CMEMenuFiller = function() {};
oFF.CMEMenuFiller.prototype = new oFF.XObject();
oFF.CMEMenuFiller.prototype._ff_c = "CMEMenuFiller";

oFF.CMEMenuFiller.create = function(treeGenerator, menuPopulator, textMapper)
{
	let instance = new oFF.CMEMenuFiller();
	instance.setupWithTreePopulatorAndMapper(treeGenerator, menuPopulator, textMapper);
	return instance;
};
oFF.CMEMenuFiller.prototype.m_menuPolulator = null;
oFF.CMEMenuFiller.prototype.m_textMapper = null;
oFF.CMEMenuFiller.prototype.m_treeGenerator = null;
oFF.CMEMenuFiller.prototype.localize = function(abstractMenuTree, localizator)
{
	if (oFF.notNull(this.m_textMapper) && oFF.notNull(localizator) && oFF.notNull(abstractMenuTree))
	{
		this.mapTexts(abstractMenuTree, localizator);
	}
};
oFF.CMEMenuFiller.prototype.lookupMenuName = function(context, uiContext)
{
	return this.m_treeGenerator.getTopMenuName(context, uiContext);
};
oFF.CMEMenuFiller.prototype.mapTexts = function(menuItem, localizator)
{
	let localizableText = menuItem.getLocalizableText();
	let localizableExplanation = menuItem.getLocalizableExplanation();
	let actionGroup = menuItem.getActionGroup();
	let actionLeaf = menuItem.getActionLeaf();
	if (oFF.notNull(actionLeaf))
	{
		actionLeaf.setShortcutText(this.m_textMapper.getShortcutText(actionLeaf.getMainKeyboardShortcut(), localizator));
	}
	if (oFF.notNull(localizableText))
	{
		menuItem.setText(this.m_textMapper.getMappedValue(localizableText.getKey(), localizableText.getReplacements(), localizator));
	}
	if (oFF.notNull(localizableExplanation))
	{
		menuItem.setExplanation(this.m_textMapper.getMappedValue(localizableText.getKey(), localizableExplanation.getReplacements(), localizator));
	}
	if (oFF.notNull(actionGroup))
	{
		localizableText = actionGroup.getOverflowLocalizableText();
		if (oFF.notNull(localizableText))
		{
			actionGroup.setOverflowText(this.m_textMapper.getMappedValue(localizableText.getKey(), localizableText.getReplacements(), localizator));
		}
		let subList = actionGroup.getSubItems();
		for (let i = 0; i < subList.size(); i++)
		{
			let subMenuItem = subList.get(i).getMenuItem();
			if (oFF.notNull(subMenuItem))
			{
				this.mapTexts(subMenuItem, localizator);
			}
		}
	}
};
oFF.CMEMenuFiller.prototype.populateMenu = function(container, context, uiContext, localizator, clearer, consumer)
{
	this.m_treeGenerator.generate(context, uiContext, (abstractMenuTree) => {
		this.localize(abstractMenuTree, localizator);
		if (oFF.notNull(clearer))
		{
			clearer();
		}
		let success = this.remapMenuTreeSave(container, abstractMenuTree, false, localizator);
		if (oFF.notNull(consumer) && success && oFF.XCollectionUtils.hasElements(abstractMenuTree.getSubItems()))
		{
			consumer(abstractMenuTree, container);
		}
	});
};
oFF.CMEMenuFiller.prototype.releaseObject = function()
{
	this.m_treeGenerator = null;
	this.m_menuPolulator = null;
	this.m_textMapper = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuFiller.prototype.remapMenuTreeSave = function(menuContainer, abstractMenuTree, createEmptyList, localizator)
{
	let success = oFF.notNull(abstractMenuTree);
	if (success)
	{
		this.m_menuPolulator.remapMenuTree(menuContainer, abstractMenuTree, -1, (amt) => {
			this.localize(amt, localizator);
		});
	}
	return success;
};
oFF.CMEMenuFiller.prototype.setupWithTreePopulatorAndMapper = function(treeGenerator, populator, textMapper)
{
	this.m_treeGenerator = treeGenerator;
	this.m_menuPolulator = populator;
	this.m_textMapper = textMapper;
};

oFF.CMEMenuTreeGenerator = function() {};
oFF.CMEMenuTreeGenerator.prototype = new oFF.XObject();
oFF.CMEMenuTreeGenerator.prototype._ff_c = "CMEMenuTreeGenerator";

oFF.CMEMenuTreeGenerator.create = function()
{
	let instance = new oFF.CMEMenuTreeGenerator();
	instance.setup();
	return instance;
};
oFF.CMEMenuTreeGenerator.prototype.m_actionController = null;
oFF.CMEMenuTreeGenerator.prototype.m_actionFilter = null;
oFF.CMEMenuTreeGenerator.prototype.m_actionProviderListeners = null;
oFF.CMEMenuTreeGenerator.prototype.m_actionProviders = null;
oFF.CMEMenuTreeGenerator.prototype.m_envConfig = null;
oFF.CMEMenuTreeGenerator.prototype.m_menuGenerator = null;
oFF.CMEMenuTreeGenerator.prototype.m_registry = null;
oFF.CMEMenuTreeGenerator.prototype.m_shortcutActions = null;
oFF.CMEMenuTreeGenerator.prototype.clearDynamicActionsProviders = function()
{
	let providerNames = this.m_actionProviders.getKeysAsIterator();
	while (providerNames.hasNext())
	{
		this.unRegisterDynamicActionsProvider(providerNames.next());
	}
};
oFF.CMEMenuTreeGenerator.prototype.continueMenuCreation = function(subConfigs, groupingMenuItem, menuTreeConsumer)
{
	if (oFF.notNull(menuTreeConsumer) && oFF.notNull(groupingMenuItem))
	{
		if (oFF.notNull(subConfigs))
		{
			oFF.XStream.of(subConfigs.getValuesAsReadOnlyList()).forEach((fi) => {
				this.dynamicallyFilterMenu(groupingMenuItem, fi);
			});
			oFF.XStream.of(subConfigs.getValuesAsReadOnlyList()).forEach((ext) => {
				this.dynamicallyExtendMenu(groupingMenuItem, ext);
			});
		}
		menuTreeConsumer(groupingMenuItem);
	}
};
oFF.CMEMenuTreeGenerator.prototype.createMenuFiller = function(populator, textMapper)
{
	return oFF.CMEMenuFiller.create(this, populator, textMapper);
};
oFF.CMEMenuTreeGenerator.prototype.dynamicallyExtendMenu = function(groupingMenuItem, inputStructure)
{
	let globalShortcuts = oFF.isNull(inputStructure) ? null : inputStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_GLOBAL_SHORTCUT_ACTIONS);
	let subMenus = oFF.isNull(inputStructure) ? null : inputStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_SUBMENUS);
	let shortcutList = oFF.CMECreatorJsonHelper.remapShortcutActions(globalShortcuts, this.getRegistry(), this.m_actionController);
	oFF.XCollectionUtils.forEach(shortcutList, (se) => {
		if (!this.m_shortcutActions.contains(se))
		{
			this.m_shortcutActions.add(se);
		}
	});
	let subMenuMap = oFF.CMECreatorJsonHelper.remapSubMenuDefinitions(subMenus);
	let menuMenuExtensions = oFF.isNull(inputStructure) ? null : inputStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_MENU_EXTENSIONS);
	if (oFF.XCollectionUtils.hasElements(menuMenuExtensions))
	{
		let menuExtender = oFF.CMECreatorJsonHelper.createMenuExtender(menuMenuExtensions, subMenuMap, shortcutList, this.getRegistry(), this.m_actionController);
		if (oFF.notNull(menuExtender))
		{
			menuExtender.extendMenu(groupingMenuItem);
		}
	}
};
oFF.CMEMenuTreeGenerator.prototype.dynamicallyFilterMenu = function(groupingMenuItem, inputStructure)
{
	let menuFilters = oFF.isNull(inputStructure) ? null : inputStructure.getListByKey(oFF.CMECreatorJsonConstants.CME_MENU_FILTERS);
	if (oFF.XCollectionUtils.hasElements(menuFilters))
	{
		let menuFilter = oFF.CMECreatorJsonHelper.createMenuFilter(menuFilters);
		if (oFF.notNull(menuFilter))
		{
			menuFilter.filterMenu(groupingMenuItem);
		}
	}
};
oFF.CMEMenuTreeGenerator.prototype.generate = function(context, uiContext, menuTreeConsumer)
{
	if (oFF.notNull(this.m_menuGenerator))
	{
		let groupItem = oFF.CMEGroupingMenuItem.create();
		let cmeContext = oFF.CMEContextAccess.createWithContextAndEnvironment(context, this.m_envConfig);
		cmeContext.setUiContext(uiContext);
		this.m_menuGenerator.transform(cmeContext, groupItem);
		groupItem.setContext(cmeContext);
		let tags = groupItem.getTags();
		if (oFF.XCollectionUtils.hasElements(tags))
		{
			groupItem.setName(tags.getValuesAsReadOnlyList().get(0));
		}
		if (oFF.XCollectionUtils.hasElements(this.m_actionProviders))
		{
			let providerNames = this.m_actionProviders.getKeysAsIterator();
			let provider;
			let carrier = oFF.CMEMenuCarrier.create(menuTreeConsumer, groupItem);
			while (providerNames.hasNext())
			{
				provider = this.m_actionProviders.getByKey(providerNames.next());
				provider.provideMenuConfig(cmeContext, this, carrier);
			}
		}
		else
		{
			this.continueMenuCreation(null, groupItem, menuTreeConsumer);
		}
	}
	else
	{
		menuTreeConsumer(null);
	}
};
oFF.CMEMenuTreeGenerator.prototype.getActionFilter = function()
{
	return this.m_actionFilter;
};
oFF.CMEMenuTreeGenerator.prototype.getRegisteredActions = function()
{
	return this.getRegistry().getRegisteredActions();
};
oFF.CMEMenuTreeGenerator.prototype.getRegistry = function()
{
	return this.m_registry;
};
oFF.CMEMenuTreeGenerator.prototype.getShortcutActions = function()
{
	return this.m_shortcutActions;
};
oFF.CMEMenuTreeGenerator.prototype.getTopMenuName = function(context, uiContext)
{
	let cmeContext = oFF.CMEContextAccess.createWithContextAndEnvironment(context, this.m_envConfig);
	cmeContext.setUiContext(uiContext);
	return this.m_menuGenerator.getMatchingTopMenuName(cmeContext);
};
oFF.CMEMenuTreeGenerator.prototype.loadConfiguration = function(baseConfiguration)
{
	let envConfig = baseConfiguration.getStructureByKey(oFF.CMECreatorJsonConstants.CME_CONFIG_ENVIRONMENT);
	this.setEnvConfig(envConfig);
	let actionFilter = baseConfiguration.getStructureByKey(oFF.CMECreatorJsonConstants.CME_ACTIONS_FILTER);
	this.setActionFilter(actionFilter);
	let loggingEnabled = baseConfiguration.getBooleanByKey(oFF.CMECreatorJsonConstants.CME_LOGGING_ENABLED);
	this.m_actionController.setLoggingEnabled(loggingEnabled);
	let customActions = baseConfiguration.getListByKey(oFF.CMECreatorJsonConstants.CME_MENU_ACTIONS);
	if (oFF.notNull(customActions))
	{
		oFF.CMECreatorJsonHelper.defineCustomActions(customActions, this.getRegistry());
	}
	let globalShortcuts = baseConfiguration.getListByKey(oFF.CMECreatorJsonConstants.CME_GLOBAL_SHORTCUT_ACTIONS);
	let shortcutList = oFF.CMECreatorJsonHelper.remapShortcutActions(globalShortcuts, this.getRegistry(), this.m_actionController);
	this.m_shortcutActions.addAll(shortcutList);
	let menus = baseConfiguration.getListByKey(oFF.CMECreatorJsonConstants.CME_MENUS);
	let subMenus = baseConfiguration.getListByKey(oFF.CMECreatorJsonConstants.CME_SUBMENUS);
	let subMenuMap = oFF.CMECreatorJsonHelper.remapSubMenuDefinitions(subMenus);
	if (oFF.XCollectionUtils.hasElements(menus))
	{
		let menuGenerator = oFF.CMECreatorJsonHelper.createMenuGenerator(menus, subMenuMap, shortcutList, this.getRegistry(), this.m_actionController);
		this.setMenuGenerator(menuGenerator);
	}
};
oFF.CMEMenuTreeGenerator.prototype.loadPluginConfiguration = function(configurationName, configuration)
{
	let customActions = configuration.getListByKey(oFF.CMECreatorJsonConstants.CME_MENU_ACTIONS);
	if (oFF.notNull(customActions))
	{
		oFF.CMECreatorJsonHelper.defineCustomActions(customActions, this.getRegistry());
	}
	this.registerDynamicActionsProvider(configurationName, oFF.CMEDefaultPluginActionProvider.create(configurationName, configuration));
};
oFF.CMEMenuTreeGenerator.prototype.onDynamicMenuConfigProvided = function(context, configName, config, carrier)
{
	let carrierInternal = carrier;
	let dynamicSubConfig = carrierInternal.getPluginMenuConfigs();
	dynamicSubConfig.put(configName, config);
	if (dynamicSubConfig.size() === this.m_actionProviders.size())
	{
		let menuTreeConsumer = carrierInternal.getMenuTreeConsumer();
		if (oFF.notNull(menuTreeConsumer))
		{
			this.continueMenuCreation(dynamicSubConfig, carrierInternal.getMenuTree(), menuTreeConsumer);
		}
		oFF.XObjectExt.release(carrier);
	}
};
oFF.CMEMenuTreeGenerator.prototype.registerAction = function(key, action)
{
	this.getRegistry().registerAction(key, action);
};
oFF.CMEMenuTreeGenerator.prototype.registerActions = function(actionsRegistrator)
{
	oFF.XCollectionUtils.forEach(actionsRegistrator.getRegistrationKeys(), (key) => {
		let action = actionsRegistrator.getActionByKey(key);
		if (action.isSelectOption())
		{
			this.getRegistry().registerOption(key, action.asSelectOption());
		}
		else
		{
			this.getRegistry().registerAction(key, action);
		}
	});
};
oFF.CMEMenuTreeGenerator.prototype.registerDynamicActionsProvider = function(name, actionsProvider)
{
	this.unRegisterDynamicActionsProvider(name);
	let mapperListener = oFF.CMEActionProviderMapper.create(actionsProvider);
	this.m_actionProviders.put(name, actionsProvider);
	this.m_actionProviderListeners.put(name, mapperListener);
	this.m_actionController.attachActionListener(mapperListener);
};
oFF.CMEMenuTreeGenerator.prototype.releaseObject = function()
{
	this.m_envConfig = oFF.XObjectExt.release(this.m_envConfig);
	this.m_actionFilter = oFF.XObjectExt.release(this.m_actionFilter);
	this.m_menuGenerator = oFF.XObjectExt.release(this.m_menuGenerator);
	this.m_actionProviders = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_actionProviders);
};
oFF.CMEMenuTreeGenerator.prototype.setActionFilter = function(actionFilter)
{
	this.m_actionFilter = actionFilter;
};
oFF.CMEMenuTreeGenerator.prototype.setEnvConfig = function(envConfig)
{
	this.m_envConfig = envConfig;
};
oFF.CMEMenuTreeGenerator.prototype.setMenuGenerator = function(menuGenerator)
{
	this.m_menuGenerator = menuGenerator;
};
oFF.CMEMenuTreeGenerator.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_actionProviders = oFF.XHashMapByString.create();
	this.m_actionProviderListeners = oFF.XHashMapByString.create();
	this.m_actionController = oFF.CMEActionController.create();
	this.m_shortcutActions = oFF.XList.create();
	this.m_registry = oFF.CMERegistry.create();
};
oFF.CMEMenuTreeGenerator.prototype.unRegisterDynamicActionsProvider = function(name)
{
	let listener = this.m_actionProviderListeners.getByKey(name);
	this.m_actionController.detachActionListener(listener);
	oFF.XObjectExt.release(listener);
	this.m_actionProviders.remove(name);
};
oFF.CMEMenuTreeGenerator.prototype.unloadPluginConfiguration = function(configurationName)
{
	this.unRegisterDynamicActionsProvider(configurationName);
};

oFF.CMEMenuTreePopulatorAbstract = function() {};
oFF.CMEMenuTreePopulatorAbstract.prototype = new oFF.XObject();
oFF.CMEMenuTreePopulatorAbstract.prototype._ff_c = "CMEMenuTreePopulatorAbstract";

oFF.CMEMenuTreePopulatorAbstract.prototype.m_factory = null;
oFF.CMEMenuTreePopulatorAbstract.prototype.m_showNames = null;
oFF.CMEMenuTreePopulatorAbstract.prototype.m_uiCache = null;
oFF.CMEMenuTreePopulatorAbstract.prototype.clearAndRenderSubItems = function(subItems, sectionStartOrig, defaultOverflowPriority, container, deferredLocalizer)
{
	this.m_factory.clearGroup(container);
	let sectionStart = sectionStartOrig;
	for (let i = 0; i < subItems.size(); i++)
	{
		let subAbstractItem = subItems.get(i);
		if (oFF.isNull(subAbstractItem) || subAbstractItem.isReleased())
		{
			continue;
		}
		let subItem = subAbstractItem.getMenuItem();
		if (subAbstractItem.getMenuSeparator() !== null)
		{
			sectionStart = true;
		}
		else if (oFF.notNull(subItem) && subItem.isVisible())
		{
			let overflowPriority = subItem.getOverflowPriority();
			if (overflowPriority === -1)
			{
				overflowPriority = defaultOverflowPriority;
			}
			let group = subItem.getActionGroup();
			if (oFF.notNull(group))
			{
				let defaultAction = null;
				let hasDefaultAction = group.isFirstSubOptionIsDefault();
				if (hasDefaultAction)
				{
					let groupItems = oFF.XStream.of(group.getSubItems()).filter((subI) => {
						return subI.getActionLeaf() !== null && subI.getActionLeaf().isVisible() && subI.getActionLeaf().isEnabled();
					}).map((subIt) => {
						return subIt.getActionLeaf();
					}).collect(oFF.XStreamCollector.toList());
					defaultAction = groupItems.size() === 0 ? null : groupItems.get(0).getCommand();
				}
				let effectiveHighlightProcedure = this.getEffectiveHoverProcedure(group, defaultOverflowPriority, deferredLocalizer);
				let menuItem = this.m_factory.createGroupItem(container, group, sectionStart, overflowPriority, this.getTextForItem(subItem), effectiveHighlightProcedure, hasDefaultAction, defaultAction);
				if (this.getSubMapper() !== null)
				{
					this.getSubMapper().remapMenuTree(menuItem, group, overflowPriority, deferredLocalizer);
				}
				else
				{
					oFF.XLogger.println("No menu submapper defined. Cannot render sub tree");
				}
			}
			let leaf = subItem.getActionLeaf();
			if (oFF.notNull(leaf))
			{
				if (leaf.isToggle())
				{
					this.m_factory.createToggleItem(container, leaf, sectionStart, overflowPriority, this.getTextForItem(subItem));
				}
				else
				{
					this.m_factory.createTriggerItem(container, leaf, sectionStart, overflowPriority, this.getTextForItem(subItem));
				}
			}
			sectionStart = false;
		}
	}
};
oFF.CMEMenuTreePopulatorAbstract.prototype.eagerlyRetrieve = function(group, defaultOverflowPriority, container, deferredLocalizer)
{
	if (group.hasDeferredSubItemsEffective())
	{
		if (group.isEagerlyRetrieveDeferredOptions())
		{
			group.executeDeferredLoading(() => {
				if (oFF.notNull(container) && !container.isReleased())
				{
					deferredLocalizer(group);
					this.getSubMapper().clearAndRenderSubItems(group.getEffectiveSubItems(), false, defaultOverflowPriority, container, deferredLocalizer);
					this.m_factory.synchronizeGroupMenuItem(container, this.getTextForItem(group), group.getIcon(), group.getDataHelpId(), group.isEnabled(), group.getExplanation(), group.getHighlightProcedure(), group.getUnHighlightProcedure(), false, null);
				}
			});
		}
	}
};
oFF.CMEMenuTreePopulatorAbstract.prototype.getEffectiveHoverProcedure = function(group, defaultOverflowPriority, deferredLocalizer)
{
	return (container) => {
		let highlightProcedure = group.getHighlightProcedure();
		let deferredProcedure;
		if (!group.isReleased() && group.hasDeferredSubItemsEffective() && !group.isEagerlyRetrieveDeferredOptions())
		{
			deferredProcedure = () => {
				group.executeDeferredLoading(() => {
					if (oFF.notNull(container) && !container.isReleased())
					{
						deferredLocalizer(group);
						this.getSubMapper().clearAndRenderSubItems(group.getEffectiveSubItems(), false, defaultOverflowPriority, container, deferredLocalizer);
						this.m_factory.synchronizeGroupMenuItem(container, this.getTextForItem(group), group.getIcon(), group.getDataHelpId(), group.isEnabled(), group.getExplanation(), group.getHighlightProcedure(), group.getUnHighlightProcedure(), false, null);
					}
				});
			};
		}
		else
		{
			deferredProcedure = null;
		}
		let finalProcedure = null;
		if (oFF.notNull(highlightProcedure) && oFF.notNull(deferredProcedure))
		{
			finalProcedure = () => {
				deferredProcedure();
				highlightProcedure();
			};
		}
		else if (oFF.notNull(highlightProcedure))
		{
			finalProcedure = highlightProcedure;
		}
		else if (oFF.notNull(deferredProcedure))
		{
			finalProcedure = deferredProcedure;
		}
		return finalProcedure;
	};
};
oFF.CMEMenuTreePopulatorAbstract.prototype.getTextForItem = function(subItem)
{
	return this.m_showNames() ? oFF.XStringUtils.concatenate3(subItem.getName(), " <=> ", subItem.getText()) : subItem.getText();
};
oFF.CMEMenuTreePopulatorAbstract.prototype.releaseObject = function()
{
	this.m_factory = null;
	this.m_uiCache = null;
	this.m_showNames = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEMenuTreePopulatorAbstract.prototype.remapMenuTree = function(container, abstractMenuTree, defaultOverflowPriority, deferredLocalizer)
{
	let hasElements = false;
	let sectionStart = this.m_factory.hasItemElements(container);
	let oldMenuTree = this.m_uiCache.getMenuItem(container, abstractMenuTree.getNameOrFallback());
	let subItems = abstractMenuTree.getEffectiveSubItems();
	let subAbstractItem;
	let subItem;
	let i;
	let compatible = !abstractMenuTree.hasDeferredSubItems() && !abstractMenuTree.isFlat() && this.m_factory.supportsSynchronization() && oFF.notNull(oldMenuTree) && oldMenuTree.getActionGroup() !== null && oldMenuTree.getActionGroup().areAllEffectiveSubItemsCompatibleTo(subItems);
	if (compatible)
	{
		let index = 0;
		for (i = 0; i < subItems.size(); i++)
		{
			index = this.synchronizeMenuItem(container, index, subItems.get(i), defaultOverflowPriority, deferredLocalizer);
		}
	}
	else
	{
		if (subItems.size() > 0 && (!abstractMenuTree.isFlat() || abstractMenuTree.isRoot()))
		{
			this.m_uiCache.prepareSubUiItemRegistry(container, abstractMenuTree.getRootName());
			this.m_factory.clearGroup(container);
		}
		this.m_uiCache.registerUiItem(container, abstractMenuTree.getNameOrFallback(), abstractMenuTree, () => {
			if (!container.isReleased())
			{
				this.m_factory.clearGroup(container);
			}
		});
		if (abstractMenuTree.isFlat() && abstractMenuTree.isKeepTitleForFlat() && oFF.XStringUtils.isNotNullAndNotEmpty(abstractMenuTree.getText()))
		{
			this.m_factory.createTitleItem(container, sectionStart, abstractMenuTree.getOverflowPriority(), abstractMenuTree.getName(), abstractMenuTree.getText(), abstractMenuTree.getIcon(), abstractMenuTree.getDataHelpId(), abstractMenuTree.getExplanation());
			sectionStart = false;
		}
		for (i = 0; i < subItems.size(); i++)
		{
			subAbstractItem = subItems.get(i);
			subItem = subAbstractItem.getMenuItem();
			if (subAbstractItem.getMenuSeparator() !== null)
			{
				sectionStart = true;
			}
			else if (oFF.notNull(subItem) && subItem.isVisible())
			{
				let overflowPriority = subItem.getOverflowPriority();
				if (overflowPriority === -1)
				{
					overflowPriority = defaultOverflowPriority;
				}
				let group = subItem.getActionGroup();
				if (oFF.notNull(group) && group.isFlat())
				{
					let sizeBefore = this.m_factory.getItemCount(container);
					hasElements = this.remapMenuTree(container, group, overflowPriority, deferredLocalizer) || hasElements;
					if (this.m_factory.getItemCount(container) - sizeBefore > 1)
					{
						sectionStart = true;
					}
				}
				else
				{
					hasElements = true;
					if (oFF.notNull(group))
					{
						let defaultAction = null;
						let hasDefaultAction = group.isFirstSubOptionIsDefault();
						if (hasDefaultAction)
						{
							let groupItems = oFF.XStream.of(group.getSubItems()).filter((subI) => {
								return subI.getActionLeaf() !== null && subI.getActionLeaf().isVisible() && subI.getActionLeaf().isEnabled();
							}).map((subIt) => {
								return subIt.getActionLeaf();
							}).collect(oFF.XStreamCollector.toList());
							defaultAction = groupItems.size() === 0 ? null : groupItems.get(0).getCommand();
						}
						let effectiveHighlightProcedure = this.getEffectiveHoverProcedure(group, defaultOverflowPriority, deferredLocalizer);
						let menuItem = this.m_factory.createGroupItem(container, group, sectionStart, overflowPriority, this.getTextForItem(subItem), effectiveHighlightProcedure, hasDefaultAction, defaultAction);
						this.eagerlyRetrieve(group, defaultOverflowPriority, menuItem, deferredLocalizer);
						this.m_uiCache.registerSubUiItem(container, abstractMenuTree.getRootName(), menuItem);
						this.m_uiCache.prepareSubUiItemRegistry(menuItem, abstractMenuTree.getRootName());
						if (this.getSubMapper() !== null)
						{
							this.getSubMapper().remapMenuTree(menuItem, group, overflowPriority, deferredLocalizer);
						}
						else
						{
							oFF.XLogger.println("No menu submapper defined. Cannot render sub tree");
						}
					}
					let leaf = subItem.getActionLeaf();
					if (oFF.notNull(leaf))
					{
						if (leaf.isToggle())
						{
							let toggleItem = this.m_factory.createToggleItem(container, leaf, sectionStart, overflowPriority, this.getTextForItem(subItem));
							this.m_uiCache.registerSubUiItem(container, abstractMenuTree.getRootName(), toggleItem);
						}
						else
						{
							let triggerItem = this.m_factory.createTriggerItem(container, leaf, sectionStart, overflowPriority, this.getTextForItem(subItem));
							this.m_uiCache.registerSubUiItem(container, abstractMenuTree.getRootName(), triggerItem);
						}
					}
					sectionStart = false;
				}
			}
		}
	}
	return hasElements;
};
oFF.CMEMenuTreePopulatorAbstract.prototype.setFactory = function(factory)
{
	this.m_factory = factory;
};
oFF.CMEMenuTreePopulatorAbstract.prototype.setShowNames = function(showNames)
{
	this.m_showNames = showNames;
};
oFF.CMEMenuTreePopulatorAbstract.prototype.setUiCache = function(uiCache)
{
	this.m_uiCache = uiCache;
};
oFF.CMEMenuTreePopulatorAbstract.prototype.synchronizeMenuItem = function(container, index, subAbstractItem, defaultOverflowPriority, deferredLocalizer)
{
	let currentIndex = index;
	let subItem = subAbstractItem.getMenuItem();
	if (oFF.notNull(subItem))
	{
		let uiItem = this.m_uiCache.getSubUiItem(container, subAbstractItem.getRootName(), index);
		let leaf = subItem.getActionLeaf();
		let group = subItem.getActionGroup();
		if (oFF.notNull(leaf))
		{
			if (leaf.isToggle())
			{
				this.m_factory.synchronizeToggleMenuItem(uiItem, this.getTextForItem(subItem), subItem.getIcon(), subItem.getDataHelpId(), subItem.isEnabled(), subItem.getExplanation(), subItem.getHighlightProcedure(), subItem.getUnHighlightProcedure(), leaf.getCommand(), leaf.getActiveExtended(), leaf.getStateIcon());
			}
			else
			{
				this.m_factory.synchronizeTriggerMenuItem(uiItem, this.getTextForItem(subItem), subItem.getIcon(), subItem.getDataHelpId(), subItem.isEnabled(), subItem.getExplanation(), subItem.getHighlightProcedure(), subItem.getUnHighlightProcedure(), leaf.getCommand());
			}
			currentIndex++;
		}
		if (oFF.notNull(group))
		{
			if (oFF.notNull(uiItem) && !group.isFlat())
			{
				let hasDefaultAction = group.isFirstSubOptionIsDefault();
				let defaultAction = null;
				if (hasDefaultAction)
				{
					let groupItems = oFF.XStream.of(group.getSubItems()).filter((subI) => {
						return subI.getActionLeaf() !== null && subI.getActionLeaf().isVisible() && subI.getActionLeaf().isEnabled();
					}).map((subIt) => {
						return subIt.getActionLeaf();
					}).collect(oFF.XStreamCollector.toList());
					defaultAction = groupItems.size() === 0 ? null : groupItems.get(0).getCommand();
				}
				this.m_factory.synchronizeGroupMenuItem(uiItem, this.getTextForItem(subItem), subItem.getIcon(), subItem.getDataHelpId(), subItem.isEnabled(), subItem.getExplanation(), subItem.getHighlightProcedure(), subItem.getUnHighlightProcedure(), hasDefaultAction, defaultAction);
			}
			if (group.isFlat())
			{
				let effectiveSubItems = group.getEffectiveSubItems();
				for (let i = 0; i < effectiveSubItems.size(); i++)
				{
					currentIndex = this.synchronizeMenuItem(container, currentIndex, effectiveSubItems.get(i), defaultOverflowPriority, deferredLocalizer);
				}
			}
			else if (oFF.notNull(uiItem))
			{
				this.getSubMapper().remapMenuTree(uiItem, group, defaultOverflowPriority, deferredLocalizer);
				currentIndex++;
			}
		}
	}
	return currentIndex;
};

oFF.CMEAbstractItem = function() {};
oFF.CMEAbstractItem.prototype = new oFF.XObject();
oFF.CMEAbstractItem.prototype._ff_c = "CMEAbstractItem";

oFF.CMEAbstractItem.prototype.m_alias = null;
oFF.CMEAbstractItem.prototype.m_name = null;
oFF.CMEAbstractItem.prototype.m_parent = null;
oFF.CMEAbstractItem.prototype.m_removed = false;
oFF.CMEAbstractItem.prototype.addSubItemsAfter = function(actionItems)
{
	this.insertSubItemsAsSiblingsAtSelfOffset(1, actionItems);
};
oFF.CMEAbstractItem.prototype.addSubItemsAtEnd = function(actionItems) {};
oFF.CMEAbstractItem.prototype.addSubItemsAtStart = function(actionItems) {};
oFF.CMEAbstractItem.prototype.addSubItemsBefore = function(actionItems)
{
	this.insertSubItemsAsSiblingsAtSelfOffset(0, actionItems);
};
oFF.CMEAbstractItem.prototype.clearSubItems = function() {};
oFF.CMEAbstractItem.prototype.getActionGroup = function()
{
	return null;
};
oFF.CMEAbstractItem.prototype.getActionLeaf = function()
{
	return null;
};
oFF.CMEAbstractItem.prototype.getAlias = function()
{
	return this.m_alias;
};
oFF.CMEAbstractItem.prototype.getMenuItem = function()
{
	return null;
};
oFF.CMEAbstractItem.prototype.getMenuSeparator = function()
{
	return null;
};
oFF.CMEAbstractItem.prototype.getName = function()
{
	return this.m_name;
};
oFF.CMEAbstractItem.prototype.getParent = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_parent);
};
oFF.CMEAbstractItem.prototype.getRootName = function()
{
	let parent = this.getParent();
	if (oFF.isNull(parent))
	{
		return this.getName();
	}
	return parent.getRootName();
};
oFF.CMEAbstractItem.prototype.hideIncludingChildren = function()
{
	this.setRemoved(true);
};
oFF.CMEAbstractItem.prototype.insertSubItems = function(index, actionItems) {};
oFF.CMEAbstractItem.prototype.insertSubItemsAsSiblingsAtSelfOffset = function(selfOffset, actionItems)
{
	let parent = this.getParent();
	if (oFF.notNull(parent))
	{
		let index = parent.getSubItems().getIndex(this);
		parent.insertSubItems(index + selfOffset, actionItems);
	}
};
oFF.CMEAbstractItem.prototype.isRemoved = function()
{
	return this.m_removed;
};
oFF.CMEAbstractItem.prototype.isRoot = function()
{
	return this.getParent() === null;
};
oFF.CMEAbstractItem.prototype.releaseObject = function()
{
	this.m_name = null;
	this.m_alias = null;
	this.m_parent = null;
	this.m_removed = false;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEAbstractItem.prototype.setAlias = function(alias)
{
	this.m_alias = alias;
};
oFF.CMEAbstractItem.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.CMEAbstractItem.prototype.setParent = function(parent)
{
	this.m_parent = oFF.XWeakReferenceUtil.getWeakRef(parent);
};
oFF.CMEAbstractItem.prototype.setRemoved = function(removed)
{
	this.m_removed = removed;
};
oFF.CMEAbstractItem.prototype.showIncludingParents = function()
{
	this.setRemoved(false);
	let parent = this.getParent();
	if (oFF.notNull(parent))
	{
		parent.showIncludingParents();
	}
};

oFF.CMEMenuJsonConstants = {

	CME_ACTIVE:"Active",
	CME_ENABLED:"Enabled",
	CME_FLAT:"Flat",
	CME_ICON:"Icon",
	CME_KEY:"Key",
	CME_LOCALIZABLE_TEXT:"LocalizableText",
	CME_NAME:"Name",
	CME_OPERATIONS:"Operations",
	CME_PARAMETERS:"Parameters",
	CME_REPLACEMENTS:"Replacements",
	CME_SUB_ITEMS:"SubItems",
	CME_TAGS:"Tags",
	CME_TEXT:"Text",
	CME_TOGGLE:"Toggle",
	CME_TYPE:"Type",
	CME_TYPE_GROUP:"Group",
	CME_TYPE_LEAF:"Leaf",
	CME_TYPE_OPERATION:"Operation",
	CME_TYPE_SEPARATOR:"Separator",
	CME_VISIBLE:"Visible"
};

oFF.CMEMenuJsonHelper = {

	configureGenericProperties:function(abstractMenuItem, prStructure)
	{
			abstractMenuItem.setName(prStructure.getStringByKey(oFF.CMEMenuJsonConstants.CME_NAME));
		abstractMenuItem.setText(prStructure.getStringByKey(oFF.CMEMenuJsonConstants.CME_TEXT));
		abstractMenuItem.setEnabled(prStructure.getBooleanByKeyExt(oFF.CMEMenuJsonConstants.CME_ENABLED, true));
		abstractMenuItem.setIcon(prStructure.getStringByKey(oFF.CMEMenuJsonConstants.CME_ICON));
		abstractMenuItem.setVisible(prStructure.getBooleanByKeyExt(oFF.CMEMenuJsonConstants.CME_VISIBLE, true));
		if (prStructure.containsKey(oFF.CMEMenuJsonConstants.CME_TAGS))
		{
			abstractMenuItem.addAllTags(oFF.XStream.of(prStructure.getListByKey(oFF.CMEMenuJsonConstants.CME_TAGS)).collect(oFF.XStreamCollector.toListOfString((el) => {
				return el.asString().getString();
			})));
		}
		let locText = prStructure.getStructureByKey(oFF.CMEMenuJsonConstants.CME_LOCALIZABLE_TEXT);
		if (oFF.notNull(locText))
		{
			let localizableText = oFF.CMELocalizableText.create();
			localizableText.setKey(locText.getStringByKey(oFF.CMEMenuJsonConstants.CME_KEY));
			let list = locText.getListByKey(oFF.CMEMenuJsonConstants.CME_REPLACEMENTS);
			if (oFF.XCollectionUtils.hasElements(list))
			{
				for (let i = 0; i < list.size(); i++)
				{
					localizableText.addReplacement(list.getStringAt(i));
				}
			}
			abstractMenuItem.setLocalizableText(localizableText);
		}
	},
	configureGroupingMenuItem:function(groupingMenuItem, prStructure)
	{
			oFF.CMEMenuJsonHelper.configureGenericProperties(groupingMenuItem, prStructure);
		let subList = prStructure.getListByKey(oFF.CMEMenuJsonConstants.CME_SUB_ITEMS);
		groupingMenuItem.setFlat(prStructure.getBooleanByKey(oFF.CMEMenuJsonConstants.CME_FLAT));
		for (let i = 0; i < subList.size(); i++)
		{
			let subStructure = subList.getStructureAt(i);
			let type = subStructure.getStringByKey(oFF.CMEMenuJsonConstants.CME_TYPE);
			if (oFF.XString.isEqual(type, oFF.CMEMenuJsonConstants.CME_TYPE_GROUP))
			{
				oFF.CMEMenuJsonHelper.configureGroupingMenuItem(groupingMenuItem.addNewGroup(), subStructure);
			}
			else if (oFF.XString.isEqual(type, oFF.CMEMenuJsonConstants.CME_TYPE_LEAF))
			{
				oFF.CMEMenuJsonHelper.configureLeafMenuItem(groupingMenuItem.addNewLeaf(), subStructure);
			}
			else if (oFF.XString.isEqual(type, oFF.CMEMenuJsonConstants.CME_TYPE_SEPARATOR))
			{
				oFF.CMEMenuJsonHelper.configureSeparator(groupingMenuItem.addNewSeparator(), subStructure);
			}
		}
	},
	configureLeafMenuItem:function(leafMenuItem, prStructure)
	{
			oFF.CMEMenuJsonHelper.configureGenericProperties(leafMenuItem, prStructure);
		leafMenuItem.setActive(prStructure.getBooleanByKey(oFF.CMEMenuJsonConstants.CME_ACTIVE));
		leafMenuItem.setToggle(prStructure.getBooleanByKey(oFF.CMEMenuJsonConstants.CME_TOGGLE));
	},
	configureSeparator:function(addNewSeparator, subStructure) {},
	deserialiseGroupingMenuItem:function(prStructure)
	{
			let groupingMenuItem = oFF.CMEGroupingMenuItem.create();
		oFF.CMEMenuJsonHelper.configureGroupingMenuItem(groupingMenuItem, prStructure);
		return groupingMenuItem;
	},
	serializeGenericItemProperties:function(abstractMenuItem, result)
	{
			let localizableText = abstractMenuItem.getLocalizableText();
		if (oFF.notNull(localizableText))
		{
			let structure = result.putNewStructure(oFF.CMEMenuJsonConstants.CME_LOCALIZABLE_TEXT);
			structure.putString(oFF.CMEMenuJsonConstants.CME_KEY, localizableText.getKey());
			let replacements = localizableText.getReplacements();
			if (oFF.XCollectionUtils.hasElements(replacements))
			{
				let list = structure.putNewList(oFF.CMEMenuJsonConstants.CME_REPLACEMENTS);
				for (let i = 0; i < replacements.size(); i++)
				{
					list.addString(replacements.get(i));
				}
			}
		}
		result.putString(oFF.CMEMenuJsonConstants.CME_NAME, abstractMenuItem.getName());
		result.putString(oFF.CMEMenuJsonConstants.CME_TEXT, abstractMenuItem.getText());
		result.putString(oFF.CMEMenuJsonConstants.CME_ICON, abstractMenuItem.getIcon());
		result.putBoolean(oFF.CMEMenuJsonConstants.CME_ENABLED, abstractMenuItem.isEnabled());
		result.putBoolean(oFF.CMEMenuJsonConstants.CME_VISIBLE, abstractMenuItem.isVisible());
		if (oFF.XCollectionUtils.hasElements(abstractMenuItem.getTags()))
		{
			result.putNewList(oFF.CMEMenuJsonConstants.CME_TAGS).addAllStrings(abstractMenuItem.getTags().getValuesAsReadOnlyList());
		}
	},
	serializeGroupingMenuItem:function(groupingMenuItem, keepHidden)
	{
			let prStructure = oFF.PrFactory.createStructure();
		if (oFF.notNull(groupingMenuItem))
		{
			oFF.CMEMenuJsonHelper.serializeGroupingMenuItemInternal(groupingMenuItem, prStructure, keepHidden);
		}
		return prStructure;
	},
	serializeGroupingMenuItemInternal:function(groupingMenuItem, result, keepHidden)
	{
			if (keepHidden || groupingMenuItem.isVisible())
		{
			oFF.CMEMenuJsonHelper.serializeGenericItemProperties(groupingMenuItem, result);
			result.putString(oFF.CMEMenuJsonConstants.CME_TYPE, oFF.CMEMenuJsonConstants.CME_TYPE_GROUP);
			result.putBoolean(oFF.CMEMenuJsonConstants.CME_FLAT, groupingMenuItem.isFlat());
			let subItems = groupingMenuItem.getSubItems();
			let subList = result.putNewList(oFF.CMEMenuJsonConstants.CME_SUB_ITEMS);
			for (let i = 0; i < subItems.size(); i++)
			{
				let subItem = subItems.get(i);
				let newStructure = subList.addNewStructure();
				if (subItem.getActionGroup() !== null)
				{
					oFF.CMEMenuJsonHelper.serializeGroupingMenuItemInternal(subItem.getActionGroup(), newStructure, keepHidden);
				}
				else if (subItem.getActionLeaf() !== null)
				{
					oFF.CMEMenuJsonHelper.serializeLeafMenuItemInternal(subItem.getActionLeaf(), newStructure, keepHidden);
				}
				else if (subItem.getMenuSeparator() !== null)
				{
					oFF.CMEMenuJsonHelper.serializeMenuSeparatorInternal(subItem.getMenuSeparator(), newStructure);
				}
			}
		}
	},
	serializeGroupingMenuItemToPaths:function(groupingMenuItem)
	{
			let buffi = oFF.XStringBuffer.create();
		oFF.CMEMenuJsonHelper.serializeGroupingMenuItemToPathsBuf(buffi, "", groupingMenuItem);
		return buffi.toString();
	},
	serializeGroupingMenuItemToPathsBuf:function(buffi, prefix, abstractItem)
	{
			let abstractMenuItem = abstractItem.getMenuItem();
		if (oFF.notNull(abstractMenuItem))
		{
			let groupingMenuItem = abstractMenuItem.getActionGroup();
			let leafMenuItem = abstractMenuItem.getActionLeaf();
			let flat = "";
			if (oFF.notNull(groupingMenuItem) && groupingMenuItem.isFlat())
			{
				flat = "{flat}";
			}
			if (oFF.notNull(leafMenuItem) && leafMenuItem.isToggle())
			{
				flat = "{toggle}";
			}
			let currentName = oFF.XStringUtils.concatenate5(abstractMenuItem.getName(), "(", abstractMenuItem.getText(), ")", flat);
			let tags = abstractMenuItem.getTags().getIterator();
			while (tags.hasNext())
			{
				currentName = oFF.XStringUtils.concatenate3(currentName, "/", tags.next());
			}
			let newPrefixName = oFF.XStringUtils.concatenate3(prefix, ".", currentName);
			buffi.appendNewLine();
			buffi.append(newPrefixName);
			let newPrefix = oFF.XStringUtils.concatenate3(prefix, ".", abstractMenuItem.getName());
			if (oFF.notNull(groupingMenuItem))
			{
				let children = groupingMenuItem.getSubItems();
				for (let i = 0; i < children.size(); i++)
				{
					oFF.CMEMenuJsonHelper.serializeGroupingMenuItemToPathsBuf(buffi, newPrefix, children.get(i));
				}
			}
		}
	},
	serializeLeafMenuItemInternal:function(leafMenuItem, result, keepHidden)
	{
			if (keepHidden || leafMenuItem.isVisible())
		{
			oFF.CMEMenuJsonHelper.serializeGenericItemProperties(leafMenuItem, result);
			result.putString(oFF.CMEMenuJsonConstants.CME_TYPE, oFF.CMEMenuJsonConstants.CME_TYPE_LEAF);
			result.putBoolean(oFF.CMEMenuJsonConstants.CME_ACTIVE, leafMenuItem.isActive());
			result.putBoolean(oFF.CMEMenuJsonConstants.CME_TOGGLE, leafMenuItem.isToggle());
		}
	},
	serializeMenuSeparatorInternal:function(menuSeparator, result)
	{
			result.putString(oFF.CMEMenuJsonConstants.CME_TYPE, oFF.CMEMenuJsonConstants.CME_TYPE_SEPARATOR);
	}
};

oFF.CMERegistry = function() {};
oFF.CMERegistry.prototype = new oFF.XObject();
oFF.CMERegistry.prototype._ff_c = "CMERegistry";

oFF.CMERegistry.create = function()
{
	let instance = new oFF.CMERegistry();
	instance.setup();
	return instance;
};
oFF.CMERegistry.prototype.m_actionRegistry = null;
oFF.CMERegistry.prototype.m_facadeRegistry = null;
oFF.CMERegistry.prototype.m_optionRegistry = null;
oFF.CMERegistry.prototype.getAction = function(name)
{
	return this.m_actionRegistry.getByKey(name);
};
oFF.CMERegistry.prototype.getFacade = function(name)
{
	return this.m_facadeRegistry.getByKey(name);
};
oFF.CMERegistry.prototype.getOption = function(name)
{
	return this.m_optionRegistry.getByKey(name);
};
oFF.CMERegistry.prototype.getRegisteredActions = function()
{
	return this.m_actionRegistry.getValuesAsReadOnlyList();
};
oFF.CMERegistry.prototype.getRegisteredOptions = function()
{
	return this.m_optionRegistry.getValuesAsReadOnlyList();
};
oFF.CMERegistry.prototype.registerAction = function(name, action)
{
	this.m_actionRegistry.put(name, action);
	action.ensureNameProvider(name);
	action.addAliasName(name);
};
oFF.CMERegistry.prototype.registerFacade = function(name, facade)
{
	this.m_facadeRegistry.put(name, facade);
};
oFF.CMERegistry.prototype.registerOption = function(name, option)
{
	this.m_optionRegistry.put(name, option);
	option.addAliasName(name);
};
oFF.CMERegistry.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_facadeRegistry = oFF.XHashMapByString.create();
	this.m_optionRegistry = oFF.XHashMapByString.create();
	this.m_actionRegistry = oFF.XHashMapByString.create();
};

oFF.CMEUiCache = function() {};
oFF.CMEUiCache.prototype = new oFF.XObject();
oFF.CMEUiCache.prototype._ff_c = "CMEUiCache";

oFF.CMEUiCache.create = function()
{
	let instance = new oFF.CMEUiCache();
	instance.setup();
	return instance;
};
oFF.CMEUiCache.prototype.m_cleaningFactory = null;
oFF.CMEUiCache.prototype.m_contextMenuRegistry = null;
oFF.CMEUiCache.prototype.m_subItemsRegistry = null;
oFF.CMEUiCache.prototype.m_uiItemRegistry = null;
oFF.CMEUiCache.prototype.cleanupAll = function(clu)
{
	oFF.XCollectionUtils.forEach(clu, (item) => {
		item.execute();
	});
};
oFF.CMEUiCache.prototype.clearUiItemByKey = function(uiObject, key)
{
	let uiItemRegistries = this.m_uiItemRegistry.getByKey(uiObject);
	let cleaningProcs = this.m_cleaningFactory.getByKey(uiObject);
	let subItems = this.m_subItemsRegistry.getByKey(uiObject);
	oFF.XCollectionUtils.getOptionalByString(subItems, key).ifPresent((subit) => {
		oFF.XCollectionUtils.forEach(subit, (subel) => {
			this.releaseUiItem(subel);
		});
		subItems.remove(key);
	});
	oFF.XCollectionUtils.getOptionalByString(cleaningProcs, key).ifPresent((subProc) => {
		cleaningProcs.remove(key);
	});
	oFF.XCollectionUtils.getOptionalByString(uiItemRegistries, key).ifPresent((subReg) => {
		uiItemRegistries.remove(key);
	});
};
oFF.CMEUiCache.prototype.getMenuItem = function(uiObject, key)
{
	let subMap = this.m_uiItemRegistry.getByKey(uiObject);
	return oFF.isNull(subMap) ? null : subMap.getByKey(key);
};
oFF.CMEUiCache.prototype.getOrCreateCachedMenu = function(menuName, supplier)
{
	if (!this.m_contextMenuRegistry.containsKey(menuName))
	{
		this.m_contextMenuRegistry.put(menuName, supplier());
	}
	return this.m_contextMenuRegistry.getByKey(menuName);
};
oFF.CMEUiCache.prototype.getSubUiItem = function(uiObject, rootName, index)
{
	let subMap = this.m_subItemsRegistry.getByKey(uiObject);
	let subList = oFF.isNull(subMap) ? null : subMap.getByKey(rootName);
	return oFF.isNull(subList) || subList.size() <= index ? null : subList.get(index);
};
oFF.CMEUiCache.prototype.prepareSubUiItemRegistry = function(uiObject, rootName)
{
	if (this.m_subItemsRegistry.containsKey(uiObject))
	{
		let subMap = this.m_subItemsRegistry.getByKey(uiObject);
		if (subMap.containsKey(rootName))
		{
			subMap.getByKey(rootName).clear();
		}
	}
};
oFF.CMEUiCache.prototype.registerSubUiItem = function(uiObject, rootName, subUiObject)
{
	if (!this.m_subItemsRegistry.containsKey(uiObject))
	{
		this.m_subItemsRegistry.put(uiObject, oFF.XHashMapByString.create());
	}
	let subMap = this.m_subItemsRegistry.getByKey(uiObject);
	if (!subMap.containsKey(rootName))
	{
		subMap.put(rootName, oFF.XList.create());
	}
	subMap.getByKey(rootName).add(subUiObject);
};
oFF.CMEUiCache.prototype.registerUiItem = function(uiObject, key, abstractMenuItem, cleanupProcedure)
{
	this.clearUiItemByKey(uiObject, key);
	if (!this.m_uiItemRegistry.containsKey(uiObject))
	{
		this.m_uiItemRegistry.put(uiObject, oFF.XWeakMap.create());
		this.m_cleaningFactory.put(uiObject, oFF.XWeakMap.create());
	}
	this.m_uiItemRegistry.getByKey(uiObject).put(key, abstractMenuItem);
	this.m_cleaningFactory.getByKey(uiObject).put(key, oFF.XProcedureHolder.create(cleanupProcedure));
};
oFF.CMEUiCache.prototype.releaseObject = function()
{
	oFF.XCollectionUtils.forEach(this.m_cleaningFactory.getValuesAsReadOnlyList(), (clu) => {
		try
		{
			this.cleanupAll(clu);
		}
		catch (t)
		{
			oFF.XLogger.println(oFF.XException.getMessage(t));
		}
	});
	oFF.XCollectionUtils.forEach(this.m_cleaningFactory.getValuesAsReadOnlyList(), (pro) => {
		oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(pro);
	});
	oFF.XCollectionUtils.forEach(this.m_cleaningFactory.getKeysAsReadOnlyList(), (k0) => {
		oFF.XObjectExt.release(k0);
	});
	this.m_cleaningFactory = oFF.XObjectExt.release(this.m_cleaningFactory);
	oFF.XCollectionUtils.forEach(this.m_subItemsRegistry.getValuesAsReadOnlyList(), (val) => {
		oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(val);
	});
	oFF.XCollectionUtils.forEach(this.m_subItemsRegistry.getKeysAsReadOnlyList(), (k1) => {
		oFF.XObjectExt.release(k1);
	});
	this.m_subItemsRegistry = oFF.XObjectExt.release(this.m_subItemsRegistry);
	oFF.XCollectionUtils.forEach(this.m_uiItemRegistry.getValuesAsReadOnlyList(), (uit) => {
		oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(uit);
	});
	oFF.XCollectionUtils.forEach(this.m_uiItemRegistry.getKeysAsReadOnlyList(), (k2) => {
		oFF.XObjectExt.release(k2);
	});
	this.m_subItemsRegistry = oFF.XObjectExt.release(this.m_subItemsRegistry);
	oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_contextMenuRegistry);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEUiCache.prototype.releaseUiItem = function(uiObject)
{
	let uiItemRegistries = this.m_uiItemRegistry.getByKey(uiObject);
	let cleaningProcs = this.m_cleaningFactory.getByKey(uiObject);
	let subItems = this.m_subItemsRegistry.getByKey(uiObject);
	if (oFF.XCollectionUtils.hasElements(subItems))
	{
		oFF.XCollectionUtils.forEach(subItems.getValuesAsReadOnlyList(), (sublist) => {
			oFF.XCollectionUtils.forEach(sublist, (subElement) => {
				this.releaseUiItem(subElement);
			});
		});
	}
	if (oFF.XObjectExt.isValidObject(uiObject) && oFF.XObjectExt.isValidObject(cleaningProcs))
	{
		oFF.XCollectionUtils.forEach(cleaningProcs.getValuesAsReadOnlyList(), (proc) => {
			proc.execute();
		});
	}
	oFF.XObjectExt.release(cleaningProcs);
	oFF.XObjectExt.release(uiItemRegistries);
	this.m_cleaningFactory.remove(uiObject);
	this.m_uiItemRegistry.remove(uiObject);
	this.m_subItemsRegistry.remove(uiObject);
};
oFF.CMEUiCache.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_uiItemRegistry = oFF.XSimpleMap.create();
	this.m_subItemsRegistry = oFF.XSimpleMap.create();
	this.m_cleaningFactory = oFF.XSimpleMap.create();
	this.m_contextMenuRegistry = oFF.XWeakMap.create();
};

oFF.CMEActionController = function() {};
oFF.CMEActionController.prototype = new oFF.XObject();
oFF.CMEActionController.prototype._ff_c = "CMEActionController";

oFF.CMEActionController.create = function()
{
	let instance = new oFF.CMEActionController();
	instance.setup();
	return instance;
};
oFF.CMEActionController.getLogString = function(action, option, context)
{
	return oFF.XStringUtils.concatenate5(oFF.isNull(action) ? "" : action.getName(context), "::", oFF.isNull(option) ? "" : option.getName(context), "::", context.getUiContext());
};
oFF.CMEActionController.prototype.m_listeners = null;
oFF.CMEActionController.prototype.m_loggingEnabled = false;
oFF.CMEActionController.prototype.attachActionListener = function(actionControllerListener)
{
	this.m_listeners.add(actionControllerListener);
};
oFF.CMEActionController.prototype.checkAvailable = function(action, context)
{
	let available = oFF.XStream.of(this.m_listeners).map((listener) => {
		return oFF.XBooleanValue.create(listener.checkAvailable(action, context));
	}).reduce(oFF.XBooleanValue.create(action.isAvailable(context)), (a, b) => {
		return oFF.XBooleanValue.create(a.getBoolean() && b.getBoolean());
	}).getBoolean();
	return available;
};
oFF.CMEActionController.prototype.checkEnabled = function(action, context)
{
	let enabled = oFF.XStream.of(this.m_listeners).map((listener) => {
		return oFF.XBooleanValue.create(listener.checkEnabled(action, context));
	}).reduce(oFF.XBooleanValue.create(action.isEnabled(context)), (a, b) => {
		return oFF.XBooleanValue.create(a.getBoolean() && b.getBoolean());
	}).getBoolean();
	return enabled;
};
oFF.CMEActionController.prototype.checkToggled = function(action, context)
{
	let toggled = oFF.XStream.of(this.m_listeners).map((listener) => {
		return listener.checkToggled(action, context);
	}).reduce(action.isToggledExt(context), (a, b) => {
		return a === oFF.TriStateBool._TRUE || b === oFF.TriStateBool._TRUE ? oFF.TriStateBool._TRUE : a === oFF.TriStateBool._DEFAULT || b === oFF.TriStateBool._DEFAULT ? oFF.TriStateBool._DEFAULT : oFF.TriStateBool._FALSE;
	});
	return toggled;
};
oFF.CMEActionController.prototype.detachActionListener = function(actionControllerListener)
{
	this.m_listeners.removeElement(actionControllerListener);
};
oFF.CMEActionController.prototype.isLoggingEnabled = function()
{
	return this.m_loggingEnabled;
};
oFF.CMEActionController.prototype.onActionMultiSelect = function(action, option, selected, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("Executing Multi Select Action: ", oFF.CMEActionController.getLogString(action, option, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onActionMultiSelect(action, option, selected, context);
	}
	action.selectOption(context, option, selected);
};
oFF.CMEActionController.prototype.onActionSingleSelect = function(action, option, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("Executing Single Select Action: ", oFF.CMEActionController.getLogString(action, option, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onActionSingleSelect(action, option, context);
	}
	action.selectOption(context, option);
};
oFF.CMEActionController.prototype.onActionToggled = function(action, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("Executing Toggle Action: ", oFF.CMEActionController.getLogString(action, null, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onActionToggled(action, context);
	}
	action.toggle(context);
};
oFF.CMEActionController.prototype.onActionTriggered = function(action, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("Executing Trigger Action: ", oFF.CMEActionController.getLogString(action, null, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onActionTriggered(action, context);
	}
	action.trigger(context);
};
oFF.CMEActionController.prototype.onHighlight = function(action, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("Highlighting Action: ", oFF.CMEActionController.getLogString(action, null, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onHighlight(action, context);
	}
	action.highlight(context);
};
oFF.CMEActionController.prototype.onUnHighlight = function(action, context)
{
	if (this.m_loggingEnabled)
	{
		oFF.XLogger.println(oFF.XStringUtils.concatenate2("UnHighlighting Action: ", oFF.CMEActionController.getLogString(action, null, context)));
	}
	for (let i = 0; i < this.m_listeners.size(); i++)
	{
		this.m_listeners.get(i).onUnHighlight(action, context);
	}
	action.unHighlight(context);
};
oFF.CMEActionController.prototype.releaseObject = function()
{
	this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
};
oFF.CMEActionController.prototype.retrieveExplanation = function(action, context)
{
	let explanation = action.getLocalizedExplanation(context);
	for (let i = 0; oFF.isNull(explanation) && i < this.m_listeners.size(); i++)
	{
		explanation = this.m_listeners.get(i).retrieveExplanation(action, context);
	}
	return explanation;
};
oFF.CMEActionController.prototype.retrieveIcon = function(action, context)
{
	let icon = action.getIcon(context);
	for (let i = 0; oFF.isNull(icon) && i < this.m_listeners.size(); i++)
	{
		icon = this.m_listeners.get(i).retrieveIcon(action, context);
	}
	return icon;
};
oFF.CMEActionController.prototype.retrieveName = function(action, context)
{
	let name = action.getName(context);
	for (let i = 0; oFF.isNull(name) && i < this.m_listeners.size(); i++)
	{
		name = this.m_listeners.get(i).retrieveName(action, context);
	}
	return name;
};
oFF.CMEActionController.prototype.retrieveText = function(action, context)
{
	let text = action.getLocalizedText(context);
	for (let i = 0; oFF.isNull(text) && i < this.m_listeners.size(); i++)
	{
		text = this.m_listeners.get(i).retrieveText(action, context);
	}
	return text;
};
oFF.CMEActionController.prototype.setLoggingEnabled = function(loggingEnabled)
{
	this.m_loggingEnabled = loggingEnabled;
};
oFF.CMEActionController.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_listeners = oFF.XList.create();
};

oFF.CMEActionGroup = function() {};
oFF.CMEActionGroup.prototype = new oFF.CMEAbstractAction();
oFF.CMEActionGroup.prototype._ff_c = "CMEActionGroup";

oFF.CMEActionGroup.create = function()
{
	let instance = new oFF.CMEActionGroup();
	instance.setup();
	return instance;
};
oFF.CMEActionGroup.prototype.m_actions = null;
oFF.CMEActionGroup.prototype.addAction = function(action)
{
	this.m_actions.add(action);
};
oFF.CMEActionGroup.prototype.addNewDataProviderAction = function(name, dataProviderContext)
{
	let newAction = oFF.CMEDataProviderMenuAction.create(name, dataProviderContext);
	this.m_actions.add(newAction);
	return newAction;
};
oFF.CMEActionGroup.prototype.addNewMultiSelectAction = function()
{
	let newAction = oFF.CMEMultiSelectAction.create();
	this.m_actions.add(newAction);
	return newAction;
};
oFF.CMEActionGroup.prototype.addNewSingleSelectAction = function()
{
	let newAction = oFF.CMESingleSelectAction.create();
	this.m_actions.add(newAction);
	return newAction;
};
oFF.CMEActionGroup.prototype.addNewToggleAction = function()
{
	let newAction = oFF.CMEToggleAction.create();
	this.m_actions.add(newAction);
	return newAction;
};
oFF.CMEActionGroup.prototype.addNewTriggerAction = function()
{
	let newAction = oFF.CMETriggerAction.create();
	this.m_actions.add(newAction);
	return newAction;
};
oFF.CMEActionGroup.prototype.mapToMenuCreator = function(controller)
{
	let groupCreator = oFF.CMEGroupCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, groupCreator);
	oFF.XCollectionUtils.forEach(this.m_actions, (action) => {
		let subCreator = action.mapToMenuCreator(controller);
		groupCreator.addMenuCreator(subCreator);
	});
	return groupCreator;
};
oFF.CMEActionGroup.prototype.setup = function()
{
	oFF.CMEAbstractAction.prototype.setup.call( this );
	this.m_actions = oFF.XList.create();
};

oFF.CMEDataProviderParameter = function() {};
oFF.CMEDataProviderParameter.prototype = new oFF.XObject();
oFF.CMEDataProviderParameter.prototype._ff_c = "CMEDataProviderParameter";

oFF.CMEDataProviderParameter.prototype.m_contextString = null;
oFF.CMEDataProviderParameter.prototype.m_name = null;
oFF.CMEDataProviderParameter.prototype.getName = function()
{
	return this.m_name;
};
oFF.CMEDataProviderParameter.prototype.releaseObject = function()
{
	this.m_contextString = null;
	this.m_name = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEDataProviderParameter.prototype.setName = function(name)
{
	this.m_name = name;
};

oFF.CMEMultiSelectAction = function() {};
oFF.CMEMultiSelectAction.prototype = new oFF.CMEAbstractAction();
oFF.CMEMultiSelectAction.prototype._ff_c = "CMEMultiSelectAction";

oFF.CMEMultiSelectAction.create = function()
{
	let instance = new oFF.CMEMultiSelectAction();
	instance.setup();
	return instance;
};
oFF.CMEMultiSelectAction.prototype.m_deferredOptionsRetriever = null;
oFF.CMEMultiSelectAction.prototype.m_doubtfulSelectionsRetriever = null;
oFF.CMEMultiSelectAction.prototype.m_eagerlyRetrieveDeferredOptions = false;
oFF.CMEMultiSelectAction.prototype.m_optionsRetriever = null;
oFF.CMEMultiSelectAction.prototype.m_selectionConsumer = null;
oFF.CMEMultiSelectAction.prototype.m_selectionRetriever = null;
oFF.CMEMultiSelectAction.prototype.asMultiSelectAction = function()
{
	return this;
};
oFF.CMEMultiSelectAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.MULTI_SELECT;
};
oFF.CMEMultiSelectAction.prototype.getAvailableOptions = function(context)
{
	return oFF.isNull(this.m_optionsRetriever) ? null : this.m_optionsRetriever(context);
};
oFF.CMEMultiSelectAction.prototype.getSelectedOptions = function(context)
{
	return oFF.isNull(this.m_selectionRetriever) ? null : this.m_selectionRetriever(context);
};
oFF.CMEMultiSelectAction.prototype.mapToMenuCreator = function(controller)
{
	let groupCreator = oFF.CMEGroupCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, groupCreator);
	groupCreator.setOptionsRetriever(this.m_optionsRetriever);
	groupCreator.setDeferredOptionsRetriever(this.m_eagerlyRetrieveDeferredOptions, this.m_deferredOptionsRetriever);
	groupCreator.setSelectionsRetriever(this.m_selectionRetriever);
	groupCreator.setDoubtfulSelectionsRetriever(this.m_doubtfulSelectionsRetriever);
	if (oFF.isNull(controller))
	{
		groupCreator.setSelectionConsumer(this.m_selectionConsumer);
	}
	else
	{
		groupCreator.setSelectionConsumer((e, f, g) => {
			controller.onActionMultiSelect(this, f, g.getBoolean(), e);
		});
	}
	return groupCreator;
};
oFF.CMEMultiSelectAction.prototype.selectOption = function(context, option, selected)
{
	if (oFF.notNull(this.m_selectionConsumer))
	{
		this.m_selectionConsumer(context, option, oFF.XBooleanValue.create(selected));
	}
};
oFF.CMEMultiSelectAction.prototype.setDeferredOptionsRetriever = function(eager, deferredOptionsRetriever)
{
	this.m_eagerlyRetrieveDeferredOptions = eager;
	this.m_deferredOptionsRetriever = deferredOptionsRetriever;
};
oFF.CMEMultiSelectAction.prototype.setDoubtfulSelectionsRetriever = function(selectionRetriever)
{
	this.m_doubtfulSelectionsRetriever = selectionRetriever;
};
oFF.CMEMultiSelectAction.prototype.setOptionsRetriever = function(optionsRetriever)
{
	this.m_optionsRetriever = optionsRetriever;
};
oFF.CMEMultiSelectAction.prototype.setSelectionConsumer = function(selectionConsumer)
{
	this.m_selectionConsumer = selectionConsumer;
};
oFF.CMEMultiSelectAction.prototype.setSelectionRetriever = function(selectionRetriever)
{
	this.m_selectionRetriever = selectionRetriever;
};

oFF.CMESelectionOption = function() {};
oFF.CMESelectionOption.prototype = new oFF.CMEAbstractAction();
oFF.CMESelectionOption.prototype._ff_c = "CMESelectionOption";

oFF.CMESelectionOption.create = function()
{
	let instance = new oFF.CMESelectionOption();
	instance.setup();
	return instance;
};
oFF.CMESelectionOption.prototype.m_customObject = null;
oFF.CMESelectionOption.prototype.asSelectOption = function()
{
	return this;
};
oFF.CMESelectionOption.prototype.getActionType = function()
{
	return oFF.CmeActionType.OPTION;
};
oFF.CMESelectionOption.prototype.getCustomObject = function()
{
	return this.m_customObject;
};
oFF.CMESelectionOption.prototype.mapToMenuCreator = function(controller)
{
	let leafCreator = oFF.CMELeafCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, leafCreator);
	return leafCreator;
};
oFF.CMESelectionOption.prototype.releaseObject = function()
{
	this.m_customObject = null;
	oFF.CMEAbstractAction.prototype.releaseObject.call( this );
};
oFF.CMESelectionOption.prototype.setCustomObject = function(customObject)
{
	this.m_customObject = customObject;
};

oFF.CMEConditionalMenuCreatorGroup = function() {};
oFF.CMEConditionalMenuCreatorGroup.prototype = new oFF.CMEMenuCreator();
oFF.CMEConditionalMenuCreatorGroup.prototype._ff_c = "CMEConditionalMenuCreatorGroup";

oFF.CMEConditionalMenuCreatorGroup.create = function()
{
	let instance = new oFF.CMEConditionalMenuCreatorGroup();
	instance.setup();
	return instance;
};
oFF.CMEConditionalMenuCreatorGroup.prototype.m_menuCreators = null;
oFF.CMEConditionalMenuCreatorGroup.prototype.addConditionalMenuCreator = function(creator)
{
	this.m_menuCreators.add(creator);
};
oFF.CMEConditionalMenuCreatorGroup.prototype.getMatchingTopMenuName = function(parameters)
{
	let topMenuName = null;
	for (let i = 0; i < this.m_menuCreators.size(); i++)
	{
		topMenuName = this.m_menuCreators.get(i).getMatchingTopMenuName(parameters);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(topMenuName))
		{
			break;
		}
	}
	return topMenuName;
};
oFF.CMEConditionalMenuCreatorGroup.prototype.setup = function()
{
	oFF.CMEMenuCreator.prototype.setup.call( this );
	this.m_menuCreators = oFF.XList.create();
};
oFF.CMEConditionalMenuCreatorGroup.prototype.transform = function(parameters, resultContainer)
{
	for (let i = 0; i < this.m_menuCreators.size(); i++)
	{
		if (this.m_menuCreators.get(i).conditionalTransform(this.getSubContext(parameters), resultContainer))
		{
			break;
		}
	}
};

oFF.CMELocalizableTextCreatorContextCompound = function() {};
oFF.CMELocalizableTextCreatorContextCompound.prototype = new oFF.CMELocalizableTextCreatorAbstract();
oFF.CMELocalizableTextCreatorContextCompound.prototype._ff_c = "CMELocalizableTextCreatorContextCompound";

oFF.CMELocalizableTextCreatorContextCompound.create = function()
{
	let instance = new oFF.CMELocalizableTextCreatorContextCompound();
	instance.setup();
	return instance;
};
oFF.CMELocalizableTextCreatorContextCompound.prototype.m_conditionalReplacers = null;
oFF.CMELocalizableTextCreatorContextCompound.prototype.addReplacer = function(conditionalExpression, textCreatorAbstract)
{
	this.m_conditionalReplacers.add(oFF.CMELocalizableTextContextCompound.create(conditionalExpression, textCreatorAbstract));
};
oFF.CMELocalizableTextCreatorContextCompound.prototype.getKey = function(context)
{
	let key = null;
	for (let i = 0; i < this.m_conditionalReplacers.size(); i++)
	{
		let match = this.m_conditionalReplacers.get(i).getMatch(context);
		if (oFF.notNull(match))
		{
			key = match.getKey(context);
			break;
		}
	}
	return key;
};
oFF.CMELocalizableTextCreatorContextCompound.prototype.getReplacements = function(context)
{
	let replacements = null;
	for (let i = 0; i < this.m_conditionalReplacers.size(); i++)
	{
		let match = this.m_conditionalReplacers.get(i).getMatch(context);
		if (oFF.notNull(match))
		{
			replacements = match.getReplacements(context);
			break;
		}
	}
	return replacements;
};
oFF.CMELocalizableTextCreatorContextCompound.prototype.setup = function()
{
	oFF.CMELocalizableTextCreatorAbstract.prototype.setup.call( this );
	this.m_conditionalReplacers = oFF.XList.create();
};

oFF.CMELocalizableTextCreatorSimple = function() {};
oFF.CMELocalizableTextCreatorSimple.prototype = new oFF.CMELocalizableTextCreatorAbstract();
oFF.CMELocalizableTextCreatorSimple.prototype._ff_c = "CMELocalizableTextCreatorSimple";

oFF.CMELocalizableTextCreatorSimple.create = function()
{
	let instance = new oFF.CMELocalizableTextCreatorSimple();
	instance.setup();
	return instance;
};
oFF.CMELocalizableTextCreatorSimple.prototype.m_key = null;
oFF.CMELocalizableTextCreatorSimple.prototype.m_replacements = null;
oFF.CMELocalizableTextCreatorSimple.prototype.addReplacement = function(placeholder)
{
	this.m_replacements.add(placeholder);
};
oFF.CMELocalizableTextCreatorSimple.prototype.getKey = function(context)
{
	return this.m_key;
};
oFF.CMELocalizableTextCreatorSimple.prototype.getReplacements = function(context)
{
	return this.m_replacements;
};
oFF.CMELocalizableTextCreatorSimple.prototype.setKey = function(key)
{
	this.m_key = key;
};
oFF.CMELocalizableTextCreatorSimple.prototype.setup = function()
{
	oFF.CMELocalizableTextCreatorAbstract.prototype.setup.call( this );
	this.m_replacements = oFF.XList.create();
};

oFF.CMEMenuItemCreator = function() {};
oFF.CMEMenuItemCreator.prototype = new oFF.CMEMenuCreator();
oFF.CMEMenuItemCreator.prototype._ff_c = "CMEMenuItemCreator";

oFF.CMEMenuItemCreator.prototype.m_dataHelpId = null;
oFF.CMEMenuItemCreator.prototype.m_enabled = null;
oFF.CMEMenuItemCreator.prototype.m_explanation = null;
oFF.CMEMenuItemCreator.prototype.m_highlightProcedure = null;
oFF.CMEMenuItemCreator.prototype.m_icon = null;
oFF.CMEMenuItemCreator.prototype.m_localizableExplanation = null;
oFF.CMEMenuItemCreator.prototype.m_localizableText = null;
oFF.CMEMenuItemCreator.prototype.m_name = null;
oFF.CMEMenuItemCreator.prototype.m_overflowPriority = 0;
oFF.CMEMenuItemCreator.prototype.m_text = null;
oFF.CMEMenuItemCreator.prototype.m_unHighlightProcedure = null;
oFF.CMEMenuItemCreator.prototype.m_visible = null;
oFF.CMEMenuItemCreator.prototype.addEnabledConstraint = function(enabled)
{
	this.m_enabled.add(enabled);
};
oFF.CMEMenuItemCreator.prototype.addVisibleConstraint = function(visible)
{
	this.m_visible.add(visible);
};
oFF.CMEMenuItemCreator.prototype.getDataHelpId = function()
{
	return oFF.notNull(this.m_dataHelpId) ? this.m_dataHelpId : oFF.CMEValueLiteralResolver.getNullResolver();
};
oFF.CMEMenuItemCreator.prototype.getExplanation = function()
{
	return oFF.notNull(this.m_explanation) ? this.m_explanation : oFF.CMEValueLiteralResolver.getNullResolver();
};
oFF.CMEMenuItemCreator.prototype.getIcon = function()
{
	return oFF.notNull(this.m_icon) ? this.m_icon : oFF.CMEValueLiteralResolver.getNullResolver();
};
oFF.CMEMenuItemCreator.prototype.getLocalizableExplanation = function()
{
	return this.m_localizableExplanation;
};
oFF.CMEMenuItemCreator.prototype.getLocalizableText = function()
{
	return this.m_localizableText;
};
oFF.CMEMenuItemCreator.prototype.getMatchingTopMenuName = function(parameters)
{
	return this.getName().resolveString(parameters);
};
oFF.CMEMenuItemCreator.prototype.getName = function()
{
	return oFF.notNull(this.m_name) ? this.m_name : oFF.CMEValueLiteralResolver.getNullResolver();
};
oFF.CMEMenuItemCreator.prototype.getOverflowPriority = function()
{
	return this.m_overflowPriority;
};
oFF.CMEMenuItemCreator.prototype.getText = function()
{
	return oFF.notNull(this.m_text) ? this.m_text : oFF.CMEValueLiteralResolver.getNullResolver();
};
oFF.CMEMenuItemCreator.prototype.resolveEnabled = function(context)
{
	let result = true;
	for (let i = 0; result && i < this.m_enabled.size(); i++)
	{
		result = result && this.m_enabled.get(i).resolveBoolean(context);
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.resolveHighlightProcedure = function(contextAccess)
{
	let result = null;
	if (oFF.notNull(this.m_highlightProcedure))
	{
		result = () => {
			this.m_highlightProcedure(contextAccess);
		};
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.resolveLocalizableExplanation = function(context)
{
	let result = null;
	if (oFF.notNull(this.m_localizableExplanation))
	{
		result = oFF.CMELocalizableText.create();
		result.setKey(this.m_localizableExplanation.getKey(context));
		let replacements = this.m_localizableExplanation.getReplacements(context);
		for (let i = 0; i < replacements.size(); i++)
		{
			result.addReplacement(replacements.get(i).resolveString(context));
		}
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.resolveLocalizableText = function(context)
{
	let result = null;
	if (oFF.notNull(this.m_localizableText))
	{
		result = oFF.CMELocalizableText.create();
		result.setKey(this.m_localizableText.getKey(context));
		let replacements = this.m_localizableText.getReplacements(context);
		for (let i = 0; i < replacements.size(); i++)
		{
			result.addReplacement(replacements.get(i).resolveString(context));
		}
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.resolveUnHighlightProcedure = function(contextAccess)
{
	let result = null;
	if (oFF.notNull(this.m_unHighlightProcedure))
	{
		result = () => {
			this.m_unHighlightProcedure(contextAccess);
		};
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.resolveVisible = function(context)
{
	let result = true;
	for (let i = 0; result && i < this.m_visible.size(); i++)
	{
		result = result && this.m_visible.get(i).resolveBoolean(context);
	}
	return result;
};
oFF.CMEMenuItemCreator.prototype.setDataHelpId = function(dataHelpId)
{
	this.m_dataHelpId = dataHelpId;
};
oFF.CMEMenuItemCreator.prototype.setDisableIfLessThanNEnabledItems = function(disable) {};
oFF.CMEMenuItemCreator.prototype.setDisableIfLessThanNItems = function(disable) {};
oFF.CMEMenuItemCreator.prototype.setEager = function(eager) {};
oFF.CMEMenuItemCreator.prototype.setExplanation = function(explanation)
{
	this.m_explanation = explanation;
};
oFF.CMEMenuItemCreator.prototype.setFirstSubOptionIsDefault = function(firstSubOptionIsDefault) {};
oFF.CMEMenuItemCreator.prototype.setFlatIfLessThanNItems = function(flat) {};
oFF.CMEMenuItemCreator.prototype.setHideIfLessThanNItems = function(hide) {};
oFF.CMEMenuItemCreator.prototype.setHighlightProcedure = function(highlightProcedure)
{
	this.m_highlightProcedure = highlightProcedure;
};
oFF.CMEMenuItemCreator.prototype.setIcon = function(icon)
{
	this.m_icon = icon;
};
oFF.CMEMenuItemCreator.prototype.setKeepTitleForFlat = function(keepTitleForFlat) {};
oFF.CMEMenuItemCreator.prototype.setLocalizableExplanation = function(localizableExplanation)
{
	this.m_localizableExplanation = localizableExplanation;
};
oFF.CMEMenuItemCreator.prototype.setLocalizableText = function(localizableText)
{
	this.m_localizableText = localizableText;
};
oFF.CMEMenuItemCreator.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.CMEMenuItemCreator.prototype.setOverflowIfMoreThanNItems = function(overflowIfMoreThanNItems) {};
oFF.CMEMenuItemCreator.prototype.setOverflowLocalizableText = function(overflowLocalizableText) {};
oFF.CMEMenuItemCreator.prototype.setOverflowPriority = function(overflowPriority)
{
	this.m_overflowPriority = overflowPriority;
};
oFF.CMEMenuItemCreator.prototype.setOverflowText = function(overflowText) {};
oFF.CMEMenuItemCreator.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.CMEMenuItemCreator.prototype.setUnHighlightProcedure = function(unHighlightProcedure)
{
	this.m_unHighlightProcedure = unHighlightProcedure;
};
oFF.CMEMenuItemCreator.prototype.setup = function()
{
	oFF.CMEMenuCreator.prototype.setup.call( this );
	this.m_enabled = oFF.XList.create();
	this.m_visible = oFF.XList.create();
};

oFF.CMEValueContextSwitchResolver = function() {};
oFF.CMEValueContextSwitchResolver.prototype = new oFF.CMEValueResolver();
oFF.CMEValueContextSwitchResolver.prototype._ff_c = "CMEValueContextSwitchResolver";

oFF.CMEValueContextSwitchResolver.create = function()
{
	let instance = new oFF.CMEValueContextSwitchResolver();
	instance.setup();
	return instance;
};
oFF.CMEValueContextSwitchResolver.prototype.m_conditionalValues = null;
oFF.CMEValueContextSwitchResolver.prototype.addConditionalValue = function(contextExpression, resolver)
{
	this.m_conditionalValues.add(oFF.CMEValueContextCompound.create(contextExpression, resolver));
};
oFF.CMEValueContextSwitchResolver.prototype.releaseObject = function()
{
	this.m_conditionalValues = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_conditionalValues);
};
oFF.CMEValueContextSwitchResolver.prototype.resolve = function(context)
{
	let value = null;
	for (let i = 0; i < this.m_conditionalValues.size(); i++)
	{
		let expression = this.m_conditionalValues.get(i).getExpression(context);
		if (oFF.notNull(expression))
		{
			value = expression.resolve(context);
		}
	}
	return value;
};
oFF.CMEValueContextSwitchResolver.prototype.setup = function()
{
	oFF.CMEValueResolver.prototype.setup.call( this );
	this.m_conditionalValues = oFF.XList.create();
};

oFF.CMEValueFunctionalResolver = function() {};
oFF.CMEValueFunctionalResolver.prototype = new oFF.CMEValueResolver();
oFF.CMEValueFunctionalResolver.prototype._ff_c = "CMEValueFunctionalResolver";

oFF.CMEValueFunctionalResolver.create = function()
{
	let instance = new oFF.CMEValueFunctionalResolver();
	instance.setup();
	return instance;
};
oFF.CMEValueFunctionalResolver.prototype.m_function = null;
oFF.CMEValueFunctionalResolver.prototype.getFunction = function()
{
	return this.m_function;
};
oFF.CMEValueFunctionalResolver.prototype.resolve = function(context)
{
	let result = this.m_function(context);
	return result;
};
oFF.CMEValueFunctionalResolver.prototype.setFunction = function(_function)
{
	this.m_function = _function;
};
oFF.CMEValueFunctionalResolver.prototype.setup = function()
{
	oFF.CMEValueResolver.prototype.setup.call( this );
};

oFF.CMEValueLiteralResolver = function() {};
oFF.CMEValueLiteralResolver.prototype = new oFF.CMEValueResolver();
oFF.CMEValueLiteralResolver.prototype._ff_c = "CMEValueLiteralResolver";

oFF.CMEValueLiteralResolver.FALSE_RESOLVER = null;
oFF.CMEValueLiteralResolver.MINUS_1_RESOLVER = null;
oFF.CMEValueLiteralResolver.NULL_RESOLVER = null;
oFF.CMEValueLiteralResolver.PLUS_1_RESOLVER = null;
oFF.CMEValueLiteralResolver.TRUE_RESOLVER = null;
oFF.CMEValueLiteralResolver.ZERO_RESOLVER = null;
oFF.CMEValueLiteralResolver.create = function(value)
{
	let instance = new oFF.CMEValueLiteralResolver();
	instance.setupValue(value);
	return instance;
};
oFF.CMEValueLiteralResolver.getFalseResolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.FALSE_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.FALSE_RESOLVER = oFF.CMEValueLiteralResolver.create(oFF.XBooleanValue.create(false));
	}
	return oFF.CMEValueLiteralResolver.FALSE_RESOLVER;
};
oFF.CMEValueLiteralResolver.getMinus1Resolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.MINUS_1_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.MINUS_1_RESOLVER = oFF.CMEValueLiteralResolver.create(oFF.XDoubleValue.create(-1));
	}
	return oFF.CMEValueLiteralResolver.MINUS_1_RESOLVER;
};
oFF.CMEValueLiteralResolver.getNullResolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.NULL_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.NULL_RESOLVER = oFF.CMEValueLiteralResolver.create(null);
	}
	return oFF.CMEValueLiteralResolver.NULL_RESOLVER;
};
oFF.CMEValueLiteralResolver.getPlus1Resolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.PLUS_1_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.PLUS_1_RESOLVER = oFF.CMEValueLiteralResolver.create(oFF.XDoubleValue.create(1));
	}
	return oFF.CMEValueLiteralResolver.PLUS_1_RESOLVER;
};
oFF.CMEValueLiteralResolver.getTrueResolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.TRUE_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.TRUE_RESOLVER = oFF.CMEValueLiteralResolver.create(oFF.XBooleanValue.create(true));
	}
	return oFF.CMEValueLiteralResolver.TRUE_RESOLVER;
};
oFF.CMEValueLiteralResolver.getZeroResolver = function()
{
	if (oFF.isNull(oFF.CMEValueLiteralResolver.ZERO_RESOLVER))
	{
		oFF.CMEValueLiteralResolver.ZERO_RESOLVER = oFF.CMEValueLiteralResolver.create(oFF.XDoubleValue.create(0));
	}
	return oFF.CMEValueLiteralResolver.ZERO_RESOLVER;
};
oFF.CMEValueLiteralResolver.prototype.m_value = null;
oFF.CMEValueLiteralResolver.prototype.resolve = function(context)
{
	return this.m_value;
};
oFF.CMEValueLiteralResolver.prototype.setupValue = function(value)
{
	this.m_value = value;
};

oFF.CMEValuePathResolver = function() {};
oFF.CMEValuePathResolver.prototype = new oFF.CMEValueResolver();
oFF.CMEValuePathResolver.prototype._ff_c = "CMEValuePathResolver";

oFF.CMEValuePathResolver.create = function(expression)
{
	let instance = new oFF.CMEValuePathResolver();
	instance.setupExpression(expression);
	return instance;
};
oFF.CMEValuePathResolver.prototype.m_expression = null;
oFF.CMEValuePathResolver.prototype.resolve = function(context)
{
	return oFF.isNull(context) ? null : context.resolveValue(this.m_expression);
};
oFF.CMEValuePathResolver.prototype.setupExpression = function(expression)
{
	this.m_expression = expression;
};

oFF.CMEValueStringFunctionalResolver = function() {};
oFF.CMEValueStringFunctionalResolver.prototype = new oFF.CMEValueResolver();
oFF.CMEValueStringFunctionalResolver.prototype._ff_c = "CMEValueStringFunctionalResolver";

oFF.CMEValueStringFunctionalResolver.create = function()
{
	let instance = new oFF.CMEValueStringFunctionalResolver();
	instance.setup();
	return instance;
};
oFF.CMEValueStringFunctionalResolver.prototype.m_function = null;
oFF.CMEValueStringFunctionalResolver.prototype.getFunction = function()
{
	return this.m_function;
};
oFF.CMEValueStringFunctionalResolver.prototype.resolve = function(context)
{
	if (oFF.notNull(this.m_function))
	{
		return oFF.XStringValue.create(this.m_function(context));
	}
	else
	{
		return null;
	}
};
oFF.CMEValueStringFunctionalResolver.prototype.setFunction = function(_function)
{
	this.m_function = _function;
};
oFF.CMEValueStringFunctionalResolver.prototype.setup = function()
{
	oFF.CMEValueResolver.prototype.setup.call( this );
};

oFF.CMEContextConditionAlgebra = function() {};
oFF.CMEContextConditionAlgebra.prototype = new oFF.CMEContextConditionAbstract();
oFF.CMEContextConditionAlgebra.prototype._ff_c = "CMEContextConditionAlgebra";

oFF.CMEContextConditionAlgebra.createAnd = function()
{
	let instance = new oFF.CMEContextConditionAlgebra();
	instance.setup();
	instance.m_allMatch = true;
	return instance;
};
oFF.CMEContextConditionAlgebra.createNone = function()
{
	let instance = new oFF.CMEContextConditionAlgebra();
	instance.setup();
	instance.m_noneMatch = true;
	return instance;
};
oFF.CMEContextConditionAlgebra.createOr = function()
{
	let instance = new oFF.CMEContextConditionAlgebra();
	instance.setup();
	instance.m_someMatch = true;
	return instance;
};
oFF.CMEContextConditionAlgebra.prototype.m_allMatch = false;
oFF.CMEContextConditionAlgebra.prototype.m_baseConditions = null;
oFF.CMEContextConditionAlgebra.prototype.m_noneMatch = false;
oFF.CMEContextConditionAlgebra.prototype.m_someMatch = false;
oFF.CMEContextConditionAlgebra.prototype.addSubCondition = function(matchCondition)
{
	this.m_baseConditions.add(matchCondition);
};
oFF.CMEContextConditionAlgebra.prototype.canBreak = function(value)
{
	return this.m_someMatch && value || !this.m_someMatch && !value;
};
oFF.CMEContextConditionAlgebra.prototype.checkCondition = function(contextAccess)
{
	let value = this.getInitialValue();
	for (let i = 0; i < this.m_baseConditions.size(); i++)
	{
		value = this.getNewValue(value, this.m_baseConditions.get(i), contextAccess);
		if (this.canBreak(value))
		{
			break;
		}
	}
	return value;
};
oFF.CMEContextConditionAlgebra.prototype.getInitialValue = function()
{
	return !oFF.XCollectionUtils.hasElements(this.m_baseConditions) || !this.m_someMatch;
};
oFF.CMEContextConditionAlgebra.prototype.getNewValue = function(value, cmeContextConditionAbstract, contextAccess)
{
	if (this.m_allMatch)
	{
		return value && cmeContextConditionAbstract.checkCondition(contextAccess);
	}
	else if (this.m_someMatch)
	{
		return value || cmeContextConditionAbstract.checkCondition(contextAccess);
	}
	else if (this.m_noneMatch)
	{
		return value && !cmeContextConditionAbstract.checkCondition(contextAccess);
	}
	return false;
};
oFF.CMEContextConditionAlgebra.prototype.setup = function()
{
	oFF.CMEContextConditionAbstract.prototype.setup.call( this );
	this.m_baseConditions = oFF.XList.create();
};

oFF.CMEContextConditionLeaf = function() {};
oFF.CMEContextConditionLeaf.prototype = new oFF.CMEContextConditionAbstract();
oFF.CMEContextConditionLeaf.prototype._ff_c = "CMEContextConditionLeaf";

oFF.CMEContextConditionLeaf.create = function()
{
	let instance = new oFF.CMEContextConditionLeaf();
	instance.setup();
	return instance;
};
oFF.CMEContextConditionLeaf.prototype.m_comparison = null;
oFF.CMEContextConditionLeaf.prototype.m_conditionalType = null;
oFF.CMEContextConditionLeaf.prototype.m_matchString = null;
oFF.CMEContextConditionLeaf.prototype.checkCondition = function(contextAccess)
{
	if (oFF.isNull(contextAccess))
	{
		return false;
	}
	let value = contextAccess.resolveValue(this.m_matchString);
	let subContexts = contextAccess.getSubContexts(this.m_matchString);
	let comparison = oFF.isNull(this.m_comparison) ? null : this.m_comparison.resolve(contextAccess);
	if (this.m_conditionalType === oFF.CMEConditionalType.MIN_SIZE)
	{
		return oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() >= this.m_comparison.resolveNumber(contextAccess);
	}
	else if (this.m_conditionalType === oFF.CMEConditionalType.MAX_SIZE)
	{
		return oFF.XCollectionUtils.hasElements(subContexts) && subContexts.size() <= this.m_comparison.resolveNumber(contextAccess);
	}
	else if (this.m_conditionalType === oFF.CMEConditionalType.EQUAL)
	{
		return oFF.notNull(value) && value.isEqualTo(comparison);
	}
	else if (this.m_conditionalType === oFF.CMEConditionalType.NOT_EQUAL)
	{
		return oFF.notNull(value) && value.isEqualTo(comparison);
	}
	else if (this.m_conditionalType === oFF.CMEConditionalType.EXISTS)
	{
		return oFF.XCollectionUtils.hasElements(subContexts) || oFF.notNull(value);
	}
	else if (this.m_conditionalType === oFF.CMEConditionalType.NOT_EXISTS)
	{
		return !oFF.XCollectionUtils.hasElements(subContexts) && oFF.isNull(value);
	}
	return false;
};
oFF.CMEContextConditionLeaf.prototype.getComparison = function()
{
	return this.m_comparison;
};
oFF.CMEContextConditionLeaf.prototype.getConditionalType = function()
{
	return this.m_conditionalType;
};
oFF.CMEContextConditionLeaf.prototype.getMatchString = function()
{
	return this.m_matchString;
};
oFF.CMEContextConditionLeaf.prototype.setComparison = function(comparison)
{
	this.m_comparison = comparison;
};
oFF.CMEContextConditionLeaf.prototype.setConditionalType = function(conditionalType)
{
	this.m_conditionalType = conditionalType;
};
oFF.CMEContextConditionLeaf.prototype.setMatchString = function(matchString)
{
	this.m_matchString = matchString;
};

oFF.CMEContextConditionNot = function() {};
oFF.CMEContextConditionNot.prototype = new oFF.CMEContextConditionAbstract();
oFF.CMEContextConditionNot.prototype._ff_c = "CMEContextConditionNot";

oFF.CMEContextConditionNot.create = function()
{
	let instance = new oFF.CMEContextConditionNot();
	instance.setup();
	return instance;
};
oFF.CMEContextConditionNot.prototype.m_baseCondition = null;
oFF.CMEContextConditionNot.prototype.checkCondition = function(contextAccess)
{
	return oFF.isNull(this.m_baseCondition) ? true : !this.m_baseCondition.checkCondition(contextAccess);
};
oFF.CMEContextConditionNot.prototype.getBaseCondition = function()
{
	return this.m_baseCondition;
};
oFF.CMEContextConditionNot.prototype.setBaseCondition = function(baseCondition)
{
	this.m_baseCondition = baseCondition;
};

oFF.CMEDefaultPluginActionProvider = function() {};
oFF.CMEDefaultPluginActionProvider.prototype = new oFF.CMEDynamicActionsProviderDefault();
oFF.CMEDefaultPluginActionProvider.prototype._ff_c = "CMEDefaultPluginActionProvider";

oFF.CMEDefaultPluginActionProvider.create = function(name, config)
{
	let instance = new oFF.CMEDefaultPluginActionProvider();
	instance.m_name = name;
	instance.m_config = config;
	return instance;
};
oFF.CMEDefaultPluginActionProvider.prototype.m_config = null;
oFF.CMEDefaultPluginActionProvider.prototype.m_name = null;
oFF.CMEDefaultPluginActionProvider.prototype.provideMenuConfig = function(cmeContextAccess, providerListener, carrier)
{
	providerListener.onDynamicMenuConfigProvided(cmeContextAccess, this.m_name, this.m_config, carrier);
};
oFF.CMEDefaultPluginActionProvider.prototype.releaseObject = function()
{
	oFF.CMEDynamicActionsProviderDefault.prototype.releaseObject.call( this );
	this.m_name = null;
	this.m_config = null;
};

oFF.CMEMenuTreePopulatorBranching = function() {};
oFF.CMEMenuTreePopulatorBranching.prototype = new oFF.CMEMenuTreePopulatorAbstract();
oFF.CMEMenuTreePopulatorBranching.prototype._ff_c = "CMEMenuTreePopulatorBranching";

oFF.CMEMenuTreePopulatorBranching.createWithSubMapper = function(factory, subPopulator, uiCache)
{
	let instance = new oFF.CMEMenuTreePopulatorBranching();
	instance.setFactory(factory);
	instance.setUiCache(uiCache);
	instance.m_subMapper = subPopulator;
	return instance;
};
oFF.CMEMenuTreePopulatorBranching.prototype.m_subMapper = null;
oFF.CMEMenuTreePopulatorBranching.prototype.getSubMapper = function()
{
	return this.m_subMapper;
};
oFF.CMEMenuTreePopulatorBranching.prototype.releaseObject = function()
{
	this.m_subMapper = null;
	oFF.CMEMenuTreePopulatorAbstract.prototype.releaseObject.call( this );
};

oFF.CMEMenuTreePopulatorSelfRef = function() {};
oFF.CMEMenuTreePopulatorSelfRef.prototype = new oFF.CMEMenuTreePopulatorAbstract();
oFF.CMEMenuTreePopulatorSelfRef.prototype._ff_c = "CMEMenuTreePopulatorSelfRef";

oFF.CMEMenuTreePopulatorSelfRef.create = function(factory, uiCache)
{
	let instance = new oFF.CMEMenuTreePopulatorSelfRef();
	instance.setFactory(factory);
	instance.setUiCache(uiCache);
	return instance;
};
oFF.CMEMenuTreePopulatorSelfRef.prototype.getSubMapper = function()
{
	return this;
};

oFF.CMEAbstractMenuItem = function() {};
oFF.CMEAbstractMenuItem.prototype = new oFF.CMEAbstractItem();
oFF.CMEAbstractMenuItem.prototype._ff_c = "CMEAbstractMenuItem";

oFF.CMEAbstractMenuItem.prototype.m_context = null;
oFF.CMEAbstractMenuItem.prototype.m_dataHelpId = null;
oFF.CMEAbstractMenuItem.prototype.m_enabled = false;
oFF.CMEAbstractMenuItem.prototype.m_explanation = null;
oFF.CMEAbstractMenuItem.prototype.m_highlightProcedure = null;
oFF.CMEAbstractMenuItem.prototype.m_icon = null;
oFF.CMEAbstractMenuItem.prototype.m_localizableExplanation = null;
oFF.CMEAbstractMenuItem.prototype.m_localizableText = null;
oFF.CMEAbstractMenuItem.prototype.m_overflowPriority = 0;
oFF.CMEAbstractMenuItem.prototype.m_tags = null;
oFF.CMEAbstractMenuItem.prototype.m_text = null;
oFF.CMEAbstractMenuItem.prototype.m_unHighlightProcedure = null;
oFF.CMEAbstractMenuItem.prototype.m_visible = false;
oFF.CMEAbstractMenuItem.prototype.addAllTags = function(tags)
{
	this.m_tags.addAll(tags);
};
oFF.CMEAbstractMenuItem.prototype.addTag = function(tag)
{
	this.m_tags.add(tag);
};
oFF.CMEAbstractMenuItem.prototype.getContext = function()
{
	return this.m_context;
};
oFF.CMEAbstractMenuItem.prototype.getDataHelpId = function()
{
	return this.m_dataHelpId;
};
oFF.CMEAbstractMenuItem.prototype.getExplanation = function()
{
	return this.m_explanation;
};
oFF.CMEAbstractMenuItem.prototype.getHighlightProcedure = function()
{
	return this.m_highlightProcedure;
};
oFF.CMEAbstractMenuItem.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.CMEAbstractMenuItem.prototype.getLocalizableExplanation = function()
{
	return this.m_localizableExplanation;
};
oFF.CMEAbstractMenuItem.prototype.getLocalizableText = function()
{
	return this.m_localizableText;
};
oFF.CMEAbstractMenuItem.prototype.getMenuItem = function()
{
	return this;
};
oFF.CMEAbstractMenuItem.prototype.getNameOrFallback = function()
{
	return this.getName() === null ? oFF.XCollectionUtils.join(this.getTags().getValuesAsReadOnlyList(), ":") : this.getName();
};
oFF.CMEAbstractMenuItem.prototype.getOverflowPriority = function()
{
	return this.m_overflowPriority;
};
oFF.CMEAbstractMenuItem.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.CMEAbstractMenuItem.prototype.getText = function()
{
	return this.m_text;
};
oFF.CMEAbstractMenuItem.prototype.getUnHighlightProcedure = function()
{
	return this.m_unHighlightProcedure;
};
oFF.CMEAbstractMenuItem.prototype.hasTag = function(tag)
{
	return this.m_tags.contains(tag);
};
oFF.CMEAbstractMenuItem.prototype.isEnabled = function()
{
	return this.m_enabled;
};
oFF.CMEAbstractMenuItem.prototype.isVisible = function()
{
	return this.m_visible && !this.isRemoved();
};
oFF.CMEAbstractMenuItem.prototype.releaseObject = function()
{
	this.m_tags = oFF.XObjectExt.release(this.m_tags);
	this.m_text = null;
	this.m_icon = null;
	this.m_dataHelpId = null;
	this.m_enabled = false;
	this.m_visible = false;
	this.m_overflowPriority = -1;
	this.m_localizableText = oFF.XObjectExt.release(this.m_localizableText);
	this.m_context = null;
	this.m_explanation = null;
	this.m_localizableExplanation = oFF.XObjectExt.release(this.m_localizableExplanation);
	this.m_highlightProcedure = null;
	this.m_unHighlightProcedure = null;
	oFF.CMEAbstractItem.prototype.releaseObject.call( this );
};
oFF.CMEAbstractMenuItem.prototype.removeTag = function(tag)
{
	this.m_tags.removeElement(tag);
};
oFF.CMEAbstractMenuItem.prototype.setContext = function(context)
{
	this.m_context = context;
};
oFF.CMEAbstractMenuItem.prototype.setDataHelpId = function(dataHelpId)
{
	this.m_dataHelpId = dataHelpId;
};
oFF.CMEAbstractMenuItem.prototype.setEnabled = function(enabled)
{
	this.m_enabled = enabled;
};
oFF.CMEAbstractMenuItem.prototype.setExplanation = function(explanation)
{
	this.m_explanation = explanation;
};
oFF.CMEAbstractMenuItem.prototype.setHighlightProcedure = function(highlightProcedure)
{
	this.m_highlightProcedure = highlightProcedure;
};
oFF.CMEAbstractMenuItem.prototype.setIcon = function(icon)
{
	this.m_icon = icon;
};
oFF.CMEAbstractMenuItem.prototype.setLocalizableExplanation = function(localizableExplanation)
{
	this.m_localizableExplanation = localizableExplanation;
};
oFF.CMEAbstractMenuItem.prototype.setLocalizableText = function(localizableText)
{
	this.m_localizableText = localizableText;
};
oFF.CMEAbstractMenuItem.prototype.setOverflowPriority = function(overflowPriority)
{
	this.m_overflowPriority = overflowPriority;
};
oFF.CMEAbstractMenuItem.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.CMEAbstractMenuItem.prototype.setUnHighlightProcedure = function(unHighlightProcedure)
{
	this.m_unHighlightProcedure = unHighlightProcedure;
};
oFF.CMEAbstractMenuItem.prototype.setVisible = function(visible)
{
	this.m_visible = visible;
};
oFF.CMEAbstractMenuItem.prototype.setup = function()
{
	oFF.CMEAbstractItem.prototype.setup.call( this );
	this.m_enabled = true;
	this.m_visible = true;
	this.m_overflowPriority = -1;
	this.m_tags = oFF.XHashSetOfString.create();
};

oFF.CMEMenuSeparator = function() {};
oFF.CMEMenuSeparator.prototype = new oFF.CMEAbstractItem();
oFF.CMEMenuSeparator.prototype._ff_c = "CMEMenuSeparator";

oFF.CMEMenuSeparator.create = function()
{
	let instance = new oFF.CMEMenuSeparator();
	instance.setup();
	return instance;
};
oFF.CMEMenuSeparator.prototype.getMenuSeparator = function()
{
	return this;
};
oFF.CMEMenuSeparator.prototype.isCompatibleTo = function(other)
{
	let otherSeparator = other.getMenuSeparator();
	return oFF.notNull(otherSeparator);
};

oFF.CMEDataProviderMenuAction = function() {};
oFF.CMEDataProviderMenuAction.prototype = new oFF.CMEAbstractAction();
oFF.CMEDataProviderMenuAction.prototype._ff_c = "CMEDataProviderMenuAction";

oFF.CMEDataProviderMenuAction.create = function(name, commandExecutorContext)
{
	let action = new oFF.CMEDataProviderMenuAction();
	action.setup();
	action.setNameProvider((n) => {
		return name;
	});
	action.m_commandProcessorContext = commandExecutorContext;
	action.m_commands = oFF.XList.create();
	action.setAvailableProvider((cv) => {
		return action.checkVisibleCondition(cv);
	});
	action.setEnabledProvider((ce) => {
		return action.checkEnabledCondition(ce);
	});
	return action;
};
oFF.CMEDataProviderMenuAction.prototype.m_commandProcessorContext = null;
oFF.CMEDataProviderMenuAction.prototype.m_commands = null;
oFF.CMEDataProviderMenuAction.prototype.m_enabledCondition = null;
oFF.CMEDataProviderMenuAction.prototype.m_splitParameter = null;
oFF.CMEDataProviderMenuAction.prototype.m_visibleCondition = null;
oFF.CMEDataProviderMenuAction.prototype.addNewCommand = function(name)
{
	let command = oFF.CMEDataProviderMenuActionCommand.create(name);
	this.m_commands.add(command);
	return command;
};
oFF.CMEDataProviderMenuAction.prototype.checkEnabledCondition = function(context)
{
	return (oFF.isNull(this.m_enabledCondition) || this.m_enabledCondition.matches(context, null)) && this.commandsEnabled(context);
};
oFF.CMEDataProviderMenuAction.prototype.checkVisibleCondition = function(context)
{
	return oFF.isNull(this.m_visibleCondition) || this.m_visibleCondition.matches(context, null);
};
oFF.CMEDataProviderMenuAction.prototype.commandsEnabled = function(ce)
{
	return oFF.XStream.of(this.m_commands).allMatch((command) => {
		return command.isEnabledInContext(ce);
	});
};
oFF.CMEDataProviderMenuAction.prototype.getCommands = function()
{
	return this.m_commands;
};
oFF.CMEDataProviderMenuAction.prototype.getKeyboardShortcut = function()
{
	return null;
};
oFF.CMEDataProviderMenuAction.prototype.getLeafCreator = function(controller)
{
	let leafCreator = oFF.CMELeafCreator.create();
	if (oFF.isNull(controller))
	{
		leafCreator.setContextConsumer((c) => {
			this.trigger(c);
		});
	}
	else
	{
		leafCreator.setContextConsumer((context) => {
			controller.onActionTriggered(this, context);
		});
	}
	return leafCreator;
};
oFF.CMEDataProviderMenuAction.prototype.mapToMenuCreator = function(controller)
{
	let resultItem;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_splitParameter))
	{
		let loopedMenuCreator = oFF.CMELoopedMenuCreator.createLoop();
		loopedMenuCreator.setLoopParameter(this.m_splitParameter);
		loopedMenuCreator.addMenuCreator(this.getLeafCreator(controller));
		let leafCreator = this.getLeafCreator(controller);
		this.mapGenericPropertiesToMenuCreator(controller, leafCreator);
		let lastContextPathSegment = oFF.XString.substring(this.m_splitParameter, oFF.XString.lastIndexOf(this.m_splitParameter, oFF.CMECreatorJsonConstants.CME_CONTEXT_PATH_SEPARATOR) + 1, -1);
		let resolver = oFF.CMEValuePathResolver.create(oFF.XStringUtils.concatenate2(lastContextPathSegment, oFF.CMECreatorJsonConstants.CME_CONTEXT_TEXT_SUFFIX));
		leafCreator.setText(resolver);
		resultItem = loopedMenuCreator;
	}
	else
	{
		resultItem = this.getLeafCreator(controller);
	}
	this.mapGenericPropertiesToMenuCreator(controller, resultItem);
	return resultItem;
};
oFF.CMEDataProviderMenuAction.prototype.setEnabledCondition = function(enabledCondition)
{
	this.m_enabledCondition = enabledCondition;
};
oFF.CMEDataProviderMenuAction.prototype.setSplitParameter = function(splitParameter)
{
	this.m_splitParameter = splitParameter;
};
oFF.CMEDataProviderMenuAction.prototype.setVisibleCondition = function(visible)
{
	this.m_visibleCondition = visible;
};
oFF.CMEDataProviderMenuAction.prototype.trigger = function(context)
{
	let commandProcessorContext = context.getSingleSubContext(this.m_commandProcessorContext);
	if (oFF.notNull(commandProcessorContext))
	{
		let commandConsumer = commandProcessorContext.getCustomObject();
		oFF.XCollectionUtils.forEach(this.m_commands, (c) => {
			c.executeWithContext(context, commandConsumer);
		});
	}
};

oFF.CMEDataProviderParameterMulti = function() {};
oFF.CMEDataProviderParameterMulti.prototype = new oFF.CMEDataProviderParameter();
oFF.CMEDataProviderParameterMulti.prototype._ff_c = "CMEDataProviderParameterMulti";

oFF.CMEDataProviderParameterMulti.create = function(name, contextString, cardinalityType)
{
	let instance = new oFF.CMEDataProviderParameterMulti();
	instance.m_valueList = oFF.XListOfNameObject.create();
	instance.setName(name);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(contextString))
	{
		instance.m_contextString = contextString;
	}
	instance.m_cardinalityType = cardinalityType;
	return instance;
};
oFF.CMEDataProviderParameterMulti.prototype.m_cardinalityType = null;
oFF.CMEDataProviderParameterMulti.prototype.m_valueList = null;
oFF.CMEDataProviderParameterMulti.prototype.addValue = function(name, text)
{
	this.m_valueList.add(oFF.XNameTextObject.create(name, text));
};
oFF.CMEDataProviderParameterMulti.prototype.getCardinalityType = function()
{
	return this.m_cardinalityType;
};
oFF.CMEDataProviderParameterMulti.prototype.isAvailable = function(contextAccess)
{
	return oFF.XCollectionUtils.hasElements(this.m_valueList) || oFF.XCollectionUtils.hasElements(contextAccess.getSubContexts(this.m_contextString));
};
oFF.CMEDataProviderParameterMulti.prototype.releaseObject = function()
{
	this.m_valueList = oFF.XObjectExt.release(this.m_valueList);
	oFF.CMEDataProviderParameter.prototype.releaseObject.call( this );
};
oFF.CMEDataProviderParameterMulti.prototype.resolveParameters = function(context)
{
	let result;
	if (oFF.XCollectionUtils.hasElements(this.m_valueList))
	{
		result = this.m_valueList;
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_contextString))
	{
		let subContext = context.getSubContexts(this.m_contextString);
		if (oFF.XCollectionUtils.hasElements(subContext))
		{
			result = oFF.XStream.of(subContext).filterNullValues().map((sc) => {
				return sc.getCustomObject();
			}).filterNullValues().map((co) => {
				return co;
			}).collect(oFF.XStreamCollector.toListOfNameObject());
		}
		else
		{
			result = oFF.XListOfNameObject.create();
		}
	}
	else
	{
		result = oFF.XListOfNameObject.create();
	}
	return result;
};

oFF.CMEDataProviderParameterSingle = function() {};
oFF.CMEDataProviderParameterSingle.prototype = new oFF.CMEDataProviderParameter();
oFF.CMEDataProviderParameterSingle.prototype._ff_c = "CMEDataProviderParameterSingle";

oFF.CMEDataProviderParameterSingle.create = function(name, value, contextString)
{
	let instance = new oFF.CMEDataProviderParameterSingle();
	instance.setName(name);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(value))
	{
		instance.m_value = oFF.XNameTextObject.create(value, value);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(contextString))
	{
		instance.m_contextString = contextString;
	}
	return instance;
};
oFF.CMEDataProviderParameterSingle.prototype.m_value = null;
oFF.CMEDataProviderParameterSingle.prototype.getCardinalityType = function()
{
	return oFF.CmeCardinalityType.SINGLE;
};
oFF.CMEDataProviderParameterSingle.prototype.isAvailable = function(contextAccess)
{
	return oFF.notNull(this.m_value) || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_contextString) && contextAccess.getSingleSubContext(this.m_contextString) !== null;
};
oFF.CMEDataProviderParameterSingle.prototype.releaseObject = function()
{
	this.m_value = null;
	oFF.CMEDataProviderParameter.prototype.releaseObject.call( this );
};
oFF.CMEDataProviderParameterSingle.prototype.resolveParameter = function(context)
{
	let result;
	if (oFF.notNull(this.m_value))
	{
		result = oFF.XOptional.of(this.m_value);
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_contextString))
	{
		let subContext = context.getSingleSubContext(this.m_contextString);
		if (oFF.notNull(subContext) && subContext.getCustomObject() !== null)
		{
			result = oFF.XOptional.of(subContext.getCustomObject());
		}
		else
		{
			result = oFF.XOptional.empty();
		}
	}
	else
	{
		result = oFF.XOptional.empty();
	}
	return result;
};

oFF.CMESimpleAction = function() {};
oFF.CMESimpleAction.prototype = new oFF.CMEAbstractAction();
oFF.CMESimpleAction.prototype._ff_c = "CMESimpleAction";

oFF.CMESimpleAction.prototype.m_shortcut = null;
oFF.CMESimpleAction.prototype.clearKeyboardShortcut = function()
{
	this.m_shortcut = oFF.XObjectExt.release(this.m_shortcut);
};
oFF.CMESimpleAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.SIMPLE;
};
oFF.CMESimpleAction.prototype.getKeyboardShortcut = function()
{
	return this.m_shortcut;
};
oFF.CMESimpleAction.prototype.releaseObject = function()
{
	this.clearKeyboardShortcut();
	oFF.CMEAbstractAction.prototype.releaseObject.call( this );
};
oFF.CMESimpleAction.prototype.setup = function()
{
	oFF.CMEAbstractAction.prototype.setup.call( this );
};
oFF.CMESimpleAction.prototype.setupKeyboardShortcut = function()
{
	this.clearKeyboardShortcut();
	this.m_shortcut = oFF.CMEKeyboardShortcut.create();
	return this.m_shortcut;
};

oFF.CMESingleSelectAction = function() {};
oFF.CMESingleSelectAction.prototype = new oFF.CMEAbstractAction();
oFF.CMESingleSelectAction.prototype._ff_c = "CMESingleSelectAction";

oFF.CMESingleSelectAction.create = function()
{
	let instance = new oFF.CMESingleSelectAction();
	instance.setup();
	return instance;
};
oFF.CMESingleSelectAction.prototype.m_deferredOptionsRetriever = null;
oFF.CMESingleSelectAction.prototype.m_doubtfulSelectionsRetriever = null;
oFF.CMESingleSelectAction.prototype.m_eagerlyRetrieveDeferredOptions = false;
oFF.CMESingleSelectAction.prototype.m_optionsRetriever = null;
oFF.CMESingleSelectAction.prototype.m_selectionConsumer = null;
oFF.CMESingleSelectAction.prototype.m_selectionRetriever = null;
oFF.CMESingleSelectAction.prototype.asSingleSelectAction = function()
{
	return this;
};
oFF.CMESingleSelectAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.SINGLE_SELECT;
};
oFF.CMESingleSelectAction.prototype.getAvailableOptions = function(context)
{
	return oFF.isNull(this.m_optionsRetriever) ? null : this.m_optionsRetriever(context);
};
oFF.CMESingleSelectAction.prototype.getSelectedOption = function(context)
{
	return oFF.isNull(this.m_selectionRetriever) ? null : this.m_selectionRetriever(context);
};
oFF.CMESingleSelectAction.prototype.mapToMenuCreator = function(controller)
{
	let groupCreator = oFF.CMEGroupCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, groupCreator);
	groupCreator.setOptionsRetriever(this.m_optionsRetriever);
	groupCreator.setDeferredOptionsRetriever(this.m_eagerlyRetrieveDeferredOptions, this.m_deferredOptionsRetriever);
	groupCreator.setSelectionRetriever(this.m_selectionRetriever);
	groupCreator.setDoubtfulSelectionsRetriever(this.m_doubtfulSelectionsRetriever);
	if (oFF.isNull(controller))
	{
		groupCreator.setSelectionConsumer((a, b, c) => {
			this.m_selectionConsumer(a, b);
		});
	}
	else
	{
		groupCreator.setSelectionConsumer((e, f, g) => {
			controller.onActionSingleSelect(this, f, e);
		});
	}
	return groupCreator;
};
oFF.CMESingleSelectAction.prototype.selectOption = function(context, option)
{
	if (oFF.notNull(this.m_selectionConsumer))
	{
		this.m_selectionConsumer(context, option);
	}
};
oFF.CMESingleSelectAction.prototype.setDeferredOptionsRetriever = function(eager, deferredOptionsRetriever)
{
	this.m_eagerlyRetrieveDeferredOptions = eager;
	this.m_deferredOptionsRetriever = deferredOptionsRetriever;
};
oFF.CMESingleSelectAction.prototype.setDoubtfulSelectionsRetriever = function(selectionRetriever)
{
	this.m_doubtfulSelectionsRetriever = selectionRetriever;
};
oFF.CMESingleSelectAction.prototype.setOptionsRetriever = function(optionsRetriever)
{
	this.m_optionsRetriever = optionsRetriever;
};
oFF.CMESingleSelectAction.prototype.setSelectionConsumer = function(selectionConsumer)
{
	this.m_selectionConsumer = selectionConsumer;
};
oFF.CMESingleSelectAction.prototype.setSelectionRetriever = function(selectionRetriever)
{
	this.m_selectionRetriever = selectionRetriever;
};

oFF.CMEAggregatedCreator = function() {};
oFF.CMEAggregatedCreator.prototype = new oFF.CMEMenuItemCreator();
oFF.CMEAggregatedCreator.prototype._ff_c = "CMEAggregatedCreator";

oFF.CMEAggregatedCreator.prototype.m_menuCreators = null;
oFF.CMEAggregatedCreator.prototype.addMenuCreator = function(menuCreator)
{
	this.m_menuCreators.add(menuCreator);
};
oFF.CMEAggregatedCreator.prototype.applyTransformation = function(group, parameters)
{
	if (oFF.notNull(parameters))
	{
		for (let i = 0; i < this.m_menuCreators.size(); i++)
		{
			let menuCreator = this.m_menuCreators.get(i);
			menuCreator.transform(parameters, group);
		}
	}
};
oFF.CMEAggregatedCreator.prototype.getMenuCreators = function()
{
	return this.m_menuCreators;
};
oFF.CMEAggregatedCreator.prototype.setup = function()
{
	oFF.CMEMenuItemCreator.prototype.setup.call( this );
	this.m_menuCreators = oFF.XList.create();
};

oFF.CMELeafCreator = function() {};
oFF.CMELeafCreator.prototype = new oFF.CMEMenuItemCreator();
oFF.CMELeafCreator.prototype._ff_c = "CMELeafCreator";

oFF.CMELeafCreator.create = function()
{
	let instance = new oFF.CMELeafCreator();
	instance.setup();
	return instance;
};
oFF.CMELeafCreator.prototype.m_active = null;
oFF.CMELeafCreator.prototype.m_contextConsumer = null;
oFF.CMELeafCreator.prototype.m_partiallyActive = null;
oFF.CMELeafCreator.prototype.m_shortcut = null;
oFF.CMELeafCreator.prototype.m_toggle = false;
oFF.CMELeafCreator.prototype.getActive = function()
{
	return oFF.notNull(this.m_active) ? this.m_active : oFF.CMEValueLiteralResolver.getFalseResolver();
};
oFF.CMELeafCreator.prototype.getPartiallyActive = function()
{
	return oFF.notNull(this.m_partiallyActive) ? this.m_partiallyActive : oFF.CMEValueLiteralResolver.getFalseResolver();
};
oFF.CMELeafCreator.prototype.isToggle = function()
{
	return this.m_toggle;
};
oFF.CMELeafCreator.prototype.setActive = function(active)
{
	this.m_active = active;
};
oFF.CMELeafCreator.prototype.setContextConsumer = function(trigger)
{
	this.m_contextConsumer = trigger;
};
oFF.CMELeafCreator.prototype.setPartiallyActive = function(active)
{
	this.m_partiallyActive = active;
};
oFF.CMELeafCreator.prototype.setToggle = function(toggle)
{
	this.m_toggle = toggle;
};
oFF.CMELeafCreator.prototype.transferShortcut = function(keyboardShortcut)
{
	this.m_shortcut = null;
	if (oFF.notNull(keyboardShortcut))
	{
		this.m_shortcut = oFF.CMEKeyboardShortcut.create();
		this.m_shortcut.copyFrom(keyboardShortcut, null);
	}
};
oFF.CMELeafCreator.prototype.transform = function(parameters, resultContainer)
{
	let leaf = resultContainer.addNewLeaf();
	let subContext = this.getSubContext(parameters);
	leaf.setOverflowPriority(this.getOverflowPriority());
	leaf.setName(this.getName().resolveString(subContext));
	leaf.setText(this.getText().resolveString(subContext));
	leaf.setExplanation(this.getExplanation().resolveString(subContext));
	leaf.setLocalizableText(this.resolveLocalizableText(subContext));
	leaf.setLocalizableExplanation(this.resolveLocalizableExplanation(subContext));
	leaf.setMainKeyboardShortcut(this.m_shortcut);
	leaf.setIcon(this.getIcon().resolveString(subContext));
	leaf.setDataHelpId(this.getDataHelpId().resolveString(subContext));
	leaf.setEnabled(this.resolveEnabled(subContext));
	leaf.setVisible(this.resolveVisible(subContext));
	if (this.getActive().resolveBoolean(subContext))
	{
		leaf.setActive(true);
	}
	else if (this.getPartiallyActive().resolveBoolean(subContext))
	{
		leaf.setActiveExtended(oFF.TriStateBool._DEFAULT);
	}
	leaf.setToggle(this.isToggle());
	leaf.setHighlightProcedure(this.resolveHighlightProcedure(parameters));
	leaf.setUnHighlightProcedure(this.resolveUnHighlightProcedure(parameters));
	if (oFF.notNull(this.m_contextConsumer))
	{
		leaf.setCommand(() => {
			this.m_contextConsumer(subContext);
		});
	}
};

oFF.CMESeparatorCreator = function() {};
oFF.CMESeparatorCreator.prototype = new oFF.CMEMenuItemCreator();
oFF.CMESeparatorCreator.prototype._ff_c = "CMESeparatorCreator";

oFF.CMESeparatorCreator.create = function()
{
	let instance = new oFF.CMESeparatorCreator();
	instance.setup();
	return instance;
};
oFF.CMESeparatorCreator.prototype.transform = function(parameters, resultContainer)
{
	let separator = resultContainer.addNewSeparator();
	separator.setName(this.getName().resolveString(parameters));
};

oFF.CMEContext = function() {};
oFF.CMEContext.prototype = new oFF.XObject();
oFF.CMEContext.prototype._ff_c = "CMEContext";

oFF.CMEContext.S_CONTEXT_PATH_DELIMITER = "/";
oFF.CMEContext.create = function()
{
	let instance = new oFF.CMEContext();
	instance.setup();
	return instance;
};
oFF.CMEContext.filterSubContextsLists = function(contexts, filter)
{
	let identity = oFF.XList.create();
	for (let i = 0; i < contexts.size(); i++)
	{
		identity.addAll(contexts.get(i).filterSubContextsSimple(filter));
	}
	return identity;
};
oFF.CMEContext.prototype.m_contextParameters = null;
oFF.CMEContext.prototype.m_customObject = null;
oFF.CMEContext.prototype.m_name = null;
oFF.CMEContext.prototype.m_subContextSupplier = null;
oFF.CMEContext.prototype.m_subContexts = null;
oFF.CMEContext.prototype.m_text = null;
oFF.CMEContext.prototype.m_type = null;
oFF.CMEContext.prototype.addSubContext = function()
{
	this.m_subContextSupplier = null;
	let newContext = oFF.CMEContext.create();
	this.m_subContexts.add(newContext);
	return newContext;
};
oFF.CMEContext.prototype.clearSubContexts = function()
{
	oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_subContexts);
	this.m_subContexts.clear();
};
oFF.CMEContext.prototype.copyFrom = function(other, flags)
{
	let orig = other;
	this.m_name = orig.getName();
	this.m_type = orig.getType();
	this.m_text = orig.getText();
	this.m_customObject = orig.m_customObject;
	this.m_contextParameters = orig.m_contextParameters;
	let origSubContextIterator = orig.getSubContexts().getIterator();
	while (origSubContextIterator.hasNext())
	{
		this.addSubContext().copyFrom(origSubContextIterator.next(), flags);
	}
};
oFF.CMEContext.prototype.filterSubContextsRecursive = function(filter)
{
	return this.filterSubContextsRecursiveByList(oFF.XStringTokenizer.splitString(filter, oFF.CMEContext.S_CONTEXT_PATH_DELIMITER));
};
oFF.CMEContext.prototype.filterSubContextsRecursiveByList = function(filter)
{
	let contextList = oFF.XList.create();
	contextList.add(this);
	let updateList = contextList;
	for (let i = 0; i < filter.size(); i++)
	{
		updateList = oFF.CMEContext.filterSubContextsLists(updateList, filter.get(i));
	}
	return updateList;
};
oFF.CMEContext.prototype.filterSubContextsSimple = function(filter)
{
	let size = oFF.XString.size(filter);
	let separatorIndex = oFF.XString.indexOf(filter, "[");
	let endIndex = oFF.XString.indexOf(filter, "]");
	let filterType = null;
	let filterName = null;
	if (separatorIndex === -1 && endIndex === -1)
	{
		filterType = filter;
	}
	else if (separatorIndex > 0 && endIndex === size - 1)
	{
		filterType = oFF.XString.substring(filter, 0, separatorIndex);
		filterName = oFF.XString.substring(filter, separatorIndex + 1, endIndex);
	}
	return this.getSubContextsByTypeAndName(filterType, filterName);
};
oFF.CMEContext.prototype.getContextParameters = function()
{
	return this.m_contextParameters;
};
oFF.CMEContext.prototype.getCustomObject = function()
{
	return this.m_customObject;
};
oFF.CMEContext.prototype.getName = function()
{
	return this.m_name;
};
oFF.CMEContext.prototype.getSubContexts = function()
{
	if (!oFF.XCollectionUtils.hasElements(this.m_subContexts) && oFF.notNull(this.m_subContextSupplier))
	{
		this.m_subContexts.addAll(this.m_subContextSupplier());
	}
	return this.m_subContexts;
};
oFF.CMEContext.prototype.getSubContextsByName = function(name)
{
	return oFF.XStream.of(this.getSubContexts()).filter((el) => {
		return oFF.XString.isEqual(name, el.getName());
	}).collect(oFF.XStreamCollector.toList());
};
oFF.CMEContext.prototype.getSubContextsByType = function(type)
{
	return oFF.XStream.of(this.getSubContexts()).filter((el) => {
		return oFF.XString.isEqual(type, el.getType());
	}).collect(oFF.XStreamCollector.toList());
};
oFF.CMEContext.prototype.getSubContextsByTypeAndName = function(type, name)
{
	return oFF.XStream.of(this.getSubContexts()).filter((el) => {
		return (oFF.isNull(type) || oFF.XStringUtils.isWildcardPatternMatching(el.getType(), type)) && (oFF.isNull(name) || oFF.XStringUtils.isWildcardPatternMatching(el.getName(), name));
	}).collect(oFF.XStreamCollector.toList());
};
oFF.CMEContext.prototype.getText = function()
{
	return this.m_text;
};
oFF.CMEContext.prototype.getType = function()
{
	return this.m_type;
};
oFF.CMEContext.prototype.releaseObject = function()
{
	this.m_subContexts = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_subContexts);
	this.m_name = null;
	this.m_type = null;
	this.m_text = null;
	this.m_subContextSupplier = null;
	this.m_customObject = null;
	this.m_contextParameters = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CMEContext.prototype.setContextParameters = function(contextParameters)
{
	this.m_contextParameters = contextParameters;
};
oFF.CMEContext.prototype.setCustomObject = function(customObject)
{
	this.m_customObject = customObject;
};
oFF.CMEContext.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.CMEContext.prototype.setSubContextsSupplier = function(contextSupplier)
{
	this.clearSubContexts();
	this.m_subContextSupplier = contextSupplier;
};
oFF.CMEContext.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.CMEContext.prototype.setType = function(type)
{
	this.m_type = type;
};
oFF.CMEContext.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_subContexts = oFF.XList.create();
};

oFF.CMEGroupingMenuItem = function() {};
oFF.CMEGroupingMenuItem.prototype = new oFF.CMEAbstractMenuItem();
oFF.CMEGroupingMenuItem.prototype._ff_c = "CMEGroupingMenuItem";

oFF.CMEGroupingMenuItem.create = function()
{
	let instance = new oFF.CMEGroupingMenuItem();
	instance.setup();
	return instance;
};
oFF.CMEGroupingMenuItem.prototype.m_cachedEnabledSubItemCount = 0;
oFF.CMEGroupingMenuItem.prototype.m_cachedSubItemCount = 0;
oFF.CMEGroupingMenuItem.prototype.m_deferredOptionsProcedure = null;
oFF.CMEGroupingMenuItem.prototype.m_disableIfLessThanNEnabledItems = 0;
oFF.CMEGroupingMenuItem.prototype.m_disableIfLessThanNItems = 0;
oFF.CMEGroupingMenuItem.prototype.m_eagerlyRetrieveDeferredOptions = false;
oFF.CMEGroupingMenuItem.prototype.m_firstSubOptionIsDefault = false;
oFF.CMEGroupingMenuItem.prototype.m_flatIfLessThanNItems = 0;
oFF.CMEGroupingMenuItem.prototype.m_hideIfLessThanNItems = 0;
oFF.CMEGroupingMenuItem.prototype.m_keepTitleForFlat = false;
oFF.CMEGroupingMenuItem.prototype.m_loadingFinished = false;
oFF.CMEGroupingMenuItem.prototype.m_overflowIfMoreThanNItems = 0;
oFF.CMEGroupingMenuItem.prototype.m_overflowLocalizableText = null;
oFF.CMEGroupingMenuItem.prototype.m_overflowText = null;
oFF.CMEGroupingMenuItem.prototype.m_subItems = null;
oFF.CMEGroupingMenuItem.prototype._executeDeferredProcedure = function(procedureList, procedure)
{
	if (procedureList.size() > 1)
	{
		procedureList.get(0)(() => {
			this._executeDeferredProcedure(procedureList.sublist(1, -1), procedure);
		});
	}
	else if (procedureList.size() === 1)
	{
		procedureList.get(0)(procedure);
	}
};
oFF.CMEGroupingMenuItem.prototype.addNewGroup = function()
{
	let newInstance = oFF.CMEGroupingMenuItem.create();
	this.addSubItem(newInstance);
	return newInstance;
};
oFF.CMEGroupingMenuItem.prototype.addNewLeaf = function()
{
	let newInstance = oFF.CMELeafMenuItem.create();
	this.addSubItem(newInstance);
	return newInstance;
};
oFF.CMEGroupingMenuItem.prototype.addNewSeparator = function()
{
	let newInstance = oFF.CMEMenuSeparator.create();
	this.addSubItem(newInstance);
	return newInstance;
};
oFF.CMEGroupingMenuItem.prototype.addSubItem = function(actionItem)
{
	actionItem.setParent(this);
	this.m_cachedSubItemCount = -1;
	this.m_cachedEnabledSubItemCount = -1;
	this.m_subItems.add(actionItem);
};
oFF.CMEGroupingMenuItem.prototype.addSubItemsAtEnd = function(actionItems)
{
	for (let i = 0; i < actionItems.size(); i++)
	{
		let actionItem = actionItems.get(i);
		actionItem.setParent(this);
		this.m_subItems.add(actionItem);
	}
};
oFF.CMEGroupingMenuItem.prototype.addSubItemsAtStart = function(actionItems)
{
	this.insertSubItems(0, actionItems);
};
oFF.CMEGroupingMenuItem.prototype.areAllEffectiveSubItemsCompatibleTo = function(effectiveSubItems)
{
	let compatible = false;
	let thisSubItems = this.getEffectiveSubItems();
	if (thisSubItems.size() === effectiveSubItems.size())
	{
		compatible = true;
		for (let i = 0; i < thisSubItems.size(); i++)
		{
			let tsi = thisSubItems.get(i);
			let osi = effectiveSubItems.get(i);
			if (!tsi.isCompatibleTo(osi))
			{
				compatible = false;
				break;
			}
		}
	}
	return compatible;
};
oFF.CMEGroupingMenuItem.prototype.clearSubItems = function()
{
	if (oFF.notNull(this.m_subItems))
	{
		this.m_subItems.clear();
	}
};
oFF.CMEGroupingMenuItem.prototype.executeDeferredLoading = function(procedure)
{
	let procedureList = oFF.XList.create();
	if (oFF.notNull(this.m_deferredOptionsProcedure))
	{
		procedureList.add(this.m_deferredOptionsProcedure);
	}
	oFF.XStream.of(this.m_subItems).filterNullValues().map((it) => {
		return it.getActionGroup();
	}).filterNullValues().filter((ag) => {
		return ag.isFlatForced() && ag.hasDeferredSubItemsEffective();
	}).forEach((dsi) => {
		procedureList.add(dsi.getDeferredLoadingProcedure());
	});
	this._executeDeferredProcedure(procedureList, procedure);
};
oFF.CMEGroupingMenuItem.prototype.findItemsByNameOrAlias = function(nameOrAlias, recursive)
{
	let results = oFF.XList.create();
	if (oFF.XString.isEqual(nameOrAlias, oFF.CMECreatorJsonConstants.CME_REFERENCE_ROOT))
	{
		results.add(this);
	}
	else
	{
		this.findItemsByNameOrAliasInternal(nameOrAlias, recursive, results);
	}
	return results;
};
oFF.CMEGroupingMenuItem.prototype.findItemsByNameOrAliasInternal = function(nameOrAlias, recursive, results)
{
	for (let i = 0; i < this.m_subItems.size(); i++)
	{
		let subItem = this.m_subItems.get(i);
		if (oFF.XString.isEqual(subItem.getName(), nameOrAlias) || oFF.XString.isEqual(subItem.getAlias(), nameOrAlias))
		{
			results.add(subItem);
		}
		if (recursive)
		{
			let subGroupItem = subItem.getActionGroup();
			if (oFF.notNull(subGroupItem))
			{
				subGroupItem.findItemsByNameOrAliasInternal(nameOrAlias, recursive, results);
			}
		}
	}
};
oFF.CMEGroupingMenuItem.prototype.getActionGroup = function()
{
	return this;
};
oFF.CMEGroupingMenuItem.prototype.getDeferredLoadingProcedure = function()
{
	return this.m_deferredOptionsProcedure;
};
oFF.CMEGroupingMenuItem.prototype.getEffectiveEnabledSubItemCount = function()
{
	if (this.m_cachedEnabledSubItemCount < 0)
	{
		this.m_cachedEnabledSubItemCount = this.getEffectiveSubItemCountInternal(true);
	}
	return this.m_cachedEnabledSubItemCount;
};
oFF.CMEGroupingMenuItem.prototype.getEffectiveSubItemCount = function()
{
	if (this.m_cachedSubItemCount < 0)
	{
		this.m_cachedSubItemCount = this.getEffectiveSubItemCountInternal(false);
	}
	return this.m_cachedSubItemCount;
};
oFF.CMEGroupingMenuItem.prototype.getEffectiveSubItemCountInternal = function(excludeDisabled)
{
	return oFF.XStream.of(this.m_subItems).filter((item) => {
		let mItem = item.getMenuItem();
		return oFF.notNull(mItem) && mItem.isVisible() && (!excludeDisabled || mItem.isEnabled());
	}).map((input) => {
		let ag = input.getActionGroup();
		return (oFF.notNull(ag) && ag.isFlat()) ? oFF.XIntegerValue.create(ag.getEffectiveSubItemCountInternal(excludeDisabled)) : oFF.XIntegerValue.create(1);
	}).reduce(oFF.XIntegerValue.create(0), (o1, o2) => {
		return oFF.XIntegerValue.create(o1.getInteger() + o2.getInteger());
	}).getInteger();
};
oFF.CMEGroupingMenuItem.prototype.getEffectiveSubItems = function()
{
	let effectiveList = oFF.XList.create();
	let visibleItemsSeen = 0;
	let i = 0;
	let subItem;
	if (this.isLoadingFinishedEffective())
	{
		for (; i < this.m_subItems.size(); i++)
		{
			if (this.m_overflowIfMoreThanNItems > 0 && visibleItemsSeen >= this.m_overflowIfMoreThanNItems)
			{
				break;
			}
			subItem = this.m_subItems.get(i);
			let menuItem = subItem.getMenuItem();
			let groupItem = subItem.getActionGroup();
			if (subItem.getMenuSeparator() !== null)
			{
				effectiveList.add(subItem);
			}
			else if (oFF.notNull(groupItem) && groupItem.isVisible() && groupItem.isFlat())
			{
				if (groupItem.isKeepTitleForFlat())
				{
					effectiveList.add(oFF.CMEMenuSeparator.create());
					let titleItem = oFF.CMEGroupingMenuItem.create();
					titleItem.setKeepTitleForFlat(true);
					titleItem.setFlat(true);
					titleItem.setVisible(true);
					titleItem.setName(groupItem.getName());
					titleItem.setText(groupItem.getText());
					titleItem.setLocalizableText(groupItem.getLocalizableText());
					effectiveList.add(titleItem);
					effectiveList.add(oFF.CMEMenuSeparator.create());
				}
				effectiveList.addAll(groupItem.getEffectiveSubItems());
			}
			else if (oFF.notNull(menuItem) && menuItem.isVisible())
			{
				effectiveList.add(subItem);
				visibleItemsSeen++;
			}
		}
		if (i < this.m_subItems.size())
		{
			let overflowItem = oFF.CMEGroupingMenuItem.create();
			overflowItem.setParent(this);
			overflowItem.setOverflowIfMoreThanNItems(this.m_overflowIfMoreThanNItems);
			overflowItem.setLocalizableText(this.m_overflowLocalizableText);
			overflowItem.setOverflowLocalizableText(this.m_overflowLocalizableText);
			overflowItem.setText(this.m_overflowText);
			overflowItem.setOverflowText(this.m_overflowText);
			overflowItem.setFlatIfLessThanNItems(2);
			effectiveList.add(overflowItem);
			for (; i < this.m_subItems.size(); i++)
			{
				overflowItem.addSubItem(this.m_subItems.get(i));
			}
		}
	}
	return effectiveList;
};
oFF.CMEGroupingMenuItem.prototype.getFlatIfLessThanNItems = function()
{
	return this.m_flatIfLessThanNItems;
};
oFF.CMEGroupingMenuItem.prototype.getOverflowLocalizableText = function()
{
	return this.m_overflowLocalizableText;
};
oFF.CMEGroupingMenuItem.prototype.getSubItems = function()
{
	return this.m_subItems;
};
oFF.CMEGroupingMenuItem.prototype.hasDeferredSubItems = function()
{
	return oFF.notNull(this.m_deferredOptionsProcedure);
};
oFF.CMEGroupingMenuItem.prototype.hasDeferredSubItemsEffective = function()
{
	return this.hasDeferredSubItems() || oFF.XStream.of(this.m_subItems).filterNullValues().map((it) => {
		return it.getActionGroup();
	}).filterNullValues().anyMatch((ag) => {
		return ag.isFlatForced() && ag.hasDeferredSubItemsEffective();
	});
};
oFF.CMEGroupingMenuItem.prototype.hasEffectiveSubItems = function()
{
	return this.getEffectiveSubItemCount() > 0;
};
oFF.CMEGroupingMenuItem.prototype.hideIncludingChildren = function()
{
	this.setRemoved(true);
	for (let i = 0; i < this.m_subItems.size(); i++)
	{
		this.m_subItems.get(i).hideIncludingChildren();
	}
};
oFF.CMEGroupingMenuItem.prototype.insertSubItems = function(index, actionItems)
{
	for (let i = 0; i < actionItems.size(); i++)
	{
		let actionItem = actionItems.get(i);
		actionItem.setParent(this);
		this.m_subItems.insert(i + index, actionItem);
	}
};
oFF.CMEGroupingMenuItem.prototype.isCompatibleTo = function(other)
{
	let compatible;
	let otherGroup = other.getActionGroup();
	if (oFF.isNull(otherGroup) || !oFF.XString.isEqual(this.getName(), other.getName()) || this.hasDeferredSubItemsEffective() || otherGroup.hasDeferredSubItems())
	{
		compatible = false;
	}
	else if (this.isFlat() && otherGroup.isFlat())
	{
		if (this.isKeepTitleForFlat() !== otherGroup.isKeepTitleForFlat())
		{
			compatible = false;
		}
		else if (this.isKeepTitleForFlat() && (!oFF.XString.isEqual(this.getText(), otherGroup.getText()) || !oFF.XString.isEqual(this.getIcon(), otherGroup.getIcon())))
		{
			compatible = false;
		}
		else
		{
			compatible = otherGroup.areAllEffectiveSubItemsCompatibleTo(this.getEffectiveSubItems());
		}
	}
	else
	{
		compatible = this.isFlat() === otherGroup.isFlat();
	}
	return compatible;
};
oFF.CMEGroupingMenuItem.prototype.isEagerlyRetrieveDeferredOptions = function()
{
	return this.m_eagerlyRetrieveDeferredOptions || oFF.XStream.of(this.m_subItems).filterNullValues().map((it) => {
		return it.getActionGroup();
	}).filterNullValues().anyMatch((ag) => {
		return ag.isFlatForced() && ag.isEagerlyRetrieveDeferredOptions();
	});
};
oFF.CMEGroupingMenuItem.prototype.isEnabled = function()
{
	let isLoadingPending = !this.isLoadingFinishedEffective();
	return oFF.CMEAbstractMenuItem.prototype.isEnabled.call( this ) && (this.m_disableIfLessThanNItems < 1 || isLoadingPending || this.getEffectiveSubItemCount() >= this.m_disableIfLessThanNItems) && (this.m_disableIfLessThanNEnabledItems < 1 || isLoadingPending || this.getEffectiveEnabledSubItemCount() >= this.m_disableIfLessThanNEnabledItems);
};
oFF.CMEGroupingMenuItem.prototype.isFirstSubOptionIsDefault = function()
{
	return this.m_firstSubOptionIsDefault;
};
oFF.CMEGroupingMenuItem.prototype.isFlat = function()
{
	return this.m_flatIfLessThanNItems === -1 || this.m_flatIfLessThanNItems > 0 && !this.hasDeferredSubItemsEffective() && this.getEffectiveSubItemCount() < this.m_flatIfLessThanNItems;
};
oFF.CMEGroupingMenuItem.prototype.isFlatForced = function()
{
	return this.m_flatIfLessThanNItems === -1;
};
oFF.CMEGroupingMenuItem.prototype.isKeepTitleForFlat = function()
{
	return this.m_keepTitleForFlat;
};
oFF.CMEGroupingMenuItem.prototype.isLoadingFinished = function()
{
	return this.m_loadingFinished;
};
oFF.CMEGroupingMenuItem.prototype.isLoadingFinishedEffective = function()
{
	return !this.hasDeferredSubItems() || this.isLoadingFinished() || oFF.XStream.of(this.m_subItems).filterNullValues().map((it) => {
		return it.getActionGroup();
	}).filterNullValues().anyMatch((ag) => {
		return ag.isFlatForced() && ag.isLoadingFinishedEffective();
	});
};
oFF.CMEGroupingMenuItem.prototype.isVisible = function()
{
	return oFF.CMEAbstractMenuItem.prototype.isVisible.call( this ) && (this.m_hideIfLessThanNItems < 1 || this.hasDeferredSubItemsEffective() || this.getEffectiveSubItemCount() >= this.m_hideIfLessThanNItems);
};
oFF.CMEGroupingMenuItem.prototype.releaseObject = function()
{
	this.m_flatIfLessThanNItems = 1;
	this.m_hideIfLessThanNItems = 0;
	this.m_disableIfLessThanNItems = 1;
	this.m_disableIfLessThanNEnabledItems = 0;
	this.m_cachedSubItemCount = -1;
	this.m_cachedEnabledSubItemCount = -1;
	this.m_overflowIfMoreThanNItems = -1;
	this.m_subItems = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_subItems);
	oFF.CMEAbstractMenuItem.prototype.releaseObject.call( this );
};
oFF.CMEGroupingMenuItem.prototype.removeItem = function(item)
{
	this.m_subItems.removeElement(item);
};
oFF.CMEGroupingMenuItem.prototype.setDeferredOptionsRetriever = function(eagerlyRetrieveDeferredOptions, deferredOptionsProcedure)
{
	this.m_eagerlyRetrieveDeferredOptions = eagerlyRetrieveDeferredOptions;
	this.m_deferredOptionsProcedure = deferredOptionsProcedure;
};
oFF.CMEGroupingMenuItem.prototype.setDisableIfLessThanNEnabledItems = function(disableIfLessThanNEnabledItems)
{
	this.m_disableIfLessThanNEnabledItems = disableIfLessThanNEnabledItems;
};
oFF.CMEGroupingMenuItem.prototype.setDisableIfLessThanNItems = function(disableIfLessThanNItems)
{
	this.m_disableIfLessThanNItems = disableIfLessThanNItems;
};
oFF.CMEGroupingMenuItem.prototype.setFirstSubOptionIsDefault = function(firstSubOptionIsDefault)
{
	this.m_firstSubOptionIsDefault = firstSubOptionIsDefault;
};
oFF.CMEGroupingMenuItem.prototype.setFlat = function(flat)
{
	this.m_flatIfLessThanNItems = flat ? -1 : 0;
};
oFF.CMEGroupingMenuItem.prototype.setFlatIfLessThanNItems = function(numOfItems)
{
	this.m_flatIfLessThanNItems = numOfItems;
};
oFF.CMEGroupingMenuItem.prototype.setHideIfLessThanNItems = function(hideIfLessThanNItems)
{
	this.m_hideIfLessThanNItems = hideIfLessThanNItems;
};
oFF.CMEGroupingMenuItem.prototype.setKeepTitleForFlat = function(keepTitleForFlat)
{
	this.m_keepTitleForFlat = keepTitleForFlat;
};
oFF.CMEGroupingMenuItem.prototype.setLoadingFinished = function()
{
	this.m_loadingFinished = true;
};
oFF.CMEGroupingMenuItem.prototype.setOverflowIfMoreThanNItems = function(overflowIfMoreThanNItems)
{
	this.m_overflowIfMoreThanNItems = overflowIfMoreThanNItems;
};
oFF.CMEGroupingMenuItem.prototype.setOverflowLocalizableText = function(overflowLocalizableText)
{
	this.m_overflowLocalizableText = overflowLocalizableText;
};
oFF.CMEGroupingMenuItem.prototype.setOverflowText = function(overflowText)
{
	this.m_overflowText = overflowText;
};
oFF.CMEGroupingMenuItem.prototype.setup = function()
{
	oFF.CMEAbstractMenuItem.prototype.setup.call( this );
	this.m_flatIfLessThanNItems = 1;
	this.m_hideIfLessThanNItems = 0;
	this.m_disableIfLessThanNItems = 1;
	this.m_disableIfLessThanNEnabledItems = 0;
	this.m_cachedSubItemCount = -1;
	this.m_cachedEnabledSubItemCount = -1;
	this.m_overflowIfMoreThanNItems = -1;
	this.m_subItems = oFF.XList.create();
};

oFF.CMELeafMenuItem = function() {};
oFF.CMELeafMenuItem.prototype = new oFF.CMEAbstractMenuItem();
oFF.CMELeafMenuItem.prototype._ff_c = "CMELeafMenuItem";

oFF.CMELeafMenuItem.create = function()
{
	let instance = new oFF.CMELeafMenuItem();
	instance.setup();
	return instance;
};
oFF.CMELeafMenuItem.prototype.m_activeExtended = null;
oFF.CMELeafMenuItem.prototype.m_activeIcon = null;
oFF.CMELeafMenuItem.prototype.m_command = null;
oFF.CMELeafMenuItem.prototype.m_inactiveIcon = null;
oFF.CMELeafMenuItem.prototype.m_mainKeyboardShortcut = null;
oFF.CMELeafMenuItem.prototype.m_partialIcon = null;
oFF.CMELeafMenuItem.prototype.m_shortcutText = null;
oFF.CMELeafMenuItem.prototype.m_toggle = false;
oFF.CMELeafMenuItem.prototype.execute = function()
{
	if (oFF.notNull(this.m_command))
	{
		this.m_command();
	}
};
oFF.CMELeafMenuItem.prototype.getActionLeaf = function()
{
	return this;
};
oFF.CMELeafMenuItem.prototype.getActiveExtended = function()
{
	return this.m_activeExtended;
};
oFF.CMELeafMenuItem.prototype.getActiveIcon = function()
{
	return this.m_activeIcon;
};
oFF.CMELeafMenuItem.prototype.getCommand = function()
{
	return this.m_command;
};
oFF.CMELeafMenuItem.prototype.getInactiveIcon = function()
{
	return this.m_inactiveIcon;
};
oFF.CMELeafMenuItem.prototype.getMainKeyboardShortcut = function()
{
	return this.m_mainKeyboardShortcut;
};
oFF.CMELeafMenuItem.prototype.getPartialIcon = function()
{
	return this.m_partialIcon;
};
oFF.CMELeafMenuItem.prototype.getShortcutText = function()
{
	return this.m_shortcutText;
};
oFF.CMELeafMenuItem.prototype.getStateIcon = function()
{
	let stateIcon = null;
	if (this.isToggle())
	{
		if (this.m_activeExtended === oFF.TriStateBool._TRUE)
		{
			stateIcon = this.m_activeIcon;
		}
		else if (this.m_activeExtended === oFF.TriStateBool._DEFAULT)
		{
			stateIcon = this.m_partialIcon;
		}
		else
		{
			stateIcon = this.m_inactiveIcon;
		}
	}
	return stateIcon;
};
oFF.CMELeafMenuItem.prototype.isActive = function()
{
	return this.m_activeExtended === oFF.TriStateBool._TRUE;
};
oFF.CMELeafMenuItem.prototype.isCompatibleTo = function(other)
{
	let otherLeaf = other.getActionLeaf();
	return oFF.XString.isEqual(this.getName(), other.getName()) && oFF.notNull(otherLeaf) && otherLeaf.isToggle() === this.isToggle();
};
oFF.CMELeafMenuItem.prototype.isToggle = function()
{
	return this.m_toggle;
};
oFF.CMELeafMenuItem.prototype.isVisible = function()
{
	return oFF.CMEAbstractMenuItem.prototype.isVisible.call( this ) && (oFF.XStringUtils.isNotNullAndNotEmpty(this.getText()) || oFF.XStringUtils.isNotNullAndNotEmpty(this.getIcon()));
};
oFF.CMELeafMenuItem.prototype.releaseObject = function()
{
	this.m_activeExtended = oFF.TriStateBool._FALSE;
	this.m_toggle = false;
	this.m_command = null;
	this.m_inactiveIcon = null;
	this.m_partialIcon = "less";
	this.m_activeIcon = "accept";
	this.m_mainKeyboardShortcut = oFF.XObjectExt.release(this.m_mainKeyboardShortcut);
	this.m_shortcutText = null;
	oFF.CMEAbstractMenuItem.prototype.releaseObject.call( this );
};
oFF.CMELeafMenuItem.prototype.setActive = function(active)
{
	this.m_activeExtended = active ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
};
oFF.CMELeafMenuItem.prototype.setActiveExtended = function(activeExtended)
{
	this.m_activeExtended = activeExtended;
};
oFF.CMELeafMenuItem.prototype.setActiveIcon = function(activeIcon)
{
	this.m_activeIcon = activeIcon;
};
oFF.CMELeafMenuItem.prototype.setCommand = function(command)
{
	this.m_command = command;
};
oFF.CMELeafMenuItem.prototype.setInactiveIcon = function(inactiveIcon)
{
	this.m_inactiveIcon = inactiveIcon;
};
oFF.CMELeafMenuItem.prototype.setMainKeyboardShortcut = function(mainKeyboardShortcut)
{
	if (oFF.notNull(mainKeyboardShortcut))
	{
		this.m_mainKeyboardShortcut = oFF.CMEKeyboardShortcut.create();
		this.m_mainKeyboardShortcut.copyFrom(mainKeyboardShortcut, null);
	}
};
oFF.CMELeafMenuItem.prototype.setPartialIcon = function(partialIcon)
{
	this.m_partialIcon = partialIcon;
};
oFF.CMELeafMenuItem.prototype.setShortcutText = function(shortcutText)
{
	this.m_shortcutText = shortcutText;
};
oFF.CMELeafMenuItem.prototype.setToggle = function(toggle)
{
	this.m_toggle = toggle;
};
oFF.CMELeafMenuItem.prototype.setup = function()
{
	oFF.CMEAbstractMenuItem.prototype.setup.call( this );
	this.m_activeExtended = oFF.TriStateBool._FALSE;
	this.m_inactiveIcon = null;
	this.m_partialIcon = "less";
	this.m_activeIcon = "accept";
};

oFF.CMELocalizableText = function() {};
oFF.CMELocalizableText.prototype = new oFF.XObjectExt();
oFF.CMELocalizableText.prototype._ff_c = "CMELocalizableText";

oFF.CMELocalizableText.create = function()
{
	let instance = new oFF.CMELocalizableText();
	instance.setup();
	return instance;
};
oFF.CMELocalizableText.prototype.m_key = null;
oFF.CMELocalizableText.prototype.m_replacements = null;
oFF.CMELocalizableText.prototype.addReplacement = function(replacement)
{
	this.m_replacements.add(replacement);
};
oFF.CMELocalizableText.prototype.getKey = function()
{
	return this.m_key;
};
oFF.CMELocalizableText.prototype.getReplacements = function()
{
	return this.m_replacements;
};
oFF.CMELocalizableText.prototype.releaseObject = function()
{
	this.m_key = null;
	this.m_replacements = oFF.XObjectExt.release(this.m_replacements);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.CMELocalizableText.prototype.setKey = function(key)
{
	this.m_key = key;
};
oFF.CMELocalizableText.prototype.setup = function()
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.m_replacements = oFF.XList.create();
};

oFF.CMEToggleAction = function() {};
oFF.CMEToggleAction.prototype = new oFF.CMESimpleAction();
oFF.CMEToggleAction.prototype._ff_c = "CMEToggleAction";

oFF.CMEToggleAction.create = function()
{
	let instance = new oFF.CMEToggleAction();
	instance.setup();
	return instance;
};
oFF.CMEToggleAction.prototype.m_consumer = null;
oFF.CMEToggleAction.prototype.m_provider = null;
oFF.CMEToggleAction.prototype.asToggleAction = function()
{
	return this;
};
oFF.CMEToggleAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.TOGGLE;
};
oFF.CMEToggleAction.prototype.isToggled = function(context)
{
	return oFF.isNull(this.m_provider) ? false : this.m_provider(context) === oFF.TriStateBool._TRUE;
};
oFF.CMEToggleAction.prototype.isToggledExt = function(context)
{
	return oFF.isNull(this.m_provider) ? oFF.TriStateBool._FALSE : this.m_provider(context);
};
oFF.CMEToggleAction.prototype.mapToMenuCreator = function(controller)
{
	let leafCreator = oFF.CMELeafCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, leafCreator);
	leafCreator.setToggle(true);
	if (oFF.notNull(this.m_provider))
	{
		let checked = oFF.CMEValueFunctionalResolver.create();
		let partiallyChecked = oFF.CMEValueFunctionalResolver.create();
		if (oFF.notNull(controller))
		{
			checked.setFunction((checkContext) => {
				return oFF.XBooleanValue.create(controller.checkToggled(this, checkContext) === oFF.TriStateBool._TRUE);
			});
			partiallyChecked.setFunction((partialContext) => {
				return oFF.XBooleanValue.create(controller.checkToggled(this, partialContext) === oFF.TriStateBool._DEFAULT);
			});
		}
		else
		{
			checked.setFunction((input) => {
				return oFF.XBooleanValue.create(this.m_provider(input) === oFF.TriStateBool._TRUE);
			});
			partiallyChecked.setFunction((pinput) => {
				return oFF.XBooleanValue.create(this.m_provider(pinput) === oFF.TriStateBool._DEFAULT);
			});
		}
		leafCreator.setActive(checked);
		leafCreator.setPartiallyActive(partiallyChecked);
	}
	if (oFF.notNull(controller))
	{
		leafCreator.setContextConsumer((consumerContext) => {
			controller.onActionToggled(this, consumerContext);
		});
	}
	else
	{
		leafCreator.setContextConsumer((context) => {
			this.m_consumer(context, oFF.XBooleanValue.create(this.m_provider(context) !== oFF.TriStateBool._TRUE));
		});
	}
	return leafCreator;
};
oFF.CMEToggleAction.prototype.setConsumer = function(consumer)
{
	this.m_consumer = consumer;
};
oFF.CMEToggleAction.prototype.setProvider = function(provider)
{
	this.m_provider = (context) => {
		return provider(context) ? oFF.TriStateBool._TRUE : oFF.TriStateBool._FALSE;
	};
};
oFF.CMEToggleAction.prototype.setProviderExt = function(provider)
{
	this.m_provider = provider;
};
oFF.CMEToggleAction.prototype.toggle = function(context)
{
	if (oFF.notNull(this.m_consumer))
	{
		this.m_consumer(context, oFF.XBooleanValue.create(!this.isToggled(context)));
	}
};
oFF.CMEToggleAction.prototype.trigger = function(context)
{
	this.toggle(context);
};

oFF.CMETriggerAction = function() {};
oFF.CMETriggerAction.prototype = new oFF.CMESimpleAction();
oFF.CMETriggerAction.prototype._ff_c = "CMETriggerAction";

oFF.CMETriggerAction.create = function()
{
	let instance = new oFF.CMETriggerAction();
	instance.setup();
	return instance;
};
oFF.CMETriggerAction.prototype.m_trigger = null;
oFF.CMETriggerAction.prototype.asTriggerAction = function()
{
	return this;
};
oFF.CMETriggerAction.prototype.getActionType = function()
{
	return oFF.CmeActionType.TRIGGER;
};
oFF.CMETriggerAction.prototype.mapToMenuCreator = function(controller)
{
	let leafCreator = oFF.CMELeafCreator.create();
	this.mapGenericPropertiesToMenuCreator(controller, leafCreator);
	if (oFF.isNull(controller))
	{
		leafCreator.setContextConsumer(this.m_trigger);
	}
	else
	{
		leafCreator.setContextConsumer((context) => {
			controller.onActionTriggered(this, context);
		});
	}
	return leafCreator;
};
oFF.CMETriggerAction.prototype.setTrigger = function(trigger)
{
	this.m_trigger = trigger;
};
oFF.CMETriggerAction.prototype.trigger = function(context)
{
	if (oFF.notNull(this.m_trigger))
	{
		this.m_trigger(context);
	}
};

oFF.CMEConditionalMenuCreator = function() {};
oFF.CMEConditionalMenuCreator.prototype = new oFF.CMEAggregatedCreator();
oFF.CMEConditionalMenuCreator.prototype._ff_c = "CMEConditionalMenuCreator";

oFF.CMEConditionalMenuCreator.create = function()
{
	let instance = new oFF.CMEConditionalMenuCreator();
	instance.setup();
	return instance;
};
oFF.CMEConditionalMenuCreator.prototype.m_contextCondition = null;
oFF.CMEConditionalMenuCreator.prototype.checkCondition = function(parameters, name)
{
	return oFF.isNull(this.m_contextCondition) ? true : this.m_contextCondition.matches(parameters, name);
};
oFF.CMEConditionalMenuCreator.prototype.conditionalTransform = function(parameters, resultContainer)
{
	let conditionFulFilled = this.checkCondition(this.getSubContext(parameters), resultContainer.getRootName());
	if (conditionFulFilled)
	{
		this.applyTransformation(resultContainer, this.getSubContext(parameters));
		let currentName = this.getName().resolveString(parameters);
		if (oFF.notNull(currentName))
		{
			resultContainer.addTag(currentName);
		}
	}
	return conditionFulFilled;
};
oFF.CMEConditionalMenuCreator.prototype.getMatchingTopMenuName = function(parameters)
{
	let currentName = null;
	let conditionFulFilled = this.checkCondition(this.getSubContext(parameters), null);
	if (conditionFulFilled)
	{
		currentName = this.getName().resolveString(parameters);
	}
	return currentName;
};
oFF.CMEConditionalMenuCreator.prototype.setContextCondition = function(contextCondition)
{
	this.m_contextCondition = contextCondition;
};
oFF.CMEConditionalMenuCreator.prototype.transform = function(parameters, resultContainer)
{
	this.conditionalTransform(parameters, resultContainer);
};

oFF.CMEGroupCreator = function() {};
oFF.CMEGroupCreator.prototype = new oFF.CMEAggregatedCreator();
oFF.CMEGroupCreator.prototype._ff_c = "CMEGroupCreator";

oFF.CMEGroupCreator.create = function()
{
	let instance = new oFF.CMEGroupCreator();
	instance.setup();
	return instance;
};
oFF.CMEGroupCreator.prototype.m_deferredOptionsRetriever = null;
oFF.CMEGroupCreator.prototype.m_disableIfLessThanNEnabledItems = null;
oFF.CMEGroupCreator.prototype.m_disableIfLessThanNItems = null;
oFF.CMEGroupCreator.prototype.m_doubtfulSelectionsRetriever = null;
oFF.CMEGroupCreator.prototype.m_eagerlyRetrieveDeferredOptions = false;
oFF.CMEGroupCreator.prototype.m_firstSubOptionIsDefault = false;
oFF.CMEGroupCreator.prototype.m_flatIfLessThanNItems = null;
oFF.CMEGroupCreator.prototype.m_hideIfLessThanNItems = null;
oFF.CMEGroupCreator.prototype.m_keepTitleForFlat = false;
oFF.CMEGroupCreator.prototype.m_optionsRetriever = null;
oFF.CMEGroupCreator.prototype.m_overflowIfMoreThanNItems = null;
oFF.CMEGroupCreator.prototype.m_overflowLocalizableText = null;
oFF.CMEGroupCreator.prototype.m_overflowText = null;
oFF.CMEGroupCreator.prototype.m_selectionConsumer = null;
oFF.CMEGroupCreator.prototype.m_selectionRetriever = null;
oFF.CMEGroupCreator.prototype.m_selectionsRetriever = null;
oFF.CMEGroupCreator.prototype.consumeOptions = function(subContext, parameters, group, isGroupVisible, isGroupEnabled, optionsRaw)
{
	let leafMenuItem;
	let menuCreators = this.getMenuCreators();
	let selections = oFF.isNull(this.m_selectionsRetriever) ? null : this.m_selectionsRetriever(subContext);
	let doubtfulSelections = oFF.isNull(this.m_doubtfulSelectionsRetriever) ? null : this.m_doubtfulSelectionsRetriever(subContext);
	let selection = oFF.isNull(this.m_selectionRetriever) ? null : this.m_selectionRetriever(subContext);
	let i;
	let defaultHighlightProcedure = this.resolveHighlightProcedure(parameters);
	let defaultUnHighlightProcedure = this.resolveUnHighlightProcedure(parameters);
	if (oFF.XCollectionUtils.hasElements(menuCreators))
	{
		let optionsMap = oFF.XHashMapByString.create();
		let optionRaw;
		for (i = 0; i < optionsRaw.size(); i++)
		{
			optionRaw = optionsRaw.get(i);
			if (oFF.notNull(optionRaw))
			{
				optionsMap.put(optionRaw.getName(subContext), optionRaw);
			}
		}
		for (i = 0; i < menuCreators.size(); i++)
		{
			let menuCreator = menuCreators.get(i);
			let currentName = menuCreator.getName().resolveString(parameters);
			if (optionsMap.containsKey(currentName))
			{
				let currentOption = optionsMap.getByKey(currentName);
				leafMenuItem = group.addNewLeaf();
				let localizableText = menuCreator.resolveLocalizableText(parameters);
				leafMenuItem.setLocalizableText(localizableText);
				if (oFF.isNull(localizableText))
				{
					let currentText = menuCreator.getText().resolveString(parameters);
					if (oFF.isNull(currentText))
					{
						currentText = currentOption.getLocalizedText(parameters);
					}
					leafMenuItem.setText(currentText);
				}
				let localizableExplanation = menuCreator.resolveLocalizableExplanation(parameters);
				leafMenuItem.setLocalizableExplanation(localizableExplanation);
				if (oFF.isNull(localizableExplanation))
				{
					let currentExplanation = menuCreator.getExplanation().resolveString(parameters);
					if (oFF.isNull(currentExplanation))
					{
						currentExplanation = currentOption.getLocalizedExplanation(parameters);
					}
					leafMenuItem.setExplanation(currentExplanation);
				}
				leafMenuItem.setName(currentName);
				leafMenuItem.setVisible(isGroupVisible && currentOption.isAvailable(parameters) && menuCreator.resolveVisible(parameters));
				leafMenuItem.setEnabled(isGroupEnabled && currentOption.isEnabled(parameters) && menuCreator.resolveEnabled(parameters));
				if (selection === currentOption || oFF.notNull(selections) && selections.contains(currentOption))
				{
					leafMenuItem.setActive(true);
				}
				else if (oFF.notNull(doubtfulSelections) && doubtfulSelections.contains(currentOption))
				{
					leafMenuItem.setActiveExtended(oFF.TriStateBool._DEFAULT);
				}
				leafMenuItem.setCommand(this.getSelectionAcceptor(subContext, currentOption));
				leafMenuItem.setToggle(true);
				let currentHighlightProcedure = currentOption.resolveHighlightProcedure(parameters);
				leafMenuItem.setHighlightProcedure(oFF.isNull(currentHighlightProcedure) ? defaultHighlightProcedure : currentHighlightProcedure);
				let currentUnhighlightProcedure = currentOption.resolveUnHighlightProcedure(parameters);
				leafMenuItem.setUnHighlightProcedure(oFF.isNull(currentUnhighlightProcedure) ? defaultUnHighlightProcedure : currentUnhighlightProcedure);
			}
		}
	}
	else
	{
		for (i = 0; i < optionsRaw.size(); i++)
		{
			let option = optionsRaw.get(i);
			if (oFF.isNull(option))
			{
				continue;
			}
			leafMenuItem = group.addNewLeaf();
			leafMenuItem.setName(option.getName(subContext));
			leafMenuItem.setText(option.getLocalizedText(subContext));
			leafMenuItem.setVisible(isGroupVisible && option.isAvailable(subContext));
			leafMenuItem.setEnabled(isGroupEnabled && option.isEnabled(subContext));
			if (selection === option || oFF.notNull(selections) && selections.contains(option))
			{
				leafMenuItem.setActive(true);
			}
			else if (oFF.notNull(doubtfulSelections) && doubtfulSelections.contains(option))
			{
				leafMenuItem.setActiveExtended(oFF.TriStateBool._DEFAULT);
			}
			leafMenuItem.setCommand(this.getSelectionAcceptor(subContext, option));
			leafMenuItem.setToggle(true);
			let highlightProcedure = option.resolveHighlightProcedure(parameters);
			leafMenuItem.setHighlightProcedure(oFF.isNull(highlightProcedure) ? defaultHighlightProcedure : highlightProcedure);
			let unhighlightProcedure = option.resolveUnHighlightProcedure(parameters);
			leafMenuItem.setUnHighlightProcedure(oFF.isNull(unhighlightProcedure) ? defaultUnHighlightProcedure : unhighlightProcedure);
		}
	}
};
oFF.CMEGroupCreator.prototype.getDisableIfLessThanNEnabledItems = function()
{
	return oFF.notNull(this.m_disableIfLessThanNEnabledItems) ? this.m_disableIfLessThanNEnabledItems : oFF.CMEValueLiteralResolver.getPlus1Resolver();
};
oFF.CMEGroupCreator.prototype.getDisableIfLessThanNItems = function()
{
	return oFF.notNull(this.m_disableIfLessThanNItems) ? this.m_disableIfLessThanNItems : oFF.CMEValueLiteralResolver.getPlus1Resolver();
};
oFF.CMEGroupCreator.prototype.getFlatIfLessThanNItems = function()
{
	return oFF.notNull(this.m_flatIfLessThanNItems) ? this.m_flatIfLessThanNItems : oFF.CMEValueLiteralResolver.getPlus1Resolver();
};
oFF.CMEGroupCreator.prototype.getHideIfLessThanNItems = function()
{
	return oFF.notNull(this.m_hideIfLessThanNItems) ? this.m_hideIfLessThanNItems : oFF.CMEValueLiteralResolver.getPlus1Resolver();
};
oFF.CMEGroupCreator.prototype.getOverflowIfMoreThanNItems = function()
{
	return oFF.isNull(this.m_overflowIfMoreThanNItems) ? oFF.CMEValueLiteralResolver.getMinus1Resolver() : this.m_overflowIfMoreThanNItems;
};
oFF.CMEGroupCreator.prototype.getOverflowText = function()
{
	return oFF.isNull(this.m_overflowText) ? oFF.CMEValueLiteralResolver.getNullResolver() : this.m_overflowText;
};
oFF.CMEGroupCreator.prototype.getSelectionAcceptor = function(subContext, currentOption)
{
	return () => {
		this.m_selectionConsumer(subContext, currentOption, oFF.XBooleanValue.create(true));
	};
};
oFF.CMEGroupCreator.prototype.isGroupCreator = function()
{
	return true;
};
oFF.CMEGroupCreator.prototype.resolveOverflowLocalizableText = function(context)
{
	let result = null;
	if (oFF.notNull(this.m_overflowLocalizableText))
	{
		result = oFF.CMELocalizableText.create();
		result.setKey(this.m_overflowLocalizableText.getKey(context));
		let replacements = this.m_overflowLocalizableText.getReplacements(context);
		for (let i = 0; i < replacements.size(); i++)
		{
			result.addReplacement(replacements.get(i).resolveString(context));
		}
	}
	return result;
};
oFF.CMEGroupCreator.prototype.setDeferredOptionsRetriever = function(eager, deferredOptionsRetriever)
{
	this.m_eagerlyRetrieveDeferredOptions = eager;
	this.m_deferredOptionsRetriever = deferredOptionsRetriever;
};
oFF.CMEGroupCreator.prototype.setDisableIfLessThanNEnabledItems = function(disable)
{
	this.m_disableIfLessThanNEnabledItems = disable;
};
oFF.CMEGroupCreator.prototype.setDisableIfLessThanNItems = function(disable)
{
	this.m_disableIfLessThanNItems = disable;
};
oFF.CMEGroupCreator.prototype.setDoubtfulSelectionsRetriever = function(selectionsRetriever)
{
	this.m_doubtfulSelectionsRetriever = selectionsRetriever;
};
oFF.CMEGroupCreator.prototype.setEager = function(eager)
{
	this.m_eagerlyRetrieveDeferredOptions = eager;
};
oFF.CMEGroupCreator.prototype.setFirstSubOptionIsDefault = function(firstSubOptionIsDefault)
{
	this.m_firstSubOptionIsDefault = firstSubOptionIsDefault;
};
oFF.CMEGroupCreator.prototype.setFlatIfLessThanNItems = function(flat)
{
	this.m_flatIfLessThanNItems = flat;
};
oFF.CMEGroupCreator.prototype.setHideIfLessThanNItems = function(hide)
{
	this.m_hideIfLessThanNItems = hide;
};
oFF.CMEGroupCreator.prototype.setKeepTitleForFlat = function(keepTitleForFlat)
{
	this.m_keepTitleForFlat = keepTitleForFlat;
};
oFF.CMEGroupCreator.prototype.setOptionsRetriever = function(optionsRetriever)
{
	this.m_optionsRetriever = optionsRetriever;
};
oFF.CMEGroupCreator.prototype.setOverflowIfMoreThanNItems = function(overflowIfMoreThanNItems)
{
	this.m_overflowIfMoreThanNItems = overflowIfMoreThanNItems;
};
oFF.CMEGroupCreator.prototype.setOverflowLocalizableText = function(overflowLocalizableText)
{
	this.m_overflowLocalizableText = overflowLocalizableText;
};
oFF.CMEGroupCreator.prototype.setOverflowText = function(overflowText)
{
	this.m_overflowText = overflowText;
};
oFF.CMEGroupCreator.prototype.setSelectionConsumer = function(selectionConsumer)
{
	this.m_selectionConsumer = selectionConsumer;
};
oFF.CMEGroupCreator.prototype.setSelectionRetriever = function(selectionRetriever)
{
	this.m_selectionRetriever = selectionRetriever;
};
oFF.CMEGroupCreator.prototype.setSelectionsRetriever = function(selectionsRetriever)
{
	this.m_selectionsRetriever = selectionsRetriever;
};
oFF.CMEGroupCreator.prototype.transform = function(parameters, resultContainer)
{
	let subContext = this.getSubContext(parameters);
	if (oFF.notNull(subContext))
	{
		let group = resultContainer.addNewGroup();
		let isGroupEnabled = this.resolveEnabled(subContext);
		let isGroupVisible = this.resolveVisible(subContext);
		group.setOverflowPriority(this.getOverflowPriority());
		group.setName(this.getName().resolveString(subContext));
		group.setText(this.getText().resolveString(subContext));
		group.setExplanation(this.getExplanation().resolveString(subContext));
		group.setLocalizableExplanation(this.resolveLocalizableExplanation(subContext));
		group.setLocalizableText(this.resolveLocalizableText(subContext));
		group.setIcon(this.getIcon().resolveString(subContext));
		group.setDataHelpId(this.getDataHelpId().resolveString(subContext));
		group.setEnabled(isGroupEnabled);
		group.setVisible(isGroupVisible);
		group.setKeepTitleForFlat(this.m_keepTitleForFlat);
		group.setFirstSubOptionIsDefault(this.m_firstSubOptionIsDefault);
		group.setFlatIfLessThanNItems(this.getFlatIfLessThanNItems().resolveInteger(subContext));
		group.setHideIfLessThanNItems(this.getHideIfLessThanNItems().resolveInteger(subContext));
		group.setDisableIfLessThanNItems(this.getDisableIfLessThanNItems().resolveInteger(subContext));
		group.setDisableIfLessThanNEnabledItems(this.getDisableIfLessThanNEnabledItems().resolveInteger(subContext));
		group.setOverflowIfMoreThanNItems(this.getOverflowIfMoreThanNItems().resolveInteger(subContext));
		group.setOverflowText(this.getOverflowText().resolveString(subContext));
		group.setOverflowLocalizableText(this.resolveOverflowLocalizableText(subContext));
		group.setHighlightProcedure(this.resolveHighlightProcedure(parameters));
		group.setUnHighlightProcedure(this.resolveUnHighlightProcedure(parameters));
		if (oFF.notNull(this.m_optionsRetriever) && oFF.notNull(this.m_selectionConsumer))
		{
			let optionsRaw = this.m_optionsRetriever(subContext);
			this.consumeOptions(subContext, parameters, group, isGroupVisible, isGroupEnabled, optionsRaw);
		}
		else if (oFF.notNull(this.m_deferredOptionsRetriever) && oFF.notNull(this.m_selectionConsumer))
		{
			if (oFF.isNull(this.m_hideIfLessThanNItems))
			{
				group.setHideIfLessThanNItems(0);
			}
			if (oFF.isNull(this.m_flatIfLessThanNItems))
			{
				group.setFlatIfLessThanNItems(0);
			}
			if (oFF.isNull(this.m_disableIfLessThanNItems))
			{
				group.setDisableIfLessThanNItems(1);
			}
			if (oFF.isNull(this.m_disableIfLessThanNEnabledItems))
			{
				group.setDisableIfLessThanNEnabledItems(0);
			}
			let deferredOptions = (pro) => {
				if (group.isLoadingFinished())
				{
					pro();
				}
				else
				{
					try
					{
						this.m_deferredOptionsRetriever(subContext, (so) => {
							if (!group.isReleased())
							{
								group.clearSubItems();
								this.consumeOptions(subContext, parameters, group, isGroupVisible, isGroupEnabled, so);
								group.setLoadingFinished();
							}
							pro();
						});
					}
					catch (t)
					{
						group.clearSubItems();
						group.addNewLeaf().setText(oFF.XException.getMessage(t));
						group.setLoadingFinished();
						pro();
					}
				}
			};
			group.setDeferredOptionsRetriever(this.m_eagerlyRetrieveDeferredOptions, deferredOptions);
		}
		else
		{
			this.applyTransformation(group, subContext);
		}
	}
};

oFF.CMELoopedMenuCreator = function() {};
oFF.CMELoopedMenuCreator.prototype = new oFF.CMEAggregatedCreator();
oFF.CMELoopedMenuCreator.prototype._ff_c = "CMELoopedMenuCreator";

oFF.CMELoopedMenuCreator.createLoop = function()
{
	let instance = new oFF.CMELoopedMenuCreator();
	instance.setup();
	return instance;
};
oFF.CMELoopedMenuCreator.prototype.m_loopParameter = null;
oFF.CMELoopedMenuCreator.prototype.m_sorting = false;
oFF.CMELoopedMenuCreator.prototype.getLoopParameter = function()
{
	return this.m_loopParameter;
};
oFF.CMELoopedMenuCreator.prototype.setLoopParameter = function(loopParameter)
{
	this.m_loopParameter = loopParameter;
};
oFF.CMELoopedMenuCreator.prototype.setSortLooping = function(sorting)
{
	this.m_sorting = sorting;
};
oFF.CMELoopedMenuCreator.prototype.transform = function(parameters, resultContainer)
{
	let resultElements = this.getSubContext(parameters).getSubContexts(this.m_loopParameter);
	if (oFF.XCollectionUtils.hasElements(resultElements))
	{
		let stream = oFF.XStream.of(resultElements);
		if (this.m_sorting)
		{
			stream = stream.sorted(oFF.XComparatorLambda.create((a, b) => {
				return oFF.XIntegerValue.create(oFF.DfNameTextObject.compareByTextsAndFallbackToNames(a, b));
			}));
		}
		stream.forEach((subContext) => {
			let subContextAccess = parameters.getCopy();
			let newLocalContext = oFF.CMEContext.create();
			subContextAccess.setLocalContext(newLocalContext);
			let newSubContext = newLocalContext.addSubContext();
			newSubContext.copyFrom(subContext, null);
			this.applyTransformation(resultContainer, subContextAccess);
		});
	}
};

oFF.CMERefocusedMenuCreator = function() {};
oFF.CMERefocusedMenuCreator.prototype = new oFF.CMEAggregatedCreator();
oFF.CMERefocusedMenuCreator.prototype._ff_c = "CMERefocusedMenuCreator";

oFF.CMERefocusedMenuCreator.createRefocus = function()
{
	let instance = new oFF.CMERefocusedMenuCreator();
	instance.setup();
	return instance;
};
oFF.CMERefocusedMenuCreator.prototype.m_refocusParameter = null;
oFF.CMERefocusedMenuCreator.prototype.getRefocusParameter = function()
{
	return this.m_refocusParameter;
};
oFF.CMERefocusedMenuCreator.prototype.setRefocusParameter = function(loopParameter)
{
	this.m_refocusParameter = loopParameter;
};
oFF.CMERefocusedMenuCreator.prototype.transform = function(parameters, resultContainer)
{
	let resultElements = this.getSubContext(parameters).getSubContexts(this.m_refocusParameter);
	if (oFF.XCollectionUtils.hasElements(resultElements))
	{
		let subContextAccess = parameters.getCopy();
		let newLocalContext = oFF.CMEContext.create();
		subContextAccess.setLocalContext(newLocalContext);
		for (let i = 0; i < resultElements.size(); i++)
		{
			let subContext = resultElements.get(i);
			let newSubContext = newLocalContext.addSubContext();
			newSubContext.copyFrom(subContext, null);
		}
		this.applyTransformation(resultContainer, subContextAccess);
	}
};

oFF.CMEConditionalType = function() {};
oFF.CMEConditionalType.prototype = new oFF.XConstant();
oFF.CMEConditionalType.prototype._ff_c = "CMEConditionalType";

oFF.CMEConditionalType.EQUAL = null;
oFF.CMEConditionalType.EXISTS = null;
oFF.CMEConditionalType.MAX_SIZE = null;
oFF.CMEConditionalType.MIN_SIZE = null;
oFF.CMEConditionalType.NOT_EQUAL = null;
oFF.CMEConditionalType.NOT_EXISTS = null;
oFF.CMEConditionalType.s_instances = null;
oFF.CMEConditionalType.create = function(name)
{
	let condType = new oFF.CMEConditionalType();
	condType._setupInternal(name);
	oFF.CMEConditionalType.s_instances.put(name, condType);
	return condType;
};
oFF.CMEConditionalType.staticSetup = function()
{
	oFF.CMEConditionalType.s_instances = oFF.XHashMapByString.create();
	oFF.CMEConditionalType.EXISTS = oFF.CMEConditionalType.create("Exists");
	oFF.CMEConditionalType.NOT_EXISTS = oFF.CMEConditionalType.create("NotExists");
	oFF.CMEConditionalType.EQUAL = oFF.CMEConditionalType.create("Equal");
	oFF.CMEConditionalType.NOT_EQUAL = oFF.CMEConditionalType.create("NotEqual");
	oFF.CMEConditionalType.MIN_SIZE = oFF.CMEConditionalType.create("MinSize");
	oFF.CMEConditionalType.MAX_SIZE = oFF.CMEConditionalType.create("MaxSize");
};

oFF.CMEMenuExtensionOperationType = function() {};
oFF.CMEMenuExtensionOperationType.prototype = new oFF.XConstant();
oFF.CMEMenuExtensionOperationType.prototype._ff_c = "CMEMenuExtensionOperationType";

oFF.CMEMenuExtensionOperationType.APPEND_INTO = null;
oFF.CMEMenuExtensionOperationType.INSERT_AFTER = null;
oFF.CMEMenuExtensionOperationType.INSERT_BEFORE = null;
oFF.CMEMenuExtensionOperationType.PREPEND_INTO = null;
oFF.CMEMenuExtensionOperationType.REDEFINE = null;
oFF.CMEMenuExtensionOperationType.s_instances = null;
oFF.CMEMenuExtensionOperationType.create = function(name)
{
	let operationType = new oFF.CMEMenuExtensionOperationType();
	operationType._setupInternal(name);
	oFF.CMEMenuExtensionOperationType.s_instances.put(name, operationType);
	return operationType;
};
oFF.CMEMenuExtensionOperationType.lookup = function(name)
{
	return oFF.CMEMenuExtensionOperationType.s_instances.getByKey(name);
};
oFF.CMEMenuExtensionOperationType.staticSetup = function()
{
	oFF.CMEMenuExtensionOperationType.s_instances = oFF.XHashMapByString.create();
	oFF.CMEMenuExtensionOperationType.PREPEND_INTO = oFF.CMEMenuExtensionOperationType.create("PrependInto");
	oFF.CMEMenuExtensionOperationType.APPEND_INTO = oFF.CMEMenuExtensionOperationType.create("AppendInto");
	oFF.CMEMenuExtensionOperationType.REDEFINE = oFF.CMEMenuExtensionOperationType.create("Redefine");
	oFF.CMEMenuExtensionOperationType.INSERT_AFTER = oFF.CMEMenuExtensionOperationType.create("InsertAfter");
	oFF.CMEMenuExtensionOperationType.INSERT_BEFORE = oFF.CMEMenuExtensionOperationType.create("InsertBefore");
};

oFF.ContextMenuEngineImplModule = function() {};
oFF.ContextMenuEngineImplModule.prototype = new oFF.DfModule();
oFF.ContextMenuEngineImplModule.prototype._ff_c = "ContextMenuEngineImplModule";

oFF.ContextMenuEngineImplModule.s_module = null;
oFF.ContextMenuEngineImplModule.getInstance = function()
{
	if (oFF.isNull(oFF.ContextMenuEngineImplModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.ContextMenuEngineModule.getInstance());
		oFF.ContextMenuEngineImplModule.s_module = oFF.DfModule.startExt(new oFF.ContextMenuEngineImplModule());
		oFF.CMEConditionalType.staticSetup();
		oFF.CMEMenuExtensionOperationType.staticSetup();
		oFF.CMEFactory.setFactory(oFF.CMEFactoryImpl.create());
		oFF.DfModule.stopExt(oFF.ContextMenuEngineImplModule.s_module);
	}
	return oFF.ContextMenuEngineImplModule.s_module;
};
oFF.ContextMenuEngineImplModule.prototype.getName = function()
{
	return "ff3410.contextmenu.engine.impl";
};

oFF.ContextMenuEngineImplModule.getInstance();

return oFF;
} );