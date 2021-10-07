#version 410

uniform samplerCube my_cube_map;

in VS_OUT {
vec3 vertex;
vec3 normal; }

fs_in;

out vec4 frag_color;

void main() {

vec3 normal = normalize(fs_in.normal);

frag_color = texture(my_cube_map,normal);



}
