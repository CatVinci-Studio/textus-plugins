# Git

Git으로 관리하는 폴더에서:

- 마지막 커밋 이후 바뀐 파일이 사이드바에 표시됩니다: **M** 변경됨, **A** 추가됨, **U** 새 파일이라 아직 Git에 없음, **R** 이름 바뀜, **!** 충돌.
- 바뀐 문서에서는 마지막 커밋에 없던 줄(저장된 내용 기준)이 있는 문단, 제목, 목록마다 오른쪽 여백에 표시가 생깁니다. 누르면 커밋합니다(Textus 1.4.4).
- 상태 표시줄에 브랜치가 보이고, ↑는 푸시할 커밋, ↓는 가져올 커밋입니다. 누르면 커밋합니다.
- **변경 사항 커밋…**(플러그인 메뉴 또는 브랜치)은 바뀐 파일 목록을 보여 주며, 앞에 있는 파일이 골라져 있습니다. 메시지를 쓰면 내 Git이 그 파일만 커밋하고, 훅과 서명도 평소처럼 실행됩니다. 폴더의 첫 커밋은 먼저 묻습니다.
- **푸시**와 **풀**(플러그인 메뉴)은 내 Git과 거기 저장된 인증 정보로 브랜치를 원격 브랜치로 보내고 원격의 커밋을 가져옵니다. 로그인을 요구하면 터미널에서 Git으로 한 번 로그인하세요. 아직 원격 브랜치가 없는 브랜치는 `origin`으로 푸시합니다. 충돌이 날 풀은 되돌려 아무것도 바꾸지 않고 알려 줍니다(Textus 1.4.6).
- 버전 기록 0.4와 함께 쓰면 문서의 커밋이 버전 아래에 나오고, 버전과 같은 방식으로 비교하고 되살릴 수 있습니다.
- Textus AI는 바뀐 내용, 파일의 커밋, 어떤 커밋 시점의 파일을 읽을 수 있습니다. 예를 들어 커밋 메시지 초안을 쓸 때 씁니다.

브랜치를 바꾸는 일은 하지 않습니다. Git이 설치되어 있어야 하고(Mac에서는 Command Line Tools), Textus 1.4.6이 필요합니다.

## 변경 내역

- **0.3.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it. Its description no longer ends in "Desktop.", and its tools for Textus AI are described in every language.
- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `git_changes`: 열린 폴더의 브랜치와 바뀐 파일, 바뀐 각 텍스트 파일이 마지막 커밋 이후 바뀐 줄. 커밋 메시지를 쓰기 전에 읽습니다.
- `git_history`: 파일의 Git 커밋을 최신순으로, 이름 변경도 따라가며: 해시, 날짜, 작성자, 제목.
- `git_file_at`: 어떤 커밋 시점의 파일 내용(해시는 git_history에서).
<!-- /ai-tools -->
