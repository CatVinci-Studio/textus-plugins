# Cisco IOS

Colours Cisco IOS configurations in code blocks: commands, interfaces, IP addresses and ! comments, in ```cisco or ```ios blocks.

## What it does

- Write a code block in `cisco`, `ios` or `cisco-ios`. Its commands (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) are coloured as keywords, interface names (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) as types, IP addresses, masks, prefixes and MAC addresses as numbers, protocols and ports (`tcp`, `www`) as constants, and lines starting with `!` as comments.
- The colours follow your theme, and show the same in source mode and in HTML and PDF exports.
- Nothing is read until a document has such a block.

## Example

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

## Permissions

None. It only gives Textus the language's rules; it runs no code.

## Changes

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
