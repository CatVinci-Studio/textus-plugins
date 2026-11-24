# 작업 보드

일을 보드 위의 목록과 카드로 정리합니다. 보드는 평범한 Markdown 파일로 저장됩니다.

- **플러그인 › 새 작업 보드…**에서 이름을 넣으면 열린 폴더에 _이름_.md를 만듭니다. front matter에 `kanban-plugin: board`가 들어가고, 할 일·진행 중·완료 세 목록이 준비됩니다. 같은 이름의 보드가 이미 있으면 그 보드를 엽니다.
- front matter에 `kanban-plugin`이 있는 .md 파일은 모두 보드로 열립니다. Obsidian의 Kanban 플러그인도 이렇게 보드를 저장하므로 서로의 보드를 열 수 있습니다. 예전에 _이름_.kanban.md로 만든 보드도 그대로 열립니다.
- 목록은 파일 속 제목이고 카드는 그 아래의 할 일이라서, 어디서 열어도 읽을 수 있습니다.

## 보드에서 할 수 있는 일

- 목록 아래의 **카드 추가**로 카드를 넣습니다. 카드 글을 누르면 고칠 수 있고, 체크 상자로 완료 표시를 합니다. 카드의 ⋯ 버튼(또는 오른쪽 클릭)으로 다른 목록으로 옮기거나 삭제하고, 삭제 뒤 알림의 실행 취소로 되돌립니다.
- **목록 추가**로 새 목록을 만들고 바로 이름을 씁니다. 목록 제목을 누르면 이름을 바꿀 수 있고, 빈 목록은 ⋯ 메뉴에서 삭제할 수 있습니다.
- 휴대폰에서는 목록 하나가 화면을 채우고, 밀어서 다음 목록으로 넘어갑니다.
- 카드는 목록 안에서나 다른 목록으로 끌어 옮기고, 목록은 머리 부분을 끌어 순서를 바꿉니다. 끄는 동안 다른 카드와 목록이 자리를 비켜 줍니다.터치 화면에서는 카드를 잠시 누르고 있다가 끕니다. 휴대폰에서 화면 가장자리로 가져가면 보드가 다음 목록으로 넘어갑니다. 누른 채 움직이지 않고 떼면 카드의 메뉴가 열립니다.
- 카드에 [[링크]]를 쓰면 눌러서 그 노트를 엽니다.
- **Markdown으로 편집**은 파일을 텍스트로 엽니다. 거기서든 다른 곳에서든 바꾼 내용이 보드에 바로 반영됩니다.
- Obsidian의 Kanban이 목록 말고 파일에 적어 두는 내용(설정, 완료 목록 표시 등)은 그대로 둡니다.

```markdown
---
kanban-plugin: board
---

## 할 일

- [ ] 개요 쓰기

## 완료

- [x] 제목 정하기
```

## 권한

- 파일 읽기와 쓰기: 보드를 열고 저장하기 위해.
- Textus AI 도구: Textus AI가 보드를 찾아 읽고, 카드를 추가하고 옮길 수 있도록.

## 변경 내역

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_boards`: 열린 폴더에 있는 칸반 보드(kanban-plugin .md 파일)를 각 보드의 목록과 목록마다의 카드 수와 함께 나열합니다.
- `read_board`: 칸반 보드를 읽습니다. 목록을 순서대로, 각 카드의 내용과 완료 여부와 함께 돌려줍니다. 일반 문서에 쓴 할 일은 list_tasks입니다.
- `add_card`: 칸반 보드의 목록 끝에 카드를 추가합니다. 보드(kanban-plugin .md) 전용입니다. 문서의 할 일은 add_task입니다.
- `move_card`: 칸반 보드의 카드를 다른 목록으로, 또는 같은 목록의 다른 위치로 옮깁니다.
<!-- /ai-tools -->
