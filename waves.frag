#version 410

uniform sampler2D normal_map;
uniform samplerCube skybox;
uniform vec3 deep_color;
uniform vec3 shallow_color;
uniform vec3 camera_position;
uniform float time;
uniform mat4 normal_model_to_world;
uniform int nbr_of_waves;

in VS_OUT {
	vec3 vertex;
	vec3 normal;
	vec3 tangent;
	vec3 binormal;
	vec2 texcoord;
} fs_in;

out vec4 frag_color;

void main()
{
	mat3 TBN = mat3(normalize(fs_in.tangent), normalize(fs_in.binormal), normalize(fs_in.normal));
	vec2 texScale = vec2(8, 4);
	float normalTime = mod(time, 100.0);
	vec2 normalSpeed = vec2(-0.05, 0);
	vec3 normal1 = vec3(0.0);
	

	vec2 normalCoord0 = fs_in.texcoord.xy*texScale   + normalTime*normalSpeed;
	vec2 normalCoord1 = fs_in.texcoord.xy*texScale*2   + normalTime*normalSpeed*4;
	vec2 normalCoord2 = fs_in.texcoord.xy*texScale*4   + normalTime*normalSpeed*8;

	normal1 = vec3(texture(normal_map, normalCoord0)*2-1 + texture(normal_map, normalCoord1)*2-1 + texture(normal_map, normalCoord2)*2-1);

	normal1 = normalize(normal1);
	normal1 = normalize(TBN * normal1);

	vec3 V = normalize(camera_position - fs_in.vertex);
	float facing = 1 - max(dot(V,normal1),0.0);
	vec3 water_color = mix(deep_color, shallow_color, facing);
	vec3 reflection  = texture(skybox, reflect(-V, normal1)).xyz;
	float r0 = 0.02037;
	float n1 = 1.33;
	float n2 = 1.0/1.33;
	vec3 refraction  = texture(skybox, refract(-V,normal1, n2)).xyz;

	float fastFresnel = r0 + (1-r0)*pow(1-dot(V,normal1),5);
	frag_color = vec4(water_color+ reflection*fastFresnel + refraction*(1-fastFresnel) ,1.0);
	
	
}
