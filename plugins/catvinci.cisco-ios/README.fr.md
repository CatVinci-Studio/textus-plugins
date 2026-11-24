# Cisco IOS

Colore les configurations Cisco IOS dans les blocs de code : commandes, interfaces, adresses IP et commentaires !, dans les blocs ```cisco ou ```ios.

## Ce qu'il fait

- Écrivez un bloc de code en `cisco`, `ios` ou `cisco-ios`. Ses commandes (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) sont colorées comme des mots-clés, les noms d'interface (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) comme des types, les adresses IP, masques, préfixes et adresses MAC comme des nombres, les protocoles et ports (`tcp`, `www`) comme des constantes, et les lignes qui commencent par `!` comme des commentaires.
- Les couleurs suivent votre thème, et restent les mêmes en mode source et dans les exports HTML et PDF.
- Rien n'est lu tant qu'un document n'a pas un tel bloc.

## Exemple

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

## Autorisations

Aucune. Il donne seulement à Textus les règles du langage ; il n'exécute aucun code.

## Changements

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
