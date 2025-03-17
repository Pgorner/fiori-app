/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0200.io"
],
function(oFF)
{
"use strict";

oFF.CMEDynamicActionsProviderDefault = function() {};
oFF.CMEDynamicActionsProviderDefault.prototype = new oFF.XObject();
oFF.CMEDynamicActionsProviderDefault.prototype._ff_c = "CMEDynamicActionsProviderDefault";

oFF.CMEDynamicActionsProviderDefault.prototype.isActionEnabled = function(action, context)
{
	return true;
};
oFF.CMEDynamicActionsProviderDefault.prototype.isActionVisible = function(action, context)
{
	return true;
};
oFF.CMEDynamicActionsProviderDefault.prototype.onActionTriggered = function(action, context) {};

oFF.CMEMultiActionWrapper = function() {};
oFF.CMEMultiActionWrapper.prototype = new oFF.XObject();
oFF.CMEMultiActionWrapper.prototype._ff_c = "CMEMultiActionWrapper";

oFF.CMEMultiActionWrapper.create = function()
{
	let instance = new oFF.CMEMultiActionWrapper();
	instance.m_actions = oFF.XHashMapByString.create();
	return instance;
};
oFF.CMEMultiActionWrapper.prototype.m_actions = null;
oFF.CMEMultiActionWrapper.prototype.getActionByKey = function(key)
{
	return this.m_actions.getByKey(key);
};
oFF.CMEMultiActionWrapper.prototype.getOptionByKey = function(key)
{
	return this.m_actions.containsKey(key) ? this.m_actions.getByKey(key).asSelectOption() : null;
};
oFF.CMEMultiActionWrapper.prototype.getRegistrationKeys = function()
{
	return this.m_actions.getKeysAsReadOnlyList();
};
oFF.CMEMultiActionWrapper.prototype.registerAction = function(key, action)
{
	this.m_actions.put(key, action);
};
oFF.CMEMultiActionWrapper.prototype.releaseObject = function()
{
	this.m_actions = oFF.XObjectExt.release(this.m_actions);
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.CMEFactory = {

	s_factory:null,
	s_showNamesInMenu:false,
	createContext:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newContext();
	},
	createContextAccess:function(dataContext, uiContext)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newContextAccess(dataContext, uiContext);
	},
	createGroupingMenuItem:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newGroupingMenuItem();
	},
	createGroupingMenuItemFromPrStructure:function(input)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newGroupingMenuItemFromPrStructure(input);
	},
	createMenuTreeGenerator:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newMenuTreeGenerator();
	},
	createMenuTreePopulator:function(widgetsFactory, uiCache)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newMenuTreePopulator(widgetsFactory, uiCache);
	},
	createMenuTreePopulatorWithSubMapper:function(widgetsFactory, subMapper, uiCache)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newMenuTreePopulatorWithSubMapper(widgetsFactory, subMapper, uiCache);
	},
	createMultiSelectAction:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newMultiSelectAction();
	},
	createSelectionOption:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newSelectionOption();
	},
	createSimpleToggleAction:function(name, key, availabilityKey, enablementKey, toggledKey, executionKey)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newSimpleToggleAction(name, key, availabilityKey, enablementKey, toggledKey, executionKey);
	},
	createSimpleTriggerAction:function(name, key, availabilityKey, enablementKey, executionKey)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newSimpleTriggerAction(name, key, availabilityKey, enablementKey, executionKey);
	},
	createSingleSelectAction:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newSingleSelectAction();
	},
	createToggleAction:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newToggleAction();
	},
	createTriggerAction:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newTriggerAction();
	},
	createUiCache:function()
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.newUiCache();
	},
	serializeGroupingMenuItemToPaths:function(groupingMenuItem)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.serializeGroupingMenuItemToPaths(groupingMenuItem);
	},
	serializeGroupingMenuItemToPrStructure:function(groupingMenuItem)
	{
			if (oFF.isNull(oFF.CMEFactory.s_factory))
		{
			throw oFF.XException.createIllegalStateException("Implementation for Context Menu Engine not initialized");
		}
		return oFF.CMEFactory.s_factory.serializeGroupingMenuItemToPrStructure(groupingMenuItem);
	},
	setFactory:function(factory)
	{
			oFF.CMEFactory.s_factory = factory;
		factory.setShowNamesInMenu(oFF.CMEFactory.s_showNamesInMenu);
	},
	setShowNamesInMenu:function(showNamesInMenu)
	{
			oFF.CMEFactory.s_showNamesInMenu = showNamesInMenu;
		if (oFF.notNull(oFF.CMEFactory.s_factory))
		{
			oFF.CMEFactory.s_factory.setShowNamesInMenu(showNamesInMenu);
		}
	}
};

