import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, ARButton, createXRStore } from '@react-three/xr';
import Tank from '../models/Tank';
import TankControls from '../controls/TankSizeControls';
import { Button } from '@/components/ui/button';
import { CameraController } from '../controls/CameraController';
import ObjectList from '../object/ObjectList';
import { AquariumObject, PlacedObject } from '@/types/aquarium';
import PlaceholderObject from '../models/PlaceholderObject';
import ObjectTransformControls from '../controls/ObjectTransformControls';
import HelpPanel from '../controls/HelpPanel';
import ModelUploader from '../controls/ModelUploader';
import { Mesh } from 'three';
import * as THREE from 'three';
import { HelpCircle } from 'lucide-react';
import { useARSession } from '@/hooks/useARSession';
import ARController from '../ar/ARController';

interface UploadedModel {
  id: string;
  name: string;
  file: File;
}

export default function BasicScene() {
  const [tankSize, setTankSize] = useState({
    width: 60,
    height: 60,
    depth: 60,
  });

  // AR状態管理
  const [isAREnabled, setIsAREnabled] = useState(false);
  const arSession = useARSession();
  const [store] = useState(() => createXRStore());

  // ドラッグ状態をグローバルに管理
  const [isObjectDragging, setIsObjectDragging] = useState(false);

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // ヘルプパネルの表示状態を管理
  const [showHelp, setShowHelp] = useState(false);

  const [uploadedModels, setUploadedModels] = useState<UploadedModel[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'g':
          setTransformMode('translate');
          break;
        case 'r':
          setTransformMode('rotate');
          break;
        case 's':
          setTransformMode('scale');
          break;
        case 'h': // Hキーでヘルプを表示/非表示
          setShowHelp(prev => !prev);
          break;
      }
    };

    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // 空の依存配列

