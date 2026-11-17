// The graph's forces, one step: notes push each other apart (near ones
// only, by a grid), links pull their ends together, and everything drifts
// to the middle. Returns the cooler alpha.
(function (root) {
  "use strict";

  root.graphForces = function (nodes, edges, alpha, dragging) {
    const cell = 120;
    const grid = new Map();
    for (const n of nodes) {
      const key = Math.floor(n.x / cell) + "," + Math.floor(n.y / cell);
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(n);
    }
    const strength = 900;
    const room = 56;
    for (const n of nodes) {
      const gx = Math.floor(n.x / cell);
      const gy = Math.floor(n.y / cell);
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const bucket = grid.get(gx + dx + "," + (gy + dy));
          if (!bucket) continue;
          for (const m of bucket) {
            if (m === n) continue;
            let x = n.x - m.x;
            let y = n.y - m.y;
            let d2 = x * x + y * y;
            if (d2 < 0.01) {
              x = Math.random() - 0.5;
              y = Math.random() - 0.5;
              d2 = 0.5;
            }
            if (d2 > cell * cell) continue;
            const f = (strength / d2) * alpha;
            n.vx += x * f * 0.01;
            n.vy += y * f * 0.01;
            // No closer than a label's room: the push above fades with
            // distance, and left to it a few notes drew over each other.
            if (d2 < room * room) {
              const d = Math.sqrt(d2);
              const push = ((room - d) / d) * 0.25 * alpha;
              n.vx += x * push;
              n.vy += y * push;
            }
          }
        }
      // A gentle pull to the middle keeps islands in view.
      n.vx -= n.x * 0.002 * alpha;
      n.vy -= n.y * 0.002 * alpha;
    }
    for (const e of edges) {
      const x = e.b.x - e.a.x;
      const y = e.b.y - e.a.y;
      const d = Math.sqrt(x * x + y * y) || 1;
      const f = ((d - 70) / d) * 0.06 * alpha;
      e.a.vx += x * f;
      e.a.vy += y * f;
      e.b.vx -= x * f;
      e.b.vy -= y * f;
    }
    for (const n of nodes) {
      if (n === dragging) continue;
      n.vx *= 0.6;
      n.vy *= 0.6;
      n.x += n.vx;
      n.y += n.vy;
    }
    return alpha * 0.985;
  };
})(window);
