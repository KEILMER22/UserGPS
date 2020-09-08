import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../Services/authService.service';
import {Router} from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService, public router: Router
  ) { }

  user: string;
  password:string;

  ngOnInit() {
  }

  onSubmitLogin(){
    this.authService.login(this.user, this.password).then(res=>{
      this.router.navigate(['home']);
    }).catch(err=> alert("Datos incorrectos o no existe el usuario"));

  }
}
