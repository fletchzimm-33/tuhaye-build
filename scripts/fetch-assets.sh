#!/bin/sh
# Downloads the scanned sources behind tex/ and models/ (all CC0 or CC-BY 4.0; see README "Credits").
#   sh scripts/fetch-assets.sh SRC_DIR
#   python3 scripts/build-textures.py SRC_DIR      -> tex/
#   node scripts/pack-models.mjs SRC_DIR           -> models/   (needs: npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp)
set -e
D=${1:-asset-src}; mkdir -p "$D/o3d" "$D/misc" "$D/src2" "$D/hdr" "$D/glb"
get(){ curl -fsSL --retry 3 -o "$2" "$1"; echo "  $2"; }
# ambientCG Wood049, Tiles074, PaintedPlaster017 (CC0), as mirrored by Open3D
O=https://github.com/isl-org/open3d_downloads/releases/download/20220301-data
for n in WoodTexture TilesTexture PaintedPlasterTexture; do get $O/$n.zip "$D/o3d/$n.zip"; python3 -c "import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])" "$D/o3d/$n.zip" "$D/o3d/$n"; done
# lawn (OpenGameArt "dark grass", via the three.js examples) and Poly Haven rocky_trail (CC0, via PlayCanvas)
get https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg "$D/misc/grass3.jpg"
get https://raw.githubusercontent.com/playcanvas/engine/main/examples/assets/textures/rocky_trail_diff_1k.jpg "$D/misc/rocky_trail.jpg"
# fabric and leather swatches from the Khronos glTF sample models
K=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models
for f in SheenWoodLeatherSofa/glTF/Brown_BaseColor.webp SheenWoodLeatherSofa/glTF/Brown_Normal.webp GlamVelvetSofa/glTF/GlamVelvetSofa_normal.png SheenChair/glTF/chair_fabric_normal.png SheenChair/glTF/chair_fabric_albedo.png; do get $K/$f "$D/src2/$(basename $f)"; done
# sky: Poly Haven "noon grass" HDRI (CC0, via Filament)
get https://raw.githubusercontent.com/google/filament/main/third_party/environments/noon_grass_2k.hdr "$D/hdr/noon_grass_2k.hdr"
# furniture and decor models
for m in DiffuseTransmissionPlant GlassVaseFlowers SheenChair GlamVelvetSofa SpecularSilkPouf; do get $K/$m/glTF-Binary/$m.glb "$D/glb/$m.glb"; done
