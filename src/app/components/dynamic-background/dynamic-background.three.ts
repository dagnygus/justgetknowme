import { BufferGeometry,
  Float32BufferAttribute,
  FogExp2,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer } from 'three';

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let material: PointsMaterial;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let mouseX = 0;
let mouseY = 0;
let container: HTMLElement | null = null;
let disposed = false;

export function init(cont: HTMLElement): void {
  container = cont;
  camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
  camera.position.z = 1000;

  scene = new Scene();
  scene.fog = new FogExp2(0x000000, 0.001);
  const geomentry = new BufferGeometry();
  const vertices: number[] = [];
  const texture = new TextureLoader().load('/assets/images/my_image.png');

  for ( let i = 0; i < 10000; i ++ ) {

    const x = 2000 * Math.random() - 1000;
    const y = 2000 * Math.random() - 1000;
    const z = 2000 * Math.random() - 1000;

    vertices.push(x, y, z);

  }

  geomentry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  material = new PointsMaterial({
    size: 35,
    sizeAttenuation: true,
    map: texture,
    alphaTest: 0.5,
    transparent: true,
  });

  material.color.setHSL( 1.0, 0.3, 0.7 );
  const particles = new Points(geomentry, material);
  scene.add(particles);

  renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  container.style.touchAction = 'none';
  window.addEventListener('pointermove', onPointerMove);

  window.addEventListener('resize', onWindowResize);

  animate();
}


function onWindowResize(): void {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event: PointerEvent): void {
  if (event.isPrimary === false) { return; }
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function render(): void {
  const time = Date.now() * 0.00005;
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
  material.color.setHSL(h, 0.5, 0.5);
  renderer.render(scene, camera);
}

function animate(): void {
  if (disposed) { return; }
  render();
  requestAnimationFrame(animate);
}

export function dispose(): void {
  window.addEventListener('pointermove', onPointerMove);
  window.removeEventListener('resize', onWindowResize);
  disposed = true;
  container = null;
}
