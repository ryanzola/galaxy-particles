#pragma glslify: cnoise = require('./cnoise.glsl')

vec3 fbm(vec3 p, float frequency, float offset) {
  return vec3(
    cnoise((p + vec3(offset)) * frequency),
    cnoise((p + vec3(offset + 20.0)) * frequency),
    cnoise((p + vec3(offset - 30.0)) * frequency)
  );
}

#pragma glslify: export(fbm)