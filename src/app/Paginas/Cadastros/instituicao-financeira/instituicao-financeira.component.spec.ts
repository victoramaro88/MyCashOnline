import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoFinanceiraComponent } from './instituicao-financeira.component';

describe('InstituicaoFinanceiraComponent', () => {
  let component: InstituicaoFinanceiraComponent;
  let fixture: ComponentFixture<InstituicaoFinanceiraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituicaoFinanceiraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituicaoFinanceiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
