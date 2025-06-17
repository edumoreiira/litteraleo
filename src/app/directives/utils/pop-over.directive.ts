import { CdkOverlayOrigin, ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, HostListener, inject, input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

const OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 5
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 5
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -5
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -5
  }
]

@Directive({
  selector: '[popOver]',
  providers: [CdkOverlayOrigin, Overlay],
})
export class PopOverDirective implements OnDestroy { 
  private origin = inject(CdkOverlayOrigin);
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  // inputs
  readonly overlayTemplate = input.required<TemplateRef<any>>();
  readonly updatePositionAfter = input<number>();

  private overlayRef?: OverlayRef;



  private open(): void {
    const positionStrategy = this.overlay.position()
    .flexibleConnectedTo(this.origin.elementRef)
    .withPositions(OVERLAY_POSITIONS);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const portal = new TemplatePortal(this.overlayTemplate(), this.vcr)
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => this.close());

    if (this.updatePositionAfter()) this.forceUpdateOverlayPosition();
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }


  private forceUpdateOverlayPosition() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, this.updatePositionAfter() || 300);
  }

  @HostListener('click')
  onClick() {
    if (this.overlayRef?.hasAttached()) {
      this.close();
    } else {
      this.open();
    }
  }

}