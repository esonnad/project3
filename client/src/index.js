import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css' // Import of Mapbox CSS
import './styles/index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
 
mapboxgl.accessToken = 'pk.eyJ1IjoiZXNvbm5hZCIsImEiOiJjam96eXM0ZGYwMTAwM3ZtdHBiYTZnMnA1In0.bd13D4f1GjPT6iwSU45lTA';




ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
