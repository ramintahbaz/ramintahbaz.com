'use client';

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export const CRAFT_MASONRY_GUTTER_PX = 12;

export function craftMasonryColumnWidthCss(
  columnCount: number,
  gutterPx: number = CRAFT_MASONRY_GUTTER_PX
): string {
  if (columnCount <= 1) return '100%';
  return `calc((100% - ${gutterPx * (columnCount - 1)}px) / ${columnCount})`;
}

type MasonryApi = {
  destroy: () => void;
  reloadItems: () => void;
  layout: () => void;
};

type CraftMetafizzyMasonryProps = {
  children: ReactNode;
  columnCount: number;
  /** Include filter + slot signature so hidden cards / reordering trigger a fresh layout. */
  layoutKey: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Measured bin-packing (Metafizzy Masonry) — avoids CSS multicol “holes” when card heights vary.
 * Masonry is loaded only in the browser (dynamic import) because the package touches `window` at load time.
 */
export function CraftMetafizzyMasonry({
  children,
  columnCount,
  layoutKey,
  className,
  style,
}: CraftMetafizzyMasonryProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const colWidth = craftMasonryColumnWidthCss(columnCount, CRAFT_MASONRY_GUTTER_PX);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let disposed = false;
    const instanceRef: { current: MasonryApi | null } = { current: null };
    const timeoutIds: number[] = [];
    const videoCleanups: Array<() => void> = [];
    const imgCleanups: Array<() => void> = [];
    let ro: ResizeObserver | null = null;

    const scheduleLayout = () => {
      requestAnimationFrame(() => {
        const m = instanceRef.current;
        if (!m || disposed) return;
        m.reloadItems();
        m.layout();
      });
    };

    const armObservers = () => {
      if (disposed) return;
      ro = new ResizeObserver(scheduleLayout);
      ro.observe(el);

      scheduleLayout();
      timeoutIds.push(window.setTimeout(scheduleLayout, 120));
      timeoutIds.push(window.setTimeout(scheduleLayout, 400));

      const onMedia = () => scheduleLayout();

      el.querySelectorAll('video').forEach((v) => {
        v.addEventListener('loadeddata', onMedia);
        v.addEventListener('loadedmetadata', onMedia);
        videoCleanups.push(() => {
          v.removeEventListener('loadeddata', onMedia);
          v.removeEventListener('loadedmetadata', onMedia);
        });
      });

      el.querySelectorAll('img').forEach((img) => {
        img.addEventListener('load', onMedia);
        if (img.complete) onMedia();
        imgCleanups.push(() => img.removeEventListener('load', onMedia));
      });

      requestAnimationFrame(scheduleLayout);
    };

    void (async () => {
      const { default: MasonryCtor } = await import('masonry-layout');
      if (disposed || rootRef.current !== el) return;

      const instance = new MasonryCtor(el, {
        itemSelector: '.craft-masonry-item',
        columnWidth: '.craft-masonry-sizer',
        gutter: CRAFT_MASONRY_GUTTER_PX,
        percentPosition: true,
        horizontalOrder: true,
        transitionDuration: '0s',
        resize: true,
        initLayout: true,
      }) as MasonryApi;

      if (disposed) {
        instance.destroy();
        return;
      }

      instanceRef.current = instance;
      armObservers();
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      timeoutIds.forEach((id) => window.clearTimeout(id));
      videoCleanups.forEach((c) => c());
      imgCleanups.forEach((c) => c());
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [layoutKey, columnCount]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      <div
        className="craft-masonry-sizer"
        aria-hidden
        style={{
          width: colWidth,
          height: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      />
      {children}
    </div>
  );
}
