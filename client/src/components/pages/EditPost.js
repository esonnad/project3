import React, { Component } from 'react'
import api from '../../api';
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
import 'react-autocomplete-input/dist/bundle.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiZXNvbm5hZCIsImEiOiJjam96eXM0ZGYwMTAwM3ZtdHBiYTZnMnA1In0.bd13D4f1GjPT6iwSU45lTA' });

export default class EditPost extends Component {
  constructor(props){
    super(props)
    this.state = {
      title: "",
      pictureUrl: "",
      pictureFile: "",
      text: "",
      category: "",
      lng: "",
      lat: "",
      searchOptions: [],
      searchCoordinates: {},
      message: null
    }
  }
  componentDidMount(){
    let id = this.props.match.params.id
    api.getOnePost(id)
      .then(post=>{
        this.setState({
          title: post.title,
          pictureUrl: post.picture,
          pictureFile: "",
          text: post.text,
          category: post.category,
          lng: post.lng,
          lat: post.lat,
        })
        this.initMap();
      })
  }
  handleChange = (event) => {
    let name = event.target.name
    this.setState({
      [name]: event.target.value
    }, () => {
      if (this.marker && (name === 'lat' || name === 'lng')) {
        this.marker.setLngLat([this.state.lng, this.state.lat])
      }
    })
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
    // let currentSearch = this.state.search 
    // currentSearch = currentSearch.substring(0, currentSearch.length - 1)
    /* currentSearch = '"' + '"' + currentSearch + '"' + '"' */
    // console.log("THIS IS THE ONE WE`RE LOOKING AT!specific coordinates", this.state.searchCoordinates[currentSearch.toString()]);
    //let newCoords = this.state.searchCoordinates[currentSearch.toString()]
    let newCoords = this.state.searchCoordinates[event];
    if (newCoords) {
      this.setState({
        search: event,
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
  handleFileChange=(e)=> {
    e.preventDefault()
     this.setState({
       imageFile: e.target.files[0]
     })
   }

  handleSubmit(e) {
    e.preventDefault()
    let data = {
      title: this.state.title,
      text: this.state.text,
      lng: this.state.lng,
      lat: this.state.lat,
      category: this.state.category,
      picture: this.state.imageFile,
    }
    this.setState({
      pictureURL: "",
      message: "Image loading..."
    })
    let id = this.props.match.params.id
    api.updateOnePost(id, data)
      .then(updated => {
        this.setState({
          pictureURL: data.imageURL,
          message: `Your post has been updated`
        })
        setTimeout(() => {
          this.setState({
            message: null
          })
        }, 2000)
      })
      .catch(err => this.setState({ message: err.toString() }))
  }

  render() {
    return (
      <div>
        <Container className="AddPost">
        <h2>Edit your post</h2>

        <Row>
          <Col md={6}>
            <Form>
              <FormGroup row>
                <Label for="title" xl={3}>Title</Label>
                <Col xl={9}>
                  <Input type="text" value={this.state.title} name="title" onChange={this.handleChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="text" xl={3}>Text</Label>
                <Col xl={9}>
                  <Input type="textarea" value={this.state.text} name="text" cols="30" rows="5" onChange={this.handleChange} />
                </Col>
              </FormGroup>
              <FormGroup row>
              <Label for="category" xl={3}>Category</Label>
                <Col xl={9}>
                  <Input type="select" value={this.state.category} name="category" cols="30" rows="5" onChange={this.handleChange}>
                  <option value="Moment">Moment</option>
                  <option value="Question">Question</option>
                  <option value="Tip">Tip</option>
                  <option value="Warning">Warning</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="pictureURL" xl={3}>Add/Change picture</Label>
                {this.state.pictureUrl!=="" && <img src={this.state.pictureUrl} style={{height: 200}} />}
                <Col xl={9}>
                  <Input type="file" name="pictureUrl" cols="30" rows="5" onChange={this.handleFileChange} />
                </Col>
              </FormGroup>

              
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
                  <Button color="primary" onClick={(e) => this.handleSubmit(e)}>Update it!</Button>
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
