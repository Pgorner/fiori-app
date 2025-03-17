/*
 * ! OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"../utils/Util"
], function(Util) {
	"use strict";

	return {
		iLookAtTheScreen: function() {
			return this;
		},
		iFocusCell: function(iRow, iCol) {
			Util.waitForTable.call(this, {
				success: function(oTable) {
					var oCell = Util.getCell(oTable, iRow, iCol);
					oCell.focus();
				}
			});
		},
		iFocusRow: function(iRow) {
			Util.waitForTable.call(this, {
				success: function(oTable) {
					var oRow = Util.getRow(oTable, iRow);
					oRow.focus();
				}
			});
		}
	};
});