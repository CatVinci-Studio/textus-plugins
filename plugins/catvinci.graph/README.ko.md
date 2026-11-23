# 그래프 보기

노트와 노트 사이의 링크를 그래프로 그립니다. 폴더 전체도, 지금 연 문서 주변만도 볼 수 있습니다.

- **Ctrl+Alt+G**(Mac에서는 **⌘⌥G**) 또는 **플러그인 › 그래프 보기 열기**로 폴더 전체를 탭에 보여 줍니다. **화면에 맞추기**를 누르면 전체가 한눈에 들어옵니다.
- 사이드바의 **그래프** 탭은 지금 연 문서 주변의 노트를 보여 줍니다. 사이드바 그래프 패널 위쪽의 버튼으로 폴더 전체를 엽니다.
- [[위키 링크]]와 다른 문서로 가는 링크 모두 셉니다. 서로 링크하는 두 노트는 선 하나로 잇습니다. 아직 없는 노트로 가는 [[링크]]도 노트 하나로 나타납니다.
- 노트를 누르면 열립니다. 노트를 끌어 자리를 잡고, 빈 곳을 끌어 이동하고, 스크롤이나 핀치로 확대·축소합니다. 노트에 포인터를 올리면 그 링크가 강조됩니다.터치로는 노트를 한 번 누르면 링크가 강조되고, 한 번 더 누르면 열립니다.
- 그래프는 스스로 맞춰집니다. 확대하면 이름이 보이고, 링크가 적을 때는 화살표로 방향을 보여 주며, 링크가 많은 노트일수록 크게 그립니다. 색 그룹이 없으면 노트마다 폴더의 색을 씁니다.
- 폴더의 문서가 바뀌면 그래프를 다시 그립니다.

## 설정

전체 그래프 위쪽의 슬라이더 버튼으로 설정을 엽니다. 사이드바 그래프에는 설정이 없습니다.

- **필터**: 검색(`path:ideas`, `file:draft`, `tag:#todo`, 앞에 `-`를 붙이면 제외), **태그**로 #태그도 노드로 표시, **존재하는 파일만**으로 아직 없는 노트 숨기기, **고립된 노트**(전체 그래프)로 링크 없는 노트 표시.
- **그룹**: 검색에 걸리는 노트에 색을 입힙니다. **새 그룹**으로 추가하고, **기본값으로 복원**으로 바꾼 것을 되돌립니다.

Obsidian 보관소에서는 Obsidian의 `graph.json`에 저장된 색 그룹도 내 그룹 다음으로 적용됩니다.

## 권한

- 파일과 문서 읽기: 폴더의 노트와 링크, Obsidian의 `graph.json`을 읽기 위해.
- Textus AI 도구: Textus AI가 문서 주변의 노트를 볼 수 있도록.

## 변경 내역

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover. Its page receives Textus's messages by the API's current name.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_neighbours`: 어떤 문서(경로가 없으면 앞에 열린 문서)의 노트 그래프 속 이웃을 돌려줍니다. 방향과 관계없이 몇 링크 안의 노트, 각각 몇 링크 떨어졌는지, 그 사이의 링크입니다. 없는 노트로 가는 [[링크]]는 kind가 missing입니다.
<!-- /ai-tools -->
