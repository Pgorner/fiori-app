/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2670.visualization.ui","sap/sac/df/firefly/ff3300.cell.engine"
],
function(oFF)
{
"use strict";

oFF.SpreadsheetModel = function() {};
oFF.SpreadsheetModel.prototype = new oFF.XObject();
oFF.SpreadsheetModel.prototype._ff_c = "SpreadsheetModel";

oFF.SpreadsheetModel.create = function()
{
	let instance = new oFF.SpreadsheetModel();
	instance.m_spreadsheet = oFF.XSpreadsheet.create();
	instance.m_selectedCellAddressRange = oFF.XCellAddressRange.createWithString("A1");
	return instance;
};
oFF.SpreadsheetModel.prototype.m_selectedCellAddressRange = null;
oFF.SpreadsheetModel.prototype.m_spreadsheet = null;
oFF.SpreadsheetModel.prototype.addCellProvider = function(cellProvider)
{
	this.m_spreadsheet.addCellProvider(this.m_selectedCellAddressRange.getStartingAddress(), cellProvider);
};
oFF.SpreadsheetModel.prototype.getAllCells = function()
{
	return this.m_spreadsheet.getCells();
};
oFF.SpreadsheetModel.prototype.getCellAtAddress = function(address)
{
	return this.m_spreadsheet.getCellAtAddress(address);
};
oFF.SpreadsheetModel.prototype.getFirstSelectedCell = function()
{
	return this.m_spreadsheet.getCellAtAddress(this.m_selectedCellAddressRange.getStartingAddress());
};
oFF.SpreadsheetModel.prototype.getSelectedCellAddress = function()
{
	return this.m_selectedCellAddressRange;
};
oFF.SpreadsheetModel.prototype.getSelectedCells = function()
{
	return this.m_spreadsheet.getCellRangeWithAddressRange(this.m_selectedCellAddressRange);
};
oFF.SpreadsheetModel.prototype.setSelectedCellAddress = function(selectedCellAddress)
{
	this.m_selectedCellAddressRange = selectedCellAddress;
};
oFF.SpreadsheetModel.prototype.setTextAtAddress = function(text, addressString)
{
	let address = oFF.XCellAddress.create(addressString);
	this.m_spreadsheet.getCellAtAddress(address).setText(text);
};

oFF.SpreadsheetRenderer = function() {};
oFF.SpreadsheetRenderer.prototype = new oFF.XObject();
oFF.SpreadsheetRenderer.prototype._ff_c = "SpreadsheetRenderer";

oFF.SpreadsheetRenderer.create = function(table, spreadsheetModel)
{
	let instance = new oFF.SpreadsheetRenderer();
	instance.m_spreadsheetModel = spreadsheetModel;
	instance.m_table = table;
	instance.m_genericRenderer = oFF.SacGridRendererFactory.createGridRenderer(table);
	return instance;
};
oFF.SpreadsheetRenderer.prototype.m_genericRenderer = null;
oFF.SpreadsheetRenderer.prototype.m_spreadsheetModel = null;
oFF.SpreadsheetRenderer.prototype.m_table = null;
oFF.SpreadsheetRenderer.prototype.formatCell = function(spreadsheetCell, sacTableCell)
{
	sacTableCell.getTableStyle().setFontColor(spreadsheetCell.getTextColor());
	sacTableCell.getTableStyle().setFillColor(spreadsheetCell.getBackgroundColor());
	sacTableCell.getTableStyle().setFontBold(spreadsheetCell.getBold());
	sacTableCell.getTableStyle().setFontItalic(spreadsheetCell.getItalic());
	sacTableCell.getTableStyle().setFontSize(spreadsheetCell.getFontSize());
	sacTableCell.getTableStyle().setHorizontalAlignment(spreadsheetCell.getHorizontalAlignment());
};
oFF.SpreadsheetRenderer.prototype.getTableJson = function()
{
	return this.m_genericRenderer.getTableJson();
};
oFF.SpreadsheetRenderer.prototype.render = function()
{
	let cells = this.m_spreadsheetModel.getAllCells();
	this.m_table.setMinCellWidth(98);
	for (let i = 0; i < cells.size(); i++)
	{
		let dr;
		if (i >= this.m_table.getDataRowAmount())
		{
			dr = this.m_table.newDataRow();
		}
		else
		{
			dr = this.m_table.getRowList().get(i);
		}
		dr.setHeight(24);
		for (let j = 0; j < cells.get(i).size(); j++)
		{
			let sacTableCell;
			if (j >= dr.getCells().size())
			{
				sacTableCell = dr.addNewCell();
			}
			else
			{
				sacTableCell = dr.getCells().get(j);
			}
			let spreadsheetCell = cells.get(i).get(j);
			sacTableCell.setFormatted(spreadsheetCell.getFormattedString());
			this.formatCell(spreadsheetCell, sacTableCell);
		}
	}
	this.m_table.setDataColumnsAmount(cells.get(0).size());
	this.m_table.setDataRowAmount(cells.size());
	this.m_table.setPreColumnsAmount(0);
	return this.m_genericRenderer.render();
};
oFF.SpreadsheetRenderer.prototype.setGridConfigration = function(gridConfig)
{
	this.m_genericRenderer.setGridConfigration(gridConfig);
};

oFF.SpreadsheetController = function() {};
oFF.SpreadsheetController.prototype = new oFF.XObject();
oFF.SpreadsheetController.prototype._ff_c = "SpreadsheetController";

oFF.SpreadsheetController.create = function(functionInput, cellSelectInput)
{
	let instance = new oFF.SpreadsheetController();
	instance.m_uiModel = oFF.SpreadsheetModel.create();
	instance.m_functionInput = functionInput;
	instance.m_addressInput = cellSelectInput;
	instance.internalSetup();
	return instance;
};
oFF.SpreadsheetController.prototype.m_addressInput = null;
oFF.SpreadsheetController.prototype.m_functionInput = null;
oFF.SpreadsheetController.prototype.m_tableView = null;
oFF.SpreadsheetController.prototype.m_uiModel = null;
oFF.SpreadsheetController.prototype.addCellProvider = function(cellProvider)
{
	this.m_uiModel.addCellProvider(cellProvider);
};
oFF.SpreadsheetController.prototype.getCellAddress = function(selectionArea)
{
	let jsonParser = oFF.JsonParserFactory.newInstance();
	let selectionParameters = jsonParser.parse(selectionArea).asList();
	let startRow = selectionParameters.asList().get(0).asStructure().getIntegerByKey("startRow");
	let startCol = selectionParameters.asList().get(0).asStructure().getIntegerByKey("startCol");
	let endRow = selectionParameters.asList().get(0).asStructure().getIntegerByKey("endRow");
	let endCol = selectionParameters.asList().get(0).asStructure().getIntegerByKey("endCol");
	let cellAddress = oFF.XCellAddressRange.createWithIndices(startRow, endRow, startCol, endCol);
	return cellAddress;
};
oFF.SpreadsheetController.prototype.getModel = function()
{
	return this.m_uiModel;
};
oFF.SpreadsheetController.prototype.internalSetup = function()
{
	this.m_functionInput.registerOnEnter(this);
	this.m_addressInput.setEnabled(false);
};
oFF.SpreadsheetController.prototype.onEnter = function(event)
{
	this.setCellText(this.m_functionInput.getValue());
};
oFF.SpreadsheetController.prototype.onSelectionChange = function(event)
{
	let selectionArea = event.getParameters().getByKey("selectionArea");
	let cellAddressRange = this.getCellAddress(selectionArea);
	this.m_tableView.analyzeSelectionEvent(event);
	this.m_uiModel.setSelectedCellAddress(cellAddressRange);
	this.m_functionInput.setValue(this.m_uiModel.getSelectedCells().get(0).get(0).getStringLiteral());
	this.m_functionInput.focus();
	this.m_addressInput.setValue(this.m_uiModel.getSelectedCellAddress().getAddressString());
};
oFF.SpreadsheetController.prototype.releaseObject = function()
{
	this.m_uiModel = oFF.XObjectExt.release(this.m_uiModel);
};
oFF.SpreadsheetController.prototype.setCellText = function(text)
{
	this.m_uiModel.getFirstSelectedCell().setText(text);
	this.m_tableView.renderSpreadsheet();
};
oFF.SpreadsheetController.prototype.setTableView = function(tableView)
{
	this.m_tableView = tableView;
};
oFF.SpreadsheetController.prototype.setTextAtAddress = function(text, address)
{
	this.m_uiModel.setTextAtAddress(text, address);
};

oFF.SacSpreadsheetClipboardHelper = function() {};
oFF.SacSpreadsheetClipboardHelper.prototype = new oFF.SacTableClipboardHelper();
oFF.SacSpreadsheetClipboardHelper.prototype._ff_c = "SacSpreadsheetClipboardHelper";

oFF.SacSpreadsheetClipboardHelper.createForSpreadsheet = function(tableInstance, model)
{
	let instance = new oFF.SacSpreadsheetClipboardHelper();
	instance.setupWithTable(tableInstance);
	instance.setupModel(model);
	return instance;
};
oFF.SacSpreadsheetClipboardHelper.prototype.m_model = null;
oFF.SacSpreadsheetClipboardHelper.prototype.getCellValueAt = function(rowIndex, columnIndex)
{
	return this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, columnIndex)).evaluate();
};
oFF.SacSpreadsheetClipboardHelper.prototype.pasteCells = function(pasting, column, row)
{
	let colMin = pasting.getIntegerByKey(oFF.SacTable.SELECTION_COL_MIN);
	let rowMin = pasting.getIntegerByKey(oFF.SacTable.SELECTION_ROW_MIN);
	let cellList = pasting.getListByKey(oFF.SacTable.SELECTION_LIST);
	let plainString = "";
	let plain;
	for (let i = 0; i < cellList.size(); i++)
	{
		let cell = cellList.getStructureAt(i);
		let colIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN) - colMin + column;
		let rowIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_ROW) - rowMin + row;
		let cells;
		if (rowIndex < this.getTable().getHeaderRowList().size())
		{
			cells = this.getTable().getHeaderRowList().get(rowIndex).getCells();
			if (colIndex < cells.size())
			{
				plain = cell.getByKey(oFF.SacTableConstants.C_SN_PLAIN);
				plainString = oFF.isNull(plain) ? "" : plain.getStringRepresentation();
				this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, colIndex)).setText(plainString);
			}
		}
		else if (rowIndex - this.getTable().getHeaderRowList().size() < this.getTable().getRowList().size())
		{
			cells = this.getTable().getRowList().get(rowIndex - this.getTable().getHeaderRowList().size()).getCells();
			if (colIndex < cells.size())
			{
				plain = cell.getByKey(oFF.SacTableConstants.C_SN_PLAIN);
				plainString = oFF.isNull(plain) ? "" : plain.getStringRepresentation();
				this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, colIndex)).setText(plainString);
			}
		}
	}
};
oFF.SacSpreadsheetClipboardHelper.prototype.pasteLine = function(cells, rowIndex, column, cellValues)
{
	for (let i = 0; i < cellValues.size(); i++)
	{
		let colIndex = column + i;
		let cellValue = cellValues.get(i);
		if (colIndex < cells.size())
		{
			this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, colIndex)).setText(cellValue);
		}
	}
};
oFF.SacSpreadsheetClipboardHelper.prototype.setupModel = function(model)
{
	this.m_model = model;
};

