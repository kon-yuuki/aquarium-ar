import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { AquariumObjectType } from '@/types/aquarium';
import { Mesh } from 'three';
import { useThree } from '@react-three/fiber';

interface PlaceholderObjectProps {
  type: AquariumObjectType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  selected?: boolean;
  onClick?: () => void;
  onMeshReady?: (mesh: Mesh) => void;
  onDragStateChange?: (isDragging: boolean) => void;
}

// オブジェクトの種類ごとの色を定義
const typeColors: Record<AquariumObjectType, string> = {
  plant: '#4CAF50', // 水草は緑色
  stone: '#607D8B', // 石は灰色
  wood: '#795548', // 流木は茶色
};

// オブジェクトの種類ごとのサイズを定義 [幅, 高さ, 奥行き]
const typeSizes: Record<AquariumObjectType, [number, number, number]> = {
  plant: [0.5, 1, 0.5], // 水草は細長い形状
  stone: [0.8, 0.6, 0.8], // 石はやや扁平な形状
  wood: [0.4, 1.2, 0.4], // 流木は細長い形状
};

// アウトラインのサイズ倍率（1.1 = 10%大きい）
const OUTLINE_SCALE = 1.05;

export default function PlaceholderObject({
  type,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],  // デフォルト値を追加
  selected = false,
  onClick,
  onMeshReady,
  onDragStateChange,
}: PlaceholderObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const mouseDownTimeRef = useRef<number>(0);
  const CLICK_THRESHOLD = 200; // クリックとドラッグを区別する時間のしきい値（ミリ秒）

  React.useEffect(() => {
    if (meshRef.current && onMeshReady) {
      onMeshReady(meshRef.current);
    }
  }, [onMeshReady]);

  const color = typeColors[type];
  const size = typeSizes[type];

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}  // scaleを適用
      onPointerDown={(event) => {
        event.stopPropagation();
        mouseDownTimeRef.current = Date.now();
        // ドラッグ開始時にfalseをセット
        onDragStateChange?.(false);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        const timeSinceMouseDown = Date.now() - mouseDownTimeRef.current;

        if (timeSinceMouseDown < CLICK_THRESHOLD) {
          console.log('Detected as click');
          onDragStateChange?.(false);
          onClick?.();
        } else {
          console.log('Detected as drag');
          onDragStateChange?.(true);
        }
      }}
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent={true} opacity={0.8} />

      {/* 選択時のアウトライン */}
      {selected && (
        <mesh position={[0, 0, 0]} scale={[OUTLINE_SCALE, OUTLINE_SCALE, OUTLINE_SCALE]}>
          <boxGeometry args={size} />
          <meshBasicMaterial color="#1a73e8" transparent={true} opacity={0.7} depthTest={false} />
        </mesh>
      )}
    </mesh>
  );
}
