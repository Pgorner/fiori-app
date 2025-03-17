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
        pre: "pre",
        code: "code",
        ul: "ul",
        li: "li"
      }, _provideComponents(), props.components),
      {
        BuildingBlockPlayground
      } = _components;
    if (!BuildingBlockPlayground) _missingMdxReference("BuildingBlockPlayground", true);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.p, {
        children: "You can interact with the examples shown in the documentation by modifying the exposed files such as the CAP CDS file."
      }), "\n", _jsx(_components.p, {
        children: "When creating a Field building block, you must provide an ID to ensure everything works correctly."
      }), "\n", _jsx(_components.h2, {
        children: "metaPath and contextPath"
      }), "\n", _jsx(_components.p, {
        children: "To determine what should be used in the field building block, we use its metaPath and contextPath. This information determines the target object for the field building block.\nThe metaPath is mandatory and is relative to the contextPath.\nThe contextPath, if not filled, relates to the context of the page."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:Field metaPath=\"StringProperty\" readOnly=\"true\" id=\"StringProperty\" />\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<macros:Field xmlns:macros="sap.fe.macros" metaPath="StringProperty" readOnly="true" id="StringProperty" />
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.p, {
        children: "You can define a field using a 1:1 navigation"
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:Field metaPath=\"_OneToOne/Description\" readOnly=\"true\" id=\"OneToOne\" />\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<macros:Field xmlns:macros="sap.fe.macros"  metaPath="_OneToOne/Description" readOnly="true" id="OneToOne" />
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.p, {
        children: "The metaPath can point to one of the following:"
      }), "\n", _jsxs(_components.ul, {
        children: ["\n", _jsx(_components.li, {
          children: "a property"
        }), "\n", _jsx(_components.li, {
          children: "a DataField"
        }), "\n", _jsx(_components.li, {
          children: "a DataPoint annotation"
        }), "\n"]
      }), "\n", _jsx(_components.p, {
        children: "To Point to a DataField we need to point to an annotation like a FieldGroup with its Qualifier and its Data aggregation."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:Field metaPath=\"@com.sap.vocabularies.UI.v1.FieldGroup#Default/Data/0\" readOnly=\"true\" id=\"annotation\" />\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<macros:Field xmlns:macros="sap.fe.macros"  metaPath="@com.sap.vocabularies.UI.v1.FieldGroup#Default/Data/0" readOnly="true" id="annotation" />
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.p, {
        children: "When do we need to use a contextPath?"
      }), "\n", _jsx(_components.p, {
        children: "Let's break down the example below:"
      }), "\n", _jsxs(_components.ul, {
        children: ["\n", _jsx(_components.li, {
          children: "The controls within the cells have a binding context that is different from the binding context of the page"
        }), "\n", _jsx(_components.li, {
          children: "To be able to use a field building block in the ColumnListItem, an explicit contextPath is required"
        }), "\n"]
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<m:Table items=\"{/ChildEntity}\">\n\t<m:columns>\n\t\t<m:Column>\n\t\t\t<m:Text text=\"description\" />\n\t\t</m:Column>\n\t</m:columns>\n\t<m:items>\n\t\t<m:ColumnListItem vAlign=\"Middle\">\n\t\t\t<m:cells>\n\t\t\t\t<macros:Field metaPath=\"Description\" contextPath=\"/ChildEntity\" readOnly=\"true\" id=\"ChildDescription\" />\n\t\t\t</m:cells>\n\t\t</m:ColumnListItem>\n\t</m:items>\n</m:Table>\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<m:Table items="{/ChildEntity}">
	<m:columns>
		<m:Column>
			<m:Text text="description"/>
		</m:Column>
	</m:columns>
	<m:items>
		<m:ColumnListItem vAlign="Middle">
			<m:cells>
				<macros:Field metaPath="Description" contextPath="/ChildEntity" readOnly="true" id="ChildDescription"/>
			</m:cells>
		</m:ColumnListItem>
	</m:items>
</m:Table>
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Formatting with Types"
      }), "\n", _jsx(_components.p, {
        children: "The field building block manages the formatting of the value according to the type. For instance, here we instantiate property 'TimeProperty' that comes with type Edm.TimeOfDay:"
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:Field metaPath=\"TimeProperty\" readOnly=\"true\" id=\"TimeProperty\" />\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<macros:Field xmlns:macros="sap.fe.macros" metaPath="TimeProperty" readOnly="true" id="TimeProperty" />`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Text and TextArrangement"
      }), "\n", _jsx(_components.p, {
        children: "The field building block manages the Text and TextArrangement annotation if the property or the DataField value used in its metapath is annotated with it."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<m:VBox>\n\t<macros:Field\n\t\txmlns:macros=\"sap.fe.macros\"\n\t\tmetaPath=\"PropertyWithTextAndTextArrangementTextOnly\"\n\t\treadOnly=\"true\"\n\t\tid=\"TextArrangementTextOnlyProperty\"\n\t/>\n\t<macros:Field xmlns:macros=\"sap.fe.macros\" metaPath=\"PropertyWithText\" readOnly=\"true\" id=\"PropertyWithText\" />\n</m:VBox>\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<m:VBox>
<macros:Field xmlns:macros="sap.fe.macros"
		metaPath="PropertyWithTextAndTextArrangementTextOnly"
		readOnly="true"
		id="TextArrangementTextOnlyProperty" />
<macros:Field xmlns:macros="sap.fe.macros"
		metaPath="PropertyWithText"
		readOnly="true"
		id="PropertyWithText" />
</m:VBox>
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Unit of Measure or Currency"
      }), "\n", _jsx(_components.p, {
        children: "We used the UI5 type for unit and currencies. For the currency a sap.ui.currency control is used."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<m:VBox>\n\t<macros:Field xmlns:macros=\"sap.fe.macros\" metaPath=\"PropertyWithCurrency\" readOnly=\"true\" id=\"PropertyWithCurrency\" />\n\t<macros:Field xmlns:macros=\"sap.fe.macros\" metaPath=\"PropertyWithUnit\" readOnly=\"true\" id=\"PropertyWithUnit\" />\n</m:VBox>\n"
        })
      }), "\n", _jsx(BuildingBlockPlayground, {
        binding: "/RootEntity('1')",
        children: `<m:VBox>
<macros:Field xmlns:macros="sap.fe.macros"
		metaPath="PropertyWithCurrency" readOnly="true" id="PropertyWithCurrency" />
<macros:Field xmlns:macros="sap.fe.macros"
		metaPath="PropertyWithUnit" readOnly="true" id="PropertyWithUnit" />
</m:VBox>
					`
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfanN4cyIsIl9GcmFnbWVudCIsImNoaWxkcmVuIiwiX2pzeCIsIl9jb21wb25lbnRzIiwicCIsImgyIiwicHJlIiwiY29kZSIsImNsYXNzTmFtZSIsIkJ1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kIiwiYmluZGluZyIsInVsIiwibGkiLCJNRFhDb250ZW50IiwicHJvcHMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJ3cmFwcGVyIiwiTURYTGF5b3V0IiwiT2JqZWN0IiwiYXNzaWduIiwiX3Byb3ZpZGVDb21wb25lbnRzIiwiY29tcG9uZW50cyIsIl9jcmVhdGVNZHhDb250ZW50IiwiX21pc3NpbmdNZHhSZWZlcmVuY2UiLCJpZCIsImNvbXBvbmVudCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJGaWVsZEJhc2UubWR4Il0sInNvdXJjZXNDb250ZW50IjpbIllvdSBjYW4gaW50ZXJhY3Qgd2l0aCB0aGUgZXhhbXBsZXMgc2hvd24gaW4gdGhlIGRvY3VtZW50YXRpb24gYnkgbW9kaWZ5aW5nIHRoZSBleHBvc2VkIGZpbGVzIHN1Y2ggYXMgdGhlIENBUCBDRFMgZmlsZS5cblxuV2hlbiBjcmVhdGluZyBhIEZpZWxkIGJ1aWxkaW5nIGJsb2NrLCB5b3UgbXVzdCBwcm92aWRlIGFuIElEIHRvIGVuc3VyZSBldmVyeXRoaW5nIHdvcmtzIGNvcnJlY3RseS5cblxuIyMgbWV0YVBhdGggYW5kIGNvbnRleHRQYXRoXG5cblRvIGRldGVybWluZSB3aGF0IHNob3VsZCBiZSB1c2VkIGluIHRoZSBmaWVsZCBidWlsZGluZyBibG9jaywgd2UgdXNlIGl0cyBtZXRhUGF0aCBhbmQgY29udGV4dFBhdGguIFRoaXMgaW5mb3JtYXRpb24gZGV0ZXJtaW5lcyB0aGUgdGFyZ2V0IG9iamVjdCBmb3IgdGhlIGZpZWxkIGJ1aWxkaW5nIGJsb2NrLlxuVGhlIG1ldGFQYXRoIGlzIG1hbmRhdG9yeSBhbmQgaXMgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHRQYXRoLlxuVGhlIGNvbnRleHRQYXRoLCBpZiBub3QgZmlsbGVkLCByZWxhdGVzIHRvIHRoZSBjb250ZXh0IG9mIHRoZSBwYWdlLlxuXG5gYGB4bWxcbjxtYWNyb3M6RmllbGQgbWV0YVBhdGg9XCJTdHJpbmdQcm9wZXJ0eVwiIHJlYWRPbmx5PVwidHJ1ZVwiIGlkPVwiU3RyaW5nUHJvcGVydHlcIiAvPlxuYGBgXG5cbjxCdWlsZGluZ0Jsb2NrUGxheWdyb3VuZCBiaW5kaW5nPVwiL1Jvb3RFbnRpdHkoJzEnKVwiPlxuXHR7YDxtYWNyb3M6RmllbGQgeG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiIG1ldGFQYXRoPVwiU3RyaW5nUHJvcGVydHlcIiByZWFkT25seT1cInRydWVcIiBpZD1cIlN0cmluZ1Byb3BlcnR5XCIgLz5cblx0XHRcdFx0XHRgfVxuPC9CdWlsZGluZ0Jsb2NrUGxheWdyb3VuZD5cblxuJm5ic3A7XG5cbllvdSBjYW4gZGVmaW5lIGEgZmllbGQgdXNpbmcgYSAxOjEgbmF2aWdhdGlvblxuXG5gYGB4bWxcbjxtYWNyb3M6RmllbGQgbWV0YVBhdGg9XCJfT25lVG9PbmUvRGVzY3JpcHRpb25cIiByZWFkT25seT1cInRydWVcIiBpZD1cIk9uZVRvT25lXCIgLz5cbmBgYFxuXG48QnVpbGRpbmdCbG9ja1BsYXlncm91bmQgYmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIj5cblx0e2A8bWFjcm9zOkZpZWxkIHhtbG5zOm1hY3Jvcz1cInNhcC5mZS5tYWNyb3NcIiAgbWV0YVBhdGg9XCJfT25lVG9PbmUvRGVzY3JpcHRpb25cIiByZWFkT25seT1cInRydWVcIiBpZD1cIk9uZVRvT25lXCIgLz5cblx0XHRcdFx0XHRgfVxuPC9CdWlsZGluZ0Jsb2NrUGxheWdyb3VuZD5cbiZuYnNwO1xuXG5UaGUgbWV0YVBhdGggY2FuIHBvaW50IHRvIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuXG4tICAgYSBwcm9wZXJ0eVxuLSAgIGEgRGF0YUZpZWxkXG4tICAgYSBEYXRhUG9pbnQgYW5ub3RhdGlvblxuXG5UbyBQb2ludCB0byBhIERhdGFGaWVsZCB3ZSBuZWVkIHRvIHBvaW50IHRvIGFuIGFubm90YXRpb24gbGlrZSBhIEZpZWxkR3JvdXAgd2l0aCBpdHMgUXVhbGlmaWVyIGFuZCBpdHMgRGF0YSBhZ2dyZWdhdGlvbi5cblxuYGBgeG1sXG48bWFjcm9zOkZpZWxkIG1ldGFQYXRoPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXAjRGVmYXVsdC9EYXRhLzBcIiByZWFkT25seT1cInRydWVcIiBpZD1cImFubm90YXRpb25cIiAvPlxuYGBgXG5cbjxCdWlsZGluZ0Jsb2NrUGxheWdyb3VuZCBiaW5kaW5nPVwiL1Jvb3RFbnRpdHkoJzEnKVwiPlxuXHR7YDxtYWNyb3M6RmllbGQgeG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiICBtZXRhUGF0aD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwI0RlZmF1bHQvRGF0YS8wXCIgcmVhZE9ubHk9XCJ0cnVlXCIgaWQ9XCJhbm5vdGF0aW9uXCIgLz5cblx0XHRcdFx0XHRgfVxuPC9CdWlsZGluZ0Jsb2NrUGxheWdyb3VuZD5cbiZuYnNwO1xuXG5XaGVuIGRvIHdlIG5lZWQgdG8gdXNlIGEgY29udGV4dFBhdGg/XG5cbkxldCdzIGJyZWFrIGRvd24gdGhlIGV4YW1wbGUgYmVsb3c6XG5cbi0gICBUaGUgY29udHJvbHMgd2l0aGluIHRoZSBjZWxscyBoYXZlIGEgYmluZGluZyBjb250ZXh0IHRoYXQgaXMgZGlmZmVyZW50IGZyb20gdGhlIGJpbmRpbmcgY29udGV4dCBvZiB0aGUgcGFnZVxuLSAgIFRvIGJlIGFibGUgdG8gdXNlIGEgZmllbGQgYnVpbGRpbmcgYmxvY2sgaW4gdGhlIENvbHVtbkxpc3RJdGVtLCBhbiBleHBsaWNpdCBjb250ZXh0UGF0aCBpcyByZXF1aXJlZFxuXG5gYGB4bWxcbjxtOlRhYmxlIGl0ZW1zPVwiey9DaGlsZEVudGl0eX1cIj5cblx0PG06Y29sdW1ucz5cblx0XHQ8bTpDb2x1bW4+XG5cdFx0XHQ8bTpUZXh0IHRleHQ9XCJkZXNjcmlwdGlvblwiIC8+XG5cdFx0PC9tOkNvbHVtbj5cblx0PC9tOmNvbHVtbnM+XG5cdDxtOml0ZW1zPlxuXHRcdDxtOkNvbHVtbkxpc3RJdGVtIHZBbGlnbj1cIk1pZGRsZVwiPlxuXHRcdFx0PG06Y2VsbHM+XG5cdFx0XHRcdDxtYWNyb3M6RmllbGQgbWV0YVBhdGg9XCJEZXNjcmlwdGlvblwiIGNvbnRleHRQYXRoPVwiL0NoaWxkRW50aXR5XCIgcmVhZE9ubHk9XCJ0cnVlXCIgaWQ9XCJDaGlsZERlc2NyaXB0aW9uXCIgLz5cblx0XHRcdDwvbTpjZWxscz5cblx0XHQ8L206Q29sdW1uTGlzdEl0ZW0+XG5cdDwvbTppdGVtcz5cbjwvbTpUYWJsZT5cbmBgYFxuXG48QnVpbGRpbmdCbG9ja1BsYXlncm91bmQgYmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIj5cblx0e2A8bTpUYWJsZSBpdGVtcz1cInsvQ2hpbGRFbnRpdHl9XCI+XG5cdDxtOmNvbHVtbnM+XG5cdFx0PG06Q29sdW1uPlxuXHRcdFx0PG06VGV4dCB0ZXh0PVwiZGVzY3JpcHRpb25cIi8+XG5cdFx0PC9tOkNvbHVtbj5cblx0PC9tOmNvbHVtbnM+XG5cdDxtOml0ZW1zPlxuXHRcdDxtOkNvbHVtbkxpc3RJdGVtIHZBbGlnbj1cIk1pZGRsZVwiPlxuXHRcdFx0PG06Y2VsbHM+XG5cdFx0XHRcdDxtYWNyb3M6RmllbGQgbWV0YVBhdGg9XCJEZXNjcmlwdGlvblwiIGNvbnRleHRQYXRoPVwiL0NoaWxkRW50aXR5XCIgcmVhZE9ubHk9XCJ0cnVlXCIgaWQ9XCJDaGlsZERlc2NyaXB0aW9uXCIvPlxuXHRcdFx0PC9tOmNlbGxzPlxuXHRcdDwvbTpDb2x1bW5MaXN0SXRlbT5cblx0PC9tOml0ZW1zPlxuPC9tOlRhYmxlPlxuXHRcdFx0XHRcdGB9XG48L0J1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kPlxuJm5ic3A7XG5cbiMjIEZvcm1hdHRpbmcgd2l0aCBUeXBlc1xuXG5UaGUgZmllbGQgYnVpbGRpbmcgYmxvY2sgbWFuYWdlcyB0aGUgZm9ybWF0dGluZyBvZiB0aGUgdmFsdWUgYWNjb3JkaW5nIHRvIHRoZSB0eXBlLiBGb3IgaW5zdGFuY2UsIGhlcmUgd2UgaW5zdGFudGlhdGUgcHJvcGVydHkgJ1RpbWVQcm9wZXJ0eScgdGhhdCBjb21lcyB3aXRoIHR5cGUgRWRtLlRpbWVPZkRheTpcblxuYGBgeG1sXG48bWFjcm9zOkZpZWxkIG1ldGFQYXRoPVwiVGltZVByb3BlcnR5XCIgcmVhZE9ubHk9XCJ0cnVlXCIgaWQ9XCJUaW1lUHJvcGVydHlcIiAvPlxuYGBgXG5cbjxCdWlsZGluZ0Jsb2NrUGxheWdyb3VuZCBiaW5kaW5nPVwiL1Jvb3RFbnRpdHkoJzEnKVwiPlxuXHR7YDxtYWNyb3M6RmllbGQgeG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiIG1ldGFQYXRoPVwiVGltZVByb3BlcnR5XCIgcmVhZE9ubHk9XCJ0cnVlXCIgaWQ9XCJUaW1lUHJvcGVydHlcIiAvPmB9XG48L0J1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kPlxuJm5ic3A7XG5cbiMjIFRleHQgYW5kIFRleHRBcnJhbmdlbWVudFxuXG5UaGUgZmllbGQgYnVpbGRpbmcgYmxvY2sgbWFuYWdlcyB0aGUgVGV4dCBhbmQgVGV4dEFycmFuZ2VtZW50IGFubm90YXRpb24gaWYgdGhlIHByb3BlcnR5IG9yIHRoZSBEYXRhRmllbGQgdmFsdWUgdXNlZCBpbiBpdHMgbWV0YXBhdGggaXMgYW5ub3RhdGVkIHdpdGggaXQuXG5cbmBgYHhtbFxuPG06VkJveD5cblx0PG1hY3JvczpGaWVsZFxuXHRcdHhtbG5zOm1hY3Jvcz1cInNhcC5mZS5tYWNyb3NcIlxuXHRcdG1ldGFQYXRoPVwiUHJvcGVydHlXaXRoVGV4dEFuZFRleHRBcnJhbmdlbWVudFRleHRPbmx5XCJcblx0XHRyZWFkT25seT1cInRydWVcIlxuXHRcdGlkPVwiVGV4dEFycmFuZ2VtZW50VGV4dE9ubHlQcm9wZXJ0eVwiXG5cdC8+XG5cdDxtYWNyb3M6RmllbGQgeG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiIG1ldGFQYXRoPVwiUHJvcGVydHlXaXRoVGV4dFwiIHJlYWRPbmx5PVwidHJ1ZVwiIGlkPVwiUHJvcGVydHlXaXRoVGV4dFwiIC8+XG48L206VkJveD5cbmBgYFxuXG48QnVpbGRpbmdCbG9ja1BsYXlncm91bmQgYmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIj5cblx0e2A8bTpWQm94PlxuPG1hY3JvczpGaWVsZCB4bWxuczptYWNyb3M9XCJzYXAuZmUubWFjcm9zXCJcblx0XHRtZXRhUGF0aD1cIlByb3BlcnR5V2l0aFRleHRBbmRUZXh0QXJyYW5nZW1lbnRUZXh0T25seVwiXG5cdFx0cmVhZE9ubHk9XCJ0cnVlXCJcblx0XHRpZD1cIlRleHRBcnJhbmdlbWVudFRleHRPbmx5UHJvcGVydHlcIiAvPlxuPG1hY3JvczpGaWVsZCB4bWxuczptYWNyb3M9XCJzYXAuZmUubWFjcm9zXCJcblx0XHRtZXRhUGF0aD1cIlByb3BlcnR5V2l0aFRleHRcIlxuXHRcdHJlYWRPbmx5PVwidHJ1ZVwiXG5cdFx0aWQ9XCJQcm9wZXJ0eVdpdGhUZXh0XCIgLz5cbjwvbTpWQm94PlxuXHRcdFx0XHRcdGB9XG48L0J1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kPlxuJm5ic3A7XG5cbiMjIFVuaXQgb2YgTWVhc3VyZSBvciBDdXJyZW5jeVxuXG5XZSB1c2VkIHRoZSBVSTUgdHlwZSBmb3IgdW5pdCBhbmQgY3VycmVuY2llcy4gRm9yIHRoZSBjdXJyZW5jeSBhIHNhcC51aS5jdXJyZW5jeSBjb250cm9sIGlzIHVzZWQuXG5cbmBgYHhtbFxuPG06VkJveD5cblx0PG1hY3JvczpGaWVsZCB4bWxuczptYWNyb3M9XCJzYXAuZmUubWFjcm9zXCIgbWV0YVBhdGg9XCJQcm9wZXJ0eVdpdGhDdXJyZW5jeVwiIHJlYWRPbmx5PVwidHJ1ZVwiIGlkPVwiUHJvcGVydHlXaXRoQ3VycmVuY3lcIiAvPlxuXHQ8bWFjcm9zOkZpZWxkIHhtbG5zOm1hY3Jvcz1cInNhcC5mZS5tYWNyb3NcIiBtZXRhUGF0aD1cIlByb3BlcnR5V2l0aFVuaXRcIiByZWFkT25seT1cInRydWVcIiBpZD1cIlByb3BlcnR5V2l0aFVuaXRcIiAvPlxuPC9tOlZCb3g+XG5gYGBcblxuPEJ1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kIGJpbmRpbmc9XCIvUm9vdEVudGl0eSgnMScpXCI+XG5cdHtgPG06VkJveD5cbjxtYWNyb3M6RmllbGQgeG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0bWV0YVBhdGg9XCJQcm9wZXJ0eVdpdGhDdXJyZW5jeVwiIHJlYWRPbmx5PVwidHJ1ZVwiIGlkPVwiUHJvcGVydHlXaXRoQ3VycmVuY3lcIiAvPlxuPG1hY3JvczpGaWVsZCB4bWxuczptYWNyb3M9XCJzYXAuZmUubWFjcm9zXCJcblx0XHRtZXRhUGF0aD1cIlByb3BlcnR5V2l0aFVuaXRcIiByZWFkT25seT1cInRydWVcIiBpZD1cIlByb3BlcnR5V2l0aFVuaXRcIiAvPlxuPC9tOlZCb3g+XG5cdFx0XHRcdFx0YH1cbjwvQnVpbGRpbmdCbG9ja1BsYXlncm91bmQ+XG4mbmJzcDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FBQUEsS0FBQSxDQUFBQyxTQUFBO01BQUFDLFFBQUEsR0FBQUMsSUFBQSxDQUFBQyxXQUFBLENBQUFDLENBQUE7UUFBQUgsUUFBQTtNQUFzSCxDQUFELENBQUMsUUFFdEhDLElBQUEsQ0FBQUMsV0FBQSxDQUFBQyxDQUFBO1FBQUFILFFBQUE7TUFBa0csQ0FBRCxDQUFDLFFBRWxHQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUUsRUFBQTtRQUFBSixRQUFBLEVBQUc7TUFBd0IsQ0FBRCxDQUFDLFFBRTNCQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUMsQ0FBQTtRQUFBSCxRQUFBO01BRW1FLENBQUQsQ0FBQyxRQUVuRUMsSUFBQSxDQUFBQyxXQUFBLENBQUFHLEdBQUE7UUFBQUwsUUFBQSxFQUFBQyxJQUFBLENBQUFDLFdBQUEsQ0FBQUksSUFBQTtVQUFBQyxTQUFBO1VBQUFQLFFBQUE7UUFBQSxD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