oFF.SacSpreadsheetTable = function() {};
oFF.SacSpreadsheetTable.prototype = new oFF.SacTable();
oFF.SacSpreadsheetTable.prototype._ff_c = "SacSpreadsheetTable";

oFF.SacSpreadsheetTable.createWithModel = function(model)
{
	let instance = new oFF.SacSpreadsheetTable();
	instance.internalSetup();
	instance.m_model = model;
	return instance;
};
oFF.SacSpreadsheetTable.prototype.m_linkedSelection = null;
oFF.SacSpreadsheetTable.prototype.m_linkedTable = null;
oFF.SacSpreadsheetTable.prototype.m_model = null;
oFF.SacSpreadsheetTable.prototype.setupLinkedSelection = function(linkedTable, selection)
{
	this.m_linkedSelection = selection;
	this.m_linkedTable = linkedTable;
	this.updateLinkedSelection();
};
oFF.SacSpreadsheetTable.prototype.updateLinkedSelection = function()
{
	if (oFF.notNull(this.m_linkedSelection) && oFF.notNull(this.m_linkedTable))
	{
		let linkedData = oFF.SacBasicTableClipboardHelper.create(this.m_linkedTable).copyCells(this.m_linkedSelection);
		let colMin = linkedData.getIntegerByKey(oFF.SacTable.SELECTION_COL_MIN);
		let rowMin = linkedData.getIntegerByKey(oFF.SacTable.SELECTION_ROW_MIN);
		let cellList = linkedData.getListByKey(oFF.SacTable.SELECTION_LIST);
		let plainString = "";
		let plain;
		for (let i = 0; i < cellList.size(); i++)
		{
			let cell = cellList.getStructureAt(i);
			let colIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_COLUMN) - colMin;
			let rowIndex = cell.getIntegerByKey(oFF.SacTableConstants.C_N_ROW) - rowMin;
			let cells;
			if (rowIndex < this.getHeaderRowList().size())
			{
				cells = this.getHeaderRowList().get(rowIndex).getCells();
				if (colIndex < cells.size())
				{
					plain = cell.getByKey(oFF.SacTableConstants.C_SN_PLAIN);
					plainString = (oFF.isNull(plain)) ? "" : plain.getStringRepresentation();
					this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, colIndex)).updateTextFromLinkedObject(plainString);
				}
			}
			else if (rowIndex - this.getHeaderRowList().size() < this.getRowList().size())
			{
				cells = this.getRowList().get(rowIndex - this.getHeaderRowList().size()).getCells();
				if (colIndex < cells.size())
				{
					plain = cell.getByKey(oFF.SacTableConstants.C_SN_PLAIN);
					plainString = (oFF.isNull(plain)) ? "" : plain.getStringRepresentation();
					this.m_model.getCellAtAddress(oFF.XCellAddress.createWithIndices(rowIndex, colIndex)).updateTextFromLinkedObject(plainString);
				}
			}
		}
	}
};

