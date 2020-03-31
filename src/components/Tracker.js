import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Alert } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import firebase from "../firebase";
import Loader from "react-loader";
import './Main.css';
import { geolocated } from "react-geolocated";
import {  GeoFirestore, } from 'geofirestore';
import Marker from './Marker';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const firestore = firebase.firestore();
const geoFirestore = new GeoFirestore(firestore);


class Tracker extends Component {
  constructor(props) {
    super(props);
    this.geoRef = firebase.firestore().collection("gcovidcollection");
    this.unsubscribe = null;
    this.state = {
      closeLocations: [],
      center: {}
    };
  }

  onCollectionUpdate = querySnapshot => {
    const closeLocations = [];
    querySnapshot.forEach(doc => {
      const { locales } = doc.data();
      closeLocations.push({
        key: doc.id,
        locales: doc.data().d,
        latestSymptom: doc.data().d.symptom.slice(-1).pop()
      });
      this.setState({
        loaded: true
      });
    });
    this.setState({
      closeLocations
    });
    this.setState({
      newCenter: {
        lat: this.props.coords.latitude,
        lng: this.props.coords.longitude
      }
    });
  };

  getMeTheColor(symptoms) {

    let numberOfYes = [symptoms.fever, symptoms.headAche, symptoms.diarrhea, symptoms.dryCough, symptoms.breathDiff].filter(Boolean).length
    if (numberOfYes == 5) { return "red" }
    else if (numberOfYes == 4) { return "orange" }
    else if (numberOfYes == 3 || numberOfYes == 2) { return "yellow" }
    else if (numberOfYes < 2) { return "green" }
    else { return "green" }

  }
 
  componentDidMount() {
    this.unsubscribe = this.geoRef.onSnapshot(this.onCollectionUpdate);
  }




  static defaultProps = {
    center: {
      lat: 60.95,
      lng: 24.33
    },
    zoom: 11
  };
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  render() {
    const { closeLocations } = this.state;
    return (
      <Container>
        <Container>
          <Alert variant="warning">
            <Container>
              <Alert.Heading>Hey,</Alert.Heading>
              <p>
                In total <strong>{closeLocations.length} </strong> people have reported their symptoms.
              Have you marked yourself? <a href="/">Update Symptoms</a>
              </p>
              <hr />

              <p className="mb-0">
                Here you can browse the symptoms reported in your locality. You can hover on the markers to know the symptoms.
  
  </p>
  <Row>
                <ul class="legend">
                  <li ><span class="superawesome"></span> &lt; 2 symptoms</li>
                  <li ><span class="kindaawesome"></span>  2 or 3 symptoms</li>
                  <li  ><span class="notawesome"></span>  3 or 4 symptoms</li>
                  <li  ><span class="not"></span>All symptoms</li>
                </ul>
              </Row>

            </Container>
          </Alert>

          <Loader loaded={this.state.loaded}>
            <div style={{ height: '100vh', width: '100%' }}>
              {closeLocations.length && <GoogleMapReact
                bootstrapURLKeys={{ key: "<Map Api Key. Restrict with HTTP refer>" }}
                defaultCenter={this.props.center}
                center={this.state.newCenter}
                defaultZoom={this.props.zoom}>


                {closeLocations.map((each) => (

                  <Marker
                    lat={each.locales.latitude}
                    lng={each.locales.longitude}
                    key={each.key}
                    color={this.getMeTheColor(each.latestSymptom)}
                    name={(each.latestSymptom.createdTs.toDate()+ each.key + (each.latestSymptom.fever ? "Fever: yes " : "Fever: No ")
                      + (each.latestSymptom.headAche ? "HeadAche:yes " : "HeadAche:No ")
                      + (each.latestSymptom.diarrhea ? "Diahhrea:yes " : "Diahhrea:No ")
                      + (each.latestSymptom.dryCough ? "DryCough:yes " : "DryCough:No ")
                      + (each.latestSymptom.breathDiff ? "Breathing Difficulty :yes " : "Breathing Difficulty:No ")
                    )}

                  />
                )
                )
                }

              </GoogleMapReact>}
            </div>
          </Loader>
        </Container>
      </Container>
    );
  }
}

export default geolocated()(Tracker);
