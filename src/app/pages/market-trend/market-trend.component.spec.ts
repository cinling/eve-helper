import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTrendComponent } from './market-trend.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MarketTrendComponent', () => {
  let component: MarketTrendComponent;
  let fixture: ComponentFixture<MarketTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketTrendComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
