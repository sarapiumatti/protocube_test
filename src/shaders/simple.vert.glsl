precision highp float;

// Attributes
attribute vec3 position;
varying vec3 vNormal;

// Uniforms
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;
uniform vec3 center;
uniform float radius;

void main() {
  vNormal = (position - center)/radius;
  vNormal = normalMatrix * vNormal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
