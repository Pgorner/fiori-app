<details>
<summary><b>1. How to activate certain file types for the <code>ExportHandler</code>?</b></summary>

The `ExportHandler` accepts an object as parameter that controls the file types supported for exporting. These so-called capabilities do not only control the file types that are offered for the `Export As` dialog, they are also used to control specific features of each file type. By default, the type `sap.ui.export.FileType.XLSX` is activated, even if no parameter is passed to the `ExportHandler`. If you want to offer additional file types, you can add the relevant entries to the capabilities. The default capabilities can be overwritten if `sap.ui.export.FileType.XLSX` is not part of them.

```
// Create ExportHandler instance with XLSX and PDF file type
new ExportHandler({
	XLSX: { ... },
	PDF: { ... }
});

```

</details>

<details>
<summary><b>2. PDF has been added to the <code>ExportHandler</code> capabilities. Why is it not listed in the <code>Export As</code> dialog?</b></summary>

The capabilities for file types differ, which means that depending on the file type, specific properties have to be maintained. For `sap.ui.export.FileType.PDF`, the `ExportHandler` only supports server-side generated PDF. The server-side PDF capabilities are defined in the [com.sap.vocabularies.PDF.v1.Features](https://github.com/SAP/odata-vocabularies/blob/main/vocabularies/PDF.md) annotation of the data service.

```
// Create ExportHandler instance with XLSX and PDF file type
new ExportHandler({
	XLSX: { ... },
	PDF: {
		DocumentDescriptionReference: "/some/fake/path/",
		DocumentDescriptionCollection: "My_DocumentDescriptions",
		ArchiveFormat: true,
		Signature: false,
		CoverPage: true,
		FontName: true,
		FontSize: true,
		Margin: true,
		Border: true,
		FitToPage: false,
		Padding: true,
		HeaderFooter: true,
		ResultSizeDefault: 20000,
		ResultSizeMaximum: 20000
	}
});
```

</details>

<details>
<summary><b>3. Can file types other than the ones publicly available in the <code>sap.ui.export.FileType</code> enumeration be added?</b></summary>

In general, it is not possible to add file types that are not publicly available in the `sap.ui.export.FileType` enumeration. Nevertheless, it is possible to implicitly add file types to the `ExportHandler` capabilities. More specifically, this applies to the file type GSHEET. It depends on `sap.ui.export.FileType.XLSX` but requires additional configuration of the runtime environment. For more information, see the following SAP Notes:

* [SAP Note 3198506](https://launchpad.support.sap.com/#/notes/3198506)
* [SAP Note 3216632](https://launchpad.support.sap.com/#/notes/3216632)

</details>