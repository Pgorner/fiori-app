/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/mdx-runtime/useMDXComponents", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/Fragment", "sap/fe/base/jsx-runtime/jsxs"], function (_provideComponents, _jsx, _Fragment, _jsxs) {
  "use strict";

  function _createMdxContent(props) {
    const _components = Object.assign({
        p: "p"
      }, _provideComponents(), props.components),
      {
        BuildingBlockPlayground
      } = _components;
    if (!BuildingBlockPlayground) _missingMdxReference("BuildingBlockPlayground", true);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.p, {
        children: "The sample 'Field - Display Mode' shows how to manipulate the data binding in the generated Text control. This sample shows how to apply different annotations to the field building block to show different representations of the field."
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<core:Fragment fragmentName="sap.fe.core.fpmExplorer.fieldDisplayStyles.FieldDisplay" type="XML" />
					`
      })]
    });
  }
  function MDXContent() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      wrapper: MDXLayout
    } = Object.assign({}, _provideComponents(), props.components);
    return MDXLayout ? _jsx(MDXLayout, {
      ...props,
      children: _jsx(_createMdxContent, {
        ...props
      })
    }) : _createMdxContent(props);
  }
  return MDXContent;
  function _missingMdxReference(id, component) {
    throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
  }
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfanN4cyIsIl9GcmFnbWVudCIsImNoaWxkcmVuIiwiX2pzeCIsIl9jb21wb25lbnRzIiwicCIsIkJ1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kIiwiYmluZGluZyIsIk1EWENvbnRlbnQiLCJwcm9wcyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIndyYXBwZXIiLCJNRFhMYXlvdXQiLCJPYmplY3QiLCJhc3NpZ24iLCJfcHJvdmlkZUNvbXBvbmVudHMiLCJjb21wb25lbnRzIiwiX2NyZWF0ZU1keENvbnRlbnQiLCJfbWlzc2luZ01keFJlZmVyZW5jZSIsImlkIiwiY29tcG9uZW50IiwiRXJyb3IiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpZWxkRGlzcGxheS5tZHgiXSwic291cmNlc0NvbnRlbnQiOlsiVGhlIHNhbXBsZSAnRmllbGQgLSBEaXNwbGF5IE1vZGUnIHNob3dzIGhvdyB0byBtYW5pcHVsYXRlIHRoZSBkYXRhIGJpbmRpbmcgaW4gdGhlIGdlbmVyYXRlZCBUZXh0IGNvbnRyb2wuIFRoaXMgc2FtcGxlIHNob3dzIGhvdyB0byBhcHBseSBkaWZmZXJlbnQgYW5ub3RhdGlvbnMgdG8gdGhlIGZpZWxkIGJ1aWxkaW5nIGJsb2NrIHRvIHNob3cgZGlmZmVyZW50IHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgZmllbGQuXG5cbjxCdWlsZGluZ0Jsb2NrUGxheWdyb3VuZCBiaW5kaW5nPVwiL1Jvb3RFbnRpdHkoJzEnKVwiPlxuXHR7YDxjb3JlOkZyYWdtZW50IGZyYWdtZW50TmFtZT1cInNhcC5mZS5jb3JlLmZwbUV4cGxvcmVyLmZpZWxkRGlzcGxheVN0eWxlcy5GaWVsZERpc3BsYXlcIiB0eXBlPVwiWE1MXCIgLz5cblx0XHRcdFx0XHRgfVxuPC9CdWlsZGluZ0Jsb2NrUGxheWdyb3VuZD5cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O1dBQUFBLEtBQUEsQ0FBQUMsU0FBQTtNQUFBQyxRQUFBLEdBQUFDLElBQUEsQ0FBQUMsV0FBQSxDQUFBQyxDQUFBO1FBQUFILFFBQUE7TUFBME8sQ0FBRCxDQUFDLFFBRTFPQyxJQUFBLENBQUFHLHVCQUFBO1FBQUFDLE9BQUE7UUFBQUwsUUFBQSxFQUNFO0FBQ0Y7TUFBTSxDQUNtQixDQUFDO0lBQUEsQ0FDMUI7RUFBQTtFQUFBLFNBQUFNLFdBQUE7SUFBQSxJQUFBQyxLQUFBLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxRQUFBRCxTQUFBLFFBQUFFLFNBQUEsR0FBQUYsU0FBQTtJQUFBO01BQUFHLE9BQUEsRUFBQUM7SUFBQSxJQUFBQyxNQUFBLENBQUFDLE1BQUEsS0FBQUMsa0JBQUEsSUFBQVIsS0FBQSxDQUFBUyxVQUFBO0lBQUEsT0FBQUosU0FBQSxHQUFBWCxJQUFBLENBQUFXLFNBQUE7TUFBQSxHQUFBTCxLQUFBO01BQUFQLFFBQUEsRUFBQUMsSUFBQSxDQUFBZ0IsaUJBQUE7UUFBQSxHQUFBVjtNQUFBO0lBQUEsS0FBQVUsaUJBQUEsQ0FBQVYsS0FBQTtFQUFBO0VBQUEsT0FBQUQsVUFBQTtFQUFBLFNBQUFZLHFCQUFBQyxFQUFBLEVBQUFDLFNBQUE7SUFBQSxVQUFBQyxLQUFBLGdCQUFBRCxTQUFBLG9DQUFBRCxFQUFBO0VBQUE7QUFBQSIsImlnbm9yZUxpc3QiOltdfQ==