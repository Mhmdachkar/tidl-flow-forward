import gsap from "gsap";
import ScrollTriggerImport from "gsap/ScrollTrigger";
import DraggableImport from "gsap/Draggable";
import InertiaPluginImport from "gsap/InertiaPlugin";

type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type DraggablePlugin = typeof import("gsap/Draggable").Draggable;
type InertiaPluginType = typeof import("gsap/InertiaPlugin").InertiaPlugin;

function isPlugin(value: unknown): boolean {
  // GSAP ships some plugins as classes/functions (ScrollTrigger, Draggable)
  // and others as plain objects (InertiaPlugin). Accept both.
  return typeof value === "function" || (typeof value === "object" && value !== null);
}

function resolvePlugin<T>(mod: unknown, named: string, label: string): T {
  if (typeof mod === "function") {
    return mod as T;
  }

  if (mod && typeof mod === "object") {
    const record = mod as Record<string, unknown>;
    const candidate = record.default ?? record[named];

    if (isPlugin(candidate)) {
      return candidate as T;
    }

    // the module namespace may itself be the plugin object
    return mod as T;
  }

  throw new Error(`Failed to resolve gsap/${label}`);
}

const ScrollTrigger = resolvePlugin<ScrollTriggerPlugin>(
  ScrollTriggerImport,
  "ScrollTrigger",
  "ScrollTrigger",
);
const Draggable = resolvePlugin<DraggablePlugin>(
  DraggableImport,
  "Draggable",
  "Draggable",
);
const InertiaPlugin = resolvePlugin<InertiaPluginType>(
  InertiaPluginImport,
  "InertiaPlugin",
  "InertiaPlugin",
);

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

export { gsap, ScrollTrigger, Draggable, InertiaPlugin };
