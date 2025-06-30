import { useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ObjectTransformControlsProps {
  objectId: string;
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
  selected,
  mesh,
  mode,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onDragStateChange
}: ObjectTransformControlsProps) {
  const { camera, gl } = useThree();
  const transformRef = useRef<any>(null);
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
        if (!e?.target || !isDraggingRef.current) return;

        const target = e.target as THREE.Object3D;
        if (mode === 'translate' && target.position) {
          onPositionChange?.(objectId, [
            target.position.x,
            target.position.y,
            target.position.z,
          ]);
        } else if (mode === 'rotate' && target.rotation) {
          onRotationChange?.(objectId, [
            target.rotation.x,
            target.rotation.y,
            target.rotation.z,
          ]);
        } else if (mode === 'scale' && target.scale) {
          onScaleChange?.(objectId, [
            target.scale.x,
            target.scale.y,
            target.scale.z,
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
