import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoryFormComponent } from './manage-category-form.component';

describe('ManageCategoryFormComponent', () => {
  let component: ManageCategoryFormComponent;
  let fixture: ComponentFixture<ManageCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
