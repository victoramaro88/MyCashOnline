import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadCartaoComponent } from './cad-cartao.component';

describe('CadCartaoComponent', () => {
  let component: CadCartaoComponent;
  let fixture: ComponentFixture<CadCartaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadCartaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadCartaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
