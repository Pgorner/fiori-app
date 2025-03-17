import PageController from "sap/fe/core/PageController";

export default PageController.extend("sap.fe.core.fpmExplorer.guidanceCustomApps.EntryPage", {
	onInit: function () {
		//make sure to call prototype onInit before adding custom code here
		PageController.prototype.onInit.apply(this);
		//custom code added here
	}
});
