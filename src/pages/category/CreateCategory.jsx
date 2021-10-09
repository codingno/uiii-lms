import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import {
  Container,
  Stack,
  Typography,
  Button,
  Icon,
  Card,
  Select,
  MenuItem,
  FormControl,
  FilledInput,
  OutlinedInput,
	TextareaAutosize,
	FormLabel,
	FormControlLabel,
	FormHelperText,
	RadioGroup,
	Radio,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getCategoryList } from '../../store/actions/get/getCategories';

import { useNavigate, useLocation } from "react-router-dom";

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

function CreateCategory(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [userID, setUserID] = useState(null);
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [code, setCode] = useState("");
  // const [role_id, setRoleID] = useState(7);
  // const [roles, setRoles] = useState([]);

  const [categoryID, setCategoryID] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
	const [categoryStatus, setCategoryStatus] = useState(1)

  const [subCategory, setSubCategory] = useState(0);
  const [mainCategories, setMainCategories] = useState([]);
  const [parent, setParent] = useState("");
  const [position, setPosition] = useState("");

	const [isLoading, setLoading] = useState(props.edit)

  useEffect(() => {
    if (props.edit) getUserInfo();

    async function getUserInfo() {
      try {
        const user = await axios.get("/api/category/info/" + state.code);
        const { data } = user.data;
        setCategoryID(data.id);
        setName(data.name);
        setCode(data.code);
        setDescription(data.description);
        setCategoryStatus(data.status);
        setParent(data.parent || "");
				setPosition(parseInt(data.position))
        setSubCategory(data.parent ? 1 : 0);
				setLoading(false)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          navigate("/dashboard/courses/category");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (mainCategories.length == 0) getRoles();

    async function getRoles() {
      try {
        const getCategoryData = await axios.get("/api/category");
        const { data } = getCategoryData.data;
				const filterdData = data.filter(item => item.code != code)
        setMainCategories(filterdData);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          // props.setCreateUser(false)
          navigate("/dashboard/courses/category");
        }
      }
    }

  }, [mainCategories]);

	useEffect(() => {
		const isParent = mainCategories.filter(item => item.code === code)
		if(isParent.length > 0)
			setMainCategories(mainCategories.filter(item => item.code !== code ))
	}, [code])

  const createUser = async () => {
		
    try {
      await axios.post("/api/category/create", {
				name,
				code,
				description,
				parent,
				status : categoryStatus,	
      });
      await dispatch(getCategoryList());
      alert(`User created successfully.`);
      // props.setCreateUser(false)
      navigate("/dashboard/courses/category");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const updateUser = async () => {
    try {
      await axios.patch("/api/category/update", {
        id: categoryID,
				name,
				code,
				description,
				parent,
				status : categoryStatus,	
      });
      await dispatch(getCategoryList());
      alert(`User updated successfully.`);
      // props.setCreateUser(false)
      navigate("/dashboard/courses/category");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const mainCategoryList =
    mainCategories.length === 0
      ? ""
      : mainCategories.map((item) => <MenuItem value={item.code}>{item.code}</MenuItem>);

  return (
    <Page title="Create User | Minimal-UI">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {props.edit ? "Edit" : "Create"} Category
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
            <FormContainer
              label="Category Code"
              value={code}
              setValue={setCode}
            />
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
              <span style={{ width: "35%" }}>Description</span>
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
              <textarea 
								name="description"
								cols="25"
								rows="10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
								style={{
                  padding: "14px",
									width: "65%"
								}}
							></textarea>
              {/* </label> */}
            </Stack>
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
            <FormContainer label="Position" value={position} setValue={setPosition} type="number" helper="Fill number or blank" />
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
              <span style={{ width: "35%" }}>Sub Category?</span>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="subcategories"
                  name="radio-buttons-group"
                  value={subCategory}
                  onChange={(e) => setSubCategory(parseInt(e.target.value))}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
						{
							subCategory > 0 &&
							<>
            {mainCategories.length > 0 && (
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
                <span style={{ width: "35%" }}>Parent</span>
                <Select
									displayEmpty
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  inputProps={{ "aria-label": "Without label" }}
                >
									<MenuItem value={""}>
										<em>None</em>
									</MenuItem>
                  {mainCategoryList}
                </Select>
              </Stack>
            )}
							</> 
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
              <span style={{ width: "35%" }}>Status</span>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="gender"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={categoryStatus}
                  onChange={(e) => setCategoryStatus(parseInt(e.target.value))}
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

export default CreateCategory;
