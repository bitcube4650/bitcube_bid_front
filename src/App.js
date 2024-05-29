import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Main from './views/Main';
import BidProgress from './modules/bid/views/BidProgress';
import BidProgressSave from './modules/bid/views/BidProgressSave';
import BidProgressDetail from './modules/bid/views/BidProgressDetail';
import Notice from './modules/notice/views/Notice';
import NoticeDetail from './modules/notice/views/NoticeDetail';
import NoticeEdit from './modules/notice/views/NoticeEdit';
import NotFound from './views/NotFound';
import Layout from './components/layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/common.css';
import './fontawesome-pro-6.1.1-web/css/all.min.css';
import CustList from './modules/cust/view/CustList';
import CustDetail from './modules/cust/view/CustDetail';
import SaveCust from './modules/cust/view/SaveCust';
import Company from './modules/statistics/views/Company';
import PerformanceDetail from './modules/statistics/views/PerformanceDetail';
import BiddingStatus from './modules/statistics/views/BiddingStatus';
import BiddingDetail from './modules/statistics/views/BiddingDetail';

const App = () => {
	return (
		<div className='Router'>
			<BrowserRouter>
				<Routes>
          			<Route path="/login" element={<Login />}></Route>
					<Route path="/" element={<Login />}></Route>
					<Route element={<Layout />}>
						<Route path="/main" element={<Main />}></Route>
						<Route path="/bid/progress" element={<BidProgress />}></Route>
						<Route path="/bid/progress/save" element={<BidProgressSave />}></Route>
						<Route path="/bid/progress/detail/:biNo" element={<BidProgressDetail />}></Route>
						<Route path="/notice" element={<Notice />}></Route>
						<Route path="/noticeDetail/:bno" element={<NoticeDetail />}></Route>
						<Route path="/noticeEdit" element={<NoticeEdit />}></Route>
						<Route path="/company/partner/approval" element={<CustList />}></Route>
						<Route path="/company/partner/management" element={<CustList />}></Route>
						<Route path="/company/partner/approval/:custCode" element={<CustDetail />}></Route>
						<Route path="/company/partner/management/:custCode" element={<CustDetail />}></Route>
						<Route path="/company/partner/management/save" element={<SaveCust />}></Route>
						<Route path="/company/partner/management/save/:custCode" element={<SaveCust />}></Route>

						<Route path="/statistics/performance/company" element={<Company />}></Route>
						<Route path="/statistics/performance/detail" element={<PerformanceDetail />}></Route>
						<Route path="/statistics/status" element={<BiddingStatus />}></Route>
						<Route path="/statistics/detail" element={<BiddingDetail />}></Route>
					</Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;