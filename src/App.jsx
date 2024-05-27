import React, { useState } from 'react';
import Map from "./components/Map";
import Filter from "./components/Filter";
import poisData from './pois.json';

const App = () => {
    const [pois, setPois] = useState(poisData);

    const handlleFilterChange = (type,value) => {

        if (type === 'category') {
            if (value === 'ALL') {
              setPois(poisData);
            }
            
        else {
            setPois(poisData.filter(poi => poi.category === value));
        }
    }
        else if (type === 'search') {
            const filteredPois = poisData.filter(poi => 
                poi.name.toLowerCase().includes(value.toLowerCase())
          );
          setPois(filteredPois);
        }
    };

    return (
        <div>
            <Filter onchange={handlleFilterChange}/>
            <Map pois={pois}/>
        </div>
    );
};

export default App;
