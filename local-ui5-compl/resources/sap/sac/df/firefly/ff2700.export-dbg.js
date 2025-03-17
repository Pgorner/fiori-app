/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2670.visualization.ui"
],
function(oFF)
{
"use strict";

oFF.ExportHandlerFactory = function() {};
oFF.ExportHandlerFactory.prototype = new oFF.XObject();
oFF.ExportHandlerFactory.prototype._ff_c = "ExportHandlerFactory";

oFF.ExportHandlerFactory.s_driverFactory = null;
oFF.ExportHandlerFactory.create = function()
{
	let eh = null;
	if (oFF.notNull(oFF.ExportHandlerFactory.s_driverFactory))
	{
		eh = oFF.ExportHandlerFactory.s_driverFactory.newExportHandler();
	}
	return eh;
};
oFF.ExportHandlerFactory.registerFactory = function(driverFactory)
{
	oFF.ExportHandlerFactory.s_driverFactory = driverFactory;
};

oFF.Appendix = function() {};
oFF.Appendix.prototype = new oFF.XObjectExt();
oFF.Appendix.prototype._ff_c = "Appendix";

oFF.Appendix.addDataToCells = function(cells, data)
{
	oFF.Appendix.addDataToCellsConditionally(cells, data, false);
};
oFF.Appendix.addDataToCellsConditionally = function(cells, data, allowEmpty)
{
	if (allowEmpty && oFF.notNull(data) || !oFF.XStringUtils.isNullOrEmpty(data))
	{
		cells.addNewStructure().putString(oFF.Model.FORMATTED_VALUE, data);
	}
};
oFF.Appendix.addRowToTableRows = function(row, tableRows, maxRowSize)
{
	if (oFF.Appendix.getRowSize(row) > 0)
	{
		let cells = oFF.Appendix.getCells(row);
		let curSize = cells.size();
		while (curSize < maxRowSize)
		{
			curSize = curSize + 1;
			oFF.Appendix.padWithEmptyCell(cells);
		}
		tableRows.add(row);
	}
};
oFF.Appendix.clearRow = function(row)
{
	if (row.size() > 0)
	{
		row.clear();
	}
	return row.putNewList(oFF.Model.TABLE_ROW_CELLS);
};
oFF.Appendix.create = function(title, techTitle, tenantTitle, queryTitle, infoProvTitle, modelTitle, createdByTitle, createdOnTitle, varTitle, filterTitle, measureTitle)
{
	let result = new oFF.Appendix();
	result.m_title = title;
	result.m_techTitle = techTitle;
	result.m_tenantTitle = tenantTitle;
	result.m_queryTitle = queryTitle;
	result.m_infoProvTitle = infoProvTitle;
	result.m_modelTitle = modelTitle;
	result.m_createdByTitle = createdByTitle;
	result.m_createdOnTitle = createdOnTitle;
	result.m_varTitle = varTitle;
	result.m_filterTitle = filterTitle;
	result.m_acctMeasureTitle = measureTitle;
	result.m_techRow = oFF.PrFactory.createStructure();
	result.setTechRow();
	result.m_tenantRow = oFF.PrFactory.createStructure();
	result.m_queryRow = oFF.PrFactory.createStructure();
	result.m_infoProvRow = oFF.PrFactory.createStructure();
	result.m_modelRow = oFF.PrFactory.createStructure();
	result.m_createdByRow = oFF.PrFactory.createStructure();
	result.m_createdOnRow = oFF.PrFactory.createStructure();
	result.m_variableRows = oFF.PrFactory.createList();
	result.m_filterRows = oFF.PrFactory.createList();
	result.m_measureFilters = oFF.PrFactory.createList();
	return result;
};
oFF.Appendix.getCells = function(row)
{
	if (row.containsKey(oFF.Model.TABLE_ROW_CELLS))
	{
		return row.getListByKey(oFF.Model.TABLE_ROW_CELLS);
	}
	return row.putNewList(oFF.Model.TABLE_ROW_CELLS);
};
oFF.Appendix.getRowSize = function(row)
{
	if (oFF.notNull(row) && row.size() > 0)
	{
		let cells = oFF.Appendix.getCells(row);
		if (oFF.notNull(cells))
		{
			return cells.size();
		}
	}
	return 0;
};
oFF.Appendix.padWithEmptyCell = function(cells)
{
	oFF.Appendix.addDataToCellsConditionally(cells, "", true);
};
oFF.Appendix.prototype.m_acctMeasureTitle = null;
oFF.Appendix.prototype.m_allRows = null;
oFF.Appendix.prototype.m_createdByRow = null;
oFF.Appendix.prototype.m_createdByTitle = null;
oFF.Appendix.prototype.m_createdOnRow = null;
oFF.Appendix.prototype.m_createdOnTitle = null;
oFF.Appendix.prototype.m_filterRows = null;
oFF.Appendix.prototype.m_filterTitle = null;
oFF.Appendix.prototype.m_infoProvRow = null;
oFF.Appendix.prototype.m_infoProvTitle = null;
oFF.Appendix.prototype.m_measureFilters = null;
oFF.Appendix.prototype.m_modelRow = null;
oFF.Appendix.prototype.m_modelTitle = null;
oFF.Appendix.prototype.m_queryRow = null;
oFF.Appendix.prototype.m_queryTitle = null;
oFF.Appendix.prototype.m_techRow = null;
oFF.Appendix.prototype.m_techTitle = null;
oFF.Appendix.prototype.m_tenantRow = null;
oFF.Appendix.prototype.m_tenantTitle = null;
oFF.Appendix.prototype.m_title = null;
oFF.Appendix.prototype.m_varTitle = null;
oFF.Appendix.prototype.m_variableRows = null;
oFF.Appendix.prototype.addFilterRow = function(dimension, op, members)
{
	if (this.m_filterRows.isEmpty())
	{
		let titleRow = oFF.PrFactory.createStructure();
		let titleCells = oFF.Appendix.getCells(titleRow);
		oFF.Appendix.addDataToCells(titleCells, this.m_filterTitle);
		this.m_filterRows.add(titleRow);
	}
	this.addOperationToRows(this.m_filterRows, dimension, op, members);
};
oFF.Appendix.prototype.addMeasureFilterRow = function(dimension, contextOrMemberName, operator, value)
{
	if (this.m_measureFilters.isEmpty())
	{
		let titleRow = oFF.PrFactory.createStructure();
		let titleCells = oFF.Appendix.getCells(titleRow);
		oFF.Appendix.addDataToCells(titleCells, this.m_acctMeasureTitle);
		this.m_measureFilters.add(titleRow);
	}
	let newRow = oFF.PrFactory.createStructure();
	let newCells = oFF.Appendix.getCells(newRow);
	oFF.Appendix.addDataToCellsConditionally(newCells, dimension, true);
	oFF.Appendix.addDataToCellsConditionally(newCells, contextOrMemberName, true);
	oFF.Appendix.addDataToCells(newCells, operator);
	oFF.Appendix.addDataToCells(newCells, value);
	this.m_measureFilters.add(newRow);
};
oFF.Appendix.prototype.addOperationToRows = function(rowList, name, op, members)
{
	let varRow = oFF.PrFactory.createStructure();
	let cells = oFF.Appendix.getCells(varRow);
	oFF.Appendix.addDataToCellsConditionally(cells, name, true);
	oFF.Appendix.addDataToCells(cells, op);
	oFF.Appendix.addDataToCellsConditionally(cells, members, true);
	rowList.add(varRow);
};
oFF.Appendix.prototype.addRows = function(rows)
{
	while (rows.hasNext())
	{
		let row = rows.next().asStructure();
		this.m_allRows.add(row);
	}
};
oFF.Appendix.prototype.addVariableRow = function(name, op, members)
{
	if (this.m_variableRows.isEmpty())
	{
		let titleRow = oFF.PrFactory.createStructure();
		let titleCells = oFF.Appendix.getCells(titleRow);
		oFF.Appendix.addDataToCells(titleCells, this.m_varTitle);
		this.m_variableRows.add(titleRow);
	}
	this.addOperationToRows(this.m_variableRows, name, op, members);
};
oFF.Appendix.prototype.getAllRows = function()
{
	if (oFF.isNull(this.m_allRows))
	{
		let emptyRow = oFF.PrFactory.createStructure();
		let cells = oFF.Appendix.getCells(emptyRow);
		oFF.Appendix.addDataToCellsConditionally(cells, "", true);
		this.m_allRows = oFF.XList.create();
		this.m_allRows.add(this.m_techRow);
		this.m_allRows.add(this.m_tenantRow);
		this.m_allRows.add(this.m_queryRow);
		this.m_allRows.add(this.m_infoProvRow);
		this.m_allRows.add(this.m_modelRow);
		this.m_allRows.add(this.m_createdByRow);
		this.m_allRows.add(this.m_createdOnRow);
		if (!this.m_variableRows.isEmpty())
		{
			this.m_allRows.add(emptyRow);
			this.addRows(this.m_variableRows.getIterator());
		}
		if (!this.m_filterRows.isEmpty())
		{
			this.m_allRows.add(emptyRow);
			this.addRows(this.m_filterRows.getIterator());
		}
		if (!this.m_measureFilters.isEmpty())
		{
			this.m_allRows.add(emptyRow);
			this.addRows(this.m_measureFilters.getIterator());
		}
	}
	return this.m_allRows;
};
oFF.Appendix.prototype.getMaxRowSize = function()
{
	let result = 0;
	let appendixRows = this.getAllRows();
	for (let rIdx = 0; rIdx < appendixRows.size(); rIdx++)
	{
		result = oFF.XMath.max(result, oFF.Appendix.getRowSize(appendixRows.get(rIdx)));
	}
	return result;
};
oFF.Appendix.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.Appendix.prototype.populateTable = function(table, autoColWidth)
{
	let rows = table.getListByKey(oFF.Model.TABLE_ROWS_KEY);
	let maxRowSize = this.getMaxRowSize();
	table.putInteger(oFF.Model.NUM_HEADER_COLS, 1);
	table.putInteger(oFF.Model.NUM_HEADER_ROWS, 1);
	if (!autoColWidth)
	{
		let isFirst = true;
		let widths = table.putNewList(oFF.Model.COL_WIDTHS_KEY);
		while (widths.size() < maxRowSize)
		{
			if (isFirst)
			{
				isFirst = false;
				widths.addDouble(40.0);
			}
			else
			{
				widths.addDouble(80.0);
			}
		}
	}
	let appendixRows = this.getAllRows();
	for (let rIdx = 0; rIdx < appendixRows.size(); rIdx++)
	{
		oFF.Appendix.addRowToTableRows(appendixRows.get(rIdx), rows, maxRowSize);
	}
};
oFF.Appendix.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_techRow);
	oFF.XObjectExt.release(this.m_tenantRow);
	oFF.XObjectExt.release(this.m_queryRow);
	oFF.XObjectExt.release(this.m_infoProvRow);
	oFF.XObjectExt.release(this.m_modelRow);
	oFF.XObjectExt.release(this.m_createdByRow);
	oFF.XObjectExt.release(this.m_createdOnRow);
	oFF.XObjectExt.release(this.m_allRows);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.Appendix.prototype.setCreatedBy = function(createdBy)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(createdBy))
	{
		let cells = oFF.Appendix.getCells(this.m_createdByRow);
		oFF.Appendix.addDataToCells(cells, this.m_createdByTitle);
		oFF.Appendix.addDataToCells(cells, createdBy);
	}
};
oFF.Appendix.prototype.setCreatedOn = function(date)
{
	if (oFF.notNull(date))
	{
		this.setCreatedOnString(date.toIsoFormat());
	}
};
oFF.Appendix.prototype.setCreatedOnString = function(createdOn)
{
	let cells = oFF.Appendix.getCells(this.m_createdOnRow);
	oFF.Appendix.addDataToCells(cells, this.m_createdOnTitle);
	oFF.Appendix.addDataToCells(cells, createdOn);
};
oFF.Appendix.prototype.setInfoProviderData = function(name, description)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name) || oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		let cells = oFF.Appendix.getCells(this.m_infoProvRow);
		oFF.Appendix.addDataToCells(cells, this.m_infoProvTitle);
		oFF.Appendix.addDataToCells(cells, name);
		if (!oFF.XString.isEqual(name, description))
		{
			oFF.Appendix.addDataToCells(cells, description);
		}
	}
};
oFF.Appendix.prototype.setQueryData = function(config, technicalName, description, type)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(technicalName) || oFF.XStringUtils.isNotNullAndNotEmpty(description))
	{
		let startIndex = oFF.XString.lastIndexOf(technicalName, "[") + 1;
		let endIndex = oFF.XString.lastIndexOf(technicalName, "]");
		let name = config.hasDefaultDatasourceName() ? config.getDefaultDatasourceName() : oFF.XString.substring(technicalName, startIndex, endIndex);
		let cells;
		if (oFF.notNull(type) && type.isTypeOf(oFF.SystemType.ORCA))
		{
			cells = oFF.Appendix.getCells(this.m_modelRow);
			oFF.Appendix.addDataToCells(cells, this.m_modelTitle);
		}
		else
		{
			cells = oFF.Appendix.getCells(this.m_queryRow);
			oFF.Appendix.addDataToCells(cells, this.m_queryTitle);
		}
		oFF.Appendix.addDataToCells(cells, name);
		if (!oFF.XString.isEqual(name, description))
		{
			oFF.Appendix.addDataToCells(cells, description);
		}
	}
};
oFF.Appendix.prototype.setTechRow = function()
{
	let cells = oFF.Appendix.getCells(this.m_techRow);
	oFF.Appendix.addDataToCells(cells, this.m_techTitle);
};
oFF.Appendix.prototype.setTenantData = function(url)
{
	if (oFF.notNull(url))
	{
		let cells = oFF.Appendix.getCells(this.m_tenantRow);
		oFF.Appendix.addDataToCells(cells, this.m_tenantTitle);
		oFF.Appendix.addDataToCells(cells, url.getUrlExt(true, false, false, false, false, true, true, false, false));
	}
};

