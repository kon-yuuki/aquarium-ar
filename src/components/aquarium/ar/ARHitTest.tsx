import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

interface ARHitTestProps {
  onHitTest?: (position: THREE.Vector3, rotation: THREE.Quaternion) => void;
  enabled?: boolean;
}

export function ARHitTest({ onHitTest, enabled = true }: ARHitTestProps) {
  const { session } = useXR();
  const { gl } = useThree();
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const reticleRef = useRef<THREE.Mesh>(null);

  // ヒットテストソースの初期化
  useEffect(() => {
    if (!session || !enabled) return;

    const initHitTestSource = async () => {
      try {
        // ビューアーリファレンススペースを取得
        const viewerSpace = await session.requestReferenceSpace('viewer');
        
        // ヒットテストソースを作成
        if (session.requestHitTestSource) {
          const hitTestSource = await session.requestHitTestSource({ 
            space: viewerSpace 
          });
          
          hitTestSourceRef.current = hitTestSource || null;
        }
        console.log('Hit test source created');
      } catch (error) {
        console.error('Failed to create hit test source:', error);
      }
    };

    initHitTestSource();

    // クリーンアップ
    return () => {
      if (hitTestSourceRef.current) {
        hitTestSourceRef.current.cancel();
        hitTestSourceRef.current = null;
      }
    };
  }, [session, enabled]);

  // フレームごとのヒットテスト実行
  useFrame((state) => {
    if (!session || !hitTestSourceRef.current || !reticleRef.current) return;

    const frame = state.gl.xr.getFrame();
    if (!frame) return;

    try {
      // リファレンススペースを取得
      const referenceSpace = gl.xr.getReferenceSpace();
      if (!referenceSpace) return;

      // ヒットテストを実行
      const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
      
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        
        if (pose) {
          // レティクル（照準マーカー）の位置を更新
          const position = new THREE.Vector3(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          );
          
          const rotation = new THREE.Quaternion(
            pose.transform.orientation.x,
            pose.transform.orientation.y,
            pose.transform.orientation.z,
            pose.transform.orientation.w
          );

          reticleRef.current.position.copy(position);
          reticleRef.current.quaternion.copy(rotation);
          reticleRef.current.visible = true;

          // ヒットテストイベントを発火
          if (onHitTest) {
            onHitTest(position, rotation);
          }
        }
      } else {
        // ヒットしない場合はレティクルを非表示
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
      }
    } catch (error) {
      console.error('Hit test error:', error);
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={reticleRef} visible={false}>
      {/* レティクル（照準マーカー）のジオメトリ */}
      <ringGeometry args={[0.1, 0.12, 32]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default ARHitTest;