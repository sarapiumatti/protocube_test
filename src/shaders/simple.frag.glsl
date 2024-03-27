precision highp float;
varying vec3 vNormal;
uniform vec3 cameraDirection;

void main() {
    vec3 color1 = vec3(1.0, 0.82, 0.0); // First color (e.g., red)
    vec3 color2 = vec3(0.97, 0.37, 0.0); // Second color (e.g., blue)
    
    float angle = dot(normalize(vNormal), normalize(cameraDirection));
    vec3 finalColor = mix(color1, color2, clamp(angle, 0.0, 1.0));
    
    gl_FragColor = vec4(finalColor, 1);
   
}