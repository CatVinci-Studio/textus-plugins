# 뽀모도로

Textus 창이나 바탕화면 위에 떠 있는 집중 타이머입니다. 집중하고 나서 쉬고, 구간이 끝날 때마다 알림을 보냅니다.

- **플러그인 › 뽀모도로 타이머 보이기/숨기기**로 타이머를 띄웁니다. 원하는 곳으로 끌거나, 창 밖 바탕화면으로 끌어낼 수 있습니다.
- 타이머를 누르거나 **플러그인 › 타이머 시작/일시정지**를 고르면 시작하거나 멈춥니다. 시간이 흐르면 고리가 차오르며, 휴식 중에는 다른 색입니다.
- 타이머를 오른쪽 클릭하면 **다음 구간으로**와 **처음부터**가 있습니다.
- 한 구간이 끝나면 다음 구간이 저절로 시작되고 알림으로 알려 줍니다.
- Textus를 다시 시작해도 타이머는 계속 돕니다.

**설정**: **집중(분)**과 **휴식(분)**. 기본은 25와 5이고, 180까지 정할 수 있습니다.

Textus 1.3.12 이상이 필요합니다. 요청하는 권한은 알림 하나로, 구간이 끝날 때 알리기 위해서입니다.

## 변경 내역

- **0.1.4** - Its page is in every language Textus speaks. It no longer says 25 and 5 minutes: both lengths are yours to set. Its page receives Textus's messages by the API's current name.
- **0.1.3** - Quick clicks no longer lose one; a new focus or break length shows on a timer not yet started; the clock grows and shrinks with the timer.
- **0.1.2** - A click on the timer starts and pauses it again (it did nothing in 0.1.0 and 0.1.1).
- **0.1.1** - Follows every theme and grows with the interface; needs Textus 1.3.12.
- **0.1.0** - First version: a floating focus timer with breaks, notifications, a right-click menu, and its own focus and break lengths.
