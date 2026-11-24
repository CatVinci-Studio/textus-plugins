# Cisco IOS

Раскрашивает конфигурации Cisco IOS в блоках кода: команды, интерфейсы, IP-адреса и комментарии !, в блоках ```cisco или ```ios.

## Что он делает

- Напишите блок кода на `cisco`, `ios` или `cisco-ios`. Его команды (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) окрашиваются как ключевые слова, имена интерфейсов (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) как типы, IP-адреса, маски, префиксы и MAC-адреса как числа, протоколы и порты (`tcp`, `www`) как константы, а строки, начинающиеся с `!`, как комментарии.
- Цвета следуют теме и выглядят так же в режиме исходного текста и при экспорте в HTML и PDF.
- Пока в документе нет такого блока, ничего не загружается.

## Пример

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

## Разрешения

Не нужны. Он только передаёт Textus правила языка и не запускает никакого кода.

## Изменения

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