oFF.BaseExportConfig = function() {};
oFF.BaseExportConfig.prototype = new oFF.XObjectExt();
oFF.BaseExportConfig.prototype._ff_c = "BaseExportConfig";

oFF.BaseExportConfig.CSV_EXPORT = "CSV";
oFF.BaseExportConfig.PARAM_EXPAND_HIERARCHY = "expandHierarchy";
oFF.BaseExportConfig.PDF_EXPORT = "PDF";
oFF.BaseExportConfig.XLSX_EXPORT = "XLSX";
oFF.BaseExportConfig.prototype.m_appendix = null;
oFF.BaseExportConfig.prototype.m_autoColWidths = true;
oFF.BaseExportConfig.prototype.m_defaultDataSourceName = "";
oFF.BaseExportConfig.prototype.m_enablePdfAppendix = false;
oFF.BaseExportConfig.prototype.m_expandHierarchy = false;
oFF.BaseExportConfig.prototype.m_exportAsB64String = false;
oFF.BaseExportConfig.prototype.m_fileName = "";
oFF.BaseExportConfig.prototype.m_flatten = false;
oFF.BaseExportConfig.prototype.m_includeFormatting = false;
oFF.BaseExportConfig.prototype.m_scope = "";
oFF.BaseExportConfig.prototype.m_showRepMembers = false;
oFF.BaseExportConfig.prototype.m_vdSuppressExitVariables = false;
oFF.BaseExportConfig.prototype.m_vdValueFormat = null;
oFF.BaseExportConfig.prototype.m_vdVariableValues = null;
oFF.BaseExportConfig.prototype.root = null;
oFF.BaseExportConfig.prototype.addAppendix = function(appendix)
{
	this.m_appendix = appendix;
};
oFF.BaseExportConfig.prototype.getAppendix = function()
{
	return this.m_appendix;
};
oFF.BaseExportConfig.prototype.getDefaultDatasourceName = function()
{
	return this.m_defaultDataSourceName;
};
oFF.BaseExportConfig.prototype.getExpandHierarchy = function()
{
	return this.m_expandHierarchy;
};
oFF.BaseExportConfig.prototype.getFileName = function()
{
	return this.m_fileName;
};
oFF.BaseExportConfig.prototype.getFlattenHierarchy = function()
{
	return this.m_flatten;
};
oFF.BaseExportConfig.prototype.getIncludeFormatting = function()
{
	return this.m_includeFormatting;
};
oFF.BaseExportConfig.prototype.getScope = function()
{
	return this.m_scope;
};
oFF.BaseExportConfig.prototype.getShowRepetitiveMembers = function()
{
	return this.m_showRepMembers;
};
oFF.BaseExportConfig.prototype.getStructure = function()
{
	return this.root;
};
oFF.BaseExportConfig.prototype.getVdSuppressExitVariables = function()
{
	return this.m_vdSuppressExitVariables;
};
oFF.BaseExportConfig.prototype.getVdValueFormat = function()
{
	return this.m_vdValueFormat;
};
oFF.BaseExportConfig.prototype.getVdVariableValues = function()
{
	return this.m_vdVariableValues;
};
oFF.BaseExportConfig.prototype.hasAutoColWidths = function()
{
	return this.m_autoColWidths;
};
oFF.BaseExportConfig.prototype.hasDefaultDatasourceName = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.m_defaultDataSourceName);
};
oFF.BaseExportConfig.prototype.init = function(conf)
{
	this.root = conf;
};
oFF.BaseExportConfig.prototype.isExportAsB64String = function()
{
	return this.m_exportAsB64String;
};
oFF.BaseExportConfig.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.root);
	oFF.XObjectExt.release(this.m_appendix);
	oFF.XObjectExt.release(this.m_vdVariableValues);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.BaseExportConfig.prototype.setAutoColWidths = function(autoWidths)
{
	this.m_autoColWidths = autoWidths;
};
oFF.BaseExportConfig.prototype.setDefaultDatasourceName = function(name)
{
	this.m_defaultDataSourceName = name;
};
oFF.BaseExportConfig.prototype.setEnablePdfAppendix = function(enable)
{
	this.m_enablePdfAppendix = enable;
};
oFF.BaseExportConfig.prototype.setExpandHierarchy = function(expand)
{
	this.m_expandHierarchy = expand;
};
oFF.BaseExportConfig.prototype.setExportAsB64String = function(exportAsB64String)
{
	this.m_exportAsB64String = exportAsB64String;
};
oFF.BaseExportConfig.prototype.setFileName = function(name)
{
	this.m_fileName = name;
};
oFF.BaseExportConfig.prototype.setFlattenHierarchy = function(flatten)
{
	this.m_flatten = flatten;
};
oFF.BaseExportConfig.prototype.setIncludeFormatting = function(include)
{
	this.m_includeFormatting = include;
};
oFF.BaseExportConfig.prototype.setScope = function(scope)
{
	this.m_scope = scope;
};
oFF.BaseExportConfig.prototype.setShowRepetitiveMembers = function(show)
{
	this.m_showRepMembers = show;
};
oFF.BaseExportConfig.prototype.setVdVariables = function(variableValues, valueFormat, suppressExitVariables)
{
	this.m_vdVariableValues = variableValues;
	this.m_vdValueFormat = valueFormat;
	this.m_vdSuppressExitVariables = suppressExitVariables;
};
oFF.BaseExportConfig.prototype.supportsAppendix = function()
{
	return oFF.XString.isEqual(this.getType(), oFF.BaseExportConfig.XLSX_EXPORT) || oFF.XString.isEqual(this.getType(), oFF.BaseExportConfig.PDF_EXPORT) && this.m_enablePdfAppendix;
};

