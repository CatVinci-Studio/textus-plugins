# Cisco IOS

Colorea las configuraciones de Cisco IOS en los bloques de código: comandos, interfaces, direcciones IP y comentarios !, en bloques ```cisco o ```ios.

## Qué hace

- Escribe un bloque de código en `cisco`, `ios` o `cisco-ios`. Sus comandos (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) se colorean como palabras clave, los nombres de interfaz (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) como tipos, las direcciones IP, máscaras, prefijos y direcciones MAC como números, los protocolos y puertos (`tcp`, `www`) como constantes, y las líneas que empiezan por `!` como comentarios.
- Los colores siguen tu tema y se ven igual en el modo código fuente y al exportar a HTML y PDF.
- No se lee nada hasta que un documento tiene un bloque así.

## Ejemplo

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

## Permisos

Ninguno. Solo da a Textus las reglas del lenguaje; no ejecuta código.

## Cambios

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
