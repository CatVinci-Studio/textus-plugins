# Cisco IOS

为代码块中的 Cisco IOS 配置着色：命令、接口、IP 地址和 ! 注释，写在 ```cisco 或 ```ios 代码块里。

## 它做什么

- 写一个语言为 `cisco`、`ios` 或 `cisco-ios` 的代码块。其中的命令（`interface`、`ip address`、`router ospf`、`access-list`、`permit`、`deny`、`shutdown`、`hostname`、`vlan`…）按关键字着色，接口名（`GigabitEthernet0/1`、`Gi0/1.10`、`Vlan10`）按类型着色，IP 地址、掩码、前缀和 MAC 地址按数字着色，协议和端口（`tcp`、`www`）按常量着色，以 `!` 开头的行是注释。
- 颜色跟随主题，在源代码模式和 HTML、PDF 导出中也一样。
- 文档里没有这种代码块时，什么都不读取。

## 示例

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

## 权限

无。它只把这门语言的规则交给 Textus，不运行任何代码。

## 更新

- **0.1.0** - 第一版：为代码块中的 Cisco IOS 配置着色。需要 Textus 1.4.7。
