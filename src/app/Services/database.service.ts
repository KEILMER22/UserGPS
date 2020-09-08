import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor(
    private db: AngularFirestore
  ) { }

  async setUser(id: string, data: {}) {
    try {
      await this.db.collection("usuarios").doc(id).set(data);
    } catch (error) {
    }
  }
  getUser(cod: string) {
    return this.db.collection("usuarios").doc(cod).valueChanges();
  }
}
