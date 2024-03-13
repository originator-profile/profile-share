-- これらの法人に関する情報は © 2024 国税庁法人番号公表サイト (国税庁) クリエイティブ・コモンズ・ライセンス 表示 4.0 国際 (CC BY 4.0 リーガル・コード) https://creativecommons.org/licenses/by/4.0/legalcode.ja のもとに利用を許諾されています。
INSERT INTO "accounts"
  ("roleValue", "domainName"                    , "corporateNumber" , "name"                                  , "postalCode"  , "addressCountry", "addressRegion" , "addressLocality" , "streetAddress")
VALUES
  ('certifier', 'oprexpt.originator-profile.org', '8010005035933'   , 'Originator Profile 技術研究組合'       , '100-8055'    , 'JP'            , '東京都'        , '千代田区'        , '大手町1-7-1'),
  ('certifier', 'jicdaq.or.jp'                  , '2010005033018'   , '一般社団法人デジタル広告品質認証機構'  , '104-0061'    , 'JP'            , '東京都'        , '中央区'          , '銀座3-10-7'),
  ('certifier', 'pressnet.or.jp'                , '6010005018535'   , '一般社団法人日本新聞協会 '             , '100-0011'    , 'JP'            , '東京都'        , '千代田区'        , '内幸町2-2-1')
ON CONFLICT DO NOTHING;

-- 「JICDAQ」は、一般社団法人デジタル広告品質認証機構の登録商標です。 https://www.j-platpat.inpit.go.jp/c1801/TR/JP-2021-097662/40/ja
-- 「日本新聞協会」は、一般社団法人日本新聞協会の登録商標です。 https://www.j-platpat.inpit.go.jp/c1801/TR/JP-1980-057333/40/ja
INSERT INTO "certificationSystems"
  ("id"                                   , "certifierUuid"                       , "verifierUuid"                        , "name"                            , "url"                                             , "urlTitle"                                                        , "image")
VALUES
  ('73a17adf-6625-479e-bf01-178937fe22e6' , '39ad8549-13e6-51f3-b47d-4098fd51e07f', '39ad8549-13e6-51f3-b47d-4098fd51e07f', 'JICDAQ 登録アドバタイザー'       , 'https://www.jicdaq.or.jp/certification_system/'  , 'JICDAQ認証制度について | 一般社団法人 デジタル広告品質認証機構'  , 'https://op-logos.demosites.pages.dev/placeholder-120x80.png'),
  ('a5873ff3-1971-4dd7-a2b7-5e72f773e7b0' , '39ad8549-13e6-51f3-b47d-4098fd51e07f', '39ad8549-13e6-51f3-b47d-4098fd51e07f', 'JICDAQ ブランドセーフティ認証'   , 'https://www.jicdaq.or.jp/certification_system/'  , 'JICDAQ認証制度について | 一般社団法人 デジタル広告品質認証機構'  , 'https://op-logos.demosites.pages.dev/placeholder-120x80.png'),
  ('111fb8d0-e1ce-42d4-955c-1c65c3a54e60' , '39ad8549-13e6-51f3-b47d-4098fd51e07f', '39ad8549-13e6-51f3-b47d-4098fd51e07f', 'JICDAQ 無効トラフィック対策認証' , 'https://www.jicdaq.or.jp/certification_system/'  , 'JICDAQ認証制度について | 一般社団法人 デジタル広告品質認証機構'  , 'https://op-logos.demosites.pages.dev/placeholder-120x80.png'),
  ('772c0a05-62d4-4f5e-8095-42ec4e954e4e' , '3fdf2745-fc47-54e3-b322-758777b6bafc', '3fdf2745-fc47-54e3-b322-758777b6bafc', '日本新聞協会 加盟社'             , 'https://www.pressnet.or.jp/outline/'             , '倫理綱領｜日本新聞協会'                                          , 'https://op-logos.demosites.pages.dev/placeholder-120x80.png')
ON CONFLICT DO NOTHING;
