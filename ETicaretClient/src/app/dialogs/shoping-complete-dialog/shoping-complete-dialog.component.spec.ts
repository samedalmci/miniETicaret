import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopingCompleteDialogComponent } from './shoping-complete-dialog.component';

describe('ShopingCompleteDialogComponent', () => {
  let component: ShopingCompleteDialogComponent;
  let fixture: ComponentFixture<ShopingCompleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopingCompleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopingCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
