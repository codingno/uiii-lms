import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs() {
	const navigate = useNavigate()
	const location = useLocation()
  const dispatch = useDispatch()
	const [breadLink, setBreadLink] = useState([])
	const { refresh } = useSelector(state => state)

	async function getCategoryData() {
		const getCategoryData = await axios.get("/api/category");
		const { data } = getCategoryData.data;

		let url = "/"
		const makebreadLink = location.pathname.split('/')
			.filter(item => item !== "")
			.map(item => {
				url += item + "/"
				const category_name = data.filter(x => x.code === item)
				return (
					// <Link underline="hover" color="inherit" onClick={() => navigate(url)}>
					<Link underline="hover" color="inherit" to={url} onClick={() => 
						dispatch({ type : 'refresh_start'})
					}>
						{category_name.length > 0 ? category_name[0].name : item}
					</Link>
				)
			})
		setBreadLink(makebreadLink)
	}

	useEffect(() => {
		if(refresh)
			getCategoryData()	
	}, [refresh])
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
				{breadLink}
        {/* <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/getting-started/installation/"
        >
          Core
        </Link> */}
      </Breadcrumbs>
    </div>
  );
}
