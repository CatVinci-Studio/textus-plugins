# 이미지를 문서 곁에

Typora와 VS Code처럼, 각 문서의 이미지를 문서 옆의 같은 이름 폴더에 둡니다. `Note.md`의 이미지는 `Note.assets/`에 들어갑니다.

켜거나 설정할 것이 없습니다. 설치하면 알아서 작동합니다.

- 저장된 문서에 이미지를 붙여넣거나 끌어다 놓습니다. Textus가 먼저 이미지를 저장하고, 이 플러그인이 그것을 문서의 이미지 폴더로 옮긴 뒤 링크를 `Note.assets/이미지.png`로 바꿉니다. 이미 있는 이름에는 번호를 붙이고, 아무것도 덮어쓰지 않습니다. 링크를 바꿀 수 없으면 이미지를 원래 자리로 되돌립니다.
- 같은 폴더 안에서 문서 이름을 바꾸면 이미지 폴더도 링크와 함께 이름이 바뀝니다. 다만 다른 문서도 그 폴더에 링크하고 있으면 둘 다 그대로 둡니다.
- 문서에 이미 있는 이미지는 그 자리에 둡니다.
- 첨부 파일 폴더를 설정한 Obsidian 보관함과 Logseq 그래프에서는 이미지가 그 앱이 두는 자리에 남습니다.

PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO, HEIC, TIFF 이미지를 다룹니다. 데스크톱에서 쓸 수 있고 Textus 1.3.0 이상이 필요합니다. 이미지를 옮기고 폴더 이름을 바꾸려고 파일 읽기와 쓰기를, 옮긴 이미지의 링크를 고치려고 앞에 있는 문서의 읽기와 편집을 요청합니다.

## 변경 내역

- **0.1.7** - The store description now opens with what the plugin does.
- **0.1.6** - Adding many pictures at once (a sync, a folder copied in) no longer reads the open document over and over.
- **0.1.5** - In an Obsidian vault, pictures stay where the vault's attachment setting puts them again: the setting is read through Textus.
- **0.1.4** - Leaves pictures where a document's Typora image folder setting puts them, and no longer moves a folder while some links to it may still be unchecked.
- **0.1.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.2** - Leaves pictures where an Obsidian vault's attachment folder setting or a Logseq graph puts them.
- **0.1.1** - A shorter name: Images Follow Document.
- **0.1.0** - First version: pasted and dropped pictures move into `Note.assets/`, and the folder follows a renamed document.
