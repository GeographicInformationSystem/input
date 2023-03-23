import {toLonLat} from 'https://cdn.skypack.dev/ol/proj.js';
import {toStringHDMS} from 'https://cdn.skypack.dev/ol/coordinate.js';
import {overlay,map,popupinfo} from '../config/peta.js';
import {clickpopup} from '../template/popup.js';
import {cogMarker} from './marker.js';
import {setInner,textBlur,onClick, getValue,setValue} from 'https://jscroot.github.io/element/croot.js';
import { postWithToken } from "https://jscroot.github.io/api/croot.js";


export function onClosePopupClick() {
    overlay.setPosition(undefined);
    textBlur('popup-closer');
}

export function onSubmitPopupClick() {
    let long = getValue('long');
    let lat = getValue('lat');
    let volume = getValue('volume');
    let data = {long,lat,volume};
    postWithToken("https://eoqc0wqfm9sjc6y.m.pipedream.net","Token","dsf9ygf87h98u479y98dj0fs89nfd7",data,afterSubmitCOG);
    overlay.setPosition(undefined);
    textBlur('popup-closer');
    cogMarker(long,lat,volume);
}

function afterSubmitCOG(result){
    console.log(result);
}

function popupInputMarker(tile) {
    let coordinate = toLonLat(tile);
    let msg = clickpopup.replace("#LONG#",coordinate[0]).replace("#LAT#",coordinate[1]).replace('#X#',tile[0]).replace('#Y#',tile[1]).replace('#HDMS#',toStringHDMS(coordinate));
    setInner('popup-content',msg);
    setValue('long',coordinate[0]);
    setValue('lat',coordinate[1]);
    overlay.setPosition(tile);
}

export function onMapPointerMove(evt) {
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

let popover;
export function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}

export function onMapClick(evt) {
    let tile = evt.coordinate;
    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    overlay.setPosition(undefined);
    popupinfo.setPosition(undefined);
    if (!feature) {
        popupInputMarker(tile);
        return;
    }
    setInner('popupinfo',feature.get('volume'));
    popupinfo.setPosition(tile);
  }