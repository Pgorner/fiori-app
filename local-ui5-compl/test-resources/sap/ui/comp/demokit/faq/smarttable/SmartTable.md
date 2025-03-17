<details>
<summary><b>1. How can I enable personalization for custom columns, and how do they differ from the regular ones, especially when used with personalization settings or the spreadsheet export?</b></summary>

You can specify custom data for the personalization of the columns in your table as shown in the examples.

First example for a normal aggregation:

```
<table:Column id="Ledger" minScreenWidth="Tablet" demandPopin="true">
	<table:customData>
		<core:CustomData key="p13nData"
			value='\{"columnKey": "Ledger", "leadingProperty":"Ledger",
			"additionalProperty":"LedgerName", "sortProperty": "Ledger",
			"filterProperty": "Ledger", "type":"numeric"}' />
	</table:customData>
	<Label text="Ledger" />
	<table:template>
		<Text text="{Ledger}" />
	</table:template>
</table:Column>
```

To use the SAPUI5 shortcut notation, add the following namespace part in the XML view:
`xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"`

Second example for use of the shortcut notation:

```
<table:Column id="CompanyCode" minScreenWidth="Tablet" demandPopin="true"
	customData:p13nData='\{"columnKey": "CompanyCode", "leadingProperty":"CompanyCode", "additionalProperty":"CompanyName","sortProperty": "CompanyCode", "filterProperty": "CompanyCode", "type":"numeric", "maxLength":"4"}'>
	<Label text="Company Code" />
	<table:template>
		<Text text="{CompanyCode}" />
	</table:template>
</table:Column>
```

In the `p13nData` object you can specify the following properties:

* `columnKey`:
A unique key used to save, retrieve, or apply personalization for a column.
* `leadingProperty`:
Retrieves data for the OData property specified here from the backend system when the column is made visible.
OData model property name must be used.
* `additionalProperty`:
Property has to be requested if a column is visible.
OData model property name must be used.
Multiple property names can be specified here as comma-separated values (CSV).
* `sortProperty`:
Sorts the table based on the column specified.
OData model property name must be used.
This property is similar to `sortProperty` of `sap.ui.table.Column` of the grid table and must only be used if the latter does not support this feature.
* `filterProperty`:
Filters the table with the condition that has been defined.
OData model property name must be used.
This property is similar to `filterProperty` of `sap.ui.table.Column` of the grid table and must only be used if the latter does not support this feature.
* `isGroupable`:
Shows a field in the *Group* panel of the *View Settings* dialog automatically; otherwise, a field might become visible only once the table (rows) are bound.
This property is only required for the type `AnalyticalTable`.`SmartTable` automatically sets this property to `true` if a field is sortable, filterable, and a dimension.
* `isTimezone`:
Defines whether a field represents an IANA time zone string. The time zones are displayed in the locale-specific translation.
* `type`:
Determines the type of a control; its value can be `date`, `time`, `boolean`, `numeric`, `stringdate`, `string`, or `undefined`. The control will be adapted according to the type.
`stringdate` is used to export fields with the `IsCalendarDate` annotation.
* `maxLength`:
Numeric value to restrict number of entries in input fields
* `precision`:
Numeric value for precision
* `scale`:
Numeric value for scale
* `nullable`:
Defines whether a field can have no value (and is then relevant for filtering with the *Empty* value). Consumers of the control can use the string value `false` to indicate that the field is not nullable. The default is `nullable`.
* `timezone`:
References a property with a dynamic time zone (line-item-specific). If not referenced,  it will use the IANA time zone returned by <code>sap.ui.core.Configuration</code>. For more information, see [API Reference] (api/sap.ui.core.Configuration%23methods/getTimezone).
* `ignorePaste`:
Ignores the column when pasting data in the SmartTable. Possible values are `true` and `false`.

**Note**
Some properties that also exist in a table, for example, in `sortProperty`, will take precedence if specified in both places.

The following additional properties are required in `p13nData` for proper formatting of custom columns for an SAPUI5-client-side export to the spreadsheet:

