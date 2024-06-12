import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import CustUserListJs from '../components/CustUserList'
import CustUserDetailPop from './CustUserDatail'
import {  Button } from 'react-bootstrap';
import Swal from 'sweetalert2'; // 공통 팝업창

const CustUser = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    // 사용자 등록 / 수정 여부
    const [CreateUser, setCreateUser] = useState(false)
    // 모달창 오픈 여부
    const [CustUserDetailPopOpen, setCustUserDetailPopOpen] = useState(false);  // 사용자 등록/수정모달 오픈
    // 상세, 수정에 필요한 userId
    const [SrcUserIdChange, setSrcUserIdChange] = useState("");

    // 사용자 등록 팝업 호출
    const onCustUserPop = useCallback(() => {
        setSrcUserIdChange("")
        setCustUserDetailPopOpen(true); 
        setCreateUser(true); 
    }, []);
    // 사용자 상세, 수정 팝업 호출
    function onUserDetailPop(userId){
        setSrcUserIdChange(userId)
        setCreateUser(false)
        setCustUserDetailPopOpen(true)
    }
    
    //조회 결과
    const [CustUserList, setCustUserList] = useState({})
    //조회조건
    const [SrcData, setSrcData] = useState({
        custCode                : loginInfo.custCode,
        userName                : "",
        userId                  : "",
        useYn                   : "",
        size                    : 10,
        page                    : 0
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...SrcData,
            [e.target.name]: e.target.value,
            custCode : loginInfo.custCode
        });
    }

    const onSearch = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/custuser/userListForCust", SrcData);
            setCustUserList(response.data.data);
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    }, [SrcData]);

    useEffect(() => {
        onSearch();
    }, [SrcData.size, SrcData.page]);

    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>업체정보</li>
                    <li>사용자관리</li>
                </ul>
            </div>
            <div className="contents">
                <div className="searchBox">
                    <div className="flex align-items-center">
                        <div className="sbTit width100px">사용자명</div>
				        <div className="flex align-items-center width250px">
                            <input type="text" onChange={onChangeSrcData} name="userName" className="inputStyle" placeholder="" maxLength="300" onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} autoComplete="new-password"/>
                        </div>
				        <div className="sbTit width100px ml50">아이디</div>
				        <div className="width250px">
                            <input type="text" onChange={onChangeSrcData} name="userId" className="inputStyle" placeholder="" maxLength="50" onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} autoComplete="new-password"/>
                        </div>
                        <div className="sbTit width100px ml50">사용여부</div>
                        <div className="flex align-items-center width250px">
                            <select name='useYn' onChange={onChangeSrcData} className="selectStyle">
                                <option value="">전체</option>
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </div>
                        <Button onClick={onSearch} className="btnStyle btnSearch">검색</Button>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ CustUserList.totalElements ? CustUserList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div>
                        <Button onClick={ onCustUserPop } className="btnStyle btnPrimary" title="사용자등록">사용자등록</Button>
                    </div>
                </div>
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width:'15%'}} />
                        <col style={{width:'15%'}}/>
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'13%'}} />
                        <col style={{width:'13%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'5%'}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>사용자명</th>
                            <th>아이디</th>
                            <th>직급</th>
                            <th>부서</th>
                            <th>전화번호</th>
                            <th>휴대폰</th>
                            <th>사용권한</th>
                            <th className="end">사용여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        { CustUserList.content?.map((CustUser, index) => <CustUserListJs key={index} CustUser={CustUser} onUserDetailPop={onUserDetailPop}/> ) }
                        { CustUserList.content == null &&
                            <tr>
                                <td className="end" colSpan="9">조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={CustUserList} />
                    </div>
                </div>
            </div>
            {CustUserDetailPopOpen && (
                <CustUserDetailPop 
                    srcUserId={SrcUserIdChange} 
                    CreateUser={CreateUser}
                    CustUserDetailPopOpen={CustUserDetailPopOpen}
                    setCustUserDetailPopOpen={setCustUserDetailPopOpen}
                    onSearch={onSearch}
                />
            )}
        </div>
    );
};

export default CustUser;