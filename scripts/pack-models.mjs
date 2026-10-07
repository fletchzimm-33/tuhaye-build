// Packs the downloaded glTF models (scripts/fetch-assets.sh) into models/ for three.js r128: drops the material extensions r128 cannot read,
// simplifies the heaviest meshes, resizes textures to WebP, and quantizes vertices.   node scripts/pack-models.mjs SRC_DIR
import path from 'path'; import { fileURLToPath } from 'url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, textureCompress, quantize, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
const SRC=process.argv[2]||'asset-src', OUT=path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))),'models');
const LIST=[ // source, output, max texture size, triangle ratio, nodes to drop
  ['DiffuseTransmissionPlant','plant.glb',768,.35,/firefly/], ['GlassVaseFlowers','vase.glb',512,1,/Flowers2|GlassTransmission/], ['SheenChair','chair-accent.glb',512,.4,null],
  ['GlamVelvetSofa','sofa-velvet.glb',1024,1,null], ['SpecularSilkPouf','pouf.glb',512,.3,null] ];
const keep=new Set(['KHR_texture_transform','KHR_materials_clearcoat','KHR_materials_transmission','KHR_materials_emissive_strength','EXT_texture_webp','KHR_mesh_quantization']);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS); await MeshoptSimplifier.ready;
for(const [src,out,M,R,drop] of LIST){ const doc=await io.read(path.join(SRC,'glb',src+'.glb'));
  for(const ext of doc.getRoot().listExtensionsUsed()) if(!keep.has(ext.extensionName)) ext.dispose();
  if(drop) for(const n of doc.getRoot().listNodes()) if(drop.test(n.getName())) n.dispose();
  for(const m of doc.getRoot().listMaterials()) for(const ti of [m.getBaseColorTextureInfo(),m.getNormalTextureInfo(),m.getMetallicRoughnessTextureInfo(),m.getOcclusionTextureInfo(),m.getEmissiveTextureInfo()]){ // r128 reads one UV set and warns about texCoord here
    const t=ti&&ti.getExtension('KHR_texture_transform'); if(t) t.setTexCoord(null); }
  await doc.transform(dedup(), weld(), ...(R<1?[simplify({simplifier:MeshoptSimplifier, ratio:R, error:.002})]:[]), prune(), textureCompress({encoder:sharp, targetFormat:'webp', resize:[M,M], quality:82}), quantize());
  await io.write(path.join(OUT,out), doc); console.log(out); }
