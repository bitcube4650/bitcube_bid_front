import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import List from '../components/BidCompleteList'
import axios from 'axios';
import Pagination from 'components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import Ft from '../api/filters';
import { MapType } from 'components/types'
import SrcInput from 'components/input/SrcInput'
import SrcCheck from 'components/input/SrcCheckBox'
import DatePicker from 'components/input/SrcDatePicker'
import SelectListSize from 'components/SelectListSize'

const BidComplete = () => {
    const { keyword } = useParams();

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef<Boolean>(true);

     //조회 결과
     const [list, setList] = useState<MapType>({
        totalElements   : 0,
        val         : [{}]
    });

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        biNo : ''						//조회조건 : 입찰번호
    ,	biName : ''						//조회조건 : 입찰명
    ,	succBi : true					//조회조건 : 완료상태 - 입찰완료
    ,	failBi : true					//조회조건 : 완료상태 - 유찰
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDate : Ft.strDateAddDay(Ft.getCurretDate(), -365)                  //조회조건 : 입찰완료 - 시작일
    ,   endDate : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    });

    const onSearch = async() => {
        await axios.post("/api/v1/bidComplete/list", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    };

    //메인화면에서 진입시 파라미터 분기처리
    useEffect(() => {
        if(keyword) {
            if(keyword == 'completed'){
                setSrcData((prevState) => ({
                    ...prevState,
                    succBi : true,
                    failBi : false
                }));
            }else if(keyword == 'unsuccessful'){
                setSrcData((prevState) => ({
                    ...prevState,
                    succBi : false,
                    failBi : true
                }));
            }
        }
    }, [keyword]);

    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData.size, srcData.page]);
    
    const onPageInit = () => {
		if(srcData.page === 0){
			onSearch()
		} else {
			setSrcData({
				...srcData,
				page : 0
			})
		}
    }

    return (
        <div className="conRight">
            {/* conHeader */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰완료</li>
                </ul>
            </div>
            {/* //conHeader */}
            {/* contents */}
            <div className="contents">
                <div className="conTopBox">
                    <ul className="dList">
                        <li><div>입찰완료는 업체선정이 완료된 입찰이거나 유찰된 입찰 목록을 보여줍니다. (입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)</div></li>
                    </ul>
                </div>

                {/* searchBox */}
                <div className="searchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30 width100px">입찰완료일</div>
                        <div className="flex align-items-center" style={{ width:'320px'}}>
                            <DatePicker name="startDate" selected={srcData.startDate} srcData={srcData} setSrcData={setSrcData} />
                            <span style={{margin:"0 10px"}}>~</span>
                            <DatePicker name="endDate" selected={srcData.endDate} srcData={srcData} setSrcData={setSrcData} />
                        </div>
                    
                        <div className="sbTit mr30 ml50">완료상태</div>
                        <div className="flex align-items-center width300px">
                            <SrcCheck id="progress1-1" name="succBi" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.succBi} text="입찰완료" />
                            <SrcCheck id="progress1-2" name="failBi" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.failBi} text="유찰" />
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit mr30 width100px">입찰번호</div>
                        <div style={{ width:'320px'}}>
                            <SrcInput onSearch={onPageInit} name="biNo" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                        <div className="sbTit mr30 ml50">입찰명</div>
                        <div style={{ width:'320px'}}>
                            <SrcInput onSearch={onPageInit} name="biName" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                        <a onClick={onPageInit} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                {/* //searchBox */}

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
                </div>
                
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width:"12%"}}/>
                        <col />
                        <col style={{width:"15%"}}/>
                        <col style={{width:"10%"}}/>
                        <col style={{width:"10%"}}/>
                        <col style={{width:"10%"}}/>
                        <col style={{width:"10%"}}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>입찰번호</th>
                            <th>입찰명</th>
                            <th>입찰완료일시</th>
                            <th>입찰방식</th>
                            <th>상태</th>
                            <th>내역</th>
                            <th className="end">담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        { list.content?.map((data: MapType) => <List key={data.biNo} data={data} />) }
                        { (list.content === undefined || list.content === null || list.content.length === 0)&&
                            <tr>
                                <td className="end" colSpan={7}>조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>

                {/* pagination  */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ list } />
                    </div>
                </div>
                {/* pagination  */}

            </div>
            {/* contents */}
        </div>
    )
}

export default BidComplete