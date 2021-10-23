import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
	CircularProgress,
	Select,
	MenuItem,
	Autocomplete,
	TextField
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { CategoryListHead, CategoryListToolbar, CategoryMoreMenu } from '../components/_dashboard/enrollment';

// import CreateUser from './user/CreateUser';
import BreadCrumb from '../components/Breadcrumb'
//
import { getCourseList } from '../store/actions/get/getCourses';
import { getUserList } from '../store/actions/get/getUser';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  // { id: 'shortname', label: 'Short Name', alignRight: false },
  // { id: 'code', label: 'Course Code', alignRight: false },
  // { id: 'category', label: 'Category', alignRight: false },
  // { id: 'position', label: 'Position', alignRight: false },
  // { id: 'startDate', label: 'Start Date', alignRight: false },
  // { id: 'endDate', label: 'End Date', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: true },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Enrollment(props) {
	const {category_code, sub_category, course_code} = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {courseList, refresh}= useSelector((state) => state);
  const [topicList, setTopicList] = useState([]);

  const {userList}= useSelector((state) => state);
	const [courseData, setCourseData] = useState(null)

	const [enroll, setEnroll] = useState("")
	const [searchEnroll, setSearchEnroll] = useState("")

	const [isLoading, setLoading] = useState(false)


	async function getDataUserList(){
			setLoading(true)
			try {
				await dispatch(getUserList());
				setLoading(false)
			} catch(error) {
				
			}
	}

  useEffect(() => {
		if (!userList.load) 
    	getDataUserList();
  }, [userList]);

	async function getDataCategoryList(){
			setLoading(true)
			try {
				await dispatch(getCourseList(null, {category_code : sub_category}));
				setLoading(false)
				dispatch({type : 'refresh_done'})
			} catch(error) {

			}
	}

	async function getTopicList() {
		try {
			const { data } = await axios.get('/api/enrollment/course/' + course_code)	
			setTopicList(data.data)
				dispatch({type : 'refresh_done'})
		} catch (error) {
			alert(error)	
		}
	}

	async function getCourseData() {
		try {
			const { data } = await axios.get('/api/course/info/' + course_code)
			const course = data.data
			setCourseData(course)
				dispatch({type : 'refresh_done'})
		} catch(error) {
			alert(error)	
		}
	}

  useEffect(() => {
		if (refresh) {
			getTopicList()
			getCourseData()
  	  getDataCategoryList();
		}
  }, [refresh]);

  useEffect(() => {
		if (sub_category) {
			dispatch({type : 'refresh_start'})
		}
  }, [sub_category]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = JSON.parse(courseList.data).map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - topicList.length) : 0;

  const filteredUsers = topicList ? applySortFilter(topicList.length > 0 ? topicList : [], getComparator(order, orderBy), filterName) : [];

  const isUserNotFound = filteredUsers.length === 0;

	// const users = userList.data.length === 0 ? '' : JSON.parse(userList.data).map(item => {
	// 	return (
	// 		<MenuItem value={item.id}>
	// 			{item.firstname} {item.lastname}
	// 		</MenuItem>
	// 	)
	// })
	const users = userList.data.length === 0 ? '' : JSON.parse(userList.data).map(item => {
		item.label = item.firstname + ' ' + item.lastname
		return item
	})

  // return categoryList.data && ( 
  return ( 
    <Page title="Enrollment | UIII LMS">
      <Container>
				{/* <Stack sx={{ marginBottom: '3em'}}>
					<BreadCrumb />
				</Stack> */}
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            Enrollment { state ? 'of ' + state.course_name : ''}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
					{/* {
						users.length > 0 &&
						<Select
							sx={{
								marginLeft : 'auto',
								marginRight : '20px',
							}}
							displayEmpty
							value={enroll}
							onChange={(e) => setEnroll(e.target.value)}
							inputProps={{ "aria-label": "Without label" }}
						>
							<MenuItem value={""}>
								<em>None</em>
							</MenuItem>
							{users}
						</Select>
					} */}
					<Autocomplete
						value={enroll}
						onChange={(event, newValue) => {
							setEnroll(newValue);
						}}
						inputValue={searchEnroll}
						onInputChange={(event, newInputValue) => {
							setSearchEnroll(newInputValue);
						}}
						id="controllable-states-demo"
						options={users}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Enroll user" />}
					/>
          <Button
						sx={{
							marginLeft : '30px'
						}}
            variant="contained"
            // component={RouterLink}
            // to="#"
						// onClick={() => setCreateUser(true)}
						onClick={async () => {
							// navigate(`/dashboard/courses/admin/${category_code}/${sub_category}/${course_code}/topic/create`, {state:{category_code, sub_category, course_code }})
							try {
								await axios.post('/api/enrollment/create', {
									course_id : courseData.id,
									user_id : enroll.id,
								})
								dispatch({type : 'refresh_start'})
							} catch(error) {
								alert(error)
							}
						}}
            startIcon={<Icon icon={plusFill} />}
          >
            Add user
          </Button>
        </Stack>

        <Card>
          <CategoryListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
						refresh={getDataCategoryList}
          />

          <Scrollbar>
					{
						isLoading ?
						<div style={{ margin: 'auto', display: 'flex', justifyContent: 'center'}}>
							<CircularProgress /> 
						</div> :
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={topicList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, role } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap
																onClick={() => {
																	dispatch({type : 'refresh_start'})
																	navigate(`/dashboard/courses/admin/${category_code}/${sub_category}/${course_code}/topic/${id}`, { state: { topic_id : id }})
																}}
																sx={{
																	cursor : 'pointer'
																}}
															>
																{name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{role}</TableCell>
                          {/* <TableCell align="left">{ startDate && new Date(startDate).toDateString() + ", " + new Date(startDate).toLocaleTimeString()}</TableCell> */}
                          {/* <TableCell align="left">{ startDate}</TableCell>
                          <TableCell align="left">{ endDate}</TableCell> */}
                          {/* <TableCell align="left">{ endDate && new Date(endDate).toDateString() + ", " + new Date(endDate).toLocaleTimeString()}</TableCell> */}
                          {/* <TableCell align="left">{category_code}</TableCell>
                          <TableCell align="left">{position || "None"}</TableCell>
                          <TableCell align="left">
														{
															image_url.length > 0 &&
															<img src={window.location.origin + '/' + image_url} width={100} />
														}
													</TableCell> */}
                          {/* <TableCell align="right">{id || "None"}</TableCell> */}
                          <TableCell align="right">
                            <CategoryMoreMenu code={id} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
					}
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courseList.data ? JSON.parse(courseList.data).length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
