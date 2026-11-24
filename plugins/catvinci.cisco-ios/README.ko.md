# Cisco IOS

코드 블록 안의 Cisco IOS 설정에 색을 입힙니다. 명령, 인터페이스, IP 주소와 ! 주석을 ```cisco 또는 ```ios 블록에서.

## 하는 일

- 언어를 `cisco`, `ios`, `cisco-ios`로 한 코드 블록을 씁니다. 명령(`interface`, `ip address`, `router ospf`, `access-list`, `permit`, `deny`, `shutdown`, `hostname`, `vlan`…)은 키워드로, 인터페이스 이름(`GigabitEthernet0/1`, `Gi0/1.10`, `Vlan10`)은 타입으로, IP 주소·마스크·프리픽스·MAC 주소는 숫자로, 프로토콜과 포트(`tcp`, `www`)는 상수로 색이 입혀지고, `!`로 시작하는 줄은 주석입니다.
- 색은 테마를 따르며, 소스 모드와 HTML, PDF 내보내기에서도 같습니다.
- 문서에 그런 블록이 없으면 아무것도 읽지 않습니다.

## 예시

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

## 권한

필요 없습니다. Textus에 이 언어의 규칙을 줄 뿐, 코드를 실행하지 않습니다.

## 변경 내역

- **0.1.0** - First version: Cisco IOS configurations coloured in code blocks. Needs Textus 1.4.7.
