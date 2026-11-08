// A Pomodoro timer as plain state: a focus span, then a break, round and
// round. No clock of its own - every call is given the time - so the host
// can keep it across a restart and the tests can run it in an instant.
(function (root) {
  "use strict";

  /** A timer stopped at the start of a focus span. */
  function fresh(minutes) {
    return {
      phase: "focus",
      running: false,
      left: minutes.focus * 60000,
      endsAt: null,
      rounds: 0,
    };
  }

  /** What is left of the span at `now`, in ms. */
  function left(state, now) {
    return state.running ? Math.max(0, state.endsAt - now) : state.left;
  }

  /** Started where it stood, or paused there. */
  function toggle(state, now) {
    if (state.running)
      return Object.assign({}, state, {
        running: false,
        left: left(state, now),
        endsAt: null,
      });
    return Object.assign({}, state, {
      running: true,
      endsAt: now + state.left,
    });
  }

  /** The next span, running on: a break after focus, focus after a break. */
  function next(state, now, minutes) {
    var focus = state.phase !== "focus";
    var span = (focus ? minutes.focus : minutes.rest) * 60000;
    return {
      phase: focus ? "focus" : "rest",
      running: state.running,
      left: span,
      endsAt: state.running ? now + span : null,
      rounds: state.rounds + (focus ? 0 : 1),
    };
  }

  /** At `now`: the state, and whether a span just ended (and moved on). */
  function tick(state, now, minutes) {
    if (!state.running || now < state.endsAt)
      return { state: state, ended: null };
    return { state: next(state, state.endsAt, minutes), ended: state.phase };
  }

  /** "mm:ss" for a span of `ms`. */
  function clock(ms) {
    var s = Math.ceil(ms / 1000);
    return (
      String(Math.floor(s / 60)).padStart(2, "0") +
      ":" +
      String(s % 60).padStart(2, "0")
    );
  }

  root.pomodoro = {
    fresh: fresh,
    left: left,
    toggle: toggle,
    next: next,
    tick: tick,
    clock: clock,
  };
})(typeof window !== "undefined" ? window : globalThis);
