/*
 * DragDropManager: a lightweight TypeScript framework for drag-and-drop
 * with easy change detection and persistence callbacks.
 */

type ElementId = string | number;

interface ChangeEvent<T> {
  /** The id of the dragged item */
  itemId: ElementId;
  /** The id of the source container */
  fromContainerId: ElementId;
  /** The id of the target container */
  toContainerId: ElementId;
  /** New index within target container */
  newIndex: number;
  /** Old index within source container */
  oldIndex: number;
  /** Optionally, user-defined payload */
  payload?: T;
}

interface StyleCallbacks {
  onDragStart?: (el: HTMLElement) => void;
  onDrag?: (el: HTMLElement, event: DragEvent) => void;
  onDragOver?: (zone: HTMLElement, event: DragEvent) => void;
  onDragEnd?: (el: HTMLElement, event: DragEvent) => void;
  onDrop?: (el: HTMLElement, targetZone: HTMLElement, event: DragEvent) => void;
}

interface DragDropOptions<T> {
  onDrag(event: DragEvent, dragItem: HTMLElement): unknown;
  /** CSS selector for draggable items */
  draggableSelector: string;
  /** CSS selector for drop zones/containers */
  dropzoneSelector: string;
  /** Function to extract unique id from item element */
  getItemId: (el: HTMLElement) => ElementId;
  /** Function to extract unique id from container element */
  getContainerId: (el: HTMLElement) => ElementId;
  /** Callback when a drag starts */
  onDragStart?: (event: DragEvent, item: HTMLElement) => void;
  /** Callback when dragging over a drop zone */
  onDragOver?: (event: DragEvent, zone: HTMLElement) => void;
  /** Callback when an item is dropped */
  onDrop?: (event: DragEvent, item: HTMLElement, toZone: HTMLElement) => void;
  /** Callback after change event (for persisting) */
  onChange: (change: ChangeEvent<T>) => void;
  /** Style hooks for customizing class/style */
  styleCallbacks?: StyleCallbacks;
  /** Optional payload map for items */
  getPayload?: (itemId: ElementId) => T;
}

export class DragDropManager<T = unknown> {
  private dragItem: HTMLElement | null = null;
  private sourceContainer: HTMLElement | null = null;
  private oldIndex = -1;

  constructor(private opts: DragDropOptions<T>) {
    this.init();
  }

  private init() {
    const items = document.querySelectorAll<HTMLElement>(
      this.opts.draggableSelector
    );
    items.forEach((item) => this.bindDraggable(item));

    const zones = document.querySelectorAll<HTMLElement>(
      this.opts.dropzoneSelector
    );
    zones.forEach((zone) => this.bindDropzone(zone));
  }

  private bindDraggable(item: HTMLElement) {
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", this.handleDragStart);
    item.addEventListener("dragend", this.handleDragEnd);
  }

  private bindDropzone(zone: HTMLElement) {
    zone.addEventListener("dragover", this.handleDragOver);
    zone.addEventListener("drop", this.handleDrop);
  }

  private handleDragStart = (event: DragEvent) => {
    const el = event.target as HTMLElement;
    this.dragItem = el;
    this.sourceContainer = el.parentElement;
    if (this.sourceContainer) {
      this.oldIndex = Array.from(this.sourceContainer.children).indexOf(el);
    }
    event.dataTransfer?.setData(
      "text/plain",
      this.opts.getItemId(el).toString()
    );
    event.dataTransfer!.effectAllowed = "move";
    this.opts.onDragStart?.(event, el);
    this.opts.styleCallbacks?.onDragStart?.(el);
  };

  private handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    const zone = event.currentTarget as HTMLElement;
    event.dataTransfer!.dropEffect = "move";
    this.opts.onDragOver?.(event, zone);
    this.opts.styleCallbacks?.onDragOver?.(zone, event);
  };

  private handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const zone = event.currentTarget as HTMLElement;
    if (!this.dragItem || !this.sourceContainer) return;

    const id = this.opts.getItemId(this.dragItem);
    const oldContainerId = this.opts.getContainerId(this.sourceContainer);
    const newContainerId = this.opts.getContainerId(zone);

    // Append item to new zone
    zone.appendChild(this.dragItem);
    const newIndex = Array.from(zone.children).indexOf(this.dragItem);

    // Callbacks
    this.opts.onDrop?.(event, this.dragItem, zone);
    this.opts.styleCallbacks?.onDrop?.(this.dragItem, zone, event);

    // Fire change event for persistence
    const change: ChangeEvent<T> = {
      itemId: id,
      fromContainerId: oldContainerId,
      toContainerId: newContainerId,
      oldIndex: this.oldIndex,
      newIndex,
    };
    if (this.opts.getPayload) change.payload = this.opts.getPayload(id);

    this.opts.onChange(change);

    // Reset
    this.dragItem = null;
    this.sourceContainer = null;
    this.oldIndex = -1;
  };

  private handleDragEnd = (event: DragEvent) => {
    if (this.dragItem) {
      this.opts.styleCallbacks?.onDragEnd?.(this.dragItem, event);
      this.opts.onDrag?.(event, this.dragItem);
    }
  };
}
