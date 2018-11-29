import React, { Component } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import api from '../../api'
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiZXNvbm5hZCIsImEiOiJjam96eXM0ZGYwMTAwM3ZtdHBiYTZnMnA1In0.bd13D4f1GjPT6iwSU45lTA' });

class AddPost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: "",
      text: "",
      search: "",
      searchOptions: [],
      searchCoordinates: {},
      pictureUrl: "",
      lng: 13.3711224,
      lat: 52,
      message: null
    }
    this.mapRef = React.createRef()
    this.map = null
    this.marker = null
  }

  handleInputChange = (event) => {
    let name = event.target.name
    this.setState({
      [name]: event.target.value
    }, () => {
      if (this.marker && (name === 'lat' || name === 'lng')) {
        this.marker.setLngLat([this.state.lng, this.state.lat])
      }
    })
  }

  handleSearch = (event) => {
    console.log("event", event)
    this.setState({
       search: event})
    geocodingClient
      .forwardGeocode({
        query: this.state.search,
        limit: 5
      })
      .send()
      .then(response => {
        const match = response.body.features;
        let options = []
        let optionObject = {};
        for (let i = 0; i < match.length; i++) {
          console.log("place name", typeof match[i].place_name)
          options.push(match[i].place_name)
          optionObject[match[i].place_name] = match[i].geometry.coordinates;
        }
        this.setState({
          searchOptions: options,
          searchCoordinates: optionObject
        })
      });
  }

  handleSearchSelection = (event) => {
    console.log("SEARCH SELECTION", event);
    let currentSearch = this.state.search 
    currentSearch = currentSearch.substring(0, currentSearch.length - 1)
    /* currentSearch = '"' + '"' + currentSearch + '"' + '"' */
    console.log("current search", currentSearch, "search object", this.state.searchCoordinates)
    console.log("THIS IS THE ONE WE`RE LOOKING AT!specific coordinates", this.state.searchCoordinates[currentSearch.toString()]);
    let newCoords = this.state.searchCoordinates[currentSearch.toString()]
    if (newCoords) {
      this.setState({
        lng: newCoords[0],
        lat: newCoords[1]
      })
      this.marker.setLngLat({
        lng: this.state.lng,
        lat: this.state.lat
      })
      this.map.setCenter([this.state.lng, this.state.lat])
    } 
  };

  handleClick(e) {
    e.preventDefault()
    console.log(this.state.title, this.state.text)
    let data = {
      title: this.state.title,
      text: this.state.text,
      lng: this.state.lng,
      lat: this.state.lat,
    }
    api.addPost(data)
      .then(result => {
        console.log('SUCCESS!')
        this.setState({
          title: "",
          text: "",
          message: `Your post has been created`
        })
        setTimeout(() => {
          this.setState({
            message: null
          })
        }, 2000)
      })
      .catch(err => this.setState({ message: err.toString() }))
  }
  componentDidMount() {
    this.setPosition();
  }

  setPosition= () => {
    navigator.geolocation.getCurrentPosition((location) =>{
      let latitude = location.coords.latitude;
      let longitude = location.coords.longitude;
      console.log(longitude, latitude)
      this.setState ({
        lng: longitude,
        lat: latitude
      })
      console.log("current position", this.state)

      this.initMap();

    });
  }
  initMap() {
    
    // Init the map where "this.mapRef" is defined in the render
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [this.state.lng, this.state.lat],
      zoom: 15
    })
    console.log("creating map", this.map)


    // Add zoom control on the top right corner
    this.map.addControl(new mapboxgl.NavigationControl())

    // Create a marker on the map
    this.marker = new mapboxgl.Marker({ color: 'red', draggable: true })
      .setLngLat([this.state.lng, this.state.lat])
      .addTo(this.map)

    console.log("created marker", this.marker)

    // Trigger a function every time the marker is dragged
    this.marker.on('drag', () => {
      let {lng,lat} = this.marker.getLngLat()
      this.setState({
        lng,
        lat
      })
    })
  }
  render() {
    //console.log("rendering. current state:", this.state)
    return (
      <Container className="AddPost">
        <h2>Add your Post</h2>

        <Row>
          <Col md={6}>
            <Form>
              <FormGroup row>
                <Label for="title" xl={3}>Title</Label>
                <Col xl={9}>
                  <Input type="text" value={this.state.title} name="title" onSelect={this.handleInputChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="text" xl={3}>Text</Label>
                <Col xl={9}>
                  <Input type="textarea" value={this.state.text} name="text" cols="30" rows="5" onChange={this.handleInputChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="search" xl={3}>Find your spot on the map or search here</Label>
                <Col xl={9}>
                  <TextInput type="text" value={this.state.search} name="search" options={this.state.searchOptions} trigger="" onChange={this.handleSearch} onClick={this.handleSearchSelection}/>
                </Col>
              </FormGroup>
              

              <FormGroup row>
                <Col xl={{ size: 9, offset: 3 }}>
                  <Button color="primary" onClick={(e) => this.handleClick(e)}>Create it!</Button>
                </Col>
              </FormGroup>

            </Form>
          </Col>
          <Col md={6}>
            <div className="map" ref={this.mapRef} style={{ height: '100%', minHeight: 400 }}></div>
          </Col>
        </Row>

        {this.state.message && <div className="info">
          {this.state.message}
        </div>}
      </Container>
    )
  }
}

export default AddPost
