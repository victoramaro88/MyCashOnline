import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JanelaCancelarComponent } from './janela-cancelar.component';

describe('JanelaCancelarComponent', () => {
  let component: JanelaCancelarComponent;
  let fixture: ComponentFixture<JanelaCancelarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanelaCancelarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanelaCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
