import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private Afauth: AngularFireAuth,
    private router: Router
    ) { }

  login( user: string, password: string){
    return new Promise((resolve,rejected)=>{
      this.Afauth.signInWithEmailAndPassword(user, password).then(user =>{
        resolve(user);
      }).catch(err =>rejected(err));
    })
  }

  logout(){
    this.Afauth.signOut().then(auth=>{

      this.router.navigate(['/login']);
    });


  }
  async getUser(){
    return  await this.Afauth.currentUser;
  }

}
