import type { AnyAnnotation, ConvertedMetadata, EntitySet, Property } from "@sap-ux/vocabularies-types";
import compiler from "@sap/cds-compiler";
import * as fs from "fs";
import type { Range, Ranges } from "htmljs-parser";
import { createParser } from "htmljs-parser";
import * as path from "path";
import Log from "sap/base/Log";
import LoaderExtensions from "sap/base/util/LoaderExtensions";
import merge from "sap/base/util/merge";
import uid from "sap/base/util/uid";
import jsx from "sap/fe/base/jsx-runtime/jsx";
import AppComponent from "sap/fe/core/AppComponent";
import PageController from "sap/fe/core/PageController";
import type TemplateComponent from "sap/fe/core/TemplateComponent";
import TemplateModel from "sap/fe/core/TemplateModel";
import { parseXMLString } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import type { ListReportManifestSettings, ObjectPageManifestSettings } from "sap/fe/core/converters/ManifestSettings";
import { convertTypes, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import type { IDiagnostics, PageContextPathTarget } from "sap/fe/core/converters/TemplateConverter";
import type { IssueCategory, IssueSeverity } from "sap/fe/core/converters/helpers/IssueManager";
import type { SideEffectsService } from "sap/fe/core/services/SideEffectsServiceFactory";
import SideEffectsFactory from "sap/fe/core/services/SideEffectsServiceFactory";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { createMockResourceModel } from "sap/fe/test/UI5MockHelper";
import Page from "sap/m/Page";
import BindingParser from "sap/ui/base/BindingParser";
import type EventProvider from "sap/ui/base/EventProvider";
import type { BaseAggregationBindingInfo } from "sap/ui/base/ManagedObject";
import ManagedObject from "sap/ui/base/ManagedObject";
import ManagedObjectMetadata from "sap/ui/base/ManagedObjectMetadata";
import Component from "sap/ui/core/Component";
import type UI5Element from "sap/ui/core/Element";
import InvisibleText from "sap/ui/core/InvisibleText";
import XMLTemplateProcessor from "sap/ui/core/XMLTemplateProcessor";
import XMLPreprocessor from "sap/ui/core/util/XMLPreprocessor";
import Serializer from "sap/ui/core/util/serializer/Serializer";
import Utils from "sap/ui/fl/Utils";
import FlexState from "sap/ui/fl/apply/_internal/flexState/FlexState";
import Loader from "sap/ui/fl/apply/_internal/flexState/Loader";
import XmlPreprocessor from "sap/ui/fl/apply/_internal/preprocessors/XmlPreprocessor";
import AppStorage from "sap/ui/fl/initial/_internal/Storage";
import type Control from "sap/ui/mdc/Control";
import type Context from "sap/ui/model/Context";
import type MetaModel from "sap/ui/model/MetaModel";
import type Model from "sap/ui/model/Model";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import _MetadataRequestor from "sap/ui/model/odata/v4/lib/_MetadataRequestor";
import xpath from "xpath";
import type { ManagedObjectEx } from "../../../../../../types/extension_types";
import { createFlexibilityChangesObject } from "./JestFlexibilityHelper";

type PreProcessorSettingsType = {
	models: {
		[name: string]: JSONModel | ODataMetaModel;
	};
	bindingContexts: {
		[name: string]: Context | undefined;
	};
};
type MockFragment = {
	name: string;
	content: string;
};

type JestTemplatedView = {
	asElement: Element | undefined;
	asString: string;
};

Log.setLevel(1 as any, "sap.ui.core.util.XMLPreprocessor");
jest.setTimeout(40000);

const nameSpaceMap: Record<string, string> = {
	macro: "sap.fe.macros",
	macros: "sap.fe.macros",
	feBB: "sap.fe.core.buildingBlocks.templating",
	macroField: "sap.fe.macros.field",
	macrodata: "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
	log: "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
	customData: "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
	control: "sap.fe.core.controls",
	controls: "sap.fe.macros.controls",
	core: "sap.ui.core",
	dt: "sap.ui.dt",
	m: "sap.m",
	f: "sap.ui.layout.form",
	fl: "sap.ui.fl",
	internalMacro: "sap.fe.macros.internal",
	mdc: "sap.ui.mdc",
	actiontoolbar: "sap.ui.mdc.actiontoolbar",
	mdcField: "sap.ui.mdc.field",
	mdcTable: "sap.ui.mdc.table",
	u: "sap.ui.unified",
	uxap: "sap.uxap",
	macroMicroChart: "sap.fe.macros.microchart",
	microChart: "sap.suite.ui.microchart",
	macroTable: "sap.fe.macros.table",
	mdcvc: "sap.ui.mdc.valuehelp.content",
	mdcv: "sap.ui.mdc.valuehelp",
	valueHelp: "sap.fe.macros.valueHelp",
	contentSwitcher: "sap.fe.macros.contentSwitcher",
	filterBar: "sap.fe.macros.filterBar",
	fbControls: "sap.fe.macros.controls.filterbar",
	draftIndicator: "sap.fe.macros.draftIndicator"
};
const reveseNamespaceMap = Object.keys(nameSpaceMap).reduce((reverseMap: Record<string, string>, currentName) => {
	reverseMap[nameSpaceMap[currentName]] = currentName;
	return reverseMap;
}, {});
const select = xpath.useNamespaces(nameSpaceMap);

const defaultFakeSideEffectService = { computeFieldGroupIds: () => [] };

function _getTemplatedSelector(xmldom: Node, selector: string): string {
	/**
	 * if a root element has been added during the templating by our Jest Templating methods
	 * the root element is added to the selector path.
	 */
	const rootPath = "/root";
	return `${xmldom.nodeName === "root" && !selector.startsWith(rootPath) ? rootPath : ""}${selector}`;
}

async function _buildPreProcessorSettings(
	sMetadataUrl: string | undefined,
	mBindingContexts: { [x: string]: string },
	mModels: { [x: string]: any },
	fakeSideEffectService?: unknown
): Promise<PreProcessorSettingsType> {
	let oMetaModel: ODataMetaModel | undefined;
	if (sMetadataUrl) {
		oMetaModel = await getMetaModel(sMetadataUrl);
		// To ensure our macro can use #setBindingContext we ensure there is a pre existing JSONModel for converterContext
		// if not already passed to teh templating
		if (!mModels.hasOwnProperty("converterContext")) {
			mModels = Object.assign(mModels, { converterContext: new TemplateModel({}, oMetaModel!) });
		}

		Object.keys(mModels).forEach(function (sModelName) {
			if (mModels[sModelName] && mModels[sModelName].isTemplateModel) {
				mModels[sModelName] = new TemplateModel(mModels[sModelName].data, oMetaModel!);
			}
		});
	}

	const settings: any = {
		models: Object.assign(
			{
				metaModel: oMetaModel
			},
			mModels
		),
		bindingContexts: {},
		appComponent: { getSideEffectsService: jest.fn(), getDiagnostics: () => undefined, getShellServices: jest.fn() }
	};

	settings.appComponent.getSideEffectsService.mockReturnValue(fakeSideEffectService ?? defaultFakeSideEffectService);
	//Inject models and bindingContexts
	Object.keys(mBindingContexts).forEach(function (sKey) {
		/* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
		expect(typeof oMetaModel?.getObject(mBindingContexts[sKey])).toBeDefined();
		const oModel = mModels[sKey] || oMetaModel;
		settings.bindingContexts[sKey] = oModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath
		settings.models[sKey] = oModel;
	});
	return settings;
}

function _loadResourceView(viewName: string): Element {
	const name = viewName.replace(/\./g, "/") + ".view.xml";
	const view = LoaderExtensions.loadResource(name);
	return view.documentElement;
}

export const runXPathQuery = function (selector: string, xmldom: Node | undefined) {
	return select(selector, xmldom);
};

expect.extend({
	toHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(_getTemplatedSelector(xmldom, selector), xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `did not find controls matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length >= 1
		};
	},
	toNotHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(_getTemplatedSelector(xmldom, selector), xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `There is a control matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length === 0
		};
	},
	/**
	 * Checks for errors in `xml` created during templating of an XML string or
	 * an XML node.
	 *
	 * This function checkes for the xml errors created by the
	 * function [BuildingBlockTemplateProcessor.createErrorXML]{@link sap.fe.core.buildingBlocks.templating.BuildingBlockTemplateProcessor#createErrorXML}.
	 * @param xml XML String or XML Node to be tested for errors
	 * @returns Jest Matcher result object
	 */
	toHaveTemplatingErrors(xml: string | Node) {
		const xmlText = typeof xml === "string" ? xml : serializeXML(xml);
		const base64Entries: string[] = xmlText.match(/BBF\.base64Decode\('([^']*)'\)/gm) || ([] as string[]);
		const errorMessages: string[] = base64Entries.map((message: string) => {
			if (message && message.length > 0) {
				return atob(message.match(/('[^']*)/)?.[0]?.slice(1) || "");
			}
			return "";
		});
		if (errorMessages.length <= 0) {
			return {
				message: () => `XML Templating without errors`,
				pass: false
			};
		} else {
			return {
				message: () => errorMessages.join("\n"),
				pass: true
			};
		}
	}
});

export const formatBuildingBlockXML = function (xmlString: string | string[]): string {
	if (Array.isArray(xmlString)) {
		xmlString = xmlString.join("");
	}
	return formatXML(xmlString);
};

export const getControlAttribute = function (controlSelector: string, attributeName: string, xmlDom: Node) {
	const selector = `string(${_getTemplatedSelector(xmlDom, controlSelector)}/@${attributeName})`;
	return runXPathQuery(selector, xmlDom);
};

/**
 * Serialize the parts or the complete given XML DOM to string.
 * @param xmlDom DOM node that is to be serialized.
 * @param selector Optional selector of sub nodes
 * @returns XML string
 */
export const serializeXML = function (xmlDom: Node, selector?: string) {
	const serializer = new window.XMLSerializer();
	let xmlString: string;
	if (selector) {
		const nodes = runXPathQuery(selector, xmlDom) as Node[];
		xmlString = nodes.map((node) => serializer.serializeToString(node)).join("\n");
	} else {
		xmlString = serializer.serializeToString(xmlDom);
	}
	return formatXML(xmlString);
};

/**
 * Formats a string containing an XML document.
 *
 * This function only considers XML tags and attributes, ignoring everything else (text, comments). Additionally,
 * attribute values containing a varying UID are replaced with a constant value.
 *
 * An "XML" string containing multiple root elements can be.
 * @param xmlString  The input XML string. This function also accepts "XML" strings with multiple root elements.
 * @returns The formatted XML string.
 */
export const formatXML = function (xmlString: string): string {
	const START = "<__XML__>",
		END = "</__XML__>",
		UID = /uid--id-\d{13}-\d{1,3}/,
		UID2 = /id-\d{13}-\d{1,3}/,
		lines: string[] = [];

	let currentLine = "",
		level = -1,
		attributes: { name: string; value?: string }[] = [];

	function newline() {
		if (currentLine && currentLine !== START) {
			lines.push(currentLine);
		}

		currentLine = level > 0 ? "  ".repeat(level) : "";
	}

	function appendAttributes() {
		if (attributes.length > 0) {
			attributes = attributes.sort((a, b) => {
				if (a.name.startsWith("xmlns") && !b.name.startsWith("xmlns")) {
					return -1;
				} else if (!a.name.startsWith("xmlns") && b.name.startsWith("xmlns")) {
					return 1;
				} else if (a.name.startsWith("xmlns") && b.name.startsWith("xmlns")) {
					return a.name.localeCompare(b.name);
				} else if (a.name.includes(":") && !b.name.includes(":")) {
					return -1;
				} else if (!a.name.includes(":") && b.name.includes(":")) {
					return 1;
				} else {
					return a.name.localeCompare(b.name);
				}
			});

			level++;
			for (const attribute of attributes) {
				newline();
				currentLine += attribute.name;
				if (attribute.value) currentLine += attribute.value;
			}
			level--;
			attributes = [];
			newline();
		}
	}

	function append(data: Range) {
		currentLine += parser.read(data);
	}

	const parser = createParser({
		onOpenTagStart(data: Range) {
			newline();
			append(data);
		},

		onOpenTagName: append,

		onAttrName(data: Range) {
			attributes.unshift({ name: parser.read(data) });
		},

		onAttrValue(data: Ranges.AttrValue) {
			attributes[0].value = parser.read(data).replace(UID, "uid--id"); // replace varying UIDs with a constant value
			attributes[0].value = parser.read(data).replace(UID2, "id"); // replace varying UIDs with a constant value
		},

		onOpenTagEnd(data: Ranges.OpenTagEnd) {
			appendAttributes();
			append(data);
			if (!data.selfClosed) level++;
		},

		onCloseTagStart(data: Range) {
			level--;
			newline();
			append(data);
		},

		onCloseTagName: append,
		onCloseTagEnd: append
	});

	parser.parse(START + xmlString + END);
	return lines.join("\n").trim();
};

/**
 * Compile a CDS file into an EDMX file.
 * @param cdsUrl The path to the file containing the CDS definition. This file must declare the namespace
 * sap.fe.test and a service JestService
 * @param options Options for creating the EDMX output
 * @returns The path of the generated EDMX
 */
export const compileCDS = function (cdsUrl: string, options: compiler.ODataOptions = {}) {
	const cdsString = fs.readFileSync(cdsUrl, "utf-8");
	const edmxContent = cds2edmx(cdsString, "sap.fe.test.JestService", options);
	const dir = path.resolve(cdsUrl, "..", "gen");

	// If the caller provided CDS compiler options: Include them in the filename. This prevents unpredictable results if the same CDS source
	// file is used simultaneously with a different set of options (e.g. in a test running in parallel)
	const allOptions = Object.entries(options);
	allOptions.sort((a, b) => b[0].localeCompare(a[0]));

	const edmxFileName =
		allOptions.reduce(
			(filename, [optionKey, optionValue]) => `${filename}#${optionKey}=${optionValue.toString()}#`,
			path.basename(cdsUrl).replace(".cds", "")
		) + ".xml";

	const edmxFilePath = path.resolve(dir, edmxFileName);

	fs.mkdirSync(dir, { recursive: true });

	fs.writeFileSync(edmxFilePath, edmxContent);
	return edmxFilePath;
};

/**
 * Compile CDS to EDMX.
 * @param cds The CDS model. It must define at least one service.
 * @param service The fully-qualified name of the service to be compiled. Defaults to "sap.fe.test.JestService".
 * @param options Options for creating the EDMX output
 * @returns The compiled service model as EDMX.
 */
export function cds2edmx(cds: string, service = "sap.fe.test.JestService", options: compiler.ODataOptions = {}) {
	const sources: Record<string, string> = { "source.cds": cds };

	// allow to include stuff from @sap/cds/common
	if (cds.includes("'@sap/cds/common'")) {
		sources["common.cds"] = fs.readFileSync(require.resolve("@sap/cds/common.cds"), "utf-8");
	}

	const csn = compiler.compileSources(sources, {});

	const edmxOptions: compiler.ODataOptions = {
		odataForeignKeys: true,
		odataFormat: "structured",
		odataContainment: true,
		...options,
		service: service
	};

	const edmx = compiler.to.edmx(csn, edmxOptions);
	if (!edmx) {
		throw new Error(`Compilation failed. Hint: Make sure that the CDS model defines service ${service}.`);
	}
	return edmx;
}

export const getFakeSideEffectsService = async function (
	metaModel: ODataMetaModel,
	classNameODataModel = "sap.ui.model.odata.v4.ODataModel"
): Promise<SideEffectsService> {
	const scopeObject = {
		getModel: () => {
			return {
				isA: () => classNameODataModel === "sap.ui.model.odata.v4.ODataModel",
				getMetaModel: () => {
					return metaModel;
				},
				getServiceUrl: () => undefined
			};
		},
		getService: () => {
			return {
				getCapabilities: () => undefined
			};
		}
	};
	const serviceInstance = await new SideEffectsFactory().createInstance({ scopeObject, scopeType: "", settings: {} });
	return serviceInstance.getInterface();
};

export const getFakeDiagnostics = function (): IDiagnostics {
	const issues: any[] = [];
	return {
		addIssue(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): void {
			issues.push({
				issueCategory,
				issueSeverity,
				details
			});
		},
		getIssues(): any[] {
			return issues;
		},
		checkIfIssueExists(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): boolean {
			return issues.find((issue) => {
				return issue.issueCategory === issueCategory && issue.issueSeverity === issueSeverity && issue.details === details;
			});
		}
	};
};

export const getConverterContextForTest = function (
	metaModel: ODataMetaModel,
	manifestSettings: ListReportManifestSettings | ObjectPageManifestSettings
) {
	const convertedTypes = convertTypes(metaModel);
	const dataModelPath = manifestSettings.contextPath
		? getInvolvedDataModelObjects<PageContextPathTarget>(metaModel.createBindingContext(manifestSettings.contextPath) as Context)
		: getInvolvedDataModelObjects<PageContextPathTarget>(metaModel.createBindingContext(`/${manifestSettings.entitySet}`));
	return new ConverterContext<PageContextPathTarget>(convertedTypes, manifestSettings, getFakeDiagnostics(), merge, dataModelPath);
};
const metaModelCache: any = {};
export const getMetaModel = async function (sMetadataUrl: string) {
	const oRequestor = _MetadataRequestor.create({}, "4.0", undefined, {}, {}, function () {
		return null;
	});
	if (!metaModelCache[sMetadataUrl]) {
		const oMetaModel = new (ODataMetaModel as any)(oRequestor, sMetadataUrl, undefined, { _requestAnnotationChanges: () => [] });
		await oMetaModel.fetchEntityContainer();
		metaModelCache[sMetadataUrl] = oMetaModel;
	}

	return metaModelCache[sMetadataUrl];
};

export const getDataModelObjectPathForProperty = function <T = Property | EntitySet | AnyAnnotation>(
	entitySet: EntitySet,
	convertedTypes: ConvertedMetadata,
	property?: T
): DataModelObjectPath<T> {
	const targetPath: DataModelObjectPath<T> = {
		startingEntitySet: entitySet,
		navigationProperties: [],
		targetObject: property,
		targetEntitySet: entitySet,
		targetEntityType: entitySet.entityType,
		convertedTypes: convertedTypes
	};
	targetPath.contextLocation = targetPath as DataModelObjectPath<EntitySet>;
	return targetPath;
};

export const evaluateBinding = function (bindingString: string, ...args: any[]) {
	const bindingElement = BindingParser.complexParser(bindingString);
	return bindingElement.formatter.apply(undefined, args);
};

type ModelContent = {
	[name: string]: any;
};

/**
 * Evaluate a binding against a model.
 * @param bindingString The binding string.
 * @param modelContent Content of the default model to use for evaluation.
 * @param namedModelsContent Contents of additional, named models to use.
 * @returns The evaluated binding.
 */
export function evaluateBindingWithModel(
	bindingString: string | undefined,
	modelContent: ModelContent,
	namedModelsContent?: { [modelName: string]: ModelContent }
): string {
	const bindingElement = BindingParser.complexParser(bindingString);
	const text = new InvisibleText();
	text.bindProperty("text", bindingElement);

	const defaultModel = new JSONModel(modelContent);
	text.setModel(defaultModel);
	text.setBindingContext(defaultModel.createBindingContext("/"));

	if (namedModelsContent) {
		for (const [name, content] of Object.entries(namedModelsContent)) {
			const model = new JSONModel(content);
			text.setModel(model, name);
			text.setBindingContext(model.createBindingContext("/"), name);
		}
	}

	return text.getText();
}

const TESTVIEWID = "testViewId";

const applyFlexChanges = async function (flexChanges: { [x: string]: object[] }, oMetaModel: MetaModel, resultXML: any) {
	// prefix Ids
	[...resultXML.querySelectorAll("[id]")].forEach((node) => {
		node.id = `${TESTVIEWID}--${node.id}`;
	});
	const changes = createFlexibilityChangesObject(TESTVIEWID, flexChanges);
	const appId = "someComponent";
	const oManifest = {
		"sap.app": {
			id: appId,
			type: "application",
			crossNavigation: {
				outbounds: []
			}
		}
	};
	const oAppComponent: AppComponent = {
		getDiagnostics: jest.fn().mockReturnValue(getFakeDiagnostics()),
		getModel: jest.fn().mockReturnValue({
			getMetaModel: jest.fn().mockReturnValue(oMetaModel)
		}),
		getComponentData: jest.fn().mockReturnValue({}),
		getManifestObject: jest.fn().mockReturnValue({
			getEntry: function (name: string) {
				return (oManifest as any)[name];
			}
		}),
		getLocalId: jest.fn((sId) => sId)
	} as unknown as AppComponent;
	//fake changes
	jest.spyOn(AppStorage, "loadFlexData").mockReturnValue(Promise.resolve(changes));
	jest.spyOn(Loader, "loadFlexData").mockReturnValue(Promise.resolve(changes));

	jest.spyOn(Component as unknown as { getComponentById: () => AppComponent }, "getComponentById").mockReturnValue(oAppComponent);
	jest.spyOn(Utils, "getAppComponentForControl").mockReturnValue(oAppComponent);
	await FlexState.initialize({
		componentId: appId
	});
	resultXML = await XmlPreprocessor.process(resultXML, { name: "Test Fragment", componentId: appId, id: TESTVIEWID });

	//Assert that all changes have been applied
	const changesApplied = getChangesFromXML(resultXML);
	expect(changesApplied.length).toBe(flexChanges?.changes?.length ?? 0 + flexChanges?.variantDependentControlChanges?.length ?? 0);
	return resultXML;
};

export const getChangesFromXML = (xml: any) =>
	[...xml.querySelectorAll("*")]
		.flatMap((e) => [...e.attributes].map((a) => a.name))
		.filter((attr) => attr.includes("sap.ui.fl.appliedChanges"));

export const getTemplatingResult = async function (
	xmlInput: string,
	sMetadataUrl: string | undefined,
	mBindingContexts: { [x: string]: any; entitySet?: string },
	mModels: { [x: string]: any },
	flexChanges?: { [x: string]: object[] },
	fakeSideEffectService?: unknown
) {
	if (!mModels["sap.fe.i18n"]) {
		mModels["sap.fe.i18n"] = createMockResourceModel();
	}

	const templatedXml = `<root>${xmlInput}</root>`;
	const parser = new window.DOMParser();
	const xmlDoc = parser.parseFromString(templatedXml, "text/xml");
	// To ensure our macro can use #setBindingContext we ensure there is a pre existing JSONModel for converterContext
	// if not already passed to teh templating

	const oPreprocessorSettings = await _buildPreProcessorSettings(sMetadataUrl, mBindingContexts, mModels, fakeSideEffectService);

	//This context for macro testing
	if (oPreprocessorSettings.models["this"]) {
		oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
	}

	let resultXML = (await XMLPreprocessor.process(xmlDoc.firstElementChild!, { name: "Test Fragment" }, oPreprocessorSettings)) as any;

	if (sMetadataUrl && flexChanges) {
		// apply flex changes
		const oMetaModel = await getMetaModel(sMetadataUrl);
		resultXML = await applyFlexChanges(flexChanges, oMetaModel, resultXML);
	}
	return resultXML;
};

export const getTemplatedXML = async function (
	xmlInput: string,
	sMetadataUrl: string | undefined,
	mBindingContexts: { [x: string]: string },
	mModels: { [x: string]: any },
	flexChanges?: { [x: string]: object[] },
	fakeSideEffectService?: unknown
): Promise<string> {
	return jsx.defineXMLNamespaceMap(reveseNamespaceMap, async () => {
		const templatedXML = await getTemplatingResult(
			xmlInput,
			sMetadataUrl,
			mBindingContexts,
			mModels,
			flexChanges,
			fakeSideEffectService
		);
		const serialiedXML = serializeXML(templatedXML, undefined);
		expect(serialiedXML).not.toHaveTemplatingErrors();
		return serialiedXML;
	}) as unknown as Promise<string>;
};

/**
 * Process the requested view with the provided data.
 * @param name Fully qualified name of the view to be tested.
 * @param sMetadataUrl Url of the metadata.
 * @param mBindingContexts Map of the bindingContexts to set on the models.
 * @param mModels Map of the models.
 * @param flexChanges Object with UI changes like 'changes' or 'variantDependentControlChanges'
 * @returns Templated view as string
 */
export async function processView(
	name: string,
	sMetadataUrl: string,
	mBindingContexts: { [x: string]: string },
	mModels: { [x: string]: any },
	flexChanges?: { [x: string]: object[] }
): Promise<JestTemplatedView> {
	const oMetaModel = await getMetaModel(sMetadataUrl);
	const oViewDocument = _loadResourceView(name);
	const oPreprocessorSettings = await _buildPreProcessorSettings(sMetadataUrl, mBindingContexts, mModels);
	let oPreprocessedView = await XMLPreprocessor.process(oViewDocument, { name: name }, oPreprocessorSettings);
	if (flexChanges) {
		oPreprocessedView = await applyFlexChanges(flexChanges ?? [], oMetaModel, oPreprocessedView);
	}
	return {
		asElement: oPreprocessedView,
		asString: formatXML(oPreprocessedView?.outerHTML || "")
	};
}

/**
 * Process the requested XML fragment with the provided data.
 * @param name Fully qualified name of the fragment to be tested.
 * @param testData Test data consisting
 * @returns Templated fragment as string
 */
export async function processFragment(name: string, testData: { [model: string]: object }): Promise<string> {
	const inputXml = `<root><core:Fragment fragmentName="${name}" type="XML" xmlns:core="sap.ui.core" /></root>`;
	const parser = new window.DOMParser();

	const inputDoc = parser.parseFromString(inputXml, "text/xml");

	// build model and bindings for given test data
	const settings = {
		models: {} as { [name: string]: JSONModel },
		bindingContexts: {} as { [name: string]: object },
		appComponent: { getSideEffectsService: jest.fn(), getDiagnostics: () => undefined }
	};
	for (const model in testData) {
		const jsonModel = new JSONModel();
		jsonModel.setData(testData[model]);
		settings.models[model] = jsonModel;
		settings.bindingContexts[model] = settings.models[model].createBindingContext("/");
	}
	settings.appComponent.getSideEffectsService.mockReturnValue(defaultFakeSideEffectService);

	// execute the pre-processor
	const resultDoc = await XMLPreprocessor.process(inputDoc.firstElementChild, { name }, settings);

	// exclude nested fragments from test snapshots
	const fragments = resultDoc.getElementsByTagName("core:Fragment") as any;
	if (fragments?.length > 0) {
		for (const fragment of fragments) {
			fragment.innerHTML = "";
		}
	}

	// Keep the fragment result as child of root node when fragment generates multiple root controls
	const xmlResult = resultDoc.children.length > 1 ? resultDoc.outerHTML : resultDoc.innerHTML;

	return formatXML(xmlResult);
}

export function serializeControl(controlToSerialize?: UI5Element | UI5Element[], showCustomStyleClasses = false) {
	let tabCount = 0;
	const UID = /uid--id-\d{13}-\d{1,3}/;
	const CONTROLID = /id-\d{13}-\d{1,3}/;
	function getTab(toAdd = 0) {
		let tab = "";
		for (let i = 0; i < tabCount + toAdd; i++) {
			tab += "\t";
		}
		return tab;
	}
	const serializeDelegate = {
		start: function (control: any, sAggregationName: string) {
			let controlDetail = "";
			if (sAggregationName) {
				if (control.getParent()) {
					const indexInParent = (control.getParent().getAggregation(sAggregationName) as ManagedObject[])?.indexOf?.(control);
					if (indexInParent > 0) {
						controlDetail += `,\n${getTab()}`;
					}
				}
			}
			controlDetail += `${control.getMetadata().getName()}(`;
			return controlDetail;
		},
		end: function () {
			return "})";
		},
		middle: function (control: any) {
			let id = control.getId();
			id = typeof id === "string" ? id?.replace?.(CONTROLID, "id") : id;
			let data = `{id: ${ManagedObjectMetadata.isGeneratedId(id) ? "__dynamicId" : id}`;
			for (const oControlKey in control.mProperties) {
				if (control.mProperties.hasOwnProperty(oControlKey)) {
					let propertyValue = control.mProperties[oControlKey];
					propertyValue = typeof propertyValue === "string" ? propertyValue?.replace?.(UID, "uid--id") : propertyValue;
					propertyValue = typeof propertyValue === "string" ? propertyValue?.replace?.(CONTROLID, "id") : propertyValue;
					try {
						propertyValue = typeof propertyValue === "object" ? JSON.stringify(propertyValue) : propertyValue;
					} catch (e) {
						// Stringify may fail for circular references but it's not the end of the world
					}

					data += `,\n${getTab()} ${oControlKey}: ${propertyValue}`;
				} else if (control.mBindingInfos.hasOwnProperty(oControlKey)) {
					const bindingDetail = { ...control.mBindingInfos[oControlKey] };
					if (bindingDetail.type?.oOutputFormat) {
						delete bindingDetail.type.oOutputFormat;
					}
					if (bindingDetail.binding) {
						delete bindingDetail.binding;
					}
					data += `,\n${getTab()} ${oControlKey}: ${JSON.stringify(bindingDetail)}`;
				}
			}
			for (const oControlKey in control.mAssociations) {
				if (control.mAssociations.hasOwnProperty(oControlKey)) {
					let associationValue = control.mAssociations[oControlKey];
					if (!Array.isArray(associationValue)) {
						associationValue = [associationValue];
					}
					associationValue = associationValue.map((associationValueElement: string) => {
						return typeof associationValueElement === "string"
							? associationValueElement?.replace?.(CONTROLID, "id")
							: associationValueElement;
					});

					data += `,\n${getTab()} ${oControlKey}: ${(associationValue?.join?.(",") ?? associationValue) || undefined}`;
				}
			}
			if (showCustomStyleClasses && control.aCustomStyleClasses?.length > 0) {
				data += `,\n${getTab()} customStyleClasses : ${control.aCustomStyleClasses.join(", ")}`;
			}
			for (const oControlKey in control.mEventRegistry) {
				if (control.mEventRegistry.hasOwnProperty(oControlKey)) {
					data += `,\n${getTab()} ${oControlKey}: true`;
				}
			}
			data += ``;
			return data;
		},
		startAggregation: function (control: { mBindingInfos: Record<string, BaseAggregationBindingInfo> }, sName: string) {
			let out = `,\n${getTab()}${sName}`;
			tabCount++;

			if (control.mBindingInfos[sName]) {
				out += `={ path:'${control.mBindingInfos[sName].path}', template:\n${getTab()}`;
			} else {
				out += `=[\n${getTab()}`;
			}
			return out;
		},
		endAggregation: function (control: any, sName: string) {
			tabCount--;
			if (control.mBindingInfos[sName]) {
				return `\n${getTab()}}`;
			} else {
				return `\n${getTab()}]`;
			}
		}
	};
	if (Array.isArray(controlToSerialize)) {
		return controlToSerialize.map((controlToRender: UI5Element) => {
			return new Serializer(controlToRender, serializeDelegate).serialize();
		});
	} else {
		return new Serializer(controlToSerialize, serializeDelegate).serialize();
	}
}

export function serializeControlAsXML(controlToSerialize?: UI5Element | UI5Element[], showCustomStyleClasses = false) {
	let tabCount = 0;
	const UID = /uid--id-\d{13}-\d{1,3}/;
	const CONTROLID = /id-\d{13}-\d{1,3}/;
	const definedNamespaces: Record<string, boolean> = {};

	function getNamespaceAlias(className: string): string {
		const namesSplit = className.split(".");
		const namespace = namesSplit.slice(0, -1);
		const name = namesSplit[namesSplit.length - 1];
		let namespaceAlias = namespace[namespace.length - 1];
		if (reveseNamespaceMap[namespace.join(".")]) {
			namespaceAlias = reveseNamespaceMap[namespace.join(".")];
		}
		if (namespaceAlias === undefined) {
			namespaceAlias = "test";
		}
		return namespaceAlias;
	}

	function getTab(toAdd = 0) {
		let tab = "";
		for (let i = 0; i < tabCount + toAdd; i++) {
			tab += "\t";
		}
		return tab;
	}
	const serializeDelegate = {
		start: function (control: any, sAggregationName: string) {
			let controlDetail = "";
			if (sAggregationName) {
				if (control.getParent()) {
					const indexInParent = (control.getParent().getAggregation(sAggregationName) as ManagedObject[])?.indexOf?.(control);
					if (indexInParent > 0) {
						controlDetail += `\n${getTab()}`;
					}
				}
			}
			const nameFull = control.getMetadata().getName();
			const namesSplit = nameFull.split(".");
			const name = namesSplit[namesSplit.length - 1];
			const namespaceAlias = getNamespaceAlias(nameFull);
			controlDetail += `<${namespaceAlias}:${name}\n`;
			if (!definedNamespaces[namespaceAlias]) {
				definedNamespaces[namespaceAlias] = true;
				controlDetail += `${getTab()}xmlns:${namespaceAlias}="${nameSpaceMap[namespaceAlias]}"`;
			}
			return controlDetail;
		},
		end: function (control: any) {
			const nameFull = control.getMetadata().getName();
			const namesSplit = nameFull.split(".");
			const name = namesSplit[namesSplit.length - 1];
			const namespaceAlias = getNamespaceAlias(nameFull);
			let hasAggregation = false;
			for (const mAggregationsKey in control.mAggregations) {
				if (
					(!Array.isArray(control.mAggregations[mAggregationsKey]) &&
						control.mAggregations[mAggregationsKey] !== null &&
						control.mAggregations[mAggregationsKey] !== undefined) ||
					(Array.isArray(control.mAggregations[mAggregationsKey]) && control.mAggregations[mAggregationsKey].length > 0)
				) {
					hasAggregation = true;
				}
			}
			if (hasAggregation) {
				return `</${namespaceAlias}:${name}>`;
			} else {
				return `/>`;
			}
		},
		middle: function (control: any) {
			let id = control.getId();
			id = typeof id === "string" ? id?.replace?.(CONTROLID, "id") : id;
			let data = "";
			if (!ManagedObjectMetadata.isGeneratedId(id)) {
				data = `id="${id}"`;
			}
			let keys = Object.keys(control.mProperties)
				.concat(Object.keys(control.mBindingInfos))
				.concat(Object.keys(control.mAssociations))
				.concat(Object.keys(control.mEventRegistry));
			keys = keys.sort((a, b) => a.localeCompare(b));
			const uniqueKeys = new Set(keys);
			keys = Array.from(uniqueKeys);
			for (const oControlKey of keys) {
				if (control.mBindingInfos.hasOwnProperty(oControlKey)) {
					const bindingDetail = { ...control.mBindingInfos[oControlKey] };
					if (bindingDetail.bindingString) {
						data += `\n${getTab()}${oControlKey}="${bindingDetail.bindingString.replace(">", "&gt;")}"`;
					} else {
						if (bindingDetail.type?.oOutputFormat) {
							delete bindingDetail.type.oOutputFormat;
						}

						if (bindingDetail.binding) {
							delete bindingDetail.binding;
						}
						if (bindingDetail.template) {
							delete bindingDetail.template;
						}
						data += `\n${getTab()}${oControlKey}='${JSON.stringify(bindingDetail)}'`;
					}
				} else if (control.mProperties.hasOwnProperty(oControlKey) && control.mProperties[oControlKey] !== undefined) {
					let propertyValue = control.mProperties[oControlKey];
					propertyValue = typeof propertyValue === "string" ? propertyValue?.replace?.(UID, "uid--id") : propertyValue;
					propertyValue = typeof propertyValue === "string" ? propertyValue?.replace?.(CONTROLID, "id") : propertyValue;
					try {
						propertyValue = typeof propertyValue === "object" ? JSON.stringify(propertyValue) : propertyValue;
					} catch (e) {
						// Stringify may fail for circular references but it's not the end of the world
					}

					data += `\n${getTab()} ${oControlKey}="${propertyValue}"`;
				} else if (control.mAssociations.hasOwnProperty(oControlKey)) {
					let associationValue = control.mAssociations[oControlKey];
					if (!Array.isArray(associationValue)) {
						associationValue = [associationValue];
					}
					associationValue = associationValue.map((associationValueElement: string) => {
						return typeof associationValueElement === "string"
							? associationValueElement?.replace?.(CONTROLID, "id")
							: associationValueElement;
					});

					data += `\n${getTab()} ${oControlKey}="${(associationValue?.join?.(",") ?? associationValue) || undefined}"`;
				} else if (control.mEventRegistry.hasOwnProperty(oControlKey)) {
					if (control.mEventRegistry[oControlKey][0]?.fFunction?.name) {
						data += `\n${getTab()} ${oControlKey}="${control.mEventRegistry[oControlKey][0]?.fFunction?.name}"`;
					} else {
						data += `\n${getTab()} ${oControlKey}="someEventHandler"`;
					}
				}
			}
			if (showCustomStyleClasses && control.aCustomStyleClasses?.length > 0) {
				data += `\n${getTab()} customStyleClasses : ${control.aCustomStyleClasses.join(", ")}`;
			}
			data += `\n`;
			let hasAggregation = false;
			for (const mAggregationsKey in control.mAggregations) {
				if (
					(!Array.isArray(control.mAggregations[mAggregationsKey]) &&
						control.mAggregations[mAggregationsKey] !== null &&
						control.mAggregations[mAggregationsKey] !== undefined) ||
					(Array.isArray(control.mAggregations[mAggregationsKey]) && control.mAggregations[mAggregationsKey].length > 0)
				) {
					hasAggregation = true;
				}
			}
			if (hasAggregation) {
				data += ">";
			}
			return data;
		},
		startAggregation: function (control: any, sName: string) {
			const namespaceAlias = getNamespaceAlias(control.getMetadata().getName());
			let out = `\n${getTab()}<${namespaceAlias}:${sName}>`;
			tabCount++;
			out += `\n${getTab()}`;
			return out;
		},
		endAggregation: function (control: any, sName: string) {
			tabCount--;
			const namespaceAlias = getNamespaceAlias(control.getMetadata().getName());
			if (control.mBindingInfos[sName]) {
				return `\n${getTab()}</${namespaceAlias}:${sName}>\n`;
			} else {
				return `\n${getTab()}</${namespaceAlias}:${sName}>\n`;
			}
		}
	};
	let outXML;
	if (Array.isArray(controlToSerialize)) {
		outXML = controlToSerialize.map((controlToRender: UI5Element) => {
			return new Serializer(controlToRender, serializeDelegate).serialize();
		});
	} else {
		outXML = new Serializer(controlToSerialize, serializeDelegate).serialize();
	}
	return formatXML(`<root>${outXML}</root>`);
}

export function createAwaiter() {
	let fnResolve!: Function;
	const myPromise = new Promise((resolve) => {
		fnResolve = resolve;
	});
	return { promise: myPromise, resolve: fnResolve };
}

export function renderBuildingBlockWithModels(buildingBlock: { getContent: Function }, models: { [key: string]: Model }): Control {
	return (ManagedObject as ManagedObjectEx).runWithPreprocessors(
		() => {
			return buildingBlock.getContent();
		},
		{
			settings: function (controlSettings: { models: unknown }) {
				controlSettings.models = models;
				return controlSettings;
			}
		}
	);
}

export function registerMockFragments(...fragments: MockFragment[]): jest.SpyInstance {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const originalLoadTemplate = (XMLTemplateProcessor as any).loadTemplatePromise;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const loadTemplateStub = jest.spyOn(XMLTemplateProcessor as any, "loadTemplatePromise");
	loadTemplateStub.mockImplementation(((templateName: string, extension: string) => {
		for (const fragment of fragments) {
			if (fragment.name === templateName) {
				return parseXMLString(fragment.content)[0];
			}
		}
		return originalLoadTemplate(templateName, extension);
	}) as (() => Element) | undefined);
	return loadTemplateStub;
}

/**
 * Creates a new instance of an appComponent and templateComponent with the given options.
 * @param options
 * @param options.cdsFile The path to the CDS file to use for the appComponent
 * @param options.mainContextPath The main context path to use for the appComponent
 * @param options.pageContent The page content to use for the appComponent
 * @param options.content The content to use for the app Component
 * @param options.componentId
 * @param options.manifestSettings
 * @param name The name to use for the appComponent
 * @param viewLevel The view level to use for the appComponent
 * @returns The appcomponent and templateComponent to use for testing
 */
export async function initializeAppComponent(
	options?: {
		cdsFile?: string;
		componentId?: string;
		mainContextPath?: string;
		pageContent?: Function;
		manifestSettings?: Partial<ListReportManifestSettings | ObjectPageManifestSettings>;
		content?: {};
	},
	name?: string,
	viewLevel?: number
): Promise<{ appComponent: AppComponent; templateComponent: TemplateComponent }> {
	let cdsFile = options?.cdsFile;
	if (!cdsFile) {
		cdsFile = compileCDS(path.join(__dirname, "./data/Products.cds"));
	}
	const guid = uid();
	const id = options?.componentId ?? `sap.fe.test.${guid}`;
	const cdsContent = fs.readFileSync(cdsFile).toString();
	sap.jest.registerFakeFragment(`/sap/fe/core/mock/${guid}/$metadata?sap-language=EN`, cdsContent);
	class DefaultPageContent extends PageController {
		render() {
			return <Page></Page>;
		}
	}
	sap.ui.define(`sap/fe/test/${guid}/Component`, ["sap/fe/core/AppComponent"], function (_AppComponent: AppComponent) {
		"use strict";

		return AppComponent.extend(`sap.fe.test.${guid}.Component`, {
			metadata: {
				manifest: {
					"sap.app": {
						id: `test${guid}`,
						dataSources: {
							mainService: {
								uri: `/sap/fe/core/mock/${guid}/`,
								type: "OData",
								settings: {
									odataVersion: "4.0"
								}
							}
						}
					},
					"sap.ui5": {
						models: {
							"": {
								dataSource: "mainService",
								settings: {}
							}
						},
						routing: {
							targets: {
								Default: {
									type: "Component",
									name: name ?? "sap.fe.core.fpm",
									id: "Default",
									viewLevel: viewLevel,
									options: {
										settings: {
											...(options?.manifestSettings ?? {}),
											contextPath: options?.mainContextPath ?? "/Products",
											viewType: "JSX",
											viewContent: options?.pageContent ?? DefaultPageContent,
											content: options?.content
										}
									}
								}
							},
							routes: [
								{
									pattern: ":?query:",
									name: "Default",
									target: "Default"
								}
							]
						}
					}
				}
			}
		});
	});
	const mockAppComponent = (await Component.create({ name: `sap.fe.test.${guid}`, id: id })) as AppComponent;

	await mockAppComponent.initialized;
	const v = await (mockAppComponent.getRouter().getTarget("Default") as { load?: Function }).load?.();
	return { appComponent: mockAppComponent, templateComponent: v.object };
}

/**
 * Find an element in a collection that matches the given selector.
 * @param collection
 * @param selector
 * @returns The element that matches the selector or undefined if no element matches the selector
 */
export function findElement(collection: HTMLCollection, selector: (element: HTMLElement) => boolean): HTMLElement | undefined {
	for (let i = 0; i < collection.length; i++) {
		const element = collection.item(i) as HTMLElement;
		if (selector(element)) {
			return element;
		}
	}
	return undefined;
}

/**
 * Wait for an event to be resolved before continuing.
 * @param control
 * @param eventName
 * @returns A Promise that resolves when the event is received
 */
export async function waitForEvent(control: EventProvider, eventName: string): Promise<Event> {
	return new Promise((resolve) => {
		control.attachEventOnce(eventName, (event: Event) => {
			resolve(event);
		});
	});
}

/**
 * Tell the binding parser to keep the binding strings for testing.
 * @param enabled
 */
export function keepBindingStringForTest(enabled: boolean): void {
	BindingParser._keepBindingStrings = enabled;
}
