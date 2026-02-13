import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTreeComponent } from './market-tree.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MarketTreeComponent', () => {
  let component: MarketTreeComponent;
  let fixture: ComponentFixture<MarketTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketTreeComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
