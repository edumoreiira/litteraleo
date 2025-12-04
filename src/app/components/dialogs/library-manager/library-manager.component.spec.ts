import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryManagerComponent } from './library-manager.component';

describe('LibraryManagerComponent', () => {
  let component: LibraryManagerComponent;
  let fixture: ComponentFixture<LibraryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
