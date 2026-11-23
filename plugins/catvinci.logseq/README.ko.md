# Logseq 폴더

Logseq 그래프를 Logseq가 쓰는 방식대로 엽니다. 페이지 이름 링크, assets의 그림, 저널 폴더와 날짜 형식.

## 하는 일

- 연 폴더나 그 위의 폴더가 파일로 보관된 Logseq 그래프이면(`logseq/config.edn`이 있으면), Textus는 링크를 페이지 이름(`[[Page]]`)으로 쓰고, 링크로 만든 페이지를 `pages/`(또는 지정한 `:pages-directory`)에 두며, 일간 노트는 저널을 `journals/`에 `:journal/file-name-format`에 맞는 이름으로 둡니다.
- Logseq의 그림 폴더 `assets/`는 구석의 카드에서 한 번 제안합니다. 받아들이면 폴더의 `.textus/settings.json`에 저장되고, 지금 설정을 유지하면 다시 묻지 않습니다.
- 이 플러그인이 없어도 그래프 안의 위키 링크는 그래프 폴더를 기준으로 찾습니다.

## 권한

**열린 폴더의 파일 읽기**만 요청합니다. Textus가 `logseq/config.edn`을 넘겨주면 플러그인은 그 파일의 뜻을 알려 줄 뿐입니다. 아무것도 바꾸지 않습니다.

## 변경 내역

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.6 itself, not a test version of it.
- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
