import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import Map from "./components/Map";
import Filter from "./components/Filter";
5r
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
            const response = await axios.get('https://api.foursquare.com/v3/places/search', {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`
              },
              params: {
                ll: '3.1390,101.6869', // Kuala Lumpur coordinates
                limit: 50, // Limit number of results
              },
            });
    
    const data = response.data.results.map(place => ({
        id: place.fsq_id,
        name: place.name || 'Unnamed',
        category: place.categories && place.categories.length > 0 ? place.categories[0].name : 'Uncategorized',
        coordinates: [place.geocodes.main.latitude, place.geocodes.main.longitude],
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

