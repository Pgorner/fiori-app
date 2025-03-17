/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase", "sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlockFragment", "sap/fe/core/helpers/TypeGuards", "sap/ui/core/Lib"], function (Log, BuildingBlockTemplateProcessor, BuildingBlockTemplatingBase, RuntimeBuildingBlockFragment, TypeGuards, Library) {
  "use strict";

  var _exports = {};
  var isContext = TypeGuards.isContext;
  var storeRuntimeBlock = RuntimeBuildingBlockFragment.storeRuntimeBlock;
  var xml = BuildingBlockTemplateProcessor.xml;
  var registerBuildingBlock = BuildingBlockTemplateProcessor.registerBuildingBlock;
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  /**
   * Base class for runtime building blocks
   */
  let RuntimeBuildingBlock = /*#__PURE__*/function (_BuildingBlockTemplat) {
    function RuntimeBuildingBlock() {
      return _BuildingBlockTemplat.apply(this, arguments) || this;
    }
    _exports = RuntimeBuildingBlock;
    _inheritsLoose(RuntimeBuildingBlock, _BuildingBlockTemplat);
    var _proto = RuntimeBuildingBlock.prototype;
    _proto.getContent = function getContent(containingView, appComponent, defaultAggregationContent) {
      return defaultAggregationContent;
    };
    RuntimeBuildingBlock.register = function register() {
      registerBuildingBlock(this);
      storeRuntimeBlock(this);
    };
    RuntimeBuildingBlock.load = async function load() {
      if (this.metadata.libraries) {
        // Required before usage to ensure the library is loaded and not each file individually
        try {
          await Promise.all(this.metadata.libraries.map(async libraryName => Library.load({
            name: libraryName
          })));
        } catch (e) {
          const errorMessage = `Couldn't load building block ${this.metadata.name} please make sure the following libraries are available ${this.metadata.libraries.join(",")}`;
          Log.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      return Promise.resolve(this);
    };
    _proto.getTemplate = function getTemplate(_oNode) {
      return "";
    };
    _proto.getRuntimeBuildingBlockTemplate = function getRuntimeBuildingBlockTemplate(_oNode) {
      const metadata = this.constructor.metadata;
      const className = `${metadata.namespace ?? metadata.publicNamespace}.${metadata.name}`;
      const extraProps = [];
      // Function are defined as string but need to be resolved by UI5, as such we store them in an `event` property and will redispatch them later
      const functionHolderDefinition = [];
      const propertiesAssignedToFunction = [];
      const functionStringInOrder = [];
      for (const propertiesKey in metadata.properties) {
        let propertyValue = this[propertiesKey];
        if (propertyValue !== undefined && propertyValue !== null) {
          if (isContext(propertyValue)) {
            propertyValue = propertyValue.getPath();
          }
          if (metadata.properties[propertiesKey].type === "function") {
            functionHolderDefinition.push(propertyValue);
            functionStringInOrder.push(propertyValue);
            propertiesAssignedToFunction.push(propertiesKey);
          } else {
            extraProps.push(xml`feBB:${propertiesKey}="${propertyValue}"`);
          }
        }
      }
      if (functionHolderDefinition.length > 0) {
        extraProps.push(xml`functionHolder="${functionHolderDefinition.join(";")}"`);
        extraProps.push(xml`feBB:functionStringInOrder="${functionStringInOrder.join(",")}"`);
        extraProps.push(xml`feBB:propertiesAssignedToFunction="${propertiesAssignedToFunction.join(",")}"`);
      }
      const innerTemplate = this.getTemplate(_oNode);
      return xml`<feBB:RuntimeBuildingBlockFragment
					xmlns:core="sap.ui.core"
					xmlns:feBB="sap.fe.core.buildingBlocks.templating"
					fragmentName="${className}"
					id="${this.id}"
					type="FE_COMPONENTS"
					${extraProps.length > 0 ? extraProps : ""}
				>
				${this.addConditionally(innerTemplate.length > 0, `<feBB:fragmentXML>
						${innerTemplate}
					</feBB:fragmentXML>`)}
				<feBB:dependents>
					<slot name="dependents"/>
				</feBB:dependents>
				<feBB:customDataHolder>
					<slot name="customData"/>
				</feBB:customDataHolder>
				<feBB:layoutData>
					<slot name="layoutData"/>
				</feBB:layoutData>
				</feBB:RuntimeBuildingBlockFragment>`;
    };
    return RuntimeBuildingBlock;
  }(BuildingBlockTemplatingBase);
  RuntimeBuildingBlock.isRuntime = true;
  _exports = RuntimeBuildingBlock;
  return _exports;
}, false);
//# sourceMappingURL=RuntimeBuildingBlock-dbg.js.map
