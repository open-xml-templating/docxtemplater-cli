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

## Attaching modules

Since version 3.7.0, released in February 2023, you can include modules using the --modules flag

To use this flag, you first need to create a file on your file system like this :

In this file you need to export an Array of all modules that you want to include

**my-modules.js**

```js
const ImageModule = require("docxtemplater-image-module");
const imageOpts = {
  centered: false,
  getImage: function (tagValue, tagName) {
    return fs.readFileSync(tagValue);
  },
  getSize: function (img, tagValue, tagName) {
    // it also is possible to return a size in centimeters, like this : return [ "2cm", "3cm" ];
    return [150, 150];
  },
};
module.exports = [new ImageModule(imageOpts)];
```

Then, in your calling code, use it like this :

```
docxtemplater --modules my-modules.js input.docx data.json output.docx
```