oFF.CmeCardinalityType = function() {};
oFF.CmeCardinalityType.prototype = new oFF.XConstant();
oFF.CmeCardinalityType.prototype._ff_c = "CmeCardinalityType";

oFF.CmeCardinalityType.COLLECT = null;
oFF.CmeCardinalityType.LIST = null;
oFF.CmeCardinalityType.SINGLE = null;
oFF.CmeCardinalityType.SPLIT = null;
oFF.CmeCardinalityType.create = function(constant)
{
	let cardinalityType = new oFF.CmeCardinalityType();
	cardinalityType._setupInternal(constant);
	return cardinalityType;
};
oFF.CmeCardinalityType.staticSetup = function()
{
	oFF.CmeCardinalityType.SINGLE = oFF.CmeCardinalityType.create("Single");
	oFF.CmeCardinalityType.LIST = oFF.CmeCardinalityType.create("List");
	oFF.CmeCardinalityType.SPLIT = oFF.CmeCardinalityType.create("Split");
	oFF.CmeCardinalityType.COLLECT = oFF.CmeCardinalityType.create("Collect");
};

oFF.CmeActionType = function() {};
oFF.CmeActionType.prototype = new oFF.XConstantWithParent();
oFF.CmeActionType.prototype._ff_c = "CmeActionType";

oFF.CmeActionType.ABSTRACT = null;
oFF.CmeActionType.MULTI_SELECT = null;
oFF.CmeActionType.OPTION = null;
oFF.CmeActionType.SELECT = null;
oFF.CmeActionType.SIMPLE = null;
oFF.CmeActionType.SINGLE_SELECT = null;
oFF.CmeActionType.TOGGLE = null;
oFF.CmeActionType.TRIGGER = null;
oFF.CmeActionType.create = function(constant, parent)
{
	let actionType = new oFF.CmeActionType();
	actionType.setupExt(constant, parent);
	return actionType;
};
oFF.CmeActionType.staticSetup = function()
{
	oFF.CmeActionType.ABSTRACT = oFF.CmeActionType.create("Abstract", null);
	oFF.CmeActionType.SIMPLE = oFF.CmeActionType.create("Simple", oFF.CmeActionType.ABSTRACT);
	oFF.CmeActionType.TRIGGER = oFF.CmeActionType.create("Trigger", oFF.CmeActionType.SIMPLE);
	oFF.CmeActionType.TOGGLE = oFF.CmeActionType.create("Toggle", oFF.CmeActionType.SIMPLE);
	oFF.CmeActionType.OPTION = oFF.CmeActionType.create("Option", oFF.CmeActionType.SIMPLE);
	oFF.CmeActionType.SELECT = oFF.CmeActionType.create("Select", oFF.CmeActionType.ABSTRACT);
	oFF.CmeActionType.MULTI_SELECT = oFF.CmeActionType.create("MultiSelect", oFF.CmeActionType.SELECT);
	oFF.CmeActionType.SINGLE_SELECT = oFF.CmeActionType.create("SingleSelect", oFF.CmeActionType.SELECT);
};

oFF.ContextMenuEngineModule = function() {};
oFF.ContextMenuEngineModule.prototype = new oFF.DfModule();
oFF.ContextMenuEngineModule.prototype._ff_c = "ContextMenuEngineModule";

oFF.ContextMenuEngineModule.s_module = null;
oFF.ContextMenuEngineModule.getInstance = function()
{
	if (oFF.isNull(oFF.ContextMenuEngineModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoModule.getInstance());
		oFF.ContextMenuEngineModule.s_module = oFF.DfModule.startExt(new oFF.ContextMenuEngineModule());
		oFF.CmeActionType.staticSetup();
		oFF.CmeCardinalityType.staticSetup();
		oFF.DfModule.stopExt(oFF.ContextMenuEngineModule.s_module);
	}
	return oFF.ContextMenuEngineModule.s_module;
};
oFF.ContextMenuEngineModule.prototype.getName = function()
{
	return "ff3400.contextmenu.engine";
};

oFF.ContextMenuEngineModule.getInstance();

return oFF;
} );