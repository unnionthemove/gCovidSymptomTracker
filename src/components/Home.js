import React, { Component } from "react";
import firebase from "../firebase";
import 'firebase/firestore';   // for cloud firestore
import { Button, Col, Container, Row, InputGroup, Alert } from 'react-bootstrap';
import { geolocated } from "react-geolocated";
import { GeoFirestore } from 'geofirestore';
const firestore = firebase.firestore();

const geofirestore = new GeoFirestore(firestore);

class Home extends Component {
  constructor() {
    super();
    this.ref = geofirestore.collection("gcovidcollection");
    this.state = {
      ageGroup: "",
      headAche: false,
      fever: false,
      dryCough: false,
      diarrhea: false,
      breathDiff: false,
      createdTs: "",
      longitude: 0,
      lattitude: 0,
      lastGeneratedId: null,
      idsForLocalStorage: [],
      submitButtonDisabled: false
    };
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  checkBoxonChange = e => {
    const state = this.state;
    if (e.target.checked) {
      state[e.target.name] = true;
    } else {
      state[e.target.name] = false;
    }
    this.setState(state);
  };

  getTheLocationCordinates() {
    this.setState({
      latitude: this.props.coords.latitude,
      longitude: this.props.coords.longitude
    })

  };

  aggregateAndSubmit(newItem) {
    if (this.state.submitButtonDisabled) {
      return;
  }
  this.setState({submitButtonDisabled: true});
    if ((newItem.ageGroup == null || newItem.ageGroup === undefined || newItem.ageGroup === "")) {
      alert("Please select your age group!");
      this.setState({submitButtonDisabled: false});
      return;
    }
    if ((this.props.coords== null || this.props.coords === undefined || this.props.coords === "")) {
      alert("We have not got your location! Please make sure your location is turned on and this app can access it.");
      this.setState({submitButtonDisabled: false});
      return;
    }
    newItem.Created = firebase.firestore.Timestamp.now();
    newItem.latitude = this.props.coords.latitude;
    newItem.longitude = this.props.coords.longitude;
    newItem.coordinates = new firebase.firestore.GeoPoint(newItem.latitude, newItem.longitude);
    this.ref
      .add(newItem)
      .then(docRef => {
        this.setState({
          ageGroup: "",
          headAche: false,
          fever: false,
          dryCough: false,
          diarrhea: false,
          breathDiff: false,
          lastGeneratedId: docRef.id
        });
        let currentLocalValue = window.localStorage.getItem('g-covidValue');
       this.state.idsForLocalStorage = (currentLocalValue === null) ? [] : JSON.parse(currentLocalValue);
       this.state.idsForLocalStorage.push({ id:docRef.id,
          ageGroup:newItem.ageGroup});
        window.localStorage.setItem('g-covidValue', JSON.stringify(this.state.idsForLocalStorage));
        alert("Thanks for registering: Your Id is : " + docRef.id + "  (Keep this id safe to later update your details)")
        this.props.history.push("/");
        this.setState({submitButtonDisabled: false});
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
      
  }


  render() {
    const { ageGroup,
      headAche,
      fever,
      dryCough,
      diarrhea,
      breathDiff,
      lastGeneratedId } = this.state;
    return (
      <Container>
        <Alert variant="info">
          {lastGeneratedId && <h5> {lastGeneratedId}: Is your tracking ID</h5>
          }
          <ul>
                <li ><strong>We do not store or collect any personaly identifiable information of yours</strong></li>
                <li >Please allow location access, so you can be put on the map accurately.</li>
                <li >Enter your symptoms, <strong>even if you don't have any</strong>, as this helps us see where the epidemic is worse and where it is better</li>
                <li >You'll be given a unique ID upon submission, which can be used to update your symptoms. <strong>Your device will remember this ID</strong>, but you can take a note of it in case you'll update your symptoms from another device. </li>
                <li >If you choose to, you can delete all the data associated with your id <a href="/update">here</a></li>
              </ul>
          <p>
            <br />
            Already generated an Id? <a href="/update">Update Symptoms</a> <strong>OR</strong>  To see trend in your locality <a href="/tracker">Click here</a>
          </p>
          <p>
            <Button variant="info btn-sm" class="btn btn-primary btn-sm" href="/about" >Learn more</Button>
          </p>
          </Alert>
        <InputGroup >
          <Container>
            <Row className="justify-content-md-center" >
              <form onSubmit={this.onSubmit}>
                <Col>
                  <h2>Please mark your symptoms</h2>
                  <div class="form-group">
                    <label for="headAche">Do you have a <strong>head ache</strong>?</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      name="headAche"
                      value={headAche}
                      checked={this.state.headAche}
                      onChange={this.checkBoxonChange}
                      placeholder="headAche"
                    />
                  </div>
                  <div class="form-group">
                    <label for="fever">Do you have a <strong>fever</strong>?</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      name="fever"
                      value={fever}
                      checked={this.state.fever}
                      onChange={this.checkBoxonChange}
                      placeholder="fever"
                    />
                  </div>
                </Col>
                <Col>
                  <div class="form-group">
                    <label for="dryCough">Do you have a <strong>dry cough</strong>?</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      name="dryCough"
                      value={dryCough}
                      checked={this.state.dryCough}
                      onChange={this.checkBoxonChange}
                      placeholder="dryCough"
                    />
                  </div>
                  <div class="form-group">
                    <label for="diarrhea">Do you have a <strong>diarrhea</strong>?</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      name="diarrhea"
                      value={diarrhea}
                      checked={this.state.diarrhea}
                      onChange={this.checkBoxonChange}
                      placeholder="diarrhea"
                    />
                  </div>
                  <div class="form-group">
                    <label for="breathDiff">Do you have any <strong>breathing difficulty</strong>?</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      name="breathDiff"
                      value={breathDiff}
                      checked={this.state.breathDiff}
                      onChange={this.checkBoxonChange}
                      placeholder="breathDiff"
                    />
                  </div>
                  <p> <strong>No Symptoms?</strong> Just submit after selecting age group</p>
                </Col>
                <Col>
                  <div class="form-group">
                    <label for="jobType"><strong>AgeGroup:</strong></label>
                    <select
                      name="ageGroup"
                      type="text"
                      class="form-control"
                      value={ageGroup}
                      checked={this.state.checked}
                      onChange={this.onChange}
                      required
                    >
                      <option selected value="">-select an age group-</option>
                      <option value="01-10">01-10</option>
                      <option value="11-20">11-20</option>
                      <option value="21-30">21-30</option>
                      <option value="31-40">31-40</option>
                      <option value="41-50">41-50</option>
                      <option value="51-60">51-60</option>
                      <option value="61-70">61-70</option>
                      <option value="71-80">71-80</option>
                      <option value="81-90">81-90</option>
                      <option value="91-100">91-100</option>
                    </select>
                  </div>
                </Col>
                <Button variant="info btn-sm" class="btn btn-primary btn-sm"
                  onClick={() =>
                    this.aggregateAndSubmit(
                      {
                        ageGroup: this.state.ageGroup,
                        symptom: [{
                          headAche: this.state.headAche,
                          fever: this.state.fever,
                          dryCough: this.state.dryCough,
                          diarrhea: this.state.diarrhea,
                          breathDiff: this.state.breathDiff,
                          createdTs: firebase.firestore.Timestamp.now()
                        }]

                      }
                    )
                  }
                  disabled={this.state.submitButtonDisabled}
                >
                  {" "}
                  {this.state.submitButtonDisabled ? 'Submitting..' : 'Submit'}
                </Button>
              </form>
            </Row>
          </Container>
        </InputGroup>
      </Container>
    );
  }
}

export default geolocated()(Home);