*`P13n` Properties for Custom Columns*
<table>
	<tr>
		<th>Property</th>
		<th>Explanation</th>
	</tr>
	<tr>
		<td><code>unit</code></td>
		<td>Name of the unit property to be used for unit of measure and currency formatting</td>
	</tr>
	<tr>
		<td><code>isCurrency</code></td>
		<td>If the column is of type <code>currency</code>, the amount with the currency is shown in the exported spreadsheet.</td>
	</tr>
	<tr>
		<td><code>align</code></td>
		<td>Configures the alignment of the column, for which you can use the same value as for the <code>hAlignproperty</code> of the column.</td>
	</tr>
	<tr>
		<td><code>edmType</code></td>
		<td>Actual <code>Edm.Type</code> of the OData property, which might be needed for proper formatting of columns in the spreadsheet. If <code>Edm.DateTime</code> or <code>Edm.DateTimeOffset</code> is affected, the corresponding <code>timezone</code> property must be assigned via <code>additionalProperty</code></td>
	</tr>
	<tr>
		<td><code>description</code></td>
		<td>Field that points to the description (<code>UI.Text</code> annotation) of this column, or, if custom-formatted columns are used, you can use the description that is used in the <code>formatter</code> function.</td>
	</tr>
	<tr>
		<td><code>displayBehaviour</code></td>
		<td>Various combinations of the description that are displayed on the UI in the following way:
		<ul>
			<li><code>descriptionOnly</code>: Shows a description only</li>
			<li><code>descriptionAndId</code>: Shows the description followed by the ID</li>
			<li><code>idAndDescription</code>: Shows the ID followed by the description</li>
			<li><code>idOnly</code>: Shows the ID only</li>
		</ul>
		</td>
	</tr>
	<tr>
		<td><code>width</code></td>
		<td>Width of the column, for which you must use the same value as for the column itself</td>
	</tr>
	<tr>
		<td><code>isDigitSequence</code></td>
		<td>Can be used for <code>Edm.String</code> columns that represent a numeric field with leading zeros. If set to <code>true</code>, the leading zeros are removed from this string field as the <code>number</code> format will be used in the spreadsheet.</td>
	</tr>
	<tr>
		<td><code>additionalSortProperty</code></td>
		<td>Can be used to enable sorting for semantically connected fields. The sortable properties must also be added to the <code>additionalProperty</code> custom data. Multiple property names can be specified as comma-separated values (CSV).</td>
	</tr>
</table>
</details>

<details>
<summary><b>2. Why do I not see any data for my manually added column in the XML view? And why do I get an error <i>Select at least one column to perform the search</i> even though I have added several columns manually to <code>sap.m.Table</code> inside the control?</b></summary>

You need to specify custom data with at least one `leadingProperty` for the table columns without a `leadingProperty` available in the control itself so the `SmartTable` control can fetch the data correctly.

```
<Column>
	<customData>
		<core:CustomData key="p13nData" value='\{"columnKey":"Id","leadingProperty": "Id","sortProperty": "Id","filterProperty": "Id"}'/>
	</customData>
	<Text text="Sales Order" />
</Column>
```

Without this, the `SmartTable` control cannot recognize the column.
</details>

<details>
<summary><b>3. How can I define columns with my own style, for example, using the formatting or the controls I require, in a responsive <code>SmartTable</code> control (<code>tableType="ResponsiveTable"</code>)?</b></summary>

For `sap.m.Table`, the responsive table, you need to provide a corresponding `ColumnListItem` in the `items` aggregation in addition to the columns, as you would when using this SAPUI5 table on its own.

```
<smartTable:SmartTable entitySet="Items"..>
	<Table>
		<!-- Columns must have unique IDs if table personalization service is used -->
		<columns>
			<Column id="Name" width="auto" minScreenWidth="Tablet" visible="false"
				customData:p13nData='\{"leadingProperty":"Name", "columnKey":"Name", "sortProperty":"Name", "type":"numeric"\}'>
				<header>
					<Label text="{/#Item/Name/@sap:label}"/>
				</header>
			</Column>
		</columns>
		<ColumnListItem id="columnListItem" vAlign="Middle" type="Navigation" press="onItemPressed">
			<cells>
				<Text text="{path:'Name', formatter:'my.own.formatter.functionName'}" maxLines="2"... />
			</cells>
		</ColumnListItem>
	</Table>
</smartTable:SmartTable>
```

