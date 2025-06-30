import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function CameraController() {
  const { camera } = useThree();

  // シンプルなリセット関数を定義します
  (window as any).resetCamera = () => {
    // カメラを初期位置に移動します
    camera.position.set(0, 7, 17);
    // カメラを原点に向けます
    camera.lookAt(0, 0, 0);
    // カメラの変更を適用します
    camera.updateProjectionMatrix();
  };

  return (
    <OrbitControls
      makeDefault
      rotateSpeed={0.5}
      // 慣性をオフにして、直接的な操作感にします
      enableDamping={false}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
    />
  );
}
