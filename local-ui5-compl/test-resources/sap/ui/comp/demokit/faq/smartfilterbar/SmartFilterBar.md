<details>
  <summary><b>1. TypeAhead is not working. When I start typing, no http requests are sent.</b></summary>

Take a look at the `$metadata` document and make sure there are `ValueHelp` annotations for this field. The Target attribute must look like this: `{Namespace}.{EntityName}/{FieldName}`.

Make sure that the namespace in the Target attribute is correct.

Example of a `ValueHelp` annotation:

```
<Annotations Target="FAP_VENDOR_LINE_ITEMS_SRV.Item/Creditor" xmlns="http://docs.oasis-open.org/odata/ns/edm">
	<Annotation Term="com.sap.vocabularies.Common.v1.ValueList">
		<Record>
			<PropertyValue Property="CollectionPath" String="Vendors"/>
			<PropertyValue Property="SearchSupported" Bool="true"/>
			<PropertyValue Property="Parameters">
				<Collection>
					<Record Type="com.sap.vocabularies.Common.v1.ValueListParameterInOut">
						<PropertyValue Property="LocalDataProperty" PropertyPath="Creditor"/>
						<PropertyValue Property="ValueListProperty" String="VendorID"/>
					</Record>
				</Collection>
			</PropertyValue>
		</Record>
	</Annotation>
	</Annotations>
```
</details>

<details>
  <summary><b>2. I have a field 'Entered on' that’s an <code>Input</code> field. It should be a <code>DatePicker</code>.</b></summary>

Take a look at the `$metadata` document and make sure that the property is of type `Edm.DateTime` and the property is annotated with `sap:display-format="Date"`.
</details>

<details>
  <summary><b>3. I tried to set default values for a filter field in the control configuration in JavaScript. These default values don’t have any effect.</b></summary>

The `ControlConfiguration` and `GroupConfiguration` are intended to be used to add static configuration in an XML view.

There are three properties that can be set dynamically:

* `visible`,

* `label`,

* `visibleInAdvancedArea`.

All other properties and aggregations are not dynamic. This means they have to be set statically in the XML view, and not dynamically by JavaScript. Any changes made in the `ControlConfiguration` or `GroupConfiguration` after the initialise event has been fired do not have any effect.

If you have to set values of a filter field dynamically in JavaScript, you can use the `setFilterData` API.
</details>

<details>
  <summary><b>4. The value help dialog for a filter field contains a table with multiple columns. How can I change the order of these columns?</b></summary>

The order of the columns is specified in the OData `$metadata` document in the `ValueHelp` annotation.

There is one column for each `ValueListParameterInOut` or `ValueListParameterOut` in the related annotation.

The order of the columns is the same as the order of the `InOut/Out` parameters in the `$metadata` document. You can’t use configuration in the XML view to change this order. If you want to change the order, you can do it in the OData `$metadata` document.
</details>

<details>
  <summary><b>5. I have added custom controls to the <code>SmartFilterBar</code>. If I save a view and load it again, the custom fields are initial. What do I have to do to enable custom fields for view management?</b></summary>

In general, custom fields cannot be handled automatically by the `SmartFilterBar` control. You have to implement this in the view’s controller. The `SmartFilterBar` offers the following events that can be used to enable custom fields for view management:

* `beforeVariantSave` (deprecated),
* `afterVariantLoad`,
* `beforeVariantFetch`.

`BeforeVariantFetch` replaces the `beforeVariantSave` event since it is triggered at the same points in time. Contrary to `beforeVariantSave`, the `beforeVariantFetch` event is also called whenever the Filters dialog is opened. It allows you to restore the state of the custom filters in the Filters dialog once the Reset button has been pressed.

You can use the `beforeVariantSave` event to update the model of the `SmartFilterBar` with the values from the custom fields. Every value within the model is stored as a view. The values of custom fields should be stored under the property `_CUSTOM, for example, oSmartFilter.setFilterData({_ CUSTOM :{field1:"abc", field2:"123"}});` .

You can use the event `afterVariantLoad` to get the values from the model and use them to update the custom filter fields, for example:

```
oData = oSmartFilter.getFilterData();
var oCustomFieldData = oData["_CUSTOM"];
oCustomField1.setValue(oCustomFieldData.field1);
```

If both events are handled this way, custom fields are enabled for view management.
</details>

<details>
  <summary><b>6. How can I set initial or default data in the <code>SmartFilterBar</code> control?</b></summary>

