/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/mdx-runtime/useMDXComponents", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs", "sap/fe/base/jsx-runtime/Fragment"], function (_provideComponents, _jsx, _jsxs, _Fragment) {
  "use strict";

  function _createMdxContent(props) {
    const _components = Object.assign({
        p: "p",
        h2: "h2",
        ul: "ul",
        li: "li"
      }, _provideComponents(), props.components),
      {
        BuildingBlockPlayground
      } = _components;
    if (!BuildingBlockPlayground) _missingMdxReference("BuildingBlockPlayground", true);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.p, {
        children: "There are several different ways to implement a Field building block showing a link that might open a quick view."
      }), "\n", _jsx(_components.h2, {
        children: "Field that Opens a QuickView Showing QuickViewFacets for an Entity"
      }), "\n", _jsx(_components.p, {
        children: "In our example, RootEntity has a 1:1 navigation property _NavProp1 to NavEntity. NavEntity is annotated with UI.QuickViewFacets"
      }), "\n", _jsx(_components.p, {
        children: "You can implement a field that shows a quick view for NavEntity if you meet the following conditions:"
      }), "\n", _jsxs(_components.ul, {
        children: ["\n", _jsx(_components.li, {
          children: "you use a property that is a referential constraint of a 1:1 navigation pointing to NavEntity"
        }), "\n", _jsx(_components.li, {
          children: "you use a property that is a key or a semantic key of NavEntity via the navigation property"
        }), "\n"]
      }), "\n", _jsx(_components.p, {
        children: "The quick view popup shows the following:"
      }), "\n", _jsxs(_components.ul, {
        children: ["\n", _jsx(_components.li, {
          children: "a Form for FieldGroup annotations defined in the UI.QuickViewFacets annotation"
        }), "\n", _jsx(_components.li, {
          children: "a Form for Contact annotations defined in UI.QuickViewFacets"
        }), "\n"]
      }), "\n", _jsx(_components.h2, {
        children: "Implementing a Field that Opens a Contact Card"
      }), "\n", _jsx(_components.p, {
        children: "You can show a contact card by using a metapath that points to a DataFieldForAnnotation that in turn targets a Communication.Contact.\nThe field shows the full name of the contact person and clicking on it displays the contact card."
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<core:Fragment fragmentName="sap.fe.core.fpmExplorer.fieldQuickView.FieldQuickView" type="XML" />
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfanN4cyIsIl9GcmFnbWVudCIsImNoaWxkcmVuIiwiX2pzeCIsIl9jb21wb25lbnRzIiwicCIsImgyIiwidWwiLCJsaSIsIkJ1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kIiwiYmluZGluZyIsIk1EWENvbnRlbnQiLCJwcm9wcyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIndyYXBwZXIiLCJNRFhMYXlvdXQiLCJPYmplY3QiLCJhc3NpZ24iLCJfcHJvdmlkZUNvbXBvbmVudHMiLCJjb21wb25lbnRzIiwiX2NyZWF0ZU1keENvbnRlbnQiLCJfbWlzc2luZ01keFJlZmVyZW5jZSIsImlkIiwiY29tcG9uZW50IiwiRXJyb3IiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkZpZWxkQmFzZS5tZHgiXSwic291cmNlc0NvbnRlbnQiOlsiVGhlcmUgYXJlIHNldmVyYWwgZGlmZmVyZW50IHdheXMgdG8gaW1wbGVtZW50IGEgRmllbGQgYnVpbGRpbmcgYmxvY2sgc2hvd2luZyBhIGxpbmsgdGhhdCBtaWdodCBvcGVuIGEgcXVpY2sgdmlldy5cblxuIyMgRmllbGQgdGhhdCBPcGVucyBhIFF1aWNrVmlldyBTaG93aW5nIFF1aWNrVmlld0ZhY2V0cyBmb3IgYW4gRW50aXR5XG5cbkluIG91ciBleGFtcGxlLCBSb290RW50aXR5IGhhcyBhIDE6MSBuYXZpZ2F0aW9uIHByb3BlcnR5IFxcX05hdlByb3AxIHRvIE5hdkVudGl0eS4gTmF2RW50aXR5IGlzIGFubm90YXRlZCB3aXRoIFVJLlF1aWNrVmlld0ZhY2V0c1xuXG5Zb3UgY2FuIGltcGxlbWVudCBhIGZpZWxkIHRoYXQgc2hvd3MgYSBxdWljayB2aWV3IGZvciBOYXZFbnRpdHkgaWYgeW91IG1lZXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4tICAgeW91IHVzZSBhIHByb3BlcnR5IHRoYXQgaXMgYSByZWZlcmVudGlhbCBjb25zdHJhaW50IG9mIGEgMToxIG5hdmlnYXRpb24gcG9pbnRpbmcgdG8gTmF2RW50aXR5XG4tICAgeW91IHVzZSBhIHByb3BlcnR5IHRoYXQgaXMgYSBrZXkgb3IgYSBzZW1hbnRpYyBrZXkgb2YgTmF2RW50aXR5IHZpYSB0aGUgbmF2aWdhdGlvbiBwcm9wZXJ0eVxuXG5UaGUgcXVpY2sgdmlldyBwb3B1cCBzaG93cyB0aGUgZm9sbG93aW5nOlxuXG4tICAgYSBGb3JtIGZvciBGaWVsZEdyb3VwIGFubm90YXRpb25zIGRlZmluZWQgaW4gdGhlIFVJLlF1aWNrVmlld0ZhY2V0cyBhbm5vdGF0aW9uXG4tICAgYSBGb3JtIGZvciBDb250YWN0IGFubm90YXRpb25zIGRlZmluZWQgaW4gVUkuUXVpY2tWaWV3RmFjZXRzXG5cbiMjIEltcGxlbWVudGluZyBhIEZpZWxkIHRoYXQgT3BlbnMgYSBDb250YWN0IENhcmRcblxuWW91IGNhbiBzaG93IGEgY29udGFjdCBjYXJkIGJ5IHVzaW5nIGEgbWV0YXBhdGggdGhhdCBwb2ludHMgdG8gYSBEYXRhRmllbGRGb3JBbm5vdGF0aW9uIHRoYXQgaW4gdHVybiB0YXJnZXRzIGEgQ29tbXVuaWNhdGlvbi5Db250YWN0LlxuVGhlIGZpZWxkIHNob3dzIHRoZSBmdWxsIG5hbWUgb2YgdGhlIGNvbnRhY3QgcGVyc29uIGFuZCBjbGlja2luZyBvbiBpdCBkaXNwbGF5cyB0aGUgY29udGFjdCBjYXJkLlxuXG48QnVpbGRpbmdCbG9ja1BsYXlncm91bmQgYmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIj5cblx0e2A8Y29yZTpGcmFnbWVudCBmcmFnbWVudE5hbWU9XCJzYXAuZmUuY29yZS5mcG1FeHBsb3Jlci5maWVsZFF1aWNrVmlldy5GaWVsZFF1aWNrVmlld1wiIHR5cGU9XCJYTUxcIiAvPlxuXHRcdFx0XHRcdGB9XG48L0J1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kPlxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FBQUEsS0FBQSxDQUFBQyxTQUFBO01BQUFDLFFBQUEsR0FBQUMsSUFBQSxDQUFBQyxXQUFBLENBQUFDLENBQUE7UUFBQUgsUUFBQTtNQUFpSCxDQUFELENBQUMsUUFFakhDLElBQUEsQ0FBQUMsV0FBQSxDQUFBRSxFQUFBO1FBQUFKLFFBQUEsRUFBRztNQUFrRSxDQUFELENBQUMsUUFFckVDLElBQUEsQ0FBQUMsV0FBQSxDQUFBQyxDQUFBO1FBQUFILFFBQUE7TUFBZ0ksQ0FBRCxDQUFDLFFBRWhJQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUMsQ0FBQTtRQUFBSCxRQUFBO01BQXFHLENBQUQsQ0FBQyxRQUVyR0YsS0FBQSxDQUFBSSxXQUFBLENBQUFHLEVBQUE7UUFBQUwsUUFBQSxTQUFBQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUksRUFBQTtVQUFBTixRQUFBLEVBQUk7UUFBNkYsQ0FBRCxDQUFDLFFBQ2pHQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUksRUFBQTtVQUFBTixRQUFBLEVBQUk7UUFBMkYsQ0FBRCxDQUFDO01BQUEsQ0FBRCxDQUFDLFFBRS9GQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUMsQ0FBQTtRQUFBSCxRQUFBO01BQXlDLENBQUQsQ0FBQyxRQUV6Q0YsS0FBQSxDQUFBSSxXQUFBLENBQUFHLEVBQUE7UUFBQUwsUUFBQSxTQUFBQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUksRUFBQTtVQUFBTixRQUFBLEVBQUk7UUFBOEUsQ0FBRCxDQUFDLFFBQ2xGQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUksRUFBQTtVQUFBTixRQUFBLEVBQUk7UUFBNEQsQ0FBRCxDQUFDO01BQUEsQ0FBRCxDQUFDLFFBRWhFQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUUsRUFBQTtRQUFBSixRQUFBLEVBQUc7TUFBOEMsQ0FBRCxDQUFDLFFBRWpEQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUMsQ0FBQTtRQUFBSCxRQUFBO01BQ2lHLENBQUQsQ0FBQyxRQUVqR0MsSUFBQSxDQUFBTSx1QkFBQTtRQUFBQyxPQUFBO1FBQUFSLFFBQUEsRUFDRTtBQUNGO01BQU0sQ0FDbUIsQ0FBQztJQUFBLENBQzFCO0VBQUE7RUFBQSxTQUFBUyxXQUFBO0lBQUEsSUFBQUMsS0FBQSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUE7SUFBQTtNQUFBRyxPQUFBLEVBQUFDO0lBQUEsSUFBQUMsTUFBQSxDQUFBQyxNQUFBLEtBQUFDLGtCQUFBLElBQUFSLEtBQUEsQ0FBQVMsVUFBQTtJQUFBLE9BQUFKLFNBQUEsR0FBQWQsSUFBQSxDQUFBYyxTQUFBO01BQUEsR0FBQUwsS0FBQTtNQUFBVixRQUFBLEVBQUFDLElBQUEsQ0FBQW1CLGlCQUFBO1FBQUEsR0FBQVY7TUFBQTtJQUFBLEtBQUFVLGlCQUFBLENBQUFWLEtBQUE7RUFBQTtFQUFBLE9BQUFELFVBQUE7RUFBQSxTQUFBWSxxQkFBQUMsRUFBQSxFQUFBQyxTQUFBO0lBQUEsVUFBQUMsS0FBQSxnQkFBQUQsU0FBQSxvQ0FBQUQsRUFBQTtFQUFBO0FBQUEiLCJpZ25vcmVMaXN0IjpbXX0=