The `sap.m.Table` control uses the `columns` aggregation for the header and the `items` aggregation containing `ColumnListItem` with cells for the template control that is cloned for each row in the table.

**Note**
For any supported SAPUI5 table, you can add custom columns in the XML view along with the required `customData` for the column.
</details>

<details>
<summary><b>4. How do I use the <code>SmartField</code> control in combination with the <code>SmartTable</code> control? And how can I make use of metadata and field controls to manage the state of editable fields in my table?</b></summary>

For editing scenarios with back-end metadata and field controls, it is recommended to use the `SmartField` control along with the `SmartTable` control. You can have `SmartTable` automatically create `SmartField` controls using the following code:

`<smartTable:SmartTable id="ItemsST" entitySet="Items" customData:useSmartField="true"...>`

To make this work, the `customData` namespace has to be defined correctly in the XML view to enable the SAPUI5 shortcut notation for custom data aggregations:

`xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"`
</details>

<details>
<summary><b>5. How do I format the group headers shown in a responsive <code>SmartTable</code> control (<code>tableType="ResponsiveTable"</code>)? And why is a technical key shown instead of a description when grouping is used in that table?</b></summary>

Grouping in a table of type `ResponsiveTable` is done by sorting table entries. You can define your own formatting for the group title in this table by specifying a group function for the first sorter.
For more information on how this can be done, see the [Code Sample](sample/sap.m.sample.TableViewSettingsDialog/code/SettingsDialogController.controller.js).

When using the `SmartTable` control, you can use the `beforeRebindTable` event and get the available sorters using the `bindingParams` (event parameter). Check if the first sorter there has a group.

```
onBeforeRebindTable: function(oEvent) {
	var mBindingParams = oEvent.getParameter("bindingParams");
	var oSorter = mBindingParams.sorter[0];
	//Check if sorter is for Grouping
	if (oSorter.vGroup) {
```

There are two options. The first option looks like this:

```
//Replace the Group function
	oSorter.fnGroup = this.mGroupFunctions[oSorter.sPath];
```

You can also do the following:

```
//Replace the Grouping sorter itself
	mBindingParams.sorter[0] = new Sorter(oSorter.sPath, bDescending, this.mGroupFunctions[oSorter.sPath]);
```

For more information on how to implement `this.mGroupFunction`, see the [Code Sample](sample/sap.m.sample.TableViewSettingsDialog/code/SettingsDialogController.controller.js).

You can replace group functions for the sorter or the sorter itself with the ones you have defined (with a formatter for the grouping based on the property) if the sorter is used for grouping.
</details>

<details>
<summary><b>6. How do I create and pass a search query <code>($search="foo")</code> when using the <code>SmartTable</code> control?</b></summary>

Use the `beforeRebindTable` event and implement this manually.

```
onBeforeRebindTable: function(oEvent) {
	var mBindingParams = oEvent.getParameter( "bindingParams" );
		mBindingParams.parameters[ "custom" ] = {
		search-focus: sBasicSearchFieldName, //  the name of the search field
		search : sBasicSearchText //  the search text itself!
	};
}
```

This will then be used internally when creating the table binding.

**Note**
In the same way, you can also add any custom URL parameters or use this event to add OData `$expand` parameters: Instead of `"custom"`, use `"expand"` as shown in the example above.
</details>

<details>
<summary><b>7. How do I get data for custom columns (icons, formatters etc.) that are not part of the columns/binding (<code>select = 'ColA,ColB,foo,bar'</code>) of the <code>SmartTable</code> control?</b></summary>

Use the `beforeRebindTable` event and implement this manually.

```
onBeforeRebindTable: function(oEvent) {
	var oBindingParams = oEvent.getParameter("bindingParams");
	if (oBindingParams.parameters.select.search("SomeIconCode1") < 0) {
		oBindingParams.parameters.select += ",SomeIconCode1";
	}
	if (oBindingParams.parameters.select.search("SomeIconCode2") < 0) {
		oBindingParams.parameters.select += ",SomeIconCode2";
	} ...
```

