import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSearchPopupComponent } from './ai-search-popup.component';

describe('AiSearchPopupComponent', () => {
  let component: AiSearchPopupComponent;
  let fixture: ComponentFixture<AiSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSearchPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
