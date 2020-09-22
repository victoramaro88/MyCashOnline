import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeiraCartaoComponent } from './bandeira-cartao.component';

describe('BandeiraCartaoComponent', () => {
  let component: BandeiraCartaoComponent;
  let fixture: ComponentFixture<BandeiraCartaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandeiraCartaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandeiraCartaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
