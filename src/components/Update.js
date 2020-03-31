import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { geolocated } from "react-geolocated";
import firebase from 'firebase/app';
import Moment from 'react-moment';

class Update extends Component {
  constructor() {
    super();
    let existingIDs = JSON.parse(window.localStorage.getItem('g-covidValue'));
    this.ref = firebase.firestore().collection("gcovidcollection");
    this.state = {
      covidId: "",
      currentDoc: null,
      currentDocId: "",
      closeLocations: [],
      center: {},
      headAche: false,
      fever: false,
      dryCough: false,
      diarrhea: false,
      breathDiff: false,
      existingIDs: existingIDs,
      submitButtonDisabled: false,
      updateButtonDisabled: false
    };

  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  aggregateAndUpdate(id, newItem) {
    if (this.state.updateButtonDisabled) {
      return;
    }
    this.setState({ updateButtonDisabled: true });
    newItem.createdTs = firebase.firestore.Timestamp.now();
    let currentDoc = this.state.currentDoc;
    currentDoc.d.symptom.push(newItem)

    this.ref
      .doc(id)
      .update({ d: currentDoc.d })
      .then(docRef => {
        this.setState({
          currentDoc,
          headAche: false,
          fever: false,
          dryCough: false,
          diarrhea: false,
          breathDiff: false,
          updateButtonDisabled: false
        });
        alert("Thanks for updating the symptoms")
      })
      .catch(error => {
        console.error("Error updating document: ", error);
      });
  }
  checkBoxonChange = e => {
    const state = this.state;
    if (e.target.checked) {
      state[e.target.name] = true;
    } else {
      state[e.target.name] = false;
    }
    this.setState(state);
  };

  findYourId(covidId) {
    if (this.state.submitButtonDisabled) {
      return;
    }
    this.setState({ submitButtonDisabled: true });
    if ((covidId == null || covidId === undefined || covidId === "")) {
      alert("Please provide an id!!");
      this.setState({ submitButtonDisabled: false });
      return;
    }
    this.ref.doc(covidId.trim()).get().then(doc =>
      this.setState({
        currentDoc: doc.data(),
        currentDocId: doc.id,
        submitButtonDisabled: false
      })
    );
  }

  deleteMyId(covidId) {
    var r = window.confirm("Are you sure you want to delete permanently the data related to this particular ID!");
    if (r == true) {
      if (this.state.submitButtonDisabled) {
        return;
      }
      this.setState({ submitButtonDisabled: true });
      if ((covidId == null || covidId === undefined || covidId === "")) {
        alert("Please provide an id!!");
        this.setState({ submitButtonDisabled: false });
        return;
      }
      this.ref.doc(covidId.trim()).delete().then(doc => {
        let currentLocalValue = window.localStorage.getItem('g-covidValue');
        this.state.idsForLocalStorage = (currentLocalValue === null) ? [] : JSON.parse(currentLocalValue);
        let index = this.state.idsForLocalStorage.findIndex(i => i.id === covidId);
        if (index !== -1) this.state.idsForLocalStorage.splice(index, 1);
        let existingIDs = this.state.idsForLocalStorage
        window.localStorage.setItem('g-covidValue', JSON.stringify(this.state.idsForLocalStorage));
        this.setState({
          currentDoc: null,
          currentDocId: "",
          submitButtonDisabled: false,
          existingIDs: existingIDs
        })
      });
    } 
  };


  render() {
    const { covidId,
      currentDoc,
      currentDocId,
      breathDiff,
      headAche,
      fever,
      dryCough,
      diarrhea,
      existingIDs
    } = this.state;
    return (

      <Container>

        <div>
          <Row className="justify-content-md-center">
            <h5>List of ids generated from this device </h5>
          </Row>
          <Row className="justify-content-md-center">
            <ul class="list-group">
              {existingIDs && existingIDs.map(doc =>
                <li class="list-group-item"><strong>{doc.id}</strong>- (Age {doc.ageGroup}) <Button variant="info btn-sm" class="btn btn-primary btn-sm"
                  onClick={() =>
                    this.findYourId(doc.id)
                  }
                  disabled={this.state.submitButtonDisabled}
                >
                  {" "}
                  {this.state.submitButtonDisabled ? 'Fetching..' : 'Fetch Id'}
                </Button></li>

              )}
            </ul>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <div class="form-group">
                <label for="covidId">Do you have an id?</label>
                <input
                  type="text"
                  class="form-control"
                  name="covidId"
                  value={covidId}
                  onChange={this.onChange}
                  placeholder="Your id"
                />
              </div>
              <br />
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <Button variant="info"
                onClick={() =>
                  this.findYourId(this.state.covidId)
                }
                disabled={this.state.submitButtonDisabled}
              >
                {" "}
                {this.state.submitButtonDisabled ? 'Fetching..' : 'Fetch Id'}
              </Button>
              <hr />
            </Col>
          </Row>
        </div>

        <Row>
          {currentDoc &&
            (
              <div class="container">
                <div class="row">
                  <div class="col-sm">
                    <Container>
                      <InputGroup >
                        <Col>
                          <h4>  Your id is :  <strong>{currentDocId}</strong>    </h4>
                          <h4>  Your age group is : {currentDoc.d.ageGroup}    </h4>
                          <hr />
                          <Row>  Symptoms you reported: {currentDoc.d.symptom.map(s =>
                            <Container><Row> Reported : <strong>  {<Moment fromNow>{s.createdTs.toDate()}</Moment>}</strong>  </Row>
                              <Row> HeadAche: {(s.headAche == true ? "yes" : "no")}</Row>
                              <Row> Fever: {(s.fever == true ? "yes" : "no")}</Row>
                              <Row> Diarrhea: {(s.diarrhea == true ? "yes" : "no")}</Row>
                              <Row> Dry Cough: {(s.dryCough == true ? "yes" : "no")}</Row>
                              <Row> Breathing Difficulty: {(s.breathDiff == true ? "yes" : "no")}</Row>
                              <hr />
                            </Container>)}
                          </Row>
                        </Col>
                      </InputGroup>
                    </Container>
                  </div>
                  <div class="col-sm">
                    <Col>
                      <h4>Incase you have developed new symptoms or symptoms have gone away please update here</h4>
                      <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                          <label for="headAche">Do you have a head ache now?</label>
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
                          <label for="fever">Do you have a fever now?</label>
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
                        <div class="form-group">
                          <label for="dryCough">Do you have a dry cough now?</label>
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
                          <label for="diarrhea">Do you have a diarrhea now?</label>
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
                          <label for="breathDiff">Do you have any breathing difficulty?</label>
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
                        <div class="col-xs-3">
                        <Button variant="info btn-block"
                          onClick={() =>
                            this.aggregateAndUpdate(currentDocId,
                              {
                                headAche: this.state.headAche,
                                fever: this.state.fever,
                                dryCough: this.state.dryCough,
                                diarrhea: this.state.diarrhea,
                                breathDiff: this.state.breathDiff,
                              }
                            )
                          }
                          disabled={this.state.updateButtonDisabled}
                        >
                          {" "}
                          {this.state.updateButtonDisabled ? 'Updating..' : 'Update symptoms'}
                        </Button>
                        <Button variant="danger btn-block"
                          onClick={() =>
                            this.deleteMyId(currentDocId)
                          }
                          disabled={this.state.updateButtonDisabled}
                        >
                          {" "}
                          {this.state.updateButtonDisabled ? 'Waiting..' : 'Delete my data'}
                        </Button>
                        </div>
                      </form>
                    </Col>
                  </div>
                </div>
              </div>)}

          {currentDoc && <Row>

          </Row>}
        </Row>
      </Container>
    );
  }
}

export default geolocated()(Update);
