'use client';

import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import InventoryTable from './InventoryTable';
import { FreezerContext } from '../../context/FreezerContext';
import { Freezer } from '@/general_types';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
const InventoryCard = ({ freezer }: { freezer: Freezer }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  const { freezers } = useContext(FreezerContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card sx={{ mt: 3, maxWidth: '100%' }} elevation={7}>
        <Box sx={{ p: 2, display: 'flex' }} onClick={handleExpandClick}>
          <Box>
            <KitchenIcon sx={{ pt: 0.7, mr: 1, fontSize: 28 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5">{freezer.name}</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <ExpandMore sx={{ p: 0 }} expand={expanded} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreRoundedIcon sx={{ fontSize: 30 }} />
            </ExpandMore>
          </Box>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ p: 0, pt: 2 }}>
            <InventoryTable key={freezer.id} freezerId={freezer.id} fullscreen={isBelowMd} />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

export default InventoryCard;
