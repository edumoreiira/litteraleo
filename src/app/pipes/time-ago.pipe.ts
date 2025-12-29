import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // set locale to 'pt-br' for portuguese formatting
    const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

    if (seconds < 60) {
      return rtf.format(-seconds, 'second');
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return rtf.format(-minutes, 'minute');
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return rtf.format(-hours, 'hour');
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return rtf.format(-days, 'day');
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return rtf.format(-weeks, 'week');
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return rtf.format(-months, 'month');
    }

    const years = Math.floor(days / 365);
    return rtf.format(-years, 'year');
  }
}