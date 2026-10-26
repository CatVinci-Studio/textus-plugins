// ABC notation engraved as SVG by abcjs.
function engrave(el, source, dark) {
  el.replaceChildren();
  ABCJS.renderAbc(el, source, {
    responsive: "resize",
    foregroundColor: dark ? "#e6e6e6" : "#000000",
  });
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    engrave(el, source, dark);
  },
  picture: function (el, source, meta, dark) {
    var box = document.createElement("div");
    box.style.cssText =
      "position:absolute;left:-10000px;width:" + el.clientWidth + "px";
    document.body.append(box);
    engrave(box, source, dark);
    var svg = box.querySelector("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var out = new XMLSerializer().serializeToString(svg);
    box.remove();
    return out;
  },
});
