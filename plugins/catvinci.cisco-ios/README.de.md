# Cisco IOS

Färbt Cisco-IOS-Konfigurationen in Codeblöcken: Befehle, Schnittstellen, IP-Adressen und !-Kommentare, in ```cisco- oder ```ios-Blöcken.

## Was es macht

- Schreiben Sie einen Codeblock in `cisco`, `ios` oder `cisco-ios`. Seine Befehle (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) werden als Schlüsselwörter gefärbt, Schnittstellennamen (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) als Typen, IP-Adressen, Masken, Präfixe und MAC-Adressen als Zahlen, Protokolle und Ports (`tcp`, `www`) als Konstanten, und Zeilen, die mit `!` beginnen, als Kommentare.
- Die Farben folgen Ihrem Theme und sind im Quelltextmodus und in HTML- und PDF-Exporten dieselben.
- Gelesen wird erst, wenn ein Dokument einen solchen Block hat.

## Beispiel

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

## Berechtigungen

Keine. Es gibt Textus nur die Regeln der Sprache und führt keinen Code aus.

## Änderungen

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