const handleModelUpload = (file: File) => {
  // ファイル名から拡張子を除いた部分を取得
  const fileName = file.name.split('.')[0];

  // 新しいモデル情報を作成
  const newModel = {
    id: `model_${Date.now()}`, // ユニークなIDを生成
    name: fileName,            // ファイル名をモデル名として使用
    file: file                 // ファイル自体を保存
  };

  // 既存のモデルリストに新しいモデルを追加
  setUploadedModels(prevModels => [...prevModels, newModel]);

  console.log('モデルをアップロードしました:', newModel);
};

  //アイテム一覧から選択する
  const handleObjectSelect = (object: AquariumObject) => {
    // 新しいオブジェクトを作成します
    const newObject = {
      // 元のIDにタイムスタンプを加えて、新しいユニークなIDを作ります
      id: `${object.id}_${Date.now()}`,
      // オブジェクトの種類（plant, stone, woodなど）をそのまま使います
      type: object.type,
      // 位置を原点（0, 0, 0）に設定します
      position: [0, 0, 0] as [number, number, number],
      // 回転も初期状態（0, 0, 0）に設定します
      rotation: [0, 0, 0] as [number, number, number],
      // スケールも初期状態（1, 1, 1）に設定します
      scale: [1, 1, 1] as [number, number, number],
    };

    // 作成した新しいオブジェクトを、既存のオブジェクトリストに追加します
    setPlacedObjects(prevObjects => [...prevObjects, newObject]);

    // 追加したオブジェクトを選択状態にします
    setSelectedObjectId(newObject.id);
  };

  // ドラッグ状態変更のハンドラー
  const handleDragStateChange = (isDragging: boolean) => {
    setIsObjectDragging(isDragging);
  };

  //オブジェクトをクリックして選択する
  const handleObjectClick = (objectId: string) => {
    // ドラッグ中は選択状態を変更しない
    if (isObjectDragging) {
      console.log('Click ignored - object is being dragged');
      return;
    }
    setSelectedObjectId(objectId === selectedObjectId ? null : objectId);
  };

  //選択したオブジェクトを削除する
  const handleDeleteObject = () => {
    // selectedObjectIdが存在する場合（つまり、オブジェクトが選択されている場合）に実行
    if (selectedObjectId) {
      // setPlacedObjectsを使って、現在配置されているオブジェクトの一覧を更新します
      setPlacedObjects(prevObjects =>
        // filter関数を使って、選択されているオブジェクト以外のオブジェクトだけを残します
        prevObjects.filter(obj => obj.id !== selectedObjectId)
      );
      // 削除後は選択状態をクリアします
      setSelectedObjectId(null);
    }
  };

  const handleObjectMove = (objectId: string, newPosition: [number, number, number]) => {
    setPlacedObjects(prevObjects =>
      prevObjects.map(obj => (obj.id === objectId ? { ...obj, position: newPosition } : obj))
    );
  };

  const handleObjectRotate = (objectId: string, newRotation: [number, number, number]) => {
    setPlacedObjects(prevObjects =>
      prevObjects.map(obj => (obj.id === objectId ? { ...obj, rotation: newRotation } : obj))
    );
  };

  const handleObjectScale = (objectId: string, newScale: [number, number, number]) => {
    setPlacedObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === objectId
          ? { ...obj, scale: newScale } // 該当オブジェクトのscaleを更新
          : obj
      )
    );
  };

  const handleResetCamera = () => {
    (window as any).resetCamera?.();
  };

  // placedObjectsを状態として管理
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([
    {
      id: 'plant1',
      type: 'plant',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      id: 'stone1',
      type: 'stone',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    {
      id: 'wood1',
      type: 'wood',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
  ]);

  // メッシュの参照を保持するステートを追加
  const [meshRefs, setMeshRefs] = useState<{ [key: string]: Mesh | null }>({});

  // メッシュの参照を更新する関数
  const handleMeshReady = (objectId: string, mesh: Mesh) => {
    setMeshRefs(prev => ({
      ...prev,
      [objectId]: mesh,
    }));
  };

  useEffect(() => {
    console.log('Selected object changed:', selectedObjectId);
  }, [selectedObjectId]);

  // 初回訪問時にヘルプを表示する（オプション）
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowHelp(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* AR開始ボタン */}
      <div className="absolute top-4 left-4 z-10">
        {arSession.isSupported ? (
          <ARButton
            store={store}
            onClick={() => {
              if (isAREnabled) {
                setIsAREnabled(false);
                arSession.endARSession();
              } else {
                setIsAREnabled(true);
                arSession.startARSession();
              }
            }}
          />
        ) : (
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            ARサポートなし
          </div>
        )}
        {/* AR状態表示 */}
        {arSession.error && (
          <div className="mt-2 bg-red-800 text-white px-3 py-1 rounded text-sm">
            {arSession.error}
          </div>
        )}
        {arSession.isLoading && (
          <div className="mt-2 bg-blue-800 text-white px-3 py-1 rounded text-sm">
            AR起動中...
          </div>
        )}
      </div>

      <Canvas
        camera={{
          position: [0, 7, 17],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <XR store={store}>
          <ARController
            placedObjects={placedObjects}
            selectedObjectId={selectedObjectId}
            onObjectPlace={(position, rotation) => {
              // AR環境でオブジェクトを配置する際のハンドラー
              console.log('Object placed in AR:', position, rotation);
            }}
            onObjectMove={handleObjectMove}
          >
            {/* 通常の3Dシーン（ARでない場合のみ表示） */}
            {!isAREnabled && (
              <>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Tank width={tankSize.width} height={tankSize.height} depth={tankSize.depth} />
                <mesh
                  position={[0, -0.01, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  onClick={() => setSelectedObjectId(null)}
                >
                  <planeGeometry args={[100, 100]} />
                  <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} depthTest={false} />
                </mesh>
              </>
            )}

            {/* 配置されたオブジェクト（AR・通常モード共通） */}
            {placedObjects.map(obj => (
              <group key={obj.id}>
                <PlaceholderObject
                  type={obj.type}
                  position={obj.position as [number, number, number]}
                  rotation={obj.rotation as [number, number, number]}
                  scale={obj.scale as [number, number, number]}
                  selected={selectedObjectId === obj.id}
                  onClick={() => handleObjectClick(obj.id)}
                  onMeshReady={mesh => handleMeshReady(obj.id, mesh)}
                  onDragStateChange={handleDragStateChange}
                />
                {/* ARモードでない場合のみトランスフォームコントロールを表示 */}
                {!isAREnabled && meshRefs[obj.id] && (
                  <ObjectTransformControls
                    objectId={obj.id}
                    selected={selectedObjectId === obj.id}
                    mesh={meshRefs[obj.id]}
                    mode={transformMode}
                    onPositionChange={handleObjectMove}
                    onRotationChange={handleObjectRotate}
                    onScaleChange={handleObjectScale}
                  />
                )}
              </group>
            ))}
          </ARController>

          {/* 通常モードでのみカメラコントローラーを有効化 */}
          {!isAREnabled && <CameraController />}
          {!isAREnabled && <axesHelper args={[5]} />}
        </XR>
        </Canvas>

      <div className="absolute top-4 right-4 h-screen overflow-scroll">
        <div className="mb-2 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowHelp(true)}
            title="ヘルプを表示 [H]"
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-5 w-5" />
            <span>使い方ガイド</span>
          </Button>
        </div>

        <TankControls size={tankSize} onChange={setTankSize} />
        <ObjectList
  onSelectObject={handleObjectSelect}
  uploadedModels={uploadedModels} // 新しいプロパティを追加
/>
        <div className="mt-4">
        <ModelUploader onModelUpload={handleModelUpload} />
        </div>

        {/* モード切り替えボタンを追加 */}
        <div className="mt-2 flex gap-2">
          <Button
            onClick={() => setTransformMode('translate')}
            variant={transformMode === 'translate' ? 'default' : 'outline'}
            className="flex-1"
          >
            移動 <span className="ml-2 text-xs text-muted-foreground">[G]</span>
          </Button>
          <Button
            onClick={() => setTransformMode('rotate')}
            variant={transformMode === 'rotate' ? 'default' : 'outline'}
            className="flex-1"
          >
            回転 <span className="ml-2 text-xs text-muted-foreground">[R]</span>
          </Button>
          <Button
            onClick={() => setTransformMode('scale')}
            variant={transformMode === 'scale' ? 'default' : 'outline'}
            className="flex-1"
          >
            サイズ <span className="ml-2 text-xs text-muted-foreground">[S]</span>
          </Button>
        </div>

        <div className="mt-2">
          <Button onClick={handleResetCamera} className="w-full">
            視点をリセット
          </Button>
          {/* 選択中のオブジェクトがある場合（selectedObjectIdがtrueの場合）にのみ表示 */}
          {selectedObjectId && (
            <div className="mt-2">
              <Button
                onClick={handleDeleteObject}
                variant="destructive" // 赤色で危険な操作であることを示す
                className="w-full"
              >
                選択中のオブジェクトを削除
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ヘルプパネルのオーバーレイ */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="p-4">
            <HelpPanel onClose={() => setShowHelp(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
