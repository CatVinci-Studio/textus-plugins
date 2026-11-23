# 클라우드 동기화

내 S3 호환 저장소, WebDAV 또는 Nutstore를 거쳐 여러 컴퓨터의 폴더를 똑같이 유지합니다. 이전 버전은 클라우드에 보관되고, 원하면 각 기기를 떠나기 전에 암호화합니다.

종단 간 암호화를 켜면 저장소 서비스는 파일 내용도, 파일 이름도 볼 수 없습니다.
클라우드 동기화에는 Textus 1.4.1 이상이 필요합니다.

## 시작하기

1. 동기화할 폴더를 Textus에서 연 뒤 **플러그인 › 클라우드 동기화**를 고릅니다
   (또는 사이드바 탭의 **연결 설정…**).
2. 저장소 서비스를 고르고 서버 주소와 로그인 정보를 입력합니다. Nutstore는
   이메일과 계정 › 보안에서 만든 앱 비밀번호만 있으면 됩니다.
3. 암호화하려면 **종단 간 암호화**를 켜고 12자 이상의 **동기화 비밀번호**를
   정합니다. 비밀번호는 재설정할 수 없으니 비밀번호 관리자에 보관하세요.
   이 선택은 원격 폴더마다 한 번만 합니다. 나중에 바꾸려면 새 빈 폴더가
   필요합니다.
4. **연결 저장**을 누른 뒤 **지금 동기화**를 누릅니다.

다른 기기에서는 같은 폴더를 열고 같은 서비스와 같은 원격 폴더를 입력합니다
(암호화한 폴더라면 같은 동기화 비밀번호도). **자동 동기화**를 켜면
(Textus가 열려 있는 동안) 파일을 저장하거나 이름을 바꾸고 몇 초 뒤에 동기화하고,
아무 일이 없어도 5분마다 한 번씩 동기화합니다(**동기화 간격**: 5분에서
60분). 삭제한 파일은 다음 동기화 때 반영됩니다. **플러그인 › 지금
동기화**로 언제든 동기화할 수 있습니다.

연결을 저장하면 상태 표시줄에 동기화 상태가 나옵니다: **동기화됨 ·
2분 전**, **동기화 중…**, **동기화 충돌**, **동기화 오류**. 누르면
패널이 열립니다.

두 기기가 같은 파일을 바꾸었다면 두 버전을 모두 남깁니다. 내 버전은
제자리에, 다른 기기의 버전은 `Sync conflicts/`에 있습니다.

## 클라우드 기록

동기화로 파일이 바뀌거나 삭제될 때마다 이전 내용이 원격 폴더에 남습니다.
파일을 오른쪽 클릭하고 **클라우드 기록…**을 고르면 버전 목록(언제, 어느 기기에서,
얼마나 큰지)을 보고, 하나를 읽고 **이 버전 복원**을 누를 수 있습니다. 복원한
버전이 지금 파일이 되어 동기화되고, 대신한 버전은 기록에 남습니다. 그 파일에
아직 동기화하지 않은 편집이 있거나 파일이 열려 있으면, 버전을 그 옆에
따로 씁니다(`Note (3f2a9c1b).md`). **플러그인 › 클라우드 기록…**은 폴더에서
삭제한 파일을 보여 줍니다. 하나를 열면 되살릴 수 있습니다.

**클라우드 기록 보관**은 버전이 대체된 때부터 얼마나 보관할지 정합니다:
30일, 90일(기본값), 365일 또는 계속. 이 설정은 폴더 하나에 하나이며, 어느 기기에서든
마지막으로 동기화된 값이 적용되고 다른 기기에도 그 값이 보입니다.
첫날에는 한 시간에 한 버전, 그 뒤로는 하루에 한 버전을 보관하며, 파일당 최대
200개입니다. 기록이 8 MB를 넘으면 가장 오래된 버전부터 지웁니다.
무언가 바뀐 동기화 때마다, 그렇지 않으면 하루에 한 번, 기한이 지난 버전을
정리하고 그 버전만 쓰던 블록을 지웁니다. 0.5 이전에 쓰던 공간(예전 스냅샷)은
되찾지 않습니다. 모든 기기를 0.5로 업데이트하세요. 0.4 기기에서 바꾼 내용은
다음 0.5 동기화 때에야 기록에 들어가고, 그 기기가 삭제한 파일도 그때까지
목록에 나오지 않습니다.

