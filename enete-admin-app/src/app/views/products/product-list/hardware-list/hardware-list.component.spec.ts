import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareListComponent } from './hardware-list.component';

describe('HardwareListComponent', () => {
  let component: HardwareListComponent;
  let fixture: ComponentFixture<HardwareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HardwareListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HardwareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
