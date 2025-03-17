/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2205.ui.framework.native"
],
function(oFF)
{
"use strict";
if (!oFF.ui) {
  oFF.ui = {};
}

// get the url params
var urlParams = undefined;
oFF.ui.isDebugEnabled = false;
// ie11 does not support URLSearchParams so make sure that it is available
if (window && 'URLSearchParams' in window) {
  urlParams = new URLSearchParams(window.location.search);
  if (urlParams) {
    oFF.ui.isDebugEnabled = (urlParams.get("ff-ui-debug") && urlParams.get("ff-ui-debug") === "true") || false;
  }
}

//--- external lib loader ---
oFF.loadExternalLibrary = function(libUrl) {};
oFF.loadExternalCssStyles = function(stylesUrl) {};
oFF.loadSacTableIfNeeded = function(location) {};
oFF.loadHighchartsIfNeeded = function() {};
oFF.loadValLibIfNeeded = function(location) {};
oFF.loadVizInstanceIfNeeded = function(location) {};

class FFUi5Preloader {
  static loadedDeps = {};
  static loadMinimalPromise = null;
  static loadPromise = null;
  static loadFullPromise = null;

  static async loadMinimal() {
    // Load only sap.core, sap.m and jquery from the UI5 library
    if (!FFUi5Preloader.loadMinimalPromise) {
      FFUi5Preloader.loadMinimalPromise = new Promise((resolve, reject) => {
        return sap.ui.require(['sap/ui/core/library', 'sap/m/library', 'sap/ui/thirdparty/jquery', //
          "sap/base/i18n/date/CalendarType",
          "sap/base/i18n/Formatting",
          "sap/base/i18n/Localization", //
          "sap/ui/core/Configuration",
          "sap/ui/core/Core",
          "sap/ui/core/Control",
          "sap/ui/core/Element",
          "sap/ui/core/format/DateFormat",
          "sap/ui/core/HTML",
          "sap/ui/core/Icon",
          "sap/ui/core/IconPool",
          "sap/ui/core/InvisibleMessage",
          "sap/ui/core/InvisibleText",
          "sap/ui/core/LayoutData",
          "sap/ui/core/ListItem",
          "sap/ui/core/SeparatorItem",
          "sap/ui/core/ResizeHandler",
          "sap/ui/core/Theming",
          "sap/ui/core/theming/Parameters",
          "sap/ui/core/dnd/DropInfo",
          "sap/ui/core/dnd/DragInfo",
          "sap/ui/VersionInfo",
          "sap/ui/model/ChangeReason",
          "sap/ui/model/json/JSONModel",
          "sap/ui/Device",
          "sap/m/Avatar",
          "sap/m/AvatarColor",
          "sap/m/AvatarShape",
          "sap/m/AvatarSize",
          "sap/m/BadgeCustomData",
          "sap/m/Breadcrumbs",
          "sap/m/Button",
          "sap/m/Carousel",
          "sap/m/CheckBox",
          "sap/m/Column",
          "sap/m/ColumnListItem",
          "sap/m/ComboBox",
          "sap/m/CustomListItem",
          "sap/m/CustomTreeItem",
          "sap/m/DatePicker",
          "sap/m/DateTimePicker",
          "sap/m/Dialog",
          "sap/m/FlexBox",
          "sap/m/FormattedText",
          "sap/m/GenericTile",
          "sap/m/GroupHeaderListItem",
          "sap/m/HBox",
          "sap/m/IconTabBar",
          "sap/m/IconTabFilter",
          "sap/m/IllustratedMessage",
          "sap/m/IllustratedMessageSize",
          "sap/m/IllustratedMessageType",
          "sap/m/Image",
          "sap/m/Input",
          "sap/m/Label",
          "sap/m/Link",
          "sap/m/List",
          "sap/m/ListBase",
          "sap/m/Menu",
          "sap/m/MenuButton",
          "sap/m/MenuItem",
          "sap/m/MessageItem",
          "sap/m/MessageStrip",
          "sap/m/MessageToast",
          "sap/m/MessageView",
          "sap/m/MultiComboBox",
          "sap/m/MultiInput",
          "sap/m/NavContainer",
          "sap/m/OverflowToolbar",
          "sap/m/OverflowToolbarButton",
          "sap/m/OverflowToolbarLayoutData",
          "sap/m/OverflowToolbarToggleButton",
          "sap/m/Page",
          "sap/m/Panel",
          "sap/m/Popover",
          "sap/m/ProgressIndicator",
          "sap/m/RadioButton",
          "sap/m/RadioButtonGroup",
          "sap/m/RangeSlider",
          "sap/m/ResponsivePopover",
          "sap/m/ScrollContainer",
          "sap/m/SearchField",
          "sap/m/SegmentedButton",
          "sap/m/SegmentedButtonItem",
          "sap/m/Select",
          "sap/m/Slider",
          "sap/m/StandardListItem",
          "sap/m/StandardTreeItem",
          "sap/m/SuggestionItem",
          "sap/m/Switch",
          "sap/m/TabContainer",
          "sap/m/TabContainerItem",
          "sap/m/Table",
          "sap/m/Text",
          "sap/m/TextArea",
          "sap/m/TileContent",
          "sap/m/TimePicker",
          "sap/m/Title",
          "sap/m/ToggleButton",
          "sap/m/Token",
          "sap/m/Tokenizer",
          "sap/m/Toolbar",
          "sap/m/ToolbarSeparator",
          "sap/m/ToolbarSpacer",
          "sap/m/Tree",
          "sap/m/TreeRenderer",
          "sap/m/VBox",
          "sap/m/plugins/ColumnResizer",
          "sap/m/ColorPalette",
          "sap/m/ColorPalettePopover"
        ], function(coreLib, mLib, sap_jQuery, //
          // sap.ui.core
          sap_base_18n_date_CalendarType,
          sap_base_i18n_Formatting,
          sap_base_18n_Localization,
          sap_ui_core_Configuration,
          sap_ui_core_Core,
          sap_ui_core_Control,
          sap_ui_core_Element,
          sap_ui_core_format_DateFormat,
          sap_ui_core_HTML,
          sap_ui_core_Icon,
          sap_ui_core_IconPool,
          sap_ui_core_InvisibleMessage,
          sap_ui_core_InvisibleText,
          sap_ui_core_LayoutData,
          sap_ui_core_ListItem,
          sap_ui_core_SeparatorItem,
          sap_ui_core_ResizeHandler,
          sap_ui_core_Theming,
          sap_ui_core_theming_Parameters,
          sap_ui_core_dnd_DropInfo,
          sap_ui_core_dnd_DragInfo,
          sap_ui_VersionInfo,
          sap_ui_model_ChangeReason,
          sap_ui_model_json_JSONModel,
          sap_ui_Device,
          //sap.m
          sap_m_Avatar,
          sap_m_AvatarColor,
          sap_m_AvatarShape,
          sap_m_AvatarSize,
          sap_m_BadgeCustomData,
          sap_m_Breadcrumbs,
          sap_m_Button,
          sap_m_Carousel,
          sap_m_CheckBox,
          sap_m_Column,
          sap_m_ColumnListItem,
          sap_m_ComboBox,
          sap_m_CustomListItem,
          sap_m_CustomTreeItem,
          sap_m_DatePicker,
          sap_m_DateTimePicker,
          sap_m_Dialog,
          sap_m_FlexBox,
          sap_m_FormattedText,
          sap_m_GenericTile,
          sap_m_GroupHeaderListItem,
          sap_m_HBox,
          sap_m_IconTabBar,
          sap_m_IconTabFilter,
          sap_m_IllustratedMessage,
          sap_m_IllustratedMessageSize,
          sap_m_IllustratedMessageType,
          sap_m_Image,
          sap_m_Input,
          sap_m_Label,
          sap_m_Link,
          sap_m_List,
          sap_m_ListBase,
          sap_m_Menu,
          sap_m_MenuButton,
          sap_m_MenuItem,
          sap_m_MessageItem,
          sap_m_MessageStrip,
          sap_m_MessageToast,
          sap_m_MessageView,
          sap_m_MultiComboBox,
          sap_m_MultiInput,
          sap_m_NavContainer,
          sap_m_OverflowToolbar,
          sap_m_OverflowToolbarButton,
          sap_m_OverflowToolbarLayoutData,
          sap_m_OverflowToolbarToggleButton,
          sap_m_Page,
          sap_m_Panel,
          sap_m_Popover,
          sap_m_ProgressIndicator,
          sap_m_RadioButton,
          sap_m_RadioButtonGroup,
          sap_m_RangeSlider,
          sap_m_ResponsivePopover,
          sap_m_ScrollContainer,
          sap_m_SearchField,
          sap_m_SegmentedButton,
          sap_m_SegmentedButtonItem,
          sap_m_Select,
          sap_m_Slider,
          sap_m_StandardListItem,
          sap_m_StandardTreeItem,
          sap_m_SuggestionItem,
          sap_m_Switch,
          sap_m_TabContainer,
          sap_m_TabContainerItem,
          sap_m_Table,
          sap_m_Text,
          sap_m_TextArea,
          sap_m_TileContent,
          sap_m_TimePicker,
          sap_m_Title,
          sap_m_ToggleButton,
          sap_m_Token,
          sap_m_Tokenizer,
          sap_m_Toolbar,
          sap_m_ToolbarSeparator,
          sap_m_ToolbarSpacer,
          sap_m_Tree,
          sap_m_TreeRenderer,
          sap_m_VBox,
          sap_m_plugins_ColumnResizer,
          sap_m_ColorPalette,
          sap_m_ColorPalettePopover
        ) {

          FFUi5Preloader.loadedDeps.sap_jQuery = sap_jQuery;
          FFUi5Preloader.loadedDeps.sap_base_Log = sap_jQuery.sap.log;
          FFUi5Preloader.loadedDeps.sap_base_18n_date_CalendarType = sap_base_18n_date_CalendarType;
          FFUi5Preloader.loadedDeps.sap_base_Formatting = sap_base_i18n_Formatting;
          FFUi5Preloader.loadedDeps.sap_base_Localization = sap_base_18n_Localization;
          //coreLib imports
          FFUi5Preloader.loadedDeps.sap_ui_core_BusyIndicatorSize = coreLib.BusyIndicatorSize;
          FFUi5Preloader.loadedDeps.sap_ui_core_IconColor = coreLib.IconColor;
          FFUi5Preloader.loadedDeps.sap_ui_core_InvisibleMessageMode = coreLib.InvisibleMessageMode;
          FFUi5Preloader.loadedDeps.sap_ui_core_MessageType = coreLib.MessageType;
          FFUi5Preloader.loadedDeps.sap_ui_core_Orientation = coreLib.Orientation;
          FFUi5Preloader.loadedDeps.sap_ui_core_Popup = coreLib.Popup;
          FFUi5Preloader.loadedDeps.sap_ui_core_SortOrder = coreLib.SortOrder;
          FFUi5Preloader.loadedDeps.sap_ui_core_TextAlign = coreLib.TextAlign;
          FFUi5Preloader.loadedDeps.sap_ui_core_TitleLevel = coreLib.TitleLevel;
          FFUi5Preloader.loadedDeps.sap_ui_core_ValueState = coreLib.ValueState;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_DropEffect = coreLib.dnd.DropEffect;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_DropLayout = coreLib.dnd.DropLayout;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_DropPosition = coreLib.dnd.DropPosition;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_Effects = coreLib.dnd.Effects;
          FFUi5Preloader.loadedDeps.sap_ui_core_Configuraton = sap_ui_core_Configuration;
          FFUi5Preloader.loadedDeps.sap_ui_core_Core = sap_ui_core_Core;
          FFUi5Preloader.loadedDeps.sap_ui_core_Control = sap_ui_core_Control;
          FFUi5Preloader.loadedDeps.sap_ui_core_Element = sap_ui_core_Element;
          FFUi5Preloader.loadedDeps.sap_ui_core_format_DateFormat = sap_ui_core_format_DateFormat;
          FFUi5Preloader.loadedDeps.sap_ui_core_HTML = sap_ui_core_HTML;
          FFUi5Preloader.loadedDeps.sap_ui_core_Icon = sap_ui_core_Icon;
          FFUi5Preloader.loadedDeps.sap_ui_core_IconPool = sap_ui_core_IconPool;
          FFUi5Preloader.loadedDeps.sap_ui_core_InvisibleMessage = sap_ui_core_InvisibleMessage;
          FFUi5Preloader.loadedDeps.sap_ui_core_InvisibleText = sap_ui_core_InvisibleText;
          FFUi5Preloader.loadedDeps.sap_ui_core_LayoutData = sap_ui_core_LayoutData;
          FFUi5Preloader.loadedDeps.sap_ui_core_ListItem = sap_ui_core_ListItem;
          FFUi5Preloader.loadedDeps.sap_ui_core_SeparatorItem = sap_ui_core_SeparatorItem;
          FFUi5Preloader.loadedDeps.sap_ui_core_ResizeHandler = sap_ui_core_ResizeHandler;
          FFUi5Preloader.loadedDeps.sap_ui_core_Theming = sap_ui_core_Theming;
          FFUi5Preloader.loadedDeps.sap_ui_core_theming_Parameters = sap_ui_core_theming_Parameters;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_DropInfo = sap_ui_core_dnd_DropInfo;
          FFUi5Preloader.loadedDeps.sap_ui_core_dnd_DragInfo = sap_ui_core_dnd_DragInfo;
          FFUi5Preloader.loadedDeps.sap_ui_core_Priority = coreLib.Priority;
          FFUi5Preloader.loadedDeps.sap_ui_VersionInfo = sap_ui_VersionInfo;
          FFUi5Preloader.loadedDeps.sap_ui_model_ChangeReason = sap_ui_model_ChangeReason;
          FFUi5Preloader.loadedDeps.sap_ui_model_json_JSONModel = sap_ui_model_json_JSONModel;
          FFUi5Preloader.loadedDeps.sap_ui_Device = sap_ui_Device;
          //sap.m
          FFUi5Preloader.loadedDeps.sap_m_BackgroundDesign = mLib.BackgroundDesign;
          FFUi5Preloader.loadedDeps.sap_m_BreadcrumbsSeparatorStyle = mLib.BreadcrumbsSeparatorStyle;
          FFUi5Preloader.loadedDeps.sap_m_BusyIndicator = mLib.BusyIndicator;
          FFUi5Preloader.loadedDeps.sap_m_ButtonType = mLib.ButtonType;
          FFUi5Preloader.loadedDeps.sap_m_UiCarouselArrowsPlacement = mLib.CarouselArrowsPlacement;
          FFUi5Preloader.loadedDeps.sap_m_FlexAlignContent = mLib.FlexAlignContent;
          FFUi5Preloader.loadedDeps.sap_m_FlexAlignItems = mLib.FlexAlignItems;
          FFUi5Preloader.loadedDeps.sap_m_FlexDirection = mLib.FlexDirection;
          FFUi5Preloader.loadedDeps.sap_m_FlexJustifyContent = mLib.FlexJustifyContent;
          FFUi5Preloader.loadedDeps.sap_m_FlexRendertype = mLib.FlexRendertype;
          FFUi5Preloader.loadedDeps.sap_m_FlexWrap = mLib.FlexWrap;
          FFUi5Preloader.loadedDeps.sap_m_FrameType = mLib.FrameType;
          FFUi5Preloader.loadedDeps.sap_m_GenericTileMode = mLib.GenericTileMode;
          FFUi5Preloader.loadedDeps.sap_m_getScrollDelegate = mLib.getScrollDelegate;
          FFUi5Preloader.loadedDeps.sap_m_IconTabDensityMode = mLib.IconTabDensityMode;
          FFUi5Preloader.loadedDeps.sap_m_IconTabHeaderMode = mLib.IconTabHeaderMode;
          FFUi5Preloader.loadedDeps.sap_m_ImageMode = mLib.ImageMode;
          FFUi5Preloader.loadedDeps.sap_m_InputType = mLib.InputType;
          FFUi5Preloader.loadedDeps.sap_m_LabelDesign = mLib.LabelDesign;
          FFUi5Preloader.loadedDeps.sap_m_ListGrowingDirection = mLib.ListGrowingDirection;
          FFUi5Preloader.loadedDeps.sap_m_ListMode = mLib.ListMode;
          FFUi5Preloader.loadedDeps.sap_m_ListSeparators = mLib.ListSeparators;
          FFUi5Preloader.loadedDeps.sap_m_ListType = mLib.ListType;
          FFUi5Preloader.loadedDeps.sap_m_LoadState = mLib.LoadState;
          FFUi5Preloader.loadedDeps.sap_m_MenuButtonMode = mLib.MenuButtonMode;
          FFUi5Preloader.loadedDeps.sap_m_MultiSelectMode = mLib.MultiSelectMode;
          FFUi5Preloader.loadedDeps.sap_m_PlacementType = mLib.PlacementType;
          FFUi5Preloader.loadedDeps.sap_m_PopinLayout = mLib.PopinLayout;
          FFUi5Preloader.loadedDeps.sap_m_ScreenSize = mLib.ScreenSize;
          FFUi5Preloader.loadedDeps.sap_m_Sticky = mLib.Sticky;
          FFUi5Preloader.loadedDeps.sap_m_ToolbarDesign = mLib.ToolbarDesign;
          FFUi5Preloader.loadedDeps.sap_m_Avatar = sap_m_Avatar;
          FFUi5Preloader.loadedDeps.sap_m_AvatarColor = sap_m_AvatarColor;
          FFUi5Preloader.loadedDeps.sap_m_AvatarShape = sap_m_AvatarShape;
          FFUi5Preloader.loadedDeps.sap_m_AvatarSize = sap_m_AvatarSize;
          FFUi5Preloader.loadedDeps.sap_m_BadgeCustomData = sap_m_BadgeCustomData;
          FFUi5Preloader.loadedDeps.sap_m_Breadcrumbs = sap_m_Breadcrumbs;
          FFUi5Preloader.loadedDeps.sap_m_Button = sap_m_Button;
          FFUi5Preloader.loadedDeps.sap_m_Carousel = sap_m_Carousel;
          FFUi5Preloader.loadedDeps.sap_m_CheckBox = sap_m_CheckBox;
          FFUi5Preloader.loadedDeps.sap_m_Column = sap_m_Column;
          FFUi5Preloader.loadedDeps.sap_m_ColumnListItem = sap_m_ColumnListItem;
          FFUi5Preloader.loadedDeps.sap_m_ComboBox = sap_m_ComboBox;
          FFUi5Preloader.loadedDeps.sap_m_CustomListItem = sap_m_CustomListItem;
          FFUi5Preloader.loadedDeps.sap_m_CustomTreeItem = sap_m_CustomTreeItem;
          FFUi5Preloader.loadedDeps.sap_m_DatePicker = sap_m_DatePicker;
          FFUi5Preloader.loadedDeps.sap_m_DateTimePicker = sap_m_DateTimePicker;
          FFUi5Preloader.loadedDeps.sap_m_Dialog = sap_m_Dialog;
          FFUi5Preloader.loadedDeps.sap_m_FlexBox = sap_m_FlexBox;
          FFUi5Preloader.loadedDeps.sap_m_FormattedText = sap_m_FormattedText;
          FFUi5Preloader.loadedDeps.sap_m_GenericTile = sap_m_GenericTile;
          FFUi5Preloader.loadedDeps.sap_m_GroupHeaderListItem = sap_m_GroupHeaderListItem;
          FFUi5Preloader.loadedDeps.sap_m_HBox = sap_m_HBox;
          FFUi5Preloader.loadedDeps.sap_m_IconTabBar = sap_m_IconTabBar;
          FFUi5Preloader.loadedDeps.sap_m_IconTabFilter = sap_m_IconTabFilter;
          FFUi5Preloader.loadedDeps.sap_m_IllustratedMessage = sap_m_IllustratedMessage;
          FFUi5Preloader.loadedDeps.sap_m_IllustratedMessageSize = sap_m_IllustratedMessageSize;
          FFUi5Preloader.loadedDeps.sap_m_IllustratedMessageType = sap_m_IllustratedMessageType;
          FFUi5Preloader.loadedDeps.sap_m_Image = sap_m_Image;
          FFUi5Preloader.loadedDeps.sap_m_Input = sap_m_Input;
          FFUi5Preloader.loadedDeps.sap_m_Label = sap_m_Label;
          FFUi5Preloader.loadedDeps.sap_m_Link = sap_m_Link;
          FFUi5Preloader.loadedDeps.sap_m_List = sap_m_List;
          FFUi5Preloader.loadedDeps.sap_m_ListBase = sap_m_ListBase;
          FFUi5Preloader.loadedDeps.sap_m_Menu = sap_m_Menu;
          FFUi5Preloader.loadedDeps.sap_m_MenuButton = sap_m_MenuButton;
          FFUi5Preloader.loadedDeps.sap_m_MenuItem = sap_m_MenuItem;
          FFUi5Preloader.loadedDeps.sap_m_MessageItem = sap_m_MessageItem;
          FFUi5Preloader.loadedDeps.sap_m_MessageStrip = sap_m_MessageStrip;
          FFUi5Preloader.loadedDeps.sap_m_MessageToast = sap_m_MessageToast;
          FFUi5Preloader.loadedDeps.sap_m_MessageView = sap_m_MessageView;
          FFUi5Preloader.loadedDeps.sap_m_MultiComboBox = sap_m_MultiComboBox;
          FFUi5Preloader.loadedDeps.sap_m_MultiInput = sap_m_MultiInput;
          FFUi5Preloader.loadedDeps.sap_m_NavContainer = sap_m_NavContainer;
          FFUi5Preloader.loadedDeps.sap_m_OverflowToolbar = sap_m_OverflowToolbar;
          FFUi5Preloader.loadedDeps.sap_m_OverflowToolbarButton = sap_m_OverflowToolbarButton;
          FFUi5Preloader.loadedDeps.sap_m_OverflowToolbarLayoutData = sap_m_OverflowToolbarLayoutData;
          FFUi5Preloader.loadedDeps.sap_m_OverflowToolbarToggleButton = sap_m_OverflowToolbarToggleButton;
          FFUi5Preloader.loadedDeps.sap_m_Page = sap_m_Page;
          FFUi5Preloader.loadedDeps.sap_m_Panel = sap_m_Panel;
          FFUi5Preloader.loadedDeps.sap_m_Popover = sap_m_Popover;
          FFUi5Preloader.loadedDeps.sap_m_ProgressIndicator = sap_m_ProgressIndicator;
          FFUi5Preloader.loadedDeps.sap_m_RadioButton = sap_m_RadioButton;
          FFUi5Preloader.loadedDeps.sap_m_RadioButtonGroup = sap_m_RadioButtonGroup;
          FFUi5Preloader.loadedDeps.sap_m_RangeSlider = sap_m_RangeSlider;
          FFUi5Preloader.loadedDeps.sap_m_ResponsivePopover = sap_m_ResponsivePopover;
          FFUi5Preloader.loadedDeps.sap_m_ScrollContainer = sap_m_ScrollContainer;
          FFUi5Preloader.loadedDeps.sap_m_SearchField = sap_m_SearchField;
          FFUi5Preloader.loadedDeps.sap_m_SegmentedButton = sap_m_SegmentedButton;
          FFUi5Preloader.loadedDeps.sap_m_SegmentedButtonItem = sap_m_SegmentedButtonItem;
          FFUi5Preloader.loadedDeps.sap_m_Select = sap_m_Select;
          FFUi5Preloader.loadedDeps.sap_m_Slider = sap_m_Slider;
          FFUi5Preloader.loadedDeps.sap_m_StandardListItem = sap_m_StandardListItem;
          FFUi5Preloader.loadedDeps.sap_m_StandardTreeItem = sap_m_StandardTreeItem;
          FFUi5Preloader.loadedDeps.sap_m_SuggestionItem = sap_m_SuggestionItem;
          FFUi5Preloader.loadedDeps.sap_m_Switch = sap_m_Switch;
          FFUi5Preloader.loadedDeps.sap_m_TabContainer = sap_m_TabContainer;
          FFUi5Preloader.loadedDeps.sap_m_TabContainerItem = sap_m_TabContainerItem;
          FFUi5Preloader.loadedDeps.sap_m_Table = sap_m_Table;
          FFUi5Preloader.loadedDeps.sap_m_Text = sap_m_Text;
          FFUi5Preloader.loadedDeps.sap_m_TextArea = sap_m_TextArea;
          FFUi5Preloader.loadedDeps.sap_m_TileContent = sap_m_TileContent;
          FFUi5Preloader.loadedDeps.sap_m_TimePicker = sap_m_TimePicker;
          FFUi5Preloader.loadedDeps.sap_m_Title = sap_m_Title;
          FFUi5Preloader.loadedDeps.sap_m_ToggleButton = sap_m_ToggleButton;
          FFUi5Preloader.loadedDeps.sap_m_Token = sap_m_Token;
          FFUi5Preloader.loadedDeps.sap_m_Tokenizer = sap_m_Tokenizer;
          FFUi5Preloader.loadedDeps.sap_m_Toolbar = sap_m_Toolbar;
          FFUi5Preloader.loadedDeps.sap_m_ToolbarSeparator = sap_m_ToolbarSeparator;
          FFUi5Preloader.loadedDeps.sap_m_ToolbarSpacer = sap_m_ToolbarSpacer;
          FFUi5Preloader.loadedDeps.sap_m_Tree = sap_m_Tree;
          FFUi5Preloader.loadedDeps.sap_m_TreeRenderer = sap_m_TreeRenderer;
          FFUi5Preloader.loadedDeps.sap_m_VBox = sap_m_VBox;
          FFUi5Preloader.loadedDeps.sap_m_plugins_ColumnResizer = sap_m_plugins_ColumnResizer;
          FFUi5Preloader.loadedDeps.sap_m_ColorPalette = sap_m_ColorPalette;
          FFUi5Preloader.loadedDeps.sap_m_ColorPalettePopover = sap_m_ColorPalettePopover;

          resolve(FFUi5Preloader.loadedDeps);
        });
      });
    }
    return FFUi5Preloader.loadMinimalPromise;
  }

  static async load() {
    await FFUi5Preloader.loadMinimal();
    // Load additional UI5 libraries, needed for proper firefly ui working in advanced scenarios
    if (!FFUi5Preloader.loadPromise) {
      FFUi5Preloader.loadPromise = new Promise((resolve, reject) => {
        return sap.ui.require(['sap/f/library', 'sap/ui/unified/library', 'sap/ui/table/library', 'sap/tnt/library', //
          "sap/ui/unified/Calendar",
          "sap/ui/unified/DateRange",
          "sap/ui/unified/ColorPicker",
          "sap/ui/layout/Splitter",
          "sap/ui/layout/cssgrid/ResponsiveColumnItemLayoutData",
          "sap/ui/layout/cssgrid/GridBasicLayout",
          "sap/f/GridContainerItemLayoutData",
          "sap/f/GridContainer",
          "sap/f/GridContainerSettings",
          "sap/f/dnd/GridDropInfo",
          "sap/f/Card",
          "sap/f/GridList",
          "sap/f/GridListItem",
          "sap/f/SidePanel",
          "sap/f/SidePanelItem",
          "sap/ui/table/Table",
          "sap/ui/table/TreeTable",
          "sap/ui/table/Column",
          "sap/ui/table/rowmodes/Auto",
          "sap/ui/table/rowmodes/Fixed",
          "sap/ui/table/rowmodes/Interactive",
          "sap/ui/codeeditor/CodeEditor",
          "sap/tnt/NavigationList",
          "sap/tnt/NavigationListItem",
          "sap/tnt/SideNavigation"
        ], function(fLib, unifiedLib, tableLib, tntLib, //
          //sap.ui.unified
          sap_ui_unified_Calendar,
          sap_ui_unified_DateRange,
          sap_ui_unified_ColorPicker,
          sap_ui_layout_Splitter,
          sap_ui_layout_cssgrid_ResponsiveColumnItemLayoutData,
          sap_ui_layout_cssgrid_GridBasicLayout,
          //sap.f
          sap_f_GridContainerItemLayoutData,
          sap_f_GridContainer,
          sap_f_GridContainerSettings,
          sap_f_dnd_GridDropInfo,
          sap_f_Card,
          sap_f_GridList,
          sap_f_GridListItem,
          sap_f_SidePanel,
          sap_f_SidePanelItem,
          //sap.ui.table
          sap_ui_table_Table,
          sap_ui_table_TreeTable,
          sap_ui_table_Column,
          sap_ui_table_rowmodes_Auto,
          sap_ui_table_rowmodes_Fixed,
          sap_ui_table_rowmodes_Interactive,
          //sap.ui.codeeditor
          sap_ui_codeeditor_CodeEditor,
          //sap.tnt
          sap_tnt_NavigationList,
          sap_tnt_NavigationListItem,
          sap_tnt_SideNavigation
        ) {
          //sap.ui.unified
          FFUi5Preloader.loadedDeps.sap_ui_unified_ColorPickerDisplayMode = unifiedLib.ColorPickerDisplayMode;
          FFUi5Preloader.loadedDeps.sap_ui_unified_ColorPickerMode = unifiedLib.ColorPickerMode;
          FFUi5Preloader.loadedDeps.sap_ui_unified_Calendar = sap_ui_unified_Calendar;
          FFUi5Preloader.loadedDeps.sap_ui_unified_DateRange = sap_ui_unified_DateRange;
          FFUi5Preloader.loadedDeps.sap_ui_unified_ColorPicker = sap_ui_unified_ColorPicker;
          FFUi5Preloader.loadedDeps.sap_ui_layout_Splitter = sap_ui_layout_Splitter;
          FFUi5Preloader.loadedDeps.sap_ui_layout_cssgrid_ResponsiveColumnItemLayoutData = sap_ui_layout_cssgrid_ResponsiveColumnItemLayoutData;
          FFUi5Preloader.loadedDeps.sap_ui_layout_cssgrid_GridBasicLayout = sap_ui_layout_cssgrid_GridBasicLayout;
          //sap.f
          FFUi5Preloader.loadedDeps.sap_f_SidePanelPosition = fLib.SidePanelPosition;
          FFUi5Preloader.loadedDeps.sap_f_GridContainerItemLayoutData = sap_f_GridContainerItemLayoutData;
          FFUi5Preloader.loadedDeps.sap_f_GridContainer = sap_f_GridContainer;
          FFUi5Preloader.loadedDeps.sap_f_GridContainerSettings = sap_f_GridContainerSettings;
          FFUi5Preloader.loadedDeps.sap_f_dnd_GridDropInfo = sap_f_dnd_GridDropInfo;
          FFUi5Preloader.loadedDeps.sap_f_cards_HeaderPosition = fLib.cards.HeaderPosition;
          FFUi5Preloader.loadedDeps.sap_f_Card = sap_f_Card;
          FFUi5Preloader.loadedDeps.sap_f_GridList = sap_f_GridList;
          FFUi5Preloader.loadedDeps.sap_f_GridListItem = sap_f_GridListItem;
          FFUi5Preloader.loadedDeps.sap_f_SidePanel = sap_f_SidePanel;
          FFUi5Preloader.loadedDeps.sap_f_SidePanelItem = sap_f_SidePanelItem;
          //sap.ui.table
          FFUi5Preloader.loadedDeps.sap_ui_table_SelectionBehavior = tableLib.SelectionBehavior;
          FFUi5Preloader.loadedDeps.sap_ui_table_SelectionMode = tableLib.SelectionMode;
          FFUi5Preloader.loadedDeps.sap_ui_table_VisibleRowCountMode = tableLib.VisibleRowCountMode;
          FFUi5Preloader.loadedDeps.sap_ui_table_Table = sap_ui_table_Table;
          FFUi5Preloader.loadedDeps.sap_ui_table_TreeTable = sap_ui_table_TreeTable;
          FFUi5Preloader.loadedDeps.sap_ui_table_Column = sap_ui_table_Column;
          FFUi5Preloader.loadedDeps.sap_ui_table_rowmodes_Auto = sap_ui_table_rowmodes_Auto;
          FFUi5Preloader.loadedDeps.sap_ui_table_rowmodes_Fixed = sap_ui_table_rowmodes_Fixed;
          FFUi5Preloader.loadedDeps.sap_ui_table_rowmodes_Interactive = sap_ui_table_rowmodes_Interactive;
          //sap.ui.codeeditor
          FFUi5Preloader.loadedDeps.sap_ui_codeeditor_CodeEditor = sap_ui_codeeditor_CodeEditor;
          //sap.tnt
          FFUi5Preloader.loadedDeps.sap_tnt_NavigationList = sap_tnt_NavigationList;
          FFUi5Preloader.loadedDeps.sap_tnt_NavigationListItem = sap_tnt_NavigationListItem;
          FFUi5Preloader.loadedDeps.sap_tnt_SideNavigation = sap_tnt_SideNavigation;

          resolve(FFUi5Preloader.loadedDeps);
        });
      });
    }
    return FFUi5Preloader.loadPromise;
  }

  static async loadFull() {
    await FFUi5Preloader.load();
    if (!FFUi5Preloader.loadFullPromise) {
      FFUi5Preloader.loadFullPromise = new Promise((resolve, reject) => {
        return sap.ui.require([
            'sap/suite/ui/commons/library',
            "sap/suite/ui/commons/networkgraph/Graph",
            "sap/suite/ui/commons/networkgraph/Line",
            "sap/suite/ui/commons/networkgraph/Node",
            "sap/ui/richtexteditor/RichTextEditor",
            "sap/ui/integration/widgets/Card",
            "sap/viz/ui5/controls/common/feeds/FeedItem",
            "sap/viz/ui5/data/FlattenedDataset",
            "sap/viz/ui5/controls/VizFrame",
            "sap/suite/ui/microchart/ColumnMicroChart",
            "sap/suite/ui/microchart/ColumnMicroChartData",
            "sap/suite/ui/microchart/ColumnMicroChartLabel"
          ],
          function(
            commonsLib,
            sap_suite_ui_commons_networkgraph_Graph,
            sap_suite_ui_commons_networkgraph_Line,
            sap_suite_ui_commons_networkgraph_Node,
            sap_ui_richtexteditor_RichTextEditor,
            sap_ui_integration_widgets_Card,
            sap_viz_ui5_controls_common_feeds_FeedItem,
            sap_viz_ui5_data_FlattenedDataset,
            sap_viz_ui5_controls_VizFrame,
            sap_suite_ui_microchart_ColumnMicroChart,
            sap_suite_ui_microchart_ColumnMicroChartData,
            sap_suite_ui_microchart_ColumnMicroChartLabel) {
            // sap.suite.ui.commons
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_ElementStatus = commonsLib.networkgraph.ElementStatus;
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_LineArrowOrientation = commonsLib.networkgraph.LineArrowOrientation;
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_NodeShape = commonsLib.networkgraph.NodeShape;
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_Graph = sap_suite_ui_commons_networkgraph_Graph;
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_Line = sap_suite_ui_commons_networkgraph_Line;
            FFUi5Preloader.loadedDeps.sap_suite_ui_commons_networkgraph_Node = sap_suite_ui_commons_networkgraph_Node;
            FFUi5Preloader.loadedDeps.sap_ui_richtexteditor_RichTextEditor = sap_ui_richtexteditor_RichTextEditor;
            FFUi5Preloader.loadedDeps.sap_ui_integration_widgets_Card = sap_ui_integration_widgets_Card;
            FFUi5Preloader.loadedDeps.sap_viz_ui5_controls_common_feeds_FeedItem = sap_viz_ui5_controls_common_feeds_FeedItem;
            FFUi5Preloader.loadedDeps.sap_viz_ui5_data_FlattenedDataset = sap_viz_ui5_data_FlattenedDataset;
            FFUi5Preloader.loadedDeps.sap_viz_ui5_controls_VizFrame = sap_viz_ui5_controls_VizFrame;
            FFUi5Preloader.loadedDeps.sap_suite_ui_microchart_ColumnMicroChart = sap_suite_ui_microchart_ColumnMicroChart;
            FFUi5Preloader.loadedDeps.sap_suite_ui_microchart_ColumnMicroChartData = sap_suite_ui_microchart_ColumnMicroChartData;
            FFUi5Preloader.loadedDeps.sap_suite_ui_microchart_ColumnMicroChartLabel = sap_suite_ui_microchart_ColumnMicroChartLabel;
            resolve(FFUi5Preloader.loadedDeps);
          });
      });
    }

    return FFUi5Preloader.loadFullPromise;
  }
}

const ui5 = FFUi5Preloader.loadedDeps;
oFF.ui.FFUi5Preloader = FFUi5Preloader;
FFUi5Preloader.load();

class UiConfig {
  static _highchartsLib;
  static _interactLib;
  static _sacTableLib;
  static _vizInstanceLib;

  //Highcharts
  static getHighchartsLib() {
    if (this._highchartsLib) {
      return this._highchartsLib;
    }

    if (globalThis && globalThis.Highcharts) {
      return globalThis.Highcharts;
    }

    return window.Highcharts;
  }

  static setHighchartsLib(lib) {
    this._highchartsLib = lib;
  }

  //Interact JS
  static getInteractLib() {
    if (this._interactLib) {
      return this._interactLib;
    }

    if (globalThis && globalThis.interact) {
      return globalThis.interact;
    }

    return window.interact;
  }

  static setInteractLib(lib) {
    this._interactLib = lib;
  }

  //SacTable
  static getSacTableLib() {
    if (this._sacTableLib) {
      return this._sacTableLib;
    }

    const tempGlobal = globalThis || window;
    const sacTableLib = tempGlobal.sapSacGrid || tempGlobal.SACGridRendering || tempGlobal.ReactTable || tempGlobal.sactable;

    return sacTableLib;
  }

  static setSacTableLib(lib) {
    this._sacTableLib = lib;
  }

  //VizInstance
  static getVizInstanceLib(){
      if (this._vizInstanceLib) {
        return this._vizInstanceLib;
      }
      const tempGlobal = globalThis || window;
      const vizInstanceLib = tempGlobal.VizInstance;
      return vizInstanceLib;
  }

  static setVizInstanceLib(lib) {
      this._vizInstanceLib = lib;
  }
}

oFF.ui.Config = UiConfig;

oFF.ui.Log = () => {
  console.log("Log");
};

// https://flatuicolors.com/palette/de
oFF.ui.Log.Colors = {
  RED: "#fc5c65",
  GREEN: "#26de81",
  BLUE: "#45aaf2",
  DARK_BLUE: "#4b6584",
  ORANGE: "#fd9644",
  GREY: "#778ca3",
  DARK_GREY: "#6a6b6b",
  YELLOW: "#fed330",
  BLACK: "#262626",
  WHITE: "#eeeeee"
};

//public stuff

oFF.ui.Log.setLogLevel = function(level) {
  if (ui5.sap_base_Log) {
    ui5.sap_base_Log.setLevel(level);
  }
};

oFF.ui.Log.logInfo = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (ui5.sap_base_Log) {
    ui5.sap_base_Log.info(logMsg);
  } else {
    console.log(logMsg);
  }
};

oFF.ui.Log.logWarning = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (ui5.sap_base_Log) {
    ui5.sap_base_Log.warning(logMsg);
  } else {
    console.warn(logMsg);
  }
};

oFF.ui.Log.logError = function(logMsg) {
   logMsg = "[FireflyUi]: " + logMsg;
  if (ui5.sap_base_Log) {
    ui5.sap_base_Log.error(logMsg);
  } else {
    console.error(logMsg);
  }
};

oFF.ui.Log.logDebug = function(logMsg, color, bgColor) {
  if (oFF.ui.isDebugEnabled === true) {
    this.printColoredConsoleText(logMsg, color, bgColor);
  }
};

oFF.ui.Log.logCritical = function(logMsg) {
  console.error("%c[FireflyUi]:%c " + logMsg, "background: #cc0000; color: #fff", "background: unset; color: unset");
};

//private stuff

oFF.ui.Log.printColoredConsoleText = function(text, color, bgColor, extraCss) {
  color = color ? color : "unset";
  bgColor = bgColor ? bgColor : "unset";
  text = "%c[FireflyUi]:%c " + text;
  let messageCss = "background: " + bgColor + "; color: " + color;
  if (extraCss) {
    messageCss = messageCss + extraCss;
  }
  console.log(text, "background: #3867d6; color: #fff", messageCss);
};

class FfUtils {
  constructor() {
    //nothing special
  }

  // ======================================

  static getCssString(ffCssObj) {
    return ffCssObj != null ? ffCssObj.getCssValue() : null;
  }

  static createFfCssLength(cssStr) {
    return oFF.UiCssLength.create(cssStr);
  }

  static convertFfListToNativeArray(ffList) {
    if (!ffList) {
      return null;
    }

    const tmpArr = [];
    const listSize = ffList.size();
    for (let i = 0; i < listSize; i++) {
      tmpArr.push(ffList.get(i));
    }

    return tmpArr;
  }

  // ======================================


}

oFF.ui.FfUtils = FfUtils;

class FfEventUtils {
  constructor() {
    //nothing special
  }

  // ======================================

  static prepareControlEvent(oContext, oEvent) {
    const newControlEvent = oFF.UiControlEvent.create(oContext);
    FfEventUtils.#prepareEventParams(newControlEvent.getProperties(), oEvent);
    return newControlEvent;
  }

  static prepareControlPointerEvent(oContext, oEvent) {
    const newControlEvent = oFF.UiControlEvent.create(oContext);
    FfEventUtils.#preparePointerEventParams(newControlEvent.getProperties(), oEvent);
    return newControlEvent;
  }

  static prepareKeyboardEvent(oContext, oEvent) {
    const newKeyboardEvent = oFF.UiKeyboardEvent.create(oContext);
    if (oEvent) {
      newKeyboardEvent.setKeyboardData(oEvent.altKey, oEvent.ctrlKey, oEvent.metaKey, oEvent.shiftKey, oEvent.originalEvent.repeat, oEvent.code, oEvent.key);
    }
    return newKeyboardEvent;
  }

  static prepareControlUpdateEvent(oContext, updateType, nativeAddedControlsArr, nativeRemovedControlsArr) {
    const newControlUpdateEvent = oFF.UiControlUpdateEvent.create(oContext);

    const ffControlUpdateType = oFF.UiControlUpdateType.lookup(updateType);
    const ffAddedControlsList = FfEventUtils.#createFfControlListFromNativeArray(nativeAddedControlsArr);
    const ffRemovedControlsList = FfEventUtils.#createFfControlListFromNativeArray(nativeRemovedControlsArr);

    newControlUpdateEvent.setControlUpdateData(ffControlUpdateType, ffAddedControlsList, ffRemovedControlsList);
    return newControlUpdateEvent;
  }

  static prepareControlChangeEvent(oContext, oldControl, newControl) {
    const newControlChangeEvent = oFF.UiControlChangeEvent.create(oContext);
    newControlChangeEvent.setControlChangeData(oldControl, newControl);
    return newControlChangeEvent;
  }

  static prepareItemEvent(oContext, affectedItem) {
    const newItemEvent = oFF.UiItemEvent.create(oContext);
    newItemEvent.setItemData(affectedItem);
    return newItemEvent;
  }

  static prepareButtonPressEvent(oContext, ffPressedButtonConstant) {
    if (!ffPressedButtonConstant) {
      console.warn("[FfEventUtils] Incomplete button press event! Missing pressed button constant!");
    }

    const newControlEvent = oFF.UiControlEvent.create(oContext);
    newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PRESSED_BUTTON_TYPE, ffPressedButtonConstant?.getName?.());
    return newControlEvent;
  }

  static prepareSelectionEvent(oContext, oEvent) {
    const newSelectionEvent = oFF.UiSelectionEvent.create(oContext);

    const nativeListItem = oEvent?.getParameters()?.listItem;
    const nativeListItems = oEvent?.getParameters()?.listItems;

    if (nativeListItem && nativeListItems && nativeListItems.length === 1) {
      //single item
      const ffSelectedItem = oFF.UiGeneric.getFfControl(nativeListItem);
      newSelectionEvent.setSingleSelectionData(ffSelectedItem);
    } else if (nativeListItems && nativeListItems.length > 1) {
      //multiple items
      FfEventUtils.#createFfControlListFromNativeArray(nativeListItems);
    }

    FfEventUtils.#prepareSelectionParams(newSelectionEvent.getProperties(), oEvent);
    return newSelectionEvent;
  }

  static prepareSingleSelectionEvent(oContext, oEvent, ffSelectedItem) {
    const newSelectionEvent = oFF.UiSelectionEvent.create(oContext);
    newSelectionEvent.setSingleSelectionData(ffSelectedItem);
    FfEventUtils.#prepareSelectionParams(newSelectionEvent.getProperties(), oEvent);
    return newSelectionEvent;
  }

  static prepareFileEvent(oContext, fileName, fileType, fileContentString, fileContentByteArray, fileSize, fileLastModified, isDirectory) {
    const newFileEvent = oFF.UiFileEvent.create(oContext);
    newFileEvent.setFileData(fileName, fileType, fileContentString, fileContentByteArray, fileSize, fileLastModified, isDirectory);
    return newFileEvent;
  }


  // ======================================

  static #prepareEventParams(ffProperties, oEvent) {
    if (oEvent && oEvent.getParameters) {
      const eventParams = oEvent.getParameters();

      //its either value or newValue they are both used in ui5
      if (eventParams.value) {
        ffProperties.putString(oFF.UiEventParams.PARAM_VALUE, eventParams.value);
      } else if (eventParams.newValue) {
        ffProperties.putString(oFF.UiEventParams.PARAM_VALUE, eventParams.newValue);
      }

      if (eventParams.previousValue) {
        ffProperties.putString(oFF.UiEventParams.PARAM_PREVIOUS_VALUE, eventParams.previousValue);
      }

      if (eventParams.hex) {
        ffProperties.putString(oFF.UiEventParams.PARAM_HEX, eventParams.hex);
      }

      if (eventParams.alpha) {
        ffProperties.putString(oFF.UiEventParams.PARAM_ALPHA, eventParams.alpha);
      }
    }
  }

  static #preparePointerEventParams(ffProperties, oEvent) {
    let pointerEvent = null;

    // find the js PointerEvent
    if (oEvent.clientX && oEvent.clientY) {
      pointerEvent = oEvent;
    } else if (oEvent.event && oEvent.event.clientX && oEvent.event.clientY) {
      pointerEvent = oEvent.event;
    } else if (oEvent.getParameters && oEvent.getParameters().event && oEvent.getParameters().event.clientX && oEvent.getParameters().event.clientY) {
      pointerEvent = oEvent.getParameters().event;
    }

    if (pointerEvent && pointerEvent.clientX && pointerEvent.clientY) {
      ffProperties.putInteger(oFF.UiEventParams.PARAM_CLICK_X, pointerEvent.clientX);
      ffProperties.putInteger(oFF.UiEventParams.PARAM_CLICK_Y, pointerEvent.clientY);
    }
  }

  static #prepareSelectionParams(ffProperties, oEvent) {
    if (oEvent && oEvent.getParameters) {
      const eventParams = oEvent.getParameters();

      if (eventParams.selected) {
        ffProperties.putBoolean(oFF.UiEventParams.PARAM_SELECT, !!eventParams.selected);
      }

      if (eventParams.selectAll) {
        ffProperties.putBoolean(oFF.UiEventParams.PARAM_SELECT_ALL, !!eventParams.selectAll);
      }

      if (eventParams.deselectAll) {
        ffProperties.putBoolean(oFF.UiEventParams.PARAM_DESELECT_ALL, !!eventParams.deselectAll);
      }
    }
  }

  static #createFfControlListFromNativeArray(nativeControlArr) {
    const ffControlsList = oFF.XList.create();
    nativeControlArr?.forEach((nativeControl) => {
      const ffControl = oFF.UiGeneric.getFfControl(nativeControl);
      if (ffControl) {
        ffControlsList.add(ffControl);
      }
    });

    return ffControlsList;
  }

}

oFF.ui.FfEventUtils = FfEventUtils;

class Ui5ObjectUtils {
  constructor() {
    //nothing special
  }

  static createNativeLayoutData(ffLayoutData) {
    let nativeLayoutData = null;
    if (ffLayoutData) {
      const ffLayoutDataType = ffLayoutData.getLayoutDataType();
      const nativeJsonSettings = ffLayoutData.getLayoutDataJson().convertToNative();
      try {
        if (ffLayoutDataType == oFF.UiLayoutDataType.OVERFLOW_TOOLBAR) {
          nativeLayoutData = new ui5.sap_m_OverflowToolbarLayoutData(nativeJsonSettings);
        } else if (ffLayoutDataType == oFF.UiLayoutDataType.RESPONSIVE_COLUMN_ITEM) {
          nativeLayoutData = new ui5.sap_ui_layout_cssgrid_ResponsiveColumnItemLayoutData(nativeJsonSettings);
        } else if (ffLayoutDataType == oFF.UiLayoutDataType.GRID_CONTAINER_ITEM) {
          nativeLayoutData = new ui5.sap_f_GridContainerItemLayoutData(nativeJsonSettings);
        } else {
          nativeLayoutData = new ui5.sap_ui_core_LayoutData(nativeJsonSettings);
        }
      } catch (error) {
        console.warn("[FF Ui5ObjectUtils] Failed to init LayoutData!");
      }
    }
    return nativeLayoutData;
  }

  static createNativeGridLayout(ffGridLayout) {
    let nativeGridLayout = null;
    if (ffGridLayout) {
      const ffGridLayoutType = ffGridLayout.getGridLayoutType();
      const nativeJsonSettings = ffGridLayout.getGridLayoutJson().convertToNative();
      try {
        if (ffGridLayoutType == oFF.UiGridLayoutType.BASIC) {
          nativeGridLayout = new ui5.sap_ui_layout_cssgrid_GridBasicLayout(nativeJsonSettings);
        }
      } catch (error) {
        console.warn("[FF Ui5ObjectUtils] Failed to init GridLayout!");
      }
    }
    return nativeGridLayout;
  }

  static createNativeGridContainerSettings(ffGridContainerSettings) {
    let nativeGridContainerSettings = null;
    if (ffGridContainerSettings) {
      try {
        const columns = ffGridContainerSettings.getColumns() > 0 ? ffGridContainerSettings.getColumns() : undefined;
        const columnSize = ffGridContainerSettings?.getColumnSize()?.getCssValue?.();
        const gap = ffGridContainerSettings?.getGap()?.getCssValue?.();
        const maxColumnSize = ffGridContainerSettings?.getMaxColumnSize()?.getCssValue?.();
        const minColumnSize = ffGridContainerSettings?.getMinColumnSize()?.getCssValue?.();
        const rowSize = ffGridContainerSettings?.getRowSize()?.getCssValue?.();

        nativeGridContainerSettings = new ui5.sap_f_GridContainerSettings({
          columns,
          columnSize,
          gap,
          maxColumnSize,
          minColumnSize,
          rowSize
        });
      } catch (error) {
        console.warn("[FF Ui5ObjectUtils] Failed to init GridContainerSettings!");
      }
    }
    return nativeGridContainerSettings;
  }

  static createNativeRowMode(ffRowMode) {
    let nativeRowMode = null;
    if (ffRowMode) {
      const ffRowModeType = ffRowMode.getRowModeType();
      const nativeRowModeJson = ffRowMode.getRowModeJson().convertToNative();
      try {
        if (ffRowModeType == oFF.UiRowModeType.AUTO) {
          nativeRowMode = new ui5.sap_ui_table_rowmodes_Auto(nativeRowModeJson);
        } else if (ffRowModeType == oFF.UiRowModeType.FIXED) {
          nativeRowMode = new ui5.sap_ui_table_rowmodes_Fixed(nativeRowModeJson);
        } else if (ffRowModeType == oFF.UiRowModeType.INTERACTIVE) {
          nativeRowMode = new ui5.sap_ui_table_rowmodes_Interactive(nativeRowModeJson);
        } else {
          throw new Error("Invalid row mode type");
        }
      } catch (error) {
        console.warn("[FF Ui5ObjectUtils] Failed to init RowMode!");
      }
    }
    return nativeRowMode;
  }

}

oFF.ui.Ui5ObjectUtils = Ui5ObjectUtils;

class Ui5ConstantUtils {
  constructor() {
    //nothing special
  }

  static parseTitleLevel(ffConstant) {
    let ui5TitleLevel = null;
    if (ffConstant === oFF.UiTitleLevel.AUTO) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.Auto;
    } else if (ffConstant === oFF.UiTitleLevel.H_1) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H1;
    } else if (ffConstant === oFF.UiTitleLevel.H_2) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H2;
    } else if (ffConstant === oFF.UiTitleLevel.H_3) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H3;
    } else if (ffConstant === oFF.UiTitleLevel.H_4) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H4;
    } else if (ffConstant === oFF.UiTitleLevel.H_5) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H5;
    } else if (ffConstant === oFF.UiTitleLevel.H_6) {
      ui5TitleLevel = ui5.sap_ui_core_TitleLevel.H6;
    }
    return ui5TitleLevel;
  }

  static parseToolbarDesign(ffConstant) {
    let ui5ToolbarDesign = null;
    if (ffConstant === oFF.UiToolbarDesign.AUTO) {
      ui5ToolbarDesign = ui5.sap_m_ToolbarDesign.Auto;
    } else if (ffConstant === oFF.UiToolbarDesign.INFO) {
      ui5ToolbarDesign = ui5.sap_m_ToolbarDesign.Info;
    } else if (ffConstant === oFF.UiToolbarDesign.SOLID) {
      ui5ToolbarDesign = ui5.sap_m_ToolbarDesign.Solid;
    } else if (ffConstant === oFF.UiToolbarDesign.TRANSPARENT) {
      ui5ToolbarDesign = ui5.sap_m_ToolbarDesign.Transparent;
    }
    return ui5ToolbarDesign;
  }

  static parseTextAlign(ffConstant) {
    let ui5TextAlign = null;
    if (ffConstant === oFF.UiTextAlign.LEFT) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Left;
    } else if (ffConstant === oFF.UiTextAlign.RIGHT) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Right;
    } else if (ffConstant === oFF.UiTextAlign.CENTER) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Center;
    } else if (ffConstant === oFF.UiTextAlign.BEGIN) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Begin;
    } else if (ffConstant === oFF.UiTextAlign.END) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.End;
    } else if (ffConstant === oFF.UiTextAlign.INITIAL) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Initial;
    }
    return ui5TextAlign;
  }

  static parseImageMode(ffConstant) {
    let ui5ImageMode = null;
    if (ffConstant === oFF.UiImageMode.BACKGROUND) {
      ui5ImageMode = ui5.sap_m_ImageMode.Background;
    } else if (ffConstant === oFF.UiImageMode.IMAGE) {
      ui5ImageMode = ui5.sap_m_ImageMode.Image;
    }
    return ui5ImageMode;
  }

  static parseAvatarSize(ffConstant) {
    let ui5AvatarSize = null;
    if (ffConstant) {
      ui5AvatarSize = ui5.sap_m_AvatarSize[ffConstant.getName()];
    }
    return ui5AvatarSize;
  }

  static parseAvatarShape(ffConstant) {
    let ui5AvatarShape = null;
    if (ffConstant) {
      ui5AvatarShape = ui5.sap_m_AvatarShape[ffConstant.getName()];
    }
    return ui5AvatarShape;
  }

  static parseAvatarColor(ffConstant) {
    let ui5AvatarColor = null;
    if (ffConstant) {
      ui5AvatarColor = ui5.sap_m_AvatarColor[ffConstant.getName()];
    }
    return ui5AvatarColor;
  }

  static parseValueState(ffConstant) {
    let ui5ValueState = null;
    if (ffConstant === oFF.UiValueState.NONE) {
      ui5ValueState = ui5.sap_ui_core_ValueState.None;
    } else if (ffConstant === oFF.UiValueState.ERROR) {
      ui5ValueState = ui5.sap_ui_core_ValueState.Error;
    } else if (ffConstant === oFF.UiValueState.INFORMATION) {
      ui5ValueState = ui5.sap_ui_core_ValueState.Information;
    } else if (ffConstant === oFF.UiValueState.SUCCESS) {
      ui5ValueState = ui5.sap_ui_core_ValueState.Success;
    } else if (ffConstant === oFF.UiValueState.WARNING) {
      ui5ValueState = ui5.sap_ui_core_ValueState.Warning;
    }
    return ui5ValueState;
  }

  static parseListSeparators(ffConstant) {
    let ui5ListSeparators = null;
    if (ffConstant === oFF.UiListSeparators.ALL) {
      ui5ListSeparators = ui5.sap_m_ListSeparators.All;
    } else if (ffConstant === oFF.UiListSeparators.INNER) {
      ui5ListSeparators = ui5.sap_m_ListSeparators.Inner;
    } else if (ffConstant === oFF.UiListSeparators.NONE) {
      ui5ListSeparators = ui5.sap_m_ListSeparators.None;
    }
    return ui5ListSeparators;
  }

  static parseSelectionMode(ffConstant) {
    let ui5SelectionMode = null;
    if (ffConstant === oFF.UiSelectionMode.NONE) {
      ui5SelectionMode = ui5.sap_m_ListMode.None;
    } else if (ffConstant === oFF.UiSelectionMode.SINGLE_SELECT) {
      ui5SelectionMode = ui5.sap_m_ListMode.SingleSelect;
    } else if (ffConstant === oFF.UiSelectionMode.SINGLE_SELECT_MASTER) {
      ui5SelectionMode = ui5.sap_m_ListMode.SingleSelectMaster;
    } else if (ffConstant === oFF.UiSelectionMode.SINGLE_SELECT_LEFT) {
      ui5SelectionMode = ui5.sap_m_ListMode.SingleSelectLeft;
    } else if (ffConstant === oFF.UiSelectionMode.MULTI_SELECT) {
      ui5SelectionMode = ui5.sap_m_ListMode.MultiSelect;
    } else if (ffConstant === oFF.UiSelectionMode.DELETE) {
      ui5SelectionMode = ui5.sap_m_ListMode.Delete;
    }
    return ui5SelectionMode;
  }

  static parseIllustratedMessageSize(ffConstant) {
    let ui5IllustratedMessageSize = null;
    if (ffConstant === oFF.UiIllustratedMessageSize.AUTO) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Auto;
    } else if (ffConstant === oFF.UiIllustratedMessageSize.BASE) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Base;
    } else if (ffConstant === oFF.UiIllustratedMessageSize.DIALOG) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Dialog;
    } else if (ffConstant === oFF.UiIllustratedMessageSize.DOT) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Dot;
    } else if (ffConstant === oFF.UiIllustratedMessageSize.SCENE) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Scene;
    } else if (ffConstant === oFF.UiIllustratedMessageSize.SPOT) {
      ui5IllustratedMessageSize = ui5.sap_m_IllustratedMessageSize.Spot;
    }
    return ui5IllustratedMessageSize;
  }

  static parseIllustratedMessageType(ffConstant) {
    let ui5IllustratedMessageType = null;
    if (ffConstant === oFF.UiIllustratedMessageType.ADD_COLUMN) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.AddColumn;
    } else if (ffConstant === oFF.UiIllustratedMessageType.ADD_PEOPLE) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.AddPeople;
    } else if (ffConstant === oFF.UiIllustratedMessageType.BALLOON_SKY) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.BalloonSky;
    } else if (ffConstant === oFF.UiIllustratedMessageType.BEFORE_SEARCH) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.BeforeSearch;
    } else if (ffConstant === oFF.UiIllustratedMessageType.CONNECTION) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.Connection;
    } else if (ffConstant === oFF.UiIllustratedMessageType.EMPTY_CALENDAR) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.EmptyCalendar;
    } else if (ffConstant === oFF.UiIllustratedMessageType.NO_SEARCH_RESULTS) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.NoSearchResults;
    } else if (ffConstant === oFF.UiIllustratedMessageType.ERROR_SCREEN) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.ErrorScreen;
    } else if (ffConstant === oFF.UiIllustratedMessageType.ADD_DIMENSIONS) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.AddDimensions;
    } else if (ffConstant === oFF.UiIllustratedMessageType.NO_ENTRIES) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.NoEntries;
    } else if (ffConstant === oFF.UiIllustratedMessageType.NO_DIMENSIONS_SET) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.NoDimensionsSet;
    } else if (ffConstant === oFF.UiIllustratedMessageType.SIMPLE_EMPTY_LIST) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.SimpleEmptyList;
    } else if (ffConstant === oFF.UiIllustratedMessageType.SUCCESS_SCREEN) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.SuccessScreen;
    } else if (ffConstant === oFF.UiIllustratedMessageType.SIMPLE_EMPTY_DOC) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.SimpleEmptyDoc;
    } else if (ffConstant === oFF.UiIllustratedMessageType.UNABLE_TO_LOAD_IMAGE) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.UnableToLoadImage;
    } else if (ffConstant === oFF.UiIllustratedMessageType.TENT) {
      ui5IllustratedMessageType = ui5.sap_m_IllustratedMessageType.Tent;
    }
    return ui5IllustratedMessageType;
  }

  static parseHeaderPosition(ffConstant) {
    let ui5HeaderPosition = null;
    if (ffConstant === oFF.UiHeaderPosition.BOTTOM) {
      ui5HeaderPosition = ui5.sap_f_cards_HeaderPosition.Bottom;
    } else if (ffConstant === oFF.UiHeaderPosition.TOP) {
      ui5HeaderPosition = ui5.sap_f_cards_HeaderPosition.Top;
    }
    return ui5HeaderPosition;
  }

  static parseMessageType(ffConstant) {
    let ui5MessageType = null;
    if (ffConstant === oFF.UiMessageType.NONE) {
      ui5MessageType = ui5.sap_ui_core_MessageType.None;
    } else if (ffConstant === oFF.UiMessageType.ERROR) {
      ui5MessageType = ui5.sap_ui_core_MessageType.Error;
    } else if (ffConstant === oFF.UiMessageType.INFORMATION) {
      ui5MessageType = ui5.sap_ui_core_MessageType.Information;
    } else if (ffConstant === oFF.UiMessageType.SUCCESS) {
      ui5MessageType = ui5.sap_ui_core_MessageType.Success;
    } else if (ffConstant === oFF.UiMessageType.WARNING) {
      ui5MessageType = ui5.sap_ui_core_MessageType.Warning;
    }
    return ui5MessageType;
  }

  static parseColorPickerDisplayMode(ffConstant) {
    let ui5ColorPickerDisplayMode = null;
    if (ffConstant === oFF.UiColorPickerDisplayMode.DEFAULT) {
      ui5ColorPickerDisplayMode = ui5.sap_ui_unified_ColorPickerDisplayMode.Default;
    } else if (ffConstant === oFF.UiColorPickerDisplayMode.LARGE) {
      ui5ColorPickerDisplayMode = ui5.sap_ui_unified_ColorPickerDisplayMode.Large;
    } else if (ffConstant === oFF.UiColorPickerDisplayMode.SIMPLIFIED) {
      ui5ColorPickerDisplayMode = ui5.sap_ui_unified_ColorPickerDisplayMode.Simplified;
    }
    return ui5ColorPickerDisplayMode;
  }

  static parseColorPickerMode(ffConstant) {
    let ui5ColorPickerMode = null;
    if (ffConstant === oFF.UiColorPickerMode.HSL) {
      ui5ColorPickerMode = ui5.sap_ui_unified_ColorPickerMode.HSL;
    } else if (ffConstant === oFF.UiColorPickerMode.HSV) {
      ui5ColorPickerMode = ui5.sap_ui_unified_ColorPickerMode.HSV;
    }
    return ui5ColorPickerMode;
  }

  static parseArrowOrientation(ffConstant) {
    let ui5ArrowOrientation = null;
    if (ffConstant === oFF.UiArrowOrientation.BOTH) {
      ui5ArrowOrientation = ui5.sap_suite_ui_commons_networkgraph_LineArrowOrientation.Both;
    } else if (ffConstant === oFF.UiArrowOrientation.CHILD_OF) {
      ui5ArrowOrientation = ui5.sap_suite_ui_commons_networkgraph_LineArrowOrientation.ChildOf;
    } else if (ffConstant === oFF.UiArrowOrientation.NONE) {
      ui5ArrowOrientation = ui5.sap_suite_ui_commons_networkgraph_LineArrowOrientation.None;
    } else if (ffConstant === oFF.UiArrowOrientation.PARENT_OF) {
      ui5ArrowOrientation = ui5.sap_suite_ui_commons_networkgraph_LineArrowOrientation.ParentOf;
    }
    return ui5ArrowOrientation;
  }

  static parsePopupDock(ffConstant) {
    let ui5PopupDock = null;
    if (ffConstant === oFF.UiPopupDock.BEGIN_BOTTOM) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.BeginBottom;
    } else if (ffConstant === oFF.UiPopupDock.BEGIN_CENTER) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.BeginCenter;
    } else if (ffConstant === oFF.UiPopupDock.BEGIN_TOP) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.BeginTop;
    } else if (ffConstant === oFF.UiPopupDock.CENTER_BOTTOM) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.CenterBottom;
    } else if (ffConstant === oFF.UiPopupDock.CENTER_CENTER) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.CenterCenter;
    } else if (ffConstant === oFF.UiPopupDock.CENTER_TOP) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.CenterTop;
    } else if (ffConstant === oFF.UiPopupDock.END_BOTTOM) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.EndBottom;
    } else if (ffConstant === oFF.UiPopupDock.END_CENTER) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.EndCenter;
    } else if (ffConstant === oFF.UiPopupDock.END_TOP) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.EndTop;
    } else if (ffConstant === oFF.UiPopupDock.LEFT_BOTTOM) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.LeftBottom;
    } else if (ffConstant === oFF.UiPopupDock.LEFT_CENTER) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.LeftCenter;
    } else if (ffConstant === oFF.UiPopupDock.LEFT_TOP) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.LeftTop;
    } else if (ffConstant === oFF.UiPopupDock.RIGHT_BOTTOM) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.RightBottom;
    } else if (ffConstant === oFF.UiPopupDock.RIGHT_CENTER) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.RightCenter;
    } else if (ffConstant === oFF.UiPopupDock.RIGHT_TOP) {
      ui5PopupDock = ui5.sap_ui_core_Popup.Dock.RightTop;
    }
    return ui5PopupDock;
  }

  static parseIconColor(ffConstant) {
    let ui5ColorIcon = null;
    if (ffConstant === oFF.UiIconColor.CONTRAST) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Contrast;
    } else if (ffConstant === oFF.UiIconColor.CRITICAL) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Critical;
    } else if (ffConstant === oFF.UiIconColor.DEFAULT) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Default;
    } else if (ffConstant === oFF.UiIconColor.MARKER) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Marker;
    } else if (ffConstant === oFF.UiIconColor.NEGATIVE) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Negative;
    } else if (ffConstant === oFF.UiIconColor.NEUTRAL) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Neutral;
    } else if (ffConstant === oFF.UiIconColor.NON_INTERACTIVE) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.NonInteractive;
    } else if (ffConstant === oFF.UiIconColor.POSITIVE) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Positive;
    } else if (ffConstant === oFF.UiIconColor.TILE) {
      ui5ColorIcon = ui5.sap_ui_core_IconColor.Tile;
    }
    return ui5ColorIcon;
  }

  static parseButtonType(ffConstant) {
    let ui5ButtonType = null;
    if (ffConstant === oFF.UiButtonType.DEFAULT) {
      ui5ButtonType = ui5.sap_m_ButtonType.Default;
    } else if (ffConstant === oFF.UiButtonType.PRIMARY) {
      ui5ButtonType = ui5.sap_m_ButtonType.Emphasized;
    } else if (ffConstant === oFF.UiButtonType.ACCEPT) {
      ui5ButtonType = ui5.sap_m_ButtonType.Accept;
    } else if (ffConstant === oFF.UiButtonType.TRANSPARENT) {
      ui5ButtonType = ui5.sap_m_ButtonType.Transparent;
    } else if (ffConstant === oFF.UiButtonType.DESTRUCTIVE) {
      ui5ButtonType = ui5.sap_m_ButtonType.Reject;
    } else if (ffConstant === oFF.UiButtonType.ATTENTION) {
      ui5ButtonType = ui5.sap_m_ButtonType.Attention;
    } else if (ffConstant === oFF.UiButtonType.GHOST) {
      ui5ButtonType = ui5.sap_m_ButtonType.Ghost;
    } else if (ffConstant === oFF.UiButtonType.CRITICAL) {
      ui5ButtonType = ui5.sap_m_ButtonType.Critical;
    } else if (ffConstant === oFF.UiButtonType.NEGATIVE) {
      ui5ButtonType = ui5.sap_m_ButtonType.Negative;
    } else if (ffConstant === oFF.UiButtonType.NEUTRAL) {
      ui5ButtonType = ui5.sap_m_ButtonType.Neutral;
    } else if (ffConstant === oFF.UiButtonType.SUCCESS) {
      ui5ButtonType = ui5.sap_m_ButtonType.Success;
    } else if (ffConstant === oFF.UiButtonType.BACK) {
      ui5ButtonType = ui5.sap_m_ButtonType.Back;
    } else if (ffConstant === oFF.UiButtonType.UNSTYLED) {
      ui5ButtonType = ui5.sap_m_ButtonType.Unstyled;
    } else if (ffConstant === oFF.UiButtonType.UP) {
      ui5ButtonType = ui5.sap_m_ButtonType.Up;
    }
    return ui5ButtonType;
  }

  static parseListItemType(ffConstant) {
    let ui5ListItemType = null;
    if (ffConstant === oFF.UiListItemType.ACTIVE) {
      ui5ListItemType = ui5.sap_m_ListType.Active;
    } else if (ffConstant === oFF.UiListItemType.DETAIL) {
      ui5ListItemType = ui5.sap_m_ListType.Detail;
    } else if (ffConstant === oFF.UiListItemType.DETAIL_AND_ACTIVE) {
      ui5ListItemType = ui5.sap_m_ListType.DetailAndActive;
    } else if (ffConstant === oFF.UiListItemType.INACTIVE) {
      ui5ListItemType = ui5.sap_m_ListType.Inactive;
    } else if (ffConstant === oFF.UiListItemType.NAVIGATION) {
      ui5ListItemType = ui5.sap_m_ListType.Navigation;
    }
    return ui5ListItemType;
  }

  static parseFontWeight(ffConstant) {
    let ui5LabelDesign = null;
    if (ffConstant === oFF.UiFontWeight.NORMAL) {
      ui5LabelDesign = ui5.sap_m_LabelDesign.Standard;
    } else if (ffConstant === oFF.UiFontWeight.BOLD) {
      ui5LabelDesign = ui5.sap_m_LabelDesign.Bold;
    }
    return ui5LabelDesign;
  }

  static parseAriaLiveMode(ffConstant) {
    let ui5InvisibleMessageMode = null;
    if (ffConstant === oFF.UiAriaLiveMode.POLITE) {
      ui5InvisibleMessageMode = ui5.sap_ui_core_InvisibleMessageMode.Polite;
    } else if (ffConstant === oFF.UiAriaLiveMode.ASSERTIVE) {
      ui5InvisibleMessageMode = ui5.sap_ui_core_InvisibleMessageMode.Assertive;
    }
    return ui5InvisibleMessageMode;
  }

  static parseBackgroundDesign(ffConstant) {
    let ui5BackgroundDesign = null;
    if (ffConstant === oFF.UiBackgroundDesign.SOLID) {
      ui5BackgroundDesign = ui5.sap_m_BackgroundDesign.Solid;
    } else if (ffConstant === oFF.UiBackgroundDesign.TRANSLUCENT) {
      ui5BackgroundDesign = ui5.sap_m_BackgroundDesign.Translucent;
    } else if (ffConstant === oFF.UiBackgroundDesign.TRANSPARENT) {
      ui5BackgroundDesign = ui5.sap_m_BackgroundDesign.Transparent;
    }
    return ui5BackgroundDesign;
  }

  static parseBusyIndicatorSize(ffConstant) {
    let ui5BusyIndicatorSize = null;
    if (ffConstant === oFF.UiBusyIndicatorSize.AUTO) {
      ui5BusyIndicatorSize = ui5.sap_ui_core_BusyIndicatorSize.Auto;
    } else if (ffConstant === oFF.UiBusyIndicatorSize.LARGE) {
      ui5BusyIndicatorSize = ui5.sap_ui_core_BusyIndicatorSize.Large;
    } else if (ffConstant === oFF.UiBusyIndicatorSize.MEDIUM) {
      ui5BusyIndicatorSize = ui5.sap_ui_core_BusyIndicatorSize.Medium;
    } else if (ffConstant === oFF.UiBusyIndicatorSize.SMALL) {
      ui5BusyIndicatorSize = ui5.sap_ui_core_BusyIndicatorSize.Small;
    }
    return ui5BusyIndicatorSize;
  }

  static parseSortIndicator(ffConstant) {
    let ui5SortIndicator = null;
    if (ffConstant === oFF.UiSortOrder.ASCENDING) {
      ui5SortIndicator = ui5.sap_ui_core_SortOrder.Ascending;
    } else if (ffConstant === oFF.UiSortOrder.DESCENDING) {
      ui5SortIndicator = ui5.sap_ui_core_SortOrder.Descending;
    } else if (ffConstant === oFF.UiSortOrder.NONE) {
      ui5SortIndicator = ui5.sap_ui_core_SortOrder.None;
    }
    return ui5SortIndicator;
  }

  static parseHorizontalAlign(ffConstant) {
    let ui5TextAlign = null;
    if (ffConstant === oFF.UiHorizontalAlign.LEFT) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Left;
    } else if (ffConstant === oFF.UiHorizontalAlign.RIGHT) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Right;
    } else if (ffConstant === oFF.UiHorizontalAlign.CENTER) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Center;
    } else if (ffConstant === oFF.UiHorizontalAlign.BEGIN) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Begin;
    } else if (ffConstant === oFF.UiHorizontalAlign.END) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.End;
    } else if (ffConstant === oFF.UiHorizontalAlign.INITIAL) {
      ui5TextAlign = ui5.sap_ui_core_TextAlign.Initial;
    }
    return ui5TextAlign;
  }

  static parseNodeShape(ffConstant) {
    let ui5NodeShape = null;
    if (ffConstant === oFF.UiNodeShape.BOX) {
      ui5NodeShape = ui5.sap_suite_ui_commons_networkgraph_NodeShape.Box;
    } else if (ffConstant === oFF.UiNodeShape.CIRCLE) {
      ui5NodeShape = ui5.sap_suite_ui_commons_networkgraph_NodeShape.Circle;
    } else if (ffConstant === oFF.UiNodeShape.CUSTOM) {
      ui5NodeShape = ui5.sap_suite_ui_commons_networkgraph_NodeShape.Custom;
    }
    return ui5NodeShape;
  }

  static parseElementStatus(ffConstant) {
    let ui5ElementStatus = null;
    if (ffConstant === oFF.UiElementStatus.ERROR) {
      ui5ElementStatus = ui5.sap_suite_ui_commons_networkgraph_ElementStatus.Error;
    } else if (ffConstant === oFF.UiElementStatus.INFORMATION) {
      ui5ElementStatus = ui5.sap_suite_ui_commons_networkgraph_ElementStatus.Information;
    } else if (ffConstant === oFF.UiElementStatus.STANDARD) {
      ui5ElementStatus = ui5.sap_suite_ui_commons_networkgraph_ElementStatus.Standard;
    } else if (ffConstant === oFF.UiElementStatus.SUCCESS) {
      ui5ElementStatus = ui5.sap_suite_ui_commons_networkgraph_ElementStatus.Success;
    } else if (ffConstant === oFF.UiElementStatus.WARNING) {
      ui5ElementStatus = ui5.sap_suite_ui_commons_networkgraph_ElementStatus.Warning;
    }
    return ui5ElementStatus;
  }

  static parseCalendarType(ffConstant) {
    let ui5CalendarType = null;
    if (ffConstant === oFF.UiCalendarType.BUDDHIST) {
      ui5CalendarType = ui5.sap_base_18n_date_CalendarType.Buddhist;
    } else if (ffConstant === oFF.UiCalendarType.GREGORIAN) {
      ui5CalendarType = ui5.sap_base_18n_date_CalendarType.Gregorian;
    } else if (ffConstant === oFF.UiCalendarType.ISLAMIC) {
      ui5CalendarType = ui5.sap_base_18n_date_CalendarType.Islamic;
    } else if (ffConstant === oFF.UiCalendarType.JAPANESE) {
      ui5CalendarType = ui5.sap_base_18n_date_CalendarType.Japanese;
    } else if (ffConstant === oFF.UiCalendarType.PERSIAN) {
      ui5CalendarType = ui5.sap_base_18n_date_CalendarType.Persian;
    }
    return ui5CalendarType;
  }

  static parsePlacementType(ffConstant) {
    let ui5PlacementType = null;
    if (ffConstant === oFF.UiPlacementType.AUTO) {
      ui5PlacementType = ui5.sap_m_PlacementType.Auto;
    } else if (ffConstant === oFF.UiPlacementType.RIGHT) {
      ui5PlacementType = ui5.sap_m_PlacementType.Right;
    } else if (ffConstant === oFF.UiPlacementType.LEFT) {
      ui5PlacementType = ui5.sap_m_PlacementType.Left;
    } else if (ffConstant === oFF.UiPlacementType.TOP) {
      ui5PlacementType = ui5.sap_m_PlacementType.Top;
    } else if (ffConstant === oFF.UiPlacementType.BOTTOM) {
      ui5PlacementType = ui5.sap_m_PlacementType.Bottom;
    } else if (ffConstant === oFF.UiPlacementType.HORIZONTAL) {
      ui5PlacementType = ui5.sap_m_PlacementType.Horizontal;
    } else if (ffConstant === oFF.UiPlacementType.VERTICAL) {
      ui5PlacementType = ui5.sap_m_PlacementType.Vertical;
    }
    return ui5PlacementType;
  }

  static parseBreadcrumbsSeparatorStyle(ffConstant) {
    let ui5BreadcrumbsSeparatorStyle = null;
    if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.BACK_SLASH) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.BackSlash;
    } else if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.DOUBLE_BACK_SLASH) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.DoubleBackSlash;
    } else if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.DOUBLE_GREATHER_THAN) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.DoubleGreaterThan;
    } else if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.DOUBLE_SLASH) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.DoubleSlash;
    } else if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.GREATHER_THAN) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.GreaterThan;
    } else if (ffConstant === oFF.UiBreadcrumbsSeparatorStyle.SLASH) {
      ui5BreadcrumbsSeparatorStyle = ui5.sap_m_BreadcrumbsSeparatorStyle.Slash;
    }
    return ui5BreadcrumbsSeparatorStyle;
  }

  static parseFlexDirection(ffConstant) {
    let ui5FlexDirection = null;
    if (ffConstant === oFF.UiFlexDirection.ROW) {
      ui5FlexDirection = ui5.sap_m_FlexDirection.Row;
    } else if (ffConstant === oFF.UiFlexDirection.ROW_REVERSE) {
      ui5FlexDirection = ui5.sap_m_FlexDirection.RowReverse;
    } else if (ffConstant === oFF.UiFlexDirection.COLUMN) {
      ui5FlexDirection = ui5.sap_m_FlexDirection.Column;
    } else if (ffConstant === oFF.UiFlexDirection.COLUMN_REVERSE) {
      ui5FlexDirection = ui5.sap_m_FlexDirection.ColumnReverse;
    } else if (ffConstant === oFF.UiFlexDirection.INHERIT) {
      ui5FlexDirection = ui5.sap_m_FlexDirection.Inherit;
    }
    return ui5FlexDirection;
  }

  static parseFlexAlignItems(ffConstant) {
    let ui5FlexAlignItems = null;
    if (ffConstant === oFF.UiFlexAlignItems.BASELINE) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.Baseline;
    } else if (ffConstant === oFF.UiFlexAlignItems.CENTER) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.Center;
    } else if (ffConstant === oFF.UiFlexAlignItems.END) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.End;
    } else if (ffConstant === oFF.UiFlexAlignItems.START) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.Start;
    } else if (ffConstant === oFF.UiFlexAlignItems.STRETCH) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.Stretch;
    } else if (ffConstant === oFF.UiFlexAlignItems.INHERIT) {
      ui5FlexAlignItems = ui5.sap_m_FlexAlignItems.Inherit;
    }
    return ui5FlexAlignItems;
  }

  static parseFlexAlignContent(ffConstant) {
    let ui5FlexAlignContent = null;
    if (ffConstant === oFF.UiFlexAlignContent.CENTER) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.Center;
    } else if (ffConstant === oFF.UiFlexAlignContent.END) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.End;
    } else if (ffConstant === oFF.UiFlexAlignContent.SPACE_AROUND) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.SpaceAround;
    } else if (ffConstant === oFF.UiFlexAlignContent.SPACE_BETWEEN) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.SpaceBetween;
    } else if (ffConstant === oFF.UiFlexAlignContent.START) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.Start;
    } else if (ffConstant === oFF.UiFlexAlignContent.STRETCH) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.Stretch;
    } else if (ffConstant === oFF.UiFlexAlignContent.INHERIT) {
      ui5FlexAlignContent = ui5.sap_m_FlexAlignContent.Inherit;
    }
    return ui5FlexAlignContent;
  }

  static parseFlexJustifyContent(ffConstant) {
    let ui5FlexJustifyContent = null;
    if (ffConstant === oFF.UiFlexJustifyContent.CENTER) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.Center;
    } else if (ffConstant === oFF.UiFlexJustifyContent.END) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.End;
    } else if (ffConstant === oFF.UiFlexJustifyContent.SPACE_AROUND) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.SpaceAround;
    } else if (ffConstant === oFF.UiFlexJustifyContent.SPACE_BETWEEN) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.SpaceBetween;
    } else if (ffConstant === oFF.UiFlexJustifyContent.START) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.Start;
    } else if (ffConstant === oFF.UiFlexJustifyContent.INHERIT) {
      ui5FlexJustifyContent = ui5.sap_m_FlexJustifyContent.Inherit;
    }
    return ui5FlexJustifyContent;
  }

  static parseFlexWrap(ffConstant) {
    let ui5FlexWrap = null;
    if (ffConstant === oFF.UiFlexWrap.NO_WRAP) {
      ui5FlexWrap = ui5.sap_m_FlexWrap.NoWrap;
    } else if (ffConstant === oFF.UiFlexWrap.WRAP) {
      ui5FlexWrap = ui5.sap_m_FlexWrap.Wrap;
    } else if (ffConstant === oFF.UiFlexWrap.WRAP_REVERSE) {
      ui5FlexWrap = ui5.sap_m_FlexWrap.WrapReverse;
    }
    return ui5FlexWrap;
  }

  static parseIconTabHeaderMode(ffConstant) {
    let ui5IconTabHeaderMode = null;
    if (ffConstant === oFF.UiIconTabBarHeaderMode.STANDARD) {
      ui5IconTabHeaderMode = ui5.sap_m_IconTabHeaderMode.Standard;
    } else if (ffConstant === oFF.UiIconTabBarHeaderMode.INLINE) {
      ui5IconTabHeaderMode = ui5.sap_m_IconTabHeaderMode.Inline;
    }
    return ui5IconTabHeaderMode;
  }

  //TODO: needs a property on firefly side, currently hardcoded to inherit
  static getDefaultIconTabDensityMode() {
    return ui5.sap_m_IconTabDensityMode.Inherit;
  }

  static parseInputType(ffConstant) {
    let ui5InputType = null;
    if (ffConstant === oFF.UiInputType.TEXT) {
      ui5InputType = ui5.sap_m_InputType.Text;
    } else if (ffConstant === oFF.UiInputType.NUMBER) {
      ui5InputType = ui5.sap_m_InputType.Number;
    } else if (ffConstant === oFF.UiInputType.TIME) {
      ui5InputType = ui5.sap_m_InputType.Time;
    } else if (ffConstant === oFF.UiInputType.DATE) {
      ui5InputType = ui5.sap_m_InputType.Date;
    } else if (ffConstant === oFF.UiInputType.PASSWORD) {
      ui5InputType = ui5.sap_m_InputType.Password;
    } else if (ffConstant === oFF.UiInputType.EMAIL) {
      ui5InputType = ui5.sap_m_InputType.Email;
    } else if (ffConstant === oFF.UiInputType.URL) {
      ui5InputType = ui5.sap_m_InputType.Url;
    }
    return ui5InputType;
  }

  static parseOrientation(ffConstant) {
    let ui5Orientation = null;
    if (ffConstant === oFF.UiOrientation.HORIZONTAL) {
      ui5Orientation = ui5.sap_ui_core_Orientation.Horizontal;
    } else if (ffConstant === oFF.UiOrientation.VERTICAL) {
      ui5Orientation = ui5.sap_ui_core_Orientation.Vertical;
    }
    return ui5Orientation;
  }

  static parseMenuButtonMode(ffConstant) {
    let ui5MenuButtonMode = null;
    if (ffConstant === oFF.UiMenuButtonMode.REGULAR) {
      ui5MenuButtonMode = ui5.sap_m_MenuButtonMode.Regular;
    } else if (ffConstant === oFF.UiMenuButtonMode.SPLIT) {
      ui5MenuButtonMode = ui5.sap_m_MenuButtonMode.Split;
    }
    return ui5MenuButtonMode;
  }

  static parseTableSelectionMode(ffConstant) {
    let ui5TableSelectionMode = null;
    if (ffConstant == oFF.UiTableSelectionMode.NONE) {
      ui5TableSelectionMode = ui5.sap_ui_table_SelectionMode.None;
    } else if (ffConstant == oFF.UiTableSelectionMode.SINGLE) {
      ui5TableSelectionMode = ui5.sap_ui_table_SelectionMode.Single;
    } else if (ffConstant == oFF.UiTableSelectionMode.MULTI_TOGGLE) {
      ui5TableSelectionMode = ui5.sap_ui_table_SelectionMode.MultiToggle;
    }
    return ui5TableSelectionMode;
  }

  static parseTableSelectionBehavior(ffConstant) {
    let ui5TableSelectionBehavior = null;
    if (ffConstant === oFF.UiSelectionBehavior.ROW) {
      ui5TableSelectionBehavior = ui5.sap_ui_table_SelectionBehavior.Row;
    } else if (ffConstant === oFF.UiSelectionBehavior.ROW_ONLY) {
      ui5TableSelectionBehavior = ui5.sap_ui_table_SelectionBehavior.RowOnly;
    } else if (ffConstant === oFF.UiSelectionBehavior.ROW_SELECTOR) {
      ui5TableSelectionBehavior = ui5.sap_ui_table_SelectionBehavior.RowSelector;
    }
    return ui5TableSelectionBehavior;
  }

  static parseLoadState(ffConstant) {
    let ui5LoadState = null;
    if (ffConstant === oFF.UiLoadState.DISABLED) {
      ui5LoadState = ui5.sap_m_LoadState.Disabled;
    } else if (ffConstant === oFF.UiLoadState.FAILED) {
      ui5LoadState = ui5.sap_m_LoadState.Failed;
    } else if (ffConstant === oFF.UiLoadState.LOADED) {
      ui5LoadState = ui5.sap_m_LoadState.Loaded;
    } else if (ffConstant === oFF.UiLoadState.LOADING) {
      ui5LoadState = ui5.sap_m_LoadState.Loading;
    }
    return ui5LoadState;
  }

  static parseTileMode(ffConstant) {
    let ui5TileMode = null;
    if (ffConstant === oFF.UiTileMode.CONTENT_MODE) {
      ui5TileMode = ui5.sap_m_GenericTileMode.ContentMode;
    } else if (ffConstant === oFF.UiTileMode.HEADER_MODE) {
      ui5TileMode = ui5.sap_m_GenericTileMode.HeaderMode;
    } else if (ffConstant === oFF.UiTileMode.LINE_MODE) {
      ui5TileMode = ui5.sap_m_GenericTileMode.LineMode;
    }
    return ui5TileMode;
  }

  static parseFrameType(ffConstant) {
    let ui5FrameType = null;
    if (ffConstant === oFF.UiFrameType.AUTO) {
      ui5FrameType = ui5.sap_m_FrameType.Auto;
    } else if (ffConstant === oFF.UiFrameType.ONE_BY_HALF) {
      ui5FrameType = ui5.sap_m_FrameType.OneByHalf;
    } else if (ffConstant === oFF.UiFrameType.ONE_BY_ONE) {
      ui5FrameType = ui5.sap_m_FrameType.OneByOne;
    } else if (ffConstant === oFF.UiFrameType.TWO_BY_HALF) {
      ui5FrameType = ui5.sap_m_FrameType.TwoByHalf;
    } else if (ffConstant === oFF.UiFrameType.TWO_BY_ONE) {
      ui5FrameType = ui5.sap_m_FrameType.TwoByOne;
    }
    return ui5FrameType;
  }

  static parseWebcSelectionMode(ffConstant) {
    let ui5WebcSelectionMode = null;
    if (ffConstant === oFF.UiSelectionMode.NONE) {
      ui5WebcSelectionMode = ui5.sap_ui_webc_main_ListMode.None;
    } else if (ffConstant === oFF.UiSelectionMode.SINGLE_SELECT) {
      ui5WebcSelectionMode = ui5.sap_ui_webc_main_ListMode.SingleSelectEnd;
    } else if (ffConstant === oFF.UiSelectionMode.SINGLE_SELECT_LEFT) {
      ui5WebcSelectionMode = ui5.sap_ui_webc_main_ListMode.SingleSelectBegin;
    } else if (ffConstant === oFF.UiSelectionMode.MULTI_SELECT) {
      ui5WebcSelectionMode = ui5.sap_ui_webc_main_ListMode.MultiSelect;
    } else if (ffConstant === oFF.UiSelectionMode.DELETE) {
      ui5WebcSelectionMode = ui5.sap_ui_webc_main_ListMode.Delete;
    }
    return ui5WebcSelectionMode;
  }

  static parseCarouselArrowsPlacement(ffConstant) {
    let ui5CarouselArrowsPlacement = null;
    if (ffConstant === oFF.UiCarouselArrowsPlacement.CONTENT) {
      ui5CarouselArrowsPlacement = ui5.sap_m_UiCarouselArrowsPlacement.Content;
    } else if (ffConstant === oFF.UiCarouselArrowsPlacement.PAGE_INDICATOR) {
      ui5CarouselArrowsPlacement = ui5.sap_m_UiCarouselArrowsPlacement.PageIndicator;
    }
    return ui5CarouselArrowsPlacement;
  }

  static parseDropPosition(ffConstant) {
    let ui5DropPosition = null;
    if (ffConstant === oFF.UiDropPosition.ON) {
      ui5DropPosition = ui5.sap_ui_core_dnd_DropPosition.On;
    } else if (ffConstant === oFF.UiDropPosition.BETWEEN) {
      ui5DropPosition = ui5.sap_ui_core_dnd_DropPosition.Between;
    } else if (ffConstant === oFF.UiDropPosition.ON_OR_BETWEEN) {
      ui5DropPosition = ui5.sap_ui_core_dnd_DropPosition.OnOrBetween;
    }
    return ui5DropPosition;
  }

  static parseDropEffect(ffConstant) {
    let ui5DropEffect = null;
    if (ffConstant === oFF.UiDropEffect.COPY) {
      ui5DropEffect = ui5.sap_ui_core_dnd_DropEffect.Copy;
    } else if (ffConstant === oFF.UiDropEffect.LINK) {
      ui5DropEffect = ui5.sap_ui_core_dnd_DropEffect.Link;
    } else if (ffConstant === oFF.UiDropEffect.MOVE) {
      ui5DropEffect = ui5.sap_ui_core_dnd_DropEffect.Move;
    } else if (ffConstant === oFF.UiDropEffect.NONE) {
      ui5DropEffect = ui5.sap_ui_core_dnd_DropEffect.None;
    }
    return ui5DropEffect;
  }

  static parseDropLayout(ffConstant) {
    let ui5DropLayout = null;
    if (ffConstant === oFF.UiDropLayout.DEFAULT) {
      ui5DropLayout = ui5.sap_ui_core_dnd_DropLayout.Default;
    } else if (ffConstant === oFF.UiDropLayout.HORIZONTAL) {
      ui5DropLayout = ui5.sap_ui_core_dnd_DropLayout.Horizontal;
    } else if (ffConstant === oFF.UiDropLayout.VERTICAL) {
      ui5DropLayout = ui5.sap_ui_core_dnd_DropLayout.Vertical;
    }
    return ui5DropLayout;
  }

  static parseMultiSelectMode(ffConstant) {
    let ui5MultiSelectMode = null;
    if (ffConstant === oFF.UiMultiSelectMode.DEFAULT) {
      ui5MultiSelectMode = ui5.sap_m_MultiSelectMode.Default;
    } else if (ffConstant === oFF.UiMultiSelectMode.SELECT_ALL) {
      ui5MultiSelectMode = ui5.sap_m_MultiSelectMode.SelectAll;
    } else if (ffConstant === oFF.UiMultiSelectMode.CLEAR_ALL) {
      ui5MultiSelectMode = ui5.sap_m_MultiSelectMode.ClearAll;
    }
    return ui5MultiSelectMode;
  }

  static parseSidePanelPosition(ffConstant) {
    let ui5SidePanelPosition = null;
    if (ffConstant === oFF.UiSidePanelPosition.LEFT) {
      ui5SidePanelPosition = ui5.sap_f_SidePanelPosition.Left;
    } else if (ffConstant === oFF.UiSidePanelPosition.RIGHT) {
      ui5SidePanelPosition = ui5.sap_f_SidePanelPosition.Right;
    }
    return ui5SidePanelPosition;
  }

  static parsePriority(ffConstant) {
    let ui5Priority = null;
    if (ffConstant === oFF.UiPriority.NONE) {
      ui5Priority = ui5.sap_ui_core_Priority.None;
    } else if (ffConstant === oFF.UiPriority.LOW) {
      ui5Priority = ui5.sap_ui_core_Priority.Low;
    } else if (ffConstant === oFF.UiPriority.MEDIUM) {
      ui5Priority = ui5.sap_ui_core_Priority.Medium;
    } else if (ffConstant === oFF.UiPriority.HIGH) {
      ui5Priority = ui5.sap_ui_core_Priority.High;
    }
    return ui5Priority;
  }


}

oFF.ui.Ui5ConstantUtils = Ui5ConstantUtils;

FFUi5Preloader.load().then((ui5) => {
  oFF.UiCtUi5Highcharts = ui5.sap_ui_core_Control.extend("oFF.UiCtUi5Highcharts", {
    metadata: {
      properties: {
        width: "sap.ui.core.CSSSize",
        height: "sap.ui.core.CSSSize",
        options: "object",
        dataManifest: "object",
        chartTitle: "string"
      },
      events: {
        onContextMenu: {
          parameters: {
            context: {
              type: "object"
            }
          }
        },
        onClick: {
          parameters: {
            context: {
              type: "object"
            }
          }
        },
        onPress: {
          parameters: {
            isInsidePlot: {
              type: "boolean"
            }
          }
        }
      },
      dnd: {
        draggable: true
      }
    },

    m_highchart: null,
    m_resizeHandlerId: null,
    m_scrollTop: 0,
    m_scrollLeft: 0,

    //ui control stuff
    // ======================================

    init: function() {
      // make sure that the library is loaded
      if (!this._getHighcharts()) {
        oFF.ui.Log.logError("Missing Highcharts library. Did you load the library?");
      }
    },

    exit: function() {
      if (this.m_resizeHandlerId) {
        ui5.sap_ui_core_ResizeHandler.deregister(this.m_resizeHandlerId);
        this.m_resizeHandlerId = null;
      }
    },

    renderer: {
      apiVersion: 2,
      render: function(oRm, oControl) {
        oRm.openStart("div", oControl); // creates the root element incl. the Control ID and enables event handling - important!

        // add class
        oRm.class("ff-highcharts");

        oRm.style("width", oControl.getWidth());
        oRm.style("height", oControl.getHeight());
        oRm.openEnd();

        oRm.close("div");
      }
    },

    onAfterRendering: function() {
      const hasError = this.getDataManifest() ? this.getDataManifest().HasError : false;
      if (!hasError) {
        if (this.getOptions()) {
          const options = this.getOptions();
          const errorMessage = options.ERROR_MESSAGE;
          if (!errorMessage) {
            // update highchart json
            this._addSizeToHighchartJson(false);
            this._addTitleToHighchartJsonIfNeeded();

            this._avoidLegendClick(options);

            options.chart.renderTo = this.getId();

            const HighchartsLib = this._getHighcharts();
            HighchartsLib.setOptions({
              lang: {
                decimalPoint: ',',
                thousandsSep: '.'
              }
            });

            this._menuEventWrapper(options);
            if (options.istimeSeries === true) {
              this.m_highchart = new HighchartsLib.stockChart(options);
            } else {
              this.m_highchart = new HighchartsLib.Chart(options);
            }

            if (this.m_highchart && this.m_highchart.scrollingContainer) {
              this.m_highchart.scrollingContainer.scrollTop = this.m_scrollTop;
              this.m_highchart.scrollingContainer.scrollLeft = this.m_scrollLeft;
            }

            // register on the resize handler
            this._registerForResizeEvents();
            // Resize event is not fired if the control itself is being re-rendered
            // (tested with both Web API ResizeObserver and UI5 ResizeHandler)
            // Hence, copying over control size to HighChart child
            const domRef = this.getDomRef();
            this._updateChartSize(domRef.offsetWidth, domRef.offsetHeight);
            //todo: temporary press event to detect click on chart
            domRef.style.cursor = this.hasListeners("onPress") ? "pointer" : null;
            //temp end
          } else {
            this._showMessage(errorMessage);
          }
          this.setBusy(false);
        } else {
          this.setBusy(true);
        }
      } else {
        const errorText = dataManifest.getStringByKey("ErrorText");
        this._showMessage(errorText);
      }
    },

    _avoidLegendClick: function(options) {
      let chartType = options.plotOptions.bar;
      if (!chartType)
        chartType = options.plotOptions.column;
      if (!chartType)
        chartType = options.plotOptions.line;
      if (chartType) {
        chartType.events = {
          legendItemClick: function() {
            return false;
          }
        }
      } else {
        const pie = options.plotOptions.pie;
        if (pie) {
          pie.point = {
            events: {
              legendItemClick: function(e) {
                e.preventDefault();
              }
            }
          }
        }
      }
    },

    // custom methods
    // ======================================

    setOptions: function(options) {
      if (options) {
        // test function, used to develop and test functions
        /*
         * options["chart"]["events"] = { load: function () {
         *
         * var newXMinArr = []; var newXMaxArr = [];
         *
         * var newYMinArr = []; var newYMaxArr = [];
         *
         * for (var tmpSeriesIndex in this.series) {
         * newXMinArr.push(Math.min.apply(Math,
         * this.series[tmpSeriesIndex].xData));
         * newXMaxArr.push(Math.max.apply(Math,
         * this.series[tmpSeriesIndex].xData));
         * newYMinArr.push(Math.min.apply(Math,
         * this.series[tmpSeriesIndex].yData));
         * newYMaxArr.push(Math.max.apply(Math,
         * this.series[tmpSeriesIndex].yData)); }
         *
         * var maxX = Math.max.apply(Math, newXMaxArr); var minX =
         * Math.min.apply(Math, newXMinArr); var maxY = Math.max.apply(Math,
         * newYMaxArr); var minY = Math.min.apply(Math, newYMinArr);
         *
         * var intervalX = this.xAxis[0].tickInterval; var intervalY =
         * this.yAxis[0].tickInterval;
         *
         * this.xAxis[0].update({ max: 1.1 * maxX, min: Math.min(0, (minX) -
         * intervalX/2 ) }, false);
         *
         * this.yAxis[0].update({ max: 1.1 * maxY, min: Math.min(0, (minY) -
         * intervalY/2 ) }, false);
         *
         * this.redraw(false); } };
         */

        this.setProperty("options", options, true); // skip rendering

        // update highchart json
        this._addSizeToHighchartJson(false);
        this._addTitleToHighchartJsonIfNeeded();

      }
      this.invalidate(); // trigger rendering
      return this;
    },

    _addSizeToHighchartJson: function(forceUpdate) {
      if (this.getOptions()) {

        //width
        const width = this.getWidth();
        if ((!this.getOptions().chart.width || forceUpdate) && width) {
          const widthWithNoDigits = width.replace(new RegExp("[0-9]", "g"), "");
          if (widthWithNoDigits === "px") {
            this.getOptions().chart.width = parseInt(width);
          } else if (widthWithNoDigits === "%" && this.getDomRef()) {
            const containerWidth = this.getDomRef().getBoundingClientRect().width;
            if (containerWidth !== null) {
              let relativeWidth = parseInt(width);
              relativeWidth = (relativeWidth / 100) * containerWidth;
              this.getOptions().chart.width = relativeWidth;
            }
          }
        }

        //height
        const height = this.getHeight();
        if ((!this.getOptions().chart.height || forceUpdate) && height) {
          const heightWithNoDigits = height.replace(new RegExp("[0-9]", "g"), "");
          if (heightWithNoDigits === "px") {
            this.getOptions().chart.height = parseInt(height);
          } else if (heightWithNoDigits === "%" && this.getDomRef()) {
            const containerHeight = this.getDomRef().getBoundingClientRect().height;
            if (containerHeight !== null) {
              let relativeHeight = parseInt(height);
              relativeHeight = (relativeHeight / 100) * containerHeight;
              this.getOptions().chart.height = relativeHeight;
            }
          }
        }
      }
    },

    _addTitleToHighchartJsonIfNeeded: function() {
      if (this.getChartTitle() && this.getOptions()) {
        if (!this.getOptions().title) {
          this.getOptions().title = {};
          this.getOptions().title.style = {};
          this.getOptions().title.style.fontSize = "1rem";
        }
        this.getOptions().title.text = this.getChartTitle();
      }
    },

    _updateChartSize: function(nWidth, nHeight) {
      this.m_highchart?.setSize(nWidth, nHeight);
    },

    _registerForResizeEvents: function() {
      //first deregister any previous resize events
      if (this.m_resizeHandlerId) {
        ui5.sap_ui_core_ResizeHandler.deregister(this.m_resizeHandlerId);
        this.m_resizeHandlerId = null;
      }

      // then register the new one
      this.m_resizeHandlerId = ui5.sap_ui_core_ResizeHandler.register(this.getDomRef(), (params) => {
        const size = params.size;
        if (this.m_highchart && size && size.width && size.height) {
          this._addSizeToHighchartJson(true);
          this._updateChartSize(this.getOptions().chart.width, this.getOptions().chart.height);
        }
      });
    },

    _showMessage: function(message) {
      if (this.getDomRef()) {
        //clear all children
        this.getDomRef().textContent = "";
        // no data div
        const noDataDiv = document.createElement("div");
        noDataDiv.style.height = "100%";
        noDataDiv.style.display = "flex";
        noDataDiv.style.alignItems = "center";
        noDataDiv.style.justifyContent = "center";
        noDataDiv.style.fontSize = "20px";
        noDataDiv.style.fontWeight = "bold";
        noDataDiv.textContent = message;
        this.getDomRef().appendChild(noDataDiv);
      }
    },

    _getHighcharts: function() {
      return oFF.ui.Config.getHighchartsLib();
    },

    _menuEventWrapper: function(options) {
      const myself = this;
      options.chart.events = {
        redraw() {
          const chart = this;
          if (chart.axes) {
            for (let i = 0; i < chart.axes.length; i++) {
              const axis = chart.axes[i];
              const categoriesTree = axis.categoriesTree;
              const scrollInformation = chart.xAxis[0].getExtremes();

              if (categoriesTree) {
                myself._addLabelEvent(categoriesTree, scrollInformation);
              }
            }
          }
        },
        load() {
          // Add Datapoint events
          const chart = this;
          const pointer = this.pointer;
          const container = this.container;

          container.oncontextmenu = function(e) {

            const hoverPoint = chart.hoverPoint;
            const scrollInformation = chart.xAxis[0].getExtremes();

            this.rightClick = true;
            e = pointer.normalize(e);
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.stopPropagation) {
              e.stopPropagation();
            }
            if (e.preventDefault) {
              e.preventDefault();
            }

            if (!pointer.hasDragged) {
              if (hoverPoint) {
                const contextObject = hoverPoint.options.custom;
                //  console.log(contextObject);
                const wrapper = {};
                wrapper.event = e;
                wrapper.context = contextObject;
                wrapper.scrollInformation = scrollInformation;
                myself.fireOnContextMenu(wrapper);
              }
            }
          }

          container.onclick = function(e) {
            if (chart && chart.scrollingContainer) {
              myself.m_scrollTop = chart.scrollingContainer.scrollTop;
              myself.m_scrollLeft = chart.scrollingContainer.scrollLeft;
            }
            const hoverPoint = chart.hoverPoint;
            if (chart.update) {
              chart.update({
                tooltip: {
                  enabled: false
                }
              });
            }
            const scrollInformation = chart.xAxis[0].getExtremes();

            const offsetLeft = chart.container.getBoundingClientRect().left;
            const offsetTop = chart.container.getBoundingClientRect().top;
            const x = e.clientX - chart.plotLeft - offsetLeft;
            const y = e.clientY - chart.plotTop - offsetTop;

            const isInPlotArea = chart.isInsidePlot(x, y);

            //todo: temporary press event to detect click on chart
            if (myself.hasListeners("onPress")) {
              const pressParams = {};
              pressParams.event = e;
              pressParams.isInsidePlot = isInPlotArea;
              myself.fireOnPress(pressParams);
              return; // we prevent any other event when press is registered
            }
            //temp end

            this.rightClick = true;
            e = pointer.normalize(e);
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.stopPropagation) {
              e.stopPropagation();
            }
            if (e.preventDefault) {
              e.preventDefault();
            }

            if (!pointer.hasDragged && isInPlotArea) {
              let wrapper;
              if (hoverPoint) {
                const contextObject = hoverPoint.options.custom;
                wrapper = {};
                wrapper.event = e;
                wrapper.context = contextObject;
                wrapper.scrollInformation = scrollInformation;
              } else {
                wrapper = {};
                wrapper.event = e;
                wrapper.scrollInformation = scrollInformation;
              }
              myself.fireOnClick(wrapper);
            }
          }
          // ========================

          // Add tick events
          if (chart.axes) {
            for (let i = 0; i < chart.axes.length; i++) {
              const axis = chart.axes[i];
              const categoriesTree = axis.categoriesTree;
              const scrollInformation = chart.xAxis[0].getExtremes();

              if (categoriesTree) {
                myself._addLabelEvent(categoriesTree, scrollInformation, chart);
              }
            }
          }
          // ========================

          if (chart.series) {
            for (let i = 0; i < chart.series.length; i++) {
              const serie = chart.series[i];
              for (let j = 0; j < serie.points.length; j++) {
                let category = serie.points[j].category;
                let isSelected = false;
                if (category) {
                  while (category.parent) {
                    category = category.parent;
                    if (category.selected) {
                      isSelected = true;
                      break;
                    }
                  }
                }
                if (isSelected) {
                  serie.points[j].selected = true;
                  serie.redraw();
                }
              }
            }
          }
        },
      }
    },

    _addLabelEvent: function(categories, scrollInformation, chart) {
      const ich = this;
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category.tick) {
          if (category.categories) {
            this._addLabelEvent(category.categories, scrollInformation, chart);
            category.tick.label.element.oncontextmenu = function(e) {
              if (chart && chart.scrollingContainer) {
                ich.m_scrollTop = chart.scrollingContainer.scrollTop;
                ich.m_scrollLeft = chart.scrollingContainer.scrollLeft;
              }
              const wrapper = {};
              wrapper.event = e;
              wrapper.context = category.custom;
              wrapper.scrollInformation = scrollInformation;
              ich.fireOnContextMenu(wrapper);
            }
            category.tick.label.element.onclick = function(e) {
              if (chart && chart.scrollingContainer) {
                ich.m_scrollTop = chart.scrollingContainer.scrollTop;
                ich.m_scrollLeft = chart.scrollingContainer.scrollLeft;
              }
              const wrapper = {};
              wrapper.event = e;
              wrapper.context = category.custom;
              wrapper.scrollInformation = scrollInformation;
              ich.fireOnClick(wrapper);
            }
          }
        }
      }
    },
  });
});

FFUi5Preloader.load().then((ui5) => {
  oFF.UiCtUi5SacTableGrid = ui5.sap_ui_core_Control.extend("oFF.UiCtUi5SacTableGrid", {
    metadata: {
      properties: {
        width: "string",
        height: "string",
        backgroundColor: "string",
        modelJson: "object",
        noDataText: "string"
      },
      aggregations: {},
      defaultAggregation: "",
      events: {
        onCellClick: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onCellContextMenu: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onDrillIconClick: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onSelectionChange: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onResize: {
          parameters: {
            size: {
              type: "object"
            }
          }
        },
        onCellIconClick: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onCellDropped: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        },
        onExternalElementDropped: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        },
        onTableModelUpdated: {
          parameters: {}
        },
        onDataLimitReached: {
          parameters: {
            scrollTop: {
              type: "number"
            }
          }
        },
        onColumnResize: {
          parameters: {
            newSizes: {
              type: "array"
            }
          }
        },
        onRowResize: {
          parameters: {
            newSizes: {
              type: "array"
            }
          }
        },
        onCellDragStart: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        },
        onCellDragEnd: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        },
        onCellLinkClick: {
          parameters: {
            cell: {
              type: "object"
            }
          }
        },
        onCellDragEnter: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        },
        onCellDragLeave: {
          parameters: {
            dragAndDrop: {
              type: "object"
            }
          }
        }
      },
      dnd: {
        draggable: true
      }
    },

    m_sacTable: null,
    m_widgetContainer: null,
    m_clickEventId: null,
    m_containerSize: null,
    m_lastSelectionChangedAreaSerialized: null,
    m_hasNewDataToRender: null,

    //ui control stuff
    // ======================================

    init: function() {
      // make sure that the library is loaded
      this._checkReactTableAvailable();

      this.m_hasNewDataToRender = false;

      // prepare the widget container
      this.m_widgetContainer = document.createElement("div");
      this.m_widgetContainer.style.height = "100%";
      this.m_widgetContainer.style.width = "100%";
      this.m_widgetContainer.style.overflow = "auto";
      this.m_widgetContainer.className = "reactTableComponent ff-sacgrid-wrapper";

      this.m_containerSize = {};
      this.m_containerSize.width = this.m_widgetContainer.offsetWidth;
      this.m_containerSize.height = this.m_widgetContainer.offsetHeight;

      // register on the resize handler
      ui5.sap_ui_core_ResizeHandler.register(this.m_widgetContainer, (params) => {
        // check if this is the first rendering
        const wasInitial = params.size.width > 0 && params.size.height > 0 && this.m_containerSize.width === 0 && this.m_containerSize.height === 0;
        this.m_containerSize = params.size;

        // if first and not onresize handler then rerender autmaitcally
        if (wasInitial || !this.mEventRegistry.onResize) {
          this.invalidate();
        }

        //if first and/or a onreisze handler is present then fire the event but do not rerender, should be done manually
        if ((wasInitial && this.mEventRegistry.onResize) || this.mEventRegistry.onResize) {
          this.fireOnResize(this.m_containerSize);
        }
      });
    },

    renderer: {
      apiVersion: 2,
      render: function render(oRm, oControl) {
        // wrapper start
        oRm.openStart("div", oControl);

        // add class
        oRm.class("ff-sac-grid");

        // attributes
        // tooltip
        const tooltip = oControl.getTooltip();
        if (tooltip != null) {
          oRm.attr("title", tooltip);
        }

        oRm.attr("data-sap-ui-fastnavgroup", true);

        // styles
        // width / height
        const width = oControl.getWidth();
        const height = oControl.getHeight();

        if (width != null) {
          oRm.style("width", width);
        }

        if (height != null) {
          oRm.style("height", height);
        }

        // background color
        const bgColor = oControl.getBackgroundColor();
        if (bgColor != null) {
          oRm.style("background-color", bgColor);
        }

        // close main container tag
        oRm.openEnd();

        // wrapper end
        oRm.close("div");
      }
    },

    onAfterRendering: function() {
      this._rerenderTable();
    },

    // overrides
    // ======================================

    focus: function() {
      if (this.m_sacTable && this.m_sacTable.table) {
        this.m_sacTable.table.focusTable();
      } else {
        this.getFocusDomRef().focus();
      }
    },


    // property methods extension
    // ======================================

    setModelJson: function(modelJson) {
      this.m_hasNewDataToRender = true;
      modelJson = this._addDynamicInfoToModelIfNeeded(modelJson);
      this._setTableModelInternal(modelJson);
      return this;
    },

    // public methods
    // ======================================

    enableDragDrop: function(externalData) {
      this?.m_sacTable?.enableDragDrop(externalData);
    },

    disableDragDrop: function() {
      this?.m_sacTable?.disableDragDrop();
    },

    enableDropZones: function(dropZonesJson) {
      this?.m_sacTable?.enableDropZones(dropZonesJson);
    },

    disableDropZones: function() {
      this?.m_sacTable?.disableDropZones();
    },

    selectCell: function(xPos, yPos, scrollIntoView) {
      this?.m_sacTable?.selectCell(xPos, yPos, scrollIntoView);
    },

    selectArea: function(xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView) {
      this?.m_sacTable?.selectArea(yStartPos, yEndPos, xStartPos, xEndPos, scrollIntoView);
    },

    clearSelection: function() {
      this?.m_sacTable?.clearSelection();
    },

    // helpers
    // ======================================

    _setTableModelInternal: function(modelJson) {
      //check whether this is a partial update
      if (this._isPartial(modelJson)) {
        //if partial append the new rows to the old model
        this._appendLocalModel(modelJson);
      } else if (this._isInitialWithPrefill(modelJson)) {
        //if initial with prefill then prefill all table data with dummy rows and replace the model
        this._prefillTableDataWithDummyRows(modelJson);
        this.setProperty("modelJson", modelJson, true); // prevent rerendering
      } else {
        // if full update then replace the whole model
        this.setProperty("modelJson", modelJson, true); // prevent rerendering
      }
      this._updateTableData(); // trigger the rendering manually
    },

    _appendLocalModel: function(newModel) {
      const curModel = this.getModelJson();

      if (curModel && newModel) {
        // remove unecessary rows if present (can happen during grid settings change)
        if (newModel.totalRowsDiff) {
          if (newModel.totalRowsDiff < 0) {
            const rowsToRemove = Math.abs(newModel.totalRowsDiff);
            for (let a = 0; a < rowsToRemove; a++) {
              curModel.rows.pop();
            }
          }
        }

        // append new rows to the local model
        const newRows = newModel.rows;
        if (newRows && curModel.rows) {
          newRows.forEach(function(row, i) {
            curModel.rows[row.row] = row;
          });
        }

        //we do not need rows anymore for the next step so delete it
        delete newModel.rows;

        // copy everything expect rows from new model to old model
        const newKeys = Object.keys(newModel);
        for (let i = 0; i < newKeys.length; i++) {
          const tmpKey = newKeys[i];
          curModel[tmpKey] = newModel[tmpKey];
        }
      }
    },

    _rerenderTable: function() {
      // appeand the previously created container to the sapui5 custom control
      this.getDomRef().appendChild(this.m_widgetContainer);

      // check if the sactable library is loaded!
      this._checkReactTableAvailable();

      // now adjust the table model with the actaul control sizes
      this._adjustModelWithNewTableSize();

      // render table data if any present
      this._updateTableData();
    },

    _updateTableData: function() {
      // render
      const modelToRender = this.getModelJson();
      if (modelToRender) {
        this._createTableInstanceIfNeeded();
        if (this.m_sacTable) {
          if (this.m_hasNewDataToRender === true) {
            this.m_sacTable.updateTableData(modelToRender, () => {
              this.fireOnTableModelUpdated();
              this.m_hasNewDataToRender = false;
            }, this._isScrollToTop(modelToRender));

            if (this.m_sacTable.table) {
              if (this._isPartial(modelToRender)) {
                this.m_sacTable.reapplyScrollPosition();
              }
            }
          } else {
            this.m_sacTable.reapplyScrollPosition();
          }
        }
      } else {
        this._showNoDataMessage(this.getNoDataText());
        this.fireOnTableModelUpdated();
      }
    },

    _createTableInstanceIfNeeded: function() {
      if (!this.m_sacTable && this.m_widgetContainer) {

        // -----===== see TableData.ts for all possible properties and events =====-----

        const tableCallbacks = {
          onRenderComplete: () => {
            //    console.log("finished!");
          },
          onCellSelected: () => {
            //using selection changed instead
            //    var params = {};
            //    params.selectionArea = this.m_sacTable.table.selectionArea;
            //    this.fireOnSelectionChange(params);
            //  console.log("onCellSelected");
            //  console.log(this.m_sacTable.table.selectionArea);
          },
          onUpdateNewLineMemberCell: () => {
            //  console.log("onUpdateNewLineMemberCell")
          },
          onCellMouseDown: (params) => {
            //console.log("onCellMouseDown");
            // is selectedCell missing then we probably clicked on the title, fire selectionChange event with an empty value
            if (!params.selectedCell) {
              const tmpParams = {};
              tmpParams.selectionArea = {};
              this.fireOnSelectionChange(tmpParams);
            }

            // generate cell id of clicked cell combination of button row and col
            this.m_clickEventId = params.event.button + params.row + params.col;
          },
          onCellMouseUp: (params) => {
            //console.log("onCellMouseUp");
            // generate cell id of released cell
            const tmpCellId = params.event.button + params.row + params.col;
            if (this.m_clickEventId === tmpCellId && params.event && params.event.button === 0) { // 0 === left click
              params.selectionArea = this.m_sacTable.table.selectionArea;
              this.fireOnCellClick(params);
            }
            this.m_clickEventId = null;
          },
          onContextMenu: (params) => {
            //    console.log("onContextMenu");
            //    console.log(params);
            this.fireOnCellContextMenu(params); // fire the event
            if (params && params.event) {
              params.event.preventDefault(); // prevent browser context menu
            }
          },
          onCellMouseEnter: () => {
            //          console.log("onCellMouseEnter")
          },
          onCellMouseLeave: () => {
            //    console.log("onCellMouseLeave")
          },
          onCellMouseOver: () => {
            //    console.log("onCellMouseOver")
          },
          onCellKeyDown: () => {
            //console.log("onCellKeyDown")
          },
          onCellKeyUp: () => {
            //console.log("onCellKeyUp")
          },
          onDrillIconClicked: (params) => {
            //    console.log("onDrillIconClicked")
            this.fireOnDrillIconClick(params);
          },
          onCellEdit: () => {
            //      console.log("onCellEdit")
          },
          onSelectedRegionChanged: (params) => {
            // fires twice on mouse down and on mouse up
            //this.fireOnSelectionChange(params);
            //  console.log("onSelectedRegionChanged");
            //  console.log(params);
            //  console.log(this.m_clickEventId);

            // prevent of sending the same event twice
            const curSelectionAreaSerialized = JSON.stringify(params);
            if (curSelectionAreaSerialized !== this.m_lastSelectionChangedAreaSerialized) {
              this.m_lastSelectionChangedAreaSerialized = curSelectionAreaSerialized;
              const newParams = {};
              newParams.selection = params;
              this.fireOnSelectionChange(newParams);
              //  console.log("selectionChanged " + curSelectionAreaSerialized);
            }
          },
          onCellIconClicked: (params) => {
            //  console.log("onCellIconClicked");
            //  console.log(params);
            this.fireOnCellIconClick(params);
          },
          onCellDropped: (params) => {
            //console.log("onCellDropped");
            //console.log(params);
            this.fireOnCellDropped(params);
          },
          onExternalElementDropped: (params) => {
            //console.log("onExternalElementDropped");
            //console.log(params);
            this.fireOnExternalElementDropped(params);
          },
          onReloadLimitReachedVertically: (scrollTop, scrollDown) => {
            //console.log(scrollTop);
            //console.log(scrollDown);
            //console.log("rows please!");
            const eventParams = {};
            eventParams.scrollTop = scrollTop;
            this.fireOnDataLimitReached(eventParams);

            this.m_hasNewDataToRender = true;
            this._updateTableData();
          },
          onReloadLimitReachedHorizontally: (scrollLeft, scrollRight) => {
            //console.log(scrollLeft);
            //console.log(scrollRight);
            //console.log("columns please!");
            const eventParams = {};
            eventParams.scrollLeft = scrollLeft;
            this.fireOnDataLimitReached(eventParams);

            this._updateTableData();
          },
          onColumnWidthChanged: (params) => {
            //console.log("onColumnWidthChanged");
            //console.log(params);
            let eventParams = {};
            eventParams.newSizes = [];
            if (params && params.length > 0) {
              eventParams.newSizes = params;
            }
            this.fireOnColumnResize(eventParams);
          },
          onRowHeightChanged: (params) => {
            //console.log("onRowHeightChanged");
            //console.log(params);
            let eventParams = {};
            eventParams.newSizes = [];
            if (params && params.length > 0) {
              eventParams.newSizes = params;
            }
            this.fireOnRowResize(eventParams);
          },
          confirmTextEdit: (params) => {
            //console.log("confirmTextEdit");
            //console.log(params);
          },
          cancelTextEdit: (params) => {
            //console.log("cancelTextEdit");
            //console.log(params);
          },
          onKeyboardShortcut: (params) => {
            //console.log("onKeyboardShortcut");
            //console.log(params);
          },
          onCellDragStarted: (params) => {
            //console.log("onCellDragStarted");
            //console.log(params);
            this.fireOnCellDragStart(params);
          },
          onCellDragEnded: (params) => {
            //console.log("onCellDragEnded");
            //console.log(params);
            this.fireOnCellDragEnd(params);
          },
          onCellLinkPressed: (params) => {
            //console.log("onCellLinkPressed");
            //console.log(params);
            this.fireOnCellLinkClick(params);
          },
          onCellDragEnter: (params) => {
            //console.log("onCellDragEnter");
            //console.log(params);
            this.fireOnCellDragEnter(params);
          },
          onCellDragLeave: (params) => {
            //console.log("onCellDragLeave");
            //console.log(params);
            this.fireOnCellDragLeave(params);
          }
        };
        const reactTable = this._getReactTableClass();
        this.m_sacTable = new reactTable(this._getDummyTableData(), this.m_widgetContainer, tableCallbacks);
      }
    },

    // update the table model width dynamic information
    _addDynamicInfoToModelIfNeeded: function(tableModel) {
      if (tableModel && !tableModel.ffAdjusted) {
        //mark adjusted
        tableModel.ffAdjusted = true;
        //total size
        tableModel.totalHeight = tableModel.totalHeight ? tableModel.totalHeight : this._calculateTotalRowHeight(tableModel);
        tableModel.totalWidth = tableModel.totalWidth ? tableModel.totalWidth : this._calculateTotalColumnWidth(tableModel);
        //widget size
        tableModel.widgetHeight = this._getContainerHeight();
        tableModel.widgetWidth = this._getContainerWidth();
        //id
        tableModel.id = this.getId();
        if (tableModel.title) {
          tableModel.title.tableId = this.getId();
        }
        //feature toggles
        if (!tableModel.featureToggles) {
          tableModel.featureToggles = {};
        }
      }

      return tableModel;
    },

    _adjustModelWithNewTableSize: function() {
      const tableModel = this.getModelJson();
      if (tableModel) {
        //widget size
        tableModel.widgetHeight = this._getContainerHeight();
        tableModel.widgetWidth = this._getContainerWidth();
      }
    },

    _calculateTotalRowHeight: function(tableModel) {
      let totalHeight = 0;
      if (tableModel && tableModel.rows) {
        for (let i = 0; i < tableModel.rows.length; i++) {
          const rowHeight = tableModel.rows[i].height ? tableModel.rows[i].height : 0;
          totalHeight = totalHeight + rowHeight;
        }
      }
      return totalHeight;
    },

    _calculateTotalColumnWidth: function(tableModel) {
      let totalWidth = 0;
      if (tableModel && tableModel.columnSettings) {
        for (let i = 0; i < tableModel.columnSettings.length; i++) {
          const columnWidth = tableModel.columnSettings[i].width ? tableModel.columnSettings[i].width : 0;
          totalWidth = totalWidth + columnWidth;
        }
      }
      return totalWidth
    },

    _showNoDataMessage: function(message) {
      if (this.m_sacTable) {
        this.m_sacTable.removeTable();
        this.m_sacTable = null;
      }
      //clear all children
      this.m_widgetContainer.textContent = "";
      // no data div
      const noDataDiv = document.createElement("div");
      noDataDiv.style.height = "100%";
      noDataDiv.style.display = "flex";
      noDataDiv.style.alignItems = "center";
      noDataDiv.style.justifyContent = "center";
      noDataDiv.style.fontSize = "20px";
      noDataDiv.style.fontWeight = "bold";
      noDataDiv.textContent = message;
      this.m_widgetContainer.appendChild(noDataDiv);
    },

    _getDummyTableData: function() {
      // see DefaultTableData.ts for initial model
      const initialTableModel = {
        id: "",
        widgetHeight: 0,
        widgetWidth: 0,
        classesToIgnore: [],
        showGrid: true,
        showCoordinateHeader: false,
        rows: [],
        columnSettings: [],
        totalHeight: 0,
        totalWidth: 0,
        hasFixedRowsCols: false,
        //scrollLimitVertical: 0.9,
        dataRegionStartCol: 0,
        dataRegionStartRow: 0,
        dataRegionEndCol: 0,
        dataRegionEndRow: 0,
        dataRegionCornerCol: 0,
        dataRegionCornerRow: 0,
        lastRowIndex: 0,
        dimensionCellCoordinatesInHeader: {},
        rowHeightSetting: "Compact",
        scrollPosition: {
          x: 0,
          y: 0
        },
        allowKeyEventPropagation: false,
        allowKeyEventDefault: false
      };
      return initialTableModel;
    },

    _prefillTableDataWithDummyRows: function(tableModel) {
      if (tableModel && tableModel.rows) {
        const totalRows = tableModel.partial.totalRows;
        let rowSize = tableModel.partial.rowHeight || 0;

        let startIndex = 0;
        if (tableModel.rows.length > 0) {
          const rowCount = tableModel.rows.length;
          startIndex = tableModel.rows[rowCount - 1].row + 1;
          rowSize = rowSize === 0 ? tableModel.rows[rowCount - 1].height : rowSize;
        }

        // preflll a maximum of 1,1 million rows due to performance reasons
        for (let a = startIndex; a < Math.min(totalRows, 1100000); a++) {
          const dummyRow = {};
          dummyRow.height = rowSize;
          dummyRow.cells = [];
          dummyRow.row = a;
          tableModel.rows.push(dummyRow);
        }
      }
    },

    _isPartial: function(model) {
      return !!(model && model.partial && model.partial === true);
    },

    _isInitialWithPrefill: function(model) {
      return !!(model && model.partial && model.partial.totalRows && model.partial.rowHeight);

    },

    _isScrollToTop: function(model) {
      if (model && model.scrollToTop && model.scrollToTop === true) {
        model.scrollToTop = false; // after the first scroll to top, reset the property since we only want to scroll once!
        return true;
      }
      return false;
    },

    _checkReactTableAvailable: function() {
      if (!oFF.ui.Config.getSacTableLib()) {
        throw new Error("Missing ReactTable library. Did you load the library?")
        oFF.ui.Log.logError("Missing ReactTable library. Did you load the library?");
      }
    },

    _getReactTableClass: function() {
      if (!window) {
        return null;
      }

      return oFF.ui.Config.getSacTableLib()?.ReactTable;
    },

    _getContainerHeight: function(model) {
      // if we have no container size yet, use the widget container to get the size
      if (!this.m_containerSize.height || this.m_containerSize.height === 0) {
        if (this.m_widgetContainer) {
          return this.m_widgetContainer.offsetHeight;
        }
      }

      return this.m_containerSize.height - 1; // be graceful to prevent scrollbar flicker bug
    },

    _getContainerWidth: function(model) {
      // if we have no container size yet, use the widget container to get the size
      if (!this.m_containerSize.width || this.m_containerSize.width === 0) {
        if (this.m_widgetContainer) {
          return this.m_widgetContainer.offsetWidth;
        }
      }

      return this.m_containerSize.width - 1; // be graceful to prevent scrollbar flicker bug
    },


  });
});

// ==========================================================================
// == CUSTOM SAPUI5 CONTROL FOR CONTENT WRAPPING, ACTS AS PROXY INTO SAPUI5
// == very fast rendering
// ==========================================================================
FFUi5Preloader.load().then((ui5) => {
  oFF.UiCtUi5ContentWrapper = ui5.sap_ui_core_Control.extend("oFF.UiCtUi5ContentWrapper", {
    metadata: {
      properties: {
        "backgroundColor": "string",
        "tooltip": "string",
        "width": "sap.ui.core.CSSSize",
        "height": "sap.ui.core.CSSSize",
        "position": "string"
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: true
        }
      },
      events: {
        afterRendering: {
          enablePreventDefault: true
        }
      },
      dnd: {
        draggable: true
      }
    },

    renderer: {
      apiVersion: 2,
      render: function render(oRm, oControl) {
        // WRAPPER start
        oRm.openStart("div", oControl);

        // add class
        oRm.class("ff-content-wrapper");

        // attributes
        // tooltip
        const tooltip = oControl.getTooltip();
        if (tooltip != null) {
          oRm.attr("title", tooltip);
        }

        // styles
        // position (default relative)
        const position = oControl.getPosition();
        if (position != null) {
          oRm.style("position", position);
        }

        // width / height
        const width = oControl.getWidth();
        const height = oControl.getHeight();

        if (width != null) {
          oRm.style("width", width);
        }

        if (height != null) {
          oRm.style("height", height);
        }

        // background color
        const bgColor = oControl.getBackgroundColor();
        if (bgColor != null) {
          oRm.style("background-color", bgColor);
        }

        // close main container tag
        oRm.openEnd();

        // add children (content)
        const aContent = oControl.getContent();
        aContent.forEach((tmpContent) => {
          oRm.renderControl(tmpContent); // render the child control
        });

        // WRAPPER end
        oRm.close("div");
      }
    },

    onAfterRendering: function() {
      this.fireAfterRendering();
    }

  });
});

const FLEX_0_0_AUTO = "0 0 auto";
const FLEX_1_1_AUTO = "1 1 auto";
FFUi5Preloader.load().then((ui5) => {
  oFF.UiCtUi5InteractiveSplitter = ui5.sap_ui_core_Control.extend("oFF.UiCtUi5InteractiveSplitter", {
    metadata: {
      properties: {
        orientation: {
          type: "sap.ui.core.Orientation",
          defaultValue: ui5.sap_ui_core_Orientation.Horizontal
        },
        height: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '100%'
        },
        width: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '100%'
        },
        contentState: {
          type: "object",
          defaultValue: {}
        },
        enableTabReordering: {
          type: "boolean",
          defaultValue: true
        }
      },
      aggregations: {
        items: {
          type: "oFF.UiCtUi5InteractiveSplitterItem",
          multiple: true
        }
      },
      defaultAggregation: "items",
      events: {
        stateChange: {
          parameters: {
            newContentState: {
              type: "object"
            }
          }
        }
      },
      dnd: {
        draggable: true
      }
    },

    //#############################################
    //# UI5 lifecycle methods
    //#############################################
    init: function() {
      this.m_resizerVisibilityMap = {};
      if (window.ResizeObserver && !this.m_resizeObserver) {
        const debounce = function (f, delay) {
          let timer = 0;
          return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => f.apply(this, args), delay);
          }
        };

        this.m_ignoreFirstResizeObserverEvent = false; //.observe() causes the event already to fire, we want to prevent that
        this.m_startedObserving = false; // to prevent repetitive .observe() calls on each re-rendering
        this.m_resizeObserver = new ResizeObserver(debounce(function() {
          if (this.m_ignoreFirstResizeObserverEvent) {
            this.m_ignoreFirstResizeObserverEvent = false;
            return;
          }
          this.getItems().forEach(function(oSplitterItem) {
            const oContentContainer = ui5.sap_jQuery("#" + this._fnEscapeDots(oSplitterItem.getId()))[0];
            if (oContentContainer) {
              // console.log(`Item : ${oSplitterItem.getId()}, Width : ${oContentContainer.offsetWidth}, Height : ${oContentContainer.offsetHeight}`);
              oSplitterItem.fireEvent("resize", {
                size: {
                  offsetWidth: oContentContainer.offsetWidth,
                  offsetHeight: oContentContainer.offsetHeight
                }
              });
            }
          }.bind(this));
        }.bind(this), 100));
      }
    },

    onBeforeRendering: function() {
      let oContentState = this.getContentState();
      const aItems = this.getItems();

      // Do not overwrite content state if there exists only one item
      // We need the previous state to apply item positions on item re-addition
      if (aItems.length === 1) {
        const isHorizontal = this.getOrientation() === ui5.sap_ui_core_Orientation.Horizontal;
        const sPropertyName = isHorizontal ? "width" : "height";
        aItems[0].resetProperty(sPropertyName);
        if (oContentState.state && oContentState.state.length > 1) {
          // Reset width / height of every state based on splitter orientation.
          oContentState.state.forEach((oState) => this._fnUpdateStateProperty(oState, sPropertyName, "", true));
          this._fnFireStateChangeEvent();
        }
      } else if (aItems.length > 1) {
        if (this._fnIsContentStateValid(oContentState)) {
          // Sort once before use.
          oContentState.state.sort((a, b) => a.position - b.position);
          // Update items aggregation with content state information.
          oContentState.state.forEach(oState => this._fnApplyContentState(oState));
        } else {
          // Generate content state for items configured with state names.
          oContentState = this._fnGenerateContentState();
        }

        this.setContentState(oContentState);
      }
    },

    renderer: {
      apiVersion: 2,
      render: function(oRm, oControl) {
        const isHorizontal = oControl.getOrientation() === ui5.sap_ui_core_Orientation.Horizontal;
        oRm.openStart("div", oControl)
          .class("ff-interactive-splitter-root-container")
          .style("display", "flex")
          .style("flex-flow", isHorizontal ? "row" : "column")
          .style("height", oControl.getHeight())
          .style("width", oControl.getWidth())
          .openEnd();

        const aItems = oControl.getItems();
        // Iterate through items aggregation and render content controls.
        aItems.forEach((oSplitterItem, nIndex) => {
          // Copy over necessary properties for rendering the content control.
          oSplitterItem.containerIndex = nIndex;
          oSplitterItem.showDragHandle = aItems.length > 1 && oControl.getEnableTabReordering();
          oSplitterItem.orientation = oControl.getOrientation();

          oRm.renderControl(oSplitterItem);

          if (nIndex < aItems.length - 1) {
            this.renderGutter(oRm, oControl, nIndex);
          }
        });

        oRm.close("div"); // Root container div end
      },

      renderGutter: function(oRm, oControl, nIndex) {
        const isHorizontal = oControl.getOrientation() === ui5.sap_ui_core_Orientation.Horizontal;
        const bValueInMap = oControl.m_resizerVisibilityMap[nIndex];
        const isGutterVisible = bValueInMap !== undefined ? bValueInMap : true;
        //--Gutter
        oRm.openStart("div")
          .attr("role", "separator")
          .attr("id", oControl.getId() + "--Gutter" + nIndex)
          .attr("data-gutter-index", nIndex)
          .attr("data-sap-ui-fastnavgroup", true)
          .attr("aria-orientation", isHorizontal ? "vertical" : "horizontal")
          .attr("tabindex", 0)
          .style("display", isGutterVisible ? "inline-flex" : "none")
          .class(isHorizontal ?
            "ff-interactive-horizontal-splitter-gutter" :
            "ff-interactive-vertical-splitter-gutter")
          .openEnd();

        //--Gutter handle
        oRm.openStart("div")
          .class(isHorizontal ?
            "ff-interactive-horizontal-splitter-gutter-decoration-before" :
            "ff-interactive-vertical-splitter-gutter-decoration-before")
          .openEnd()
          .close("div");

        oRm.openStart("div")
          .class(
            isHorizontal ?
            "ff-interactive-horizontal-splitter-gutter-grip" :
            "ff-interactive-vertical-splitter-gutter-grip")
          .openEnd()
          .icon(
            isHorizontal ?
            "sap-icon://vertical-grip" :
            "sap-icon://horizontal-grip",
            isHorizontal ? ["ff-interactive-horizontal-splitter-gutter-grip-icon"] : ["ff-interactive-vertical-splitter-gutter-grip-icon"])
          .close("div");

        oRm.openStart("div")
          .class(isHorizontal ?
            "ff-interactive-horizontal-splitter-gutter-decoration-after" :
            "ff-interactive-vertical-splitter-gutter-decoration-after"
          )
          .openEnd()
          .close("div");
        //--Gutter handle end
        oRm.close("div");
        //--Gutter end
      }
    },

    onAfterRendering: function() {
      this._fnObserveWindowResize();
      this.addInteractions();
      this.setupDragHandleOnHover();
    },

    exit: function() {
      this._fnUnobserveWindowResize();
      this.removeInteractions();
      delete this.m_resizerVisibilityMap;
    },

    //#############################################
    //# Show / hide resize gutter by index
    //#############################################
    _fnChangeResizerVisibility: function(bShowGutter, nIndex) {
      this.m_resizerVisibilityMap[nIndex] = bShowGutter;
      const sGutterId = this._fnEscapeDots(this.getId()) + "--Gutter" + nIndex;
      const oGutter = document.getElementById(sGutterId);
      if (oGutter) {
        oGutter.style.display = bShowGutter ? "inline-flex" : "none";
      }
    },

    showResizerAtIndex: function(nIndex) {
      this._fnChangeResizerVisibility(true, nIndex);
    },

    hideResizerAtIndex: function(nIndex) {
      this._fnChangeResizerVisibility(false, nIndex);
    },

    //#############################################
    //# Item aggregation methods
    //#############################################
    addItem: function(oItem) {
      return this.addAggregation("items", oItem);
    },

    insertItem: function(oItem, iIndex) {
      return this.insertAggregation("items", oItem, iIndex);
    },

    getItemById: function(sId) {
      return this.getItems().find(oItem => oItem.getId() === sId);
    },

    swapItems: function(oItemOne, oItemTwo) {
      const aItems = this.getItems();
      const nItemOneIndex = aItems.indexOf(oItemOne);
      const nItemTwoIndex = aItems.indexOf(oItemTwo);
      if (nItemOneIndex !== -1 && nItemTwoIndex !== -1 && nItemOneIndex !== nItemTwoIndex) {
        this.removeItem(oItemOne);
        this.removeItem(oItemTwo);
        // Insert item with the lower index first.
        if (nItemOneIndex < nItemTwoIndex) {
          this.insertItem(oItemTwo, nItemOneIndex);
          this.insertItem(oItemOne, nItemTwoIndex);
        } else {
          this.insertItem(oItemOne, nItemTwoIndex);
          this.insertItem(oItemTwo, nItemOneIndex);
        }
      } else {
        oFF.ui.Log.logDebug("Invalid item index detected. Unable to swap splitter items.");
      }
    },

    removeItem: function(oItem) {
      return this.removeAggregation("items", oItem);
    },

    clearItems: function() {
      return this.removeAllAggregation("items");
    },

    //#############################################
    //# property setter/getter methods
    //#############################################
    setContentState: function(oValue) {
      if (oValue && oValue.orientation && oValue.state) {
        this.setProperty("contentState", oValue, true); // No need to re-render
      } else {
        oFF.ui.Log.logDebug("Splitter content state is invalid, hence ignored.");
      }
    },

    //#############################################
    //# Delayed drag handle display on hover
    //#############################################
    setupDragHandleOnHover: function() {
      const hoverDurationInMs = 800;
      ui5.sap_jQuery("div.ff-interactive-splitter-content-drag-handle").hover(
        function() {
          setTimeout(function() {
            // Check whether the hover is still valid after the specified duration
            if (ui5.sap_jQuery(this).is(":hover")) {
              ui5.sap_jQuery(this).addClass('ff-interactive-splitter-content-drag-handle-on-hover');
            }
          }.bind(this), hoverDurationInMs);
        },
        function() {
          ui5.sap_jQuery(this).removeClass('ff-interactive-splitter-content-drag-handle-on-hover');
        }
      );
    },

    //#############################################
    //# Event listeners
    //#############################################
    addInteractions: function() {
      const interactLib = oFF.ui.Config.getInteractLib();
      if (!interactLib) {
        oFF.ui.Log.logError("Could not find interact.js library. Interaction with splitter control will not be possible!");
        return;
      }
      const aItems = this.getItems();
      // Iterate through content state and set event listeners for corresponding DOM elements.
      for (let nIndex = 0; nIndex < aItems.length; nIndex++) {
        if (nIndex < aItems.length - 1) {
          /**
           * Resize of content containers in case of gutter drag.
           */
          const sGutterId = this._fnEscapeDots(this.getId()) + "--Gutter" + nIndex;
          const isHorizontal = this.getOrientation() === ui5.sap_ui_core_Orientation.Horizontal;
          const sGutterStyleClass = isHorizontal ?
              '.ff-interactive-horizontal-splitter-gutter' :
              '.ff-interactive-vertical-splitter-gutter';
          const sGutterSelector = "#" + sGutterId + sGutterStyleClass;
          const oGutter = ui5.sap_jQuery(sGutterSelector)[0];
          if (oGutter) {
            interactLib(oGutter).unset();
            interactLib(oGutter).draggable({
              // keep the element within the area of its parent
              modifiers: [
                interactLib.modifiers.restrictRect({
                  restriction: 'parent'
                })
              ],
              cursorChecker() {
                return isHorizontal ? 'col-resize' : 'row-resize';
              },
              autoScroll: false,
              listeners: {
                move: isHorizontal ?
                  this._fnOnHorizontalResize.bind(this) : this._fnOnVerticalResize.bind(this),
                end: isHorizontal ?
                  this._fnOnHorizontalResizeEnd.bind(this) : this._fnOnVerticalResizeEnd.bind(this)
              }
            });

            /**
             * Keyboard based resize of splitter items
             */
            ui5.sap_jQuery(sGutterSelector).on('keydown', this._fnOnResizeThroughKeyboard.bind(this, isHorizontal));
          }
        }

        /**
         * Drag support for content to other content containers.
         */
        const oItem = aItems[nIndex];
        const oSplitterContent = ui5.sap_jQuery("#" + this._fnEscapeDots(oItem.getId()) + '>section.ff-interactive-splitter-content')[0];
        if (oSplitterContent) {
          interactLib(oSplitterContent).unset();
          interactLib(oSplitterContent).draggable({
            allowFrom: '.ff-interactive-splitter-content-drag-handle-on-hover',
            modifiers: [
              interactLib.modifiers.restrictRect({
                // Content move to be restricted within root container
                restriction: '.ff-interactive-splitter-root-container',
                elementRect: {
                  top: 0,
                  left: 0.85,
                  bottom: 0.15,
                  right: 0.15
                }
              })
            ],
            autoScroll: true,
            listeners: {
              move: this.contentDragListener,
              end: function(event) {
                const oTarget = event.target;
                // Reset the border
                oTarget.style.border = "";
                // reset overflow:auto on parent content container
                ui5.sap_jQuery(oTarget).parent()[0].style.overflow = 'auto';
                // reset the position within current / new content container
                oTarget.style.transform = 'translate(0)';
                oTarget.setAttribute('data-x', 0);
                oTarget.setAttribute('data-y', 0);
                // reset the z-index
                oTarget.style.zIndex = "0";
              }
            }
          });
        }

        /**
         * Drop support for content container to accept content and display styling.
         */
        const oSplitterItem = ui5.sap_jQuery("#" + this._fnEscapeDots(oItem.getId()) + ".ff-interactive-splitter-content-container")[0];
        if (oSplitterItem) {
          interactLib(oSplitterItem).unset();
          interactLib(oSplitterItem).dropzone({
            // only accept content elements from the current control for drop
            accept: 'div[id="' + this.getId() + '"]>div>.ff-interactive-splitter-content',
            // Just the mouse pointer needs to overlap the drop zone
            overlap: 'pointer',
            ondropactivate: function(event) {
              // add active dropzone borders
              event.target.classList.add('ff-interactive-splitter-content-container-drop-active');
            },
            ondropdeactivate: function(event) {
              // remove active dropzone borders and background color on content container
              event.target.classList.remove('ff-interactive-splitter-content-container-drop-active');
              event.target.classList.remove('ff-interactive-splitter-content-container-drop-target');
            },
            ondragenter: function(event) {
              // show the possibility of a drop with a background color on content container
              event.target.classList.add('ff-interactive-splitter-content-container-drop-target');
            },
            ondragleave: function(event) {
              // restore default background color
              event.target.classList.remove('ff-interactive-splitter-content-container-drop-target');
            },
            ondrop: this.contentDropListener.bind(this)
          });
        }
      }
    },

    removeInteractions: function() {
      const interactLib = oFF.ui.Config.getInteractLib();
      if (!interactLib) {
        oFF.ui.Log.logError("Could not find interact.js library. Interaction with splitter control will be not possible!");
        return;
      }
      const aItems = this.getItems();

      for (let nIndex = 0; nIndex < aItems.length; nIndex++) {
        if (nIndex < aItems.length - 1) {
          // Remove resize relevant interact.js event listeners
          const sGutterId = this._fnEscapeDots(this.getId()) + "--Gutter" + nIndex;
          const sGutterStyleClass = this.getOrientation() === ui5.sap_ui_core_Orientation.Horizontal ?
              '.ff-interactive-horizontal-splitter-gutter' :
              '.ff-interactive-vertical-splitter-gutter';
          const oGutter = ui5.sap_jQuery("#" + sGutterId + sGutterStyleClass)[0];
          if (oGutter) {
            interactLib(oGutter).unset();
          }
        }

        // Remove drag and drop relevant interact.js event listeners
        const sItemId = this._fnEscapeDots(aItems[nIndex].getId());
        const oSplitterContent = ui5.sap_jQuery("#" + sItemId + '>section.ff-interactive-splitter-content')[0];
        if (oSplitterContent) {
          interactLib(oSplitterContent).unset();
        }
        const oSplitterItem = ui5.sap_jQuery("#" + sItemId + ".ff-interactive-splitter-content-container")[0];
        if (oSplitterItem) {
          interactLib(oSplitterItem).unset();
        }
      }
    },

    _fnOnResizeThroughKeyboard: function(isHorizontal, event) {
      const oTarget = event.target;
      let nChangeInPx = 0;

      if (event.key === "PageUp") {
        nChangeInPx = -200;
      } else if (event.key === "PageDown") {
        nChangeInPx = 200;
      }

      if (isHorizontal) {
        if (event.key === "ArrowLeft") {
          nChangeInPx = -20;
        } else if (event.key === "ArrowRight") {
          nChangeInPx = 20;
        }
        if (nChangeInPx) {
          this._fnOnHorizontalResize({
            target: oTarget,
            dx: nChangeInPx
          });
          this._fnOnHorizontalResizeEnd({
            target: oTarget
          });
        }
      } else {
        if (event.key === "ArrowUp") {
          nChangeInPx = -20;
        } else if (event.key === "ArrowDown") {
          nChangeInPx = 20;
        }

        if (nChangeInPx) {
          this._fnOnVerticalResize({
            target: oTarget,
            dy: nChangeInPx
          });
          this._fnOnVerticalResizeEnd({
            target: oTarget
          });
        }
      }
    },

    /**
     * Event handler for horizontal content resize by gutter drag
     * @param {object} event The gutter move event
     */
    _fnOnHorizontalResize: function(event) {
      const oTarget = event.target;
      const nChangeInX = this._fnConvertWidthToPercentage(event.dx);
      const nGutterIndex = parseInt(oTarget.getAttribute("data-gutter-index"));
      const aContainers = this._fnGetAdjacentContainers(nGutterIndex);
      if (!aContainers) {
        return;
      }
      let [oLeftContentContainer, oRightContentContainer] = aContainers;
      // Compute new widths
      const nLeftContentWidth = this._fnTrimPercentage(this._fnGetDomElementWidth(oLeftContentContainer));
      const nNewLeftWidth = parseFloat((nLeftContentWidth + nChangeInX).toFixed(2));
      const nLeftMinWidth = this._fnConvertWidthToPercentage(oLeftContentContainer.style.minWidth);
      const nLeftMaxWidth = this._fnConvertWidthToPercentage(oLeftContentContainer.style.maxWidth);

      const nRightContentWidth = this._fnTrimPercentage(this._fnGetDomElementWidth(oRightContentContainer));
      const nNewRightWidth = parseFloat((nRightContentWidth - nChangeInX).toFixed(2));
      const nRightMinWidth = this._fnConvertWidthToPercentage(oRightContentContainer.style.minWidth);
      const nRightMaxWidth = this._fnConvertWidthToPercentage(oRightContentContainer.style.maxWidth);

      // Update widths only if they are within the min and max widths of the container
      if (nNewLeftWidth >= nLeftMinWidth && nNewLeftWidth <= nLeftMaxWidth &&
        nNewRightWidth >= nRightMinWidth && nNewRightWidth <= nRightMaxWidth) {
        oLeftContentContainer.style.width = nNewLeftWidth + '%';
        oLeftContentContainer.style.flex = FLEX_0_0_AUTO;
        oRightContentContainer.style.width = nNewRightWidth + '%';
        oRightContentContainer.style.flex = FLEX_0_0_AUTO;

        // translate the gutter element
        oTarget.style.transform = 'translate(' + nChangeInX + '%, 0%)';
      } else {
        // When shrunk to minimum width, reset width to minWidth.
        // Otherwise, resize of the parent control will result in undesired percentage based scaling of the splitter items.
        if (nNewLeftWidth < nLeftMinWidth) {
          oLeftContentContainer.style.width = oLeftContentContainer.style.minWidth;
          oLeftContentContainer.style.flex = FLEX_0_0_AUTO;
          oRightContentContainer.style.removeProperty("width");
          oRightContentContainer.style.flex = FLEX_1_1_AUTO;
        } else if (nNewRightWidth < nRightMinWidth) {
          oLeftContentContainer.style.removeProperty("width");
          oLeftContentContainer.style.flex = FLEX_1_1_AUTO;
          oRightContentContainer.style.width = oRightContentContainer.style.minWidth;
          oRightContentContainer.style.flex = FLEX_0_0_AUTO;
        }
      }
    },

    /**
     * Event handler for vertical content resize by gutter drag
     * @param {object} event The gutter move event
     */
    _fnOnVerticalResize: function(event) {
      const oTarget = event.target;
      const nChangeInY = this._fnConvertHeightToPercentage(event.dy);
      const nGutterIndex = parseInt(oTarget.getAttribute("data-gutter-index"));
      const aContainers = this._fnGetAdjacentContainers(nGutterIndex);
      if (!aContainers) {
        return;
      }
      let [oTopContentContainer, oBottomContentContainer] = aContainers;
      // Compute new heights
      const nTopContentHeight = this._fnTrimPercentage(this._fnGetDomElementHeight(oTopContentContainer));
      const nNewTopHeight = parseFloat((nTopContentHeight + nChangeInY).toFixed(2));
      const nTopMinHeight = this._fnConvertHeightToPercentage(oTopContentContainer.style.minHeight);
      const nTopMaxHeight = this._fnConvertHeightToPercentage(oTopContentContainer.style.maxHeight);

      const nBottomContentHeight = this._fnTrimPercentage(this._fnGetDomElementHeight(oBottomContentContainer));
      const nNewBottomHeight = parseFloat((nBottomContentHeight - nChangeInY).toFixed(2));
      const nBottomMinHeight = this._fnConvertHeightToPercentage(oBottomContentContainer.style.minHeight);
      const nBottomMaxHeight = this._fnConvertHeightToPercentage(oBottomContentContainer.style.maxHeight);

      // Update height only if they are within the min and max height of the container
      if (nNewTopHeight >= nTopMinHeight && nNewTopHeight <= nTopMaxHeight &&
        nNewBottomHeight >= nBottomMinHeight && nNewBottomHeight <= nBottomMaxHeight) {
        oTopContentContainer.style.height = nNewTopHeight + '%';
        oTopContentContainer.style.flex = FLEX_0_0_AUTO;
        oBottomContentContainer.style.height = nNewBottomHeight + '%';
        oBottomContentContainer.style.flex = FLEX_0_0_AUTO;

        // translate the gutter element
        oTarget.style.transform = 'translate(0%,' + nChangeInY + '%)';
      } else {
        // When shrunk to minimum heights, reset height to minHeight.
        // Otherwise, resize of the parent control will result in undesired percentage based scaling of the splitter items.
        if (nNewTopHeight < nTopMinHeight) {
          oTopContentContainer.style.height = oTopContentContainer.style.minHeight;
          oTopContentContainer.style.flex = FLEX_0_0_AUTO;
          oBottomContentContainer.style.removeProperty("height");
          oBottomContentContainer.style.flex = FLEX_1_1_AUTO;
        } else if (nNewBottomHeight < nBottomMinHeight) {
          oTopContentContainer.style.removeProperty("height");
          oTopContentContainer.style.flex = FLEX_1_1_AUTO;
          oBottomContentContainer.style.height = oBottomContentContainer.style.minHeight;
          oBottomContentContainer.style.flex = FLEX_0_0_AUTO;
        }
      }
    },

    _fnOnResizeEnd: function(oTarget, sPropertyName) {
      oTarget.style.transform = 'translate(0)';
      const nGutterIndex = parseInt(oTarget.getAttribute("data-gutter-index"));
      const aContainers = this._fnGetAdjacentContainers(nGutterIndex);
      if (!aContainers) {
        return;
      }
      // Update splitter item UI5 property, content state and fire resize event for each splitter item involved.
      aContainers.forEach(oContainer => {
        const oSplitterItem = this.getItemById(oContainer.id);
        oSplitterItem._setProperty(sPropertyName, oContainer.style[sPropertyName]);
        oSplitterItem.fireEvent("resize", {
          size: {
            offsetWidth: ui5.sap_jQuery(oContainer)[0].offsetWidth,
            offsetHeight: ui5.sap_jQuery(oContainer)[0].offsetHeight
          }
        });
      });
    },

    _fnOnHorizontalResizeEnd: function(event) {
      this._fnOnResizeEnd(event.target, "width");
    },

    _fnOnVerticalResizeEnd: function(event) {
      this._fnOnResizeEnd(event.target, "height");
    },

    /**
     * Event handler for drag of content from its initial position
     * @param {object} event The content move event
     */
    contentDragListener: function(event) {
      const oTarget = event.target;
      // Set a 1px border around the content
      oTarget.style.borderWidth = "1px";
      oTarget.style.borderStyle = "solid";
      oTarget.style.borderColor = "rgb(203, 194, 194)";
      // Disable overflow:auto on parent content container to allow drag across containers.
      ui5.sap_jQuery(oTarget).parent()[0].style.overflow = '';
      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(oTarget.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(oTarget.getAttribute('data-y')) || 0) + event.dy;
      // translate the element
      oTarget.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      // update the position attributes
      oTarget.setAttribute('data-x', x);
      oTarget.setAttribute('data-y', y);
      // set a higher z-index to be visible above other controls during drag
      oTarget.style.zIndex = "2";
    },

    /**
     * Event handler for drop of content into a content container
     * @param {object} event The content drop event
     */
    contentDropListener: function(event) {
      const oSourceContent = event.relatedTarget;
      const oSourceContainer = ui5.sap_jQuery(oSourceContent).parent()[0];
      const nSourceIndex = parseInt(oSourceContainer.getAttribute("data-container-index"));
      const oSourceSplitterItem = this.getItemById(oSourceContainer.id);

      const oTargetContainer = event.target;
      const nTargetIndex = parseInt(oTargetContainer.getAttribute("data-container-index"));
      const oTargetSplitterItem = this.getItemById(oTargetContainer.id);

      // Reset background
      event.target.classList.remove('ff-interactive-splitter-content-container-drop-target');

      if (oSourceSplitterItem && oTargetSplitterItem && oSourceSplitterItem !== oTargetSplitterItem) {
        this.swapItems(oSourceSplitterItem, oTargetSplitterItem);

        // Update content state
        const sPropertyName = "position";
        this.updateContentState(oTargetSplitterItem, sPropertyName, nSourceIndex, false);
        this.updateContentState(oSourceSplitterItem, sPropertyName, nTargetIndex, false);
      }

      // On drop, remove the on-hover drag handle and setup for next time (needed as hover is not fired without redefinition)
      ui5.sap_jQuery('div.ff-interactive-splitter-content-drag-handle.ff-interactive-splitter-content-drag-handle-on-hover').removeClass('ff-interactive-splitter-content-drag-handle-on-hover');
      this.setupDragHandleOnHover();
    },

    //#############################################
    //# Window resize observer related functions
    //#############################################
    _fnGetParentWindow: function() {
      return ui5.sap_jQuery("#" + this._fnEscapeDots(this.getId())).closest('.ff-window-wrapper')[0];
    },

    _fnObserveWindowResize: function() {
      if (this.m_resizeObserver && !this.m_startedObserving) {
        const oWindow = this._fnGetParentWindow();
        if (oWindow) {
          this.m_ignoreFirstResizeObserverEvent = true;
          this.m_resizeObserver.observe(oWindow);
          this.m_startedObserving = true;
        }
      }
    },

    _fnUnobserveWindowResize: function() {
      if (this.m_resizeObserver && this.m_startedObserving) {
        const oWindow = this._fnGetParentWindow();
        if (oWindow) {
          this.m_resizeObserver.unobserve(oWindow);
        }
        this.m_ignoreFirstResizeObserverEvent = false;
        delete this.m_resizeObserver;
        this.m_startedObserving = false;
      }
    },

    //#############################################
    //# Content container helper functions
    //#############################################
    _fnCalculateContainerWidth: function(sWidth) {
      if (sWidth && sWidth !== "auto") {
        return this._fnConvertWidthToPercentage(sWidth) + "%";
      }
      return ""; // Do not provide a default width if not available.
    },

    _fnCalculateContainerHeight: function(sHeight) {
      if (sHeight) {
        return this._fnConvertHeightToPercentage(sHeight) + "%";
      }
      return ""; // Do not provide a default height if not available.
    },

    _fnGetAdjacentContainers: function(nIndex) {
      const oRootContainer = ui5.sap_jQuery("#" + this._fnEscapeDots(this.getId()));
      const oContainer1 = oRootContainer.children('div[data-container-index=' + nIndex + ']')[0];
      const nIndex2 = nIndex + 1;
      const oContainer2 = oRootContainer.children('div[data-container-index=' + nIndex2 + ']')[0];
      if (!oContainer1 || !oContainer2) {
        oFF.ui.Log.logDebug("Unable to determine contents for resize.");
        return null;
      }
      return [oContainer1, oContainer2];
    },

    //#############################################
    //# JQuery getters
    //#############################################
    _fnGetDomElementWidth: function(oControl) {
      if (oControl) {
        const sWidth = (oControl.style && oControl.style.width) ? oControl.style.width : ui5.sap_jQuery(oControl)[0].offsetWidth;
        return this._fnConvertWidthToPercentage(sWidth) + "%";
      }
      return "0%";
    },

    _fnGetDomElementHeight: function(oControl) {
      if (oControl) {
        const sHeight = (oControl.style && oControl.style.height) ? oControl.style.height : ui5.sap_jQuery(oControl)[0].offsetHeight;
        return this._fnConvertHeightToPercentage(sHeight) + "%";
      }
      return "0%";
    },

    //#############################################
    //# State management functions
    //#############################################
    _fnIsContentStateValid: function(oContentState) {
      const aItems = this.getItems();
      let bIsValid = !!oContentState &&
          !!aItems &&
          !!oContentState.state &&
          oContentState.numberOfViews === aItems.length &&
          oContentState.orientation === this.getOrientation();
      if (bIsValid) {
        // Check whether every entry in the content state corresponds to a splitter item and its position is within the size of the items aggregation
        bIsValid = oContentState.state.every(oState => aItems.find(oItem => oItem.getStateName() === oState.tag) && oState.position < aItems.length);
      }
      return bIsValid;
    },

    _fnGenerateContentState: function() {
      const aStates = [];
      const aItems = this.getItems();

      aItems.forEach((oItem, nIndex) => {
        const sStateName = oItem.getStateName();
        if (sStateName) {
          aStates.push({
            tag: sStateName,
            position: nIndex,
            width: this._fnCalculateContainerWidth(oItem.getWidth()),
            height: this._fnCalculateContainerHeight(oItem.getHeight()),
          });
        }
      });

      return {
        orientation: this.getOrientation(),
        numberOfViews: aItems.length,
        state: aStates
      };
    },

    _fnApplyContentState: function(oState) {
      if (!oState) {
        oFF.ui.Log.logDebug("Cannot apply empty content state. ");
        return;
      }
      const aItems = this.getItems();
      const oItem = aItems.find(oItem => oItem.getStateName() === oState.tag);
      if (!oItem) {
        oFF.ui.Log.logDebug(`Unable to retrieve splitter item with state name : ${oState.tag}.`);
        return;
      }

      if (oState.width) {
        oItem.setWidth(oState.width);
      }
      if (oState.height) {
        oItem.setHeight(oState.height);
      }
      if (aItems.indexOf(oItem) !== oState.position) {
        this.removeItem(oItem);
        this.insertItem(oItem, oState.position);
      }
    },

    _fnUpdateStateProperty: function(oState, sPropertyKey, sNewValue, bSuppressEvent) {
      const bStateModified = !!oState && oState.hasOwnProperty(sPropertyKey) && oState[sPropertyKey] !== sNewValue;
      if (bStateModified) {
        oState[sPropertyKey] = sNewValue;
        if (!bSuppressEvent) {
          this._fnFireStateChangeEvent();
        }
      }
      return bStateModified;
    },

    _fnFireStateChangeEvent: function() {
      this.fireEvent("stateChange", {
        newContentState: this.getContentState()
      });
    },

    updateContentState: function(oItem, sPropertyKey, sNewValue, bSuppressEvent) {
      let bContentStateModified = false;
      const oContentState = this.getContentState();
      if (oContentState && oContentState.state) {
        const sStateName = !!oItem && oItem.getStateName();
        if (sStateName) {
          const oState = oContentState.state.find(oControlData => oControlData.tag === sStateName);
          bContentStateModified = this._fnUpdateStateProperty(oState, sPropertyKey, sNewValue, bSuppressEvent);
          if (bContentStateModified && !bSuppressEvent && sPropertyKey === "position") {
            oItem.fireEvent("change", {
              index: sNewValue
            });
          }
        }
      }
      return bContentStateModified;
    },

    //#############################################
    //# Utility functions
    //#############################################
    _fnTrimPercentage: function(sValue) {
      return parseFloat(sValue.replace(/[% ]/g, ''));
    },

    _fnTrimPx: function(sValue) {
      let nReturnValue = 0;
      if (sValue) {
        if (sValue.endsWith("px")) {
          sValue = sValue.substring(0, sValue.length - 2);
        }
        sValue = parseInt(sValue);
        if (!isNaN(sValue)) {
          nReturnValue = sValue;
        }
      }
      return nReturnValue;
    },

    _fnConvertRemToPx(vValue) {
      let fReturnValue = 0;
      if (vValue) {
        if (vValue.endsWith("rem")) {
          vValue = vValue.substring(0, vValue.length - 3);
        }
        vValue = parseInt(vValue);
        if (!isNaN(vValue)) {
          const fRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
          fReturnValue = vValue * fRootFontSize;
        }
      }
      return fReturnValue;
    },

    _fnConvertWidthToPercentage: function(sValue) {
      let fValue;
      if (!isNaN(sValue)) {
        fValue = sValue;
      } else {
        if (sValue) {
          if (sValue.endsWith("%")) {
            return this._fnTrimPercentage(sValue);
          } else if (sValue.endsWith("px")) {
            fValue = this._fnTrimPx(sValue);
          } else if (sValue.endsWith("rem")) {
            fValue = this._fnConvertRemToPx(sValue);
          }
        } else {
          return 0;
        }
      }
      const oDomRef = this.getDomRef();
      const nTotalWidth = oDomRef ? oDomRef.offsetWidth : window.innerWidth;
      return parseFloat((fValue * 100 / nTotalWidth).toFixed(2));
    },

    _fnConvertHeightToPercentage: function(sValue) {
      let fValue;
      if (!isNaN(sValue)) {
        fValue = sValue;
      } else {
        if (sValue) {
          if (sValue.endsWith("%")) {
            return this._fnTrimPercentage(sValue);
          } else if (sValue.endsWith("px")) {
            fValue = this._fnTrimPx(sValue);
          } else if (sValue.endsWith("rem")) {
            fValue = this._fnConvertRemToPx(sValue);
          }
        } else {
          return 0;
        }
      }
      const oDomRef = this.getDomRef();
      const nTotalHeight = oDomRef ? oDomRef.offsetHeight : window.innerHeight;
      return parseFloat((fValue * 100 / nTotalHeight).toFixed(2));
    },

    _fnEscapeDots: function(sControlId) {
      return sControlId ? sControlId.replace(/\./g, '\\.') : "";
    }
  });
});

FFUi5Preloader.load().then((ui5) => {
  oFF.UiCtUi5InteractiveSplitterItem = ui5.sap_ui_core_Control.extend("oFF.UiCtUi5InteractiveSplitterItem", {
    metadata: {
      properties: {
        height: {
          type: "sap.ui.core.CSSSize"
        },
        minHeight: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '0%'
        },
        maxHeight: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '100%'
        },
        width: {
          type: "sap.ui.core.CSSSize"
        },
        minWidth: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '0%'
        },
        maxWidth: {
          type: "sap.ui.core.CSSSize",
          defaultValue: '100%'
        },
        stateName: {
          type: "string"
        }
      },
      aggregations: {
        content: {
          type: "sap.ui.core.Control",
          multiple: false
        }
      },
      defaultAggregation: "content",
      events: {
        resize: {
          parameters: {
            size: {
              offsetWidth: "number",
              offsetHeight: "number"
            }
          }
        },
        change: {
          parameters: {
            index: "number"
          }
        }
      },
      dnd: {
        draggable: true
      }
    },

    //#############################################
    //# UI5 lifecycle methods
    //#############################################
    renderer: {
      apiVersion: 2,
      render: function(oRm, oControl) {
        // Create content container for each content
        //--Content container will act as a drop target for contents
        oRm.openStart("div", oControl)
          .attr("data-container-index", oControl.containerIndex)
          .style("overflow", "auto")
          .class("ff-interactive-splitter-content-container");
        if (oControl.orientation === ui5.sap_ui_core_Orientation.Horizontal) {
          oRm.class("ff-interactive-horizontal-splitter-content-container")
            .style("height", oControl.getHeight())
            .style("min-width", oControl.getMinWidth())
            .style("max-width", oControl.getMaxWidth());
          const oWidth = oControl.getWidth();
          if (oWidth) {
            oRm.style("flex", "0 0 auto");
            oRm.style("width", oWidth);
          } else {
            oRm.style("flex", "auto");
          }
        } else if (oControl.orientation === ui5.sap_ui_core_Orientation.Vertical) {
          oRm.class("ff-interactive-vertical-splitter-content-container")
            .style("width", oControl.getWidth())
            .style("min-height", oControl.getMinHeight())
            .style("max-height", oControl.getMaxHeight());
          const oHeight = oControl.getHeight();
          if (oHeight) {
            oRm.style("flex", "0 0 auto");
            oRm.style("height", oHeight);
          } else {
            oRm.style("flex", "auto");
          }
        } else {
          oFF.ui.Log.logError("Could not retrieve orientation of splitter item!");
        }
        oRm.openEnd();
        const oContentControl = oControl.getContent();
        this.renderContent(oRm, oControl, oContentControl);
        oRm.close("div"); //--End of Content container
      },

      renderContent: function(oRm, oControl, oContentControl) {
        oRm.openStart("section")
          .class("ff-interactive-splitter-content")
          .openEnd();

        if (oControl.showDragHandle) {
          this.renderContentDragHandle(oRm); //--Content drag handle
        }
        oRm.renderControl(oContentControl) // Render the child control
          .close("section");
      },

      renderContentDragHandle: function(oRm) {
        oRm.openStart("div")
          .class("ff-interactive-splitter-content-drag-handle")
          .attr("draggable", "true")
          .openEnd()
          .text("• • •")
          .close("div");
      }
    },
    //#############################################
    //# Content aggregation methods
    //#############################################
    addContent: function(oContent) {
      return this.setAggregation("content", oContent);
    },

    removeContent: function() {
      return this.removeAggregation("content");
    },

    //#############################################
    //# Property getter / setter methods
    //#############################################
    setWidth: function(vWidth) {
      this._setProperty("width", vWidth);
    },

    setHeight: function(vHeight) {
      this._setProperty("height", vHeight);
    },

    //#############################################
    //# Private methods
    //#############################################
    _setProperty: function(sPropertyName, vValue) {
      // setProperty() invokes re-rendering of the control.
      // Update content state before that.
      const oSplitter = this.getParent();
      if (oSplitter) {
        oSplitter.updateContentState(this, sPropertyName, vValue, false);
      }
      this.setProperty(sPropertyName, vValue);
    }
  });
});

oFF.UiGeneric = function() {
   oFF.DfUiGeneric.call(this);
  this._ff_c = "UiGeneric";

  // variables
  this.m_nativeControl = null;
  this.m_propertyFunctions = null;
  this.m_dragInfo = null; // a control can have both drag info and drop info and they are in the same aggregation so keep track of them
  this.m_dropInfo = null;
};
oFF.UiGeneric.prototype = new oFF.DfUiGeneric();

oFF.UiGeneric.linkFfAndUi5Controls = function(nativeUi5Control, ffControl) {
   // link the ff control and the uicontrol usng the data "ffItem" property
  if (nativeUi5Control && ffControl) {
    nativeUi5Control._ffControl = ffControl;
  }
};

oFF.UiGeneric.getFfControl = function(nativeControl) {
   // get the firefly control which is stored on the native control as a property
  return nativeControl?._ffControl;
};

oFF.UiGeneric.getUi5IconUri = function(icon) {
  if (icon && !icon.startsWith('http')) {
    // make sure the icon is an sapui5 icon uri
    if (!ui5.sap_ui_core_IconPool.isIconURI(icon)) {
      icon = "sap-icon://" + icon
    }
    //make sure the icon actaully exists
    let iconUri = ui5.sap_ui_core_IconPool.getIconURI(icon);
    if (!iconUri) {
      iconUri = icon;
    }
    return iconUri;
  }
  return icon;
};

// ********************************************
// *** protocol *******************************
// ********************************************

oFF.UiGeneric.prototype.initializeNative = function() {
  oFF.ui.Log.logDebug("[CREATE CONTROL] " + this.getId() + " | initializing control of type " + this.getUiType().getName(), oFF.ui.Log.Colors.BLUE);
  oFF.DfUiGeneric.prototype.initializeNative.call(this);
};

oFF.UiGeneric.prototype.releaseObject = function() {
  oFF.ui.Log.logDebug("[RELEASE CONTROL] " + this.getId() + " | destroying control!", oFF.ui.Log.Colors.RED);

  // remove all browser events, those are not automatically removed
  this._detachAllBrowserEventCallbacks();

  this._cleanAllDelegatesIfNecessary();

  // unlink ff control, destroy the native control and remove reference
  if (this.m_nativeControl && this.m_nativeControl.destroy !== null) {
    if (this.m_nativeControl.ffControl) {
      delete this.m_nativeControl._ffControl;
    }
    this.m_nativeControl.destroy();
  }
  this.m_nativeControl = null;

  // super should be called at the end after the native control is destroyed
  oFF.DfUiGeneric.prototype.releaseObject.call(this);
};

oFF.UiGeneric.prototype.getNativeControl = function() {
  return this.m_nativeControl;
};

oFF.UiGeneric.prototype.getJQueryObject = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    return ui5.sap_jQuery(this.getNativeControl().getDomRef());
  }
  return ui5.sap_jQuery();
};


// ********************************************
// *** control helpers ************************
// ********************************************

oFF.UiGeneric.prototype.setNativeControl = function(nativeControl) {
  this.m_nativeControl = nativeControl;
  if (nativeControl !== null) {
    // save the firefly item on the native ui5 control as reference
    oFF.UiGeneric.linkFfAndUi5Controls(nativeControl, this);

    // adjust the busy indicator delay
    if (nativeControl.setBusyIndicatorDelay !== undefined) {
      nativeControl.setBusyIndicatorDelay(10); // default is 1000, set it to lower value
    }

    // apply a custom firefly css class to each control
    this._applyFireflyCssClass(nativeControl);

    // apply the content density classes from ui5, for mobile or desktop, depending on the browser
    this.applyContentDensity(nativeControl);

    // reset the property functions list
    this.m_propertyFunctions = {};

    // register for the on after rendering event
    nativeControl.addDelegate({
      onAfterRendering: this.onAfterControlRendering.bind(this)
    });
  }
};

//apply content density based on the style class desktop/mobile
oFF.UiGeneric.prototype.applyContentDensity = function(nativeControl) {
  if (nativeControl && nativeControl.addStyleClass !== undefined) {
    if (this.getUiStyleClass().isTypeOf(oFF.UiStyleClass.DESKTOP)) {
      nativeControl.addStyleClass("sapUiSizeCompact");
      nativeControl.removeStyleClass("sapUiSizeCozy");
    } else {
      nativeControl.addStyleClass("sapUiSizeCozy");
      nativeControl.removeStyleClass("sapUiSizeCompact");
    }
  }
};

oFF.UiGeneric.prototype.rerenderNativeControl = function() {
  if (this.getNativeControl() && this.getNativeControl().invalidate) {
    this.getNativeControl().invalidate();
  }
};

oFF.UiGeneric.prototype.getNativeDropInfo = function() {
  return this.m_dropInfo;
};

oFF.UiGeneric.prototype.getNativeDragInfo = function() {
  return this.m_dragInfo;
};

//apply custom firefly css class
oFF.UiGeneric.prototype._applyFireflyCssClass = function(nativeControl) {
  if (nativeControl) {
    const ffCssClassName = this.getUiType().getCssClassName();
    if (nativeControl.addStyleClass != null) {
      //TODO: custom control might have the style class already set in the renderer hence they are added twice, hasStyleClass does not work as it only checks against a custom css class list
      nativeControl.addStyleClass(ffCssClassName);
    } else if (nativeControl.setStyleClass != null) {
      nativeControl.setStyleClass(ffCssClassName);
    }
  }
};


// ********************************************
// *** characteristics helpers ****************
// ********************************************

//properties
oFF.UiGeneric.prototype._setPropertyNative = function(propertyName, value) {
  const setter = "set" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
  if (this.m_nativeControl && typeof this.m_nativeControl[setter] == "function") {
    this.m_nativeControl[setter](value);
  }
  return this;
};

//attributes
oFF.UiGeneric.prototype._setAttributeNative = function(attributeName, value) {
  if (this.m_nativeControl !== null && this.m_nativeControl.data !== undefined && attributeName && attributeName.length > 0) {
    attributeName = attributeName.replace("data-", ""); // ui5 automatically prepends data-
    this.m_nativeControl.data(attributeName, value, true);
    this.m_nativeControl.invalidate();
  }
  return this;
};

//aggregations
oFF.UiGeneric.prototype._addAggregationItemNative = function(aggregationName, item) {
  const adder = "add" + aggregationName.charAt(0).toUpperCase() + aggregationName.slice(1);
  if (this.m_nativeControl && typeof this.m_nativeControl[adder] == "function") {
    this.m_nativeControl[adder](item);
  }
  return this;
};

oFF.UiGeneric.prototype._removeAggregationItemNative = function(aggregationName, item) {
  const remover = "remove" + aggregationName.charAt(0).toUpperCase() + aggregationName.slice(1);
  if (this.m_nativeControl && typeof this.m_nativeControl[remover] == "function") {
    this.m_nativeControl[remover](item);
  }
  return this;
};

oFF.UiGeneric.prototype._clearAggregationNative = function(aggregationName) {
  const removerAll = "removeAll" + aggregationName.charAt(0).toUpperCase() + aggregationName.slice(1);
  if (this.m_nativeControl && typeof this.m_nativeControl[removerAll] == "function") {
    this.m_nativeControl[removerAll]();
  }
  return this;
};

//associations
oFF.UiGeneric.prototype._setAssociationElementNative = function(associationName, value) {
  this._setPropertyNative(associationName, value); // one cardinality are basically setters so proxy that as property set
  return this;
};

oFF.UiGeneric.prototype._addAssociationElementNative = function(associationName, value) {
  this._addAggregationItemNative(associationName, value); // many cardinality are basically aggregations so proxy that as aggregation add
  return this;
};

oFF.UiGeneric.prototype._removeAssociationElementNative = function(associationName, value) {
  this._removeAggregationItemNative(associationName, value); // many cardinality are basically aggregations so proxy that as aggregation remove
  return this;
};

oFF.UiGeneric.prototype._clearAssociationNative = function(associationName) {
  this._clearAggregationNative(associationName); // many cardinality are basically aggregations so proxy that as aggregation removeAll
  return this;
};

//ui5 events
oFF.UiGeneric.prototype.attachEventCallback = function(eventName, callback, ffListener) {
  if (this.getNativeControl() && eventName && callback) {
    // first dettach the event
    if (this.getNativeControl().detachEvent) {
      this.getNativeControl().detachEvent(eventName, callback, this);
    }
    // then attach a new one, only if we have a listener
    if (ffListener && this.getNativeControl().attachEvent) {
      this.getNativeControl().attachEvent(eventName, undefined, callback, this);
    }
  }
  return this;
};

// event delegates
oFF.UiGeneric.prototype.attachEventDelegate = function(delegate, ffListener) {
  if (this.getNativeControl() && delegate) {
    // first dettach the delegate
    if (this.getNativeControl().removeEventDelegate) {
      this.getNativeControl().removeEventDelegate(delegate);
    }
    // then attach a new one
    if (ffListener && this.getNativeControl().addEventDelegate) {
      this.getNativeControl().addEventDelegate(delegate, this);
    }
  }
  return this;
};

//browser events
oFF.UiGeneric.prototype.attachBrowserEventCallback = function(eventName, callback, ffListener) {
  if (this.getNativeControl() && eventName && callback) {
    // first dettach the event
    if (this.getNativeControl().detachBrowserEvent) {
      this.getNativeControl().detachBrowserEvent(eventName, callback, this);
    }
    // then attach a new one
    if (ffListener && this.getNativeControl().attachBrowserEvent) {
      this.getNativeControl().attachBrowserEvent(eventName, callback, this);
    }
  }
  return this;
};

oFF.UiGeneric.prototype._detachAllBrowserEventCallbacks = function() {
  if (this.getNativeControl() && this.getNativeControl().detachBrowserEvent) {
    this.getNativeControl().detachBrowserEvent("mouseenter", this.handleHover, this);
    this.getNativeControl().detachBrowserEvent("mouseleave", this.handleHoverEnd, this);
    this.getNativeControl().detachBrowserEvent("keydown", this.handleKeyDown, this);
    this.getNativeControl().detachBrowserEvent("keyup", this.handleKeyUp, this);
    this.getNativeControl().detachBrowserEvent("onpaste", this.handlePaste, this);
  }
};


// ********************************************
// *** Custom CSS handling ********************
// ********************************************

oFF.UiGeneric.prototype.onAfterControlRendering = function() {
  const element = this.getNativeControl().getDomRef();
  this.applyCustomCssStyling(element);
  this.applyCustomAttributes(element);
  this.applyCustomCssProperties(element);
};

oFF.UiGeneric.prototype.applyCustomCssStyling = function() {
  // implemented by child controls if styling modification is necessary
};

oFF.UiGeneric.prototype.applyCustomAttributes = function() {
  // implemented by child controls if attribute modification is necessary
};

oFF.UiGeneric.prototype.applyCustomCssProperties = function() {
  // should not be overriden by child controls, override property specific  methods instead
  // loop through all the set property functions and call them
  if (this.m_propertyFunctions) {
    const propFnNames = Object.keys(this.m_propertyFunctions);
    const propFnsLength = propFnNames.length;
    for (let i = 0; i < propFnsLength; i++) {
      const propName = propFnNames[i];
      const propFn = this.m_propertyFunctions[propName].propFn;
      const cssValue = this.m_propertyFunctions[propName].cssValue;
      this._runPropFunction(propFn, cssValue);
    }
  }
};


// ********************************************
// *** Event overrides ************************
// ********************************************

//TODO: only on button and chip right now for testing!
/*
oFF.UiGeneric.prototype.registerOnPress = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnPress.call(this, listener);
  this.getNativeControl().attachPress( this.handlePress.bind(this));
  return this;
};
*/

//ui5
oFF.UiGeneric.prototype.registerOnLiveChange = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnLiveChange.call(this, listener);
  this.attachEventCallback("liveChange", this.handleLiveChange, listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnValueHelpRequest = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnValueHelpRequest.call(this, listener);
  this.attachEventCallback("valueHelpRequest", this.handleValueHelpRequest, listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnColorSelect = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnColorSelect.call(this, listener);
  this.attachEventCallback("colorSelect", this.handleColorSelect, listener);
  return this;
};

// browser
oFF.UiGeneric.prototype.registerOnClick = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnClick.call(this, listener);
  const nativeControl = this.getNativeControl();
  if (nativeControl) {
    nativeControl.onclick = null;
    if (listener) {
      nativeControl.onclick = this.handleClick.bind(this);
    }
  }
  return this;
};

oFF.UiGeneric.prototype.registerOnDoubleClick = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDoubleClick.call(this, listener);
  if (typeof window.ontouchstart === "undefined") {
    //onDoubleClick event
    this.getNativeControl().ondblclick = null;
    if (listener) {
      this.getNativeControl().ondblclick = this.handleDoubleClick.bind(this);
    }
  } else {
    //onTap event for mobile devices emulates onDoubleClick
    this.getNativeControl().ontap = null;
    if (listener) {
      this.getNativeControl().ontap = this.handleDoubleClick.bind(this);
    }
  }
  return this;
};

oFF.UiGeneric.prototype.registerOnContextMenu = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnContextMenu.call(this, listener);
  this.getNativeControl().oncontextmenu = null;
  if (listener) {
    this.getNativeControl().oncontextmenu = this.handleContextMenu.bind(this);
  }
  return this;
};

oFF.UiGeneric.prototype.registerOnPaste = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnPaste.call(this, listener);
  this.getNativeControl().onpaste = null;
  if (listener) {
    this.getNativeControl().onpaste = this.handlePaste.bind(this);
  }
  return this;
};

oFF.UiGeneric.prototype.registerOnHover = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnHover.call(this, listener);
  this.attachBrowserEventCallback("mouseenter", this.handleHover, this);
  return this;
};

oFF.UiGeneric.prototype.registerOnHoverEnd = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnHoverEnd.call(this, listener);
  this.attachBrowserEventCallback("mouseleave", this.handleHoverEnd, this);
  return this;
};

oFF.UiGeneric.prototype.registerOnKeyDown = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnKeyDown.call(this, listener);
  this.attachBrowserEventCallback("keydown", this.handleKeyDown, this);
  return this;
};

oFF.UiGeneric.prototype.registerOnKeyUp = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnKeyUp.call(this, listener);
  this.attachBrowserEventCallback("keyup", this.handleKeyUp, this);
  return this;
};

oFF.UiGeneric.prototype.registerOnFileDrop = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnFileDrop.call(this, listener);
  this._addFileDropHandling();
  return this;
};

oFF.UiGeneric.prototype.registerOnDrop = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDrop.call(this, listener);
  if (listener) {
    this._addControlDropHandling();
  } else {
    //TODO: one of the two below methods might still be registered, so do not remove yet...
    //this._removeControlDropHandling();
  }
  return this;
};

oFF.UiGeneric.prototype.registerOnDragEnter = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDragEnter.call(this, listener);
  this._addControlDropHandling();
  return this;
};

oFF.UiGeneric.prototype.registerOnDragOver = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDragOver.call(this, listener);
  this._addControlDropHandling();
  return this;
};

oFF.UiGeneric.prototype.registerOnDragStart = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDragStart.call(this, listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnDragEnd = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnDragEnd.call(this, listener);
  return this;
};

// event delegate
oFF.UiGeneric.prototype.registerOnAfterRender = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnAfterRender.call(this, listener);
  this.attachEventDelegate(this._getAfterRenderDelegate(), listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnEditingBegin = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnEditingBegin.call(this, listener);
  this.attachEventDelegate(this._getSapFocusInDelegate(), listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnEditingEnd = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnEditingEnd.call(this, listener);
  this.attachEventDelegate(this._getSapFocusLeaveDelegate(), listener);
  return this;
};

oFF.UiGeneric.prototype.registerOnEnter = function(listener) {
  oFF.DfUiGeneric.prototype.registerOnEnter.call(this, listener);
  this.attachEventDelegate(this._getSapEnterDelegate(), listener);
  return this;
};


// ********************************************
// *** Generic Event handlers *****************
// ********************************************

oFF.UiGeneric.prototype.handlePress = function(oEvent) {
  if (this.getListenerOnPress() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
    this.getListenerOnPress().onPress(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleLiveChange = function(oEvent) {
  if (this.getListenerOnLiveChange() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
    this.getListenerOnLiveChange().onLiveChange(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleDoubleClick = function(oEvent) {
  if (this.getListenerOnDoubleClick() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlPointerEvent(this, oEvent);
    this.getListenerOnDoubleClick().onDoubleClick(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleClick = function(oEvent) {
  if (this.getListenerOnClick() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlPointerEvent(this, oEvent);
    this.getListenerOnClick().onClick(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleContextMenu = function(oEvent) {
  if (this.getListenerOnContextMenu() !== null) {
    oEvent.preventDefault(); // prevent opening the browser context menu
    oEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!

    const ffEvent = oFF.ui.FfEventUtils.prepareControlPointerEvent(this, oEvent);
    this.getListenerOnContextMenu().onContextMenu(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleHover = function(oEvent) {
  if (this.getListenerOnHover() !== null) {
    this.getListenerOnHover().onHover(oFF.UiControlEvent.create(this));
  }
};

oFF.UiGeneric.prototype.handleHoverEnd = function(oEvent) {
  if (this.getListenerOnHoverEnd() !== null) {
    this.getListenerOnHoverEnd().onHoverEnd(oFF.UiControlEvent.create(this));
  }
};

oFF.UiGeneric.prototype.handleKeyDown = function(oEvent) {
  if (this.getListenerOnKeyDown() !== null) {
    const ffKeybordEvent = oFF.ui.FfEventUtils.prepareKeyboardEvent(this, oEvent);

    // we should do that before we send the event out
    this._callPreventDefaultOrStopPropagationIfNeeded(oEvent, ffKeybordEvent);

    this.getListenerOnKeyDown().onKeyDown(ffKeybordEvent);
  }
};

oFF.UiGeneric.prototype.handleKeyUp = function(oEvent) {
  if (this.getListenerOnKeyUp() !== null) {
    const ffKeybordEvent = oFF.ui.FfEventUtils.prepareKeyboardEvent(this, oEvent);

    // we should do that before we send the event out
    this._callPreventDefaultOrStopPropagationIfNeeded(oEvent, ffKeybordEvent);

    this.getListenerOnKeyUp().onKeyUp(ffKeybordEvent);
  }
};

oFF.UiGeneric.prototype.handleValueHelpRequest = function(oEvent) {
  if (this.getListenerOnValueHelpRequest() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
    ffEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_FROM_SUGGESTIONS, !!oEvent?.getParameters?.()?.fromSuggestions);
    this.getListenerOnValueHelpRequest().onValueHelpRequest(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleColorSelect = function(oEvent) {
  if (this.getListenerOnColorSelect() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
    ffEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_DEFAULT_ACTION, !!oEvent?.getParameters?.()?.defaultAction);
    this.getListenerOnColorSelect().onColorSelect(ffEvent);
  }
};

oFF.UiGeneric.prototype.handleAfterRender = function(oEvent) {
  if (this.getListenerOnAfterRender() !== null) {
    this.getListenerOnAfterRender().onAfterRender(oFF.UiControlEvent.create(this));
  }
};

oFF.UiGeneric.prototype.handlePaste = function(oEvent) {
  if (this.getListenerOnPaste() !== null) {
    const clipboardData = oEvent.originalEvent.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text/plain");
    // i need to make a timeout so that first the data is pasted and it could be replaced afterwards
    setTimeout(() => {
      const newControlEvent = oFF.UiControlEvent.create(this);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PASTED_DATA, pastedData);
      this.getListenerOnPaste().onPaste(newControlEvent);
    }, 0);
  }
};

oFF.UiGeneric.prototype.handleOnEnter = function(oEvent) {
  if (this.getListenerOnEnter() !== null) {
    oEvent?.preventDefault?.();
    this.getListenerOnEnter().onEnter(oFF.UiControlEvent.create(this));
  }
};

oFF.UiGeneric.prototype.handleOnEditingBegin = function(oEvent) {
  if (this.getListenerOnEditingBegin() !== null) {
    this.getListenerOnEditingBegin().onEditingBegin(oFF.UiControlEvent.create(this));
  }
};

oFF.UiGeneric.prototype.handleOnEditingEnd = function(oEvent) {
  if (this.getListenerOnEditingEnd() !== null) {
    this.getListenerOnEditingEnd().onEditingEnd(oFF.UiControlEvent.create(this));
  }
};


// ********************************************
// ************* Event helpers ****************
// ********************************************

oFF.UiGeneric.prototype._cleanAllDelegatesIfNecessary = function() {
  this.m_afterRenderDelegate = null;
  this.m_sapEnterDelegate = null;
  this.m_sapFocusInDelegate = null;
  this.m_sapFocusLeaveDelegate = null;
};

oFF.UiGeneric.prototype._getAfterRenderDelegate = function() {
  if (!this.m_afterRenderDelegate) {
    this.m_afterRenderDelegate = {};
    this.m_afterRenderDelegate["onAfterRendering"] = this.handleAfterRender;
  }
  return this.m_afterRenderDelegate;
};

oFF.UiGeneric.prototype._getSapEnterDelegate = function() {
  if (!this.m_sapEnterDelegate) {
    this.m_sapEnterDelegate = {};
    this.m_sapEnterDelegate["onsapenter"] = this.handleOnEnter;
  }
  return this.m_sapEnterDelegate;
};

oFF.UiGeneric.prototype._getSapFocusInDelegate = function() {
  if (!this.m_sapFocusInDelegate) {
    this.m_sapFocusInDelegate = {};
    this.m_sapFocusInDelegate["onfocusin"] = this.handleOnEditingBegin;
  }
  return this.m_sapFocusInDelegate;
};

oFF.UiGeneric.prototype._getSapFocusLeaveDelegate = function() {
  if (!this.m_sapFocusLeaveDelegate) {
    this.m_sapFocusLeaveDelegate = {};
    this.m_sapFocusLeaveDelegate["onsapfocusleave"] = this.handleOnEditingEnd;
  }
  return this.m_sapFocusLeaveDelegate;
};

oFF.UiGeneric.prototype._callPreventDefaultOrStopPropagationIfNeeded = function(oNativeEvent, ffKeybordEvent) {
  if (this.getKeyboardConfiguration() && oNativeEvent) {
    if (this.getKeyboardConfiguration().shouldPreventDefault(ffKeybordEvent)) {
      oNativeEvent.preventDefault();
    }
    if (this.getKeyboardConfiguration().shouldStopPropagation(ffKeybordEvent)) {
      oNativeEvent.stopPropagation();
    }
  }
};


// ********************************************
// *** Properties *****************************
// ********************************************

oFF.UiGeneric.prototype.getName = function() {
  return oFF.DfUiGeneric.prototype.getName.call(this);
};

oFF.UiGeneric.prototype.setName = function(name) {
  oFF.DfUiGeneric.prototype.setName.call(this, name);
  // add firefly name as attribute (data-ff-name) to the dom element
  // required for unique element selection (id cannot be used since it is generated randomly, name can be given by the user)
  if (this.getNativeControl() !== null && name && name.length > 0) {
    this.getNativeControl().data("ff-name", name, true);
  }
  return this;
};

oFF.UiGeneric.prototype.getKey = function() {
  return oFF.DfUiGeneric.prototype.getKey.call(this);
};

oFF.UiGeneric.prototype.setKey = function(value) {
  oFF.DfUiGeneric.prototype.setKey.call(this, value);
  this._setPropertyNative("key", value);
  return this;
};

oFF.UiGeneric.prototype.getTag = function() {
  return oFF.DfUiGeneric.prototype.getTag.call(this);
};

oFF.UiGeneric.prototype.setTag = function(tag) {
  oFF.DfUiGeneric.prototype.setTag.call(this, tag);
  return this;
};

oFF.UiGeneric.prototype.getTooltip = function() {
  return oFF.DfUiGeneric.prototype.getTooltip.call(this);
};

oFF.UiGeneric.prototype.setTooltip = function(value) {
  oFF.DfUiGeneric.prototype.setTooltip.call(this, value);
  // since ui5 only accepts a string as tooltip or an configurable object inheriting from sap.ui.core.TooltipBase
  // make sure the value is either a string or null/undefined
  if (value !== null && value !== undefined) value = value.toString();
  this._setPropertyNative("tooltip", value);
  return this;
};

oFF.UiGeneric.prototype.getText = function() {
  return oFF.DfUiGeneric.prototype.getText.call(this);
};

oFF.UiGeneric.prototype.setText = function(value) {
  oFF.DfUiGeneric.prototype.setText.call(this, value);
  this._setPropertyNative("text", value);
  return this;
};

oFF.UiGeneric.prototype.getDescription = function() {
  return oFF.DfUiGeneric.prototype.getDescription.call(this);
};

oFF.UiGeneric.prototype.setDescription = function(value) {
  oFF.DfUiGeneric.prototype.setDescription.call(this, value);
  this._setPropertyNative("description", value);
  return this;
};

oFF.UiGeneric.prototype.getTitle = function() {
  return oFF.DfUiGeneric.prototype.getTitle.call(this);
};

oFF.UiGeneric.prototype.setTitle = function(value) {
  oFF.DfUiGeneric.prototype.setTitle.call(this, value);
  this._setPropertyNative("title", value);
  return this;
};

oFF.UiGeneric.prototype.getIcon = function() {
  return oFF.DfUiGeneric.prototype.getIcon.call(this);
};

oFF.UiGeneric.prototype.setIcon = function(value) {
  oFF.DfUiGeneric.prototype.setIcon.call(this, value);
  const iconUri = oFF.UiGeneric.getUi5IconUri(value);
  this._setPropertyNative("icon", iconUri);
  return this;
};

oFF.UiGeneric.prototype.getActiveIcon = function() {
  return oFF.DfUiGeneric.prototype.getActiveIcon.call(this);
};

oFF.UiGeneric.prototype.setActiveIcon = function(value) {
  oFF.DfUiGeneric.prototype.setActiveIcon.call(this, value);
  const iconUri = oFF.UiGeneric.getUi5IconUri(value);
  this._setPropertyNative("activeIcon", iconUri);
  return this;
};

oFF.UiGeneric.prototype.getLabel = function() {
  return oFF.DfUiGeneric.prototype.getLabel.call(this);
};

oFF.UiGeneric.prototype.setLabel = function(value) {
  oFF.DfUiGeneric.prototype.setLabel.call(this, value);
  this._setPropertyNative("label", value);
  return this;
};

oFF.UiGeneric.prototype.isRequired = function() {
  return oFF.DfUiGeneric.prototype.isRequired.call(this);
};

oFF.UiGeneric.prototype.setRequired = function(value) {
  oFF.DfUiGeneric.prototype.setRequired.call(this, value);
  this._setPropertyNative("required", value);
  return this;
};

oFF.UiGeneric.prototype.getValue = function() {
  return oFF.DfUiGeneric.prototype.getValue.call(this);
};

oFF.UiGeneric.prototype.setValue = function(value) {
  oFF.DfUiGeneric.prototype.setValue.call(this, value);
  this._setPropertyNative("value", value);
  return this;
};

oFF.UiGeneric.prototype.isSelected = function() {
  return oFF.DfUiGeneric.prototype.isSelected.call(this);
};

oFF.UiGeneric.prototype.setSelected = function(value) {
  oFF.DfUiGeneric.prototype.setSelected.call(this, value);
  this._setPropertyNative("selected", value);
  return this;
};

oFF.UiGeneric.prototype.isEnabled = function() {
  return oFF.DfUiGeneric.prototype.isEnabled.call(this);
};

oFF.UiGeneric.prototype.setEnabled = function(value) {
  oFF.DfUiGeneric.prototype.setEnabled.call(this, value);
  this._setPropertyNative("enabled", value);
  return this;
};

oFF.UiGeneric.prototype.isEditable = function() {
  return oFF.DfUiGeneric.prototype.isEditable.call(this);
};

oFF.UiGeneric.prototype.setEditable = function(value) {
  oFF.DfUiGeneric.prototype.setEditable.call(this, value);
  this._setPropertyNative("editable", value);
  return this;
};

oFF.UiGeneric.prototype.isExpanded = function() {
  return oFF.DfUiGeneric.prototype.isExpanded.call(this);
};

oFF.UiGeneric.prototype.setExpanded = function(value) {
  oFF.DfUiGeneric.prototype.setExpanded.call(this, value);
  this._setPropertyNative("expanded", value);
  return this;
};

oFF.UiGeneric.prototype.isExpandable = function() {
  return oFF.DfUiGeneric.prototype.isExpandable.call(this);
};

oFF.UiGeneric.prototype.setExpandable = function(value) {
  oFF.DfUiGeneric.prototype.setExpandable.call(this, value);
  this._setPropertyNative("expandable", value);
  return this;
};

oFF.UiGeneric.prototype.isVisible = function() {
  return oFF.DfUiGeneric.prototype.isVisible.call(this);
};

oFF.UiGeneric.prototype.setVisible = function(value) {
  oFF.DfUiGeneric.prototype.setVisible.call(this, value);
  this._setPropertyNative("visible", value);
  return this;
};

oFF.UiGeneric.prototype.isBusy = function() {
  return oFF.DfUiGeneric.prototype.isBusy.call(this);
};

oFF.UiGeneric.prototype.setBusy = function(value) {
  oFF.DfUiGeneric.prototype.setBusy.call(this, value);
  this._setPropertyNative("busy", value);
  return this;
};

oFF.UiGeneric.prototype.getBusyDelay = function() {
  return oFF.DfUiGeneric.prototype.getBusyDelay.call(this);
};

oFF.UiGeneric.prototype.setBusyDelay = function(value) {
  oFF.DfUiGeneric.prototype.setBusyDelay.call(this, value);
  this._setPropertyNative("busyIndicatorDelay", value);
  return this;
};

oFF.UiGeneric.prototype.setBusyIndicatorSize = function(value) {
  oFF.DfUiGeneric.prototype.setBusyIndicatorSize.call(this, value);
  const ui5BusyIndicatorSize = oFF.ui.Ui5ConstantUtils.parseBusyIndicatorSize(value);
  this._setPropertyNative("busyIndicatorSize", ui5BusyIndicatorSize);
  return this;
};

oFF.UiGeneric.prototype.getBusyIndicatorSize = function() {
  return oFF.DfUiGeneric.prototype.getBusyIndicatorSize.call(this);
};

oFF.UiGeneric.prototype.setBackgroundDesign = function(value) {
  oFF.DfUiGeneric.prototype.setBackgroundDesign.call(this, value);
  const ui5BackgroundDesign = oFF.ui.Ui5ConstantUtils.parseBackgroundDesign(value);
  this._setPropertyNative("backgroundDesign", ui5BackgroundDesign);
  return this;
};

oFF.UiGeneric.prototype.getBackgroundDesign = function() {
  return oFF.DfUiGeneric.prototype.getBackgroundDesign.call(this);
};

oFF.UiGeneric.prototype.isChecked = function() {
  return oFF.DfUiGeneric.prototype.isChecked.call(this);
};

oFF.UiGeneric.prototype.setChecked = function(value) {
  oFF.DfUiGeneric.prototype.setChecked.call(this, value);
  this._setPropertyNative("checked", value);
  return this;
};

oFF.UiGeneric.prototype.isSortable = function() {
  return oFF.DfUiGeneric.prototype.isSortable.call(this);
};

oFF.UiGeneric.prototype.setSortable = function(value) {
  oFF.DfUiGeneric.prototype.setSortable.call(this, value);
  this._setPropertyNative("sortable", value);
  return this;
};

oFF.UiGeneric.prototype.isSortable = function() {
  return oFF.DfUiGeneric.prototype.isSortable.call(this);
};

oFF.UiGeneric.prototype.setSortable = function(value) {
  oFF.DfUiGeneric.prototype.setSortable.call(this, value);
  this._setPropertyNative("sortable", value);
  return this;
};

oFF.UiGeneric.prototype.setTarget = function(value) {
  oFF.DfUiGeneric.prototype.setTarget.call(this, value);
  this._setPropertyNative("target", value);
  return this;
};

oFF.UiGeneric.prototype.getTarget = function() {
  return oFF.DfUiGeneric.prototype.getTarget.call(this);
};

oFF.UiGeneric.prototype.getChartType = function() {
  return oFF.DfUiGeneric.prototype.getChartType.call(this);
};

oFF.UiGeneric.prototype.setChartType = function(value) {
  oFF.DfUiGeneric.prototype.setChartType.call(this, value);
  this._setPropertyNative("chartType", value);
  return this;
};

oFF.UiGeneric.prototype.setDuration = function(value) {
  oFF.DfUiGeneric.prototype.setDuration.call(this, value);
  this._setPropertyNative("duration", value);
  return this;
};

oFF.UiGeneric.prototype.isShowValueHelp = function() {
  return oFF.DfUiGeneric.prototype.isShowValueHelp.call(this);
};

oFF.UiGeneric.prototype.setShowValueHelp = function(value) {
  oFF.DfUiGeneric.prototype.setShowValueHelp.call(this, value);
  this._setPropertyNative("showValueHelp", value);
  return this;
};

oFF.UiGeneric.prototype.getValueHelpIcon = function() {
  return oFF.DfUiGeneric.prototype.getValueHelpIcon.call(this);
};

oFF.UiGeneric.prototype.setValueHelpIcon = function(value) {
  oFF.DfUiGeneric.prototype.setValueHelpIcon.call(this, value);
  const iconUri = oFF.UiGeneric.getUi5IconUri(value);
  this._setPropertyNative("valueHelpIconSrc", iconUri);
  return this;
};

oFF.UiGeneric.prototype.getDuration = function() {
  return oFF.DfUiGeneric.prototype.getDuration.call(this);
};

oFF.UiGeneric.prototype.isDraggable = function() {
  return oFF.DfUiGeneric.prototype.isDraggable.call(this);
};

oFF.UiGeneric.prototype.setDraggable = function(draggable) {
  oFF.DfUiGeneric.prototype.setDraggable.call(this, draggable);
  if (draggable) {
    this._addDraggable();
  } else {
    this._removeDraggable();
  }
  return this;
};

oFF.UiGeneric.prototype.getCssClass = function() {
  return oFF.DfUiGeneric.prototype.getCssClass.call(this);
};

oFF.UiGeneric.prototype.isShowSuggestion = function() {
  return oFF.DfUiGeneric.prototype.isShowSuggestion.call(this);
};

oFF.UiGeneric.prototype.setShowSuggestion = function(value) {
  oFF.DfUiGeneric.prototype.setShowSuggestion.call(this, value);
  this._setPropertyNative("showSuggestion", value);
  return this;
};

oFF.UiGeneric.prototype.getMaxChips = function() {
  return oFF.DfUiGeneric.prototype.getMaxChips.call(this);
};

oFF.UiGeneric.prototype.setMaxChips = function(value) {
  oFF.DfUiGeneric.prototype.setMaxChips.call(this, value);
  this._setPropertyNative("maxTokens", value);
  return this;
};

oFF.UiGeneric.prototype.setInfo = function(info) {
  oFF.DfUiGeneric.prototype.setInfo.call(this, info);
  this._setPropertyNative("info", info);
  return this;
};

oFF.UiGeneric.prototype.getInfo = function() {
  return oFF.DfUiGeneric.prototype.getInfo.call(this);
};

oFF.UiGeneric.prototype.setInfoState = function(infoState) {
  oFF.DfUiGeneric.prototype.setInfoState.call(this, infoState);
  const ui5InfoState = oFF.ui.Ui5ConstantUtils.parseValueState(infoState);
  this._setPropertyNative("infoState", ui5InfoState);
  return this;
};

oFF.UiGeneric.prototype.getInfoState = function() {
  return oFF.DfUiGeneric.prototype.getInfoState.call(this);
};

oFF.UiGeneric.prototype.setInfoStateInverted = function(infoStateInverted) {
  oFF.DfUiGeneric.prototype.setInfoStateInverted.call(this, infoStateInverted);
  this._setPropertyNative("infoStateInverted", infoStateInverted);
  return this;
};

oFF.UiGeneric.prototype.isInfoStateInverted = function() {
  return oFF.DfUiGeneric.prototype.isInfoStateInverted.call(this);
};

oFF.UiGeneric.prototype.setAdaptTitleSize = function(adaptTitleSize) {
  oFF.DfUiGeneric.prototype.setAdaptTitleSize.call(this, adaptTitleSize);
  this._setPropertyNative("adaptTitleSize", adaptTitleSize);
  return this;
};

oFF.UiGeneric.prototype.isAdaptTitleSize = function() {
  return oFF.DfUiGeneric.prototype.isAdaptTitleSize.call(this);
};

oFF.UiGeneric.prototype.isShowClearIcon = function() {
  return oFF.DfUiGeneric.prototype.isShowClearIcon.call(this);
};

oFF.UiGeneric.prototype.setShowClearIcon = function(value) {
  oFF.DfUiGeneric.prototype.setShowClearIcon.call(this, value);
  this._setPropertyNative("showClearIcon", value);
  return this;
};

oFF.UiGeneric.prototype.setWrapping = function(wrapping) {
  oFF.DfUiGeneric.prototype.setWrapping.call(this, wrapping);
  this._setPropertyNative("wrapping", wrapping);
  return this;
};

oFF.UiGeneric.prototype.isWrapping = function() {
  return oFF.DfUiGeneric.prototype.isWrapping.call(this);
};

oFF.UiGeneric.prototype.setTextAlign = function(textAlign) {
  oFF.DfUiGeneric.prototype.setTextAlign.call(this, textAlign);
  const ui5TextAlign = oFF.ui.Ui5ConstantUtils.parseTextAlign(textAlign);
  this._setPropertyNative("textAlign", ui5TextAlign);
  return this;
};

oFF.UiGeneric.prototype.getTextAlign = function() {
  return oFF.DfUiGeneric.prototype.getTextAlign.call(this);
};

oFF.UiGeneric.prototype.getMaxLines = function() {
  return oFF.DfUiGeneric.prototype.getMaxLines.call(this);
};

oFF.UiGeneric.prototype.setMaxLines = function(value) {
  oFF.DfUiGeneric.prototype.setMaxLines.call(this, value);
  this._setPropertyNative("maxLines", value);
  return this;
};

oFF.UiGeneric.prototype.isAutoFocus = function() {
  return oFF.DfUiGeneric.prototype.isAutoFocus.call(this);
};

oFF.UiGeneric.prototype.setAutoFocus = function(value) {
  oFF.DfUiGeneric.prototype.setAutoFocus.call(this, value);
  this._setPropertyNative("autoFocus", value);
  return this;
};

oFF.UiGeneric.prototype.isSectionStart = function() {
  return oFF.DfUiGeneric.prototype.isSectionStart.call(this);
};

oFF.UiGeneric.prototype.setSectionStart = function(value) {
  oFF.DfUiGeneric.prototype.setSectionStart.call(this, value);
  this._setPropertyNative("startsSection", value);
  return this;
};

oFF.UiGeneric.prototype.setPlaceholder = function(value) {
  oFF.DfUiGeneric.prototype.setPlaceholder.call(this, value);
  this._setPropertyNative("placeholder", value);
  return this;
};

oFF.UiGeneric.prototype.getPlaceholder = function() {
  return oFF.DfUiGeneric.prototype.getPlaceholder.call(this);
};

oFF.UiGeneric.prototype.setMaxLength = function(value) {
  oFF.DfUiGeneric.prototype.setMaxLength.call(this, value);
  this._setPropertyNative("maxLength", value);
  return this;
};

oFF.UiGeneric.prototype.getMaxLength = function() {
  return oFF.DfUiGeneric.prototype.getMaxLength.call(this);
};

oFF.UiGeneric.prototype.setGrowing = function(value) {
  oFF.DfUiGeneric.prototype.setGrowing.call(this, value);
  this._setPropertyNative("growing", value);
  return this;
};

oFF.UiGeneric.prototype.isGrowing = function() {
  return oFF.DfUiGeneric.prototype.isGrowing.call(this);
};

oFF.UiGeneric.prototype.setRowCount = function(value) {
  oFF.DfUiGeneric.prototype.setRowCount.call(this, value);
  this._setPropertyNative("rows", value);
  return this;
};

oFF.UiGeneric.prototype.getRowCount = function() {
  return oFF.DfUiGeneric.prototype.getRowCount.call(this);
};

oFF.UiGeneric.prototype.setShowLinkIcon = function(value) {
  oFF.DfUiGeneric.prototype.setShowLinkIcon.call(this, value);
  this._setPropertyNative("showLinkIcon", value);
  return this;
};

oFF.UiGeneric.prototype.isShowLinkIcon = function() {
  return oFF.DfUiGeneric.prototype.isShowLinkIcon.call(this);
};

oFF.UiGeneric.prototype.getColorTheme = function() {
  return oFF.DfUiGeneric.prototype.getColorTheme.call(this);
};

oFF.UiGeneric.prototype.setColorTheme = function(value) {
  oFF.DfUiGeneric.prototype.setColorTheme.call(this, value);
  this._setPropertyNative("colorTheme", value);
  return this;
};

oFF.UiGeneric.prototype.isSyntaxHints = function() {
  return oFF.DfUiGeneric.prototype.isSyntaxHints.call(this);
};

oFF.UiGeneric.prototype.setSyntaxHints = function(value) {
  oFF.DfUiGeneric.prototype.setSyntaxHints.call(this, value);
  this._setPropertyNative("syntaxHints", value);
  return this;
};

oFF.UiGeneric.prototype.isEnableDefaultTitleAndDescription = function() {
  return oFF.DfUiGeneric.prototype.isEnableDefaultTitleAndDescription.call(this);
};

oFF.UiGeneric.prototype.setEnableDefaultTitleAndDescription = function(value) {
  oFF.DfUiGeneric.prototype.setEnableDefaultTitleAndDescription.call(this, value);
  this._setPropertyNative("enableDefaultTitleAndDescription", value);
  return this;
};

oFF.UiGeneric.prototype.setPrimaryCalendarType = function(value) {
  oFF.DfUiGeneric.prototype.setPrimaryCalendarType.call(this, value);
  const ui5CalendarType = oFF.ui.Ui5ConstantUtils.parseCalendarType(value);
  this._setPropertyNative("primaryCalendarType", ui5CalendarType);
  return this;
};

oFF.UiGeneric.prototype.getPrimaryCalendarType = function() {
  return oFF.DfUiGeneric.prototype.getPrimaryCalendarType.call(this);
};

oFF.UiGeneric.prototype.setSecondaryCalendarType = function(value) {
  oFF.DfUiGeneric.prototype.setSecondaryCalendarType.call(this, value);
  const ui5CalendarType = oFF.ui.Ui5ConstantUtils.parseCalendarType(value);
  this._setPropertyNative("secondaryCalendarType", ui5CalendarType);
  return this;
};

oFF.UiGeneric.prototype.getSecondaryCalendarType = function() {
  return oFF.DfUiGeneric.prototype.getSecondaryCalendarType.call(this);
};

oFF.UiGeneric.prototype.setFirstDayOfWeek = function(value) {
  oFF.DfUiGeneric.prototype.setFirstDayOfWeek.call(this, value);
  this._setPropertyNative("firstDayOfWeek", value);
  return this;
};

oFF.UiGeneric.prototype.getFirstDayOfWeek = function() {
  return oFF.DfUiGeneric.prototype.getFirstDayOfWeek.call(this);
};

oFF.UiGeneric.prototype.setShowHeader = function(value) {
  oFF.DfUiGeneric.prototype.setShowHeader.call(this, value);
  this._setPropertyNative("showHeader", value);
  return this;
};

oFF.UiGeneric.prototype.isShowHeader = function() {
  return oFF.DfUiGeneric.prototype.isShowHeader.call(this);
};

oFF.UiGeneric.prototype.setPlacement = function(value) {
  oFF.DfUiGeneric.prototype.setPlacement.call(this, value);
  const ui5PlacementType = oFF.ui.Ui5ConstantUtils.parsePlacementType(value);
  this._setPropertyNative("placement", ui5PlacementType);
  return this;
};

oFF.UiGeneric.prototype.getPlacement = function() {
  return oFF.DfUiGeneric.prototype.getPlacement.call(this);
};

oFF.UiGeneric.prototype.setShowArrow = function(value) {
  oFF.DfUiGeneric.prototype.setShowArrow.call(this, value);
  this._setPropertyNative("showArrow", value);
  return this;
};

oFF.UiGeneric.prototype.isShowArrow = function() {
  return oFF.DfUiGeneric.prototype.isShowArrow.call(this);
};

oFF.UiGeneric.prototype.setResizable = function(value) {
  oFF.DfUiGeneric.prototype.setResizable.call(this, value);
  this._setPropertyNative("resizable", value);
  return this;
};

oFF.UiGeneric.prototype.isResizable = function() {
  return oFF.DfUiGeneric.prototype.isResizable.call(this);
};

oFF.UiGeneric.prototype.setHorizontalScrolling = function(value) {
  oFF.DfUiGeneric.prototype.setHorizontalScrolling.call(this, value);
  this._setPropertyNative("horizontalScrolling", value);
  return this;
};

oFF.UiGeneric.prototype.isHorizontalScrolling = function() {
  return oFF.DfUiGeneric.prototype.isHorizontalScrolling.call(this);
};

oFF.UiGeneric.prototype.setVerticalScrolling = function(value) {
  oFF.DfUiGeneric.prototype.setVerticalScrolling.call(this, value);
  this._setPropertyNative("verticalScrolling", value);
  return this;
};

oFF.UiGeneric.prototype.isVerticalScrolling = function() {
  return oFF.DfUiGeneric.prototype.isVerticalScrolling.call(this);
};

oFF.UiGeneric.prototype.setEmphasized = function(value) {
  oFF.DfUiGeneric.prototype.setEmphasized.call(this, value);
  this._setPropertyNative("emphasized", value);
  return this;
};

oFF.UiGeneric.prototype.isEmphasized = function() {
  return oFF.DfUiGeneric.prototype.isEmphasized.call(this);
};

oFF.UiGeneric.prototype.setCarouselArrowsPlacement = function(value) {
  oFF.DfUiGeneric.prototype.setCarouselArrowsPlacement.call(this, value);
  const ui5CarouselArrowsPlacement = oFF.ui.Ui5ConstantUtils.parseCarouselArrowsPlacement(value);
  this._setPropertyNative("arrowsPlacement", ui5CarouselArrowsPlacement);
  return this;
};

oFF.UiGeneric.prototype.getCarouselArrowsPlacement = function() {
  return oFF.DfUiGeneric.prototype.getCarouselArrowsPlacement.call(this);
};

oFF.UiGeneric.prototype.isShowColon = function() {
  return oFF.DfUiGeneric.prototype.isShowColon.call(this);
};

oFF.UiGeneric.prototype.setShowColon = function(value) {
  oFF.DfUiGeneric.prototype.setShowColon.call(this, value);
  this._setPropertyNative("showColon", value);
  return this;
};

oFF.UiGeneric.prototype.getAdditionalText = function() {
  return oFF.DfUiGeneric.prototype.getAdditionalText.call(this);
};

oFF.UiGeneric.prototype.setAdditionalText = function(value) {
  oFF.DfUiGeneric.prototype.setAdditionalText.call(this, value);
  this._setPropertyNative("additionalText", value);
  return this;
};

oFF.UiGeneric.prototype.getDisplaySize = function() {
  return oFF.DfUiGeneric.prototype.getDisplaySize.call(this);
};

oFF.UiGeneric.prototype.setDisplaySize = function(value) {
  oFF.DfUiGeneric.prototype.setDisplaySize.call(this, value);
  this._setPropertyNative("customDisplaySize", oFF.ui.FfUtils.getCssString(value));
  return this;
};

oFF.UiGeneric.prototype.isModal = function() {
  return oFF.DfUiGeneric.prototype.isModal.call(this);
};

oFF.UiGeneric.prototype.setModal = function(value) {
  oFF.DfUiGeneric.prototype.setModal.call(this, value);
  this._setPropertyNative("modal", value);
  return this;
};

oFF.UiGeneric.prototype.getShortcutText = function() {
  return oFF.DfUiGeneric.prototype.getShortcutText.call(this);
};

oFF.UiGeneric.prototype.setShortcutText = function(value) {
  oFF.DfUiGeneric.prototype.setShortcutText.call(this, value);
  this._setPropertyNative("shortcutText", value);
  return this;
};

oFF.UiGeneric.prototype.getFooterText = function() {
  return oFF.DfUiGeneric.prototype.getFooterText.call(this);
};

oFF.UiGeneric.prototype.setFooterText = function(value) {
  oFF.DfUiGeneric.prototype.setFooterText.call(this, value);
  this._setPropertyNative("footerText", value);
  return this;
};

oFF.UiGeneric.prototype.getCounter = function() {
  return oFF.DfUiGeneric.prototype.getCounter.call(this);
};

oFF.UiGeneric.prototype.setCounter = function(value) {
  oFF.DfUiGeneric.prototype.setCounter.call(this, value);
  this._setPropertyNative("counter", value);
  return this;
};

oFF.UiGeneric.prototype.getHighlight = function() {
  return oFF.DfUiGeneric.prototype.getHighlight.call(this);
};

oFF.UiGeneric.prototype.setHighlight = function(value) {
  oFF.DfUiGeneric.prototype.setHighlight.call(this, value);
  this._setPropertyNative("highlight", oFF.ui.Ui5ConstantUtils.parseMessageType(value));
  return this;
};

oFF.UiGeneric.prototype.getCount = function() {
  return oFF.DfUiGeneric.prototype.getCount.call(this);
};

oFF.UiGeneric.prototype.setCount = function(value) {
  oFF.DfUiGeneric.prototype.setCount.call(this, value);
  this._setPropertyNative("count", value);
  return this;
};

oFF.UiGeneric.prototype.getMultiSelectMode = function() {
  return oFF.DfUiGeneric.prototype.getMultiSelectMode.call(this);
};

oFF.UiGeneric.prototype.setMultiSelectMode = function(value) {
  oFF.DfUiGeneric.prototype.setMultiSelectMode.call(this, value);
  this._setPropertyNative("multiSelectMode", oFF.ui.Ui5ConstantUtils.parseMultiSelectMode(value));
  return this;
};

oFF.UiGeneric.prototype.setIncludeItemInSelection = function(value) {
  oFF.DfUiGeneric.prototype.setIncludeItemInSelection.call(this, value);
  this._setPropertyNative("includeItemInSelection", value);
  return this;
};

oFF.UiGeneric.prototype.isIncludeItemInSelection = function() {
  return oFF.DfUiGeneric.prototype.isIncludeItemInSelection.call(this);
};

oFF.UiGeneric.prototype.setColors = function(value) {
  oFF.DfUiGeneric.prototype.setColors.call(this, value);
  this._setPropertyNative("colors", oFF.ui.FfUtils.convertFfListToNativeArray(value));
  return this;
};

oFF.UiGeneric.prototype.getColors = function() {
  return oFF.DfUiGeneric.prototype.getColors.call(this);
};

oFF.UiGeneric.prototype.setDefaultColorString = function(value) {
  oFF.DfUiGeneric.prototype.setDefaultColorString.call(this, value);
  this._setPropertyNative("defaultColor", value);
  return this;
};

oFF.UiGeneric.prototype.getDefaultColorString = function() {
  return oFF.DfUiGeneric.prototype.getDefaultColorString.call(this);
};

oFF.UiGeneric.prototype.setShowDefaultColorButton = function(value) {
  oFF.DfUiGeneric.prototype.setShowDefaultColorButton.call(this, value);
  this._setPropertyNative("showDefaultColorButton", value);
  return this;
};

oFF.UiGeneric.prototype.isShowDefaultColorButton = function() {
  return oFF.DfUiGeneric.prototype.isShowDefaultColorButton.call(this);
};

oFF.UiGeneric.prototype.setShowMoreColorsButton = function(value) {
  oFF.DfUiGeneric.prototype.setShowMoreColorsButton.call(this, value);
  this._setPropertyNative("showMoreColorsButton", value);
  return this;
};

oFF.UiGeneric.prototype.isShowMoreColorsButton = function() {
  return oFF.DfUiGeneric.prototype.isShowMoreColorsButton.call(this);
};

oFF.UiGeneric.prototype.setShowRecentColorsSection = function(value) {
  oFF.DfUiGeneric.prototype.setShowRecentColorsSection.call(this, value);
  this._setPropertyNative("showRecentColorsSection", value);
  return this;
};

oFF.UiGeneric.prototype.isShowRecentColorsSection = function() {
  return oFF.DfUiGeneric.prototype.isShowRecentColorsSection.call(this);
};

oFF.UiGeneric.prototype.setPriority = function(value) {
  oFF.DfUiGeneric.prototype.setPriority.call(this, value);
  const ui5Priority = oFF.ui.Ui5ConstantUtils.parsePriority(value);
  this._setPropertyNative("priority", ui5Priority);
  return this;
};

oFF.UiGeneric.prototype.getPriority = function() {
  return oFF.DfUiGeneric.prototype.getPriority.call(this);
};

oFF.UiGeneric.prototype.setShowButtons = function(value) {
  oFF.DfUiGeneric.prototype.setShowButtons.call(this, value);
  this._setPropertyNative("showButtons", value);
  return this;
};

oFF.UiGeneric.prototype.isShowButtons = function() {
  return oFF.DfUiGeneric.prototype.isShowButtons.call(this);
};

oFF.UiGeneric.prototype.setAuthor = function(value) {
  oFF.DfUiGeneric.prototype.setAuthor.call(this, value);
  this._setPropertyNative("authorName", value);
  return this;
};

oFF.UiGeneric.prototype.getAuthor = function() {
  return oFF.DfUiGeneric.prototype.getAuthor.call(this);
};

oFF.UiGeneric.prototype.setImageSrc = function(value) {
  oFF.DfUiGeneric.prototype.setImageSrc.call(this, value);
  this._setPropertyNative("authorPicture", value);
  return this;
};

oFF.UiGeneric.prototype.getImageSrc = function() {
  return oFF.DfUiGeneric.prototype.getImageSrc.call(this);
};

oFF.UiGeneric.prototype.setShowShowMoreButton = function(value) {
  oFF.DfUiGeneric.prototype.setShowShowMoreButton.call(this, value);
  this._setPropertyNative("hideShowMoreButton", !value);
  return this;
};

oFF.UiGeneric.prototype.isShowShowMoreButton = function() {
  return oFF.DfUiGeneric.prototype.isShowShowMoreButton.call(this);
};

oFF.UiGeneric.prototype.setTruncate = function(value) {
  oFF.DfUiGeneric.prototype.setTruncate.call(this, value);
  this._setPropertyNative("truncate", value);
  return this;
};

oFF.UiGeneric.prototype.isTruncate = function() {
  return oFF.DfUiGeneric.prototype.isTruncate.call(this);
};

oFF.UiGeneric.prototype.setElapsedTimeText = function(value) {
  oFF.DfUiGeneric.prototype.setElapsedTimeText.call(this, value);
  this._setPropertyNative("datetime", value);
  return this;
};

oFF.UiGeneric.prototype.getElapsedTimeText = function() {
  return oFF.DfUiGeneric.prototype.getElapsedTimeText.call(this);
};

// ********************************************
// *** Object based properties ****************
// ********************************************

oFF.UiGeneric.prototype.getDropInfo = function() {
  return oFF.DfUiGeneric.prototype.getDropInfo.call(this);
};

oFF.UiGeneric.prototype.setDropInfo = function(dropInfo) {
  oFF.DfUiGeneric.prototype.setDropInfo.call(this, dropInfo);
  if (this.m_dropInfo) {
    if (!dropInfo) {
      this.getNativeControl().removeDragDropConfig(this.m_dropInfo);
      this.m_dropInfo = null;
    } else {
      this.m_dropInfo.setDropPosition(this._getUi5DropPosition());
      this.m_dropInfo.setDropEffect(this._getUi5DropEffect());
      this.m_dropInfo.setDropLayout(this._getUi5DropLayout());
      this.m_dropInfo.setTargetAggregation(this._getUi5DropTargetAggregation());
    }
  }
  return this;
};

oFF.UiGeneric.prototype.getDropCondition = function() {
  return oFF.DfUiGeneric.prototype.getDropCondition.call(this);
};

oFF.UiGeneric.prototype.setDropCondition = function(dropCondition) {
  oFF.DfUiGeneric.prototype.setDropCondition.call(this, dropCondition);
  return this;
};

oFF.UiGeneric.prototype.getLayoutData = function() {
  return oFF.DfUiGeneric.prototype.getLayoutData.call(this);
};

oFF.UiGeneric.prototype.setLayoutData = function(layoutData) {
  oFF.DfUiGeneric.prototype.setLayoutData.call(this, layoutData);
  let nativeLayoutData = null;
  if (layoutData) {
    nativeLayoutData = oFF.ui.Ui5ObjectUtils.createNativeLayoutData(layoutData);
  }

  if (this.getNativeControl() && this.getNativeControl().setLayoutData) {
    this.getNativeControl().setLayoutData(nativeLayoutData);
  }

  return this;
};

oFF.UiGeneric.prototype.getRowMode = function() {
  return oFF.DfUiGeneric.prototype.getRowMode.call(this);
};

oFF.UiGeneric.prototype.setRowMode = function(rowMode) {
  oFF.DfUiGeneric.prototype.setRowMode.call(this, rowMode);
  let nativeRowMode = null;
  if (rowMode) {
    nativeRowMode = oFF.ui.Ui5ObjectUtils.createNativeRowMode(rowMode);
  }

  if (this.getNativeControl() && this.getNativeControl().setRowMode) {
    this.getNativeControl().setRowMode(nativeRowMode);
  }

  return this;
};

// ********************************************
// *** Property helpers ***********************
// ********************************************


// ********************************************
// *** Associations ***************************
// ********************************************

oFF.UiGeneric.prototype.getLabelFor = function() {
  return oFF.DfUiGeneric.prototype.getLabelFor.call(this);
};

oFF.UiGeneric.prototype.setLabelFor = function(value) {
  oFF.DfUiGeneric.prototype.setLabelFor.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  this._setAssociationElementNative("labelFor", nativeControl);
  return this;
};

// ---

oFF.UiGeneric.prototype.getInitialFocus = function() {
  return oFF.DfUiGeneric.prototype.getInitialFocus.call(this);
};

oFF.UiGeneric.prototype.setInitialFocus = function(value) {
  oFF.DfUiGeneric.prototype.setInitialFocus.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  this._setAssociationElementNative("initialFocus", nativeControl);
  return this;
};

// ---

oFF.UiGeneric.prototype.getLabelledBy = function() {
  return oFF.DfUiGeneric.prototype.getLabelledBy.call(this);
};

oFF.UiGeneric.prototype.addLabelledBy = function(value) {
  oFF.DfUiGeneric.prototype.addLabelledBy.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  if (nativeControl) {
    this._addAssociationElementNative("ariaLabelledBy", nativeControl);
  }
  return this;
};

oFF.UiGeneric.prototype.removeLabelledBy = function(value) {
  oFF.DfUiGeneric.prototype.removeLabelledBy.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  if (nativeControl) {
    this._removeAssociationElementNative("ariaLabelledBy", nativeControl);
  }
  return this;
};

oFF.UiGeneric.prototype.clearLabelledBy = function() {
  oFF.DfUiGeneric.prototype.clearLabelledBy.call(this);
  this._clearAssociationNative("ariaLabelledBy");
  return this;
};

// ---

oFF.UiGeneric.prototype.getDescribedBy = function() {
  return oFF.DfUiGeneric.prototype.getDescribedBy.call(this);
};

oFF.UiGeneric.prototype.addDescribedBy = function(value) {
  oFF.DfUiGeneric.prototype.addDescribedBy.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  if (nativeControl) {
    this._addAssociationElementNative("ariaDescribedBy", nativeControl);
  }
  return this;
};

oFF.UiGeneric.prototype.removeDescribedBy = function(value) {
  oFF.DfUiGeneric.prototype.removeDescribedBy.call(this, value);
  const nativeControl = value?.getNativeControl?.();
  if (nativeControl) {
    this._removeAssociationElementNative("ariaDescribedBy", nativeControl);
  }
  return this;
};

oFF.UiGeneric.prototype.clearDescribedBy = function() {
  oFF.DfUiGeneric.prototype.clearDescribedBy.call(this);
  this._clearAssociationNative("ariaDescribedBy");
  return this;
};


// ********************************************
// ****************** Methods *****************
// ********************************************

oFF.UiGeneric.prototype.destroy = function() {
  oFF.DfUiGeneric.prototype.destroy.call(this);
  return null;
};

oFF.UiGeneric.prototype.focus = function() {
  oFF.DfUiGeneric.prototype.focus.call(this);
  // UI5 takes some time to apply operations and in that time the focus won't work
  // setTimeout makes sure that the focus is set after operations.
  // e.g. setEnabled(true).focus() will not work without this.
  const myself = this;
  setTimeout(function() {
    const control = myself.getNativeControl();
    if (control && control.focus != null) {
      control.focus();
    }
  }, 0);
  return this;
};

oFF.UiGeneric.prototype.addCssClass = function(cssClass) {
  oFF.DfUiGeneric.prototype.addCssClass.call(this, cssClass);
  if (this.getNativeControl() !== null && this.getNativeControl().addStyleClass !== undefined && cssClass && cssClass.length > 0) {
    this.getNativeControl().addStyleClass(cssClass);
  }
  return this;
};

oFF.UiGeneric.prototype.removeCssClass = function(cssClass) {
  oFF.DfUiGeneric.prototype.removeCssClass.call(this, cssClass);
  if (this.getNativeControl() !== null && this.getNativeControl().removeStyleClass !== undefined && cssClass && cssClass.length > 0) {
    this.getNativeControl().removeStyleClass(cssClass);
  }
  return this;
};

oFF.UiGeneric.prototype.addAttribute = function(attributeName, value) {
  oFF.DfUiGeneric.prototype.addAttribute.call(this, attributeName, value);
  this._setAttributeNative(attributeName, value);
  return this;
};

oFF.UiGeneric.prototype.removeAttribute = function(attributeName) {
  oFF.DfUiGeneric.prototype.removeAttribute.call(this, attributeName);
  this._setAttributeNative(attributeName, null);
  return this;
};


// ********************************************
// *** Position, Size, Styling ****************
// ********************************************

oFF.UiGeneric.prototype.setX = function(x) {
  oFF.DfUiGeneric.prototype.setX.call(this, x);
  const xPosCss = this.calculatePosXCss();
  this._updateControlProperty(this.applyPosXCss, "setX", xPosCss, "x");
  return this;
};

oFF.UiGeneric.prototype.setY = function(y) {
  oFF.DfUiGeneric.prototype.setY.call(this, y);
  const yPosCss = this.calculatePosYCss();
  this._updateControlProperty(this.applyPosYCss, "setY", yPosCss, "y");
  return this;
};

oFF.UiGeneric.prototype.setWidth = function(width) {
  oFF.DfUiGeneric.prototype.setWidth.call(this, width);
  const widthCss = this.calculateWidthCss();
  this._updateControlProperty(this.applyWidthCss, "setWidth", widthCss, "width");
  return this;
};

oFF.UiGeneric.prototype.setHeight = function(height) {
  oFF.DfUiGeneric.prototype.setHeight.call(this, height);
  const heightCss = this.calculateHeightCss();
  this._updateControlProperty(this.applyHeightCss, "setHeight", heightCss, "height");
  return this;
};

oFF.UiGeneric.prototype.setMinWidth = function(minWidth) {
  oFF.DfUiGeneric.prototype.setMinWidth.call(this, minWidth);
  const minWidthCss = this.calculateMinWidthCss();
  this._updateControlProperty(this.applyMinWidthCss, "setMinWidth", minWidthCss, "minWidth");
  return this;
};

oFF.UiGeneric.prototype.setMaxWidth = function(maxWidth) {
  oFF.DfUiGeneric.prototype.setMaxWidth.call(this, maxWidth);
  const maxWidthCss = this.calculateMaxWidthCss();
  this._updateControlProperty(this.applyMaxWidthCss, "setMaxWidth", maxWidthCss, "maxWidth");
  return this;
};

oFF.UiGeneric.prototype.setMinHeight = function(minHeight) {
  oFF.DfUiGeneric.prototype.setMinHeight.call(this, minHeight);
  const minHeightCss = this.calculateMinHeightCss();
  this._updateControlProperty(this.applyMinHeightCss, "setMinHeight", minHeightCss, "minHeight");
  return this;
};

oFF.UiGeneric.prototype.setMaxHeight = function(maxHeight) {
  oFF.DfUiGeneric.prototype.setMaxHeight.call(this, maxHeight);
  const maxHeightCss = this.calculateMaxHeightCss();
  this._updateControlProperty(this.applyMaxHeightCss, "setMaxHeight", maxHeightCss, "maxHeight");
  return this;
};

oFF.UiGeneric.prototype.setFlex = function(flex) {
  oFF.DfUiGeneric.prototype.setFlex.call(this, flex);
  this._updateControlProperty(this.applyFlexCss, null, flex, "flex");
  return this;
};

oFF.UiGeneric.prototype.setAlignSelf = function(alignSelf) {
  oFF.DfUiGeneric.prototype.setAlignSelf.call(this, alignSelf);
  const alignSelfCss = this._calculateAlignSelfCss();
  this._updateControlProperty(this.applyAlignSelfCss, null, alignSelfCss, "alignSelf");
  return this;
};

oFF.UiGeneric.prototype.setOrder = function(order) {
  oFF.DfUiGeneric.prototype.setOrder.call(this, order);
  this._updateControlProperty(this.applyOrderCss, null, order, "order");
  return this;
};

oFF.UiGeneric.prototype.setPadding = function(padding) {
  oFF.DfUiGeneric.prototype.setPadding.call(this, padding);
  const paddingCss = this.calculatePaddingCss();
  this._updateControlProperty(this.applyPaddingCss, "setPadding", paddingCss, "padding");
  return this;
};

oFF.UiGeneric.prototype.setMargin = function(margin) {
  oFF.DfUiGeneric.prototype.setMargin.call(this, margin);
  const marginCss = this.calculateMarginCss();
  this._updateControlProperty(this.applyMarginCss, "setMargin", marginCss, "margin");
  return this;
};

oFF.UiGeneric.prototype.setCornerRadius = function(cornerRadius) {
  oFF.DfUiGeneric.prototype.setCornerRadius.call(this, cornerRadius);
  const cornerRadiusCss = this._calculateCornerRadiusCss();
  this._updateControlProperty(this.applyCornerRadiusCss, null, cornerRadiusCss, "cornerRadius");
  return this;
};

oFF.UiGeneric.prototype.setColor = function(color) {
  oFF.DfUiGeneric.prototype.setColor.call(this, color);
  const colorCss = this._calculateColorCss();
  this._updateControlProperty(this.applyColorCss, "setColor", colorCss, "color");
  return this;
};

oFF.UiGeneric.prototype.setBackgroundColor = function(color) {
  oFF.DfUiGeneric.prototype.setBackgroundColor.call(this, color);
  const bgColor = this._calculateBackgroundColorCss();
  this._updateControlProperty(this.applyBackgroundColorCss, "setBackgroundColor", bgColor, "backgroundColor");
  return this;
};

oFF.UiGeneric.prototype.setBackgroundImageSrc = function(imageSrc) {
  oFF.DfUiGeneric.prototype.setBackgroundImageSrc.call(this, imageSrc);
  this._updateControlProperty(this.applyBackgroundImageCss, "setBackgroundImgSrc", imageSrc, "backgroundImage");
  return this;
};

oFF.UiGeneric.prototype.setBorderStyle = function(borderStyle) {
  oFF.DfUiGeneric.prototype.setBorderStyle.call(this, borderStyle);
  const borderStyleCss = this._calculateBorderStyleCss();
  this._updateControlProperty(this.applyBorderStyleCss, null, borderStyleCss, "borderStyle");
  return this;
};

oFF.UiGeneric.prototype.setBorderWidth = function(borderWidth) {
  oFF.DfUiGeneric.prototype.setBorderWidth.call(this, borderWidth);
  const borderWidthCss = this._calculateBorderWidthCss();
  this._updateControlProperty(this.applyBorderWidthCss, null, borderWidthCss, "borderWidth");
  return this;
};

oFF.UiGeneric.prototype.setBorderColor = function(color) {
  oFF.DfUiGeneric.prototype.setBorderColor.call(this, color);
  const borderColorCss = this._calculateBorderColorCss();
  this._updateControlProperty(this.applyBorderColorCss, null, borderColorCss, "borderColor");
  return this;
};

oFF.UiGeneric.prototype.setOpacity = function(opacity) {
  oFF.DfUiGeneric.prototype.setOpacity.call(this, opacity);
  const opacityCss = this._calculateOpacityCss();
  this._updateControlProperty(this.applyOpacityCss, null, opacityCss, "opacity");
  return this;
};

oFF.UiGeneric.prototype.setRotation = function(rotation) {
  oFF.DfUiGeneric.prototype.setRotation.call(this, rotation);
  const rotationCss = this._calculateRotationCss();
  this._updateControlProperty(this.applyRotationCss, null, rotationCss, "rotation");
  return this;
};

oFF.UiGeneric.prototype.setFontColor = function(fontColor) {
  oFF.DfUiGeneric.prototype.setFontColor.call(this, fontColor);
  const fontColorCss = this._calculateFontColorCss();
  this._updateControlProperty(this.applyFontColorCss, "setColor", fontColorCss, "fontColor");
  return this;
};

oFF.UiGeneric.prototype.setFontSize = function(fontSize) {
  oFF.DfUiGeneric.prototype.setFontSize.call(this, fontSize);
  const fontSizeCss = this._calculateFontSizeCss();
  this._updateControlProperty(this.applyFontSizeCss, "setSize", fontSizeCss, "fontSize");
  return this;
};

oFF.UiGeneric.prototype.setFontStyle = function(fontStyle) {
  oFF.DfUiGeneric.prototype.setFontStyle.call(this, fontStyle);
  const fontStyleCss = this._calculateFontStyleCss();
  this._updateControlProperty(this.applyFontStyleCss, null, fontStyleCss, "fontStyle");
  return this;
};

oFF.UiGeneric.prototype.setFontWeight = function(fontWeight) {
  oFF.DfUiGeneric.prototype.setFontWeight.call(this, fontWeight);
  const fontWeightCss = this._calculateFontWeightCss();
  this._updateControlProperty(this.applyFontWeightCss, null, fontWeightCss, "fontWeight");
  return this;
};

oFF.UiGeneric.prototype.setOverflow = function(overflow) {
  oFF.DfUiGeneric.prototype.setOverflow.call(this, overflow);
  const overflowCss = this._calculateOverflowCss();
  this._updateControlProperty(this.applyOverflowCss, null, overflowCss, "overflow");
  return this;
};

oFF.UiGeneric.prototype.setTextDecoration = function(textDecoration) {
  oFF.DfUiGeneric.prototype.setTextDecoration.call(this, textDecoration);
  const textDecorationCss = this._calculateTextDecorationCss();
  this._updateControlProperty(this.applyTextDecorationCss, null, textDecorationCss, "textDecoration");
  return this;
};

oFF.UiGeneric.prototype.setIconSize = function(iconSize) {
  oFF.DfUiGeneric.prototype.setIconSize.call(this, iconSize);
  const iconSizeCss = this._calculateIconSizeCss();
  this._updateControlProperty(this.applyIconSizeCss, "setSize", iconSizeCss, "iconSize");
  return this;
};

oFF.UiGeneric.prototype.setGap = function(gap) {
  oFF.DfUiGeneric.prototype.setGap.call(this, gap);
  const gapCss = this._calculateGapCss();
  this._updateControlProperty(this.applyGapCss, "setGap", gapCss, "gap");
  return this;
};


// ************************************************
// *** css styling helpers ************************
// ************************************************

//width
oFF.UiGeneric.prototype.calculateWidthCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getWidth());
};

oFF.UiGeneric.prototype.applyWidthCss = function(element, widthCss) {
  element.style.width = widthCss;
};

//height
oFF.UiGeneric.prototype.calculateHeightCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getHeight());
};

oFF.UiGeneric.prototype.applyHeightCss = function(element, heightCss) {
  element.style.height = heightCss;
};

//min width
oFF.UiGeneric.prototype.calculateMinWidthCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getMinWidth());
};

oFF.UiGeneric.prototype.applyMinWidthCss = function(element, minWidthCss) {
  element.style.minWidth = minWidthCss;
};

//max width
oFF.UiGeneric.prototype.calculateMaxWidthCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getMaxWidth());
};

oFF.UiGeneric.prototype.applyMaxWidthCss = function(element, maxWidthCss) {
  element.style.maxWidth = maxWidthCss;
};

//min height
oFF.UiGeneric.prototype.calculateMinHeightCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getMinHeight());
};

oFF.UiGeneric.prototype.applyMinHeightCss = function(element, minHeightCss) {
  element.style.minHeight = minHeightCss;
};

//max height
oFF.UiGeneric.prototype.calculateMaxHeightCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getMaxHeight());
};

oFF.UiGeneric.prototype.applyMaxHeightCss = function(element, maxHeightCss) {
  element.style.maxHeight = maxHeightCss;
};

//pos x
oFF.UiGeneric.prototype.calculatePosXCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getX());
};

oFF.UiGeneric.prototype.applyPosXCss = function(element, xPosCss) {
  element.style.left = xPosCss;
  element.style.position = "absolute";
};

//pos y
oFF.UiGeneric.prototype.calculatePosYCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getY());
};

oFF.UiGeneric.prototype.applyPosYCss = function(element, yPosCss) {
  element.style.top = yPosCss;
  element.style.position = "absolute";
};

//padding
oFF.UiGeneric.prototype.calculatePaddingCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getPadding());
};

oFF.UiGeneric.prototype.applyPaddingCss = function(element, paddingCss) {
  element.style.padding = paddingCss;
};

//margin
oFF.UiGeneric.prototype.calculateMarginCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getMargin());
};

oFF.UiGeneric.prototype.applyMarginCss = function(element, marginCss) {
  element.style.margin = marginCss;
};

//border style
oFF.UiGeneric.prototype.applyBorderStyleCss = function(element, borderStyleCss) {
  element.style.borderStyle = borderStyleCss;
};

//border width
oFF.UiGeneric.prototype.applyBorderWidthCss = function(element, borderWidthCss) {
  element.style.borderWidth = borderWidthCss;
};

//border color
oFF.UiGeneric.prototype.applyBorderColorCss = function(element, borderColorCss) {
  element.style.borderColor = borderColorCss;
};

//corner radius
oFF.UiGeneric.prototype.applyCornerRadiusCss = function(element, cornerRadiusCss) {
  element.style.borderRadius = cornerRadiusCss;
};

//color
oFF.UiGeneric.prototype.applyColorCss = function(element, color) {
  element.style.backgroundColor = color;
};

//background color
oFF.UiGeneric.prototype.applyBackgroundColorCss = function(element, bgColor) {
  element.style.backgroundColor = bgColor;
};

// background image
oFF.UiGeneric.prototype.applyBackgroundImageCss = function(element, bgImageSrc) {
  element.style.backgroundImage = "url(" + bgImageSrc + ")";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = "cover";
};

// flex
oFF.UiGeneric.prototype.applyFlexCss = function(element, flexCss) {
  element.style.flex = flexCss;
};

//align self
oFF.UiGeneric.prototype.applyAlignSelfCss = function(element, alignSelfCss) {
  element.style.alignSelf = alignSelfCss;
};

//order
oFF.UiGeneric.prototype.applyOrderCss = function(element, orderCss) {
  element.style.order = orderCss;
};

//opacity
oFF.UiGeneric.prototype.applyOpacityCss = function(element, opacityCss) {
  element.style.opacity = opacityCss;
};

//rotation
oFF.UiGeneric.prototype.applyRotationCss = function(element, rotationCss) {
  element.style.transform = "rotate(" + rotationCss + "deg)";
};

//font color
oFF.UiGeneric.prototype.applyFontColorCss = function(element, fontColorCss) {
  element.style.color = fontColorCss;
};

//font size
oFF.UiGeneric.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  element.style.fontSize = fontSizeCss;
};

//font style
oFF.UiGeneric.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  element.style.fontStyle = fontStyleCss;
};

//font weight
oFF.UiGeneric.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  element.style.fontWeight = fontWeightCss;
};

//overflow
oFF.UiGeneric.prototype.applyOverflowCss = function(element, overflowCss) {
  element.style.overflow = overflowCss;
};

//text decoration
oFF.UiGeneric.prototype.applyTextDecorationCss = function(element, textDecorationCss) {
  element.style.textDecoration = textDecorationCss;
};

//icon size
oFF.UiGeneric.prototype.applyIconSizeCss = function(element, iconSizeCss) {
  element.style.fontSize = iconSizeCss;
};

//gap
oFF.UiGeneric.prototype.applyGapCss = function(element, gapCss) {
  element.style.gap = gapCss;
};


// *****************************************************
// *** dom css/prop helpers ****************************
// *****************************************************

oFF.UiGeneric.prototype.applyCss = function(name, value) {
  if (this.getNativeControl()) {
    const element = this.getNativeControl().getDomRef();
    if (element !== null) {
      element.style[name] = value;
    }
  }
};


// ********************************************
// *** internal css property calculation ******
// ********************************************

oFF.UiGeneric.prototype._calculateBorderWidthCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getBorderWidth());
};

oFF.UiGeneric.prototype._calculateBorderColorCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getBorderColor());
};

oFF.UiGeneric.prototype._calculateBorderStyleCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getBorderStyle());
};

oFF.UiGeneric.prototype._calculateCornerRadiusCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getCornerRadius());
};

oFF.UiGeneric.prototype._calculateColorCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getColor());
};

oFF.UiGeneric.prototype._calculateBackgroundColorCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getBackgroundColor());
};

oFF.UiGeneric.prototype._calculateAlignSelfCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getAlignSelf());
};

oFF.UiGeneric.prototype._calculateOpacityCss = function() {
  const opacityCss = this.getOpacity();
  return opacityCss;
};

oFF.UiGeneric.prototype._calculateRotationCss = function() {
  const rotationCss = this.getRotation();
  return rotationCss;
};

oFF.UiGeneric.prototype._calculateFontColorCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getFontColor());
};

oFF.UiGeneric.prototype._calculateFontSizeCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getFontSize());
};

oFF.UiGeneric.prototype._calculateFontStyleCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getFontStyle());
};

oFF.UiGeneric.prototype._calculateFontWeightCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getFontWeight());
};

oFF.UiGeneric.prototype._calculateOverflowCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getOverflow());
};

oFF.UiGeneric.prototype._calculateTextDecorationCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getTextDecoration());
};

oFF.UiGeneric.prototype._calculateIconSizeCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getIconSize());
};

oFF.UiGeneric.prototype._calculateGapCss = function() {
  return oFF.ui.FfUtils.getCssString(this.getGap());
};


// *****************************************************
// *** internal css/prop helpers ***********************
// *****************************************************

oFF.UiGeneric.prototype._updateControlProperty = function(fn, ui5FnName, cssValue, propName) {
  // only continue if native control exists
  if (this.getNativeControl()) {
    if (ui5FnName && this.getNativeControl()[ui5FnName]) {
      // first check if a native control setter method has been specified and use that
      this.getNativeControl()[ui5FnName](cssValue);
      oFF.ui.Log.logDebug("[PROP UI5 SET] " + this.getId() + " | prop: " + (propName || ui5FnName) + " val: " + cssValue, oFF.ui.Log.Colors.GREEN);
    } else if (fn) {
      // else, if a css modification function specified, use that
      // if css value specified then add the prop update, else remove it
      if (cssValue != null) {
        // add the prop function and the value
        const oldValue = this.m_propertyFunctions[propName] ? this.m_propertyFunctions[propName].cssValue : undefined;
        // only continue if new css value is not the same as the old one
        if (oldValue !== cssValue) {
          const newPropUpdateObj = {};
          newPropUpdateObj.propFn = fn;
          newPropUpdateObj.cssValue = cssValue;
          this.m_propertyFunctions[propName] = newPropUpdateObj;
          this._runPropFunction(fn, cssValue); // run the prop function once when setting the property
          oFF.ui.Log.logDebug("[PROP CSS SET] " + this.getId() + " | prop: " + (propName || ui5FnName) + " val: " + cssValue, oFF.ui.Log.Colors.GREEN);
        }
      } else {
        // delete the prop function, only if it exists
        if (this.m_propertyFunctions[propName]) {
          delete this.m_propertyFunctions[propName];
          // manually rerender (invalidate) the ui5 control to retrigger an update
          this.rerenderNativeControl();
          oFF.ui.Log.logDebug("[PROP CSS REMOVE] " + this.getId() + " | prop: " + (propName || ui5FnName), oFF.ui.Log.Colors.ORANGE);
        }
      }
    }
  }
};

oFF.UiGeneric.prototype._runPropFunction = function(fn, value) {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    if (fn) {
      const element = this.getNativeControl().getDomRef();
      fn.apply(this, [element, value]);
    }
  }
};


// ********************************************
// *** behaviour helpers **********************
// ********************************************

oFF.UiGeneric.prototype.debounce = function(fn, time) {
  let timeout;
  const myself = this;

  const cancelDebounce = function () {
    clearTimeout(timeout);
  };

  const debounceFunc = function (oEvent) {
    let eventCopy = ui5.sap_jQuery.extend({}, oEvent); // copy the event since ui5 releases the event object after the event fired, and we calling this with a delay.
    const functionCall = function () {
      fn.apply(myself, [eventCopy]);
      eventCopy = null; // release the event copy
    };
    let timeToWait = time;
    if (timeToWait instanceof Function) {
      timeToWait = timeToWait(); // time can be a function so we dynamically can pass the time value
    }
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, timeToWait);
  };

  debounceFunc.cancelDebounce = cancelDebounce;

  return debounceFunc;
};

oFF.UiGeneric.prototype.throttle = function(fn, delay) {
  let timeoutHandler = null;

  return function() {
    if (timeoutHandler == null) {
      fn.apply(this);
      timeoutHandler = setTimeout(function() {
        clearInterval(timeoutHandler);
        timeoutHandler = null;
      }, delay);
    }
  }
};


// ********************************************
// *** drag and drop helpers ******************
// ********************************************

// file drop
oFF.UiGeneric.prototype._addFileDropHandling = function() {
  // ui5 handling for file drop
  const nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    nativeControl.getMetadata().dnd.droppable = true;
    nativeControl.addDragDropConfig(new ui5.sap_ui_core_dnd_DropInfo({
      drop: (oEvent) => {
        oEvent.preventDefault();
        let oBrowserEvent = oEvent.getParameter("browserEvent");
        oBrowserEvent.stopPropagation();
        let files = oBrowserEvent.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          let reader = new FileReader();
          reader.onload = (event) => {
            // onFileDrop event
            this._fireOnFileDropEventIfPossible(file.name, file.type, null, event.target.result, file.size, file.lastModified, false);
          };
          reader.onerror = (event) => {
            // when try to read a folder the FileReader will throw an error
            // onFileDrop event
            this._fireOnFileDropEventIfPossible(file.name, "folder", null, null, file.size, file.lastModified, true);
          };
          //console.log(file);
          //console.log(file.type);
          reader.readAsArrayBuffer(file);
        }
      },
      dragOver: (oEvent) => {
        // just prevent default and stop propagation
        oEvent.preventDefault();
        const oBrowserEvent = oEvent.getParameter("browserEvent");
        oBrowserEvent.stopPropagation();
      },
      dragEnter: (oEvent) => {
        const oDragSession = oEvent.getParameter("dragSession");
        const oDraggedControl = oDragSession.getDragControl();
        if (oDraggedControl || oEvent.getParameters().browserEvent.dataTransfer.types.indexOf("sac-grid-drag-data") > -1) {
          oEvent.preventDefault();
          const oBrowserEvent = oEvent.getParameter("browserEvent");
          oBrowserEvent.stopPropagation();
        }
      }
    }));
  }
};

oFF.UiGeneric.prototype._fireOnFileDropEventIfPossible = function(fileName, fileType, fileContentStr, nativeByteArray, fileSize, lastModified, isDirectory) {
  if (this.getListenerOnFileDrop() !== null) {
    const ffEvent = oFF.ui.FfEventUtils.prepareFileEvent(this, fileName, fileType, fileContentStr, nativeByteArray, fileSize, lastModified, isDirectory);
    this.getListenerOnFileDrop().onFileDrop(ffEvent);
  }
};

// control drop
oFF.UiGeneric.prototype._addControlDropHandling = function() {
  // ui5 handling for control drop
  const myself = this;
  const nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    nativeControl.getMetadata().dnd.droppable = true;
    if (!this.m_dropInfo) {
      const DROP_INFO_CLASS = this.getDropInfoClass();
      this.m_dropInfo = new DROP_INFO_CLASS({
        dropPosition: this._getUi5DropPosition(),
        dropEffect: this._getUi5DropEffect(),
        dropLayout: this._getUi5DropLayout(),
        targetAggregation: this._getUi5DropTargetAggregation(),
        drop: this.handleControlDrop.bind(this),
        dragOver: this.handleControlDragOver.bind(this),
        dragEnter: this.handleControlDragEnter.bind(this)
      });
      nativeControl.addDragDropConfig(this.m_dropInfo);
    }
  }
};

oFF.UiGeneric.prototype.getDropInfoClass = function() {
  // Grid container provides its own specific drop info class
  return ui5.sap_ui_core_dnd_DropInfo;
};

oFF.UiGeneric.prototype._removeControlDropHandling = function() {
  // ui5 handling for removing a control control drop
  const nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.removeAllDragDropConfig) {
    //we should remove the drop info to disable droping
    if (this.m_dropInfo) {
      nativeControl.removeDragDropConfig(this.m_dropInfo);
      this.m_dropInfo = null;
    }
  }
};

oFF.UiGeneric.prototype._fireOnDropEventIfPossible = function(nativeDraggedControl, nativeDroppedControl, relativeDropPositionStr, params) {
  if (this.getListenerOnDrop() !== null) {
    const draggedControl = oFF.UiGeneric.getFfControl(nativeDraggedControl);
    const droppedControl = oFF.UiGeneric.getFfControl(nativeDroppedControl);
    const relativeDropPos = oFF.UiRelativeDropPosition.lookup(relativeDropPositionStr);
    const newDropEvent = oFF.UiDropEvent.create(this);
    if (params) {
      newDropEvent.getProperties().putAll(params);
    }
    newDropEvent.setDropData(draggedControl, droppedControl, relativeDropPos);
    this.getListenerOnDrop().onDrop(newDropEvent);
  }
};

oFF.UiGeneric.prototype._fireOnDragEnterEventIfPossible = function(nativeDraggedControl) {
  if (this.getListenerOnDragEnter() !== null) {
    const newDragEvent = oFF.UiDragEvent.create(this);
    const draggedControl = oFF.UiGeneric.getFfControl(nativeDraggedControl);
    newDragEvent.setDragData(draggedControl);
    this.getListenerOnDragEnter().onDragEnter(newDragEvent);
  }
};

oFF.UiGeneric.prototype._fireOnDragOverEventIfPossible = function(nativeDraggedControl) {
  if (this.getListenerOnDragOver() !== null) {
    const newDragEvent = oFF.UiDragEvent.create(this);
    const draggedControl = oFF.UiGeneric.getFfControl(nativeDraggedControl);
    newDragEvent.setDragData(draggedControl);
    this.getListenerOnDragOver().onDragOver(newDragEvent);
  }
};

// drag helpers
oFF.UiGeneric.prototype._addDraggable = function() {
  // ui5 handling for setting a control draggable
  const myself = this;
  const nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.addDragDropConfig) {
    if (!nativeControl.getMetadata().dnd.draggable) {
      // some controls are "officially" not allowed to be draggable (example: custom controls), in that case let's force them!
      // it is questionable if we should force all controls to be draggable, as this affects also control which are used outside of firefly ui
      nativeControl.getMetadata().dnd.draggable = true;
    }
    // add only once
    if (!this.m_dragInfo) {
      this.m_dragInfo = new ui5.sap_ui_core_dnd_DragInfo({
        dragStart: function(oEvent) {
          //console.log("dragStart");
          myself._fireOnDragStartEventIfPossible();
        },
        dragEnd: function(oEvent) {
          //console.log("dragEnd");
          myself._fireOnDragEndEventIfPossible();
        }
      });
      nativeControl.addDragDropConfig(this.m_dragInfo);
    }
  }
};

oFF.UiGeneric.prototype._removeDraggable = function() {
  // ui5 handling for removing a control draggable
  const nativeControl = this.getNativeControl();
  if (nativeControl && nativeControl.getMetadata && nativeControl.getMetadata().dnd && nativeControl.removeAllDragDropConfig) {
    //we should remove the drag info to disable dragging
    if (this.m_dragInfo) {
      nativeControl.removeDragDropConfig(this.m_dragInfo);
      this.m_dragInfo = null;
    }
  }
};

oFF.UiGeneric.prototype._fireOnDragStartEventIfPossible = function() {
  if (this.getListenerOnDragStart() !== null) {
    const newControlEvent = oFF.UiControlEvent.create(this);
    this.getListenerOnDragStart().onDragStart(newControlEvent);
  }
};

oFF.UiGeneric.prototype._fireOnDragEndEventIfPossible = function() {
  if (this.getListenerOnDragEnd() !== null) {
    const newControlEvent = oFF.UiControlEvent.create(this);
    this.getListenerOnDragEnd().onDragEnd(newControlEvent);
  }
};

// drop info helpers
oFF.UiGeneric.prototype._getUi5DropPosition = function() {
  return oFF.ui.Ui5ConstantUtils.parseDropPosition(this.getDropInfo()?.getDropPosition?.());
};

oFF.UiGeneric.prototype._getUi5DropEffect = function() {
  return oFF.ui.Ui5ConstantUtils.parseDropEffect(this.getDropInfo()?.getDropEffect?.());
};

oFF.UiGeneric.prototype._getUi5DropLayout = function() {
  return oFF.ui.Ui5ConstantUtils.parseDropLayout(this.getDropInfo()?.getDropLayout?.());
};

oFF.UiGeneric.prototype._getUi5DropTargetAggregation = function() {
  const ffDropInfo = this.getDropInfo();
  let ui5TargetAggregation = null;
  if (ffDropInfo) {
    const ffTargetAggregation = ffDropInfo.getTargetAggregation();
    if (ffTargetAggregation === oFF.UiAggregation.ITEMS) {
      ui5TargetAggregation = "items";
    }
  }
  return ui5TargetAggregation;
};

oFF.UiGeneric.prototype._isDropAllowedForUiElement = function(nativeDraggedControl) {
  const uiElement = oFF.UiGeneric.getFfControl(nativeDraggedControl);
  const dropCondition = this.getDropCondition();
  if (dropCondition) {
    return dropCondition.isDropAllowed(uiElement);
  }
  return true; // no drop condtion specified, allow all
};

oFF.UiGeneric.prototype.handleControlDrop = function(oEvent) {
  //console.log("dropped");
  const nativeDraggedControl = oEvent.getParameters().draggedControl;
  const nativeDroppedControl = oEvent.getParameters().droppedControl;
  const relativeDropPositionStr = oEvent.getParameters().dropPosition;
  // at least dragged control needs to be there!
  if (nativeDraggedControl) {
    this._fireOnDropEventIfPossible(nativeDraggedControl, nativeDroppedControl, relativeDropPositionStr, null);
  }
};

oFF.UiGeneric.prototype.handleControlDragOver = function(oEvent) {
  //  console.log("dragOver");
  const oDragSession = oEvent.getParameter("dragSession");
  const nativeDraggedControl = oDragSession.getDragControl();
  this._fireOnDragOverEventIfPossible(nativeDraggedControl);
};

oFF.UiGeneric.prototype.handleControlDragEnter = function(oEvent) {
  //    console.log("dragEnter");
  const oDragSession = oEvent.getParameter("dragSession");
  const oDraggedControl = oDragSession.getDragControl();
  // if no drag control present then it is probably not a ui5 drag event (maybe file drag event or sactable)
  if (!oDraggedControl) {
    oEvent.preventDefault();
    return;
  }
  // check if the dragged control is allowed to be dropped
  if (!this._isDropAllowedForUiElement(oDraggedControl)) {
    oEvent.preventDefault();
  }

  this._fireOnDragEnterEventIfPossible(oDraggedControl);
};

class UiListItemBase extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiListItemBase";
  }

  //Base classes should have no newInstance method

  initializeNative() {
    super.initializeNative();
  }

  releaseObject() {
    super.releaseObject();
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    //on press only works when list item type is not inactive
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  registerOnDetailPress(listener) {
    super.registerOnDetailPress(listener);
    this.attachEventCallback("detailPress", this._handleDetailPress, listener);
    return this;
  }

  // ======================================

  isSelected() {
    return this.getNativeControl().isSelected();
  }

  getCounter() {
    return this.getNativeControl().getCounter();
  }

  setListItemType(listItemType) {
    super.setListItemType(listItemType);
    this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseListItemType(listItemType));
    return this;
  };

  getListItemType() {
    return super.getListItemType();
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleDetailPress(oEvent) {
    if (this.getListenerOnDetailPress() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnDetailPress().onDetailPress(ffEvent);
    }
  }

}

oFF.UiListItemBase = UiListItemBase;

class UiTreeItemBaseLegacy extends oFF.UiListItemBase {
  constructor() {
    super();
    this._ff_c = "UiTreeItemBaseLegacy";
  }

  //Base classes should have no newInstance method

  initializeNative() {
    super.initializeNative();
  }

  releaseObject() {
    super.releaseObject();
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    this.createTreeModel();
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    this.createTreeModel();
    return this;
  }

  removeItem(item) {
    super.removeItem(item);
    this.createTreeModel();
    return this;
  }

  clearItems() {
    super.clearItems();
    this.createTreeModel();
    return this;
  }

  // ======================================

  setExpanded(expanded) {
    super.setExpanded(expanded);
    if (expanded === true) {
      this.expandNativeItem(this);
    } else {
      this.collapseNativeItem(this);
    }
    return this;
  }

  isExpanded() {
    if (this.getNativeControl()) {
      return this.getNativeControl().getExpanded();
    }
    return super.isExpanded();
  }

  setNode(node) {
    super.setNode(node);
    // this is a hack, and it does not work perfect
    // there is no way to do that in an offical way, this is the only way i currently found
    if (node) {
      this.getNativeControl()?.ui5.sap_jQuery().removeClass("sapMTreeItemBaseLeaf");
    } else {
      this.getNativeControl()?.ui5.sap_jQuery().addClass("sapMTreeItemBaseLeaf");
    }
    return this;
  }

  isNode() {
    if (this.getNativeControl()) {
      return !this.getNativeControl().isLeaf();
    }
    return super.isExpanded();
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  createTreeModel() {
    this.getParent()?.createTreeModel();
  }

  expandNativeItem(item) {
    this.getParent()?.expandNativeItem(item);
  }

  collapseNativeItem(item) {
    this.getParent()?.collapseNativeItem(item);
  }

  rerenderNativeTreeItem() {
    if (this.getNativeControl()) {
      this.getNativeControl().destroy();
      //this.setNativeControl(null);
    }
    this.initializeNative();
    // i need to do this to make sure that newly created items have the same data
    // those controls are constantly re-rendered!
    this.setEnabled(this.isEnabled());
    this.setHighlight(this.getHighlight());
    this.setSelected(this.isSelected());
    this.setVisible(this.isVisible());
    this.setBusy(this.isBusy());
    this.setListItemType(this.getListItemType());
    this.setCounter(this.getCounter());
    this.registerOnPress(this.getListenerOnPress());
    this.registerOnDetailPress(this.getListenerOnDetailPress());
    this.registerOnContextMenu(this.getListenerOnContextMenu());
  }

  itemExpanded() {
    if (this.getListenerOnExpand() !== null) {
      const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, this);
      this.getListenerOnExpand().onExpand(newItemEvent);
    }
  }

  itemCollapsed() {
    if (this.getListenerOnCollapse() !== null) {
      const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, this);
      this.getListenerOnCollapse().onCollapse(newItemEvent);
    }
  }

  // Event handlers
  // ======================================

}

oFF.UiTreeItemBaseLegacy = UiTreeItemBaseLegacy;

class UiTreeItemBase extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTreeItemBase";
  }

//Base classes should not have newInstance method

  initializeNative() {
    super.initializeNative();
  }

  releaseObject() {
    super.releaseObject();
  }

// ======================================

  _addEvents(nativeControl) {
    const myself = this;

    // onDetailClick event
    nativeControl.attachDetailClick(function (oControlEvent) {
      const listenerOnDetailPress = myself.getListenerOnDetailPress();
      if (listenerOnDetailPress !== null) {
        listenerOnDetailPress.onDetailPress(oFF.UiControlEvent.create(myself));
      }
    });
  }

// ======================================

  addItem(item) {
    super.addItem(item);
    const nativeItem = item.getNativeControl();
    this.getNativeControl().addItem(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    const nativeItem = item.getNativeControl();
    this.getNativeControl().addItem(nativeItem, index);
    return this;
  }

  removeItem(item) {
    super.removeItem(item);
    const nativeItem = item.getNativeControl();
    this.getNativeControl().removeItem(nativeItem);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

// ======================================

  setExpanded(expanded) {
    super.setExpanded(expanded);
    if (expanded === true) {
      this.expandNativeItem(this);
    } else {
      this.collapseNativeItem(this);
    }
    return this;
  }

  isExpanded() {
    if (this.getNativeControl()) {
      return this.getNativeControl().getExpanded();
    }
    return super.isExpanded();
  }

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

  applyCustomAttributes(element) {
    const parent = this.getParent();
    if (parent != null) {
      // Calculate the level attribute based on parent tree item.
      // If not set explicitly, all child nodes appear at default level and not hierarchically under its parent visually.
      const parentLevel = ui5.sap_jQuery("#" + parent.getId()).attr("level") || "1";
      const level = parseInt(parentLevel) + 1;
      ui5.sap_jQuery(element).attr("level", level);
    }
  }

// Helpers
// ======================================

  expandNativeItem(item) {
    if (this.getParent()) {
      this.getParent().expandNativeItem(item);
    }
  }

  collapseNativeItem(item) {
    if (this.getParent()) {
      this.getParent().collapseNativeItem(item);
    }
  }

  itemExpanded() {
    if (this.getListenerOnExpand() !== null) {
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.setItemData(this);
      this.getListenerOnExpand().onExpand(newItemEvent);
    }
  }

  itemCollapsed() {
    if (this.getListenerOnCollapse() !== null) {
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.setItemData(this);
      this.getListenerOnCollapse().onCollapse(newItemEvent);
    }
  }
}

oFF.UiTreeItemBase = UiTreeItemBase;

oFF.UiComboBoxBase = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiComboBoxBase";
};
oFF.UiComboBoxBase.prototype = new oFF.UiGeneric();

//Base classes should have no newInstance method

oFF.UiComboBoxBase.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
};

oFF.UiComboBoxBase.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiComboBoxBase.prototype.registerOnSelectionChange = function(listener) {
  oFF.UiGeneric.prototype.registerOnSelectionChange.call(this, listener);
  this.getNativeControl().detachSelectionChange(this.handleSelectionChange, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachSelectionChange(this.handleSelectionChange, this);
  }
  return this;
};

oFF.UiComboBoxBase.prototype.registerOnEnter = function(listener) {
  oFF.UiGeneric.prototype.registerOnEnter.call(this, listener);
  this.getNativeControl().addEventDelegate({
    onsapenter: this.handleOnEnter.bind(this)
  });
  return this;
};

oFF.UiComboBoxBase.prototype.registerOnEditingBegin = function(listener) {
  oFF.UiGeneric.prototype.registerOnEditingBegin.call(this, listener);
  this.getNativeControl().addEventDelegate({
    onfocusin: this.handleOnEditingBegin.bind(this)
  });
  return this;
};

oFF.UiComboBoxBase.prototype.registerOnEditingEnd = function(listener) {
  oFF.UiGeneric.prototype.registerOnEditingEnd.call(this, listener);
  this.getNativeControl().addEventDelegate({
    onsapfocusleave: this.handleOnEditingEnd.bind(this)
  });
  return this;
};

// ======================================

oFF.UiComboBoxBase.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  const nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiComboBoxBase.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  const nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiComboBoxBase.prototype.removeItem = function(item) {
  const nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiComboBoxBase.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiComboBoxBase.prototype.open = function() {
  oFF.UiGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

oFF.UiComboBoxBase.prototype.close = function() {
  oFF.UiGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

oFF.UiComboBoxBase.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

oFF.UiComboBoxBase.prototype.setValue = function(value) {
  oFF.DfUiGeneric.prototype.setValue.call(this, value); // skip superclass implementation
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiComboBoxBase.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

oFF.UiComboBoxBase.prototype.setPlaceholder = function(placeholder) {
  oFF.UiGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

oFF.UiComboBoxBase.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

oFF.UiComboBoxBase.prototype.setRequired = function(required) {
  oFF.UiGeneric.prototype.setRequired.call(this, required);
  return this;
};

oFF.UiComboBoxBase.prototype.isRequired = function() {
  return oFF.UiGeneric.prototype.isRequired.call(this);
};

oFF.UiComboBoxBase.prototype.setValueState = function(valueState) {
  oFF.UiGeneric.prototype.setValueState.call(this, valueState);
  this.getNativeControl().setValueState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
  return this;
};

oFF.UiComboBoxBase.prototype.getValueState = function() {
  return oFF.UiGeneric.prototype.getValueState.call(this);
};

oFF.UiComboBoxBase.prototype.setValueStateText = function(valueStateText) {
  oFF.UiGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

oFF.UiComboBoxBase.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

oFF.UiComboBoxBase.prototype.setShowSecondaryValues = function(showSecondaryValues) {
  oFF.UiGeneric.prototype.setShowSecondaryValues.call(this, showSecondaryValues);
  this.getNativeControl().setShowSecondaryValues(showSecondaryValues);
  return this;
};

oFF.UiComboBoxBase.prototype.isShowSecondaryValues = function() {
  return this.getNativeControl().getShowSecondaryValues();
};

oFF.UiComboBoxBase.prototype.setEditable = function(editable) {
  oFF.UiGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

oFF.UiComboBoxBase.prototype.isEditable = function() {
  return oFF.UiGeneric.prototype.isEditable.call(this);
};

// Overrides
// ======================================

oFF.UiComboBoxBase.prototype.setHeight = function(height) {
  // remove height from the object
  // don't change the Combobox height on JavaScript, it should only be done on iOS
  oFF.UiGeneric.prototype.setHeight.call(this, null);
  return this;
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiComboBoxBase.prototype.handleSelectionChange = function(oEvent) {
  // needs to be implemented by subclasses
};

oFF.UiComboBoxBase.prototype.handleOnEnter = function(oEvent) {
  if (this.getListenerOnEnter() !== null) {
    this.getListenerOnEnter().onEnter(oFF.UiControlEvent.create(this));
  }
};

oFF.UiComboBoxBase.prototype.handleOnEditingBegin = function(oEvent) {
  if (this.getListenerOnEditingBegin() !== null) {
    this.getListenerOnEditingBegin().onEditingBegin(oFF.UiControlEvent.create(this));
  }
};

oFF.UiComboBoxBase.prototype.handleOnEditingEnd = function(oEvent) {
  if (this.getListenerOnEditingEnd() !== null) {
    this.getListenerOnEditingEnd().onEditingEnd(oFF.UiControlEvent.create(this));
  }
};

class UiDropDownItemBase extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiDropDownItemBase";
  }

  //Base classes should have no newInstance method

  initializeNative() {
    super.initializeNative();
  }

  releaseObject() {
    super.releaseObject();
  }

  // Overrides
  // ======================================

  setVisible(value) {
    oFF.DfUiGeneric.prototype.setVisible.call(this, value); // skip generic implementation, different prop name
    this.getNativeControl().setEnabled(value);
    return this;
  }

}

oFF.UiDropDownItemBase = UiDropDownItemBase;

oFF.UiTileBase = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTileBase";
};
oFF.UiTileBase.prototype = new oFF.UiGeneric();

//Base classes should have no newInstance method

oFF.UiTileBase.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
};

oFF.UiTileBase.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

//TODO: currently only button and this class use this (and subclass), see UxButton class
oFF.UiTileBase.prototype.registerOnPress = function(listener) {
  oFF.UiGeneric.prototype.registerOnPress.call(this, listener);
  this.getNativeControl().detachPress(this.handlePress, this);
  if (listener) {
    this.getNativeControl().attachPress(this.handlePress, this);
  }
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiListBase = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiListBase";
};
oFF.UiListBase.prototype = new oFF.UiGeneric();

//Base classes should have no newInstance method

oFF.UiListBase.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
};

oFF.UiListBase.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiListBase.prototype.registerOnSelect = function(listener) {
  oFF.UiGeneric.prototype.registerOnSelect.call(this, listener);
  this.getNativeControl().detachSelectionChange(this.handleSelect, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachSelectionChange(this.handleSelect, this);
  }
  return this;
};

oFF.UiListBase.prototype.registerOnSelectionChange = function(listener) {
  oFF.UiGeneric.prototype.registerOnSelectionChange.call(this, listener);
  this.getNativeControl().detachSelectionChange(this.handleSelectionChange, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachSelectionChange(this.handleSelectionChange, this);
  }
  return this;
};

oFF.UiListBase.prototype.registerOnDelete = function(listener) {
  oFF.UiGeneric.prototype.registerOnDelete.call(this, listener);
  this.getNativeControl().detachDelete(this.handleDelete, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachDelete(this.handleDelete, this);
  }
  return this;
};

oFF.UiListBase.prototype.registerOnScrollLoad = function(listener) {
  oFF.UiListBase.prototype.registerOnScrollLoad.call(this, listener);
  this.getNativeControl().addDelegate({
    onAfterRendering: this.handleScrollLoad.bind(this)
  });
  return this;
};

// ======================================

oFF.UiListBase.prototype.scrollToIndex = function(index) {
  oFF.UiGeneric.prototype.scrollToIndex.call(this, index);
  this.getNativeControl().scrollToIndex(index);
  return this;
};

// ======================================

oFF.UiListBase.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  const nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiListBase.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  const nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiListBase.prototype.removeItem = function(item) {
  const nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiListBase.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiListBase.prototype.getSelectedItem = function() {
  const selectedItem = this.getNativeControl().getSelectedItem();
  if (selectedItem != null) {
    return oFF.UiGeneric.getFfControl(selectedItem);
  }
  return null;
};

oFF.UiListBase.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    const nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.clearSelectedItems();
  }
  return this;
};

oFF.UiListBase.prototype.getSelectedItems = function() {
  const oList = oFF.XList.create();
  const aSelectedItems = this.getNativeControl().getSelectedItems();
  for (let i = 0; i < aSelectedItems.length; i++) {
    const ffControl = oFF.UiGeneric.getFfControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

oFF.UiListBase.prototype.setSelectedItems = function(items) {
  oFF.UiGeneric.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().removeSelections();
  if (items !== null) {
    const size = items.size();
    for (let i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

oFF.UiListBase.prototype.addSelectedItem = function(item) {
  oFF.UiGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), true);
  }
  return this;
};

oFF.UiListBase.prototype.removeSelectedItem = function(item) {
  oFF.UiGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), false);
  }
  return this;
};

oFF.UiListBase.prototype.clearSelectedItems = function() {
  oFF.UiGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

oFF.UiListBase.prototype.setHeaderToolbar = function(headerToolbar) {
  oFF.UiGeneric.prototype.setHeaderToolbar.call(this, headerToolbar);
  if (headerToolbar != null) {
    const nativeToolbar = headerToolbar.getNativeControl();
    this.getNativeControl().setHeaderToolbar(nativeToolbar);
  } else {
    this.getNativeControl().setHeaderToolbar(null);
  }
  return this;
};

oFF.UiListBase.prototype.getHeaderToolbar = function() {
  return oFF.UiGeneric.prototype.getHeaderToolbar.call(this);
};

// ======================================

oFF.UiListBase.prototype.setSelectionMode = function(selectionMode) {
  oFF.UiGeneric.prototype.setSelectionMode.call(this, selectionMode);
  this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseSelectionMode(selectionMode));
  return this;
};

oFF.UiListBase.prototype.getSelectionMode = function() {
  return oFF.UiGeneric.prototype.getSelectionMode.call(this);
};

oFF.UiListBase.prototype.setBusy = function(busy) {
  oFF.UiGeneric.prototype.setBusy.call(this, busy);
  return this;
};

oFF.UiListBase.prototype.isBusy = function() {
  return oFF.UiGeneric.prototype.isBusy.call(this);
};

oFF.UiListBase.prototype.setNoDataText = function(noDataText) {
  oFF.UiGeneric.prototype.setNoDataText.call(this, noDataText);
  this.getNativeControl().setNoDataText(noDataText);
  return this;
};

oFF.UiListBase.prototype.getNoDataText = function() {
  return oFF.UiGeneric.prototype.getNoDataText.call(this);
};

oFF.UiListBase.prototype.setOverflow = function(overflow) {
  oFF.UiGeneric.prototype.setOverflow.call(this, overflow);
  return this;
};

oFF.UiListBase.prototype.getOverflow = function() {
  return oFF.UiGeneric.prototype.getOverflow.call(this);
};

oFF.UiListBase.prototype.setShowNoData = function(showNoData) {
  oFF.UiGeneric.prototype.setShowNoData.call(this, showNoData);
  this.getNativeControl().setShowNoData(showNoData);
  return this;
};

oFF.UiListBase.prototype.isShowNoData = function() {
  return this.getNativeControl().getShowNoData();
};

oFF.UiListBase.prototype.setListSeparators = function(listSeparators) {
  oFF.UiGeneric.prototype.setListSeparators.call(this, listSeparators);
  this.getNativeControl().setShowSeparators(oFF.ui.Ui5ConstantUtils.parseListSeparators(listSeparators));
  return this;
};

oFF.UiListBase.prototype.getListSeparators = function() {
  return oFF.UiGeneric.prototype.getListSeparators.call(this);
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiListBase.prototype.handleSelect = function(oControlEvent) {
  const isSelect = oControlEvent.getParameters().selected;
  if (isSelect === true) {
    if (this.getListenerOnSelect() !== null) {
      const listItem = oControlEvent.getParameters().listItem;
      const selectedFfItem = oFF.UiGeneric.getFfControl(listItem);
      const newSelectionEvent = oFF.UiSelectionEvent.create(this)
      newSelectionEvent.setSingleSelectionData(selectedFfItem);
      this.getListenerOnSelect().onSelect(newSelectionEvent);
    }
  }
};

oFF.UiListBase.prototype.handleSelectionChange = function(oControlEvent) {
  if (this.getListenerOnSelectionChange() !== null) {
    const listItem = oControlEvent.getParameters().listItem;
    const isSelect = oControlEvent.getParameters().selected;
    const isSelectAll = oControlEvent.getParameters().selectAll && isSelect;
    const isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().listItems.length > 1); // deselctAll is when listItems length is graeter then 1

    const selectedFfItem = oFF.UiGeneric.getFfControl(listItem);

    const newSelectionEvent = oFF.UiSelectionEvent.create(this);
    newSelectionEvent.setSingleSelectionData(selectedFfItem);
    newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT, isSelect);
    newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT_ALL, isSelectAll);
    newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_DESELECT_ALL, isDeselectAll);
    this.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
  }
};

oFF.UiListBase.prototype.handleDelete = function(oControlEvent) {
  if (this.getListenerOnDelete() !== null) {
    const nativeItem = oControlEvent.getParameters().listItem;
    const deletedItem = oFF.UiGeneric.getFfControl(nativeItem);
    const newItemEvent = oFF.UiItemEvent.create(this);
    newItemEvent.setItemData(deletedItem);
    this.getListenerOnDelete().onDelete(newItemEvent);
  }
};

oFF.UiListBase.prototype.handleScrollLoad = function(oControlEvent) {
  const scroller = ui5.sap_m_getScrollDelegate(this.getNativeControl());
  if (scroller) {
    scroller.setGrowingList(this.throttle(function() {
      if (this.getListenerOnScrollLoad() !== null) {
        this.getListenerOnScrollLoad().onScrollLoad(oFF.UiControlEvent.create(this));
      }
    }, 1000), ui5.sap_m_ListGrowingDirection.Downwards)
  }
};

oFF.UiDateTimeField = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiDateTimeField";
};
oFF.UiDateTimeField.prototype = new oFF.UiGeneric();

//Base classes should have no newInstance method

oFF.UiDateTimeField.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
};

oFF.UiDateTimeField.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiDateTimeField.prototype.registerOnChange = function(listener) {
  oFF.UiGeneric.prototype.registerOnChange.call(this, listener);
  this.getNativeControl().detachChange(this.handleChange, this);
  if (listener) {
    this.getNativeControl().attachChange(this.handleChange, this);
  }
  return this;
};

// ======================================

oFF.UiDateTimeField.prototype.setValue = function(value) {
  oFF.DfUiGeneric.prototype.setValue.call(this, value); // skip superclass implementation
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiDateTimeField.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

oFF.UiDateTimeField.prototype.setValueFormat = function(valueFormat) {
  oFF.UiGeneric.prototype.setValueFormat.call(this, valueFormat);
  this.getNativeControl().setValueFormat(valueFormat);
  return this;
};

oFF.UiDateTimeField.prototype.getValueFormat = function() {
  return oFF.UiGeneric.prototype.getValueFormat.call(this);
};

oFF.UiDateTimeField.prototype.setDisplayFormat = function(displayFormat) {
  oFF.UiGeneric.prototype.setDisplayFormat.call(this, displayFormat);
  this.getNativeControl().setDisplayFormat(displayFormat);
  return this;
};

oFF.UiDateTimeField.prototype.getDisplayFormat = function() {
  return oFF.UiGeneric.prototype.getDisplayFormat.call(this);
};

oFF.UiDateTimeField.prototype.setEditable = function(editable) {
  oFF.UiGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

oFF.UiDateTimeField.prototype.isEditable = function() {
  return oFF.UiGeneric.prototype.isEditable.call(this);
};

oFF.UiDateTimeField.prototype.setValueState = function(valueState) {
  oFF.UiGeneric.prototype.setValueState.call(this, valueState);
  this.getNativeControl().setValueState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
  return this;
};

oFF.UiDateTimeField.prototype.getValueState = function() {
  return oFF.UiGeneric.prototype.getValueState.call(this);
};

oFF.UiDateTimeField.prototype.setValueStateText = function(valueStateText) {
  oFF.UiGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

oFF.UiDateTimeField.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiDateTimeField.prototype.handleChange = function(oControlEvent) {
  if (this.getListenerOnChange() !== null) {
    const newValue = oControlEvent.getParameters().value;
    const isValid = oControlEvent.getParameters().valid;

    const newControlEvent = oFF.UiControlEvent.create(this);
    newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_VALUE, newValue);
    newControlEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_VALID, isValid);
    this.getListenerOnChange().onChange(newControlEvent);
  }
};

oFF.UiButton = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiButton";
};
oFF.UiButton.prototype = new oFF.UiGeneric();

oFF.UiButton.prototype.newInstance = function() {
  var object = new oFF.UiButton();
  object.setup();
  return object;
};

oFF.UiButton.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_Button(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================
//TODO: for testing use the new way of handle events
oFF.UiButton.prototype.registerOnPress = function(listener) {
  oFF.UiGeneric.prototype.registerOnPress.call(this, listener);
  this.getNativeControl().detachPress(this.handlePress, this);
  if (listener) {
    this.getNativeControl().attachPress(this.handlePress, this);
  }
  return this;
};

// ======================================


oFF.UiButton.prototype.setButtonType = function(value) {
  oFF.UiGeneric.prototype.setButtonType.call(this, value);
  this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseButtonType(value));
  return this;
};

oFF.UiButton.prototype.setBadgeNumber = function(badgeNumber) {
  oFF.UiGeneric.prototype.setBadgeNumber.call(this, badgeNumber);
  this._createBadgeCustomDataIfNeeded();
  this.getNativeControl().getBadgeCustomData().setValue(badgeNumber);
  return this;
};


// Overrides
// ======================================

oFF.UiButton.prototype.setIconColor = function(iconColor) {
  oFF.UiGeneric.prototype.setIconColor.call(this, iconColor);
  this._applyIconColor();
  return this;
};

// Control specific style and attribute handling
// ======================================

oFF.UiButton.prototype.applyCustomCssStyling = function(element) {
  this._applyIconColor();
};

oFF.UiButton.prototype.applyHeightCss = function(element, heightCss) {
  element.style.height = heightCss;
  // adjust icon and text to be in the center vertically
  ui5.sap_jQuery(element).find(".sapMBtnInner").css("height", "100%");
  ui5.sap_jQuery(element).find(".sapMBtnInner").css("display", "flex");
  ui5.sap_jQuery(element).find(".sapMBtnInner").css("justify-content", "center");
  ui5.sap_jQuery(element).find(".sapMBtnInner").css("align-items", "center");
};

oFF.UiButton.prototype.applyBackgroundColorCss = function(element, bgColor) {
  ui5.sap_jQuery(element).find(".sapMBtnInner").css("background-color", bgColor);
};

// Helpers
// ======================================

oFF.UiButton.prototype._createBadgeCustomDataIfNeeded = function() {
  let badgeCustomData = this.getNativeControl().getBadgeCustomData();
  if (!badgeCustomData) {
    this.getNativeControl().addCustomData(new ui5.sap_m_BadgeCustomData());
  }
};

oFF.UiButton.prototype._applyIconColor = function() {
  let iconColor = this.getIconColor();
  let colorCss = iconColor?.getCssValue() || '';
  ui5.sap_jQuery(this.getNativeControl()?.getDomRef()).find(".sapUiIcon").css("color", colorCss);
};

class UiToggleButton extends oFF.UiButton {
  constructor() {
    super();
    this._ff_c = "UiToggleButton";
  }

  newInstance() {
    let object = new UiToggleButton();
    object.setup();
    return object;
  }

  initializeNative() {
    oFF.UiGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxButton initialize method call here since we create a different control
    let nativeControl = new ui5.sap_m_ToggleButton(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setPressed(pressed) {
    super.setPressed(pressed);
    this.getNativeControl().setPressed(pressed);
    return this;
  }

  isPressed() {
    return this.getNativeControl().getPressed();
  }


  // ToggleButton inherits from Button and it has the same base properties and events

}

oFF.UiToggleButton = UiToggleButton;

oFF.UiMenuButton = function() {
   oFF.UiButton.call(this);
  this._ff_c = "UiMenuButton";
};
oFF.UiMenuButton.prototype = new oFF.UiButton();

oFF.UiMenuButton.prototype.newInstance = function() {
  var object = new oFF.UiMenuButton();
  object.setup();
  return object;
};

oFF.UiMenuButton.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxButton initialize method call here since we create a different control
  let nativeControl = new ui5.sap_m_MenuButton(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================
//TODO: for testing use the new way of handle events
// overwrite onPress since menu button has different event name
oFF.UiMenuButton.prototype.registerOnPress = function(listener) {
  oFF.UiGeneric.prototype.registerOnPress.call(this, listener);
  this.getNativeControl().detachDefaultAction(this.handlePress, this);
  if (listener) {
    this.getNativeControl().attachDefaultAction(this.handlePress, this);
  }
  return this;
};

// ======================================

oFF.UiMenuButton.prototype.setMenuButtonMode = function(menuButtonMode) {
  oFF.UiGeneric.prototype.setMenuButtonMode.call(this, menuButtonMode); //call UxGeneric directly
  this.getNativeControl().setButtonMode(oFF.ui.Ui5ConstantUtils.parseMenuButtonMode(menuButtonMode));
  return this;
};

oFF.UiMenuButton.prototype.setMenu = function(menu) {
  oFF.UiGeneric.prototype.setMenu.call(this, menu); //call UxGeneric directly
  const nativeMenu = menu ? menu.getNativeControl() : null;
  this.getNativeControl().setMenu(nativeMenu);
  return this;
};

oFF.UiMenuButton.prototype.setUseDefaultActionOnly = function(useDefaultActionOnly) {
  oFF.UiGeneric.prototype.setUseDefaultActionOnly.call(this, useDefaultActionOnly); //call UxGeneric directly
  this.getNativeControl().setUseDefaultActionOnly(useDefaultActionOnly);
  return this;
};


// UxMenuButton inherits from Button and it has the same base properties and events

class UiOverflowButton extends oFF.UiButton {
  constructor() {
    super();
    this._ff_c = "UiOverflowButton";
  }

  newInstance() {
    let object = new UiOverflowButton();
    object.setup();
    return object;
  }

  initializeNative() {
    oFF.UiGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxButton initialize method call here since we create a different control
    let nativeControl = new ui5.sap_m_OverflowToolbarButton(this.getId());

    this.setNativeControl(nativeControl);
  }

  // OverflowButton inherits from Button and it has the same base properties and events

}

oFF.UiOverflowButton = UiOverflowButton;

class UiOverflowToggleButton extends oFF.UiToggleButton {
  constructor() {
    super();
    this._ff_c = "UiOverflowToggleButton";
  }

  newInstance() {
    let object = new UiOverflowToggleButton();
    object.setup();
    return object;
  }

  initializeNative() {
    oFF.UiGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxToggleButton initialize method call here since we create a different control
    let nativeControl = new ui5.sap_m_OverflowToolbarToggleButton(this.getId());

    this.setNativeControl(nativeControl);
  }

  // OverflowToggleButton inherits from ToggleButton and it has the same base properties and events

}

oFF.UiOverflowToggleButton = UiOverflowToggleButton;

oFF.UiImage = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiImage";
};
oFF.UiImage.prototype = new oFF.UiGeneric();

oFF.UiImage.prototype.newInstance = function() {
  var object = new oFF.UiImage();
  object.setup();
  return object;
};

oFF.UiImage.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Image(this.getId());
  nativeControl.setDensityAware(false);

  this.setNativeControl(nativeControl);
};

oFF.UiImage.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiImage.prototype.registerOnPress = function(listener) {
  oFF.UiGeneric.prototype.registerOnPress.call(this, listener);
  this.getNativeControl().detachPress(this.handlePress, this);
  if (listener) {
    this.getNativeControl().attachPress(this.handlePress, this);
  }
  return this;
};

oFF.UiImage.prototype.registerOnLoadFinished = function(listener) {
  oFF.UiGeneric.prototype.registerOnLoadFinished.call(this, listener);
  this.getNativeControl().detachLoad(this.handleLoadFinished, this);
  if (listener) {
    this.getNativeControl().attachLoad(this.handleLoadFinished, this);
  }
  return this;
};

oFF.UiImage.prototype.registerOnError = function(listener) {
  oFF.UiGeneric.prototype.registerOnError.call(this, listener);
  this.getNativeControl().detachError(this.handleError, this);
  if (listener) {
    this.getNativeControl().attachError(this.handleError, this);
  }
  return this;
};

// ======================================

oFF.UiImage.prototype.setSrc = function(src) {
  oFF.UiGeneric.prototype.setSrc.call(this, src);
  if (src === null || src.length <= 0) {
    this.getNativeControl().setSrc(null);
  } else {
    this.getNativeControl().setSrc(src);
  }
  return this;
};

oFF.UiImage.prototype.getSrc = function() {
  return oFF.UiGeneric.prototype.getSrc.call(this);
};

oFF.UiImage.prototype.setRotation = function(rotation) {
  oFF.UiGeneric.prototype.setRotation.call(this, rotation);
  //not supported by the ui5 control?
  return this;
};

oFF.UiImage.prototype.getRotation = function() {
  return oFF.UiGeneric.prototype.getRotation.call(this);
};

oFF.UiImage.prototype.setLazyLoading = function(value) {
  oFF.UiGeneric.prototype.setLazyLoading.call(this, value);
  this.getNativeControl().setLazyLoading(value);
  return this;
};

oFF.UiImage.prototype.isLazyLoadis = function() {
  return oFF.UiGeneric.prototype.isLazyLoadis.call(this);
};

oFF.UiImage.prototype.setBackgroundSize = function(value) {
  oFF.UiGeneric.prototype.setBackgroundSize.call(this, value);
  this.getNativeControl().setBackgroundSize(value);
  return this;
};

oFF.UiImage.prototype.getBackgroundSize = function() {
  return oFF.UiGeneric.prototype.getBackgroundSize.call(this);
};

oFF.UiImage.prototype.setBackgroundPosition = function(value) {
  oFF.UiGeneric.prototype.setBackgroundPosition.call(this, value);
  this.getNativeControl().setBackgroundPosition(value);
  return this;
};

oFF.UiImage.prototype.getBackgroundPosition = function() {
  return oFF.UiGeneric.prototype.getBackgroundPosition.call(this);
};

oFF.UiImage.prototype.setImageMode = function(value) {
  oFF.UiGeneric.prototype.setImageMode.call(this, value);
  this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseImageMode(value));
  return this;
};

oFF.UiImage.prototype.getImageMode = function() {
  return oFF.UiGeneric.prototype.getImageMode.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiImage.prototype.handleLoadFinished = function(oEvent, parameters) {
  if (this.getListenerOnLoadFinished() !== null) {
    this.getListenerOnLoadFinished().onLoadFinished(oFF.UiControlEvent.create(this));
  }
};

oFF.UiImage.prototype.handleError = function(oEvent, parameters) {
  if (this.getListenerOnError() !== null) {
//    var newParameters = oFF.XProperties.create();
  //  newParameters.putString(oFF.UiEventParams.PARAM_MSG, msg);
    this.getListenerOnError().onError(oFF.UiControlEvent.create(this));
  }
};

class UiIcon extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiIcon";
  }

  newInstance() {
    let object = new UiIcon();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_core_Icon(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  // ======================================

  setTooltip(tooltip) {
    super.setTooltip(tooltip);
    // when someone sets a tooltip then disable automatic tooltip
    // that way when a tooltip is not set then the automatic will be used
    // this is only required for the UxIcon control
    this.getNativeControl().setUseIconTooltip(false);
    return this;
  }


  setHeight(height) {
    super.setHeight(height);
    // use the height as the icon size to simplify the api
    let heightCss = this.calculateHeightCss();
    if (heightCss !== null) {
      this.getNativeControl().setSize(heightCss);
    }
    return this;
  }

  setEnabled(enabled) {
    oFF.DfUiGeneric.prototype.setEnabled.call(this, enabled); // must skip UxGeneric superclass since the property does not exist on the icon control
    this.setDecorative(!enabled);
    return this;
  }

  isEnabled() {
    return oFF.DfUiGeneric.prototype.isEnabled.call(this); // must skip UxGeneric superclass class since the property does not exist on the icon control
  }

  setDecorative(decorative) {
    super.setDecorative(decorative);
    this.getNativeControl().setDecorative(decorative);
    return this;
  }

  isDecorative() {
    return this.getNativeControl().getDecorative();
  }

  // Overrides
  // ======================================

  setIcon(icon) {
    oFF.DfUiGeneric.prototype.setIcon.call(this, icon);
    let iconUri = oFF.UiGeneric.getUi5IconUri(icon);
    this.getNativeControl().setSrc(iconUri); //different prop name
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

}

oFF.UiIcon = UiIcon;

class UiAvatar extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiAvatar";
  }

  newInstance() {
    let object = new UiAvatar();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Avatar(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  // ======================================

  setSrc(src) {
    super.setSrc(src);
    if (src === null || src.length <= 0) {
      this.getNativeControl().setSrc(null);
    } else {
      this.getNativeControl().setSrc(src);
    }
    return this;
  }

  setInitials(initials) {
    super.setInitials(initials);
    this.getNativeControl().setInitials(initials);
    return this;
  }


  setAvatarSize(avatarSize) {
    super.setAvatarSize(avatarSize);
    this.getNativeControl().setDisplaySize(oFF.ui.Ui5ConstantUtils.parseAvatarSize(avatarSize));
    return this;
  }

  setAvatarShape(avatarShape) {
    super.setAvatarShape(avatarShape);
    this.getNativeControl().setDisplayShape(oFF.ui.Ui5ConstantUtils.parseAvatarShape(avatarShape));
    return this;
  }

  setAvatarColor(avatarColor) {
    super.setAvatarColor(avatarColor);
    this.getNativeControl().setBackgroundColor(oFF.ui.Ui5ConstantUtils.parseAvatarColor(avatarColor));
    return this;
  }

  // Overrides
  // ======================================

  setIcon(icon) {
    oFF.DfUiGeneric.prototype.setIcon.call(this, icon); // skip superclass call, different prop name
    const iconUri = oFF.UiGeneric.getUi5IconUri(icon);
    this.getNativeControl().setSrc(iconUri);
    return this;
  }

  getFontSize() {
    const nativeFontSizeStr = this.getNativeControl().getCustomFontSize();
    return oFF.ui.FfUtils.createFfCssLength(nativeFontSizeStr);
  }

  setFontSize(value) {
    oFF.DfUiGeneric.prototype.setFontSize.call(this, value); // skip superclass call, different prop name
    const cssStr = oFF.ui.FfUtils.getCssString(value);
    this.getNativeControl().setCustomFontSize(cssStr);
    return this;
  }

}

oFF.UiAvatar = UiAvatar;

class UiText extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiText";
  }

  newInstance() {
    let object = new UiText();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Text(this.getId());

    this.setNativeControl(nativeControl);
  }

}

oFF.UiText = UiText;

class UiTextArea extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTextArea";
  }

  newInstance() {
    let object = new UiTextArea();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_TextArea(this.getId());

    this.setNativeControl(nativeControl);
  }

  getValue() {
    return this.getNativeControl().getValue();
  }

  // Overrides
  // ======================================

  setMaxLines(value) {
    oFF.DfUiGeneric.prototype.setMaxLines.call(this, value); // skip superclass
    this.getNativeControl().setGrowingMaxLines(value); //different prop name
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  applyBackgroundColorCss(element, bgColor) {
    ui5.sap_jQuery(element).find(".sapMInputBaseInner").css("background-color", bgColor);
  }

  // special font color handling
  applyFontColorCss(element, fontColorCss) {
    ui5.sap_jQuery(element).find("textarea").css("color", fontColorCss);
  }

  // special font size handling
  applyFontSizeCss(element, fontSizeCss) {
    ui5.sap_jQuery(element).find("textarea").css("font-size", fontSizeCss);
  }

  // special font style handling
  applyFontStyleCss(element, fontStyleCss) {
    ui5.sap_jQuery(element).find("textarea").css("font-style", fontStyleCss);
  }

  // special font weight handling
  applyFontWeightCss(element, fontWeightCss) {
    ui5.sap_jQuery(element).find("textarea").css("font-weight", fontWeightCss);
  }

  // ======================================

}

oFF.UiTextArea = UiTextArea;

class UiCodeEditor extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiCodeEditor";
  }

  newInstance() {
    let object = new UiCodeEditor();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_codeeditor_CodeEditor(this.getId());

    this.setNativeControl(nativeControl);
  }


  // ======================================

  registerOnCursorChange(listener) {
    super.registerOnCursorChange(listener);
    //caution, use of private api!
    if (this.getNativeControl()._oEditor && this.getNativeControl()._oEditor.session && this.getNativeControl()._oEditor.session.selection) {
      this.getNativeControl()._oEditor.session.selection.off("changeCursor", this._handleCursorChange.bind(this));
      if (listener) {
        this.getNativeControl()._oEditor.session.selection.on("changeCursor", this._handleCursorChange.bind(this));
      }
    }
    return this;
  }

  // ======================================

  prettyPrint() {
    super.prettyPrint();
    this.getNativeControl().prettyPrint();
    return this;
  }

  insertText(text) {
    super.insertText(text);
    //caution, use of private api!
    //use timeout so we wait for ui5 to finish its work
    setTimeout(() => {
      this.getNativeControl()?._oEditor?.insert?.(text);
    }, 0);
    return this;
  }

  addCommand(commandName) {
    super.addCommand(commandName);
    //caution, use of private api!
    const commandToAdd = this.getNativeControl()?._oEditor?.commands?.commands?.[commandName]; // get the command from registry
    if (commandToAdd) {
      this.getNativeControl()?._oEditor?.commands?.addCommand?.(commandToAdd);
    }
    return this;
  }

  removeCommand(commandName, keepCommand) {
    super.removeCommand(commandName, keepCommand);
    //caution, use of private api!
    this.getNativeControl()?._oEditor?.commands?.removeCommand?.(commandName, keepCommand);
    return this;
  }

  deleteText() {
    super.deleteText();
    //caution, use of private api!
    this.getNativeControl()?._oEditor?.remove();
    return this;
  }

  selectTextByPosition(startPosition, endPosition) {
    super.selectTextByPosition(startPosition, endPosition);
    const selectionRange = {};
    if (startPosition) {
      selectionRange.start = {};
      selectionRange.start.row = startPosition.getRow();
      selectionRange.start.column = startPosition.getColumn();
    }
    if (endPosition) {
      selectionRange.end = {};
      selectionRange.end.row = endPosition.getRow();
      selectionRange.end.column = endPosition.getColumn();
    }
    this.getNativeControl()?._oEditor?.selection?.setSelectionRange?.(selectionRange);
    return this;
  }

  runModule(moduleName) {
    super.runModule(moduleName);
    const that = this;
    //caution, use of private api!
    window?.ace?.config?.loadModule?.(moduleName, module => {
      module.runModule?.(that);
    });
    return this;
  }

  // ======================================

  getValue() {
    if (this.getNativeControl()?._oEditor) {
      // up to date value, part of official ui5 API
      // altrough sometimes for some reason the _oEditor is already destroyed but the ui5 control not, hence the check
      return this.getNativeControl().getCurrentValue();
    } else {
      // the value property on the ui5 control is only updated during a blur event, hence not always up to date!
      return this.getNativeControl().getValue();
    }
  }

  setEnabled(enabled) {
    // there is no enabbled property on the code editor so i just forward this to the editable property
    this.setEditable(enabled);
    return this;
  }

  setCodeType(codeType) {
    super.setCodeType(codeType);
    this.getNativeControl().setType(codeType);
    return this;
  }

  getCodeType() {
    return this.getNativeControl().getType();
  }

  setCustomCompleter(customCompleter) {
    super.setCustomCompleter(customCompleter);
    if (customCompleter != null) {
      const identifierRegexpsArr = this._createIdentifierRegexpsFromPatternArray(customCompleter.getIdentifierRegexPatterns().convertToNative());
      // Uses private api to replace all completers, including built-in ones with a user-defined custom completer
      this.getNativeControl()._oEditor.completers = [{
        identifierRegexps: identifierRegexpsArr,
        getCompletions: function(editor, session, pos, prefix, callback) {
          callback(null, customCompleter.getCompletions().convertToNative());
        }
      }];
    }
    return this;
  }

  getCustomCompleter() {
    return super.getCustomCompleter();
  }

  setCursorPosition(cursorPosition) {
    //caution, use of private api!
    //use timeout so we wait for ui5 to finish its work
    setTimeout(() => {
      let row = 0;
      let column = 0;
      if (cursorPosition) {
        row = cursorPosition.getRow();
        column = cursorPosition.getColumn();
      }
      this.getNativeControl()?._oEditor?.selection?.cursor?.setPosition?.(row, column);
    }, 0);
    return this;
  }

  getCursorPosition() {
    //caution, use of private api!
    let cursor = this.getNativeControl()?._oEditor?.selection?.cursor?.getPosition?.();
    if (cursor) {
      return oFF.UiCursorPosition.create(cursor.row, cursor.column);
    }
    return oFF.UiCursorPosition.create(0, 0);
  }

  setFontFamily(value) {
    super.setFontFamily(value);
    //caution, use of private api!
    //use timeout so we wait for ui5 to finish its work
    setTimeout(() => {
      let options = {};
      options.fontFamily = value;
      this.getNativeControl()?._oEditor?.setOptions?.(options);
    }, 0);
    return this;
  }

  getFontFamily() {
    //caution, use of private api!
    let options = this.getNativeControl()?._oEditor?.getOptions?.();
    if (options) {
      return options.fontFamily;
    }
    return super.getFontFamily();
  }

  setMergeUndoDeltas(value) {
    //caution, use of private api!
    super.setMergeUndoDeltas(value);
    const editorSession = this.getNativeControl()?._oEditor?.session;
    if (editorSession) {
      editorSession.mergeUndoDeltas = value;
    }
    return this;
  }

  isMergeUndoDeltas() {
    //caution, use of private api!
    const editorSession = this.getNativeControl()?._oEditor?.session;
    if (editorSession) {
      return editorSession.mergeUndoDeltas
    }
    return super.isMergeUndoDeltas();
  }

  getSelectedText() {
    //caution, use of private api!
    return this.getNativeControl()?._oEditor?.getSelectedText?.();
  }

  // Overrides
  // ======================================

  focus() {
    oFF.DfUiGeneric.prototype.focus.call(this); // skip UxGeneric superclass since we have custom logic for that
    //ui5 focus does not enable text input, only shows a boarder around the text area
    //use timeout so we wait for ui5 to finish its work
    setTimeout(() => {
      this.getNativeControl()?._oEditor?.focus?.();
    }, 0);
    return this;
  }

  setFontSize(fontSize) {
    oFF.DfUiGeneric.prototype.setFontSize.call(this, fontSize); // skip UxGeneric superclass since we have custom logic for that
    let valueToSet = null;
    if (fontSize) {
      if (fontSize.getUnit() == oFF.UiCssSizeUnit.PIXEL) {
        valueToSet = fontSize.getValue();
      } else {
        console.warn("[FF CodeEditor] Cannot apply fontSize! The font size must be an absolute value in pixel!");
        return this;
      }
    }
    this.getNativeControl()?._oEditor?.setFontSize?.(valueToSet);
    return this;
  }

  // ======================================

  _handleCursorChange(oEvent) {
    if (this.getListenerOnCursorChange() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnCursorChange().onCursorChange(ffEvent);
    }
  }

  _createIdentifierRegexpsFromPatternArray(patternArr) {
    return patternArr?.map((pattern) => new RegExp(pattern));
  }

}

oFF.UiCodeEditor = UiCodeEditor;

oFF.UiInput = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiInput";
};
oFF.UiInput.prototype = new oFF.UiGeneric();

oFF.UiInput.prototype.newInstance = function() {
  var object = new oFF.UiInput();
  object.setup();
  return object;
};

oFF.UiInput.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_Input(this.getId());

  // ToDo: Remove this once Variable dialog redesign is implemented.
  // Also, don't forget to clean css
  this._clearIconHackDelegate = {
    onAfterRendering: this._applyClearIconHack.bind(this)
  };
  nativeControl.addEventDelegate(this._clearIconHackDelegate, this);

  this.setNativeControl(nativeControl);
};

oFF.UiInput.prototype.releaseObject = function() {
  this.getNativeControl().removeEventDelegate(this._clearIconHackDelegate);
  this._clearIconHackDelegate = null;
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiInput.prototype.registerOnSuggestionSelect = function(listener) {
  oFF.UiGeneric.prototype.registerOnSuggestionSelect.call(this, listener);
  this.getNativeControl().detachSuggestionItemSelected(this.handleSuggestionSelect, this);
  if (listener) {
    this.getNativeControl().attachSuggestionItemSelected(this.handleSuggestionSelect, this);
  }
  return this;
};

// ======================================

oFF.UiInput.prototype.addSuggestion = function(suggestionItem) {
  oFF.UiGeneric.prototype.addSuggestion.call(this, suggestionItem);
  this.getNativeControl().setShowSuggestion(true);
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().addSuggestionItem(nativeChild);
  return this;
};

oFF.UiInput.prototype.insertSuggestion = function(suggestionItem, index) {
  oFF.UiGeneric.prototype.insertSuggestion.call(this, suggestionItem, index);
  this.getNativeControl().setShowSuggestion(true);
  var nativeChild = suggestionItem.getNativeControl();
  //this.getNativeControl().insertSuggestionItem(nativeChild, index); // Ui5 bug? they swap index and object so this does not work i need to swap them like below
  this.getNativeControl().insertSuggestionItem(index, nativeChild);
  return this;
};

oFF.UiInput.prototype.removeSuggestion = function(suggestionItem) {
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().removeSuggestionItem(nativeChild);
  oFF.UiGeneric.prototype.removeSuggestion.call(this, suggestionItem);
  return this;
};

oFF.UiInput.prototype.clearSuggestions = function() {
  oFF.UiGeneric.prototype.clearSuggestions.call(this);
  this.getNativeControl().removeAllSuggestionItems();
  return this;
};

// ======================================

oFF.UiInput.prototype.showSuggestions = function() {
  oFF.UiGeneric.prototype.showSuggestions.call(this);
  this.getNativeControl().showItems();
  return this;
};

oFF.UiInput.prototype.closeSuggestions = function() {
  oFF.UiGeneric.prototype.closeSuggestions.call(this);
  this.getNativeControl().closeSuggestions();
  return this;
};

oFF.UiInput.prototype.focus = function() {
  oFF.UiGeneric.prototype.focus.call(this);
  return this;
};

oFF.UiInput.prototype.selectText = function(startIndex, endIndex) {
  oFF.UiGeneric.prototype.selectText.call(this, startIndex, endIndex);
  this.getNativeControl().selectText(startIndex, endIndex);
  return this;
};

// ======================================

oFF.UiInput.prototype.setValue = function(value) {
  oFF.UiGeneric.prototype.setValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiInput.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

oFF.UiInput.prototype.setPlaceholder = function(placeholder) {
  oFF.UiGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

oFF.UiInput.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

oFF.UiInput.prototype.setMaxLength = function(maxLength) {
  oFF.UiGeneric.prototype.setMaxLength.call(this, maxLength);
  this.getNativeControl().setMaxLength(maxLength);
  return this;
};

oFF.UiInput.prototype.getMaxLength = function() {
  return oFF.UiGeneric.prototype.getMaxLength.call(this);
};

oFF.UiInput.prototype.setEditable = function(editable) {
  oFF.UiGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};

oFF.UiInput.prototype.isEditable = function() {
  return oFF.UiGeneric.prototype.isEditable.call(this);
};

oFF.UiInput.prototype.setInputType = function(inputType) {
  oFF.UiGeneric.prototype.setInputType.call(this, inputType);
  this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseInputType(inputType));
  return this;
};

oFF.UiInput.prototype.getInputType = function() {
  return oFF.UiGeneric.prototype.getInputType.call(this);
};

oFF.UiInput.prototype.setRequired = function(required) {
  oFF.UiGeneric.prototype.setRequired.call(this, required);
  return this;
};

oFF.UiInput.prototype.isRequired = function() {
  return oFF.UiGeneric.prototype.isRequired.call(this);
};

oFF.UiInput.prototype.setFontSize = function(fontSize) {
  oFF.UiGeneric.prototype.setFontSize.call(this, fontSize);
  return this;
};

oFF.UiInput.prototype.getFontSize = function() {
  return oFF.UiGeneric.prototype.getFontSize.call(this);
};

oFF.UiInput.prototype.setFontColor = function(fontColor) {
  oFF.UiGeneric.prototype.setFontColor.call(this, fontColor);
  return this;
};

oFF.UiInput.prototype.getFontColor = function() {
  return oFF.UiGeneric.prototype.getFontColor.call(this);
};

oFF.UiInput.prototype.setFontWeight = function(fontWeight) {
  oFF.UiGeneric.prototype.setFontWeight.call(this, fontWeight);
  return this;
};

oFF.UiInput.prototype.getFontWeight = function() {
  return oFF.UiGeneric.prototype.getFontWeight.call(this);
};

oFF.UiInput.prototype.setFontStyle = function(fontStyle) {
  oFF.UiGeneric.prototype.setFontStyle.call(this, fontStyle);
  return this;
};

oFF.UiInput.prototype.getFontStyle = function() {
  return oFF.UiGeneric.prototype.getFontStyle.call(this);
};

oFF.UiInput.prototype.setBusy = function(busy) {
  oFF.UiGeneric.prototype.setBusy.call(this, busy);
  return this;
};

oFF.UiInput.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

oFF.UiInput.prototype.setValueState = function(valueState) {
  oFF.UiGeneric.prototype.setValueState.call(this, valueState);
  this.getNativeControl().setValueState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
  return this;
};

oFF.UiInput.prototype.getValueState = function() {
  return oFF.UiGeneric.prototype.getValueState.call(this);
};

oFF.UiInput.prototype.setValueStateText = function(valueStateText) {
  oFF.UiGeneric.prototype.setValueStateText.call(this, valueStateText);
  this.getNativeControl().setValueStateText(valueStateText);
  return this;
};

oFF.UiInput.prototype.getValueStateText = function() {
  return this.getNativeControl().getValueStateText();
};

oFF.UiInput.prototype.isShowValueHelp = function() {
  return oFF.UiGeneric.prototype.isShowValueHelp.call(this);
};

oFF.UiInput.prototype.setShowValueHelp = function(value) {
  oFF.UiGeneric.prototype.setShowValueHelp.call(this, value);
  return this;
};

oFF.UiInput.prototype.getValueHelpIcon = function() {
  return oFF.UiGeneric.prototype.getValueHelpIcon.call(this);
};

oFF.UiInput.prototype.setValueHelpIcon = function(value) {
  oFF.UiGeneric.prototype.setValueHelpIcon.call(this, value);
  return this;
};

oFF.UiInput.prototype.setAutocomplete = function(autocomplete) {
  oFF.DfUiGeneric.prototype.setAutocomplete.call(this, autocomplete); // skip superclass implementation, different properies
  this.getNativeControl().invalidate(); // trigger rendering
  return this;
};

oFF.UiInput.prototype.isAutocomplete = function() {
  return oFF.UiGeneric.prototype.isAutocomplete.call(this);
};

oFF.UiInput.prototype.setShowValueStateMessage = function(showValueStateMessage) {
  oFF.UiGeneric.prototype.setShowValueStateMessage.call(this, showValueStateMessage);
  this.getNativeControl().setShowValueStateMessage(showValueStateMessage);
  return this;
};

oFF.UiInput.prototype.isShowValueStateMessage = function() {
  return oFF.UiGeneric.prototype.isShowValueStateMessage.call(this);
};

oFF.UiInput.prototype.setFilterSuggests = function(filterSuggests) {
  oFF.UiGeneric.prototype.setFilterSuggests.call(this, filterSuggests);
  this.getNativeControl().setFilterSuggests(filterSuggests);
  return this;
};

oFF.UiInput.prototype.isFilterSuggests = function() {
  return oFF.UiGeneric.prototype.isFilterSuggests.call(this);
};

oFF.UiInput.prototype.isShowSuggestion = function() {
  return oFF.UiGeneric.prototype.isShowSuggestion.call(this);
};

oFF.UiInput.prototype.setShowSuggestion = function(value) {
  oFF.UiGeneric.prototype.setShowSuggestion.call(this, value);
  return this;
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiInput.prototype.applyCustomCssStyling = function(element) {
  // input has some weird issue in desktop mode, it is not positioned in the midlle so i do it manually
  if (this.getUiStyleClass() === oFF.UiStyleClass.DESKTOP) {
    element.style.display = "flex";
    element.style.alignItems = "center";
  }
};

oFF.UiInput.prototype.applyCustomAttributes = function(element) {
  //add the autocomplete="new-password" attribute to the input to disable browser autocompletition if the property is set to false
  if (!this.isAutocomplete()) {
    ui5.sap_jQuery(element).find("input").attr("autocomplete", "new-password");
  }
};

// special background color styling handling
oFF.UiInput.prototype.applyBackgroundColorCss = function(element, bgColor) {
  ui5.sap_jQuery(element).find(".sapMInputBaseContentWrapper").css("background-color", bgColor);
};

//special border style handling
oFF.UiInput.prototype.applyBorderStyleCss = function(element, borderStyleCss) {
  ui5.sap_jQuery(element).find(".sapMInputBaseContentWrapper").css("border-style", borderStyleCss);
};

//special border width handling
oFF.UiInput.prototype.applyBorderWidthCss = function(element, borderWidthCss) {
  ui5.sap_jQuery(element).find(".sapMInputBaseContentWrapper").css("border-width", borderWidthCss);
};

//special border color handling
oFF.UiInput.prototype.applyBorderColorCss = function(element, borderColorCss) {
  ui5.sap_jQuery(element).find(".sapMInputBaseContentWrapper").css("border-color", borderColorCss);
};

// special font color handling
oFF.UiInput.prototype.applyFontColorCss = function(element, fontColorCss) {
  ui5.sap_jQuery(element).find("input").css("color", fontColorCss);
};

// special font size handling
oFF.UiInput.prototype.applyFontSizeCss = function(element, fontSizeCss) {
  ui5.sap_jQuery(element).find("input").css("font-size", fontSizeCss);
};

// special font style handling
oFF.UiInput.prototype.applyFontStyleCss = function(element, fontStyleCss) {
  ui5.sap_jQuery(element).find("input").css("font-style", fontStyleCss);
};

// special font weight handling
oFF.UiInput.prototype.applyFontWeightCss = function(element, fontWeightCss) {
  ui5.sap_jQuery(element).find("input").css("font-weight", fontWeightCss);
};

// Helpers
// ======================================

oFF.UiInput.prototype._applyClearIconHack = function() {
  var nativeControl = this.getNativeControl();
  var element = nativeControl.getDomRef();
  if (ui5.sap_jQuery(element).hasClass("ffShowClearIconWhenDisabledInput")) {
    // Only needed to retain old variable dialog behavior of showing clear icon even when input is disabled
    var clearIcon = nativeControl._getClearIcon();
    if (clearIcon) {
      clearIcon.addStyleClass("ff-input-clear-icon");
      clearIcon.setVisible(this.isShowClearIcon());
    }
  }
};

// Event handlers
// ======================================

oFF.UiInput.prototype.handleSuggestionSelect = function(oEvent) {
  if (this.getListenerOnSuggestionSelect() !== null) {
    const selectedNativeItem = oEvent.getParameters().selectedItem;
    const ffSelectedItem = oFF.UiGeneric.getFfControl(selectedNativeItem);
    const newSelectionEvent = oFF.UiSelectionEvent.create(this)
    newSelectionEvent.setSingleSelectionData(ffSelectedItem);
    this.getListenerOnSuggestionSelect().onSuggestionSelect(newSelectionEvent);
  }
};

oFF.UiSuggestionItem = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSuggestionItem";
};
oFF.UiSuggestionItem.prototype = new oFF.UiGeneric();

oFF.UiSuggestionItem.prototype.newInstance = function() {
  var object = new oFF.UiSuggestionItem();
  object.setup();
  return object;
};

oFF.UiSuggestionItem.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  // Extends: sap.ui.core.Item, needs to be sap.m.SuggestionItem in order to be used in input and searchfield
  var nativeControl = new ui5.sap_m_SuggestionItem(this.getId());

  this.setNativeControl(nativeControl);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSearchField = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSearchField";
};
oFF.UiSearchField.prototype = new oFF.UiGeneric();

oFF.UiSearchField.prototype.newInstance = function() {
  var object = new oFF.UiSearchField();
  object.setup();
  return object;
};

oFF.UiSearchField.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_SearchField(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiSearchField.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // required for the suggestion popup to open
  nativeControl.attachSuggest(function(oEvent) {
    var searchValue = oEvent.getParameter("suggestValue");
    // i need to do my own suggestion filter to update the suggestion list only with the items that fit the search Value
    // this is a different behaviour to sap.m.Input where this filtering is happening automatically
    myself._filterSuggestions(searchValue);
    nativeControl.suggest();
  });

  //onSearch and onSuggestionItemSelect events
  nativeControl.attachSearch(function(oEvent) {
    var selectedSuggestionItem = oEvent.getParameters().suggestionItem;
    var clearButtonPressed = oEvent.getParameters().clearButtonPressed;
    var searchText = oEvent.getParameters().query || "";

    if (clearButtonPressed) {
      // if clear button pressed then i need to remove the suggestion filter
      myself._filterSuggestions("");
      nativeControl.suggest();
    }

    // onSearch event
    if (myself.getListenerOnSearch() !== null) {
      const newControlEvent = oFF.UiControlEvent.create(myself);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SEARCH_TEXT, searchText);
      newControlEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_CLEAR_BUTTON_PRESSED, clearButtonPressed);
      myself.getListenerOnSearch().onSearch(newControlEvent);
    }

    // onSuggestionItemSelect event
    if (selectedSuggestionItem != null) {
      if (myself.getListenerOnSuggestionSelect() !== null) {
        var selectedSuggestionItem = oFF.UiGeneric.getFfControl(selectedSuggestionItem);
        const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
        newSelectionEvent.setSingleSelectionData(selectedSuggestionItem);
        myself.getListenerOnSuggestionSelect().onSuggestionSelect(newSelectionEvent);
      }
    }
  });

  //onPaste event
  nativeControl.onpaste = function(event) {
    if (myself.getListenerOnPaste() !== null) {
      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("text/plain");
      // i need to make a timeout so that firs the data is pasted and it could be replaced afterwards
      setTimeout(function() {
        const newControlEvent = oFF.UiControlEvent.create(myself);
        newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PASTED_DATA, pastedData);
        myself.getListenerOnPaste().onPaste(newControlEvent);
      }, 0);
    }
  };

  // onFocusIn, onFocusOut events
  nativeControl.addEventDelegate({
    onfocusin: function() {
      if (myself.getListenerOnEditingBegin() !== null) {
        myself.getListenerOnEditingBegin().onEditingBegin(oFF.UiControlEvent.create(myself));
      }
    },
    onsapfocusleave: function() {
      if (myself.getListenerOnEditingEnd() !== null) {
        myself.getListenerOnEditingEnd().onEditingEnd(oFF.UiControlEvent.create(myself));
      }
    }
  });
};

// ======================================

oFF.UiSearchField.prototype.addSuggestion = function(suggestionItem) {
  oFF.UiGeneric.prototype.addSuggestion.call(this, suggestionItem);
  this.getNativeControl().setEnableSuggestions(true);
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().addSuggestionItem(nativeChild);
  return this;
};

oFF.UiSearchField.prototype.insertSuggestion = function(suggestionItem, index) {
  oFF.UiGeneric.prototype.insertSuggestion.call(this, suggestionItem, index);
  this.getNativeControl().setEnableSuggestions(true);
  var nativeChild = suggestionItem.getNativeControl();
  //this.getNativeControl().insertSuggestionItem(nativeChild, index); // Ui5 bug? they swap index and object so this does not work i need to swap them like below
  this.getNativeControl().insertSuggestionItem(index, nativeChild);
  return this;
};

oFF.UiSearchField.prototype.removeSuggestion = function(suggestionItem) {
  var nativeChild = suggestionItem.getNativeControl();
  this.getNativeControl().removeSuggestionItem(nativeChild);
  oFF.UiGeneric.prototype.removeSuggestion.call(this, suggestionItem);
  return this;
};

oFF.UiSearchField.prototype.clearSuggestions = function() {
  oFF.UiGeneric.prototype.clearSuggestions.call(this);
  this.getNativeControl().removeAllSuggestionItems();
  return this;
};

// ======================================

oFF.UiSearchField.prototype.showSuggestions = function() {
  oFF.UiGeneric.prototype.showSuggestions.call(this);
  this.getNativeControl().suggest();
  return this;
};

oFF.UiSearchField.prototype.closeSuggestions = function() {
  oFF.UiGeneric.prototype.closeSuggestions.call(this);
  this.getNativeControl().exit();
  return this;
};


// ======================================

oFF.UiSearchField.prototype.setValue = function(value) {
  oFF.UiGeneric.prototype.setValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiSearchField.prototype.getValue = function() {
  return this.getNativeControl().getValue();
};

oFF.UiSearchField.prototype.setPlaceholder = function(placeholder) {
  oFF.UiGeneric.prototype.setPlaceholder.call(this, placeholder);
  this.getNativeControl().setPlaceholder(placeholder);
  return this;
};

oFF.UiSearchField.prototype.getPlaceholder = function() {
  return this.getNativeControl().getPlaceholder();
};

oFF.UiSearchField.prototype.setMaxLength = function(maxLength) {
  oFF.UiGeneric.prototype.setMaxLength.call(this, maxLength);
  this.getNativeControl().setMaxLength(maxLength);
  return this;
};

oFF.UiSearchField.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

oFF.UiSearchField.prototype.setEditable = function(editable) {
  oFF.UiGeneric.prototype.setEditable.call(this, editable);
  this.getNativeControl().setEditable(editable);
  return this;
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSearchField.prototype._filterSuggestions = function(searchValue) {
  if (this.hasSuggestions()) {
    var origNativeSuggestions = [];
    for (var i = 0; i < this.getSuggestions().size(); i++) {
      origNativeSuggestions.push(this.getSuggestion(i).getNativeControl());
    }

    var filterdNativeSuggestions = origNativeSuggestions.filter(function(suggestionItem) {
      return suggestionItem.getText().indexOf(searchValue) !== -1;
    });

    this.getNativeControl().removeAllSuggestionItems();

    for (var i = 0; i < filterdNativeSuggestions.length; i++) {
      this.getNativeControl().addSuggestionItem(filterdNativeSuggestions[i]);
    }
  }
};

oFF.UiCheckbox = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiCheckbox";
};
oFF.UiCheckbox.prototype = new oFF.UiGeneric();

oFF.UiCheckbox.prototype.newInstance = function() {
  var object = new oFF.UiCheckbox();
  object.setup();
  return object;
};

oFF.UiCheckbox.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_CheckBox(this.getId());
  nativeControl.setUseEntireWidth(true); // apply width to the whole control, not just label

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiCheckbox.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiCheckbox.prototype.setChecked = function(checked) {
  oFF.UiGeneric.prototype.setChecked.call(this, checked);
  this.getNativeControl().setSelected(checked);
  return this;
};

oFF.UiCheckbox.prototype.isChecked = function() {
  return this.getNativeControl().getSelected();
};

oFF.UiCheckbox.prototype.setPartiallyChecked = function(partiallyChecked) {
  oFF.UiGeneric.prototype.setPartiallyChecked.call(this, partiallyChecked);
  this.getNativeControl().setPartiallySelected(partiallyChecked);
  return this;
};

oFF.UiCheckbox.prototype.isPartiallyChecked = function() {
  return this.getNativeControl().getPartiallySelected();
};

oFF.UiCheckbox.prototype.setDisplayOnly = function(displayOnly) {
  oFF.UiGeneric.prototype.setDisplayOnly.call(this, displayOnly);
  this.getNativeControl().setDisplayOnly(displayOnly);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSwitch = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSwitch";
};
oFF.UiSwitch.prototype = new oFF.UiGeneric();

oFF.UiSwitch.prototype.newInstance = function() {
  var object = new oFF.UiSwitch();
  object.setup();
  return object;
};

oFF.UiSwitch.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Switch(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiSwitch.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiSwitch.prototype.setOn = function(isOn) {
  oFF.UiGeneric.prototype.setOn.call(this, isOn);
  this.getNativeControl().setState(isOn);
  return this;
};

oFF.UiSwitch.prototype.isOn = function() {
  return this.getNativeControl().getState();
};

oFF.UiSwitch.prototype.setOnText = function(onText) {
  oFF.UiGeneric.prototype.setOnText.call(this, onText);
  this.getNativeControl().setCustomTextOn(onText);
  return this;
};

oFF.UiSwitch.prototype.setOffText = function(offText) {
  oFF.UiGeneric.prototype.setOffText.call(this, offText);
  this.getNativeControl().setCustomTextOff(offText);
  return this;
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

class UiLabel extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiLabel";
  }

  newInstance() {
    let object = new UiLabel();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Label(this.getId());

    this.setNativeControl(nativeControl);
  }

  // Overrides
  // ======================================

  setFontWeight(fontWeight) {
    oFF.DfUiGeneric.prototype.setFontWeight.call(this, fontWeight); // skip superclass, no need for css
    this.getNativeControl().setDesign(oFF.ui.Ui5ConstantUtils.parseFontWeight(fontWeight));
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  applyTextDecorationCss(element, textDecorationCss) {
    ui5.sap_jQuery(element).find(".sapMLabelTextWrapper").css("text-decoration", textDecorationCss);
  }

}

oFF.UiLabel = UiLabel;

class UiTitle extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTitle";
  }

  newInstance() {
    let object = new UiTitle();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Title(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setTitleStyle(style) {
    super.setTitleStyle(style);
    this.getNativeControl().setTitleStyle(oFF.ui.Ui5ConstantUtils.parseTitleLevel(style));
    return this;
  }

  setTitleLevel(level) {
    super.setTitleLevel(level);
    this.getNativeControl().setLevel(oFF.ui.Ui5ConstantUtils.parseTitleLevel(level));
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

}

oFF.UiTitle = UiTitle;

class UiRadioButton extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiRadioButton";
  }

  newInstance() {
    let object = new UiRadioButton();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_RadioButton(this.getId());
    nativeControl.setGroupName("ffGlobalRadioButtonGroup");

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnChange(listener) {
    super.registerOnChange(listener);
    this.attachEventCallback("select", this._handleChange, listener);
    return this;
  }

  // ======================================

  setSelected(selected) {
    super.setSelected(selected);
    this.getNativeControl().setSelected(selected);
    return this;
  }

  isSelected() {
    return this.getNativeControl().getSelected();
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleChange(oEvent) {
    if (this.getListenerOnChange() != null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      // timeout is needed to fix an call order issue (possible sapui5 bug), first wait that the correct values are set and then sent out the event.
      // ui5 sets the new state after after the event is fired, which is a different behaviour than on other controls
      setTimeout(() => {
        this.getListenerOnChange().onChange(ffEvent);
      }, 1);
    }
  }

}

oFF.UiRadioButton = UiRadioButton;

class UiRadioButtonGroup extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiRadioButtonGroup";
  }

  newInstance() {
    let object = new UiRadioButtonGroup();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_RadioButtonGroup(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnSelect(listener) {
    super.registerOnSelect(listener);
    this.attachEventCallback("select", this._handleSelect, listener);
    return this;
  }

  // ======================================

  addRadioButton(radioButton) {
    super.addRadioButton(radioButton);
    let nativeRadioButton = radioButton.getNativeControl();
    if (nativeRadioButton) {
      this.getNativeControl().addButton(nativeRadioButton);
    }
    return this;
  }

  insertRadioButton(radioButton, index) {
    super.insertRadioButton(radioButton, index);
    let nativeRadioButton = radioButton.getNativeControl();
    if (nativeRadioButton) {
      this.getNativeControl().insertButton(nativeRadioButton, index);
    }
    return this;
  }

  removeRadioButton(radioButton) {
    let nativeRadioButton = radioButton.getNativeControl();
    if (nativnativeRadioButtoneCell) {
      this.getNativeControl().removeButton(nativeRadioButton);
    }
    super.removeRadioButton(radioButton);
    return this;
  }

  clearRadioButtons() {
    super.clearRadioButtons();
    this.getNativeControl().removeAllButtons();
    return this;
  }

  // ======================================

  setSelectedItem(item) {
    super.setSelectedItem(item);
    let nativeItem = item?.getNativeControl?.();
    this.getNativeControl().setSelectedButton(nativeItem);
    return this;
  }

  getSelectedItem() {
    var selectedItem = this.getNativeControl().getSelectedButton();
    return oFF.UiGeneric.getFfControl(selectedItem);
  }

  // ======================================

  setColumnCount(columnCount) {
    super.setColumnCount(columnCount);
    if (columnCount > 0) {
      this.getNativeControl().setColumns(columnCount);
    }
    return this;
  }

  getColumnCount() {
    if (this.getNativeControl() != null) {
      return this.getNativeControl().getColumns();
    }
    return oFF.UiGeneric.prototype.getColumnCount.call(this);
  }

  setValueState(valueState) {
    super.setValueState(valueState);
    this.getNativeControl().setValueState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleSelect(oControlEvent) {
    if (this.getListenerOnSelect() !== null) {
      let selectedIndex = oControlEvent.getParameters().selectedIndex;
      let nativeSelectedRadioButton = this.getNativeControl().getButtons()[selectedIndex];
      let ffSelectedRadioButton = oFF.UiGeneric.getFfControl(nativeSelectedRadioButton);
      const newSingleSelectionEvent = oFF.ui.FfEventUtils.prepareSingleSelectionEvent(this, oControlEvent, ffSelectedRadioButton);
      this.getListenerOnSelect().onSelect(newSingleSelectionEvent);
    }
  }

}

oFF.UiRadioButtonGroup = UiRadioButtonGroup;

class UiLink extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiLink";
  }

  newInstance() {
    let object = new UiLink();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Link(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  // ======================================

  setSrc(src) {
    super.setSrc(src);
    this.getNativeControl().setHref(src);
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

}

oFF.UiLink = UiLink;

class UiChip extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiChip";
  }

  newInstance() {
    let object = new UiChip();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Token(this.getId());

    this.setNativeControl(nativeControl);
  }

  handleSelect(oEvent) {
    if (this.getListenerOnSelect() !== null) {
      const newSelectionEvent = oFF.UiSelectionEvent.create(this)
      newSelectionEvent.setSingleSelectionData(this);
      this.getListenerOnSelect().onSelect(newSelectionEvent);
    }
  }

  handleDeselect(oEvent) {
    if (this.getListenerOnDeselect() !== null) {
      this.getListenerOnDeselect().onDeselect(oFF.UiControlEvent.create(this));
    }
  }

  handleDelete(oEvent) {
    if (this.getListenerOnDelete() !== null) {
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.setItemData(this);
      this.getListenerOnDelete().onDelete(newItemEvent);
    }
  }

}

oFF.UiChip = UiChip;

oFF.UiDatePicker = function() {
   oFF.UiDateTimeField.call(this);
  this._ff_c = "UiDatePicker";
};
oFF.UiDatePicker.prototype = new oFF.UiDateTimeField();

oFF.UiDatePicker.prototype.newInstance = function() {
  var object = new oFF.UiDatePicker();
  object.setup();
  return object;
};

oFF.UiDatePicker.prototype.initializeNative = function() {
  oFF.UiDateTimeField.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_DatePicker(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiDatePicker.prototype.setMinDate = function(minDate) {
  oFF.UiDateTimeField.prototype.setMinDate.call(this, minDate);
  var dateObject = new Date(minDate);
  this.getNativeControl().setMinDate(dateObject);
  return this;
};

oFF.UiDatePicker.prototype.setMaxDate = function(maxDate) {
  oFF.UiDateTimeField.prototype.setMaxDate.call(this, maxDate);
  var dateObject = new Date(maxDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

oFF.UiDatePicker.prototype.setShowCurrentDateButton = function(showCurrentDateButton) {
  oFF.UiDateTimeField.prototype.setShowCurrentDateButton.call(this, showCurrentDateButton);
  this.getNativeControl().setShowCurrentDateButton(showCurrentDateButton);
  return this;
};

oFF.UiDatePicker.prototype.isShowCurrentDateButton = function() {
  return this.getNativeControl().getShowCurrentDateButton();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiTimePicker = function() {
   oFF.UiDateTimeField.call(this);
  this._ff_c = "UiTimePicker";
};
oFF.UiTimePicker.prototype = new oFF.UiDateTimeField();

oFF.UiTimePicker.prototype.newInstance = function() {
  var object = new oFF.UiTimePicker();
  object.setup();
  return object;
};

oFF.UiTimePicker.prototype.initializeNative = function() {
  oFF.UiDateTimeField.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_TimePicker(this.getId());

  this.setNativeControl(nativeControl);
};

oFF.UiTimePicker.prototype.releaseObject = function() {
  oFF.UiDateTimeField.prototype.releaseObject.call(this);
};

// ======================================

// ======================================

oFF.UiTimePicker.prototype.setMinutesInterval = function(minInterval) {
  oFF.UiDateTimeField.prototype.setMinutesInterval.call(this, minInterval);
  this.getNativeControl().setMinutesStep(minInterval);
  return this;
};

oFF.UiTimePicker.prototype.getMinutesInterval = function() {
  return oFF.UiDateTimeField.prototype.getMinutesInterval.call(this);
};

oFF.UiTimePicker.prototype.setSecondsInterval = function(secInterval) {
  oFF.UiDateTimeField.prototype.setSecondsInterval.call(this, secInterval);
  this.getNativeControl().setSecondsStep(secInterval);
  return this;
};

oFF.UiTimePicker.prototype.getSecondsInterval = function() {
  return oFF.UiDateTimeField.prototype.getSecondsInterval.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiDateTimePicker = function() {
   oFF.UiDatePicker.call(this);
  this._ff_c = "UiDateTimePicker";
};
oFF.UiDateTimePicker.prototype = new oFF.UiDatePicker();

oFF.UiDateTimePicker.prototype.newInstance = function() {
  var object = new oFF.UiDateTimePicker();
  object.setup();
  return object;
};

oFF.UiDateTimePicker.prototype.initializeNative = function() {
  oFF.UiDateTimeField.prototype.initializeNative.call(this); // skip superclass as we do not want the init native from date picker to run
  let nativeControl = new ui5.sap_m_DateTimePicker(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiDateTimePicker.prototype.setMinutesInterval = function(minInterval) {
  oFF.UiDateTimeField.prototype.setMinutesInterval.call(this, minInterval);
  this.getNativeControl().setMinutesStep(minInterval);
  return this;
};

oFF.UiDateTimePicker.prototype.setSecondsInterval = function(secInterval) {
  oFF.UiDateTimeField.prototype.setSecondsInterval.call(this, secInterval);
  this.getNativeControl().setSecondsStep(secInterval);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiCalendar = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiCalendar";
};
oFF.UiCalendar.prototype = new oFF.UiGeneric();

oFF.UiCalendar.prototype.newInstance = function() {
  var object = new oFF.UiCalendar();
  object.setup();
  return object;
};

oFF.UiCalendar.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_ui_unified_Calendar(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiCalendar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelect event
  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiCalendar.prototype.setStartDate = function(startDate) {
  oFF.UiGeneric.prototype.setStartDate.call(this, startDate);
  this.getNativeControl().removeAllSelectedDates();
  var dateRangeObj = this._generateCurrentDateRangeObject();
  if (dateRangeObj && dateRangeObj.getStartDate()) {
    this.getNativeControl().addSelectedDate(dateRangeObj);
    this.getNativeControl().focusDate(dateRangeObj.getStartDate());
  }
  return this;
};

oFF.UiCalendar.prototype.getStartDate = function() {
  var selectedDates = this.getNativeControl().getSelectedDates();
  if (selectedDates.length > 0) {
    var selectedDate = selectedDates[0];
    var startDate = selectedDate.getStartDate();
    var valFormat = this.getValueFormat() || "yyyy-MM-dd";
    var dateFormatter = ui5.sap_ui_core_format_DateFormat.getDateTimeInstance({
      pattern: valFormat
    });
    var formattedString = dateFormatter.format(startDate);
    return formattedString;
  }
  return oFF.UiGeneric.prototype.getStartDate.call(this);
};

oFF.UiCalendar.prototype.setEndDate = function(endDate) {
  oFF.UiGeneric.prototype.setEndDate.call(this, endDate);
  this.getNativeControl().removeAllSelectedDates();
  var dateRangeObj = this._generateCurrentDateRangeObject();
  if (dateRangeObj && dateRangeObj.getEndDate()) {
    this.getNativeControl().addSelectedDate(dateRangeObj);
    this.getNativeControl().focusDate(dateRangeObj.getEndDate());
  }
  return this;
};

oFF.UiCalendar.prototype.getEndDate = function() {
  var selectedDates = this.getNativeControl().getSelectedDates();
  if (selectedDates.length > 0) {
    var selectedDate = selectedDates[0];
    var endDate = selectedDate.getEndDate();
    if (endDate) {
      var valFormat = this.getValueFormat() || "yyyy-MM-dd";
      var dateFormatter = ui5.sap_ui_core_format_DateFormat.getDateTimeInstance({
        pattern: valFormat
      });
      var formattedString = dateFormatter.format(endDate);
      return formattedString;
    } else {
      return null; // if no end date present then return null
    }
  }
  return oFF.UiGeneric.prototype.getEndDate.call(this);
};

oFF.UiCalendar.prototype.setValueFormat = function(valueFormat) {
  oFF.UiGeneric.prototype.setValueFormat.call(this, valueFormat);
  // the ui5 control does not support valueformat so i need to do it manually in the setValue and getValue functions
  return this;
};

oFF.UiCalendar.prototype.setMinDate = function(minDate) {
  oFF.UiGeneric.prototype.setMinDate.call(this, minDate);
  var dateObject = new Date(minDate);
  this.getNativeControl().setMinDate(dateObject);
  return this;
};

oFF.UiCalendar.prototype.setMaxDate = function(maxDate) {
  oFF.UiGeneric.prototype.setMaxDate.call(this, maxDate);
  var dateObject = new Date(maxDate);
  this.getNativeControl().setMaxDate(dateObject);
  return this;
};

oFF.UiCalendar.prototype.setIntervalSelection = function(value) {
  oFF.UiGeneric.prototype.setIntervalSelection.call(this, value);
  this.getNativeControl().setIntervalSelection(value);
  return this;
};

oFF.UiCalendar.prototype.isIntervalSelection = function() {
  return this.getNativeControl().getIntervalSelection();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiCalendar.prototype._generateCurrentDateRangeObject = function() {
  var startDate = oFF.UiGeneric.prototype.getStartDate.call(this);;
  var endDate = oFF.UiGeneric.prototype.getEndDate.call(this);

  var dateRange = new ui5.sap_ui_unified_DateRange();
  var valFormat = this.getValueFormat() || "yyyy-MM-dd";
  var dateFormatter = ui5.sap_ui_core_format_DateFormat.getDateTimeInstance({
    pattern: valFormat
  });
  var startDateObject = dateFormatter.parse(startDate);
  var endDateObject = dateFormatter.parse(endDate);
  dateRange.setStartDate(startDateObject);
  dateRange.setEndDate(endDateObject);

  return dateRange;
};

oFF.UiClock = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiClock";

  this.m_updateTimeTimeout = null;
};
oFF.UiClock.prototype = new oFF.UiGeneric();

oFF.UiClock.prototype.newInstance = function() {
  var object = new oFF.UiClock();
  object.setup();
  return object;
};

oFF.UiClock.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Label(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);

  this._updateTime();
};

oFF.UiClock.prototype.releaseObject = function() {
  if (this.m_updateTimeTimeout) {
    clearTimeout(this.m_updateTimeTimeout);
  }
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiClock.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onClick event
  nativeControl.onclick = function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(oFF.UiControlEvent.create(myself));
    }
  };

  // onHover, onHoverEnd
  nativeControl.addEventDelegate({
    onmouseover: function() {
      if (myself.getListenerOnPress() !== null) {
        // on hover if listener on press exists change the cursor to pointer for click ui
        myself.applyCss("cursor", "pointer");
      }
    },
    onmouseout: function() {
      // after leaving hover change the cursor back to the default one
      myself.applyCss("cursor", "default");
    }
  });
};

// ======================================
oFF.UiClock.prototype.setFontWeight = function(fontWeight) {
  oFF.UiGeneric.prototype.setFontWeight.call(this, fontWeight);
  this.getNativeControl().setDesign(oFF.ui.Ui5ConstantUtils.parseFontWeight(fontWeight));
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiClock.prototype.applyCustomCssStyling = function(element) {
  element.style.userSelect = "none";
  element.style.cursor = "default";
};

// Helpers
// ======================================

oFF.UiClock.prototype._updateTime = function() {
  if (this.getNativeControl()) {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    //var time = h + ":" + m + ":" + s; // with seconds
    var time = h + ":" + m; // only minutes
    this.getNativeControl().setText(time);
  }

  this.m_updateTimeTimeout = setTimeout(this._updateTime.bind(this), 1000);
};

class UiPanel extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiPanel";
  }

  newInstance() {
    let object = new UiPanel();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Panel(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnExpand(listener) {
    super.registerOnExpand(listener);
    this.attachEventCallback("expand", this._handleExpand, listener);
    return this;
  }

  registerOnCollapse(listener) {
    super.registerOnCollapse(listener);
    this.attachEventCallback("expand", this._handleCollapse, listener);
    return this;
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  // ======================================

  setHeader(header) {
    super.setHeader(header);
    this.getNativeControl().destroyHeaderToolbar(); // we auto create a toolbar so we can destroy it
    if (header != null) {
      let nativeHeaderControl = header.getNativeControl();
      let tmpToolbar = new ui5.sap_m_Toolbar(this.getId() + "_headerToolbar");
      tmpToolbar.addContent(nativeHeaderControl);
      this.getNativeControl().setHeaderToolbar(tmpToolbar);
    }
    return this;
  }

  // ======================================

  setHeaderToolbar(headerToolbar) {
    super.setHeaderToolbar(headerToolbar);
    if (headerToolbar != null) {
      var nativeToolbar = headerToolbar.getNativeControl();
      this.getNativeControl().setHeaderToolbar(nativeToolbar);
    } else {
      this.getNativeControl().setHeaderToolbar(null);
    }
    return this;
  }

  // ======================================

  setText(text) {
    oFF.DfUiGeneric.prototype.setText.call(this, text); // skip superclass implementation since the property name is different
    this.getNativeControl().setHeaderText(text);
    return this;
  }

  setAnimated(animated) {
    super.setAnimated(animated);
    this.getNativeControl().setExpandAnimation(animated);
    return this;
  }

  isAnimated() {
    return this.getNativeControl().getExpandAnimation();
  }

  // Overrides
  // ======================================

  isExpanded() {
    return this.getNativeControl().getExpanded();
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleExpand(oEvent) {
    let isExpand = oEvent.getParameters().expand;
    let isTriggeredByInteraction = oEvent.getParameters().triggeredByInteraction;
    if (this.getListenerOnExpand() != null && isExpand) {
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_TRIGGERED_BY_INTERACTION, isTriggeredByInteraction);
      this.getListenerOnExpand().onExpand(newItemEvent);
    }
  }

  _handleCollapse(oEvent) {
    let isExpand = oEvent.getParameters().expand;
    let isTriggeredByInteraction = oEvent.getParameters().triggeredByInteraction;
    if (this.getListenerOnCollapse() != null && !isExpand) {
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_TRIGGERED_BY_INTERACTION, isTriggeredByInteraction);
      this.getListenerOnCollapse().onCollapse(newItemEvent);
    }
  }

}

oFF.UiPanel = UiPanel;

class UiCard extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiCard";
  }

  newInstance() {
    let object = new UiCard();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_f_Card(this.getId());

    this.setNativeControl(nativeControl);
  }
  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().destroyContent();
    if (content !== null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().setContent(childControl);
    }
    return this;
  }


  clearContent() {
    super.clearContent();
    this.getNativeControl().destroyContent();
    return this;
  }

  // ======================================

  setHeader(header) {
    super.setHeader(header);
    if (header !== null) {
      let nativeHeader = header.getNativeControl();
      this.getNativeControl().setHeader(nativeHeader);
    } else {
      this.getNativeControl().setHeader(null);
    }
    return this;
  }

  // ======================================

  setHeaderPosition(headerPosition) {
    super.setHeaderPosition(headerPosition);
    this.getNativeControl().setHeaderPosition(oFF.ui.Ui5ConstantUtils.parseHeaderPosition(headerPosition));
    return this;
  }

}

oFF.UiCard = UiCard;

class UiMenu extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiMenu";
  }

  newInstance() {
    let object = new UiMenu();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Menu(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnClose(listener) {
    super.registerOnClose(listener);
    this.attachEventCallback("closed", this._handleClosed, listener);
    return this;
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().addItem(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().insertItem(nativeItem, index);
    return this;
  }

  removeItem(item) {
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().removeItem(nativeItem);
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  openAt(control) {
    super.openAt(control);
    const nativeControl = control?.getNativeControl?.();
    this.getNativeControl().openBy(nativeControl);
    return this;
  }

  openAtPosition(posX, posY) {
    super.openAtPosition(posX, posY);

    let position = {};
    position.offsetX = posX;
    position.offsetY = posY;
    //  position.left = 150;
    //  position.top = 150;

    let isRTL = ui5.sap_base_Localization.getRTL();
    if (isRTL) {
      // RTL requires the reference element to be set and also left and top in the postion object for some reason, hence the special handling
      position.left = posX;
      position.top = posY;
      this.getNativeControl().openAsContextMenu(position, ui5.sap_jQuery("html"));
    } else {
      this.getNativeControl().openAsContextMenu(position);
    }

    return this;
  }

  openAtDock(control, withKeyboard, dockMy, dockAt, dockOffset) {
    super.openAtDock(control, withKeyboard, dockMy, dockAt, dockOffset);
    const nativeControl = control?.getNativeControl?.();
    let nativeDockMy = oFF.ui.Ui5ConstantUtils.parsePopupDock(dockMy);
    let nativeDockAt = oFF.ui.Ui5ConstantUtils.parsePopupDock(dockAt);
    this.getNativeControl().openBy(nativeControl, withKeyboard, nativeDockMy, nativeDockAt, dockOffset);
    return this;
  }

  close() {
    super.close();
    this.getNativeControl().close();
    return this;
  }

  isOpen() {
    return super.isOpen();
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================


  // Event handlers
  // ======================================

  _handleClosed(oEvent) {
    if (this.getListenerOnClose() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnClose().onClose(ffEvent);
    }
  }

}

oFF.UiMenu = UiMenu;

class UiMenuItem extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiMenuItem";
  }

  newInstance() {
    let object = new UiMenuItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_MenuItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  releaseObject() {
    this.m_hoverDelegate = null;
    this.m_hoverEndDelegate = null;
    super.releaseObject();
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  registerOnHover(listener) {
    oFF.DfUiGeneric.prototype.registerOnHover.call(this, listener); // skip superclass, not a browser event, event delegate
    this.attachEventDelegate(this._getHoverDelegate(), listener);
    return this;
  }

  registerOnHoverEnd(listener) {
    oFF.DfUiGeneric.prototype.registerOnHoverEnd.call(this, listener); // same skip superclass, not a browser event, event delegate
    this.attachEventDelegate(this._getHoverEndDelegate(), listener);
    return this;
  };

  // ======================================

  addItem(item) {
    super.addItem(item);
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().addItem(nativeItem);
    }
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().insertItem(nativeItem, index);
    }
    return this;
  }

  removeItem(item) {
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().removeItem(nativeItem);
    }
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  _getHoverDelegate() {
    if (!this.m_hoverDelegate) {
      this.m_hoverDelegate = {};
      this.m_hoverDelegate["onmouseover"] = this.handleHover;
    }
    return this.m_hoverDelegate;
  }

  _getHoverEndDelegate() {
    if (!this.m_hoverEndDelegate) {
      this.m_hoverEndDelegate = {};
      this.m_hoverEndDelegate["onmouseout"] = this.handleHoverEnd;
    }
    return this.m_hoverEndDelegate;
  }

}

oFF.UiMenuItem = UiMenuItem;

oFF.UiToolbar = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiToolbar";
};
oFF.UiToolbar.prototype = new oFF.UiGeneric();

oFF.UiToolbar.prototype.newInstance = function() {
  var object = new oFF.UiToolbar();
  object.setup();
  return object;
};

oFF.UiToolbar.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_Toolbar(this.getId());

  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiToolbar.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContent(nativeItem);
  return this;
};

oFF.UiToolbar.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContent(nativeItem, index);
  return this;
};

oFF.UiToolbar.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContent(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiToolbar.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

oFF.UiToolbar.prototype.setToolbarDesign = function(toolbarDesign) {
  oFF.UiGeneric.prototype.setToolbarDesign.call(this, toolbarDesign);
  this.getNativeControl().setDesign(oFF.ui.Ui5ConstantUtils.parseToolbarDesign(toolbarDesign));
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

class UiOverflowToolbar extends oFF.UiToolbar {
  constructor() {
    super();
    this._ff_c = "UiOverflowToolbar";
  }

  newInstance() {
    let object = new UiOverflowToolbar();
    object.setup();
    return object;
  }

  initializeNative() {
    oFF.UiGeneric.prototype.initializeNative.call(this); //call UxGeneric directly, we want to skip the UxButton initialize method call here since we create a different control
    let nativeControl = new ui5.sap_m_OverflowToolbar(this.getId());

    this.setNativeControl(nativeControl);
  }

  // UxOverflowToolbar inherits from Toolbar and it has the same base properties and events

}

oFF.UiOverflowToolbar = UiOverflowToolbar;

oFF.UiSegmentedButton = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSegmentedButton";
};
oFF.UiSegmentedButton.prototype = new oFF.UiGeneric();

oFF.UiSegmentedButton.prototype.newInstance = function() {
  var object = new oFF.UiSegmentedButton();
  object.setup();
  return object;
};

oFF.UiSegmentedButton.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_SegmentedButton(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiSegmentedButton.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    const nativeItem = oControlEvent.getParameters().item;
    let selectedItem = null;
    if (nativeItem !== null) {
      selectedItem = oFF.UiGeneric.getFfControl(nativeItem);
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
      newSelectionEvent.setSingleSelectionData(selectedItem);
      myself.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
    }
  });
};

// ======================================

oFF.UiSegmentedButton.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiSegmentedButton.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiSegmentedButton.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiSegmentedButton.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiSegmentedButton.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item !== null && item !== undefined) {
    var nativeItem = item.getNativeControl();
    this.getNativeControl().setSelectedItem(nativeItem);
  } else {
    this.getNativeControl().setSelectedItem(null); // remove selected item
  }
  return this;
};

oFF.UiSegmentedButton.prototype.getSelectedItem = function() {
  var selectedItemId = this.getNativeControl().getSelectedItem();
  var selectedItem = this.getItemById(selectedItemId);
  if (selectedItem != null) {
    return selectedItem;
  }
  return null;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSegmentedButtonItem = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSegmentedButtonItem";
};
oFF.UiSegmentedButtonItem.prototype = new oFF.UiGeneric();

oFF.UiSegmentedButtonItem.prototype.newInstance = function() {
  var object = new oFF.UiSegmentedButtonItem();
  object.setup();
  return object;
};

oFF.UiSegmentedButtonItem.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_SegmentedButtonItem(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiSegmentedButtonItem.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onPress event
  nativeControl.attachPress(function(oControlEvent) {
    if (myself.getListenerOnPress() !== null) {
      myself.getListenerOnPress().onPress(oFF.UiControlEvent.create(myself));
    }
  });
};
// ======================================

oFF.UiSegmentedButtonItem.prototype.setSelected = function(selected) {
  oFF.UiGeneric.prototype.setSelected.call(this, selected);
  var parent = this.getParent();
  if (parent !== null && parent !== undefined) {
    var parentNative = parent.getNativeControl();
    parentNative.setSelectedItem(this.getNativeControl());
  }
  return this;
};

oFF.UiSegmentedButtonItem.prototype.isSelected = function() {
  var parent = this.getParent();
  if (parent !== null && parent !== undefined) {
    var parentNative = parent.getNativeControl();
    var selectedItemId = parentNative.getSelectedItem();
    return selectedItemId == this.getId();
  }
  return oFF.UiGeneric.prototype.isSelected.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiPage = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiPage";
};
oFF.UiPage.prototype = new oFF.UiGeneric();

oFF.UiPage.prototype.newInstance = function() {
  var object = new oFF.UiPage();
  object.setup();
  return object;
};

oFF.UiPage.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_Page(this.getId());
  nativeControl.setTitle("Page");
  nativeControl.setShowNavButton(true); // always show nav button, but not on inital page

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiPage.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onBack event
  nativeControl.attachNavButtonPress(function(oEvent) {
    if (myself.getParent() != null && myself.getParent().getUiType() === oFF.UiType.NAVIGATION_CONTAINER) {
      myself.getParent().backNavBtnPressed();
    }
  });
};

// ======================================

oFF.UiPage.prototype.addPageButton = function(pageButton) {
  oFF.UiGeneric.prototype.addPageButton.call(this, pageButton);
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().addHeaderContent(nativePageButton);
  return this;
};

oFF.UiPage.prototype.insertPageButton = function(pageButton, index) {
  oFF.UiGeneric.prototype.insertPageButton.call(this, pageButton, index);
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().insertHeaderContent(nativePageButton, index);
  return this;
};

oFF.UiPage.prototype.removePageButton = function(pageButton) {
  var nativePageButton = pageButton.getNativeControl();
  this.getNativeControl().removeHeaderContent(nativePageButton);
  oFF.UiGeneric.prototype.removePageButton.call(this, pageButton);
  return this;
};

oFF.UiPage.prototype.clearPageButtons = function() {
  oFF.UiGeneric.prototype.clearPageButtons.call(this);
  this.getNativeControl().removeAllHeaderContent();
  return this;
};

// ======================================

oFF.UiPage.prototype.setContent = function(content) {
  oFF.UiGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content != null) {
    let nativeContent = content.getNativeControl();
    this.getNativeControl().addContent(nativeContent);
  }
  return this;
};

// ======================================

oFF.UiPage.prototype.setHeader = function(header) {
  oFF.UiGeneric.prototype.setHeader.call(this, header);
  if (header != null) {
    let nativeHeaderControl = this._wrapInToolbarIfNecessary(header, "Header");
    this.getNativeControl().setCustomHeader(nativeHeaderControl);
  } else {
    this.getNativeControl().setCustomHeader(null);
  }
  return this;
};

// ======================================

oFF.UiPage.prototype.setSubHeader = function(subHeader) {
  oFF.UiGeneric.prototype.setSubHeader.call(this, subHeader);
  if (subHeader != null) {
    let nativeSubHeader = this._wrapInToolbarIfNecessary(subHeader, "SubHeader");
    this.getNativeControl().setSubHeader(nativeSubHeader);
  } else {
    this.getNativeControl().setSubHeader(null);
  }
  return this;
};

// ======================================

oFF.UiPage.prototype.setFooter = function(footer) {
  oFF.UiGeneric.prototype.setFooter.call(this, footer);
  if (footer != null) {
    let nativeFooter = this._wrapInToolbarIfNecessary(footer, "Footer");
    this.getNativeControl().setFooter(nativeFooter);
  } else {
    this.getNativeControl().setFooter(null);
  }
  return this;
};

// ======================================

oFF.UiPage.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setTitle(title);
  return this;
};

oFF.UiPage.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

oFF.UiPage.prototype.setShowNavButton = function(showNavButton) {
  oFF.UiGeneric.prototype.setShowNavButton.call(this, showNavButton);
  this.getNativeControl().setShowNavButton(showNavButton);
  return this;
};

oFF.UiPage.prototype.isShowNavButton = function() {
  return this.getNativeControl().getShowNavButton();
};

oFF.UiPage.prototype.setShowHeader = function(showHeader) {
  oFF.UiGeneric.prototype.setShowHeader.call(this, showHeader);
  this.getNativeControl().setShowHeader(showHeader);
  return this;
};

oFF.UiPage.prototype.isShowHeader = function() {
  return this.getNativeControl().getShowHeader();
};


oFF.UiPage.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

oFF.UiPage.prototype.setFloatingFooter = function(floatingFooter) {
  oFF.UiGeneric.prototype.setFloatingFooter.call(this, floatingFooter);
  this.getNativeControl().setFloatingFooter(floatingFooter);
  return this;
};

oFF.UiPage.prototype.isFloatingFooter = function() {
  return this.getNativeControl().getFloatingFooter();
};

oFF.UiPage.prototype.setContentOnlyBusy = function(contentOnlyBusy) {
  oFF.UiGeneric.prototype.setContentOnlyBusy.call(this, contentOnlyBusy);
  this.getNativeControl().setContentOnlyBusy(contentOnlyBusy);
  return this;
};

oFF.UiPage.prototype.isContentOnlyBusy = function() {
  return this.getNativeControl().getContentOnlyBusy();
};

oFF.UiPage.prototype.setShowSubHeader = function(showSubHeader) {
  oFF.UiGeneric.prototype.setShowSubHeader.call(this, showSubHeader);
  this.getNativeControl().setShowSubHeader(showSubHeader);
  return this;
};

oFF.UiPage.prototype.isShowSubHeader = function() {
  return this.getNativeControl().getShowSubHeader();
};

oFF.UiPage.prototype.setEnableScrolling = function(enabledScrolling) {
  oFF.UiGeneric.prototype.setEnableScrolling.call(this, enabledScrolling);
  this.getNativeControl().setEnableScrolling(enabledScrolling);
  return this;
};

oFF.UiPage.prototype.isEnableScrolling = function() {
  return this.getNativeControl().getEnableScrolling();
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiPage.prototype.hideNavigationButton = function() {
  if (this.getNativeControl()) {
    this.getNativeControl().setShowNavButton(false);
  }
};

oFF.UiPage.prototype._wrapInToolbarIfNecessary = function(control) {
  // header, footer or subheader require a control of the sapui5 IBar interface
  // currently we do not have any check for that in the ui so we do that check here and wrap the control if it is not a toolbar
  if (control != null) {
    var nativeControl = control.getNativeControl();
    if (control.getUiType() === oFF.UiType.TOOLBAR) {
      return nativeControl;
    }
    var tmpToolbar = new ui5.sap_m_Toolbar(this.getId() + "_Toolbar");
    tmpToolbar.addContent(nativeControl);
    return tmpToolbar;
  }
};

oFF.UiPageButton = function() {
   oFF.UiButton.call(this);
  this._ff_c = "UiPageButton";
};
oFF.UiPageButton.prototype = new oFF.UiButton();

oFF.UiPageButton.prototype.newInstance = function() {
  var object = new oFF.UiPageButton();
  object.setup();
  return object;
};

// PageButton inherits from Button and it has the same properties

class UiNavigationContainer extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiNavigationContainer";
  }

  newInstance() {
    let object = new UiNavigationContainer();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_NavContainer(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  pushPage(page) {
    super.pushPage(page);
    let nativePage = page.getNativeControl();
    this.getNativeControl().addPage(nativePage);
    // set the initial page
    if (this.getNativeControl().getInitialPage() == null) {
      this.getNativeControl().setInitialPage(nativePage);
      page.hideNavigationButton(); // initial page should never have a back button
    }
    this.getNativeControl().to(nativePage);
    return this;
  }

  popPage() {
    let removedPage = super.popPage();
    this.getNativeControl().back();

    /*
    // note (mp): this is probably not needed as removePage is a protected method and causes a popover to lose focus
    if (removedPage) {
      let nativeChild = removedPage.getNativeControl();
      this.getNativeControl().removePage(nativeChild);
    }
    */

    // set the initial page to null when popping last page
    if (this.getNativeControl().getPages().length <= 0) {
      this.getNativeControl().setInitialPage(null);
    }
    // send on back event
    if (this.getListenerOnBack() !== null) {
      this.getListenerOnBack().onBack(oFF.UiControlEvent.create(this));
    }
    return removedPage;
  }

  clearPages() {
    super.clearPages();
    this.getNativeControl().setInitialPage(null);
    this.getNativeControl().removeAllPages();
    return this;
  }

  // ======================================

  popToPage(page) {
    super.popToPage(page);
    if (page) {
      let nativePage = page.getNativeControl();
      // pop only if the desired page is not the current page, and when the desired page is on the stack
      if (nativePage != this.getNativeControl().getCurrentPage() && this.getNativeControl().indexOfPage(nativePage) != -1) {
        this.getNativeControl().backToPage(nativePage.getId());

        // remove all the pages from the native page storage which are not on the stack anymore
        this._removeAllPagesTillNativePage(nativePage);

        // send on back event
        if (this.getListenerOnBack() !== null) {
          this.getListenerOnBack().onBack(oFF.UiControlEvent.create(this));
        }
      }
    }
    return this;
  }

  // ======================================
  isBusy() {
    return this.getNativeControl().isBusy();
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  applyCustomCssStyling(element) {
    // the control needs to have a min height or it will not be visible in dialogs
    element.style.minHeight = "200px";
  }

  // Helpers
  // ======================================

  backNavBtnPressed() {
    this.popPage();
  }

  _removeAllPagesTillNativePage(nativePage) {
    if (nativePage) {
      let pageIndex = this.getNativeControl().getPages().indexOf(nativePage);
      if (pageIndex != -1) {
        let pagesToRemove = this.getNativeControl().getPages().slice(pageIndex + 1, this.getNativeControl().getPages().length);
        if (pagesToRemove != null) {
          for (let a = 0; a < pagesToRemove.length; a++) {
            let tmpPage = pagesToRemove[a];
            this.getNativeControl().removePage(tmpPage);
          }
        }
      }
    }
  }
}

oFF.UiNavigationContainer = UiNavigationContainer;

oFF.UiTreeLegacy = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTreeLegacy";
};
oFF.UiTreeLegacy.prototype = new oFF.UiGeneric();

oFF.UiTreeLegacy.prototype.newInstance = function() {
  var object = new oFF.UiTreeLegacy();
  object.setup();
  return object;
};

oFF.UiTreeLegacy.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Tree(this.getId());
  nativeControl.setIncludeItemInSelection(true);
  nativeControl.setSticky([ui5.sap_m_Sticky.HeaderToolbar]);

  var oModel = new ui5.sap_ui_model_json_JSONModel();
  oModel.setSizeLimit(1100); // Default is 100 for a UI5 model.
  nativeControl.setModel(oModel);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

oFF.UiTreeLegacy.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiTreeLegacy.prototype._addEvents = function(nativeControl) {
  // onToggleOpen state
  nativeControl.attachToggleOpenState((oControlEvent) => {
    var isExpanded = oControlEvent.getParameters().expanded;
    var nativeItemIndex = oControlEvent.getParameters().itemIndex;
    var nativeItem = this.getNativeControl().getItems()[nativeItemIndex];

    if (nativeItem == null) {
      oFF.ui.Log.logError("Something went wrong - could not find native item");
      return;
    }

    var mobileTreeItem = oFF.UiGeneric.getFfControl(nativeItem);

    if (mobileTreeItem == null) {
      oFF.ui.Log.logError("Something went wrong - could not find mobile tree item");
      return;
    }

    if (isExpanded) {
      // item event
      mobileTreeItem.itemExpanded();
      // tree control event
      if (this.getListenerOnExpand() != null) {
        const newItemEvent = oFF.UiItemEvent.create(this);
        newItemEvent.setItemData(mobileTreeItem);
        this.getListenerOnExpand().onExpand(newItemEvent);
      }
    } else {
      // items event
      mobileTreeItem.itemCollapsed();
      // tree control event
      if (this.getListenerOnCollapse() != null) {
        const newItemEvent = oFF.UiItemEvent.create(this);
        newItemEvent.setItemData(mobileTreeItem);
        this.getListenerOnCollapse().onCollapse(newItemEvent);
      }
    }
  });

  // onSelectionChange event
  nativeControl.attachSelectionChange((oEvent) => {
    if (this.getListenerOnSelectionChange() != null) {
      const newSelectionEvent = oFF.ui.FfEventUtils.prepareSelectionEvent(this, oEvent);
      this.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
    }
  });

  // onDelete event
  nativeControl.attachDelete((oControlEvent) => {
    if (this.getListenerOnDelete() != null) {
      let nativeTreeItem = oControlEvent.getParameters().listItem;
      let deletedItem = oFF.UiGeneric.getFfControl(nativeTreeItem);
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.setItemData(deletedItem);
      this.getListenerOnDelete().onDelete(newItemEvent);
    }
  });
};

// ======================================

oFF.UiTreeLegacy.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  this.createTreeModel();
  return this;
};

oFF.UiTreeLegacy.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  this.createTreeModel();
  return this;
};

oFF.UiTreeLegacy.prototype.removeItem = function(item) {
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  this.createTreeModel();
  return this;
};

oFF.UiTreeLegacy.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.createTreeModel();
  return this;
};

// ======================================

oFF.UiTreeLegacy.prototype.getSelectedItem = function() {
  var nativeSelectedItem = this.getNativeControl().getSelectedItem();
  if (nativeSelectedItem) {
    return oFF.UiGeneric.getFfControl(nativeSelectedItem);
  }
  return null;
};

oFF.UiTreeLegacy.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().removeSelections();
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.getNativeControl().removeSelections();
  }
};

oFF.UiTreeLegacy.prototype.getSelectedItems = function() {
  var selectedItems = oFF.XList.create();
  var nativeSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < nativeSelectedItems.length; i++) {
    var tmpNativeTreeItem = nativeSelectedItems[i];
    var ffControl = oFF.UiGeneric.getFfControl(tmpNativeTreeItem);
    selectedItems.add(ffControl);
  }
  return selectedItems;
};

oFF.UiTreeLegacy.prototype.setSelectedItems = function(items) {
  oFF.UiGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().removeSelections();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

oFF.UiTreeLegacy.prototype.addSelectedItem = function(item) {
  oFF.UiGeneric.prototype.addSelectedItem.call(this, item);
  var nativeItemToSelect = item.getNativeControl();
  if (nativeItemToSelect) {
    this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
  }
  return this;
};

oFF.UiTreeLegacy.prototype.removeSelectedItem = function(item) {
  oFF.UiGeneric.prototype.removeSelectedItem.call(this, item);
  var nativeItemToDeselect = item.getNativeControl();
  if (nativeItemToDeselect) {
    this.getNativeControl().setSelectedItem(nativeItemToDeselect, false);
  }
  return this;
};

oFF.UiTreeLegacy.prototype.clearSelectedItems = function() {
  oFF.UiGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

oFF.UiTreeLegacy.prototype.getHeader = function() {
  return oFF.UiGeneric.prototype.getHeader.call(this);
};

oFF.UiTreeLegacy.prototype.setHeader = function(header) {
  oFF.UiGeneric.prototype.setHeader.call(this, header);
  this.getNativeControl().destroyHeaderToolbar(); // we auto create the toolbar so destroy it
  if (header != null) {
    let nativeHeaderControl = header.getNativeControl();
    let tmpToolbar = new ui5.sap_m_Toolbar(this.getId() + "_headerToolbar");
    tmpToolbar.addContent(nativeHeaderControl);
    this.getNativeControl().setHeaderToolbar(tmpToolbar);
  }
  return this;
};

// ======================================

oFF.UiTreeLegacy.prototype.expandToLevel = function(level) {
  oFF.UiGeneric.prototype.expandToLevel.call(this, level);
  if (this.hasItems()) {
    this.getNativeControl().expandToLevel(level);
  }
  return this;
};

oFF.UiTreeLegacy.prototype.collapseAll = function() {
  oFF.UiGeneric.prototype.collapseAll.call(this);
  if (this.hasItems()) {
    this.getNativeControl().collapseAll();
  }
  return this;
};

// ======================================

oFF.UiTreeLegacy.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setHeaderText(title);
  return this;
};

oFF.UiTreeLegacy.prototype.getTitle = function() {
  return oFF.UiGeneric.prototype.getTitle.call(this);
};

oFF.UiTreeLegacy.prototype.setBusy = function(busy) {
  oFF.UiGeneric.prototype.setBusy.call(this, busy);
  return this;
};

oFF.UiTreeLegacy.prototype.isBusy = function() {
  return oFF.UiGeneric.prototype.isBusy.call(this);
};

oFF.UiTreeLegacy.prototype.setSelectionMode = function(selectionMode) {
  oFF.UiGeneric.prototype.setSelectionMode.call(this, selectionMode);
  this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseSelectionMode(selectionMode));
  return this;
};

oFF.UiTreeLegacy.prototype.getSelectionMode = function() {
  return oFF.UiGeneric.prototype.getSelectionMode.call(this);
};

oFF.UiTreeLegacy.prototype.setExpanded = function(expanded) {
  oFF.UiGeneric.prototype.setExpanded.call(this, expanded);
  if (this.hasItems()) {
    if (expanded === true) {
      this.getNativeControl().expandToLevel(999);
    } else {
      this.getNativeControl().collapseAll();
    }
  }
  return this;
};

oFF.UiTreeLegacy.prototype.isExpanded = function() {
  return oFF.UiGeneric.prototype.isExpanded.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiTreeLegacy.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or tree items will break out of bounds if the tree items size is bigger then the control
  element.style.overflow = "auto";
};

// Helpers
// ======================================

oFF.UiTreeLegacy.prototype.createTreeModel = function() {
  var myself = this;
  var children = this.getItems();
  var modelData = [];

  if (children && children.size() > 0) {
    modelData = this._generateTreeModelRecursive(children);
  }

  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData(modelData);
    this.getNativeControl().bindItems("/", function(sId, oContext) {
      var itemId = oContext.getProperty("ffTreeItemId");
      var mobileTreeItem = myself._getMobileTreeItemById(itemId);
      if (mobileTreeItem) {
        mobileTreeItem.rerenderNativeTreeItem();
        return mobileTreeItem.getNativeControl();
      }
      return null;
    });
  } else {
    this.getNativeControl().getModel().setData(modelData);
    this.getNativeControl().updateItems();
  }

  // ------------ EXPANDED WHOLE TREE
  // if exapnded property on tree control is set then expand the whole tree
  if (this.isExpanded()) {
    this.expand();
  }
  // ------------

};

oFF.UiTreeLegacy.prototype._generateTreeModelRecursive = function(children) {
  var tmpModel = [];
  if (children && children.size() > 0) {
    for (var i = 0; i < children.size(); i++) {
      var child = children.get(i);
      var newModelItem = new Object();
      newModelItem.ffTreeItemId = child.getId();
      var childItems = child.getItems();
      if (childItems && childItems.length > 0) {
        var tmpNodes = this._generateTreeModelRecursive(childItems);
        newModelItem.nodes = tmpNodes
      }
      tmpModel.push(newModelItem);
    }
    return tmpModel;
  }
  return [];
};

oFF.UiTreeLegacy.prototype._getMobileTreeItemById = function(itemId) {
  var children = this._getAllMobileTreeItems();
  for (var i = 0; i < children.length; i++) {
    var tmpChild = children[i];
    if (tmpChild.getId() == itemId) {
      return tmpChild;
    }
  }
  return null;
};

oFF.UiTreeLegacy.prototype._getAllMobileTreeItems = function() {
  var firstLevelChildren = this.getItems();
  var allMobileTreeListItems = this._getMobileTreeItemsRecursive(firstLevelChildren);
  if (allMobileTreeListItems && allMobileTreeListItems.length > 0) {
    return allMobileTreeListItems;
  }
  return [];
};

oFF.UiTreeLegacy.prototype._getMobileTreeItemsRecursive = function(children) {
  var tmpTreeItemsArray = [];
  if (children && children.size() > 0) {
    for (var i = 0; i < children.size(); i++) {
      var tmpChild = children.get(i);
      tmpTreeItemsArray.push(tmpChild);
      var tmpLowerChildArray = this._getMobileTreeItemsRecursive(tmpChild.getItems());
      if (tmpLowerChildArray && tmpLowerChildArray.length > 0) {
        tmpTreeItemsArray = tmpTreeItemsArray.concat(tmpLowerChildArray);
      }
    }
    return tmpTreeItemsArray;
  }
  return [];
};

oFF.UiTreeLegacy.prototype.expandNativeItem = function(treeItem) {
  var nativeItem = treeItem.getNativeControl();
  var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
  if (indexOfNativeItem != -1) {
    this.getNativeControl().expand(indexOfNativeItem);
  } else {
    this._tryToExpandPath(treeItem);
  }
};

oFF.UiTreeLegacy.prototype.collapseNativeItem = function(treeItem) {
  var nativeItem = treeItem.getNativeControl();
  var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
  if (indexOfNativeItem != -1 && nativeItem.isLeaf() == false) {
    this.getNativeControl().collapse(indexOfNativeItem);
  }
};

oFF.UiTreeLegacy.prototype._tryToExpandPath = function(treeItem) {
  if (treeItem) {
    var tmpItemParent = treeItem.getParent();
    var itemsArray = [treeItem];
    while (tmpItemParent && tmpItemParent.isExpanded() === false && tmpItemParent != this) {
      itemsArray = [tmpItemParent].concat(itemsArray);
      tmpItemParent = tmpItemParent.getParent();
    }
    if (itemsArray) {
      for (var a = 0; a < itemsArray.length; a++) {
        var tmpItem = itemsArray[a];
        if (tmpItem) {
          var nativeItem = tmpItem.getNativeControl();
          var indexOfNativeItem = this.getNativeControl().indexOfItem(nativeItem);
          if (indexOfNativeItem != -1) {
            this.getNativeControl().expand(indexOfNativeItem);
          }
        }
      }
    }
  }
};

class UiTreeItemLegacy extends oFF.UiTreeItemBaseLegacy {
  constructor() {
    super();
    this._ff_c = "UiTreeItemLegacy";
  }

  newInstance() {
    let object = new UiTreeItemLegacy();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_StandardTreeItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  // Overrides
  // ======================================

  setText(text) {
    oFF.DfUiGeneric.prototype.setText.call(this, text); // skip UxGeneric call since the property has a different name
    this.getNativeControl().setTitle(text);
    return this;
  }

  getText() {
    //important! Do not override getText with native method as this is used to rerender
    return super.getText();
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  rerenderNativeTreeItem() {
    super.rerenderNativeTreeItem();
    this.setText(this.getText());
    this.setIcon(this.getIcon());
  }

  // Event handlers
  // ======================================

}

oFF.UiTreeItemLegacy = UiTreeItemLegacy;

class UiCustomTreeItemLegacy extends oFF.UiTreeItemBaseLegacy {
  constructor() {
    super();
    this._ff_c = "UiCustomTreeItemLegacy";
  }

  newInstance() {
    let object = new UiCustomTreeItemLegacy();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_CustomTreeItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
      //cloning makes it work but then actual ff control references the original control
      // so that the clone does not react to property changes or events which makes it not good...
      //this.getNativeControl().addContent(childControl.clone());
    }
    return this;
  }


  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  rerenderNativeTreeItem() {
    if (this.getNativeControl()) {
      this.getNativeControl().removeAllContent(); // remove the content reference before destroying so that we do not destroy the contenet yet since we still need it
    }
    super.rerenderNativeTreeItem();
    this.setContent(this.getContent());
  }

  // Event handlers
  // ======================================

}

oFF.UiCustomTreeItemLegacy = UiCustomTreeItemLegacy;

class UiTree extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTree";
  }

  newInstance() {
    let object = new UiTree();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_webc_main_Tree(this.getId());

    this._addEvents(nativeControl);
    this.setNativeControl(nativeControl);
  }
  // ======================================

  _addEvents(nativeControl) {
    let myself = this;

    // onItemToggle event
    nativeControl.attachItemToggle(function(oControlEvent) {
      let nativeItem = oControlEvent.getParameters().item;
      if (nativeItem === null) {
        oFF.ui.Log.logError("Something went wrong - could not find native item");
        return;
      }

      let mobileTreeItem = oFF.UiGeneric.getFfControl(nativeItem);

      if (mobileTreeItem == null) {
        oFF.ui.Log.logError("Something went wrong - could not find mobile tree item");
        return;
      }

      let isExpanded = !nativeItem.getExpanded(); // checking state before toggle
      if (isExpanded) {
        // item event
        mobileTreeItem.itemExpanded();
        // tree control event
        if (myself.getListenerOnExpand() !== null) {
          const newItemEvent = oFF.UiItemEvent.create(myself);
          newItemEvent.setItemData(mobileTreeItem);
          myself.getListenerOnExpand().onExpand(newItemEvent);
        }
      } else {
        // items event
        mobileTreeItem.itemCollapsed();
        // tree control event
        if (myself.getListenerOnCollapse() !== null) {
          const newItemEvent = oFF.UiItemEvent.create(myself);
          newItemEvent.setItemData(mobileTreeItem);
          myself.getListenerOnCollapse().onCollapse(newItemEvent);
        }
      }
    });

    // onSelectionChange event
    nativeControl.attachSelectionChange(function(oControlEvent) {
      const parameters = oControlEvent.getParameters();
      const targetTreeItem = parameters.targetItem;
      const selectedTreeItems = parameters.selectedItems;
      const isSelect = selectedTreeItems.includes(targetTreeItem);
      if (isSelect === true) {
        const onSelectListener = myself.getListenerOnSelect();
        if (onSelectListener !== null) {
          const selectedItem = oFF.UiGeneric.getFfControl(targetTreeItem);
          const newSelectionEvent = oFF.UiSelectionEvent.create(myself);
          newSelectionEvent.setSingleSelectionData(selectedItem);
          onSelectListener.onSelect(newSelectionEvent);
        }
      }

      const onSelectionChangeListener = myself.getListenerOnSelectionChange();
      if (onSelectionChangeListener !== null) {
        const newSelectionEvent = oFF.UiSelectionEvent.create(myself);
        selectedTreeItems.forEach(selectedItem => {
          let ffItem = oFF.UiGeneric.getFfControl(selectedItem);
          newSelectionEvent.setSingleSelectionData(ffItem);
        })
        onSelectionChangeListener.onSelectionChange(newSelectionEvent);
      }
    });

    // itemDelete event
    nativeControl.attachItemDelete(function(oControlEvent) {
      let onDeleteListener = myself.getListenerOnDelete();
      if (onDeleteListener !== null) {
        let nativeTreeItem = oControlEvent.getParameters().item;
        let deletedItem = oFF.UiGeneric.getFfControl(nativeTreeItem);
        const newItemEvent = oFF.UiItemEvent.create(myself);
        newItemEvent.setItemData(deletedItem);
        onDeleteListener.onDelete(newItemEvent);
      }
    });
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    let nativeItem = item.getNativeControl();
    this.getNativeControl().addItem(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    let nativeItem = item.getNativeControl();
    this.getNativeControl().insertItem(nativeItem, index);
    return this;
  }

  removeItem(item) {
    super.removeItem(item);
    let nativeItem = item.getNativeControl();
    this.getNativeControl().removeItem(nativeItem);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  getSelectedItem() {
    let nativeSelectedItem = this._getSelectedItemRecursively(this.getNativeControl().getItems());
    if (nativeSelectedItem) {
      return oFF.UiGeneric.getFfControl(nativeSelectedItem);
    }
    return null;
  }

  setSelectedItem(item) {
    super.setSelectedItem(item);
    let nativeTreeItems = this.getNativeControl().getItems();
    if (item != null) {
      let nativeItemToSelect = item.getNativeControl();
      if (nativeItemToSelect) {
        this._resetSelectionRecursively(nativeTreeItems);
        nativeItemToSelect.setSelected(true);
      }
    } else {
      this._resetSelectionRecursively(nativeTreeItems);
    }
  }

  getSelectedItems() {
    let selectedItems = oFF.XList.create();
    let nativeSelectedItems = [];
    this._getSelectedItemsRecursively(this.getNativeControl().getItems(), nativeSelectedItems);
    for (let i = 0; i < nativeSelectedItems.length; i++) {
      let tmpNativeTreeItem = nativeSelectedItems[i];
      let ffControl = oFF.UiGeneric.getFfControl(tmpNativeTreeItem);
      selectedItems.add(ffControl);
    }
    return selectedItems;
  }

  setSelectedItems(items) {
    super.setSelectedItems(items);
    if (items !== null) {
      this._resetSelectionRecursively(this.getNativeControl().getItems());
      let size = items.size();
      for (let i = 0; i < size; i++) {
        items.get(i).getNativeControl().setSelected(true);
      }
    }
    return this;
  }

  addSelectedItem(item) {
    super.addSelectedItem(item);
    let nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      nativeItemToSelect.setSelected(true);
    }
    return this;
  }

  removeSelectedItem(item) {
    super.removeSelectedItem(item);
    let nativeItemToDeselect = item.getNativeControl();
    if (nativeItemToDeselect) {
      nativeItemToDeselect.setSelected(false);
    }
    return this;
  }

  clearSelectedItems() {
    super.clearSelectedItems();
    this._resetSelectionRecursively(this.getNativeControl().getItems());
    return this;
  }

  // ======================================

  setHeader(header) {
    super.setHeader(header);
    this.getNativeControl().destroyHeader(); // we auto create it so destroy it
    if (header != null) {
      let nativeHeaderControl = header.getNativeControl();
      let tmpToolbar = new ui5.sap_m_Toolbar(this.getId() + "_headerToolbar");
      tmpToolbar.addContent(nativeHeaderControl);
      this.getNativeControl().setHeader(tmpToolbar);
    }
    return this;
  }

  // ======================================

  expandToLevel(level) {
    super.expandToLevel(level);
    if (this.hasItems()) {
      this.getNativeControl().expandToLevel(level);
    }
    return this;
  }

  collapseAll() {
    super.collapseAll();
    if (this.hasItems()) {
      this.getNativeControl().collapseAll();
    }
    return this;
  }

  // ======================================

  setTitle(title) {
    super.setTitle(title);
    this.getNativeControl().setHeaderText(title);
    return this;
  }

  setSelectionMode(selectionMode) {
    super.setSelectionMode(selectionMode);
    this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseWebcSelectionMode(selectionMode));
    return this;
  }

  setExpanded(expanded) {
    super.setExpanded(expanded);
    if (this.hasItems()) {
      if (expanded === true) {
        this.getNativeControl().expandToLevel(999);
      } else {
        this.getNativeControl().collapseAll();
      }
    }
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  applyCustomCssStyling(element) {
    // content needs to have overflow auto or tree items will break out of bounds if the tree items size is bigger then the control
    element.style.overflow = "auto";
  }

  // Helpers
  // ======================================

  expandNativeItem(treeItem) {
    let nativeItem = treeItem.getNativeControl();
    nativeItem.setExpanded(true);
  }

  collapseNativeItem(treeItem) {
    let nativeItem = treeItem.getNativeControl();
    nativeItem.setExpanded(false);
  }

  _getSelectedItemRecursively(items) {
    if (items) {
      items.forEach(item => {
        if (item.getSelected()) {
          return item;
        } else {
          let selectedItem = this._getSelectedItemRecursively(item.getItems());
          if (selectedItem) {
            return selectedItem;
          }
        }
      });
    }
    return null;
  }

  _getSelectedItemsRecursively(items, selectedItems) {
    if (items) {
      items.forEach(item => {
        if (item.getSelected()) {
          selectedItems.push(item);
        }
        this._getSelectedItemsRecursively(item.getItems(), selectedItems);
      });
    }
  }

  _resetSelectionRecursively(items) {
    if (items) {
      items.forEach(item => {
        item.setSelected(false);
        this._resetSelectionRecursively(item.getItems());
      });
    }
  }
}

oFF.UiTree = UiTree;

class UiTreeItem extends oFF.UiTreeItemBase {
  constructor() {
    super();
    this._ff_c = "UiTreeItem";
  }

  newInstance() {
    let object = new UiTreeItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_webc_main_TreeItem(this.getId());

    this._addEvents(nativeControl);
    this.setNativeControl(nativeControl);
  }

  releaseObject() {
    super.releaseObject();
  }

// ======================================

  setText(text) {
    super.setText(text);
    this.getNativeControl().setText(text);
    return this;
  }

  getText() {
    return super.getText();
  }

  setIcon(icon) {
    super.setIcon(icon);
    return this;
  }

  getIcon() {
    return super.getIcon();
  }

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

}

oFF.UiTreeItem = UiTreeItem;
class UiCustomTreeItem extends oFF.UiTreeItemBase {
  constructor() {
    super();
    this._ff_c = "UiCustomTreeItem";
  }

  newInstance() {
    let object = new UiCustomTreeItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_webc_main_TreeItemCustom(this.getId());

    this._addEvents(nativeControl);
    this.setNativeControl(nativeControl);
  }

// ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content !== null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }


  clearContent() {
    super.clearContent();
    this.getNativeControl().removeAllContent();
    return this;
  }

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================
}

oFF.UiCustomTreeItem = UiCustomTreeItem;
oFF.UiTable = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTable";

  this.m_rowModel = {};
};
oFF.UiTable.prototype = new oFF.UiGeneric();

oFF.UiTable.prototype.newInstance = function() {
  var object = new oFF.UiTable();
  object.setup();
  return object;
};

oFF.UiTable.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_ui_table_Table(this.getId());

  var oModel = new ui5.sap_ui_model_json_JSONModel();
  nativeControl.setModel(oModel);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachRowSelectionChange(function(oControlEvent) {
    // only fire the event if happen with user interaction, e.g. user selects something, do not fire when selectIndex method is called
    var userInteraction = oControlEvent.getParameters().userInteraction;
    var isSelectAll = oControlEvent.getParameters().selectAll;
    if (userInteraction) {
      if (isSelectAll === false || isSelectAll === undefined) {
        if (myself.getListenerOnSelect() !== null) {
          var rowIndex = oControlEvent.getParameters().rowIndex;
          if (myself.getNativeControl().isIndexSelected(rowIndex)) {
            var tableRow = myself.getRow(rowIndex);
            const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
            newSelectionEvent.setSingleSelectionData(tableRow);
            myself.getListenerOnSelect().onSelect(newSelectionEvent);
          }
        }
      }
      if (myself.getListenerOnSelectionChange() !== null) {
        var isSelectAll = oControlEvent.getParameters().selectAll || false;
        var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().rowIndex === -1); // deselctAll is when rowIndex is -1
        var isSelect = isSelectAll;
        if (isSelectAll === false && isDeselectAll === false) {
          // if not select all and not deselct all then check if the specified rowIndex is selected
          isSelect = myself.getNativeControl().isIndexSelected(rowIndex);
        }

        const newSelectionEvent = oFF.UiSelectionEvent.create(myself);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT, isSelect);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT_ALL, isSelectAll);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_DESELECT_ALL, isDeselectAll);
        myself.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
      }
    }
  });

  // onClick event
  nativeControl.attachCellClick(function(oControlEvent) {
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var columnIndex = oControlEvent.getParameters().columnIndex;
    // row clicked
    var tableRow = myself.getRow(rowIndex);
    if (tableRow) {
      tableRow.rowClicked();
      // cell clicked
      var tableRowCell = tableRow.getCell(columnIndex);
      if (tableRowCell) {
        tableRowCell.cellClicked();
      }
    }
  });

  // onScroll event
  nativeControl.attachFirstVisibleRowChanged(function(oControlEvent) {
    if (myself.getListenerOnScroll() !== null) {
      let firstVisibleRowIndex = oControlEvent.getParameters().firstVisibleRow;
      let firstVisibleTableRow = myself.getRow(firstVisibleRowIndex);
      // prepare the properties
      const newControlEvent = oFF.UiControlEvent.create(myself);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_FIRST_VISIBLE_ROW_NAME, firstVisibleTableRow.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CONFIGURED_ROW_COUNT, myself._getConfiguredRowCount());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TOTAL_ROW_COUNT, myself._getTotalRowCount());
      myself.getListenerOnScroll().onScroll(newControlEvent);
    }
  });
};

// ======================================

oFF.UiTable.prototype.addColumn = function(column) {
  oFF.UiGeneric.prototype.addColumn.call(this, column);
  var nativeTable = this.getNativeControl();
  var columns = nativeTable.getColumns() || [];
  var columnIndex = columns.length;
  column.setColumnIndex(columnIndex);
  var nativeColumn = column.getNativeControl();
  nativeTable.addColumn(nativeColumn);
  return this;
};

oFF.UiTable.prototype.insertColumn = function(column, index) {
  oFF.UiGeneric.prototype.insertColumn.call(this, column, index);
  var columnIndex = index;
  column.setColumnIndex(columnIndex);
  // adjust the indices of other columns
  for (var i = index + 1; i < this.getColumns().size(); i++) {
    var tmpTableColumn = this.getColumns().get(i);
    tmpTableColumn.setColumnIndex(i);
  }
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().insertColumn(nativeColumn, index);
  return this;
};

oFF.UiTable.prototype.removeColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().removeColumn(nativeColumn);
  oFF.UiGeneric.prototype.removeColumn.call(this, column);
  return this;
};

oFF.UiTable.prototype.clearColumns = function() {
  oFF.UiGeneric.prototype.clearColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

oFF.UiTable.prototype.addRow = function(row) {
  oFF.UiGeneric.prototype.addRow.call(this, row);
  var data = row.getData();
  this.m_rowModel[row.getId()] = data;
  this.refreshData();
  return this;
};

oFF.UiTable.prototype.insertRow = function(row, index) {
  oFF.UiGeneric.prototype.insertRow.call(this, row, index);
  //at insert i need to regenerate the row model
  this.m_rowModel = {};
  for (var i = 0; i < this.getRows().size(); i++) {
    var tmpTableRow = this.getRows().get(i);
    var tmpData = tmpTableRow.getData();
    this.m_rowModel[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

oFF.UiTable.prototype.removeRow = function(row) {
  if (row != null) {
    delete this.m_rowModel[row.getId()];
    this.refreshData();
  }
  oFF.UiGeneric.prototype.removeRow.call(this, row);
  return this;
};

oFF.UiTable.prototype.clearRows = function() {
  oFF.UiGeneric.prototype.clearRows.call(this);
  this.m_rowModel = {};
  this.refreshData();
  return this;
};

// ======================================


oFF.UiTable.prototype.setFooter = function(footer) {
  oFF.UiGeneric.prototype.setFooter.call(this, footer);
  let nativeFooterControl = footer?.getNativeControl?.();
  this.getNativeControl().setFooter(nativeFooterControl);
  return this;
};

// ======================================

oFF.UiTable.prototype.getSelectedItem = function() {
  var nativeSelectedIndices = this.getNativeControl().getSelectedIndices();
  if (nativeSelectedIndices && nativeSelectedIndices.length > 0) {
    return this.getRow(nativeSelectedIndices[0]);
  }
  return null;
};

oFF.UiTable.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeRowIndexToSelect = this.getIndexOfRow(item);
    if (nativeRowIndexToSelect != -1) {
      this.getNativeControl().setSelectedIndex(nativeRowIndexToSelect);
    }
  } else {
    this.getNativeControl().clearSelection();
  }
  return this;
};

oFF.UiTable.prototype.getSelectedItems = function() {
  var selectedItems = oFF.XList.create();
  var nativeSelectedRowIndices = this.getNativeControl().getSelectedIndices();
  for (var i = 0; i < nativeSelectedRowIndices.length; i++) {
    var tmpTableTreeItem = this.getRow(nativeSelectedRowIndices[i]);
    selectedItems.add(tmpTableTreeItem);
  }
  return selectedItems;
};

oFF.UiTable.prototype.setSelectedItems = function(items) {
  oFF.UiGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().clearSelection();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      var rowIndexToSelect = this.getIndexOfRow(items.get(i));
      if (rowIndexToSelect != -1) {
        this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

oFF.UiTable.prototype.addSelectedItem = function(item) {
  oFF.UiGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToSelect = this.getIndexOfRow(item);
    if (rowIndexToSelect != -1) {
      this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
    }
  }
  return this;
};

oFF.UiTable.prototype.removeSelectedItem = function(item) {
  oFF.UiGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToDeselect = this.getIndexOfRow(item);
    if (rowIndexToDeselect != -1) {
      this.getNativeControl().removeSelectionInterval(rowIndexToDeselect, rowIndexToDeselect);
    }
  }
  return this;
};

oFF.UiTable.prototype.clearSelectedItems = function() {
  oFF.UiGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

oFF.UiTable.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getTitle()) {
    return this.getNativeControl().getTitle().getText();
  }
  return oFF.UiGeneric.prototype.getTitle.call(this);
};

oFF.UiTable.prototype.setTableSelectionMode = function(tableSelectionMode) {
  oFF.UiGeneric.prototype.setTableSelectionMode.call(this, tableSelectionMode);
  this.getNativeControl().setSelectionMode(oFF.ui.Ui5ConstantUtils.parseTableSelectionMode(tableSelectionMode));
  return this;
};


oFF.UiTable.prototype.setSelectionBehavior = function(selectionBehavior) {
  oFF.UiGeneric.prototype.setSelectionBehavior.call(this, selectionBehavior);
  this.getNativeControl().setSelectionBehavior(oFF.ui.Ui5ConstantUtils.parseTableSelectionBehavior(selectionBehavior));
  return this;
};

oFF.UiTable.prototype.setShowSelectAll = function(showSelectAll) {
  oFF.DfUiGeneric.prototype.setShowSelectAll.call(this, showSelectAll); // skip superclass implementation, different prop name
  this.getNativeControl().setEnableSelectAll(showSelectAll);
  return this;
};

oFF.UiTable.prototype.isShowSelectAll = function() {
  return this.getNativeControl().getEnableSelectAll();
};

oFF.UiTable.prototype.setFirstVisibleRow = function(firstVisibleRow) {
  oFF.UiGeneric.prototype.setFirstVisibleRow.call(this, firstVisibleRow);
  if (firstVisibleRow) {
    var rowIndex = this.getIndexOfRow(firstVisibleRow);
    this.getNativeControl().setFirstVisibleRow(rowIndex);
  }
  return this;
};

oFF.UiTable.prototype.getFirstVisibleRow = function() {
  var firstVisibleRowIndex = this.getNativeControl().getFirstVisibleRow();
  var firstVisibleTableRow = this.getRow(firstVisibleRowIndex);
  return firstVisibleTableRow;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiTable.prototype.applyHeightCss = function(element, heightCss) {
  oFF.UiGeneric.prototype.applyHeightCss.call(this, element, heightCss);
  // special css needed when setting a height in pixel on the table
  if (heightCss && heightCss.includes("px")) {
    // have to differentiate between when title is set and not since ths size changes then (48px more with title)
    ui5.sap_jQuery(element).find(".sapUiTableCnt").css("overflow-y", "auto");
    if (this.getTitle() != null && this.getTitle().length > 0) {
      ui5.sap_jQuery(element).find(".sapUiTableCnt").css("height", "calc(100% - 48px)");
    } else {
      ui5.sap_jQuery(element).find(".sapUiTableCnt").css("height", "100%");
    }
  }
};

// Helpers
// ======================================

oFF.UiTable.prototype.getTable = function() {
  return this;
};

oFF.UiTable.prototype.getTableCellById = function(itemId) {
  // method not used currently
  var rows = this.getRows();
  for (var i = 0; i < rows.size(); i++) {
    var tmpRow = rows.get(i);
    var tmpCells = tmpRow.getCells();
    for (var a = 0; a < tmpCells.size(); a++) {
      var tmpCell = tmpCells.get(a);
      if (tmpCell.getId() == itemId) {
        return tmpCell;
      }
    }
  }
  return null;
};

oFF.UiTable.prototype.refreshData = function() {
  //this.getNativeControl().bindRows("/modelData");
  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().bindRows("/modelData");
  } else {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().updateRows(ui5.sap_ui_model_ChangeReason.Refresh, ""); // second param can be empty? At least cannot be null! No public API for that!
  }
};

oFF.UiTable.prototype._getConfiguredRowCount = function() {
  if (this.getNativeControl()) {
    const rowMode = this.getNativeControl().getRowMode();
    if (rowMode && rowMode.getConfiguredRowCount) {
      return rowMode.getConfiguredRowCount();
    }
  }
  return -1;
};

oFF.UiTable.prototype._getTotalRowCount = function() {
  if (this.getNativeControl()) {
    const rowMode = this.getNativeControl().getRowMode();
    if (rowMode && rowMode.getTotalRowCountOfTable) {
      return rowMode.getTotalRowCountOfTable();
    }
  }
  return -1;
};

oFF.UiTableColumn = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTableColumn";

  this.m_columnIndex = -1;
};
oFF.UiTableColumn.prototype = new oFF.UiGeneric();

oFF.UiTableColumn.prototype.newInstance = function() {
  var object = new oFF.UiTableColumn();
  object.setup();
  return object;
};

oFF.UiTableColumn.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_ui_table_Column(this.getId());
  var template = new ui5.sap_m_Label();
  nativeControl.setTemplate(template);

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiTableColumn.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  var label = new ui5.sap_m_Label({
    text: title
  });
  this.getNativeControl().setLabel(label);
  return this;
};

oFF.UiTableColumn.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getLabel()) {
    return this.getNativeControl().getLabel().getText()
  }
  return oFF.UiGeneric.prototype.getTitle.call(this);
};

oFF.UiTableColumn.prototype.setShowSorting = function(showSorting) {
  oFF.UiGeneric.prototype.setShowSorting.call(this, showSorting);
  var nativeControl = this.getNativeControl();
  if (nativeControl) {
    if (showSorting) {
      nativeControl.setSortProperty("column" + this.m_columnIndex + "_text");
    } else {
      nativeControl.setSortProperty("");
    }
  }
};

oFF.UiTableColumn.prototype.isShowSorting = function() {
  return oFF.UiGeneric.prototype.isShowSorting.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTableColumn.prototype.setColumnIndex = function(columnIndex) {
  this.m_columnIndex = columnIndex;
  this.getNativeControl().getTemplate().bindProperty("text", "column" + columnIndex + "_text");
  this.getNativeControl().getTemplate().bindProperty("tooltip", "column" + columnIndex + "_tooltip");
  return this;
};

oFF.UiTableColumn.prototype.getColumnIndex = function() {
  return this.m_columnIndex;
};

oFF.UiTableRow = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTableRow";

  this.m_rowData = {};
};
oFF.UiTableRow.prototype = new oFF.UiGeneric();

oFF.UiTableRow.prototype.newInstance = function() {
  var object = new oFF.UiTableRow();
  object.setup();
  return object;
};

oFF.UiTableRow.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  this.setNativeControl(null);
};

// ======================================

oFF.UiTableRow.prototype.addCell = function(cell) {
  oFF.UiGeneric.prototype.addCell.call(this, cell);
  var cellIndex = this.getNumberOfCells() - 1;
  cell.setCellIndex(cellIndex);
  // initially prepare the cell, add the text, tooltip etc after adding the cell
  var data = this.getData();
  this._prepareCell(data, cellIndex, cell);
  // update the table
  this.refreshData();
  return this;
};

oFF.UiTableRow.prototype.insertCell = function(cell, index) {
  oFF.UiGeneric.prototype.insertCell.call(this, cell, index);
  var cellIndex = index;
  cell.setCellIndex(cellIndex);
  // initially prepare the cell, add the text, tooltip etc after adding the cell
  var data = this.getData();
  this._prepareCell(data, cellIndex, cell);
  // change the other cells indices since everything moved 1 up
  for (var i = index + 1; i < this.getCells().size(); i++) {
    var tmpTableCell = this.getCells().get(i);
    tmpTableCell.setCellIndex(i);
    // update cell properties after changing the cell index
    this._prepareCell(data, i, tmpTableCell);
  }
  // update the table
  this.refreshData();
  return this;
};

oFF.UiTableRow.prototype.removeCell = function(cell) {
  if (cell) {
    var cellIndex = cell.getCellIndex();
    if (cellIndex != -1) {
      var data = this.getData();
      this._deleteCell(data, cellIndex);
      cell.setCellIndex(-1);
      this.refreshData();
    }
  }
  oFF.UiGeneric.prototype.removeCell.call(this, cell);
  return this;
};

oFF.UiTableRow.prototype.clearCells = function() {
  var data = this.getData();
  for (var a = 0; a < this.getCells().size(); a++) {
    this._deleteCell(data, a);
    this.getCells().get(a).setCellIndex(-1);
    this.refreshData();
  }
  oFF.UiGeneric.prototype.clearCells.call(this);
  return this;
};

// ======================================

oFF.UiTableRow.prototype.setSelected = function(selected) {
  oFF.UiGeneric.prototype.setSelected.call(this, selected);
  var table = this.getTable();
  if (table) {
    var rowIndexToSelect = this.getRowIndex();
    if (rowIndexToSelect != -1) {
      if (selected === true) {
        table.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      } else {
        table.getNativeControl().removeSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

oFF.UiTableRow.prototype.isSelected = function() {
  var table = this.getTable();
  if (table) {
    var rowIndexToCheck = this.getRowIndex();
    if (rowIndexToCheck != -1) {
      return table.getNativeControl().isIndexSelected(rowIndexToCheck);
    }
  }
  return oFF.UiGeneric.prototype.isSelected.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTableRow.prototype.getData = function() {
  return this.m_rowData;
};

oFF.UiTableRow.prototype.getRowIndex = function() {
  var table = this.getTable();
  if (table) {
    return table.getIndexOfRow(this);
  }
  return -1;
};

oFF.UiTableRow.prototype.rowClicked = function() {
  this.handleClick(null);
};

oFF.UiTableRow.prototype.getTable = function() {
  if (this.getParent()) {
    return this.getParent().getTable();
  }
  return null;
};

oFF.UiTableRow.prototype.refreshData = function() {
  if (this.getParent()) {
    this.getParent().refreshData();
  }
};

oFF.UiTableRow.prototype._prepareCell = function(rowData, cellIndex, cell) {
  if (cell.getText() != null) {
    rowData["column" + cellIndex + "_text"] = cell.getText();
  }

  if (cell.getTooltip() != null) {
    rowData["column" + cellIndex + "_tooltip"] = cell.getTooltip();
  }
};

oFF.UiTableRow.prototype._deleteCell = function(rowData, cellIndex) {
  delete rowData["column" + cellIndex + "_text"];
  delete rowData["column" + cellIndex + "_tooltip"];
};

oFF.UiTableCell = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTableCell";

  this.m_cellIndex = -1;
};
oFF.UiTableCell.prototype = new oFF.UiGeneric();

oFF.UiTableCell.prototype.newInstance = function() {
  var object = new oFF.UiTableCell();
  object.setup();
  return object;
};

oFF.UiTableCell.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  this.setNativeControl(null);
};



// ======================================

oFF.UiTableCell.prototype.setText = function(text) {
  oFF.UiGeneric.prototype.setText.call(this, text);
  if (this.getParent() != null) {
    var data = this.getParent().getData();
    data["column" + this.m_cellIndex + "_text"] = text;
    this._refreshData();
  }
  return this;
};


oFF.UiTableCell.prototype.setTooltip = function(tooltip) {
  oFF.UiGeneric.prototype.setTooltip.call(this, tooltip);
  if (this.getParent() != null) {
    var data = this.getParent().getData();
    data["column" + this.m_cellIndex + "_tooltip"] = tooltip;
    this._refreshData();
  }
  return this;
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTableCell.prototype.setCellIndex = function(columnIndex) {
  this.m_cellIndex = columnIndex;
  return this;
};

oFF.UiTableCell.prototype.getCellIndex = function() {
  return this.m_cellIndex;
};

oFF.UiTableCell.prototype.cellClicked = function() {
  this.handleClick(null);
};

oFF.UiTableCell.prototype.getTable = function() {
  if (this.getParent()) {
    return this.getParent().getTable();
  }
  return null;
};

oFF.UiTableCell.prototype._refreshData = function() {
  if (this.getParent()) {
    this.getParent().refreshData();
  }
};

oFF.UiResponsiveTable = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiResponsiveTable";
};
oFF.UiResponsiveTable.prototype = new oFF.UiGeneric();

oFF.UiResponsiveTable.prototype.newInstance = function() {
  var object = new oFF.UiResponsiveTable();
  object.setup();
  return object;
};

oFF.UiResponsiveTable.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Table(this.getId());
  //nativeControl.setFixedLayout(false); // automatically adjust column width to fit text
  nativeControl.setSticky([ui5.sap_m_Sticky.ColumnHeaders, ui5.sap_m_Sticky.HeaderToolbar, ui5.sap_m_Sticky.InfoToolbar]);
  nativeControl.setContextualWidth("Auto");
  nativeControl.setPopinLayout(ui5.sap_m_PopinLayout.GridSmall);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiResponsiveTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelectionChange event
  nativeControl.attachSelectionChange(function(oControlEvent) {
    var isSelect = oControlEvent.getParameters().selected;
    if (isSelect === true) {
      if (myself.getListenerOnSelect() !== null) {
        var row = oControlEvent.getParameters().listItem;
        var selectedRow = oFF.UiGeneric.getFfControl(row);
        const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
        newSelectionEvent.setSingleSelectionData(selectedRow);
        myself.getListenerOnSelect().onSelect(newSelectionEvent);
      }
    }

    if (myself.getListenerOnSelectionChange() !== null) {
      var isSelect = oControlEvent.getParameters().selected;
      var isSelectAll = oControlEvent.getParameters().selectAll && isSelect;
      var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().listItems.length > 1); // deselctAll is when listItems length is graeter then 1

      const newSelectionEvent = oFF.UiSelectionEvent.create(myself);
      newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT, isSelect);
      newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT_ALL, isSelectAll);
      newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_DESELECT_ALL, isDeselectAll);
      myself.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
    }
  });

  //onDelete event
  nativeControl.attachDelete(function(oControlEvent) {
    if (myself.getListenerOnDelete() !== null) {
      let nativeItem = oControlEvent.getParameters().listItem;
      let deletedItem = oFF.UiGeneric.getFfControl(nativeItem);
      const newItemEvent = oFF.UiItemEvent.create(myself);
      newItemEvent.setItemData(deletedItem);
      myself.getListenerOnDelete().onDelete(newItemEvent);
    }
  });

  // onScrollLoad event -- using onAfterRender event for that, this is a private method so it might break in the future
  //only work when is inside a scrollable scroll container (e.g sap.m.Page).
  nativeControl.addDelegate({
    onAfterRendering: ui5.sap_jQuery.proxy(function() {
      var scroller = ui5.sap_m_getScrollDelegate(nativeControl);
      if (scroller) {
        scroller.setGrowingList(myself.throttle(function() {
          if (myself.getListenerOnScrollLoad() !== null) {
            myself.getListenerOnScrollLoad().onScrollLoad(oFF.UiControlEvent.create(myself));
          }
        }, 1000), ui5.sap_m_ListGrowingDirection.Downwards)
      }
    }, this.getNativeControl())
  });
};

// ======================================

oFF.UiResponsiveTable.prototype.scrollToIndex = function(index) {
  oFF.UiGeneric.prototype.scrollToIndex.call(this, index);
  this.getNativeControl().scrollToIndex(index);
  return this;
};

// ======================================

oFF.UiResponsiveTable.prototype.addResponsiveTableColumn = function(column) {
  oFF.UiGeneric.prototype.addResponsiveTableColumn.call(this, column);
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this._calculateColumResponsiveness();
    this.getNativeControl().addColumn(nativeColumn);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.insertResponsiveTableColumn = function(column, index) {
  oFF.UiGeneric.prototype.insertResponsiveTableColumn.call(this, column, index);
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this._calculateColumResponsiveness();
    this.getNativeControl().insertColumn(nativeColumn, index);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.removeResponsiveTableColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  if (nativeColumn) {
    this.getNativeControl().removeColumn(nativeColumn);
  }
  oFF.UiGeneric.prototype.removeResponsiveTableColumn.call(this, column);
  return this;
};

oFF.UiResponsiveTable.prototype.clearResponsiveTableColumns = function() {
  oFF.UiGeneric.prototype.clearResponsiveTableColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

oFF.UiResponsiveTable.prototype.addResponsiveTableRow = function(row) {
  oFF.UiGeneric.prototype.addResponsiveTableRow.call(this, row);
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().addItem(nativeColumnListItem);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.insertResponsiveTableRow = function(row, index) {
  oFF.UiGeneric.prototype.insertResponsiveTableRow.call(this, row, index);
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().insertItem(nativeColumnListItem, index);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.removeResponsiveTableRow = function(row) {
  var nativeColumnListItem = row.getNativeControl();
  if (nativeColumnListItem) {
    this.getNativeControl().removeItem(nativeColumnListItem);
  }
  oFF.UiGeneric.prototype.removeResponsiveTableRow.call(this, row);
  return this;
};

oFF.UiResponsiveTable.prototype.clearResponsiveTableRows = function() {
  oFF.UiGeneric.prototype.clearResponsiveTableRows.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiResponsiveTable.prototype.getSelectedItem = function() {
  var selectedItem = this.getNativeControl().getSelectedItem();
  if (selectedItem != null) {
    return oFF.UiGeneric.getFfControl(selectedItem);
  }
  return null;
};

oFF.UiResponsiveTable.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().setSelectedItem(nativeItemToSelect, true);
    }
  } else {
    this.clearSelectedItems();
  }
  return this;
};

oFF.UiResponsiveTable.prototype.getSelectedItems = function() {
  var oList = oFF.XList.create();
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < aSelectedItems.length; i++) {
    var ffControl = oFF.UiGeneric.getFfControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

oFF.UiResponsiveTable.prototype.setSelectedItems = function(items) {
  oFF.UiGeneric.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().removeSelections();
  if (items !== null) {
    var size = items.size();
    for (var i = 0; i < size; i++) {
      this.getNativeControl().setSelectedItem(items.get(i).getNativeControl(), true);
    }
  }
  return this;
};

oFF.UiResponsiveTable.prototype.addSelectedItem = function(item) {
  oFF.UiGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), true);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.removeSelectedItem = function(item) {
  oFF.UiGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().setSelectedItem(item.getNativeControl(), false);
  }
  return this;
};

oFF.UiResponsiveTable.prototype.clearSelectedItems = function() {
  oFF.UiGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().removeSelections();
  return this;
};

// ======================================

oFF.UiResponsiveTable.prototype.setHeaderToolbar = function(headerToolbar) {
  oFF.UiGeneric.prototype.setHeaderToolbar.call(this, headerToolbar);
  if (headerToolbar != null) {
    var nativeToolbar = headerToolbar.getNativeControl();
    this.getNativeControl().setHeaderToolbar(nativeToolbar);
  } else {
    this.getNativeControl().setHeaderToolbar(null);
  }
  return this;
};

// ======================================
oFF.UiResponsiveTable.prototype.setSelectionMode = function(selectionMode) {
  oFF.UiGeneric.prototype.setSelectionMode.call(this, selectionMode);
  this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseSelectionMode(selectionMode));
  return this;
};

oFF.UiResponsiveTable.prototype.setNoDataText = function(noDataText) {
  oFF.UiGeneric.prototype.setNoDataText.call(this, noDataText);
  this.getNativeControl().setNoDataText(noDataText);
  return this;
};


oFF.UiResponsiveTable.prototype.setAlternateRowColors = function(alternateRowColors) {
  oFF.UiGeneric.prototype.setAlternateRowColors.call(this, alternateRowColors);
  this.getNativeControl().setAlternateRowColors(alternateRowColors);
  return this;
};


oFF.UiResponsiveTable.prototype.setColumnResize = function(columnResize) {
  oFF.UiGeneric.prototype.setColumnResize.call(this, columnResize);
  let currentResizer = this.getNativeControl().getDependents().length > 0 ? this.getNativeControl().getDependents()[0] : null;
  if (columnResize && !currentResizer) {
    this.getNativeControl().addDependent(new ui5.sap_m_plugins_ColumnResizer());
  } else if (!columnResize && currentResizer) {
    this.getNativeControl().removeDependent(currentResizer);
  }
  return this;
};

// Overrides
// ======================================

// Helpers
// ======================================

oFF.UiResponsiveTable.prototype._calculateColumResponsiveness = function() {
  var columnCount = this.getNumberOfResponsiveTableColumns();
  for (var a = 0; a < columnCount; a++) {
    var tmpColumn = this.getResponsiveTableColumn(a);
    tmpColumn.determineResponsiveness(a);
  }
};

class UiResponsiveTableColumn extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiResponsiveTableColumn";
  }

  newInstance() {
    let object = new UiResponsiveTableColumn();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Column(this.getId());
    //  nativeControl.setMinScreenWidth(sap.m.ScreenSize.Phone);
    //  nativeControl.setDemandPopin(true);

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress.call(listener);
    this.getNativeControl().onclick = null;
    if (listener) {
      this.getNativeControl().onclick = this.handlePress.bind(this);
    }
    return this;
  }

  // ======================================

  setHeader(header) {
    super.setHeader(header);
    if (header !== null) {
      let nativeHeader = header.getNativeControl();
      this.getNativeControl().setHeader(nativeHeader);
    } else {
      this.getNativeControl().setHeader(null);
    }
    return this;
  }

  // ======================================

  addCssClass(cssClass) {
    oFF.DfUiGeneric.prototype.addCssClass.call(this, cssClass); // skip generic implementation
    let curNativeCssClass = this.getNativeControl().getStyleClass();
    if (!curNativeCssClass.includes(cssClass)) {
      curNativeCssClass = curNativeCssClass + " " + cssClass;
      curNativeCssClass = curNativeCssClass.trim();
      this.getNativeControl().setStyleClass(curNativeCssClass);
    }
    return this;
  }

  removeCssClass(cssClass) {
    oFF.DfUiGeneric.prototype.removeCssClass.call(this, cssClass); // skip generic implementation
    let curNativeCssClass = this.getNativeControl().getStyleClass();
    if (curNativeCssClass.includes(cssClass)) {
      curNativeCssClass = curNativeCssClass.replace(cssClass, "");
      curNativeCssClass = curNativeCssClass.replace("  ", " "); //make sure we have no double or triple spaces
      curNativeCssClass = curNativeCssClass.replace("   ", " ");
      curNativeCssClass = curNativeCssClass.trim();
      this.getNativeControl().setStyleClass(curNativeCssClass);
    }
    return this;
  }
  // ======================================

  setHeaderPosition(headerPosition) {
    super.setHeaderPosition(headerPosition);
    this.getNativeControl().setHeaderPosition(oFF.ui.Ui5ConstantUtils.parseHeaderPosition(headerPosition));
    return this;
  }


  setSortIndicator(sortOrder) {
    super.setSortIndicator(sortOrder);
    this.getNativeControl().setSortIndicator(oFF.ui.Ui5ConstantUtils.parseSortIndicator(sortOrder));
    return this;
  };

  setHorizontalAlign(horizontalAlign) {
    super.setHorizontalAlign(horizontalAlign);
    this.getNativeControl().setHAlign(oFF.ui.Ui5ConstantUtils.parseHorizontalAlign(horizontalAlign));
    return this;
  };


  // Helpers
  // ======================================

  determineResponsiveness(colIndex) {
    // show 1 column on smartphone
    if (colIndex >= 1 && colIndex < 5) {
      this.getNativeControl().setMinScreenWidth(ui5.sap_m_ScreenSize.Tablet);
      this.getNativeControl().setDemandPopin(true);
    }
    // show 5 columns on a tablet
    if (colIndex >= 5) {
      this.getNativeControl().setMinScreenWidth(ui5.sap_m_ScreenSize.Desktop);
      this.getNativeControl().setDemandPopin(true);
    }
  };

}

oFF.UiResponsiveTableColumn = UiResponsiveTableColumn;

class UiResponsiveTableRow extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiResponsiveTableRow";
  }

  newInstance() {
    let object = new UiResponsiveTableRow();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_ColumnListItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("press", this.handlePress, listener);
    return this;
  }

  registerOnDetailPress(listener) {
    super.registerOnDetailPress(listener);
    this.attachEventCallback("detailPress", this._handleOnDetailPress, listener);
    return this;
  }

  // ======================================

  addResponsiveTableCell(cell) {
    super.addResponsiveTableCell(cell);
    let nativeCell = cell.getNativeControl();
    if (nativeCell) {
      this.getNativeControl().addCell(nativeCell);
    }
    return this;
  }

  insertResponsiveTableCell(cell, index) {
    super.insertResponsiveTableCell(cell, index);
    let nativeCell = cell.getNativeControl();
    if (nativeCell) {
      this.getNativeControl().insertCell(nativeCell, index);
    }
    return this;
  }

  removeResponsiveTableCell(cell) {
    let nativeCell = cell.getNativeControl();
    if (nativeCell) {
      this.getNativeControl().removeCell(nativeCell);
    }
    super.removeResponsiveTableCell(cell);
    return this;
  }

  clearResponsiveTableCells() {
    super.clearResponsiveTableCells();
    this.getNativeControl().removeAllCells();
    return this;
  }

  // ======================================

  setEnabled(enabled) {
    oFF.DfUiGeneric.prototype.setEnabled(enabled); // skip UxGeneric call since the property has a different name
    if (enabled) {
      this.getNativeControl().removeStyleClass("ff-list-item-disabled");
    } else {
      this.getNativeControl().addStyleClass("ff-list-item-disabled");
    }
    return this;
  }


  setSelected(selected) {
    super.setSelected(selected);
    this.getNativeControl().setSelected(selected);
    return this;
  }

  isSelected() {
    return this.getNativeControl().getSelected();
  }

  setHighlight(messageType) {
    super.setHighlight(messageType);
    this.getNativeControl().setHighlight(oFF.ui.Ui5ConstantUtils.parseMessageType(messageType));
    return this;
  }

  setListItemType(listItemType) {
    super.setListItemType(listItemType);
    this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseListItemType(listItemType));
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleOnDetailPress(oControlEvent) {
    if (this.getListenerOnDetailPress() != null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oControlEvent);
      this.getListenerOnDetailPress().onDetailPress(ffEvent);
    }
  }

}

oFF.UiResponsiveTableRow = UiResponsiveTableRow;

oFF.UiTreeTable = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiTreeTable";

  this.m_rowModel = {};
};
oFF.UiTreeTable.prototype = new oFF.UiGeneric();

oFF.UiTreeTable.prototype.newInstance = function() {
  var object = new oFF.UiTreeTable();
  object.setup();
  return object;
};

oFF.UiTreeTable.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_ui_table_TreeTable(this.getId());

  var oModel = new ui5.sap_ui_model_json_JSONModel();
  nativeControl.setModel(oModel);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);

  this.refreshData();
};
// ======================================

oFF.UiTreeTable.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onToggleOpen event
  nativeControl.attachToggleOpenState(function(oControlEvent) {
    var isExpanded = oControlEvent.getParameters().expanded;
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);

    if (treeTableRow == null) {
      oFF.ui.Log.logError("Something went wrong - could not find table tree item");
      return;
    }

    if (isExpanded) {
      // item event
      treeTableRow.rowExpanded();
      // tree control event
      if (myself.getListenerOnExpand() !== null) {
        const newItemEvent = myself._createItemEvent(treeTableRow);
        myself.getListenerOnExpand().onExpand(newItemEvent);
      }
    } else {
      // items event
      treeTableRow.rowCollapsed();
      // tree control event
      if (myself.getListenerOnCollapse() !== null) {
        const newItemEvent = myself._createItemEvent(treeTableRow);
        myself.getListenerOnCollapse().onCollapse(newItemEvent);
      }
    }
  });

  // onSelectionChange event
  nativeControl.attachRowSelectionChange(function(oControlEvent) {
    // only fire the event if happen with user interaction, e.g. user selects something, do not fire when selectIndex method is called
    var userInteraction = oControlEvent.getParameters().userInteraction;
    var isSelectAll = oControlEvent.getParameters().selectAll;
    if (userInteraction) {
      if (isSelectAll === false || isSelectAll === undefined) {
        if (myself.getListenerOnSelect() !== null) {
          var rowIndex = oControlEvent.getParameters().rowIndex;
          if (myself.getNativeControl().isIndexSelected(rowIndex)) {
            var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);
            const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
            newSelectionEvent.setSingleSelectionData(treeTableRow);
            myself.getListenerOnSelect().onSelect(newSelectionEvent);
          }
        }
      }
      if (myself.getListenerOnSelectionChange() !== null) {
        var isSelectAll = oControlEvent.getParameters().selectAll || false;
        var isDeselectAll = (isSelectAll === false && oControlEvent.getParameters().rowIndex === -1); // deselctAll is when rowIndex is -1
        var isSelect = isSelectAll;
        if (isSelectAll === false && isDeselectAll === false) {
          // if not select all and not deselct all then check if the specified rowIndex is selected
          isSelect = myself.getNativeControl().isIndexSelected(rowIndex);
        }

        const newSelectionEvent = oFF.UiSelectionEvent.create(myself);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT, isSelect);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SELECT_ALL, isSelectAll);
        newSelectionEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_DESELECT_ALL, isDeselectAll);
        myself.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
      }
    }
  });

  // onClick event
  nativeControl.attachCellClick(function(oControlEvent) {
    var rowIndex = oControlEvent.getParameters().rowIndex;
    var columnIndex = oControlEvent.getParameters().columnIndex;
    // row clicked
    var treeTableRow = myself._getTreeTableRowByRowIndex(rowIndex);
    if (treeTableRow) {
      treeTableRow.rowClicked();
      // cell clicked
      var tableRowCell = treeTableRow.getCell(columnIndex);
      if (tableRowCell) {
        tableRowCell.cellClicked();
      }
    }
  });

  // onScroll event
  nativeControl.attachFirstVisibleRowChanged(function(oControlEvent) {
    if (myself.getListenerOnScroll() !== null) {
      let firstVisibleRowIndex = oControlEvent.getParameters().firstVisibleRow;
      let firstVisbibleTreeTableRow = myself._getTreeTableRowByRowIndex(firstVisibleRowIndex);
      // prepare the properties
      const newControlEvent = oFF.UiControlEvent.create(myself);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_FIRST_VISIBLE_ROW_NAME, firstVisbibleTreeTableRow.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CONFIGURED_ROW_COUNT, myself._getConfiguredRowCount());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TOTAL_ROW_COUNT, myself._getTotalRowCount());
      myself.getListenerOnScroll().onScroll(newControlEvent);
    }
  });
};

// ======================================

oFF.UiTreeTable.prototype.addColumn = function(column) {
  oFF.UiGeneric.prototype.addColumn.call(this, column);
  var nativeTreeTable = this.getNativeControl();
  var columns = nativeTreeTable.getColumns() || [];
  var columnIndex = columns.length;
  column.setColumnIndex(columnIndex);
  var nativeColumn = column.getNativeControl();
  nativeTreeTable.addColumn(nativeColumn);
  return this;
};

oFF.UiTreeTable.prototype.insertColumn = function(column, index) {
  oFF.UiGeneric.prototype.insertColumn.call(this, column, index);
  var columnIndex = index;
  column.setColumnIndex(columnIndex);
  // adjust the indices of other columns
  for (var i = index + 1; i < this.getColumns().size(); i++) {
    var tmpTableColumn = this.getColumns().get(i);
    tmpTableColumn.setColumnIndex(i);
  }
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().insertColumn(nativeColumn, index);
  return this;
};

oFF.UiTreeTable.prototype.removeColumn = function(column) {
  var nativeColumn = column.getNativeControl();
  this.getNativeControl().removeColumn(nativeColumn);
  oFF.UiGeneric.prototype.removeColumn.call(this, column);
  return this;
};

oFF.UiTreeTable.prototype.clearColumns = function() {
  oFF.UiGeneric.prototype.clearColumns.call(this);
  this.getNativeControl().removeAllColumns();
  return this;
};

// ======================================

oFF.UiTreeTable.prototype.addTreeTableRow = function(treeTableRow) {
  oFF.UiGeneric.prototype.addTreeTableRow.call(this, treeTableRow);
  var data = treeTableRow.getData();
  this.m_rowModel[treeTableRow.getId()] = data;
  this.refreshData();
  return this;
};

oFF.UiTreeTable.prototype.insertTreeTableRow = function(treeTableRow, index) {
  oFF.UiGeneric.prototype.insertTreeTableRow.call(this, treeTableRow, index);
  //at insert i need to regenerate the row model
  this.m_rowModel = {};
  var treeTableRows = this.getTreeTableRows();
  for (var i = 0; i < treeTableRows.size(); i++) {
    var tmpTableRow = treeTableRows.get(i);
    var tmpData = tmpTableRow.getData();
    this.m_rowModel[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

oFF.UiTreeTable.prototype.removeTreeTableRow = function(treeTableRow) {
  if (treeTableRow != null) {
    delete this.m_rowModel[treeTableRow.getId()];
    this.refreshData();
  }
  oFF.UiGeneric.prototype.removeTreeTableRow.call(this, treeTableRow);
  return this;
};

oFF.UiTreeTable.prototype.clearTreeTableRows = function() {
  oFF.UiGeneric.prototype.clearTreeTableRows.call(this);
  this.m_rowModel = {};
  this.refreshData();
  return this;
};

// ======================================

oFF.UiTreeTable.prototype.setFooter = function(footer) {
  oFF.UiGeneric.prototype.setFooter.call(this, footer);
  let nativeFooterControl = footer?.getNativeControl?.();
  this.getNativeControl().setFooter(nativeFooterControl);
  return this;
};

// ======================================

oFF.UiTreeTable.prototype.getSelectedItem = function() {
  var nativeSelectedIndices = this.getNativeControl().getSelectedIndices();
  if (nativeSelectedIndices && nativeSelectedIndices.length > 0) {
    return this._getTreeTableRowByRowIndex(nativeSelectedIndices[0]);
  }
  return null;
};

oFF.UiTreeTable.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeRowIndexToSelect = this.getRowIndexByTreeTableRow(item);
    if (nativeRowIndexToSelect != -1) {
      this.getNativeControl().setSelectedIndex(nativeRowIndexToSelect);
    }
  } else {
    this.getNativeControl().clearSelection();
  }
};

oFF.UiTreeTable.prototype.getSelectedItems = function() {
  var selectedItems = oFF.XList.create();
  var nativeSelectedRowIndices = this.getNativeControl().getSelectedIndices();
  for (var i = 0; i < nativeSelectedRowIndices.length; i++) {
    var tmpTableTreeItem = this._getTreeTableRowByRowIndex(nativeSelectedRowIndices[i]);
    selectedItems.add(tmpTableTreeItem);
  }
  return selectedItems;
};

oFF.UiTreeTable.prototype.setSelectedItems = function(items) {
  oFF.UiGeneric.prototype.setSelectedItems.call(this, items);
  if (items !== null) {
    this.getNativeControl().clearSelection();
    var size = items.size();
    for (var i = 0; i < size; i++) {
      var rowIndexToSelect = this.getRowIndexByTreeTableRow(items.get(i));
      if (rowIndexToSelect != -1) {
        this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
      }
    }
  }
  return this;
};

oFF.UiTreeTable.prototype.addSelectedItem = function(item) {
  oFF.UiGeneric.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToSelect = this.getRowIndexByTreeTableRow(item);
    if (rowIndexToSelect != -1) {
      this.getNativeControl().addSelectionInterval(rowIndexToSelect, rowIndexToSelect);
    }
  }
  return this;
};

oFF.UiTreeTable.prototype.removeSelectedItem = function(item) {
  oFF.UiGeneric.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    var rowIndexToDeselect = this.getRowIndexByTreeTableRow(item);
    if (rowIndexToDeselect != -1) {
      this.getNativeControl().removeSelectionInterval(rowIndexToDeselect, rowIndexToDeselect);
    }
  }
  return this;
};

oFF.UiTreeTable.prototype.clearSelectedItems = function() {
  oFF.UiGeneric.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

oFF.UiTreeTable.prototype.expandToLevel = function(level) {
  oFF.UiGeneric.prototype.expandToLevel.call(this, level);
  if (this.hasTreeTableRows()) {
    this.getNativeControl().expandToLevel(level);
  }
  return this;
};

oFF.UiTreeTable.prototype.collapseAll = function() {
  oFF.UiGeneric.prototype.collapseAll.call(this);
  if (this.hasTreeTableRows()) {
    this.getNativeControl().collapseAll();
  }
  return this;
};

// ======================================

oFF.UiTreeTable.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  return this;
};

oFF.UiTreeTable.prototype.getTitle = function() {
  if (this.getNativeControl() && this.getNativeControl().getTitle()) {
    return this.getNativeControl().getTitle().getText();
  }
  return oFF.UiGeneric.prototype.getTitle.call(this);
};

oFF.UiTreeTable.prototype.setBusy = function(busy) {
  oFF.UiGeneric.prototype.setBusy.call(this, busy);
  return this;
};

oFF.UiTreeTable.prototype.isBusy = function() {
  return oFF.UiGeneric.prototype.isBusy.call(this);
};

oFF.UiTreeTable.prototype.setTableSelectionMode = function(tableSelectionMode) {
  oFF.UiGeneric.prototype.setTableSelectionMode.call(this, tableSelectionMode);
  this.getNativeControl().setSelectionMode(oFF.ui.Ui5ConstantUtils.parseTableSelectionMode(tableSelectionMode));
  return this;
};

oFF.UiTreeTable.prototype.setSelectionBehavior = function(selectionBehaviour) {
  oFF.UiGeneric.prototype.setSelectionBehavior.call(this, selectionBehaviour);
  this.getNativeControl().setSelectionBehavior(oFF.ui.Ui5ConstantUtils.parseTableSelectionBehavior(selectionBehaviour));
  return this;
};

oFF.UiTreeTable.prototype.getSelectionBehavior = function() {
  return oFF.UiGeneric.prototype.getSelectionBehavior.call(this);
};

oFF.UiTreeTable.prototype.setExpanded = function(expanded) {
  oFF.UiGeneric.prototype.setExpanded.call(this, expanded);
  if (this.hasTreeTableRows()) {
    if (expanded === true) {
      this.getNativeControl().expandToLevel(999);
    } else {
      this.getNativeControl().collapseAll();
    }
  }
  return this;
};

oFF.UiTreeTable.prototype.setShowSelectAll = function(showSelectAll) {
  oFF.DfUiGeneric.prototype.setShowSelectAll.call(this, showSelectAll); // skip superclass implementation, different prop name
  this.getNativeControl().setEnableSelectAll(showSelectAll);
  return this;
};

oFF.UiTreeTable.prototype.isShowSelectAll = function() {
  return this.getNativeControl().getEnableSelectAll();
};

oFF.UiTreeTable.prototype.setFirstVisibleRow = function(firstVisibleRow) {
  oFF.UiGeneric.prototype.setFirstVisibleRow.call(this, firstVisibleRow);
  if (firstVisibleRow) {
    var rowIndex = this.getRowIndexByTreeTableRow(firstVisibleRow);
    this.getNativeControl().setFirstVisibleRow(rowIndex);
  }
  return this;
};

oFF.UiTreeTable.prototype.getFirstVisibleRow = function() {
  var firstVisibleRowIndex = this.getNativeControl().getFirstVisibleRow();
  var firstVisibleTreeTableRow = this._getTreeTableRowByRowIndex(firstVisibleRowIndex);
  return firstVisibleTreeTableRow;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiTreeTable.prototype.applyHeightCss = function(element, heightCss) {
  oFF.UiGeneric.prototype.applyHeightCss.call(this, element, heightCss);
  // special css needed when setting a height in pixel on the tree table
  if (heightCss && heightCss.includes("px")) {
    // have to differentiate between when title is set and not since ths size changes then (48px more with title)
    ui5.sap_jQuery(element).find(".sapUiTableCnt").css("overflow-y", "auto");
    if (this.getTitle() != null && this.getTitle().length > 0) {
      ui5.sap_jQuery(element).find(".sapUiTableCnt").css("height", "calc(100% - 48px)");
    } else {
      ui5.sap_jQuery(element).find(".sapUiTableCnt").css("height", "100%");
    }
  }
};

// Helpers
// ======================================

oFF.UiTreeTable.prototype.getTable = function() {
  return this;
};

oFF.UiTreeTable.prototype._getTreeTableRowById = function(children, itemId) {
  if (children != null) {
    for (var i = 0; i < children.size(); i++) {
      var tmpChild = children.get(i);
      if (tmpChild.getId() === itemId) {
        return tmpChild;
      }
      var nextLevelChild = this._getTreeTableRowById(tmpChild.getTreeTableRows(), itemId);
      if (nextLevelChild) {
        return nextLevelChild;
      }
    }
  }
  return null;
};

oFF.UiTreeTable.prototype._getTreeTableRowByRowIndex = function(rowIndex) {
  var rowContext = this.getNativeControl().getContextByIndex(rowIndex);
  if (rowContext) {
    var bindingPath = rowContext.getPath();
    var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
    var treeTableRow = this._getTreeTableRowById(this.getTreeTableRows(), itemId);
    return treeTableRow;
  }
  return null;
};

oFF.UiTreeTable.prototype.getRowIndexByTreeTableRow = function(treeTableRow) {
  var index = 0;
  var rowContext = null;
  do {
    rowContext = this.getNativeControl().getContextByIndex(index);
    if (rowContext) {
      var bindingPath = rowContext.getPath();
      var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
      if (itemId === treeTableRow.getId()) {
        return index;
      }
    }
    index++;
  } while (rowContext != null);
  return -1;
};

oFF.UiTreeTable.prototype.expandNativeRow = function(treeTableRow) {
  var rowIndexToExpand = this.getRowIndexByTreeTableRow(treeTableRow);
  if (rowIndexToExpand != -1) {
    this.getNativeControl().expand(rowIndexToExpand);
  } else {
    this._tryToExpandPath(treeTableRow);
  }
};

oFF.UiTreeTable.prototype.collapseNativeRow = function(treeTableRow) {
  var rowIndexToCollapse = this.getRowIndexByTreeTableRow(treeTableRow);
  if (rowIndexToCollapse != -1) {
    this.getNativeControl().collapse(rowIndexToCollapse);
  }
};

oFF.UiTreeTable.prototype._tryToExpandPath = function(treeTableRow) {
  if (treeTableRow) {
    var tmpRowParent = treeTableRow.getParent();
    var rowsArray = [treeTableRow];
    while (tmpRowParent && tmpRowParent.isExpanded() === false && tmpRowParent != this) {
      rowsArray = tmpRowParent.concat(rowsArray);
      tmpRowParent = tmpRowParent.getParent();
    }
    if (rowsArray) {
      for (var a = 0; a < rowsArray.length; a++) {
        var tmpItem = rowsArray[a];
        if (tmpItem) {
          var rowIndexToExpand = this.getRowIndexByTreeTableRow(tmpItem);
          if (rowIndexToExpand != -1) {
            this.getNativeControl().expand(rowIndexToExpand);
          }
        }
      }
    }
  }
};

oFF.UiTreeTable.prototype.refreshData = function() {
  if (this.getNativeControl().getModel().getJSON() == null || this.getNativeControl().getModel().getJSON().length <= 2) {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().bindRows("/modelData");
    //has to be called after a model is bound
    this.getNativeControl().setCollapseRecursive(false); // this is required to presist the selection when collapsing and expanding a node, setting this to true will cause the selection to get lost (true is default value)
  } else {
    this.getNativeControl().getModel().setData({
      modelData: this.m_rowModel
    });
    this.getNativeControl().updateRows(ui5.sap_ui_model_ChangeReason.Refresh, ""); // second param can be empty? At least cannot be null! No public API for that!
  }
};

oFF.UiTreeTable.prototype._getConfiguredRowCount = function() {
  if (this.getNativeControl()) {
    const rowMode = this.getNativeControl().getRowMode();
    if (rowMode && rowMode.getConfiguredRowCount) {
      return rowMode.getConfiguredRowCount();
    }
  }
  return -1;
};

oFF.UiTreeTable.prototype._getTotalRowCount = function() {
  if (this.getNativeControl()) {
    const rowMode = this.getNativeControl().getRowMode();
    if (rowMode && rowMode.getTotalRowCountOfTable) {
      return rowMode.getTotalRowCountOfTable();
    }
  }
  return -1;
};

oFF.UiTreeTable.prototype._createItemEvent = function(treeTableRow) {
  const newItemEvent = oFF.UiItemEvent.create(this);
  newItemEvent.setItemData(treeTableRow);
  newItemEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CONFIGURED_ROW_COUNT, this._getConfiguredRowCount());
  newItemEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TOTAL_ROW_COUNT, this._getTotalRowCount());
  return newItemEvent;
};

oFF.UiTreeTableRow = function() {
   oFF.UiTableRow.call(this);
  this._ff_c = "UiTreeTableRow";
};
oFF.UiTreeTableRow.prototype = new oFF.UiTableRow();

oFF.UiTreeTableRow.prototype.newInstance = function() {
  var object = new oFF.UiTreeTableRow();
  object.setup();
  return object;
};

// ======================================

oFF.UiTreeTableRow.prototype.addTreeTableRow = function(treeTableRow) {
  oFF.UiTableRow.prototype.addTreeTableRow.call(this, treeTableRow);
  var data = treeTableRow.getData();
  var mydData = this.getData();
  mydData[treeTableRow.getId()] = data;
  this.refreshData();
  return this;
};

oFF.UiTreeTableRow.prototype.insertTreeTableRow = function(treeTableRow, index) {
  oFF.UiTableRow.prototype.insertTreeTableRow.call(this, treeTableRow, index);
  this._clearTreeTableData();
  var mydData = this.getData();
  var treeTableRows = this.getTreeTableRows();
  for (var i = 0; i < treeTableRows.size(); i++) {
    var tmpTableRow = treeTableRows.get(i);
    var tmpData = tmpTableRow.getData();
    mydData[tmpTableRow.getId()] = tmpData;
  }
  this.refreshData();
  return this;
};

oFF.UiTreeTableRow.prototype.removeTreeTableRow = function(treeTableRow) {
  if (treeTableRow != null) {
    var mydData = this.getData();
    delete mydData[treeTableRow.getId()];
    this.refreshData();
  }
  oFF.UiTableRow.prototype.removeTreeTableRow.call(this, treeTableRow);
  return this;
};

oFF.UiTreeTableRow.prototype.clearTreeTableRows = function() {
  oFF.UiTableRow.prototype.clearTreeTableRows.call(this);
  this._clearTreeTableData();
  this.refreshData();
  return this;
};

// ====================================

oFF.UiTreeTableRow.prototype.setExpanded = function(expanded) {
  oFF.UiTableRow.prototype.setExpanded.call(this, expanded);
  if (expanded === true) {
    this.expandNativeRow(this);
  } else {
    this.collapseNativeRow(this);
  }
  return this;
};

oFF.UiTreeTableRow.prototype.isExpanded = function() {
  var treeTable = this.getTable();
  if (treeTable && treeTable.getNativeControl()) {
    var rowIndexToCheck = treeTable.getRowIndexByTreeTableRow(this);
    if (rowIndexToCheck != -1) {
      return treeTable.getNativeControl().isExpanded(rowIndexToCheck);
    } else {
      return false;
    }
  }
  return oFF.UiTableRow.prototype.isExpanded.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTreeTableRow.prototype.getRowIndex = function() {
  var treeTable = this.getTable();
  if (treeTable && treeTable.getNativeControl()) {
    var index = 0;
    var rowContext = null;
    do {
      rowContext = treeTable.getNativeControl().getContextByIndex(index);
      if (rowContext) {
        var bindingPath = rowContext.getPath();
        var itemId = bindingPath.substring(bindingPath.lastIndexOf("/") + 1);
        if (itemId === this.getId()) {
          return index;
        }
      }
      index++;
    } while (rowContext != null);
  }
  return -1;
};


oFF.UiTreeTableRow.prototype._clearTreeTableData = function() {
  for (var propKey in this.getData()) {
    // column properties are cells so do not delete them, we only want to remove the children (tree table rows)
    //the string column is defined in the TableCell class
    if (this.getData().hasOwnProperty(propKey) && propKey.indexOf("column") === -1) {
      delete this.getData()[propKey];
    }
  }
};

oFF.UiTreeTableRow.prototype.expandNativeRow = function(treeTableRow) {
  if (this.getParent()) {
    this.getParent().expandNativeRow(treeTableRow);
  }
};

oFF.UiTreeTableRow.prototype.collapseNativeRow = function(treeTableRow) {
  if (this.getParent()) {
    this.getParent().collapseNativeRow(treeTableRow);
  }
};

oFF.UiTreeTableRow.prototype.rowClicked = function() {
  this.handleClick(null);
};

oFF.UiTreeTableRow.prototype.rowExpanded = function() {
  if (this.getListenerOnExpand() !== null) {
    const newItemEvent = oFF.UiItemEvent.create(this);
    newItemEvent.setItemData(this);
    this.getListenerOnExpand().onExpand(newItemEvent);
  }
};

oFF.UiTreeTableRow.prototype.rowCollapsed = function() {
  if (this.getListenerOnCollapse() !== null) {
    const newItemEvent = oFF.UiItemEvent.create(this);
    newItemEvent.setItemData(this);
    this.getListenerOnCollapse().onCollapse(newItemEvent);
  }
};

class UiDropDown extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiDropDown";
  }

  newInstance() {
    let object = new UiDropDown();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Select(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnSelect(listener) {
    super.registerOnSelect(listener);
    this.attachEventCallback("change", this._handleSelect, listener);
    return this;
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().addItem(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().insertItem(nativeItem, index);
    return this;
  }

  removeItem(item) {
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().removeItem(nativeItem);
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  setSelectedItem(item) {
    super.setSelectedItem(item);
    const itemId = item?.getId?.();
    this.getNativeControl().setSelectedItemId(itemId);
    return this;
  }

  getSelectedItem() {
    const selectedItemId = this.getNativeControl()?.getSelectedItemId?.();
    const selectedItem = this.getItemById(selectedItemId);
    return selectedItem;
  }

  // ======================================

  open() {
    super.open();
    this.getNativeControl().open();
    return this;
  }

  close() {
    super.close();
    this.getNativeControl().close();
    return this;
  }

  isOpen() {
    return this.getNativeControl().isOpen();
  }

  // ======================================

  setValueState(valueState) {
    super.setValueState(valueState);
    this.getNativeControl().setValueState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
    return this;
  }

  setValueStateText(valueStateText) {
    super.setValueStateText(valueStateText);
    this.getNativeControl().setValueStateText(valueStateText);
    return this;
  }

  getValueStateText() {
    return this.getNativeControl().getValueStateText();
  }

  setEditable(editable) {
    super.setEditable(editable);
    this.getNativeControl().setEditable(editable);
    return this;
  }

  setShowSecondaryValues(showSecondaryValues) {
    super.setShowSecondaryValues(showSecondaryValues);
    this.getNativeControl().setShowSecondaryValues(showSecondaryValues);
    return this;
  }

  isShowSecondaryValues() {
    return this.getNativeControl().getShowSecondaryValues();
  }

  // Overrides
  // ======================================

  setHeight(height) {
    // remove height from the object
    // don't change the Dropdown height on JavaScript, it should only be done on iOS
    oFF.UiGeneric.prototype.setHeight.call(this, null);
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

  _handleSelect(oControlEvent) {
    if (this.getListenerOnSelect() !== null) {
      const nativeSelectedItem = oControlEvent.getParameters().selectedItem;
      const ffSelectedItem = oFF.UiGeneric.getFfControl(nativeSelectedItem);

      const newSelectionEvent = oFF.UiSelectionEvent.create(this)
      newSelectionEvent.setSingleSelectionData(ffSelectedItem);
      this.getListenerOnSelect().onSelect(newSelectionEvent);
    }
  }

}

oFF.UiDropDown = UiDropDown;

class UiDropDownItem extends oFF.UiDropDownItemBase {
  constructor() {
    super();
    this._ff_c = "UiDropDownItem";
  }

  newInstance() {
    let object = new UiDropDownItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_core_ListItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // Overrides
  // ======================================

}

oFF.UiDropDownItem = UiDropDownItem;

class UiDropDownGroupItem extends oFF.UiDropDownItemBase {
  constructor() {
    super();
    this._ff_c = "UiDropDownGroupItem";
  }

  newInstance() {
    let object = new UiDropDownGroupItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_core_SeparatorItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // Overrides
  // ======================================

}

oFF.UiDropDownGroupItem = UiDropDownGroupItem;

oFF.UiComboBox = function() {
   oFF.UiComboBoxBase.call(this);
  this._ff_c = "UiComboBox";
};
oFF.UiComboBox.prototype = new oFF.UiComboBoxBase();

oFF.UiComboBox.prototype.newInstance = function() {
  var object = new oFF.UiComboBox();
  object.setup();
  return object;
};

oFF.UiComboBox.prototype.initializeNative = function() {
  oFF.UiComboBoxBase.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_ComboBox(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiComboBox.prototype.registerOnChange = function(listener) {
  oFF.UiComboBoxBase.prototype.registerOnChange.call(this, listener);
  this.getNativeControl().detachChange(this.handleChange, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachChange(this.handleChange, this);
  }
  return this;
};

// ======================================

oFF.UiComboBox.prototype.setSelectedItem = function(selectedItem) {
  oFF.UiComboBoxBase.prototype.setSelectedItem.call(this, selectedItem);
  let value = null;
  if (selectedItem !== null && selectedItem !== undefined) {
     value = selectedItem.getId();
  }
  this.getNativeControl().setSelectedItemId(value);
  return this;
};

oFF.UiComboBox.prototype.getSelectedItem = function() {
  var selectedItemId = this.getNativeControl().getSelectedItemId();
  var selectedItem = this.getItemById(selectedItemId);
  if (selectedItem != null) {
    return selectedItem;
  }
  return null;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiComboBox.prototype.handleSelectionChange = function(oEvent) {
  if (this.getListenerOnSelectionChange() !== null) {
    let nativeNode = oEvent.getParameters().selectedItem;
    let selectedFfItem = oFF.UiGeneric.getFfControl(nativeNode);
    const newSelectionEvent = oFF.UiSelectionEvent.create(this)
    newSelectionEvent.setSingleSelectionData(selectedFfItem);
    this.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
  }
};

oFF.UiComboBox.prototype.handleChange = function(oEvent) {
  if (this.getListenerOnChange() !== null) {
    const parameters = oEvent.getParameters();

    const newControlEvent = oFF.UiControlEvent.create(this);
    if (!!parameters) {
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_VALUE, parameters.value);
      newControlEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_ITEM_PRESSED, parameters.itemPressed);
    }
    this.getListenerOnChange().onChange(newControlEvent);
  }
};

oFF.UiMultiComboBox = function() {
   oFF.UiComboBoxBase.call(this);
  this._ff_c = "UiMultiComboBox";
};
oFF.UiMultiComboBox.prototype = new oFF.UiComboBoxBase();

oFF.UiMultiComboBox.prototype.newInstance = function() {
  var object = new oFF.UiMultiComboBox();
  object.setup();
  return object;
};

oFF.UiMultiComboBox.prototype.initializeNative = function() {
  oFF.UiComboBoxBase.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_MultiComboBox(this.getId());

  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiMultiComboBox.prototype.registerOnSelectionFinish = function(listener) {
  oFF.UiComboBoxBase.prototype.registerOnSelectionFinish.call(this, listener);
  this.getNativeControl().detachSelectionFinish(this.handleSelectionFinish, this); // first deregister any previous listeners
  if (listener) {
    this.getNativeControl().attachSelectionFinish(this.handleSelectionFinish, this);
  }
  return this;
};

// ======================================

oFF.UiMultiComboBox.prototype.setSelectedItem = function(item) {
  oFF.UiComboBoxBase.prototype.setSelectedItem.call(this, item);
  if (item !== null && item !== undefined) {
    this.getNativeControl().setSelectedItems([item.getNativeControl()]);
  }
  return this;
};

oFF.UiMultiComboBox.prototype.getSelectedItem = function() {
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  if (aSelectedItems != null && aSelectedItems.length > 0) {
    return aSelectedItems[0];
  }
  return null;
};

oFF.UiMultiComboBox.prototype.setSelectedItems = function(items) {
  oFF.UiComboBoxBase.prototype.setSelectedItems.call(this, items);
  this.getNativeControl().clearSelection();
  if (items !== null) {
    var size = items.size();
    var itemList = [];
    for (var i = 0; i < size; i++) {
      itemList.push(items.get(i).getNativeControl());
    }
    this.getNativeControl().setSelectedItems(itemList);
  } else {
    this.getNativeControl().setSelectedItems(null);
  }
  return this;
};

oFF.UiMultiComboBox.prototype.getSelectedItems = function() {
  var oList = oFF.XList.create();
  var aSelectedItems = this.getNativeControl().getSelectedItems();
  for (var i = 0; i < aSelectedItems.length; i++) {
    var ffControl = oFF.UiGeneric.getFfControl(aSelectedItems[i]);
    oList.add(ffControl);
  }
  return oList;
};

oFF.UiMultiComboBox.prototype.addSelectedItem = function(item) {
  oFF.UiComboBoxBase.prototype.addSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().addSelectedItem(item.getNativeControl());
  }
  return this;
};

oFF.UiMultiComboBox.prototype.removeSelectedItem = function(item) {
  oFF.UiComboBoxBase.prototype.removeSelectedItem.call(this, item);
  if (item != null) {
    this.getNativeControl().removeSelectedItem(item.getNativeControl());
  }
  return this;
};

oFF.UiMultiComboBox.prototype.clearSelectedItems = function() {
  oFF.UiComboBoxBase.prototype.clearSelectedItems.call(this);
  this.getNativeControl().clearSelection();
  return this;
};

// ======================================

oFF.UiMultiComboBox.prototype.setShowSelectAll = function(showSelectAll) {
  oFF.UiComboBoxBase.prototype.setShowSelectAll.call(this, showSelectAll);
  if (this.getNativeControl().setShowSelectAll) {
    // available since ui5 version 1.96
    this.getNativeControl().setShowSelectAll(showSelectAll);
  }
  return this;
};

oFF.UiMultiComboBox.prototype.isShowSelectAll = function() {
  if (this.getNativeControl().getShowSelectAll) {
    // available since ui5 version 1.96
    return this.getNativeControl().getShowSelectAll();
  }
  return oFF.UiComboBoxBase.prototype.isShowSelectAll.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiMultiComboBox.prototype.handleSelectionChange = function(oEvent) {
  if (this.getListenerOnSelectionChange() !== null) {
    var nativeNode = oEvent.getParameters().changedItem;
    var ffSelectedItem = oFF.UiGeneric.getFfControl(nativeNode);
    const newSelectionEvent = oFF.UiSelectionEvent.create(this)
    newSelectionEvent.setSingleSelectionData(ffSelectedItem);
    this.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
  }
};

oFF.UiMultiComboBox.prototype.handleSelectionFinish = function(oEvent) {
  if (this.getListenerOnSelectionFinish() !== null) {
    // get the selected items
    var nativeSelectedItems = oEvent.getParameters().selectedItems || [];
    // create new firefly list
    var oSelectedItemsList = oFF.XList.create();
    for (var i = 0; i < nativeSelectedItems.length; i++) {
      var ffControl = oFF.UiGeneric.getFfControl(nativeSelectedItems[i]);
      oSelectedItemsList.add(ffControl);
    }
    const newSelectionEvent = oFF.UiSelectionEvent.create(this)
    newSelectionEvent.setMultiSelectionData(oSelectedItemsList);
    this.getListenerOnSelectionFinish().onSelectionFinish(newSelectionEvent);
  }
};

class UiList extends oFF.UiListBase {
  constructor() {
    super();
    this._ff_c = "UiList";
  }

  newInstance() {
    let object = new UiList();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_List(this.getId());
    nativeControl.setIncludeItemInSelection(true);
    nativeControl.setSticky([ui5.sap_m_Sticky.HeaderToolbar]);
    // list type is not yet implemented, but is it really necessary?

    this.setNativeControl(nativeControl);
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

}

oFF.UiList = UiList;

class UiListItem extends oFF.UiListItemBase {
  constructor() {
    super();
    this._ff_c = "UiListItem";
  }

  newInstance() {
    let object = new UiListItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_StandardListItem(this.getId());
    nativeControl.setIconDensityAware(false); // do not try to fetch @2 icons

    this.setNativeControl(nativeControl);
  }

  // ======================================

  // Overrides
  // ======================================

  setText(text) {
    oFF.DfUiGeneric.prototype.setText.call(this, text); // skip UxGeneric call since the property has a different name
    this.getNativeControl().setTitle(text);
    return this;
  }

  getText() {
    return this.getNativeControl().getTitle();
  }

  getDescription() {
    return this.getNativeControl().getDescription();
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

}

oFF.UiListItem = UiListItem;

class UiCustomListItem extends oFF.UiListItemBase {
  constructor() {
    super();
    this._ff_c = "UiCustomListItem";
  }

  newInstance() {
    let object = new UiCustomListItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_CustomListItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  // Overrides
  // ======================================

  handleKeyDown(oEvent) {
    // Trigger the firefly event only when invoked on itself, not on children.
    if (oEvent.target === this.getNativeControl().getDomRef()) {
      super.handleKeyDown(oEvent);
    }
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

}

oFF.UiCustomListItem = UiCustomListItem;

class UiGroupHeaderListItem extends oFF.UiListItemBase {
  constructor() {
    super();
    this._ff_c = "UiGroupHeaderListItem";
  }

  newInstance() {
    let object = new UiGroupHeaderListItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_GroupHeaderListItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  // Overrides
  // ======================================

  setText(text) {
    oFF.DfUiGeneric.prototype.setText.call(this, text); // skip UxGeneric call since the property has a different name
    this.getNativeControl().setTitle(text);
    return this;
  }

  getText() {
    return this.getNativeControl().getTitle();
  }

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

}

oFF.UiGroupHeaderListItem = UiGroupHeaderListItem;

oFF.UiGridList = function() {
   oFF.UiListBase.call(this);
  this._ff_c = "UiGridList";
};
oFF.UiGridList.prototype = new oFF.UiListBase();

oFF.UiGridList.prototype.newInstance = function() {
  var object = new oFF.UiGridList();
  object.setup();
  return object;
};

oFF.UiGridList.prototype.initializeNative = function() {
  oFF.UiListBase.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_f_GridList(this.getId());
  nativeControl.setIncludeItemInSelection(true);
  nativeControl.setSticky([ui5.sap_m_Sticky.HeaderToolbar]);
  this.setNativeControl(nativeControl);
};

// ======================================

// ======================================

// ======================================

oFF.UiGridList.prototype.setGridLayout = function(gridLayout) {
  oFF.UiGeneric.prototype.setGridLayout.call(this, gridLayout);
  let nativeGridLayout = null;
  if (gridLayout) {
    nativeGridLayout = oFF.ui.Ui5ObjectUtils.createNativeGridLayout(gridLayout);
  }

  if (this.getNativeControl() && this.getNativeControl().setCustomLayout) {
    this.getNativeControl().setCustomLayout(nativeGridLayout);
  }
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

class UiGridListItem extends oFF.UiListItemBase {
  constructor() {
    super();
    this._ff_c = "UiGridListItem";
  }

  newInstance() {
    let object = new UiGridListItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_f_GridListItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  // Event handlers
  // ======================================

}

oFF.UiGridListItem = UiGridListItem;

oFF.UiNavigationList = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiNavigationList";
};
oFF.UiNavigationList.prototype = new oFF.UiGeneric();

oFF.UiNavigationList.prototype.newInstance = function() {
  var object = new oFF.UiNavigationList();
  object.setup();
  return object;
};

oFF.UiNavigationList.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_tnt_NavigationList(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiNavigationList.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onItemSelect event
  nativeControl.attachItemSelect(function(oControlEvent) {
    if (myself.getListenerOnItemSelect() !== null) {
      let nativeSelectedItem = oControlEvent.getParameters().item;
      if (nativeSelectedItem) {
        let ffSelectedItem = oFF.UiGeneric.getFfControl(nativeSelectedItem);
        const newItemEvent = oFF.UiItemEvent.create(myself);
        newItemEvent.setItemData(ffSelectedItem);
        myself.getListenerOnItemSelect().onItemSelect(newItemEvent);
      }
    }
  });

};

// ======================================

oFF.UiNavigationList.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiNavigationList.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiNavigationList.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiNavigationList.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiNavigationList.prototype.getSelectedItem = function() {
  var selectedItem = this.getNativeControl().getSelectedItem();
  if (selectedItem != null) {
    return oFF.UiGeneric.getFfControl(selectedItem);
  }
  return null;
};

oFF.UiNavigationList.prototype.setSelectedItem = function(item) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, item);
  if (item != null) {
    var nativeItemToSelect = item.getNativeControl();
    if (nativeItemToSelect) {
      this.getNativeControl().setSelectedItem(nativeItemToSelect);
    }
  } else {
    this.getNativeControl().setSelectedItem(null);
  }
  return this;
};

// ======================================

oFF.UiNavigationList.prototype.setExpanded = function(expanded) {
  oFF.UiGeneric.prototype.setExpanded.call(this, expanded);
  this.getNativeControl().setExpanded(expanded);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiNavigationListItem = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiNavigationListItem";
};
oFF.UiNavigationListItem.prototype = new oFF.UiGeneric();

oFF.UiNavigationListItem.prototype.newInstance = function() {
  var object = new oFF.UiNavigationListItem();
  object.setup();
  return object;
};

oFF.UiNavigationListItem.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_tnt_NavigationListItem(this.getId());
  nativeControl.setTarget("_blank");

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiNavigationListItem.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onSelect event
  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnSelect() !== null) {
      let nativeItem = oEvent.getParameters().item; // the item here should be actaully myself so no need for a single selection event!
      //TODO: onSelect should mean when this item gets selected!
      let ffItem = oFF.UiGeneric.getFfControl(nativeItem);
      const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
      newSelectionEvent.setSingleSelectionData(ffItem);
      myself.getListenerOnSelect().onSelect(newSelectionEvent);
    }
  });
};

// ======================================

oFF.UiNavigationListItem.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiNavigationListItem.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiNavigationListItem.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiNavigationListItem.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};


oFF.UiNavigationListItem.prototype.setSrc = function(src) {
  oFF.UiGeneric.prototype.setSrc.call(this, src);
  this.getNativeControl().setHref(src);
  return this;
};


// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSideNavigation = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSideNavigation";
};
oFF.UiSideNavigation.prototype = new oFF.UiGeneric();

oFF.UiSideNavigation.prototype.newInstance = function() {
  var object = new oFF.UiSideNavigation();
  object.setup();
  return object;
};

oFF.UiSideNavigation.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_tnt_SideNavigation(this.getId());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiSideNavigation.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onItemSelect event
  nativeControl.attachItemSelect(function(oControlEvent) {
    if (myself.getListenerOnItemSelect() !== null) {
      let nativeSelectedItem = oControlEvent.getParameters().item;
      if (nativeSelectedItem) {
        let ffSelectedItem = oFF.UiGeneric.getFfControl(nativeSelectedItem);
        const newItemEvent = oFF.UiItemEvent.create(myself);
        newItemEvent.setItemData(ffSelectedItem);
        myself.getListenerOnItemSelect().onItemSelect(newItemEvent);
      }
    }
  });

};

// ======================================

oFF.UiSideNavigation.prototype.setNavList = function(navList) {
  oFF.UiGeneric.prototype.setNavList.call(this, navList);
  var nativeNavList = navList?.getNativeControl?.();
  this.getNativeControl().setItem(nativeNavList);
  return this;
};

// ======================================

oFF.UiSideNavigation.prototype.setFixedNavList = function(navList) {
  oFF.UiGeneric.prototype.setFixedNavList.call(this, navList);
  var nativeNavList = navList?.getNativeControl?.();
  this.getNativeControl().setFixedItem(nativeNavList);
  return this;
};

// ======================================

oFF.UiSideNavigation.prototype.setFooter = function(footer) {
  oFF.UiGeneric.prototype.setFooter.call(this, footer);
  let nativeFooterControl = footer?.getNativeControl?.();
  this.getNativeControl().setFooter(nativeFooterControl);
  return this;
};

// ======================================

oFF.UiSideNavigation.prototype.setExpanded = function(expanded) {
  oFF.UiGeneric.prototype.setExpanded.call(this, expanded);
  this.getNativeControl().setExpanded(expanded);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSlider = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSlider";
};
oFF.UiSlider.prototype = new oFF.UiGeneric();

oFF.UiSlider.prototype.newInstance = function() {
  var object = new oFF.UiSlider();
  object.setup();
  return object;
};

oFF.UiSlider.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Slider(this.getId());
  nativeControl.setValue(0);
  nativeControl.setMin(0);
  nativeControl.setMax(100);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiSlider.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiSlider.prototype.setSliderMinimum = function(min) {
  oFF.UiGeneric.prototype.setSliderMinimum.call(this, min);
  this.getNativeControl().setMin(min);
  return this;
};

oFF.UiSlider.prototype.setSliderMaximum = function(max) {
  oFF.UiGeneric.prototype.setSliderMaximum.call(this, max);
  this.getNativeControl().setMax(max);
  return this;
};

oFF.UiSlider.prototype.setSliderStep = function(step) {
  oFF.UiGeneric.prototype.setSliderStep.call(this, step);
  this.getNativeControl().setStep(step);
  return this;
};

oFF.UiSlider.prototype.setSliderValue = function(value) {
  oFF.UiGeneric.prototype.setSliderValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiSlider.prototype.getSliderValue = function() {
  return this.getNativeControl().getValue();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiRangeSlider = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiRangeSlider";
};
oFF.UiRangeSlider.prototype = new oFF.UiGeneric();

oFF.UiRangeSlider.prototype.newInstance = function() {
  var object = new oFF.UiRangeSlider();
  object.setup();
  return object;
};

oFF.UiRangeSlider.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_RangeSlider(this.getId());
  nativeControl.setMin(0);
  nativeControl.setMax(100);
  nativeControl.setValue(0);
  nativeControl.setValue2(100);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiRangeSlider.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // onChange event
  nativeControl.attachChange(function(oEvent) {
    if (myself.getListenerOnChange() !== null) {
      myself.getListenerOnChange().onChange(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiRangeSlider.prototype.setSliderMinimum = function(min) {
  oFF.UiGeneric.prototype.setSliderMinimum.call(this, min);
  this.getNativeControl().setMin(min);
  return this;
};

oFF.UiRangeSlider.prototype.setSliderMaximum = function(max) {
  oFF.UiGeneric.prototype.setSliderMaximum.call(this, max);
  this.getNativeControl().setMax(max);
  return this;
};

oFF.UiRangeSlider.prototype.setSliderStep = function(step) {
  oFF.UiGeneric.prototype.setSliderStep.call(this, step);
  this.getNativeControl().setStep(step);
  return this;
};


oFF.UiRangeSlider.prototype.setSliderValue = function(value) {
  oFF.UiGeneric.prototype.setSliderValue.call(this, value);
  this.getNativeControl().setValue(value);
  return this;
};

oFF.UiRangeSlider.prototype.getSliderValue = function() {
  return this.getNativeControl().getValue();
};

oFF.UiRangeSlider.prototype.setSliderUpperValue = function(value) {
  oFF.UiGeneric.prototype.setSliderUpperValue.call(this, value);
  this.getNativeControl().setValue2(value);
  return this;
};

oFF.UiRangeSlider.prototype.getSliderUpperValue = function() {
  return this.getNativeControl().getValue2();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiActivityIndicator = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiActivityIndicator";
};
oFF.UiActivityIndicator.prototype = new oFF.UiGeneric();

oFF.UiActivityIndicator.prototype.newInstance = function() {
  var object = new oFF.UiActivityIndicator();
  object.setup();
  return object;
};

oFF.UiActivityIndicator.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_BusyIndicator(this.getId());
  nativeControl.setCustomIconDensityAware(false); // do not try to fetch @2 icons

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiActivityIndicator.prototype.setText = function(text) {
  oFF.UiGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setText(text);
  this.getNativeControl().invalidate(); // requires for text update on a existing activity indicator!
  return this;
};

oFF.UiActivityIndicator.prototype.setSrc = function(src) {
  oFF.UiGeneric.prototype.setSrc.call(this, src);
  this.getNativeControl().setCustomIcon(src);
  return this;
};

oFF.UiActivityIndicator.prototype.setAnimationDuration = function(animationDuration) {
  oFF.UiGeneric.prototype.setAnimationDuration.call(this, animationDuration);
  this.getNativeControl().setCustomIconRotationSpeed(animationDuration);
  return this;
};


// Overrides
// ======================================

oFF.UiActivityIndicator.prototype.setIconSize = function(iconSize) {
  oFF.DfUiGeneric.prototype.setIconSize.call(this, iconSize); // skip generic implementation
  var iconSizeCss = this._calculateIconSizeCss();
  this.getNativeControl().setSize(iconSizeCss);
  this.getNativeControl().setCustomIconWidth(iconSizeCss); // additionally set values for custom icon
  this.getNativeControl().setCustomIconHeight(iconSizeCss); // additionally set values for custom icon
  return this;
};

// Control specific style and attribute handling
// ======================================

oFF.UiActivityIndicator.prototype.applyCustomCssStyling = function(element) {
  // center the activity indicator and the text horizontally and vertically
  element.style.display = "flex";
  element.style.flexDirection = "column";
  element.style.justifyContent = "center";
  element.style.alignItems = "center";
};

// Helpers
// ======================================

oFF.UiProgressIndicator = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiProgressIndicator";
};
oFF.UiProgressIndicator.prototype = new oFF.UiGeneric();

oFF.UiProgressIndicator.prototype.newInstance = function() {
  var object = new oFF.UiProgressIndicator();
  object.setup();
  return object;
};

oFF.UiProgressIndicator.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_ProgressIndicator(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiProgressIndicator.prototype.setText = function(text) {
  oFF.UiGeneric.prototype.setText.call(this, text);
  this.getNativeControl().setDisplayValue(text);
  return this;
};

oFF.UiProgressIndicator.prototype.getText = function() {
  return this.getNativeControl().getDisplayValue();
};

oFF.UiProgressIndicator.prototype.setAnimated = function(animated) {
  oFF.UiGeneric.prototype.setAnimated.call(this, animated);
  this.getNativeControl().setDisplayAnimation(animated);
  return this;
};

oFF.UiProgressIndicator.prototype.isAnimated = function() {
  return this.getNativeControl().getDisplayAnimation();
};

oFF.UiProgressIndicator.prototype.setPercentValue = function(value) {
  oFF.UiGeneric.prototype.setPercentValue.call(this, value);
  this.getNativeControl().setPercentValue(value);
  return this;
};

oFF.UiProgressIndicator.prototype.getPercentValue = function() {
  return this.getNativeControl().getPercentValue();
};

oFF.UiProgressIndicator.prototype.setShowValue = function(showValue) {
  oFF.UiGeneric.prototype.setShowValue.call(this, showValue);
  this.getNativeControl().setShowValue(showValue);
  return this;
};

oFF.UiProgressIndicator.prototype.isShowValue = function() {
  return this.getNativeControl().getShowValue();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiProgressIndicator.prototype.applyColorCss = function(element, color) {
  ui5.sap_jQuery(element).find(".sapMPIBar").css("background-color", color);
};

oFF.UiProgressIndicator.prototype.applyBackgrounColorCss = function(element, bgColor) {
  ui5.sap_jQuery(element).find(".sapMPIBarRemaining").css("background-color", bgColor);
};

oFF.UiProgressIndicator.prototype.applyFontColorCss = function(element, fontColorCss) {
  ui5.sap_jQuery(element).find(".sapMPIText").css("color", fontColorCss);
};

// Helpers
// ======================================

class UiHtml extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiHtml";
  }

  newInstance() {
    let object = new UiHtml();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_core_HTML(this.getId());
    // NOTE: the html control does not support custom css classes
    nativeControl.setPreferDOM(false); // prevent moving the content to sap-ui-preserve when not needed

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnLoadFinished(listener) {
    super.registerOnLoadFinished(listener);
    this.attachEventCallback("afterRendering", this._handleOnLoadFinished, listener);
    return this;
  }

  // ======================================

  setValue(value) {
    oFF.DfUiGeneric.prototype.setValue.call(this, value); // skip UxGeneric, different prop name
    if (value && value.length > 0) {
      if (this._isURL(value)) {
        this.getNativeControl().setContent("<div><iframe class ='ff-html-iframe' src='" + value + "'></iframe></div>");
      } else {
        this.getNativeControl().setContent("<div>" + value + "</div>");
      }
    } else {
      this.getNativeControl().setContent(null);
    }
    return this;
  }
  // Overrides
  // ======================================

  // Control specific style and attribute handling
  // ======================================

  // Helpers
  // ======================================

  _isURL(str) {
    var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      // and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?" + // port
      "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
      "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return pattern.test(str);
  }

  // Event Handlers
  // ======================================

  _handleOnLoadFinished(oEvent) {
    if (this.getListenerOnLoadFinished() != null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnLoadFinished().onLoadFinished(ffEvent);
    }
  }

}

oFF.UiHtml = UiHtml;

oFF.UiFormattedText = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiFormattedText";
};
oFF.UiFormattedText.prototype = new oFF.UiGeneric();

oFF.UiFormattedText.prototype.newInstance = function() {
  var object = new oFF.UiFormattedText();
  object.setup();
  return object;
};

oFF.UiFormattedText.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_FormattedText(this.getId());

  this.setNativeControl(nativeControl);
};
// ======================================

oFF.UiFormattedText.prototype.setText = function(text) {
  oFF.DfUiGeneric.prototype.setText.call(this, text); // skip generic implementation, different prop name
  this.getNativeControl().setHtmlText(text);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiCanvasLayout = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiCanvasLayout";
};
oFF.UiCanvasLayout.prototype = new oFF.UiGeneric();

oFF.UiCanvasLayout.prototype.newInstance = function() {
  var object = new oFF.UiCanvasLayout();
  object.setup();
  return object;
};

oFF.UiCanvasLayout.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_ScrollContainer(this.getId());
  nativeControl.setHorizontal(true); // enable horizontal scrolling
  nativeControl.setVertical(true); // enable vertical scrolling

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiCanvasLayout.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContent(nativeItem);
  return this;
};

oFF.UiCanvasLayout.prototype.insertItem = function(item) {
  oFF.UiGeneric.prototype.insertItem.call(this);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContent(nativeItem, index);
  return this;
};

oFF.UiCanvasLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContent(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this);
  return this;
};

oFF.UiCanvasLayout.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call();
  this.getNativeControl().removeAllContent();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiSplitter = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSplitter";
};
oFF.UiSplitter.prototype = new oFF.UiGeneric();

oFF.UiSplitter.prototype.newInstance = function() {
  var object = new oFF.UiSplitter();
  object.setup();
  return object;
};

oFF.UiSplitter.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_ui_layout_Splitter(this.getId());
  nativeControl.setOrientation(ui5.sap_ui_core_Orientation.Vertical);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiSplitter.prototype._addEvents = function(nativeControl) {
  var myself = this;

  //onResize event
  nativeControl.attachResize(function(event) {
    if (myself.getListenerOnResize() !== null) {
      const newResizeEvent = oFF.UiResizeEvent.create(myself);
      newResizeEvent.setResizeData(event.newWidth, event.newHeight);
      myself.getListenerOnResize().onResize(newResizeEvent);
    }
  });

};

// ======================================

oFF.UiSplitter.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addContentArea(nativeItem);
  return this;
};

oFF.UiSplitter.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertContentArea(nativeItem, index);
  return this;
};

oFF.UiSplitter.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeContentArea(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiSplitter.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllContentAreas();
  return this;
};

// ======================================

oFF.UiSplitter.prototype.setOrientation = function(orientation) {
  oFF.UiGeneric.prototype.setOrientation.call(this, orientation);
  this.getNativeControl().setOrientation(oFF.ui.Ui5ConstantUtils.parseOrientation(orientation));
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiInteractiveSplitter = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiInteractiveSplitter";
};
oFF.UiInteractiveSplitter.prototype = new oFF.UiGeneric();

oFF.UiInteractiveSplitter.prototype.newInstance = function() {
  var object = new oFF.UiInteractiveSplitter();
  object.setup();
  return object;
};

oFF.UiInteractiveSplitter.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new oFF.UiCtUi5InteractiveSplitter(this.getId());
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiInteractiveSplitter.prototype.registerOnChange = function(listener) {
  oFF.UiGeneric.prototype.registerOnChange.call(this, listener);
  this.getNativeControl().detachStateChange(this.handleChange, this); // first unregister any previous listeners
  if (listener) {
    this.getNativeControl().attachStateChange(this.handleChange, this);
  }
  return this;
};

// ======================================

oFF.UiInteractiveSplitter.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiInteractiveSplitter.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiInteractiveSplitter.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiInteractiveSplitter.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().clearItems();
  return this;
};



oFF.UiInteractiveSplitter.prototype.showResizerAtIndex = function(nIndex) {
  oFF.UiGeneric.prototype.showResizerAtIndex.call(this, nIndex);
  this.getNativeControl().showResizerAtIndex(nIndex);
  return this;
};

oFF.UiInteractiveSplitter.prototype.hideResizerAtIndex = function(nIndex) {
  oFF.UiGeneric.prototype.hideResizerAtIndex.call(this, nIndex);
  this.getNativeControl().hideResizerAtIndex(nIndex);
  return this;
};

// ======================================

oFF.UiInteractiveSplitter.prototype.setOrientation = function(orientation) {
  oFF.UiGeneric.prototype.setOrientation.call(this, orientation);
  this.getNativeControl().setOrientation(oFF.ui.Ui5ConstantUtils.parseOrientation(orientation));
  return this;
};

// ======================================

oFF.UiInteractiveSplitter.prototype.setEnableReordering = function(enableReordering) {
  oFF.UiGeneric.prototype.setEnableReordering.call(this, enableReordering);
  this.getNativeControl().setEnableTabReordering(enableReordering);
  return this;
};
// ======================================

oFF.UiInteractiveSplitter.prototype.setStateJson = function(stateJson) {
  oFF.UiGeneric.prototype.setStateJson.call(this, stateJson);
  var nativeModel = stateJson.convertToNative();
  this.getNativeControl().setContentState(nativeModel);
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

// Event handlers
// ======================================

oFF.UiInteractiveSplitter.prototype.handleChange = function(oEvent) {
  if (this.getListenerOnChange() !== null) {
    const newControlEvent = oFF.UiControlEvent.create(this);
    newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_NEW_CONTENT_STATE, JSON.stringify(oEvent.getParameter("newContentState")));
    this.getListenerOnChange().onChange(newControlEvent);
  }
};

class UiInteractiveSplitterItem extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiInteractiveSplitterItem";
  }

  newInstance() {
    let object = new UiInteractiveSplitterItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new oFF.UiCtUi5InteractiveSplitterItem(this.getId());
    this.setNativeControl(nativeControl);
  }
  // ======================================

  registerOnResize(listener) {
    super.registerOnResize(listener);
    this.attachEventCallback("resize", this._handleResize, listener);
    return this;
  }

  registerOnChange(listener) {
    super.registerOnChange(listener);
    this.attachEventCallback("change", this._handleChange, listener);
    return this;
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeContent();
    if (content != null) {
      const nativeContent = content.getNativeControl();
      this.getNativeControl().addContent(nativeContent);
    }
    return this;
  }

  clearContent() {
    super.clearContent();
    this.getNativeControl().removeContent();
    return this;
  }

  // ======================================

  setStateName(stateName) {
    super.setStateName(stateName);
    this.getNativeControl().setStateName(stateName);
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    return this;
  }
  // read only!
  getOffsetHeight() {
    if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
      return this.getNativeControl().getDomRef().offsetHeight;
    }
    return 0;
  }

  getOffsetWidth() {
    if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
      return this.getNativeControl().getDomRef().offsetWidth;
    }
    return 0;
  }

  // ======================================

  _handleResize(oEvent) {
    if (this.getListenerOnResize() != null) {
      let oSize = oEvent.getParameter("size");
      if (oSize) {
        let offsetWidth = oSize.offsetWidth;
        let offsetHeight = oSize.offsetHeight;
        const newResizeEvent = oFF.UiResizeEvent.create(this);
        newResizeEvent.setResizeData(offsetWidth, offsetHeight);
        this.getListenerOnResize().onResize(newResizeEvent);
      } else {
        console.error("oFF.UiInteractiveSplitterItem - Resize event triggered without 'size' argument!");
      }
    }
  }

  _handleChange(oEvent) {
    if (this.getListenerOnChange() != null) {
      let nIndex = oEvent.getParameter("index");
      if (nIndex !== undefined) {
        const newControlEvent = oFF.UiControlEvent.create(this);
        newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_INDEX, nIndex);
        this.getListenerOnChange().onChange(newControlEvent);
      } else {
        console.error("oFF.UiInteractiveSplitterItem - Change event triggered without 'index' argument!");
      }
    }
  }

}

oFF.UiInteractiveSplitterItem = UiInteractiveSplitterItem;

oFF.UiHorizontalLayout = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiHorizontalLayout";
};
oFF.UiHorizontalLayout.prototype = new oFF.UiGeneric();

oFF.UiHorizontalLayout.prototype.newInstance = function() {
  var object = new oFF.UiHorizontalLayout();
  object.setup();
  return object;
};

oFF.UiHorizontalLayout.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_HBox(this.getId());
  this.setNativeControl(nativeControl);
};
// ======================================

oFF.UiHorizontalLayout.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiHorizontalLayout.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiHorizontalLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiHorizontalLayout.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiHorizontalLayout.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or content will break out of bounds if the content is bigger then the layout
  element.style.overflowX = "auto";
};

// Helpers
// ======================================

oFF.UiVerticalLayout = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiVerticalLayout";
};
oFF.UiVerticalLayout.prototype = new oFF.UiGeneric();

oFF.UiVerticalLayout.prototype.newInstance = function() {
  var object = new oFF.UiVerticalLayout();
  object.setup();
  return object;
};

oFF.UiVerticalLayout.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_VBox(this.getId());
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiVerticalLayout.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiVerticalLayout.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiVerticalLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiVerticalLayout.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiVerticalLayout.prototype.applyCustomCssStyling = function(element) {
  // content needs to have overflow auto or content will break out of bounds if the content is bigger then the layout
  element.style.overflowY = "auto";
};

// Helpers
// ======================================

oFF.UiFlexLayout = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiFlexLayout";
};
oFF.UiFlexLayout.prototype = new oFF.UiGeneric();

oFF.UiFlexLayout.prototype.newInstance = function() {
  var object = new oFF.UiFlexLayout();
  object.setup();
  return object;
};

oFF.UiFlexLayout.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_FlexBox(this.getId());
  nativeControl.setRenderType(ui5.sap_m_FlexRendertype.Bare); // remove the divs which wrap the items
  nativeControl.setFitContainer(true);

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiFlexLayout.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  if (item) {
    let nativeItem = item.getNativeControl();
    this.getNativeControl().addItem(nativeItem);
  }
  return this;
};

oFF.UiFlexLayout.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  if (item) {
    let nativeItem = item.getNativeControl();
    this.getNativeControl().insertItem(nativeItem, index);
  }
  return this;
};

oFF.UiFlexLayout.prototype.removeItem = function(item) {
  if (item) {
    let nativeItem = item.getNativeControl();
    this.getNativeControl().removeItem(nativeItem);
  }
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiFlexLayout.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiFlexLayout.prototype.setDirection = function(direction) {
  oFF.UiGeneric.prototype.setDirection.call(this, direction);
  this.getNativeControl().setDirection(oFF.ui.Ui5ConstantUtils.parseFlexDirection(direction));
  return this;
};

oFF.UiFlexLayout.prototype.setAlignItems = function(alignItems) {
  oFF.UiGeneric.prototype.setAlignItems.call(this, alignItems);
  this.getNativeControl().setAlignItems(oFF.ui.Ui5ConstantUtils.parseFlexAlignItems(alignItems));
  return this;
};

oFF.UiFlexLayout.prototype.setAlignContent = function(alignContent) {
  oFF.UiGeneric.prototype.setAlignContent.call(this, alignContent);
  this.getNativeControl().setAlignContent(oFF.ui.Ui5ConstantUtils.parseFlexAlignContent(alignContent));
  return this;
};

oFF.UiFlexLayout.prototype.setJustifyContent = function(justifyContent) {
  oFF.UiGeneric.prototype.setJustifyContent.call(this, justifyContent);
  this.getNativeControl().setJustifyContent(oFF.ui.Ui5ConstantUtils.parseFlexJustifyContent(justifyContent));
  return this;
};

oFF.UiFlexLayout.prototype.setWrap = function(wrap) {
  oFF.UiGeneric.prototype.setWrap.call(this, wrap);
  this.getNativeControl().setWrap(oFF.ui.Ui5ConstantUtils.parseFlexWrap(wrap));
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiFlowLayout = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiFlowLayout";
};
oFF.UiFlowLayout.prototype = new oFF.UiGeneric();

oFF.UiFlowLayout.prototype.newInstance = function() {
  var object = new oFF.UiFlowLayout();
  object.setup();
  return object;
};

oFF.UiFlowLayout.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_FlexBox(this.getId());
  nativeControl.setRenderType(ui5.sap_m_FlexRendertype.Bare); // remove the divs which wrap the items
  nativeControl.setWrap(ui5.sap_m_FlexWrap.Wrap);
  nativeControl.setJustifyContent(ui5.sap_m_FlexJustifyContent.SpaceAround);
  nativeControl.setFitContainer(true);

  this.setNativeControl(nativeControl);
};
// ======================================

oFF.UiFlowLayout.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiFlowLayout.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiFlowLayout.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiFlowLayout.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

class UiTabBar extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTabBar";
  }

  newInstance() {
    let object = new UiTabBar();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_TabContainer(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnItemSelect(listener) {
    super.registerOnItemSelect(listener);
    this.attachEventCallback("itemSelect", this._handleItemSelect, listener);
    return this;
  }

  registerOnItemClose(listener) {
    super.registerOnItemClose(listener);
    this.attachEventCallback("itemClose", this._handleItemClose, listener);
    return this;
  }

  registerOnButtonPress(listener) {
    super.registerOnButtonPress(listener);
    this.attachEventCallback("addNewButtonPress", this._handleButtonPress, listener);
    return this;
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().addItem(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().insertItem(nativeItem, index);
    return this;
  }

  removeItem(item) {
    const nativeItem = item?.getNativeControl?.();
    this.getNativeControl().removeItem(nativeItem);
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  setSelectedItem(selectedItem) {
    super.setSelectedItem(selectedItem);
    const nativeItem = selectedItem?.getNativeControl?.();
    this.getNativeControl().setSelectedItem(nativeItem); // can be the id or the item itself
    return this;
  }

  getSelectedItem() {
    let itemId = this.getNativeControl().getSelectedItem(); // this method returns the id as string!!!
    let ffItem = this.getItemById(itemId);
    return ffItem;
  }

  // ======================================

  setShowAddNewButton(value) {
    super.setShowAddNewButton(value);
    this.getNativeControl().setShowAddNewButton(value);
    return this;
  }

  // ======================================

  _handleItemSelect(oEvent) {
    if (this.getListenerOnItemSelect() != null) {
      let itemId = oEvent?.getParameters?.()?.item?.getId?.();
      if (itemId) { // only fire the event if we actually have an item, the control also fires the event if there is no item during initial startup
        let ffItem = this.getItemById(itemId);
        const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, ffItem);
        this.getListenerOnItemSelect().onItemSelect(newItemEvent);
      }
    }
  }

  _handleItemClose(oEvent) {
    if (this.getListenerOnItemClose() != null) {
      oEvent.preventDefault(); // do not automatically close the tab!
      let itemId = oEvent?.getParameters?.()?.item?.getId?.();
      let ffItem = this.getItemById(itemId);
      const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, ffItem);
      this.getListenerOnItemClose().onItemClose(newItemEvent);
    }
  }

  _handleButtonPress(oEvent) {
    if (this.getListenerOnButtonPress() !== null) {
      const newControlEvent = oFF.ui.FfEventUtils.prepareButtonPressEvent(this, oFF.UiPressedButtonType.ADD);
      this.getListenerOnButtonPress().onButtonPress(newControlEvent);
    }
  }

}

oFF.UiTabBar = UiTabBar;

class UiTabBarItem extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiTabBarItem";
  }

  newInstance() {
    let object = new UiTabBarItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_TabContainerItem(this.getId());
    nativeControl.setName("Tab");

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    let nativeContent = content?.getNativeControl?.();
    this.getNativeControl().addContent(nativeContent);
    return this;
  }

  clearContent() {
    super.clearContent();
    this.getNativeControl().removeAllContent();
    return this;
  }

  // ======================================

  setText(value) {
    oFF.DfUiGeneric.prototype.setText.call(this, value); // skip generic implementation, different prop name
    this.getNativeControl().setName(value);
    return this;
  }

  setDescription(value) {
    oFF.DfUiGeneric.prototype.setDescription.call(this, value); // skip generic implementation, different prop name
    this.getNativeControl().setAdditionalText(value);
    return this;
  }

  setModified(value) {
    super.setModified(value);
    // set only if a different value was passed, somehow when passing the same value (true) then the marking next to the text toggles on/off!
    if (this.getNativeControl().getModified() !== value) {
      this.getNativeControl().setModified(value);
    }
    return this;
  }

  setShowCloseButton(value) {
    super.setShowCloseButton(value);
    if (!value) {
      this.getNativeControl().data("ff-no-close-button", "true", true);
    } else {
      this.getNativeControl().data("ff-no-close-button", null, true);
    }
    this.getNativeControl().invalidate();
    return this;
  }

  // ======================================

}

oFF.UiTabBarItem = UiTabBarItem;

oFF.UiIconTabBar = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiIconTabBar";
};
oFF.UiIconTabBar.prototype = new oFF.UiGeneric();

oFF.UiIconTabBar.prototype.newInstance = function() {
  var object = new oFF.UiIconTabBar();
  object.setup();
  return object;
};

oFF.UiIconTabBar.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_IconTabBar(this.getId());
  nativeControl.setStretchContentHeight(true);
  nativeControl.setExpandable(false);
  nativeControl.setTabDensityMode(oFF.ui.Ui5ConstantUtils.getDefaultIconTabDensityMode());

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiIconTabBar.prototype._addEvents = function(nativeControl) {
  var myself = this;

  nativeControl.attachSelect(function(oEvent) {
    if (myself.getListenerOnSelect() !== null) {
      var key = oEvent.getParameters().selectedItem.getKey();
      var ffSelectedItem = myself.getItemById(key); // i write the id of the tabstrip item as key

      const newSelectionEvent = oFF.UiSelectionEvent.create(myself)
      newSelectionEvent.setSingleSelectionData(ffSelectedItem);
      myself.getListenerOnSelect().onSelect(newSelectionEvent);
    }
  });
};

// ======================================

oFF.UiIconTabBar.prototype.addItem = function(item) {
  oFF.UiGeneric.prototype.addItem.call(this, item);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().addItem(nativeItem);
  return this;
};

oFF.UiIconTabBar.prototype.insertItem = function(item, index) {
  oFF.UiGeneric.prototype.insertItem.call(this, item, index);
  var nativeItem = item.getNativeControl();
  this.getNativeControl().insertItem(nativeItem, index);
  return this;
};

oFF.UiIconTabBar.prototype.removeItem = function(item) {
  var nativeItem = item.getNativeControl();
  this.getNativeControl().removeItem(nativeItem);
  oFF.UiGeneric.prototype.removeItem.call(this, item);
  return this;
};

oFF.UiIconTabBar.prototype.clearItems = function() {
  oFF.UiGeneric.prototype.clearItems.call(this);
  this.getNativeControl().removeAllItems();
  return this;
};

// ======================================

oFF.UiIconTabBar.prototype.setSelectedItem = function(selectedItem) {
  oFF.UiGeneric.prototype.setSelectedItem.call(this, selectedItem);
  if (selectedItem !== null) {
    var key = selectedItem.getId(); // i write the id of the tabstrip item as key
    this.getNativeControl().setSelectedKey(key);
  }
  return this;
};


oFF.UiIconTabBar.prototype.getSelectedItem = function() {
  var selectedKey = this.getNativeControl().getSelectedKey();
  var selectedItem = this.getItemById(selectedKey); // i write the id of the tabstrip item as key
  return selectedItem;
};

// ======================================

oFF.UiIconTabBar.prototype.setApplyContentPadding = function(applyContentPadding) {
  oFF.UiGeneric.prototype.setApplyContentPadding.call(this, applyContentPadding);
  if (this.getNativeControl()) {
    this.getNativeControl().setApplyContentPadding(applyContentPadding);
  }
  return this;
};

oFF.UiIconTabBar.prototype.setEnableReordering = function(enableReordering) {
  oFF.UiGeneric.prototype.setEnableReordering.call(this, enableReordering);
  if (this.getNativeControl()) {
    this.getNativeControl().setEnableTabReordering(enableReordering);
  }
  return this;
};

oFF.UiIconTabBar.prototype.setHeaderMode = function(headerMode) {
  oFF.UiGeneric.prototype.setHeaderMode.call(this, headerMode);
  this.getNativeControl().setHeaderMode(oFF.ui.Ui5ConstantUtils.parseIconTabHeaderMode(headerMode));
  return this;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

oFF.UiIconTabBar.prototype.applyCustomCssStyling = function(element) {
  // position: relative, with and height are required for correct setStretchContentHeight property
  element.style.position = "relative";
  element.style.width = "100%";
  element.style.height = "100%";
};

// Helpers
// ======================================

oFF.UiIconTabBarItem = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiIconTabBarItem";
};
oFF.UiIconTabBarItem.prototype = new oFF.UiGeneric();

oFF.UiIconTabBarItem.prototype.newInstance = function() {
  var object = new oFF.UiIconTabBarItem();
  object.setup();
  return object;
};

oFF.UiIconTabBarItem.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_IconTabFilter(this.getId());
  nativeControl.setKey(this.getId()); // used for selection
  this.setNativeControl(nativeControl);
};

oFF.UiIconTabBarItem.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiIconTabBarItem.prototype.setContent = function(content) {
  oFF.UiGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content != null) {
    let nativeContent = content.getNativeControl();
    this.getNativeControl().addContent(nativeContent);
  }
  return this;
};

// ======================================

oFF.UiIconTabBarItem.prototype.setText = function(text) {
  oFF.UiGeneric.prototype.setText.call(this, text);
  return this;
};

oFF.UiIconTabBarItem.prototype.getText = function() {
  return oFF.UiGeneric.prototype.getText.call(this);
};

oFF.UiIconTabBarItem.prototype.setIcon = function(icon) {
  oFF.UiGeneric.prototype.setIcon.call(this, icon);
  return this;
};

oFF.UiIconTabBarItem.prototype.getIcon = function() {
  return oFF.UiGeneric.prototype.getIcon.call(this);
};

oFF.UiIconTabBarItem.prototype.setCount = function(count) {
  oFF.UiGeneric.prototype.setCount.call(this, count);
  this.getNativeControl().setCount(count);
  return this;
};

oFF.UiIconTabBarItem.prototype.getCount = function() {
  return oFF.UiGeneric.prototype.getCount.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiDialog = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiDialog";

  this.m_resizeEventId = null;
};
oFF.UiDialog.prototype = new oFF.UiGeneric();

oFF.UiDialog.prototype.newInstance = function() {
  var object = new oFF.UiDialog();
  object.setup();
  return object;
};

oFF.UiDialog.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Dialog(this.getId());
  nativeControl.setDraggable(true); // default is false, we want to have it default true
  nativeControl.addStyleClass("sapUiNoContentPadding"); // older version of ui5 have content padding enabled per default, this should make sure we never have content padding in our dialogs

  // use setStretch on a mobile device (tablet and phone) to make sure that the dialog is full screen
  if (this.getUiManager().getDeviceInfo().isMobile() == true || ui5.sap_ui_Device.system.phone == true) {
    nativeControl.setStretch(true);
  }

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

oFF.UiDialog.prototype.releaseObject = function() {
  this._cleanUpResizeHandler();
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiDialog.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // beforeOpen event
  nativeControl.attachBeforeOpen(function(oEvent) {
    if (myself.getListenerOnBeforeOpen() !== null) {
      myself.getListenerOnBeforeOpen().onBeforeOpen(oFF.UiControlEvent.create(myself));
    }
  });

  // beforeClose event
  nativeControl.attachBeforeClose(function(oEvent) {
    if (myself.getListenerOnBeforeClose() !== null) {
      myself.getListenerOnBeforeClose().onBeforeClose(oFF.UiControlEvent.create(myself));
    }
  });

  // afterOpen event
  nativeControl.attachAfterOpen(function(oEvent) {
    if (myself.getListenerOnAfterOpen() !== null) {
      myself.getListenerOnAfterOpen().onAfterOpen(oFF.UiControlEvent.create(myself));
    }
  });

  // afterClose event
  nativeControl.attachAfterClose(function(oEvent) {
    if (myself.getListenerOnAfterClose() !== null) {
      myself.getListenerOnAfterClose().onAfterClose(oFF.UiControlEvent.create(myself));
    }
  });
};

oFF.UiDialog.prototype.registerOnResize = function(listener) {
  oFF.UiGeneric.prototype.registerOnResize.call(this, listener);
  this._cleanUpResizeHandler();
  if (listener) {
    this.m_resizeEventId = ui5.sap_ui_core_ResizeHandler.register(this.getNativeControl(), this.handleResize.bind(this))
  }
  return this;
};

oFF.UiDialog.prototype.registerOnEscape = function(listener) {
  oFF.UiGeneric.prototype.registerOnEscape.call(this, listener);
  if (listener) {
    this.getNativeControl().setEscapeHandler((escapePromise) => {
      escapePromise.reject();
      this.handleEscape();
    })
  } else {
    this.getNativeControl().setEscapeHandler(null);
  }
  return this;
};

// ======================================

oFF.UiDialog.prototype.addDialogButton = function(dialogButton) {
  oFF.UiGeneric.prototype.addDialogButton.call(this, dialogButton);
  let nativeDialogButton = dialogButton?.getNativeControl?.();
  this.getNativeControl().addButton(nativeDialogButton);
  return this;
};

oFF.UiDialog.prototype.insertDialogButton = function(dialogButton, index) {
  oFF.UiGeneric.prototype.insertDialogButton.call(this, dialogButton, index);
  let nativeDialogButton = dialogButton?.getNativeControl?.();
  this.getNativeControl().insertButton(nativeDialogButton, index);
  return this;
};

oFF.UiDialog.prototype.removeDialogButton = function(dialogButton) {
  let nativeDialogButton = dialogButton?.getNativeControl?.();
  this.getNativeControl().removeButton(nativeDialogButton);
  oFF.UiGeneric.prototype.removeDialogButton.call(this, dialogButton);
  return this;
};

oFF.UiDialog.prototype.clearDialogButtons = function() {
  oFF.UiGeneric.prototype.clearDialogButtons.call(this);
  this.getNativeControl().removeAllButtons();
  return this;
};

// ======================================

oFF.UiDialog.prototype.setContent = function(content) {
  oFF.UiGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content != null) {
    let childNativeControl = content.getNativeControl();
    this.getNativeControl().addContent(childNativeControl);
  }
  return this;
};

// ======================================

oFF.UiDialog.prototype.setHeaderToolbar = function(headerToolbar) {
  oFF.UiGeneric.prototype.setHeaderToolbar.call(this, headerToolbar);
  let nativeToolbar = headerToolbar?.getNativeControl?.();
  this.getNativeControl().setCustomHeader(nativeToolbar);
  return this;
};

// ======================================

oFF.UiDialog.prototype.setFooterToolbar = function(footerToolbar) {
  oFF.UiGeneric.prototype.setFooterToolbar.call(this, footerToolbar);
  let nativeToolbar = footerToolbar?.getNativeControl?.();
  this.getNativeControl().setFooter(nativeToolbar);
  return this;
};

// ======================================

oFF.UiDialog.prototype.open = function() {
  oFF.UiGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

oFF.UiDialog.prototype.close = function() {
  oFF.UiGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

oFF.UiDialog.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

oFF.UiDialog.prototype.shake = function() {
  oFF.UiGeneric.prototype.shake.call(this);
  this._shakeDialog();
  return this;
};

// ======================================

oFF.UiDialog.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setTitle(title);
  return this;
};

oFF.UiDialog.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

oFF.UiDialog.prototype.setResizable = function(resizable) {
  oFF.UiGeneric.prototype.setResizable.call(this, resizable);
  this.getNativeControl().setResizable(resizable);
  return this;
};

oFF.UiDialog.prototype.setState = function(valueState) {
  oFF.UiGeneric.prototype.setState.call(this, valueState);
  this.getNativeControl().setState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
  return this;
};

oFF.UiDialog.prototype.setShowHeader = function(showHeader) {
  oFF.UiGeneric.prototype.setShowHeader.call(this, showHeader);
  this.getNativeControl().setShowHeader(showHeader);
  return this;
};

oFF.UiDialog.prototype.isShowHeader = function() {
  return this.getNativeControl().getShowHeader();
};

// Overrides
// ======================================

oFF.UiDialog.prototype.setWidth = function(width) {
  oFF.DfUiGeneric.prototype.setWidth.call(this, width); // skip generic implementation
  var widthCss = this.calculateWidthCss();
  this.getNativeControl().setContentWidth(widthCss);
  return this;
};

oFF.UiDialog.prototype.setHeight = function(height) {
  oFF.DfUiGeneric.prototype.setHeight.call(this, height); // skip generic implementation
  var heightCss = this.calculateHeightCss();
  this.getNativeControl().setContentHeight(heightCss);
  return this;
};

oFF.UiDialog.prototype.setDraggable = function(draggable) {
  oFF.DfUiGeneric.prototype.setDraggable.call(this, draggable); // skip generic implementation
  this.getNativeControl().setDraggable(draggable);
  return this;
};

// read only!
oFF.UiDialog.prototype.getOffsetHeight = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    return this.getNativeControl().getDomRef().offsetHeight;
  }
  return 0;
};

oFF.UiDialog.prototype.getOffsetWidth = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    return this.getNativeControl().getDomRef().offsetWidth;
  }
  return 0;
};

// Control specific style and attribute handling
// ======================================

oFF.UiDialog.prototype.applyCustomCssStyling = function(element) {
  // scroll content should always have 100% (default is auto), this makes dynamic layouting better
  ui5.sap_jQuery(element).find(".sapMDialogScroll").css("height", "100%");
};

oFF.UiDialog.prototype.applyPaddingCss = function(element, paddingCss) {
  ui5.sap_jQuery(element).find(".sapMDialogScrollCont").css("padding", paddingCss);
  if (paddingCss != null) {
    // when setting padding then i need to substract twice the padding from the height so that the content perfectly fits into the window
    var dialogScrollContent = ui5.sap_jQuery(element).find(".sapMDialogScrollCont").first();
    // only do that when the sapMDialogStretchContent exists on the element since this class sets height to 100%
    if (dialogScrollContent.hasClass("sapMDialogStretchContent")) {
      ui5.sap_jQuery(element).find(".sapMDialogScrollCont").css("height", "calc(100% - 2 * " + paddingCss + ")");
    }
  }
};

oFF.UiDialog.prototype.applyMinWidthCss = function(element, minWidthCss) {
  ui5.sap_jQuery(element).find(".sapMDialogScroll").css("min-width", minWidthCss);
};

oFF.UiDialog.prototype.applyMaxWidthCss = function(element, maxWidthCss) {
  ui5.sap_jQuery(element).find(".sapMDialogScroll").css("max-width", maxWidthCss);
};

oFF.UiDialog.prototype.applyMinHeightCss = function(element, minHeightCss) {
  ui5.sap_jQuery(element).find(".sapMDialogScroll").css("min-height", minHeightCss);
};

oFF.UiDialog.prototype.applyMaxHeightCss = function(element, maxHeightCss) {
  ui5.sap_jQuery(element).find(".sapMDialogScroll").css("max-height", maxHeightCss);
};

// Helpers
// ======================================

oFF.UiDialog.prototype._shakeDialog = function() {
  if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
    var domElement = this.getNativeControl().getDomRef();
    var distance = 6;
    var duration = 80;
    var index = 0;
    ui5.sap_jQuery(domElement).css("transition", "none");
    var shakeInterval = setInterval(function() {
      index++;
      ui5.sap_jQuery(domElement).finish().animate({
        left: ["+=" + distance, "swing"]
      }, duration, function() {
        ui5.sap_jQuery(domElement).animate({
          left: ["-=" + distance, "swing"]
        }, duration, function() {
          if (index > 2) {
            clearInterval(shakeInterval);
            ui5.sap_jQuery(domElement).css("transition", "");
          }
        });
      });
    }, 40 + (duration * 2));
  }
};

oFF.UiDialog.prototype._cleanUpResizeHandler = function() {
  if (this.m_resizeEventId) {
    ui5.sap_ui_core_ResizeHandler.deregister(this.m_resizeEventId);
    this.m_resizeEventId = null;
  }
};

// Event handlers
// ======================================

oFF.UiDialog.prototype.handleResize = function(oEvent) {
  if (this.getListenerOnResize() !== null && oEvent.oldSize.width !== 0 && oEvent.oldSize.height !== 0) {
    var newWidth = oEvent.size.width;
    var newHeight = oEvent.size.height;
    const newResizeEvent = oFF.UiResizeEvent.create(this);
    newResizeEvent.setResizeData(newWidth, newHeight);
    this.getListenerOnResize().onResize(newResizeEvent);
  }
};

oFF.UiDialog.prototype.handleEscape = function() {
  if (this.getListenerOnEscape() !== null) {
    this.getListenerOnEscape().onEscape(oFF.UiControlEvent.create(this));
  }
};

class UiDialogButton extends oFF.UiButton {
  constructor() {
    super();
    this._ff_c = "UiDialogButton";
  }

  newInstance() {
    let object = new UiDialogButton();
    object.setup();
    return object;
  }

  // DialogButton inherits from Button and it has the same properties

}

oFF.UiDialogButton = UiDialogButton;

oFF.UiAlert = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiAlert";

  this.m_labelView = null;
};
oFF.UiAlert.prototype = new oFF.UiGeneric();

oFF.UiAlert.prototype.newInstance = function() {
  var object = new oFF.UiAlert();
  object.setup();
  return object;
};

oFF.UiAlert.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Dialog(this.getId(), {
    title: "",
    type: "Message",
    resizable: false,
    draggable: false,
    endButton: new ui5.sap_m_Button(this.getId() + "_closeBtn", {
      text: "Ok",
      press: function() {
        nativeControl.close();
        // dialog.destroy();
      }
    })
  });

  // add the lavel view to the alert
  this.m_labelView = new ui5.sap_m_Label(this.getId() + "_label", {
    text: "",
    textAlign: ui5.sap_ui_core_TextAlign.Center,
    wrapping: true,
    width: "100%"
  });
  nativeControl.addContent(this.m_labelView);

  this._addEvents(nativeControl);
  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiAlert.prototype._addEvents = function(nativeControl) {
  var myself = this;

  // close event
  nativeControl.attachAfterClose(function(oEvent) {
    if (myself.getListenerOnClose() !== null) {
      myself.getListenerOnClose().onClose(oFF.UiControlEvent.create(myself));
    }
  });
};

// ======================================

oFF.UiAlert.prototype.open = function() {
  oFF.UiGeneric.prototype.open.call(this);
  this.getNativeControl().open();
  return this;
};

oFF.UiAlert.prototype.close = function() {
  oFF.UiGeneric.prototype.close.call(this);
  this.getNativeControl().close();
  return this;
};

oFF.UiAlert.prototype.isOpen = function() {
  return this.getNativeControl().isOpen();
};

// ======================================

oFF.UiAlert.prototype.setTitle = function(title) {
  oFF.UiGeneric.prototype.setTitle.call(this, title);
  this.getNativeControl().setTitle(title);
  return this;
};

oFF.UiAlert.prototype.getTitle = function() {
  return this.getNativeControl().getTitle();
};

oFF.UiAlert.prototype.setText = function(text) {
  oFF.DfUiGeneric.prototype.setText.call(this, text); // skip superclass implementation
  this.m_labelView.setText(text);
  return this;
};

oFF.UiAlert.prototype.getText = function() {
  return this.m_labelView.getText();
};

oFF.UiAlert.prototype.setState = function(valueState) {
  oFF.UiGeneric.prototype.setState.call(this, valueState);
  this.getNativeControl().setState(oFF.ui.Ui5ConstantUtils.parseValueState(valueState));
  return this;
};
// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiToast = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiToast";

  this.m_isOpen = false;
};
oFF.UiToast.prototype = new oFF.UiGeneric();

oFF.UiToast.prototype.newInstance = function() {
  var object = new oFF.UiToast();
  object.setup();
  return object;
};

oFF.UiToast.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = null;

  this.setNativeControl(nativeControl);
};


// ======================================

oFF.UiToast.prototype.open = function() {
  oFF.UiGeneric.prototype.open.call(this);
  this._openToastInternal(null);
  return this;
};

oFF.UiToast.prototype.openAt = function(control) {
  oFF.UiGeneric.prototype.openAt.call(this, control);
  let nativeUi5Control = null;
  if (control != null) {
    nativeUi5Control = control.getNativeControl();
  }
  this._openToastInternal(nativeUi5Control);
  return this;
};

oFF.UiToast.prototype.isOpen = function() {
  oFF.UiGeneric.prototype.close.call(this);
  return this.m_isOpen;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiToast.prototype._openToastInternal = function(ui5control) {
  var myself = this;
  let duration = this.getDuration() > 0 ? this.getDuration() : 5000;
  const toastConfig = {
    duration: duration,
    autoClose: false,
    onClose: function() {
      myself.m_isOpen = false;
      // close event
      if (myself.getListenerOnClose() !== null) {
        myself.getListenerOnClose().onClose(oFF.UiControlEvent.create(myself));
      }
    }
  };

  if (ui5control) {
    toastConfig.of = ui5control;
    toastConfig.offset = "0 -10";
  }

  ui5.sap_m_MessageToast.show(this.getText(), toastConfig);

  this._applyBackgroundAndFontColor();

  this.m_isOpen = true;
}

oFF.UiToast.prototype._applyBackgroundAndFontColor = function() {

  var messageType = this.getMessageType();
  var bgColor = null;
  var fontColor = null;

  if (messageType && messageType !== oFF.UiMessageType.NONE) {
    // if message type set and not NONE then apply hard styling
    if (messageType === oFF.UiMessageType.ERROR) {
      bgColor = "#FFD2D2";
      fontColor = "#D8000C";
    } else if (messageType === oFF.UiMessageType.INFORMATION) {
      bgColor = "#BDE5F8";
      fontColor = "#00529B";
    } else if (messageType === oFF.UiMessageType.SUCCESS) {
      bgColor = "#DFF2BF";
      fontColor = "#4F8A10";
    } else if (messageType === oFF.UiMessageType.WARNING) {
      bgColor = "#FEEFB3";
      fontColor = "#9F6000";
    }
  } else {
    // if message type not set or NONE then use provided background and font color
    if (this.getBackgroundColor()) {
      bgColor = this.getBackgroundColor().getRgbaColor();
    }
    if (this.getFontColor()) {
      fontColor = this.getFontColor().getRgbaColor();
    }
  }

  // apply the colors if set
  if (bgColor !== null) {
    var oMessageToastDOM = ui5.sap_jQuery("#content").parent().find(".sapMMessageToast").last();
    oMessageToastDOM.css("background", bgColor);
  }

  if (fontColor !== null) {
    var oMessageToastDOM = ui5.sap_jQuery("#content").parent().find(".sapMMessageToast").last();
    oMessageToastDOM.css("color", fontColor);
  }
};

class UiPopover extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiPopover";
  }

  newInstance() {
    let object = new UiPopover();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Popover(this.getId());
    nativeControl.setShowHeader(false);
    nativeControl.setPlacement(ui5.sap_m_PlacementType.Auto);

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnBeforeOpen(listener) {
    super.registerOnBeforeOpen(listener);
    this.attachEventCallback("beforeOpen", this._handleBeforeOpen, listener);
    return this;
  }

  registerOnBeforeClose(listener) {
    super.registerOnBeforeClose(listener);
    this.attachEventCallback("beforeClose", this._handleBeforeClose, listener);
    return this;
  }

  registerOnAfterOpen(listener) {
    super.registerOnAfterOpen(listener);
    this.attachEventCallback("afterOpen", this._handleAfterOpen, listener);
    return this;
  }

  registerOnAfterClose(listener) {
    super.registerOnAfterClose(listener);
    this.attachEventCallback("afterClose", this._handleAfterClose, listener);
    return this;
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  // ======================================

  setHeader(header) {
    super.setHeader(header);
    if (header != null) {
      let nativeHeader = header.getNativeControl();
      this.getNativeControl().setCustomHeader(nativeHeader);
    } else {
      this.getNativeControl().setCustomHeader(null);
    }
    return this;
  }

  // ======================================

  setFooter(footer) {
    super.setFooter(footer);
    if (footer != null) {
      let nativeFooter = footer.getNativeControl();
      this.getNativeControl().setFooter(nativeFooter);
    } else {
      this.getNativeControl().setFooter(null);
    }
    return this;
  }

  // ======================================


  openAt(control) {
    super.openAt(control);
    if (control != null) {
      let nativeLocationControl = control.getNativeControl();
      this.getNativeControl().openBy(nativeLocationControl);
    }
    return this;
  }

  close() {
    super.close();
    this.getNativeControl().close();
    return this;
  }

  isOpen() {
    return this.getNativeControl().isOpen();
  }

  offset(offsetX, offsetY) {
    super.offset(offsetX, offsetY);
    this.getNativeControl().setOffsetX(offsetX);
    this.getNativeControl().setOffsetY(offsetY);
    return this;
  }

  // ======================================

  // Overrides
  // ======================================

  setWidth(width) {
    // no need to call the generic implementation, we have dedicated methods available on this control
    oFF.DfUiGeneric.prototype.setWidth.call(this, width); // skip generic implementation
    let widthCss = this.calculateWidthCss();
    this.getNativeControl().setContentWidth(widthCss);
    return this;
  }

  setHeight(height) {
    // no need to call the generic implementation, we have dedicated methods available on this control
    oFF.DfUiGeneric.prototype.setHeight.call(this, height); // skip generic implementation
    let heightCss = this.calculateHeightCss();
    this.getNativeControl().setContentHeight(heightCss);
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  applyCustomCssStyling(element) {
    // scroll content should always have 100% (default is not set), this makes dynamic laouting better
    ui5.sap_jQuery(element).find(".sapMPopoverScroll").css("height", "100%");
  }

  applyBackgroundColorCss(element, bgColor) {
    ui5.sap_jQuery(element).find(".sapMPopoverCont").css("background-color", bgColor);
  }

  applyPaddingCss(element, paddingCss) {
    ui5.sap_jQuery(element).find(".sapMPopoverCont").css("padding", paddingCss);
  }

  // Event handlers
  // ======================================

  _handleBeforeOpen(oEvent) {
    if (this.getListenerOnBeforeOpen() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnBeforeOpen().onBeforeOpen(ffEvent);
    }
  }

  _handleBeforeClose(oEvent) {
    if (this.getListenerOnBeforeClose() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnBeforeClose().onBeforeClose(ffEvent);
    }
  }

  _handleAfterOpen(oEvent) {
    if (this.getListenerOnAfterOpen() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnAfterOpen().onAfterOpen(ffEvent);
    }
  }

  _handleAfterClose(oEvent) {
    if (this.getListenerOnAfterClose() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnAfterClose().onAfterClose(ffEvent);
    }
  }

}

oFF.UiPopover = UiPopover;

class UiResponsivePopover extends oFF.UiPopover {
  constructor() {
    super();
    this._ff_c = "UiResponsivePopover";
  }

  newInstance() {
    let object = new UiResponsivePopover();
    object.setup();
    return object;
  }

  initializeNative() {
    oFF.UiGeneric.prototype.initializeNative.call(this); // skip superclass, different native control
    let nativeControl = new ui5.sap_m_ResponsivePopover(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ResponsivePopover inherits from Popover and it has the same properties

}

oFF.UiResponsivePopover = UiResponsivePopover;

class UiScrollContainer extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiScrollContainer";
  }

  newInstance() {
    let object = new UiScrollContainer();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_ScrollContainer(this.getId());
    nativeControl.setHorizontal(false);
    nativeControl.setVertical(true);

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  // ======================================

  scrollTo(x, y, duration) {
    super.scrollTo(x, y, duration);
    this.getNativeControl()?.scrollTo?.(x, y, duration);
    return this;
  }

  scrollToControl(control, duration) {
    super.scrollToControl(control, duration);
    if (control != null) {
      let nativeControl = control.getNativeControl();
      this.getNativeControl().scrollToElement(nativeControl, duration);
    }
    return this;
  }

  getScrollTop() {
    let nativeControl = this.getNativeControl();
    let domRef = nativeControl && nativeControl.getDomRef();
    return domRef ? domRef.scrollTop : 0;
  }

  getScrollLeft() {
    let nativeControl = this.getNativeControl();
    let domRef = nativeControl && nativeControl.getDomRef();
    return domRef ? domRef.scrollLeft : 0;
  }

  // Overrides
  // ======================================

  setHorizontalScrolling(value) {
    oFF.DfUiGeneric.prototype.setHorizontalScrolling.call(this, value); // skip superclass
    this.getNativeControl().setHorizontal(value); //different prop name
    return this;
  }

  setVerticalScrolling(value) {
    oFF.DfUiGeneric.prototype.setVerticalScrolling.call(this, value); // skip superclass
    this.getNativeControl().setVertical(value); //different prop name
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  applyCustomCssStyling(element) {
    // scroll content should always have 100% (default is auto), this makes dynamic layouting better
    ui5.sap_jQuery(element).find(".sapMScrollContScroll").css("height", "100%");
  }

  // ======================================

}

oFF.UiScrollContainer = UiScrollContainer;

oFF.UiContentWrapper = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiContentWrapper";
};
oFF.UiContentWrapper.prototype = new oFF.UiGeneric();

oFF.UiContentWrapper.prototype.newInstance = function() {
  var object = new oFF.UiContentWrapper();
  object.setup();
  return object;
};

oFF.UiContentWrapper.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new oFF.UiCtUi5ContentWrapper(this.getId());

  this.setNativeControl(nativeControl);
};

// ======================================

oFF.UiContentWrapper.prototype.setContent = function(content) {
  oFF.UiGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content != null) {
    let nativeControl = content.getNativeControl();
    this.getNativeControl().addContent(nativeControl);
  }
  return this;
};

// ======================================

oFF.UiContentWrapper.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTileContainer = function() {
   oFF.UiFlexLayout.call(this);
  this._ff_c = "UiTileContainer";
};
oFF.UiTileContainer.prototype = new oFF.UiFlexLayout();

oFF.UiTileContainer.prototype.newInstance = function() {
  var object = new oFF.UiTileContainer();
  object.setup();
  return object;
};

oFF.UiTileContainer.prototype.initializeNative = function() {
  oFF.UiFlexLayout.prototype.initializeNative.call(this);
  this.getNativeControl().setAlignContent(oFF.ui.Ui5ConstantUtils.parseFlexAlignContent(oFF.UiFlexAlignContent.START));
  this.getNativeControl().setWrap(oFF.ui.Ui5ConstantUtils.parseFlexWrap(oFF.UiFlexWrap.WRAP));
};

oFF.UiTileContainer.prototype.releaseObject = function() {
  oFF.UiFlexLayout.prototype.releaseObject.call(this);
};

// ======================================

// ======================================

// Overrides
// ======================================

oFF.UiTileContainer.prototype.handleClick = function(oEvent) {
  if (this.getListenerOnClick() != null) {
    oEvent.stopPropagation(); // if two elements overlap only fire the event on the top most one!
  }
  oFF.UiGeneric.prototype.handleClick.call(this, oEvent);
};

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTile = function() {
   oFF.UiTileBase.call(this);
  this._ff_c = "UiTile";
};
oFF.UiTile.prototype = new oFF.UiTileBase();

oFF.UiTile.prototype.newInstance = function() {
  var object = new oFF.UiTile();
  object.setup();
  return object;
};

oFF.UiTile.prototype.initializeNative = function() {
  oFF.UiTileBase.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_GenericTile(this.getId());
  nativeControl.addStyleClass("ff-tile-no-title"); // per default a tile has no title

  this.setNativeControl(nativeControl);
};

oFF.UiTile.prototype.releaseObject = function() {
  oFF.UiTileBase.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiTile.prototype.setContent = function(content) {
  oFF.UiTileBase.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllTileContent();
  if (content != null) {
    let childControl = content.getNativeControl();
    let tileContent = new ui5.sap_m_TileContent(this.getId() + "tileContent");
    tileContent.setContent(childControl);
    this.getNativeControl().addTileContent(tileContent);
  }
  return this;
};

// ======================================

oFF.UiTile.prototype.setTitle = function(title) {
  oFF.DfUiGeneric.prototype.setTitle.call(this, title); // skip superclass implementation since the property name is different
  this.getNativeControl().setHeader(title);
  this._toggleNoTitleClass();
  return this;
};

oFF.UiTile.prototype.getTitle = function() {
  return this.getNativeControl().getHeader();
};

oFF.UiTile.prototype.setSubtitle = function(subtitle) {
  oFF.DfUiGeneric.prototype.setSubtitle.call(this, subtitle); // skip superclass implementation since the property name is different
  this.getNativeControl().setSubheader(subtitle);
  return this;
};

oFF.UiTile.prototype.getSubtitle = function() {
  return this.getNativeControl().getSubheader();
};

oFF.UiTile.prototype.setLoadState = function(loadState) {
  oFF.UiTileBase.prototype.setLoadState.call(this, loadState);
  this.getNativeControl().setState(oFF.ui.Ui5ConstantUtils.parseLoadState(loadState));
  return this;
};

oFF.UiTile.prototype.getLoadState = function() {
  return oFF.UiTileBase.prototype.getLoadState.call(this);
};

oFF.UiTile.prototype.setTileMode = function(tileMode) {
  oFF.UiTileBase.prototype.setTileMode.call(this, tileMode);
  this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseTileMode(tileMode));
  return this;
};

oFF.UiTile.prototype.getTileMode = function() {
  return oFF.UiTileBase.prototype.getTileMode.call(this);
};

oFF.UiTile.prototype.setFrameType = function(frameType) {
  oFF.UiTileBase.prototype.setFrameType.call(this, frameType);
  this.getNativeControl().setFrameType(oFF.ui.Ui5ConstantUtils.parseFrameType(frameType));
  return this;
};

oFF.UiTile.prototype.getFrameType = function() {
  return oFF.UiTileBase.prototype.getFrameType.call(this);
};

oFF.UiTile.prototype.setBusy = function(busy) {
  oFF.UiTileBase.prototype.setBusy.call(this, busy);
  return this;
};

oFF.UiTile.prototype.isBusy = function() {
  return this.getNativeControl().isBusy();
};

// Overrides
// ======================================

oFF.UiTile.prototype.setTooltip = function(tooltip) {
  // Override setTooltip call with setAdditionalTooltip in order to set
  // aria-label to '<tooltip> <tile type>' and
  // title to '<tooltip>' on hover (done by UI5)
  this.getNativeControl().setAdditionalTooltip(tooltip);
  return this;
}

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiTile.prototype._toggleNoTitleClass = function() {
  //set a css class when to title present to apply special content styling (make content expand to the whole tile height)
  if (this.getTitle() && this.getTitle().length > 0) {
    this.getNativeControl().removeStyleClass("ff-tile-no-title");
  } else {
    this.getNativeControl().addStyleClass("ff-tile-no-title");
  }
};

oFF.UiBreadcrumbs = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiBreadcrumbs";
};
oFF.UiBreadcrumbs.prototype = new oFF.UiGeneric();

oFF.UiBreadcrumbs.prototype.newInstance = function() {
  var object = new oFF.UiBreadcrumbs();
  object.setup();
  return object;
};

oFF.UiBreadcrumbs.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_Breadcrumbs(this.getId());
  this.setNativeControl(nativeControl);
};
// ======================================

oFF.UiBreadcrumbs.prototype.addLink = function(link) {
  oFF.UiGeneric.prototype.addLink.call(this, link);
  var nativeLink = link.getNativeControl();
  this.getNativeControl().addLink(nativeLink);
  return this;
};

oFF.UiBreadcrumbs.prototype.insertLink = function(link, index) {
  oFF.UiGeneric.prototype.insertLink.call(this, link, index);
  var nativeLink = link.getNativeControl();
  this.getNativeControl().insertLink(nativeLink, index);
  return this;
};

oFF.UiBreadcrumbs.prototype.removeLink = function(link) {
  var nativeLink = link.getNativeControl();
  this.getNativeControl().removeLink(nativeLink);
  oFF.UiGeneric.prototype.removeLink.call(this, link);
  return this;
};

oFF.UiBreadcrumbs.prototype.clearLinks = function() {
  oFF.UiGeneric.prototype.clearLinks.call(this);
  this.getNativeControl().removeAllLinks();
  return this;
};

// ======================================

oFF.UiBreadcrumbs.prototype.setCurrentLocationText = function(text) {
  oFF.UiGeneric.prototype.setCurrentLocationText.call(this, text);
  this.getNativeControl().setCurrentLocationText(text);
  return this;
};

oFF.UiBreadcrumbs.prototype.getCurrentLocationText = function() {
  return this.getNativeControl().getCurrentLocationText();
};

oFF.UiBreadcrumbs.prototype.setSeparatorStyle = function(style) {
  oFF.UiGeneric.prototype.setSeparatorStyle.call(this, style);
  this.getNativeControl().setSeparatorStyle(oFF.ui.Ui5ConstantUtils.parseBreadcrumbsSeparatorStyle(style));
  return this;
};
// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

class UiChipContainer extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiChipContainer";
  }

  newInstance() {
    let object = new UiChipContainer();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Tokenizer(this.getId());

    this.setNativeControl(nativeControl);
  }
  // ======================================

  registerOnItemDelete(listener) {
    super.registerOnItemDelete(listener);
    this.getNativeControl().detachTokenDelete(this.handleItemDelete, this);
    if (listener) {
      this.getNativeControl().attachTokenDelete(this.handleItemDelete, this);
    }
    return this;
  };

  // ======================================

  addChip(chip) {
    super.addChip(chip);
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().addToken(nativeChip);
    }
    return this;
  }

  insertChip(chip, index) {
    super.insertChip(chip, index);
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().insertToken(nativeChip, index);
    }
    return this;
  }

  removeChip(chip) {
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().removeToken(nativeChip);
    }
    super.removeChip(chip);
    return this;
  }

  clearChips() {
    super.clearChips();
    this.getNativeControl().removeAllTokens();
    return this;
  }

  // ======================================

  handleItemDelete(oEvent) {
    if (this.getListenerOnItemDelete() !== null) {
      let nativeItem = oEvent.getParameters().tokens[0];
      let deletedItem = oFF.UiGeneric.getFfControl(nativeItem);
      const newItemEvent = oFF.UiItemEvent.create(this);
      newItemEvent.setItemData(deletedItem);
      this.getListenerOnItemDelete().onItemDelete(newItemEvent);
    }
  }

}

oFF.UiChipContainer = UiChipContainer;

class UiMultiInput extends oFF.UiInput {
  constructor() {
    super();
    this._ff_c = "UiMultiInput";
  }

  newInstance() {
    let object = new UiMultiInput();
    object.setup();
    return object;
  }

  initializeNative() {
    //super.initializeNative();
    let nativeControl = new ui5.sap_m_MultiInput(this.getId());
    nativeControl.attachTokenUpdate(this._syncFireflyChips.bind(this));

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnChipUpdate(listener) {
    super.registerOnChipUpdate(listener);
    this.attachEventCallback("tokenUpdate", this._handleOnChipUpdate, listener);
    return this;
  }

  // ======================================

  addChip(chip) {
    super.addChip(chip);
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().addToken(nativeChip);
    }
    return this;
  }

  insertChip(chip, index) {
    super.insertChip(chip, index);
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().insertToken(nativeChip, index);
    }
    return this;
  }

  removeChip(chip) {
    if (chip) {
      let nativeChip = chip.getNativeControl();
      this.getNativeControl().removeToken(nativeChip);
    }
    super.removeChip(chip);
    return this;
  }

  clearChips() {
    super.clearChips();
    this.getNativeControl().removeAllTokens();
    return this;
  }

  // ======================================

  setMaxChips(value) {
    super.removeChip(value);
    this.getNativeControl().setMaxTokens(value);
    return this;
  }

  // ======================================

  // Event Handlers
  // ======================================

  _handleOnChipUpdate(oEvent) {
    if (this.getListenerOnChipUpdate() != null) {
      const updateType = oEvent.getParameters().type;
      const addedTokens = oEvent.getParameters().addedTokens;
      const removedTokens = oEvent.getParameters().removedTokens;

      const ffEvent = oFF.ui.FfEventUtils.prepareControlUpdateEvent(this, updateType, addedTokens, removedTokens);
      this.getListenerOnChipUpdate().onChipUpdate(ffEvent);
    }
  }

  // Internal helpers
  // ======================================

  _syncFireflyChips(oEvent) {
    //TODO: this logic seems odd, does not feel right that we create chips here, remote ui will be out of sync due to that...
    //TODO: should that be moved to firefly side or maybe the listener should be responsible for creating the chips and we need to prevent the default ui5 behaviour of auto creating or removing tokens?
    const updateType = oEvent.getParameters().type;
    const addedTokens = oEvent.getParameters().addedTokens;
    const removedTokens = oEvent.getParameters().removedTokens;

    //ToDo : Make use of the enum sap.m.Tokenizer.TokenUpdateType.Added / Removed when exposed by UI5
    if (updateType === "added") {
      addedTokens?.forEach((token) => {
        let chip = oFF.UiGeneric.getFfControl(token);
        if (!chip) {
          // When user inputs text into a MultiInput, the UI5 MultiInput creates a Token.
          // Add a Chip encapsulating this token - to keep both UI5 and Firefly in sync.
          chip = this.newChip();
          chip.setText(token.getText());
          chip.setNativeControl(token);
          this.addChip(chip);
        }
      });
    } else if (updateType === "removed") {
      removedTokens?.forEach((token) => {
        let chip = oFF.UiGeneric.getFfControl(token);
        if (chip) {
          this.removeChip(chip);
        }
      });
    }
  }

}

oFF.UiMultiInput = UiMultiInput;

class UiMessageStrip extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiMessageStrip";
  }

  newInstance() {
    let object = new UiMessageStrip();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_MessageStrip(this.getId());
    nativeControl.setEnableFormattedText(true);

    this.setNativeControl(nativeControl);
  }
  // ======================================

  registerOnClose(listener) {
    super.registerOnClose(listener);
    this.attachEventCallback("close", this._handleClose, listener);
    return this;
  }

  // ======================================

  close() {
    super.close();
    this.getNativeControl().close();
    return this;
  }

  // ======================================

  setEndLink(link) {
    oFF.DfUiGeneric.prototype.setEndLink.call(this, link); // skip superclass
    const nativeLink = link ? link.getNativeControl() : null;
    this.getNativeControl().setLink(nativeLink); // different property name and incompatible type
    return this;
  }

  // ======================================
  getText() {
    return this.getNativeControl().getText();
  }

  setIcon(icon) {
    oFF.DfUiGeneric.prototype.setIcon.call(this, icon); // skip superclass
    var iconUri = oFF.UiGeneric.getUi5IconUri(icon);
    this.getNativeControl().setCustomIcon(iconUri); //different prop name
    return this;
  }

  setShowIcon(showIcon) {
    super.setShowIcon(showIcon);
    this.getNativeControl().setShowIcon(showIcon);
    return this;
  }


  setShowCloseButton(showCloseButton) {
    super.setShowCloseButton(showCloseButton);
    this.getNativeControl().setShowCloseButton(showCloseButton);
    return this;
  }

  setMessageType(messageType) {
    super.setMessageType(messageType);
    this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseMessageType(messageType));
    return this;
  }

  // ======================================

  _handleClose(oEvent) {
    if (this.getListenerOnClose() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnClose().onClose(ffEvent);
    }
  }

}

oFF.UiMessageStrip = UiMessageStrip;

oFF.UiIllustratedMessage = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiIllustratedMessage";
};
oFF.UiIllustratedMessage.prototype = new oFF.UiGeneric();

oFF.UiIllustratedMessage.prototype.newInstance = function() {
  var object = new oFF.UiIllustratedMessage();
  object.setup();
  return object;
};

oFF.UiIllustratedMessage.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  let nativeControl = new ui5.sap_m_IllustratedMessage(this.getId());
  nativeControl.setEnableFormattedText(true);

  this.setNativeControl(nativeControl);
};

oFF.UiIllustratedMessage.prototype.releaseObject = function() {
  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

// ======================================

// ======================================

oFF.UiIllustratedMessage.prototype.setTitle = function(text) {
  oFF.UiGeneric.prototype.setTitle.call(this, text);
  return this;
};

oFF.UiIllustratedMessage.prototype.getTitle = function() {
  return oFF.UiGeneric.prototype.getTitle.call(this);
};

oFF.UiIllustratedMessage.prototype.setDescription = function(description) {
  oFF.UiGeneric.prototype.setDescription.call(this, description);
  return this;
};

oFF.UiIllustratedMessage.prototype.getDescription = function() {
  return oFF.UiGeneric.prototype.getDescription.call(this);
};

oFF.UiIllustratedMessage.prototype.setIllustrationSize = function(illustrationSize) {
  oFF.UiGeneric.prototype.setIllustrationSize.call(this, illustrationSize);
  this.getNativeControl().setIllustrationSize(oFF.ui.Ui5ConstantUtils.parseIllustratedMessageSize(illustrationSize));
  return this;
};

oFF.UiIllustratedMessage.prototype.getIllustrationSize = function() {
  return oFF.UiGeneric.prototype.getIllustrationSize.call(this);
};

oFF.UiIllustratedMessage.prototype.setIllustrationType = function(illustrationType) {
  oFF.UiGeneric.prototype.setIllustrationType.call(this, illustrationType);
  this.getNativeControl().setIllustrationType(oFF.ui.Ui5ConstantUtils.parseIllustratedMessageType(illustrationType));
  return this;
};

oFF.UiIllustratedMessage.prototype.getIllustrationType = function() {
  return oFF.UiGeneric.prototype.getIllustrationType.call(this);
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

class UiMessageItem extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiMessageItem";
  }

  newInstance() {
    let object = new UiMessageItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_MessageItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setTitle(title) {
    super.setTitle(title);
    this.getNativeControl().setTitle(title);
    return this;
  }


  setSubtitle(subtitle) {
    super.setSubtitle(subtitle);
    this.getNativeControl().setSubtitle(subtitle);
    return this;
  }


  setDescription(description) {
    super.setDescription(description);
    this.getNativeControl().setDescription(description);
    return this;
  }

  setCounter(counter) {
    super.setCounter(counter);
    this.getNativeControl().setCounter(counter);
    return this;
  }

  setMessageType(messageType) {
    super.setMessageType(messageType);
    this.getNativeControl().setType(oFF.ui.Ui5ConstantUtils.parseMessageType(messageType));
    return this;
  }

  setGroupName(groupName) {
    super.setGroupName(groupName);
    this.getNativeControl().setGroupName(groupName);
    return this;
  }
}

oFF.UiMessageItem = UiMessageItem;

class UiMessageView extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiMessageView";
  }

  newInstance() {
    let object = new UiMessageView();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_MessageView(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnItemSelect(listener) {
    super.registerOnItemSelect(listener);
    this.getNativeControl().detachItemSelect(this._handleItemSelect, this);
    if (listener) {
      this.getNativeControl().attachItemSelect(this._handleItemSelect, this);
    }
    return this;
  };

  // ======================================

  addItem(item) {
    super.addItem(item);
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().addItem(nativeItem);
    }
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().insertItem(nativeItem, index);
    }
    return this;
  }

  removeItem(item) {
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().removeItem(nativeItem);
    }
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  back() {
    super.back();
    this.getNativeControl().navigateBack();
    return this;
  }

  // ======================================

  setGroupItems(groupItems) {
    super.setGroupItems(groupItems);
    this.getNativeControl().setGroupItems(groupItems);
    return this;
  }

  // ======================================

  _handleItemSelect(oEvent) {
    if (this.getListenerOnItemSelect() != null) {
      let nativeSelectedItem = oEvent?.getParameters()?.item;
      let ffSelectedItem = oFF.UiGeneric.getFfControl(nativeSelectedItem);
      const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, ffSelectedItem);
      this.getListenerOnItemSelect().onItemSelect(newItemEvent);
    }
  }

}

oFF.UiMessageView = UiMessageView;

class UiColorPicker extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiColorPicker";
  }

  newInstance() {
    let object = new UiColorPicker();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_unified_ColorPicker(this.getId());

    this.setNativeControl(nativeControl);
  }
  // ======================================

  registerOnChange(listener) {
    super.registerOnChange(listener);
    this.getNativeControl().detachChange(this.handleChange, this);
    if (listener) {
      this.getNativeControl().attachChange(this.handleChange, this);
    }
    return this;
  };

  // ======================================

  setColorString(colorString) {
    super.setColorString(colorString);
    this.getNativeControl().setColorString(colorString);
    return this;
  }

  setColorPickerDisplayMode(colorPickerDisplayMode) {
    super.setColorPickerDisplayMode(colorPickerDisplayMode);
    this.getNativeControl().setDisplayMode(oFF.ui.Ui5ConstantUtils.parseColorPickerDisplayMode(colorPickerDisplayMode));
    return this;
  }

  setColorPickerMode(colorPickerMode) {
    super.setColorPickerMode(colorPickerMode);
    this.getNativeControl().setMode(oFF.ui.Ui5ConstantUtils.parseColorPickerMode(colorPickerMode));
    return this;
  }

  // ======================================

  handleChange(oEvent) {
    if (this.getListenerOnChange() !== null) {
      let hexValue = oEvent.getParameters().hex;

      const newControlEvent = oFF.UiControlEvent.create(this);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_HEX, hexValue);
      this.getListenerOnChange().onChange(newControlEvent);
    }
  }

}

oFF.UiColorPicker = UiColorPicker;

class UiColorPalette extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiColorPalette";
  }

  newInstance() {
    let object = new UiColorPalette();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_ColorPalette(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  // ======================================

  setColorString(colorString) {
    super.setColorString(colorString);
    //setSelectedColor is available only since ui5 1.122, sac is 1.121 so make sure the method exists
    this.getNativeControl().setSelectedColor?.(colorString);
    return this;
  }

  getColorString() {
    return this.getNativeControl().getSelectedColor();
  }

  // ======================================

}

oFF.UiColorPalette = UiColorPalette;

class UiColorPalettePopover extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiColorPalettePopover";
  }

  newInstance() {
    let object = new UiColorPalettePopover();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_ColorPalettePopover(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  // ======================================

  openAt(control) {
    super.openAt(control);
    if (control != null) {
      let nativeLocationControl = control.getNativeControl();
      this.getNativeControl().openBy(nativeLocationControl);
    }
    return this;
  }

  close() {
    super.close();
    this.getNativeControl().close();
    return this;
  }

  isOpen() {
    return this.getNativeControl()?._oPopover?.isOpen() || false;
  }

  // ======================================

  setColorString(colorString) {
    super.setColorString(colorString);
    //setSelectedColor is available only since ui5 1.122, sac is 1.121 so make sure the method exists
    this.getNativeControl().setSelectedColor?.(colorString);
    if (colorString) {
      //colorString cannot be null
      this.getNativeControl().setColorPickerSelectedColor(colorString); // for some reason this needs to be excplicitly called...
    }
    return this;
  }

  getColorString() {
    //temp workaround by accessing private method, as it seems there is a bug...
    return this.getNativeControl()?._getPalette()?.getSelectedColor();
    //return this.getNativeControl().getSelectedColor();
  }

  setColorPickerDisplayMode(colorPickerDisplayMode) {
    super.setColorPickerDisplayMode(colorPickerDisplayMode);
    this.getNativeControl().setDisplayMode(oFF.ui.Ui5ConstantUtils.parseColorPickerDisplayMode(colorPickerDisplayMode));
    return this;
  }

  // ======================================

}

oFF.UiColorPalettePopover = UiColorPalettePopover;

class UiSacTableGrid extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiSacTableGrid";
  }

  newInstance() {
    let object = new UiSacTableGrid();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    // load the sactable lib if needed
    oFF.loadSacTableIfNeeded(this.getUiManager().getEnvironment().getStringByKey("ff_sactable"));
    let nativeControl = new oFF.UiCtUi5SacTableGrid(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnSelectionChange(listener) {
    super.registerOnSelectionChange(listener);
    this.attachEventCallback("onSelectionChange", this._handleSelectionChange, listener);
    return this;
  };

  registerOnButtonPress(listener) {
    super.registerOnButtonPress(listener);
    this.attachEventCallback("onDrillIconClick", this._handleDrillIconClick, listener);
    this.attachEventCallback("onCellIconClick", this._handleCellIconClick, listener);
    this.attachEventCallback("onCellLinkClick", this._handleCellLinkClick, listener);
    return this;
  };

  registerOnTableDragAndDrop(listener) {
    super.registerOnTableDragAndDrop(listener);
    this.attachEventCallback("onCellDropped", this._handleCellDropped, listener);
    this.attachEventCallback("onCellDragStart", this._handleCellDragStart, listener);
    this.attachEventCallback("onCellDragEnd", this._handleCellDragEnd, listener);
    this.attachEventCallback("onCellDragEnter", this._handleCellDragEnter, listener);
    this.attachEventCallback("onCellDragLeave", this._handleCellDragLeave, listener);
    return this;
  };

  registerOnDrop(listener) {
    super.registerOnDrop(listener);
    this.attachEventCallback("onExternalElementDropped", this._handleExternalElementDropped, listener);
    return this;
  };

  registerOnLoadFinished(listener) {
    super.registerOnLoadFinished(listener);
    this.attachEventCallback("onTableModelUpdated", this._handleTableModelUpdated, listener);
    return this;
  };

  registerOnColumnResize(listener) {
    super.registerOnColumnResize(listener);
    this.attachEventCallback("onColumnResize", this._handleColumnResize, listener);
    return this;
  };

  registerOnRowResize(listener) {
    super.registerOnRowResize(listener);
    this.attachEventCallback("onRowResize", this._handleRowResize, listener);
    return this;
  };

  // ======================================

  enableDropZones(dropZonesJson) {
    super.enableDropZones(dropZonesJson);
    this.getNativeControl()?.enableDropZones(dropZonesJson?.convertToNative());
    return this;
  }

  disableDropZones() {
    super.disableDropZones();
    this.getNativeControl()?.disableDropZones();
    return this;
  }

  selectCell(xPos, yPos, scrollIntoView) {
    super.selectCell(xPos, yPos, scrollIntoView);
    this.getNativeControl()?.selectCell(xPos, yPos, scrollIntoView);
    return this;
  }

  selectArea(xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView) {
    super.selectArea(xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView);
    this.getNativeControl()?.selectArea(xStartPos, yStartPos, xEndPos, yEndPos, scrollIntoView);
    return this;
  }

  clearSelection() {
    super.clearSelection();
    this.getNativeControl()?.clearSelection();
  }

  // ======================================

  setModelJson(jsonModel) {
    super.setModelJson(jsonModel);
    if (jsonModel) {
      var nativeJson = jsonModel.convertToNative();
      this.getNativeControl().setModelJson(nativeJson);
    } else {
      this.getNativeControl().setModelJson(null);
    }
    return this;
  }

  setNoDataText(noDataText) {
    super.setNoDataText(noDataText);
    this.getNativeControl().setNoDataText(noDataText);
    return this;
  }

  // read only!
  getOffsetHeight() {
    if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
      return this.getNativeControl().getDomRef().offsetHeight;
    }
    return super.getOffsetHeight();
  }

  getOffsetWidth() {
    if (this.getNativeControl() && this.getNativeControl().getDomRef()) {
      return this.getNativeControl().getDomRef().offsetWidth;
    }
    return super.getOffsetWidth();
  }

  // Overrides
  // ======================================

  registerOnContextMenu(listener) {
    oFF.DfUiGeneric.prototype.registerOnContextMenu.call(this, listener); // skip superclass implementation
    this.attachEventCallback("onCellContextMenu", this._handleCellContextMenu, listener); // own handling
    return this;
  };

  registerOnClick(listener) {
    oFF.DfUiGeneric.prototype.registerOnClick.call(this, listener); // skip superclass implementation
    this.attachEventCallback("onCellClick", this._handleCellClick, listener); // different event
    return this;
  };

  registerOnResize(listener) {
    // only attach the on resize listener when someone registers for that event
    if (this.getNativeControl()) {
      this.getNativeControl().attachOnResize((oEvent) => {
        if (this.getListenerOnResize() !== null) {
          let newWidth = oEvent.getParameters().width;
          let newHeight = oEvent.getParameters().height;
          const newResizeEvent = oFF.UiResizeEvent.create(this);
          newResizeEvent.setResizeData(newWidth, newHeight);
          this.getListenerOnResize().onResize(newResizeEvent);
        }
      });
    }
    return super.registerOnResize(listener);
  }

  registerOnScrollLoad(listener) {
    // only attach the on data limit reached listener when someone registers for that event
    if (this.getNativeControl()) {
      this.getNativeControl().attachOnDataLimitReached((oEvent) => {
        if (this.getListenerOnScrollLoad() !== null) {
          let scrollTop = oEvent.getParameters().scrollTop;
          let scrollLeft = oEvent.getParameters().scrollLeft;

          const newControlEvent = oFF.UiControlEvent.create(this);
          if (scrollTop != null) {
            newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SCROLL_TOP, scrollTop);
          }
          if (scrollLeft != null) {
            newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SCROLL_LEFT, scrollLeft);
          }
          this.getListenerOnScrollLoad().onScrollLoad(newControlEvent);
        }
      });
    }
    return super.registerOnScrollLoad(listener);
  }

  handleControlDragEnter(oEvent) {
    // first do the generic firefly control drag enter logic
    super.handleControlDragEnter(oEvent);

    let oDragSession = oEvent.getParameter("dragSession");
    let oDraggedControl = oDragSession.getDragControl();

    // not a ui5 drag event as control is missing (maybe file drag event or sactable)
    if (!oDraggedControl) {
      return;
    }

    if (oFF.UiDropPosition.lookup(this.getNativeDropInfo().getDropPosition()) === oFF.UiDropPosition.ON) {
      // do default stuff (all table is drop target)
    } else {
      // do sac table drag and drop handling between rows and columns
      oEvent.preventDefault(); // prevent the ui5 dragover event

      // when the draging of the control ends then disable drag drop on the table, and remove dragend event listener
      let tmpragendfunc = (event) => {
        this.getNativeControl().disableDragDrop();
        oDraggedControl.getDomRef().removeEventListener("dragend", tmpragendfunc);
      }

      oDraggedControl.getDomRef().addEventListener("dragend", tmpragendfunc); // register for control dragend event
      this.getNativeControl().enableDragDrop(oDraggedControl); // enable sac table drag drop
    }
  }

  // Control specific style and attribute handling
  // ======================================


  // ======================================

  _handleSelectionChange(oEvent) {
    if (this.getListenerOnSelectionChange() !== null) {
      let selectionArea = oEvent.getParameters().selection;
      let selectionAreaStr = JSON.stringify(selectionArea);

      const newSelectionEvent = oFF.UiSelectionEvent.create(this);
      newSelectionEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTION_AREA, selectionAreaStr);
      this.getListenerOnSelectionChange().onSelectionChange(newSelectionEvent);
    }
  }

  _handleCellClick(oEvent) {
    if (this.getListenerOnClick() !== null) {
      let cellRow = oEvent.getParameters().row;
      let cellCol = oEvent.getParameters().col;
      let selectedCell = oEvent.getParameters().selectedCell;
      let clickX = oEvent.getParameters().event.clientX;
      let clickY = oEvent.getParameters().event.clientY;
      let selectionArea = oEvent.getParameters().selectionArea;
      let selectionAreaStr = JSON.stringify(selectionArea);

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_ROW, cellRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_COLUMN, cellCol);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTED_CELL, selectedCell);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_X, clickX);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_Y, clickY);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTION_AREA, selectionAreaStr);
      this.getListenerOnClick().onClick(newControlEvent);
    }
  }

  _handleDrillIconClick(oEvent) {
    if (this.getListenerOnButtonPress() !== null) {
      let cellRow = oEvent.getParameters().row;
      let cellCol = oEvent.getParameters().col;
      let selectedCell = oEvent.getParameters().selectedCell;
      let clickX = oEvent.getParameters().event.clientX;
      let clickY = oEvent.getParameters().event.clientY;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PRESSED_BUTTON_TYPE, oFF.UiPressedButtonType.DRILL.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_ROW, cellRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_COLUMN, cellCol);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTED_CELL, selectedCell);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_X, clickX);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_Y, clickY);
      this.getListenerOnButtonPress().onButtonPress(newControlEvent);
    }
  }

  _handleCellContextMenu(oEvent) {
    if (this.getListenerOnContextMenu() !== null) {
      let cellRow = oEvent.getParameters().row;
      let cellCol = oEvent.getParameters().col;
      let isTitle = oEvent.getParameters().isTitle;
      let selectedCell = oEvent.getParameters().targetDescription;
      let clickX = oEvent.getParameters().event.clientX;
      let clickY = oEvent.getParameters().event.clientY;
      let selectionArea = oEvent.getParameters().currentSelectionAreas;
      let selectionAreaStr = JSON.stringify(selectionArea);

      if (clickX == null && clickY == null && oEvent.getParameters().event.target) {
        const keyboardTarget = oEvent.getParameters().event.target;
        const targetRect = keyboardTarget.getBoundingClientRect()
        clickX = targetRect.left + keyboardTarget.offsetWidth;
        clickY = targetRect.top + keyboardTarget.offsetHeight;
      }

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_ROW, cellRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_COLUMN, cellCol);
      newControlEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_IS_TITLE, isTitle);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTED_CELL, selectedCell);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_X, clickX);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_CLICK_Y, clickY);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_SELECTION_AREA, selectionAreaStr);
      this.getListenerOnContextMenu().onContextMenu(newControlEvent);
    }
  }

  _handleCellIconClick(oEvent) {
    if (this.getListenerOnButtonPress() !== null) {
      let cellRow = oEvent.getParameters().row;
      let cellCol = oEvent.getParameters().col;
      let className = oEvent.getParameters().className;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PRESSED_BUTTON_TYPE, oFF.UiPressedButtonType.ICON.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_ROW, cellRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_COLUMN, cellCol);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_CLASS_NAME, className);
      this.getListenerOnButtonPress().onButtonPress(newControlEvent);
    }
  }

  _handleCellLinkClick(oEvent) {
    if (this.getListenerOnButtonPress() !== null) {
      let cellRow = oEvent.getParameters().row;
      let cellCol = oEvent.getParameters().col;
      let cellHyperlinkId = oEvent.getParameters().cellHyperlinkId;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_PRESSED_BUTTON_TYPE, oFF.UiPressedButtonType.LINK.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_ROW, cellRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_COLUMN, cellCol);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_HYPERLINK_ID, cellHyperlinkId);
      this.getListenerOnButtonPress().onButtonPress(newControlEvent);
    }
  }

  _handleCellDropped(oEvent) {
    if (this.getListenerOnTableDragAndDrop() !== null) {
      let sourceRow = oEvent.getParameters().sourceRow;
      let sourceCol = oEvent.getParameters().sourceCol;
      let targetRow = oEvent.getParameters().targetRow;
      let targetCol = oEvent.getParameters().targetCol;
      let placedBeforeCell = oEvent.getParameters().placedBeforeCell;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_EVENT_TYPE, oFF.UiSacTableDragAndDropEventType.CELL_DROP.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_ROW, sourceRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_COLUMN, sourceCol);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_ROW, targetRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_COLUMN, targetCol);
      newControlEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_PLACED_BEFORE_CELL, placedBeforeCell);
      this.getListenerOnTableDragAndDrop().onTableDragAndDrop(newControlEvent);
    }
  }

  _handleCellDragStart(oEvent) {
    if (this.getListenerOnTableDragAndDrop() !== null) {
      let sourceRow = oEvent.getParameters().sourceRow;
      let sourceCol = oEvent.getParameters().sourceCol;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_EVENT_TYPE, oFF.UiSacTableDragAndDropEventType.CELL_DRAG_START.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_ROW, sourceRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_COLUMN, sourceCol);
      this.getListenerOnTableDragAndDrop().onTableDragAndDrop(newControlEvent);
    }
  }

  _handleCellDragEnd(oEvent) {
    if (this.getListenerOnTableDragAndDrop() !== null) {
      let sourceRow = oEvent.getParameters().sourceRow;
      let sourceCol = oEvent.getParameters().sourceCol;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_EVENT_TYPE, oFF.UiSacTableDragAndDropEventType.CELL_DRAG_END.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_ROW, sourceRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_SOURCE_COLUMN, sourceCol);
      this.getListenerOnTableDragAndDrop().onTableDragAndDrop(newControlEvent);
    }
  }

  _handleCellDragEnter(oEvent) {
    if (this.getListenerOnTableDragAndDrop() !== null) {
      let targetRow = oEvent.getParameters().targetRow;
      let targetCol = oEvent.getParameters().targetCol;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_EVENT_TYPE, oFF.UiSacTableDragAndDropEventType.CELL_DRAG_ENTER.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_ROW, targetRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_COLUMN, targetCol);
      this.getListenerOnTableDragAndDrop().onTableDragAndDrop(newControlEvent);
    }
  }

  _handleCellDragLeave(oEvent) {
    if (this.getListenerOnTableDragAndDrop() !== null) {
      let targetRow = oEvent.getParameters().targetRow;
      let targetCol = oEvent.getParameters().targetCol;

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putString(oFF.UiEventParams.PARAM_EVENT_TYPE, oFF.UiSacTableDragAndDropEventType.CELL_DRAG_LEAVE.getName());
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_ROW, targetRow);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_TARGET_COLUMN, targetCol);
      this.getListenerOnTableDragAndDrop().onTableDragAndDrop(newControlEvent);
    }
  }

  _handleExternalElementDropped(oEvent) {
    let draggedControl = oEvent.getParameters().externalData;
    let droppedControl = this.getNativeControl();
    let dropPosStr = oEvent.getParameters().placedBeforeCell ? "Before" : "After";
    let targetRow = oEvent.getParameters().targetRow;
    let targetCol = oEvent.getParameters().targetCol;

    let newParameters = oFF.XProperties.create();
    newParameters.putInteger(oFF.UiEventParams.PARAM_TARGET_ROW, targetRow);
    newParameters.putInteger(oFF.UiEventParams.PARAM_TARGET_COLUMN, targetCol);

    this._fireOnDropEventIfPossible(draggedControl, droppedControl, dropPosStr, newParameters); //WARNING: temp access of private method from UxGeneric
  }

  _handleTableModelUpdated(oEvent) {
    if (this.getListenerOnLoadFinished() !== null) {
      this.getListenerOnLoadFinished().onLoadFinished(oFF.UiControlEvent.create(this));
    }
  }

  _handleColumnResize(oEvent) {
    if (this.getListenerOnColumnResize() !== null) {
      let newSizesStr = JSON.stringify(oEvent.getParameters().newSizes);

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_NEW_SIZES, newSizesStr);
      this.getListenerOnColumnResize().onColumnResize(newControlEvent);
    }
  }

  _handleRowResize(oEvent) {
    if (this.getListenerOnRowResize() !== null) {
      let newSizesStr = JSON.stringify(oEvent.getParameters().newSizes);

      const newControlEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      newControlEvent.getProperties().putInteger(oFF.UiEventParams.PARAM_NEW_SIZES, newSizesStr);
      this.getListenerOnRowResize().onRowResize(newControlEvent);
    }
  }

}

oFF.UiSacTableGrid = UiSacTableGrid;

class UiHighChart extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiHighChart";
  }

  newInstance() {
    let object = new UiHighChart();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    // load the highcharts lib if needed
    oFF.loadHighchartsIfNeeded(this.getUiManager().getEnvironment().getStringByKey("ff_highcharts"));
    let nativeControl = new oFF.UiCtUi5Highcharts(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnPress(listener) {
    super.registerOnPress(listener);
    this.attachEventCallback("onPress", this._handlePress, listener);
    return this;
  }

  // ======================================

  setModelJson(jsonModel) {
    super.setModelJson(jsonModel);
    if (jsonModel) {
      let nativeJson = jsonModel.convertToNative();
      this.getNativeControl().setOptions(nativeJson);
    } else {
      this.getNativeControl().setOptions(null);
    }
    return this;
  }

  setDataManifest(dataManifest) {
    super.setDataManifest(dataManifest);
    if (dataManifest) {
      let nativeJson = dataManifest.convertToNative();
      this.getNativeControl().setDataManifest(nativeJson);
    } else {
      this.getNativeControl().setDataManifest(null);
    }
    return this;
  }

  setModelJson(jsonModel) {
    super.setModelJson(jsonModel);
    if (jsonModel) {
      let nativeJson = jsonModel.convertToNative();
      this.getNativeControl().setOptions(nativeJson);
    } else {
      this.getNativeControl().setOptions(null);
    }
    return this;
  }

  setText(text) {
    super.setText(text);
    this.getNativeControl()?.setChartTitle(text);
    return this;
  }

  // Overrides
  // ======================================

  registerOnContextMenu(listener) {
    oFF.DfUiGeneric.prototype.registerOnContextMenu.call(this, listener); // skip superclass implementation
    this.attachEventCallback("onContextMenu", this._handleChartContextMenu, listener); // extra event data
    return this;
  }

  registerOnClick(listener) {
    oFF.DfUiGeneric.prototype.registerOnClick.call(this, listener); // skip superclass implementation
    this.attachEventCallback("onClick", this._handleChartClick, listener); // extra event data
    return this;
  }

  // Control specific style and attribute handling
  // ======================================

  applyCornerRadiusCss(element, cornerRadiusCss) {
    super.applyCornerRadiusCss(element, cornerRadiusCss);
    // for HighCharts additionally the overflow needs to be set to hidden
    element.style.overflow = "hidden";
  }

  // ======================================

  _handleChartContextMenu(oEvent) {
    if (this.getListenerOnContextMenu() !== null) {
      this.getListenerOnContextMenu().onContextMenu(this._preapreChartControlEvent(oEvent));
    }
  }

  _handleChartClick(oEvent) {
    if (this.getListenerOnClick() !== null) {
      this.getListenerOnClick().onClick(this._preapreChartControlEvent(oEvent));
    }
  }

  _handlePress(oEvent) {
    if (this.getListenerOnPress() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlPointerEvent(this, oEvent);
      this.getListenerOnPress().onPress(ffEvent);
    }
  }

  _preapreChartControlEvent(oEvent) {
    const ffEvent = oFF.ui.FfEventUtils.prepareControlPointerEvent(this, oEvent);
    const chartContextStr = JSON.stringify(oEvent.getParameters().context);
    const scrollInformation = JSON.stringify(oEvent.getParameters().scrollInformation);
    const shiftPressed = oEvent.getParameters().event.shiftKey;
    const ctrlPressed = oEvent.getParameters().event.ctrlKey;
    const altPressed = oEvent.getParameters().event.altKey;
    ffEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_SHIFT_PRESSED, shiftPressed);
    ffEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_ALT_PRESSED, altPressed);
    ffEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_CTRL_PRESSED, ctrlPressed);
    ffEvent.getProperties().putString(oFF.UiEventParams.PARAM_CONTEXT, chartContextStr);
    ffEvent.getProperties().putString(oFF.UiEventParams.PARAM_SCROLL_INFORMATION, scrollInformation);
    return ffEvent;
  }

}

oFF.UiHighChart = UiHighChart;

class UiSpacer extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiSpacer";
  }

  newInstance() {
    let object = new UiSpacer();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_ToolbarSpacer(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

}

oFF.UiSpacer = UiSpacer;

oFF.UiSeparator = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiSeparator";
};
oFF.UiSeparator.prototype = new oFF.UiGeneric();

oFF.UiSeparator.prototype.newInstance = function() {
  var object = new oFF.UiSeparator();
  object.setup();
  return object;
};

oFF.UiSeparator.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = new ui5.sap_m_ToolbarSeparator(this.getId());

  this.setNativeControl(nativeControl);
};

class UiInvisibleText extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiInvisibleText";
  }

  newInstance() {
    let object = new UiInvisibleText();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_ui_core_InvisibleText(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setText(text) {
    super.setText(text);
    this.getNativeControl().setText(text);
    return this;
  }

}

oFF.UiInvisibleText = UiInvisibleText;

class UiSidePanelItem extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiSidePanelItem";
  }

  newInstance() {
    let object = new UiSidePanelItem();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_f_SidePanelItem(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addContent(childControl);
    }
    return this;
  }

  clearContent() {
    super.clearContent();
    this.getNativeControl().removeAllContent();
    return this;
  }

  // ======================================

}

oFF.UiSidePanelItem = UiSidePanelItem;

class UiSidePanel extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiSidePanel";
  }

  newInstance() {
    let object = new UiSidePanel();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_f_SidePanel(this.getId());

    // temp fix for FPA104-4955, to be removed as soon as sac uses ui5 1.121+ or the patch has been ported to 1.120.x and consumed by sac
    if (!!sap?.ui?.version?.includes("1.120.")) {
      nativeControl.onBeforeRendering = () => {
        ui5.sap_f_SidePanel.prototype.onBeforeRendering.call(nativeControl);
        if (nativeControl._isSingleItem()) {
          const bActionBarExpanded = nativeControl.getActionBarExpanded();
          const oSelectedItem = bActionBarExpanded ? nativeControl.getItems()[0] : null;
          nativeControl.setProperty("sideContentExpanded", bActionBarExpanded);
          nativeControl.setAssociation("selectedItem", oSelectedItem, true);
        }
      };
      nativeControl._setSideContentExpanded = (bState) => {
        nativeControl._isSingleItem() && nativeControl.setActionBarExpanded(bState);
        return ui5.sap_f_SidePanel.prototype._setSideContentExpanded.call(nativeControl, bState);
      };
    }
    // End of 1.120.x SidePanel Workaround

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnToggle(listener) {
    super.registerOnToggle(listener);
    this.attachEventCallback("toggle", this._handleToggle, listener);
    return this;
  }

  // ======================================

  setContent(content) {
    super.setContent(content);
    this.getNativeControl().removeAllMainContent();
    if (content != null) {
      let childControl = content.getNativeControl();
      this.getNativeControl().addMainContent(childControl);
    }
    return this;
  }


  clearContent() {
    super.clearContent();
    this.getNativeControl().removeAllMainContent();
    return this;
  }

  // ======================================

  addItem(item) {
    super.addItem(item);
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().addItem(nativeItem);
    }
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().insertItem(nativeItem, index);
    }
    return this;
  }

  removeItem(item) {
    if (item) {
      const nativeItem = item.getNativeControl();
      this.getNativeControl().removeItem(nativeItem);
    }
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  setSelectedItem(item) {
    super.setSelectedItem(item);
    const nativeItem = item?.getNativeControl();
    this.getNativeControl().setSelectedItem(nativeItem);
    return this;
  }

  getSelectedItem() {
    const selectedItemId = this.getNativeControl()?.getSelectedItem?.();
    const selectedItem = this.getItemById(selectedItemId);
    return selectedItem;
  }

  // ======================================

  setSidePanelPosition(value) {
    super.setSidePanelPosition(value);
    this.getNativeControl().setSidePanelPosition(oFF.ui.Ui5ConstantUtils.parseSidePanelPosition(value));
    return this;
  }

  getSidePanelPosition() {
    return super.getSidePanelPosition();
  }

  // Overrides
  // ======================================

  setExpanded(value) {
    oFF.DfUiGeneric.prototype.setExpanded.call(this, value); // skip superclass
    this.getNativeControl().setActionBarExpanded(value); //different prop name
    return this;
  }

  isExpanded() {
    return this.getNativeControl().getActionBarExpanded(); // needs live value
  }

  setResizable(value) {
    oFF.DfUiGeneric.prototype.setResizable.call(this, value); // skip superclass
    this.getNativeControl().setSidePanelResizable(value); //different prop name
    return this;
  }

  isResizable() {
    return this.getNativeControl().getSidePanelResizable();
  }

  // ======================================

  _handleToggle(oEvent) {
    if (this.getListenerOnToggle() != null) {
      let isExpanded = oEvent?.getParameters()?.expanded;
      let nativeItem = oEvent?.getParameters()?.item;
      let ffItem = oFF.UiGeneric.getFfControl(nativeItem);
      const newItemEvent = oFF.ui.FfEventUtils.prepareItemEvent(this, ffItem);
      newItemEvent.getProperties().putBoolean(oFF.UiEventParams.PARAM_EXPANDED, isExpanded);
      this.getListenerOnToggle().onToggle(newItemEvent);
    }
  }

}

oFF.UiSidePanel = UiSidePanel;

class UiGridContainer extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiGridContainer";
  }

  newInstance() {
    let object = new UiGridContainer();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_f_GridContainer(this.getId());

    this.setNativeControl(nativeControl);
  }
  // ======================================

  // ======================================

  addItem(item) {
    super.addItem(item);
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().addItem(nativeItem);
    }
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().insertItem(nativeItem, index);
    }
    return this;
  }

  removeItem(item) {
    if (item) {
      let nativeItem = item.getNativeControl();
      this.getNativeControl().removeItem(nativeItem);
    }
    super.removeItem(item);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllItems();
    return this;
  }

  // ======================================

  focusIndex(index) {
    super.focusIndex(index);
    this.getNativeControl().focusItem(index);
    return this;
  }

  // ======================================

  setGridContainerSettings(gridContainerSettings) {
    super.setGridContainerSettings(gridContainerSettings);
    this.getNativeControl().setLayout(oFF.ui.Ui5ObjectUtils.createNativeGridContainerSettings(gridContainerSettings));
    return this;
  }

  // Overrides, use the specific grid drop info
  // ======================================

  getDropInfoClass() {
    return ui5.sap_f_dnd_GridDropInfo;
  };

  // ======================================

}

oFF.UiGridContainer = UiGridContainer;

class UiCarousel extends oFF.UiGeneric {
  constructor() {
    super();
    this._ff_c = "UiCarousel";
  }

  newInstance() {
    let object = new UiCarousel();
    object.setup();
    return object;
  }

  initializeNative() {
    super.initializeNative();
    let nativeControl = new ui5.sap_m_Carousel(this.getId());

    this.setNativeControl(nativeControl);
  }

  // ======================================

  registerOnBeforePageChanged(listener) {
    super.registerOnBeforePageChanged(listener);
    this.attachEventCallback("beforePageChanged", this._handleBeforePageChanged, listener);
    return this;
  };

  registerOnPageChanged(listener) {
    super.registerOnPageChanged(listener);
    this.attachEventCallback("pageChanged", this._handlePageChanged, listener);
    return this;
  };

  // ======================================

  addItem(item) {
    super.addItem(item);
    let nativeItem = item?.getNativeControl?.();
    this.getNativeControl().addPage(nativeItem);
    return this;
  }

  insertItem(item, index) {
    super.insertItem(item, index);
    let nativeItem = item?.getNativeControl?.();
    this.getNativeControl().insertPage(nativeItem);
    return this;
  }

  removeItem(item) {
    super.removeItem(item);
    let nativeItem = item?.getNativeControl?.();
    this.getNativeControl().removePage(nativeItem);
    return this;
  }

  clearItems() {
    super.clearItems();
    this.getNativeControl().removeAllPages();
    return this;
  }

  // ======================================

  //TDOD: this should be rename to selectedItems the same as tabbar, to make sure it matches the aggregation
  setActivePage(item) {
    super.setActivePage(item);
    let nativeItem = item?.getNativeControl?.();
    this.getNativeControl().setActivePage(nativeItem); // can be the id or the item itself
    return this;
  }

  getActivePage() {
    let itemId = this.getNativeControl().getActivePage(); // this method returns the id as string!!!
    let ffItem = this.getItemById(itemId);
    return ffItem;
  }

  // ======================================

  _handleBeforePageChanged(oEvent) {
    if (this.getListenerOnBeforePageChanged() !== null) {
      const ffEvent = oFF.ui.FfEventUtils.prepareControlEvent(this, oEvent);
      this.getListenerOnBeforePageChanged().onBeforePageChanged(ffEvent);
    }
  }

  _handlePageChanged(oEvent) {
    if (this.getListenerOnPageChanged() !== null) {
      let oldControl = null;
      let newControl = null;

      const eventParams = oEvent.getParameters();

      if (eventParams.oldActivePageId) {
        oldControl = this.getItemById(eventParams.oldActivePageId);
      }

      if (eventParams.newActivePageId) {
        newControl = this.getItemById(eventParams.newActivePageId);
      }

      const ffEvent = oFF.ui.FfEventUtils.prepareControlChangeEvent(this, oldControl, newControl);
      this.getListenerOnPageChanged().onPageChanged(ffEvent);
    }
  }

}

oFF.UiCarousel = UiCarousel;

oFF.UiRoot = function() {
   oFF.UiGeneric.call(this);
  this._ff_c = "UiRoot";
};
oFF.UiRoot.prototype = new oFF.UiGeneric();

oFF.UiRoot.prototype.newInstance = function() {
  var object = new oFF.UiRoot();
  object.setup();
  return object;
};

oFF.UiRoot.prototype.initializeNative = function() {
  oFF.UiGeneric.prototype.initializeNative.call(this);
  var nativeControl = null;

  // if the custom XtUi5ContentWrapper control available then use that
  // has same content methods as sap.m.Page
  if (oFF.UiCtUi5ContentWrapper) {
    nativeControl = new oFF.UiCtUi5ContentWrapper(this.getId(), {
      width: "100%",
      height: "100%",
      position: "absolute"
    });
  } else {
    // use sap.m.Page as a fallback when XtUi5ContentWrapper is missing
    nativeControl = new ui5.sap_m_Page(this.getId(), {
      enableScrolling: false,
      showFooter: false,
      showHeader: false,
      showSubHeader: false
    });
  }

  this.setNativeControl(nativeControl);
};

oFF.UiRoot.prototype.releaseObject = function() {
  this._cleanUiAreaIfNecessary(this.m_nativeAnchroId);

  oFF.UiGeneric.prototype.releaseObject.call(this);
};

// ======================================

oFF.UiRoot.prototype.renderIntoAnchor = function(nativeAnchorId, nativeAnchorObject) {
  oFF.UiGeneric.prototype.renderIntoAnchor.call(this, nativeAnchorId, nativeAnchorObject);

  //render the root proxy element
  if (nativeAnchorObject !== null) {
    if (nativeAnchorObject.addContent) {
      nativeAnchorObject.removeAllContent();
      nativeAnchorObject.addContent(this.getNativeControl());
    } else if (nativeAnchorObject instanceof HTMLElement) {
      this._placeAtDomElement(nativeAnchorObject);
    } else {
      oFF.ui.Log.logCritical("UiRoot rendering error!");
      oFF.ui.Log.logError("The specified native parent object is not supported and cannot be used as root! Make sure the content aggregation exists on the specified control!");
    }
  } else if (nativeAnchorId !== null) {
    if (window) {
      var domElement = window.document.getElementById(nativeAnchorId);
      if (domElement) {
        this.m_nativeAnchroId = nativeAnchorId;
        this._placeAtDomElement(domElement);
      } else {
        oFF.ui.Log.logCritical("UiRoot rendering error!");
        oFF.ui.Log.logError("Element with id " + nativeAnchorId + " does not exist in DOM. Cannot render UI. Make sure that the specified element id is defined in the HTML DOM.");
      }
    } else {
      oFF.ui.Log.logCritical("UiRoot rendering error!");
      oFF.ui.Log.logError("Missing window object!");
    }
  } else {
    oFF.ui.Log.logCritical("UiRoot rendering error!");
    oFF.ui.Log.logError("No native anchor id or anchor object specified! Cannot render UI!");
  }
};

// ======================================

oFF.UiRoot.prototype.setContent = function(content) {
  oFF.UiGeneric.prototype.setContent.call(this, content);
  this.getNativeControl().removeAllContent();
  if (content != null) {
    let childControl = content.getNativeControl();
    this.getNativeControl().addContent(childControl);
  }
  return this;
};

// ======================================

oFF.UiRoot.prototype.setText = function(text) {
  oFF.DfUiGeneric.prototype.setText.call(this, text); // skip superclass implementation since the property name is different
  document.title = value;
  return this;
};

oFF.UiRoot.prototype.getText = function() {
  return document.title;
};

// Overrides
// ======================================

// Control specific style and attribute handling
// ======================================

// Helpers
// ======================================

oFF.UiRoot.prototype._placeAtDomElement = function(domElement) {
  if (domElement) {
    domElement.innerHTML = ""; // clear the container content
    this.getNativeControl().placeAt(domElement);
  }
};

oFF.UiRoot.prototype._cleanUiAreaIfNecessary = function(areaId) {
  if (areaId) {
    if (ui5.sap_ui_core_UIArea) {
      let tmpUiArea = ui5.sap_ui_core_UIArea.registry.get(areaId);
      if (tmpUiArea) {
        tmpUiArea.removeAllContent();
      }
    }
  }
};

class NativeUiFramework extends oFF.DfUiFramework {
  constructor() {
    super();
    this._ff_c = "NativeUiFramework";
  }

  static staticSetupNative() {
    oFF.UiFramework.setInstance(new NativeUiFramework());
  }

  // ======================================

  getThemeParameter(paramName) {
    try {
      return ui5.sap_ui_core_theming_Parameters.get(paramName);
    } catch (error) {
      this._logError("Failed to get theme paramater!");
      return null;
    }
  }

  getThemeParameterAsync(paramName) {
    try {
      return this._resolveWithResult(this.getThemeParameter(paramName));
    } catch (error) {
      this._logError("Failed to get theme paramater async!");
      return this._rejectWithError(error.message);
    }
  }

  announce(message, mode) {
    try {
      ui5.sap_ui_core_InvisibleMessage.getInstance().announce(message, oFF.ui.Ui5ConstantUtils.parseAriaLiveMode(mode));
    } catch (error) {
      this._logError("Failed to announce!");
    }
  }

  writeTextToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
    } catch (error) {
      this._logError("Could not access browser clipboard!");
    }
  }

  openUrl(url, target) {
    try {
      window.open(url, target);
    } catch (error) {
      this._logError(`Could not open the specified url ${url}!`);
    }
  }

  setTheme(themeName, themeBaseUrl) {
    try {
      if (ui5.sap_ui_core_Theming) {
        ui5.sap_ui_core_Theming.setTheme(themeName, themeBaseUrl ? themeBaseUrl : undefined);
      } else if (ui5.sap_ui_core_Core) {
        ui5.sap_ui_core_Core.applyTheme(themeName, themeBaseUrl ? themeBaseUrl : undefined);
      }
    } catch (error) {
      this._logError("Failed to set theme!");
    }
  }

  getTheme() {
    try {
      if (ui5.sap_ui_core_Theming) {
        return this._resolveWithResult(ui5.sap_ui_core_Theming.getTheme());
      } else if (ui5.sap_ui_core_Configuration) {
        return this._resolveWithResult(ui5.sap_ui_core_Configuration.getTheme());
      }
    } catch (error) {
      this._logError("Failed to get current theme!");
      return this._rejectWithError(error.message);
    }
  }

  calculateTextWidth(text, fontCss) {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = fontCss || getComputedStyle(document.body).font;
      return context.measureText(text).width;
    } catch (error) {
      this._logError("Failed to calculate text width!");
      return 0;
    }
  }

  calculateTextWidthAsync(text, fontCss) {
    try {
      return this._resolveWithResult(oFF.XDoubleValue.create(this.calculateTextWidth(text, fontCss)));
    } catch (error) {
      this._logError("Failed to calculate text width!");
      return this._rejectWithError(error.message);
    }
  }

  getAvailableThirdPartyLibraries() {
    try {
      let ffStruct = oFF.PrFactory.createStructure();
      if (oFF.ui.Config.getHighchartsLib()) {
        ffStruct.putString("highcharts", oFF.ui.Config.getHighchartsLib().version);
      }
      if (oFF.ui.Config.getInteractLib()) {
        ffStruct.putString("interactjs", oFF.ui.Config.getInteractLib().version);
      }
      return this._resolveWithResult(ffStruct);
    } catch (error) {
      this._logError("Failed to get available third party libraries!");
      return this._rejectWithError(error.message);
    }
  }

  getViewportSize() {
    try {
      let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      return this._resolveWithResult(oFF.UiSize.create(vw, vh));
    } catch (error) {
      this._logError("Failed to get viewport size!");
      return this._rejectWithError(error.message);
    }
  }

  saveContent(ffContent, contentName) {
    try {
      if (ffContent) {
        let fileName = contentName || "download.txt";
        let contentType = ffContent.getContentType() != null ? ffContent.getContentType().getMimeType() : "text/plain";
        const tmpATag = document.createElement("a");
        tmpATag.href = URL.createObjectURL(
          new Blob([ffContent.getString()], {
            type: contentType
          })
        );
        tmpATag.setAttribute("download", fileName);
        document.body.appendChild(tmpATag);
        tmpATag.click();
        document.body.removeChild(tmpATag);
      }
    } catch (error) {
      this._logError("Failed to save content!");
    }
  }

  // ======================================

  _logError(errorMsg) {
    console.error(`[FF NativeUiFramework] ${errorMsg}`);
  }

  _resolveWithResult(result) {
    return oFF.XPromise.resolve(result);
  }

  _rejectWithError(errorMsg) {
    return oFF.XPromise.reject(oFF.XError.create(errorMsg));
  }

}

oFF.NativeUiFramework = NativeUiFramework;

class NativeUiDevice {
  constructor() {
    this._ff_c = "NativeUiDevice";
  }

  static staticSetupNative() {
    oFF.UiDevice.setInstance(new NativeUiDevice());
  }

  getDeviceType() {
    try {
      //TODO needs logic to detect between mobile, tablet and dekstop
      return this._resolveWithResult(oFF.UiDeviceType.DESKTOP);
    } catch (error) {
      this._logError("Failed to get device type!");
      return null;
    }
  }

  getScreenSize() {
    try {
      let screenWidth = window.screen.width;
      let screenHeight = window.screen.height;
      return this._resolveWithResult(oFF.UiSize.create(screenWidth, screenHeight));
    } catch (error) {
      this._logError("Failed to get screen size!");
      return this._rejectWithError(error.message);
    }
  }


  // ======================================

  _logError(errorMsg) {
    console.error(`[FF NativeUiDevice] ${errorMsg}`);
  }

  _resolveWithResult(result) {
    return oFF.XPromise.resolve(result);
  }

  _rejectWithError(errorMsg) {
    return oFF.XPromise.reject(oFF.XError.create(errorMsg));
  }

}

oFF.NativeUiDevice = NativeUiDevice;

oFF.NativeUiManager = function() {
   oFF.DfUiManager.call(this);
  this._ff_c = "NativeUiManager";
};
oFF.NativeUiManager.prototype = new oFF.DfUiManager();

oFF.NativeUiManager.create = function(session) {
   var newObject = new oFF.NativeUiManager();
  newObject.setupSessionContext(session);
  return newObject;
};

oFF.NativeUiManager.prototype.releaseObject = function() {
  oFF.DfUiManager.prototype.releaseObject.call(this);
};

oFF.NativeUiManager.prototype.setupSessionContext = function(session) {
  oFF.DfUiManager.prototype.setupSessionContext.call(this, session);
  this.setDeviceInfo(this._createDeviceInfo());
  this.setDriverInfo(this._createDriverInfo());
  //jQuery.sap.log.setLevel(jQuery.sap.log.Level.ALL); // set log level to ALL to see sapui5 and ui.native debugging information
};

// ======================================

oFF.NativeUiManager.prototype.getPlatform = function() {
  return oFF.XPlatform.UI5;
};

// ======================================

oFF.NativeUiManager.prototype.setRtl = function(enableRtl) {
  oFF.DfUiManager.prototype.setRtl.call(this, enableRtl);
  ui5.sap_base_Localization.setRTL(enableRtl);

};

oFF.NativeUiManager.prototype.isRtl = function() {
  if (ui5.sap_base_Localization) {
    return ui5.sap_base_Localization.getRTL();
  }
  return false;
};

oFF.NativeUiManager.prototype.setCalendarType = function(calendarType) {
  oFF.DfUiManager.prototype.setCalendarType.call(this, calendarType);
  ui5.sap_base_Formatting.setCalendarType(oFF.ui.Ui5ConstantUtils.parseCalendarType(calendarType));

};

oFF.NativeUiManager.prototype.getCalendarType = function() {
  if (ui5.sap_base_Formatting) {
    return oFF.UiCalendarType.lookup(ui5.sap_base_Formatting.getCalendarType());
  }
};

//helpers
// ======================================

oFF.NativeUiManager.prototype._createDeviceInfo = function() {
  let userAgent = window.navigator.userAgent;
  let platform = window.navigator.platform;
  let environment = oFF.UiDeviceEnvironment.BROWSER;
  let framework = oFF.UiDeviceFramework.UI5;
  let width = window.screen.width;
  let height = window.screen.height;
  let scale = window.devicePixelRatio;
  let maxTouchPoints = window.navigator.maxTouchPoints;

  return oFF.UiDeviceInfo.createWithUserAgentAndPlatform(userAgent, platform, environment, framework, height, width, scale, maxTouchPoints);
};

oFF.NativeUiManager.prototype._createDriverInfo = function() {
  const clientFramework = "SAPUI5";
  const clientFrameworkVersion = "loading..."
  const clientLang = window && window.navigator ? window.navigator.language : "unknown";
  const iconCollections = this._getIconCollections();
  const allIconNames = this._getAllIconNames();

  const driverInfo = oFF.UiDriverInfo.create(clientFramework, clientFrameworkVersion, clientLang, iconCollections, allIconNames);
  oFF.ui.FFUi5Preloader.load().then(() =>ui5.sap_ui_VersionInfo.load().then(vi=>driverInfo.setFrameworkVersion(vi.version)));
  return driverInfo;
};

oFF.NativeUiManager.prototype._getIconCollections = function() {
  if (ui5.sap_ui_core_IconPool) {
    const nativeIconCollections = ui5.sap_ui_core_IconPool.getIconCollectionNames();
    const ffIconCollectionList = oFF.XList.create();
    nativeIconCollections.forEach((item, i) => {
      ffIconCollectionList.add(item);
    });
    return ffIconCollectionList;
  }
  return oFF.XList.create();
};

oFF.NativeUiManager.prototype._getAllIconNames = function() {
  if (ui5.sap_ui_core_IconPool) {
    const nativeIconCollections = ui5.sap_ui_core_IconPool.getIconCollectionNames();
    const ffIconNameList = oFF.XList.create();
    nativeIconCollections.forEach((item, i) => {
      const nativeIconNames = ui5.sap_ui_core_IconPool.getIconNames(item);
      const prefix = item !== "undefined" ? `${item}/` : "";
      nativeIconNames.forEach((icon, i) => {
        ffIconNameList.add(`${prefix}${icon}`);
      });
    });
    return ffIconNameList;
  }
  return oFF.XList.create();
};

oFF.NativeUiManagerFactory = function() {
   oFF.UiManagerFactory.call(this);
  this._ff_c = "NativeUiManagerFactory";
};
oFF.NativeUiManagerFactory.prototype = new oFF.UiManagerFactory();

oFF.NativeUiManagerFactory.staticSetupNative = function() {
   var newObject = new oFF.NativeUiManagerFactory();
  oFF.UiManagerFactory.registerFactory(newObject);
};

oFF.NativeUiManagerFactory.prototype.newUiManagerInstance = function(process) {
  var nativeUiManager = oFF.NativeUiManager.create(process);
  return nativeUiManager;
};

oFF.UiDriverModule = function() {
   oFF.DfModule.call(this);
  this._ff_c = "UiDriverModule";
};
oFF.UiDriverModule.prototype = new oFF.DfModule();

oFF.UiDriverModule.s_module = null;

oFF.UiDriverModule.getInstance = function() {
   if (oFF.UiDriverModule.s_module === null) {
    if (oFF.UiModule.getInstance() === null) {
      throw oFF.XException.createInitializationException();
    }

    oFF.UiDriverModule.s_module = oFF.DfModule.startExt(new oFF.UiDriverModule());

    oFF.XPlatform.setPlatform(oFF.XPlatform.UI5);

    oFF.NativeUiFramework.staticSetupNative();
    oFF.NativeUiDevice.staticSetupNative();

    let setControlFactory = oFF.UiDriverModule._setControlFactory;

    setControlFactory(oFF.UiType.BUTTON, oFF.UiButton);
    setControlFactory(oFF.UiType.TOGGLE_BUTTON, oFF.UiToggleButton);
    setControlFactory(oFF.UiType.MENU_BUTTON, oFF.UiMenuButton);
    setControlFactory(oFF.UiType.OVERFLOW_BUTTON, oFF.UiOverflowButton);
    setControlFactory(oFF.UiType.OVERFLOW_TOGGLE_BUTTON, oFF.UiOverflowToggleButton);
    setControlFactory(oFF.UiType.CHECKBOX, oFF.UiCheckbox);
    setControlFactory(oFF.UiType.SWITCH, oFF.UiSwitch);
    setControlFactory(oFF.UiType.INPUT, oFF.UiInput);
    setControlFactory(oFF.UiType.SEARCH_FIELD, oFF.UiSearchField);
    setControlFactory(oFF.UiType.IMAGE, oFF.UiImage);
    setControlFactory(oFF.UiType.ICON, oFF.UiIcon);
    setControlFactory(oFF.UiType.AVATAR, oFF.UiAvatar);
    setControlFactory(oFF.UiType.SLIDER, oFF.UiSlider);
    setControlFactory(oFF.UiType.RANGE_SLIDER, oFF.UiRangeSlider);
    setControlFactory(oFF.UiType.RADIO_BUTTON, oFF.UiRadioButton);
    setControlFactory(oFF.UiType.LINK, oFF.UiLink);
    setControlFactory(oFF.UiType.CHIP, oFF.UiChip);

    setControlFactory(oFF.UiType.SUGGESTION_ITEM, oFF.UiSuggestionItem);

    setControlFactory(oFF.UiType.ICON_TAB_BAR, oFF.UiIconTabBar);
    setControlFactory(oFF.UiType.ICON_TAB_BAR_ITEM, oFF.UiIconTabBarItem);
    setControlFactory(oFF.UiType.TAB_BAR, oFF.UiTabBar);
    setControlFactory(oFF.UiType.TAB_BAR_ITEM, oFF.UiTabBarItem);
    setControlFactory(oFF.UiType.DROPDOWN, oFF.UiDropDown);
    setControlFactory(oFF.UiType.DROPDOWN_ITEM, oFF.UiDropDownItem);
    setControlFactory(oFF.UiType.DROPDOWN_GROUP_ITEM, oFF.UiDropDownGroupItem);
    setControlFactory(oFF.UiType.COMBO_BOX, oFF.UiComboBox);
    setControlFactory(oFF.UiType.MULTI_COMBO_BOX, oFF.UiMultiComboBox);
    setControlFactory(oFF.UiType.RADIO_BUTTON_GROUP, oFF.UiRadioButtonGroup);

    setControlFactory(oFF.UiType.TREE, oFF.UiTreeLegacy);
    setControlFactory(oFF.UiType.TREE_ITEM, oFF.UiTreeItemLegacy);
    setControlFactory(oFF.UiType.CUSTOM_TREE_ITEM, oFF.UiCustomTreeItemLegacy);

    setControlFactory(oFF.UiType.TREE_TABLE, oFF.UiTreeTable);
    setControlFactory(oFF.UiType.TREE_TABLE_ROW, oFF.UiTreeTableRow);

    setControlFactory(oFF.UiType.DATE_PICKER, oFF.UiDatePicker);
    setControlFactory(oFF.UiType.TIME_PICKER, oFF.UiTimePicker);
    setControlFactory(oFF.UiType.DATE_TIME_PICKER, oFF.UiDateTimePicker);
    setControlFactory(oFF.UiType.CALENDAR, oFF.UiCalendar);
    setControlFactory(oFF.UiType.CLOCK, oFF.UiClock);

    setControlFactory(oFF.UiType.NAVIGATION_CONTAINER, oFF.UiNavigationContainer);
    setControlFactory(oFF.UiType.PAGE, oFF.UiPage);
    setControlFactory(oFF.UiType.PAGE_BUTTON, oFF.UiPageButton);

    setControlFactory(oFF.UiType.LABEL, oFF.UiLabel);
    setControlFactory(oFF.UiType.TITLE, oFF.UiTitle);
    setControlFactory(oFF.UiType.TEXT, oFF.UiText);
    setControlFactory(oFF.UiType.TEXT_AREA, oFF.UiTextArea);
    setControlFactory(oFF.UiType.CODE_EDITOR, oFF.UiCodeEditor);
    setControlFactory(oFF.UiType.RICH_TEXT_EDITOR, oFF.UiRichTextEditor);

    setControlFactory(oFF.UiType.PANEL, oFF.UiPanel);

    setControlFactory(oFF.UiType.CARD, oFF.UiCard);

    setControlFactory(oFF.UiType.TILE_CONTAINER, oFF.UiTileContainer);
    setControlFactory(oFF.UiType.TILE, oFF.UiTile);
    setControlFactory(oFF.UiType.FILE_ICON, oFF.UiFileIcon);

    setControlFactory(oFF.UiType.MENU, oFF.UiMenu);
    setControlFactory(oFF.UiType.MENU_ITEM, oFF.UiMenuItem);
    setControlFactory(oFF.UiType.TOOLBAR, oFF.UiToolbar);
    setControlFactory(oFF.UiType.OVERFLOW_TOOLBAR, oFF.UiOverflowToolbar);

    setControlFactory(oFF.UiType.SEGMENTED_BUTTON, oFF.UiSegmentedButton);
    setControlFactory(oFF.UiType.SEGMENTED_BUTTON_ITEM, oFF.UiSegmentedButtonItem);

    setControlFactory(oFF.UiType.SPLITTER, oFF.UiSplitter);
    setControlFactory(oFF.UiType.INTERACTIVE_SPLITTER, oFF.UiInteractiveSplitter);
    setControlFactory(oFF.UiType.INTERACTIVE_SPLITTER_ITEM, oFF.UiInteractiveSplitterItem);

    setControlFactory(oFF.UiType.LIST, oFF.UiList);
    setControlFactory(oFF.UiType.LIST_ITEM, oFF.UiListItem);
    setControlFactory(oFF.UiType.CUSTOM_LIST_ITEM, oFF.UiCustomListItem);
    setControlFactory(oFF.UiType.GROUP_HEADER_LIST_ITEM, oFF.UiGroupHeaderListItem);

    setControlFactory(oFF.UiType.GRID_LIST, oFF.UiGridList);
    setControlFactory(oFF.UiType.GRID_LIST_ITEM, oFF.UiGridListItem);

    setControlFactory(oFF.UiType.NAVIGATION_LIST, oFF.UiNavigationList);
    setControlFactory(oFF.UiType.NAVIGATION_LIST_ITEM, oFF.UiNavigationListItem);
    setControlFactory(oFF.UiType.SIDE_NAVIGATION, oFF.UiSideNavigation);

    setControlFactory(oFF.UiType.VIZ_GRID, oFF.UiVizGrid);
    setControlFactory(oFF.UiType.SAC_TABLE_GRID, oFF.UiSacTableGrid);
    setControlFactory(oFF.UiType.INTEGRATION_CARD, oFF.UiIntegrationCard);

    setControlFactory(oFF.UiType.BREADCRUMBS, oFF.UiBreadcrumbs);

    setControlFactory(oFF.UiType.CHIP_CONTAINER, oFF.UiChipContainer);
    setControlFactory(oFF.UiType.MULTI_INPUT, oFF.UiMultiInput);

    setControlFactory(oFF.UiType.MESSAGE_STRIP, oFF.UiMessageStrip);
    setControlFactory(oFF.UiType.ILLUSTRATED_MESSAGE, oFF.UiIllustratedMessage);
    setControlFactory(oFF.UiType.MESSAGE_ITEM, oFF.UiMessageItem);
    setControlFactory(oFF.UiType.MESSAGE_VIEW, oFF.UiMessageView);

    setControlFactory(oFF.UiType.COLOR_PALETTE, oFF.UiColorPalette);
    setControlFactory(oFF.UiType.COLOR_PALETTE_POPOVER, oFF.UiColorPalettePopover);
    setControlFactory(oFF.UiType.COLOR_PICKER, oFF.UiColorPicker);

    setControlFactory(oFF.UiType.TABLE, oFF.UiTable);
    setControlFactory(oFF.UiType.TABLE_COLUMN, oFF.UiTableColumn);
    setControlFactory(oFF.UiType.TABLE_ROW, oFF.UiTableRow);
    setControlFactory(oFF.UiType.TABLE_CELL, oFF.UiTableCell);

    setControlFactory(oFF.UiType.RESPONSIVE_TABLE, oFF.UiResponsiveTable);
    setControlFactory(oFF.UiType.RESPONSIVE_TABLE_COLUMN, oFF.UiResponsiveTableColumn);
    setControlFactory(oFF.UiType.RESPONSIVE_TABLE_ROW, oFF.UiResponsiveTableRow);

    setControlFactory(oFF.UiType.HORIZONTAL_LAYOUT, oFF.UiHorizontalLayout);
    setControlFactory(oFF.UiType.VERTICAL_LAYOUT, oFF.UiVerticalLayout);
    setControlFactory(oFF.UiType.FLEX_LAYOUT, oFF.UiFlexLayout);
    setControlFactory(oFF.UiType.FLOW_LAYOUT, oFF.UiFlowLayout);
    setControlFactory(oFF.UiType.CANVAS_LAYOUT, oFF.UiCanvasLayout);

    setControlFactory(oFF.UiType.SCROLL_CONTAINER, oFF.UiScrollContainer);
    setControlFactory(oFF.UiType.CONTENT_WRAPPER, oFF.UiContentWrapper);

    setControlFactory(oFF.UiType.SPACER, oFF.UiSpacer);
    setControlFactory(oFF.UiType.SEPARATOR, oFF.UiSeparator);

    setControlFactory(oFF.UiType.INVISIBLE_TEXT, oFF.UiInvisibleText);

    setControlFactory(oFF.UiType.ACTIVITY_INDICATOR, oFF.UiActivityIndicator);
    setControlFactory(oFF.UiType.PROGRESS_INDICATOR, oFF.UiProgressIndicator);

    setControlFactory(oFF.UiType.HTML, oFF.UiHtml);
    setControlFactory(oFF.UiType.FORMATTED_TEXT, oFF.UiFormattedText);

    setControlFactory(oFF.UiType.WEB_ASSEMBLY, oFF.UiWebAssembly);

    setControlFactory(oFF.UiType.DIALOG, oFF.UiDialog);
    setControlFactory(oFF.UiType.DIALOG_BUTTON, oFF.UiDialogButton);
    setControlFactory(oFF.UiType.ALERT, oFF.UiAlert);
    setControlFactory(oFF.UiType.TOAST, oFF.UiToast);
    setControlFactory(oFF.UiType.POPOVER, oFF.UiPopover);
    setControlFactory(oFF.UiType.RESPONSIVE_POPOVER, oFF.UiResponsivePopover);

    setControlFactory(oFF.UiType.CHART, oFF.UiHighChart);
    setControlFactory(oFF.UiType.VIZ_FRAME, oFF.UiVizFrame);
    setControlFactory(oFF.UiType.MICRO_CHART, oFF.UiMicroChart);
    setControlFactory(oFF.UiType.VAL_CHART, oFF.UiValChart);
    setControlFactory(oFF.UiType.VIZ_INSTANCE, oFF.UiVizInstance);

    setControlFactory(oFF.UiType.WINDOW, oFF.UiWindow);
    setControlFactory(oFF.UiType.TERMINAL, oFF.UiTerminal);
    setControlFactory(oFF.UiType.LAUNCHPAD, oFF.UiLaunchpad);
    setControlFactory(oFF.UiType.APP_ICON, oFF.UiAppIcon);
    setControlFactory(oFF.UiType.TASK_BAR, oFF.UiTaskBar);
    setControlFactory(oFF.UiType.TASK_BAR_BUTTON, oFF.UiTaskBarButton);

    setControlFactory(oFF.UiType.GRAPH_LINE, oFF.UiGraphLine);
    setControlFactory(oFF.UiType.GRAPH_NODE, oFF.UiGraphNode);
    setControlFactory(oFF.UiType.GRAPH, oFF.UiGraph);

    setControlFactory(oFF.UiType.SIDE_PANEL_ITEM, oFF.UiSidePanelItem);
    setControlFactory(oFF.UiType.SIDE_PANEL, oFF.UiSidePanel);

    setControlFactory(oFF.UiType.GRID_CONTAINER, oFF.UiGridContainer);

    setControlFactory(oFF.UiType.CAROUSEL, oFF.UiCarousel);

    setControlFactory(oFF.UiType.ROOT, oFF.UiRoot);


    oFF.NativeUiManagerFactory.staticSetupNative();

    oFF.DfModule.stopExt(oFF.UiDriverModule.s_module);
  }

  return oFF.UiDriverModule.s_module;
};

oFF.UiDriverModule._setControlFactory = (type, ctrlClass) => {
  if (type && type.setFactory) {
    if (ctrlClass) {
      let ctrlInstance = new ctrlClass();
      type.setFactory(ctrlInstance);
    } else {
      oFF.ui.Log.logDebug(`---->> Skipping factory for ${type.getName()}, due to missing control class!`);
    }
  } else {
    console.error("Missing UiType, cannot set factory...");
  }
}

oFF.UiDriverModule.prototype.getName = function() {
   return "ff2210.ui.native";
};

oFF.UiDriverModule.getInstance();


return oFF;
} );