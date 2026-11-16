#!/bin/sh
# Junta las tres piezas en index.html (el juego completo, un solo archivo)
cd "$(dirname "$0")" && cat src/head.html src/core.js src/ui.js > index.html && echo "index.html generado."
