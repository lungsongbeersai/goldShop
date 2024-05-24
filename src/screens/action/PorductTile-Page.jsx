import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Input, SelectPicker,Placeholder } from 'rsuite';
import { Config } from '../../config/connenct';
import axios from 'axios';
import Swal from "sweetalert2";
import Alert from '../../utils/config';
import { useUnite,useType } from '../../utils/selectOption';
function PorductTile() {
    const api = Config.urlApi;
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () =>{
        setOpen(true);
        setInputs({
            tile_id:'',
            type_id_fk: '',
            tile_name: '',
            unite_id_fk:''
        })
    } 
    const handleClose = () => setOpen(false);
const itemUnite=useUnite();
const data =useType();

    const [inputs, setInputs] = useState({
        tile_id:'',
        type_id_fk: '',
        tile_name: '',
        unite_id_fk:''
    })



    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
       
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs)
        try {
            axios.post(api + 'tileps/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose();
                        fetchTypePorduct();
                        Alert.successData(res.data.message)
                        setInputs({
                            tile_id:'',
                            type_id_fk: '',
                            tile_name: '',
                            unite_id_fk:''
                        })
                    } else {
                        Alert.errorData(res.data.message)
                    }
                }.catch,function(error){
                    Alert.errorData('ການບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ')
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const headleEdit=(item)=>{
        setInputs({
            tile_id:item.tile_uuid,
            type_id_fk: item.type_id_fk,
            tile_name: item.tile_name,
            unite_id_fk:item.unite_id_fk
        });
        setOpen(true);
    }


    const headleDelete = (id) => {
        Swal.fire({
            title: "ຢືນຢັນ?",
            text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
            icon: "warning",
            width: 400,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            denyButtonText: `ຍົກເລີກ`
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `tileps/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchTypePorduct();
                        Alert.successData(response.data.message)
                    }else if(response.status===400){
                        Alert.warningData(response.data.message);
                    } else {
                        Alert.errorData(response.data.message)
                    }
                }) .catch((error) => {  // Fixed the syntax error here
                    Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
                });
            }
        });
    }
    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilteName] = useState([])
    const [itemTypePorduct, setItemTypePorduct] = useState([]);
    const fetchTypePorduct = async () => {
        try {
            const response = await fetch(api + 'tileps/');
            const jsonData = await response.json();
            setItemTypePorduct(jsonData);
            setFilteName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const [filter, setFilter] = useState('');
    const Filter = (event) => {
        setFilter(event)
        setItemTypePorduct(filterName.filter(n => n.tile_name.toLowerCase().includes(event)))
    }




    //===========================\\


    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };

    const pages = [];
    for (let i = 1; i <= Math.ceil(itemTypePorduct.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemTypePorduct.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemTypePorduct.length;
    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage == number ? "active" : ''}`} >
                    <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
                </li>
            );
        } else {
            <li key={number} className="page-item active" >
                <span role="button" className="page-link border-blue">1</span>
            </li>
        }
    });

    const handleNextbtn = () => {
        setcurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % pageNumberLimit == 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };
    //===========================\\
    const viewData=(id)=>{
        navigate(`/view-p?id=${id}`);
    }
    useEffect(() => {
        fetchTypePorduct();
        // showTypegold()
    }, []);
    return (
        <>
            <div id="content" class="app-content px-3">
                <ol class="breadcrumb float-end">
                    <li class="breadcrumb-item">
                        <button type="button" onClick={handleOpen} className="btn btn-sm btn-danger"><i class="fa-solid fa-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</button>
                    </li>
                </ol>
                <h1 class="page-header mb-3">ຂໍ້ມູນພະລິດຕະພັນ</h1>
                <div className="panel pt-4 px-2 pb-4">
                    <div className="table-responsive">
                        <div className="row mb-3">
                            <div className="col-sm-9 fs-20px"> </div>
                            <div className="col-sm-3">
                                <div className='input-group' >
                                    <input type='text' className='form-control' onChange={(event) => Filter(event.target.value)} placeholder="ຄົ້ນຫາ" />
                                </div>
                            </div>
                        </div>
                        <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className='thead-plc'>
                                <tr>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th className='text-center'>ລະຫັດ</th>
                                    <th className=''>ຊື່ພະລິດຕະພັນ</th>
                                    <th className=''>ຫົວໜວຍ</th>
                                    <th>ຮູບປະພັນ</th>
                                    <th className='text-center'>ລາຍການ</th>
                                    <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading === true? <Placeholder.Grid rows={6} columns={6} active /> :
                                itemTypePorduct.length > 0 ? (
                                    itemTypePorduct.map((item, key) => (
                                        <tr key={key}>
                                            <td className='text-center' width='1%'>{key + 1}</td>
                                            <td className='text-center'>{item.tile_code}</td>
                                            <td>{item.tile_name}</td>
                                            <td>{item.unite_name}</td>
                                            <td>{item.typeName}</td>
                                            <td className='text-center'> <span role='button' onClick={()=>viewData(item.tile_uuid)} className='badge bg-green rounded-3'> {item.qty_stock} ລາຍການ  <i class="fa-solid fa-eye"></i></span> </td>
                                            <td className='text-center' width='10%'>
                                                <button type='button' onClick={()=>headleEdit(item)} className="btn btn-blue btn-xs me-2">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button type='button' onClick={() => headleDelete(item.tile_uuid)} className="btn btn-red btn-xs">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div class="d-md-flex align-items-center">
                        <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                            ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                        </div>
                        <ul className="pagination  mb-0 ms-auto justify-content-center">
                            <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                            {minPageNumberLimit >= 1 ? (
                                <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                            ) : ''}
                            {renderPageNumbers}
                            {pages.length > maxPageNumberLimit ? (
                                <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                            ) : ''}
                            <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className='py-1'>ແບບຟອມພີ່ມພະລິດຕະພັນ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                   <div className="row">
                        <div className="form-group col-sm-12 mb-2">
                            <label htmlFor="" className='form-label'>ຊື່ພະລິດຕະພັນ</label>
                            <input type="text" name='tile_id' value={inputs.tile_id}  className='hide'/>
                            <Input name='tile_name' value={inputs.tile_name} onChange={(e) => handleChange('tile_name', e)}  placeholder='ຊື່ພະລິດຕະພັນ'  required />
                        </div>
                        <div className="form-group mb-2 col-sm-6">
                            <label htmlFor="" className='form-label'>ຫົວໜວຍ</label>
                            <SelectPicker name='unite_id_fk' value={inputs.unite_id_fk} data={itemUnite} block  onChange={(e) => handleChange('unite_id_fk', e)} placeholder='ຫົວໜວຍ' />
                        </div>
                    <div className="form-group col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ຮູບປະພັນ </label>
                            <SelectPicker name='type_id_fk' value={inputs.type_id_fk} data={data} block  onChange={(e) => handleChange('type_id_fk', e)} placeholder='ຮູບປະພັນ' />
                        </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                        <Button onClick={handleClose} color='red' appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default PorductTile