import { Inject, Pipe, PLATFORM_ID } from "@angular/core";
import DOMPurify from 'dompurify';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { isPlatformBrowser } from "@angular/common";

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe {
    private isBrowser: boolean;

  constructor( private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  transform(value: string): SafeHtml {
    if (!this.isBrowser) {
      return value;
    }
    const cleanedHTML = DOMPurify.sanitize(value, {
        USE_PROFILES: { html: true },
    });
    return this.sanitizer.bypassSecurityTrustHtml(cleanedHTML);
  }
}