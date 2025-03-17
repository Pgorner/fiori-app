/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff3400.contextmenu.engine","sap/sac/df/firefly/ff2220.ui.tools"
],
function(oFF)
{
"use strict";

oFF.CmeUiGenericFactoryCustomToolbarFiller = function() {};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarFiller";

oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_ALWAYS_VALUE = 4;
oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_DISAPPEAR_VALUE = 3;
oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_HIGH_VALUE = 2;
oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_LOW_VALUE = 1;
oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_NEVER_VALUE = 0;
oFF.CmeUiGenericFactoryCustomToolbarFiller.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarFiller();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.clearGroup = function(container)
{
	let items = container.getToolbarSection().getGroups();
	container.getToolbarSection().clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let name = groupItem.getName();
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	let group = this.getRelevantGroup(topLevelItem, isSectionStart);
	let menuItem = group.addMenu(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), hasDefaultAction);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, groupItem.isEnabled(), highlight(menuItem), groupItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.setIcon(icon);
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	menuItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, groupItem.getExplanation()));
	menuItem.setEnabled(groupItem.isEnabled() && (!hasDefaultAction || oFF.notNull(currentDefaultAction)));
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation) {};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let group = this.getRelevantGroup(topLevelItem, isSectionStart);
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let active = leafItem.getActiveExtended();
	let menuItem = group.addToggleButton(leafItem.getName(), oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, leafItem.getName(), leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	});
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let group = this.getRelevantGroup(topLevelItem, isSectionStart);
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = group.addButton(leafItem.getName(), oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, leafItem.getName(), leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
	});
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.getItemCount = function(menuItem)
{
	return menuItem.getToolbarSection().getGroupCount();
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.getRelevantGroup = function(topLevelItem, isSectionStart)
{
	let group;
	if (isSectionStart || !this.hasItemElements(topLevelItem))
	{
		group = topLevelItem.getToolbarSection().addNewGroup();
	}
	else
	{
		let groups = topLevelItem.getToolbarSection().getGroups();
		group = groups.get(groups.size() - 1);
	}
	return group;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getToolbarSection().getGroups());
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	uiItem.setEnabled(enabled && (!hasDefaultAction || oFF.notNull(defaultAction)));
	if (oFF.notNull(defaultAction) && enabled)
	{
		uiItem.setPressConsumer((ev) => {
			defaultAction();
		});
	}
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	let toggleItem = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	toggleItem.setPressConsumer((ev) => {
		command();
	});
	toggleItem.setPressed(active === oFF.TriStateBool._TRUE);
};
oFF.CmeUiGenericFactoryCustomToolbarFiller.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	let button = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	button.setPressConsumer((ev) => {
		command();
	});
};

oFF.CmeUiGenericFactoryCustomToolbarFixed = function() {};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarFixed";

oFF.CmeUiGenericFactoryCustomToolbarFixed.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarFixed();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.assignHoveringActions = function(menuItem, highlight, unhighlight)
{
	if (oFF.notNull(highlight))
	{
		menuItem.registerOnHover(oFF.UiLambdaHoverListener.create((ev) => {
			highlight();
		}));
	}
	if (oFF.notNull(unhighlight))
	{
		menuItem.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((ev) => {
			unhighlight();
		}));
	}
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.clearGroup = function(container)
{
	container.getFixedToolbarSection().clearItems();
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let genesis = topLevelItem.getFixedToolbarSection().getGenesis();
	if (isSectionStart && this.hasItemElements(topLevelItem))
	{
		topLevelItem.getFixedToolbarSection().addControl(genesis.newControl(oFF.UiType.SEPARATOR));
	}
	let menuToPopulate = genesis.newControl(oFF.UiType.MENU);
	let name = groupItem.getName();
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	let menuItem = topLevelItem.getFixedToolbarSection().addNewButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, groupItem.getExplanation()), icon);
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		menuToPopulate.openAt(controlEvent.getControl());
	}));
	this.assignHoveringActions(menuItem, highlight(menuToPopulate), groupItem.getUnHighlightProcedure());
	menuToPopulate.setCustomObject(menuItem);
	menuItem.setName(name);
	menuItem.setEnabled(groupItem.isEnabled());
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuToPopulate;
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation) {};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let genesis = topLevelItem.getFixedToolbarSection().getGenesis();
	if (isSectionStart && this.hasItemElements(topLevelItem))
	{
		topLevelItem.getFixedToolbarSection().addControl(genesis.newControl(oFF.UiType.SEPARATOR));
	}
	let name = leafItem.getName();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let active = leafItem.getActiveExtended();
	let menuItem = topLevelItem.getFixedToolbarSection().addNewToggleButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	this.assignHoveringActions(menuItem, leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((ev) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	}));
	menuItem.setName(name);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.setEnabled(leafItem.isEnabled());
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let icon = leafItem.getIcon();
	let name = leafItem.getName();
	let dataHelpId = leafItem.getDataHelpId();
	let genesis = topLevelItem.getFixedToolbarSection().getGenesis();
	if (isSectionStart && this.hasItemElements(topLevelItem))
	{
		topLevelItem.getFixedToolbarSection().addControl(genesis.newControl(oFF.UiType.SEPARATOR));
	}
	let menuItem = topLevelItem.getFixedToolbarSection().addNewButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	this.assignHoveringActions(menuItem, leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((ev) => {
		leafItem.execute();
	}));
	menuItem.setName(name);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.setEnabled(leafItem.isEnabled());
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.getItemCount = function(menuItem)
{
	return menuItem.getFixedToolbarSection().getView().getItems().size();
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getFixedToolbarSection().getView().getItems());
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	let itemToSynchronize = uiItem.getCustomObject();
	if (oFF.notNull(itemToSynchronize))
	{
		this.assignHoveringActions(itemToSynchronize, highlightProcedure, unHighlightProcedure);
		itemToSynchronize.setEnabled(enabled);
		itemToSynchronize.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
		itemToSynchronize.setIcon(icon);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
		{
			itemToSynchronize.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
		}
	}
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	let toggleItem = uiItem;
	toggleItem.setEnabled(enabled);
	this.assignHoveringActions(uiItem, highlightProcedure, unHighlightProcedure);
	toggleItem.registerOnPress(oFF.UiLambdaPressListener.create((ev) => {
		command();
	}));
	toggleItem.setPressed(active === oFF.TriStateBool._TRUE);
	toggleItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	toggleItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		toggleItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	toggleItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
};
oFF.CmeUiGenericFactoryCustomToolbarFixed.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	uiItem.setEnabled(enabled);
	this.assignHoveringActions(uiItem, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((ev) => {
		command();
	}));
	uiItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
};

