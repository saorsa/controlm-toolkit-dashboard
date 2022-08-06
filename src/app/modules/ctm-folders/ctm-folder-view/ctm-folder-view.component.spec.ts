import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmFolderViewComponent } from './ctm-folder-view.component';

describe('CtmFolderViewComponent', () => {
  let component: CtmFolderViewComponent;
  let fixture: ComponentFixture<CtmFolderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtmFolderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtmFolderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
