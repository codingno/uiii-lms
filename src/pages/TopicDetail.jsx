import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { DateRange } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions(topic) {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return topic.topic.length > 0 ? topic.topic.map((item) => {
    return  (
    <div>
      <Accordion expanded={expanded === 'panel' + item.id} onChange={handleChange('panel' + item.id)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{item.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Start Date:</b>
            <br />
            <DateRange /> {item.startDate}
            <br />
            <b>End Date:</b>
            <br />
            <DateRange /> {item.endDate}
            <br />
            <Stack direction="row" spacing={2}>
                <Button variant="contained" disabled={new Date() >= new Date(item.startDate) && new Date() <= new Date(item.endDate)}>Attend</Button>
                {item.activity.length > 0 ?
                item.activity.map(activity =>{
                    return (
                        <Button key={activity.id} variant="contained" href={activity.activity_id == 6 ? activity.attachment : '/' + activity.attachment} target="_blank">{activity.activity_name}</Button> 
                    )
                }) 
                : <></>}
            </Stack>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )}): <div>Topic Not Found</div>;
}
