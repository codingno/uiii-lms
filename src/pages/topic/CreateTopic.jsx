import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import {
  Container,
  Stack,
  Typography,
  Button,
	Input,
  Icon,
  Card,
  Select,
  MenuItem,
  FormControl,
  FilledInput,
  OutlinedInput,
	TextField,
	TextareaAutosize,
	FormLabel,
	FormControlLabel,
	FormHelperText,
	RadioGroup,
	Radio,
	CircularProgress,
} from "@mui/material";
import DatePicker from '@mui/lab/DatePicker';
import axios from "axios";
import { useDispatch } from "react-redux";
import { getCategoryList } from '../../store/actions/get/getCategories';

import { useNavigate, useLocation, useParams } from "react-router-dom";

// import './create-user.css'

function FormContainer(props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      ml={5}
      mt={2}
      sx={{ width: "60%", display: "flex", justifyContent: "flex-start" }}
    >
      <span style={{ width: "35%" }}>{props.label}</span>
      <FormControl sx={{ width: "65%" }} variant="outlined">
        <OutlinedInput
					type={props.type}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        />
				{ props.helper && <FormHelperText>{props.helper}</FormHelperText> }
      </FormControl>
    </Stack>
  );
}

function FormParent(props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      ml={5}
      mt={2}
      sx={{ width: "60%", display: "flex", justifyContent: "flex-start" }}
    >
      <span style={{ width: "35%" }}>{props.label}</span>
			{props.children}
    </Stack>
  );
}

