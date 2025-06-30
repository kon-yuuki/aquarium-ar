import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import ModelPreview from '../models/ModelPreview';

interface ModelUploaderProps {
  onModelUpload?: (file: File) => void;
}

export default function ModelUploader({ onModelUpload }: ModelUploaderProps) {
  // ファイル入力のためのref（参照）を作成
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 選択されたファイルの状態を管理
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ファイル選択ダイアログを開く関数
  const handleOpenFileDialog = () => {
    // refを使って実際のinput要素のクリックをシミュレート
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ファイルが選択されたときの処理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // 最初に選択されたファイルを取得
      const file = files[0];

      // 選択されたファイルを状態に保存
      setSelectedFile(file);

      // 親コンポーネントに選択されたファイルを通知
      if (onModelUpload) {
        onModelUpload(file);
      }
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>3Dモデルのアップロード</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 非表示のファイル入力 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".glb,.gltf,.obj"
        />

        <div className="text-center p-6 border-2 border-dashed rounded-lg">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            GLTF,GLB,OBJファイルを選択
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleOpenFileDialog}
          >
            ファイルを選択
          </Button>
        </div>

        {/* 選択されたファイルの表示とプレビュー */}
        {selectedFile && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-medium">選択されたファイル:</p>
              <p className="text-sm text-gray-500">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">
                サイズ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            {/* 3Dモデルプレビュー */}
            <div>
              <p className="text-sm font-medium mb-2">プレビュー:</p>
              <ModelPreview 
                file={selectedFile}
                width={280}
                height={200}
                className="mx-auto"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
