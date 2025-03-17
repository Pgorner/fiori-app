/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2600.visualization.abstract"
],
function(oFF)
{
"use strict";

oFF.CellChartInfo = function() {};
oFF.CellChartInfo.prototype = new oFF.XObject();
oFF.CellChartInfo.prototype._ff_c = "CellChartInfo";

oFF.CellChartInfo.create = function(orientation, column, row, value)
{
	let result = new oFF.CellChartInfo();
	result.m_orientation = orientation;
	result.m_startColumn = column;
	result.m_endColumn = column;
	result.m_startRow = row;
	result.m_endRow = row;
	result.m_maxValue = value;
	result.m_minValue = value;
	result.m_columns = oFF.XList.create();
	result.m_columns.add(oFF.XIntegerValue.create(column));
	return result;
};
oFF.CellChartInfo.prototype.m_columns = null;
oFF.CellChartInfo.prototype.m_endColumn = 0;
oFF.CellChartInfo.prototype.m_endRow = 0;
oFF.CellChartInfo.prototype.m_maxValue = 0.0;
oFF.CellChartInfo.prototype.m_minValue = 0.0;
oFF.CellChartInfo.prototype.m_orientation = null;
oFF.CellChartInfo.prototype.m_startColumn = 0;
oFF.CellChartInfo.prototype.m_startRow = 0;
oFF.CellChartInfo.prototype.addColumn = function(column)
{
	let columnValue = oFF.XIntegerValue.create(column);
	if (!this.m_columns.contains(columnValue))
	{
		this.m_columns.add(columnValue);
		this.m_startColumn = oFF.XMath.max(this.m_startColumn, column);
		this.m_endColumn = oFF.XMath.max(this.m_endColumn, column);
	}
};
oFF.CellChartInfo.prototype.addRow = function(row)
{
	this.m_startRow = oFF.XMath.max(this.m_startColumn, row);
	this.m_endRow = oFF.XMath.max(this.m_endColumn, row);
};
oFF.CellChartInfo.prototype.getColumns = function()
{
	return this.m_columns;
};
oFF.CellChartInfo.prototype.getEndColumn = function()
{
	return this.m_endColumn;
};
oFF.CellChartInfo.prototype.getEndRow = function()
{
	return this.m_endRow;
};
oFF.CellChartInfo.prototype.getMaxValue = function()
{
	return this.m_maxValue;
};
oFF.CellChartInfo.prototype.getMinValue = function()
{
	return this.m_minValue;
};
oFF.CellChartInfo.prototype.getOrientation = function()
{
	return this.m_orientation;
};
oFF.CellChartInfo.prototype.getStartColumn = function()
{
	return this.m_startColumn;
};
oFF.CellChartInfo.prototype.getStartRow = function()
{
	return this.m_startRow;
};
oFF.CellChartInfo.prototype.registerValue = function(value)
{
	if (this.m_minValue > value)
	{
		this.m_minValue = value;
	}
	if (this.m_maxValue < value)
	{
		this.m_maxValue = value;
	}
};

oFF.VisualizationInternalModule = function() {};
oFF.VisualizationInternalModule.prototype = new oFF.DfModule();
oFF.VisualizationInternalModule.prototype._ff_c = "VisualizationInternalModule";

oFF.VisualizationInternalModule.s_module = null;
oFF.VisualizationInternalModule.getInstance = function()
{
	if (oFF.isNull(oFF.VisualizationInternalModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.VisualizationAbstractModule.getInstance());
		oFF.VisualizationInternalModule.s_module = oFF.DfModule.startExt(new oFF.VisualizationInternalModule());
		oFF.DfModule.stopExt(oFF.VisualizationInternalModule.s_module);
	}
	return oFF.VisualizationInternalModule.s_module;
};
oFF.VisualizationInternalModule.prototype.getName = function()
{
	return "ff2610.visualization.internal";
};

oFF.VisualizationInternalModule.getInstance();

return oFF;
} );