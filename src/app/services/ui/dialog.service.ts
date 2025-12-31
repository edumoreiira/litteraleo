import { inject, Injectable } from "@angular/core";
import { ModalService } from "./modal.service";
import { ConfirmationDialogComponent } from "app/components/dialogs/base/confirmation-dialog/confirmation-dialog.component";

interface ConfirmationDialogData {
  title: string;
  message: string;
  highlightedText?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private modal = inject(ModalService)
  // onConfirm can be updated to use Promises if needed in the future
  openConfirmationDialog(data: ConfirmationDialogData, actions: { onConfirm?: () => void, onCancel?: () => void }) {
    const modalRef =this.modal.open(ConfirmationDialogComponent, { 
      role: 'alertdialog',
      maxWidth: '500px',
      componentInputs: {
        title: data.title,
        message: data.message,
        highlightedText: data.highlightedText ?? '',
        confirmText: data.confirmText ?? 'Confirmar',
        cancelText: data.cancelText ?? 'Cancelar',
        variant: data.variant
      }
    })
    modalRef.componentRef.instance.confirm.subscribe(() => {
      if (actions.onConfirm) actions.onConfirm();
      modalRef.close();
    });
    modalRef.componentRef.instance.cancel.subscribe(() => {
      if (actions.onCancel) actions.onCancel();
      modalRef.close();
    });
  }
}