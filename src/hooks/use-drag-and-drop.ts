import { useEffect, useState } from "react";
import { createStore } from "zustand";

type Store = {
  dragged: Map<string, string | null>;
  zoneOver: Map<string, string | null>;
  onDragStart(type: string, draggedId: string): void;
  onDragEnd(type: string, draggedId: string): void;
  onZoneOver(type: string, zoneId: string): void;
  onZoneLeave(type: string, zoneId: string): void;
  isDragged(type: string, draggedId: string): boolean;
  isZoneOver(type: string, zoneId: string): boolean;
  getDragged(type: string): string | null;
  reset(): void;
};

const controller = createStore<Store>((set, get) => ({
  dragged: new Map(),
  zoneOver: new Map(),
  onDragStart(type, draggedId) {
    const { dragged } = get();
    dragged.set(type, draggedId);
    set({
      dragged,
    });
  },
  onDragEnd(type) {
    const { dragged } = get();
    dragged.set(type, null);
    set({
      dragged,
    });
  },
  onZoneOver(type, zoneId) {
    const { zoneOver } = get();
    zoneOver.set(type, zoneId);
    set({
      zoneOver,
    });
  },
  onZoneLeave(type) {
    const { zoneOver } = get();
    zoneOver.set(type, null);
    set({
      zoneOver,
    });
  },
  isDragged(type, draggedId) {
    const { dragged } = get();
    return dragged.get(type) === draggedId;
  },
  isZoneOver(type, zoneId) {
    const { zoneOver, dragged } = get();
    return zoneOver.get(type) === zoneId && dragged.get(type) !== zoneId;
  },
  getDragged(type) {
    const { dragged } = get();
    return dragged.get(type) ?? null;
  },
  reset() {
    const { dragged, zoneOver } = get();
    dragged.clear();
    zoneOver.clear();
    set({
      zoneOver,
      dragged,
    });
  },
}));

type Props = {
  parentId: string;
  type: string;
  onMoved(draggedId: string, targetId: string): void;
};

const state = controller.getState();

export const useDragAndDrop = (props: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    return controller.subscribe((values) => {
      setIsDragging(values.isDragged(props.type, props.parentId));
      setIsDraggedOver(values.isZoneOver(props.type, props.parentId));
    });
  }, []);

  return {
    draggable: true,
    isDragging,
    isDraggedOver,
    onDragStart(e: React.DragEvent, childId?: string) {
      e.dataTransfer.setData("text/plain", childId ?? props.parentId);
      state.onDragStart(props.type, childId ?? props.parentId);
    },
    onDragEnd() {
      state.onDragEnd(props.type, props.parentId);
    },
    onDragOver(e: React.DragEvent) {
      e.preventDefault();
      if (state.zoneOver.has(props.parentId)) return;
      state.onZoneOver(props.type, props.parentId);
    },
    onDragLeave() {
      state.onZoneLeave(props.type, props.parentId);
    },
    onDrop(e: React.DragEvent) {
      e.preventDefault();
      const draggedId = state.getDragged(props.type);
      if (draggedId && draggedId !== props.parentId) {
        props.onMoved(draggedId, props.parentId);
        state.reset();
      }
    },
  };
};
