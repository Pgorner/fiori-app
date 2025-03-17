/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2650.visualization.impl","sap/sac/df/firefly/ff2200.ui"
],
function(oFF)
{
"use strict";

oFF.GenericTableRenderer = function() {};
oFF.GenericTableRenderer.prototype = new oFF.XObject();
oFF.GenericTableRenderer.prototype._ff_c = "GenericTableRenderer";

oFF.GenericTableRenderer.create = function(sacTable)
{
	let instance = new oFF.GenericTableRenderer();
	instance.m_table = sacTable;
	instance.m_tableWidgetRenderHelper = oFF.SacTableWidgetRenderHelper.createTableRenderHelper(sacTable);
	return instance;
};
oFF.GenericTableRenderer.prototype.m_rowList = null;
oFF.GenericTableRenderer.prototype.m_table = null;
oFF.GenericTableRenderer.prototype.m_tableJson = null;
oFF.GenericTableRenderer.prototype.m_tableWidgetRenderHelper = null;
oFF.GenericTableRenderer.prototype.fillRows = function()
{
	this.m_tableWidgetRenderHelper.fillRowsFromList(this.m_table.getHeaderRowList(), this.m_rowList, 0, this.m_table.isFreezeHeaderRows(), this.m_table.getFreezeUpToRow());
	this.m_tableWidgetRenderHelper.fillRowsFromList(this.m_table.getRowList(), this.m_rowList, this.m_table.getHeaderRowList().size(), false, this.m_table.getFreezeUpToRow());
};
oFF.GenericTableRenderer.prototype.getTableJson = function()
{
	return this.m_tableJson;
};
oFF.GenericTableRenderer.prototype.postRender = function()
{
	return this.m_tableWidgetRenderHelper.renderGenericSettings(this.m_tableJson);
};
oFF.GenericTableRenderer.prototype.prepareJsonStructure = function()
{
	this.m_tableJson = oFF.PrFactory.createStructure();
	this.m_rowList = this.m_tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
};
oFF.GenericTableRenderer.prototype.releaseObject = function()
{
	this.m_table = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.GenericTableRenderer.prototype.render = function()
{
	this.prepareJsonStructure();
	this.m_table.formatHeaderColumnWidths();
	this.m_table.formatDataColumnWidths();
	this.fillRows();
	this.postRender();
	return this.m_tableJson;
};
oFF.GenericTableRenderer.prototype.setGridConfigration = function(gridConfig)
{
	if (oFF.notNull(gridConfig))
	{
		this.m_table.setStripeDataColumns(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_STRIPE_DATA_COLUMNS));
		this.m_table.setStripeDataRows(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_STRIPE_DATA_ROWS));
		this.m_table.setFreezeHeaderRows(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_FREEZE_ROWS));
		this.m_table.setFreezeHeaderColumns(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_FREEZE_COLUMNS));
		this.m_table.setShowFreezeLines(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_SHOW_FREEZE_LINES));
		this.m_table.setShowGrid(gridConfig.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_GRID, true));
		this.m_table.setShowTableTitle(gridConfig.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_TABLE_TITLE, true));
		this.m_table.setShowTableDetails(gridConfig.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_TABLE_DETAILS, false));
		this.m_table.setShowSubTitle(gridConfig.getBooleanByKeyExt(oFF.SacTableConstants.B_SHOW_SUBTITLE, false));
		this.m_table.setShowCoordinateHeader(gridConfig.getBooleanByKeyExt(oFF.SacTableConstants.B_COORDINATE_HEADER, true));
		this.m_table.setHeaderColor(gridConfig.getStringByKey(oFF.SacTableConstants.S_HEADER_COLOR));
		this.m_table.setTitle(gridConfig.getStringByKey(oFF.SacTableConstants.S_TITLE));
		this.m_table.setWidth(gridConfig.getIntegerByKeyExt(oFF.SacTableConstants.I_WIDTH, 1257));
		this.m_table.setHeight(gridConfig.getIntegerByKeyExt(oFF.SacTableConstants.I_HEIGHT, 451));
		this.m_table.setMinCellWidth(gridConfig.getIntegerByKeyExt(oFF.SacTableConstants.I_MIN_CELL_WIDTH, 60));
		this.m_table.setMaxCellWidth(gridConfig.getIntegerByKeyExt(oFF.SacTableConstants.I_MAX_CELL_WIDTH, 900));
		this.m_table.setMaxRecommendedCellWidth(gridConfig.getIntegerByKeyExt(oFF.SacTableConstants.I_MAX_RECOMMENDED_CELL_WIDTH, 200));
		this.m_table.setRepetitiveHeaderNames(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_REPETITIVE_MEMBER_NAMES));
		this.m_table.setMergeRepetitiveHeaderCells(gridConfig.getBooleanByKey(oFF.SacTableConstants.B_MERGE_REPETITIVE_HEADERS));
		this.m_table.setTotalLevel6Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_6_COLOR));
		this.m_table.setTotalLevel5Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_5_COLOR));
		this.m_table.setTotalLevel4Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_4_COLOR));
		this.m_table.setTotalLevel3Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_3_COLOR));
		this.m_table.setTotalLevel2Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_2_COLOR));
		this.m_table.setTotalLevel1Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_1_COLOR));
		this.m_table.setTotalLevel0Color(gridConfig.getStringByKey(oFF.SacTableConstants.S_TOTAL_LEVEL_0_COLOR));
	}
};

oFF.RenderThemingHelper = {

	ALPHA_DELIMINATOR:"^",
	THEME_DELIMINATOR:":",
	THEME_PREFIX:"theme?",
	remapColor:function(themeCache, color)
	{
			let resultColor = color;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(color))
		{
			let colorKey = color;
			if (!themeCache.containsKey(colorKey))
			{
				let colorFallback = color;
				if (oFF.XString.startsWith(colorKey, oFF.RenderThemingHelper.THEME_PREFIX) && oFF.XString.containsString(color, oFF.RenderThemingHelper.THEME_DELIMINATOR))
				{
					let delminitationIndex = oFF.XString.indexOf(color, oFF.RenderThemingHelper.THEME_DELIMINATOR);
					colorKey = oFF.XString.substring(color, oFF.XString.size(oFF.RenderThemingHelper.THEME_PREFIX), delminitationIndex);
					colorFallback = oFF.XString.substring(color, delminitationIndex + 1, oFF.XString.size(color));
				}
				let mappedColor = oFF.RenderThemingHelper.resolveColorWithAlpha(colorKey);
				resultColor = oFF.XStringUtils.isNotNullAndNotEmpty(mappedColor) ? mappedColor : colorFallback;
				themeCache.put(colorKey, resultColor);
			}
			else
			{
				resultColor = themeCache.getByKey(colorKey);
			}
		}
		return resultColor;
	},
	resolveColorWithAlpha:function(colorKey)
	{
			let alphaIndex = oFF.XString.indexOf(colorKey, oFF.RenderThemingHelper.ALPHA_DELIMINATOR);
		let properColorKey = colorKey;
		let alpha = 0;
		if (alphaIndex > -1)
		{
			properColorKey = oFF.XString.substring(colorKey, 0, alphaIndex);
			alpha = oFF.XDouble.convertFromString(oFF.XString.substring(colorKey, alphaIndex + 1, -1));
		}
		let colorValue = oFF.UiFramework.currentFramework().getThemeParameter(properColorKey);
		if (alphaIndex > -1 && alpha !== 0)
		{
			let resolvedColor = oFF.UiColor.create(colorValue);
			if (oFF.notNull(resolvedColor))
			{
				resolvedColor.setAlpha(alpha);
				colorValue = resolvedColor.getRgbaColor();
			}
		}
		return colorValue;
	}
};

oFF.SacTableCsvRenderHelper = function() {};
oFF.SacTableCsvRenderHelper.prototype = new oFF.XObject();
oFF.SacTableCsvRenderHelper.prototype._ff_c = "SacTableCsvRenderHelper";

oFF.SacTableCsvRenderHelper.DEFAULT_CELL_SEPARATOR = ",";
oFF.SacTableCsvRenderHelper.DEFAULT_ESCAPOR = "\"";
oFF.SacTableCsvRenderHelper.DEFAULT_LINE_SEPARATOR = "\n";
oFF.SacTableCsvRenderHelper.createDefaultTableRenderHelper = function(tableObject)
{
	let instance = new oFF.SacTableCsvRenderHelper();
	instance.initializeRH(tableObject, oFF.SacTableCsvRenderHelper.DEFAULT_LINE_SEPARATOR, oFF.SacTableCsvRenderHelper.DEFAULT_CELL_SEPARATOR, oFF.SacTableCsvRenderHelper.DEFAULT_ESCAPOR);
	return instance;
};
oFF.SacTableCsvRenderHelper.createTableRenderHelper = function(tableObject, lineSeparator, separator, escapor)
{
	let instance = new oFF.SacTableCsvRenderHelper();
	instance.initializeRH(tableObject, lineSeparator, separator, escapor);
	return instance;
};
oFF.SacTableCsvRenderHelper.prototype.m_cellSeparator = null;
oFF.SacTableCsvRenderHelper.prototype.m_escapedEscapor = null;
oFF.SacTableCsvRenderHelper.prototype.m_escapor = null;
oFF.SacTableCsvRenderHelper.prototype.m_lineSeparator = null;
oFF.SacTableCsvRenderHelper.prototype.fillCellsFromList = function(cells, stringBuffer)
{
	if (oFF.XCollectionUtils.hasElements(cells))
	{
		let cellsSize = cells.size();
		for (let i = 0; i < cellsSize; i++)
		{
			let cellObject = cells.get(i);
			if (oFF.notNull(cellObject) && cellObject.getParentColumn() !== null && !cellObject.getParentColumn().isEffectivelyHidden())
			{
				stringBuffer.append(this.resolveCell(cellObject));
				stringBuffer.append(this.m_cellSeparator);
			}
		}
	}
};
oFF.SacTableCsvRenderHelper.prototype.fillRowsFromList = function(rowList, stringBuffer)
{
	for (let i = 0; i < rowList.size(); i++)
	{
		let row = rowList.get(i);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			this.fillCellsFromList(row.getCells(), stringBuffer);
		}
		stringBuffer.append(this.m_lineSeparator);
	}
};
oFF.SacTableCsvRenderHelper.prototype.getEscapedEscapor = function()
{
	if (oFF.isNull(this.m_escapedEscapor))
	{
		this.m_escapedEscapor = oFF.XStringUtils.concatenate2(this.m_escapor, this.m_escapor);
	}
	return this.m_escapedEscapor;
};
oFF.SacTableCsvRenderHelper.prototype.initializeRH = function(tableObject, lineSeparator, separator, escapor)
{
	this.m_lineSeparator = lineSeparator;
	this.m_cellSeparator = separator;
	this.m_escapor = escapor;
};
oFF.SacTableCsvRenderHelper.prototype.releaseObject = function()
{
	this.m_lineSeparator = null;
	this.m_cellSeparator = null;
	this.m_escapor = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacTableCsvRenderHelper.prototype.resolveCell = function(tableCell)
{
	let cellBase = tableCell;
	let formattedString = cellBase.getEffectiveFormattedText(cellBase.getPrioritizedStylesList());
	let needsEscape = oFF.XString.containsString(formattedString, this.m_cellSeparator) || oFF.XString.containsString(formattedString, this.m_lineSeparator);
	if (oFF.XString.containsString(formattedString, this.m_escapor))
	{
		needsEscape = true;
		formattedString = oFF.XString.replace(formattedString, this.m_escapor, this.getEscapedEscapor());
	}
	if (needsEscape)
	{
		formattedString = oFF.XStringUtils.concatenate3(this.m_escapor, formattedString, this.m_escapor);
	}
	return formattedString;
};

oFF.SacTableExportHelper = function() {};
oFF.SacTableExportHelper.prototype = new oFF.XObject();
oFF.SacTableExportHelper.prototype._ff_c = "SacTableExportHelper";

oFF.SacTableExportHelper.createTableExportHelper = function(table, niceTitle)
{
	let instance = new oFF.SacTableExportHelper();
	instance.initializeRH(table, niceTitle);
	return instance;
};
oFF.SacTableExportHelper.prototype.m_niceTitle = null;
oFF.SacTableExportHelper.prototype.m_tableObject = null;
oFF.SacTableExportHelper.prototype.applyPadding = function(paddingStructure, padding, paddingKey)
{
	if (padding > -1)
	{
		paddingStructure.putDouble(paddingKey, padding);
	}
};
oFF.SacTableExportHelper.prototype.applyStriping = function(stripeRows, stripeColumns, i, row, cellStructure, rowIndex)
{
	let stripeAny = stripeColumns || stripeRows;
	if (stripeAny && i >= row.getParentTable().getPreColumnsAmount() && row.getParentTable().getRowList().contains(row))
	{
		let style = this.getStyle(cellStructure);
		if (oFF.XStringUtils.isNullOrEmpty(style.getStringByKey(oFF.SacTableConstants.ST_S_FILL_COLOR)))
		{
			if (stripeRows && oFF.XMath.mod(rowIndex, 2) === 0)
			{
				style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, oFF.SacTableConstants.SV_ROW_STRIPE_COLOR);
			}
			else if (stripeColumns && oFF.XMath.mod(i, 2) === 0)
			{
				style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, oFF.SacTableConstants.SV_COLUMN_STRIPE_COLOR);
			}
		}
	}
};
oFF.SacTableExportHelper.prototype.format = function(themeCache, cellBase, structureToFormat, styles)
{
	if (cellBase.isEffectiveTotalsContext())
	{
		structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_INA_TOTALS_CONTEXT, true);
	}
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_IN_HIERARCHY, cellBase.isInHierarchy());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_ALLOW_DRAG_DROP, cellBase.isAllowDragDrop());
	structureToFormat.putInteger(oFF.SacTableConstants.C_N_LEVEL, cellBase.getHierarchyLevel());
	structureToFormat.putInteger(cellBase.getHierarchyPaddingType(), cellBase.getHierarchyPaddingValue() * (1 + cellBase.getHierarchyLevel()));
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_SHOW_DRILL_ICON, cellBase.isShowDrillIcon());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_EXPANDED, cellBase.isExpanded());
	let color = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveFillColor(styles));
	if (oFF.notNull(color))
	{
		let alpha = cellBase.getEffectiveFillAlphaOverwrite(styles);
		if (alpha !== -1)
		{
			color = oFF.UiColor.create(color).setAlpha(alpha).getHexColorWithAlpha();
		}
		let style = this.getStyle(structureToFormat);
		style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, color);
	}
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineTop(styles), oFF.SacTableConstants.LP_TOP, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyleLineBottom(styles), oFF.SacTableConstants.LP_BOTTOM, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineLeft(styles), oFF.SacTableConstants.LP_LEFT, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineRight(styles), oFF.SacTableConstants.LP_RIGHT, structureToFormat);
	if (cellBase.isWrap())
	{
		this.getStyle(structureToFormat).putBoolean(oFF.SacTableConstants.ST_B_WRAP, true);
	}
	if (cellBase.isEffectiveFontItalic(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_ITALIC, true);
	}
	if (cellBase.isEffectiveFontBold(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
	}
	if (cellBase.isEffectiveFontUnderline(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_UNDERLINE, true);
	}
	if (cellBase.isEffectiveFontStrikeThrough(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_STRIKETHROUGH, true);
	}
	let effectiveFontSize = cellBase.getEffectiveFontSize(styles);
	if (effectiveFontSize > 0)
	{
		this.getFont(structureToFormat).putDouble(oFF.SacTableConstants.FS_N_SIZE, effectiveFontSize);
	}
	let effectiveFontFamily = cellBase.getEffectiveFontFamily(styles);
	if (oFF.notNull(effectiveFontFamily))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_FAMILY, effectiveFontFamily);
	}
	color = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveFontColor(styles));
	if (oFF.notNull(color))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_COLOR, color);
	}
	let effectiveThresholdColor = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveThresholdColor(styles));
	if (oFF.notNull(effectiveThresholdColor))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_COLOR, effectiveThresholdColor);
	}
	let effectiveSymbolStringConstant = oFF.SacTableConstantMapper.mapAlertSymbolToString(cellBase.getEffectiveThresholdType(styles));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(effectiveSymbolStringConstant))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_ICON_TYPE, effectiveSymbolStringConstant);
	}
	let hAlignment = cellBase.getEffectiveHorizontalAlignment(styles);
	let vAlignment = cellBase.getEffectiveVerticalAlignment(styles);
	if (oFF.notNull(hAlignment) || oFF.notNull(vAlignment))
	{
		let alignmentStructure = this.getStyle(structureToFormat).putNewStructure(oFF.SacTableConstants.ST_M_ALIGNMENT);
		if (hAlignment === oFF.SacVisualizationHorizontalAlignment.LEFT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_LEFT);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.CENTER)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_CENTER);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.RIGHT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_RIGHT);
		}
		if (vAlignment === oFF.SacVisualizationVerticalAlignment.TOP)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_TOP);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.MIDDLE)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_MIDDLE);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.BOTTOM)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_BOTTOM);
		}
	}
	let backgroundPatternType = cellBase.getEffectiveBackgroundPatternType(styles);
	if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putStringNotNullAndNotEmpty(oFF.SacTableConstants.C_S_FORMATTED, cellBase.getEffectiveBackgroundContent(styles));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_1));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_2));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_3));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_4));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_5));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_6));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_7));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_8));
	}
	return structureToFormat;
};
oFF.SacTableExportHelper.prototype.getCorrectWidth = function(originallWidth, factor, maxPixelCellWidth, minPixelCellWidth)
{
	return oFF.XMath.min(maxPixelCellWidth, oFF.XMath.max(oFF.XMath.div(originallWidth * factor, 10), minPixelCellWidth));
};
oFF.SacTableExportHelper.prototype.getExportableStructure = function(startRow, endRow, startCol, endCol)
{
	let themeCache = oFF.XHashMapByString.create();
	let tableJson = oFF.PrFactory.createStructure();
	let index;
	let headerRowList = this.m_tableObject.getHeaderRowList();
	let rowList = this.m_tableObject.getRowList();
	let colList = this.m_tableObject.getColumnList();
	let prRowList = tableJson.putNewList(oFF.SacTableConstants.TD_L_ROWS);
	let headerRowSize = headerRowList.size();
	let colEndIndex = oFF.XMath.min(colList.size(), endCol + 1);
	let rowEndIndex = oFF.XMath.min(rowList.size(), endRow + 1);
	this.renderGenericSettings(tableJson, startCol, colEndIndex, startRow);
	let row;
	let effectiveIndex = 0;
	for (index = 0; index < headerRowSize; index++)
	{
		row = headerRowList.get(index);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			this.renderRow(themeCache, prRowList, row, effectiveIndex++, startCol, colEndIndex);
		}
		else if (oFF.isNull(row))
		{
			effectiveIndex++;
		}
	}
	for (index = startRow; index < rowEndIndex; index++)
	{
		row = rowList.get(index);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			this.renderRow(themeCache, prRowList, row, effectiveIndex++, startCol, colEndIndex);
		}
		else if (oFF.isNull(row))
		{
			effectiveIndex++;
		}
	}
	return tableJson;
};
oFF.SacTableExportHelper.prototype.getFont = function(structure)
{
	let style = this.getStyle(structure);
	let font = style.getStructureByKey(oFF.SacTableConstants.ST_M_FONT);
	if (oFF.isNull(font))
	{
		font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	}
	return font;
};
oFF.SacTableExportHelper.prototype.getLineInternal = function(position, structure)
{
	let style = this.getStyle(structure);
	if (!style.containsKey(oFF.SacTableConstants.ST_L_LINES))
	{
		style.putNewList(oFF.SacTableConstants.ST_L_LINES);
	}
	let lines = style.getListByKey(oFF.SacTableConstants.ST_L_LINES);
	let line = null;
	for (let i = 0; i < lines.size(); i++)
	{
		if (lines.getStructureAt(i).getIntegerByKey(oFF.SacTableConstants.SL_N_POSITION) === position)
		{
			line = lines.getStructureAt(i);
		}
	}
	if (oFF.isNull(line))
	{
		line = lines.addNewStructure();
		line.putInteger(oFF.SacTableConstants.SL_N_SIZE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_STYLE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_POSITION, position);
		let padding = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
		if (position === oFF.SacTableConstants.LP_BOTTOM || position === oFF.SacTableConstants.LP_TOP)
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_RIGHT, oFF.SacTableConstants.LP_RIGHT);
			padding.putInteger(oFF.SacTableConstants.SLP_N_LEFT, oFF.SacTableConstants.LP_RIGHT);
		}
		else
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_BOTTOM, oFF.SacTableConstants.LP_BOTTOM);
			padding.putInteger(oFF.SacTableConstants.SLP_N_TOP, oFF.SacTableConstants.LP_TOP);
		}
	}
	return line;
};
oFF.SacTableExportHelper.prototype.getStyle = function(structure)
{
	if (!structure.containsKey(oFF.SacTableConstants.C_M_STYLE))
	{
		structure.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
		structure.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	}
	return structure.getStructureByKey(oFF.SacTableConstants.C_M_STYLE);
};
oFF.SacTableExportHelper.prototype.getTableObject = function()
{
	return this.m_tableObject;
};
oFF.SacTableExportHelper.prototype.initializeRH = function(tableObject, niceTitle)
{
	this.m_tableObject = tableObject;
	this.m_niceTitle = niceTitle;
};
oFF.SacTableExportHelper.prototype.preFormatCellChart = function(themeCache, cellBase, structure, rowIndex, colIndex)
{
	let styles = cellBase.getPrioritizedStylesList();
	structure.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_CHART);
	let cellChart = structure.putNewStructure(oFF.SacTableConstants.C_M_CELL_CHART);
	cellChart.putString(oFF.SacTableConstants.CC_S_MEMBER_ID, cellBase.getEffectiveCellChartMemberName(styles));
	let cellChartType = cellBase.getEffectiveCellChartType();
	if (cellChartType === oFF.SacCellChartType.BAR)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_BAR);
	}
	else if (cellChartType === oFF.SacCellChartType.VARIANCE_BAR)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_VARIANCE_BAR);
	}
	else if (cellChartType === oFF.SacCellChartType.PIN)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_VARIANCE_PIN);
	}
	cellChart.putString(oFF.SacTableConstants.CC_S_BAR_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveCellChartBarColor(styles)));
	cellChart.putString(oFF.SacTableConstants.CC_SU_LINE_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveCellChartLineColor(styles)));
	cellChart.putBoolean(oFF.SacTableConstants.CC_B_SHOW_VALUE, !cellBase.isEffectiveHideNumberForCellChart());
	cellChart.putString(oFF.SacTableConstants.CC_S_CELL_CHART_ORIENTATION, cellBase.getEffectiveCellChartOrientation() === oFF.SacCellChartOrientation.VERTICAL ? oFF.SacTableConstants.CCO_VERTICAL : oFF.SacTableConstants.CCO_HORIZONTAL);
	let cellChartInfo = this.m_tableObject.getCellChartInfo();
	if (!cellChartInfo.containsKey(cellBase.getEffectiveCellChartMemberName(styles)))
	{
		cellChartInfo.put(cellBase.getEffectiveCellChartMemberName(styles), oFF.CellChartInfo.create(cellBase.getEffectiveCellChartOrientation(), colIndex, rowIndex, oFF.XValueUtil.getDouble(cellBase.getPlain(), false, true)));
	}
	else
	{
		let cellChartMeasureInfo = cellChartInfo.getByKey(cellBase.getEffectiveCellChartMemberName(styles));
		cellChartMeasureInfo.addColumn(colIndex);
		cellChartMeasureInfo.addRow(rowIndex);
		cellChartMeasureInfo.registerValue(oFF.XValueUtil.getDouble(cellBase.getPlain(), false, true));
	}
	return cellChart;
};
oFF.SacTableExportHelper.prototype.releaseObject = function()
{
	this.m_tableObject = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacTableExportHelper.prototype.renderCell = function(themeCache, cellList, cellBase, rowIndex, styles, colIndex)
{
	let structure = cellList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.C_N_ROW, rowIndex);
	structure.putInteger(oFF.SacTableConstants.C_N_COLUMN, colIndex);
	let mergedColumns = cellBase.getMergedColumns();
	let mergedRows = cellBase.getMergedRows();
	if (mergedColumns !== 0 || mergedRows !== 0)
	{
		let mergerStructure = structure.putNewStructure(oFF.SacTableConstants.C_M_MERGED);
		if (mergedColumns >= 0 && mergedRows >= 0)
		{
			if (cellBase.getMergedColumns() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_COLUMNS, cellBase.getMergedColumns());
			}
			if (cellBase.getMergedRows() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ROWS, cellBase.getMergedRows());
			}
		}
		else
		{
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_COLUMN, colIndex + cellBase.getMergedColumns());
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_ROW, rowIndex + cellBase.getMergedRows());
		}
	}
	if (cellBase.getCommentDocumentId() !== null)
	{
		structure.putInteger(oFF.SacTableConstants.C_N_COMMENT_TYPE, oFF.SacTableConstants.CT_SELF);
		structure.putString(oFF.SacTableConstants.CS_COMMENT_DOCUMENT_ID, cellBase.getCommentDocumentId());
	}
	let localId = cellBase.getId();
	if (oFF.isNull(localId))
	{
		localId = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToHexString(rowIndex), oFF.XInteger.convertToHexString(colIndex));
	}
	structure.putString(oFF.SacTableConstants.C_S_ID, localId);
	structure.putString(oFF.SacTableConstants.C_S_FORMATTED, cellBase.getEffectiveWrappedFormattedText(styles));
	structure.putString(oFF.SacTableConstants.C_S_FORMAT_STRING, cellBase.getEffectiveFormattingPattern(styles));
	structure.putBoolean(oFF.SacTableConstants.C_B_REPEATED_MEMBER_NAME, cellBase.isRepeatedHeader());
	let plainValue = cellBase.getPlain();
	if (oFF.notNull(plainValue))
	{
		let valueType = cellBase.getPlain().getValueType();
		if (valueType === oFF.XValueType.BOOLEAN)
		{
			structure.putBoolean(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getBoolean(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.DECIMAL_FLOAT && plainValue.mayLoosePrecision())
		{
			structure.putDouble(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getDouble(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.LONG)
		{
			structure.putLong(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getLong(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.INTEGER)
		{
			structure.putInteger(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getInteger(plainValue, false, true));
		}
		else
		{
			structure.putString(oFF.SacTableConstants.C_SN_PLAIN, plainValue.getStringRepresentation());
		}
	}
	let effectiveCellType = cellBase.getEffectiveCellType();
	structure.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, effectiveCellType);
	structure.putBoolean(oFF.SacTableConstants.C_B_DRAGGABLE, effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_COL_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_ROW_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_ROW_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_COL_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_MEMBER);
	if (cellBase.isEffectiveShowCellChart())
	{
		this.preFormatCellChart(themeCache, cellBase, structure, rowIndex, colIndex);
	}
	return structure;
};
oFF.SacTableExportHelper.prototype.renderColumn = function(sacTableColumn, columnStructure) {};
oFF.SacTableExportHelper.prototype.renderGenericSettings = function(tableJson, startCol, colEndIndex, startRow)
{
	tableJson.putString(oFF.SacTableConstants.S_PRETTY_PRINTED_TITLE, this.m_niceTitle);
	let style = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_STYLE);
	let font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	font.putInteger(oFF.SacTableConstants.FS_N_SIZE, 42);
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_REVERSED_HIERARCHY, this.m_tableObject.isReversedHierarchy());
	let title = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_TITLE);
	let titleStyle = title.putNewStructure(oFF.SacTableConstants.TD_M_TITLE_STYLE);
	title.putNewStructure(oFF.SacTableConstants.TD_M_SUBTITLE_STYLE);
	let titleFont = titleStyle.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	titleFont.putInteger(oFF.SacTableConstants.FS_N_SIZE, 17);
	let titleText = this.m_tableObject.getTitle();
	title.putStringNotNullAndNotEmpty(oFF.SacTableConstants.TD_S_TITLE_TEXT, titleText);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(titleText))
	{
		title.putNewList(oFF.SacTableConstants.TD_L_TITLE_CHUNKS).addString(titleText);
	}
	let titleTokens = title.putNewStructure(oFF.SacTableConstants.TD_M_TOKEN_DATA);
	let titelTokenStyles = titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
	titelTokenStyles.putString("line-height", "");
	titelTokenStyles.putString("text-align", "left");
	titelTokenStyles.putString("font-size", "13px");
	titelTokenStyles.putString("align-items", "center");
	titelTokenStyles.putString("margin-top", "3px");
	titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
	titleTokens.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addString("sapReportEngineTokenContainer");
	titleTokens.putString(oFF.SacTableConstants.TE_S_TAG, "div");
	let titleVisible = this.m_tableObject.isShowTableTitle();
	let subtitleVisible = this.m_tableObject.isShowSubTitle();
	let detailsVisible = this.m_tableObject.isShowTableDetails();
	title.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, titleVisible);
	title.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, subtitleVisible);
	title.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, detailsVisible);
	title.putBoolean(oFF.SacTableConstants.TD_B_EDITABLE, false);
	let titleAreaHeight = 40;
	if (titleVisible && (detailsVisible || subtitleVisible))
	{
		titleAreaHeight = 52;
	}
	else if (!titleVisible && !detailsVisible && !subtitleVisible)
	{
		titleAreaHeight = 0;
	}
	titleStyle.putInteger(oFF.SacTableConstants.TS_N_HEIGHT, titleAreaHeight);
	let i;
	let tableHeight = this.m_tableObject.getHeight();
	let tableWidth = this.m_tableObject.getWidth();
	tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_HEIGHT, tableHeight);
	let showGrid = this.m_tableObject.isShowGrid();
	let freezingColumns = this.m_tableObject.isFreezeHeaderColumns() || this.m_tableObject.getFreezeUpToColumn() > -1;
	let freezing = this.m_tableObject.isFreezeHeaderRows() || this.m_tableObject.getFreezeUpToRow() > -1 || freezingColumns;
	let freezeUpToColumn = this.m_tableObject.getFreezeUpToColumn();
	if (freezeUpToColumn > -1 || !this.m_tableObject.isFreezeHeaderColumns())
	{
		tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, freezeUpToColumn);
	}
	else
	{
		tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, this.m_tableObject.getPreColumnsAmount() - 1);
	}
	let freezeUpToRow = this.m_tableObject.getFreezeUpToRow();
	if (freezeUpToRow > -1 || !this.m_tableObject.isFreezeHeaderRows())
	{
		tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, freezeUpToRow);
	}
	else
	{
		tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, this.m_tableObject.getPreRowsAmount() - 1);
	}
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_FREEZE_LINES, freezing && this.m_tableObject.isShowFreezeLines());
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_HAS_FIXED_ROWS_COLS, freezing);
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_GRID, showGrid);
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_COORDINATE_HEADER, this.m_tableObject.isShowCoordinateHeader());
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_GRID, this.m_tableObject.isShowGrid());
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, this.m_tableObject.isShowSubTitle());
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, this.m_tableObject.isShowTableTitle());
	tableJson.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, this.m_tableObject.isShowTableDetails());
	let columnSettings = tableJson.putNewList(oFF.SacTableConstants.TD_L_COLUMN_SETTINGS);
	let availableWidth = tableWidth - 100;
	let columnWidths = this.m_tableObject.getColumnEmWidthsSubList(0, -1);
	let overallSizeUnits = oFF.XStream.of(columnWidths).reduce(oFF.XIntegerValue.create(1), (a, b) => {
		return oFF.XIntegerValue.create(a.getInteger() + b.getInteger());
	}).getInteger();
	let factor = oFF.XMath.div(availableWidth * 10, overallSizeUnits);
	if (factor > 15)
	{
		factor = 15;
	}
	if (factor < 10)
	{
		factor = 10;
	}
	let minPixelCellWidth = this.m_tableObject.getMinCellWidth();
	let maxPixelCellWidth = this.m_tableObject.getMaxCellWidth();
	let preciseWidth;
	let columnObject;
	let headerWidth = 0;
	let dataWidth = 0;
	for (i = 0; i < this.m_tableObject.getPreColumnsAmount(); i++)
	{
		preciseWidth = minPixelCellWidth;
		if (i < columnWidths.size())
		{
			preciseWidth = this.getCorrectWidth(columnWidths.get(i).getInteger(), factor, maxPixelCellWidth, minPixelCellWidth);
		}
		columnObject = this.m_tableObject.getHeaderColumnList().get(i);
		columnObject.setDefaultWidth(preciseWidth);
		headerWidth = headerWidth + preciseWidth;
	}
	if (this.m_tableObject.getDataColumnsAmount() > 0)
	{
		for (i = this.m_tableObject.getPreColumnsAmount() + startCol; i < this.m_tableObject.getPreColumnsAmount() + colEndIndex; i++)
		{
			preciseWidth = minPixelCellWidth;
			if (i < columnWidths.size())
			{
				preciseWidth = this.getCorrectWidth(columnWidths.get(i).getInteger(), factor, maxPixelCellWidth, minPixelCellWidth);
			}
			dataWidth = dataWidth + preciseWidth;
			columnObject = this.m_tableObject.getColumnList().get(i - this.m_tableObject.getPreColumnsAmount());
			if (oFF.notNull(columnObject))
			{
				columnObject.setDefaultWidth(preciseWidth);
			}
		}
	}
	let totalWidth = 20;
	let columnStructure;
	let effectiveIndex = 0;
	for (i = 0; i < this.m_tableObject.getPreColumnsAmount(); i++)
	{
		columnObject = this.m_tableObject.getHeaderColumnList().get(i);
		if (oFF.isNull(columnObject) || !columnObject.isEffectivelyHidden())
		{
			preciseWidth = oFF.isNull(columnObject) ? 0 : columnObject.getWidth();
			totalWidth = totalWidth + preciseWidth;
			columnStructure = columnSettings.addNewStructure();
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, effectiveIndex);
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, minPixelCellWidth);
			columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
			columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(effectiveIndex));
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, false);
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
			columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.m_tableObject.isFreezeHeaderColumns() && freezeUpToColumn < 0 || freezeUpToColumn >= effectiveIndex);
			this.renderColumn(columnObject, columnStructure);
			effectiveIndex++;
		}
	}
	if (this.m_tableObject.getDataColumnsAmount() > startCol)
	{
		for (i = startCol; i < colEndIndex; i++)
		{
			columnObject = this.m_tableObject.getColumnList().get(i);
			if (oFF.isNull(columnObject) || !columnObject.isEffectivelyHidden())
			{
				preciseWidth = oFF.isNull(columnObject) ? 0 : columnObject.getWidth();
				totalWidth = totalWidth + preciseWidth;
				columnStructure = columnSettings.addNewStructure();
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, effectiveIndex);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, minPixelCellWidth);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
				columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(effectiveIndex + startCol));
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.m_tableObject.getFreezeUpToColumn() >= effectiveIndex + startCol);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
				this.renderColumn(columnObject, columnStructure);
				effectiveIndex++;
			}
		}
	}
	let dataRowAmount = this.m_tableObject.getDataRowAmount();
	let headerRowAmount = this.m_tableObject.getPreRowsAmount();
	let totalHeight = 20 + this.m_tableObject.getOverallHeight();
	if (showGrid)
	{
		totalHeight = totalHeight + dataRowAmount + headerRowAmount;
	}
	let cellChartInfo = this.m_tableObject.getCellChartInfo();
	if (oFF.XCollectionUtils.hasElements(cellChartInfo))
	{
		let cellChartInfoStructure = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_CELL_CHART_DATA);
		let memberNames = cellChartInfo.getKeysAsIterator();
		while (memberNames.hasNext())
		{
			let memberName = memberNames.next();
			let cellChartMemberInfo = cellChartInfo.getByKey(memberName);
			let memberCellChartData = cellChartInfoStructure.putNewStructure(memberName);
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_START_COL, cellChartMemberInfo.getStartColumn() - startCol);
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_END_COL, cellChartMemberInfo.getEndColumn() - startCol);
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_START_ROW, cellChartMemberInfo.getStartRow() - startRow);
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_END_ROW, cellChartMemberInfo.getEndRow() - startRow);
			memberCellChartData.putDouble(oFF.SacTableConstants.CCD_N_MIN, cellChartMemberInfo.getMinValue());
			memberCellChartData.putDouble(oFF.SacTableConstants.CCD_N_MAX, cellChartMemberInfo.getMaxValue());
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_MAX_TEXT_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
			let columnsList = memberCellChartData.putNewList(oFF.SacTableConstants.CCD_L_COLUMNS);
			let columnsIterator = cellChartMemberInfo.getColumns().getIterator();
			let maxTextWidth = 0;
			while (columnsIterator.hasNext())
			{
				let columnIndex = columnsIterator.next().getInteger();
				columnsList.addInteger(columnIndex);
				maxTextWidth = oFF.XMath.max(oFF.XMath.div(columnSettings.getStructureAt(columnIndex).getIntegerByKey(oFF.SacTableConstants.CS_N_WIDTH), 3), maxTextWidth);
			}
			memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_MAX_TEXT_WIDTH, maxTextWidth);
		}
	}
	tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_WIDTH, totalWidth);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_HEIGHT, totalHeight);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_COL, 0);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_ROW, 0);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_COL, this.m_tableObject.getPreColumnsAmount() - 1);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_ROW, this.m_tableObject.getPreRowsAmount() - 1);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_COL, this.m_tableObject.getPreColumnsAmount() + this.m_tableObject.getDataColumnsAmount() - 1);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_ROW, this.m_tableObject.getPreRowsAmount() + this.m_tableObject.getDataRowAmount() - 1);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_LAST_ROW_INDEX, this.m_tableObject.getPreRowsAmount() + this.m_tableObject.getDataRowAmount() - 1);
	tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_WIDTH, totalWidth + 20);
	return titleTokens.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
};
oFF.SacTableExportHelper.prototype.renderRow = function(themeCache, rowList, row, rowIndex, startCol, colEndIndex)
{
	let structure = rowList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, row.getEffectiveHeight());
	let localId = row.getId();
	if (oFF.isNull(localId))
	{
		localId = oFF.XInteger.convertToHexString(rowIndex);
	}
	structure.putString(oFF.SacTableConstants.C_S_ID, localId);
	structure.putInteger(oFF.SacTableConstants.R_N_ROW, rowIndex);
	structure.putBoolean(oFF.SacTableConstants.R_B_FIXED, row.isFixed());
	structure.putBoolean(oFF.SacTableConstants.R_B_CHANGED_ON_THE_FLY_UNRESPONSIVE, row.isChangedOnTheFlyUnresponsive());
	let cellList = structure.putNewList(oFF.SacTableConstants.R_L_CELLS);
	let stripeColumns = row.getParentTable().isStripeDataColumns();
	let stripeRows = row.getParentTable().isStripeDataRows();
	let i;
	let cell;
	let cellStructure;
	let effectiveIndex = 0;
	let styles;
	for (i = 0; i < this.m_tableObject.getPreColumnsAmount(); i++)
	{
		cell = row.getCells().get(i);
		if (oFF.notNull(cell) && cell.getParentColumn() !== null && !cell.getParentColumn().isEffectivelyHidden())
		{
			styles = cell.getPrioritizedStylesList();
			cellStructure = this.renderCell(themeCache, cellList, cell, rowIndex, styles, effectiveIndex++);
			this.format(themeCache, cell, cellStructure, styles);
			this.applyStriping(stripeRows, stripeColumns, i, row, cellStructure, rowIndex);
		}
		else if (oFF.isNull(cell))
		{
			effectiveIndex++;
		}
	}
	for (i = startCol + this.m_tableObject.getPreColumnsAmount(); i < this.m_tableObject.getPreColumnsAmount() + colEndIndex; i++)
	{
		cell = row.getCells().get(i);
		if (oFF.notNull(cell) && cell.getParentColumn() !== null && !cell.getParentColumn().isEffectivelyHidden())
		{
			styles = cell.getPrioritizedStylesList();
			cellStructure = this.renderCell(themeCache, cellList, cell, rowIndex, styles, effectiveIndex++);
			this.format(themeCache, cell, cellStructure, styles);
			this.applyStriping(stripeRows, stripeColumns, i - startCol, row, cellStructure, rowIndex);
		}
		else if (oFF.isNull(cell))
		{
			effectiveIndex++;
		}
	}
	return structure;
};
oFF.SacTableExportHelper.prototype.transferStyledLineToJson = function(themeCache, effectiveLineStyle, lpKey, structureToFormat)
{
	if (!oFF.SacStyleUtils.isStyleLineEmpty(effectiveLineStyle))
	{
		let line = this.getLineInternal(lpKey, structureToFormat);
		line.putStringNotNullAndNotEmpty(oFF.SacTableConstants.SL_S_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getColor()));
		if (effectiveLineStyle.getWidth() > -1)
		{
			line.putDouble(oFF.SacTableConstants.SL_N_SIZE, effectiveLineStyle.getWidth());
		}
		if (effectiveLineStyle.hasPadding())
		{
			let paddingStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
			this.applyPadding(paddingStructure, effectiveLineStyle.getLeftPadding(), oFF.SacTableConstants.SLP_N_LEFT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getRightPadding(), oFF.SacTableConstants.SLP_N_RIGHT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getTopPadding(), oFF.SacTableConstants.SLP_N_TOP);
			this.applyPadding(paddingStructure, effectiveLineStyle.getBottomPadding(), oFF.SacTableConstants.SLP_N_BOTTOM);
		}
		let lineStyle = effectiveLineStyle.getLineStyle();
		if (lineStyle === oFF.SacTableLineStyle.DASHED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DASHED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.DOTTED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DOTTED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.SOLID)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_SOLID);
		}
		else if (lineStyle === oFF.SacTableLineStyle.NONE)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_NONE);
		}
		let linePatternType = effectiveLineStyle.getPatternType();
		if (oFF.notNull(linePatternType))
		{
			let patternStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PATTERN);
			if (linePatternType === oFF.VisualizationBackgroundPatternType.WHITE_FILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_WHITE_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.NOFILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_NON_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.SOLID)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_SOLID);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BACKGROUND, effectiveLineStyle.getPatternBackground());
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_1, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_2, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_3, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_4, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_5, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_6, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_7, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_8, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			if (effectiveLineStyle.getPatternWidth() > 0)
			{
				patternStructure.putDouble(oFF.SacTableConstants.LP_N_WIDTH, effectiveLineStyle.getPatternWidth());
			}
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getPatternColor()));
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BORDER_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getPatternBorderColor()));
		}
	}
};