This will then be used internally when creating the table binding.

**Note**
If only one property is needed for a given column, you can also use `additionalProperty` in `customData` as already mentioned instead of the event-based approach as described here.

**Note**
For an `AnalyticalTable` control or `AnalyticalBinding`, you have to use a dummy column (`visible="false"`) with the `leadingProperty` you require and the set attribute `inResult="true"` instead.
</details>

<details>
<summary><b>8. I would like to pass my own custom sorters, filters, and binding parameters when binding the table data in the <code>SmartTable</code> control. How do I do this? And how can I have my own binding implementation for the control?</b></summary>

You can modify the array of filters before binding is triggered in the `SmartTable` control by listening to the `beforeRebindTable` event.
To enable this, your code in the XML view should look like this:

```
<smartTable:SmartTable entitySet="LineItemsSet" beforeRebindTable="onBeforeRebindTable"…
```

You can now get the list of filters and sorters to be used in table binding using the following:

```
onBeforeRebindTable: function(oEvent) {
	var mBindingParams = oEvent.getParameter("bindingParams");
	var aFilters = mBindingParams.filters
```

With this, you need to set back the value to `mBindingParams.filters`, and you can pass a new filter array as well.

**Note**
In some exceptional cases, you can set `mBindingParams.preventTableBind="true"` to prevent table binding from taking place (optional) and do the binding at a later point in time. This is shown in the following method:

```
someMethod: function() {
	//get the smartTable and call the method rebindTable()
	oSmartTable.rebindTable();
}
```

**Note**
If you would like to trigger the binding manually, use the `rebindTable` method of the `SmartTable` control and do not use `bindRows` in the underlying table.

**Note**
For a **custom multi-filter scenario**: If you want to pass multi-filters (filters combined with AND/OR explicitly) in your custom implementation, the SAPUI5 default logic in the core classes combines multiple multi-filters with an OR by default.
If you would like to use AND in combination with the multi-filters returned in the beforeRebindTable event of the `SmartTable` control (if a filter is set in `SmartFilter`) and your own `MultiFilter`, you have to replace the filters in the `beforeRebindTable` event with an explicit AND `MultiFilter`. There is currently no way to combine multiple multi-filters in the `SmartTable` control itself. You as the consumer of the control have to make sure you combine these multi-filters yourself by checking first if any internal multi-filters exist. You also have to ensure that the internal multi-filter is added first in the array of filters in the `beforeRebindTable` event.

```
onBeforeRebindTable: function(e) {
	var b = e.getParameter("bindingParams");
	var aDateFilters = [
		new sap.ui.model.Filter("BindingPeriodValidityEndDate",sap.ui.model.FilterOperator.LE,d),
		new sap.ui.model.Filter("BindingPeriodValidityEndDate",sap.ui.model.FilterOperator.GT, null),
		.....
	];
	var oOwnMultiFilter = new sap.ui.model.Filter(aDateFilters, true);

	//Special handling for multiple multi-filters
	if (b.filters[0] && b.filters[0].aFilters) {
		var oSmartTableMultiFilter = b.filters[0];
		// if an internal multi-filter exists then combine custom multi-filters and internal multi-filters with an AND
		b.filters[0] = new sap.ui.model.Filter([oSmartTableMultiFilter, oOwnMultiFilter], true);
	} else {
		b.filters.push(oOwnMultiFilter);
	}
}
```
</details>

<details>
<summary><b>9. How do I add custom toolbar buttons to the <code>SmartTable</code> control?</b></summary>

You can do this using the `customToolbar` aggregation, as shown below:

```
<smartTable:SmartTable id="ItemsST" entitySet="Items" ...
	<smartTable:customToolbar>
		<OverflowToolbar design="Transparent">
			<ToolbarSpacer/>
			<Button text="Test"/>
			<Button text="Click me!"/>
		</OverflowToolbar>
	</smartTable:customToolbar>
```

