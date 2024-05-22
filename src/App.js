import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Main from './views/Main';
import NotFound from './views/NotFound';
import Layout from './components/layout/Layout';
import './css/common.css';
import './fontawesome-pro-6.1.1-web/css/all.min.css';
import '.bootstrap/3.3.2/bootstrap.min.css'

const App = () => {
	return (
		<div className='Router'>
			<BrowserRouter>
				<Routes>
          			<Route path="/login" element={<Login />}></Route>
					<Route path="/" element={<Login />}></Route>
					<Route element={<Layout />}>
						<Route path="/main" element={<Main />}></Route>
					</Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;