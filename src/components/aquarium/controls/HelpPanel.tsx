import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Xアイコンをインポート

interface HelpPanelProps {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <Card className="w-80 max-h-[80vh] overflow-auto">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium">操作ガイド</CardTitle>
          <CardDescription>基本的な操作方法</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1">視点操作</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>ドラッグ: 視点を回転</li>
            <li>スクロール: ズームイン/ズームアウト</li>
            <li>「視点をリセット」ボタン: 初期視点に戻す</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">オブジェクト選択</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>オブジェクトをクリック: 選択/選択解除</li>
            <li>空白部分をクリック: 全ての選択を解除</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">オブジェクト操作</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li><strong>G キー</strong> または 「移動」ボタン: 移動モード</li>
            <li><strong>R キー</strong> または 「回転」ボタン: 回転モード</li>
            <li><strong>S キー</strong> または 「サイズ」ボタン: スケールモード</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">オブジェクトの追加/削除</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>アイテム一覧から選択: 新しいオブジェクトを追加</li>
            <li>オブジェクトを選択して「削除」ボタン: 選択中のオブジェクトを削除</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">水槽設定</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>幅/高さ/奥行きスライダー: 水槽のサイズを変更</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
