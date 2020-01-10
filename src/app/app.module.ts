import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CacheService } from './cache.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NzModalModule
  ],
  providers: [CacheService],
  bootstrap: [AppComponent]
})
export class AppModule { }
