import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { DateRange } from '@mui/icons-material';
import { Button, Stack, Input } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch()
  const [attachmentFile, setAttachment] = React.useState("");
  const [attachImage, setAttachImage] = React.useState("");
  
	const uploadImage = async (folderTarget, courseImage) => {
		if(courseImage === "")
			return null
		
    const formData = new FormData();

		formData.append('attachment', courseImage);
		formData.append('folder', folderTarget);
		formData.append('folderTarget', folderTarget);
		try {
      const file = await axios.post("/api/file/upload", 
				formData)
			return file
		} catch (error) {
			alert(error)	
		}
	}
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return topic.topic.length > 0 ? topic.topic.map((item) => {
    return  (
    <div key={topic.id}>
      <Accordion expanded={expanded === 'panel' + item.id} onChange={handleChange('panel' + item.id)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{item.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Start Date:</b>
            <br />
            <DateRange /> {item.startDateString}
            <br />
            <b>End Date:</b>
            <br />
            <DateRange /> {item.endDateString}
            <br />
            {item.attendAt ? (
              <>
              <b>Attend Date:</b>
              <br />
              <DateRange /> {item.attendAtString} {item.attendDescription ? (item.attendDescription) : null}
              <br />
              </>
            ):<></>}
            <Stack direction="row" spacing={2}>
                <Button key={item.id} variant="contained" 
                  onClick={async () => {
                    try {
                      await axios.post('/api/attend/create', {topic_id: item.id, course_id: item.course_id})
                      dispatch({type: 'reset_getTopicCourse'})
                      return alert("Success Attend")
                    } catch (error) {
                      return alert(error)
                    }
                  }
                } 
                  disabled={(new Date() <= item.startDate || new Date() >= item.endDate) || item.attendAt}
                >
                    Attend
                </Button>
                <>
                {item.activity.length > 0 ?
                item.activity.map(activity =>{
                    return (
                      <>
                        <Button key={activity.id} variant="contained" href={activity.activity_id === 6 ? activity.attachment : '/' + activity.attachment} target="_blank">{activity.activity_name}</Button> 
                      </>
                    )
                }) 
                : <></>}
                </>
            </Stack>
            <Stack direction="row" spacing={2} sx={{mt: '5px'}} >
                {item.activity.findIndex(activity => {
                  return activity.activity_id === 1
                }) >= 0 && (
                  <>
									<label htmlFor="contained-button-file">
										<Input id="contained-button-file" multiple type="file" 
											sx={{ display : 'none'}}
											// onChange={(e) => e.target.files[0] && setCourseImage(e.target.files[0])}
											onChange={async (e) => {
                        try {
                          let file = null
                          if(e.target.files[0]) {
                            file = e.target.files[0]	
                            setAttachment(file.name)
                            // setAttachImage(file)
                          }
                          const imageFile = await uploadImage('Assignment_student', file)
                          let attachmentData = imageFile.data
                          const index = item.activity.findIndex(activity => {
                            return activity.activity_id === 1
                          })
                          if(item.activity[index].attachment_user === ""){
                            await axios.post("/api/activityStudent/create", {
                              topic_activity_id: item.activity[index].id,
                              attachment : attachmentData,
                            });
                            // setAttachImage(attachmentData)
                            dispatch({type:'reset_getTopicCourse'})                   
                          }
                          else {
                            await axios.post("/api/activityStudent/update", {
                              topic_activity_id: item.activity[index].id,
                              attachment : attachmentData,
                            });                    
                            setAttachImage(attachmentData)                   
                            dispatch({type:'reset_getTopicCourse'})                   
                          }
                        } catch (error) {
                          
                        }
                      }}
										/>
										<Button variant="contained" component="span">
											Upload Assignment
										</Button>
									</label>
                  {
                      item.activity[item.activity.findIndex(activity => {
                        return activity.activity_id === 1
                      })].attachment_user &&
                      <Button key={item.id} variant="contained" href={'/'+item.activity[item.activity.findIndex(activity => {
                        return activity.activity_id === 1
                      })].attachment_user} target="_blank">Show My Assignment</Button> 
                  }
                  {
                  }
                  </>
                )}
                {item.activity.findIndex(activity => {
                  return activity.activity_id === 3
                }) >= 0 && (
                  <Button variant="contained" >Upload Quiz</Button>
                )}

            </Stack>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )}): <div>Topic Not Found</div>;
}
