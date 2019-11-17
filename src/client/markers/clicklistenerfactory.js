"use strict";
/* Copyright (c) 2016 Grant Miner */
const React = require('react');
const ReactDOM = require('react-dom');
const render = require('react-dom').render;

const t = require("../i18n").translate;
const moment = require("moment");
const Status = require("../../common/status");
const hidenan = require("../../common/hidenan");
const tomiles = require("../tomiles");
const isUserMetric = require("../isUserMetric");
const appState = require("../appState");
const _ = require("lodash");
let lastinfowindow;

function closeInfoWindow() {
  if (lastinfowindow) lastinfowindow.close();
}
module.exports.closeInfoWindow = closeInfoWindow;

module.exports.create = function(marker, item, position, map) {
  return function() {
    if (!item.last) {
      item.last = _.cloneDeep(item);
    }

    const map = appState.getState().map;
    map.setCenter(position);
    const ref = React.createRef();
    
    function PopupView() {
      return (
        <>
          <div>
            <a onClick={ ev => appState.selectVehicleByID(item.id) }>
            { item.name }
            </a>
          </div>
          <div ref={ ref } style={{
            height: '160px',
            width: '360px',
          }}>
          </div>
          <div>
            <div style={{
              color: Status.getStatusColor(item)
            }}>
              { Status.getStatus(item) }
            </div>
            { hidenan(tomiles(item.last.s)) }
            { isUserMetric() ? 'km/h' : 'mph' }          
            <div style={{float:'right'}}>
              { moment(item.last.d).format("M/DD/YYYY h:mm:ss A") }
            </div>
            <div style={{textAlign:'center'}}>
              Zoom in: <a onClick={ () => {
                const center = new google.maps.LatLng(
                  item.last.la + 0.0003,
                  item.last.lo
                );
                map.setCenter(center);
                map.setZoom(18);
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
              }}>Road</a> | <a onClick={ () => {
                const center = new google.maps.LatLng(
                  item.last.la + 0.0003,
                  item.last.lo
                );
                map.setCenter(center);
                map.setZoom(18);
                map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
              }}>Satellite</a> | <a onClick={ () => {
                const center = new google.maps.LatLng(
                  item.last.la + 0.0003,
                  item.last.lo
                );
                map.setCenter(center);
                map.setZoom(18);
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
              }}>Hybrid</a> | <a onClick={ () => {
                const center = new google.maps.LatLng(
                  item.last.la + 0.0003,
                  item.last.lo
                );
                map.setCenter(center);
                map.setZoom(18);
                map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
              }}>Terrain</a>
            </div>
          </div>
        </>
      );
    }

    const renderedElement = document.createElement("div");
    ReactDOM.render(
      <PopupView />,
      renderedElement
    );

    const streetViewService = new google.maps.StreetViewService();
    const STREETVIEW_MAX_DISTANCE = 100;
    const infowindow = new google.maps.InfoWindow({
      content: renderedElement
    });

    streetViewService.getPanoramaByLocation(
      position,
      STREETVIEW_MAX_DISTANCE,
      function(streetViewPanoramaData, status) {
        if (status === google.maps.StreetViewStatus.OK) {
          const pano = new google.maps.StreetViewPanorama(ref.current, {
            pov: {
              heading: item.last.a,
              pitch: 0
            }
          });
          // pano.bindTo('position', marker); // this causes the marker to move to the streetview
          // pano.bindTo('position', streetViewPanoramaData.location);
          pano.setPosition(streetViewPanoramaData.location.latLng);
          pano.setVisible(true);

          google.maps.event.addListener(infowindow, "closeclick", function() {
            pano.unbind("position");
            pano.setVisible(false);
          });
        } else {
          ref.current.style.display = "none";
        }
      }
    );

    closeInfoWindow();
    infowindow.open(map, this);
    lastinfowindow = infowindow;
  };
};
