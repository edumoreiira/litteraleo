import { ComponentRef, InputSignal } from "@angular/core";
import { Observable } from "rxjs";

// get o “U” se S for InputSignal<U>, senão fica S
type UnwrapSignal<S> = S extends InputSignal<infer U> ? U : S;

// para cada propriedade de T, pegamos UnwrapSignal<T[P]>
type ComponentInputValues<T> = {
  [P in keyof T]?: UnwrapSignal<T[P]>;
};

export type ModalSizeUnit = `${number}${'px' | 'em' | 'rem'}`;


export interface ModalRef<T> {
    componentRef: ComponentRef<T>;
    close: () => void;
    afterClosed$: Observable<any>
}

export interface ModalConfig<T = unknown> {
    // basically allows inputSignal be passed as it's type
    // ex: public x = input<string>('');
    // can be passed as string instead of InputSignal<string>
    componentInputs?: ComponentInputValues<T>;
    
    role: string,
    minWidth?: ModalSizeUnit,
    ariaLabelledBy?: string,
    ariaDescribedBy?: string,
    ariaLabel?: string
}