import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmFoldersDashboardComponent } from './ctm-folders-dashboard.component';

describe('CtmFoldersDashboardComponent', () => {
  let component: CtmFoldersDashboardComponent;
  let fixture: ComponentFixture<CtmFoldersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtmFoldersDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtmFoldersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