oFF.ExportResult = function() {};
oFF.ExportResult.prototype = new oFF.XObjectExt();
oFF.ExportResult.prototype._ff_c = "ExportResult";

oFF.ExportResult.FF_DATA_EXPORT_APPENDIX_TABLE_TEMPLATE = "FF_DATA_EXPORT_APPENDIX_TABLE_TEMPLATE";
oFF.ExportResult.FF_DATA_EXPORT_ARTIFACT = "artifact";
oFF.ExportResult.FF_DATA_EXPORT_INSUFFICIENT_HEIGHT_WARNING = "FF_DATA_EXPORT_INSUFFICIENT_PAGE_HEIGHT";
oFF.ExportResult.FF_DATA_EXPORT_INSUFFICIENT_WIDTH_WARNING = "FF_DATA_EXPORT_INSUFFICIENT_PAGE_WIDTH";
oFF.ExportResult.FF_DATA_EXPORT_MAIN_TABLE_TEMPLATE = "FF_DATA_EXPORT_MAIN_TABLE_TEMPLATE";
oFF.ExportResult.FF_DATA_EXPORT_STATUS = "status";
oFF.ExportResult.FF_DATA_EXPORT_STATUS_EXPORTED = "EXPORTED";
oFF.ExportResult.FF_DATA_EXPORT_STATUS_NOT_EXPORTED = "NOT_EXPORTED";
oFF.ExportResult.FF_DATA_EXPORT_WARNINGS = "warnings";
oFF.ExportResult.create = function(jsonStr)
{
	let result = new oFF.ExportResult();
	result.m_structure = oFF.JsonParserFactory.createFromString(jsonStr).asStructure();
	return result;
};
oFF.ExportResult.createDefaultError = function(translationStringId)
{
	let result = new oFF.ExportResult();
	result.m_structure = oFF.PrFactory.createStructure();
	let warnings = result.m_structure.putNewStructure(oFF.ExportResult.FF_DATA_EXPORT_WARNINGS);
	warnings.putString("0", translationStringId);
	result.m_structure.putString(oFF.ExportResult.FF_DATA_EXPORT_STATUS, oFF.ExportResult.FF_DATA_EXPORT_STATUS_NOT_EXPORTED);
	return result;
};
oFF.ExportResult.createSuccessForTest = function(exportModel)
{
	let result = new oFF.ExportResult();
	result.m_structure = oFF.PrFactory.createStructure();
	result.m_structure.putString(oFF.ExportResult.FF_DATA_EXPORT_STATUS, oFF.ExportResult.FF_DATA_EXPORT_STATUS_EXPORTED);
	result.exportModel = exportModel;
	return result;
};
oFF.ExportResult.prototype.exportModel = null;
oFF.ExportResult.prototype.m_structure = null;
oFF.ExportResult.prototype.getArtifactString = function()
{
	let artifact = "";
	if (this.m_structure.containsKey(oFF.ExportResult.FF_DATA_EXPORT_ARTIFACT))
	{
		artifact = this.m_structure.getStringByKey(oFF.ExportResult.FF_DATA_EXPORT_ARTIFACT);
	}
	return artifact;
};
oFF.ExportResult.prototype.getExportModel = function()
{
	return this.exportModel;
};
oFF.ExportResult.prototype.getWarnings = function()
{
	let result = oFF.XList.create();
	if (this.hasWarnings())
	{
		let mainTableWarning = this.m_structure.getStructureByKey(oFF.ExportResult.FF_DATA_EXPORT_WARNINGS).getStringByKey("0");
		let appendixTableWarning = this.m_structure.getStructureByKey(oFF.ExportResult.FF_DATA_EXPORT_WARNINGS).getStringByKey("1");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(mainTableWarning))
		{
			result.add(oFF.XPairOfString.create(oFF.ExportResult.FF_DATA_EXPORT_MAIN_TABLE_TEMPLATE, mainTableWarning));
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(appendixTableWarning))
		{
			result.add(oFF.XPairOfString.create(oFF.ExportResult.FF_DATA_EXPORT_APPENDIX_TABLE_TEMPLATE, appendixTableWarning));
		}
	}
	return result;
};
oFF.ExportResult.prototype.hasWarnings = function()
{
	return this.m_structure.containsKey(oFF.ExportResult.FF_DATA_EXPORT_WARNINGS) && !this.m_structure.getStructureByKey(oFF.ExportResult.FF_DATA_EXPORT_WARNINGS).isEmpty();
};
oFF.ExportResult.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_structure);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.ExportResult.prototype.success = function()
{
	return this.m_structure.containsKey(oFF.ExportResult.FF_DATA_EXPORT_STATUS) && oFF.XString.isEqual(this.m_structure.getStringByKey(oFF.ExportResult.FF_DATA_EXPORT_STATUS), oFF.ExportResult.FF_DATA_EXPORT_STATUS_EXPORTED);
};

