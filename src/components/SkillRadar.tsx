"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const AXES = [
  "Python", "TypeScript", "AI Tooling", "API Design",
  "SQL", "Database Design", "Statistics", "Visualization",
];

export const MY_SERIES = [
  { label: "Projects",  color: 0x3b5ea6, values: [7, 8, 9, 8, 8, 8, 7, 7] },
  { label: "Education", color: 0x2a9d6e, values: [8, 4, 5, 4, 7, 6, 9, 7] },
];

export const JOB_COLOR = 0xe07b39;

const N     = AXES.length;
const MAX_R = 2.2;
const LEVELS = [0.25, 0.5, 0.75, 1];

export const axisAngle  = (i: number) => (i / N) * Math.PI * 2 - Math.PI / 2;
const radarPoint = (i: number, val: number, y: number) =>
  new THREE.Vector3(Math.cos(axisAngle(i)) * (val / 10) * MAX_R, y, Math.sin(axisAngle(i)) * (val / 10) * MAX_R);
const outerPoint = (i: number, y: number) =>
  new THREE.Vector3(Math.cos(axisAngle(i)) * MAX_R, y, Math.sin(axisAngle(i)) * MAX_R);

function buildRadarMesh(values: number[], y: number, hexColor: number): THREE.Group {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  values.forEach((v, i) => {
    const p = radarPoint(i, v, 0);
    i === 0 ? shape.moveTo(p.x, p.z) : shape.lineTo(p.x, p.z);
  });
  shape.closePath();

  const fillMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false })
  );
  fillMesh.rotation.x = -Math.PI / 2;
  fillMesh.position.y = y;
  group.add(fillMesh);

  const outlinePts = [...values.map((v, i) => radarPoint(i, v, y)), radarPoint(0, values[0], y)];
  group.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(outlinePts),
    new THREE.LineBasicMaterial({ color: hexColor })
  ));

  values.forEach((v, i) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: hexColor })
    );
    dot.position.copy(radarPoint(i, v, y));
    group.add(dot);
  });

  return group;
}

function buildGrid(scene: THREE.Scene) {
  const mat = (opacity: number) =>
    new THREE.LineBasicMaterial({ color: 0xd1cfc4, transparent: true, opacity });

  [-1, 0, 1].forEach((y) => {
    LEVELS.forEach((lvl) => {
      const pts = Array.from({ length: N + 1 }, (_, i) => {
        const a = axisAngle(i % N);
        const r = lvl * MAX_R;
        return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      });
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat(0.35)));
    });
    for (let i = 0; i < N; i++) {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y, 0), outerPoint(i, y)]),
        mat(0.35)
      ));
    }
  });

  for (let i = 0; i < N; i++) {
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([outerPoint(i, -1), outerPoint(i, 1)]),
      mat(0.18)
    ));
  }
}

interface Props {
  jobScores: Record<string, number> | null;
}

export default function SkillRadar({ jobScores }: Props) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const jobLayerRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0xffffff, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(4.5, 3.5, 4.5);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance   = 3;
    controls.maxDistance   = 12;

    buildGrid(scene);
    scene.add(buildRadarMesh(MY_SERIES[0].values, -1.0, MY_SERIES[0].color));
    scene.add(buildRadarMesh(MY_SERIES[1].values,  0.0, MY_SERIES[1].color));

    let frame: number | undefined;
    const requestRender = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        controls.update();
        renderer.render(scene, camera);
      });
    };

    const ro = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      requestRender();
    });
    ro.observe(el);

    controls.addEventListener('change', requestRender);
    requestRender();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // Add/remove job layer when scores change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (jobLayerRef.current) { scene.remove(jobLayerRef.current); jobLayerRef.current = null; }
    if (!jobScores) return;

    const values = AXES.map((axis) => jobScores[axis] ?? 0);
    const group  = buildRadarMesh(values, 1.0, JOB_COLOR);

    values.forEach((v, i) => {
      const top = radarPoint(i, v, 1.0);
      const bot = new THREE.Vector3(top.x, -1.0, top.z);
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([bot, top]),
        new THREE.LineBasicMaterial({ color: JOB_COLOR, transparent: true, opacity: 0.2 })
      ));
    });

    scene.add(group);
    jobLayerRef.current = group;
  }, [jobScores]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "520px" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        {AXES.map((label, i) => {
          const a  = axisAngle(i);
          const px = 50 + Math.cos(a) * 44;
          const py = 50 + Math.sin(a) * 38;
          return (
            <div key={label} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, transform: "translate(-50%,-50%)", fontSize: "10px", color: "#64748B", whiteSpace: "nowrap" }}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