**Note**
We recommend the use of `OverflowToolbar` instead of `Toolbar`, as shown above, to make the toolbar responsive.
</details>

<details>
<summary><b>10. How do I fetch data from <code>navigationProperty</code> (or association entities) using the <code>SmartTable</code> control?</b></summary>

`SmartTable` provides a `tableBindingPath` property in addition to `entitySet`, which can be used to specify a navigation property path, for example, `SalesOrder(123)/toItems`.
For an `AnalyticalTable` control or `AnalyticalBinding`, you might have to pass `entitySet` in `bindingParameters` using the `beforeRebindTable` event. This is necessary if the `entitySet` path does not conform to the one that is checked internally by `AnalyticalBinding`, for example, in the `beforeRebindTable` event, as shown here:

```
var mBindingParams = oEvent.getParameter("bindingParams");
mBindingParams.parameters.entitySet = "NameOfEntitySet";
```
</details>

<details>
<summary><b>11. Why do I not see any columns in my <code>SmartTable</code> control?</b></summary>

`SmartTable` creates the initially visible column based on the `LineItem` or the `PresentationVariant` annotation. You can either specify the initial fields there or create it manually in the XML view by adding columns to the underlying table.

For more information, see the [Sample](entity/sap.ui.comp.smarttable.SmartTable/sample/sap.ui.comp.sample.smarttable.mtableCustom).
</details>

<details>
<summary><b>12. How can I use <code>applyVariant()</code> in combination with the <code>SmartTable</code> control?</b></summary>

The `applyVariant()` is an interface function for the `SmartVariantManagement` control that sets the current view for the `SmartTable` control.

Applications can also create their own application-specific views as the default, which are **not** standard views defined by the `SmartTable` control. These application views are only called once during the initialization of the `SmartTable` control.

If an application default view has been defined, then all other views are based on this application default view. Any change made to the `SmartTable` control and saved as a view is merged with the application default view by the `SmartTable` control. This data is then stored as a **new** view, a combination of the change made and the application default view.

For example, an application default view might contain two groups that have been defined for the `SmartTable` control. When a new group is added and saved as a view, the new view will comprise the newly added group and the application default view. Thus, the end result are three groups for the `SmartTable` control.

**Note**
When the user selects *Ungroup All* in the *Group Header Menu* on the UI of `AnalyticalTable` in the `SmartTable` control, and these changes are then stored as a view, they are saved as a combination of the ungrouping change and the application default view that contains the grouping information. Thus, the end result will be the application default view.
</details>

<details>
<summary><b>13. Why do I see an incorrect count in the header of my <code>SmartTable</code> control?</b></summary>

If the back end does not support count, if the count support has been disabled in the model, or in case of a tree scenario, you have to set `showRowCount="false"` in the `SmartTable` control.
</details>

<details>
<summary><b>14. Can I use annotations with qualifiers in the <code>SmartTable</code> control? And, in particular, how can I use the <code>LineItem</code> and <code>PresentationVariant</code> annotations with a qualifier within the <code>SmartTable</code> control?</b></summary>

As a general rule, the `SmartTable` control looks for annotations **without** a qualifier, the primary annotations. However, you can also use the `PresentationVariant` and `LineItem` annotations with qualifiers as mentioned below.
We first look for `PresentationVariant` and try to get the `LineItem` annotation from there. If this annotation does not exist, we look for the `LineItem` annotation directly in the entity.

You can set the qualifier that you want to use for the `LineItem` annotation in the `SmartTable` control using `lineItemQualifier` `customData`:

```
<SmartTable customData:lineItemQualifier=”Customer360” …>
```

If you want to use a specific `PresentationVariant`, `presentationVariantQualifier` is also supported, which can be used as shown below:

```
<SmartTable customData:presentationVariantQualifier =”Customer360” …>
```

If **no qualifier** has been defined for the presentation variant, you can use the fallback option and check if there is a `LineItem` annotation with or without a qualifier, as specified by the application developer.

