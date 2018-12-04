import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom'
import {
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap'
import PostDetail from './PostDetail'
import api from '../../api';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

class Posts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
    this.mapRef = React.createRef()
    this.map = null
    this.markers = []
  }
  initMap() {
    // Embed the map where "this.mapRef" is defined in the render
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [0, 0], // Africa lng,lat
      zoom: 5
    })

    // Add zoom control on the top right corner
    this.map.addControl(new mapboxgl.NavigationControl())
  }
  handlePostSelection(iSelected) {
    this.map.setCenter(this.state.posts[iSelected].location.coordinates)
  }
  render() {
    return (
      <div className="Posts">
        <Row>
          <Col sm={3} className="col-text">
            <ListGroup>
              {this.state.posts.map((h, i) => (
                <ListGroupItem key={h._id} action tag={NavLink} to={"/posts/" + h._id} onClick={() => this.handlePostSelection(i)}>
                  {h.title} by {h._owner.username}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col sm={4} className="col-text">
            <Switch>
              <Route path="/posts/:id" render={(props) => <PostDetail {...props} posts={this.state.posts} />} />
              <Route render={() => <h2>Select a Post</h2>} />
            </Switch>
          </Col>
          <Col sm={5}>
            <div ref={this.mapRef} className="map"></div>
          </Col>
        </Row>
      </div>
    );
  }
  componentDidMount() {
    api.getPosts()
      .then(posts => {
        console.log(posts)
        posts = [...posts.public, ...posts.anonymous]
        this.setState({
          posts: posts.map(post => {
            const [lng, lat] = post.location.coordinates
            console.log(new mapboxgl.Popup({ offset: 25 })
            .setText(post.title))
            return {
              ...post,
              marker: new mapboxgl.Marker({ color: 'red' })
                .setLngLat([lng, lat])
                .on('click', () => { console.log("clicked") })
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                  .setText(post.title))
                .addTo(this.map)
            }

          })
        })
      })
      .catch(err => console.log(err))
    this.initMap()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let center = [position.coords.longitude,position.coords.latitude]
        this.map.setCenter(center)
      })
    }
  }
}

export default Posts;
