import React, { Component } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Select,
  Row,
} from 'reactstrap'
import api from '../../api'
import 'react-autocomplete-input/dist/bundle.css';
import TextInput from 'react-autocomplete-input';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiZXNvbm5hZCIsImEiOiJjam96eXM0ZGYwMTAwM3ZtdHBiYTZnMnA1In0.bd13D4f1GjPT6iwSU45lTA'});

class AddPost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: "",
      text: "",
      // tagged: "",
      search: "",
      category: "Moment",
      privacy: "Private",
      searchOptions: [],
      searchCoordinates: {},
      lng: 13.3711224,
      lat: 52,
      message: null,
      pictureUrl: "",
      file: null,
      public_id: "",
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

  handleFileChange=(e)=>{
    e.preventDefault();
    const file = e.target.files[0];
    this.setState({
      file: file,
      pictureUrl: "",
    })

  }

  handleSearch = (event) => {
    let value = event.target.value;
    this.setState({
      search: value
    });
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
   
    let newCoords = this.state.searchCoordinates[event];
    if (newCoords) {
      this.setState({
        search: event,
        searchOptions: [],
        lng: newCoords[0],
        lat: newCoords[1]
      })
      this.marker.setLngLat({
        lng: newCoords[0],
        lat: newCoords[1]
      })
      this.map.setCenter([newCoords[0], newCoords[1]])
    } 
  };

  handleClick(e) {
    e.preventDefault()
    let data = {
      title: this.state.title,
      text: this.state.text,
      // tagged: this.state.tagged,
      lng: this.state.lng,
      lat: this.state.lat,
      category: this.state.category,
      privacy: this.state.privacy,
      public_id: this.state.public_id,
      picture: this.state.file,
    }

    api.addPost(data)
      .then(result => {
        this.setState({
          title: "",
          text: "",
          // tagged: "",
          pictureURL: "",
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
      this.setState ({
        lng: longitude,
        lat: latitude
      })

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


    // Add zoom control on the top right corner
    this.map.addControl(new mapboxgl.NavigationControl())

    // Create a marker on the map
    this.marker = new mapboxgl.Marker({ color: 'red', draggable: true })
      .setLngLat([this.state.lng, this.state.lat])
      .addTo(this.map)


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
    return (
      <div>
        <h1 className="page-title">Mark your spot</h1>
      <Container className="AddPost">
        <Row>
          <Col md={6}>
            <Form>
              <FormGroup row>
                <Label for="title" xl={3}>Title</Label>
                <Col xl={9}>
                  <Input type="text" value={this.state.title} name="title" onChange={this.handleInputChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="text" xl={3}>Text</Label>
                <Col xl={9}>
                  <Input type="textarea" value={this.state.text} name="text" cols="30" rows="5" onChange={this.handleInputChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
              <Label for="category" xl={3}>Category</Label>
                <Col xl={9}>
                  <Input type="select" value={this.state.category} name="category" cols="30" rows="5" onChange={this.handleInputChange}>
                  <option value="Moment">Moment</option>
                  <option value="Question">Question</option>
                  <option value="Tip">Tip</option>
                  <option value="Warning">Warning</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
              <Label for="privacy" xl={3}>Privacy Settings</Label>
                <Col xl={9}>
                  <Input type="select" value={this.state.privacy} name="privacy" cols="30" rows="5" onChange={this.handleInputChange}>
                  <option value="Private">Private</option>
                  <option value="Anonymous">Anonymous</option>
                  <option value="Public">Public</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="pictureUrl" xl={3}>Add a picture</Label>
                <Col xl={9}>
                  <Input type="file" name="pictureUrl" cols="30" rows="5" onChange={this.handleFileChange} />
                </Col>
              </FormGroup>
              {/* <FormGroup row>
                <Label for="tagged" xl={3}>Tag a user</Label>
                <Col xl={9}>
                  <Input type="text" value={this.state.tagged} name="tagged" onChange={this.handleInputChange} />
                </Col>
              </FormGroup> */}
              
              <FormGroup row>
                <Label for="search" xl={3}>
                  Find your spot on the map or search here
                </Label>
                <Col xl={9}>
                  <Input
                    type="text"
                    value={this.state.search}
                    name="searchText"
                    onChange={this.handleSearch}
                  />

                  {this.state.searchOptions.map(result => (
                    <div onClick={e => this.handleSearchSelection(result)}>
                      {result}
                      <hr />
                    </div>
                  ))}
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
      </div>
    )
  }
}

export default AddPost
