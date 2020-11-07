# docxtemplater-cli

This repository contains code for the docxtemplater-cli

## Installation

To install the cli, run :

```
npm install -g docxtemplater-cli
```

## Run

To run docxtemplater, run :

```
docxtemplater input.docx data.json output.docx
```

It is possible to set the delimiters, or some other option by using some json in the options argument like this :

```
docxtemplater --options '{"delimiters": {"start": "[[", "end": "]]"}}' input.docx data.json output.docx
```
