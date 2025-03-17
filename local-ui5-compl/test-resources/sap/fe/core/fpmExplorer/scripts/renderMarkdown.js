window.initMarkdownit = async function (mdPath) {
	sap.ui.require(["sap/ui/integration/thirdparty/markdown-it"], function (_Markdown) {
		if (!this.Markdownit) {
			this.Markdownit = _Markdown;
		}

		fetch(mdPath)
			.then((response) => response.text())
			.then(function (text) {
				// Parse the Markdown and convert it to HTML
				const html = this.Markdownit("commonmark", {
					html: true,
					linkify: true,
					typographer: true,
					breaks: true
				}).render(text);
				document.body.getElementsByClassName("markdown-body")?.markdown?.insertAdjacentHTML("afterbegin", html);
			});
	});
};