**권한:** 열린 폴더의 읽기와 쓰기(폴더를 살펴보고 내려받은 내용을 적용하기 위해),
모든 웹사이트 접근(입력한 HTTPS 서버에만 씀). 사용 통계 수집, 분석, 원격 코드,
자동 업데이트는 없습니다.

## 자세히

S3는 **추가 옵션**에서 사용자 지정 서버 주소(비워 두면 AWS), 리전, 버킷, 경로 형식
또는 가상 호스트 주소, 선택 사항인 세션 토큰을 받습니다.
원격 폴더에는 파일을 그대로 복사한 것이 아니라 플러그인의 저장 형식으로 담깁니다.
작업 공간마다 다른 원격 폴더를 쓰세요.

자격 증명은 동기화 상태와 따로 `ctx.secrets`를 통해 저장됩니다.
설정 페이지로 다시 보내지거나 원격 매니페스트에 복사되는 일은 없습니다.
자격 증명 칸을 비워 두면 기존 연결의 자격 증명을 그대로 씁니다.
서버 주소, 원격 폴더, 계정을 바꾸려면 맞는 자격 증명이 필요합니다.
동기화 비밀번호도 자동 동기화를 위해 `ctx.secrets`를 통해 이 기기에 저장되며,
설정 페이지로 돌려주거나 저장소 서비스로 보내지 않습니다. 비밀번호 칸을 비워 두면
그대로 유지됩니다. 여기에 다른 비밀번호를 입력해도 기존 저장소가 다시
암호화되지는 않습니다. 그 원격 폴더를 처음 만들 때 쓴 비밀번호와 같아야 합니다.

## 동기화하는 항목

- 저장된 `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt`, `.csv` 문서와
  Obsidian의 베이스(`.base`), 캔버스(`.canvas`).
- 이미지, PDF, Office/OpenDocument 파일, 오디오, 동영상. 정확한 허용 목록은
  플러그인 저장소의 `development/cloud-sync/src/config.ts`에 있습니다.
- Textus 프로젝트 데이터: `.textus/agent.md`, `style.md`, `style.previous.md`,
  그리고 `.textus/library/`, `memory/`, `skills/` 아래의 Markdown.

전역 설정, 채팅 기록, 초안, 저장하지 않은 편집, 자격 증명, 다른 플러그인의
데이터, 그 밖의 점(.)으로 시작하는 파일, 빌드·의존성 폴더는 제외합니다.
열린 작업 공간 안의 파일에만 접근합니다. 폴더 밖에 있는 링크된 첨부 파일을
포함해 작업 공간 밖의 파일은 업로드하지 않습니다.

설정에서 더 뺄 수 있습니다. 한 줄에 규칙 하나씩, `.gitignore`와 같은 방식으로
씁니다(`drafts/`, `*.pdf`, `!keep.pdf`). 스위치를 켜면 폴더의 `.gitignore`도
따릅니다. 제외한 파일은 모든 기기에서 그대로 둡니다. 업로드, 다운로드, 삭제를
하지 않습니다. 다른 스위치는 Obsidian의 공유 설정(`.obsidian/app.json`, `appearance.json`,
`hotkeys.json`, `bookmarks.json`, `graph.json`, `core-plugins.json`,
`types.json`)도 함께 동기화합니다. `workspace.json`처럼 기기마다 다른 파일은
기기에 남습니다.

지금의 한도는 파일당 128 MiB, 살펴보는 파일·폴더 20,000개, 폴더 깊이 48단계,
매니페스트 8 MiB입니다. 빈 폴더는 동기화하지 않습니다.
지원하는 플랫폼에서 안전하지 않은 경로나, 대소문자 또는 Unicode 정규화만 다른
경로가 있으면 몰래 이름을 바꾸지 않고 동기화를 멈춥니다.

## 변경과 충돌

SHA-256 해시와 마지막으로 성공한 동기화를 보고 어느 쪽이 바뀌었는지 판단합니다.
바뀐 내용만 전송합니다. 파일은 2 MiB 블록으로 저장되고 같은 블록은 다시
씁니다. ETag는 내용 해시로 취급하지 않습니다.

- 한쪽에서만 한 편집은 다른 기기로 복사됩니다.
- 양쪽에서 동시에 편집하면 로컬 파일을 남기고 원격 버전을
  `Sync conflicts/`에 저장합니다. 두 버전 모두 다른 기기에도 게시됩니다.
