  
#version 410

uniform mat4 normal_model_to_world;
uniform sampler2D my_texture3;
uniform sampler2D my_texture2;

uniform vec3 ambient; 
uniform vec3 diffuse; 
uniform vec3 specular;
uniform float shininess;


in VS_OUT{
	vec3 normal;
	vec3 vertex;
	vec3 binormal;
	vec3 tangent;
	vec2 texcoord;
} fs_in;

out vec4 frag_color;

	void main()
{
	


	vec3 n = normalize(fs_in.normal);
	vec3 t = normalize(fs_in.tangent);
	vec3 b = normalize(fs_in.binormal);
	vec3 l = normalize(fs_in.vertex);

	mat3 TBN = mat3(t,b,n);

	vec3 normaltext = (texture(my_texture3, fs_in.texcoord).xyz)*2-1;
	vec3 normalmap = normalize(TBN * normaltext);


	vec3 diffuse_text = texture(my_texture2,fs_in.texcoord).xyz;
	frag_color.xyz = diffuse_text*max(dot(l, normalmap), 0.0);
	
	frag_color.w = 1.0;

	}
