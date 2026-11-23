# 이미지 뷰어

그림과 SVG 파일을 탭에서 열어 확대·축소하고 돌려 보며, SVG의 소스도 볼 수 있습니다.

## 그림 보기

- 사이드바에서 PNG, JPEG, GIF, WebP, AVIF, BMP, ICO, SVG 파일을 열거나 창으로 끌어다 놓습니다. 그림은 자기 탭에서 창에 맞춘 크기로 열립니다.
- 위쪽 막대에 그림의 픽셀 크기와 파일 크기가 나옵니다.
- **−**, **+** 버튼이나 **Ctrl+스크롤**(Mac에서는 **⌘+스크롤**)로 확대·축소합니다. 퍼센트 표시를 누르면 창에 맞추기와 실제 크기 사이를 오갑니다.
- 확대한 상태에서는 그림을 끌어 여기저기 볼 수 있습니다. 두 번 클릭하면 창에 맞추기와, 클릭한 곳을 기준으로 한 실제 크기 사이를 오갑니다.
- **회전** 버튼은 한 번에 90도씩 돌립니다. 보기만 바뀌고 파일은 그대로입니다.
- 키: **+**와 **-**는 확대·축소, **0**은 실제 크기, **F**는 창에 맞추기, **R**은 회전입니다.
- SVG는 **소스**로 코드를 보며 읽거나 복사할 수 있고, **그림**으로 돌아갑니다. SVG는 그림으로 보여 주므로 안의 스크립트는 실행되지 않습니다.
- 파일이 없거나 그림이 아니면 빈 탭 대신 그 사실을 알려 줍니다.

## 권한

어떤 권한도 요청하지 않습니다. 연 파일만 읽습니다.

## 변경 내역

- **0.2.6** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.2.5** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.2.4** - A turned and zoomed picture now scrolls to every edge, and a sideways picture fits the window. Zoom and turn are kept when the panel moves, a fourth turn no longer spins back, and the bar fits a narrow panel.
- **0.2.3** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the picture, not the document behind it. Its bar keeps Textus's one order: what it shows, then find and zoom.
- **0.2.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.2.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.0** - Textus's own buttons and tab bar; labels follow the interface language when it changes
- **0.1.3** - colors from Textus 1.3's themes
- **0.1.2** - the percentage switches between fit and actual size
- **0.1.0-0.1.1** - first versions: zoom, fit, drag, rotate, keys, an SVG's source, and a message for a file that can't be opened
