#version 410

uniform sampler2D my_texture2;
uniform sampler2D my_texture1;
uniform sampler2D my_texture3;

uniform vec3 light_position;
uniform vec3 camera_position;

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 specular;
uniform float shininess;
uniform int has_my_texture3;
uniform int use_normal_mapping;


in VS_OUT{
	vec3 vertex;
	vec3 normal;
	vec3 light;
	vec2 texcoord;
	vec3 binormal;
	vec3 tangent;
} fs_in;
out vec4 fColor;

void main()
{
vec3 N = normalize(fs_in.normal);
if (has_my_texture3 == 1 && use_normal_mapping == 1) {

	vec3 t = normalize(fs_in.tangent);
	vec3 b = normalize(fs_in.binormal);
	

	mat3 TBN = mat3(t,b,N);

	vec3 normaltext = (texture(my_texture3, fs_in.texcoord).xyz)*2-1;
	N = normalize(TBN * normaltext);
}
vec3 L = normalize(fs_in.light);
vec3 V = normalize(fs_in.vertex);
vec3 R = normalize(reflect(-L,N));
vec3 diffuse2 = vec3(texture(my_texture2, fs_in.texcoord))*max(dot(N,L),0.0);
vec3 specular2 = vec3(texture(my_texture1, fs_in.texcoord))*pow(max(dot(R,V),0.0), shininess);
fColor.xyz = ambient + diffuse2 + specular2;
fColor.w = 1.0;





}