oFF.Exporter = function() {};
oFF.Exporter.prototype = new oFF.XObjectExt();
oFF.Exporter.prototype._ff_c = "Exporter";

oFF.Exporter.create = function()
{
	let exp = new oFF.Exporter();
	exp.exportHandler = oFF.ExportHandlerFactory.create();
	return exp;
};
oFF.Exporter.prototype.exportHandler = null;
oFF.Exporter.prototype.exportCsv = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.exportCsv(model));
};
oFF.Exporter.prototype.exportPdf = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.exportPdf(model));
};
oFF.Exporter.prototype.exportXlsx = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.exportXlsx(model));
};
oFF.Exporter.prototype.generateCsvBase64 = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.generateCsvBase64(model));
};
oFF.Exporter.prototype.generatePdfBase64 = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.generatePdfBase64(model));
};
oFF.Exporter.prototype.generateXlsxBase64 = function(model)
{
	return oFF.ExportResult.create(this.exportHandler.generateXlsxBase64(model));
};

oFF.Model = function() {};
oFF.Model.prototype = new oFF.XObjectExt();
oFF.Model.prototype._ff_c = "Model";

oFF.Model.CELL_FORMATTED_KEY = "formatted";
oFF.Model.CELL_PLAIN_KEY = "plain";
oFF.Model.CELL_STYLES_KEY = "cellStyles";
oFF.Model.CELL_TYPE_KEY = "cellType";
oFF.Model.COL_WIDTHS_KEY = "colWidths";
oFF.Model.CSV_CONF_KEY = "csv";
oFF.Model.FILE_NAME_KEY = "fileName";
oFF.Model.FONT_COLOR_KEY = "fontColor";
oFF.Model.FONT_WEIGHT_KEY = "fontWeight";
oFF.Model.FORMATTED_VALUE = "formattedValue";
oFF.Model.HIER_PAD_LEFT_KEY = "hierPadLeft";
oFF.Model.HIER_PAD_RIGHT_KEY = "hierPadRight";
oFF.Model.HIER_PAD_TOP_KEY = "hierPadTop";
oFF.Model.HOR_ALIGN_KEY = "horAlign";
oFF.Model.LINE_COLOR_KEY = "lineColor";
oFF.Model.LINE_SIZE_KEY = "lineSize";
oFF.Model.MODEL_TABLES_KEY = "tables";
oFF.Model.NUM_COLS_KEY = "numCols";
oFF.Model.NUM_HEADER_COLS = "numHeaderCols";
oFF.Model.NUM_HEADER_ROWS = "numHeaderRows";
oFF.Model.PADDING_BOTTOM_KEY = "bottom";
oFF.Model.PADDING_CENTER_KEY = "center";
oFF.Model.PADDING_KEY = "padding";
oFF.Model.PADDING_LEFT_KEY = "left";
oFF.Model.PADDING_MIDDLE_KEY = "middle";
oFF.Model.PADDING_RIGHT_KEY = "right";
oFF.Model.PADDING_TOP_KEY = "top";
oFF.Model.PDF_CONF_KEY = "pdf";
oFF.Model.STYLE_KEY = "style";
oFF.Model.TABLE_ROWS_KEY = "rows";
oFF.Model.TABLE_ROW_CELLS = "cells";
oFF.Model.TABLE_TITLE_KEY = "title";
oFF.Model.TOTAL_HEIGHT_KEY = "totalHeight";
oFF.Model.TOTAL_WIDTH_KEY = "totalWidth";
oFF.Model.VALUE_KEY = "value";
oFF.Model.VERT_ALIGN_KEY = "vertAlign";
oFF.Model.XLSX_CONF_KEY = "xlsx";
oFF.Model.XLSX_FORMAT_KEY = "xlFormat";
oFF.Model.convertHierPadding = function(hierarchyPaddingType)
{
	if (oFF.XString.isEqual(oFF.SacTableConstants.C_N_HIERARCHY_PADDING_LEFT, hierarchyPaddingType))
	{
		return oFF.Model.HIER_PAD_LEFT_KEY;
	}
	else if (oFF.XString.isEqual(oFF.SacTableConstants.C_N_HIERARCHY_PADDING_TOP, hierarchyPaddingType))
	{
		return oFF.Model.HIER_PAD_TOP_KEY;
	}
	return oFF.Model.HIER_PAD_RIGHT_KEY;
};
oFF.Model.convertToMm = function(pixels)
{
	return pixels * 0.26458333;
};
oFF.Model.create = function()
{
	let model = new oFF.Model();
	model.root = oFF.PrFactory.createStructure();
	return model;
};
oFF.Model.hasStyleToApply = function(cellBase, cellStyles)
{
	if (cellBase.isEffectiveFontBold(cellStyles))
	{
		return true;
	}
	if (cellBase.getEffectiveVerticalAlignment(cellStyles) !== null || cellBase.getEffectiveHorizontalAlignment(cellStyles) !== null)
	{
		return true;
	}
	if (!oFF.SacStyleUtils.isStyleLineEmpty(cellBase.getEffectiveStyleLineBottom(cellStyles)) || !oFF.SacStyleUtils.isStyleLineEmpty(cellBase.getEffectiveStyledLineLeft(cellStyles)) || !oFF.SacStyleUtils.isStyleLineEmpty(cellBase.getEffectiveStyledLineRight(cellStyles)) || !oFF.SacStyleUtils.isStyleLineEmpty(cellBase.getEffectiveStyledLineTop(cellStyles)))
	{
		return true;
	}
	if (cellBase.getEffectiveFontColor(cellStyles) !== null)
	{
		return true;
	}
	return false;
};
oFF.Model.parseColor = function(resultColor, color)
{
	if (oFF.notNull(color))
	{
		let rgbIdx = oFF.XString.indexOf(color, "rgba(") === -1 ? oFF.XString.indexOf(color, "rgb(") : oFF.XString.indexOf(color, "rgba(");
		if (rgbIdx > -1)
		{
			let rgbStart = oFF.XString.substring(color, rgbIdx, -1);
			let firstIdx = oFF.XString.indexOf(rgbStart, "(");
			if (firstIdx > -1)
			{
				let lastIdx = oFF.XString.indexOfFrom(rgbStart, ")", firstIdx + 1);
				if (lastIdx > firstIdx)
				{
					let rgbList = oFF.XString.substring(rgbStart, firstIdx + 1, lastIdx);
					let rgba = oFF.XStringTokenizer.splitString(rgbList, ",");
					if (oFF.notNull(rgba))
					{
						try
						{
							resultColor.putInteger("r", oFF.XInteger.convertFromString(rgba.get(0)));
							resultColor.putInteger("g", oFF.XInteger.convertFromString(rgba.get(1)));
							resultColor.putInteger("b", oFF.XInteger.convertFromString(rgba.get(2)));
						}
						catch (e)
						{
							oFF.XLogger.println(oFF.XStringUtils.concatenate2("WARNING: Got invalid color from table ", color));
							resultColor.clear();
						}
					}
				}
			}
		}
	}
};
oFF.Model.populateExportCellValues = function(exportCell, cell, config)
{
	let isUnbooked = cell.getType() === oFF.SacTableConstants.CT_UNBOOKED;
	if (isUnbooked)
	{
		exportCell.putString(oFF.Model.FORMATTED_VALUE, "");
	}
	else
	{
		let formattedValue = null;
		if (cell.getPlain() !== null && cell.getPlain().getValueType().isNumber())
		{
			exportCell.putDouble(oFF.Model.VALUE_KEY, oFF.XValueUtil.getDouble(cell.getPlain(), true, true));
			if (config.skipNumberFormatting())
			{
				formattedValue = cell.getPlain().toString();
			}
			else
			{
				formattedValue = cell.getEffectiveFormattedText(cell.getPrioritizedStylesList());
			}
		}
		else if (config.ignoreValueException() && cell.getValueException() !== null)
		{
			formattedValue = "";
		}
		else
		{
			formattedValue = cell.getEffectiveFormattedText(cell.getPrioritizedStylesList());
		}
		exportCell.putString(oFF.Model.FORMATTED_VALUE, oFF.isNull(formattedValue) ? "" : formattedValue);
	}
};
oFF.Model.setAlignmentsFromCellStyle = function(prioritzedStyles, cellBase, exportCellStyle)
{
	let horAlign = cellBase.getEffectiveHorizontalAlignment(prioritzedStyles);
	let vertAlign = cellBase.getEffectiveVerticalAlignment(prioritzedStyles);
	if (oFF.isNull(vertAlign))
	{
		vertAlign = oFF.SacVisualizationVerticalAlignment.MIDDLE;
	}
	if (oFF.isNull(horAlign))
	{
		horAlign = oFF.SacVisualizationHorizontalAlignment.LEFT;
	}
	exportCellStyle.putString(oFF.Model.VERT_ALIGN_KEY, oFF.XString.toLowerCase(vertAlign.getName()));
	exportCellStyle.putString(oFF.Model.HOR_ALIGN_KEY, oFF.XString.toLowerCase(horAlign.getName()));
};
oFF.Model.setExportPadding = function(cellStyles, cell, exportCellStyle)
{
	let padding = oFF.PrFactory.createStructure();
	let topLine = cell.getEffectiveStyledLineTop(cellStyles);
	let botLine = cell.getEffectiveStyleLineBottom(cellStyles);
	let leftLine = cell.getEffectiveStyledLineLeft(cellStyles);
	let rightLine = cell.getEffectiveStyledLineRight(cellStyles);
	let hasStyledLine = !oFF.SacStyleUtils.isStyleLineEmpty(topLine) || !oFF.SacStyleUtils.isStyleLineEmpty(botLine) || !oFF.SacStyleUtils.isStyleLineEmpty(leftLine) || !oFF.SacStyleUtils.isStyleLineEmpty(rightLine);
	if (hasStyledLine)
	{
		if (!oFF.SacStyleUtils.isStyleLineEmpty(topLine) || !oFF.SacStyleUtils.isStyleLineEmpty(botLine))
		{
			padding.putDouble(oFF.Model.PADDING_RIGHT_KEY, oFF.Model.convertToMm(oFF.SacTableConstants.LP_RIGHT));
			padding.putDouble(oFF.Model.PADDING_LEFT_KEY, oFF.Model.convertToMm(oFF.SacTableConstants.LP_RIGHT));
		}
		else
		{
			padding.putDouble(oFF.Model.PADDING_BOTTOM_KEY, oFF.Model.convertToMm(oFF.SacTableConstants.LP_BOTTOM));
			padding.putDouble(oFF.Model.PADDING_TOP_KEY, oFF.Model.convertToMm(oFF.SacTableConstants.LP_TOP));
		}
	}
	let applyPadding = (line) => {
		if (!oFF.SacStyleUtils.isStyleLineEmpty(line) && line.hasPadding())
		{
			padding.putDouble(oFF.Model.PADDING_RIGHT_KEY, oFF.Model.convertToMm(oFF.XDouble.convertToInt(line.getRightPadding())));
			padding.putDouble(oFF.Model.PADDING_LEFT_KEY, oFF.Model.convertToMm(oFF.XDouble.convertToInt(line.getLeftPadding())));
		}
	};
	applyPadding(cell.getEffectiveStyledLineTop(cellStyles));
	applyPadding(cell.getEffectiveStyleLineBottom(cellStyles));
	applyPadding(cell.getEffectiveStyledLineLeft(cellStyles));
	applyPadding(cell.getEffectiveStyledLineRight(cellStyles));
	if (cell.getHierarchyPaddingType() !== null)
	{
		padding.putDouble(oFF.Model.convertHierPadding(cell.getHierarchyPaddingType()), oFF.Model.convertToMm(cell.getHierarchyPaddingValue() * (1 + cell.getHierarchyLevel())));
	}
	if (padding.hasElements())
	{
		exportCellStyle.put(oFF.Model.PADDING_KEY, padding);
	}
};
oFF.Model.prototype.csvConf = null;
oFF.Model.prototype.pdfConf = null;
oFF.Model.prototype.root = null;
oFF.Model.prototype.xlsConf = null;
oFF.Model.prototype.addRowsToModel = function(sacTable, config, styleMap, exportStyles, exportRows, rows, isHeaderRow)
{
	let formatStrMap = oFF.XLinkedHashMapByString.create();
	let requiresStyle = config.requiresStyle();
	let requiresNumberFormatString = config.requiresNumberFormat();
	for (let i2 = 0; i2 < rows.size(); i2++)
	{
		let row = rows.get(i2);
		let exportRow = exportRows.addNewStructure();
		exportRow.putDouble("height", oFF.Model.convertToMm(row.getEffectiveHeight()));
		let exportCells = exportRow.putNewList(oFF.Model.TABLE_ROW_CELLS);
		let cells = row.getCells();
		for (let j = 0; j < cells.size(); j++)
		{
			let cell = cells.get(j);
			let exportCell = exportCells.addNewStructure();
			oFF.Model.populateExportCellValues(exportCell, cell, config);
			if (requiresStyle)
			{
				let exportCellStyle = oFF.PrFactory.createStructure();
				let pattern = cell.getFormattingPattern();
				if (requiresNumberFormatString && oFF.XStringUtils.isNotNullAndNotEmpty(pattern))
				{
					let patternId;
					if (!formatStrMap.containsKey(pattern))
					{
						patternId = config.addNumberFormat(pattern);
						formatStrMap.put(pattern, oFF.XIntegerValue.create(patternId));
					}
					else
					{
						patternId = formatStrMap.getByKey(pattern).getInteger();
					}
					exportCellStyle.putInteger(oFF.Model.XLSX_FORMAT_KEY, patternId);
				}
				let cellStyles = cell.getPrioritizedStylesList();
				if (oFF.Model.hasStyleToApply(cell, cellStyles))
				{
					let fontColor = exportCellStyle.putNewStructure(oFF.Model.FONT_COLOR_KEY);
					let isValue = cell.getType() === oFF.SacTableConstants.CT_VALUE;
					let effectiveFontColor = cell.getEffectiveFontColor(cellStyles);
					if (oFF.XStringUtils.isNullOrEmpty(effectiveFontColor))
					{
						if (isValue)
						{
							fontColor.putInteger("r", 153);
							fontColor.putInteger("g", 153);
							fontColor.putInteger("b", 153);
						}
						else
						{
							fontColor.putInteger("r", 51);
							fontColor.putInteger("g", 51);
							fontColor.putInteger("b", 51);
						}
					}
					else
					{
						oFF.Model.parseColor(fontColor, effectiveFontColor);
					}
					oFF.Model.setAlignmentsFromCellStyle(cellStyles, cell, exportCellStyle);
					let isCornerCell = isHeaderRow && j <= sacTable.getPreColumnsAmount() - 1;
					if (cell.isEffectiveFontBold(cellStyles) || isCornerCell)
					{
						exportCellStyle.putInteger(oFF.Model.FONT_WEIGHT_KEY, 700);
					}
					let styledLineBottom = cell.getEffectiveStyleLineBottom(cellStyles);
					if (!oFF.SacStyleUtils.isStyleLineEmpty(styledLineBottom))
					{
						oFF.Model.parseColor(exportCellStyle.putNewStructure(oFF.Model.LINE_COLOR_KEY), styledLineBottom.getColor());
						exportCellStyle.putDouble(oFF.Model.LINE_SIZE_KEY, 0.26458333);
					}
					oFF.Model.setExportPadding(cellStyles, cell, exportCellStyle);
				}
				if (!exportCellStyle.isEmpty())
				{
					let styleKey = exportCellStyle.toString();
					if (!styleMap.containsKey(styleKey))
					{
						let nextIndex = exportStyles.size();
						styleMap.put(styleKey, oFF.XIntegerValue.create(nextIndex));
						exportStyles.add(exportCellStyle);
						exportCell.putInteger(oFF.Model.STYLE_KEY, nextIndex);
					}
					else
					{
						let index = styleMap.getByKey(styleKey);
						exportCell.putInteger(oFF.Model.STYLE_KEY, index.getInteger());
					}
				}
			}
		}
	}
};
oFF.Model.prototype.addTable = function(title)
{
	let tables;
	if (!this.root.containsKey(oFF.Model.MODEL_TABLES_KEY))
	{
		tables = this.root.putNewList(oFF.Model.MODEL_TABLES_KEY);
	}
	else
	{
		tables = this.root.getListByKey(oFF.Model.MODEL_TABLES_KEY);
	}
	let table = tables.addNewStructure();
	table.putNewList(oFF.Model.TABLE_ROWS_KEY);
	table.putString(oFF.Model.TABLE_TITLE_KEY, title);
	return table;
};
oFF.Model.prototype.asStructure = function()
{
	return this.root;
};
oFF.Model.prototype.getCorrectWidth = function(originallWidth, factor, maxPixelCellWidth, minPixelCellWidth)
{
	return oFF.XMath.min(maxPixelCellWidth, oFF.XMath.max(oFF.XMath.div(originallWidth * factor, 10), minPixelCellWidth));
};
oFF.Model.prototype.getFileName = function()
{
	return this.root.getStringByKey(oFF.Model.FILE_NAME_KEY);
};
oFF.Model.prototype.getXlsxConfigs = function()
{
	let result;
	if (!this.root.containsKey(oFF.Model.XLSX_CONF_KEY))
	{
		result = this.root.putNewList(oFF.Model.XLSX_CONF_KEY);
	}
	else
	{
		result = this.root.getListByKey(oFF.Model.XLSX_CONF_KEY);
	}
	return result;
};
oFF.Model.prototype.populateColumnWidths = function(sacTable, colWidths)
{
	let availableWidth = sacTable.getWidth() - 100;
	let columnWidths = sacTable.getColumnEmWidthsSubList(0, -1);
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
	let minPixelCellWidth = sacTable.getMinCellWidth();
	let maxPixelCellWidth = sacTable.getMaxCellWidth();
	for (let i = 0; i < columnWidths.size(); i++)
	{
		colWidths.addDouble(oFF.Model.convertToMm(this.getCorrectWidth(columnWidths.get(i).getInteger(), factor, maxPixelCellWidth, minPixelCellWidth)));
	}
};
oFF.Model.prototype.processTable = function(config, sacTable)
{
	this.setFileName(config.getFileName());
	this.setConfig(config);
	let table = this.addTable(sacTable.getTitle() === null ? "DefaultTitle" : sacTable.getTitle());
	if (config.supportsAppendix() && config.getAppendix() !== null)
	{
		let appendixTable = this.addTable(config.getAppendix().getTitle());
		config.getAppendix().populateTable(appendixTable, config.hasAutoColWidths());
	}
	table.putInteger(oFF.Model.NUM_COLS_KEY, sacTable.getHeaderColumnList().size() + sacTable.getColumnList().size());
	table.putDouble(oFF.Model.TOTAL_HEIGHT_KEY, oFF.Model.convertToMm(sacTable.getHeight()));
	table.putDouble(oFF.Model.TOTAL_WIDTH_KEY, oFF.Model.convertToMm(sacTable.getWidth()));
	if (!config.hasAutoColWidths())
	{
		let colWidths = table.putNewList(oFF.Model.COL_WIDTHS_KEY);
		this.populateColumnWidths(sacTable, colWidths);
	}
	let styleMap = oFF.XHashMapByString.create();
	let styles = table.putNewList(oFF.Model.CELL_STYLES_KEY);
	let exportRows = table.getListByKey(oFF.Model.TABLE_ROWS_KEY);
	this.addRowsToModel(sacTable, config, styleMap, styles, exportRows, sacTable.getHeaderRowList(), true);
	this.addRowsToModel(sacTable, config, styleMap, styles, exportRows, sacTable.getRowList(), false);
	table.putInteger(oFF.Model.NUM_HEADER_COLS, sacTable.getPreColumnsAmount());
	table.putInteger(oFF.Model.NUM_HEADER_ROWS, sacTable.getPreRowsAmount());
};
oFF.Model.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.root);
	oFF.XObjectExt.release(this.csvConf);
	oFF.XObjectExt.release(this.pdfConf);
	oFF.XObjectExt.release(this.xlsConf);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.Model.prototype.setConfig = function(conf)
{
	if (oFF.XString.isEqual(oFF.BaseExportConfig.CSV_EXPORT, conf.getType()))
	{
		this.root.put(oFF.Model.CSV_CONF_KEY, conf.getStructure());
	}
	else if (oFF.XString.isEqual(oFF.BaseExportConfig.PDF_EXPORT, conf.getType()))
	{
		this.root.put(oFF.Model.PDF_CONF_KEY, conf.getStructure());
	}
	else if (oFF.XString.isEqual(oFF.BaseExportConfig.XLSX_EXPORT, conf.getType()))
	{
		this.getXlsxConfigs().add(conf.getStructure());
	}
};
oFF.Model.prototype.setFileName = function(name)
{
	this.root.putString(oFF.Model.FILE_NAME_KEY, name);
};
oFF.Model.prototype.toString = function()
{
	return this.root.toString();
};

