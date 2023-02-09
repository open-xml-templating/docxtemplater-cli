module.exports = [
	{
		name: "Foomodule",
		postparse: (parsed, options) => {
			if (options.filePath === "word/document.xml") {
				let firstPlaceholder = null;
				parsed.forEach(function ({ type, value }) {
					if (!firstPlaceholder && type === "placeholder") {
						firstPlaceholder = value;
					}
				});
				console.log("First placeholder is " + firstPlaceholder);
			}
			return parsed;
		},
	},
];
