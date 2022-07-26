import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmAppsDashboardComponent } from './ctm-apps-dashboard.component';

describe('CtmAppsDashboardComponent', () => {
  let component: CtmAppsDashboardComponent;
  let fixture: ComponentFixture<CtmAppsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtmAppsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtmAppsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
