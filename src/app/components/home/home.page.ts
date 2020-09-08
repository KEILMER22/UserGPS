import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from '../../Services/authService.service';
import {DatabaseService} from '../../Services/database.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import * as firebase from 'firebase/app';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from "@ionic-native/google-maps";
import { Platform, LoadingController, ToastController } from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private lat: any;
  private lng: any;
  private temporal: any = 0;
  private marker: Marker;
  private user;
  map: GoogleMap;
  loading: any;
  private data: any = {
    nombre: "",
    ubicacion: "",
    latitude: "",
    longitude: "",
    temporal: "",
  };
  private config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: true, 
    stopOnTerminate: false, 
    locationProvider: 1,
    startForeground: true, 
    interval: 6000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
  };

  private latlng = {
    lat : 0,
    lng : 0
  };

  constructor(
    private geolocation: Geolocation,
    private backgroundGeolocation: BackgroundGeolocation,
    private db: DatabaseService,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform

  ) { }

  async ngOnInit() {
    var user = this.authService.getUser();
    this.user =(await user).displayName;
    this.data.nombre = (await user).email;
    await this.platform.ready();
    await this.loadMap();
  }
  OnLogout() {
    this.authService.logout();
    this.backgroundGeolocation.stop();
  }
  startGeolocation(){
    this.backgroundGeolocation.configure(this.config).then(() => {
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
            this.localizar();
            this.backgroundGeolocation.finish();
        });
    });
    this.backgroundGeolocation.start();
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        target: {
          lat: -2.1537488,
          lng: -79.8883037
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  async localizar() {
    this.map.clear();
    this.map
      .getMyLocation()
      .then((location: MyLocation) => {
        this.lat = location.latLng.lat;
        this.lng = location.latLng.lng;
        this.data.latitude = location.latLng.lat;
        this.data.longitude = location.latLng.lng;

        this.data.ubicacion = new firebase.firestore.GeoPoint(this.lat, this.lng);
        this.db.setUser(this.user, this.data);

        // Movemos la camara a nuestra ubicación con una pequeña animación
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        });

        // Agregamos un nuevo marcador
        this.marker = this.map.addMarkerSync({
          title: "Estoy aquí!",
          position: location.latLng,
        });

        // Mostramos un InfoWindow
        this.marker.showInfoWindow();

      })
      .catch(error => {

        this.showToast(error.error_message);
      });
  }
  async showToast(mensaje) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: "bottom"
    });

    toast.present();
  }

}
