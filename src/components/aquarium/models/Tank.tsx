{/* ThreeElements import removed as it's not used */}

interface TankProps {
  width?: number; // センチメートル単位での幅
  height?: number; // センチメートル単位での高さ
  depth?: number; // センチメートル単位での奥行き
}

// センチメートルからThree.jsユニットへの変換係数
const CM_TO_UNIT = 0.1; // 1cm = 0.1ユニット

export default function Tank({ width = 60, height = 36, depth = 30 }: TankProps) {
  // センチメートルからThree.jsユニットに変換
  const tankWidth = width * CM_TO_UNIT;
  const tankHeight = height * CM_TO_UNIT;
  const tankDepth = depth * CM_TO_UNIT;

  const glassThickness = 0.05;

  // 外寸の計算（ガラスの厚みを加算）
  const outerWidth = tankWidth + glassThickness * 2;
  const outerDepth = tankDepth + glassThickness * 2;

  return (
    <group>
      {/* 底面 - Y=0を基準とする */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[outerWidth, glassThickness, outerDepth]} />
        <meshStandardMaterial color="#89CFF0" transparent opacity={0.6} />
      </mesh>

      {/* 正面 */}
      <mesh position={[0, tankHeight / 2, tankDepth / 2 + glassThickness / 2]}>
        <boxGeometry args={[outerWidth, tankHeight, glassThickness]} />
        <meshStandardMaterial color="#89CFF0" transparent opacity={0.2} />
      </mesh>

      {/* 背面 */}
      <mesh position={[0, tankHeight / 2, -(tankDepth / 2 + glassThickness / 2)]}>
        <boxGeometry args={[outerWidth, tankHeight, glassThickness]} />
        <meshStandardMaterial color="#89CFF0" transparent opacity={0.2} />
      </mesh>

      {/* 左面 */}
      <mesh position={[-(tankWidth / 2 + glassThickness / 2), tankHeight / 2, 0]}>
        <boxGeometry args={[glassThickness, tankHeight, tankDepth]} />
        <meshStandardMaterial color="#89CFF0" transparent opacity={0.2} />
      </mesh>

      {/* 右面 */}
      <mesh position={[tankWidth / 2 + glassThickness / 2, tankHeight / 2, 0]}>
        <boxGeometry args={[glassThickness, tankHeight, tankDepth]} />
        <meshStandardMaterial color="#89CFF0" transparent opacity={0.2} />
      </mesh>

      {/* スケール表示用の補助線（開発時のみ） */}
      <gridHelper args={[100 * CM_TO_UNIT, 10, 'red', 'gray']} position={[0, 0, 0]} />
    </group>
  );
}
