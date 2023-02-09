#!/usr/bin/env bash

set -euo pipefail

rm -rf output-gen.docx output
TMPFILE="$(mktemp /tmp/xt_cli_XXXX)"
node cli.js --modules module-test.js input.docx data.json output-gen.docx >"$TMPFILE"

cat "$TMPFILE"

mdsum="$(md5sum output-gen.docx)"

unzip output-gen.docx -d output/ >/dev/null

error() {
	echo "ERROR : Templating did not work correctly"
	exit 1
}
if ! grep -q "John" <output/word/document.xml
then
	error
fi

if ! grep -q "Doe" <output/word/document.xml
then
	error
fi

if ! grep -q "First placeholder is last_name" <"$TMPFILE"
then
	echo "Module inclusion did not work"
	error
fi

rm -rf output output-gen.docx
echo "TEST PASS"
exit 0