- 열려 있는 대상 파일은 미뤄 둡니다. 저장하고 닫은 뒤 다시 동기화하세요.
- 기존 텍스트 파일은 Textus의 버전 확인 `files.process` API로 업데이트합니다.
  기존 바이너리 파일은 절대 덮어쓰지 않습니다. 첨부 파일이 서로 다르면 한쪽만
  바뀌었더라도 두 버전을 모두 남깁니다. 지금의 플러그인 API에는 조건부로
  바이너리를 바꾸는 기능이 없습니다.
- 한 기기에서 삭제한 파일은 다른 기기에서도 다음 동기화 때 삭제되며, 다른
  기기는 그 파일을 시스템 휴지통으로 옮기므로 거기서 되살릴 수 있습니다.
  삭제한 파일은 버전을 보관하는 동안 클라우드 기록에 남습니다.
  이름 변경은 다른 기기에도 이름 변경으로 반영됩니다.
- 내용은 기록이 놓아줄 때에만 서버에서 사라집니다. 그때까지는 원격 폴더를
  읽을 수 있는 사람이라면(암호화한 경우 동기화 비밀번호도 알고 있다면) 삭제한
  파일을 읽을 수 있습니다. 내용을 완전히 지우려면 정리한 작업 공간에 새
  원격 폴더를 쓰세요.
- 편집이 삭제보다 우선합니다. 마지막 동기화 뒤 한 기기가 삭제한 파일을 다른
  기기가 편집했다면, 편집한 파일이 모든 곳에 되돌아옵니다.
- 폴더를 처음 동기화하는 기기는 아무것도 삭제하지 않습니다. 한쪽에만 있는
  파일은 다른 쪽으로 복사됩니다.
- 클라우드에서 많은 파일(10개 초과이면서 동기화한 파일의 30% 초과)을 삭제하게
  될 동기화는 삭제하기 전에 멈추고 묻습니다. 자동으로 시작된 동기화는 한 번만
  묻고, **지금 동기화**를 누르면 다시 묻습니다. 이름을 바꾸거나 옮긴 파일은 세지
  않습니다. 전에 많은 파일을 동기화했던 폴더에서 아무 파일도 찾지 못하면
  읽을 수 없는 상태(접근 권한을 잃었거나 파일이 다운로드되지 않음)로 보고,
  아무것도 삭제하지 않고 동기화를 멈춥니다.
- 다른 곳에서 삭제된 파일을 시스템 휴지통이 받아 주지 않으면 그 파일은
  제자리에 남아 패널에 표시되고, 다음 동기화 때 다시 시도합니다.
  나머지 동기화는 계속 진행됩니다.
- 탭에 열린 파일은 지우거나 이름을 바꾸지 않습니다. 닫은 뒤 다시 동기화하세요.
- 삭제에 기대기 전에 모든 기기를 0.4로 업데이트하세요. 이전 버전 기기는
  다른 곳에서 삭제된 파일을 다시 올려 놓습니다.

**종단 간 암호화**를 켜면 내용과 파일 이름을 업로드하기 전에 암호화합니다.
어느 쪽이든 모든 데이터는 HTTPS로 전송됩니다.
비공개 S3 버킷이나 WebDAV 폴더를 쓰세요. 서비스 계정에는
동기화 전용 원격 폴더의 읽기, 쓰기, 삭제 권한이 필요합니다
(삭제 권한은 임시 객체와 잠금에 필요합니다).

## 동기화당 요청 수

작은 문서 하나를 HTTP로 동기화할 때 테스트에서 잰 값이며, 세션의 첫 동기화는
뺐습니다(첫 동기화는 서버의 독점 쓰기도 확인하므로 S3에서 요청이 4개
더 듭니다):

| 동기화                              | S3  | WebDAV / Nutstore |
| ----------------------------------- | --- | ----------------- |
| 바뀐 것 없음                        | 3   | 3                 |
| 편집한 문서 하나(2 MiB 블록 하나)   | 18  | 20                |
| 삭제한 파일 하나                    | 20  | 22                |

