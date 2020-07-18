import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoLancamentoComponent } from './novo-lancamento.component';

describe('NovoLancamentoComponent', () => {
  let component: NovoLancamentoComponent;
  let fixture: ComponentFixture<NovoLancamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoLancamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
