import React, { useCallback, useState, ChangeEvent } from 'react'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapType } from '../../../components/types';
import SrcInput from '../../../components/input/SrcInput';

interface PwInitPopProps {
    pwInit : boolean;
    setPwInit : React.Dispatch<React.SetStateAction<boolean>>;
}

const PwInitPop: React.FC<PwInitPopProps> = ({pwInit, setPwInit}) => {
    const pwParamInit = {password : "", passwordChk : ""};
    const [srcData, setSrcData] = useState<MapType>(pwParamInit);
    
    // 팝업 닫기
    const fnClosePwInitPop = useCallback(() => {
        setSrcData(pwParamInit);
        setPwInit(false);
    }, [])

    const savePwd = () => {
        if(checkValid()){
            axios.post("/api/v1/main/changePwd", {password : srcData.password}).then((response) => {
                const result = response.data;
                if(result) {
                    Swal.fire('', '비밀번호를 저장하였습니다.', 'info');
                    fnClosePwInitPop();
                } else {
                    Swal.fire('', '비밀번호 변경에 실패하였습니다.', 'warning');
                }
            });
        }  
    }

    const checkValid = () => {
        const password = srcData.password;
        const passwordChk = srcData.passwordChk;
        const hasUpperCase = /[A-Z]/.test(password);//대문자
        const hasLowerCase = /[a-z]/.test(password);//소문자
        const hasDigit = /\d/.test(password);//숫자
        const hasSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);//특수문자

        const isValidPassword = (hasUpperCase && hasLowerCase && hasDigit) || (hasUpperCase && hasLowerCase && hasSpecialChar) || (hasDigit && hasSpecialChar);
        const isValidLength = password.length >= 8 && password.length <= 16;
        const isSame = password == passwordChk

        if(!isValidPassword){
            Swal.fire('', '비밀번호는 대/소문자, 숫자, 특수문자중에서 2가지 이상 조합되어야 합니다.', 'warning');
            return false;
        }else if(!isValidLength){
            Swal.fire('', '비밀번호는 8자 이상 16자 이하로 작성해주세요.', 'warning');
            return false;
        }else if(!isSame){
            Swal.fire('', '비밀번호 확인이 일치하지 않습니다.', 'warning');
            return false;
        }
        return true;
    }

    return (
        <Modal className="modalStyle" show={pwInit} onHide={fnClosePwInitPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnClosePwInitPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">비밀번호 변경</h2>
                <div className="modalTopBox" style={{marginBottom:'15px'}} >
                    <ul>
                        <li>
                            <div>비밀번호가 초기화 되었거나 1년 이상 암호를<br/>변경하지 않았을 경우 비밀번호를 변경 하셔야 합니다.</div>
                        </li>
                    </ul>
                </div>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width120px">비밀번호</div>
                    <div className="width100">
                        <SrcInput name="password" type="password" srcData={ srcData } setSrcData={ setSrcData } onSearch={ savePwd } />
                    </div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                    <div className="width100">
                        <SrcInput name="passwordChk" type="password" srcData={ srcData } setSrcData={ setSrcData } onSearch={ savePwd } />
                    </div>
                </div>

                <div className="modalFooter">
                    <a onClick={fnClosePwInitPop} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                    <a onClick={savePwd} className="modalBtnCheck" data-toggle="modal" title="저장">저장</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PwInitPop