양쪽 모두 바뀐 것이 없으면 동기화는 폴더의 현재 리비전만 읽고 잠금을 걸지
않습니다. 바뀐 블록이 하나 늘 때마다 요청이 1개 늘어납니다. 블록은 있는지
먼저 묻거나 다시 읽어 보지 않고 한 번만 보냅니다(블록 이름은 내용으로 정해지고,
다운로드할 때마다 블록을 하나하나 확인합니다). WebDAV에서 아직 없는 폴더에
블록을 넣으면 거절된 업로드와 폴더 만들기로 2개가 더 들고, 잠금을 거는 데는
업로드 하나와 `MOVE` 하나가 듭니다. 저장 뒤의 동기화는 저장이 끝나기를(5초)
기다린 다음 **동기화 지연**(없음에서 10분)만큼 더 기다립니다. Nutstore는 계정당
요청 수를 제한하므로 새 Nutstore 연결은 3분, S3와 WebDAV는 0입니다. 서버가
바쁘다고 답하면(429, 503) 모든 요청을 잠시 멈춥니다. 서버가 기다리라고 하면 상태에
"서버를 기다리는 중"과 초가 최대 60초까지 표시됩니다. 그보다 오래 기다리라고 하면
그 동기화는 멈추고 나중에 다시 시도하라고 알립니다. 이미 보낸 내용은 다음
동기화에 쓰입니다.

## 종단 간 암호화

**종단 간 암호화**를 켜면 파일 내용, 경로, 내용 해시, 스냅샷을 Web Crypto의
AES-256-GCM으로 인증하고 암호화합니다. 암호화할 때마다 새 96비트 nonce와
128비트 태그를 씁니다. 인증은 저장소의 암호화 헤더와 논리 객체 키에 묶여 있어
블록, 매니페스트, 스냅샷끼리 바꿔치기할 수 없습니다.

256비트 루트 키는 PBKDF2-HMAC-SHA-256, 600,000회 반복, 무작위 256비트 저장소
솔트로 기기에서 만듭니다. HKDF-SHA-256으로 AES용 키와 HMAC-SHA-256 객체 이름용
키를 따로 만듭니다. 내용 블록의 이름은 공개된 평문 해시가 아니라 키를 쓴 HMAC입니다.
같은 블록은 한 저장소 안에서 다시 쓰고, 서로 관계없는 저장소는 다른 솔트와 키를
씁니다. 복호화할 때는 파일을 적용하기 전에 바이트를 인증합니다.

암호화 설명 정보에는 공개 KDF 매개변수, 저장소 ID, 암호화한 고정 확인 메시지만
저장됩니다. 기기는 처음 잠금 해제에 성공한 뒤 설명 정보의 지문을 고정하고,
그것이 바뀌거나 사라지면 멈춥니다.
비밀번호가 틀리거나, 설명 정보가 잘못되었거나, 암호문이 변조되면 동기화를 멈춥니다.

저장소 서비스는 여전히 고른 원격 경로 앞부분, 객체의 크기와 개수, 한 저장소 안의
블록 재사용, 요청 시각, 익명 잠금의 소유자와 시각은 볼 수 있습니다.
이 프로토콜은 악의적인 서버가 예전의 유효한 암호화 상태를 다시 내놓는 것을 반드시
알아챈다고 보장하지 않습니다. 원격 암호문으로 오프라인 비밀번호 추측이 가능하므로
강한 비밀번호가 중요합니다. KDF는 추측 비용을 높이지만 약한 비밀번호를 강하게
만들 수는 없습니다. 이 구현에는 자동화된 호환성 테스트와 변조 테스트가 있지만,
독립적인 보안 감사는 받지 않았습니다.

로컬 파일은 그대로 읽을 수 있습니다. 비밀번호는 원격 저장소가 아니라 Textus의
사용자별 로컬 비밀 저장소에 있습니다. 이것으로 침해되었거나 잠금이 풀린 기기를
보호할 수는 없습니다. 비밀번호나 원래의 암호화 설명 정보를 잃으면 원격 데이터를
복구할 수 없습니다. 전체 백업에는 설명 정보와 암호화된 객체가 모두 들어 있어야 합니다.

### 원격 형식

- `v1/head.json`: 공개 암호화 설명 정보(`textus-cloud-sync-e2ee/1`).
  예전 경로를 일부러 씁니다. v0.1 클라이언트는 파일을 업로드하기 전에 이 형식을 거부합니다.
