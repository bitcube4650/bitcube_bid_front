import React from 'react';
import { SrcSelectBoxProps } from 'components/types'

const SrcSelectBox = (props: SrcSelectBoxProps) => {
    const {totalText} = props;

    const onFormEventSrcData = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    // 샘플
    // const [useYnOptionList, setUseYnOptionList] = useState([{"value" : "Y", "name" : "사용"}, {"value" : "N", "name" : "미사용"}])
    // valueKey="value" nameKey="name" 식으로 세팅, 만약 가져온 코드성 값 리스트가 value, name 이 아닌 경우 valueKey / nameKey 의 값을 수정할 것
    // <SrcSelectBox   name={"useYn"} optionList={useYnOptionList} valueKey="value" nameKey="name" totalText="전체" value={/* 선택하려는 값 */} .... />
    // <SrcSelectBox   name={"interrelatedCustCode"} optionList={InterrelatedCustCodeList} valueKey="interrelatedCustCode" nameKey="interrelatedNm" totalText="전체" value={/* 선택하려는 값 */} .... />
    
    return (
        <select name={props.name} onChange={onFormEventSrcData} className="selectStyle" value={props.value}>
            <option value="">{totalText !== undefined && totalText !== null && totalText !== '' ? totalText : '전체'}</option>
            {
                props.optionList?.map((data, index) => 
                <option value={data[props.valueKey as string]} key={index} >
                    {data[props.nameKey as string]}
                </option>)
            }
        </select>
    )
}

export default SrcSelectBox;