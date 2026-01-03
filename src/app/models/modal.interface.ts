import { ComponentRef, EventEmitter, InputSignal, OutputEmitterRef } from "@angular/core";
import { Observable } from "rxjs";

// get o “U” se S for InputSignal<U>, senão fica S
type UnwrapSignal<S> = S extends InputSignal<infer U> ? U : S;

// para cada propriedade de T, pegamos UnwrapSignal<T[P]>
type ComponentInputValues<T> = {
  [P in keyof T]?: UnwrapSignal<T[P]>;
};

// helper to extract the event type from EventEmitter or OutputEmitterRef
type UnwrapOutput<O> = O extends EventEmitter<infer U> ? U : (O extends OutputEmitterRef<infer U> ? U : never);

// maps component keys that are outputs to a callback function
type ComponentOutputValues<T> = {
    [K in keyof T as T[K] extends EventEmitter<any> | OutputEmitterRef<any> ? K : never]?: (event: UnwrapOutput<T[K]>) => void;
};

export type ModalSizeUnit = `${number}${'px' | 'em' | 'rem'}`;


export interface ModalRef<T> {
    componentRef: ComponentRef<T>;
    close: () => void;
    afterClosed$: Observable<any>
}

export interface ModalConfig<T extends Object = any> {
    // basically allows inputSignal be passed as it's type
    // ex: public x = input<string>('');
    // can be passed as string instead of InputSignal<string>
    componentInputs?: ComponentInputValues<T>;
    
    // allows passing callbacks for component outputs
    componentOutputs?: ComponentOutputValues<T>;
    
    role: string,
    minWidth?: ModalSizeUnit,
    maxWidth?: ModalSizeUnit
    ariaLabelledBy?: string,
    ariaDescribedBy?: string,
    ariaLabel?: string
}