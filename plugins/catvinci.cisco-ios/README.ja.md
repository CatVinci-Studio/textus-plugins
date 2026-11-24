# Cisco IOS

コードブロック内の Cisco IOS の設定を色分けします。コマンド、インターフェイス、IP アドレス、! コメントを、```cisco または ```ios ブロックで。

## できること

- 言語を `cisco`、`ios`、`cisco-ios` にしたコードブロックを書きます。コマンド（`interface`、`ip address`、`router ospf`、`access-list`、`permit`、`deny`、`shutdown`、`hostname`、`vlan`…）はキーワード、インターフェイス名（`GigabitEthernet0/1`、`Gi0/1.10`、`Vlan10`）は型、IP アドレス・マスク・プレフィックス・MAC アドレスは数値、プロトコルとポート（`tcp`、`www`）は定数の色になり、`!` で始まる行はコメントです。
- 色はテーマに従い、ソースモードや HTML・PDF の書き出しでも同じです。
- 文書にそのようなブロックがなければ、何も読み込みません。

## 例

```cisco
hostname R1
!
interface GigabitEthernet0/1
 description Uplink to core
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
router ospf 1
 network 192.168.1.0 0.0.0.255 area 0
!
access-list 101 permit tcp any host 10.0.0.5 eq www
```

## 権限

必要ありません。Textus にこの言語のルールを渡すだけで、コードは実行しません。

## 更新履歴

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
