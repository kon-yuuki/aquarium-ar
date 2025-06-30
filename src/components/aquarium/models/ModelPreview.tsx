import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Environment } from '@react-three/drei';
import { Group, Box3, Vector3 } from 'three';

interface ModelPreviewProps {
  file: File;
  width?: number;
  height?: number;
  className?: string;
}

interface ModelComponentProps {
  url: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

function ModelComponent({ url, onLoad, onError }: ModelComponentProps) {
  const groupRef = useRef<Group>(null);
  
  try {
    const { scene } = useGLTF(url);
    
    React.useEffect(() => {
      if (scene && groupRef.current) {
        // モデルのバウンディングボックスを計算して中央に配置
        const box = new Box3().setFromObject(scene);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        // モデルを中央に移動
        scene.position.sub(center);
        
        // 適切なスケールに調整（最大サイズを2に制限）
        const maxSize = Math.max(size.x, size.y, size.z);
        if (maxSize > 2) {
          const scale = 2 / maxSize;
          scene.scale.setScalar(scale);
        }
        
        onLoad?.();
      }
    }, [scene, onLoad]);
    
    return (
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    );
  } catch (error) {
    console.error('モデル読み込みエラー:', error);
    onError?.(error as Error);
    return null;
  }
}

export default function ModelPreview({ 
  file, 
  width = 200, 
  height = 200, 
  className = '' 
}: ModelPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      // ファイルサイズチェック（50MB制限）
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError(`ファイルサイズが大きすぎます。50MB以下にしてください。(現在: ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        setIsLoading(false);
        return;
      }

      // ファイルの形式チェック
      const supportedFormats = ['.gltf', '.glb', '.obj'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!supportedFormats.includes(fileExtension)) {
        setError(`サポートされていないファイル形式です: ${fileExtension}`);
        setIsLoading(false);
        return;
      }

      // ファイルをBlobURLに変換
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setError(null);
      setIsLoading(true);

      // クリーンアップ関数
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error: Error) => {
    setError(`モデルの読み込みに失敗しました: ${error.message}`);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="text-red-500 text-sm mb-2">❌</div>
          <div className="text-red-600 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || !modelUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin text-2xl mb-2">⏳</div>
          <div className="text-gray-600 text-xs">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Canvas
        camera={{
          position: [3, 3, 3],
          fov: 45,
          near: 0.1,
          far: 100
        }}
      >
        {/* 基本的な照明設定 */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />
        
        {/* 環境マップ（簡易版） */}
        <Environment preset="studio" />
        
        {/* モデルを中央に配置 */}
        <Center>
          <ModelComponent 
            url={modelUrl}
            onLoad={handleLoad}
            onError={handleError}
          />
        </Center>
        
        {/* カメラコントロール */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// GLTFローダーのプリロード機能
useGLTF.preload = () => {};