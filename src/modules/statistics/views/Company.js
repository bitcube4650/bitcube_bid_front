import React, { useCallback, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import * as CommonUtils from 'components/CommonUtils';
import CoInterSelect from '../components/CoInterSelect'
import DatePicker from '../components/DatePicker'
import axios from 'axios';
import Swal from 'sweetalert2';

const Company = () => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	console.log(loginInfo);
	const [srcData, setSrcData] = useState({
		size : 10,
		page : 0,
		startDay : CommonUtils.strDateAddDay(CommonUtils.getCurretDate(), -30),
		endDay : CommonUtils.getCurretDate(),
		coInters : []
	})

	const [list, setList] = useState([])
	const [listSize, setListSize] = useState(0)
	const [listSum, setListSum] = useState({})

	const onChangeSrcData = (e) => {
		setSrcData({
			...srcData,
			[e.target.name]: e.target.value
		});
	}


	const onExceldown = () => {
		let time = CommonUtils.formatDate(new Date(), "yyyy_mm_dd");

        let params = {
            startDay:  srcData.startDay,
        	endDay: srcData.endDay,
			fileName: "회사별 입찰실적_" + time,
        	coInters: srcData.coInters
        }
		
		axios.post("/api/v1/excel/statistics/biInfoList/downLoad",
				params,
				{responseType: "blob"}).then((response) => {
					if (response.status === 200) {
						// 응답이 성공적으로 도착한 경우
						const url = window.URL.createObjectURL(new Blob([response.data])); // 응답 데이터를 Blob 형식으로 변환하여 URL을 생성합니다.
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", params.fileName + ".xlsx"); // 다운로드할 파일명을 설정합니다.
						document.body.appendChild(link);
						link.click();
						window.URL.revokeObjectURL(url); // 임시 URL을 해제합니다.
					} else {
						// 오류 처리
						Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
					}
				}
		)
	}

	const onSearch = useCallback(async() => {
		let response = await axios.post('/api/v1/statistics/biInfoList', srcData)
		let result = response.data.data;
		if(response.data.code === 'OK') {
			setListSize(result.length - 1 < 0 ? 0 : result.length - 1)
			setList(result.slice(0, result.length - 1))
			setListSum(result[result.length - 1])
		}
	})
	
	useEffect(() => {
	  onSearch()
	}, [srcData])
	

	return (
		<div className="conRight">
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>통계</li>
					<li>회사별 입찰실적</li>
				</ul>
			</div>
			<div className="contents">
				<div className="conTopBox">
					<ul className="dList">
						<li>
							<div>조회기간 입찰완료일 기준으로 각 계열사의 입찰 실적을 나타냅니다.</div>
						</li>
						<li>
							<div>통계 실적 Data는 사용권한이 시스템 관리자 일 경우 모든 계열사, 감사사용자일 경우 선택된 계열사를 대상으로 합니다.(감사사용자 계열사 선택은 시스템 관리자가 관리합니다.)</div>
						</li>
					</ul>
				</div>
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit width100px">입찰완료일</div>
						<div className="flex align-items-center" style={{width : '320px'}}>
							<DatePicker srcData={srcData} setSrcData={setSrcData}/>
						</div>
						<div className="sbTit width80px ml50">계열사</div>
						<div className="flex align-items-center width280px">
							<CoInterSelect srcData={srcData} setSrcData={setSrcData} />
						</div>
						<button className="btnStyle btnSearch" onClick={onSearch}>검색</button>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>{listSize}</strong></span>건
					</div>
					<div className="flex-shrink0">
						<button title="엑셀 다운로드" className="btnStyle btnPrimary" onClick={onExceldown}>엑셀 다운로드<i className="fa-light fa-arrow-down-to-line ml10"></i></button>
					</div>
				</div>
				<table className="tblSkin1 mt10">
					<colgroup>
						<col />
						<col style={{width : '10%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '10%'}} />
					</colgroup>
					<thead>
						<tr>
							<th>회사명</th>
							<th>입찰건수</th>
							<th>예산금액(1)</th>
							<th>낙찰금액(2)</th>
							<th>차이(1)-(2)</th>
							<th className="end">비고</th>
						</tr>
					</thead>
					{listSize > 0
					?
					<>
						<tbody>
							{list.map((obj,idx) => (
								<tr key={idx}>
									<td className="text-left">{obj.interrelatedNm}</td>
									<td className="text-right">{obj.cnt.toLocaleString()}</td>
									<td className="text-right">{obj.bdAmt.toLocaleString()}</td>
									<td className="text-right">{obj.succAmt.toLocaleString()}</td>
									<td className={obj.MAmt > 0 ? "text-right" : "text-right textHighlight"}>{obj.MAmt.toLocaleString()}</td>
									<td className='end'>{obj.temp}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<th className="text-left">{listSum.interrelatedNm}</th>
								<th className="text-right">{listSum.cnt.toLocaleString()}</th>
								<th className="text-right">{listSum.bdAmt.toLocaleString()}</th>
								<th className="text-right">{listSum.succAmt.toLocaleString()}</th>
								<th className="text-right">{listSum.MAmt.toLocaleString()}</th>
								<th className="end">{listSum.temp}</th>
							</tr>
						</tfoot>
					</>
					:
					<tbody>
						<tr>
							<td colSpan="6">조회된 데이터가 없습니다.</td>
						</tr>
					</tbody>
					}
				</table>
			</div>
		</div>
	)
}

export default Company
