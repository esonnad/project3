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
import * as turf from '@turf/turf';


import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

class Private extends Component {
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
      center: [13.3715472, 52.5055177], // Africa lng,lat
      zoom: 15
    })

    // Add zoom control on the top right corner
    this.map.addControl(new mapboxgl.NavigationControl())
  }
  handlePostSelection(iSelected) {
    this.map.setCenter(this.state.posts[iSelected].location.coordinates)
  }

  handleCardClick(post)  {
    this.map.setCenter(post.location.coordinates)
    post.marker.togglePopup();
    setTimeout(() => {
      post.marker.togglePopup();
    }, 7000)
  }
  render() {
    return (
      <React.Fragment>

      <h1 className="page-title">My Spots</h1>
      

      <div  ref={this.mapRef} ></div>
      <div class="card-container">
        {this.state.posts.map(post=>
          <div class="card" key={post.title} onClick={()=>this.handleCardClick(post)}>
          <p class="card-title">{post.title}</p>
          </div>
        )}
      </div>
      </React.Fragment>
   
    );
  }
  componentDidMount() {
    api.getMyPosts()
      .then(posts => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            let userLocation = [position.coords.longitude, position.coords.latitude];
            for (let i = 0; i < posts.length; i++) {
              let currentPost = posts[i];
              let from = turf.point(userLocation);
              let to = turf.point(currentPost.location.coordinates)
              let distance = turf.distance(from, to)
              currentPost.distance = distance;
            }
            posts = posts.sort((a,b) => a.distance - b.distance);
            console.log("updated posts", posts)
            
            this.setState({
              posts: posts.map(post => {
              const [lng, lat] = post.location.coordinates
              return {
                ...post,
                marker: new mapboxgl.Marker({ color: 'blue' })
              
                  .setLngLat([lng, lat])
                  .setPopup(new mapboxgl.Popup({ offset: -30, anchor: "center" })
                    .setHTML(`<div class="post-card"><img  src=${post.picture} height="180px" alt=""><h4>${post.title}</h4> <p>${post.text}</p><h6>A ${post.category}</h6><h6> posted ${post.privacy}</h6><a href="https://ironpinpoint.herokuapp.com/posts/${post._id}">Edit</a><div>`))
                  .addTo(this.map)
                }
              })
            })
          })
        } 
        
        else {
          this.setState({
            posts: posts.map(post => {
            const [lng, lat] = post.location.coordinates
            return {
              ...post,
              marker: new mapboxgl.Marker({ color: 'blue' })
            
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup({ offset: -30, anchor: "center" })
                  .setHTML(`<div class="post-card"><img  src=${post.picture} height="180px" alt=""><h4>${post.title}</h4> <p>${post.text}</p><h6>A ${post.category}</h6><h6> posted ${post.privacy}</h6><a href="https://ironpinpoint.herokuapp.com/posts/${post._id}">Edit</a><div>`))
                .addTo(this.map)
              }
            })
          })
        }

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

export default Private;

