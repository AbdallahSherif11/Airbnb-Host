import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDetailsComponent } from './host-details.component';

describe('HostDetailsComponent', () => {
  let component: HostDetailsComponent;
  let fixture: ComponentFixture<HostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
