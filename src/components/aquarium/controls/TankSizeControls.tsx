import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TankSize {
  width: number;
  height: number;
  depth: number;
}

interface TankControlsProps {
  size: TankSize;
  onChange: (newSize: TankSize) => void;
}

// 一般的な水槽サイズの制限
const TANK_LIMITS = {
  width: { min: 20, max: 90, step: 1 },
  height: { min: 20, max: 90, step: 1 },
  depth: { min: 20, max: 90, step: 1 },
};

export default function TankSizeControls({ size, onChange }: TankControlsProps) {
  // 各スライダーの変更ハンドラ - 値の制限も追加
  const handleSizeChange = (dimension: keyof TankSize) => (values: number[]) => {
    const newValue = values[0];
    const limits = TANK_LIMITS[dimension];

    // 値が制限内であることを確認
    if (newValue >= limits.min && newValue <= limits.max) {
      onChange({ ...size, [dimension]: newValue });
    }
  };

  // 寸法のラベルをより分かりやすく表示する関数
  const formatDimensionLabel = (value: number, unit: string = 'cm') => {
    return `${value.toFixed(0)}${unit}`;
  };

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">水槽サイズ設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 幅の調整 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">幅</Label>
            <span className="text-sm text-muted-foreground">
              {formatDimensionLabel(size.width)}
            </span>
          </div>
          <Slider
            defaultValue={[size.width]}
            min={TANK_LIMITS.width.min}
            max={TANK_LIMITS.width.max}
            step={TANK_LIMITS.width.step}
            onValueChange={handleSizeChange('width')}
          />
        </div>

        {/* 高さの調整 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">高さ</Label>
            <span className="text-sm text-muted-foreground">
              {formatDimensionLabel(size.height)}
            </span>
          </div>
          <Slider
            defaultValue={[size.height]}
            min={TANK_LIMITS.height.min}
            max={TANK_LIMITS.height.max}
            step={TANK_LIMITS.height.step}
            onValueChange={handleSizeChange('height')}
          />
        </div>

        {/* 奥行きの調整 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">奥行き</Label>
            <span className="text-sm text-muted-foreground">
              {formatDimensionLabel(size.depth)}
            </span>
          </div>
          <Slider
            defaultValue={[size.depth]}
            min={TANK_LIMITS.depth.min}
            max={TANK_LIMITS.depth.max}
            step={TANK_LIMITS.depth.step}
            onValueChange={handleSizeChange('depth')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
