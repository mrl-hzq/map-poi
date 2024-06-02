import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import Map from "./components/Map";
import Filter from "./components/Filter";
import poisData from "./pois.json";

// API KEY
// fsq3WfBxMJTyKoZq+7C6PeBF1Ba1h/a9257vEE5D1mA4GfM=

// Initial state for Reducer
const initialState = {
    pois: [],
    filteredPois: []
};

// Reducer 
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_POIS':
            return {
                ...state,
                pois: action.payload,
                filteredPois: action.payload
            };
        case 'FILTER_BY_CATEGORY':
            return {
                ...state,
                filteredPois: action.payload === 'ALL'
                ? state.pois
                : state.pois.filter(poi => poi.category === action.payload)
            }; 
        case 'FILTER_BY_SEARCH':
            return {
                ...state,
                filteredPois: state.pois.filter(poi =>
                poi.name.toLowerCase().includes(action.payload.toLowercase())) 
            };
    default:
        return state;
    }
};

const App = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    
    const fetchPOIs = async () => {
  try {
    const response = await axios.get('https://api.foursquare.com/v2/venues/explore', {
      params: {
        ll: '3.1390,101.6869', // Kuala Lumpur coordinates
        client_id: 'UPEEYDNEADCWE5XXKPTQWNDPVVYIDSPUXPNGHEONZAT0IYEI', // Foursquare Client ID
        client_secret: 'WKS0DNZA2YEG0GFAFJ0I2IAAABQXYV0EWVBNZ0NM3B05U4TF', // Foursquare Client Secret
        v: '20230423', // Foursquare API version
        limit: 50, // Limit number of results
      },
    });

    
    const data = response.data.elements.map(place => ({
        id: place.id,
        name: place.tags.name || 'Unnamed',
        category: place.tags.amenity,
        coordinates: [place.lat, place.lon]
    }));

    dispatch({ type: 'SET_POIS', payload: data});
    } catch (error) {
        console.error('Error fetching POIs', error);
    }
    };

    useEffect(() => {
        fetchPOIs();
    },[]);

    const handlleFilterChange = (type,value) => {

        if (type === 'category') {
            dispatch ({ type: 'FILTER_BY_CATEGORY', payload: value});
        }
            else if (type === 'search') {
                dispatch ({ type: 'FILTER_BY_SEARCH', payload: value});
            }
        };

    return (
        <div>
            <Filter onchange={handlleFilterChange}/>
            <Map pois={state.filteredPois}/>
        </div>
    );
};

export default App;
