/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/core"], function (core) {
  "use strict";

  class ResultSetParser {
    resultSet;
    constructor(options) {
      this.resultSet = options.resultSet;
    }
    parseNamedValue(namedValue) {
      let value;
      let name;
      let complexValue;
      for (const prop in namedValue) {
        switch (prop) {
          case "Name":
            name = namedValue[prop];
            break;
          case "Value":
            value = namedValue[prop];
            break;
          default:
            if (!complexValue) {
              complexValue = {};
            }
            complexValue[prop] = namedValue[prop];
        }
      }
      if (complexValue) {
        complexValue.Value = value;
        return {
          name: name,
          value: complexValue
        };
      }
      return {
        name: name,
        value: value
      };
    }
    formatItem(item) {
      let list;
      if (item.NamedValues) {
        list = item.NamedValues;
      }
      if (!list) {
        return item;
      }
      const obj = {};
      for (let i = 0; i < list.length; ++i) {
        const namedValue = list[i];
        const parsedNamedValue = this.parseNamedValue(namedValue);
        obj[parsedNamedValue.name] = this.formatItem(parsedNamedValue.value);
      }
      return obj;
    }
    formatItems(items) {
      const result = {};
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const formattedItem = this.formatItem(item);
        core.extend(result, formattedItem);
      }
      return result;
    }
    parse() {
      // check for data
      if (!this.resultSet.Grids || !this.resultSet.Grids[0] || !this.resultSet.Grids[0].Axes) {
        return {
          cells: [],
          axes: []
        };
      }

      // enhance result set:
      // -> create link to item lists in dimensions of axes
      this.enhance(this.resultSet);

      // get reference to grid,row axis,col axis
      const grid = this.resultSet.Grids[0];

      // parse
      if (grid.Cells.length > 0) {
        return this.parseWithCells(grid);
      }
      return this.parseWithoutCells(grid);
    }
    parseWithCells(grid) {
      const result = {
        axes: [],
        cells: []
      };
      for (let i = 0; i < grid.Cells.length; i++) {
        const cell = grid.Cells[i];
        const items = [];
        for (let j = 0; j < cell.Index.length; j++) {
          const index = cell.Index[j];
          const axis = grid.Axes[j];
          const axisItems = this.resolve(axis, index);
          items.push(...axisItems);
        }
        const measureValue = core.extend({}, cell);
        delete measureValue.Index;
        items.push(measureValue);
        result.cells.push(this.formatItems(items));
      }
      return result;
    }
    parseWithoutCells(grid) {
      const result = {
        axes: [],
        cells: []
      };
      for (let i = 0; i < grid.Axes.length; ++i) {
        const axis = grid.Axes[i];
        const axisElements = [];
        result.axes.push(axisElements);
        for (let j = 0; j < axis.Tuples.length; ++j) {
          const items = this.resolve(axis, j);
          axisElements.push(this.formatItems(items));
        }
      }
      return result;
    }
    resolve(axis, index) {
      const items = [];
      if (axis.Tuples.length === 0) {
        return items;
      }
      const tuples = axis.Tuples[index];
      for (let i = 0; i < tuples.length; ++i) {
        const itemIndex = tuples[i];
        const item = axis.Dimensions[i].ItemList.Items[itemIndex];
        items.push(item);
      }
      return items;
    }
    enhance(resultSet) {
      // create dictionary with item lists
      const itemListByName = {};
      for (let i = 0; i < resultSet.ItemLists.length; ++i) {
        const itemList = resultSet.ItemLists[i];
        itemListByName[itemList.Name] = itemList;
      }

      // loop at all dimensions and set link to item list
      for (let h = 0; h < resultSet.Grids.length; ++h) {
        const grid = resultSet.Grids[h];
        for (let j = 0; j < grid.Axes.length; ++j) {
          const axis = grid.Axes[j];
          for (let k = 0; k < axis.Dimensions.length; ++k) {
            const dimension = axis.Dimensions[k];
            dimension.ItemList = itemListByName[dimension.ItemListName];
          }
        }
      }
    }
  }
  function parse(resultSet) {
    const parser = new ResultSetParser({
      resultSet: resultSet
    });
    return parser.parse();
  }
  var __exports = {
    __esModule: true
  };
  __exports.ResultSetParser = ResultSetParser;
  __exports.parse = parse;
  return __exports;
});
})();