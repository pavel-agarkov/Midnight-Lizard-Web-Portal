import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { SideService, Side } from "../../../shared/side.service";

@Component({
    selector: 'ml-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent
{
    public sidenavMode: "over" | "side" = "side";
    public sidenavIsOpened: boolean = true;
    protected _sidenavIsOpened_UserDefined = this.sidenavIsOpened;

    public toggleSidenav()
    {
        this._sidenavIsOpened_UserDefined = this.sidenavIsOpened = !this.sidenavIsOpened;
    }

    constructor(media: ObservableMedia,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
        readonly execute: SideService)
    {
        iconRegistry.addSvgIcon(
            'midnight-lizard',
            sanitizer.bypassSecurityTrustResourceUrl('assets/ml-icon-512.svg'));

        execute.on(Side.Client, () =>
        {
            window.addEventListener("resize", () =>
            {

            });
            window.dispatchEvent(new Event('resize'));
        });

        media.subscribe((change: MediaChange) =>
        {
            if (/xs|sm/.test(change.mqAlias))
            {
                this.sidenavIsOpened = false;
            }
            else
            {
                this.sidenavIsOpened = this._sidenavIsOpened_UserDefined;
            }
            if (/xs|sm/.test(change.mqAlias))
            {
                this.sidenavMode = "over";
            }
            else
            {
                this.sidenavMode = "side";
            }
        });
    }
}