oFF.CmeUiGenericFactoryCustomToolbarItem = function() {};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarItem";

oFF.CmeUiGenericFactoryCustomToolbarItem.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarItem();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.clearGroup = function(container)
{
	let items = container.getItems();
	container.clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	let name = groupItem.getName();
	let menuItem = topLevelItem.addButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, groupItem.getExplanation()), icon);
	let menuToPopulate = menuItem.getView().getUiManager().getGenesis().newControl(oFF.UiType.MENU);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, groupItem.isEnabled(), highlight(menuToPopulate), groupItem.getUnHighlightProcedure(), overflowPriority);
	menuToPopulate.setCustomObject(menuItem);
	menuItem.setPressConsumer(this.createPressConsumer(menuToPopulate));
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	return menuToPopulate;
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.createPressConsumer = function(menuToPopulate)
{
	return (controlEvent) => {
		menuToPopulate.openAt(controlEvent.getControl());
	};
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation) {};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let active = leafItem.getActiveExtended();
	let menuItem = topLevelItem.addToggleButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	});
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
	});
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.getItemCount = function(menuItem)
{
	return !oFF.XCollectionUtils.hasElements(menuItem.getItems()) ? 0 : menuItem.getItems().size();
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getItems());
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	let menuToSynchronize = uiItem.getCustomObject();
	if (oFF.notNull(menuToSynchronize))
	{
		oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonPropertiesBase(menuToSynchronize, enabled, highlightProcedure, unHighlightProcedure);
		menuToSynchronize.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
		menuToSynchronize.setIcon(icon);
		menuToSynchronize.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	let toggleItem = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonPropertiesBase(toggleItem, enabled, highlightProcedure, unHighlightProcedure);
	toggleItem.setPressConsumer((ev) => {
		command();
	});
	toggleItem.setPressed(active === oFF.TriStateBool._TRUE);
	toggleItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	toggleItem.setIcon(icon);
	toggleItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	toggleItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
};
oFF.CmeUiGenericFactoryCustomToolbarItem.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	let button = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	button.setPressConsumer((ev) => {
		command();
	});
	button.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	button.setIcon(icon);
	button.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	button.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
};

oFF.CmeUiGenericFactoryCustomToolbarMenuSub = function() {};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarMenuSub";

oFF.CmeUiGenericFactoryCustomToolbarMenuSub.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarMenuSub();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.clearGroup = function(container)
{
	container.clearItems();
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(groupItem.getName(), text, icon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(groupItem.getExplanation());
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(menuItem, groupItem.isEnabled(), highlight(menuItem), groupItem.getUnHighlightProcedure());
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation)
{
	let menuItem = container.addMenuItem(name, text, oFF.XStringUtils.isNullOrEmpty(icon) ? oFF.CmeUiGenericMenuMapper.DEFAULT_TITLE_MENU_ICON : icon);
	menuItem.setTooltip(explanation);
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.TITLE_MENU_CSS_CLASS);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let stateIcon = leafItem.getStateIcon();
	let active = leafItem.getActiveExtended();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(name, text, stateIcon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(leafItem.getExplanation());
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	});
	if (oFF.XStringUtils.isNullOrEmpty(stateIcon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(leafItem.getName(), text, icon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(leafItem.getExplanation());
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
	});
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.getItemCount = function(menuItem)
{
	return 0;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.hasItemElements = function(topLevelItem)
{
	return false;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	uiItem.setText(text);
	uiItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
	uiItem.setIcon(icon);
	uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.setPressConsumer((ev) => {
		command();
	});
	uiItem.setText(text);
	uiItem.setIcon(stateIcon);
	uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSub.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.setPressConsumer((ev) => {
		command();
	});
	uiItem.setText(text);
	uiItem.setIcon(icon);
	uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};

oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub = function() {};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarMenuSubSub";

oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.clearGroup = function(container)
{
	container.clearItems();
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(groupItem.getName(), text, icon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(groupItem.getExplanation());
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, groupItem.isEnabled(), highlight(menuItem), groupItem.getUnHighlightProcedure());
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation)
{
	let menuItem = container.addMenuItem(name, text, oFF.XStringUtils.isNullOrEmpty(icon) ? oFF.CmeUiGenericMenuMapper.DEFAULT_TITLE_MENU_ICON : icon);
	menuItem.setSectionStart(sectionStart);
	menuItem.setText(text);
	menuItem.setTooltip(explanation);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.TITLE_MENU_CSS_CLASS);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let stateIcon = leafItem.getStateIcon();
	let active = leafItem.getActiveExtended();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(name, text, stateIcon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(leafItem.getExplanation());
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	}));
	if (oFF.XStringUtils.isNullOrEmpty(stateIcon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addMenuItem(leafItem.getName(), text, icon);
	menuItem.setSectionStart(isSectionStart);
	menuItem.setTooltip(leafItem.getExplanation());
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
	}));
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.getItemCount = function(menuItem)
{
	return 0;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.hasItemElements = function(topLevelItem)
{
	return false;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	uiItem.setText(text);
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setIcon(icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(stateIcon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};

oFF.CmeUiGenericFactoryCustomToolbarMenuTop = function() {};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype._ff_c = "CmeUiGenericFactoryCustomToolbarMenuTop";

oFF.CmeUiGenericFactoryCustomToolbarMenuTop.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryCustomToolbarMenuTop();
	return instance;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.clearGroup = function(container)
{
	let items = container.getItems();
	container.clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let enabled = groupItem.isEnabled();
	let name = groupItem.getName();
	let menuItem = topLevelItem.addMenu(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(groupItem.getIcon(), text), hasDefaultAction);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, enabled, highlight(menuItem), groupItem.getUnHighlightProcedure(), overflowPriority);
	let dataHelpId = groupItem.getDataHelpId();
	menuItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, groupItem.getExplanation()));
	menuItem.setEnabled(enabled && (!hasDefaultAction || oFF.notNull(currentDefaultAction)));
	if (oFF.notNull(currentDefaultAction) && enabled)
	{
		menuItem.setPressConsumer((pressed) => {
			currentDefaultAction();
		});
	}
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation) {};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let active = leafItem.getActiveExtended();
	let menuItem = topLevelItem.addToggleButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	});
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let name = leafItem.getName();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addButton(name, oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text), oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()), icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonProperties(menuItem, name, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure(), overflowPriority);
	menuItem.setPressConsumer((ev) => {
		leafItem.execute();
	});
	menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	return menuItem;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.getItemCount = function(menuItem)
{
	return !oFF.XCollectionUtils.hasElements(menuItem.getItems()) ? 0 : menuItem.getItems().size();
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getItems());
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	uiItem.setEnabled(enabled && (!hasDefaultAction || oFF.notNull(defaultAction)));
	if (oFF.notNull(defaultAction) && enabled)
	{
		uiItem.setPressConsumer((ev) => {
			defaultAction();
		});
	}
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	let menuItem = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	menuItem.setPressConsumer((ev) => {
		command();
	});
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
};
oFF.CmeUiGenericFactoryCustomToolbarMenuTop.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	let button = uiItem;
	oFF.CmeUiGenericFactoryToolbarMapping.synchronizeProperties(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure);
	button.setPressConsumer((ev) => {
		command();
	});
};

