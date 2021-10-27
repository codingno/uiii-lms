import React, { useState, useEffect } from 'react'
import Page from '../../components/Page'
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
  CircularProgress,
} from "@mui/material";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getUserList } from '../../store/actions/get/getUser'

import { useNavigate, useLocation } from 'react-router-dom'

// import './create-user.css'

function FormContainer(props) {
	return (
		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
			<span style={{ width : "35%"}}>
				{props.label}
			</span>
			<FormControl sx={{ width: '65%' }} variant="outlined">
				<OutlinedInput
					value={props.value}
					onChange={e => props.setValue(e.target.value)}
				/>
			</FormControl>
		</Stack>
	)
}

function CreateUser(props) {
	const { state } = useLocation();
  const navigate = useNavigate()
	const dispatch = useDispatch()
	const [userID, setUserID] = useState("")
	const [firstname, setFirstname] = useState("")
	const [lastname, setLastname] = useState("")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [code, setCode] = useState("")
	const [role_id, setRoleID] = useState(7)
	const [roles, setRoles] = useState([])

	const [isLoading, setLoading] = useState(false)
	
	async function getUserInfo() {
		setLoading(true)
		try {
			const user = await axios.get('/api/user/info/'+ (state.username || state.id))	
			const { data } = user.data
			setUserID(data.id)
			setFirstname(data.firstname)
			setLastname(data.lastname)
			setUsername(data.username)
			setEmail(data.email)
			setCode(data.code)
			setRoleID(data.roles.id)
			setLoading(false)
		} catch (error) {
			if(error.response) {
				alert(error.response.data)
				navigate('/dashboard/user')
			}
		}
	}

	useEffect(() => {
		if(props.edit) 
			getUserInfo()

	}, [])

	useEffect(() => {
		if(roles.length == 0)
			getRoles()

		async function getRoles() {
			try {
				const getRolesData = await axios.get('/api/user/roles')
				setRoles(getRolesData.data.data)
			} catch (error) {
				if(error.response) {
					alert(error.response.data)
					// props.setCreateUser(false)
					navigate('/dashboard/user')
				}
			}
		}
			
	}, [roles])

	const createUser = async () => {
		try {
			await axios.put('/api/user/create', {firstname, lastname, username, email, role_id, code})
			await dispatch(getUserList());
			alert(`User created successfully.`)
			// props.setCreateUser(false)
					navigate('/dashboard/user')
		} catch(error) {
			if(error.response) {
				alert(error.response.data)
			}
		}
	}

	const updateUser = async () => {
		try {
			await axios.patch('/api/user/update', { id : userID, firstname, lastname, username, email, role_id, code})
			await dispatch(getUserList());
			alert(`User updated successfully.`)
			// props.setCreateUser(false)
					navigate('/dashboard/user')
		} catch(error) {
			if(error.response) {
				alert(error.response.data)
			}
		}
	}

	const roleList = roles.length === 0 ? '' :
	roles.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)

	return (
    <Page title="Create User | UIII LMS">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {props.edit ? "Edit" : "Create"} User
          </Typography>
        </Stack>

				{
					isLoading ?
					<CircularProgress /> :
        <Card>
					<Stack>
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
						<FormContainer label="First Name" value={firstname} setValue={setFirstname} />
						<FormContainer label="Last Name" value={lastname} setValue={setLastname} />
						<FormContainer label="Username" value={username} setValue={setUsername} />
						<FormContainer label="Email" value={email} setValue={setEmail} />
						<FormContainer label="User Code" value={code} setValue={setCode} />
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
						{
							roles.length > 0 &&
        		<Stack direction="row" alignItems="center" ml={5} mt={2} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
							{/* <label htmlFor="role_id"> */}
								<span style={{ width : "35%"}}>
								Role
								</span>
								<Select
									value={role_id}
									onChange={e => setRoleID(e.target.value)}
									inputProps={{ 'aria-label': 'Without label' }}
								>
									{roleList}
								</Select>
							{/* </label> */}
							</Stack>
						}
        			{/* <Stack direction="row" alignItems="center" ml={19} mt={2} mb={5} > */}
        		<Stack direction="row" alignItems="center" ml={5} mt={2} mb={5} sx={{ width : "60%", display: "flex", justifyContent: "flex-start"}} >
								<span style={{ width : "35%"}}>
								</span>
						<Button
							variant="contained"
							// component={RouterLink}
							// to="#"
							onClick={props.edit ? updateUser : createUser}
							// startIcon={<Icon icon={plusFill} />}
						>
							{props.edit ? "Update" : "Create" }
						</Button>
							</Stack>
					{/* </form> */}
					</Stack>
				</Card>
			}
			</Container>
		</Page>
	)
}

export default CreateUser
