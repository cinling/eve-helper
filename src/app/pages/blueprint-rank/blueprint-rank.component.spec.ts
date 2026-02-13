import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintRankComponent } from './blueprint-rank.component';

describe('BlueprintRankComponent', () => {
  let component: BlueprintRankComponent;
  let fixture: ComponentFixture<BlueprintRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueprintRankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlueprintRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
