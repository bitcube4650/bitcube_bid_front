import React from 'react';
import { MapType } from 'components/types'


interface itemListProps {
    item: MapType;
    onCallPopMethod : any
}

const ItemList = (props : itemListProps) => {
    return(
        <tr onClick={() => props.onCallPopMethod(props.item.itemCode)}>
            <td className="text-left"><a data-toggle="modal" data-target="#itemInfoPop" className="textUnderline notiTitle" title="회사정보 자세히 보기">{props.item.itemCode}</a></td>
            <td className="text-left"><a data-toggle="modal" data-target="#itemInfoPop" className="textUnderline notiTitle" >{props.item.itemName}</a></td>
            <td className="text-left">{props.item.grpNm}</td>
            <td >{ props.item.useYn === 'Y' ? '사용' : '미사용' }</td>
            <td>{ props.item.createUser }</td>
            <td className="end">{ props.item.createDate }</td>
        </tr>
    );

}


export default ItemList;