var express = require("express"),
	config = require("./ini/config.js"),
	palette = require("./lib/palette.js"),
	app = express(),
	fs = require("fs");

function colorResponse(evaluated, hexColor) {
	return {
		color: hexColor,
		evaluated: evaluated
	};
}

app.use("/static/", express.static(__dirname + "/static"));

app.get("/", function (req, res) {
	res.send("Welcome to Jersey!");
});

app.get("/color/:string", function (req, res) {
	var sort = (req.query.sort === "true");

	var color = palette.hexColorFromWords(
		req.params.string,
		{
			sort: sort,	
			lerpT: .4,
			delegate: function (hexColor) {
				hexColor.pastelize();
				return hexColor;
			}
		}
	);

	res.send({
		color: color.toHexColor(),
		pastel: color.pastelize().toHexColor(),
		evaluated: req.params.string
	});
});

app.get("/color_debug/:string", function (req, res) {
	var color = palette.hexColorFromWords(req.params.string);

	res.send({
		color: color.toHexColor(),
		pastel: color.pastelize().toHexColor(),
		evaluated: req.params.string
	});
});

app.listen(config.port);
