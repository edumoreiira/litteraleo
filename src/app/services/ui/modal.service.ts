import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Injector, output, Type } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Subject } from "rxjs";
import { ModalComponent } from "../../components/dialogs/base/modal/modal.component";
import { ModalConfig, ModalRef } from "../../models/modal.interface";

@Injectable( { providedIn: 'root' })
export class ModalService {
    private appRef = inject(ApplicationRef);
    private injector = inject(Injector);
    private envInjector = inject(EnvironmentInjector);
    private document = inject(DOCUMENT);
    
    public open<T>(
        component: Type<T>,
        config: ModalConfig<T>,
    ): ModalRef<T> {
        const closed$ = new Subject<void>;
        
        //create ModalComponent
        const modalCompRef = createComponent<ModalComponent<T>>(ModalComponent, {
            environmentInjector: this.envInjector,
            elementInjector: this.injector
        });

        // set required signals from ModalComponent
        this.setInputs(config, modalCompRef, component);
        
        // connect angular view tree
        this.appRef.attachView(modalCompRef.hostView);
        
        // renders on DOM
        const domElem = (modalCompRef.hostView as any).rootNodes[0] as HTMLElement;
        
        // find the cdk-overlay-container to determine injection position
        const overlayContainer = this.document.querySelector('.cdk-overlay-container');

        // if the container exists and is a direct child of body, insert before it.
        // otherwise, append to the end of body.
        // this ensures modals appear above cdk overlays.
        if (overlayContainer && overlayContainer.parentNode === this.document.body) {
            this.document.body.insertBefore(domElem, overlayContainer);
        } else {
            this.document.body.appendChild(domElem);
        }
        
        modalCompRef.changeDetectorRef.detectChanges();

        const modalRef: ModalRef<T> = {
          componentRef: modalCompRef.instance.cmpRef!,
          close: () => {
            this.close(modalCompRef);
            closed$.next();
            closed$.complete();
          },
          afterClosed$: closed$.asObservable()
        };
        
        modalCompRef.instance.onCloseModal.subscribe(() => modalRef.close());
        this.document.body.classList.add('overflow-hidden'); // prevent body scroll when modal is open
        return modalRef
    }
    

    private close<T>(modalRef: ComponentRef<ModalComponent<T>>) {
        this.document.body.classList.remove('overflow-hidden'); // re-enable body scroll
        this.appRef.detachView(modalRef.hostView);
        modalRef.destroy();
    }

    private setInputs<T>(config: ModalConfig<T>, modalRef: ComponentRef<ModalComponent<T>>, component: Type<T>) {
        modalRef.setInput('component', component);
        modalRef.setInput('componentInputs', config.componentInputs ?? {});
        modalRef.setInput('role', config.role);
        if (config.minWidth)       modalRef.setInput('minWidth', config.minWidth);
        if (config.ariaLabelledBy) modalRef.setInput('ariaLabelledBy', config.ariaLabelledBy);
        if (config.ariaDescribedBy)modalRef.setInput('ariaDescribedBy', config.ariaDescribedBy);
        if (config.ariaLabel)      modalRef.setInput('ariaLabel', config.ariaLabel);
    }
}