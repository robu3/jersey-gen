var config = require("../ini/config.js"),
	wordBlacklist = config.wordBlacklist || [];

// ## getWords
// Returns an array of words from the specified string,
// optionally sorted in alphabetical order (minus any blacklisted words)
function getWords(str, sort) {
    var wordsRaw = str.toLowerCase().split(" "),
        words = [];

	wordsRaw.forEach(function (w) {
		w = w.trim();
		if (wordBlacklist.indexOf(w) === -1) {
			words.push(w);
		}
	});
	
	if (sort) {
		words.sort();
	}

	return words;
}

module.exports = {
	getWords: getWords
};
