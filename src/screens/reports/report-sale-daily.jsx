import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder,Modal,Button } from 'rsuite';
import { useStaff } from '../../utils/selectOption';
import { Config } from '../../config/connenct';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
function ReportsaleDaily() {
  const itemStaff = useStaff();
  const api = Config.urlApi;
  const [open, setOpen] = React.useState(false);
  const handleModal=(index)=>{
    setOpen(index)
  }
  const datastt = [
    { data: 1, sttName: 'ຄ້າງປິດ' },
    { data: 2, sttName: 'ປິດຍອດແລ້ວ' }
  ].map(
    item => ({ label: item.sttName, value: item.data })
  );
  const [dataSearch, setDataSearch] = useState({
    startDate: new Date(),
    endDate: new Date(),
    staffId: '',
    statusOff: '',
  });

  const handleChange = (name, value) => {
    setDataSearch({
      ...dataSearch, [name]: value
    });
  }
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState([])
  const [itemData, setItemData] = useState([]);
  const fetchDataReport = async () => {
    try {
      const response = await axios.post(api + 'sale-r/report', dataSearch);
      const jsonData = response.data;
      setItemData(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleSaerch = () => {
    fetchDataReport();
  }

  const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setFilter(event)
    setItemData(filterName.filter(n => n.sale_billNo.toLowerCase().includes(event)))
  }

const [detail,setDetail]=useState([]);
const [billNo,setBillNo]=useState('')
const [billId,setBillId]=useState('')

const handleView = async (id, Bill) => {
  setBillNo(Bill);
  setBillId(id);
  try {
    const response = await axios.post(api + 'sale-r/veiw/'+id);
    const jsonData = response.data;
    setDetail(jsonData);
  setOpen(true);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // setIsLoading(false);
  }
};
    // ============== // ============

const exportToExcel = () => {
  const table = document.getElementById('table-to-xls');
  const worksheet = XLSX.utils.table_to_sheet(table);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ຍອດຂາຍລວມ");
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "ລາຍງານການຂາຍລວມ.xlsx");
};


  useEffect(() => {
    fetchDataReport();
  }, [])

  return (
    <>
      <div id="content" className="app-content px-3">
        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
          <li className="breadcrumb-item active">ຕາຕະລາຍງານຂາຍປະຈຳວັນ</li>
        </ol>
        <h1 className="page-header  mb-3">ລາຍການຂາຍປະຈຳວັນ</h1>
        <div className="panel " data-sortable-id="ui-widget-5">

          <div className="panel-body">
            <div className="row mb-4">
              <div className='col-sm-4 col-6  col-lg-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-6  col-lg-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-lg-3'>
                <label htmlFor="" className='form-label'>ພະນັກງານຂາຍ</label>
                <SelectPicker data={itemStaff} onChange={(e) => handleChange('staffId', e)} block placeholder="ເລືອກ" />
              </div>
              <div className='col-sm-4 col-lg-2'>
                <label htmlFor="" className='form-label'>ສະຖານະ</label>
                <SelectPicker data={datastt} onChange={(e) => handleChange('statusOff', e)} block placeholder="ເລືອກ" />
              </div>
              <div className="col-sm-3 col-lg-2 mt-4">
                <button type='button' onClick={handleSaerch} className='btn btn-danger rounded ms-1'><i className="fas fa-search fa-lg"></i></button>
                <button type='button' onClick={exportToExcel}  className='btn btn-green rounded ms-1'><i className="fas fa-file-excel fa-lg"></i></button>
              </div>
            </div>

            <div className="table-responsive">
              <div className="d-lg-flex align-items-center mb-2">
                {/* <div className="d-lg-flex d-none align-items-center text-nowrap">
                  page:
                  <select className="form-select form-select-sm ms-2  ps-2 ">
                    <option>100</option>
                    <option>50</option>
                    <option selected="">30</option>
                  </select>
                </div> */}
                <div className="pagination pagination-sm mb-0 ms-auto justify-content-center">
                  <InputGroup inside block>
                    <InputGroup.Addon>
                      <i className="fas fa-search"></i>
                    </InputGroup.Addon>
                    <Input onChange={(event) => Filter(event)} placeholder='ເລກທີບິນ' />
                  </InputGroup>
                </div>
              </div>

              <table id="table-to-xls" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className='thead-plc'>
                  <tr>
                    <th width="1%" className='text-center'>ລ/ດ</th>
                    <th className='text-center'>ວັນທີຂາຍ</th>
                    <th className='text-center'>ບິນເລກທີ</th>
                    <th className=''>ພະນັກງານຂາຍ</th>
                    <th className='text-end'>ລວມຍອດທັງໝົດ</th>
                    <th className='text-end'>ຮັບເງິນສົດ</th>
                    <th className='text-end'>ຮັບເງິນໂອນ</th>
                    <th className='text-end'>ຍອດຮັບທັງໝົດ</th>
                    <th className='text-end'>ຍອດເງິນທອນ</th>
                    <th className=''>ຊື່ລູກຄ້າ</th>
                    <th className=''>ເບີໂທລະສັບ</th>
                    <th className=''>ໝາຍເຫດ</th>
                    <th className=''>ພ/ງ ບັນທຶກ</th>
                    <th className=''>ສະຖານະ</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading === true ? <tr>
                    <td colSpan={'14'}  className='border-0 bg-white'><Placeholder.Grid rows={9} columns={6} active /></td>
                </tr> :
                      itemData.length > 0 ? (
                        <>
                          {itemData.map((val, key) => (
                            <tr key={key}>
                              <td className='text-center'>{key + 1}</td>
                              <td className='text-center'>{moment(val.sale_date).format('DD/MM/YYYY hh:mm')}</td>
                              <td className='text-center'><span role='button' className='text-h-blue' onClick={()=>handleView(val.sale_uuid,val.sale_billNo)} >{val.sale_billNo}</span> </td>
                              <td>{val.first_name + ' ' + val.last_name}</td>
                              <td className='text-end'>{numeral(val.balance_total).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_cash).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_transfer).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_payment).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_return).format('0,00')}</td>
                              <td>{val.cus_fname + ' ' + val.cus_lname}</td>
                              <td>{val.cus_tel}</td>
                              <td>{val.sale_remark}</td>
                              <td>{val.userName}</td>
                              <td>{val.status_off_sale === 1 ? 'ຄ້າງປິດ' : 'ປິດຍອດ'}</td>
                            </tr>
                          ))}
                         
                        </>
                      ) : (
                        <tr>
                          <td colSpan={14} className='text-center text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>

                        </tr>
                      )}
                </tbody>
                <tfoot>
                  {itemData.length > 0 ? (
                <tr>
                            <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ</td>
                            <td className='text-end bg-dark text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_total), 0)).format('0,00')}</td>
                            <td className='text-end bg-green text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_cash), 0)).format('0,00')}</td>
                            <td className='text-end bg-danger text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_transfer), 0)).format('0,00')}</td>
                            <td className='text-end bg-blue text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_payment), 0)).format('0,00')}</td>
                            <td className='text-end bg-orange'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_return), 0)).format('0,00')}</td>
                            <td colSpan={5}></td>
                          </tr>
                          ):''}
                </tfoot>
              </table>

            </div>
          </div>
        </div>

        <Modal size={'lg'} open={open} onClose={()=>handleModal(false)}>
        <Modal.Header>
          <Modal.Title className='py-2'>ລາຍລະອຽດບິນ: {billNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table className="table  table-bordered table-bordered align-middle w-100 text-nowrap">
                <thead className='thead-plc'>
                  <tr>
                    <th width="1%" className='text-center'>ລ/ດ</th>
                    <th className='text-center'>ລະຫັດ</th>
                    <th className=''>ຊື່ສິນຄ້າ</th>
                    <th className='text-center'>ນ້ຳໜັກ</th>
                    <th className='text-center'>ກຣາມ</th>
                    <th className='text-center'>ຈຳນວນ</th>
                    <th className='text-end'>ຄ່າລາຍ</th>
                    <th className='text-end'>ລວມເງິນ</th>
                    <th className=''>ໂຊນຂາຍ</th>
                    <th className=''>ພະນັກງານຂາຍ</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((item,index)=>(
                <tr>
                  <td  className='text-center'>{index+1}</td>
                  <td  className='text-center'>{item.code_id}</td>
                  <td>{item.tile_name}</td>
                  <td  className='text-center'>{item.qty_baht+' '+item.option_name}</td>
                  <td  className='text-center'>{item.qty_grams} g</td>
                  <td  className='text-center'>{item.order_qty+'/'+item.unite_name}</td>
                  <td  className='text-end'>{numeral(item.order_qty*item.price_pattern).format('0,00')}</td>
                  <td className='text-end'>{numeral((item.order_qty*item.price_sale)+(item.order_qty*item.price_pattern)).format('0,00')}</td>
                  <td>{item.zone_name}</td>
                  <td>{item.staff_name}</td>
                </tr>
                )
              )}
                </tbody>
                <tfoot>
                <tr className='border-bottom-0'>
                <td colSpan={6} className='text-end border'>ລວມຍອດທັງໝົດ</td>
                <td className='text-end bg-black border text-white'>{numeral(detail.reduce((acc, val) => acc + parseFloat(val.order_qty*val.price_pattern*val.qty_baht), 0)).format('0,00')}</td>
                <td className='text-end bg-black border text-white'>{numeral(detail.reduce((acc, val) => acc + parseFloat((val.order_qty*val.price_sale)+(val.order_qty*val.price_pattern*val.qty_baht)), 0)).format('0,00')}</td>
                <td colSpan={2} className='border-0'></td>
              </tr>
                </tfoot>
                </table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>handleModal(false)} appearance="primary">
          ພີມບິນ
          </Button>
          <Button onClick={()=>handleModal(false)} appearance="primary" color='red'>
          ອອກ
          </Button>
        </Modal.Footer>
      </Modal>
    
      </div>
    </>
  )
}

export default ReportsaleDaily