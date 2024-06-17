import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";
import Ft from '../../bid/api/filters';
import BidJoinCustListPop from '../../bid/components/BidJoinCustListPop';

const BiddingDetail = () => {
    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
	const isMounted = useRef(true);

	//조회 결과
	const [list, setList] = useState([]);

    //계열사 리스트
    const [coInterList, setCoInterList] = useState([]);

    //로그인 사용자정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	
	//조회조건
    const [srcData, setSrcData] = useState({
        userAuth : ''					//조회조건 : 사용자권한
    ,	coInters : []					//조회조건 : 계열사 배열
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDay : Ft.strDateAddDay(Ft.getCurretDate(), -30)                  //조회조건 : 입찰완료 - 시작일
    ,   endDay : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    ,   coInter : ''                    //조회조건 : 선택된 계열사
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });
    }

    const onSearch = useCallback(async() => {
        srcData.coInters = [];
        if(loginInfo.userAuth === 1){
            if(srcData.coInter !== '')
                srcData.coInters.push(srcData.coInter);
        }else{
            if(srcData.coInter === ''){
                srcData.coInters = coInterList.map(item => item.interrelatedCustCode)
            }else{
                srcData.coInters.push(srcData.coInter)
            }
        }

        await axios.post("/api/v1/statistics/bidDetailList", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })

    }, [srcData, loginInfo.userAuth]);

	//마운트 완료 후 검색
    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            selectCoInterList();
            onSearch();
        }
    },[srcData.size, srcData.page]);

    //날짜 이벤트
    const onChgStartDate = (day) => {
        const selectedDate = new Date(day)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        setSrcData({
            ...srcData,
            startDay: formattedDate
        });
    }

    const onChgEndDate = (day) => {
        const selectedDate = new Date(day)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        setSrcData({
            ...srcData,
            endDay: formattedDate
        });
    }

	//계열사 리스트 불러 오는 메소드
	const selectCoInterList = async() => {
        const params = {
          userAuth : loginInfo.userAuth
        }

        await axios.post("/api/v1/statistics/coInterList", params).then((response) =>{
            if (response.data.code === "OK") {
                setCoInterList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    }

    const onExceldown = useCallback(() => {
        const time = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
        const userAuth = loginInfo.userAuth;

        let params = {
            startDay:  srcData.startDay
        ,   endDay: srcData.endDay
        ,   coInters: []
        ,   columnNames: ['입찰번호', '입찰명', '예산금액', '낙찰금액', '낙찰사', '참여업체수','제출시작일','제출마감일','입찰담당자']
        ,   mappingColumnNames : ['biNo','biName','bdAmt','succAmt','custName','joinCustCnt','estStartDate','estCloseDate','userName']
        ,   fileName: "입찰_상세내역" + time
        ,   excelUrl: 'bidDetailList'
        ,   excel : 'Y'
        }

        // let params = {
        //     startDay: this.searchParams.startDay,
        //     endDay: this.searchParams.endDay,
        //     columnNames: ['입찰번호', '입찰명', '예산금액', '낙찰금액', '낙찰사', '참여업체수','제출시작일','제출마감일','입찰담당자'],
        //     mappingColumnNames : ['biNo','biName','bdAmt','succAmt','custName','joinCustCnt','estStartDate','estCloseDate','userName'],
        //     fileName: "입찰_상세내역" + time,
        //     excelUrl: 'bidDetailList',
        //     excel : 'Y'
        // };
        if (userAuth === 1) {
            if (srcData.coInter !== '') {
                params.coInters.push(srcData.coInter);
            }
        } else {
            if (srcData.coInter === '') {
                params.coInters = coInterList.map(item => item.interrelatedCustCode);
            } else {
                params.coInters.push(srcData.coInter);
            }
        }

        axios.post("/api/v1/statistics/excel", params, {responseType: "blob",}).then((response) => {
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
                Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
            }
        }).catch((error) => {
            // 오류 처리
            console.error("Error:", error);
            Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
        });
    }, [srcData, loginInfo.userAuth]);

    //투찰정보
    const [popBiNo, setPopBiNo] = useState('');
    const [joinCustPop, setJoinCustPop] = useState(false);

    const onSetPopData = (biNo)=> {
        setPopBiNo(biNo);
        setJoinCustPop(true);
    }

    return (
        <div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>통계</li>
					<li>입찰상세내역</li>
				</ul>
			</div>
			{/* //conHeader */}
			{/* contents */}
			<div className="contents">
				<div className="conTopBox">
					<ul className="dList">
						<li><div>조회기간 입찰완료일 기준으로 각 계열사의 낙찰된 입찰정보와 투찰 정보를 확인할 수 있습니다.</div></li>
						<li><div>참여업체수를 클릭하면 투찰 업체들의 투찰가 및 투찰 일시를 보실 수 있습니다.</div></li>
					</ul>
				</div>

				{/* searchBox */}
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit width100px">입찰완료일</div>
						<div className="flex align-items-center" style={{ width:'320px'}}>
							<DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.startDay} onChange={(date) => onChgStartDate(date)} dateFormat="yyyy-MM-dd"/>
                            <span style={{margin:"0 10px"}}>~</span>
                            <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.endDay} onChange={(date) => onChgEndDate(date)} dateFormat="yyyy-MM-dd"/>
						</div>
						<div className="sbTit width80px ml50">계열사</div>
						<div className="flex align-items-center width280px">
							<select name="coInter" className="selectStyle" onChange={onChangeSrcData}>
								<option value="">전체</option>
                                {coInterList.map((coInter, idx) => 
                                <option key={idx} value={coInter.interrelatedCustCode}>{coInter.interrelatedNm}</option>
                                )}
							</select>
						</div>
						<a href={()=>false} onClick={onSearch} className="btnStyle btnSearch">검색</a>
					</div>
				</div>
				{/* searchBox */}

				<div className="flex align-items-center justify-space-between mt40">
                    <div className="width100 mt10">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div className="flex-shrink0">
                        <a href={()=>false} onClick={onExceldown} className="btnStyle btnPrimary" title="엑셀 다운로드" >엑셀 다운로드 <i className="fa-light fa-arrow-down-to-line ml10"></i></a>
                    </div>
                </div>

				<table className="tblSkin1 mt10">
					<colgroup>
						<col style={{}} />
					</colgroup>
					<thead>
						<tr>
							<th>입찰번호</th>
							<th>입찰명</th>
							<th>예산금액</th>
							<th>낙찰금액</th>
							<th>낙찰사</th>
							<th>참여업체수</th>
							<th>제출시작일</th>
							<th>제출마감일</th>
							<th className="end">입찰담당자</th>
						</tr>
					</thead>
					<tbody>
                        { list.content?.map((data, idx) => 
                            <tr key={idx}>
                                <td>{ data.biNo }</td>
                                <td className="text-left">{ data.biName }</td>
                                <td className="text-right">{ Ft.numberWithCommas(data.bdAmt) }</td>
                                <td className="text-right">{ Ft.numberWithCommas(data.succAmt) }</td>
                                <td>{ data.custName }</td>
                                <td><a href={()=>false} onClick={()=>onSetPopData(data.biNo)} className="textUnderline" title="투찰 정보 페이지가 열림">{ Ft.numberWithCommas(data.joinCustCnt) }</a></td>
                                <td>{ data.estStartDate }</td>
                                <td>{ data.estCloseDate }</td>
                                <td className="end">{ data.userName }</td>
                            </tr>
                        )}
                        { (list.content === undefined || list.content === null || list.content.length === 0) &&
                            <tr>
                                <td className="end" colSpan='9'>조회된 데이터가 없습니다.</td>
                            </tr> 
                        }
					</tbody>
				</table>

				{/* pagination */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={list} />
                    </div>
                </div>
                {/* pagination */}

			</div>
			{/* //contents */}

			{/* // 투찰정보 팝업 */}
			{joinCustPop && 
            <BidJoinCustListPop biNo={popBiNo} joinCustPop={joinCustPop} setJoinCustPop={setJoinCustPop} />
            }
		</div>
  	)
}

export default BiddingDetail
