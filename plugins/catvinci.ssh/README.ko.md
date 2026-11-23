# SSH 폴더

내 ssh로 서버의 폴더를 열어 이 컴퓨터의 폴더처럼 씁니다. 문서는 탭에, 파일은 사이드바에 보입니다.

## 하는 일

- **플러그인 › 원격 폴더 열기…**는 `~/.ssh/config`에 있는 서버를 보여 주고(또는 `me@server`처럼 직접 입력한 서버를 받고), 이어서 열 폴더를 고르게 합니다. 서버의 홈 폴더에서 시작합니다.
- 폴더가 사이드바에 열립니다. 문서 열기, 저장, 이름 바꾸기, 옮기기, 검색은 다른 폴더와 똑같고, 새 문서나 폴더는 서버에 만들어집니다.
- 연결은 내 `ssh`가 내 설정, 키, 에이전트, known hosts로 맺습니다. 요청하는 것은 파일 전송(SFTP)뿐이며, 셸이나 명령은 쓰지 않습니다.
- 연결이 끊기면 다음에 파일을 읽거나 저장할 때 다시 연결합니다.

## 제한

- 키나 에이전트로만 로그인합니다. 비밀번호를 묻는 서버는 거부되니, 먼저 키를 추가하세요.
- ssh가 아직 모르는 서버는 거부되며, 대신 받아들여 주지 않습니다. 터미널에서 `ssh`로 한 번 접속해 그 키를 받아들이세요.
- 서버의 문서에는 아직 그림을 붙여 넣을 수 없고, 지운 파일은 되찾을 수 없습니다. 서버에는 휴지통이 없습니다.

## 권한

**ssh**를 요청합니다. 플러그인이 서버에 연결하기 전에 Textus가 서버마다 한 번씩 묻습니다.

## 변경 내역

- **0.1.2** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.": the store shows that.
- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
