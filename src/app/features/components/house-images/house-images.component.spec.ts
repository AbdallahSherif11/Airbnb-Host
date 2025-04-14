import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseImagesComponent } from './house-images.component';

describe('HouseImagesComponent', () => {
  let component: HouseImagesComponent;
  let fixture: ComponentFixture<HouseImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
