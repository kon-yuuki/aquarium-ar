import React, { useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { Mesh } from 'three';
import { useThree } from '@react-three/fiber';

interface ObjectTransformControlsProps {
  objectId: string;
  position: [number, number, number];
  selected: boolean;
  mesh: THREE.Mesh | null;  // meshはnullの可能性もあるため
  mode: 'translate' | 'rotate' | 'scale';
  onPositionChange?: (objectId: string, position: [number, number, number]) => void;
  onRotationChange?: (objectId: string, rotation: [number, number, number]) => void;
  onScaleChange?: (objectId: string, scale: [number, number, number]) => void;
  onDragStateChange?: (isDragging: boolean) => void;
}

export default function ObjectTransformControls({
  objectId,
  position,
  selected,
  mesh,
  mode,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onDragStateChange
}: ObjectTransformControlsProps) {
  const { camera, gl } = useThree();
  const transformRef = useRef<THREE.TransformControls | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const controls = transformRef.current;
    if (controls && mesh) {
      // ドラッグ状態変更時のハンドラー
      const handleDragging = (event: { value: boolean }) => {
        console.log('TransformControls drag state:', event.value);
        // 親コンポーネントにドラッグ状態を通知
        onDragStateChange?.(event.value);
      };

      // イベントリスナーの設定
      controls.addEventListener('dragging-changed', handleDragging);

      // クリーンアップ
      return () => {
        controls.removeEventListener('dragging-changed', handleDragging);
      };
    }
  }, [mesh, onDragStateChange]); // 依存配列にonDragStateChangeを追加

  if (!selected || !mesh) return null;

  return (
    <TransformControls
      ref={transformRef}
      object={mesh}
      camera={camera}
      domElement={gl.domElement}
      mode={mode}
      onObjectChange={(e) => {
        if (!e.target || !isDraggingRef.current) return;

        if (mode === 'translate' && e.target.position) {
          onPositionChange?.(objectId, [
            e.target.position.x,
            e.target.position.y,
            e.target.position.z,
          ]);
        } else if (mode === 'rotate' && e.target.rotation) {
          onRotationChange?.(objectId, [
            e.target.rotation.x,
            e.target.rotation.y,
            e.target.rotation.z,
          ]);
        } else if (mode === 'scale' && e.target.scale) {
          onScaleChange?.(objectId, [
            e.target.scale.x,
            e.target.scale.y,
            e.target.scale.z,
          ]);
        }
      }}
      // // イベントの伝播を防ぐ
      onClick={(e) => e.stopPropagation()}
      // マウスアップ時の処理を追加
      onPointerUp={(e) => {
        console.log('Pointer up on transform controls');
        e.stopPropagation();
      }}
    />
  );
}
