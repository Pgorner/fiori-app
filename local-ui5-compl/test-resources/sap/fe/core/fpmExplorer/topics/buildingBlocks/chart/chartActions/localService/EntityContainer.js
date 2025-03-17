module.exports = {
	async executeAction(actionDefinition, actionData, keys, odataRequest) {
		if (actionDefinition.name === "ToolbarAction") {
			odataRequest.addMessage(0, "Action executed", 1, "");
		}
		return undefined;
	}
};
