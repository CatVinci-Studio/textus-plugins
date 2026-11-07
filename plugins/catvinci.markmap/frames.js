// A frame out of sight gets no animation frames, and markmap draws and
// fits through them: without this an export of a mind map scrolled away
// waited forever. Each request also runs from a timer if no frame comes.
(function () {
  var frame = window.requestAnimationFrame.bind(window);
  var cancel = window.cancelAnimationFrame.bind(window);
  var timers = new Map();
  window.requestAnimationFrame = function (callback) {
    var done = false;
    var run = function (time) {
      if (done) return;
      done = true;
      timers.delete(id);
      cancel(id);
      callback(time);
    };
    var id = frame(run);
    timers.set(
      id,
      setTimeout(function () {
        run(performance.now());
      }, 50),
    );
    return id;
  };
  window.cancelAnimationFrame = function (id) {
    clearTimeout(timers.get(id));
    timers.delete(id);
    cancel(id);
  };
})();