**Note**
`customData` is the shortcut notation for specifying custom data for the control, provided you have added the following to the XML view: `customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"`.
For more information about how to use custom data in XML views, see [Custom Data - Attaching Data Objects to Controls.](topic/91f0c3ee6f4d1014b6dd926db0e91070.html).
</details>

<details>
<summary><b>15. How can I dynamically switch between read-only and editable controls in my table using the <code>editable</code> property?</b></summary>

For the switch you have to enable the `SmartToggle` feature in the `SmartTable` controls as follows:

```
<smartTable:SmartTable id="ItemsST" entitySet="Items" customData:useSmartToggle="true"...>
```

In order for this to work, the `customData` namespace in the XML view must be declared correctly to enable shortcut notation for custom data aggregations: `customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"`.

**Note**
`SmartToggle` is a feature provided by the `SmartTable` control that allows you to toggle between display and edit mode for all the relevant controls in the cells of the `SmartTable` control.
</details>

<details>
<summary><b>16. I did an export using the <i>Export to Spreadsheet</i> button in the <code>SmartTable</code> control. Why is the data in the spreadsheet different from the data I see on the UI?</b></summary>

The formatting in an SAPUI5 client-side generated spreadsheet can differ slightly from the UI. However, if you notice large differences, the issue might be due to custom columns that do not have sufficient `P13ndata`, as required for a client-side export.

The following additional properties are required in `P13ndata` for proper formatting of custom columns for an SAPUI5-client-side export to the spreadsheet:

*`P13n` Properties for Custom Columns*
<table>
	<tr>
		<th>Property</th>
		<th>Explanation</th>
	</tr>
	<tr>
		<td><code>unit</code></td>
		<td>Name of the unit property to be used for unit of measure and currency formatting</td>
	</tr>
	<tr>
		<td><code>isCurrency</code></td>
		<td>If the column is of type <code>currency</code>, the amount with the currency is shown in the exported spreadsheet.</td>
	</tr>
	<tr>
		<td><code>align</code></td>
		<td>Configures the alignment of the column, for which you can use the same value as for the <code>hAlignproperty</code> of the column.</td>
	</tr>
	<tr>
		<td><code>edmType</code></td>
		<td>Actual <code>Edm.Type</code> of the OData property, which might be needed for proper formatting of columns in the spreadsheet.</td>
	</tr>
	<tr>
		<td><code>description</code></td>
		<td>Field that points to the description (<code>UI.Text</code> annotation) of this column, or, if custom-formatted columns are used, you can use the description that is used in the <code>formatter</code> function.</td>
	</tr>
	<tr>
		<td><code>displayBehaviour</code></td>
		<td>Various combinations of the description that are displayed on the UI in the following way:
		<ul>
			<li><code>descriptionOnly</code>: Shows a description only</li>
			<li><code>descriptionAndId</code>: Shows the description followed by the ID</li>
			<li><code>idAndDescription</code>: Shows the ID followed by the description</li>
			<li><code>idOnly</code>: Shows the ID only</li>
		</ul>
		</td>
	</tr>
	<tr>
		<td><code>width</code></td>
		<td>Width of the column, for which you must use the same value as for the column itself</td>
	</tr>
	<tr>
		<td><code>isDigitSequence</code></td>
		<td>Can be used for <code>Edm.String</code> columns that represent a numeric field with leading zeros. If set to <code>true</code>, the leading zeros are removed from this string field as the <code>number</code> format will be used in the spreadsheet.</td>
	</tr>
</table>

Apart from the configuration, you can use the `beforeExport` event to change the formatting and configuration of an SAPUI5 client-side export to a spreadsheet as shown in the samples.

For more information, see the [Sample for `SmartTable`](entity/sap.ui.comp.smarttable.SmartTable/sample/sap.ui.comp.sample.smarttable.mtableCustom) and the [Samples for `sap.ui.export.Spreadsheet`](entity/sap.ui.export.Spreadsheet).
</details>

<details>
<summary><b>17. Why is the <code>SmartTable</code> control (of type <code>AnalyticalTable</code>) showing the columns with the <code>Text</code> annotation incorrectly in my app? Why is the <code>SmartTable</code> control not using the <code>TextArrangement</code> annotations as I expected?</b></summary>

