import React, { useState } from 'react';
import { Button, ButtonGroup, TextField } from "@mui/material";

const Filter = ({ onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ['ALL', 'Restaurants', 'Parks', 'Hospitals', 'Schools', ];

    const handlleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onChange('search', event.target.value);
    };
    
    return (

        <div>
            <TextField
                label = "Search POIs"
                variant = "outlined"
                value = "{searchTerm}"
                onChange = {handlleSearchChange}
                style = {{ marginBottom: '10px'}}
            />

        <ButtonGroup variant="contained" aria-label="outlined primary button group">
            {categories.map(category => (
                <Button key={category} onclick={() => onChange(category)}>
                    {category}
                </Button>
            ))}
        </ButtonGroup>
        
        </div>
    );
};

export default Filter;
