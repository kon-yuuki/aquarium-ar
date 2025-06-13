import React from 'react';
import { AquariumObject } from '../../../types/aquarium';
import { sampleObjects } from '../../../data/sampleObjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadedModel {
  id: string;
  name: string;
  file: File;
}

interface ObjectListProps {
  onSelectObject?: (object: AquariumObject) => void;
  uploadedModels?: UploadedModel[];
}

export default function ObjectList({ onSelectObject,uploadedModels = [] }: ObjectListProps) {
  const handleObjectClick = (object: AquariumObject) => {
    onSelectObject?.(object);
  };

  const handleUploadedModelClick = (model: UploadedModel) => {
    // AquariumObject形式に変換して渡す
    onSelectObject?.({
      id: model.id,
      name: model.name,
      type: 'model', // 新しいタイプ 'model' を使用
      thumbnailUrl: '/images/thumbnails/model-placeholder.jpg' // 仮のサムネイル
    });
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>アイテム一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sampleObjects.map(object => (
            <div
              key={object.id}
              onClick={() => handleObjectClick(object)}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-3"
            >
              <img
                src={object.thumbnailUrl}
                alt={object.name}
                className="w-16 h-16 object-cover rounded"
              />
              <span>{object.name}</span>
            </div>
          ))}

          {/* アップロードされたモデル */}
          {uploadedModels.length > 0 && (
            <>
              <div className="border-t my-2 pt-2">
                <p className="text-sm font-medium mb-2">アップロードしたモデル</p>
              </div>
              {uploadedModels.map(model => (
                <div
                  key={model.id}
                  onClick={() => handleUploadedModelClick(model)}
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-3"
                >
                  {/* 仮のサムネイル画像 */}
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    3D
                  </div>
                  <span>{model.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