oFF.CmeUiGenericFactoryStandardMenuSub = function() {};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryStandardMenuSub.prototype._ff_c = "CmeUiGenericFactoryStandardMenuSub";

oFF.CmeUiGenericFactoryStandardMenuSub.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryStandardMenuSub();
	return instance;
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.clearGroup = function(container)
{
	let items = container.getItems();
	container.clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let menuItem = topLevelItem.addNewItem();
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(groupItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(groupItem.getExplanation());
	menuItem.setIcon(icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, groupItem.isEnabled(), highlight(menuItem), groupItem.getUnHighlightProcedure());
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation)
{
	let menuItem = container.addNewItem();
	menuItem.setSectionStart(sectionStart);
	menuItem.setName(name);
	menuItem.setText(text);
	menuItem.setTooltip(explanation);
	menuItem.setIcon(oFF.XStringUtils.isNullOrEmpty(icon) ? oFF.CmeUiGenericMenuMapper.DEFAULT_TITLE_MENU_ICON : icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.TITLE_MENU_CSS_CLASS);
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let menuItem = topLevelItem.addNewItem();
	let stateIcon = leafItem.getStateIcon();
	let active = leafItem.getActiveExtended();
	let dataHelpId = leafItem.getDataHelpId();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(leafItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(leafItem.getExplanation());
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	}));
	menuItem.setIcon(stateIcon);
	if (oFF.XStringUtils.isNullOrEmpty(stateIcon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let menuItem = topLevelItem.addNewItem();
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(leafItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(leafItem.getExplanation());
	menuItem.setIcon(icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
	}));
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.getItemCount = function(menuItem)
{
	return menuItem.getNumberOfItems();
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getItems());
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	uiItem.setText(text);
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(stateIcon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};
oFF.CmeUiGenericFactoryStandardMenuSub.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};

oFF.CmeUiGenericFactoryStandardMenuTop = function() {};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryStandardMenuTop.prototype._ff_c = "CmeUiGenericFactoryStandardMenuTop";

oFF.CmeUiGenericFactoryStandardMenuTop.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryStandardMenuTop();
	return instance;
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.clearGroup = function(container)
{
	let items = container.getItems();
	container.clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	let menuItem = topLevelItem.addNewItem();
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(groupItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(groupItem.getExplanation());
	menuItem.setIcon(icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, groupItem.isEnabled(), highlight(menuItem), groupItem.getUnHighlightProcedure());
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation)
{
	let menuItem = container.addNewItem();
	menuItem.setSectionStart(sectionStart);
	menuItem.setName(name);
	menuItem.setText(text);
	menuItem.setTooltip(explanation);
	menuItem.setIcon(oFF.XStringUtils.isNullOrEmpty(icon) ? oFF.CmeUiGenericMenuMapper.DEFAULT_TITLE_MENU_ICON : icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.TITLE_MENU_CSS_CLASS);
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let menuItem = topLevelItem.addNewItem();
	let dataHelpId = leafItem.getDataHelpId();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(leafItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(leafItem.getExplanation());
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(leafItem.getActiveExtended());
	}));
	let stateIcon = leafItem.getStateIcon();
	menuItem.setIcon(stateIcon);
	if (oFF.XStringUtils.isNullOrEmpty(stateIcon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addNewItem();
	menuItem.setSectionStart(isSectionStart);
	menuItem.setName(leafItem.getName());
	menuItem.setText(text);
	menuItem.setTooltip(leafItem.getExplanation());
	menuItem.setIcon(icon);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
	}));
	if (oFF.XStringUtils.isNullOrEmpty(icon))
	{
		menuItem.addCssClass(oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS);
	}
	let shortcutText = leafItem.getShortcutText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(shortcutText))
	{
		menuItem.setShortcutText(shortcutText);
	}
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.getItemCount = function(menuItem)
{
	return menuItem.getNumberOfItems();
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getItems());
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	uiItem.setText(text);
	uiItem.setTooltip(explanation);
	uiItem.setEnabled(enabled);
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(stateIcon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};
oFF.CmeUiGenericFactoryStandardMenuTop.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericMenuPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(text);
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(explanation);
};

oFF.CmeUiGenericFactoryStandardToolbarItem = function() {};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype = new oFF.XObject();
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype._ff_c = "CmeUiGenericFactoryStandardToolbarItem";