oFF.CsvConfig = function() {};
oFF.CsvConfig.prototype = new oFF.BaseExportConfig();
oFF.CsvConfig.prototype._ff_c = "CsvConfig";

oFF.CsvConfig.CSV_DEFAULT_DELIM = ",";
oFF.CsvConfig.CSV_DELIM_KEY = "delimiter";
oFF.CsvConfig.CSV_SKIP_FORMATTING = "skipNumberFormatting";
oFF.CsvConfig.CSV_SKIP_FORMATTING_DEFAULT = false;
oFF.CsvConfig.createDefault = function(conf, fileName)
{
	let result = new oFF.CsvConfig();
	result.init(conf);
	result.setDelimiter(oFF.CsvConfig.CSV_DEFAULT_DELIM);
	result.setFileName(fileName);
	return result;
};
oFF.CsvConfig.wrap = function(conf)
{
	let result = new oFF.CsvConfig();
	result.init(conf);
	return result;
};
oFF.CsvConfig.prototype.m_skipNumberFormatting = false;
oFF.CsvConfig.prototype.getDelimiter = function()
{
	return this.root.getStringByKey(oFF.CsvConfig.CSV_DELIM_KEY);
};
oFF.CsvConfig.prototype.getExportResult = function(exporter, model)
{
	if (this.isExportAsB64String())
	{
		return exporter.generateCsvBase64(model);
	}
	return exporter.exportCsv(model);
};
oFF.CsvConfig.prototype.getType = function()
{
	return oFF.BaseExportConfig.CSV_EXPORT;
};
oFF.CsvConfig.prototype.ignoreValueException = function()
{
	return true;
};
oFF.CsvConfig.prototype.populatePersistentStorage = function(persistentExportCfg)
{
	persistentExportCfg.putString(oFF.CsvConfig.CSV_DELIM_KEY, this.getDelimiter());
	persistentExportCfg.putBoolean(oFF.CsvConfig.CSV_SKIP_FORMATTING, this.skipNumberFormatting());
};
oFF.CsvConfig.prototype.requiresNumberFormat = function()
{
	return false;
};
oFF.CsvConfig.prototype.requiresStyle = function()
{
	return false;
};
oFF.CsvConfig.prototype.setDelimiter = function(delim)
{
	this.root.putString(oFF.CsvConfig.CSV_DELIM_KEY, delim);
};
oFF.CsvConfig.prototype.setSkipNumberFormatting = function(skip)
{
	this.m_skipNumberFormatting = skip;
};
oFF.CsvConfig.prototype.skipNumberFormatting = function()
{
	return this.m_skipNumberFormatting;
};

