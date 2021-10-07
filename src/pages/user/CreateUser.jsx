import React, { useState, useEffect } from 'react'
import Page from '../../components/Page'
import { Container, Stack, Typography, Button, Icon, Card, Select, MenuItem, FormControl, FilledInput, OutlinedInput } from '@mui/material'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getUserList } from '../../store/actions/get/getUser'

// import './create-user.css'

function CreateUser(props) {
	const dispatch = useDispatch()
	const [firstname, setFirstname] = useState("")
	const [lastname, setLastname] = useState("")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [role_id, setRoleID] = useState(7)
	const [roles, setRoles] = useState([])

	useEffect(() => {
		if(roles.length == 0)
			getRoles()

		async function getRoles() {
			try {
				const getRolesData = await axios.get('/api/user/roles')
				setRoles(getRolesData.data.data)
			} catch (error) {
				alert(error)	
			}
		}
			
	}, [roles])

	const createUser = async () => {
		try {
			const user = await axios.put('/api/user/create', {firstname, lastname, username, email, role_id})
			await dispatch(getUserList());
			props.setCreateUser(false)
		} catch(err) {
			alert(err)
		}
	}

	const roleList = roles.length === 0 ? '' :
	roles.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)

	return (
    <Page title="Create User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create User
          </Typography>
        </Stack>

        <Card>
					<Stack>
					{/* <form className="create-user-form" action=""> */}
        		<Stack direction="row" alignItems="center" ml={5} mt={5} >
							<span>
								First Name
							</span>
							<FormControl sx={{ ml: 5, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={firstname}
									onChange={e => setFirstname(e.target.value)}
								/>
							</FormControl>
						</Stack>
        		<Stack direction="row" alignItems="center" ml={5} mt={2} >
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
        		<Stack direction="row" alignItems="center" ml={5} mt={2} >
							<span>
								Email
							</span>
							<FormControl sx={{ ml: 9, width: '25ch' }} variant="outlined">
								<OutlinedInput
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</FormControl>
						</Stack>
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
        			<Stack direction="row" alignItems="center" ml={5} mt={2} >
							{/* <label htmlFor="role_id"> */}
								<span>
								Role
								</span>
								<Select
									sx={{ ml: 10 }}
									value={role_id}
									onChange={e => setRoleID(e.target.value)}
									inputProps={{ 'aria-label': 'Without label' }}
								>
									{roleList}
								</Select>
							{/* </label> */}
							</Stack>
						}
        			<Stack direction="row" alignItems="center" ml={19} mt={2} mb={5} >
						<Button
							variant="contained"
							// component={RouterLink}
							// to="#"
							onClick={createUser}
							// startIcon={<Icon icon={plusFill} />}
						>
							Create
						</Button>
							</Stack>
					{/* </form> */}
					</Stack>
				</Card>
			</Container>
		</Page>
	)
}

export default CreateUser
