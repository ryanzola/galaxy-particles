varying vec2 vUv;

uniform float uAmp;
uniform vec3 uMouse;
uniform float uSize;
uniform float uRotAmp;
uniform float uTime;

attribute vec3 pos;

#pragma glslify: cnoise = require('../partials/cnoise.glsl')
#pragma glslify: rotate = require('../partials/rotate.glsl')
#pragma glslify: fbm = require('../partials/fbm.glsl')
#pragma glslify: saturate = require('../partials/saturate.glsl')

vec3 GetOffset(vec3 p) {
  float twist_scale = cnoise(pos) * 0.5 + 0.5;
  vec3 temp_pos = rotate(uTime * (0.5 + 0.5 * twist_scale) + length(pos.xz)) * p;
  vec3 offset = fbm(pos, 0.5, 0.0);
  return offset * 0.2 * uAmp;
}

void main() {
  vUv = position.xy + vec2(0.5);
  vec3 final_pos = pos + position * 0.1;

  // calc particle size
  float particle_size = cnoise(pos * 5.0) * 0.5 + 0.5;
  vec3 world_pos = rotate(uTime*0.3 * (0.1 + 0.5 * particle_size) * uRotAmp) * pos;

  // get offset from old position
  vec3 offset0 = GetOffset(world_pos);
  vec3 offset = fbm(world_pos, 0.0, 0.0);

  // vec4 view_pos = viewMatrix * vec4(pos, 1.0);
  vec3 particle_position = (modelMatrix * vec4(world_pos + offset + offset0, 1.0)).xyz;

  // calculate distance to mouse
  float distance_to_mouse = pow(1.0 - clamp(length(uMouse.xz - particle_position.xz)-0.2, 0.0, 1.0), 2.0);
  vec3 dir = particle_position - uMouse;

  // particle_position.y += distance_to_mouse * 0.2;
  particle_position = mix(particle_position, uMouse + normalize(dir) * 0.1, distance_to_mouse);


  // calc global position
  vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);

  view_pos.xyz += position * uSize * (0.01 + 0.03 * particle_size);

  gl_Position = projectionMatrix * view_pos;
}
