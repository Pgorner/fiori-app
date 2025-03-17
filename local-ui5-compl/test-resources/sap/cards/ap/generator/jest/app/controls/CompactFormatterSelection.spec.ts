/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import deepClone from "sap/base/util/deepClone";
import CompactFormatterSelection from "sap/cards/ap/generator/app/controls/CompactFormatterSelection";
import type { FormatterConfigurationMap } from "sap/cards/ap/generator/helpers/Formatter";
import CheckBox from "sap/m/CheckBox";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Event from "sap/ui/base/Event";
import RenderManager from "sap/ui/core/RenderManager";
import JSONModel from "sap/ui/model/json/JSONModel";

declare namespace sap {
	export namespace jest {
		function resolvePath(path: string): string;
	}
}

jest.mock(sap.jest.resolvePath("sap/cards/ap/generator/config/FormatterOptions"), () => {
	return {
		getFormatterConfiguration: jest.fn().mockReturnValue([
			{
				formatterName: "format.date",
				displayName: "Format Date",
				parameters: [
					{
						name: "options",
						displayName: "Options",
						type: "object",
						defaultValue: "",
						properties: [{ name: "UTC", displayName: "UTC", type: "boolean", defaultValue: false }]
					}
				],
				type: "Date",
				visible: true
			},
			{
				formatterName: "format.percent",
				displayName: "Format Percent",
				parameters: [],
				type: "numeric",
				visible: true
			},
			{
				formatterName: "extension.formatters.formatWithPercentage",
				displayName: "Format Value with Percentage",
				parameters: [],
				type: "string",
				visible: true
			}
		])
	};
});

