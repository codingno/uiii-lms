import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import { CircularProgress, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getCourseUser } from '../store/actions/get/getCourseUser';
export default function CourseStudent() {
	const dispatch = useDispatch()
  const [openFilter, setOpenFilter] = useState(false);
  const { courseUserList } = useSelector(state => state)
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });
  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  useEffect(() => {
    async function getCourseUserList(){
      await dispatch(getCourseUser())    
    }
    if(!courseUserList.load)
      return getCourseUserList()
  }, [courseUserList])
  return (
    <Page title="Dashboard: Products | UIII LMS">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Courses
        </Typography>

        {/* <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}
        {!courseUserList.load ? 
            <div style={{ margin: 'auto', marginTop: '15px', display: 'flex', justifyContent: 'center'}}>
							<CircularProgress /> 
						</div> : 
            courseUserList.data.length > 2 ?
            <ProductList products={JSON.parse(courseUserList.data)} /> :
            <div style={{width: '100%', alignContent: 'center'}}>Course Not Found</div>
        }
        {/* <ProductCartWidget /> */}
      </Container>
    </Page>
  );
}
