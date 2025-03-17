module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		console.log("Method is called: " + actionDefinition.name);

		if (actionDefinition.name === "Header1MenuAction1") {
			odataRequest.addMessage(0, "Header Menu Item 1 clicked ", 2, "");
		} else if (actionDefinition.name === "Header1MenuAction2") {
			odataRequest.addMessage(0, "Header Menu Item 2 clicked", 2, "");
		} else if (actionDefinition.name === "Header2MenuAction1") {
			odataRequest.addMessage(0, "Header Action Enabled Overriden clicked", 2, "");
		} else if (actionDefinition.name === "Header2MenuAction2") {
			odataRequest.addMessage(0, "Header Menu Item 2 clicked", 2, "");
		} else if (actionDefinition.name === "Subsection1MenuAction1") {
			odataRequest.addMessage(0, "Subsection Menu Item 1 clicked", 2, "");
		} else if (actionDefinition.name === "Subsection1MenuAction2") {
			odataRequest.addMessage(0, "Subsection Menu Item 2 clicked", 2, "");
		} else if (actionDefinition.name === "Subsection2MenuAction1") {
			odataRequest.addMessage(0, "Subsection Action Enabled Overriden clicked", 2, "");
		} else if (actionDefinition.name === "Subsection2MenuAction2") {
			odataRequest.addMessage(0, "Subsection Menu Item 2 clicked", 2, "");
		} else if (actionDefinition.name === "HeaderAnnotationAction") {
			odataRequest.addMessage(0, "Header Annotation Action in Menu clicked", 2, "");
		} else if (actionDefinition.name === "SubsectionAnnotationAction") {
			odataRequest.addMessage(0, "Subsection Annotation Action in Menu clicked", 2, "");
		}
		return undefined;
	}
};
