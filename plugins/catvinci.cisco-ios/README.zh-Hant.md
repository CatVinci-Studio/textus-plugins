# Cisco IOS

為程式碼區塊中的 Cisco IOS 設定上色：指令、介面、IP 位址和 ! 註解，寫在 ```cisco 或 ```ios 區塊裡。

## 它做什麼

- 寫一個語言為 `cisco`、`ios` 或 `cisco-ios` 的程式碼區塊。其中的指令（`interface`、`ip address`、`router ospf`、`access-list`、`permit`、`deny`、`shutdown`、`hostname`、`vlan`…）以關鍵字上色，介面名稱（`GigabitEthernet0/1`、`Gi0/1.10`、`Vlan10`）以型別上色，IP 位址、遮罩、前綴和 MAC 位址以數字上色，協定和連接埠（`tcp`、`www`）以常數上色，以 `!` 開頭的行是註解。
- 顏色跟著佈景主題，在原始碼模式和 HTML、PDF 匯出中也一樣。
- 文件裡沒有這種區塊時，什麼都不讀取。

## 範例

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

## 權限

無。它只把這個語言的規則交給 Textus，不執行任何程式碼。

## 更新

- **0.1.0** - 第一版：為程式碼區塊中的 Cisco IOS 設定上色。需要 Textus 1.4.7。
