import {NgModule, NgZone, ModuleWithProviders} from '@angular/core';
import {LIB_KEY, LIB_KEY_SEPARATOR} from './constants/lib';
import {STORAGE} from './enums/storage';
import {LocalStorageService, SessionStorageService} from './services/index';
import {WebStorageHelper} from './helpers/webStorage';
import {ModuleConfig} from './interfaces/config';
import {KeyStorageHelper} from './helpers/keyStorage';

export * from './interfaces/index';
export * from './decorators/index';
export * from './services/index';

@NgModule({
	declarations: [],
	providers: [SessionStorageService, LocalStorageService],
	imports: []
})
export class Ng2Webstorage {

	static forRoot({prefix, separator}:ModuleConfig = {prefix: LIB_KEY, separator: LIB_KEY_SEPARATOR}):ModuleWithProviders {
		KeyStorageHelper.setStorageKeyPrefix(prefix);
		KeyStorageHelper.setStorageKeySeparator(separator);
		return {ngModule: Ng2Webstorage, providers: []};
	}

	constructor(private ngZone:NgZone) {
		this.initStorageListener();
	}

	private initStorageListener() {
		if(window)
			window.addEventListener('storage', (event:StorageEvent) => this.ngZone.run(() => {
				let storage:STORAGE = window.sessionStorage === event.storageArea ? STORAGE.session : STORAGE.local;
				WebStorageHelper.refresh(storage, event.key);
			}));
	}

}
