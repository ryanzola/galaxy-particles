uniform vec3 iResolution;
uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
  vec4 ttt = texture2D(uTexture, vUv);

  fragColor = vec4(uColor, ttt.r);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