describe("CompactFormatterSelection", () => {
	let compactFormatterSelection: CompactFormatterSelection;
	const formattersMap: FormatterConfigurationMap = [
		{
			property: "created_at",
			formatterName: "format.dateTime",
			displayName: "Date/Time",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "relative",
							displayName: "Relative",
							type: "boolean",
							defaultValue: false
						},
						{
							name: "UTC",
							displayName: "UTC",
							type: "boolean",
							defaultValue: false,
							selected: true
						}
					]
				}
			],
			type: "Date",
			visible: true
		},
		{
			property: "changed_at",
			formatterName: "format.dateTime",
			displayName: "Date/Time",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "relative",
							displayName: "Relative",
							type: "boolean",
							defaultValue: false
						},
						{
							name: "UTC",
							displayName: "UTC",
							type: "boolean",
							defaultValue: false,
							selected: true
						}
					]
				}
			],
			type: "Date",
			visible: true
		},
		{
			property: "gross_amount",
			formatterName: "format.unit",
			displayName: "",
			parameters: [
				{
					name: "type",
					displayName: "",
					type: "string",
					defaultValue: "",
					value: "${currency_code}"
				},
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "decimals",
							displayName: "Decimals",
							type: "number",
							defaultValue: 2,
							value: 1
						},
						{
							name: "style",
							displayName: "Style",
							type: "enum",
							defaultSelectedKey: "short",
							options: [
								{ value: "short", name: "Short" },
								{ value: "long", name: "Long" }
							],
							selectedKey: "long"
						}
					]
				}
			],
			type: "numeric",
			visible: false
		}
	];
	beforeEach(() => {
		const settings = {
			type: "COMPACT",
			formatters: {
				formatterName: "format.date",
				displayName: "Format Date",
				parameters: [
					{
						name: "options",
						displayName: "Options",
						type: "object",
						defaultValue: "",
						properties: [{ name: "UTC", displayName: "UTC", type: "boolean", defaultValue: false }]
					}
				],
				type: "Date",
				visible: true
			}
		};
		compactFormatterSelection = new CompactFormatterSelection(settings);
		compactFormatterSelection.getModel = jest.fn().mockReturnValue({
			getObject: jest.fn((path) => {
				if (path === "FORMATTER_CONTROL_APPLY") {
					return "Apply Formatter";
				}
			}),
			getProperty: jest.fn((path) => {
				if (path === "/configuration/advancedFormattingOptions/targetFormatterProperty") {
					return "created_at";
				} else if (path === "/configuration/advancedFormattingOptions/propertyValueFormatters") {
					return formattersMap[0];
				}
			}),
			setProperty: jest.fn(),
			getData: jest.fn().mockReturnValue({
				configuration: {
					properties: [{ name: "created_at", type: "Edm.DateTimeOffset" }]
				}
			})
		});
		compactFormatterSelection.getFormatters = jest.fn().mockReturnValue([
			{
				property: "created_at",
				formatterName: "format.dateTime",
				displayName: "Date/Time",
				parameters: [
					{
						name: "options",
						displayName: "Options",
						type: "object",
						defaultValue: "",
						properties: [
							{
								name: "relative",
								displayName: "Relative",
								type: "boolean",
								defaultValue: false
							},
							{
								name: "UTC",
								displayName: "UTC",
								type: "boolean",
								defaultValue: false,
								selected: true
							}
						]
					}
				],
				type: "Date",
				visible: true
			}
		]);
		compactFormatterSelection.fireEvent = jest.fn();
		compactFormatterSelection.setAggregation = jest.fn();
		compactFormatterSelection.setProperty = jest.fn();
		compactFormatterSelection.setFormatters(formattersMap);
	});

	afterEach(() => {
		jest.clearAllMocks();
		compactFormatterSelection.destroy();
	});

	test("renderer renders controls correctly", () => {
		const control = {
			getType: jest.fn().mockReturnValue("COMPACT"),
			_deleteButton: { setVisible: jest.fn() },
			_applyButton: { setVisible: jest.fn() }
		};
		const rm: RenderManager = {
			openStart: jest.fn(),
			openEnd: jest.fn(),
			renderControl: jest.fn(),
			close: jest.fn()
		};
		compactFormatterSelection.renderer.render(rm, control);

		expect(control.getType).toHaveBeenCalled();
		expect(rm.openStart).toHaveBeenCalledWith("div", control);
		expect(rm.openEnd).toHaveBeenCalled();
		expect(rm.renderControl).toHaveBeenCalledWith(control._selectorControl);
		expect(rm.renderControl).toHaveBeenCalledWith(control._deleteButton);
		expect(rm.renderControl).toHaveBeenCalledWith(control._List);
		expect(rm.renderControl).toHaveBeenCalledWith(control._applyButton);
		expect(rm.close).toHaveBeenCalledWith("div");
		// Verify that _deleteButton.setVisible and _applyButton.setVisible are called with false when control type is 'COMPACT'
		expect(control._deleteButton.setVisible).toHaveBeenCalledWith(false);
		expect(control._applyButton.setVisible).toHaveBeenCalledWith(false);
	});

	test("setFormatters() sets formatters property and updates controls accordingly", () => {
		compactFormatterSelection.setFormatters(formattersMap);
		expect(compactFormatterSelection.setAggregation).toHaveBeenCalledWith("_list", compactFormatterSelection._List);
		expect(compactFormatterSelection.setProperty).toHaveBeenCalledWith("formatters", formattersMap, true);
	});

	test("setFormatters() check if the refreshControl is called with float formatter when selected formatter is - format.unit & second parameter is having value for decimal property", () => {
		compactFormatterSelection.getModel = jest.fn().mockReturnValue({
			getObject: jest.fn((path) => {
				if (path === "FORMATTER_CONTROL_APPLY") {
					return "Apply Formatter";
				} else if (path === "FORMAT_FLOAT") {
					return "Float";
				}
			}),
			getProperty: jest.fn((path) => {
				if (path === "/configuration/advancedFormattingOptions/targetFormatterProperty") {
					return "gross_amount";
				}
			}),
			setProperty: jest.fn(),
			getData: jest.fn().mockReturnValue({
				configuration: {
					properties: [{ name: "gross_amount", type: "Edm.Decimal" }]
				}
			})
		});
		compactFormatterSelection._refreshControl = jest.fn();
		compactFormatterSelection.setFormatters(formattersMap);
		const expectedUpdatedFormatter = {
			formatterName: "format.float",
			displayName: "Float",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [
						{
							name: "decimals",
							displayName: "Decimals",
							type: "number",
							defaultValue: 2,
							value: 1
						},
						{
							name: "style",
							displayName: "Style",
							type: "enum",
							defaultSelectedKey: "short",
							options: [
								{
									value: "short",
									name: "Short"
								},
								{
									value: "long",
									name: "Long"
								}
							],
							selectedKey: "long"
						}
					]
				}
			],
			property: "gross_amount",
			type: "numeric",
			visible: false
		};
		expect(compactFormatterSelection._refreshControl).toHaveBeenCalledWith(expectedUpdatedFormatter);
	});

	test("setFormatters() check if the refreshControl is called with empty object when selected formatter is - format.unit & second parameter is not having value for decimal property", () => {
		const formattersMap: FormatterConfigurationMap = [
			{
				property: "gross_amount",
				formatterName: "format.unit",
				displayName: "",
				parameters: [
					{
						name: "type",
						displayName: "",
						type: "string",
						defaultValue: "",
						value: "${currency_code}"
					},
					{
						name: "options",
						displayName: "Options",
						type: "object",
						defaultValue: "",
						properties: [
							{
								name: "decimals",
								displayName: "Decimals",
								type: "number",
								defaultValue: 2
							},
							{
								name: "style",
								displayName: "Style",
								type: "enum",
								defaultSelectedKey: "short",
								options: [
									{ value: "short", name: "Short" },
									{ value: "long", name: "Long" }
								]
							}
						]
					}
				],
				type: "numeric",
				visible: false
			}
		];
		compactFormatterSelection.getModel = jest.fn().mockReturnValue({
			getObject: jest.fn((path) => {
				if (path === "FORMATTER_CONTROL_APPLY") {
					return "Apply Formatter";
				} else if (path === "FORMAT_FLOAT") {
					return "Float";
				}
			}),
			getProperty: jest.fn((path) => {
				if (path === "/configuration/advancedFormattingOptions/targetFormatterProperty") {
					return "gross_amount";
				}
			}),
			setProperty: jest.fn(),
			getData: jest.fn().mockReturnValue({
				configuration: {
					properties: [{ name: "gross_amount", type: "Edm.Decimal" }]
				}
			})
		});
		compactFormatterSelection._refreshControl = jest.fn();
		compactFormatterSelection.setFormatters(formattersMap);
		expect(compactFormatterSelection._refreshControl).toHaveBeenCalledWith({});
	});

	test("createControl sets up controls correctly", () => {
		let type = "Edm.Date";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
		type = "Edm.DateTimeOffset";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
		type = "Edm.TimeOfDay";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
		type = "Edm.DateTime";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
		type = "Edm.Decimal";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
		type = "Edm.String";
		compactFormatterSelection.createControl(type);
		expect((compactFormatterSelection._selectorControl.getModel() as JSONModel).getData()["formattersList"]).toMatchSnapshot();
	});

	test("_createParametersControl: returns Text control for string propertytype", () => {
		const property = { type: "string" };
		const context = { getProperty: jest.fn().mockReturnValue(property) };
		const control = compactFormatterSelection._createParametersControl("id", context);
		const aggregationItems = control.getAggregation("items");
		if (Array.isArray(aggregationItems)) {
			expect(aggregationItems[1] instanceof Input).toBeTruthy();
		}
	});

	test("_createParametersControl: returns CheckBox control for boolean propertytype", () => {
		const property = { type: "boolean" };
		const context = { getProperty: jest.fn().mockReturnValue(property) };
		const control = compactFormatterSelection._createParametersControl("id", context);
		const aggregationItems = control.getAggregation("items");
		if (Array.isArray(aggregationItems)) {
			expect(aggregationItems[1] instanceof CheckBox).toBeTruthy();
		}
	});

	test("_createParametersControl: returns Select control for enum propertytype", () => {
		const property = {
			type: "enum",
			options: [
				{ name: "Short", value: "short" },
				{ name: "Long", value: "long" }
			]
		};
		const context = { getProperty: jest.fn().mockReturnValue(property) };
		const control = compactFormatterSelection._createParametersControl("id", context);
		const aggregationItems = control.getAggregation("items");
		if (Array.isArray(aggregationItems)) {
			expect(aggregationItems[1] instanceof Select).toBeTruthy();
		}
	});

	test("_createParametersControl: returns Input, Checkbox, Input, Select control for object propertytype with properties of type string, boolean, number, enum", () => {
		const property = {
			type: "object",
			properties: [
				{
					name: "sImprovementDirection",
					displayName: "Improvement Direction",
					type: "string"
				},
				{
					name: "bIsDeviationLowBinding",
					displayName: "Deviation Low Binding",
					type: "boolean"
				},
				{
					name: "deviationLow",
					displayName: "Low Deviation",
					type: "number",
					defaultValue: 0
				},
				{
					name: "style",
					displayName: "Style",
					type: "enum",
					defaultSelectedKey: "short",
					selectedKey: "short",
					options: [
						{ value: "short", name: "Short" },
						{ value: "long", name: "Long" }
					]
				}
			]
		};
		const context = { getProperty: jest.fn().mockReturnValue(property) };
		const control = compactFormatterSelection._createParametersControl("id", context);
		const aggregationItems = control.getAggregation("items");
		if (Array.isArray(aggregationItems)) {
			const input_1 = aggregationItems[0].getAggregation("items");
			const input_2 = aggregationItems[1].getAggregation("items");
			const input_3 = aggregationItems[2].getAggregation("items");
			const input_4 = aggregationItems[3].getAggregation("items");
			if (Array.isArray(input_1) && Array.isArray(input_2) && Array.isArray(input_3) && Array.isArray(input_4)) {
				expect(input_1[1] instanceof Input).toBeTruthy();
				expect(input_2[1] instanceof CheckBox).toBeTruthy();
				expect(input_3[1] instanceof StepInput).toBeTruthy();
				expect(input_4[1] instanceof Select).toBeTruthy();
			}
		}
	});

	test("onFormatterSelected: updates control with selected formatter configuration", () => {
		const eventMock: Event = { getSource: jest.fn().mockReturnValue({ getSelectedKey: jest.fn().mockReturnValue("format.date") }) };
		const mockGetFormatterConfiguration = {
			formatterName: "format.date",
			displayName: "Format Date",
			parameters: [
				{
					name: "options",
					displayName: "Options",
					type: "object",
					defaultValue: "",
					properties: [{ name: "UTC", displayName: "UTC", type: "boolean", defaultValue: false }]
				}
			],
			type: "Date",
			visible: true
		};
		compactFormatterSelection._refreshControl = jest.fn();
		compactFormatterSelection.onFormatterSelected(eventMock);
		const targetProperty = (compactFormatterSelection.getModel() as JSONModel).getProperty(
			"/configuration/advancedFormattingOptions/targetFormatterProperty"
		);
		const formatter = Object.assign({ property: targetProperty }, deepClone(mockGetFormatterConfiguration));
		expect(compactFormatterSelection._refreshControl).toHaveBeenCalledWith(formatter);
	});

	test("onFormatterSelected: disable apply formatter button for invalid entry", () => {
		const model = compactFormatterSelection.getModel() as JSONModel;
		const eventMock: Event = { getSource: jest.fn().mockReturnValue({ getSelectedKey: jest.fn().mockReturnValue("") }) };
		compactFormatterSelection.onFormatterSelected(eventMock);
		expect(model.setProperty).toHaveBeenCalledWith("/configuration/advancedFormattingOptions/isFormatterApplied", false);
	});

	test("applyFormatter: should update data and fire change event", () => {
		compactFormatterSelection.applyFormatter();
		const propertyValueFormatters = (compactFormatterSelection.getModel() as JSONModel).getProperty(
			"/configuration/advancedFormattingOptions/propertyValueFormatters"
		);
		expect(compactFormatterSelection.fireEvent).toHaveBeenCalledWith("change", { value: propertyValueFormatters });
	});

	test("deleteFormatter: should delete the formatter applied and clear selected formatter from the dropdown", () => {
		compactFormatterSelection.deleteFormatter();
		expect(compactFormatterSelection.fireEvent).toHaveBeenCalledWith("change", { value: [] });
	});
});
