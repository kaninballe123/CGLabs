#version 410

layout(location = 0) in vec3 vertex;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec3 texcoord;
layout(location = 3) in vec3 tangent;
layout(location = 4) in vec3 binormal;

uniform vec3 light_position;
uniform vec3 camera_position;

uniform mat4 vertex_model_to_world;
uniform mat4 normal_model_to_world;
uniform mat4 vertex_world_to_clip;

out VS_OUT{

	vec3 normal;
	vec3 vertex;
	vec3 binormal;
	vec3 tangent;
	vec2 texcoord;
	} vs_out;

	void main()
{
	
	vs_out.normal = (normal_model_to_world * vec4(normal, 0.0)).xyz;
	vs_out.binormal = (normal_model_to_world * vec4(binormal, 0.0)).xyz;
	vs_out.tangent = (normal_model_to_world * vec4(tangent, 0.0)).xyz;

	vs_out.texcoord = texcoord.xy;

	vec3 world_position = vec3(vertex_model_to_world * vec4(vertex, 1.0));

	vs_out.vertex = camera_position - world_position;
	

	gl_Position = vertex_world_to_clip * vec4(world_position, 1.0);

}