oFF.PdfConfig = function() {};
oFF.PdfConfig.prototype = new oFF.BaseExportConfig();
oFF.PdfConfig.prototype._ff_c = "PdfConfig";

oFF.PdfConfig.PAGE_NUMBER_LOC_FOOTER = "footer";
oFF.PdfConfig.PAGE_NUMBER_LOC_HEADER = "header";
oFF.PdfConfig.PAGE_NUMBER_LOC_NONE = "none";
oFF.PdfConfig.PAGE_SIZE_A2 = "A2";
oFF.PdfConfig.PAGE_SIZE_A3 = "A3";
oFF.PdfConfig.PAGE_SIZE_A4 = "A4";
oFF.PdfConfig.PAGE_SIZE_A5 = "A5";
oFF.PdfConfig.PAGE_SIZE_LEGAL = "Legal";
oFF.PdfConfig.PAGE_SIZE_LETTER = "Letter";
oFF.PdfConfig.PDF_APPENDIX_KEY = "enableAppendix";
oFF.PdfConfig.PDF_APPENDIX_KEY_USER_SELECTED = "enableAppendixUSEL";
oFF.PdfConfig.PDF_AUTO_SIZE_KEY = "autoSize";
oFF.PdfConfig.PDF_BUILTIN_FONT_KEY = "builtInFont";
oFF.PdfConfig.PDF_FIT_TABLE_TO_PAGE_WIDTH = "fitTableToPageWidth";
oFF.PdfConfig.PDF_FONT_FAMILY_KEY = "fontFamily";
oFF.PdfConfig.PDF_FONT_SIZE = "fontSize";
oFF.PdfConfig.PDF_FREEZE_ROWS_KEY = "freezeRows";
oFF.PdfConfig.PDF_ORIENT_LANDSCAPE = "landscape";
oFF.PdfConfig.PDF_ORIENT_PORTRAIT = "portrait";
oFF.PdfConfig.PDF_PAGE_NUM_LOC_KEY = "pageNumberLocation";
oFF.PdfConfig.PDF_PAGE_ORIENT_KEY = "orientation";
oFF.PdfConfig.PDF_PAGE_SIZE_KEY = "pageSize";
oFF.PdfConfig.createDefault = function(conf, fileName)
{
	let result = new oFF.PdfConfig();
	result.setFileName(fileName);
	result.init(conf);
	result.setOrientation(oFF.PdfConfig.PDF_ORIENT_LANDSCAPE);
	result.setPageSize("a4");
	result.setBuiltInFont("Helvetica");
	result.setAutoSize(true);
	result.setFontSize(6);
	return result;
};
oFF.PdfConfig.wrap = function(conf)
{
	let result = new oFF.PdfConfig();
	result.init(conf);
	return result;
};
oFF.PdfConfig.prototype.getAutoSize = function()
{
	return this.root.getBooleanByKey(oFF.PdfConfig.PDF_AUTO_SIZE_KEY);
};
oFF.PdfConfig.prototype.getExportResult = function(exporter, model)
{
	if (this.isExportAsB64String())
	{
		return exporter.generatePdfBase64(model);
	}
	return exporter.exportPdf(model);
};
oFF.PdfConfig.prototype.getFitTableToPageWidth = function()
{
	return this.root.getBooleanByKey(oFF.PdfConfig.PDF_FIT_TABLE_TO_PAGE_WIDTH);
};
oFF.PdfConfig.prototype.getFreezeRows = function()
{
	return this.root.getIntegerByKey(oFF.PdfConfig.PDF_FREEZE_ROWS_KEY);
};
oFF.PdfConfig.prototype.getNumberLocation = function()
{
	return this.root.getStringByKey(oFF.PdfConfig.PDF_PAGE_NUM_LOC_KEY);
};
oFF.PdfConfig.prototype.getOrientation = function()
{
	return this.root.getStringByKey(oFF.PdfConfig.PDF_PAGE_ORIENT_KEY);
};
oFF.PdfConfig.prototype.getPageSize = function()
{
	return this.root.getStringByKey(oFF.PdfConfig.PDF_PAGE_SIZE_KEY);
};
oFF.PdfConfig.prototype.getType = function()
{
	return oFF.BaseExportConfig.PDF_EXPORT;
};
oFF.PdfConfig.prototype.ignoreValueException = function()
{
	return false;
};
oFF.PdfConfig.prototype.populatePersistentStorage = function(persistentExportCfg)
{
	persistentExportCfg.putString(oFF.PdfConfig.PDF_PAGE_ORIENT_KEY, this.getOrientation());
	persistentExportCfg.putString(oFF.PdfConfig.PDF_PAGE_SIZE_KEY, this.getPageSize());
	persistentExportCfg.putBoolean(oFF.PdfConfig.PDF_FIT_TABLE_TO_PAGE_WIDTH, this.getFitTableToPageWidth());
	persistentExportCfg.putString(oFF.PdfConfig.PDF_PAGE_NUM_LOC_KEY, this.getNumberLocation());
	persistentExportCfg.putBoolean(oFF.PdfConfig.PDF_APPENDIX_KEY, this.supportsAppendix());
};
oFF.PdfConfig.prototype.requiresNumberFormat = function()
{
	return false;
};
oFF.PdfConfig.prototype.requiresStyle = function()
{
	return true;
};
oFF.PdfConfig.prototype.setAutoSize = function(autoSize)
{
	this.root.putBoolean(oFF.PdfConfig.PDF_AUTO_SIZE_KEY, autoSize);
};
oFF.PdfConfig.prototype.setBuiltInFont = function(font)
{
	this.root.putString(oFF.PdfConfig.PDF_BUILTIN_FONT_KEY, font);
};
oFF.PdfConfig.prototype.setFitTableToPageWidth = function(isFitTableToPageWidthSelected)
{
	this.root.putBoolean(oFF.PdfConfig.PDF_FIT_TABLE_TO_PAGE_WIDTH, isFitTableToPageWidthSelected);
};
oFF.PdfConfig.prototype.setFontFamily = function(fontFamily)
{
	this.root.putString(oFF.PdfConfig.PDF_FONT_FAMILY_KEY, fontFamily);
};
oFF.PdfConfig.prototype.setFontSize = function(d)
{
	this.root.putDouble(oFF.PdfConfig.PDF_FONT_SIZE, d);
};
oFF.PdfConfig.prototype.setFreezeRows = function(numRows)
{
	this.root.putInteger(oFF.PdfConfig.PDF_FREEZE_ROWS_KEY, numRows);
};
oFF.PdfConfig.prototype.setNumberLocation = function(location)
{
	this.root.putString(oFF.PdfConfig.PDF_PAGE_NUM_LOC_KEY, location);
};
oFF.PdfConfig.prototype.setOrientation = function(orient)
{
	this.root.putString(oFF.PdfConfig.PDF_PAGE_ORIENT_KEY, orient);
};
oFF.PdfConfig.prototype.setPageSize = function(pageSize)
{
	this.root.putString(oFF.PdfConfig.PDF_PAGE_SIZE_KEY, oFF.XString.toLowerCase(pageSize));
};
oFF.PdfConfig.prototype.skipNumberFormatting = function()
{
	return false;
};

