-- これらの法人に関する情報は © 2024 国税庁法人番号公表サイト (国税庁) クリエイティブ・コモンズ・ライセンス 表示 4.0 国際 (CC BY 4.0 リーガル・コード) https://creativecommons.org/licenses/by/4.0/legalcode.ja のもとに利用を許諾されています。
INSERT INTO "accounts"
  ("roleValue", "domainName", "corporateNumber" , "name"                       , "postalCode"  , "addressCountry", "addressRegion" , "addressLocality" , "streetAddress")
VALUES
  ('group'    , 'jabc.or.jp', '2010005016617'   , '一般社団法人 日本ＡＢＣ協会', '100-0012'    , 'JP'            , '東京都'        , '千代田区'        , '日比谷公園1-3 市政会館4階')
ON CONFLICT DO NOTHING;

-- 「JICDAQ」は、一般社団法人デジタル広告品質認証機構の登録商標です。 https://www.j-platpat.inpit.go.jp/c1801/TR/JP-2021-097662/40/ja
UPDATE "certificationSystems"
SET "verifierUuid" = '61bacb00-29c2-5d31-9b83-a3f68c16f8c8'
WHERE "id" = '2a12a385-fd1c-48e6-acd8-176c0c5e95ea'; -- JICDAQ ブランドセーフティ認証 第三者検証

UPDATE "certificationSystems"
SET "verifierUuid" = '61bacb00-29c2-5d31-9b83-a3f68c16f8c8'
WHERE "id" = 'c3e819b7-b7b9-434b-b250-94eea2f430c8'; -- JICDAQ 無効トラフィック対策認証 第三者検証
