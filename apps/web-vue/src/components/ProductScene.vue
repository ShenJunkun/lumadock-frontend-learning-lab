<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";

const props = withDefaults(
  defineProps<{
    accent?: string;
  }>(),
  {
    accent: "#16a3a3",
  },
);

const root = ref<HTMLDivElement | null>(null);
let animationFrame = 0;
let group: Group | null = null;
let renderer: WebGLRenderer | null = null;
let resizeObserver: ResizeObserver | null = null;
const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function createBox(
  size: [number, number, number],
  position: [number, number, number],
  material: MeshStandardMaterial,
) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildModel(accent: string) {
  const model = new Group();
  model.rotation.set(0.15, -0.35, 0);

  const shell = new MeshStandardMaterial({
    color: "#20252d",
    metalness: 0.62,
    roughness: 0.28,
  });
  const strip = new MeshStandardMaterial({
    color: accent,
    emissive: new Color(accent),
    emissiveIntensity: 0.75,
  });
  const port = new MeshStandardMaterial({
    color: "#dfe7e9",
    metalness: 0.5,
    roughness: 0.22,
  });
  const darkPort = new MeshStandardMaterial({
    color: "#12161c",
    metalness: 0.3,
    roughness: 0.4,
  });
  const shelf = new MeshStandardMaterial({
    color: "#f4f6f2",
    metalness: 0.12,
    roughness: 0.3,
  });
  const base = new MeshStandardMaterial({
    color: "#d9dee0",
    metalness: 0.4,
    roughness: 0.36,
  });

  model.add(createBox([3.4, 0.34, 1.24], [0, 0, 0], shell));
  model.add(createBox([3.1, 0.08, 0.08], [0, 0.2, -0.55], strip));
  model.add(createBox([0.54, 0.12, 0.08], [-1.12, 0.23, 0.66], port));
  model.add(createBox([0.54, 0.12, 0.08], [-0.28, 0.23, 0.66], port));
  model.add(createBox([0.88, 0.16, 0.08], [0.64, 0.25, 0.66], darkPort));
  model.add(createBox([0.62, 0.28, 0.94], [1.35, 0.28, -0.02], shelf));
  model.add(createBox([3.9, 0.08, 1.58], [0, -0.28, 0], base));
  return model;
}

function disposeGroup(model: Group) {
  model.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      const material = object.material;
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

function mountScene() {
  if (!root.value) {
    return;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(44, 1, 0.1, 100);
  camera.position.set(0, 2.2, 5.2);

  renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  root.value.append(renderer.domElement);

  scene.add(new AmbientLight("#ffffff", 0.95));
  const directional = new DirectionalLight("#ffffff", 1.7);
  directional.position.set(4, 4, 4);
  directional.castShadow = true;
  scene.add(directional);
  const point = new PointLight(props.accent, 0.65);
  point.position.set(-3, 1.8, 2);
  scene.add(point);

  group = buildModel(props.accent);
  scene.add(group);

  const resize = () => {
    if (!root.value || !renderer) {
      return;
    }
    const width = root.value.clientWidth;
    const height = root.value.clientHeight;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root.value);
  resize();

  const animate = (time: number) => {
    if (group && !reducedMotion) {
      group.rotation.y = -0.35 + Math.sin(time * 0.0005) * 0.16;
      group.position.y = Math.sin(time * 0.0008) * 0.035;
    }
    renderer?.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  };
  animationFrame = window.requestAnimationFrame(animate);
}

onMounted(mountScene);

watch(
  () => props.accent,
  (accent) => {
    if (!group) {
      return;
    }
    disposeGroup(group);
    const nextGroup = buildModel(accent);
    group.parent?.add(nextGroup);
    group.parent?.remove(group);
    group = nextGroup;
  },
);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  if (group) {
    disposeGroup(group);
  }
  renderer?.dispose();
  renderer?.domElement.remove();
});
</script>

<template>
  <div
    ref="root"
    class="product-scene"
    aria-label="Interactive 3D LumaDock preview"
  />
</template>
