import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmHostViewComponent } from './ctm-host-view.component';

describe('CtmHostViewComponent', () => {
  let component: CtmHostViewComponent;
  let fixture: ComponentFixture<CtmHostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtmHostViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtmHostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
