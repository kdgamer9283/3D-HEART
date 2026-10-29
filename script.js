
console.clear();

// 1. CREATE THE SCENE AND CAMERA
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

camera.position.z = 500;

// 2. CREATE THE RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

// 3. CREATE MOUSE CONTROLS
const controls = new THREE.OrbitControls(
  camera,
  renderer.domElement
);

// 4. READ THE HEART SHAPE
const heartPath = document.querySelector("svg path");
const pathLength = heartPath.getTotalLength();
const vertices = [];

// 5. CREATE AND ANIMATE THE PARTICLES
const timeline = gsap.timeline({
  repeat: -1,
  yoyo: true
});

for (
  let distance = 0;
  distance < pathLength;
  distance += 0.1
) {
  const point = heartPath.getPointAtLength(distance);

  const particle = new THREE.Vector3(
    point.x,
    -point.y,
    0
  );

  // Add random 3D depth and spread
  particle.x += (Math.random() - 0.5) * 30;
  particle.y += (Math.random() - 0.5) * 30;
  particle.z += (Math.random() - 0.5) * 70;

  vertices.push(particle);

  // Animate this particle from the center
  timeline.from(
    particle,
    {
      x: 300,
      y: -276,
      z: 0,
      ease: "power2.inOut",
      duration: "random(2, 5)"
    },
    distance * 0.002
  );
}

// 6. DRAW THE HEART
const geometry =
  new THREE.BufferGeometry().setFromPoints(vertices);

const material = new THREE.PointsMaterial({
  color: 0xee5282,
  blending: THREE.AdditiveBlending,
  size: 3,
  transparent: true,
  depthWrite: false
});

const particles = new THREE.Points(
  geometry,
  material
);

particles.position.x -= 300;
particles.position.y += 276;

scene.add(particles);

// 7. ROTATE THE HEART
gsap.fromTo(
  scene.rotation,
  { y: -0.2 },
  {
    y: 0.2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
    duration: 3
  }
);

// 8. RENDER THE ANIMATION
function render() {
  requestAnimationFrame(render);

  geometry.setFromPoints(vertices);
  controls.update();

  renderer.render(scene, camera);
}

render();

// 9. HANDLE WINDOW RESIZING
function onWindowResize() {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

window.addEventListener("resize", onWindowResize);