oFF.CmeUiGenericFactoryStandardToolbarItem.create = function()
{
	let instance = new oFF.CmeUiGenericFactoryStandardToolbarItem();
	return instance;
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.clearGroup = function(container)
{
	let items = container.getItems();
	container.clearItems();
	oFF.XCollectionUtils.releaseEntriesFromCollection(items);
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.createGroupItem = function(topLevelItem, groupItem, isSectionStart, overflowPriority, text, highlight, hasDefaultAction, currentDefaultAction)
{
	if (isSectionStart)
	{
		topLevelItem.addNewItemOfType(oFF.UiType.SEPARATOR);
	}
	let menuItem = topLevelItem.addNewItemOfType(oFF.UiType.BUTTON);
	menuItem.setName(groupItem.getName());
	let icon = groupItem.getIcon();
	let dataHelpId = groupItem.getDataHelpId();
	menuItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, groupItem.getExplanation()));
	menuItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	menuItem.setIcon(icon);
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	let menuToPopulate = menuItem.getUiManager().getGenesis().newControl(oFF.UiType.MENU);
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(menuItem, groupItem.isEnabled(), highlight(menuToPopulate), groupItem.getUnHighlightProcedure());
	menuToPopulate.setCustomObject(menuItem);
	menuItem.registerOnPress(this.createSubMenuRenderListener(menuToPopulate));
	return menuToPopulate;
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.createSubMenuRenderListener = function(menuToPopulate)
{
	return oFF.UiLambdaPressListener.create((controlEvent) => {
		menuToPopulate.openAt(controlEvent.getControl());
	});
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.createTitleItem = function(container, sectionStart, overflowPriority, name, text, icon, dataHelpId, explanation) {};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.createToggleItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	if (isSectionStart)
	{
		topLevelItem.addNewItemOfType(oFF.UiType.SEPARATOR);
	}
	let menuItem = topLevelItem.addNewItemOfType(oFF.UiType.TOGGLE_BUTTON);
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	menuItem.setName(leafItem.getName());
	menuItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()));
	menuItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	let active = leafItem.getActiveExtended();
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
		oFF.CmeUiGenericFactoryToolbarMapping.announceToggle(active);
	}));
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	menuItem.setIcon(icon);
	menuItem.setPressed(active === oFF.TriStateBool._TRUE);
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.createTriggerItem = function(topLevelItem, leafItem, isSectionStart, overflowPriority, text)
{
	if (isSectionStart)
	{
		topLevelItem.addNewItemOfType(oFF.UiType.SEPARATOR);
	}
	let icon = leafItem.getIcon();
	let dataHelpId = leafItem.getDataHelpId();
	let menuItem = topLevelItem.addNewItemOfType(oFF.UiType.BUTTON);
	menuItem.setName(leafItem.getName());
	menuItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, leafItem.getExplanation()));
	menuItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	menuItem.setIcon(icon);
	if (oFF.XStringUtils.isNullOrEmpty(dataHelpId))
	{
		menuItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(menuItem, leafItem.isEnabled(), leafItem.getHighlightProcedure(), leafItem.getUnHighlightProcedure());
	menuItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		leafItem.execute();
	}));
	return menuItem;
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.getItemCount = function(menuItem)
{
	return menuItem.getNumberOfItems();
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.hasItemElements = function(topLevelItem)
{
	return oFF.XCollectionUtils.hasElements(topLevelItem.getItems());
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.supportsSynchronization = function()
{
	return true;
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.synchronizeGroupMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, hasDefaultAction, defaultAction)
{
	let itemToSynchronize = uiItem.getCustomObject();
	if (oFF.notNull(itemToSynchronize))
	{
		oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(itemToSynchronize, enabled, highlightProcedure, unHighlightProcedure);
		itemToSynchronize.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
		itemToSynchronize.setEnabled(enabled);
		itemToSynchronize.setIcon(icon);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
		{
			itemToSynchronize.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
		}
	}
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.synchronizeToggleMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command, active, stateIcon)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	uiItem.setIcon(stateIcon);
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setPressed(active === oFF.TriStateBool._TRUE);
};
oFF.CmeUiGenericFactoryStandardToolbarItem.prototype.synchronizeTriggerMenuItem = function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unHighlightProcedure, command)
{
	oFF.CmeUiGenericFactoryToolbarMapping.applyGenericButtonPropertiesBase(uiItem, enabled, highlightProcedure, unHighlightProcedure);
	uiItem.registerOnPress(oFF.UiLambdaPressListener.create((p) => {
		command();
	}));
	uiItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
	uiItem.setIcon(icon);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dataHelpId))
	{
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
	}
	uiItem.setEnabled(enabled);
	uiItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
};

