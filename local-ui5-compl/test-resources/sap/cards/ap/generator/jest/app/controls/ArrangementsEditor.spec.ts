/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import ArrangementsEditor, { ArrangementOptions } from "sap/cards/ap/generator/app/controls/ArrangementsEditor";
import { TEXTARRANGEMENT_OPTIONS } from "sap/cards/ap/generator/config/TextArrangementOptions";
import type { PropertyInfo } from "sap/cards/ap/generator/odata/ODataTypes";
import Button from "sap/m/Button";
import ComboBox from "sap/m/ComboBox";
import CustomListItem from "sap/m/CustomListItem";
import List from "sap/m/List";
import Text from "sap/m/Text";
import Event from "sap/ui/base/Event";
import CoreElement from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import JSONModel from "sap/ui/model/json/JSONModel";
// load required calendar in advance
import "sap/ui/core/date/Gregorian";

describe("ArrangementsEditor", () => {
	let arrangementsEditor: ArrangementsEditor;
	const settings = {
		mode: "text",
		selectionKeys: {
			path: "/configuration/properties",
			parameters: {
				name: "name",
				label: "labelWithValue"
			}
		},
		items: {
			path: "/configuration/advancedFormattingOptions/textArrangements",
			parameters: {
				name: "name",
				value: "text"
			}
		}
	};
	beforeAll(() => {
		arrangementsEditor = new ArrangementsEditor(settings);
		arrangementsEditor.fireEvent = jest.fn();
		arrangementsEditor.getSelectionKeys = jest.fn(() => [
			{
				label: "Gross Amount",
				type: "Edm.Decimal",
				name: "gross_amount",
				UOM: "currency_code",
				isDate: false,
				value: "5631.08",
				labelWithValue: "Gross Amount (5631.08)"
			},
			{
				label: "Net Amount",
				type: "Edm.Decimal",
				name: "net_amount",
				UOM: "currency_code",
				isDate: false,
				value: "4732.00",
				labelWithValue: "Net Amount (4732.00)"
			}
		]);
		arrangementsEditor._setSelectionKeysMap = {
			name: "gross_amount",
			label: "Gross Amount",
			textArrangement: "TextFirst"
		} as PropertyInfo;

		arrangementsEditor.getBindingPath = jest.fn((path) => {
			if (path === "items") {
				return "/configuration/advancedFormattingOptions/textArrangements";
			} else if (path === "selectionKeys") {
				return "/configuration/properties";
			}
		});
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn((path) => {
				if (path === arrangementsEditor.getBindingPath("items")) {
					return [
						{
							arrangementKey: "gross_amount",
							value: "gross_amount",
							propKey: "net_amount",
							name: "net_amount",
							arrangementType: "TextFirst",
							textArrangement: "TextFirst"
						},
						{
							arrangementKey: "gross_amount",
							value: "gross_amount",
							propKey: "tax_amount",
							name: "tax_amount",
							arrangementType: "TextFirst",
							textArrangement: "TextFirst"
						},
						{}
					];
				}
			}),
			refresh: jest.fn()
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("init: initializes _list aggregation correctly", () => {
		arrangementsEditor.init();
		expect(arrangementsEditor._list).toBeInstanceOf(List);
		expect(arrangementsEditor._propertyComboBox).toBeInstanceOf(ComboBox);
		expect(arrangementsEditor._separatorColon).toBeInstanceOf(Text);
		expect(arrangementsEditor._uomComboBox).toBeInstanceOf(ComboBox);
		expect(arrangementsEditor._separatorColonText).toBeInstanceOf(Text);
		expect(arrangementsEditor._textArrangementComboBox).toBeInstanceOf(ComboBox);
		expect(arrangementsEditor._deleteButton).toBeInstanceOf(Button);
		expect(arrangementsEditor._addButton).toBeInstanceOf(Button);
	});

	test("init: should initialize _propertyComboBox,_idNavigationComboBox, _uomComboBox, _descriptionNavigationComboBox, _textArrangementComboBox and bind change event", () => {
		const selectedItem = undefined;
		const textArrangementChanged = true;
		arrangementsEditor.init();
		expect(arrangementsEditor._propertyComboBox).toBeDefined();
		expect(arrangementsEditor._propertyComboBox instanceof ComboBox).toBeTruthy();
		arrangementsEditor._propertyComboBox.fireChange();
		expect(arrangementsEditor.fireEvent).toHaveBeenCalledWith("change", {
			value: arrangementsEditor.getItems(),
			selectedItem,
			textArrangementChanged
		});

		expect(arrangementsEditor._idNavigationComboBox).toBeDefined();
		expect(arrangementsEditor._idNavigationComboBox instanceof ComboBox).toBeTruthy();
		arrangementsEditor._idNavigationComboBox.fireChange();
		expect(arrangementsEditor.fireEvent).toHaveBeenCalledWith("change", {
			value: arrangementsEditor.getItems()
		});

		expect(arrangementsEditor._uomComboBox).toBeDefined();
		expect(arrangementsEditor._uomComboBox instanceof ComboBox).toBeTruthy();
		arrangementsEditor._uomComboBox.fireChange();
		expect(arrangementsEditor.fireEvent).toHaveBeenCalledWith("change", {
			value: arrangementsEditor.getItems()
		});

		expect(arrangementsEditor._descriptionNavigationComboBox).toBeDefined();
		expect(arrangementsEditor._descriptionNavigationComboBox instanceof ComboBox).toBeTruthy();
		arrangementsEditor._descriptionNavigationComboBox.fireChange();
		expect(arrangementsEditor.fireEvent).toHaveBeenCalledWith("change", {
			value: arrangementsEditor.getItems()
		});

		expect(arrangementsEditor._textArrangementComboBox).toBeDefined();
		expect(arrangementsEditor._textArrangementComboBox instanceof ComboBox).toBeTruthy();
		arrangementsEditor._textArrangementComboBox.fireChange();
		expect(arrangementsEditor.fireEvent).toHaveBeenCalledWith("change", {
			type: "text",
			value: arrangementsEditor.getItems()
		});
	});

	test("init: should initialize _textArrangementComboBox and bind selectionChange event", () => {
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn().mockReturnValue({
				textArrangement: "",
				propertyKeyForId: "net_amount",
				propertyKeyForDescription: "bp_id"
			}),
			refresh: jest.fn(),
			getObject: jest.fn((path) => {
				if (path === "SAME_SELECTION") {
					return "Please select a different value!";
				}
			})
		});
		arrangementsEditor.getItems = jest.fn().mockReturnValue([
			{
				name: ""
			}
		]);
		arrangementsEditor._propertyComboBox.fireSelectionChange();
		arrangementsEditor._textArrangementComboBox.fireSelectionChange();
		arrangementsEditor._uomComboBox.fireSelectionChange();
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		arrangementsEditor.getItems = jest.fn().mockReturnValue([
			{
				propKey: "net_amount",
				name: "net_amount"
			}
		]);
		arrangementsEditor._propertyComboBox.fireSelectionChange();
		expect(arrangementsEditor.errorFlag).toBeFalsy();
	});
	test("init: should initialize _idNavigationComboBox and bind selectionChange event", () => {
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn((path) => {
				if (path === "/configuration/navigationProperty") {
					return [{}];
				} else {
					return {
						name: "",
						value: "",
						propertyKeyForDescription: "net_amount",
						propertyKeyForId: "to_Currency",
						textArrangement: "TextOnly",
						navigationKeyForId: "Currency_Code_Text",
						navigationKeyForDescription: ""
					};
				}
			}),
			refresh: jest.fn(),
			getObject: jest.fn((path) => {
				if (path === "SAME_SELECTION") {
					return "Please select a different value!";
				}
			})
		});

		arrangementsEditor._idNavigationComboBox.fireSelectionChange();
		expect(arrangementsEditor.errorFlag).toBeFalsy();
	});
	test("init: should initialize _descriptionNavigationComboBox and bind selectionChange event", () => {
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn((path) => {
				if (path === "/configuration/navigationProperty") {
					return [{}];
				} else {
					return {
						name: "",
						value: "",
						propertyKeyForDescription: "to_DeliveryStatus",
						propertyKeyForId: "to_Currency",
						textArrangement: "TextOnly",
						navigationKeyForId: "Currency_Code_Text",
						navigationKeyForDescription: "Status"
					};
				}
			}),
			refresh: jest.fn(),
			getObject: jest.fn((path) => {
				if (path === "SAME_SELECTION") {
					return "Please select a different value!";
				}
			})
		});

		arrangementsEditor._descriptionNavigationComboBox.fireSelectionChange();
		expect(arrangementsEditor.errorFlag).toBeFalsy();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID false, and no navigation properties", () => {
		// Mock the ArrangementsEditor instance
		const setValueStateMock = jest.fn();
		const arrangementsEditor = {
			getModel: jest.fn().mockReturnValue({
				getProperty: jest.fn((path) => {
					if (path === "/configuration/navigationProperty") {
						return [{}];
					} else {
						return {
							name: "",
							value: "",
							propertyKeyForDescription: "overall_status",
							propertyKeyForId: "so_id",
							textArrangement: "TextOnly",
							navigationKeyForId: "",
							navigationKeyForDescription: ""
						};
					}
				}),
				refresh: jest.fn()
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};
		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, false, false);
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		expect(group).toMatchSnapshot();
	});
	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID false,navigationKeyForId is present, and no navigation properties", () => {
		// Mock the ArrangementsEditor instance
		const setValueStateMock = jest.fn();
		const arrangementsEditor = {
			getModel: jest.fn().mockReturnValue({
				getProperty: jest.fn((path) => {
					if (path === "/configuration/navigationProperty") {
						return [{}];
					} else {
						return {
							name: "",
							value: "",
							propertyKeyForDescription: "to_DeliveryStatus",
							propertyKeyForId: "so_id",
							textArrangement: "TextOnly",
							navigationKeyForId: "Status",
							navigationKeyForDescription: ""
						};
					}
				}),
				refresh: jest.fn()
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};
		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, false, false);
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation true, isTextArrangementID false, and navigation properties present for both Id and Description", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "to_DeliveryStatus",
					propertyKeyForId: "to_Currency",
					textArrangement: "TextOnly",
					navigationKeyForId: "Currency_Code_Text",
					navigationKeyForDescription: "Status"
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, false);
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation true, isTextArrangementID false, and navigation properties present for only Id", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "approval_status",
					propertyKeyForId: "to_Currency",
					textArrangement: "TextOnly",
					navigationKeyForId: "Currency_Code_Text",
					navigationKeyForDescription: ""
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, false);
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation true, isTextArrangementID false, and navigation properties present for only Description", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "to_Currency",
					propertyKeyForId: "approval_status",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: "Currency_Code_Text"
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, false);
		expect(arrangementsEditor.errorFlag).toBeFalsy();
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID true, navigationKeyForDescription is not present, and navigation property present", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [
					{
						name: "to_Currency",
						properties: [
							{ label: "Currency Code", type: "Edm.String", name: "Currency_Code" },
							{ label: "Long Text", type: "Edm.String", name: "Currency_Code_Text" },
							{ label: "Decimal Places", type: "Edm.Byte", name: "Decimals" }
						]
					},
					{
						name: "to_DeliveryStatus",
						properties: [
							{ label: "Lower Value", type: "Edm.String", name: "Status" },
							{ label: "Delivery Status", type: "Edm.String", name: "Status_Text" }
						]
					}
				];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "so_id",
					propertyKeyForId: "to_DeliveryStatus",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: ""
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		expect(group).toMatchSnapshot();
	});
	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID true, navigationKeyForDescription is not present, and navigation property is not present", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [
					{
						name: "to_Currency",
						properties: [
							{ label: "Currency Code", type: "Edm.String", name: "Currency_Code" },
							{ label: "Long Text", type: "Edm.String", name: "Currency_Code_Text" },
							{ label: "Decimal Places", type: "Edm.Byte", name: "Decimals" }
						]
					},
					{
						name: "to_DeliveryStatus",
						properties: [
							{ label: "Lower Value", type: "Edm.String", name: "Status" },
							{ label: "Delivery Status", type: "Edm.String", name: "Status_Text" }
						]
					}
				];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "so_id",
					propertyKeyForId: "approval_status",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: ""
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID true, navigationKeyForDescription is present, and navigation property present", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [
					{
						name: "to_Currency",
						properties: [
							{ label: "Currency Code", type: "Edm.String", name: "Currency_Code" },
							{ label: "Long Text", type: "Edm.String", name: "Currency_Code_Text" },
							{ label: "Decimal Places", type: "Edm.Byte", name: "Decimals" }
						]
					},
					{
						name: "to_DeliveryStatus",
						properties: [
							{ label: "Lower Value", type: "Edm.String", name: "Status" },
							{ label: "Delivery Status", type: "Edm.String", name: "Status_Text" }
						]
					}
				];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "to_Currency",
					propertyKeyForId: "to_DeliveryStatus",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: "Decimals"
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		expect(group).toMatchSnapshot();
	});

	test("handleComboBoxEvents: updates group name and value correctly with isNavigation false, isTextArrangementID true, navigationKeyForDescription is present, and navigation property is not present", () => {
		// Mock implementations
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [
					{
						name: "to_Currency",
						properties: [
							{ label: "Currency Code", type: "Edm.String", name: "Currency_Code" },
							{ label: "Long Text", type: "Edm.String", name: "Currency_Code_Text" },
							{ label: "Decimal Places", type: "Edm.Byte", name: "Decimals" }
						]
					},
					{
						name: "to_DeliveryStatus",
						properties: [
							{ label: "Lower Value", type: "Edm.String", name: "Status" },
							{ label: "Delivery Status", type: "Edm.String", name: "Status_Text" }
						]
					}
				];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "to_Currency",
					propertyKeyForId: "approval_status",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: "Decimals"
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock,
			setValueStateText: jest.fn()
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		const group = instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		expect(group).toMatchSnapshot();
	});

	test("sets control state to warning when isValidation is true", () => {
		// Mock event and dependencies
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "approval_status",
					propertyKeyForId: "approval_status",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: ""
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock,
			setValueStateText: jest.fn()
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		// Assertions
		expect(control.setValueState).toHaveBeenCalledWith(ValueState.Warning);
		expect(arrangementsEditor.errorFlag).toBeTruthy();
	});
	test("sets control state to error when selectedKey is empty and value is set", () => {
		// Mock event and dependencies
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "approval_status",
					propertyKeyForId: "approval_status",
					textArrangement: "TextOnly",
					navigationKeyForId: "",
					navigationKeyForDescription: ""
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue(""),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock,
			setValueStateText: jest.fn()
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		// Assertions
		expect(control.setValueState).toHaveBeenCalledWith(ValueState.Error);
		expect(arrangementsEditor.errorFlag).toBeTruthy();
	});

	test("sets control state to warning when isValidation is true for navigational property", () => {
		// Mock event and dependencies
		const setValueStateMock = jest.fn();
		const refreshMock = jest.fn();
		const getPropertyMock = jest.fn((path) => {
			if (path === "/configuration/navigationProperty") {
				return [
					{
						name: "to_DeliveryStatus",
						properties: [
							{ label: "Lower Value", type: "Edm.String", name: "Status" },
							{ label: "Delivery Status", type: "Edm.String", name: "Status_Text" }
						]
					}
				];
			} else if (path === "") {
				return {
					name: "",
					value: "",
					propertyKeyForDescription: "to_DeliveryStatus",
					propertyKeyForId: "to_DeliveryStatus",
					textArrangement: "TextOnly",
					navigationKeyForId: "Status",
					navigationKeyForDescription: "Status"
				};
			}
		});

		const arrangementsEditor = {
			getModel: jest.fn().mockImplementation((modelName) => {
				if (modelName === "i18n") {
					return {
						getObject: jest.fn().mockImplementation((key) => {
							if (key === "INVALID_SELECTION") return "Invalid selection.";
							if (key === "SAME_SELECTION") return "Selection is the same.";
							return "";
						})
					};
				}
				return {
					getProperty: getPropertyMock,
					refresh: refreshMock
				};
			}),
			_propertyComboBox: {
				fireSelectionChange: jest.fn()
			},
			errorFlag: false
		};

		const event = {
			getParameter: jest.fn().mockReturnValue("someId"),
			getSource: jest.fn().mockReturnValue({
				getBindingContext: jest.fn().mockReturnValue({
					getPath: jest.fn().mockReturnValue("")
				})
			})
		};

		const control = {
			getSelectedKey: jest.fn().mockReturnValue("selectedKey"),
			getValue: jest.fn().mockReturnValue("controlValue"),
			setValueState: setValueStateMock,
			setValueStateText: jest.fn()
		};

		CoreElement.getElementById = jest.fn().mockReturnValue(control);

		const settings = {
			mode: "text",
			selectionKeys: {},
			navigationSelectionKeys: {},
			items: []
		};

		const instance = new ArrangementsEditor(settings);
		instance.handleComboBoxEvents(event, arrangementsEditor, true, true);
		// Assertions
		expect(control.setValueState).toHaveBeenCalledWith(ValueState.Warning);
		expect(arrangementsEditor.errorFlag).toBeTruthy();
	});

	test("onAfterRendering: should update internal model and refresh combo box model after rendering", () => {
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getObject: jest.fn((path) => {
				if (path === "TEXT_FIRST") {
					return "Text First";
				} else if (path === "TEXT_LAST") {
					return "Text Last";
				} else if (path === "TEXT_ONLY") {
					return "Text Only";
				} else if (path === "TEXT_SEPARATE") {
					return "Text Separate";
				}
			})
		});
		arrangementsEditor._textArrangementComboBox = {
			getModel: jest.fn((path) => {
				if (path === "internal") {
					return {
						setData: jest.fn(),
						refresh: jest.fn()
					};
				}
			})
		};
		arrangementsEditor.onAfterRendering();
		const internalModel = arrangementsEditor._textArrangementComboBox.getModel("internal") as JSONModel;
		internalModel.setData(TEXTARRANGEMENT_OPTIONS, true);
		expect(TEXTARRANGEMENT_OPTIONS).toMatchSnapshot();
		expect(arrangementsEditor.getSelectionKeys).toHaveBeenCalled();
	});

	test("setSelectionKeys: setSelectionKeys method", () => {
		arrangementsEditor.setAggregation = jest.fn();
		arrangementsEditor.setProperty = jest.fn();
		arrangementsEditor.getMode = jest.fn().mockReturnValue("uom");
		arrangementsEditor._propertyComboBox = {
			bindAggregation: jest.fn()
		};
		arrangementsEditor._uomComboBox = {
			bindAggregation: jest.fn()
		};
		arrangementsEditor._textArrangementComboBox = {
			setModel: jest.fn(),
			bindAggregation: jest.fn()
		};
		const selectionKeys = [
			{
				label: "Gross Amount",
				type: "Edm.Decimal",
				name: "gross_amount",
				UOM: "currency_code",
				isDate: false,
				value: "5631.08",
				labelWithValue: "Gross Amount (5631.08)"
			}
		];
		arrangementsEditor.getBindingInfo = jest.fn((path) => {
			if (path === "selectionKeys") {
				return {
					parameters: { name: "name", label: "labelWithValue" }
				};
			}
		});
		arrangementsEditor.setSelectionKeys(selectionKeys);
		expect(arrangementsEditor.setAggregation).toHaveBeenCalledWith("_list", arrangementsEditor._list);
		expect(arrangementsEditor.setProperty).toHaveBeenCalledWith("selectionKeys", selectionKeys);
		expect(arrangementsEditor._propertyComboBox.bindAggregation).toHaveBeenCalledWith("items", {
			path: "/configuration/properties",
			length: 500,
			factory: expect.any(Function)
		});
		expect(arrangementsEditor._uomComboBox.bindAggregation).toHaveBeenCalledWith("items", {
			path: "/configuration/properties",
			length: 500,
			factory: expect.any(Function)
		});
		expect(arrangementsEditor._textArrangementComboBox.bindAggregation).toHaveBeenCalledWith("items", {
			path: "internal>/",
			factory: expect.any(Function)
		});
		const [, { factory: Factoryfn1 }] = arrangementsEditor._propertyComboBox.bindAggregation.mock.calls[0];
		const propertyListItem = Factoryfn1();
		let key = propertyListItem.mBindingInfos.key.parts[0].path;
		let text = propertyListItem.mBindingInfos.text.parts[0].path;
		expect(key).toEqual("name");
		expect(text).toEqual("labelWithValue");
		const [, { factory: Factoryfn2 }] = arrangementsEditor._uomComboBox.bindAggregation.mock.calls[0];
		const uomListItem = Factoryfn2();
		key = uomListItem.mBindingInfos.key.parts[0].path;
		text = uomListItem.mBindingInfos.text.parts[0].path;
		expect(key).toEqual("name");
		expect(text).toEqual("labelWithValue");
		const [, { factory: Factoryfn3 }] = arrangementsEditor._textArrangementComboBox.bindAggregation.mock.calls[0];
		const textArngListItem = Factoryfn3();
		key = textArngListItem.mBindingInfos.key.parts[0].path;
		text = textArngListItem.mBindingInfos.text.parts[0].path;
		expect(key).toEqual("name");
		expect(text).toEqual("label");
	});

	test.skip("setItems: sets items property and binds controls properly", () => {
		arrangementsEditor._propertyComboBox = { bindProperty: jest.fn() };
		arrangementsEditor._uomComboBox = { bindProperty: jest.fn() };
		arrangementsEditor._textArrangementComboBox = { bindProperty: jest.fn() };
		arrangementsEditor._list = { bindItems: jest.fn() };
		arrangementsEditor.setProperty = jest.fn();
		arrangementsEditor.getMode = jest.fn().mockReturnValue("text");
		const mockItems: Array<ArrangementOptions> = [
			{
				propertyKeyForDescription: "net_amount",
				value: "net_amount",
				propertyKeyForId: "gross_amount",
				name: "gross_amount",
				arrangementType: "TextFirst",
				textArrangement: "TextFirst"
			}
		];
		arrangementsEditor.setItems(mockItems);
		expect(arrangementsEditor.setProperty).toHaveBeenCalledWith("items", mockItems, true);
		expect(arrangementsEditor._propertyComboBox.bindProperty).toHaveBeenCalledWith("selectedKey", { path: "propertyKeyForId" });
		expect(arrangementsEditor._uomComboBox.bindProperty).toHaveBeenCalledWith("selectedKey", { path: "propertyKeyForDescription" });
		expect(arrangementsEditor._textArrangementComboBox.bindProperty).toHaveBeenCalledWith("selectedKey", { path: "arrangementType" });
		expect(arrangementsEditor._list.bindItems).toHaveBeenCalledWith({
			path: "/configuration/advancedFormattingOptions/textArrangements",
			template: expect.any(CustomListItem)
		});
	});

	test("_getInternalModel: creates a new internal model if it does not exist", () => {
		const arrangementsEditor = new ArrangementsEditor(settings);
		const setModelSpy = jest.spyOn(arrangementsEditor, "setModel");
		const internalModel = arrangementsEditor._getInternalModel();
		expect(internalModel).toBeInstanceOf(JSONModel);
		expect(setModelSpy).toHaveBeenCalled();
		expect(internalModel).toEqual(arrangementsEditor.getModel("internal"));
	});

	test("_getInternalModel: returns the existing internal model if it exists", () => {
		const arrangementsEditor = new ArrangementsEditor(settings);
		const mockModel = new JSONModel({});
		arrangementsEditor.setModel(mockModel, "internal");
		const setModelSpy = jest.spyOn(arrangementsEditor, "setModel");
		const internalModel = arrangementsEditor._getInternalModel();
		expect(setModelSpy).not.toHaveBeenCalled();
		expect(internalModel).toEqual(mockModel);
	});

	test("_onAddButtonClicked: adds an item to the model", () => {
		//when getProperty of model already has value for getBindingPath("items")
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn((path) => {
				if (path === "/configuration/advancedFormattingOptions/textArrangements") {
					return;
				}
			}),
			refresh: jest.fn()
		});
		const model = arrangementsEditor.getModel() as JSONModel;
		const refreshSpy = jest.spyOn(model, "refresh");
		arrangementsEditor._onAddButtonClicked();
		expect(refreshSpy).toHaveBeenCalled();

		//when getProperty of model already has value for getBindingPath("items")
		arrangementsEditor.getModel = jest.fn().mockReturnValue({
			getProperty: jest.fn((path) => {
				if (path === "/configuration/advancedFormattingOptions/textArrangements") {
					return [
						{
							arrangementKey: "gross_amount",
							value: "gross_amount",
							propKey: "net_amount",
							name: "net_amount",
							arrangementType: "TextFirst",
							textArrangement: "TextFirst"
						}
					];
				}
			}),
			refresh: jest.fn()
		});
		arrangementsEditor._onAddButtonClicked();
		expect(refreshSpy).toHaveBeenCalled();

		//when model is not present
		const arrangements = new ArrangementsEditor(settings);
		arrangements._onAddButtonClicked();
		expect(refreshSpy).toHaveBeenCalled();
	});

	test("_onDeleteButtonClicked: removes an item from the model", () => {
		const mockEvent = {
			getSource: () => ({
				getBindingContext: () => ({
					getPath: () => "/configuration/advancedFormattingOptions/textArrangements/1"
				})
			})
		} as Event;
		const model = arrangementsEditor.getModel() as JSONModel;
		const refreshSpy = jest.spyOn(model, "refresh");
		arrangementsEditor._onDeleteButtonClicked(mockEvent);
		expect(refreshSpy).toHaveBeenCalled();
	});
});
