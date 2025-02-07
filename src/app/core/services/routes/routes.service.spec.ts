import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RoutesService } from './routes.service';
import { RoutesEnum } from '../../../shared/enum/routes.enum';

describe('RoutesService', () => {
  let service: RoutesService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        RoutesService
      ]
    });
    service = TestBed.inject(RoutesService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve rotear para o módulo de login', () => {
    
    const navigateSpy = spyOn(router, 'navigate');

    service.navigateToLogin();

    expect(navigateSpy).toHaveBeenCalledWith([`/${RoutesEnum.LOGIN}`]);
  });

  it('deve rotear para o módulo de cadastro de usuário', () => {
    
    const navigateSpy = spyOn(router, 'navigate');

    service.navigateToUserRegistration();

    expect(navigateSpy).toHaveBeenCalledWith([`/${RoutesEnum.USER_REGISTRATION}`]);
  });

  it('deve rotear para o módulo de recuperação de senha', () => {
    
    const navigateSpy = spyOn(router, 'navigate');

    service.navigateToRecoverPassword();

    expect(navigateSpy).toHaveBeenCalledWith([`/${RoutesEnum.RECOVER_PASSWORD}`]);
  });
  
  it('deve rotear para o módulo da home', () => {
    
    const navigateSpy = spyOn(router, 'navigate');

    service.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith([`/${RoutesEnum.HOME}`]);
  });
});