function CreateCourse(props) {
  const { state } = useLocation();
  const { course_code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [categoryID, setCategoryID] = useState(null);
  const [courseID, setCourseID] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [shortname, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [image_url, setImageUrl] = useState("");
	const [courseStatus, setCourseStatus] = useState(1)

  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseFormat, setCourseFormat] = useState("single");
  const [courseCategoryName, setCourseCategoryName] = useState("");
  // const [categoryCode, setCategoryCode] = useState(state.category_code);
  const [mainCategories, setMainCategories] = useState([]);
  const [position, setPosition] = useState("");

  const [activity, setActivity] = useState(1);
	const [startDate, setStartDate] = useState(new Date().setDate(new Date().getDate()));
	const [endDate, setEndDate] = useState(new Date().setDate(new Date().getDate() + 1));

  const [numberOfTopics, setNumberOfTopics] = useState(4);
  const [nameOfTopics, setNameOfTopics] = useState("");

	const [isLoading, setLoading] = useState(false)

	async function getUserInfo() {
		setLoading(true)
		try {
			const user = await axios.get("/api/course/info/" + course_code);
			const { data } = user.data;
			setCourseID(data.id);
			setCourseName(data.name);
			setCode(data.code);
			setShortName(data.shortname);
			setDescription(data.description);
			setImageUrl(data.image_url);
			setCourseStatus(data.status);
			setCourseCategory(parseInt(data.category));
			setCourseCategoryName(data.category_name)
			// setCategoryCode(data.category_code)
			setPosition(parseInt(data.position))
			setLoading(false)
		} catch (error) {
			if (error.response) {
				alert(error.response.data.message);
				navigate("/dashboard/courses/admin/list");
			}
		}
	}

  useEffect(() => {
    if (course_code) getUserInfo();
    // if (props.edit) getUserInfo();

  }, []);

  useEffect(() => {
    if (mainCategories.length == 0) getRoles();

    async function getRoles() {
      try {
        const getCategoryData = await axios.get("/api/category");
        const { data } = getCategoryData.data;
				const categorySelected = data.filter(item => item.code === state.sub_category)[0]
				setCourseCategory(categorySelected.id)
				setCourseCategoryName(categorySelected.name)
				// setCategoryCode(categorySelected.code)
        setMainCategories(data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          // props.setCreateUser(false)
      		// navigate("/dashboard/courses/admin/"+state.category_code+"/"+state.sub_category);
        }
      }
    }

  }, [mainCategories]);

	const uploadImage = async () => {
		if(courseImage === "")
			return null
		const formData = new FormData();

		formData.append('course', courseImage);
		formData.append('folder', 'course');
		try {
      const file = await axios.post("/api/image/upload/course", 
				formData)
			return file
		} catch (error) {
			alert(error)	
		}
	}

  const createUser = async () => {
		
    try {
			console.log(courseFormat, numberOfTopics, startDate, endDate, nameOfTopics);
			// const imageFile = await uploadImage()
			const imageFile = null
      await axios.post("/api/course/create", {
				code,
				name,
				shortname,
				description,
				position,
				category : courseCategory,
				status : courseStatus,	
				image_url : imageFile ? imageFile.data : null,
				topics : {
					courseFormat,
					numberOfTopics,
					nameOfTopics,
					startDate,
					endDate
				}
      });
      await dispatch(getCategoryList());
      alert(`Course created successfully.`);
      // props.setCreateUser(false)
      // navigate("/dashboard/courses/admin/sub_category/"+categoryCode);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const updateUser = async () => {
    try {
			const imageFile = await uploadImage()
      await axios.patch("/api/course/update", {
        id: courseID,
				code,
				name,
				shortname,
				description,
				position,
				category : courseCategory,
				status : courseStatus,	
				image_url : imageFile ? imageFile.data : null
      });
      await dispatch(getCategoryList());
      alert(`Course updated successfully.`);
      // props.setCreateUser(false)
      // navigate("/dashboard/courses/sub_category/"+categoryCode);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const mainCategoryList =
    mainCategories.length === 0
      ? ""
      : mainCategories.map((item) => <MenuItem value={item.id}>{item.code}</MenuItem>);
	
	const StackFormat = (props) => {
		return (
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}>{props.title}</span>
							{props.children}
						</Stack>
		)
	}

  return (
    <Page title="Create User | UIII LMS">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {props.edit ? "Edit" : "Create"} Topic {courseName.length > 0 && `of ${courseName}`}
          </Typography>
        </Stack>

				{
					isLoading ?
					<CircularProgress /> :
        <Card>
          <Stack mb={4}>
            {/* <form className="create-user-form" action=""> */}
            {/* <Stack direction="row" alignItems="center" ml={5} mt={5} >
							<span>
								First Name
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={firstname}
									onChange={e => setFirstname(e.target.value)}
								/>
							</FormControl>
						</Stack> */}
            <FormContainer label="Name" value={name} setValue={setName} />
            {/* <FormContainer
              label="Course Code"
              value={code}
              setValue={setCode}
            />
            <FormContainer label="Short Name" value={shortname} setValue={setShortName} />
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}>Description</span> */}
              {/* <TextareaAutosize
                sx={{
                  padding: "5px",
                }}
                aria-label="minimum height"
                minRows={6}
                style={{ width: "65%" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              /> */}
              {/* <textarea 
								name="description"
								cols="25"
								rows="10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
								style={{
                  padding: "14px",
									width: "65%"
								}}
							></textarea> */}
              {/* </label> */}
            {/* </Stack> */}
            {/* <Stack direction="row" alignItems="center" ml={5} mt={2} >
							<span>
								Last Name
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={lastname}
									onChange={e => setLastname(e.target.value)} 
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} >
							<span>
								Username
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={username}
									onChange={e => setUsername(e.target.value)}
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "40%", display: "flex", justifyContent: "space-between"}} >
							<span>
								Email
							</span>
							<FormControl sx={{ width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "40%", display: "flex", justifyContent: "space-between"}} >
							<span>
								User Code
							</span>
							<FormControl sx={{ width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={code}
									onChange={e => setCode(e.target.value)}
								/>
							</FormControl>
						</Stack> */}
            {/* <label htmlFor="firstname">
							<input type="text" name="firstname" value={firstname} onChange={e => setFirstname(e.target.value)} />
						</label>
						<label htmlFor="lastname">
							<span>
							Last Name
							</span>
							<input type="text" name="lastname" 
							value={lastname}
							onChange={e => setLastname(e.target.value)} 
							/>
						</label>
						<label htmlFor="username">
							<span>
							Username
							</span>
							<input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} />
						</label>
						<label htmlFor="email">
							<span>
							Email
							</span>
							<input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
						</label> */}
            {/* <FormContainer label="Position" value={position} setValue={setPosition} type="number" helper="Fill number or blank" /> */}
            {/* {mainCategories.length > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                ml={5}
                mt={2}
                sx={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <span style={{ width: "35%" }}>Course Category</span>
                <Select
									displayEmpty
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  inputProps={{ "aria-label": "Without label" }}
                >
									<MenuItem value={""}>
										<em>None</em>
									</MenuItem>
                  {mainCategoryList}
                </Select>
              </Stack>
            )} */}
						{/* {
							 courseImage ?
						<StackFormat>
							<img style={{ width : '300px'}} src={courseImage && URL.createObjectURL(courseImage)} alt="course" />
						</StackFormat>
						:
						image_url &&
						<StackFormat>
							<img style={{ width : '300px'}} src={'/' + image_url} alt="course" />
						</StackFormat>
						}
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}>Course Image</span>
              <FormControl component="fieldset">
								<label htmlFor="contained-button-file">
								<Input accept="image/*" id="contained-button-file" multiple type="file" 
									sx={{ display : 'none'}}
                  onChange={(e) => e.target.files[0] && setCourseImage(e.target.files[0])}
								/>
								<Button variant="contained" component="span">
									Upload File
								</Button>
							</label>
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}>Status</span>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="gender"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={courseStatus}
                  onChange={(e) => setCourseStatus(parseInt(e.target.value))}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Non Active"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
              <Stack
                direction="row"
                alignItems="center"
                ml={5}
                mt={2}
                sx={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <span style={{ width: "35%" }}>Course Format</span>
                <Select
									displayEmpty
                  value={courseFormat}
                  onChange={(e) => setCourseFormat(e.target.value)}
                  inputProps={{ "aria-label": "Without label" }}
                >
									<MenuItem value={"single"}>
										Single activity format
									</MenuItem>
									<MenuItem value={"topic"}>
										Topics format
									</MenuItem>
									<MenuItem value={"weekly"}>
										Weekly format
									</MenuItem>
                </Select>
              </Stack> */}
							{
								// courseFormat === 'single' &&
								<>
									{/* <FormContainer label="Name of Topics" value={nameOfTopics} setValue={setNameOfTopics} type="text" helper="Fill text or blank"/>
									<FormParent label="Type of activity" >
										<Select
											displayEmpty
											value={activity}
											onChange={(e) => setActivity(e.target.value)}
											inputProps={{ "aria-label": "Without label" }}
										>
											<MenuItem value={1}>
												Assignment
											</MenuItem>
											<MenuItem value={2}>
												Book
											</MenuItem>
											<MenuItem value={3}>
												Zoom Meeting
											</MenuItem>
										</Select>
									</FormParent> */}
									<FormParent label="Topic Start Date" >
											<DatePicker 
												ampm={false}
												// label="With keyboard"
												value={startDate}
												onChange={setStartDate}
												onError={alert}
												disablePast
												inputFormat="dd-MM-yyyy HH:mm"
												renderInput={props => <TextField {...props}  /> }
											/>
									</FormParent>
									<FormParent label="Topic End Date" >
											<DatePicker 
												ampm={false}
												// label="With keyboard"
												value={endDate}
												onChange={setEndDate}
												onError={alert}
												disablePast
												// format="yyyy/MM/dd HH:mm"
												inputFormat="dd-MM-yyyy HH:mm"
												renderInput={props => <TextField {...props}  /> }
											/>
									</FormParent>
								</>
							}
							{/* {
								(courseFormat === 'topic' ||
								courseFormat === 'weekly') &&
            		<FormContainer label="Number of sections" value={numberOfTopics} setValue={setNumberOfTopics} type="number" helper="Fill number" />
							} */}

            {/* <Stack direction="row" alignItems="center" ml={19} mt={2} mb={5} > */}
            <Stack
              direction="row"
              alignItems="center"
              ml={5}
              mt={2}
              mb={5}
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <span style={{ width: "35%" }}></span>
              <Button
                variant="contained"
                // component={RouterLink}
                // to="#"
                onClick={props.edit ? updateUser : createUser}
                // startIcon={<Icon icon={plusFill} />}
              >
                {props.edit ? "Update" : "Create"}
              </Button>
            </Stack>
            {/* </form> */}
          </Stack>
        </Card>
				}
      </Container>
    </Page>
  );
}

export default CreateCourse;