oFF.GenericHiChartRenderer = function() {};
oFF.GenericHiChartRenderer.prototype = new oFF.XObject();
oFF.GenericHiChartRenderer.prototype._ff_c = "GenericHiChartRenderer";

oFF.GenericHiChartRenderer.CHART_JSON = "ChartJson";
oFF.GenericHiChartRenderer.MESSAGES = "Messages";
oFF.GenericHiChartRenderer.create = function(chartVisualization)
{
	let instance = new oFF.GenericHiChartRenderer();
	instance.m_chartVisualization = chartVisualization;
	return instance;
};
oFF.GenericHiChartRenderer.prototype.m_chartJson = null;
oFF.GenericHiChartRenderer.prototype.m_chartVisualization = null;
oFF.GenericHiChartRenderer.prototype.m_messages = null;
oFF.GenericHiChartRenderer.prototype.m_resultObject = null;
oFF.GenericHiChartRenderer.prototype.addCategoryTag = function(structure, category)
{
	if (oFF.notNull(category))
	{
		let domain = category.getParentChartDomain();
		let categoryIndex = domain.getCategories().getIndex(category);
		let axis = domain.getChartAxis();
		let axisStructure = structure.putNewStructure(oFF.HighChartConstants.K_AXIS);
		axisStructure.putString(oFF.HighChartConstants.V_NAME, axis.getName());
		let categoryStructure = axisStructure.putNewStructure(oFF.HighChartConstants.V_CATEGORY);
		categoryStructure.putString(oFF.HighChartConstants.V_NAME, category.getName());
		categoryStructure.putInteger(oFF.HighChartConstants.V_INDEX, categoryIndex);
	}
};
oFF.GenericHiChartRenderer.prototype.addSeriesGroupTag = function(custom, seriesGroup, seriesGroupIndex)
{
	let groupStructure = custom.putNewStructure(oFF.HighChartConstants.V_SERIES_GROUP);
	groupStructure.putInteger(oFF.HighChartConstants.V_INDEX, seriesGroupIndex);
	groupStructure.putString(oFF.HighChartConstants.V_NAME, seriesGroup.getName());
	this.addCategoryTag(groupStructure, seriesGroup.getCategory());
};
oFF.GenericHiChartRenderer.prototype.addSeriesTag = function(custom, series, seriesIndex)
{
	let seriesStructure = custom.putNewStructure(oFF.HighChartConstants.V_SERIES);
	seriesStructure.putInteger(oFF.HighChartConstants.V_INDEX, seriesIndex);
	seriesStructure.putString(oFF.HighChartConstants.V_NAME, series.getName());
	this.addCategoryTag(seriesStructure, series.getCategory());
};
oFF.GenericHiChartRenderer.prototype.appendCategoryElements = function(categoryElements, category)
{
	if (oFF.notNull(category))
	{
		categoryElements.addAll(oFF.XStream.of(category.getCategoryElements()).filter((ce) => {
			return oFF.XStringUtils.isNotNullAndNotEmpty(ce.getHeaderText());
		}).collect(oFF.XStreamCollector.toList()));
	}
};
oFF.GenericHiChartRenderer.prototype.buildAxes = function(axes, kAxis, groupsPerAxis)
{
	let axisObject = null;
	if (oFF.XCollectionUtils.hasElements(axes))
	{
		let maxPosition = oFF.XStream.of(axes).reduce(oFF.XIntegerValue.create(0), (a, b) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), oFF.XMath.max(b.getFrom(), b.getTo())));
		}).getInteger();
		let axesSize = axes.size();
		if (axesSize === 1)
		{
			axisObject = this.m_chartJson.putNewStructure(kAxis);
			this.buildAxis(kAxis, 0, axes.get(0), axisObject, maxPosition, groupsPerAxis);
		}
		else
		{
			let axesList = this.m_chartJson.putNewList(kAxis);
			for (let i = 0; i < axesSize; i++)
			{
				axisObject = axesList.addNewStructure();
				this.buildAxis(kAxis, i, axes.get(i), axisObject, maxPosition, groupsPerAxis);
			}
		}
	}
	return axisObject;
};
oFF.GenericHiChartRenderer.prototype.buildAxis = function(axisType, axisIndex, chartAxis, axisObject, maxPosition, groupsPerAxis)
{
	let i;
	oFF.GenericHighChartConverter.buildCustomAxisContent(axisObject.putNewStructure(oFF.HighChartConstants.V_CUSTOM), axisType, axisIndex, chartAxis.getName());
	if (chartAxis.getAxisDomain().getAxisDomainType().isTypeOf(oFF.ChartAxisDomainType.CATEGORIAL))
	{
		let domainCategorial = chartAxis.getAxisDomain().getAsCategorial();
		oFF.CategoricalAxisRenderer.create().renderCategoricalAxis(axisType, axisIndex, chartAxis.getName(), domainCategorial, axisObject);
		let groupSize = groupsPerAxis.getByKey(chartAxis.getName());
		oFF.GenericHighChartConverter.chartScrollBuilder(this.m_chartJson, this.m_chartVisualization, axisObject, domainCategorial, oFF.isNull(groupSize) ? 1 : groupSize.getInteger());
	}
	else
	{
		let scalarDomain = chartAxis.getAxisDomain();
		if (!this.isPercentageAxis(chartAxis))
		{
			if (scalarDomain.getMax() > scalarDomain.getMin())
			{
				if (scalarDomain.getMin() < 0)
				{
					axisObject.putDouble(oFF.HighChartConstants.K_MIN, scalarDomain.getMin());
				}
				if (scalarDomain.getMax() > 0)
				{
					axisObject.putDouble(oFF.HighChartConstants.K_MAX, scalarDomain.getMax());
				}
			}
			let chartType = this.m_chartVisualization.getChartType();
			if (chartType.isTypeOf(oFF.ChartVisualizationType.STACKED_BAR) || chartType.isTypeOf(oFF.ChartVisualizationType.STACKED_COLUMN) || chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK))
			{
				let axisStackLabels = axisObject.putNewStructure(oFF.HighChartConstants.K_STACK_LABELS);
				let dcat = this.m_chartVisualization.getDistributionAxis().getAxisDomain().getAsCategorial().getCategories();
				let uniqueDecimalPlaces = 0;
				if (oFF.XCollectionUtils.hasElements(dcat))
				{
					let distributionCategory = dcat.get(0);
					uniqueDecimalPlaces = distributionCategory.getUniqueDecimalPlaces();
					for (i = 1; i < dcat.size(); i++)
					{
						distributionCategory = dcat.get(i);
						if (uniqueDecimalPlaces !== distributionCategory.getUniqueDecimalPlaces())
						{
							uniqueDecimalPlaces = 0;
						}
					}
				}
				let effectiveDecimalPlaces = uniqueDecimalPlaces < 0 ? 2 : uniqueDecimalPlaces;
				axisStackLabels.putString(oFF.HighChartConstants.K_FORMAT, oFF.XStringUtils.concatenate3("{total:,.", oFF.XInteger.convertToString(effectiveDecimalPlaces), "f}"));
				axisStackLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
				if (chartType.isTypeOf(oFF.ChartVisualizationType.BAR))
				{
					let stackLabelsStlye = axisStackLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
					stackLabelsStlye.putString(oFF.HighChartConstants.K_COLOR, "rgb(88,89,91)");
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_SIZE, "12px");
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_STYLE, oFF.HighChartConstants.V_NORMAL);
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_WEIGHT, oFF.HighChartConstants.K_BOLD);
				}
				else if (chartType.isTypeOf(oFF.ChartVisualizationType.COLUMN))
				{
					axisStackLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_CENTER);
					axisStackLabels.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.HighChartConstants.V_POSITION_TOP);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_Y, -20);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_X, 5);
				}
				else
				{
					axisStackLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_CENTER);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_Y, -20);
				}
			}
		}
	}
	axisObject.putNewStructure(oFF.HighChartConstants.K_TITLE).putString(oFF.HighChartConstants.K_TEXT, chartAxis.getText());
	axisObject.putBoolean(oFF.HighChartConstants.K_OPPOSITE, chartAxis.isScaleOpposite());
	axisObject.putInteger(oFF.HighChartConstants.K_GRID_LINE_WIDTH, chartAxis.getGridLineWidth());
	if (chartAxis.isScaleReversed())
	{
		axisObject.putBoolean(oFF.HighChartConstants.K_REVERSED, chartAxis.isScaleReversed());
	}
	if (maxPosition > 0)
	{
		let maxValue = oFF.XDoubleValue.create(maxPosition).getDouble();
		let offset = oFF.XDoubleValue.create(chartAxis.getFrom()).getDouble();
		let cutoff = oFF.XDoubleValue.create(chartAxis.getTo()).getDouble();
		let widthPercent = oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * (cutoff - offset) / maxValue - 2), "%");
		if (chartAxis.getPosition().isTypeOf(oFF.ChartVisualizationAxisPosition.X))
		{
			axisObject.putString(oFF.HighChartConstants.V_POSITION_LEFT, oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * offset / maxValue + 2), "%"));
			axisObject.putString(oFF.HighChartConstants.K_WIDTH, widthPercent);
		}
		else if (chartAxis.getPosition().isTypeOf(oFF.ChartVisualizationAxisPosition.Y))
		{
			axisObject.putString(oFF.HighChartConstants.V_POSITION_TOP, oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * (maxValue - cutoff) / maxValue + 2), "%"));
			axisObject.putString(oFF.HighChartConstants.K_HEIGHT, widthPercent);
		}
	}
	axisObject.putString(oFF.HighChartConstants.K_ID, chartAxis.getName());
	let plotBands = chartAxis.getPlotBands();
	if (oFF.XCollectionUtils.hasElements(plotBands))
	{
		let plotBandsList = axisObject.putNewList(oFF.HighChartConstants.K_PLOT_BANDS);
		for (i = 0; i < plotBands.size(); i++)
		{
			this.buildPlotBand(plotBandsList.addNewStructure(), plotBands.get(i));
		}
	}
	let plotLines = chartAxis.getPlotLines();
	if (oFF.XCollectionUtils.hasElements(plotLines))
	{
		let plotLinesList = axisObject.putNewList(oFF.HighChartConstants.K_PLOT_LINES);
		for (i = 0; i < plotLines.size(); i++)
		{
			this.buildPlotLine(plotLinesList.addNewStructure(), plotLines.get(i));
		}
	}
	return axisObject;
};
oFF.GenericHiChartRenderer.prototype.buildColorAxis = function()
{
	if (this.m_chartVisualization.isUseColorAxis())
	{
		let colorAxis = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_COLOR_AXIS);
		this.decorateWithStyle(colorAxis, oFF.HighChartConstants.K_MIN_COLOR, this.m_chartVisualization.getMinColor());
		this.decorateWithStyle(colorAxis, oFF.HighChartConstants.K_MAX_COLOR, this.m_chartVisualization.getMaxColor());
	}
};
oFF.GenericHiChartRenderer.prototype.buildCoordinateSystems = function()
{
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	let seriesList = this.m_chartJson.putNewList(oFF.HighChartConstants.K_SERIES);
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		let seriesGroups = coordinateSystem.getSeriesGroups();
		for (let j = 0; j < seriesGroups.size(); j++)
		{
			let seriesGroup = seriesGroups.get(j);
			let series = seriesGroup.getSeries();
			for (let k = 0; k < series.size(); k++)
			{
				this.buildSeriesExt(i, j, k, seriesList, coordinateSystem, seriesGroup, series.get(k));
			}
		}
	}
};
oFF.GenericHiChartRenderer.prototype.buildDataPoint = function(pointList, chartDataPoint, parentPointIds, coordinateKeys, hasUnitScaleHeading)
{
	let formattedCategories = this.getFormattedCategoriesForTooltip(chartDataPoint);
	let name = this.getName(chartDataPoint);
	let pointStructure = pointList.addNewStructure();
	if (oFF.GenericHighChartConverter.isNestedPointChart(this.m_chartVisualization.getChartType()))
	{
		let elements = chartDataPoint.getCategory().getCategoryElements();
		let elementsSize = elements.size();
		let oldParent = "";
		for (let h = 0; h < elementsSize - 1; h++)
		{
			let element = elements.get(h);
			let elementName = oFF.XStringUtils.concatenate3(oldParent, ":", element.getName());
			if (!parentPointIds.contains(elementName))
			{
				let parentPointStructure = pointList.addNewStructure();
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_PARENT, oldParent);
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_ID, elementName);
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_NAME, element.getText());
				parentPointIds.add(elementName);
			}
			oldParent = elementName;
		}
		let currentElement = elements.get(elementsSize - 1);
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_PARENT, oldParent);
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_ID, oFF.XStringUtils.concatenate3(oldParent, ":", currentElement.getName()));
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_NAME, currentElement.getText());
	}
	else if (oFF.XStringUtils.isNullOrEmpty(name) && (this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.PIE) || this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.DOUGHNUT)))
	{
		this.m_messages.addString(oFF.GenericHiChartRendererMessages.NO_CHART_FOR_CURRENT_SELECTION);
	}
	else
	{
		pointStructure.putString(oFF.HighChartConstants.K_NAME, name);
	}
	pointStructure.putStringNotNullAndNotEmpty(oFF.GenericHighChartConverter.FORMATTED_CATEGORIES, formattedCategories);
	if (!this.m_chartVisualization.isUseColorAxis())
	{
		this.decorateWithStyle(pointStructure, oFF.HighChartConstants.K_COLOR, chartDataPoint.getEffectiveStyle());
	}
	let coordinates = chartDataPoint.getCoordinates();
	for (let i = 0; i < coordinates.size(); i++)
	{
		let coordinate = coordinates.get(i);
		let value = coordinate.getValue();
		let coordinateName = oFF.GenericHighChartConverter.getCoordinateName(this.m_chartVisualization.getChartType(), coordinate.getName());
		if (value.getValueType().isNumber())
		{
			let doubleValue = oFF.XValueUtil.getDouble(value, false, true);
			if (oFF.XString.isEqual(coordinate.getName(), oFF.GenericHighChartConverter.getPieAndDoughnutVisualizationValueType()))
			{
				doubleValue = doubleValue < 0 ? doubleValue * -1 : doubleValue;
			}
			pointStructure.putDouble(coordinateName, doubleValue);
		}
		else if (chartDataPoint.isEmptyValue())
		{
			pointStructure.putNull(coordinateName);
		}
		else
		{
			pointStructure.putString(coordinateName, oFF.XValueUtil.getString(value));
		}
		let fullFormattedText = coordinate.getFullFormattedText();
		let formattedText = hasUnitScaleHeading ? coordinate.getFormattedText() : fullFormattedText;
		let heading = coordinate.getHeading();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(formattedText) && oFF.XStringUtils.isNotNullAndNotEmpty(fullFormattedText) && oFF.XStringUtils.isNotNullAndNotEmpty(heading))
		{
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverter.FULL_FORMATTING_SUFFIX), fullFormattedText);
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverter.FORMATTING_SUFFIX), formattedText);
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverter.HEADING_SUFFIX), heading);
			if (!coordinateKeys.contains(coordinateName))
			{
				coordinateKeys.add(coordinateName);
			}
		}
	}
	return pointStructure;
};
oFF.GenericHiChartRenderer.prototype.buildPlotBand = function(structure, plotBand)
{
	structure.putDouble(oFF.HighChartConstants.K_FROM, plotBand.getFrom());
	structure.putDouble(oFF.HighChartConstants.K_TO, plotBand.getTo());
	structure.putDouble(oFF.HighChartConstants.K_BORDER_WIDTH, plotBand.getBorderWidth());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, plotBand.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_BORDER_COLOR, plotBand.getBorderColor());
	let label = structure.putNewStructure(oFF.HighChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TEXT, plotBand.getText());
};
oFF.GenericHiChartRenderer.prototype.buildPlotLine = function(structure, plotLine)
{
	structure.putDouble(oFF.HighChartConstants.K_VALUE, plotLine.getValue());
	structure.putDouble(oFF.HighChartConstants.K_WIDTH, plotLine.getWidth());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, plotLine.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_DASH_STYLE, plotLine.getDashStyle());
	structure.putDouble(oFF.HighChartConstants.K_Z_INDEX, 6);
	let label = structure.putNewStructure(oFF.HighChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TEXT, plotLine.getText());
};
oFF.GenericHiChartRenderer.prototype.buildSeriesExt = function(coordinateSystemIndex, seriesGroupIndex, seriesIndex, seriesList, coordinateSystem, seriesGroup, series)
{
	let chartDataPoints = series.getChartDataPoints();
	if (this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) && oFF.XStream.of(chartDataPoints).anyMatch((cdp) => {
		return cdp.hasStylingCategories();
	}))
	{
		let styleSeriesIndex = oFF.XLinkedHashMapByString.create();
		for (let i = 0; i < chartDataPoints.size(); i++)
		{
			let chartDataPoint = chartDataPoints.get(i);
			let pointCategories = chartDataPoint.getStylingCategories();
			let key = oFF.XCollectionUtils.join(oFF.XStream.of(pointCategories).filterNullValues().collect(oFF.XStreamCollector.toListOfString((k) => {
				return k.getName();
			})), ":");
			if (!styleSeriesIndex.containsKey(key))
			{
				styleSeriesIndex.put(key, oFF.XList.create());
			}
			styleSeriesIndex.getByKey(key).add(oFF.XIntegerValue.create(i));
		}
		let styleKeys = styleSeriesIndex.getKeysAsIterator();
		while (styleKeys.hasNext())
		{
			let styleKey = styleKeys.next();
			let indices = styleSeriesIndex.getByKey(styleKey);
			this.buildSeriesWithIndex(seriesList.addNewStructure(), coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, indices, series.getChartDataPoints().get(indices.get(0).getInteger()).getStylingCategories());
		}
	}
	else
	{
		this.buildSeriesWithIndex(seriesList.addNewStructure(), coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, null, null);
	}
};
oFF.GenericHiChartRenderer.prototype.buildSeriesWithIndex = function(seriesStructure, coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, indices, stylingCategories)
{
	let mergableCategories = oFF.XList.create();
	if (oFF.XCollectionUtils.hasElements(stylingCategories))
	{
		mergableCategories.addAll(stylingCategories);
	}
	mergableCategories.add(seriesGroup.getCategory());
	mergableCategories.add(series.getCategory());
	let seriesHeading = this.extractSeriesHeadingFromCategory(mergableCategories);
	let hasUnitScaleHeading = oFF.XStream.of(mergableCategories).filterNullValues().anyMatch((cat) => {
		return oFF.XStringUtils.isNotNullAndNotEmpty(cat.getUniqueUnitScaleInformation());
	});
	let seriesStyle = series.getEffectiveStyleWithCategories(stylingCategories);
	this.decorateWithStyle(seriesStructure, oFF.HighChartConstants.K_COLOR, seriesStyle);
	let chartDataPoints = series.getChartDataPoints();
	let custom = seriesStructure.putNewStructure(oFF.HighChartConstants.V_CUSTOM);
	let axisReference;
	if (coordinateSystem.getXAxisReference() !== null && !coordinateSystem.getXAxisReference().isHidden())
	{
		axisReference = coordinateSystem.getXAxisReference();
		seriesStructure.putString(oFF.HighChartConstants.K_X_AXIS, axisReference.getName());
		oFF.GenericHighChartConverter.buildCustomAxisContent(custom, oFF.HighChartConstants.K_X_AXIS, this.m_chartVisualization.getXAxes().getIndex(axisReference), axisReference.getName());
	}
	if (coordinateSystem.getYAxisReference() !== null && !coordinateSystem.getYAxisReference().isHidden())
	{
		axisReference = coordinateSystem.getYAxisReference();
		seriesStructure.putString(oFF.HighChartConstants.K_Y_AXIS, axisReference.getName());
		oFF.GenericHighChartConverter.buildCustomAxisContent(custom, oFF.HighChartConstants.K_Y_AXIS, this.m_chartVisualization.getYAxes().getIndex(axisReference), axisReference.getName());
	}
	this.addSeriesGroupTag(custom, seriesGroup, seriesGroupIndex);
	this.addSeriesTag(custom, series, seriesIndex);
	seriesStructure.putString(oFF.HighChartConstants.K_NAME, seriesHeading);
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_STACK, seriesGroup.getName());
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TYPE, oFF.GenericHighChartConverter.getChartTypeStringWithFallback(seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_INNER_SIZE, oFF.GenericHighChartConverter.getInnerRadius(seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	seriesStructure.putBoolean(oFF.HighChartConstants.K_SHOW_IN_LEGEND, true);
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_STACKING, oFF.GenericHighChartConverter.getStackingType(seriesGroup.getName(), seriesGroup.getStackingType(), seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	let data = seriesStructure.putNewList(oFF.HighChartConstants.K_DATA);
	if (oFF.GenericHighChartConverter.needsDirectDataLabels(this.m_chartVisualization.getChartType()))
	{
		let dataLabels = seriesStructure.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		dataLabels.putString(oFF.HighChartConstants.K_POINT_FORMAT, "{point.valueFormatted}");
		dataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
	}
	if (oFF.GenericHighChartConverter.isNestedPointChart(this.m_chartVisualization.getChartType()))
	{
		let objectLevels = seriesStructure.putNewList(oFF.HighChartConstants.K_LEVELS);
		let objectLevel1 = objectLevels.addNewStructure();
		objectLevel1.putInteger(oFF.HighChartConstants.K_LEVEL, 1);
		objectLevel1.putInteger(oFF.HighChartConstants.K_BORDER_WIDTH, 6);
		let objectLevelDataLabels = objectLevel1.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		objectLevelDataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_FORMAT, "<div>{point.name}</div><br/>");
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.HighChartConstants.V_POSITION_TOP);
		let objectLevelDataLabelsStyle = objectLevelDataLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		objectLevelDataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "14px");
		let objectLevel2 = objectLevels.addNewStructure();
		objectLevel2.putInteger(oFF.HighChartConstants.K_LEVEL, 2);
		let objectLevelDataLabels1 = objectLevel2.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		objectLevelDataLabels1.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		objectLevelDataLabels1.putString(oFF.HighChartConstants.K_FORMAT, "<div>{point.name}</div><br/><div>{point.valueFormatted}</div >");
	}
	let parentPointIds = oFF.XHashSetOfString.create();
	let coordinateList = oFF.XList.create();
	if (!this.m_chartVisualization.getChartType().isAllowsPositiveAndNegativeValuesMix() && series.doesCoordinateHavePositiveAndNegativeValues(oFF.GenericHighChartConverter.getPieAndDoughnutVisualizationValueType()))
	{
		this.m_messages.addString(oFF.GenericHiChartRendererMessages.POSITIVE_NEGATIVE_ERROR);
		return;
	}
	for (let i = 0; i < chartDataPoints.size(); i++)
	{
		let chartDataPoint = chartDataPoints.get(i);
		if (oFF.notNull(chartDataPoint) && (oFF.isNull(indices) || indices.contains(oFF.XIntegerValue.create(i))))
		{
			let pointStructure = this.buildDataPoint(data, chartDataPoint, parentPointIds, coordinateList, hasUnitScaleHeading);
			custom = pointStructure.putNewStructure(oFF.HighChartConstants.V_CUSTOM);
			this.addSeriesGroupTag(custom, seriesGroup, seriesGroupIndex);
			this.addSeriesTag(custom, series, seriesIndex);
			this.addCategoryTag(custom.putNewStructure(oFF.HighChartConstants.V_DATA_POINT), chartDataPoint.getCategory());
		}
		else if (oFF.GenericHighChartConverter.needsNullDataPoints(this.m_chartVisualization.getChartType()))
		{
			data.addNewStructure();
		}
	}
	let toolTipBuffer = oFF.XStringBuffer.create();
	toolTipBuffer.append("{point.");
	toolTipBuffer.append(oFF.GenericHighChartConverter.FORMATTED_CATEGORIES);
	toolTipBuffer.append("}");
	for (let j = 0; j < coordinateList.size(); j++)
	{
		let coordinateKey = coordinateList.get(j);
		toolTipBuffer.append("<b>{point.");
		toolTipBuffer.append(coordinateKey);
		toolTipBuffer.append(oFF.GenericHighChartConverter.HEADING_SUFFIX);
		toolTipBuffer.append("}</b>: {point.");
		toolTipBuffer.append(coordinateKey);
		toolTipBuffer.append(oFF.GenericHighChartConverter.FULL_FORMATTING_SUFFIX);
		toolTipBuffer.append("}");
	}
	let tooltip = seriesStructure.putNewStructure(oFF.HighChartConstants.K_TOOLTIP);
	tooltip.putString(oFF.HighChartConstants.K_POINT_FORMAT, toolTipBuffer.toString());
	tooltip.putString(oFF.HighChartConstants.K_HEADER_FORMAT, "");
};
oFF.GenericHiChartRenderer.prototype.buildTitle = function()
{
	let chartTitle = this.m_chartVisualization.getTitle();
	let chartSubTitle = this.m_chartVisualization.getSubtitle();
	if (oFF.notNull(chartTitle))
	{
		let title = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_TITLE);
		title.putString(oFF.HighChartConstants.K_TEXT, chartTitle);
		title.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
	}
	if (oFF.notNull(chartSubTitle))
	{
		let subtitle = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
		subtitle.putString(oFF.HighChartConstants.K_TEXT, chartSubTitle);
		subtitle.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
	}
};
oFF.GenericHiChartRenderer.prototype.buildXAxes = function(groupsPerAxis)
{
	let axisObject = this.buildAxes(this.m_chartVisualization.getXAxes(), oFF.HighChartConstants.K_X_AXIS, groupsPerAxis);
	if (oFF.notNull(axisObject))
	{
		let labelsObject = axisObject.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let groupedOptionsObject = labelsObject.putNewStructure(oFF.HighChartConstants.K_GROUPED_OPTIONS);
		let styleObject = groupedOptionsObject.putNewStructure(oFF.HighChartConstants.K_STYLE);
		styleObject.putInteger(oFF.HighChartConstants.K_WIDTH, 10);
	}
};
oFF.GenericHiChartRenderer.prototype.buildYAxes = function(groupsPerAxis)
{
	this.buildAxes(this.m_chartVisualization.getYAxes(), oFF.HighChartConstants.K_Y_AXIS, groupsPerAxis);
};
oFF.GenericHiChartRenderer.prototype.buildZAxes = function(groupsPerAxis)
{
	this.buildAxes(this.m_chartVisualization.getZAxes(), oFF.HighChartConstants.K_Z_AXIS, groupsPerAxis);
};
oFF.GenericHiChartRenderer.prototype.decorateGroupsPerAxis = function(groupsPerAxis, name, groupSize)
{
	if (!groupsPerAxis.containsKey(name))
	{
		groupsPerAxis.put(name, oFF.XIntegerValue.create(groupSize));
	}
	else
	{
		groupsPerAxis.put(name, oFF.XIntegerValue.create(groupSize + groupsPerAxis.getByKey(name).getInteger()));
	}
};
oFF.GenericHiChartRenderer.prototype.decorateWithStyle = function(elementToBeStyled, colorKey, effectiveStyle)
{
	let pattern = effectiveStyle.getPattern();
	let customPattern = effectiveStyle.getCustomPattern();
	let shape = effectiveStyle.getShape();
	let customShape = effectiveStyle.getCustomShape();
	let lineStyle = effectiveStyle.getLineStyle();
	if (oFF.isNull(pattern) && oFF.isNull(customPattern) || pattern === oFF.VisualizationBackgroundPatternType.SOLID)
	{
		elementToBeStyled.putStringNotNullAndNotEmpty(colorKey, effectiveStyle.getColor());
	}
	else if (pattern === oFF.VisualizationBackgroundPatternType.NOFILL)
	{
		elementToBeStyled.putString(colorKey, "#ffffff");
	}
	else
	{
		let colorStructure = elementToBeStyled.putNewStructure(colorKey);
		let patternStructure = colorStructure.putNewStructure(oFF.HighChartConstants.K_PATTERN);
		patternStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, effectiveStyle.getColor());
		if (oFF.notNull(pattern))
		{
			let patternSize = oFF.GenericHighChartConverter.getChartHatchingSize(pattern);
			patternStructure.putInteger(oFF.HighChartConstants.K_WIDTH, patternSize);
			patternStructure.putInteger(oFF.HighChartConstants.K_HEIGHT, patternSize);
			patternStructure.putString(oFF.HighChartConstants.K_PATH, oFF.GenericHighChartConverter.getChartHatchingPath(pattern));
		}
		else
		{
			patternStructure.putString(oFF.HighChartConstants.K_PATH, customPattern);
		}
	}
	elementToBeStyled.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_DASH_STYLE, oFF.GenericHighChartConverter.getDashStyleString(lineStyle));
	if (oFF.notNull(shape) || oFF.notNull(customShape))
	{
		let markerStructure = elementToBeStyled.putNewStructure(oFF.HighChartConstants.K_MARKER);
		if (oFF.notNull(shape))
		{
			markerStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_SYMBOL, oFF.GenericHighChartConverter.getShapeName(shape));
		}
		else
		{
			markerStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_SYMBOL, customShape);
		}
	}
};
oFF.GenericHiChartRenderer.prototype.extractSeriesHeadingFromCategory = function(mergableCategories)
{
	let headingParts = oFF.XList.create();
	let unitParts = oFF.XList.create();
	for (let i = 0; i < mergableCategories.size(); i++)
	{
		let mergableCategory = mergableCategories.get(i);
		if (oFF.isNull(mergableCategory))
		{
			continue;
		}
		let uniqueScalingUnit = mergableCategory.getUniqueUnitScaleInformation();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(uniqueScalingUnit))
		{
			unitParts.add(uniqueScalingUnit);
		}
		let elements = mergableCategory.getCategoryElements();
		for (let j = 0; j < elements.size(); j++)
		{
			let element = elements.get(j);
			let elementText = element.getText();
			if (!headingParts.contains(elementText))
			{
				headingParts.add(elementText);
			}
		}
	}
	let resultString = oFF.XCollectionUtils.join(headingParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR);
	if (oFF.XCollectionUtils.hasElements(unitParts))
	{
		resultString = oFF.XStringUtils.concatenate4(resultString, oFF.HighChartConstants.V_HEADING_UNIT_INFO_PREFIX, oFF.XCollectionUtils.join(unitParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR), oFF.HighChartConstants.V_HEADING_UNIT_INFO_SUFFIX);
	}
	return resultString;
};
oFF.GenericHiChartRenderer.prototype.getChartJson = function()
{
	return this.m_chartJson;
};
oFF.GenericHiChartRenderer.prototype.getFormattedCategoriesForTooltip = function(chartDataPoint)
{
	let buffer = oFF.XStringBuffer.create();
	let categoryElements = oFF.XList.create();
	this.appendCategoryElements(categoryElements, chartDataPoint.getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getParentSeriesGroup().getCategory());
	if (oFF.XCollectionUtils.hasElements(categoryElements))
	{
		let i = 0;
		while (i < categoryElements.size() && oFF.XStringUtils.isNullOrEmpty(categoryElements.get(i).getHeaderText()))
		{
			i++;
		}
		let headerText = "";
		let oldHeaderText = "";
		if (i < categoryElements.size())
		{
			headerText = categoryElements.get(i).getHeaderText();
			buffer.append("<b>");
			buffer.append(headerText);
			buffer.append("</b>");
			buffer.append(": ");
			buffer.append(categoryElements.get(i).getText());
			oldHeaderText = headerText;
		}
		for (; i < categoryElements.size(); i++)
		{
			let categoryElement = categoryElements.get(i);
			headerText = categoryElement.getHeaderText();
			if (oFF.XString.isEqual(headerText, oldHeaderText))
			{
				buffer.append(" / ");
				buffer.append(categoryElement.getText());
			}
			else if (oFF.XStringUtils.isNotNullAndNotEmpty(headerText))
			{
				buffer.append("<br/><b>");
				buffer.append(headerText);
				buffer.append("</b>: ");
				buffer.append(categoryElement.getText());
			}
			oldHeaderText = headerText;
		}
	}
	if (buffer.length() > 0)
	{
		buffer.append("<br/>");
	}
	return buffer.toString();
};
oFF.GenericHiChartRenderer.prototype.getGroupsPerAxis = function()
{
	let groupsPerAxis = oFF.XHashMapByString.create();
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		let groupSize = coordinateSystem.getSeriesGroups().size();
		this.decorateGroupsPerAxis(groupsPerAxis, coordinateSystem.getXAxisReference().getName(), groupSize);
		this.decorateGroupsPerAxis(groupsPerAxis, coordinateSystem.getYAxisReference().getName(), groupSize);
	}
	return groupsPerAxis;
};
oFF.GenericHiChartRenderer.prototype.getName = function(chartDataPoint)
{
	let buffer = oFF.XStringBuffer.create();
	let categoryElements = oFF.XList.create();
	this.appendCategoryElements(categoryElements, chartDataPoint.getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getParentSeriesGroup().getCategory());
	if (oFF.XCollectionUtils.hasElements(categoryElements))
	{
		for (let i = 0; i < categoryElements.size(); i++)
		{
			let categoryElement = categoryElements.get(i);
			buffer.append(categoryElement.getText());
			if (i < categoryElements.size() - 1)
			{
				buffer.append(" / ");
			}
		}
	}
	return buffer.toString();
};
oFF.GenericHiChartRenderer.prototype.isPercentageAxis = function(chartAxis)
{
	return oFF.XStream.of(this.m_chartVisualization.getCoordinateSystems()).filter((cos) => {
		return cos.getXAxisReference() === chartAxis || cos.getYAxisReference() === chartAxis;
	}).allMatch((cors) => {
		return oFF.XStream.of(cors.getSeriesGroups()).allMatch((csg) => {
			return csg.getStackingType() === oFF.ChartVisualizationStackingType.PERCENT;
		});
	});
};
oFF.GenericHiChartRenderer.prototype.needsPercentageLabels = function()
{
	return this.m_chartVisualization.getChartType() === oFF.ChartVisualizationType.PIE || this.m_chartVisualization.getChartType() === oFF.ChartVisualizationType.DOUGHNUT || oFF.XStream.of(this.m_chartVisualization.getCoordinateSystems()).anyMatch((cors) => {
		return oFF.XStream.of(cors.getSeriesGroups()).anyMatch((csg) => {
			return csg.getStackingType() === oFF.ChartVisualizationStackingType.PERCENT;
		});
	});
};
oFF.GenericHiChartRenderer.prototype.releaseObject = function()
{
	this.m_chartVisualization = null;
	this.m_messages = oFF.XObjectExt.release(this.m_messages);
	this.m_chartJson = oFF.XObjectExt.release(this.m_chartJson);
	this.m_resultObject = oFF.XObjectExt.release(this.m_resultObject);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.GenericHiChartRenderer.prototype.render = function()
{
	this.m_resultObject = oFF.PrFactory.createStructure();
	this.m_chartJson = this.m_resultObject.putNewStructure(oFF.GenericHiChartRenderer.CHART_JSON);
	this.m_messages = this.m_resultObject.putNewList(oFF.GenericHiChartRenderer.MESSAGES);
	let chartTypeInfo = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_CHART);
	chartTypeInfo.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 50);
	if (this.m_chartVisualization.isInverted() && this.m_chartVisualization.getChartType() !== oFF.ChartVisualizationType.BAR)
	{
		chartTypeInfo.putBoolean(oFF.HighChartConstants.K_INVERTED, true);
	}
	chartTypeInfo.putBoolean(oFF.HighChartConstants.K_POLAR, this.m_chartVisualization.isPolar());
	let chartTypeString = oFF.GenericHighChartConverter.getChartTypeString(this.m_chartVisualization.getChartType());
	chartTypeInfo.putString(oFF.HighChartConstants.K_TYPE, chartTypeString);
	let topSpacing = 50;
	let rightSpacing = 50;
	let bottomSpacing = 50;
	let leftSpacing = 50;
	let spacingPrList = chartTypeInfo.putNewList(oFF.HighChartConstants.K_SPACING);
	spacingPrList.addInteger(topSpacing);
	spacingPrList.addInteger(rightSpacing);
	spacingPrList.addInteger(bottomSpacing);
	spacingPrList.addInteger(leftSpacing);
	if (this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.BAR))
	{
		chartTypeInfo.putInteger(oFF.HighChartConstants.K_MARGIN_LEFT, 200);
	}
	chartTypeInfo.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
	let chartlang = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_LANG);
	chartlang.putString(oFF.HighChartConstants.K_DECIMAL_POINT, ",");
	chartlang.putString(oFF.HighChartConstants.K_THOUSANDS_SEP, ".");
	let backgroundColor = this.m_chartVisualization.getBackgroundColor();
	if (oFF.XStringUtils.isNullOrEmpty(backgroundColor))
	{
		backgroundColor = "rgba(0,0,0,0)";
	}
	chartTypeInfo.putString(oFF.HighChartConstants.K_BACKGROUND_COLOR, backgroundColor);
	let chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.HighChartConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	let boost = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_BOOST);
	let credits = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_CREDITS);
	credits.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
	boost.putBoolean(oFF.HighChartConstants.K_USER_GPU_TRANSLATIONS, true);
	this.buildTitle();
	let groupsPerAxis = this.getGroupsPerAxis();
	this.buildXAxes(groupsPerAxis);
	this.buildYAxes(groupsPerAxis);
	this.buildZAxes(groupsPerAxis);
	this.buildColorAxis();
	this.buildCoordinateSystems();
	oFF.GenericHighChartConverter.responsiveBuilder(chartTypeString, this.m_chartJson);
	oFF.GenericHighChartConverter.chartPlotBuilder(this.m_chartJson, chartTypeString, this.needsPercentageLabels());
	oFF.GenericHighChartConverter.chartTitleBuilder(this.m_chartJson, "", "");
	oFF.GenericHighChartConverter.chartLegendBuilder(this.m_chartJson);
	return this.m_resultObject;
};
oFF.GenericHiChartRenderer.prototype.setChartConfigration = function(chartConfig) {};

