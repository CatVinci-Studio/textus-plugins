// Excalidraw for the catvinci.excalidraw plugin's page, bundled into
// vendor/excalidraw.js as globalThis.ExcalidrawKit: the editor, React to
// mount it, its stylesheet as text (put in by the page, kept out of the
// window's interface scaling) and what saving a scene needs.
import React from "react";
import { createRoot } from "react-dom/client";
import {
  Excalidraw,
  getSceneVersion,
  restoreElements,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import css from "@excalidraw/excalidraw/index.css";

globalThis.ExcalidrawKit = {
  React,
  createRoot,
  Excalidraw,
  getSceneVersion,
  restoreElements,
  serializeAsJSON,
  css,
};
