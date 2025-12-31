import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ButtonComponent } from 'app/components/base/Button/button.component';
import { InputComponent } from 'app/components/base/input/input.component';
import { ReviewCategory } from 'app/models/review.interface';
import { ReviewsService } from 'app/services/posts/reviews.service';

export interface CategoryForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-manage-category-form',
  host: {
    class: 'flex flex-col gap-4'
  },
  imports: [InputComponent, ButtonComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './manage-category-form.component.html',
})
export class ManageCategoryFormComponent {
  private fb = inject(FormBuilder);
  private reviews = inject(ReviewsService);
  // 
  mode = input<'create' | 'edit'>('create');
  category = input<ReviewCategory>();
  onCategoryManage = output<void>();

  categoryForm: FormGroup<CategoryForm> = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
  });

  constructor() {
    effect(() => { // Populate form if in edit mode with provided category data
      if (this.mode() === 'edit' && this.category()) {
        this.categoryForm.patchValue({
          id: this.category()!.id,
          name: this.category()!.name,
        });
      }
    })
  }

  protected onSubmit() {
    if (this.categoryForm.invalid) return;
    this.categoryForm.disable();
    if (this.mode() === 'create') {
      this.reviews.createCategory({ name: this.categoryForm.value.name! }).then(() => {
        this.categoryForm.reset();
        this.onCategoryManage.emit();
      }).finally(() => { this.categoryForm.enable(); });
    } else {
      if (!this.categoryForm.value.id) return;

      const updatedCategory: ReviewCategory = {
        id: this.categoryForm.value.id,
        name: this.categoryForm.value.name!
      };
      this.reviews.updateCategory(updatedCategory).then(() => {
        this.categoryForm.reset();
        this.onCategoryManage.emit();
      }).finally(() => { this.categoryForm.enable(); });
    }
  }





  
}