oFF.GenericHiChartRendererMessages = {

	NO_CHART_FOR_CURRENT_SELECTION:"NO_CHART_FOR_CURRENT_SELECTION",
	POSITIVE_NEGATIVE_ERROR:"POSITIVE_NEGATIVE"
};

oFF.GenericHighChartConverter = {

	COORDINATE_COLOR:"colorValue",
	COORDINATE_VALUE:"value",
	COORDINATE_X:"x",
	COORDINATE_Y:"y",
	COORDINATE_Z:"z",
	FORMATTED_CATEGORIES:"formattedCategories",
	FORMATTING_SUFFIX:"Formatted",
	FULL_FORMATTING_SUFFIX:"FormattedFull",
	HEADING_SUFFIX:"Heading",
	VISUALIZATION_CATEGORY_AXIS:"CategoryAxis",
	VISUALIZATION_CATEGORY_AXIS2:"CategoryAxis2",
	VISUALIZATION_VALUE_TYPE_COLOR:"Color",
	VISUALIZATION_VALUE_TYPE_SIZE:"Size",
	VISUALIZATION_VALUE_TYPE_VALUE:"Value",
	VISUALIZATION_VALUE_TYPE_VALUE_B:"ValueB",
	VISUALIZATION_VALUE_TYPE_VALUE_C:"ValueC",
	buildCustomAxisContent:function(custom, axisType, axisIndex, name)
	{
			let customAxis = custom.putNewStructure(oFF.HighChartConstants.K_AXIS);
		customAxis.putString(oFF.HighChartConstants.K_TYPE, axisType);
		customAxis.putInteger(oFF.HighChartConstants.V_INDEX, axisIndex);
		customAxis.putString(oFF.HighChartConstants.V_NAME, name);
		return customAxis;
	},
	buildCustomCategoryElement:function(customElement, categoryElementIndex, categoryElementName)
	{
			customElement.putInteger(oFF.HighChartConstants.V_INDEX, categoryElementIndex);
		customElement.putString(oFF.HighChartConstants.V_NAME, categoryElementName);
	},
	buildCustomCategoryWithElement:function(customCategory, categoryIndex, categoryName, categoryElementIndex, categoryElementName)
	{
			customCategory.putInteger(oFF.HighChartConstants.V_INDEX, categoryIndex);
		customCategory.putString(oFF.HighChartConstants.V_NAME, categoryName);
		oFF.GenericHighChartConverter.buildCustomCategoryElement(customCategory.putNewStructure(oFF.HighChartConstants.V_CATEGORY_ELEMENT), categoryElementIndex, categoryElementName);
	},
	chartLegendBuilder:function(theChartData)
	{
			let legend = theChartData.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		legend.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		legend.putInteger(oFF.HighChartConstants.K_SYMBOL_RADIUS, 0);
		legend.putString(oFF.HighChartConstants.K_LAYOUT, oFF.HighChartConstants.V_VERTICAL);
		legend.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_RIGHT);
		legend.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.HighChartConstants.V_POSITION_TOP);
		legend.putBoolean(oFF.HighChartConstants.K_SQUARE_SYMBOL, true);
		let legenditemStyle = legend.putNewStructure(oFF.HighChartConstants.K_ITEM_STYLE);
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "12px");
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, oFF.HighChartConstants.V_NORMAL);
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "12px");
		legenditemStyle.putInteger(oFF.HighChartConstants.K_WIDTH, 150);
		legenditemStyle.putString(oFF.HighChartConstants.K_TEXT_OVERFLOW, "ellipsis");
		let legendItemHoverStyle = legend.putNewStructure(oFF.HighChartConstants.K_ITEM_HOVER_STYLE);
		legendItemHoverStyle.putString(oFF.HighChartConstants.K_CURSOR_STYLE, "default");
	},
	chartPlotBuilder:function(theChartData, chartType, needsPercentageLabels)
	{
			let isDataLabels = true;
		let plotOptions = theChartData.getStructureByKey(oFF.HighChartConstants.K_PLOT_OPTIONS);
		if (oFF.isNull(plotOptions))
		{
			plotOptions = theChartData.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
		}
		let plotOptionsSeries = plotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
		plotOptionsSeries.putInteger(oFF.HighChartConstants.K_CROP_THRESHOLD, 1000);
		plotOptionsSeries.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
		let plotOptionChartTypeStructure = plotOptions.putNewStructure(chartType);
		if (oFF.XString.isEqual(chartType, oFF.HighChartConstants.K_PIE))
		{
			let chartOptionsStates = plotOptionChartTypeStructure.putNewStructure(oFF.HighChartConstants.K_STATES);
			let chartOptionsSelected = chartOptionsStates.putNewStructure(oFF.HighChartConstants.K_SELECT);
			chartOptionsSelected.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
			chartOptionsSelected.putString(oFF.HighChartConstants.K_COLOR, "#c0c0c0");
		}
		plotOptionChartTypeStructure.putBoolean(oFF.HighChartConstants.K_GROUPING, true);
		let dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		dataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, isDataLabels);
		if (needsPercentageLabels)
		{
			dataLabels.putString(oFF.HighChartConstants.K_FORMAT, "{point.percentage:.2f} %");
		}
		else
		{
			dataLabels.putString(oFF.HighChartConstants.K_FORMAT, "{point.yFormatted} ");
		}
		let dataLabelsStyle = dataLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, oFF.HighChartConstants.V_FONT_WEIGHT_BOLD);
		dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
		dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "12px");
		dataLabelsStyle.putString(oFF.HighChartConstants.K_COLOR, "rgb(88,89,91)");
	},
	chartScrollBuilder:function(theChartData, chartVisualization, chartAxisStruct, chartAxisDomainCategorial, groupSize)
	{
			if (chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.ABSTRACT_SERIES))
		{
			let xSize = chartAxisDomainCategorial.getCategories().size();
			let scrollbarStruct = theChartData.getStructureByKey(oFF.HighChartConstants.K_SCROLL_BAR);
			if (oFF.isNull(scrollbarStruct))
			{
				scrollbarStruct = theChartData.putNewStructure(oFF.HighChartConstants.K_SCROLL_BAR);
			}
			if (xSize > oFF.HighChartConstants.X_LIMIT)
			{
				chartAxisStruct.putInteger(oFF.HighChartConstants.K_MAX, oFF.HighChartConstants.X_LIMIT);
				scrollbarStruct.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
			}
			else
			{
				scrollbarStruct.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
				chartAxisStruct.putInteger(oFF.HighChartConstants.K_MAX, xSize - 1);
			}
		}
	},
	chartTitleBuilder:function(theChartData, charTtitle, chartSubtitle)
	{
			if (oFF.notNull(charTtitle))
		{
			let title = theChartData.putNewStructure(oFF.HighChartConstants.K_TITLE);
			title.putString(oFF.HighChartConstants.K_TEXT, charTtitle);
			title.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		}
		if (oFF.notNull(chartSubtitle))
		{
			let subtitle = theChartData.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
			subtitle.putString(oFF.HighChartConstants.K_TEXT, chartSubtitle);
			subtitle.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		}
	},
	getChartHatchingPath:function(patternType)
	{
			let path = null;
		if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING1;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING2;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING3;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING4;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING5;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING6;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING7;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING8;
		}
		return path;
	},
	getChartHatchingSize:function(patternType)
	{
			let size = 0;
		if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING1;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING2;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING3;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING4;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING5;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING6;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING7;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING8;
		}
		return size;
	},
	getChartTypeString:function(chartVisualizationType)
	{
			let result = oFF.isNull(chartVisualizationType) ? "None" : oFF.XString.toLowerCase(chartVisualizationType.getName());
		if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.BAR))
		{
			result = oFF.HighChartConstants.V_CHART_TYPE_BAR;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.COLUMN))
		{
			result = oFF.HighChartConstants.V_CHART_TYPE_COLUMN;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.PIE) || chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.DOUGHNUT))
		{
			result = oFF.HighChartConstants.V_TYPE_CHART_PIE;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.SCATTER_PLOT))
		{
			result = oFF.HighChartConstants.K_SCATTER;
		}
		return result;
	},
	getChartTypeStringWithFallback:function(chartType, chartTypeFallback)
	{
			return oFF.GenericHighChartConverter.getChartTypeString(oFF.isNull(chartType) ? chartTypeFallback : chartType);
	},
	getCoordinateName:function(chartType, name)
	{
			if (chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) || chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK) || chartType.isTypeOf(oFF.ChartVisualizationType.AREA) || chartType.isTypeOf(oFF.ChartVisualizationType.LINE) || chartType.isTypeOf(oFF.ChartVisualizationType.SPLINE))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE_B) || oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE_C))
			{
				return oFF.GenericHighChartConverter.COORDINATE_Y;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.PIE) || chartType.isTypeOf(oFF.ChartVisualizationType.DOUGHNUT))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverter.COORDINATE_Y;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.SCATTER_PLOT) || chartType.isTypeOf(oFF.ChartVisualizationType.BUBBLE))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE))
			{
				return oFF.GenericHighChartConverter.COORDINATE_X;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE_B))
			{
				return oFF.GenericHighChartConverter.COORDINATE_Y;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE_C) || oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverter.COORDINATE_Z;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.PACKED_BUBBLE) || chartType.isTypeOf(oFF.ChartVisualizationType.TREE_MAP))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverter.COORDINATE_VALUE;
			}
		}
		if (chartType.isTypeOf(oFF.ChartVisualizationType.HEAT_MAP))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverter.COORDINATE_VALUE;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_CATEGORY_AXIS))
			{
				return oFF.GenericHighChartConverter.COORDINATE_Y;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_CATEGORY_AXIS2))
			{
				return oFF.GenericHighChartConverter.COORDINATE_X;
			}
		}
		if (oFF.XString.isEqual(name, oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_COLOR))
		{
			return oFF.GenericHighChartConverter.COORDINATE_COLOR;
		}
		return name;
	},
	getDashStyleString:function(lineStyle)
	{
			let result = null;
		if (lineStyle === oFF.ChartVisualizationLineStyle.SOLID)
		{
			result = oFF.HighChartConstants.V_LINE_SOLID;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH_DOT_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DOT)
		{
			result = oFF.HighChartConstants.V_LINE_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DASH)
		{
			result = oFF.HighChartConstants.V_LINE_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH_DOT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH_DOT_DOT;
		}
		return result;
	},
	getInnerRadius:function(chartType, chartTypeFallback)
	{
			let currentChartType = oFF.isNull(chartType) ? chartTypeFallback : chartType;
		let innerRadius = null;
		if (currentChartType === oFF.ChartVisualizationType.DOUGHNUT)
		{
			innerRadius = "50%";
		}
		return innerRadius;
	},
	getPieAndDoughnutVisualizationValueType:function()
	{
			return oFF.GenericHighChartConverter.VISUALIZATION_VALUE_TYPE_SIZE;
	},
	getShapeName:function(shape)
	{
			let shapeName = null;
		if (shape === oFF.VisualizationChartPointShape.CIRCLE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_CIRCLE;
		}
		else if (shape === oFF.VisualizationChartPointShape.SQUARE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_SQUARE;
		}
		else if (shape === oFF.VisualizationChartPointShape.DIAMOND)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_DIAMOND;
		}
		else if (shape === oFF.VisualizationChartPointShape.TRIANGLE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_TRIANGLE;
		}
		else if (shape === oFF.VisualizationChartPointShape.TRIANGLE_DOWN)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_TRIANGLE_DOWN;
		}
		return shapeName;
	},
	getStackingType:function(stackName, stackingType, chartType, chartTypeFallback)
	{
			let chartTypeEffective = oFF.isNull(chartType) ? chartTypeFallback : chartType;
		let stackingTypeEffective = stackingType;
		if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) && stackingType !== oFF.ChartVisualizationStackingType.PERCENT)
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NORMAL;
		}
		else if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.LINE))
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NONE;
		}
		else if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.AREA))
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NORMAL;
		}
		if (stackingTypeEffective === oFF.ChartVisualizationStackingType.NORMAL)
		{
			return oFF.HighChartConstants.V_NORMAL;
		}
		else if (stackingTypeEffective === oFF.ChartVisualizationStackingType.PERCENT)
		{
			return oFF.HighChartConstants.V_PERCENT;
		}
		else
		{
			return null;
		}
	},
	isNestedPointChart:function(chartType)
	{
			return chartType === oFF.ChartVisualizationType.TREE_MAP;
	},
	needsDirectDataLabels:function(chartVisualizationType)
	{
			return chartVisualizationType === oFF.ChartVisualizationType.HEAT_MAP;
	},
	needsNullDataPoints:function(chartType)
	{
			return chartType.isTypeOf(oFF.ChartVisualizationType.ABSTRACT_SERIES);
	},
	responsiveBuilder:function(chartType, theChartData)
	{
			let responsive = theChartData.putNewStructure(oFF.HighChartConstants.K_RESPONSIVE);
		let rules = responsive.putNewList(oFF.HighChartConstants.K_RULES);
		let rules3Object = rules.addNewStructure();
		let conditionStruct3 = rules3Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		conditionStruct3.putInteger(oFF.HighChartConstants.K_MAX_HEIGHT, 176);
		let chartOptions3Rules = rules3Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chartOptionsLegend3 = chartOptions3Rules.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		chartOptionsLegend3.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
		let chartOptions3yAxis = chartOptions3Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptions3yAxisLabel = chartOptions3yAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		chartOptions3yAxisLabel.putInteger(oFF.HighChartConstants.K_ROTATION, 344);
		chartOptions3yAxisLabel.putInteger(oFF.HighChartConstants.K_X, 10);
		let rules1Object = rules.addNewStructure();
		let conditionStruct = rules1Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		conditionStruct.putInteger(oFF.HighChartConstants.K_MAX_WIDTH, 359);
		conditionStruct.putInteger(oFF.HighChartConstants.K_MIN_HEIGHT, 70);
		let chartOptions1Rules = rules1Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chartInfo = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_CHART);
		chartInfo.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
		let topSpacing = 50;
		let rightSpacing = 50;
		let bottomSpacing = 50;
		let leftSpacing = 50;
		let spacingPrList = chartInfo.putNewList(oFF.HighChartConstants.K_SPACING);
		spacingPrList.addInteger(topSpacing);
		spacingPrList.addInteger(rightSpacing);
		spacingPrList.addInteger(bottomSpacing);
		spacingPrList.addInteger(leftSpacing);
		let chartOptionsPlotOptions = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
		let chartOptionsPlotOptionsSeries = chartOptionsPlotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
		let chartOptionsDatalabels = chartOptionsPlotOptionsSeries.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		let chartOptionsDatalabelsStyle = chartOptionsDatalabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		if (oFF.XString.isEqual(chartType, oFF.HighChartConstants.K_PIE))
		{
			chartOptionsDatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
			chartOptionsDatalabels.putInteger(oFF.HighChartConstants.K_CONNECTOR_WIDTH, 0);
			chartOptionsDatalabels.putInteger(oFF.HighChartConstants.K_DISTANCE, -30);
			chartOptionsDatalabels.putBoolean(oFF.HighChartConstants.K_INSIDE, true);
			chartInfo.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 40);
			chartOptionsDatalabels.putString(oFF.HighChartConstants.K_POINT_FORMAT, "{point.percentage:.2f} %");
			chartOptionsDatalabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		}
		else
		{
			chartInfo.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 50);
			chartOptionsDatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
		}
		let chartOptionsTitle = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_TITLE);
		let chartOptionsTitleStyle = chartOptionsTitle.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsTitleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "13px");
		chartOptionsTitleStyle.putBoolean(oFF.HighChartConstants.K_FLOATING, true);
		let chartOptions1subTitle = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
		chartOptions1subTitle.putString(oFF.HighChartConstants.K_TEXT, "");
		let chartOptionsxAxis = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_X_AXIS);
		let chartOptionsxAxisLabel = chartOptionsxAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptionsxAxisLabelStyle = chartOptionsxAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsxAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let chartOptionsyAxis = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptionsyAxisLabel = chartOptionsyAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptionsyAxisLabelStyle = chartOptionsyAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsyAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let rules2Object = rules.addNewStructure();
		let condition2Struct = rules2Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		condition2Struct.putInteger(oFF.HighChartConstants.K_MAX_WIDTH, 176);
		let chartOptions2Rules = rules2Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chart2Info = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_CHART);
		chart2Info.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
		let chartOptionsLegend2 = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		chartOptionsLegend2.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
		chartOptionsLegend2.putInteger(oFF.HighChartConstants.K_Y, 25);
		let chartOptions2PlotOptions = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
		let chartOptions2PlotOptionsPie = chartOptions2PlotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
		chartOptions2PlotOptionsPie.putInteger(oFF.HighChartConstants.K_MIN_SIZE, 100);
		let chartOptions2Datalabels = chartOptions2PlotOptionsPie.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		chartOptions2Datalabels.putInteger(oFF.HighChartConstants.K_CONNECTOR_WIDTH, 0);
		chartOptions2Datalabels.putInteger(oFF.HighChartConstants.K_DISTANCE, -25);
		let chartOptions2DatalabelsStyle = chartOptions2Datalabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2DatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "8px");
		chart2Info.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 40);
		let chartOptions2Title = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_TITLE);
		let chartOptions2TitleStyle = chartOptions2Title.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2TitleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let chartOptions2subTitle = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
		chartOptions2subTitle.putString(oFF.HighChartConstants.K_TEXT, "");
		let chartOptions2xAxis = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_X_AXIS);
		let chartOptions2xAxisLabel = chartOptions2xAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptions2xAxisLabelStyle = chartOptions2xAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2xAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
		let chartOptions2yAxis = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptions2yAxisLabel = chartOptions2yAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptions2yAxisLabelStyle = chartOptions2yAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2yAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
	}
};

