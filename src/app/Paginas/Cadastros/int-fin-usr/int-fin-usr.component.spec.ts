import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntFinUsrComponent } from './int-fin-usr.component';

describe('IntFinUsrComponent', () => {
  let component: IntFinUsrComponent;
  let fixture: ComponentFixture<IntFinUsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntFinUsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntFinUsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
