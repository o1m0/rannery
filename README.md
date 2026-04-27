# Rannery

> 学びを止めない人たちがAIと一緒に走り続けるための場所

AIが学習プランを自動生成し、進捗に応じてプランを修正してくれる学習管理アプリです。  
Next.js・MongoDB・Gemini APIなどのモダンな技術スタックを学ぶために個人開発しました。

## デモ

🔗 [https://rannery.vercel.app](https://rannery.vercel.app)

## 機能

- 学びたいことを入力するとAIが学習プランを自動生成
- カレンダーUIでプランを視覚的に確認
- タスクの進捗を記録（完了 / 未完了 / 遅れ）
- 遅れが出たときにAIがプランを自動で修正
- メールアドレス・パスワードによるユーザー認証

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | Next.js / TypeScript / Tailwind CSS |
| バックエンド | Next.js API Routes |
| データベース | MongoDB Atlas / Mongoose |
| 認証 | NextAuth.js |
| AI | Google Gemini API |
| デプロイ | Vercel |

## 画面

> スクリーンショットを追加予定

## DBスキーマ

User
└── Plan（1ユーザーが複数のプランを持つ）
└── Task（1プランが複数のタスクを持つ）

**User**
| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | String | 名前 |
| email | String | メールアドレス |
| password | String | ハッシュ化されたパスワード |

**Plan**
| フィールド | 型 | 説明 |
|-----------|-----|------|
| userId | ObjectId | ユーザーの参照 |
| title | String | プランのタイトル |
| goal | String | 目標 |
| status | String | active / completed |

**Task**
| フィールド | 型 | 説明 |
|-----------|-----|------|
| planId | ObjectId | プランの参照 |
| title | String | タスク名 |
| date | Date | 予定日 |
| status | String | pending / completed / delayed |
| order | Number | 順番 |

## ローカル起動

```bash
# リポジトリをクローン
git clone https://github.com/o1m0/rannery.git
cd rannery

# パッケージインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.localにMONGODB_URI・NEXTAUTH_SECRET・GEMINI_API_KEYを設定

# 開発サーバー起動
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| MONGODB_URI | MongoDB Atlasの接続文字列 |
| NEXTAUTH_SECRET | NextAuthのシークレットキー |
| NEXTAUTH_URL | アプリのURL |
| GEMINI_API_KEY | Google Gemini APIのキー |