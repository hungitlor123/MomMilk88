import React from 'react';
import { Slider, Box, Typography } from '@mui/material';

interface SortPriceProps {
    value: number[];
    onChange: (value: number[]) => void;
}

const SortPrice: React.FC<SortPriceProps> = ({ value, onChange }) => {
    const handleChange = (_event: Event, newValue: number | number[]) => {
        onChange(newValue as number[]);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <Box sx={{ width: '100%', marginLeft: '1rem' }}>
            <Slider
                value={value}
                onChange={handleChange}
                min={100000}
                max={1500000}
                step={10000}
                sx={{
                    color: 'blue',
                    '& .MuiSlider-thumb': {
                        borderRadius: '50%',
                        border: '2px solid blue',
                        width: 16,
                        height: 16,
                    },
                    '& .MuiSlider-track': {
                        height: 4,
                        borderRadius: 2,
                    },
                    '& .MuiSlider-rail': {
                        height: 4,
                        borderRadius: 2,
                        color: 'lightgray',
                    },
                }}
                valueLabelFormat={(value) => formatCurrency(value)}
            />
            <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">{formatCurrency(value[0])}</Typography>
                <Typography variant="body2">{formatCurrency(value[1])}</Typography>
            </Box>
        </Box>
    );
};

export default SortPrice;