oFF.HighChartConstants = {

	K_ACCESSIBILITY:"accessibility",
	K_ACCOUNT_ENTITY_ID:"accountEntityId",
	K_ACCOUNT_ID:"accountId",
	K_AGGREGATION_TYPE:"aggregationType",
	K_ALIGN:"align",
	K_ALLOW_OVERLAP:"allowOverlap",
	K_ANALYTIC_OBJECTS:"analyticObjects",
	K_ANIMATION:"animation",
	K_ANSWERS:"answers",
	K_AREA:"area",
	K_ARGUMENTS:"arguments",
	K_ARGUMENT_KEY_INFO:"argumentKeyInfo",
	K_ATTRIBUTE_ID:"attributeId",
	K_AUTO_ROTATION:"autoRotation",
	K_AXIS:"axis",
	K_AXIS_LABEL:"axisLabel",
	K_AXIS_LINE:"axisLine",
	K_AXIS_TICK:"axisTick",
	K_BACKGROUND:"background",
	K_BACKGROUND_COLOR:"backgroundColor",
	K_BAR_COLUMN:"barcolumn",
	K_BBACKGROUND_COLOR:"BackgroundColor",
	K_BINDINGS:"bindings",
	K_BOLD:"bold",
	K_BOOST:"boost",
	K_BORDER_COLOR:"borderColor",
	K_BORDER_WIDTH:"borderWidth",
	K_BUBBLE_STYLE:"BubbleStyle",
	K_BUBBLE_STYLING:"bubbleStyling",
	K_BUBBLE_WIDTH:"bubbleWidth",
	K_CALCULATION:"calculation",
	K_CALCULATIONS:"calculations",
	K_CALCULATION_ID:"calculationId",
	K_CALCULATION_VARIABLE:"calculation.variable",
	K_CALCULATION_VARIABLE_ENTITY_ID:"calculationVariableEntityId",
	K_CALC_DAYS_BETWEEN:"CALCDAYSBETWEEN",
	K_CALC_DEF:"def",
	K_CALC_MONTHS_BETWEEN:"CALCMONTHSBETWEEN",
	K_CALC_YEARS_BETWEEN:"CALCYEARSBETWEEN",
	K_CATEGORIES:"categories",
	K_CATEGORY:"category",
	K_CATEGORY_AXIS:"categoryAxis",
	K_CATEGORY_AXIS2:"categoryAxis2",
	K_CATEGORY_FORM:"categoryForm",
	K_CATEGORY_NAME:"categoryName",
	K_CHART:"chart",
	K_CHART_OPTIONS:"chartOptions",
	K_CLUSTER_BUBBLE:"clusterbubble",
	K_COLLISION_DETECTION:"collisionDetection",
	K_COLOR:"color",
	K_COLORS:"colors",
	K_COLOR_AXIS:"colorAxis",
	K_COLOR_BY_POINT:"colorByPoint",
	K_COLOR_FORMATTING:"colorFormatting",
	K_COLOR_NAME:"colorName",
	K_COLOR_SCHEME:"colorScheme",
	K_COLOR_SYNC:"colorSync",
	K_COLOR_VALUE:"colorValue",
	K_COLOR_VALUE_FORMATTED:"colorValueFormatted",
	K_COMB_BCL:"combbcl",
	K_COMB_STACKED_BCL:"combstackedbcl",
	K_COMPARISON_MEASURE_ID:"comparisonMeasureId",
	K_CONDITION:"condition",
	K_CONNECTOR_WIDTH:"connectorWidth",
	K_CONSTANT:"constant",
	K_CREDITS:"credits",
	K_CROP:"crop",
	K_CROP_THRESHOLD:"cropThreshold",
	K_CURSOR_STYLE:"cursor",
	K_CUSTOM_COLOR_PALETTES:"custom.color.palettes",
	K_CUSTOM_FORMATTING:"customFormatting",
	K_CUSTOM_TITLE:"customTitle",
	K_DASH_STYLE:"dashStyle",
	K_DATA:"data",
	K_DATA_LABEL:"dataLabel",
	K_DATA_LABELS:"dataLabels",
	K_DATE_TIME:"datetime",
	K_DECIMAL_PLACES:"decimalPlaces",
	K_DECIMAL_POINT:"decimalPoint",
	K_DESCRIPTION:"description",
	K_DIMENSION:"dimension",
	K_DIRECTION:"direction",
	K_DISTANCE:"distance",
	K_DP_NAME:"dpName",
	K_DP_NAMES:"dpNames",
	K_DRILL:"drill",
	K_DRILL_LEVEL:"drillLevel",
	K_DRILL_MODE:"drillMode",
	K_DYNAMIC_VALUE:"dynamicValue",
	K_ENABLED:"enabled",
	K_END:"end",
	K_END_ANGLE:"endAngle",
	K_END_DATE:"endDate",
	K_END_DATE_CURRENT_IF_NULL:"endDateCurrentIfNULL",
	K_ENTITIES:"entities",
	K_ENTITY_FORMAT_INFO:"entityFormatInfos",
	K_ENTITY_ID:"entityId",
	K_ERRORBAR:"errorbar",
	K_ERRORBARS:"errorbars",
	K_ERRORBAR_INFIX:".errorbar.",
	K_ERRORBAR_MAX:".errorbar.max",
	K_ERRORBAR_MIN:".errorbar.min",
	K_ERROR_RANGE:"errorRange",
	K_EXCEPTION_AGGREGATION:"exceptionAggregation",
	K_EXCEPTION_AGGREGATION_DIMENSIONS:"exceptionAggregationDimensions",
	K_EXCLUDE:"exclude",
	K_EXPLICIT_COLOR_ASSIGNMENTS:"explicitColorAssignments",
	K_FEED:"feed",
	K_FEED_MEMBERS:"feedMembers",
	K_FILL:"fill",
	K_FILL_COLOR:"fillColor",
	K_FILTERS:"filters",
	K_FLOATING:"floating",
	K_FONT_COLOR:"fontColor",
	K_FONT_FAMILY:"fontFamily",
	K_FONT_SIZE:"fontSize",
	K_FONT_STYLE:"fontStyle",
	K_FONT_WEIGHT:"fontWeight",
	K_FORMAT:"format",
	K_FORMATTING_INFO:"formatingInfo",
	K_FORMAT_INFO:"formatInfo",
	K_FORMAT_STRING:"formatString",
	K_FORMULA:"formula",
	K_FORMULA_ALIASES:"formulaAliases",
	K_FORMULA_AST:"ast",
	K_FORMULA_JSON:"formulaJson",
	K_FROM:"from",
	K_FULL_SCREEN_ENABLED:"fullscreenEnabled",
	K_FULL_STACKING:"fullStacking",
	K_FUNCTION:"function",
	K_GAP:"gap",
	K_GENERAL:"general",
	K_GLOBAL_OBJECTS:"GlobalObjects",
	K_GLOBAL_OBJECT_CALCULATIONS:"Calculations",
	K_GLOBAL_OBJECT_CALCULATION_VARIABLES:"CalculationVariables",
	K_GLOBAL_OBJECT_FIELD_SELECTIONS:"FieldSelections",
	K_GLOBAL_OBJECT_PAGE_FILTER:"pageFilter",
	K_GLOBAL_OBJECT_PAGE_FILTERS:"PageFilters",
	K_GLOBAL_OBJECT_STORY_FILTERS:"StoryFilters",
	K_GRADIENT:"gradient",
	K_GRADIENT_KEYS:"gradientKeys",
	K_GRIDLINE:"gridline",
	K_GRIDLINE_WIDTH:"gridLineWidth",
	K_GRID_LINE_WIDTH:"gridLineWidth",
	K_GROUP:"group",
	K_GROUPED_OPTIONS:"groupedOptions",
	K_GROUPING:"grouping",
	K_HEADER_FORMAT:"headerFormat",
	K_HEATMAP:"heatmap",
	K_HEIGHT:"height",
	K_HIDDEN:"hidden",
	K_HIDE_WHEN_OVERLAP:"hideWhenOverlap",
	K_HIGH:"high",
	K_HIGH_INCLUSIVE:"highInclusive",
	K_ID:"id",
	K_INCLUDE_ONLY_CHILDREN:"includeOnlyChildren",
	K_INCOMPLETE_DATA_INFO:"incompleteDataInfo",
	K_INNER_GROUP_SPACING:"innerGroupSpacing",
	K_INNER_RADIUS:"innerRadius",
	K_INNER_SIZE:"innerSize",
	K_INSIDE:"inside",
	K_INTERVALS:"intervals",
	K_INVERTED:"inverted",
	K_IS_AUTO_TOP_N:"isAutoTopN",
	K_IS_EXCLUDE_COLOR_SYNC:"isExcludeColorSync",
	K_IS_HIDDEN_WHEN_OVERLAP:"isHideWhenOverlap",
	K_IS_INCOMPLETE:"isIncomplete",
	K_IS_TIME_SERIES:"istimeSeries",
	K_ITEM_HOVER_STYLE:"itemHoverStyle",
	K_ITEM_STYLE:"itemStyle",
	K_KEY:"key",
	K_LABEL:"label",
	K_LABELS:"labels",
	K_LANG:"lang",
	K_LAYOUT:"layout",
	K_LAYOUT_ALGORITHM:"layoutAlgorithm",
	K_LEGEND:"legend",
	K_LEGEND_GROUP:"legendGroup",
	K_LEVEL:"level",
	K_LEVELS:"levels",
	K_LIMIT:"limit",
	K_LINE:"line",
	K_LINE_COLOR:"lineColor",
	K_LINE_WIDTH:"lineWidth",
	K_LOW:"low",
	K_LOW_INCLUSIVE:"lowInclusive",
	K_MAIN_VALUE:"mainValue",
	K_MARGIN_LEFT:"marginLeft",
	K_MARGIN_TOP:"marginTop",
	K_MARIMEKKO:"marimekko",
	K_MARKER:"marker",
	K_MARKERS:"markers",
	K_MAX:"max",
	K_MAXIMUM_FRACTION_DIGITS:"maximumFractionDigits",
	K_MAX_COLOR:"maxColor",
	K_MAX_ELEMENT:"maxElement",
	K_MAX_HEIGHT:"maxHeight",
	K_MAX_PADDING:"maxPadding",
	K_MAX_WIDTH:"maxWidth",
	K_MEASURE:"measure",
	K_MEASURE_ID:"measureId",
	K_MEASURE_SELECTIONS:"measureSelections",
	K_MEASURE_SYNC:"measureSync",
	K_MEMBER:"member",
	K_MEMBERS:"members",
	K_MEMBER_DEFINITIONS:"memberDefinitions",
	K_METRIC:"metric",
	K_MIN:"min",
	K_MINIMUM_FRACTION_DIGITS:"minimumFractionDigits",
	K_MIN_COLOR:"minColor",
	K_MIN_ELEMENT:"minElement",
	K_MIN_HEIGHT:"minHeight",
	K_MIN_PADDING:"minPadding",
	K_MIN_SIZE:"minSize",
	K_MIN_WIDTH:"minWidth",
	K_MULTIPLIER:"multiplier",
	K_NAME:"name",
	K_NNAME:"Name",
	K_NODEDEPTH:"nodedepth",
	K_NODE_FILTER:"nodeFilter",
	K_NO_DATA:"noData",
	K_NUMBER_FORMATTING:"numberFormatting",
	K_OFFSET:"offset",
	K_OPACITY:"opacity",
	K_OPPOSITE:"opposite",
	K_OPTIONS:"options",
	K_ORIENTATION:"orientation",
	K_ORIGINAL_BINDINGS:"originalBindings",
	K_ORIGINAL_VALUES:"originalValues",
	K_OUTER_RADIUS:"outerRadius",
	K_OVERFLOW:"overflow",
	K_PACKED_BUBBLE:"packedbubble",
	K_PADDING_BOTTOM:"paddingBottom",
	K_PAGE_ID:"pageId",
	K_PALETTE:"palette",
	K_PALETTE_COLORS:"paletteColors",
	K_PALETTE_DESC:"paletteDesc",
	K_PANE:"pane",
	K_PARENT:"parent",
	K_PARENT_KEY:"parentKey",
	K_PATH:"path",
	K_PATTERN:"pattern",
	K_PATTERN_FORMATTING:"patternFormatting",
	K_PATTERN_HATCHING1:"hatching1",
	K_PATTERN_HATCHING2:"hatching2",
	K_PATTERN_HATCHING3:"hatching3",
	K_PATTERN_HATCHING4:"hatching4",
	K_PATTERN_HATCHING5:"hatching5",
	K_PATTERN_HATCHING6:"hatching6",
	K_PATTERN_HATCHING7:"hatching7",
	K_PATTERN_HATCHING8:"hatching8",
	K_PATTERN_NON_FILL:"nonFill",
	K_PERCENT:"percent",
	K_PIE:"pie",
	K_PLACEHOLDER_2_ID:"placeholder2Id",
	K_PLACEMENT_STRATEGY:"placementStrategy",
	K_PLOT_AREA:"plotArea",
	K_PLOT_BANDS:"plotBands",
	K_PLOT_LINES:"plotLines",
	K_PLOT_OPTIONS:"plotOptions",
	K_POINT_FORMAT:"pointFormat",
	K_POINT_PADDING:"pointPadding",
	K_POLAR:"polar",
	K_POSITION:"position",
	K_PROPERTIES:"properties",
	K_RADAR:"radar",
	K_RANK:"ranking",
	K_RANK_BY:"rankBy",
	K_REFERENCELINES:"referenceLines",
	K_REFERENCE_MEASURE_ID:"referenceMeasureId",
	K_RESPONSIVE:"responsive",
	K_RESTRICTED_MEASURE:"restrictedMeasure",
	K_RESULT_GRANULARITY:"resultGranularity",
	K_REVERSED:"reversed",
	K_ROTATION:"rotation",
	K_ROW_LIMIT:"rowLimit",
	K_RULES:"rules",
	K_SCALE:"scale",
	K_SCATTER:"scatter",
	K_SCATTER_PLOT:"scatterplot",
	K_SCROLLABLE_PLOT_AREA:"scrollablePlotArea",
	K_SCROLL_BAR:"scrollbar",
	K_SELECT:"select",
	K_SELECTED_DIMENSION_ID:"selectedDimensionId",
	K_SELECTED_MEASURE:"selectedMeasure",
	K_SELECTIONS:"selections",
	K_SELECTION_INFOS:"selectionInfos",
	K_SERIES:"series",
	K_SERIES_X:"SeriesX",
	K_SERIES_Y:"SeriesY",
	K_SERIES_Z:"SeriesZ",
	K_SHAPE:"shape",
	K_SHAPE_OPTIONS:"shapeOptions",
	K_SHORT_DOT:"ShortDot",
	K_SHOW_FULL:"showFull",
	K_SHOW_FULL_LABEL:"showFullLabel",
	K_SHOW_IN_LEGEND:"showInLegend",
	K_SHOW_LABEL_GRIDS:"showLabelGrids",
	K_SHOW_LABEL_NAMES:"showLabelNames",
	K_SHOW_SIGN_AS:"showSignAs",
	K_SIGNED_DATA:"SignedData",
	K_SIZE:"size",
	K_SIZE_BY_ABSOLUTE_VALUE:"sizeByAbsoluteValue",
	K_SOLID_GAUGE:"solidgauge",
	K_SORT:"sort",
	K_SORT_BY:"sortBy",
	K_SOURCE:"source",
	K_SPACING:"spacing",
	K_SPACING_BOTTOM:"spacingBottom",
	K_SPACING_TOP:"spacingTop",
	K_SPLINE:"spline",
	K_SQUARE_SYMBOL:"squareSymbol",
	K_STACK:"stack",
	K_STACKED_BAR:"stackedbar",
	K_STACKED_COLUMN:"stackedcolumn",
	K_STACKING:"stacking",
	K_STACK_COLUMN_LABEL:"stackColumnLabel",
	K_STACK_LABELS:"stackLabels",
	K_START:"start",
	K_START_ANGLE:"startAngle",
	K_START_DATE:"startDate",
	K_START_DATE_CURRENT_IF_NULL:"startDateCurrentIfNULL",
	K_STATES:"states",
	K_STOPS:"stops",
	K_STORY_WIDE_SETTINGS:"storyWideSettings",
	K_STROKE:"stroke",
	K_STYLE:"style",
	K_SUBTITLE:"subtitle",
	K_SUB_TITLE:"subTitle",
	K_SUGGESTED_SUB_TITLE:"suggestedSubTitle",
	K_SUGGESTED_TITLE:"suggestedTitle",
	K_SYMBOL:"symbol",
	K_SYMBOL_RADIUS:"symbolRadius",
	K_S_KEY:"sKey",
	K_TARGET_FORMATTED:"targetFormatted",
	K_TARGET_VALUE:"targetValue",
	K_TARGET_VALUES:"targetValues",
	K_TEXT:"text",
	K_TEXT_OUTLINE:"textOutline",
	K_TEXT_OVERFLOW:"textOverflow",
	K_TEXT_SHADOW:"textShadow",
	K_THOUSANDS_SEP:"thousandsSep",
	K_THRESHOLD:"threshold",
	K_THRESHOLDS:"thresholds",
	K_THRESHOLD_REFERENCE:"thresholdReference",
	K_TICK_AMOUNT:"tickAmount",
	K_TICK_COLOR:"tickColor",
	K_TICK_LENGTH:"tickLength",
	K_TICK_WIDTH:"tickWidth",
	K_TIME_AXIS:"timeAxis",
	K_TIME_SERIES:"timeseries",
	K_TITLE:"title",
	K_TO:"to",
	K_TOOLTIP:"tooltip",
	K_TOOLTIP_VALUE_AXIS:"tooltipValueAxis",
	K_TRANSPARENT:"transparent",
	K_TREEMAP:"treemap",
	K_TYPE:"type",
	K_T_FORMATTED:"tFormatted",
	K_T_HEADER:"tHeader",
	K_UNIT:"unit",
	K_USER_DEFINED_DECIMAL_FORMAT:"userDefinedDecimalFormat",
	K_USER_DEFINED_NUMERIC_SCALES:"userDefinedNumberScales",
	K_USER_DEFINED_SHOW_SIGN_AS:"userDefinedShowSignAs",
	K_USER_GPU_TRANSLATIONS:"useGPUTranslations",
	K_USER_PREFERENCES:"userPreferences",
	K_VALUE:"value",
	K_VALUES:"values",
	K_VALUE_AXIS:"valueAxis",
	K_VALUE_AXIS2:"valueAxis2",
	K_VALUE_FORMATTED:"valueFormatted",
	K_VALUE_NAME:"valueName",
	K_VARIANCE:"variance",
	K_VARIANCES:"variances",
	K_VARIANCE_CHART:"varianceChart",
	K_VARIANCE_LABEL:"varianceLabel",
	K_VARIPIE:"variablepie",
	K_VARIWIDE:"variwide",
	K_VERTICAL_ALIGN:"verticalAlign",
	K_VISIBLE:"visible",
	K_VIZDEF_FILTERS:"VizdefFilters",
	K_WEIGHT:"weight",
	K_WEIGHT_FORMATTED:"weightFormatted",
	K_WHITE_SPACE:"whiteSpace",
	K_WIDGET_ID:"widgetId",
	K_WIDTH:"width",
	K_WORDCLOUD:"wordcloud",
	K_X:"x",
	K_X_AXIS:"xAxis",
	K_X_CATEGORY:"xCategory",
	K_X_FORMATTED:"xFormatted",
	K_X_NAME:"xName",
	K_Y:"y",
	K_Y_AXIS:"yAxis",
	K_Y_CATEGORY:"yCategory",
	K_Y_FORM:"yForm",
	K_Y_FORMATTED:"yFormatted",
	K_Y_NAME:"yName",
	K_Z:"z",
	K_Z_AXIS:"zAxis",
	K_Z_FORMATTED:"zFormatted",
	K_Z_INDEX:"zIndex",
	K_Z_NAME:"zName",
	V_ABSOLUTE:"absolute",
	V_ALL:"all",
	V_ARC:"arc",
	V_BAD:"Bad",
	V_BASE_PLOTLINE_ID:"BASE_PLOTLINE_ID",
	V_BILLION:"Billion",
	V_BLACK:"black",
	V_CATEGORY:"category",
	V_CATEGORY_ELEMENT:"categoryElement",
	V_CENTER:"center",
	V_CHART_TYPE_BAR:"bar",
	V_CHART_TYPE_BELLCURVE:"bellcurve",
	V_CHART_TYPE_BOXPLOT:"boxplot",
	V_CHART_TYPE_BUBBLE:"bubble",
	V_CHART_TYPE_COLUMN:"column",
	V_CHART_TYPE_LINE:"line",
	V_COLOR_1:"#9dc3e6",
	V_COLOR_10:"#dbdbdb",
	V_COLOR_11:"#c9c9c9",
	V_COLOR_12:"#7c7c7c",
	V_COLOR_13:"#6c6c6c",
	V_COLOR_14:"#222a35",
	V_COLOR_15:"#000000",
	V_COLOR_16:"#4a3f93",
	V_COLOR_17:"#c9024a",
	V_COLOR_18:"#37962d",
	V_COLOR_2:"#4EA3D6",
	V_COLOR_3:"#0f7daf",
	V_COLOR_4:"#0c648c",
	V_COLOR_5:"#094d6b",
	V_COLOR_6:"#ffe699",
	V_COLOR_7:"#ffd966",
	V_COLOR_8:"#bf9000",
	V_COLOR_9:"#7f6000",
	V_COORDINATE_SYSTEM:"coordinateSystem",
	V_CRITICAL:"Critical",
	V_CURRENT_DATE:"CURRENT_DATE",
	V_CUSTOM:"custom",
	V_DATA_POINT:"dataPoint",
	V_DAY:"DAY",
	V_DIRECTION_ASC:"ascending",
	V_DIRECTION_DESC:"descending",
	V_ERROR:"Error",
	V_FEED_BUBBLE_WEIGHT:"bubbleWidth",
	V_FEED_CATEGORY_AXIS:"categoryAxis",
	V_FEED_CATEGORY_AXIS2:"categoryAxis2",
	V_FEED_COLOR:"color",
	V_FEED_DATA_CONTEXT:"dataContext",
	V_FEED_DATA_CONTEXT2:"dataContext2",
	V_FEED_PATTERN2:"pattern2",
	V_FEED_SIZE:"size",
	V_FEED_TIME_AXIS:"timeAxis",
	V_FEED_TITLE:"title",
	V_FEED_TOOLTIP_CATEGORY_AXIS:"tooltipCategoryAxis",
	V_FEED_TOOLTIP_VALUE_AXIS:"tooltipValueAxis",
	V_FEED_TRELLIS:"trellis",
	V_FEED_VALUE_AXIS:"valueAxis",
	V_FEED_VALUE_AXIS2:"valueAxis2",
	V_FEED_WEIGHT:"weight",
	V_FONT_WEIGHT_BOLD:"bold",
	V_FONT_WEIGHT_NORMAL:"normal",
	V_HEADING_CATEGORY_SEPARATOR:" / ",
	V_HEADING_UNIT_INFO_PREFIX:" (",
	V_HEADING_UNIT_INFO_SUFFIX:")",
	V_HORIZONTAL:"horizontal",
	V_ID:"id",
	V_ID_AND_DESCRIPTION:"idAndDescription",
	V_INDEX:"index",
	V_LEFT:"left",
	V_LINE_DASH:"Dash",
	V_LINE_DASH_DOT:"DashDot",
	V_LINE_DOT:"Dot",
	V_LINE_LONG_DASH:"LongDash",
	V_LINE_LONG_DASH_DOT:"LongDashDot",
	V_LINE_LONG_DASH_DOT_DOT:"LongDashDotDot",
	V_LINE_SHORT_DASH:"ShortDash",
	V_LINE_SHORT_DASH_DOT:"ShortDashDot",
	V_LINE_SHORT_DASH_DOT_DOT:"ShortDashDotDot",
	V_LINE_SHORT_DOT:"ShortDot",
	V_LINE_SOLID:"Solid",
	V_MIDDLE:"middle",
	V_MILLION:"Million",
	V_MONTH:"MONTH",
	V_NAME:"name",
	V_NORMAL:"normal",
	V_OK:"OK",
	V_PATTERN_PATH_HATCHING1:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24",
	V_PATTERN_PATH_HATCHING2:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24 M 13 1 L 1 13 M -11 13 L 13 -11 M 25 1 L 1 25 M 1 -11 L -11 1",
	V_PATTERN_PATH_HATCHING3:"M 12 0 L 0 12 M -12 12 L 12 -12 M 24 0 L 0 24 M 13 1 L 1 13 M -11 13 L 13 -11 M 25 1 L 1 25 M 1 -11 L -11 1 M 14 2 L 2 14 M -10 14 L 14 -10 M 26 2 L 2 26 M 2 -10 L -10 2 M 11 -1 L -1 11 M -13 11 L 11 -13 M 23 -1 L -1 23 M 23 11 L 11 23",
	V_PATTERN_PATH_HATCHING4:"M 1 1 L 1 2 Z M 3 3 L 3 4 Z",
	V_PATTERN_PATH_HATCHING5:"M 1 1 L 1 2 Z M 4 4 L 4 5 Z",
	V_PATTERN_PATH_HATCHING6:"M 1 1 L 1 2 Z M 5 5 L 5 6 Z",
	V_PATTERN_PATH_HATCHING7:"M 1 1 L 1 2 Z M 5 5 L 7 6 L 6 6 L 6 5 L 5 5 Z",
	V_PATTERN_PATH_HATCHING8:"M 0 0 L 0 5 L 4 5 L 4 0 L 3 0 L 3 5 L 2 5 L 2 0 L 1 0 L 1 5 L 5 5 L 5 0 L 0 0 Z M 6 6 L 6 5 L 10 11 L 10 6 L 9 6 L 9 11 L 8 11 L 8 6 L 7 6 L 7 11 L 11 11 L 11 6 L 6 6 Z",
	V_PATTERN_SIZE_HATCHING1:12,
	V_PATTERN_SIZE_HATCHING2:12,
	V_PATTERN_SIZE_HATCHING3:12,
	V_PATTERN_SIZE_HATCHING4:5,
	V_PATTERN_SIZE_HATCHING5:7,
	V_PATTERN_SIZE_HATCHING6:9,
	V_PATTERN_SIZE_HATCHING7:9,
	V_PATTERN_SIZE_HATCHING8:12,
	V_PERCENT:"percent",
	V_PERCENTAGE:"percentage",
	V_POSITION_LEFT:"left",
	V_POSITION_TOP:"top",
	V_RIGHT:"right",
	V_SERIES:"series",
	V_SERIES_GROUP:"seriesGroup",
	V_STACKED_BAR:"stackedbar",
	V_STACKED_COLUMN:"stackedcolumn",
	V_SYMBOL_CIRCLE:"circle",
	V_SYMBOL_DIAMOND:"diamond",
	V_SYMBOL_SQUARE:"square",
	V_SYMBOL_TRIANGLE:"triangle",
	V_SYMBOL_TRIANGLE_DOWN:"triangle-down",
	V_THOUSAND:"Thousand",
	V_TREEMAP_LAYOUT_SQUARIFIED:"squarified",
	V_TREEMAP_LAYOUT_STRIP:"strip",
	V_TYPE_AXIS_MEMBER_CALCDIM:"calculatedDimension",
	V_TYPE_AXIS_MEMBER_CALCULATION:"calculation",
	V_TYPE_AXIS_MEMBER_DIM:"dimension",
	V_TYPE_AXIS_MEMBER_MEMBER:"member",
	V_TYPE_AXIS_MEMBER_RESTRICTED:"restrictedMeasure",
	V_TYPE_BARCOLUMN:"barcolumn",
	V_TYPE_CALCULATION:"calculation",
	V_TYPE_CHART_DONUT:"donut",
	V_TYPE_CHART_PIE:"pie",
	V_TYPE_DATASET:"dataset",
	V_TYPE_DIMENSION:"dimension",
	V_TYPE_DIMENSION_SELECTION:"dimension.selection",
	V_TYPE_FILTER_COMPLEX:"complex",
	V_TYPE_FILTER_FILTER:"filter",
	V_TYPE_FILTER_MEMBER:"member",
	V_TYPE_HIERCHY_PCH:"hierarchy.pch",
	V_TYPE_MEASURE_SELECTION:"measure.selection",
	V_TYPE_MEMBER:"member",
	V_TYPE_SORT_DIMENSION:"dimension",
	V_VERTICAL:"vertical",
	V_WARNING:"Warning",
	V_YEAR:"YEAR",
	X_LIMIT:5
};

