sap.ui.require([
	"sap/ushell/Container",
	"sap/ui/core/Core",
	"sap/ushell/iconfonts"
], function (UShellContainer, Core, iconfonts) {

	Core.ready(function() {

		// initialize the ushell sandbox component
		UShellContainer.createRendererInternal("fiori2").then(function (oRenderer) {
			iconfonts.registerFiori2IconFont();
			oRenderer.placeAt("content");
		});
	})
});