oFF.CmeUiGenericFactoryToolbarMapping = {

	announceToggle:function(originalToggleState)
	{
			let key = originalToggleState === oFF.TriStateBool._TRUE ? oFF.XCommonI18n.ANNOUNCMENT_ITEM_DESELECTED : oFF.XCommonI18n.ANNOUNCMENT_ITEM_SELECTED;
		let message = oFF.XLocalizationCenter.getCenter().getText(key);
		oFF.UiFramework.currentFramework().announce(message, oFF.UiAriaLiveMode.POLITE);
	},
	applyGenericButtonPropertiesBase:function(menuItem, enabled, highlight, unhighlight)
	{
			menuItem.setEnabled(enabled);
		if (oFF.notNull(highlight))
		{
			menuItem.registerOnHover(oFF.UiLambdaHoverListener.create((ev) => {
				highlight();
			}));
		}
		if (oFF.notNull(unhighlight))
		{
			menuItem.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((ev) => {
				unhighlight();
			}));
		}
	},
	applyGenericMenuPropertiesBase:function(menuItem, enabled, highlight, unhighlight)
	{
			menuItem.setEnabled(enabled);
		if (oFF.notNull(highlight))
		{
			menuItem.registerOnHover(oFF.UiLambdaHoverListener.create((ev) => {
				highlight();
			}));
		}
		if (oFF.notNull(unhighlight))
		{
			menuItem.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((ev) => {
				unhighlight();
			}));
		}
	},
	applyOverflowPriority:function(menuItem, overflowPriority)
	{
			switch (overflowPriority)
		{
			case oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_ALWAYS_VALUE:
				menuItem.setOverflowPriority(oFF.UiToolbarPriority.ALWAYS_OVERFLOW);
				break;

			case oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_DISAPPEAR_VALUE:
				menuItem.setOverflowPriority(oFF.UiToolbarPriority.DISAPPEAR);
				break;

			case oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_HIGH_VALUE:
				menuItem.setOverflowPriority(oFF.UiToolbarPriority.HIGH);
				break;

			case oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_LOW_VALUE:
				menuItem.setOverflowPriority(oFF.UiToolbarPriority.LOW);
				break;

			case oFF.CmeUiGenericFactoryCustomToolbarFiller.OVERFLOW_PRIORITY_NEVER_VALUE:
				menuItem.setOverflowPriority(oFF.UiToolbarPriority.NEVER_OVERFLOW);
				break;
		}
	},
	applyToolbarWidgetButtonProperties:function(menuItem, name, enabled, highlight, unhighlight, overflowPriority)
	{
			menuItem.setName(name);
		oFF.CmeUiGenericFactoryToolbarMapping.applyOverflowPriority(menuItem, overflowPriority);
		oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonPropertiesBase(menuItem, enabled, highlight, unhighlight);
	},
	applyToolbarWidgetButtonPropertiesBase:function(menuItem, enabled, highlight, unhighlight)
	{
			menuItem.setEnabled(enabled);
		if (oFF.notNull(highlight))
		{
			menuItem.setHoverConsumer((evi) => {
				highlight();
			});
		}
		if (oFF.notNull(unhighlight))
		{
			menuItem.setHoverEndConsumer((evo) => {
				unhighlight();
			});
		}
	},
	applyToolbarWidgetMenuPropertiesBase:function(menuItem, enabled, highlight, unhighlight)
	{
			menuItem.setEnabled(enabled);
		if (oFF.notNull(highlight))
		{
			menuItem.setHoverConsumer((evi) => {
				highlight();
			});
		}
		if (oFF.notNull(unhighlight))
		{
			menuItem.setHoverEndConsumer((evo) => {
				unhighlight();
			});
		}
	},
	getEffectiveToolbarItemText:function(icon, text)
	{
			return oFF.XStringUtils.isNullOrEmpty(icon) ? text : null;
	},
	getToolbarItemTooltipText:function(text, explanation)
	{
			if (oFF.XStringUtils.isNullOrEmpty(explanation))
		{
			return text;
		}
		else
		{
			return oFF.XStringUtils.concatenate3(text, ": ", explanation);
		}
	},
	synchronizeProperties:function(uiItem, text, icon, dataHelpId, enabled, explanation, highlightProcedure, unhighlightProcedure)
	{
			oFF.CmeUiGenericFactoryToolbarMapping.applyToolbarWidgetButtonPropertiesBase(uiItem, enabled, highlightProcedure, unhighlightProcedure);
		uiItem.setText(oFF.CmeUiGenericFactoryToolbarMapping.getEffectiveToolbarItemText(icon, text));
		uiItem.setIcon(icon);
		uiItem.addAttribute(oFF.CmeUiGenericMenuMapper.DATA_HELP_ID, dataHelpId);
		uiItem.setTooltip(oFF.CmeUiGenericFactoryToolbarMapping.getToolbarItemTooltipText(text, explanation));
	}
};

oFF.CmeUiGenericLocalizationMapper = function() {};
oFF.CmeUiGenericLocalizationMapper.prototype = new oFF.XObject();
oFF.CmeUiGenericLocalizationMapper.prototype._ff_c = "CmeUiGenericLocalizationMapper";

oFF.CmeUiGenericLocalizationMapper.create = function()
{
	return new oFF.CmeUiGenericLocalizationMapper();
};
oFF.CmeUiGenericLocalizationMapper.prototype.getMappedValue = function(key, replacements, localizator)
{
	if (!oFF.XCollectionUtils.hasElements(replacements))
	{
		return localizator.getText(key);
	}
	else if (replacements.size() === 1)
	{
		return localizator.getTextWithPlaceholder(key, replacements.get(0));
	}
	else
	{
		return localizator.getTextWithPlaceholder2(key, replacements.get(0), replacements.get(1));
	}
};
oFF.CmeUiGenericLocalizationMapper.prototype.getShortcutText = function(shortcut, localizator)
{
	let concatenatedComponents = oFF.XList.create();
	let result = null;
	if (oFF.notNull(shortcut))
	{
		if (shortcut.isCommandOrControlPressedSystemSpecific())
		{
			concatenatedComponents.add(localizator.getText(oFF.XCommonI18n.KEY_CTRL));
		}
		if (shortcut.isCtrlPressed())
		{
			concatenatedComponents.add(localizator.getText(oFF.XCommonI18n.KEY_CTRL));
		}
		if (shortcut.isAltPressed())
		{
			concatenatedComponents.add(localizator.getText(oFF.XCommonI18n.KEY_ALT));
		}
		if (shortcut.isMetaPressed())
		{
			concatenatedComponents.add(localizator.getText(oFF.XCommonI18n.KEY_META));
		}
		if (shortcut.isShiftPressed())
		{
			concatenatedComponents.add(localizator.getText(oFF.XCommonI18n.KEY_SHIFT));
		}
		concatenatedComponents.add(oFF.XString.toUpperCase(shortcut.getKey()));
		result = oFF.XCollectionUtils.join(concatenatedComponents, localizator.getText(oFF.XCommonI18n.KEY_SEPARATOR));
	}
	return result;
};

oFF.CMEContextMenuUpdateWrapper = function() {};
oFF.CMEContextMenuUpdateWrapper.prototype = new oFF.XObject();
oFF.CMEContextMenuUpdateWrapper.prototype._ff_c = "CMEContextMenuUpdateWrapper";