oFF.CategoricalAxisRenderer = function() {};
oFF.CategoricalAxisRenderer.prototype = new oFF.XObject();
oFF.CategoricalAxisRenderer.prototype._ff_c = "CategoricalAxisRenderer";

oFF.CategoricalAxisRenderer.create = function()
{
	return new oFF.CategoricalAxisRenderer();
};
oFF.CategoricalAxisRenderer.prototype.renderCategoricalAxis = function(axisType, axisIndex, axisName, categoricalAxisDomain, axisObject)
{
	let categories = categoricalAxisDomain.getCategories();
	let categoriesPrList = axisObject.putNewList(oFF.HighChartConstants.K_CATEGORIES);
	let categoryListStack = oFF.XList.create();
	let curPrList = categoriesPrList;
	for (let i = 0; i < categories.size(); i++)
	{
		let category = categories.get(i);
		let categoryElements = category.getCategoryElements();
		let catElSize = categoryElements.size();
		let j;
		let categoryElement;
		for (j = 0; j < catElSize; j++)
		{
			categoryElement = categoryElements.get(j);
			if (!categoryElement.isRepeatedElement() || j === catElSize - 1)
			{
				categoryListStack.add(curPrList);
				let structure = curPrList.addNewStructure();
				structure.putString(oFF.HighChartConstants.K_NAME, categoryElement.getText());
				let customAxisStructure = oFF.GenericHighChartConverter.buildCustomAxisContent(structure.putNewStructure(oFF.HighChartConstants.V_CUSTOM), axisType, axisIndex, axisName);
				oFF.GenericHighChartConverter.buildCustomCategoryWithElement(customAxisStructure.putNewStructure(oFF.HighChartConstants.V_CATEGORY), i, category.getName(), j, categoryElement.getName());
				curPrList = structure.putNewList(oFF.HighChartConstants.K_CATEGORIES);
			}
		}
		if (catElSize > 0)
		{
			curPrList.addString("");
		}
		for (j = catElSize - 1; j > -1; j--)
		{
			if ((categoryElements.get(j).isFinalElement() || j === catElSize - 1) && categoryListStack.size() > j)
			{
				curPrList = categoryListStack.get(j);
				categoryListStack.removeAt(j);
			}
		}
	}
};

oFF.GenericHiChartRendererLatest = function() {};
oFF.GenericHiChartRendererLatest.prototype = new oFF.XObject();
oFF.GenericHiChartRendererLatest.prototype._ff_c = "GenericHiChartRendererLatest";

oFF.GenericHiChartRendererLatest.CHART_JSON = "ChartJson";
oFF.GenericHiChartRendererLatest.MESSAGES = "Messages";
oFF.GenericHiChartRendererLatest.create = function(chartVisualization, chartAccessibilityEnabled)
{
	let instance = new oFF.GenericHiChartRendererLatest();
	instance.m_chartVisualization = chartVisualization;
	instance.m_chartAccessibilityEnabled = chartAccessibilityEnabled;
	return instance;
};
oFF.GenericHiChartRendererLatest.prototype.m_chartAccessibilityEnabled = false;
oFF.GenericHiChartRendererLatest.prototype.m_chartJson = null;
oFF.GenericHiChartRendererLatest.prototype.m_chartVisualization = null;
oFF.GenericHiChartRendererLatest.prototype.m_messages = null;
oFF.GenericHiChartRendererLatest.prototype.m_resultObject = null;
oFF.GenericHiChartRendererLatest.prototype.addCategoryTag = function(structure, category)
{
	if (oFF.notNull(category))
	{
		let domain = category.getParentChartDomain();
		let categoryIndex = domain.getCategories().getIndex(category);
		let axis = domain.getChartAxis();
		let axisStructure = structure.putNewStructure(oFF.HighChartConstants.K_AXIS);
		axisStructure.putString(oFF.HighChartConstants.V_NAME, axis.getName());
		let categoryStructure = axisStructure.putNewStructure(oFF.HighChartConstants.V_CATEGORY);
		categoryStructure.putString(oFF.HighChartConstants.V_NAME, category.getName());
		categoryStructure.putInteger(oFF.HighChartConstants.V_INDEX, categoryIndex);
	}
};
oFF.GenericHiChartRendererLatest.prototype.addSeriesGroupTag = function(custom, seriesGroup, seriesGroupIndex)
{
	let groupStructure = custom.putNewStructure(oFF.HighChartConstants.V_SERIES_GROUP);
	groupStructure.putInteger(oFF.HighChartConstants.V_INDEX, seriesGroupIndex);
	groupStructure.putString(oFF.HighChartConstants.V_NAME, seriesGroup.getName());
	this.addCategoryTag(groupStructure, seriesGroup.getCategory());
};
oFF.GenericHiChartRendererLatest.prototype.addSeriesTag = function(custom, series, seriesIndex)
{
	let seriesStructure = custom.putNewStructure(oFF.HighChartConstants.V_SERIES);
	seriesStructure.putInteger(oFF.HighChartConstants.V_INDEX, seriesIndex);
	seriesStructure.putString(oFF.HighChartConstants.V_NAME, series.getName());
	this.addCategoryTag(seriesStructure, series.getCategory());
};
oFF.GenericHiChartRendererLatest.prototype.appendCategoryElements = function(categoryElements, category)
{
	if (oFF.notNull(category))
	{
		categoryElements.addAll(oFF.XStream.of(category.getCategoryElements()).filter((ce) => {
			return oFF.XStringUtils.isNotNullAndNotEmpty(ce.getHeaderText());
		}).collect(oFF.XStreamCollector.toList()));
	}
};
oFF.GenericHiChartRendererLatest.prototype.buildAxes = function(axes, kAxis, groupsPerAxis)
{
	let axisObject = null;
	if (oFF.XCollectionUtils.hasElements(axes))
	{
		let maxPosition = oFF.XStream.of(axes).reduce(oFF.XIntegerValue.create(0), (a, b) => {
			return oFF.XIntegerValue.create(oFF.XMath.max(a.getInteger(), oFF.XMath.max(b.getFrom(), b.getTo())));
		}).getInteger();
		let axesSize = axes.size();
		if (axesSize === 1)
		{
			axisObject = this.m_chartJson.putNewStructure(kAxis);
			this.buildAxis(kAxis, 0, axes.get(0), axisObject, maxPosition, groupsPerAxis);
		}
		else
		{
			let axesList = this.m_chartJson.putNewList(kAxis);
			for (let i = 0; i < axesSize; i++)
			{
				axisObject = axesList.addNewStructure();
				this.buildAxis(kAxis, i, axes.get(i), axisObject, maxPosition, groupsPerAxis);
			}
		}
	}
	return axisObject;
};
oFF.GenericHiChartRendererLatest.prototype.buildAxis = function(axisType, axisIndex, chartAxis, axisObject, maxPosition, groupsPerAxis)
{
	let i;
	let chartType = this.m_chartVisualization.getChartType();
	oFF.GenericHighChartConverterLatest.buildCustomAxisContent(axisObject.putNewStructure(oFF.HighChartConstants.V_CUSTOM), axisType, axisIndex, chartAxis.getName());
	if (chartAxis.getAxisDomain().getAxisDomainType().isTypeOf(oFF.ChartAxisDomainType.CATEGORIAL))
	{
		let domainCategorial = chartAxis.getAxisDomain().getAsCategorial();
		oFF.CategoricalAxisRenderer.create().renderCategoricalAxis(axisType, axisIndex, chartAxis.getName(), domainCategorial, axisObject);
	}
	else
	{
		let scalarDomain = chartAxis.getAxisDomain();
		if (!this.isPercentageAxis(chartAxis))
		{
			if (scalarDomain.getMax() > scalarDomain.getMin())
			{
				if (scalarDomain.getMin() < 0)
				{
					axisObject.putDouble(oFF.HighChartConstants.K_MIN, scalarDomain.getMin());
				}
				if (scalarDomain.getMax() > 0)
				{
					axisObject.putDouble(oFF.HighChartConstants.K_MAX, scalarDomain.getMax());
				}
			}
			if (chartType.isTypeOf(oFF.ChartVisualizationType.STACKED_BAR) || chartType.isTypeOf(oFF.ChartVisualizationType.STACKED_COLUMN) || chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK))
			{
				let axisStackLabels = axisObject.putNewStructure(oFF.HighChartConstants.K_STACK_LABELS);
				let dcat = this.m_chartVisualization.getDistributionAxis().getAxisDomain().getAsCategorial().getCategories();
				let uniqueDecimalPlaces = 0;
				if (oFF.XCollectionUtils.hasElements(dcat))
				{
					let distributionCategory = dcat.get(0);
					uniqueDecimalPlaces = distributionCategory.getUniqueDecimalPlaces();
					for (i = 1; i < dcat.size(); i++)
					{
						distributionCategory = dcat.get(i);
						if (uniqueDecimalPlaces !== distributionCategory.getUniqueDecimalPlaces())
						{
							uniqueDecimalPlaces = 0;
						}
					}
				}
				let effectiveDecimalPlaces = uniqueDecimalPlaces < 0 ? 2 : uniqueDecimalPlaces;
				axisStackLabels.putString(oFF.HighChartConstants.K_FORMAT, oFF.XStringUtils.concatenate3("{total:,.", oFF.XInteger.convertToString(effectiveDecimalPlaces), "f}"));
				axisStackLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
				if (chartType.isTypeOf(oFF.ChartVisualizationType.BAR))
				{
					let stackLabelsStlye = axisStackLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
					stackLabelsStlye.putString(oFF.HighChartConstants.K_COLOR, "rgb(88,89,91)");
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_SIZE, "12px");
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_STYLE, oFF.HighChartConstants.V_NORMAL);
					stackLabelsStlye.putString(oFF.HighChartConstants.K_FONT_WEIGHT, oFF.HighChartConstants.K_BOLD);
				}
				else if (chartType.isTypeOf(oFF.ChartVisualizationType.COLUMN))
				{
					axisStackLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_CENTER);
					axisStackLabels.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.HighChartConstants.V_POSITION_TOP);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_Y, -20);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_X, 5);
				}
				else
				{
					axisStackLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_CENTER);
					axisStackLabels.putInteger(oFF.HighChartConstants.K_Y, -20);
				}
			}
		}
		axisObject.putInteger(oFF.HighChartConstants.K_OFFSET, 0);
	}
	let axisTitle = axisObject.putNewStructure(oFF.HighChartConstants.K_TITLE);
	axisTitle.putString(oFF.HighChartConstants.K_TEXT, chartAxis.getText());
	if (chartType.isEqualTo(oFF.ChartVisualizationType.BAR) || chartType.isEqualTo(oFF.ChartVisualizationType.STACKED_BAR))
	{
		if (oFF.XString.isEqual(axisType, oFF.HighChartConstants.K_X_AXIS))
		{
			axisTitle.putString(oFF.HighChartConstants.K_ALIGN, "high");
		}
		else
		{
			axisTitle.putString(oFF.HighChartConstants.K_ALIGN, "low");
		}
	}
	else
	{
		if (oFF.XString.isEqual(axisType, oFF.HighChartConstants.K_X_AXIS))
		{
			axisTitle.putString(oFF.HighChartConstants.K_ALIGN, "low");
		}
		else
		{
			axisTitle.putString(oFF.HighChartConstants.K_ALIGN, "high");
		}
	}
	axisTitle.putBoolean(oFF.HighChartConstants.K_ENABLED, chartAxis.getTitleStyle().isEnabled());
	let axisTitleStyle = axisTitle.putNewStructure(oFF.HighChartConstants.K_STYLE);
	axisTitleStyle.putString(oFF.HighChartConstants.K_COLOR, chartAxis.getTitleStyle().getFontColor());
	axisTitleStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, chartAxis.getTitleStyle().getFontFamily());
	axisTitleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, chartAxis.getTitleStyle().getFontSize());
	axisTitleStyle.putString(oFF.HighChartConstants.K_FONT_STYLE, chartAxis.getTitleStyle().getFontStyle());
	axisTitleStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, chartAxis.getTitleStyle().getFontWeight());
	axisObject.putBoolean(oFF.HighChartConstants.K_OPPOSITE, chartAxis.isScaleOpposite());
	axisObject.putInteger(oFF.HighChartConstants.K_GRID_LINE_WIDTH, chartAxis.getGridLineWidth());
	axisObject.putInteger(oFF.HighChartConstants.K_TICK_WIDTH, chartAxis.getTickSize());
	if (chartAxis.isScaleReversed())
	{
		axisObject.putBoolean(oFF.HighChartConstants.K_REVERSED, chartAxis.isScaleReversed());
	}
	if (maxPosition > 0)
	{
		let maxValue = oFF.XDoubleValue.create(maxPosition).getDouble();
		let offset = oFF.XDoubleValue.create(chartAxis.getFrom()).getDouble();
		let cutoff = oFF.XDoubleValue.create(chartAxis.getTo()).getDouble();
		let widthPercent = oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * (cutoff - offset) / maxValue - 2), "%");
		if (chartAxis.getPosition().isTypeOf(oFF.ChartVisualizationAxisPosition.X))
		{
			axisObject.putString(oFF.HighChartConstants.V_POSITION_LEFT, oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * offset / maxValue + 2), "%"));
			axisObject.putString(oFF.HighChartConstants.K_WIDTH, widthPercent);
		}
		else if (chartAxis.getPosition().isTypeOf(oFF.ChartVisualizationAxisPosition.Y))
		{
			axisObject.putString(oFF.HighChartConstants.V_POSITION_TOP, oFF.XStringUtils.concatenate2(oFF.XDouble.convertToString(100.0 * (maxValue - cutoff) / maxValue + 2), "%"));
			axisObject.putString(oFF.HighChartConstants.K_HEIGHT, widthPercent);
		}
	}
	axisObject.putString(oFF.HighChartConstants.K_ID, chartAxis.getName());
	let plotBands = chartAxis.getPlotBands();
	if (oFF.XCollectionUtils.hasElements(plotBands))
	{
		let plotBandsList = axisObject.putNewList(oFF.HighChartConstants.K_PLOT_BANDS);
		for (i = 0; i < plotBands.size(); i++)
		{
			this.buildPlotBand(plotBandsList.addNewStructure(), plotBands.get(i));
		}
	}
	let plotLines = chartAxis.getPlotLines();
	if (oFF.XCollectionUtils.hasElements(plotLines))
	{
		let plotLinesList = axisObject.putNewList(oFF.HighChartConstants.K_PLOT_LINES);
		for (i = 0; i < plotLines.size(); i++)
		{
			this.buildPlotLine(plotLinesList.addNewStructure(), plotLines.get(i));
		}
	}
	let labelsStructure = axisObject.putNewStructure(oFF.HighChartConstants.K_LABELS);
	labelsStructure.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
	let labelStyle = labelsStructure.putNewStructure(oFF.HighChartConstants.K_STYLE);
	labelStyle.putString(oFF.HighChartConstants.K_COLOR, chartAxis.getLabelStyle().getFontColor());
	labelStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, chartAxis.getLabelStyle().getFontFamily());
	labelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, chartAxis.getLabelStyle().getFontSize());
	labelStyle.putString(oFF.HighChartConstants.K_FONT_STYLE, chartAxis.getLabelStyle().getFontStyle());
	labelStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, chartAxis.getLabelStyle().getFontWeight());
	labelStyle.putString(oFF.HighChartConstants.K_WHITE_SPACE, "noWrap");
	labelStyle.putString(oFF.HighChartConstants.K_TEXT_OVERFLOW, "ellipsis");
	labelStyle.putInteger(oFF.HighChartConstants.K_WIDTH, 50);
	labelStyle.putString(oFF.HighChartConstants.K_CURSOR_STYLE, "pointer");
	labelStyle.putNull(oFF.HighChartConstants.K_TEXT_SHADOW);
	return axisObject;
};
oFF.GenericHiChartRendererLatest.prototype.buildColorAxis = function()
{
	if (this.m_chartVisualization.isUseColorAxis())
	{
		let colorAxis = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_COLOR_AXIS);
		this.decorateWithStyle(colorAxis, oFF.HighChartConstants.K_MIN_COLOR, this.m_chartVisualization.getMinColor());
		this.decorateWithStyle(colorAxis, oFF.HighChartConstants.K_MAX_COLOR, this.m_chartVisualization.getMaxColor());
	}
};
oFF.GenericHiChartRendererLatest.prototype.buildCoordinateSystems = function()
{
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	let seriesList = this.m_chartJson.putNewList(oFF.HighChartConstants.K_SERIES);
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		let seriesGroups = coordinateSystem.getSeriesGroups();
		for (let j = 0; j < seriesGroups.size(); j++)
		{
			let seriesGroup = seriesGroups.get(j);
			let series = seriesGroup.getSeries();
			for (let k = 0; k < series.size(); k++)
			{
				this.buildSeriesExt(i, j, k, seriesList, coordinateSystem, seriesGroup, series.get(k));
			}
		}
	}
};
oFF.GenericHiChartRendererLatest.prototype.buildDataPoint = function(pointList, chartDataPoint, parentPointIds, coordinateKeys, hasUnitScaleHeading)
{
	let formattedCategories = this.getFormattedCategoriesForTooltip(chartDataPoint);
	let name = this.getName(chartDataPoint);
	let pointStructure = pointList.addNewStructure();
	if (oFF.GenericHighChartConverterLatest.isNestedPointChart(this.m_chartVisualization.getChartType()))
	{
		let elements = chartDataPoint.getCategory().getCategoryElements();
		let elementsSize = elements.size();
		let oldParent = "";
		for (let h = 0; h < elementsSize - 1; h++)
		{
			let element = elements.get(h);
			let elementName = oFF.XStringUtils.concatenate3(oldParent, ":", element.getName());
			if (!parentPointIds.contains(elementName))
			{
				let parentPointStructure = pointList.addNewStructure();
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_PARENT, oldParent);
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_ID, elementName);
				parentPointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_NAME, element.getText());
				parentPointIds.add(elementName);
			}
			oldParent = elementName;
		}
		let currentElement = elements.get(elementsSize - 1);
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_PARENT, oldParent);
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_ID, oFF.XStringUtils.concatenate3(oldParent, ":", currentElement.getName()));
		pointStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_NAME, currentElement.getText());
	}
	else if (oFF.XStringUtils.isNullOrEmpty(name) && (this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.PIE) || this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.DOUGHNUT)))
	{
		this.m_messages.addString(oFF.GenericHiChartRendererMessages.NO_CHART_FOR_CURRENT_SELECTION);
	}
	else
	{
		pointStructure.putString(oFF.HighChartConstants.K_NAME, name);
	}
	pointStructure.putStringNotNullAndNotEmpty(oFF.GenericHighChartConverterLatest.FORMATTED_CATEGORIES, formattedCategories);
	if (!this.m_chartVisualization.isUseColorAxis())
	{
		this.decorateWithStyle(pointStructure, oFF.HighChartConstants.K_COLOR, chartDataPoint.getEffectiveStyle());
	}
	let coordinates = chartDataPoint.getCoordinates();
	for (let i = 0; i < coordinates.size(); i++)
	{
		let coordinate = coordinates.get(i);
		let value = coordinate.getValue();
		let coordinateName = oFF.GenericHighChartConverterLatest.getCoordinateName(this.m_chartVisualization.getChartType(), coordinate.getName());
		if (chartDataPoint.isEmptyValue())
		{
			pointStructure.putNull(coordinateName);
		}
		else if (value.getValueType().isNumber())
		{
			let doubleValue = oFF.XValueUtil.getDouble(value, false, true);
			if (oFF.XString.isEqual(coordinate.getName(), oFF.GenericHighChartConverterLatest.getPieAndDoughnutVisualizationValueType()))
			{
				doubleValue = doubleValue < 0 ? doubleValue * -1 : doubleValue;
			}
			pointStructure.putDouble(coordinateName, doubleValue);
		}
		else
		{
			pointStructure.putString(coordinateName, oFF.XValueUtil.getString(value));
		}
		let fullFormattedText = coordinate.getFullFormattedText();
		let formattedText = hasUnitScaleHeading ? coordinate.getFormattedText() : fullFormattedText;
		let heading = coordinate.getHeading() === null ? "" : coordinate.getHeading();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(formattedText) && oFF.XStringUtils.isNotNullAndNotEmpty(fullFormattedText))
		{
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverterLatest.FULL_FORMATTING_SUFFIX), fullFormattedText);
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverterLatest.FORMATTING_SUFFIX), formattedText);
			pointStructure.putString(oFF.XStringUtils.concatenate2(coordinateName, oFF.GenericHighChartConverterLatest.HEADING_SUFFIX), heading);
			if (!coordinateKeys.contains(coordinateName))
			{
				coordinateKeys.add(coordinateName);
			}
		}
	}
	return pointStructure;
};
oFF.GenericHiChartRendererLatest.prototype.buildPlotBand = function(structure, plotBand)
{
	structure.putDouble(oFF.HighChartConstants.K_FROM, plotBand.getFrom());
	structure.putDouble(oFF.HighChartConstants.K_TO, plotBand.getTo());
	structure.putDouble(oFF.HighChartConstants.K_BORDER_WIDTH, plotBand.getBorderWidth());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, plotBand.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_BORDER_COLOR, plotBand.getBorderColor());
	let label = structure.putNewStructure(oFF.HighChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TEXT, plotBand.getText());
};
oFF.GenericHiChartRendererLatest.prototype.buildPlotLine = function(structure, plotLine)
{
	structure.putDouble(oFF.HighChartConstants.K_VALUE, plotLine.getValue());
	structure.putDouble(oFF.HighChartConstants.K_WIDTH, plotLine.getWidth());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, plotLine.getColor());
	structure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_DASH_STYLE, plotLine.getDashStyle());
	structure.putDouble(oFF.HighChartConstants.K_Z_INDEX, 6);
	let label = structure.putNewStructure(oFF.HighChartConstants.K_LABEL);
	label.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TEXT, plotLine.getText());
};
oFF.GenericHiChartRendererLatest.prototype.buildScrollablePlotArea = function(chartTypeInfo)
{
	if (!this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.PIE) && !this.m_chartVisualization.getChartType().isEqualTo(oFF.ChartVisualizationType.DOUGHNUT) && !this.m_chartVisualization.getCoordinateSystems().isEmpty())
	{
		let xAxis = this.m_chartVisualization.getXAxes().get(0);
		let minBarWidth = 50;
		let categoriesSize = xAxis.getAxisDomain().getAsCategorial().getCategories().size();
		let seriesGroupsSize = this.m_chartVisualization.getCoordinateSystems().get(0).getSeriesGroups().size();
		let scrollablePlotArea = chartTypeInfo.putNewStructure(oFF.HighChartConstants.K_SCROLLABLE_PLOT_AREA);
		scrollablePlotArea.putInteger(oFF.HighChartConstants.K_OPACITY, 1);
		if (this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.BAR) || this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.STACKED_BAR))
		{
			scrollablePlotArea.putInteger(oFF.HighChartConstants.K_MIN_HEIGHT, categoriesSize * seriesGroupsSize * minBarWidth);
		}
		else
		{
			scrollablePlotArea.putInteger(oFF.HighChartConstants.K_MIN_WIDTH, categoriesSize * seriesGroupsSize * minBarWidth);
		}
	}
};
oFF.GenericHiChartRendererLatest.prototype.buildSeriesExt = function(coordinateSystemIndex, seriesGroupIndex, seriesIndex, seriesList, coordinateSystem, seriesGroup, series)
{
	let chartDataPoints = series.getChartDataPoints();
	if (this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) && oFF.XStream.of(chartDataPoints).anyMatch((cdp) => {
		return cdp.hasStylingCategories();
	}))
	{
		let styleSeriesIndex = oFF.XLinkedHashMapByString.create();
		for (let i = 0; i < chartDataPoints.size(); i++)
		{
			let chartDataPoint = chartDataPoints.get(i);
			let pointCategories = chartDataPoint.getStylingCategories();
			let key = oFF.XCollectionUtils.join(oFF.XStream.of(pointCategories).filterNullValues().collect(oFF.XStreamCollector.toListOfString((k) => {
				return k.getName();
			})), ":");
			if (!styleSeriesIndex.containsKey(key))
			{
				styleSeriesIndex.put(key, oFF.XList.create());
			}
			styleSeriesIndex.getByKey(key).add(oFF.XIntegerValue.create(i));
		}
		let styleKeys = styleSeriesIndex.getKeysAsIterator();
		while (styleKeys.hasNext())
		{
			let styleKey = styleKeys.next();
			let indices = styleSeriesIndex.getByKey(styleKey);
			this.buildSeriesWithIndex(seriesList.addNewStructure(), coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, indices, series.getChartDataPoints().get(indices.get(0).getInteger()).getStylingCategories());
		}
	}
	else
	{
		this.buildSeriesWithIndex(seriesList.addNewStructure(), coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, null, null);
	}
};
oFF.GenericHiChartRendererLatest.prototype.buildSeriesWithIndex = function(seriesStructure, coordinateSystemIndex, seriesGroupIndex, seriesIndex, coordinateSystem, seriesGroup, series, indices, stylingCategories)
{
	let mergableCategories = oFF.XList.create();
	if (oFF.XCollectionUtils.hasElements(stylingCategories))
	{
		mergableCategories.addAll(stylingCategories);
	}
	mergableCategories.add(seriesGroup.getCategory());
	mergableCategories.add(series.getCategory());
	let seriesHeading = this.extractSeriesHeadingFromCategory(mergableCategories);
	let hasUnitScaleHeading = oFF.XStream.of(mergableCategories).filterNullValues().anyMatch((cat) => {
		return oFF.XStringUtils.isNotNullAndNotEmpty(cat.getUniqueUnitScaleInformation());
	});
	let seriesStyle = series.getEffectiveStyleWithCategories(stylingCategories);
	this.decorateWithStyle(seriesStructure, oFF.HighChartConstants.K_COLOR, seriesStyle);
	let chartDataPoints = series.getChartDataPoints();
	let custom = seriesStructure.putNewStructure(oFF.HighChartConstants.V_CUSTOM);
	let axisReference;
	if (coordinateSystem.getXAxisReference() !== null && !coordinateSystem.getXAxisReference().isHidden())
	{
		axisReference = coordinateSystem.getXAxisReference();
		seriesStructure.putString(oFF.HighChartConstants.K_X_AXIS, axisReference.getName());
		oFF.GenericHighChartConverterLatest.buildCustomAxisContent(custom, oFF.HighChartConstants.K_X_AXIS, this.m_chartVisualization.getXAxes().getIndex(axisReference), axisReference.getName());
	}
	if (coordinateSystem.getYAxisReference() !== null && !coordinateSystem.getYAxisReference().isHidden())
	{
		axisReference = coordinateSystem.getYAxisReference();
		seriesStructure.putString(oFF.HighChartConstants.K_Y_AXIS, axisReference.getName());
		oFF.GenericHighChartConverterLatest.buildCustomAxisContent(custom, oFF.HighChartConstants.K_Y_AXIS, this.m_chartVisualization.getYAxes().getIndex(axisReference), axisReference.getName());
	}
	this.addSeriesGroupTag(custom, seriesGroup, seriesGroupIndex);
	this.addSeriesTag(custom, series, seriesIndex);
	seriesStructure.putString(oFF.HighChartConstants.K_NAME, seriesHeading);
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_STACK, seriesGroup.getName());
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_TYPE, oFF.GenericHighChartConverterLatest.getChartTypeStringWithFallback(seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_INNER_SIZE, oFF.GenericHighChartConverterLatest.getInnerRadius(seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	seriesStructure.putBoolean(oFF.HighChartConstants.K_SHOW_IN_LEGEND, true);
	seriesStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_STACKING, oFF.GenericHighChartConverterLatest.getStackingType(seriesGroup.getName(), seriesGroup.getStackingType(), seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
	let data = seriesStructure.putNewList(oFF.HighChartConstants.K_DATA);
	if (oFF.GenericHighChartConverterLatest.needsDirectDataLabels(this.m_chartVisualization.getChartType()))
	{
		let dataLabels = seriesStructure.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		dataLabels.putString(oFF.HighChartConstants.K_POINT_FORMAT, "{point.valueFormatted}");
		dataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
	}
	if (oFF.GenericHighChartConverterLatest.isNestedPointChart(this.m_chartVisualization.getChartType()))
	{
		let objectLevels = seriesStructure.putNewList(oFF.HighChartConstants.K_LEVELS);
		let objectLevel1 = objectLevels.addNewStructure();
		objectLevel1.putInteger(oFF.HighChartConstants.K_LEVEL, 1);
		objectLevel1.putInteger(oFF.HighChartConstants.K_BORDER_WIDTH, 6);
		let objectLevelDataLabels = objectLevel1.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		objectLevelDataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_FORMAT, "<div>{point.name}</div><br/>");
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		objectLevelDataLabels.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.HighChartConstants.V_POSITION_TOP);
		let objectLevelDataLabelsStyle = objectLevelDataLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		objectLevelDataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "14px");
		let objectLevel2 = objectLevels.addNewStructure();
		objectLevel2.putInteger(oFF.HighChartConstants.K_LEVEL, 2);
		let objectLevelDataLabels1 = objectLevel2.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		objectLevelDataLabels1.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		objectLevelDataLabels1.putString(oFF.HighChartConstants.K_FORMAT, "<div>{point.name}</div><br/><div>{point.valueFormatted}</div >");
	}
	let parentPointIds = oFF.XHashSetOfString.create();
	let coordinateList = oFF.XList.create();
	if (!this.m_chartVisualization.getChartType().isAllowsPositiveAndNegativeValuesMix() && series.doesCoordinateHavePositiveAndNegativeValues(oFF.GenericHighChartConverterLatest.getPieAndDoughnutVisualizationValueType()))
	{
		this.m_messages.addString(oFF.GenericHiChartRendererMessages.POSITIVE_NEGATIVE_ERROR);
		return;
	}
	for (let i = 0; i < chartDataPoints.size(); i++)
	{
		let chartDataPoint = chartDataPoints.get(i);
		if (oFF.notNull(chartDataPoint) && (oFF.isNull(indices) || indices.contains(oFF.XIntegerValue.create(i))))
		{
			let pointStructure = this.buildDataPoint(data, chartDataPoint, parentPointIds, coordinateList, hasUnitScaleHeading);
			custom = pointStructure.putNewStructure(oFF.HighChartConstants.V_CUSTOM);
			this.addSeriesGroupTag(custom, seriesGroup, seriesGroupIndex);
			this.addSeriesTag(custom, series, seriesIndex);
			this.addCategoryTag(custom.putNewStructure(oFF.HighChartConstants.V_DATA_POINT), chartDataPoint.getCategory());
		}
		else if (oFF.GenericHighChartConverterLatest.needsNullDataPoints(this.m_chartVisualization.getChartType()))
		{
			data.addNewStructure();
		}
	}
	let toolTipBuffer = oFF.XStringBuffer.create();
	toolTipBuffer.append("{point.");
	toolTipBuffer.append(oFF.GenericHighChartConverterLatest.FORMATTED_CATEGORIES);
	toolTipBuffer.append("}");
	for (let j = 0; j < coordinateList.size(); j++)
	{
		let coordinateKey = coordinateList.get(j);
		toolTipBuffer.append("<b>{point.");
		toolTipBuffer.append(coordinateKey);
		toolTipBuffer.append(oFF.GenericHighChartConverterLatest.HEADING_SUFFIX);
		toolTipBuffer.append("}</b>: {point.");
		toolTipBuffer.append(coordinateKey);
		toolTipBuffer.append(oFF.GenericHighChartConverterLatest.FULL_FORMATTING_SUFFIX);
		toolTipBuffer.append("}");
	}
	let tooltip = seriesStructure.putNewStructure(oFF.HighChartConstants.K_TOOLTIP);
	tooltip.putString(oFF.HighChartConstants.K_POINT_FORMAT, toolTipBuffer.toString());
	tooltip.putString(oFF.HighChartConstants.K_HEADER_FORMAT, "");
};
oFF.GenericHiChartRendererLatest.prototype.buildTitle = function()
{
	let chartTitle = this.m_chartVisualization.getTitle();
	chartTitle = oFF.notNull(chartTitle) && this.m_chartVisualization.getTitleStyle().isEnabled() ? chartTitle : "";
	let title = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_TITLE);
	title.putString(oFF.HighChartConstants.K_TEXT, chartTitle);
	title.putString(oFF.HighChartConstants.K_ALIGN, oFF.XString.toLowerCase(this.m_chartVisualization.getTitleStyle().getTextAlign().toString()));
	let titleStyle = title.putNewStructure(oFF.HighChartConstants.K_STYLE);
	titleStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, this.m_chartVisualization.getTitleStyle().getFontFamily());
	titleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, this.m_chartVisualization.getTitleStyle().getFontSize());
	titleStyle.putString(oFF.HighChartConstants.K_FONT_STYLE, this.m_chartVisualization.getTitleStyle().getFontStyle());
	titleStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, this.m_chartVisualization.getTitleStyle().getFontWeight());
	titleStyle.putString(oFF.HighChartConstants.K_COLOR, this.m_chartVisualization.getTitleStyle().getFontColor());
};
oFF.GenericHiChartRendererLatest.prototype.buildXAxes = function(groupsPerAxis)
{
	this.buildAxes(this.m_chartVisualization.getXAxes(), oFF.HighChartConstants.K_X_AXIS, groupsPerAxis);
};
oFF.GenericHiChartRendererLatest.prototype.buildYAxes = function(groupsPerAxis)
{
	this.buildAxes(this.m_chartVisualization.getYAxes(), oFF.HighChartConstants.K_Y_AXIS, groupsPerAxis);
};
oFF.GenericHiChartRendererLatest.prototype.buildZAxes = function(groupsPerAxis)
{
	this.buildAxes(this.m_chartVisualization.getZAxes(), oFF.HighChartConstants.K_Z_AXIS, groupsPerAxis);
};
oFF.GenericHiChartRendererLatest.prototype.collectChartTypes = function()
{
	let chartTypes = oFF.XHashSetOfString.create();
	for (let i = 0; i < this.m_chartVisualization.getCoordinateSystems().size(); i++)
	{
		let coordinateSystem = this.m_chartVisualization.getCoordinateSystems().get(i);
		for (let j = 0; j < coordinateSystem.getSeriesGroups().size(); j++)
		{
			let seriesGroup = coordinateSystem.getSeriesGroups().get(j);
			chartTypes.add(oFF.GenericHighChartConverterLatest.getChartTypeStringWithFallback(seriesGroup.getChartType(), this.m_chartVisualization.getChartType()));
		}
	}
	return chartTypes;
};
oFF.GenericHiChartRendererLatest.prototype.decorateGroupsPerAxis = function(groupsPerAxis, name, groupSize)
{
	if (!groupsPerAxis.containsKey(name))
	{
		groupsPerAxis.put(name, oFF.XIntegerValue.create(groupSize));
	}
	else
	{
		groupsPerAxis.put(name, oFF.XIntegerValue.create(groupSize + groupsPerAxis.getByKey(name).getInteger()));
	}
};
oFF.GenericHiChartRendererLatest.prototype.decorateWithStyle = function(elementToBeStyled, colorKey, effectiveStyle)
{
	let pattern = effectiveStyle.getPattern();
	let customPattern = effectiveStyle.getCustomPattern();
	let shape = effectiveStyle.getShape();
	let customShape = effectiveStyle.getCustomShape();
	let lineStyle = effectiveStyle.getLineStyle();
	if (oFF.isNull(pattern) && oFF.isNull(customPattern) || pattern === oFF.VisualizationBackgroundPatternType.SOLID)
	{
		elementToBeStyled.putStringNotNullAndNotEmpty(colorKey, effectiveStyle.getColor());
	}
	else if (pattern === oFF.VisualizationBackgroundPatternType.NOFILL)
	{
		elementToBeStyled.putString(colorKey, "#ffffff");
	}
	else
	{
		let colorStructure = elementToBeStyled.putNewStructure(colorKey);
		let patternStructure = colorStructure.putNewStructure(oFF.HighChartConstants.K_PATTERN);
		patternStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_COLOR, effectiveStyle.getColor());
		if (oFF.notNull(pattern))
		{
			let patternSize = oFF.GenericHighChartConverterLatest.getChartHatchingSize(pattern);
			patternStructure.putInteger(oFF.HighChartConstants.K_WIDTH, patternSize);
			patternStructure.putInteger(oFF.HighChartConstants.K_HEIGHT, patternSize);
			patternStructure.putString(oFF.HighChartConstants.K_PATH, oFF.GenericHighChartConverterLatest.getChartHatchingPath(pattern));
		}
		else
		{
			patternStructure.putString(oFF.HighChartConstants.K_PATH, customPattern);
		}
	}
	elementToBeStyled.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_DASH_STYLE, oFF.GenericHighChartConverterLatest.getDashStyleString(lineStyle));
	if (oFF.notNull(shape) || oFF.notNull(customShape))
	{
		let markerStructure = elementToBeStyled.putNewStructure(oFF.HighChartConstants.K_MARKER);
		if (oFF.notNull(shape))
		{
			markerStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_SYMBOL, oFF.GenericHighChartConverterLatest.getShapeName(shape));
		}
		else
		{
			markerStructure.putStringNotNullAndNotEmpty(oFF.HighChartConstants.K_SYMBOL, customShape);
		}
	}
};
oFF.GenericHiChartRendererLatest.prototype.extractSeriesHeadingFromCategory = function(mergableCategories)
{
	let headingParts = oFF.XList.create();
	let unitParts = oFF.XList.create();
	for (let i = 0; i < mergableCategories.size(); i++)
	{
		let mergableCategory = mergableCategories.get(i);
		if (oFF.isNull(mergableCategory))
		{
			continue;
		}
		let uniqueScalingUnit = mergableCategory.getUniqueUnitScaleInformation();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(uniqueScalingUnit))
		{
			unitParts.add(uniqueScalingUnit);
		}
		let elements = mergableCategory.getCategoryElements();
		for (let j = 0; j < elements.size(); j++)
		{
			let element = elements.get(j);
			let elementText = element.getText();
			if (!headingParts.contains(elementText))
			{
				headingParts.add(elementText);
			}
		}
	}
	let resultString = oFF.XCollectionUtils.join(headingParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR);
	if (oFF.XCollectionUtils.hasElements(unitParts))
	{
		resultString = oFF.XStringUtils.concatenate4(resultString, oFF.HighChartConstants.V_HEADING_UNIT_INFO_PREFIX, oFF.XCollectionUtils.join(unitParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR), oFF.HighChartConstants.V_HEADING_UNIT_INFO_SUFFIX);
	}
	return resultString;
};
oFF.GenericHiChartRendererLatest.prototype.getChartJson = function()
{
	return this.m_chartJson;
};
oFF.GenericHiChartRendererLatest.prototype.getFormattedCategoriesForTooltip = function(chartDataPoint)
{
	let buffer = oFF.XStringBuffer.create();
	let categoryElements = oFF.XList.create();
	this.appendCategoryElements(categoryElements, chartDataPoint.getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getParentSeriesGroup().getCategory());
	if (oFF.XCollectionUtils.hasElements(categoryElements))
	{
		let i = 0;
		while (i < categoryElements.size() && oFF.XStringUtils.isNullOrEmpty(categoryElements.get(i).getHeaderText()))
		{
			i++;
		}
		let headerText = "";
		let oldHeaderText = "";
		if (i < categoryElements.size())
		{
			headerText = categoryElements.get(i).getHeaderText();
			buffer.append("<b>");
			buffer.append(headerText);
			buffer.append("</b>");
			buffer.append(": ");
			buffer.append(categoryElements.get(i).getText());
			oldHeaderText = headerText;
		}
		for (; i < categoryElements.size(); i++)
		{
			let categoryElement = categoryElements.get(i);
			headerText = categoryElement.getHeaderText();
			if (oFF.XString.isEqual(headerText, oldHeaderText))
			{
				buffer.append(" / ");
				buffer.append(categoryElement.getText());
			}
			else if (oFF.XStringUtils.isNotNullAndNotEmpty(headerText))
			{
				buffer.append("<br/><b>");
				buffer.append(headerText);
				buffer.append("</b>: ");
				buffer.append(categoryElement.getText());
			}
			oldHeaderText = headerText;
		}
	}
	if (buffer.length() > 0)
	{
		buffer.append("<br/>");
	}
	return buffer.toString();
};
oFF.GenericHiChartRendererLatest.prototype.getGroupsPerAxis = function()
{
	let groupsPerAxis = oFF.XHashMapByString.create();
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		let groupSize = coordinateSystem.getSeriesGroups().size();
		this.decorateGroupsPerAxis(groupsPerAxis, coordinateSystem.getXAxisReference().getName(), groupSize);
		this.decorateGroupsPerAxis(groupsPerAxis, coordinateSystem.getYAxisReference().getName(), groupSize);
	}
	return groupsPerAxis;
};
oFF.GenericHiChartRendererLatest.prototype.getName = function(chartDataPoint)
{
	let buffer = oFF.XStringBuffer.create();
	let categoryElements = oFF.XList.create();
	this.appendCategoryElements(categoryElements, chartDataPoint.getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getCategory());
	this.appendCategoryElements(categoryElements, chartDataPoint.getParentSeries().getParentSeriesGroup().getCategory());
	if (oFF.XCollectionUtils.hasElements(categoryElements))
	{
		for (let i = 0; i < categoryElements.size(); i++)
		{
			let categoryElement = categoryElements.get(i);
			buffer.append(categoryElement.getText());
			if (i < categoryElements.size() - 1)
			{
				buffer.append(" / ");
			}
		}
	}
	return buffer.toString();
};
oFF.GenericHiChartRendererLatest.prototype.isPercentageAxis = function(chartAxis)
{
	return oFF.XStream.of(this.m_chartVisualization.getCoordinateSystems()).filter((cos) => {
		return cos.getXAxisReference() === chartAxis || cos.getYAxisReference() === chartAxis;
	}).allMatch((cors) => {
		return oFF.XStream.of(cors.getSeriesGroups()).allMatch((csg) => {
			return csg.getStackingType() === oFF.ChartVisualizationStackingType.PERCENT;
		});
	});
};
oFF.GenericHiChartRendererLatest.prototype.isStacked = function()
{
	return this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.STACKED_BAR) || this.m_chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.STACKED_COLUMN);
};
oFF.GenericHiChartRendererLatest.prototype.needsPercentageLabels = function()
{
	return this.m_chartVisualization.getChartType() === oFF.ChartVisualizationType.PIE || this.m_chartVisualization.getChartType() === oFF.ChartVisualizationType.DOUGHNUT || oFF.XStream.of(this.m_chartVisualization.getCoordinateSystems()).anyMatch((cors) => {
		return oFF.XStream.of(cors.getSeriesGroups()).anyMatch((csg) => {
			return csg.getStackingType() === oFF.ChartVisualizationStackingType.PERCENT;
		});
	});
};
oFF.GenericHiChartRendererLatest.prototype.releaseObject = function()
{
	this.m_chartVisualization = null;
	this.m_messages = oFF.XObjectExt.release(this.m_messages);
	this.m_chartJson = oFF.XObjectExt.release(this.m_chartJson);
	this.m_resultObject = oFF.XObjectExt.release(this.m_resultObject);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.GenericHiChartRendererLatest.prototype.render = function()
{
	this.m_resultObject = oFF.PrFactory.createStructure();
	this.m_chartJson = this.m_resultObject.putNewStructure("ChartJson");
	this.m_messages = this.m_resultObject.putNewList("Messages");
	if (!this.m_chartAccessibilityEnabled)
	{
		let accessibilityStructure = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_ACCESSIBILITY);
		accessibilityStructure.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
	}
	let chartTypeInfo = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_CHART);
	if (this.m_chartVisualization.isInverted() && this.m_chartVisualization.getChartType() !== oFF.ChartVisualizationType.BAR)
	{
		chartTypeInfo.putBoolean(oFF.HighChartConstants.K_INVERTED, true);
	}
	chartTypeInfo.putBoolean(oFF.HighChartConstants.K_POLAR, this.m_chartVisualization.isPolar());
	let chartTypeString = oFF.GenericHighChartConverterLatest.getChartTypeString(this.m_chartVisualization.getChartType());
	chartTypeInfo.putString(oFF.HighChartConstants.K_TYPE, chartTypeString);
	this.buildScrollablePlotArea(chartTypeInfo);
	chartTypeInfo.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
	let chartlang = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_LANG);
	chartlang.putString(oFF.HighChartConstants.K_DECIMAL_POINT, ",");
	chartlang.putString(oFF.HighChartConstants.K_THOUSANDS_SEP, ".");
	let chartTypeInfostyle = chartTypeInfo.putNewStructure(oFF.HighChartConstants.K_STYLE);
	chartTypeInfostyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, "LatoWeb, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'sans serif'");
	let boost = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_BOOST);
	let credits = this.m_chartJson.putNewStructure(oFF.HighChartConstants.K_CREDITS);
	credits.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
	boost.putBoolean(oFF.HighChartConstants.K_USER_GPU_TRANSLATIONS, true);
	this.buildTitle();
	let groupsPerAxis = this.getGroupsPerAxis();
	this.buildXAxes(groupsPerAxis);
	this.buildYAxes(groupsPerAxis);
	this.buildZAxes(groupsPerAxis);
	this.buildColorAxis();
	this.buildCoordinateSystems();
	oFF.GenericHighChartConverterLatest.chartPlotBuilder(this.m_chartVisualization, this.m_chartJson, this.collectChartTypes(), this.needsPercentageLabels(), this.isStacked());
	oFF.GenericHighChartConverterLatest.chartLegendBuilder(this.m_chartVisualization, this.m_chartJson);
	return this.m_resultObject;
};
oFF.GenericHiChartRendererLatest.prototype.setChartConfigration = function(chartConfig) {};

