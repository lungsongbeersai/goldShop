import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Input, Message, useToaster, Placeholder, SelectPicker } from 'rsuite';
import Select from 'react-select'
import axios from 'axios';
import { Config } from '../../config/connenct';
import { useOption, useType, useTile } from '../../utils/selectOption';
import numeral from 'numeral';
import Alert from '../../utils/config';
export default function PatternPage() {
    const api = Config.urlApi;
    const itemType = useType();
    const itemTile = useTile();
    const itemOption = useOption();

    const [colrow, setColrow] = useState(false);
    const headleAddNew = (index) => {
        setColrow(index)
    }

    const [inputs,setInputs]=useState({
        pattern_id:'',
        title_id_fk:'',
        pattern_name:'',
        pattern_pirce:'0',
        option_id_fk:'',
    })
    const handleChange=(name,value)=>{
        setInputs({
            ...inputs,[name]:value
        })
    }

    const handleSubmit=(event)=>{
        event.preventDefault();
        console.log(inputs)
        try {
            axios.post(api + 'pattern/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        setColrow(false);
                        showMessage('ຢືນຢັນ',res.data.message,'success');
                        setInputs({
                            pattern_id:'',
                            title_id_fk:'',
                            pattern_name:'',
                            pattern_pirce:'0',
                            option_id_fk:'',
                        });
                        fetchData();
                    } else {
                        showMessage('ຂໍອະໄພ',res.data.message,'error');
                    }
                }).catch(function (error) { 
                   showMessage('ຂໍອະໄພ','ເກິນຂໍ້ຜິດພາດທາງລະບົບ','error');
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }


    const heandleEdit=(item)=>{
        setInputs({
            pattern_id:item.pattern_id,
            title_id_fk:item.title_id_fk,
            pattern_name:item.pattern_name,
            pattern_pirce:item.pattern_pirce,
            option_id_fk:item.option_id_fk,
        })
        setColrow(true)
    }

    const headleDelete=(id)=>{

    }
    // ========================
const [values,setValues]=useState({
    type_id_fk:'',
    title_id_fk:'',
    option_id_fk:'',
})
const chechSearch=(name,value)=>{
    setValues({
        ...values,[name]:value
    })
}

const handleSearch=()=>{
    fetchData();
}

const [isLoading, setIsLoading] = useState(true);
const [itemPattern,setItemPattern]=useState([])
const fetchData = async ()=>{
    try {
        const response = await axios.post(api + 'pattern/', values);
        const jsonData = response.data;
        setItemPattern(jsonData);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
}

    // ======================

    const toaster = useToaster();
  const [placement, setPlacement] = useState('topEnd');
  const showMessage = (titleName,messName, notifi) => {
    const message = (
      <Message showIcon type={notifi} closable>
        <strong>{titleName} </strong> {messName}
      </Message>
    );
    toaster.push(message, { placement });
  };
    useEffect(()=>{
       fetchData();
    },[])
    return (
        <>
            <div id="content" className="app-content bg-default px-3">
                <ol className="breadcrumb float-xl-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item active">ລາຍການລວດລາຍ</li>
                </ol>
                <h1 className="page-header mb-3">ລາຍການລວດລາຍທັງໝົດ</h1>

                <div className="row">
                    <div className={colrow === false ? 'col-sm-12' : 'col-sm-8'}>
                        <div className="palen">
                            <div className="panel panel-inverse pb-3">
                                <div className="panel-heading">
                                    <h4 className="panel-title fs-16px">ລາຍການສິນຄ້າ</h4>
                                    <div className="panel-heading-btn">
                                        {colrow === true ?
                                            <a href="javascript:;" className="btn btn-xs btn-icon btn-default" onClick={() => headleAddNew(false)}> <i className="fa fa-expand"></i></a>
                                            : ''
                                        }
                                    </div>
                                </div>
                                <div className="panel-body ">
                                    <div className="row mb-4">
                                        <div className="col-sm-3 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ຮູບປະພັນ</label>
                                            <SelectPicker data={itemType} onChange={(e)=>chechSearch('type_id_fk',e)} block placeholder="ເລືອກ" />
                                        </div>

                                        <div className="col-sm-3 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ປະເພດ</label>
                                            <SelectPicker data={itemTile} onChange={(e)=>chechSearch('title_id_fk',e)} block placeholder="ເລືອກ" />
                                        </div>
                                        <div className="col-sm-3 col-8 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                            <SelectPicker data={itemOption} onChange={(e)=>chechSearch('option_id_fk',e)} block placeholder="ເລືອກ" />
                                        </div>
                                        <div className="col-sm-3 col-4 mt-4">
                                            <button type="button" onClick={handleSearch} className="btn btn-danger px-3 "><i className="fas fa-search fs-16px"></i> </button>
                                            {colrow === false ?
                                                <button type="button" onClick={() => headleAddNew(true)} className="btn btn-black px-3 ms-2"><i className="fa-regular fa-plus fs-16px"></i> </button>
                                                : ''}
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                        <thead className='thead-plc'>
                                            <tr className=''>
                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                <th className=''>ປະເພດ</th>
                                                <th className=''>ລາຍການ</th>
                                                <th className='text-center'>ນ້ຳໜັກ</th>
                                                <th className='text-end'>ລາຄາ</th>
                                                <th width="5%" className='text-center'>ຕັ້ງຄ່າ</th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>
                                            {
                                                itemPattern.length > 0 ? (
                                                itemPattern.map((item, key) => (
                                                    <tr key={key}>
                                                        <td className='text-center' width='5%'>{key + 1} </td>
                                                        <td className=''> {item.tile_name} </td>
                                                        <td>{item.pattern_name}</td>
                                                        <td className='text-center'>{item.option_name}</td>
                                                        <td className='text-end'> {numeral(item.pattern_pirce).format('0,00')} </td>
                                                        <td className='text-center'>
                                                            <button type='button' onClick={() => heandleEdit(item)} className="btn btn-green btn-xs me-1">
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                            </button>
                                                            <button type='button' onClick={() => headleDelete(item.pattern_id)} className="btn btn-red btn-xs">
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                                ):(
                                                    <tr>
                                                        <td colSpan={12} className='text-center text-danger'> ບໍ່ມີລາຍການນຳເຂົ້າສິນຄ້າ</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ------------ form add data ------------------- */}

                    {colrow === true ? (
                        <div className="col-sm-4 ">
                            <div className="panel border-4 border-bottom  rounded-4 border-green">
                                <div className="panel-heading bg-green text-white">
                                    <h4 className="panel-title fs-16px">ຟອມເພີ່ມລວມລາຍ</h4>
                                    <div className="panel-heading-btn">
                                        {colrow === true ?
                                            <a href="javascript:;" className="btn btn-xs btn-icon btn-danger" onClick={() => headleAddNew(false)}> <i className="fa fa-times"></i></a>
                                            : ''
                                        }
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                <div className="panel-body row">
                                    <div className="form-group mb-2">
                                        <label htmlFor="" className='form-label'>ປະເພດ</label>
                                        <Select options={itemTile} value={itemTile.find(obj => obj.value === inputs.title_id_fk)} onChange={(e)=>handleChange('title_id_fk',e.value)}  required />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຊື່ລວດລາຍ</label>
                                        <Input value={inputs.pattern_name} placeholder='ຊື່ລວດລາຍ' onChange={(e)=>handleChange('pattern_name',e)}  required />
                                    </div>
                                    <div className="col-sm-6 mb-2">
                                        <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                        <Select options={itemOption} defaultValue={itemOption.find(obj => obj.value === inputs.option_id_fk)} onChange={(e)=>handleChange('option_id_fk',e.value)}  required />
                                    </div>
                                    <div className="col-sm-6 mb-2">
                                        <label htmlFor="" className='form-label'>ລາຄາເລີມຕົ້ນ</label>
                                        <Input value={numeral(inputs.pattern_pirce).format('0,00')} onChange={(e)=>handleChange('pattern_pirce',e)}  placeholder='0.00' className='bg-lime-100' required />
                                    </div>
<hr />
                                    <div className="col-6 mb-4">
                                        <button type='button' className='btn btn-danger w-100 fs-14px'>ເລີມໃໝ່</button>
                                    </div>
                                    <div className="col-6  mb-4">
                                    <button type='submit' className='btn btn-primary w-100 fs-14px'>ບັນທຶກ</button>
                                    </div>
                                </div>
                                    </form>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </div>
        </>
    )
}
