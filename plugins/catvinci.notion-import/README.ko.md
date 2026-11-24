# Notion 가져오기

Notion 내보내기를 열린 폴더 안의 일반 Markdown 파일로 바꿉니다. Obsidian에서도 읽을 수 있습니다.

페이지와 하위 페이지, 그림과 첨부 파일, 그 사이의 링크, 그리고 Obsidian의 Bases 형식으로 바꾼 데이터베이스까지 모두 가져옵니다.

1. Notion에서 **Settings › Export all workspace content**를 고르고, **Markdown & CSV**와 하위 페이지 포함을 선택합니다. 받은 .zip(또는 압축을 푼 폴더)을 Textus에서 연 폴더에 넣습니다.
2. **플러그인 › Notion에서 가져오기…**를 고르고(또는 사이드바에서 .zip을 오른쪽 클릭) 내보내기를 고릅니다. 큰 내보내기가 zip 하나 안에 Part-1.zip, Part-2.zip…으로 나뉘어 있으면 하나로 엽니다. 256MB가 넘는 .zip은 한 번에 읽기에 너무 큽니다. 열린 폴더에 압축을 풀고 그 폴더를 고르세요.
3. 가져온 내용을 넣을 폴더 이름을 정합니다(다른 이름을 입력하지 않으면 **Notion**). 이미 있는 것은 바꾸지 않습니다. 진행 막대에서 취소할 수 있고, 그때까지 쓴 내용은 남습니다. 끝나면 보고서 페이지가 열리고, **위키**가 설치되어 있으면 사이드바에 가져온 내용이 페이지 트리로 나옵니다.

## 무엇이 되는지

- **페이지**: 하위 페이지가 있는 페이지(하위 페이지가 있는 데이터베이스 행도)는 페이지를 안에 담은 폴더 `Plans/Plans.md`가 되고, 하위 페이지는 그 옆에 놓입니다. 하위 페이지가 없는 페이지는 파일 `Plans.md`가 됩니다. 이름에서 Notion의 id는 빠집니다. 데이터베이스 행의 페이지는 Notion이 파일 이름에서 잘라 낸 제목 전체를 씁니다.
- **데이터베이스**: 데이터베이스마다 `base` 블록이 든 페이지가 있는 폴더가 되며, 보기는 클릭 한 번으로 바꿀 수 있습니다. 상태가 있으면 보드, 표, 날짜가 있으면 캘린더. 각 행은 그 폴더의 노트가 되고, 속성은 front matter에 들어갑니다. 날짜는 2026-01-04처럼, 체크박스, 숫자, 목록, 관계는 링크로. 다른 페이지가 데이터베이스를 보여 주던 곳에서는 거기서도 보여 주며, 내보내기에 적힌 순서로 정렬합니다. Notion의 빈 "Untitled" 행과 페이지는 빼 둡니다.
- **그림과 첨부 파일**은 그것을 보여 주는 페이지 옆의 `assets` 폴더에 들어갑니다. 붙여 넣은 그림은 페이지 이름을 따릅니다.
- **링크**는 페이지 사이, 그림, 첨부 파일로 가는 것 모두 새 이름을 따릅니다. 내보내지 않은 페이지로 가는 링크는 보고서에 적힙니다.
- **페이지 사이의 링크**: 처음에 묻습니다. Notion이 내보내는 방식이자 어떤 앱에서도 열리는 표준 링크 `[Page](Page.md)`(추천), 또는 Obsidian 방식의 `[[위키 링크]]`. 가져온 폴더는 이 선택을 기억하므로, 나중에 그 안에서 만든 페이지도 같은 방식으로 링크합니다.
- **콜아웃**은 이모지를 그대로 둔 채 알림 블록(`> [!NOTE]`)이 됩니다. 토글은 `<details>`로 남습니다.

**페이지 아이콘**: Notion의 Markdown 내보내기에는 빠져 있습니다. 같은 페이지를 HTML로도 내보내 두고 가져오기가 물을 때 고르면, 페이지의 이모지 아이콘도 가져옵니다.

**가져오지 않는 것**: Notion 내보내기에는 표지, 댓글, 저장된 보기의 필터가 없어 가져오지 않습니다. 보기의 정렬은 가져옵니다. 수식과 롤업 속성은 그때의 값을 유지하고, 사람과 날짜 멘션은 일반 텍스트가 됩니다.

## 보고서

보고서는 가져온 것의 수를 세고, 찾지 못한 링크, 읽거나 쓰지 못한 파일, 바꾼 블록을 나열하며, 나머지를 도와줄 플러그인을 추천합니다. 페이지 트리와 데이터베이스를 위한 위키가 먼저이고, 그다음 양방향 링크, 빠른 미리보기, 할 일, 링크 카드, PDF 뷰어, 템플릿을 가져온 내용에 필요할 때만 추천합니다. **플러그인 › Notion 가져오기 후 추천 플러그인…**에서 하나를 설치할 수 있습니다. Textus가 먼저 묻고, 저절로 설치되는 것은 없습니다.

## 권한

모든 작업은 기기 안에서 이루어집니다. 플러그인은 열린 폴더의 파일만 읽고 쓰며, 네트워크는 쓰지 않습니다. Textus 1.3.10 이상이 필요합니다.

## 변경 내역

- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.
