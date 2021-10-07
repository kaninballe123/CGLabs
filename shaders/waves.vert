#version 410

layout (location = 0) in vec3 vertex;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec3 texcoord;

uniform mat4 vertex_model_to_world;
uniform mat4 normal_model_to_world;
uniform mat4 vertex_world_to_clip;

uniform float time;
uniform float amplitudes[2];
uniform float frequencies[2];
uniform float sharpness[2];
uniform float phases[2];
uniform vec2 directions[2];
uniform int nbr_of_waves;



out VS_OUT {
	vec3 vertex;
	vec3 normal;
	vec3 tangent;
	vec3 binormal;
	vec2 texcoord;
} vs_out;

float wave(vec2 position, vec2 direction, float amplitude, float frequency, float phase, float sharpness, float time)
{
return amplitude*pow(sin((position.x*direction.x+position.y*direction.y)*frequency + time * phase) * 0.5 + 0.5, sharpness);


}

float derivative(vec2 pos, vec2 D, float A, float f, float p, float k, float t){
	return 0.5*k*f*A*(pow(sin(dot(D,pos)*f + t*p)*0.5+0.5,k-1)) * cos(dot(D,pos)*f + t*p);
}


void main()
{

	float dHdx = 0.0f;
	float dHdz = 0.0f;

	vec3 displaced_vertex = vertex;

	for(int i = 0; i < nbr_of_waves; i++){

		displaced_vertex.y += wave(vertex.xz, directions[i], 
			amplitudes[i], frequencies[i], phases[i], sharpness[i], time);

			float der = derivative(vertex.xz, directions[i], 
			amplitudes[i], frequencies[i], phases[i], sharpness[i], time);

		dHdx += (der*directions[i].x);
		dHdz += (der*directions[i].y);

		}

vs_out.vertex = vec3(vertex_model_to_world * vec4(displaced_vertex, 1.0));
	vs_out.normal = vec3(-dHdx, 1.0f, -dHdz);
	vs_out.binormal = vec3(0.0, dHdz, 1.0);
	vs_out.tangent = vec3(1.0, dHdx, 0.0);
	
	vs_out.texcoord = texcoord.xz;
	gl_Position = vertex_world_to_clip * vertex_model_to_world * vec4(displaced_vertex, 1.0);
}



