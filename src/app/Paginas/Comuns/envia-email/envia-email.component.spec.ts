import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviaEmailComponent } from './envia-email.component';

describe('EnviaEmailComponent', () => {
  let component: EnviaEmailComponent;
  let fixture: ComponentFixture<EnviaEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviaEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviaEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
