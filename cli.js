#!/usr/bin/env node

"use strict";
const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const expressions = require("angular-expressions");

function transformError(error) {
	const e = {
		message: error.message,
		name: error.name,
		stack: error.stack,
		properties: error.properties,
	};
	if (e.properties && e.properties.rootError) {
		e.properties.rootError = transformError(error.properties.rootError);
	}
	if (e.properties && e.properties.errors) {
		e.properties.errors = e.properties.errors.map(transformError);
	}
	return e;
}

function printErrorAndRethrow(error) {
	const e = transformError(error);
	// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	console.error(JSON.stringify({ error: e }, null, 2));
	throw error;
}

function showHelp() {
	console.log("Usage: docxtemplater input.docx data.json output.docx");
	process.exit(1);
}

function parser(tag) {
	const expr = expressions.compile(tag.replace(/’/g, "'"));
	return {
		get(scope) {
			return expr(scope);
		},
	};
}

const args = argv._;
if (argv.help || args.length !== 3) {
	showHelp();
}
let options = {};
if (argv.options) {
	try {
		options = JSON.parse(argv.options);
	} catch (e) {
		console.error("Arguments passed in --options is not valid JSON");
		throw e;
	}
}

const [inputFile, dataFile, outputFile] = args;
const input = fs.readFileSync(inputFile, "binary");
const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
options.parser = parser;

let doc;

try {
	doc = new Docxtemplater(new PizZip(input), options);
} catch (e) {
	printErrorAndRethrow();
}

doc.setData(data);

try {
	doc.render();
} catch (error) {
	printErrorAndRethrow();
}

const generated = doc
	.getZip()
	.generate({ type: "nodebuffer", compression: "DEFLATE" });

fs.writeFileSync(outputFile, generated);
