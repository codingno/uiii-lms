// react
import { useState, useEffect } from 'react';
// routes
import Router from './routes';
import { useNavigate } from 'react-router-dom';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// data
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function App() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const { user } = useSelector(state => state)

	useEffect(() => {
		async function getUserInfoMethod() {
			try {
				const getUserInfo = await axios.get('/api/auth/info')
				if(getUserInfo.data)	{
					localStorage.setItem('getUserInfo', JSON.stringify(getUserInfo.data));
					dispatch({ type : 'getUserInfo', data : getUserInfo.data })
					navigate('/')
				}
				else {
					localStorage.removeItem("getUserInfo")
					localStorage.clear()
					dispatch({type : 'logout'})
					navigate('/login')
				}
				setLoading(false)
			} catch(err) {
				alert(err)
			}
		}
		getUserInfoMethod()
	}, [])

	if(loading)
		return ""

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
}
