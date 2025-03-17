/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase, formatter) {
		"use strict";

		var BlockBlue = BlockBase.extend("sap.ui.documentation.sdk.blocks.IndexEntry", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "sap.ui.documentation.sdk.blocks.IndexEntry",
						type: "XML"
					},
					Expanded: {
						viewName: "sap.ui.documentation.sdk.blocks.IndexEntry",
						type: "XML"
					}
				}
			}
		});

		return BlockBlue;

	});
