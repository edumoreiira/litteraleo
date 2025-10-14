import { Pipe, PipeTransform } from '@angular/core';
import { sanitizeHtmlRegex } from 'app/utils/sanitize-html';

@Pipe({
  name: 'stripHtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return sanitizeHtmlRegex(value);
  }
}
