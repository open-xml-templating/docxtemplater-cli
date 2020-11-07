#!/usr/bin/env node

"use strict";
const argv = require('minimist')(process.argv.slice(2));
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");
const expressions = require("angular-expressions");

function showHelp() {
	console.log("Usage: docxtemplater input.docx data.json output.docx");
	process.exit(1);
}

if (argv.help) {
	showHelp();
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
if (args.length !== 3) {
	showHelp();
}
const input = fs.readFileSync(args[0], "binary");
const data = JSON.parse(fs.readFileSync(args[1], "utf-8"));
const output = args[2];

const zip = new PizZip(input);
const doc = new Docxtemplater();

doc.loadZip(zip)
	.setOptions({parser})
	.setData(data)

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

try {
	doc.render()
} catch (error) {
	var e = transformError(error);
	// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	console.log(JSON.stringify({error: e}, null, 2));
	throw error;
}

const generated = doc.getZip()
	.generate({ type: "nodebuffer", compression: "DEFLATE" });

fs.writeFileSync(output, generated);