- `v1/lock.json`: 이전·새 클라이언트가 함께 쓰는 배타 잠금. 문서 데이터는 없습니다.
- `v2/head.bin`: 암호화된 현재 매니페스트.
- `v2/history.bin`: 암호화된 기록(각 파일의 이전 버전과 출처).
- `v2/blocks/<prefix>/<HMAC>`: 암호화된 내용 블록.
- `v2/snapshots/<revision>.bin`: 현재 리비전과 이전 리비전의 암호화된
  매니페스트.

암호화하지 않으면 같은 객체를 JSON과 원본 블록으로 저장합니다:
`v1/head.json`, `v1/history.json`, `v1/blocks/<prefix>/<SHA-256>`,
`v1/snapshots/<revision>.json`. 원격 폴더 하나는 암호화하거나 하지 않거나 둘 중
하나이며, 플러그인은 둘을 섞지 않습니다.

암호화된 객체는 `TCS2`, 12바이트 nonce, 암호문과 16바이트 GCM 태그로
이루어집니다. AAD는 정규 JSON 헤더(`format`, `repositoryId`, `kdf`,
`iterations`, `salt` 순서)의 UTF-8, 줄바꿈, 논리 v1 객체 키입니다. 비밀번호는
정규화 없이 UTF-8로 씁니다. HKDF는 UTF-8 저장소 ID를 솔트로,
`textus-cloud-sync-e2ee/1/content` 또는 `/names`를 info로 씁니다. 블록 HMAC 입력은
UTF-8 논리 키 `v1/blocks/<hash-prefix>/<SHA-256>`입니다. 확인용 평문은
`Textus encrypted workspace key check`이고 논리 키는 `key-check`이며, 그 봉투는
`verifier`에 16진수로 저장됩니다. 이 선택들은 테스트에서 Node의 독립된
PBKDF2, HKDF, HMAC, AES-GCM API와 대조해 확인합니다.

### 폴더를 암호화로 옮기기

원격 폴더는 그 자리에서 변환되지 않습니다. 먼저 로컬 작업 공간 하나에 필요한
파일과 충돌 사본이 모두 있는지 확인한 뒤, **새 빈 원격 폴더**를 고르고 암호화를
켜고 동기화 비밀번호를 정합니다. 그 완전한 작업 공간을 먼저 동기화하면, 다른
기기는 같은 비밀번호와 원격 폴더로 참여할 수 있습니다.

서비스 자체의 버전 기록과 백업을 포함해 예전 원격 데이터는 암호화되지 않은 채
남습니다. 암호화된 작업 공간을 확인한 뒤 예전 사본은 서비스에서 정리하세요.
비밀번호를 그 자리에서 바꾸는 기능은 없습니다. 비밀번호를 바꾸려면 또 다른 새
원격 폴더를 쓰세요.

## 중단된 동기화

원격 잠금으로 기기들이 차례로 동기화합니다. S3는 `If-None-Match: *`를 쓰고,
WebDAV는 임시 업로드 뒤 `Overwrite: F`로 `MOVE`를 씁니다. 대상이 이미 있을 때
Nutstore가 돌려주는 409 응답도 처리합니다. 연결 테스트는 동기화가 작업 공간
데이터를 건드리기 전에 배타 잠금이 되는지 확인합니다. 목록 API나 끝없는 폴더
목록 읽기는 필요하지 않습니다.

암호화된 블록과 바뀌지 않는 스냅샷을 먼저 쓴 다음 `v2/head.bin`을 게시합니다.
로컬 기준점은 게시에 성공한 뒤에만 앞으로 나아갑니다.
다시 시도할 때는 이미 끝낸 블록을 다시 씁니다. 다시 시작한 뒤에도 마찬가지로,
멈춘 동기화가 저장한 블록은 기기에 기억되어 다시 확인하지 않습니다. 단, 그 사이
다른 기기가 게시하지 않았을 때만입니다. 취소하면 현재 네트워크 요청이 끝난 뒤
멈추고, 가능하면 잠금을 풉니다. Textus의 네트워크 API는 요청 하나를 60초로
제한하며, 요청 단위 취소는 지원하지 않습니다.

새 바이너리를 다운로드할 때는 로컬 플러그인 저장소에 기록한 고유 표시로 경로를
잡아 둡니다. 쓰기가 중단되면 다음 동기화는 그 표시를 파일 내용으로 업로드하지
않고 정확히 그 표시부터 이어 갑니다. 다른 앱이 파일을 바꾸면 그 내용은
보존됩니다. 다시 시도할 때는 플러그인의 로컬 데이터를 지우지 마세요.

