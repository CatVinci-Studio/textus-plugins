# Cisco IOS

Colore as configurações do Cisco IOS nos blocos de código: comandos, interfaces, endereços IP e comentários !, em blocos ```cisco ou ```ios.

## O que faz

- Escreva um bloco de código em `cisco`, `ios` ou `cisco-ios`. Os comandos (`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…) são coloridos como palavras-chave, os nomes de interface (`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`) como tipos, endereços IP, máscaras, prefixos e endereços MAC como números, protocolos e portas (`tcp`, `www`) como constantes, e as linhas que começam com `!` como comentários.
- As cores seguem o seu tema e ficam iguais no modo código-fonte e nas exportações em HTML e PDF.
- Nada é lido até um documento ter um bloco assim.

## Exemplo

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

## Permissões

Nenhuma. Só entrega ao Textus as regras da linguagem; não executa código.

## Alterações

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
