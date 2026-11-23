# Pomodoro

A focus timer that floats over the Textus window or the desktop: a span of focus, then a break, with a notification at the end of each.

- **Plugins › Show or Hide the Pomodoro Timer** puts the timer up. Drag it where you like, or out of the window onto the desktop.
- Click the timer, or choose **Plugins › Start or Pause the Timer**, to start or pause it. A ring fills as the time goes, in another color during a break.
- Right-click the timer for **Skip to the Next Span** and **Start Over**.
- When a span ends, the next one starts on its own and a notification says so.
- The timer keeps running across a restart of Textus.

**Settings**: **Focus (minutes)** and **Break (minutes)**, 25 and 5 by default, up to 180.

It needs Textus 1.3.12 or later. It asks for one permission: notifications, for the end of each span.

## Changes

- **0.1.4** - Its page is in every language Textus speaks. It no longer says 25 and 5 minutes: both lengths are yours to set. Its page receives Textus's messages by the API's current name.
- **0.1.3** - Quick clicks no longer lose one; a new focus or break length shows on a timer not yet started; the clock grows and shrinks with the timer.
- **0.1.2** - A click on the timer starts and pauses it again (it did nothing in 0.1.0 and 0.1.1).
- **0.1.1** - Follows every theme and grows with the interface; needs Textus 1.3.12.
- **0.1.0** - First version: a floating focus timer with breaks, notifications, a right-click menu, and its own focus and break lengths.
