import React, { useReducer, useEffect } from 'react';
import Map from "./components/Map";
import Filter from "./components/Filter";
import poisData from './pois.json';

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
    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: {
        data: `
          [out:json];
          node
            ["amenity"]
            (3.1390,101.6869,3.1490,101.6969);
          out body;
        `,
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
