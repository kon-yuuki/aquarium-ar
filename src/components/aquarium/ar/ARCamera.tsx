import { useRef, useEffect } from 'react';
import { useXR } from '@react-three/xr';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ARCameraProps {
  onCameraReady?: (camera: THREE.Camera) => void;
}

export function ARCamera({ onCameraReady }: ARCameraProps) {
  const xrState = useXR();
  const { camera } = useThree();
  const arCameraRef = useRef<THREE.PerspectiveCamera>();

  useEffect(() => {
    if (xrState.session) {
      // AR環境でのカメラ設定
      const arCamera = new THREE.PerspectiveCamera(
        75, // fov
        window.innerWidth / window.innerHeight, // aspect
        0.01, // near
        1000 // far
      );
      
      arCameraRef.current = arCamera;
      onCameraReady?.(arCamera);

      console.log('AR Camera initialized:', arCamera);
    }
  }, [xrState.session, onCameraReady]);

  useFrame(() => {
    if (xrState.session && arCameraRef.current) {
      // AR空間でのカメラ位置とデバイスのポーズを同期
      // WebXRはカメラの姿勢を自動的に管理するため、
      // 通常はカメラを手動で操作する必要はない
    }
  });

  // AR中は通常のカメラコントロールを無効化
  if (xrState.session) {
    return null;
  }

  return (
    <>
      {/* 通常モードでのヘルパー表示 */}
      <primitive object={camera} />
    </>
  );
}

export default ARCamera;