Static data can be set in the control using `ControlConfiguration` in the `view.xml`:

```
<smartFilterBar:SmartFilterBar id="smartFilterBar" ...>
…
<smartFilterBar:controlConfiguration>
              <smartFilterBar:ControlConfiguration key="CompanyCode" visible="true" index="3"…>
                     <smartFilterBar:defaultFilterValues>
                            <smartFilterBar:SelectOption low="0001">
                            </smartFilterBar:SelectOption>
                     </smartFilterBar:defaultFilterValues>
              </smartFilterBar:ControlConfiguration>
```
</details>

<details>
  <summary><b>7. How can I set dynamic data as initial or default data in the <code>SmartFilterBar</code> control, for example, for navigation parameters?</b></summary>

Dynamic data can be set as initial or default data in the control by registering to the `initialise` event and setting `JSON/JSONstring` using the `setFilterData` API in your `controller.js`.
**Note:**  You should not to apply `setValue()` or `setTokens()` directly to the filter inputs as the filters are considered private and this will result in incorrect behavior.

```
…
onInitSmartFilter: function(oEvent) { //Assuming that this is the eventhandler registered for the "initialise" event of the SmartFilterBar control in your view.xml
              var    oSmartFilter = oView.byId("smartFilterBar");
              var oTodaysDate = new Date();
              //Sample Data
              var oJSONData = {
                           Company: {
                                  items: [ //MultiInput fields with filter-restriction="multi-value" (Ex: shown as Tokens based on control type)
                                         {
                                            key:"0001",
                                            text:"SAP SE" //Display text on the token --> not used for filtering!
                                   },
                                   {
                                      key:"0002",
                                      text:"SAP XYZ"
                                  }
                                   ]
                           },
                           SomeDate: { //DateRange field with filter-restriction="interval"
                                  low: oTodaysDate, //Date fields require JavaScript Date objects!
                                  high: oTodaysDate
                           },
                           YearInterval: {
                                  low: "2000-2014" //simple input field with filter-restriction="interval" --> text separated by a single "-"
                           },
                           Ledger:"0L" //Single-value field --> Plain input
              };
              oSmartFilter.setFilterData(oJSONData); //Data will be updated with existing data in the SmartFilter
       },
…
```
</details>

<details>
  <summary><b>8. How does the <code>SmartFilterBar</code> determine if a filter has a value assigned to it?</b></summary>

The `SmartFilterBar` control handles the checks whether values are set for the OData-service-based filters, but has only a limited capability to do the same for custom fields. For checks like this, the custom field provider has to provide a Boolean value (`true/false`) as an indicator whether a value for the custom field exists via the custom data extension `hasValue`. If the custom data does not exist, the `SmartFilterBar` control analyzes if the custom control has either the method `getValue` or `getSelectedKey` and by using those tries to determine whether the value exists.

**Note:** The method-based check is not very reliable, since, for example, `MultiComboBox` provides both methods mentioned, but the actual value is accessed via `getSelectedKeys`. It is strongly recommended to use the custom data extension for such scenarios. The `SmartFilterBar` control can only react to an onChange event. Therefore, the application has to set the `hasValue` custom data while handling the `onChange` event.
</details>

<details>
  <summary><b>9. I would like to use the <code>SmartFilterBar</code> control in an analytical scenario, for example, use it in combination with <code>SmartChart</code> or an analytical table. What do I have to bear in mind?</b></summary>

Analytical binding does not support filtering using `navigationProperties`. However, `SmartFilterBar` creates a group for each filterable property based on the navigation property of the bound `entitySet` and assigns filters to it. If you would like to prevent these filters from being created, since they cannot be used in an analytical scenario, set the property `useProvidedNavigationProperties` to `true` while leaving the provided list of navigation properties empty (property `navigationProperties` is not defined or has an empty value).

If you would like the `SmartFilterBar` control to create filters only for some of the navigation properties, set `useProvidedNavigationProperties` to `true` and list the navigation properties for the filters you require in `navigationProperties`, for example, `navigationProperties=”to_CompanyCode”` takes only this specific <code>NavigationProperty</code> into account. In addition, in order to provide more precise filtering you can list separate filters from the <code>NavigationProperty</code>. For example, `navigationProperties="to_CompanyCode/CompanyCodeName, to_CompanyCode/CompanyCodeDescription"`.
</details>

