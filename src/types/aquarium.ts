// アクアリウムで使用できるオブジェクトの種類を定義します
export type AquariumObjectType = 'plant' | 'stone' | 'wood' | 'model';

// アクアリウムオブジェクトの基本情報を定義します
export interface AquariumObject {
  id: string; // オブジェクトを識別するための一意のID
  name: string; // オブジェクトの表示名（例：「アヌビアス・ナナ」）
  type: AquariumObjectType; // オブジェクトの種類（水草、石、流木）
  thumbnailUrl: string; // サムネイル画像のパス
}
