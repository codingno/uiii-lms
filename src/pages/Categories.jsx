import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useState, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { CategoryListHead, CategoryListToolbar, CategoryMoreMenu } from '../components/_dashboard/category';

import CreateUser from './user/CreateUser';
//
import { getCategoryList } from '../store/actions/get/getCategories';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'code', label: 'Category Code', alignRight: false },
  { id: 'position', label: 'Position', alignRight: false },
  { id: 'parent', label: 'Parent', alignRight: false },
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

export default function Categories(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const {categoryList}= useSelector((state) => state);
  const {refresh}= useSelector((state) => state);
  const [categoryList, setCategoryList] = useState([]);

	const [isLoading, setLoading] = useState(false)

	// const category_code = props.match ? props.match.params ? props.match.params.category_code : null : null;
	const { category_code } = useParams()

	async function getDataCategoryList(){
			setLoading(true)
			try {
				// await dispatch(getCategoryList());
				let url = '/api/category'
				if(props.main_category)
					url += '/main_category'
				if(category_code)
					url += `/${category_code}`
				const getCategories = await axios.get(url)
				setCategoryList(getCategories.data.data)
				setLoading(false)
				dispatch({type : 'refresh_done'})
			} catch(error) {

			}
	}
  useEffect(() => {
		// if (categoryList.length == 0 || category_code)
		if(refresh)
			getDataCategoryList()
  }, [refresh]);

  useEffect(() => {
		// if (categoryList.length == 0 || category_code)
		if(category_code)
			dispatch({ type : 'refresh_start'})
  }, [category_code]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelecteds = JSON.parse(categoryList.data).map((n) => n.code);
      const newSelecteds = categoryList.map((n) => n.code);
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

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - JSON.parse(categoryList.data).length) : 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryList.length) : 0;

  const filteredUsers = categoryList ? applySortFilter(categoryList.length > 0 ? categoryList : [], getComparator(order, orderBy), filterName) : [];

  const isUserNotFound = filteredUsers.length === 0;

  // return categoryList.data && ( 
  return ( 
    <Page title="Categories | UIII LMS">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            { !props.main_category ? 'Category Management' : !category_code ? 'Category' : 'Sub Category' }
          </Typography>
					{
						!props.main_category &&
          <Button
            variant="contained"
            // component={RouterLink}
            // to="#"
						// onClick={() => setCreateUser(true)}
						onClick={() => {
							navigate('/dashboard/courses/category/create')
						}}
            startIcon={<Icon icon={plusFill} />}
          >
            New Category
          </Button>
					}
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
                  rowCount={categoryList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, code, position, parent } = row;
                      const isItemSelected = selected.indexOf(code) !== -1;

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
                              onChange={(event) => handleClick(event, code)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none"
														onClick={() => {
															if(!category_code)
																navigate(`/dashboard/courses/main_category/${code}`)
															if(category_code)
																navigate(`/dashboard/courses/sub_category/${code}`)
														}} sx={{ cursor : 'pointer'}}
													>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
																{name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="left">{position || "None"}</TableCell>
                          <TableCell align="left">{parent || "None"}</TableCell>
                          <TableCell align="right">
                            <CategoryMoreMenu code={code} />
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
            count={categoryList.data ? JSON.parse(categoryList.data).length : 0}
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
