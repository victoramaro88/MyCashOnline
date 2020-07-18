import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerloadComponent } from './spinnerload.component';

describe('SpinnerloadComponent', () => {
  let component: SpinnerloadComponent;
  let fixture: ComponentFixture<SpinnerloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