이 기기가 Textus를 닫거나 동기화 도중 멈추면서 남긴 잠금은 다음 동기화가 묻지
않고 되찾습니다. 실행 중인 동기화는 10초마다 잠금 기록을 새로 고칩니다. 다음
동기화는 그 기록이 30초 지나면 잠금을 되찾고, 그보다 일찍 시작하면 남은 시간을
기다리며, 그 사이 기록이 새로 고쳐지면(다른 창에서 동기화가 아직 실행 중이면)
건드리지 않습니다. 다른 기기의 잠금은 절대 가져오지 않습니다. 그 기기가 비정상
종료했다면 **복구 › 남은 잠금 해제**가 확인을 받은 뒤에만 잠금을 지웁니다.
먼저 다른 모든 기기가 동기화를 멈췄는지 확인하세요. 잠금은 원격에서 만료되지
않으므로, 느린 기기가 타이머 때문에 쓰기 권한을 잃는 일은 없습니다.

동기화가 각 파일에서 찾은 정보(크기, 시각, 해시)는 실행 사이에도 기기에
남으므로, 다시 시작한 뒤 첫 동기화는 그 사이 바뀐 파일만 다시 읽습니다.
설명 정보나 현재 매니페스트가 실수로 지워지면 전에 참여한 기기는 멈춥니다.
원래 설명 정보가 들어 있는 완전한 원격 백업을 복원하세요. 암호화된 스냅샷은
자기 객체 이름에 묶여 있어 `v2/head.bin` 위에 그대로 복사할 수 없습니다. 스냅샷
하나를 복원하려면 복호화한 뒤 그 논리 키로 다시 암호화해야 합니다. 지금은 스냅샷
하나를 복원하는 화면이 없습니다.
동기화가 실행 중일 때는 원격 파일을 바꾸지 마세요.

## 커뮤니티 플러그인에서 옮기기

공식 플러그인은 `catvinci.cloud-sync`입니다. 예전 커뮤니티 플러그인
`ciao1019.cloud-sync`는 로컬 설정, 비밀 정보, 동기화 상태를 따로 가집니다.
옮기기 전에 예전 플러그인으로 중단된 동기화를 끝내거나 복구한 다음, 자동 동기화를
끄고 플러그인을 비활성화하세요. 작업 공간의 백업을 남겨 두세요.

공식 플러그인을 설치하고 같은 저장소 연결, 정확히 같은 원격 폴더, 같은 동기화
비밀번호를 입력합니다. 암호화된 원격 형식은 그대로이므로, 기존 v0.2/v0.3 원격
데이터를 옮기거나 다시 암호화하지 않고 읽을 수 있습니다. 로컬 자격 증명, 설명 정보
고정, 기준점은 플러그인 ID 사이에 복사되지 않습니다. 첫 실행은 새 기기로서 기존
원격에 참여하며, 파일이 다르면 충돌 사본을 남길 수 있습니다. 같은 작업 공간에서
두 플러그인의 자동 동기화를 함께 켜지 마세요. 암호화하지 않은 v0.1 데이터는 여전히
위의 별도 업그레이드 절차가 필요합니다.

## 개발과 기여

소스, 프로토콜 테스트, 빌드 방법은
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync)에 있습니다.
카탈로그는 `plugins/catvinci.cloud-sync/`의 읽을 수 있는 파일을 컴파일하지 않고
그대로 담습니다. 릴리스는 이 저장소의 공식 플러그인 절차를 따르며,
`catvinci.cloud-sync-v0.3.0` 같은 태그를 씁니다.

처음에는 Ciao1019가 개발했고, 0.3.0의 화면과 설정 개선은 ChengAo Shen이
기여했습니다. MIT 고지는 `LICENSE`와 `THIRD_PARTY_NOTICES.md`에 보존되어 있습니다.
저장 설계는 Petrichor/Sylva의 `apps/api/internal/cloudsync/`를 참고했으며,
Go 소스나 PostgreSQL 백업 형식은 복사하지 않았습니다.

## 변경 내역

- **0.8.1** - A file over 128 MiB no longer stops the whole sync: it stays where it is on every device and is listed under the status. A conflict copy opens from the page with a click. Ready for phones, not offered there yet: a sync when a folder opens and when you come back to Textus, none in the background; settings that survive an iPhone update; a smaller largest file and fewer transfers at once; deleted files kept in "Sync trash/" where there is no system Trash.
- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