The `SmartTable` control supports the `Text` and `TextArrangement` annotations that allow you to show descriptions and ID fields together as annotated by the `TextArrangement` annotation (or configured using the `displayBehaviour` custom data). The use of this annotation has some restrictions.
For more information, see the [API Reference for the `Text` annotation](api/sap.ui.comp.smarttable.SmartTable/annotations/Text).

In addition, `AnalyticalBinding` ignores the entire `$select` if the dimensions and measures do not match what has been calculated internally. Using `Text` or `TextArrangement` automatically only works if `$select` contains the correct fields. If you add some dimensions to `requestAtLeast`, `Criticality`, or other fields, `$select` is ignored, and fetching the descriptions and the criticality, for example, does not work.

During automatic dimension selection `AnalyticalBinding` ignores the specified `$select` if a text or description column is added to the table content without the corresponding dimension. To work around this binding restriction, the `SmartTable` control calculates and adds the dimension of the property of the `Text` annotation to the `additionalProperty` custom data (used to calculate `$select`) in the `SmartTable` control wherever possible.
There are a few other things to keep in mind when using this feature:

* Multiple dimensions must not point to the same property of the `Text` annotation (only **one** will be used).
* The `Text` annotation itself is marked as a dimension; the actual dimension field is not automatically selected.
* The `Text` annotation for ignored or hidden dimension fields does not automatically contain the dimension name in `additionalProperty`, as the metadata analysis for such fields is ignored.
</details>

<details>
<summary><b>18. How come the column headers in the <code>SmartTable</code> control of type <code>ResponsiveTable</code> are clickable?</b></summary>

`SmartTable` internally activates actions for the column headers of a responsive table. Users can select a column and sort and filter it using the buttons that are displayed.

Keep in mind that the following applies:
* The active column headers are only available if `useTablePersonalisation="true"`.
* If a column has already been filtered, clicking the filter button will not show the selected column directly (this is the same as in a grid table, since there is a restriction for `p13nFilterPanel`).
* Pressing the *Ctrl* key and clicking on a column to add multiple sorters is currently not supported.

For more information, see the [Sample](entity/sap.ui.comp.smarttable.SmartTable/sample/sap.ui.comp.sample.smarttable.mtable).
</details>

<details>
<summary><b>19. How come the <i>Export to Spreadsheet</i> button of the <code>SmartTable</code> control has a menu?</b></summary>

If `exportType="UI5Client"` for `SmartTable`, the *Export to Spreadsheet* button is rendered as `sap.m.MenuButton` with the menu options *Export* and *Export As*. *Export As* provides a number of export settings that can be configured by the user.

For more information about the spreadsheet export and the options on the export UI, see [Spreadsheet Export](topic/2691788a08fc43f7bf269ea7c6336caf.html).
</details>

<details>
<summary><b>20. Why does the <code>initialise</code> event of <code>SmartTable</code> not get fired in my scenario?</b></summary>

The `SmartTable` control fires the `initialise` event just once after it has completed analyzing the metadata and has initialized its inner state for the first time. Therefore, using `attachInitialise` does not help. However, the `isInitialised` method can be used in such scenarios.

You can also use the following code sample to handle scenarios where you need to trigger some function after this control has been initialized. It should work in scenarios where the event has already been fired:

```
if (oSmartControl.isInitialised()) {
	runSomeCodeAfterInit();
} else {
	oSmartControl.attachInitialise(runSomeCodeAfterInit);
}
```
</details>

<details>
<summary><b>21. How is sorting done in amount fields with multiple currencies if <code>ApplyMultiUnitBehaviorForSortingAndFiltering</code> is set?</b></summary>

The `SmartTable` control automatically adds the unit, in this case the currency code, as an additional sorter before the amount unless the unit is added as a sorter explicitly. This happens if the `ApplyMultiUnitBehaviorForSortingAndFiltering` annotation is used. This behavior applies to all columns in the `SmartTable` control.

