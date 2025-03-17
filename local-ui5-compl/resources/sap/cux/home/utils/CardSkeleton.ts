/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export const CardSkeleton = {
	_version: "1.14.0",
	"sap.app": {
		id: "card.explorer.data.list.card",
		type: "card",
		title: "Sample for Data usage in Cards",
		subTitle: "Sample for Data usage in Cards",
		applicationVersion: {
			version: "1.0.0"
		},
		shortTitle: "A short title for this Card",
		info: "Additional information about this Card",
		description: "A long description for this Card",
		tags: {
			keywords: ["Data", "Card", "Sample"]
		}
	},
	"sap.card": {
		extension: "./sap/bc/ui5_ui5/sap/product_homes1/dataDump/CardExtension",
		type: "List",
		header: {
			title: "Products",
			subTitle: "In Stock Information"
		},
		content: {
			data: {
				request: {
					url: "",
					method: "GET",
					parameters: {
						$format: "json"
					}
				},
				path: "/d/results"
			},
			item: {
				title: "{ProductName}",
				description: "{UnitsInStock} units in stock",
				attributesLayoutType: "OneColumn",
				attributes: [
					{
						value: "{Processor}"
					}
				]
			},
			maxItems: 5
		}
	}
};
