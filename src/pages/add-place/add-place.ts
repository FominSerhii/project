import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation, Camera } from 'ionic-native';
import { PlacesService } from '../../services/places';

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html'
})
export class AddPlacePage {
	location: Location = {
		lat: 46.95850378,
		lng: 32.01632209
	};
	locationIsSet = false;
	imageUrl = '';
	constructor(private modalCtrl: ModalController,
				private loadingCtrl: LoadingController,
				private toastCtrl: ToastController,
				private placesService: PlacesService ) {}

	onSubmit(form: NgForm) {
		this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
		form.reset();
		this.location = {
			lat: 46.95850378,
			lng: 32.01632209
		};
		this.imageUrl = '';
		this.locationIsSet = false;
	}

	onOpenMap() {
 		const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
 		modal.present();
 		modal.onDidDismiss(
 			data => {
 				if (data) {
 					this.location = data.location;
 					this.locationIsSet = true;
 				}
 			}
 		);
	}

	onLocate() {
		const loader = this.loadingCtrl.create({
			content: 'Getting your Location...'
		});
		loader.present();
		Geolocation.getCurrentPosition()
		.then(
			location => {
				loader.dismiss();
				this.location.lat = location.coords.latitude;
				this.location.lng = location.coords.longitude;
				this.locationIsSet = true;
			}
		)
		.catch(
			error => {
				loader.dismiss();
				const toast = this.toastCtrl.create({
					message: 'Could not get location, please pick it manually!',
					duration: 2500
				});
				toast.present();
			}
		);
	}

	onTakePhoto() {
		Camera.getPicture({
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation: true
		})
		.then(
			imageData => {
				this.imageUrl = imageData;
			}
		)
		.catch(
			err => {
				console.log(err);
			}
		);
	}
}
	