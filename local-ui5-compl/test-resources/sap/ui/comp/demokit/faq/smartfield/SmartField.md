<details>
  <summary><b>1. How can I prevent OData requests from fetching value lists to display the description for a given key in read-only mode?</b></summary>

If the property `fetchValueListReadOnly` is set to false, no request is sent to fetch the value list, thus improving performance. However, if you would actually like to see the description for a key, you have to use the `sap:text` v2 annotation or the `com.sap.vocabularies.Common.v1.Text` v4 annotation to define the path to a property containing the description. This target property has to be defined in the model, which means that you as the application developer have to take care of fetching the data.
</details>

<details>
  <summary><b>2. I have defined custom formatters for <code>SmartField</code> within my application. Why are they ignored?</b></summary>

If you define custom formatters, they will not be taken into consideration. `SmartField` always uses its own formatters for the external representation of values. In addition, custom data types, which you define for your application, are supported.
For more information, see the [Sample](entity/sap.ui.comp.smartfield.SmartField/sample/sap.ui.comp.sample.smartfield.ExtendedODataType).
</details>

<details>
  <summary><b>3. If I use composite binding for the <code>SmartField</code> control, the field does not show all elements. How can I use this type of binding?</b></summary>

`SmartField` does not support composite binding. You can only use the standard two-way binding for the `SmartField` control.
</details>

<details>
  <summary><b>4. How can I set the <code>SmartField</code> to show an empty indicator when in display mode there is no value?</b></summary>

When used within `SmartForm`, `SmartField` shows an empty indicator automatically. In all other cases, one of the `SmartField` parents should have the context class `sapMShowEmpty-CTX` and then the empty indicator will be shown.
</details>

<details>
  <summary><b>5. What happens in a side-effect scenario if the user is changing some value, but at the same time the model receives a new value for the same field as a delayed response from the backend?</b></summary>

The value entered by the user should not be overwritten. The `SmartField` can successfully handle such cases and preserve the value entered by the user.
For more information, see [Side Effects](topic/18b17bdd49d1436fa9172cbb01e26544.html).
</details>