<details>
  <summary><b>10. Why does the <code>initialise</code> event of <code>SmartTable</code> not get fired in my scenario?</b></summary>

The `SmartTable` control fires the `initialise` event just once after it has completed analyzing the metadata and has initialised its inner state for the first time. Therefore, using `attachInitialise` does not help. However, the `isInitialised` method can be used in such scenarios.

You can also use the following code sample to handle scenarios where you need to trigger some function after this control has been initialized. It should work in scenarios where the event has already been fired:

```
if (oSmartControl.isInitialised()){
  runSomeCodeAfterInit();
} else {
  oSmartControl.attachInitialise(runSomeCodeAfterInit);
}
```
</details>

<details>
  <summary><b>11. How does the <code>SmartFilterBar</code> control determine if a filter has a value?</b></summary>

The `SmartFilterBar` control handles the checks whether any values are set for the OData-service-based filters, but has only a limited capability to do the same for custom fields. For checks like this, the custom field provider has to provide a Boolean value (`true/false`) as an indicator whether a value for the custom field exists using the custom data extension `hasValue`. If there is no custom data, the `SmartFilterBar` control analyzes if the custom control has either the method `getValue` or `getSelectedKey` and, by using those, tries to determine whether any value exists.

Once `hasValue` has been set, the custom extension calls the `fireFilterChange` method of the `FilterBar` control (no parameters required for this method) to indicate that the count of assigned values has to be recalculated.
For more information, see [Filter Bar](topic/2ae520a67c44495ab5dbc69668c47a7f.html) and [Smart Variant Management](topic/06a4c3ac1cf545a7b51864e7f3aa02da.html).
</details>

<details>
  <summary><b>12. How do I set default operator for date range and single date controls?</b></summary>

```
In case useDateRangeType="true"

<smartFilterBar:ControlConfiguration key="BUDAT" visibleInAdvancedArea="true"

                                          conditionType="{

                                                                  defaultOperation: 'TODAY'}">

</smartFilterBar:ControlConfiguration>

Or when you set the type of the controls with conditionType

<smartFilterBar:ControlConfiguration key="BUDAT" visibleInAdvancedArea="true"

                                          conditionType="{

                                                                  module: 'sap.ui.comp.config.condition.DateRangeType',

                                                                  defaultOperation: 'TODAY'}">

</smartFilterBar:ControlConfiguration>
```
With these configurations, the controls will be loaded with the semantic date “Today”.
</details>

<details>
  <summary><b>13. Does this method of setting a default operator work for all types of operators?</b></summary>

  No, it’s not applicable for operators that need a parameter, for example 'Next X Days' where X is the required parameter.
  </details>

<details>
  <summary><b>14. Can I use semantic dates in single date filters?</b></summary>

  Yes, as of version 1.98, `SmartFilterBar` uses `sap.m.DynamicDateRange`. Before this version, the single date filters `Edm.Date.Time` with `sap:display-format= "Date"` and `Edm.String` used `sap.m.Input` and `sap.m.DatePicker`.

Example:

- `Edm.DateTime` and `sap:display-format= "Date"` `sap:filter-restriction="single-value"` and `controlConfiguration conditionType DateRangeType` (<smartFilterBar:ControlConfiguration key=" CREATION_DATE" conditionType="sap.ui.comp.config.condition.DateRangeType">).

- `Edm.DateTime` and `sap:display-format= "Date" sap:filter-restriction="single-value"` and setting on `SmartFilterBar` level `useDateRangeType="true"`  (<smartFilterBar:SmartFilterBar id="smartFilterBar"  entitySet="LineItemsSet" useDateRangeType="true">).

- `Edm.String` and `sap:filter-restriction="single-value"`  annotated with <Annotation Term="com.sap.vocabularies.Common.v1.IsCalendarDate" Bool="true" /> and setting on `SmartFilterBar` level `useDateRangeType="true"`.
</details>

<details>
  <summary><b>15. How I can set custom tooltip on FilterField label or control?</b></summary>

  You can set Label's tooltip by utilizing `setLabelTooltip` of the FilterItem:
  ```javascript
  oSmartFilterBar.determineFilterItemByName("FieldName").setLabelTooltip("Label Tooltip");
  ```

You can set Control's tooltip by utilizing `setControlTooltip` of the FilterItem:
  ```javascript
  oSmartFilterBar.determineFilterItemByName("FieldName").setControlTooltip("Control Tooltip");
  ```
</details>
