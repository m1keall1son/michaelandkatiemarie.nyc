uniform vec2 u_radius;
varying vec2 vUv;
void main()	{
	//float e1 =  ( vUv.x - 0.5 ) /  u_radius.x;
	//float e2 =  ( vUv.y - 0.5 ) /  u_radius.y;
	//float d  = (e1 * e1) + (e2 * e2);
	//if(d < 1.0) discard;
	if(vUv.x > u_radius.x && vUv.x < (1.0 - u_radius.x) && vUv.y > u_radius.y && vUv.y < (1.0 - u_radius.y)) discard;
	gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}