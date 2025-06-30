import React, { useState, useCallback } from 'react';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';
import ARHitTest from './ARHitTest';
import { PlacedObject } from '@/types/aquarium';

interface ARControllerProps {
  placedObjects: PlacedObject[];
  selectedObjectId: string | null;
  onObjectPlace?: (position: THREE.Vector3, rotation: THREE.Quaternion) => void;
  onObjectMove?: (objectId: string, position: [number, number, number]) => void;
  children?: React.ReactNode;
}

export function ARController({ 
  children 
}: ARControllerProps) {
  const { session } = useXR();
  const [lastHitPosition, setLastHitPosition] = useState<THREE.Vector3 | null>(null);
  const [lastHitRotation, setLastHitRotation] = useState<THREE.Quaternion | null>(null);

  // ヒットテスト結果のハンドリング
  const handleHitTest = useCallback((position: THREE.Vector3, rotation: THREE.Quaternion) => {
    setLastHitPosition(position.clone());
    setLastHitRotation(rotation.clone());
  }, []);

  // 将来的なオブジェクト配置機能のプレースホルダー
  console.log('AR placement data:', { lastHitPosition, lastHitRotation });

  // ARセッションの確認
  const isARActive = !!session;

  return (
    <>
      {/* ヒットテスト機能 */}
      <ARHitTest 
        onHitTest={handleHitTest}
        enabled={isARActive}
      />

      {/* AR用のライティング調整 */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[0, 10, 0]} 
        intensity={0.8}
        castShadow
      />

      {/* 既存のオブジェクトを表示 */}
      {children}

      {/* プレビューオブジェクト（ヒットテスト位置表示） */}
      {lastHitPosition && (
        <mesh 
          position={[lastHitPosition.x, lastHitPosition.y + 0.05, lastHitPosition.z]}
        >
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}

      {/* AR操作用の非表示UI（必要に応じて追加） */}
      <group>
        {/* コントローラーモデル等はreact-three/xrが自動的に処理 */}
      </group>
    </>
  );
}

export default ARController;