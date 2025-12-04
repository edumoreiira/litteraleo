import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBookFormComponent } from './manage-book-form.component';

describe('ManageBookFormComponent', () => {
  let component: ManageBookFormComponent;
  let fixture: ComponentFixture<ManageBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBookFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
