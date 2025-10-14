import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, OnChanges, output, signal, SimpleChanges, untracked, ViewChild } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { createAnimation } from 'app/angular-animations/animations.utils';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, FormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  animations: [createAnimation('selectorPopIn', { animateX: true, duration: '200ms', transform: 'scale(.5) translate(-100%, -50%)' })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PaginatorComponent implements OnChanges {
  //injections
  private elementRef = inject(ElementRef)
  //
  public limit = input<number>(1);
  public initialPageIndex = input<number>(1);
  public getCurrentPage = output<number>();
  public shadow = input<boolean>(false);
  public disabled = input(false);
  protected firstButtonValue = computed(() => this.getButtonValue(-1));
  protected secondButtonValue = computed(() => this.getButtonValue(0));
  protected thirdButtonValue = computed(() => this.getButtonValue(1));

  protected currentPage = signal<number>(this.initialPageIndex());
  protected showPageSelector = signal(false);
  protected pageSelectorInputValue = '';
  protected onLimitChanged = effect(() => {
    const limit = this.limit();
    untracked(() => { 
      this.selectPage(1)
    })
  }); // reset to first page when limit changes
  @ViewChild('pageSelector') pageSelectorElementRef!: ElementRef<HTMLInputElement>;
  @ViewChild('pageSelectorInput') pageSelectorInputElementRef!: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['initialPageIndex']) {
      this.selectPage(this.initialPageIndex());
    }
  }

  selectPage(page: number) {
    if(this.disabled() === false) {
      this.currentPage.set(page);
      this.getCurrentPage.emit(this.currentPage());
    }
  }

  onPageSelected(page: number){
    if(page < 1 || page > this.limit()){
      return
    }
    this.selectPage(page);
  }

  onPreviousPage(){
    if(this.currentPage() > 1){
      this.selectPage(this.currentPage() - 1);
    }
  }

  onNextPage(){
    if(this.currentPage() < this.limit()){
      this.selectPage(this.currentPage() + 1);
    }
  }
  

  getButtonValue(offset: number): number {
    if(this.currentPage() <= 2) {
      return 2 + offset;
    }

    if(this.limit() === 3 && this.currentPage() === 3) { // fix for when there are only 3 pages
     return  2 + offset;
    }

    if(this.currentPage() >= this.limit() - 1) { // if current page is the second to last page or last page
      return (this.limit() - 2) + offset;
    }

    return this.currentPage() + offset;
  }
  




  // Page Selector modal methods
  closePageSelector() {
    this.showPageSelector.set(false);
    this.pageSelectorInputValue = '';
  }

  openPageSelector() {
    if(this.limit() >= 3) {
      this.showPageSelector.set(true);

      setTimeout(() => { // timeout to wait for the element to be rendered before interacting with it
        const inputElement = this.pageSelectorInputElementRef.nativeElement
        inputElement.focus();
      }, 100);
    }
  }

  togglePageSelector() {
    this.showPageSelector() ? this.closePageSelector() : this.openPageSelector();
  }


  onSelectSpecificPage(page: string) {
    const pageNumber = parseInt(page, 10);
    if(pageNumber > this.limit() || pageNumber < 1 || isNaN(pageNumber)) {
      return 
    }
    this.selectPage(pageNumber);
    this.closePageSelector();
  }
  
  // prevent user from entering numbers greater than the last page in the input
  onPageSelectorInputChange(value: string, inputElement: HTMLInputElement) {
    const inputValue = parseInt(value, 10);

    if (isNaN(inputValue)) {
      this.pageSelectorInputValue = value;
      return;
    }

    if(inputValue > this.limit()) {
      this.pageSelectorInputValue = this.limit().toString();
      inputElement.value = this.limit().toString(); // update input value to last page number

    } else if(inputValue < 1) {
      this.pageSelectorInputValue = '1';
      inputElement.value = '1'; // update input value to 1

    } else {
      this.pageSelectorInputValue = value; // update to allowed value
    }
  }


  //listeners

  // close page selector on click outside or pressing esc
  @HostListener('document:click', ['$event'])
    handleDocumentClick(event: MouseEvent): void {
      if (this.showPageSelector()) {
        const hostElement = this.elementRef.nativeElement as HTMLElement;
        if (!hostElement.contains(event.target as Node)) {
          this.closePageSelector();
        }
      }
  }

  @HostListener('document:keydown', ['$event'])
    handleDocumentKeydown(event: KeyboardEvent): void {
      if (this.showPageSelector() && event.key === 'Escape') {
        this.closePageSelector();
      }
  }
}
