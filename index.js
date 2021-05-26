const vscode = require('vscode');

const suggestions = [
	`if (n < 2) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);`,
	`if (n < 3) {
        if (n < 2) {
            return 1;
        }
        return 1;
    }
    return fib(n - 1) + fib(n - 2);`
];

/**
 * @returns {number}
 * @param {string} a
 * @param {string} b
 */
function largestSuffixPrefixLength(a, b) {
	for (let i = Math.min(a.length, b.length); i > 0; i--) {
		if (a.substr(-i) == b.substr(0, i)) {
			return i;
		}
	}
	return 0;
}

exports.activate = function () {
	console.log(`here I am!`);
	vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, {
		provideInlineCompletionItems: async (document, position, context, token) => {
			await new Promise(resolve => setTimeout(resolve, 1000));

			const line = document.lineAt(position.line);
			/**
			 * @type {Array<vscode.InlineSuggestion>}
			*/
			const items = [];
			const evaluatedSuggestions = suggestions.map(s => ({
				text: s,
				largestPreSuffixLength: largestSuffixPrefixLength(line.text, s.split("\n")[0]),
			})).filter(s => s.largestPreSuffixLength > 0);

			evaluatedSuggestions.sort((a, b) => a.largestPreSuffixLength - b.largestPreSuffixLength);

			for (const suggestion of evaluatedSuggestions) {
				items.push({
					text: suggestion.text,
					replaceRange: new vscode.Range(line.range.end.translate(0, -suggestion.largestPreSuffixLength), line.range.end)
				});
			}
			return new vscode.InlineSuggestions(items);
		}
	})

}