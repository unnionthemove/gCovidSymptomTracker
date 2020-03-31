import React from "react";
import { Link } from "react-router-dom";
import './Main.css';
import { Row, Col, Container } from 'react-bootstrap';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const about = () => {
  return (
    <div title="About">
      <h1>About Page</h1>
      <Container>
        <Row>
          <Col >
            <p>
              <strong>Mission:</strong> Track COVID trend by locality.
<br />
              <strong>Vision:</strong> World has been fighting COVID-19 since December 2019. Overall trend based on country is available through different sources. This is not enough to understand the spread of the virus in a locality.
              
<hr />
<strong>Be honest and please dont create fake or wrong information. Even if you don't have any symptoms, select your age group and add a marker on the map. It will appear as a Green Marker on the map.</strong>
<hr />       
              Mark yourself and symptoms if any. In this way, we can accurately mark the area getting affected. In the current scenario where the governmental agencies cannot test all the people with symptoms, this is an exercise which will help track the hotbeds.
              Representatives of the Finnish Health Agency was mentioning that if they had an app to check the symptoms of people by location, it would help them a lot. Health care officials and governments are trying to tackle the ever growing number of Covid-19 cases, it is practically impossible to track and test each individual who is showing very few symptoms or even none.
              <hr />
 You will get a unique id which can be used to update your symptoms later
For best use, please add app to the home screen and allow location access. This app does not store any of your private information and has been solely built for the purpose of helping out in these tough times. You can always store the ID in case you want to update your information from other devices.
<br />
<p>Please be honest when entering the information into the application.</p>
              <strong>Features in the pipeline</strong>
              <div>
                <ul>
                <li >Reporting capabilites once the number of markers increase</li>
                <li >Introduce more symptom types or seggregation criterias based on medical advice</li>
                <li >Collect a list of pre-existing conditions</li>
                <li ><strike>Being a PWA, ability to save the generated IDs to the app</strike> </li>
                <li ><strike>Separate color markers for patients with all symptoms as true</strike></li>
                <li ><strike>Option to retrieve and delete a specific ID related data</strike></li>
              </ul>
              </div>
              <hr />
              <strong>Note regarding GDPR,privacy and storage of personal data</strong>
              <p>This app does not save any personally identifiable information. That means, no IP, email, device id, names, nick names, addresses etc are stored in the system. In the worst case scenario that the data is compromised, there is no information in the data store that can lead back to an individual. Location data eventhough stored, as not connected to any individual is not relevant.
                In case you want to delete the information you have entered, you can request the information from the <strong>Update</strong> page using the ID and use the <strong>Delete my data</strong> button to delete the data that you have entered.
              </p>
              
            </p>
          </Col>
          <Col>
          <TwitterTimelineEmbed
  sourceType="profile"
  screenName="<you screen name>"
  options={{height: 400}}
/>
          
          
          </Col>
        </Row>
        <Row><a href="https://www.who.int/health-topics/coronavirus#tab=tab_3">Official page of WHO regarding Covid 19 Symptoms</a></Row>
      </Container>

    </div>
  );
};

export default about;
