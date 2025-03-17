module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		if (actionDefinition.name === "unboundAction") {
			odataRequest.addMessage(0, "Table Refreshed via the underlying side effect", 1, "");
		}
		return undefined;
	}
};