oFF.SpreadSheetTableView = function() {};
oFF.SpreadSheetTableView.prototype = new oFF.DfUiContentView();
oFF.SpreadSheetTableView.prototype._ff_c = "SpreadSheetTableView";

oFF.SpreadSheetTableView.create = function(genesis)
{
	let instance = new oFF.SpreadSheetTableView();
	instance.initView(genesis);
	return instance;
};
oFF.SpreadSheetTableView.prototype.m_abstractSacTable = null;
oFF.SpreadSheetTableView.prototype.m_abstractTableRenderer = null;
oFF.SpreadSheetTableView.prototype.m_cellAddressInput = null;
oFF.SpreadSheetTableView.prototype.m_columnMin = 0;
oFF.SpreadSheetTableView.prototype.m_contentLayout = null;
oFF.SpreadSheetTableView.prototype.m_controller = null;
oFF.SpreadSheetTableView.prototype.m_currentSelectionElement = null;
oFF.SpreadSheetTableView.prototype.m_formulaInput = null;
oFF.SpreadSheetTableView.prototype.m_rowMin = 0;
oFF.SpreadSheetTableView.prototype.m_sacTable = null;
oFF.SpreadSheetTableView.prototype.m_tableClipboardHelper = null;
oFF.SpreadSheetTableView.prototype.addCellProvider = function(cellProvider)
{
	this.m_controller.addCellProvider(cellProvider);
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.addDecimalPlace = function()
{
	this.setStyleOnCellRange((cell) => {
		cell.addRightDigit();
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.analyseSelectionStructure = function(selectionStructure)
{
	let startCol = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_COL);
	let endCol = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_COL);
	let startRow = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_START_ROW);
	let endRow = selectionStructure.getIntegerByKey(oFF.SacTableConstants.CCD_N_END_ROW);
	this.m_columnMin = oFF.XMath.min(startCol, endCol);
	this.m_rowMin = oFF.XMath.min(startRow, endRow);
};
oFF.SpreadSheetTableView.prototype.analyzeSelectionEvent = function(event)
{
	let selectionString = event.getParameters().getStringByKey(oFF.UiEventParams.PARAM_SELECTION_AREA);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(selectionString))
	{
		let selectionElement = oFF.JsonParserFactory.createFromString(selectionString);
		if (!this.trySetupSelection(selectionElement))
		{
			this.m_columnMin = -1;
			this.m_rowMin = -1;
		}
	}
	else
	{
		this.m_columnMin = -1;
		this.m_rowMin = -1;
	}
};
oFF.SpreadSheetTableView.prototype.buildViewUi = function(genesis)
{
	this.m_contentLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_contentLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_contentLayout.useMaxSpace();
	this.setupTopBar();
	this.m_controller = oFF.SpreadsheetController.create(this.m_formulaInput, this.m_cellAddressInput);
	this.m_controller.setTableView(this);
	this.m_sacTable = this.m_contentLayout.addNewItemOfType(oFF.UiType.SAC_TABLE_GRID);
	this.m_sacTable.useMaxSpace();
	this.m_sacTable.registerOnResize(this);
	this.m_sacTable.registerOnSelectionChange(this.m_controller);
	this.m_abstractSacTable = oFF.SacSpreadsheetTable.createWithModel(this.m_controller.getModel());
	this.m_abstractTableRenderer = oFF.SpreadsheetRenderer.create(this.m_abstractSacTable, this.m_controller.getModel());
	this.m_tableClipboardHelper = oFF.SacSpreadsheetClipboardHelper.createForSpreadsheet(this.m_abstractSacTable, this.m_controller.getModel());
	this.createExampleCells();
	this.renderSpreadsheet();
	genesis.setRoot(this.m_contentLayout);
};
oFF.SpreadSheetTableView.prototype.copyCells = function()
{
	return this.m_tableClipboardHelper.copyCellsToString(this.m_currentSelectionElement);
};
oFF.SpreadSheetTableView.prototype.createExampleCells = function() {};
oFF.SpreadSheetTableView.prototype.destroyView = function()
{
	this.m_formulaInput = oFF.XObjectExt.release(this.m_formulaInput);
	this.m_cellAddressInput = oFF.XObjectExt.release(this.m_cellAddressInput);
	this.m_sacTable = oFF.XObjectExt.release(this.m_sacTable);
	this.m_abstractSacTable = oFF.XObjectExt.release(this.m_abstractSacTable);
	this.m_abstractTableRenderer = oFF.XObjectExt.release(this.m_abstractTableRenderer);
	this.m_controller = oFF.XObjectExt.release(this.m_controller);
	this.m_tableClipboardHelper = oFF.XObjectExt.release(this.m_tableClipboardHelper);
};
oFF.SpreadSheetTableView.prototype.getColumnMin = function()
{
	return this.m_columnMin;
};
oFF.SpreadSheetTableView.prototype.getCurrentSelectionElement = function()
{
	return this.m_currentSelectionElement;
};
oFF.SpreadSheetTableView.prototype.getGridControl = function()
{
	return this.m_sacTable;
};
oFF.SpreadSheetTableView.prototype.getRowMin = function()
{
	return this.m_rowMin;
};
oFF.SpreadSheetTableView.prototype.getTable = function()
{
	return this.m_abstractSacTable;
};
oFF.SpreadSheetTableView.prototype.onResize = function(event)
{
	let width = event.getOffsetWidth();
	let height = event.getOffsetHeight();
	if (width !== 0 && height !== 0)
	{
		if (oFF.notNull(this.m_abstractSacTable))
		{
			this.m_abstractSacTable.setWidth(width);
			this.m_abstractSacTable.setHeight(height);
			this.m_sacTable.setModelJson(this.m_abstractTableRenderer.render());
		}
	}
};
oFF.SpreadSheetTableView.prototype.pasteCells = function(clipboardData)
{
	this.m_tableClipboardHelper.pasteString(clipboardData, this.m_columnMin, this.m_rowMin);
	this.m_sacTable.setModelJson(this.m_abstractTableRenderer.render());
};
oFF.SpreadSheetTableView.prototype.removeDecimalPlace = function()
{
	this.setStyleOnCellRange((cell) => {
		cell.removeRightDigit();
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.renderSpreadsheet = function()
{
	let result = this.m_abstractTableRenderer.render();
	this.m_sacTable.setModelJson(result);
};
oFF.SpreadSheetTableView.prototype.setHorizontalAlignCenter = function()
{
	this.setHorizontalAlignment(oFF.SacVisualizationHorizontalAlignment.CENTER);
};
oFF.SpreadSheetTableView.prototype.setHorizontalAlignLeft = function()
{
	this.setHorizontalAlignment(oFF.SacVisualizationHorizontalAlignment.LEFT);
};
oFF.SpreadSheetTableView.prototype.setHorizontalAlignRight = function()
{
	this.setHorizontalAlignment(oFF.SacVisualizationHorizontalAlignment.RIGHT);
};
oFF.SpreadSheetTableView.prototype.setHorizontalAlignment = function(horizontalAlignment)
{
	this.setStyleOnCellRange((cell) => {
		cell.setHorizontalAlignment(horizontalAlignment);
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.setSelectedCellBackgroundColor = function(color)
{
	let cssColor = oFF.XStringUtils.concatenate2("#", color);
	this.setStyleOnCellRange((cell) => {
		cell.setBackgroundColor(cssColor);
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.setSelectedCellBold = function()
{
	this.toggleSelectedCellBold();
};
oFF.SpreadSheetTableView.prototype.setSelectedCellFontSize = function(fontSize)
{
	this.setStyleOnCellRange((cell) => {
		cell.setFontSize(fontSize);
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.setSelectedCellItalic = function()
{
	this.toggleSelectedCellItalic();
};
oFF.SpreadSheetTableView.prototype.setSelectedCellTextColor = function(color)
{
	let cssColor = oFF.XStringUtils.concatenate2("#", color);
	this.setStyleOnCellRange((cell) => {
		cell.setTextColor(cssColor);
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.setStyleOnCellRange = function(operation)
{
	let selectedCells = this.m_controller.getModel().getSelectedCells();
	for (let i = 0; i < selectedCells.size(); i++)
	{
		for (let j = 0; j < selectedCells.get(i).size(); j++)
		{
			operation(selectedCells.get(i).get(j));
		}
	}
};
oFF.SpreadSheetTableView.prototype.setupTopBar = function()
{
	let topBarWrapper = this.m_contentLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	topBarWrapper.setDirection(oFF.UiFlexDirection.ROW);
	topBarWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	topBarWrapper.useMaxWidth();
	topBarWrapper.setFlex("0 0 34px");
	topBarWrapper.setBackgroundColor(oFF.UiColor.GREY.newBrighterColor(0.3));
	topBarWrapper.setBorderWidth(oFF.UiCssBoxEdges.create("0px 0px 1px 0px"));
	topBarWrapper.setBorderColor(oFF.UiColor.GREY);
	topBarWrapper.setBorderStyle(oFF.UiBorderStyle.SOLID);
	this.m_cellAddressInput = topBarWrapper.addNewItemOfType(oFF.UiType.INPUT);
	this.m_cellAddressInput.setTag("gdsSpreadsheetSelectedCellInput");
	this.m_cellAddressInput.setMargin(oFF.UiCssBoxEdges.create("0px 7px 0px 0px"));
	this.m_cellAddressInput.setFlex("0 0 100px");
	let cancelIcon = topBarWrapper.addNewItemOfType(oFF.UiType.ICON);
	cancelIcon.setTag("gdsSpreadsheetCancelIcon");
	cancelIcon.setIconSize(oFF.UiCssLength.create("20px"));
	cancelIcon.setIcon("decline");
	cancelIcon.setColor(oFF.UiColor.RED);
	cancelIcon.setMargin(oFF.UiCssBoxEdges.create("0px 7px"));
	let enterIcon = topBarWrapper.addNewItemOfType(oFF.UiType.ICON);
	enterIcon.setTag("gdsSpreadsheetEnterIcon");
	enterIcon.setIconSize(oFF.UiCssLength.create("20px"));
	enterIcon.setIcon("accept");
	enterIcon.setColor(oFF.UiColor.GREEN);
	enterIcon.setMargin(oFF.UiCssBoxEdges.create("0px 7px"));
	let functionIcon = topBarWrapper.addNewItemOfType(oFF.UiType.ICON);
	functionIcon.setIconSize(oFF.UiCssLength.create("20px"));
	functionIcon.setIcon("fx");
	functionIcon.setColor(oFF.UiColor.GREY);
	functionIcon.setMargin(oFF.UiCssBoxEdges.create("0px 7px"));
	functionIcon.setEnabled(false);
	this.m_formulaInput = topBarWrapper.addNewItemOfType(oFF.UiType.INPUT);
	this.m_formulaInput.setTag("gdsSpreadsheetFunctionInput");
};
oFF.SpreadSheetTableView.prototype.setupView = function() {};
oFF.SpreadSheetTableView.prototype.toggleSelectedCellBold = function()
{
	this.setStyleOnCellRange((cell) => {
		cell.setBold(!cell.getBold());
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.toggleSelectedCellItalic = function()
{
	this.setStyleOnCellRange((cell) => {
		cell.setItalic(!cell.getItalic());
	});
	this.renderSpreadsheet();
};
oFF.SpreadSheetTableView.prototype.trySetupSelection = function(selectionElement)
{
	this.m_currentSelectionElement = selectionElement;
	let success = false;
	if (oFF.notNull(selectionElement))
	{
		if (selectionElement.isStructure())
		{
			this.analyseSelectionStructure(selectionElement.asStructure());
			success = true;
		}
		else if (selectionElement.isList())
		{
			let selectionList = selectionElement.asList();
			if (oFF.XCollectionUtils.hasElements(selectionList))
			{
				for (let i = 0; i < selectionList.size(); i++)
				{
					this.analyseSelectionStructure(selectionList.getStructureAt(i));
				}
				success = true;
			}
		}
	}
	return success;
};

oFF.CellEngineUiModule = function() {};
oFF.CellEngineUiModule.prototype = new oFF.DfModule();
oFF.CellEngineUiModule.prototype._ff_c = "CellEngineUiModule";

oFF.CellEngineUiModule.s_module = null;
oFF.CellEngineUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.CellEngineUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.CellEngineModule.getInstance());
		oFF.CellEngineUiModule.s_module = oFF.DfModule.startExt(new oFF.CellEngineUiModule());
		oFF.DfModule.stopExt(oFF.CellEngineUiModule.s_module);
	}
	return oFF.CellEngineUiModule.s_module;
};
oFF.CellEngineUiModule.prototype.getName = function()
{
	return "ff3350.cell.engine.ui";
};

oFF.DfModule.checkInitialized(oFF.VisualizationUiModule.getInstance());
oFF.DfModule.checkInitialized(oFF.CellEngineModule.getInstance());
oFF.CellEngineUiModule.getInstance();

return oFF;
} );