For more information about this annotation, see the [API Reference](api/sap.ui.comp.smarttable.SmartTable/annotations/ApplyMultiUnitBehaviorForSortingAndFiltering).

For custom columns, consumers have to provide the required `p13nData` information (`isCurrency` and `unit`).
</details>

<details>
<summary><b>22. Which key combinations can be used for the <code>SmartTable</code> control for the spreadsheet export and the personalization?</b></summary>

The following key combinations are supported:
* CTRL + SHIFT + E or ⌘ / Command + SHIFT + E: Opens the *Export As* dialog for the spreadsheet export
* CTRL + , or ⌘ / Command + , : Opens the personalization settings
</details>

<details>
<summary><b>23. Why does the first column not appear in the personalization settings when using <code>treeTable</code> as the table type?</b></summary>

The `SmartTable` control disables the personalization for the first column if `tableType` is set to `sap.ui.comp.smarttable.TableType.TreeTable`.
The `TreeTable` control provides a comprehensive set of features for displaying hierarchical data where a table is displayed as a hierarchical tree. `TreeTable` is designed to retain this structure also for the first column of the table, which is why `SmartTable` excludes it from personalization.
</details>

<details>
<summary><b>24. Why is the unit of measure (UoM) or currency not right aligned with the column header?</b></summary>

The currency and UoM columns in the `SmartTable` control are built to be aligned at decimal point. Although the overall content is right aligned, the header and cell might not be aligned as this is a generic control that is not built to handle a single currency or UoM (for example, %, h).

The UoM part always uses ~3em to prevent the content from being cut off. That is why there might be a space behind the unit in the cell in contrast to the header, depending on the UoM or currency used.

Also, if either the *Product Depth* or *Product Width* column is added to a `SmartTable` control, the UoM, such as m or cm, might not be aligned, but the aim is to align the values at decimal point and not at header and content level.
The application can use custom columns if an exact alignment of content and header is required.

For more information, see the [Sample](entity/sap.ui.comp.smarttable.SmartTable/sample/sap.ui.comp.sample.smarttable.smartTableWithCriticality).
</details>

<details>
<summary><b>25. Why is a column suddenly added or removed by the <code>SmartTable</code> control after the <i>Settings</i> dialog has been opened?</b></summary>

When using the `SmartTable` control with an active `useTablePersonalisation` property, personalization and persistence for the control are also activated if `VariantManagement` is available, or if the `useVariantManagement` property has been set to `false` (for implicit use of `VariantManagement`) and the `persistencyKey` property is used.

If `SmartTable` uses the personalization feature, the personalization is the hub for managing the visibility of columns. Any dynamic changes made to the visibility of the columns must be avoided.
Dynamic changes of column visibility by using bindings or other factors, such as updating the visibility after an update event, might lead to mismatches with the activated persistence setting of `SmartTable`.

If the visibility for a column changes after the *Settings* dialog has been opened, you should check if the property that determines the visibility of the column has been bound, or if there are update-related event handlers that affect the visibility.
</details>

<details>
<summary><b>26. Where can I find more information about the annotations used?</b></summary>

For more information about the extensions and annotations that have been included in OData4SAP, which is based on OData V2, see [http://www.sap.com/protocols/SAPData](http://www.sap.com/protocols/SAPData).

For more information about CDS annotations, search for <b>CDS Annotations</b> in the documentation for your SAP NetWeaver version on the SAP Help Portal at [https://help.sap.com/viewer/p/SAP_NETWEAVER](https://help.sap.com/viewer/p/SAP_NETWEAVER).
</details>

<details>
<summary><b>27. How can I enable sorting for an <code>additionalProperty</code> of a column?</b></summary>

Since not every `additionalProperty` should be sortable by default, you have to specify `additionalSortProperty` in the `p13nData` custom data. You can set it to a comma-separated list of property names.

```
<Column id="Customer">
	<customData>
		<core:CustomData key="p13nData" value='\{"columnKey": "Customer", "leadingProperty": "Customer", "sortProperty": "Customer", "additionalProperty": "Name", "additionalSortProperty": "Name"}' />
	</customData>
	<Text text="Customer" />
</Column>
```

</details>