oFF.GenericHighChartConverterLatest = {

	COORDINATE_COLOR:"colorValue",
	COORDINATE_VALUE:"value",
	COORDINATE_X:"x",
	COORDINATE_Y:"y",
	COORDINATE_Z:"z",
	FORMATTED_CATEGORIES:"formattedCategories",
	FORMATTING_SUFFIX:"Formatted",
	FULL_FORMATTING_SUFFIX:"FormattedFull",
	HEADING_SUFFIX:"Heading",
	VISUALIZATION_CATEGORY_AXIS:"CategoryAxis",
	VISUALIZATION_CATEGORY_AXIS2:"CategoryAxis2",
	VISUALIZATION_VALUE_TYPE_COLOR:"Color",
	VISUALIZATION_VALUE_TYPE_SIZE:"Size",
	VISUALIZATION_VALUE_TYPE_VALUE:"Value",
	VISUALIZATION_VALUE_TYPE_VALUE_B:"ValueB",
	VISUALIZATION_VALUE_TYPE_VALUE_C:"ValueC",
	buildCustomAxisContent:function(custom, axisType, axisIndex, name)
	{
			let customAxis = custom.putNewStructure(oFF.HighChartConstants.K_AXIS);
		customAxis.putString(oFF.HighChartConstants.K_TYPE, axisType);
		customAxis.putInteger(oFF.HighChartConstants.V_INDEX, axisIndex);
		customAxis.putString(oFF.HighChartConstants.V_NAME, name);
		return customAxis;
	},
	buildCustomCategoryElement:function(customElement, categoryElementIndex, categoryElementName)
	{
			customElement.putInteger(oFF.HighChartConstants.V_INDEX, categoryElementIndex);
		customElement.putString(oFF.HighChartConstants.V_NAME, categoryElementName);
	},
	buildCustomCategoryWithElement:function(customCategory, categoryIndex, categoryName, categoryElementIndex, categoryElementName)
	{
			customCategory.putInteger(oFF.HighChartConstants.V_INDEX, categoryIndex);
		customCategory.putString(oFF.HighChartConstants.V_NAME, categoryName);
		oFF.GenericHighChartConverterLatest.buildCustomCategoryElement(customCategory.putNewStructure(oFF.HighChartConstants.V_CATEGORY_ELEMENT), categoryElementIndex, categoryElementName);
	},
	chartLegendBuilder:function(chartVisualization, theChartData)
	{
			let legend = theChartData.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		legend.putBoolean(oFF.HighChartConstants.K_ENABLED, chartVisualization.getChartLegend().isEnabled());
		legend.putInteger(oFF.HighChartConstants.K_SYMBOL_RADIUS, 0);
		legend.putString(oFF.HighChartConstants.K_LAYOUT, oFF.GenericHighChartConverterLatest.getSafeNameLow(chartVisualization.getChartLegend().getLayoutDirection(), oFF.HighChartConstants.V_VERTICAL));
		legend.putString(oFF.HighChartConstants.K_ALIGN, oFF.GenericHighChartConverterLatest.getSafeNameLow(chartVisualization.getChartLegend().getHorizontalAlignment(), oFF.HighChartConstants.V_LEFT));
		legend.putString(oFF.HighChartConstants.K_VERTICAL_ALIGN, oFF.GenericHighChartConverterLatest.getSafeNameLow(chartVisualization.getChartLegend().getVerticalAlignment(), oFF.HighChartConstants.V_POSITION_TOP));
		legend.putBoolean(oFF.HighChartConstants.K_SQUARE_SYMBOL, true);
		let legenditemStyle = legend.putNewStructure(oFF.HighChartConstants.K_ITEM_STYLE);
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, chartVisualization.getChartLegend().getLabelStyle().getFontFamily());
		legenditemStyle.putString(oFF.HighChartConstants.K_COLOR, chartVisualization.getChartLegend().getLabelStyle().getFontColor());
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_STYLE, chartVisualization.getChartLegend().getLabelStyle().getFontStyle());
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, chartVisualization.getChartLegend().getLabelStyle().getFontWeight());
		legenditemStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, chartVisualization.getChartLegend().getLabelStyle().getFontSize());
		legenditemStyle.putInteger(oFF.HighChartConstants.K_WIDTH, 150);
		legenditemStyle.putString(oFF.HighChartConstants.K_TEXT_OVERFLOW, "none");
		let legendItemHoverStyle = legend.putNewStructure(oFF.HighChartConstants.K_ITEM_HOVER_STYLE);
		legendItemHoverStyle.putString(oFF.HighChartConstants.K_CURSOR_STYLE, "default");
	},
	chartPlotBuilder:function(chartVisualization, theChartData, chartTypes, needsPercentageLabels, isStacked)
	{
			let chartTypesIterator = chartTypes.getIterator();
		while (chartTypesIterator.hasNext())
		{
			let chartType = chartTypesIterator.next();
			let plotOptions = theChartData.getStructureByKey(oFF.HighChartConstants.K_PLOT_OPTIONS);
			if (oFF.isNull(plotOptions))
			{
				plotOptions = theChartData.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
			}
			let plotOptionsSeries = plotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
			plotOptionsSeries.putInteger(oFF.HighChartConstants.K_CROP_THRESHOLD, 1000);
			plotOptionsSeries.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
			let plotOptionChartTypeStructure = plotOptions.putNewStructure(chartType);
			if (oFF.XString.isEqual(chartType, oFF.HighChartConstants.K_PIE))
			{
				let chartOptionsStates = plotOptionChartTypeStructure.putNewStructure(oFF.HighChartConstants.K_STATES);
				let chartOptionsSelected = chartOptionsStates.putNewStructure(oFF.HighChartConstants.K_SELECT);
				chartOptionsSelected.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
				chartOptionsSelected.putString(oFF.HighChartConstants.K_COLOR, "#c0c0c0");
			}
			plotOptionChartTypeStructure.putBoolean(oFF.HighChartConstants.K_GROUPING, true);
			let dataLabels = plotOptionChartTypeStructure.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
			dataLabels.putBoolean(oFF.HighChartConstants.K_ENABLED, chartVisualization.getChartPlotArea().getLabelStyle().isEnabled());
			dataLabels.putBoolean(oFF.HighChartConstants.K_CROP, true);
			dataLabels.putNull(oFF.HighChartConstants.K_ALIGN);
			dataLabels.putString(oFF.HighChartConstants.K_COLOR, chartVisualization.getChartPlotArea().getLabelStyle().getFontColor());
			dataLabels.putString(oFF.HighChartConstants.K_OVERFLOW, "none");
			dataLabels.putBoolean(oFF.HighChartConstants.K_ALLOW_OVERLAP, false);
			dataLabels.putBoolean(oFF.HighChartConstants.K_INSIDE, isStacked);
			if (needsPercentageLabels)
			{
				dataLabels.putString(oFF.HighChartConstants.K_FORMAT, "{point.percentage:.2f} %");
			}
			else
			{
				dataLabels.putString(oFF.HighChartConstants.K_FORMAT, "{point.yFormatted} ");
			}
			let dataLabelsStyle = dataLabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
			dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_WEIGHT, chartVisualization.getChartPlotArea().getLabelStyle().getFontWeight());
			dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_FAMILY, chartVisualization.getChartPlotArea().getLabelStyle().getFontFamily());
			dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, chartVisualization.getChartPlotArea().getLabelStyle().getFontSize());
			dataLabelsStyle.putString(oFF.HighChartConstants.K_FONT_STYLE, chartVisualization.getChartPlotArea().getLabelStyle().getFontStyle());
			dataLabelsStyle.putString(oFF.HighChartConstants.K_TEXT_OVERFLOW, "ellipsis");
		}
	},
	chartScrollBuilder:function(theChartData, chartVisualization, chartAxisStruct, chartAxisDomainCategorial, groupSize)
	{
			if (chartVisualization.getChartType().isTypeOf(oFF.ChartVisualizationType.ABSTRACT_SERIES))
		{
			let xSize = chartAxisDomainCategorial.getCategories().size();
			let scrollbarStruct = chartAxisStruct.getStructureByKey(oFF.HighChartConstants.K_SCROLL_BAR);
			if (oFF.isNull(scrollbarStruct))
			{
				scrollbarStruct = chartAxisStruct.putNewStructure(oFF.HighChartConstants.K_SCROLL_BAR);
			}
			if (xSize > oFF.HighChartConstants.X_LIMIT)
			{
				chartAxisStruct.putInteger(oFF.HighChartConstants.K_MAX, oFF.HighChartConstants.X_LIMIT);
				scrollbarStruct.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
			}
			else
			{
				scrollbarStruct.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
				chartAxisStruct.putInteger(oFF.HighChartConstants.K_MAX, xSize - 1);
			}
		}
	},
	chartTitleBuilder:function(theChartData, charTtitle, chartSubtitle)
	{
			if (oFF.notNull(charTtitle))
		{
			let title = theChartData.putNewStructure(oFF.HighChartConstants.K_TITLE);
			title.putString(oFF.HighChartConstants.K_TEXT, charTtitle);
			title.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		}
		if (oFF.notNull(chartSubtitle))
		{
			let subtitle = theChartData.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
			subtitle.putString(oFF.HighChartConstants.K_TEXT, chartSubtitle);
			subtitle.putString(oFF.HighChartConstants.K_ALIGN, oFF.HighChartConstants.V_LEFT);
		}
	},
	getChartHatchingPath:function(patternType)
	{
			let path = null;
		if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING1;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING2;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING3;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING4;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING5;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING6;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING7;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
		{
			path = oFF.HighChartConstants.V_PATTERN_PATH_HATCHING8;
		}
		return path;
	},
	getChartHatchingSize:function(patternType)
	{
			let size = 0;
		if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING1;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING2;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING3;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING4;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING5;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING6;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING7;
		}
		else if (patternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
		{
			size = oFF.HighChartConstants.V_PATTERN_SIZE_HATCHING8;
		}
		return size;
	},
	getChartTypeString:function(chartVisualizationType)
	{
			let result = oFF.isNull(chartVisualizationType) ? "None" : oFF.XString.toLowerCase(chartVisualizationType.getName());
		if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.BAR))
		{
			result = oFF.HighChartConstants.V_CHART_TYPE_BAR;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.COLUMN))
		{
			result = oFF.HighChartConstants.V_CHART_TYPE_COLUMN;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.PIE) || chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.DOUGHNUT))
		{
			result = oFF.HighChartConstants.V_TYPE_CHART_PIE;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.SCATTER_PLOT))
		{
			result = oFF.HighChartConstants.K_SCATTER;
		}
		else if (chartVisualizationType.isTypeOf(oFF.ChartVisualizationType.LINE))
		{
			result = oFF.HighChartConstants.V_CHART_TYPE_LINE;
		}
		return result;
	},
	getChartTypeStringWithFallback:function(chartType, chartTypeFallback)
	{
			return oFF.GenericHighChartConverterLatest.getChartTypeString(oFF.isNull(chartType) ? chartTypeFallback : chartType);
	},
	getCoordinateName:function(chartType, name)
	{
			if (chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) || chartType.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK) || chartType.isTypeOf(oFF.ChartVisualizationType.AREA) || chartType.isTypeOf(oFF.ChartVisualizationType.LINE) || chartType.isTypeOf(oFF.ChartVisualizationType.SPLINE))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE_B) || oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE_C))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_Y;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.PIE) || chartType.isTypeOf(oFF.ChartVisualizationType.DOUGHNUT))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_Y;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.SCATTER_PLOT) || chartType.isTypeOf(oFF.ChartVisualizationType.BUBBLE))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_X;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE_B))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_Y;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE_C) || oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_Z;
			}
		}
		else if (chartType.isTypeOf(oFF.ChartVisualizationType.PACKED_BUBBLE) || chartType.isTypeOf(oFF.ChartVisualizationType.TREE_MAP))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_VALUE;
			}
		}
		if (chartType.isTypeOf(oFF.ChartVisualizationType.HEAT_MAP))
		{
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_VALUE) || oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_SIZE))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_VALUE;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_CATEGORY_AXIS))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_Y;
			}
			if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_CATEGORY_AXIS2))
			{
				return oFF.GenericHighChartConverterLatest.COORDINATE_X;
			}
		}
		if (oFF.XString.isEqual(name, oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_COLOR))
		{
			return oFF.GenericHighChartConverterLatest.COORDINATE_COLOR;
		}
		return name;
	},
	getDashStyleString:function(lineStyle)
	{
			let result = null;
		if (lineStyle === oFF.ChartVisualizationLineStyle.SOLID)
		{
			result = oFF.HighChartConstants.V_LINE_SOLID;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_SHORT_DASH_DOT_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DOT)
		{
			result = oFF.HighChartConstants.V_LINE_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DASH)
		{
			result = oFF.HighChartConstants.V_LINE_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH_DOT;
		}
		else if (lineStyle === oFF.ChartVisualizationLineStyle.LONG_DASH_DOT_DOT)
		{
			result = oFF.HighChartConstants.V_LINE_LONG_DASH_DOT_DOT;
		}
		return result;
	},
	getInnerRadius:function(chartType, chartTypeFallback)
	{
			let currentChartType = oFF.isNull(chartType) ? chartTypeFallback : chartType;
		let innerRadius = null;
		if (currentChartType === oFF.ChartVisualizationType.DOUGHNUT)
		{
			innerRadius = "50%";
		}
		return innerRadius;
	},
	getPieAndDoughnutVisualizationValueType:function()
	{
			return oFF.GenericHighChartConverterLatest.VISUALIZATION_VALUE_TYPE_SIZE;
	},
	getSafeNameLow:function(nameObject, defaultValue)
	{
			let result;
		if (oFF.notNull(nameObject))
		{
			result = oFF.XString.toLowerCase(nameObject.getName());
		}
		else
		{
			result = defaultValue;
		}
		return result;
	},
	getShapeName:function(shape)
	{
			let shapeName = null;
		if (shape === oFF.VisualizationChartPointShape.CIRCLE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_CIRCLE;
		}
		else if (shape === oFF.VisualizationChartPointShape.SQUARE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_SQUARE;
		}
		else if (shape === oFF.VisualizationChartPointShape.DIAMOND)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_DIAMOND;
		}
		else if (shape === oFF.VisualizationChartPointShape.TRIANGLE)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_TRIANGLE;
		}
		else if (shape === oFF.VisualizationChartPointShape.TRIANGLE_DOWN)
		{
			shapeName = oFF.HighChartConstants.V_SYMBOL_TRIANGLE_DOWN;
		}
		return shapeName;
	},
	getStackingType:function(stackName, stackingType, chartType, chartTypeFallback)
	{
			let chartTypeEffective = oFF.isNull(chartType) ? chartTypeFallback : chartType;
		let stackingTypeEffective = stackingType;
		if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.BAR_COLUMN) && stackingType !== oFF.ChartVisualizationStackingType.PERCENT)
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NORMAL;
		}
		else if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.LINE))
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NONE;
		}
		else if (chartTypeEffective.isTypeOf(oFF.ChartVisualizationType.AREA))
		{
			stackingTypeEffective = oFF.ChartVisualizationStackingType.NORMAL;
		}
		if (stackingTypeEffective === oFF.ChartVisualizationStackingType.NORMAL)
		{
			return oFF.HighChartConstants.V_NORMAL;
		}
		else if (stackingTypeEffective === oFF.ChartVisualizationStackingType.PERCENT)
		{
			return oFF.HighChartConstants.V_PERCENT;
		}
		else
		{
			return null;
		}
	},
	isNestedPointChart:function(chartType)
	{
			return chartType === oFF.ChartVisualizationType.TREE_MAP;
	},
	needsDirectDataLabels:function(chartVisualizationType)
	{
			return chartVisualizationType === oFF.ChartVisualizationType.HEAT_MAP;
	},
	needsNullDataPoints:function(chartType)
	{
			return chartType.isTypeOf(oFF.ChartVisualizationType.ABSTRACT_SERIES);
	},
	responsiveBuilder:function(chartType, theChartData)
	{
			let responsive = theChartData.putNewStructure(oFF.HighChartConstants.K_RESPONSIVE);
		let rules = responsive.putNewList(oFF.HighChartConstants.K_RULES);
		let rules3Object = rules.addNewStructure();
		let conditionStruct3 = rules3Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		conditionStruct3.putInteger(oFF.HighChartConstants.K_MAX_HEIGHT, 176);
		let chartOptions3Rules = rules3Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chartOptionsLegend3 = chartOptions3Rules.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		chartOptionsLegend3.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
		let chartOptions3yAxis = chartOptions3Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptions3yAxisLabel = chartOptions3yAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		chartOptions3yAxisLabel.putInteger(oFF.HighChartConstants.K_ROTATION, 344);
		chartOptions3yAxisLabel.putInteger(oFF.HighChartConstants.K_X, 10);
		let rules1Object = rules.addNewStructure();
		let conditionStruct = rules1Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		conditionStruct.putInteger(oFF.HighChartConstants.K_MAX_WIDTH, 359);
		conditionStruct.putInteger(oFF.HighChartConstants.K_MIN_HEIGHT, 70);
		let chartOptions1Rules = rules1Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chartInfo = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_CHART);
		chartInfo.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
		let topSpacing = 50;
		let rightSpacing = 50;
		let bottomSpacing = 50;
		let leftSpacing = 50;
		let spacingPrList = chartInfo.putNewList(oFF.HighChartConstants.K_SPACING);
		spacingPrList.addInteger(topSpacing);
		spacingPrList.addInteger(rightSpacing);
		spacingPrList.addInteger(bottomSpacing);
		spacingPrList.addInteger(leftSpacing);
		let chartOptionsPlotOptions = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
		let chartOptionsPlotOptionsSeries = chartOptionsPlotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
		let chartOptionsDatalabels = chartOptionsPlotOptionsSeries.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		let chartOptionsDatalabelsStyle = chartOptionsDatalabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		if (oFF.XString.isEqual(chartType, oFF.HighChartConstants.K_PIE))
		{
			chartOptionsDatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
			chartOptionsDatalabels.putInteger(oFF.HighChartConstants.K_CONNECTOR_WIDTH, 0);
			chartOptionsDatalabels.putInteger(oFF.HighChartConstants.K_DISTANCE, -30);
			chartOptionsDatalabels.putBoolean(oFF.HighChartConstants.K_INSIDE, true);
			chartInfo.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 40);
			chartOptionsDatalabels.putString(oFF.HighChartConstants.K_POINT_FORMAT, "{point.percentage:.2f} %");
			chartOptionsDatalabels.putBoolean(oFF.HighChartConstants.K_ENABLED, true);
		}
		else
		{
			chartInfo.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 50);
			chartOptionsDatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
		}
		let chartOptionsTitle = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_TITLE);
		let chartOptionsTitleStyle = chartOptionsTitle.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsTitleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "13px");
		chartOptionsTitleStyle.putBoolean(oFF.HighChartConstants.K_FLOATING, true);
		let chartOptions1subTitle = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
		chartOptions1subTitle.putString(oFF.HighChartConstants.K_TEXT, "");
		let chartOptionsxAxis = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_X_AXIS);
		let chartOptionsxAxisLabel = chartOptionsxAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptionsxAxisLabelStyle = chartOptionsxAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsxAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let chartOptionsyAxis = chartOptions1Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptionsyAxisLabel = chartOptionsyAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptionsyAxisLabelStyle = chartOptionsyAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptionsyAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let rules2Object = rules.addNewStructure();
		let condition2Struct = rules2Object.putNewStructure(oFF.HighChartConstants.K_CONDITION);
		condition2Struct.putInteger(oFF.HighChartConstants.K_MAX_WIDTH, 176);
		let chartOptions2Rules = rules2Object.putNewStructure(oFF.HighChartConstants.K_CHART_OPTIONS);
		let chart2Info = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_CHART);
		chart2Info.putBoolean(oFF.HighChartConstants.K_ANIMATION, false);
		let chartOptionsLegend2 = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_LEGEND);
		chartOptionsLegend2.putBoolean(oFF.HighChartConstants.K_ENABLED, false);
		chartOptionsLegend2.putInteger(oFF.HighChartConstants.K_Y, 25);
		let chartOptions2PlotOptions = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_PLOT_OPTIONS);
		let chartOptions2PlotOptionsPie = chartOptions2PlotOptions.putNewStructure(oFF.HighChartConstants.K_SERIES);
		chartOptions2PlotOptionsPie.putInteger(oFF.HighChartConstants.K_MIN_SIZE, 100);
		let chartOptions2Datalabels = chartOptions2PlotOptionsPie.putNewStructure(oFF.HighChartConstants.K_DATA_LABELS);
		chartOptions2Datalabels.putInteger(oFF.HighChartConstants.K_CONNECTOR_WIDTH, 0);
		chartOptions2Datalabels.putInteger(oFF.HighChartConstants.K_DISTANCE, -25);
		let chartOptions2DatalabelsStyle = chartOptions2Datalabels.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2DatalabelsStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "8px");
		chart2Info.putInteger(oFF.HighChartConstants.K_MARGIN_TOP, 40);
		let chartOptions2Title = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_TITLE);
		let chartOptions2TitleStyle = chartOptions2Title.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2TitleStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "10px");
		let chartOptions2subTitle = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_SUBTITLE);
		chartOptions2subTitle.putString(oFF.HighChartConstants.K_TEXT, "");
		let chartOptions2xAxis = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_X_AXIS);
		let chartOptions2xAxisLabel = chartOptions2xAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptions2xAxisLabelStyle = chartOptions2xAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2xAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
		let chartOptions2yAxis = chartOptions2Rules.putNewStructure(oFF.HighChartConstants.K_Y_AXIS);
		let chartOptions2yAxisLabel = chartOptions2yAxis.putNewStructure(oFF.HighChartConstants.K_LABELS);
		let chartOptions2yAxisLabelStyle = chartOptions2yAxisLabel.putNewStructure(oFF.HighChartConstants.K_STYLE);
		chartOptions2yAxisLabelStyle.putString(oFF.HighChartConstants.K_FONT_SIZE, "9px");
	}
};