oFF.XlsConfig = function() {};
oFF.XlsConfig.prototype = new oFF.BaseExportConfig();
oFF.XlsConfig.prototype._ff_c = "XlsConfig";

oFF.XlsConfig.XLSX_AUTO_FILTER = "autoFilter";
oFF.XlsConfig.XLSX_NUMBER_FORMATS = "numberFormats";
oFF.XlsConfig.createDefault = function(conf, fileName)
{
	let result = new oFF.XlsConfig();
	result.init(conf);
	result.setAutoFilterActive(true);
	result.setFileName(fileName);
	return result;
};
oFF.XlsConfig.wrap = function(conf)
{
	let result = new oFF.XlsConfig();
	result.init(conf);
	return result;
};
oFF.XlsConfig.prototype.addNumberFormat = function(formatStr)
{
	let nmbFmts = this.getNumberFormats();
	let nextId = nmbFmts.size();
	this.getNumberFormats().addString(formatStr);
	return nextId;
};
oFF.XlsConfig.prototype.getExportResult = function(exporter, model)
{
	if (this.isExportAsB64String())
	{
		return exporter.generateXlsxBase64(model);
	}
	return exporter.exportXlsx(model);
};
oFF.XlsConfig.prototype.getNumberFormats = function()
{
	if (this.root.containsKey(oFF.XlsConfig.XLSX_NUMBER_FORMATS))
	{
		return this.root.getListByKey(oFF.XlsConfig.XLSX_NUMBER_FORMATS);
	}
	return this.root.putNewList(oFF.XlsConfig.XLSX_NUMBER_FORMATS);
};
oFF.XlsConfig.prototype.getType = function()
{
	return oFF.BaseExportConfig.XLSX_EXPORT;
};
oFF.XlsConfig.prototype.ignoreValueException = function()
{
	return true;
};
oFF.XlsConfig.prototype.populatePersistentStorage = function(persistentExportCfg)
{
	persistentExportCfg.putBoolean(oFF.BaseExportConfig.PARAM_EXPAND_HIERARCHY, this.getExpandHierarchy());
};
oFF.XlsConfig.prototype.requiresNumberFormat = function()
{
	return true;
};
oFF.XlsConfig.prototype.requiresStyle = function()
{
	return true;
};
oFF.XlsConfig.prototype.setAutoFilterActive = function(isActive)
{
	this.root.putBoolean(oFF.XlsConfig.XLSX_AUTO_FILTER, isActive);
};
oFF.XlsConfig.prototype.skipNumberFormatting = function()
{
	return false;
};

oFF.ExportModule = function() {};
oFF.ExportModule.prototype = new oFF.DfModule();
oFF.ExportModule.prototype._ff_c = "ExportModule";

oFF.ExportModule.s_module = null;
oFF.ExportModule.getInstance = function()
{
	if (oFF.isNull(oFF.ExportModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.LanguageExtModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.CommonsModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.VisualizationUiModule.getInstance());
		oFF.ExportModule.s_module = oFF.DfModule.startExt(new oFF.ExportModule());
		oFF.DfModule.stopExt(oFF.ExportModule.s_module);
	}
	return oFF.ExportModule.s_module;
};
oFF.ExportModule.prototype.getName = function()
{
	return "ff2700.export";
};

oFF.ExportModule.getInstance();

return oFF;
} );