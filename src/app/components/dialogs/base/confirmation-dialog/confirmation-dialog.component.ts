import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { ButtonComponent } from "app/components/base/Button/button.component";

@Component({
  selector: "app-confirmation-dialog",
  template: `
    <h1 class="font-semibold text-2xl mb-2">{{ title() }}</h1>
    <p class="text-neutral-600">{{ message() }}</p>
    @if(highlightedText()) {
      <p class="mt-2 p-3 bg-muted rounded text-muted-fg text-sm">
        {{ highlightedText() }}
      </p>
    }
    <div class="flex justify-between gap-2 mt-8">
      <button 
      class="px-5"
      app-button 
      variant="outline" 
      (click)="cancel.emit()"
      >{{ cancelText() }}</button>
      <button
      class="px-5"
      app-button
      [class.!bg-destructive]="variant() === 'destructive'"
      [class.!text-destructive-fg]="variant() === 'destructive'"
      (click)="confirm.emit()"
      >{{ confirmText() }}</button>
    </div>
  `,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  highlightedText = input<string>();
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  variant = input<'destructive' | 'info'>('info');
  confirm = output<void>();
  cancel = output<void>();
}