oFF.SacGridRendererFactoryImpl = function() {};
oFF.SacGridRendererFactoryImpl.prototype = new oFF.XObject();
oFF.SacGridRendererFactoryImpl.prototype._ff_c = "SacGridRendererFactoryImpl";

oFF.SacGridRendererFactoryImpl.create = function()
{
	return new oFF.SacGridRendererFactoryImpl();
};
oFF.SacGridRendererFactoryImpl.prototype.newGridRenderer = function(table)
{
	return oFF.GenericTableRenderer.create(table);
};

oFF.VizFrameRenderer = function() {};
oFF.VizFrameRenderer.prototype = new oFF.XObject();
oFF.VizFrameRenderer.prototype._ff_c = "VizFrameRenderer";

oFF.VizFrameRenderer.CHART_DATA = "chartData";
oFF.VizFrameRenderer.DIMENSIONS = "oDimensions";
oFF.VizFrameRenderer.IDENTITY = "identity";
oFF.VizFrameRenderer.MEASURES = "oMeasures";
oFF.VizFrameRenderer.NAME = "name";
oFF.VizFrameRenderer.TYPE = "type";
oFF.VizFrameRenderer.UNIT = "unit";
oFF.VizFrameRenderer.VALUE = "value";
oFF.VizFrameRenderer.create = function(chartVisualization)
{
	let obj = new oFF.VizFrameRenderer();
	obj.m_chartVisualization = chartVisualization;
	obj.m_resultObject = oFF.PrFactory.createStructure();
	return obj;
};
oFF.VizFrameRenderer.prototype.m_chartVisualization = null;
oFF.VizFrameRenderer.prototype.m_resultObject = null;
oFF.VizFrameRenderer.prototype.buildChartData = function(chartDataList)
{
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	let xAxis = this.m_chartVisualization.getXAxes().get(0);
	let categories = xAxis.getAxisDomain().getAsCategorial().getCategories();
	for (let ci = 0; ci < categories.size(); ci++)
	{
		let dataPointStructure = chartDataList.addNewStructure();
		let category = categories.get(ci);
		dataPointStructure.putString(oFF.XString.replace(xAxis.getName(), ":", ""), category.getText());
	}
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		for (let j = 0; j < coordinateSystem.getSeriesGroups().size(); j++)
		{
			let seriesGroup = coordinateSystem.getSeriesGroups().get(j);
			let series = seriesGroup.getSeries().get(0);
			for (let di = 0; di < series.getChartDataPoints().size(); di++)
			{
				let element = chartDataList.getStructureAt(di);
				let dataPoint = series.getChartDataPoints().get(di);
				let value = dataPoint.getCoordinates().get(0).getValue();
				if (value.getValueType().isNumber())
				{
					let doubleValue = oFF.XValueUtil.getDouble(value, false, true);
					element.putDouble(oFF.XStringUtils.concatenate2("m", oFF.XInteger.convertToString(j)), doubleValue);
				}
			}
		}
	}
};
oFF.VizFrameRenderer.prototype.buildDimensions = function(oDimensions)
{
	let xAxis = this.m_chartVisualization.getXAxes().get(0);
	let dimensionStructure = oDimensions.addNewStructure();
	let name = xAxis.getText();
	let identity = oFF.XString.replace(xAxis.getName(), ":", "");
	dimensionStructure.putString(oFF.VizFrameRenderer.IDENTITY, identity);
	dimensionStructure.putString(oFF.VizFrameRenderer.NAME, name);
	dimensionStructure.putString(oFF.VizFrameRenderer.VALUE, oFF.XStringUtils.concatenate3("{", identity, "}"));
};
oFF.VizFrameRenderer.prototype.buildMeasures = function(measureList, chartMeasureList)
{
	let seriesIndex = 0;
	let coordinateSystems = this.m_chartVisualization.getCoordinateSystems();
	for (let i = 0; i < coordinateSystems.size(); i++)
	{
		let coordinateSystem = coordinateSystems.get(i);
		for (let j = 0; j < coordinateSystem.getSeriesGroups().size(); j++)
		{
			let measureStructure = measureList.addNewStructure();
			let chartMeasureStructure = chartMeasureList.addNewStructure();
			let seriesGroup = coordinateSystem.getSeriesGroups().get(j);
			for (let k = 0; k < seriesGroup.getSeries().size(); k++)
			{
				let series = seriesGroup.getSeries().get(k);
				let mergableCategories = oFF.XList.create();
				let stylingCategories = series.getStylingCategories();
				if (oFF.XCollectionUtils.hasElements(stylingCategories))
				{
					mergableCategories.addAll(stylingCategories);
				}
				mergableCategories.add(seriesGroup.getCategory());
				mergableCategories.add(series.getCategory());
				let identity = oFF.XStringUtils.concatenate2("m", oFF.XInteger.convertToString(seriesIndex));
				let name = this.extractSeriesHeadingFromCategory(mergableCategories);
				let value = oFF.XStringUtils.concatenate3("{", identity, "}");
				measureStructure.putString(oFF.VizFrameRenderer.IDENTITY, identity);
				chartMeasureStructure.putString(oFF.VizFrameRenderer.IDENTITY, identity);
				measureStructure.putString(oFF.VizFrameRenderer.NAME, name);
				chartMeasureStructure.putString(oFF.VizFrameRenderer.NAME, name);
				measureStructure.putString(oFF.VizFrameRenderer.UNIT, "");
				measureStructure.putString(oFF.VizFrameRenderer.VALUE, value);
				seriesIndex = seriesIndex + 1;
			}
		}
	}
};
oFF.VizFrameRenderer.prototype.extractSeriesHeadingFromCategory = function(mergableCategories)
{
	let headingParts = oFF.XList.create();
	let unitParts = oFF.XList.create();
	for (let i = 0; i < mergableCategories.size(); i++)
	{
		let mergableCategory = mergableCategories.get(i);
		if (oFF.isNull(mergableCategory))
		{
			continue;
		}
		let uniqueScalingUnit = mergableCategory.getUniqueUnitScaleInformation();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(uniqueScalingUnit))
		{
			unitParts.add(uniqueScalingUnit);
		}
		let elements = mergableCategory.getCategoryElements();
		for (let j = 0; j < elements.size(); j++)
		{
			let element = elements.get(j);
			let elementText = element.getText();
			if (!headingParts.contains(elementText))
			{
				headingParts.add(elementText);
			}
		}
	}
	let resultString = oFF.XCollectionUtils.join(headingParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR);
	if (oFF.XCollectionUtils.hasElements(unitParts))
	{
		resultString = oFF.XStringUtils.concatenate4(resultString, oFF.HighChartConstants.V_HEADING_UNIT_INFO_PREFIX, oFF.XCollectionUtils.join(unitParts, oFF.HighChartConstants.V_HEADING_CATEGORY_SEPARATOR), oFF.HighChartConstants.V_HEADING_UNIT_INFO_SUFFIX);
	}
	return resultString;
};
oFF.VizFrameRenderer.prototype.getChartJson = function()
{
	return null;
};
oFF.VizFrameRenderer.prototype.render = function()
{
	this.m_resultObject.putString(oFF.VizFrameRenderer.TYPE, oFF.XString.toLowerCase(this.m_chartVisualization.getChartType().getName()));
	this.buildChartData(this.m_resultObject.putNewList(oFF.VizFrameRenderer.CHART_DATA));
	this.buildMeasures(this.m_resultObject.putNewList(oFF.VizFrameRenderer.MEASURES), this.m_resultObject.putNewList("oChartMeasures"));
	this.buildDimensions(this.m_resultObject.putNewList(oFF.VizFrameRenderer.DIMENSIONS));
	return this.m_resultObject;
};
oFF.VizFrameRenderer.prototype.setChartConfigration = function(chartConfig) {};

oFF.VizInstanceConstants = {

	DATA:"data",
	DATA_SET_STRUCTURE:"dataSetStructure",
	FIELDS:"fields",
	METADATA:"metadata"
};

oFF.VizInstanceRenderer = function() {};
oFF.VizInstanceRenderer.prototype = new oFF.XObject();
oFF.VizInstanceRenderer.prototype._ff_c = "VizInstanceRenderer";

oFF.VizInstanceRenderer.create = function(chartVisualization)
{
	let obj = new oFF.VizInstanceRenderer();
	obj.m_resultObject = null;
	return obj;
};
oFF.VizInstanceRenderer.prototype.m_resultObject = null;
oFF.VizInstanceRenderer.prototype.buildDataSetStructure = function(dataSetStructure) {};
oFF.VizInstanceRenderer.prototype.getChartJson = function()
{
	return this.m_resultObject;
};
oFF.VizInstanceRenderer.prototype.render = function()
{
	this.m_resultObject = oFF.PrFactory.createStructure();
	this.buildDataSetStructure(this.m_resultObject.putNewStructure(oFF.VizInstanceConstants.DATA_SET_STRUCTURE));
	return this.m_resultObject;
};
oFF.VizInstanceRenderer.prototype.setChartConfigration = function(chartConfig) {};

oFF.SacTableWidgetRenderHelper = function() {};
oFF.SacTableWidgetRenderHelper.prototype = new oFF.XObject();
oFF.SacTableWidgetRenderHelper.prototype._ff_c = "SacTableWidgetRenderHelper";

