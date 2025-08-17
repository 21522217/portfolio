import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFullpageScroll]',
})
export class FullpageScrollDirective implements AfterViewInit, OnDestroy {
  @Input() sectionsSelector = '.page-section';
  @Input() animationMs = 700;
  @Input() wheelThrottleMs = 800;

  private container!: HTMLElement;
  private sections: HTMLElement[] = [];
  private currentIndex = 0;
  private isAnimating = false;
  private isBrowser = false;
  private win: (Window & typeof globalThis) | null = null;

  private wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    if (this.isAnimating) return;
    const delta = e.deltaY;

    this.syncCurrentIndex();

    if (delta > 0) {
      this.scrollToIndex(
        Math.min(this.currentIndex + 1, this.sections.length - 1)
      );
    } else if (delta < 0) {
      this.scrollToIndex(Math.max(this.currentIndex - 1, 0));
    }
  };

  private keyHandler = (e: KeyboardEvent) => {
    if (this.isAnimating) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      this.syncCurrentIndex();
      this.scrollToIndex(
        Math.min(this.currentIndex + 1, this.sections.length - 1)
      );
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      this.syncCurrentIndex();
      this.scrollToIndex(Math.max(this.currentIndex - 1, 0));
    }
  };

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngAfterViewInit(): void {
    // Chỉ chạy phần DOM khi ở client
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    this.win = this.doc.defaultView; // an toàn hơn so với dùng window trực tiếp
    this.container = this.el.nativeElement;

    this.sections = Array.from(
      this.container.querySelectorAll<HTMLElement>(this.sectionsSelector)
    );

    this.container.style.overflowY = 'auto';
    this.container.style.scrollBehavior = 'smooth';

    this.zone.runOutsideAngular(() => {
      // Cần passive: false để preventDefault() có hiệu lực với wheel
      this.container.addEventListener('wheel', this.wheelHandler, {
        passive: false,
      });

      // Lắng nghe global keydown qua window an toàn
      this.win?.addEventListener('keydown', this.keyHandler, {
        passive: false,
      });
    });

    setTimeout(() => this.syncCurrentIndex(), 0);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.container?.removeEventListener('wheel', this.wheelHandler as any);
    this.win?.removeEventListener('keydown', this.keyHandler as any);
  }

  private syncCurrentIndex() {
    if (!this.isBrowser) return;

    const top = this.container.scrollTop;
    let closest = 0;
    let minDist = Number.POSITIVE_INFINITY;

    this.sections.forEach((sec, idx) => {
      const dist = Math.abs(sec.offsetTop - top);
      if (dist < minDist) {
        minDist = dist;
        closest = idx;
      }
    });

    this.currentIndex = closest;
  }

  private scrollToIndex(index: number) {
    if (index === this.currentIndex) return;

    this.isAnimating = true;
    this.currentIndex = index;

    const target = this.sections[index];

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      this.isAnimating = false;

      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, this.wheelThrottleMs);
  }
}
