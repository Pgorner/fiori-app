module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		switch (actionDefinition.name) {
			case "unboundAction": {
				this.throwError("Unsupported Action", 501, {
					error: {
						message: `Thrown intentionally for demonstration purposes by backend handler for "${actionDefinition.name}"`
					}
				});
				break;
			}
		}
	}
};
