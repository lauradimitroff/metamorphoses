#!/bin/sh
# Allège un modèle glTF : géométrie compressée (Meshopt) et texture en WebP de 512 px.
# Usage : sh scripts/optimiser-modele.sh source.glb public/models/cible.glb
set -eu
npx gltf-transform optimize "$1" "$2" \
  --compress meshopt \
  --texture-compress webp \
  --texture-size 512 \
  --simplify false