oFF.CMEContextMenuUpdateWrapper.createWithCoordinates = function(contextAccess, genesis, xCoordinate, yCoordinate, actionBeforeOpen, actionAfterClose)
{
	let instance = new oFF.CMEContextMenuUpdateWrapper();
	instance.m_contextAccess = contextAccess;
	instance.m_genesis = genesis;
	instance.m_xCoordinate = xCoordinate;
	instance.m_yCoordinate = yCoordinate;
	instance.m_actionBeforeOpen = actionBeforeOpen;
	instance.m_actionAfterClose = actionAfterClose;
	return instance;
};
oFF.CMEContextMenuUpdateWrapper.createWithEvent = function(contextAccess, genesis, controlEvent, actionBeforeOpen, actionAfterClose)
{
	let instance = new oFF.CMEContextMenuUpdateWrapper();
	instance.m_contextAccess = contextAccess;
	instance.m_genesis = genesis;
	if (controlEvent.getControl() !== null && controlEvent.getControl().getUiType().isTypeOf(oFF.UiType.BUTTON))
	{
		instance.m_referenceControl = controlEvent.getControl();
	}
	else
	{
		instance.m_xCoordinate = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_CLICK_X, 0);
		instance.m_yCoordinate = controlEvent.getParameters().getIntegerByKeyExt(oFF.UiEventParams.PARAM_CLICK_Y, 0);
	}
	instance.m_actionBeforeOpen = actionBeforeOpen;
	instance.m_actionAfterClose = actionAfterClose;
	return instance;
};
oFF.CMEContextMenuUpdateWrapper.createWithReferenceControl = function(contextAccess, control, actionBeforeOpen, actionAfterClose)
{
	let instance = new oFF.CMEContextMenuUpdateWrapper();
	instance.m_contextAccess = contextAccess;
	instance.m_referenceControl = control;
	instance.m_genesis = control.getUiManager().getGenesis();
	instance.m_actionBeforeOpen = actionBeforeOpen;
	instance.m_actionAfterClose = actionAfterClose;
	return instance;
};
oFF.CMEContextMenuUpdateWrapper.prototype.m_actionAfterClose = null;
oFF.CMEContextMenuUpdateWrapper.prototype.m_actionBeforeOpen = null;
oFF.CMEContextMenuUpdateWrapper.prototype.m_contextAccess = null;
oFF.CMEContextMenuUpdateWrapper.prototype.m_genesis = null;
oFF.CMEContextMenuUpdateWrapper.prototype.m_referenceControl = null;
oFF.CMEContextMenuUpdateWrapper.prototype.m_xCoordinate = 0;
oFF.CMEContextMenuUpdateWrapper.prototype.m_yCoordinate = 0;
oFF.CMEContextMenuUpdateWrapper.prototype.getActionAfterClose = function()
{
	return this.m_actionAfterClose;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getActionBeforeOpen = function()
{
	return this.m_actionBeforeOpen;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getContextAccess = function()
{
	return this.m_contextAccess;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getReferenceControl = function()
{
	return this.m_referenceControl;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getXCoordinate = function()
{
	return this.m_xCoordinate;
};
oFF.CMEContextMenuUpdateWrapper.prototype.getYCoordinate = function()
{
	return this.m_yCoordinate;
};
oFF.CMEContextMenuUpdateWrapper.prototype.releaseObject = function()
{
	this.m_referenceControl = null;
	this.m_genesis = null;
	this.m_xCoordinate = 0;
	this.m_yCoordinate = 0;
	this.m_contextAccess = null;
	this.m_actionBeforeOpen = null;
	this.m_actionAfterClose = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.CMEToolbarUpdateWrapper = function() {};
oFF.CMEToolbarUpdateWrapper.prototype = new oFF.XObject();
oFF.CMEToolbarUpdateWrapper.prototype._ff_c = "CMEToolbarUpdateWrapper";

oFF.CMEToolbarUpdateWrapper.create = function(contextAccess, toolbarWidget)
{
	let instance = new oFF.CMEToolbarUpdateWrapper();
	instance.m_contextAccess = contextAccess;
	instance.m_toolbarWidget = toolbarWidget;
	return instance;
};
oFF.CMEToolbarUpdateWrapper.prototype.m_contextAccess = null;
oFF.CMEToolbarUpdateWrapper.prototype.m_toolbarWidget = null;
oFF.CMEToolbarUpdateWrapper.prototype.getContextAccess = function()
{
	return this.m_contextAccess;
};
oFF.CMEToolbarUpdateWrapper.prototype.getToolbarWidget = function()
{
	return this.m_toolbarWidget;
};
oFF.CMEToolbarUpdateWrapper.prototype.releaseObject = function()
{
	this.m_toolbarWidget = null;
	this.m_contextAccess = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.CmeUiGenericMenuMapper = function() {};
oFF.CmeUiGenericMenuMapper.prototype = new oFF.XObject();
oFF.CmeUiGenericMenuMapper.prototype._ff_c = "CmeUiGenericMenuMapper";

oFF.CmeUiGenericMenuMapper.CONTEXT_MENU = "contextMenu";
oFF.CmeUiGenericMenuMapper.CONTEXT_MENU_CLASS = "contextMenu";
oFF.CmeUiGenericMenuMapper.DATA_HELP_ID = "data-help-id";
oFF.CmeUiGenericMenuMapper.DEFAULT_TITLE_MENU_ICON = "slim-arrow-down";
oFF.CmeUiGenericMenuMapper.NON_ICON_CSS_CLASS = "gdsNullIcon";
oFF.CmeUiGenericMenuMapper.TITLE_MENU_CSS_CLASS = "gdsTitleMenuItem";
oFF.CmeUiGenericMenuMapper.create = function(menuTreeGenerator)
{
	let mapper = new oFF.CmeUiGenericMenuMapper();
	mapper.m_menuTreeGenerator = menuTreeGenerator;
	mapper.setup();
	return mapper;
};
oFF.CmeUiGenericMenuMapper.prototype.m_configuration = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsMenuPopulator = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarCustomMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarFixedMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarFixedPopulator = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarMenuItemMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarMenuSubMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_gdsToolbarPopulator = null;
oFF.CmeUiGenericMenuMapper.prototype.m_menuItemMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_menuMapper = null;
oFF.CmeUiGenericMenuMapper.prototype.m_menuTreeGenerator = null;
oFF.CmeUiGenericMenuMapper.prototype.m_pristine = false;
oFF.CmeUiGenericMenuMapper.prototype.m_uiCache = null;
oFF.CmeUiGenericMenuMapper.prototype.checkMenu = function(context, uiContext, treeConsumer)
{
	this.ensureMenu();
	this.m_menuTreeGenerator.generate(context, uiContext, (amt) => {
		if (oFF.notNull(amt))
		{
			this.mapTextsForChecking(amt);
			treeConsumer(amt);
		}
	});
};
oFF.CmeUiGenericMenuMapper.prototype.createContextMenu = function(genesis, context, uiContext, success)
{
	if (oFF.notNull(this.m_gdsMenuPopulator))
	{
		this.ensureMenu();
		let menuName = this.m_menuTreeGenerator.getTopMenuName(context, uiContext);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(menuName))
		{
			let menuItem = this.m_uiCache.getOrCreateCachedMenu(menuName, () => {
				let contextMenu = genesis.newControl(oFF.UiType.MENU);
				contextMenu.setName(oFF.CmeUiGenericMenuMapper.CONTEXT_MENU);
				contextMenu.addCssClass(oFF.CmeUiGenericMenuMapper.CONTEXT_MENU_CLASS);
				return contextMenu;
			});
			this.m_gdsMenuPopulator.populateMenu(menuItem, context, uiContext, oFF.XLocalizationCenter.getCenter(), null, success);
		}
	}
};
oFF.CmeUiGenericMenuMapper.prototype.ensureMenu = function()
{
	if (!this.m_pristine && oFF.notNull(this.m_configuration))
	{
		this.m_menuTreeGenerator.loadConfiguration(this.m_configuration);
	}
	this.m_pristine = true;
};
oFF.CmeUiGenericMenuMapper.prototype.getConfiguration = function()
{
	return this.m_configuration;
};
oFF.CmeUiGenericMenuMapper.prototype.getMenuTreeGenerator = function()
{
	return this.m_menuTreeGenerator;
};
oFF.CmeUiGenericMenuMapper.prototype.getUiCache = function()
{
	return this.m_uiCache;
};
oFF.CmeUiGenericMenuMapper.prototype.loadPluginMenuConfiguration = function(name, pluginConfig)
{
	let success = false;
	let menuGenerator = this.getMenuTreeGenerator();
	if (oFF.notNull(menuGenerator))
	{
		menuGenerator.loadPluginConfiguration(name, pluginConfig);
		success = true;
	}
	return success;
};
oFF.CmeUiGenericMenuMapper.prototype.mapTextsForChecking = function(menuItem)
{
	let localizableText = menuItem.getLocalizableText();
	let actionGroup = menuItem.getActionGroup();
	if (oFF.notNull(localizableText))
	{
		menuItem.setText(localizableText.getKey());
	}
	if (oFF.notNull(actionGroup))
	{
		localizableText = actionGroup.getOverflowLocalizableText();
		if (oFF.notNull(localizableText))
		{
			actionGroup.setOverflowText(localizableText.getKey());
		}
		let subList = actionGroup.getSubItems();
		for (let i = 0; i < subList.size(); i++)
		{
			let subMenuItem = subList.get(i).getMenuItem();
			if (oFF.notNull(subMenuItem))
			{
				this.mapTextsForChecking(subMenuItem);
			}
		}
	}
};
oFF.CmeUiGenericMenuMapper.prototype.markDirty = function()
{
	this.m_pristine = false;
};
oFF.CmeUiGenericMenuMapper.prototype.populateToolbar = function(menu, context, uiContext)
{
	let clearer = null;
	if (oFF.notNull(this.m_gdsToolbarPopulator))
	{
		this.ensureMenu();
		this.m_gdsToolbarPopulator.populateMenu(menu, context, uiContext, oFF.XLocalizationCenter.getCenter(), clearer, null);
	}
};
oFF.CmeUiGenericMenuMapper.prototype.populateToolbarFixedSection = function(menu, context, uiContext)
{
	let clearer = null;
	if (oFF.notNull(this.m_gdsToolbarFixedPopulator))
	{
		this.ensureMenu();
		this.m_gdsToolbarFixedPopulator.populateMenu(menu, context, uiContext, oFF.XLocalizationCenter.getCenter(), clearer, null);
	}
};
oFF.CmeUiGenericMenuMapper.prototype.registerActions = function(actionsRegistrator)
{
	this.getMenuTreeGenerator().registerActions(actionsRegistrator);
	this.m_pristine = false;
};
oFF.CmeUiGenericMenuMapper.prototype.registerShortcuts = function(contextFiller, uiElement)
{
	this.ensureMenu();
	let newKeyboardConfiguration = oFF.UiKeyboardConfiguration.create();
	let actions = this.m_menuTreeGenerator.getShortcutActions();
	let shortcutActionMap = oFF.XSimpleMap.create();
	oFF.XCollectionUtils.forEach(actions, (action) => {
		let shortCut = action.getKeyboardShortcut();
		if (oFF.notNull(shortCut))
		{
			let keyBoardState = oFF.UiKeyboardState.create(shortCut.isAltPressed(), shortCut.isCtrlPressed(), shortCut.isMetaPressed(), shortCut.isShiftPressed(), false, shortCut.getCode(), shortCut.getKey());
			shortcutActionMap.put(shortCut, action);
			if (!shortCut.isCommandOrControlPressedSystemSpecific())
			{
				newKeyboardConfiguration.addPreventDefaultState(keyBoardState);
			}
			else
			{
				newKeyboardConfiguration.addPreventDefaultState(oFF.UiKeyboardState.create(shortCut.isAltPressed(), shortCut.isCtrlPressed(), shortCut.isCommandOrControlPressedSystemSpecific(), shortCut.isShiftPressed(), false, shortCut.getCode(), shortCut.getKey()));
				newKeyboardConfiguration.addPreventDefaultState(oFF.UiKeyboardState.create(shortCut.isAltPressed(), shortCut.isCommandOrControlPressedSystemSpecific(), shortCut.isMetaPressed(), shortCut.isShiftPressed(), false, shortCut.getCode(), shortCut.getKey()));
			}
		}
	});
	uiElement.setKeyboardConfiguration(newKeyboardConfiguration);
	uiElement.registerOnKeyDown(oFF.UiLambdaKeyDownListener.create((keyDownEvent) => {
		oFF.XStream.of(shortcutActionMap.getKeysAsReadOnlyList()).find((sc) => {
			return oFF.XString.isEqual(keyDownEvent.getCode(), sc.getCode()) && keyDownEvent.isAltPressed() === sc.isAltPressed() && keyDownEvent.isShiftPressed() === sc.isShiftPressed() && ((!sc.isCommandOrControlPressedSystemSpecific() && keyDownEvent.isCtrlPressed() === sc.isCtrlPressed() && keyDownEvent.isMetaPressed() === sc.isMetaPressed()) || sc.isCommandOrControlPressedSystemSpecific() && (keyDownEvent.isCtrlPressed() || keyDownEvent.isMetaPressed()));
		}).ifPresent((foundShortcut) => {
			let context = oFF.CMEFactory.createContext();
			contextFiller.fillContext(context);
			shortcutActionMap.getByKey(foundShortcut).trigger(oFF.CMEFactory.createContextAccess(context, ""));
		});
	}));
};
oFF.CmeUiGenericMenuMapper.prototype.releaseObject = function()
{
	this.m_pristine = false;
	this.m_uiCache = oFF.XObjectExt.release(this.m_uiCache);
	this.m_menuTreeGenerator = oFF.XObjectExt.release(this.m_menuTreeGenerator);
	this.m_menuItemMapper = oFF.XObjectExt.release(this.m_menuItemMapper);
	this.m_menuMapper = oFF.XObjectExt.release(this.m_menuMapper);
	this.m_gdsMenuPopulator = oFF.XObjectExt.release(this.m_gdsMenuPopulator);
	this.m_gdsToolbarMenuItemMapper = oFF.XObjectExt.release(this.m_gdsToolbarMenuItemMapper);
	this.m_gdsToolbarMenuSubMapper = oFF.XObjectExt.release(this.m_gdsToolbarMenuSubMapper);
	this.m_gdsToolbarCustomMapper = oFF.XObjectExt.release(this.m_gdsToolbarCustomMapper);
	this.m_gdsToolbarFixedMapper = oFF.XObjectExt.release(this.m_gdsToolbarFixedMapper);
	this.m_gdsToolbarPopulator = oFF.XObjectExt.release(this.m_gdsToolbarPopulator);
	this.m_gdsToolbarFixedPopulator = oFF.XObjectExt.release(this.m_gdsToolbarFixedPopulator);
	this.m_configuration = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.CmeUiGenericMenuMapper.prototype.setConfiguration = function(configuration)
{
	this.m_configuration = configuration;
	this.m_pristine = false;
};
oFF.CmeUiGenericMenuMapper.prototype.setup = function()
{
	this.m_uiCache = oFF.CMEFactory.createUiCache();
	let localizationTextMapper = oFF.CmeUiGenericLocalizationMapper.create();
	let standardMenuSubFactory = oFF.CmeUiGenericFactoryStandardMenuSub.create();
	this.m_menuItemMapper = oFF.CMEFactory.createMenuTreePopulator(standardMenuSubFactory, this.m_uiCache);
	let standardMenuTopFactory = oFF.CmeUiGenericFactoryStandardMenuTop.create();
	this.m_menuMapper = oFF.CMEFactory.createMenuTreePopulatorWithSubMapper(standardMenuTopFactory, this.m_menuItemMapper, this.m_uiCache);
	let toolbarMenuFactory = oFF.CmeUiGenericFactoryCustomToolbarMenuSubSub.create();
	this.m_gdsToolbarMenuItemMapper = oFF.CMEFactory.createMenuTreePopulatorWithSubMapper(toolbarMenuFactory, this.m_menuItemMapper, this.m_uiCache);
	let customToolbarMenuSubFactory = oFF.CmeUiGenericFactoryCustomToolbarMenuSub.create();
	this.m_gdsToolbarMenuSubMapper = oFF.CMEFactory.createMenuTreePopulatorWithSubMapper(customToolbarMenuSubFactory, this.m_gdsToolbarMenuItemMapper, this.m_uiCache);
	let toolbarItemFactory = oFF.CmeUiGenericFactoryCustomToolbarFiller.create();
	this.m_gdsToolbarCustomMapper = oFF.CMEFactory.createMenuTreePopulatorWithSubMapper(toolbarItemFactory, this.m_gdsToolbarMenuSubMapper, this.m_uiCache);
	let toolbarFixedFactory = oFF.CmeUiGenericFactoryCustomToolbarFixed.create();
	this.m_gdsToolbarFixedMapper = oFF.CMEFactory.createMenuTreePopulatorWithSubMapper(toolbarFixedFactory, this.m_menuMapper, this.m_uiCache);
	this.m_gdsToolbarPopulator = this.m_menuTreeGenerator.createMenuFiller(this.m_gdsToolbarCustomMapper, localizationTextMapper);
	this.m_gdsToolbarFixedPopulator = this.m_menuTreeGenerator.createMenuFiller(this.m_gdsToolbarFixedMapper, localizationTextMapper);
	this.m_gdsMenuPopulator = this.m_menuTreeGenerator.createMenuFiller(this.m_menuMapper, localizationTextMapper);
};

oFF.ContextMenuEngineUiModule = function() {};
oFF.ContextMenuEngineUiModule.prototype = new oFF.DfModule();
oFF.ContextMenuEngineUiModule.prototype._ff_c = "ContextMenuEngineUiModule";

oFF.ContextMenuEngineUiModule.s_module = null;
oFF.ContextMenuEngineUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.ContextMenuEngineUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.ContextMenuEngineModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.UiToolsModule.getInstance());
		oFF.ContextMenuEngineUiModule.s_module = oFF.DfModule.startExt(new oFF.ContextMenuEngineUiModule());
		oFF.DfModule.stopExt(oFF.ContextMenuEngineUiModule.s_module);
	}
	return oFF.ContextMenuEngineUiModule.s_module;
};
oFF.ContextMenuEngineUiModule.prototype.getName = function()
{
	return "ff3450.contextmenu.engine.ui";
};

oFF.ContextMenuEngineUiModule.getInstance();

return oFF;
} );