oFF.SacTableWidgetRenderHelper.createTableRenderHelper = function(table)
{
	let instance = new oFF.SacTableWidgetRenderHelper();
	instance.initializeRH(table);
	return instance;
};
oFF.SacTableWidgetRenderHelper.prototype.m_tableObject = null;
oFF.SacTableWidgetRenderHelper.prototype.applyPadding = function(paddingStructure, padding, paddingKey)
{
	if (padding > -1)
	{
		paddingStructure.putDouble(paddingKey, padding);
	}
};
oFF.SacTableWidgetRenderHelper.prototype.fillPagedRowsFromList = function(rowList, prRowList, rowOffsetCounterStart, curRowPageStart, curRowPageEnd, headerColumnListSize, curColumnPageStart, curColumnPageEnd)
{
	let themeCache = oFF.XHashMapByString.create();
	let index;
	let effectiveRowIndex = rowOffsetCounterStart;
	for (index = curRowPageStart; index <= curRowPageEnd; index++)
	{
		let row = rowList.get(index);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			this.renderRow(themeCache, prRowList, row, effectiveRowIndex, headerColumnListSize, curColumnPageStart, curColumnPageEnd);
			effectiveRowIndex++;
		}
	}
};
oFF.SacTableWidgetRenderHelper.prototype.fillRowsFromList = function(rowList, prRowList, offset, freezeRows, freezeUpToRows)
{
	let themeCache = oFF.XHashMapByString.create();
	let index;
	let effectiveIndex = offset;
	let rowAmount = rowList.size();
	for (index = 0; index < rowAmount; index++)
	{
		let row = rowList.get(index);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			let headerRowStructure = this.renderRow(themeCache, prRowList, row, effectiveIndex, 0, 0, -1);
			if (freezeRows && freezeUpToRows < 0 || freezeUpToRows >= effectiveIndex)
			{
				headerRowStructure.putBoolean(oFF.SacTableConstants.R_B_FIXED, true);
			}
			effectiveIndex++;
		}
		else if (oFF.isNull(row))
		{
			effectiveIndex++;
		}
	}
};
oFF.SacTableWidgetRenderHelper.prototype.fillRowsFromListKeepGaps = function(rowList, prRowList, offset)
{
	let themeCache = oFF.XHashMapByString.create();
	let index;
	let rowAmount = rowList.size();
	let effectiveIndex = offset;
	for (index = 0; index < rowAmount; index++)
	{
		let row = rowList.get(index);
		if (oFF.notNull(row) && !row.isEffectivelyHidden())
		{
			this.renderRow(themeCache, prRowList, row, effectiveIndex++, 0, 0, -1);
		}
		else if (oFF.isNull(row))
		{
			prRowList.addNull();
			effectiveIndex++;
		}
	}
};
oFF.SacTableWidgetRenderHelper.prototype.format = function(themeCache, cellBase, structureToFormat, styles)
{
	if (cellBase.isEffectiveTotalsContext())
	{
		structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_INA_TOTALS_CONTEXT, true);
	}
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_IS_IN_HIERARCHY, cellBase.isInHierarchy());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_ALLOW_DRAG_DROP, cellBase.isAllowDragDrop());
	structureToFormat.putInteger(oFF.SacTableConstants.C_N_LEVEL, cellBase.getHierarchyLevel());
	structureToFormat.putInteger(cellBase.getHierarchyPaddingType(), cellBase.getHierarchyPaddingValue() * (1 + cellBase.getHierarchyLevel()));
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_SHOW_DRILL_ICON, cellBase.isShowDrillIcon());
	structureToFormat.putBoolean(oFF.SacTableConstants.C_B_EXPANDED, cellBase.isExpanded());
	let color = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveFillColor(styles));
	if (oFF.notNull(color))
	{
		let alpha = cellBase.getEffectiveFillAlphaOverwrite(styles);
		if (alpha !== -1)
		{
			color = oFF.UiColor.create(color).setAlpha(alpha).getHexColorWithAlpha();
		}
		let style = this.getStyle(structureToFormat);
		style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, color);
	}
	if (cellBase.isWrap())
	{
		this.getStyle(structureToFormat).putBoolean(oFF.SacTableConstants.ST_B_WRAP, true);
	}
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineTop(styles), oFF.SacTableConstants.LP_TOP, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyleLineBottom(styles), oFF.SacTableConstants.LP_BOTTOM, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineLeft(styles), oFF.SacTableConstants.LP_LEFT, structureToFormat);
	this.transferStyledLineToJson(themeCache, cellBase.getEffectiveStyledLineRight(styles), oFF.SacTableConstants.LP_RIGHT, structureToFormat);
	if (cellBase.isEffectiveFontItalic(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_ITALIC, true);
	}
	if (cellBase.isEffectiveFontBold(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_BOLD, true);
	}
	if (cellBase.isEffectiveFontUnderline(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_UNDERLINE, true);
	}
	if (cellBase.isEffectiveFontStrikeThrough(styles))
	{
		this.getFont(structureToFormat).putBoolean(oFF.SacTableConstants.FS_B_STRIKETHROUGH, true);
	}
	let effectiveFontSize = cellBase.getEffectiveFontSize(styles);
	if (effectiveFontSize > 0)
	{
		this.getFont(structureToFormat).putDouble(oFF.SacTableConstants.FS_N_SIZE, effectiveFontSize);
	}
	let effectiveFontFamily = cellBase.getEffectiveFontFamily(styles);
	if (oFF.notNull(effectiveFontFamily))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_FAMILY, effectiveFontFamily);
	}
	color = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveFontColor(styles));
	if (oFF.notNull(color))
	{
		this.getFont(structureToFormat).putString(oFF.SacTableConstants.FS_S_COLOR, color);
	}
	let effectiveThresholdColor = oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveThresholdColor(styles));
	if (oFF.notNull(effectiveThresholdColor))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_COLOR, effectiveThresholdColor);
	}
	let effectiveSymbolStringConstant = oFF.SacTableConstantMapper.mapAlertSymbolToString(cellBase.getEffectiveThresholdType(styles));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(effectiveSymbolStringConstant))
	{
		this.getStyle(structureToFormat).putString(oFF.SacTableConstants.ST_S_THRESHOLD_ICON_TYPE, effectiveSymbolStringConstant);
	}
	let hAlignment = cellBase.getEffectiveHorizontalAlignment(styles);
	let vAlignment = cellBase.getEffectiveVerticalAlignment(styles);
	if (oFF.notNull(hAlignment) || oFF.notNull(vAlignment))
	{
		let alignmentStructure = this.getStyle(structureToFormat).putNewStructure(oFF.SacTableConstants.ST_M_ALIGNMENT);
		if (hAlignment === oFF.SacVisualizationHorizontalAlignment.LEFT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_LEFT);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.CENTER)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_CENTER);
		}
		else if (hAlignment === oFF.SacVisualizationHorizontalAlignment.RIGHT)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_HORIZONTAL, oFF.SacTableConstants.HA_RIGHT);
		}
		if (vAlignment === oFF.SacVisualizationVerticalAlignment.TOP)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_TOP);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.MIDDLE)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_MIDDLE);
		}
		else if (vAlignment === oFF.SacVisualizationVerticalAlignment.BOTTOM)
		{
			alignmentStructure.putInteger(oFF.SacTableConstants.STAL_N_VERTICAL, oFF.SacTableConstants.VA_BOTTOM);
		}
	}
	let backgroundPatternType = cellBase.getEffectiveBackgroundPatternType(styles);
	if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putStringNotNullAndNotEmpty(oFF.SacTableConstants.C_S_FORMATTED, cellBase.getEffectiveBackgroundContent(styles));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_1));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_2));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_3));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_4));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_5));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_6));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_7));
	}
	else if (backgroundPatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
	{
		structureToFormat.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_IMAGE);
		structureToFormat.putString(oFF.SacTableConstants.C_S_FORMATTED, oFF.XStringUtils.concatenate2(oFF.SacTableConstants.IMG_B64_PREFIX_SHORT, oFF.SacTableConstants.BASE64_SVG_HATCHING_8));
	}
	return structureToFormat;
};
oFF.SacTableWidgetRenderHelper.prototype.getCorrectWidth = function(originallWidth, factor, maxPixelCellWidth, minPixelCellWidth)
{
	return oFF.XMath.min(maxPixelCellWidth, oFF.XMath.max(oFF.XMath.div(originallWidth * factor, 10), minPixelCellWidth));
};
oFF.SacTableWidgetRenderHelper.prototype.getFont = function(structure)
{
	let style = this.getStyle(structure);
	let font = style.getStructureByKey(oFF.SacTableConstants.ST_M_FONT);
	if (oFF.isNull(font))
	{
		font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
	}
	return font;
};
oFF.SacTableWidgetRenderHelper.prototype.getLineInternal = function(position, structure)
{
	let style = this.getStyle(structure);
	if (!style.containsKey(oFF.SacTableConstants.ST_L_LINES))
	{
		style.putNewList(oFF.SacTableConstants.ST_L_LINES);
	}
	let lines = style.getListByKey(oFF.SacTableConstants.ST_L_LINES);
	let line = null;
	for (let i = 0; i < lines.size(); i++)
	{
		if (lines.getStructureAt(i).getIntegerByKey(oFF.SacTableConstants.SL_N_POSITION) === position)
		{
			line = lines.getStructureAt(i);
		}
	}
	if (oFF.isNull(line))
	{
		line = lines.addNewStructure();
		line.putInteger(oFF.SacTableConstants.SL_N_SIZE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_STYLE, 1);
		line.putInteger(oFF.SacTableConstants.SL_N_POSITION, position);
		let padding = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
		if (position === oFF.SacTableConstants.LP_BOTTOM || position === oFF.SacTableConstants.LP_TOP)
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_RIGHT, oFF.SacTableConstants.LP_RIGHT);
			padding.putInteger(oFF.SacTableConstants.SLP_N_LEFT, oFF.SacTableConstants.LP_RIGHT);
		}
		else
		{
			padding.putInteger(oFF.SacTableConstants.SLP_N_BOTTOM, oFF.SacTableConstants.LP_BOTTOM);
			padding.putInteger(oFF.SacTableConstants.SLP_N_TOP, oFF.SacTableConstants.LP_TOP);
		}
	}
	return line;
};
oFF.SacTableWidgetRenderHelper.prototype.getStyle = function(structure)
{
	if (!structure.containsKey(oFF.SacTableConstants.C_M_STYLE))
	{
		structure.putBoolean(oFF.SacTableConstants.C_B_STYLE_UPDATED_BY_USER, true);
		structure.putNewStructure(oFF.SacTableConstants.C_M_STYLE);
	}
	return structure.getStructureByKey(oFF.SacTableConstants.C_M_STYLE);
};
oFF.SacTableWidgetRenderHelper.prototype.getTableObject = function()
{
	return this.m_tableObject;
};
oFF.SacTableWidgetRenderHelper.prototype.initializeRH = function(tableObject)
{
	this.m_tableObject = tableObject;
};
oFF.SacTableWidgetRenderHelper.prototype.preFormatCellChart = function(themeCache, cellBase, structure, rowIndex, colIndex)
{
	let styles = cellBase.getPrioritizedStylesList();
	structure.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, oFF.SacTableConstants.CT_CHART);
	let cellChart = structure.putNewStructure(oFF.SacTableConstants.C_M_CELL_CHART);
	cellChart.putString(oFF.SacTableConstants.CC_S_MEMBER_ID, cellBase.getEffectiveCellChartMemberName(styles));
	let cellChartType = cellBase.getEffectiveCellChartType();
	if (cellChartType === oFF.SacCellChartType.BAR)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_BAR);
	}
	else if (cellChartType === oFF.SacCellChartType.VARIANCE_BAR)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_VARIANCE_BAR);
	}
	else if (cellChartType === oFF.SacCellChartType.PIN)
	{
		cellChart.putString(oFF.SacTableConstants.CC_S_CHART_TYPE, oFF.SacTableConstants.CCT_VARIANCE_PIN);
	}
	cellChart.putString(oFF.SacTableConstants.CC_S_BAR_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveCellChartBarColor(styles)));
	cellChart.putString(oFF.SacTableConstants.CC_SU_LINE_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, cellBase.getEffectiveCellChartLineColor(styles)));
	cellChart.putBoolean(oFF.SacTableConstants.CC_B_SHOW_VALUE, !cellBase.isEffectiveHideNumberForCellChart());
	cellChart.putString(oFF.SacTableConstants.CC_S_CELL_CHART_ORIENTATION, cellBase.getEffectiveCellChartOrientation() === oFF.SacCellChartOrientation.VERTICAL ? oFF.SacTableConstants.CCO_VERTICAL : oFF.SacTableConstants.CCO_HORIZONTAL);
	let cellChartInfo = this.m_tableObject.getCellChartInfo();
	if (!cellChartInfo.containsKey(cellBase.getEffectiveCellChartMemberName(styles)))
	{
		cellChartInfo.put(cellBase.getEffectiveCellChartMemberName(styles), oFF.CellChartInfo.create(cellBase.getEffectiveCellChartOrientation(), colIndex, rowIndex, oFF.XValueUtil.getDouble(cellBase.getPlain(), false, true)));
	}
	else
	{
		let cellChartMeasureInfo = cellChartInfo.getByKey(cellBase.getEffectiveCellChartMemberName(styles));
		cellChartMeasureInfo.addColumn(colIndex);
		cellChartMeasureInfo.addRow(rowIndex);
		cellChartMeasureInfo.registerValue(oFF.XValueUtil.getDouble(cellBase.getPlain(), false, true));
	}
	return cellChart;
};
oFF.SacTableWidgetRenderHelper.prototype.releaseObject = function()
{
	this.m_tableObject = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SacTableWidgetRenderHelper.prototype.renderCell = function(themeCache, cellList, cellBase, styles, rowIndex, colIndex)
{
	let structure = cellList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.C_N_ROW, rowIndex);
	structure.putInteger(oFF.SacTableConstants.C_N_COLUMN, colIndex);
	let mergedColumns = cellBase.getMergedColumns();
	let mergedRows = cellBase.getMergedRows();
	if (mergedColumns !== 0 || mergedRows !== 0)
	{
		let mergerStructure = structure.putNewStructure(oFF.SacTableConstants.C_M_MERGED);
		if (mergedColumns >= 0 && mergedRows >= 0)
		{
			if (cellBase.getMergedColumns() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_COLUMNS, cellBase.getMergedColumns());
			}
			if (cellBase.getMergedRows() > 0)
			{
				mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ROWS, cellBase.getMergedRows());
			}
		}
		else
		{
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_COLUMN, colIndex + cellBase.getMergedColumns());
			mergerStructure.putInteger(oFF.SacTableConstants.CM_N_ORIGINAL_ROW, rowIndex + cellBase.getMergedRows());
		}
	}
	if (cellBase.getCommentDocumentId() !== null)
	{
		structure.putInteger(oFF.SacTableConstants.C_N_COMMENT_TYPE, oFF.SacTableConstants.CT_SELF);
		structure.putString(oFF.SacTableConstants.CS_COMMENT_DOCUMENT_ID, cellBase.getCommentDocumentId());
	}
	let localId = cellBase.getId();
	if (oFF.isNull(localId))
	{
		localId = oFF.XStringUtils.concatenate2(oFF.XInteger.convertToHexString(rowIndex), oFF.XInteger.convertToHexString(colIndex));
	}
	structure.putString(oFF.SacTableConstants.C_S_ID, localId);
	structure.putString(oFF.SacTableConstants.C_S_FORMATTED, cellBase.getEffectiveWrappedFormattedText(styles));
	if (cellBase.isShowHyperLink())
	{
		structure.putBoolean(oFF.SacTableConstants.C_B_SHOW_HYPERLINK, true);
	}
	structure.putBoolean(oFF.SacTableConstants.C_B_REPEATED_MEMBER_NAME, cellBase.isRepeatedHeader());
	let plainValue = cellBase.getPlain();
	if (oFF.notNull(plainValue))
	{
		let valueType = cellBase.getPlain().getValueType();
		if (valueType === oFF.XValueType.BOOLEAN)
		{
			structure.putBoolean(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getBoolean(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.DOUBLE || valueType === oFF.XValueType.DECIMAL_FLOAT && plainValue.mayLoosePrecision())
		{
			structure.putDouble(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getDouble(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.LONG)
		{
			structure.putLong(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getLong(plainValue, false, true));
		}
		else if (valueType === oFF.XValueType.INTEGER)
		{
			structure.putInteger(oFF.SacTableConstants.C_SN_PLAIN, oFF.XValueUtil.getInteger(plainValue, false, true));
		}
		else
		{
			structure.putString(oFF.SacTableConstants.C_SN_PLAIN, plainValue.getStringRepresentation());
		}
	}
	let effectiveCellType = cellBase.getEffectiveCellType();
	structure.putInteger(oFF.SacTableConstants.C_N_CELL_TYPE, effectiveCellType);
	structure.putBoolean(oFF.SacTableConstants.C_B_DRAGGABLE, !cellBase.isUdhContext() && (effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_COL_DIM_HEADER || effectiveCellType === oFF.SacTableConstants.CT_ROW_DIM_HEADER) || cellBase.isInStructureContext() && !cellBase.isInHierarchy() && (effectiveCellType === oFF.SacTableConstants.CT_ROW_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_COL_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_ROW_DIM_MEMBER || effectiveCellType === oFF.SacTableConstants.CT_ATTRIBUTE_COL_DIM_MEMBER));
	if (cellBase.isEffectiveShowCellChart())
	{
		this.preFormatCellChart(themeCache, cellBase, structure, rowIndex, colIndex);
	}
	return structure;
};
oFF.SacTableWidgetRenderHelper.prototype.renderCellForRow = function(themeCache, effectiveIndex, rowIndex, cell, cellList, stripeRows, stripeColumns, stripeAny)
{
	let success;
	if (oFF.isNull(cell))
	{
		this.renderEmptyCell(cellList, rowIndex, effectiveIndex);
		success = true;
	}
	else if (cell.getParentColumn() !== null && !cell.getParentColumn().isEffectivelyHidden())
	{
		let styles = cell.getPrioritizedStylesList();
		let cellStructure = this.renderCell(themeCache, cellList, cell, styles, rowIndex, effectiveIndex);
		success = true;
		this.format(themeCache, cell, cellStructure, styles);
		if (stripeAny)
		{
			let style = this.getStyle(cellStructure);
			if (oFF.XStringUtils.isNullOrEmpty(style.getStringByKey(oFF.SacTableConstants.ST_S_FILL_COLOR)))
			{
				if (stripeRows && oFF.XMath.mod(rowIndex, 2) === 0)
				{
					style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, oFF.SacTableConstants.SV_ROW_STRIPE_COLOR);
				}
				else if (stripeColumns && oFF.XMath.mod(effectiveIndex, 2) === 0)
				{
					style.putString(oFF.SacTableConstants.ST_S_FILL_COLOR, oFF.SacTableConstants.SV_COLUMN_STRIPE_COLOR);
				}
			}
		}
	}
	else
	{
		success = false;
	}
	return success;
};
oFF.SacTableWidgetRenderHelper.prototype.renderColumn = function(sacTableColumn, columnStructure) {};
oFF.SacTableWidgetRenderHelper.prototype.renderEmptyCell = function(cellList, rowIndex, colIndex)
{
	let structure = cellList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.C_N_ROW, rowIndex);
	structure.putInteger(oFF.SacTableConstants.C_N_COLUMN, colIndex);
	return structure;
};
oFF.SacTableWidgetRenderHelper.prototype.renderGenericSettings = function(tableJson)
{
	let result;
	if (oFF.notNull(this.m_tableObject))
	{
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_IS_INTERACTIVE_HIERARCHY, this.m_tableObject.hasHierarchy());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_ALLOW_KEY_EVENT_PROPAGATION, true);
		let featureToggles = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_FEATURE_TOGGLES);
		featureToggles.putBoolean(oFF.SacTableConstants.TD_M_FEATURE_TOGGLES_DIM_HEADER_CELLS_WITH_ICONS, true);
		featureToggles.putBoolean(oFF.SacTableConstants.TD_M_FEATURE_TOGGLES_ACCESSIBILITY_KEYBOARD_SUPPORT, true);
		featureToggles.putBoolean(oFF.SacTableConstants.TD_M_FEATURE_TOGGLES_ACCESSIBILITY_SCREEN_READER_SUPPORT, true);
		let style = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_STYLE);
		let font = style.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
		font.putInteger(oFF.SacTableConstants.FS_N_SIZE, 42);
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_REVERSED_HIERARCHY, this.m_tableObject.isReversedHierarchy());
		let title = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_TITLE);
		let titleStyle = title.putNewStructure(oFF.SacTableConstants.TD_M_TITLE_STYLE);
		title.putNewStructure(oFF.SacTableConstants.TD_M_SUBTITLE_STYLE);
		let titleFont = titleStyle.putNewStructure(oFF.SacTableConstants.ST_M_FONT);
		titleFont.putInteger(oFF.SacTableConstants.FS_N_SIZE, 17);
		let titleText = this.m_tableObject.getTitle();
		title.putStringNotNullAndNotEmpty(oFF.SacTableConstants.TD_S_TITLE_TEXT, titleText);
		tableJson.putStringNotNullAndNotEmpty(oFF.SacTableConstants.TD_S_ID_FOR_TABLE_NAME_ARIA_LABEL, titleText);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(titleText))
		{
			title.putNewList(oFF.SacTableConstants.TD_L_TITLE_CHUNKS).addString(titleText);
		}
		let titleTokens = title.putNewStructure(oFF.SacTableConstants.TD_M_TOKEN_DATA);
		let titelTokenStyles = titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_STYLES);
		titelTokenStyles.putString("line-height", "");
		titelTokenStyles.putString("text-align", "left");
		titelTokenStyles.putString("font-size", "13px");
		titelTokenStyles.putString("align-items", "center");
		titelTokenStyles.putString("margin-top", "3px");
		titleTokens.putNewStructure(oFF.SacTableConstants.TE_O_ATTRIBUTES);
		titleTokens.putNewList(oFF.SacTableConstants.TE_L_CLASSES).addString("sapReportEngineTokenContainer");
		titleTokens.putString(oFF.SacTableConstants.TE_S_TAG, "div");
		let titleVisible = this.m_tableObject.isShowTableTitle();
		let subtitleVisible = this.m_tableObject.isShowSubTitle();
		let detailsVisible = this.m_tableObject.isShowTableDetails();
		title.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, titleVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, subtitleVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, detailsVisible);
		title.putBoolean(oFF.SacTableConstants.TD_B_EDITABLE, false);
		let titleAreaHeight = 40;
		if (titleVisible && (detailsVisible || subtitleVisible))
		{
			titleAreaHeight = 52;
		}
		else if (!titleVisible && !detailsVisible && !subtitleVisible)
		{
			titleAreaHeight = 0;
		}
		titleStyle.putInteger(oFF.SacTableConstants.TS_N_HEIGHT, titleAreaHeight);
		let i;
		let tableHeight = this.m_tableObject.getHeight();
		let tableWidth = this.m_tableObject.getWidth();
		tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_HEIGHT, tableHeight);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_WIDGET_WIDTH, tableWidth);
		let showGrid = this.m_tableObject.isShowGrid();
		let freezingColumns = this.m_tableObject.isFreezeHeaderColumns() || this.m_tableObject.getFreezeUpToColumn() > -1;
		let freezing = this.m_tableObject.isFreezeHeaderRows() || this.m_tableObject.getFreezeUpToRow() > -1 || freezingColumns;
		let freezeUpToColumn = this.m_tableObject.getFreezeUpToColumn();
		if (freezeUpToColumn > -1 || !this.m_tableObject.isFreezeHeaderColumns())
		{
			tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, freezeUpToColumn);
		}
		else
		{
			tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_COL, this.m_tableObject.getPreColumnsAmount() - 1);
		}
		let freezeUpToRow = this.m_tableObject.getFreezeUpToRow();
		if (freezeUpToRow > -1 || !this.m_tableObject.isFreezeHeaderRows())
		{
			tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, freezeUpToRow);
		}
		else
		{
			tableJson.putInteger(oFF.SacTableConstants.TD_N_FREEZE_END_ROW, this.m_tableObject.getPreRowsAmount() - 1);
		}
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_FREEZE_LINES, freezing && this.m_tableObject.isShowFreezeLines());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_HAS_FIXED_ROWS_COLS, freezing);
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_GRID, showGrid);
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_COORDINATE_HEADER, this.m_tableObject.isShowCoordinateHeader());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_SHOW_GRID, this.m_tableObject.isShowGrid());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_SUBTITLE_VISIBLE, this.m_tableObject.isShowSubTitle());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_TITLE_VISIBLE, this.m_tableObject.isShowTableTitle());
		tableJson.putBoolean(oFF.SacTableConstants.TD_B_DETAILS_VISIBLE, this.m_tableObject.isShowTableDetails());
		let columnSettings = tableJson.putNewList(oFF.SacTableConstants.TD_L_COLUMN_SETTINGS);
		let columnWidths = oFF.XList.create();
		let rowPaginated = this.m_tableObject.isRowPaginated();
		let columnPaginated = this.m_tableObject.isColumnPaginated();
		let colStartPage = columnPaginated ? this.m_tableObject.getLocalColumnsOffset() : 0;
		let colAmount = columnPaginated ? this.m_tableObject.getLocalColumnsAmount() : this.m_tableObject.getDataColumnsAmount();
		let colEndPage = colStartPage + colAmount;
		let columnListSize = this.m_tableObject.getColumnList().size();
		let loadedColAmount = columnPaginated ? this.m_tableObject.getLocalColumnsAmount() : columnListSize;
		let rowStartPage = rowPaginated ? this.m_tableObject.getLocalRowsOffset() : 0;
		let rowAmount = rowPaginated ? this.m_tableObject.getLocalRowsAmount() : this.m_tableObject.getDataRowAmount();
		columnWidths.addAll(this.m_tableObject.getColumnEmWidthsSubList(0, this.m_tableObject.getPreColumnsAmount()));
		columnWidths.addAll(this.m_tableObject.getColumnEmWidthsSubList(this.m_tableObject.getPreColumnsAmount() + colStartPage, this.m_tableObject.getPreColumnsAmount() + colEndPage));
		let factor = 10;
		let minPixelCellWidth = this.m_tableObject.getMinCellWidth();
		let maxPixelCellWidth = this.m_tableObject.getMaxCellWidth();
		let maxWidthDivisor = 3;
		let preColumnsAmount = this.m_tableObject.getPreColumnsAmount();
		if (freezingColumns)
		{
			maxWidthDivisor = oFF.XMath.max(maxWidthDivisor, oFF.XMath.min(oFF.XMath.div(4 * preColumnsAmount * maxPixelCellWidth, tableWidth * 3), oFF.XMath.div((preColumnsAmount + colAmount) * maxPixelCellWidth, tableWidth)));
		}
		let preciseWidth;
		let columnObject;
		let headerWidth = 0;
		let dataWidth = 0;
		for (i = 0; i < preColumnsAmount; i++)
		{
			preciseWidth = minPixelCellWidth;
			if (i < columnWidths.size())
			{
				preciseWidth = this.getCorrectWidth(columnWidths.get(i).getInteger(), factor, oFF.XMath.div(maxPixelCellWidth, maxWidthDivisor), minPixelCellWidth);
			}
			columnObject = this.m_tableObject.getHeaderColumnList().get(i);
			columnObject.setDefaultWidth(preciseWidth);
			headerWidth = headerWidth + preciseWidth;
		}
		let averageWidth = minPixelCellWidth;
		if (this.m_tableObject.getDataColumnsAmount() > 0)
		{
			let accumulator = 0;
			let divisor = oFF.XMath.min(columnWidths.size(), this.m_tableObject.getPreColumnsAmount() + loadedColAmount);
			for (let j = 0; j < divisor; j++)
			{
				accumulator = accumulator + this.getCorrectWidth(columnWidths.get(j).getInteger(), factor, maxPixelCellWidth, minPixelCellWidth);
			}
			averageWidth = oFF.XMath.div(accumulator, divisor);
			for (; i < this.m_tableObject.getPreColumnsAmount() + colAmount; i++)
			{
				preciseWidth = averageWidth;
				if (i < columnWidths.size())
				{
					preciseWidth = this.getCorrectWidth(columnWidths.get(i).getInteger(), factor, maxPixelCellWidth, minPixelCellWidth);
				}
				dataWidth = dataWidth + preciseWidth;
				let localColumnIndex = i + colStartPage - this.m_tableObject.getPreColumnsAmount();
				columnObject = localColumnIndex < columnListSize ? this.m_tableObject.getColumnList().get(localColumnIndex) : null;
				if (oFF.notNull(columnObject))
				{
					columnObject.setDefaultWidth(preciseWidth);
				}
			}
		}
		if (freezingColumns && dataWidth + headerWidth > tableWidth && tableWidth < headerWidth * 2)
		{
			let availableHeaderWidth = oFF.XMath.max(tableWidth / 2, tableWidth - dataWidth);
			let headerCorrectionFactor = oFF.XMath.div(availableHeaderWidth * 1000, headerWidth);
			for (i = 0; i < this.m_tableObject.getPreColumnsAmount(); i++)
			{
				columnObject = this.m_tableObject.getHeaderColumnList().get(i);
				preciseWidth = columnObject.getWidth();
				columnObject.setDefaultWidth(oFF.XMath.div(headerCorrectionFactor * preciseWidth, 1000));
			}
		}
		let totalWidth = 20;
		let columnStructure;
		let effectiveIndex = 0;
		for (i = 0; i < this.m_tableObject.getPreColumnsAmount(); i++)
		{
			columnObject = this.m_tableObject.getHeaderColumnList().get(i);
			if (oFF.isNull(columnObject) || !columnObject.isEffectivelyHidden())
			{
				preciseWidth = columnObject.getWidth();
				totalWidth = totalWidth + preciseWidth;
				columnStructure = columnSettings.addNewStructure();
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, effectiveIndex);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, minPixelCellWidth);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
				columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(effectiveIndex));
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, false);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.m_tableObject.isFreezeHeaderColumns() && freezeUpToColumn < 0 || freezeUpToColumn >= effectiveIndex);
				this.renderColumn(columnObject, columnStructure);
				effectiveIndex++;
			}
		}
		if (this.m_tableObject.getDataColumnsAmount() > 0)
		{
			let realEndPage = oFF.XMath.min(this.m_tableObject.getColumnList().size(), colEndPage);
			for (i = colStartPage; i < realEndPage; i++)
			{
				columnObject = this.m_tableObject.getColumnList().get(i);
				if (oFF.isNull(columnObject) || !columnObject.isEffectivelyHidden())
				{
					preciseWidth = oFF.isNull(columnObject) ? averageWidth : columnObject.getWidth();
					totalWidth = totalWidth + preciseWidth;
					columnStructure = columnSettings.addNewStructure();
					columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, effectiveIndex);
					columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, minPixelCellWidth);
					columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, preciseWidth);
					columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(effectiveIndex));
					columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.m_tableObject.getFreezeUpToColumn() >= effectiveIndex);
					columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
					columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
					this.renderColumn(columnObject, columnStructure);
					effectiveIndex++;
				}
			}
			for (i = this.m_tableObject.getPreColumnsAmount() + realEndPage; i < columnWidths.size(); i++)
			{
				columnStructure = columnSettings.addNewStructure();
				totalWidth = totalWidth + averageWidth;
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_COLUMN, effectiveIndex);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_MIN_WIDTH, minPixelCellWidth);
				columnStructure.putInteger(oFF.SacTableConstants.CS_N_WIDTH, averageWidth);
				columnStructure.putString(oFF.SacTableConstants.CS_S_ID, oFF.XInteger.convertToHexString(i));
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_FIXED, this.m_tableObject.getFreezeUpToColumn() >= i);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_HAS_WRAP_CELL, false);
				columnStructure.putBoolean(oFF.SacTableConstants.CS_B_EMPTY_COLUMN, false);
				effectiveIndex++;
			}
		}
		let dataRowAmount = this.m_tableObject.getDataRowAmount();
		let headerRowAmount = this.m_tableObject.getPreRowsAmount();
		let totalHeight = 20 + this.m_tableObject.getOverallHeight();
		if (showGrid)
		{
			totalHeight = totalHeight + dataRowAmount + headerRowAmount;
		}
		let cellChartInfo = this.m_tableObject.getCellChartInfo();
		if (oFF.XCollectionUtils.hasElements(cellChartInfo))
		{
			let cellChartInfoStructure = tableJson.putNewStructure(oFF.SacTableConstants.TD_M_CELL_CHART_DATA);
			let memberNames = cellChartInfo.getKeysAsIterator();
			while (memberNames.hasNext())
			{
				let memberName = memberNames.next();
				let cellChartMemberInfo = cellChartInfo.getByKey(memberName);
				let memberCellChartData = cellChartInfoStructure.putNewStructure(memberName);
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_START_COL, cellChartMemberInfo.getStartColumn() - colStartPage);
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_END_COL, cellChartMemberInfo.getEndColumn() - colStartPage);
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_START_ROW, cellChartMemberInfo.getStartRow() - rowStartPage);
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_END_ROW, cellChartMemberInfo.getEndRow() - rowStartPage);
				memberCellChartData.putDouble(oFF.SacTableConstants.CCD_N_MIN, cellChartMemberInfo.getMinValue());
				memberCellChartData.putDouble(oFF.SacTableConstants.CCD_N_MAX, cellChartMemberInfo.getMaxValue());
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_MAX_TEXT_HEIGHT, oFF.SacTableConstants.DF_R_N_HEIGHT);
				let columnsList = memberCellChartData.putNewList(oFF.SacTableConstants.CCD_L_COLUMNS);
				let columnsIterator = cellChartMemberInfo.getColumns().getIterator();
				let maxTextWidth = 0;
				while (columnsIterator.hasNext())
				{
					let columnIndex = columnsIterator.next().getInteger();
					columnsList.addInteger(columnIndex);
					maxTextWidth = oFF.XMath.max(oFF.XMath.div(columnSettings.getStructureAt(columnIndex).getIntegerByKey(oFF.SacTableConstants.CS_N_WIDTH), 3), maxTextWidth);
				}
				memberCellChartData.putInteger(oFF.SacTableConstants.CCD_N_MAX_TEXT_WIDTH, maxTextWidth);
			}
		}
		tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_WIDTH, totalWidth);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_TOTAL_HEIGHT, totalHeight);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_COL, 0);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_START_ROW, 0);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_COL, this.m_tableObject.getPreColumnsAmount() - 1);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_CORNER_ROW, this.m_tableObject.getPreRowsAmount() - 1);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_COL, this.m_tableObject.getPreColumnsAmount() + colAmount - 1);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_DATA_REGION_END_ROW, this.m_tableObject.getPreRowsAmount() + rowAmount - 1);
		tableJson.putInteger(oFF.SacTableConstants.TD_N_LAST_ROW_INDEX, this.m_tableObject.getPreRowsAmount() + rowAmount - 1);
		result = titleTokens.putNewList(oFF.SacTableConstants.TE_L_CHILDREN);
	}
	else
	{
		result = oFF.PrFactory.createList();
	}
	return result;
};
oFF.SacTableWidgetRenderHelper.prototype.renderRow = function(themeCache, rowList, row, rowIndex, headerColumnListSize, curColumnPageStart, curColumnPageEnd)
{
	let structure = rowList.addNewStructure();
	structure.putInteger(oFF.SacTableConstants.R_N_HEIGHT, row.getEffectiveHeight());
	let localId = row.getId();
	if (oFF.isNull(localId))
	{
		localId = oFF.XInteger.convertToHexString(rowIndex);
	}
	structure.putString(oFF.SacTableConstants.C_S_ID, localId);
	structure.putInteger(oFF.SacTableConstants.R_N_ROW, rowIndex);
	structure.putBoolean(oFF.SacTableConstants.R_B_FIXED, row.isFixed());
	structure.putBoolean(oFF.SacTableConstants.R_B_CHANGED_ON_THE_FLY_UNRESPONSIVE, row.isChangedOnTheFlyUnresponsive());
	let cellList = structure.putNewList(oFF.SacTableConstants.R_L_CELLS);
	let stripeColumns = row.getParentTable().isStripeDataColumns();
	let stripeRows = row.getParentTable().isStripeDataRows();
	let stripeAny = stripeColumns || stripeRows;
	let cellsSize = row.getCells().size();
	let effectiveIndex = 0;
	let i;
	for (i = 0; i < oFF.XMath.min(cellsSize, headerColumnListSize); i++)
	{
		if (this.renderCellForRow(themeCache, effectiveIndex, rowIndex, row.getCells().get(i), cellList, stripeRows, stripeColumns, stripeAny && i >= row.getParentTable().getPreColumnsAmount() && row.getParentTable().getRowList().contains(row)))
		{
			effectiveIndex++;
		}
	}
	let absoluteEnd = curColumnPageEnd === -1 ? cellsSize : oFF.XMath.min(cellsSize, headerColumnListSize + curColumnPageEnd + 1);
	for (i = curColumnPageStart + headerColumnListSize; i < absoluteEnd; i++)
	{
		if (this.renderCellForRow(themeCache, effectiveIndex, rowIndex, row.getCells().get(i), cellList, stripeRows, stripeColumns, stripeAny && i >= row.getParentTable().getPreColumnsAmount() && row.getParentTable().getRowList().contains(row)))
		{
			effectiveIndex++;
		}
	}
	return structure;
};
oFF.SacTableWidgetRenderHelper.prototype.transferStyledLineToJson = function(themeCache, effectiveLineStyle, lpKey, structureToFormat)
{
	if (!oFF.SacStyleUtils.isStyleLineEmpty(effectiveLineStyle))
	{
		let line = this.getLineInternal(lpKey, structureToFormat);
		line.putStringNotNullAndNotEmpty(oFF.SacTableConstants.SL_S_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getColor()));
		if (effectiveLineStyle.getWidth() > -1)
		{
			line.putDouble(oFF.SacTableConstants.SL_N_SIZE, effectiveLineStyle.getWidth());
		}
		if (effectiveLineStyle.hasPadding())
		{
			let paddingStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PADDING);
			this.applyPadding(paddingStructure, effectiveLineStyle.getLeftPadding(), oFF.SacTableConstants.SLP_N_LEFT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getRightPadding(), oFF.SacTableConstants.SLP_N_RIGHT);
			this.applyPadding(paddingStructure, effectiveLineStyle.getTopPadding(), oFF.SacTableConstants.SLP_N_TOP);
			this.applyPadding(paddingStructure, effectiveLineStyle.getBottomPadding(), oFF.SacTableConstants.SLP_N_BOTTOM);
		}
		let lineStyle = effectiveLineStyle.getLineStyle();
		if (lineStyle === oFF.SacTableLineStyle.DASHED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DASHED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.DOTTED)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_DOTTED);
		}
		else if (lineStyle === oFF.SacTableLineStyle.SOLID)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_SOLID);
		}
		else if (lineStyle === oFF.SacTableLineStyle.NONE)
		{
			line.putInteger(oFF.SacTableConstants.SL_N_STYLE, oFF.SacTableConstants.LS_NONE);
		}
		let linePatternType = effectiveLineStyle.getPatternType();
		if (oFF.notNull(linePatternType))
		{
			let patternStructure = line.putNewStructure(oFF.SacTableConstants.SL_M_PATTERN);
			if (linePatternType === oFF.VisualizationBackgroundPatternType.WHITE_FILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_WHITE_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.NOFILL)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_NON_FILL);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.SOLID)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_SOLID);
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BACKGROUND, effectiveLineStyle.getPatternBackground());
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_1)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_1, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_2)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_2, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_3)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_3, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_4)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_4, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_5)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_5, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_6)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_6, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_7)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_7, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			else if (linePatternType === oFF.VisualizationBackgroundPatternType.HATCHIING_8)
			{
				patternStructure.putInteger(oFF.SacTableConstants.LP_N_STYLE, oFF.SacTableConstants.LPT_BACKGROUND_IMAGE);
				patternStructure.putString(oFF.SacTableConstants.LP_S_BACKGROUND, oFF.XStringUtils.concatenate3(oFF.SacTableConstants.IMG_B64_PREFIX, oFF.SacTableConstants.BASE64_SVG_HATCHING_8, oFF.SacTableConstants.IMG_B64_SUFFIX));
			}
			if (effectiveLineStyle.getPatternWidth() > 0)
			{
				patternStructure.putDouble(oFF.SacTableConstants.LP_N_WIDTH, effectiveLineStyle.getPatternWidth());
			}
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getPatternColor()));
			patternStructure.putStringNotNullAndNotEmpty(oFF.SacTableConstants.LP_S_BORDER_COLOR, oFF.RenderThemingHelper.remapColor(themeCache, effectiveLineStyle.getPatternBorderColor()));
		}
	}
};

oFF.SacTableXlsRenderHelper = function() {};
oFF.SacTableXlsRenderHelper.prototype = new oFF.XObject();
oFF.SacTableXlsRenderHelper.prototype._ff_c = "SacTableXlsRenderHelper";

oFF.SacTableXlsRenderHelper.createTableRenderHelper = function(tableObject)
{
	let instance = new oFF.SacTableXlsRenderHelper();
	instance.initializeRH(tableObject);
	return instance;
};
oFF.SacTableXlsRenderHelper.prototype.m_tableObject = null;
oFF.SacTableXlsRenderHelper.prototype.getTableObject = function()
{
	return this.m_tableObject;
};
oFF.SacTableXlsRenderHelper.prototype.initializeRH = function(tableObject)
{
	this.m_tableObject = tableObject;
};

oFF.VisualizationUiModule = function() {};
oFF.VisualizationUiModule.prototype = new oFF.DfModule();
oFF.VisualizationUiModule.prototype._ff_c = "VisualizationUiModule";

oFF.VisualizationUiModule.s_module = null;
oFF.VisualizationUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.VisualizationUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.VisualizationImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.UiModule.getInstance());
		oFF.VisualizationUiModule.s_module = oFF.DfModule.startExt(new oFF.VisualizationUiModule());
		oFF.SacGridRendererFactory.setInstance(oFF.SacGridRendererFactoryImpl.create());
		oFF.DfModule.stopExt(oFF.VisualizationUiModule.s_module);
	}
	return oFF.VisualizationUiModule.s_module;
};
oFF.VisualizationUiModule.prototype.getName = function()
{
	return "ff2670.visualization.ui";
};

oFF.VisualizationUiModule.getInstance();

return oFF;
} );