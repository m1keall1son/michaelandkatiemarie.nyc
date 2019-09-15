uniform sampler2D u_tex;
varying vec2 vUv;
void main()	{
	gl_FragColor = texture(u_tex, vUv);
}