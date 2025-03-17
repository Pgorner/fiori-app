QUnit.config.autostart = false;

sap.ui.require(['sap/ui/core/Core'], function (Core) {
	Core.ready().then(function () {
		sap.ui.require(['sap/feedback/ui/flpplugin/test/integration/AllJourneys'], function () {
			QUnit.start();
		});
	});
});
