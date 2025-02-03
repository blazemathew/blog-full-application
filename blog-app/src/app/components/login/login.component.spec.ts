import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['loginWithGoogle', 'loginWithFacebook']);
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginWithGoogle when Google button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.google-btn'));
    button.triggerEventHandler('click', null);
    expect(authService.loginWithGoogle).toHaveBeenCalled();
  });

  it('should call loginWithFacebook when Facebook button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.facebook-btn'));
    button.triggerEventHandler('click', null);
    expect(authService.loginWithFacebook).toHaveBeenCalled();
  });
});
