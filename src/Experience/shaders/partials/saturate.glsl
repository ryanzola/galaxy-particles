float saturate(float x) {
  return clamp(x, 0.0, 1.0);
}

#pragma glslify: export(saturate)