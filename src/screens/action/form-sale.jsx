import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { Input, Message, useToaster, InputGroup } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connenct';
import Alert from '../../utils/config';
import numeral from 'numeral';
function FormSale() {
  const api = Config.urlApi;
  const img = Urlimage.url;
  const navigate = useNavigate();
  const headleBack = () => {
    navigate(`/home`);
  }
  const handleGoBack = () => {
    navigate(-1);
  };
  const userId = localStorage.getItem('user_uuid')
  const barnchId = localStorage.getItem('branch_Id')
  const inputRef = useRef(null);
  const [itemZone, setItemZone] = useState([]);
  const fetchZone = async () => {
    try {
      const response = await fetch(api + 'zone/');
      const jsonData = await response.json();
      setItemZone(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  const [showpay, setShowPay] = useState(false);
  const [show, setShow] = useState(true);
  const handleModal = (index) => {
    setShow(index);
  }
  const [datasaerch, setDatasearch] = useState({
    userSale_id: ''
  })
  const headleCheng = (name, value) => {
    setDatasearch({
      ...datasaerch, [name]: value
    })
  }

  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    staff_uuid: '',
    id_code: ''
  })

  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState(false);
  const heandleSearch = (e) => {
    e.preventDefault();
    axios.post(api + 'staff/search', datasaerch)
      .then(function (res) {
        if (res.status === 200) {
          setShow(false);
          setError(false)
          setData({
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            staff_uuid: res.data.staff_uuid,
            id_code: res.data.id_code
          })
          setStaffId(res.data.staff_uuid)
        } else {
          alert(res.data.message || 'An error occurred');
        }
      })
      .catch(function (error) {
        setError(true)
        // alert('An error occurred while searching staff');
      });
  }

  const [check, setCheck] = useState(true);
  const openSearch = (index) => {
    setCheck(index);
  }
  const [active, setActive] = useState('')
  const [datasearch, setDataSearch] = useState({
    zoneId: '',
    posductName: ''
  })
  const handleCheck = (name, value) => {
    setDataSearch({
      ...datasearch, [name]: value// Reset posductName
    });
    setActive(value);
    fetchStockPorduct();
  };

  const handleCheckAll = () => {
    setDataSearch({
      zoneId: '',
      posductName: ''
    });
    setActive('')
  }

  const [filterName, setFilterName] = useState([])
  const [itempos, setItemProduct] = useState([]);
  const fetchStockPorduct = async () => {
    try {
      const response = await axios.post(api + 'posd/itemsale', datasearch);
      const jsonData = response.data;
      setItemProduct(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  }
  const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setFilter(event)
    setItemProduct(filterName.filter(n =>
      n.tile_name.toLowerCase().includes(event.toLowerCase()) || // Filter by tile_name
      n.code_id.toLowerCase().includes(event.toLowerCase()) // Filter by code_id
    ));
  }

  const [images, setImages] = useState('/assets/img/icon/picture.jpg')

  const heandlePlus = (id) => {
    axios.get(api + `order/pluscart/${id}`).then(function (resp) {
      if (resp.status === 200) {
        fetchItemCart();
        showMessage(resp.data.message, 'success');
      } else {
        showMessage(resp.data.message, 'error');
      }
    }).catch(function () {
      showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
    });
  }

  const heandleMinus = (id) => {
    axios.get(api + `order/minuscart/${id}`)
      .then(function (resp) {
        if (resp.status === 200) {
          fetchItemCart();
          showMessage(resp.data.message, 'success');
        } else {
          showMessage(resp.data.message, 'error');
        }
      }).catch(function () {
        showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
      });
  }

  const heandleDel = (id) => {
    axios.get(api + `order/delcart/${id}`)
      .then(function (resp) {
        if (resp.status === 200) {
          fetchItemCart();
          showMessage(resp.data.message, 'success');
        } else {
          showMessage(resp.data.message, 'error');
        }
      }).catch(function () {
        showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
      });
  }

  const [dataps,setDataps]=useState({})

  const addOrderCart = (item) => {
    modalView(true)
    setDataps(item);
    setValues({
      type_id_fk:'',
    title_id_fk:item.tiles_id_fk,
    option_id_fk:item.option_id_fk,
    });

  }
  const [values,setValues]=useState({
    type_id_fk:'',
    title_id_fk:'',
    option_id_fk:'',
})
const [itemPattern,setItemPattern]=useState([])
  const fetchData = async ()=>{
    try {
        const response = await axios.post(api + 'pattern/', values);
        const jsonData = response.data;
        setItemPattern(jsonData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }


  const [pattern,setPattern]=useState(0);
 const addPattern=(price)=>{
  setPattern(price)
 }


const [orderQty,setOrderQty]=useState('1');

const confirmOrder=()=>{
  const dataOrder={
    product_id_fk: dataps.product_uuid,
    zone_id_fk: dataps.zone_id_fk,
    price_buy:dataps.price_buy,
    price_sale:dataps.price_sale,
    qty_grams:dataps.grams,
    patternPrice:pattern,
    order_qty:orderQty,
    staff_id_fk: data.staff_uuid,
    user_id_fk: userId
  };
    // console.log(dataOrder)
    if (dataps.quantity <= 0) {
      return showMessage('ສິນຄ້າໝົດແລ້ວ ກະລຸນາເລືອກໂຊນອື່ນ', 'error');
    }
    if (data.staff_uuid) {
      axios.post(api + 'order/create', dataOrder)
        .then(function (res) {
          if (res.status === 200) {
            showMessage(res.data.message, 'success');
            fetchItemCart();
            modalView(false);
            setPattern(0)
          } else {
            showMessage(res.data.message, 'error');
          }
        }).catch(function () {
          showMessage('ການເພີມສິນຄ້າໄດ້ການຜິດພາດ ທາງລະບົບ', 'error');
        });
    } else {
      setShow(true);
    }
}
 

//========= off add order ============ \\
  const [itemcart, setItemCart] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalPattern,setTotalPattern]=useState(0);
  const [balanceTotal,setBalanceTotal]=useState(0)
  const fetchItemCart = async () => {
    try {
      const response = await axios.get(api + 'order/itemcart/' + data.staff_uuid);
      const jsonData = response.data;
      setItemCart(jsonData);
      const items = jsonData.map(item => ({
        cart_id: item.cart_id,
        product_id_fk: item.product_uuid,
        zone_id_fk: item.zone_id_fk,
        order_qty: item.order_qty,
        qty_grams: (item.qty_grams * item.order_qty),
        price_sale: item.price_sale,
        price_buy: item.price_buy,
        price_pattern:item.price_pattern,
        staff_id_fk: item.staff_id_fk,
        user_id_fk: item.user_id_fk
      }));
      const balance = jsonData.reduce((acc, val) => acc + parseFloat(val.price_sale * (val.qty_grams * val.order_qty)), 0);
      const bnPattern = jsonData.reduce((acc, val) => acc + parseFloat(val.price_pattern * val.order_qty*val.qty_baht), 0);
      setTotalBalance(balance);
      setTotalPattern(bnPattern);
      setBalanceTotal(balance+bnPattern);
      setOrder(prevOrder => ({
        ...prevOrder,
        staff_id_fk: staffId,
        items: items
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGetSale = (index) => {
    setShowPay(index);
  };


  //=============================

  const [order, setOrder] = useState({
    user_id_fk: userId,
    staff_id_fk: staffId,
    branch_id_fk: barnchId,
    customId: '',
    cus_fname: '',
    cus_lname: '',
    cus_tel: '',
    cus_address: '',
    cus_remark: '',
    sale_remark: '',
    balance_total: '0',
    total_grams: '0',
    balance_cash: '0',
    balance_transfer: '0',
    balance_payment: '0',
    balance_return: '0',
    items: []
  });
  const [search, setSearch] = useState(false)
  const handleChange = (name, value) => {
    setOrder({
      ...order, [name]: value
    })
    if (name === 'cus_tel' && value) {
      setSearch(true);
      setItemCust([])
    } else {
      setSearch(false);

    }
    setDatacust({
      cusTel: value
    });
  }

  //==================== ບັນທຶກການຈ່າຍ
  const handlePayment = () => {
    // console.log(order);
    axios.post(api + 'order/payment', order)
      .then(function (res) {

        if (res.status === 200) {
          setData({
            first_name: '',
            last_name: '',
            staff_uuid: '',
            id_code: '',
          })
          setItemCart([])
          setShowPay(false);
          handleModal(true);
          showMessage(res.data.message, 'success');
          setCustom({
            customId: '',
            cus_fname: '',
            cus_lname: '',
            cus_tel: '',
            cus_address: '',
            sale_remark: '',
          });
          setOrder({
            alance_total: '0',
            total_grams: '0',
            balance_cash: '0',
            balance_transfer: '0',
            balance_payment: '0',
            balance_return: '0',
          })
          setBalanceReturn(0);
          
        } else {
          Alert.warningData(res.data.message)
        }
      }).catch(function () {
        Alert.errorData('ການດຳເນິນງານບໍ່ສຳເລັດ')
      });
  }
  //==========================
  const [balanceCash, setBalanceCash] = useState(0);
  const [balanceTransfer, setBalanceTransfer] = useState(0);
  const balancePayment = balanceCash + balanceTransfer;

  const [balanceReturn, setBalanceReturn] = useState(0)
  const handleCashChange = (name, value) => {
    const newCash = parseFloat(value.replace(/,/g, ''));
    setBalanceCash(isNaN(newCash) ? 0 : parseInt(newCash));
    setOrder({
      ...order, [name]: value
    });
  };

  const handleTransferChange = (name, value) => {
    const newTransfer = parseFloat(value.replace(/,/g, ''));
    setBalanceTransfer(isNaN(newTransfer) ? 0 : parseInt(newTransfer));
    setOrder({
      ...order, [name]: value
    });
  };

  //============= search customer 
  const [datacust, setDatacust] = useState({
    cusTel: ''
  })

  const [activeShow, setActiveShow] = useState('');
  const [itemCust, setItemCust] = useState([]);
  const handleSearchCust = async () => {
    try {
      const response = await axios.post(api + 'customer/search/', datacust);
      const jsonData = response.data;
      setItemCust(jsonData);
      if (jsonData.length > 0) {
        setActiveShow('show')
      } else {
        setActiveShow('');
        setCustom({
          customId: '',
          cus_fname: '',
          cus_lname: '',
          cus_address: '',
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [custom, setCustom] = useState({
    customId: '',
    cus_fname: '',
    cus_lname: '',
    cus_tel: '',
    cus_address: ''
  })

  const handleUsecust = (item) => {
    setCustom({
      customId: item.cus_uuid,
      cus_fname: item.cus_fname,
      cus_lname: item.cus_lname,
      cus_tel: item.cus_tel,
      cus_address: item.cus_address,
    });
    setActiveShow('')
  }


  // ===================== \\

  const toaster = useToaster();
  const [placement, setPlacement] = useState('topEnd');
  const showMessage = (messName, notifi) => {
    const message = (
      <Message showIcon type={notifi} closable>
        <strong>ຢືນຢັນ! </strong> {messName}
      </Message>
    );
    toaster.push(message, { placement });
  };

  const [checkOnly, setCheckOnly] = useState('')

  //====================
  const [showView, setShowView] = useState(false);
  const modalView = (index) => {
    setShowView(index)
  }
  //======================
  useEffect(() => {

    if (balancePayment >= balanceTotal) {
      setBalanceReturn(balancePayment - balanceTotal);
    } else {
      setBalanceReturn(0);
    }
    if (balanceCash >= balanceTotal) {
      setCheckOnly('readOnly');
      setBalanceTransfer(0)
    } else {
      setCheckOnly('');
    }
    fetchData()
    fetchStockPorduct();
    fetchZone();
    fetchItemCart();
    const handleKeyPress = (e) => {
      if (e.target.tagName !== "INPUT") {
        const input = inputRef.current;
        input.focus();
        input.value = e.key;
        e.preventDefault();
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };

  }, [datasearch, userId, barnchId, data, staffId, balancePayment, totalBalance, balanceCash, checkOnly,values])
  return (
    <>
      <div id="app" className="app app-content-full-height app-without-sidebar app-without-header">
        <div id="content" className="app-content p-0">
          <div className="pos pos-with-menu pos-with-sidebar" id="pos">
            <div className="pos-menu">
              <div className="logo text-center">
                <a href="javascript:;" onClick={headleBack}>
                  <div className="logo-img ">
                    <img src="/assets/img/logo/logo.png" className="w-60" alt="" />
                    {/* <i className="fa fa-bowl-rice" /> */}
                  </div>
                  <div className="logo-text">ຮ້ານຄຳ ວຽງຄຳ</div>
                </a>
              </div>



              <div className="nav-container">
                <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <span role='button' onClick={() => handleCheckAll()} className={`nav-link  ${active === '' ? 'active' : ''}`} >
                        <div className="nav-icon">
                          <i className="fa-solid fa-fw fa-dumpster" />
                        </div>
                        <div className="nav-text">ລວມທັງໝົດ</div>
                      </span>
                    </li>
                    {itemZone.map((val, key) =>
                      <li className="nav-item">
                        <span role='button' onClick={() => handleCheck('zoneId', val.zone_Id)} className={`nav-link ${active === val.zone_Id ? 'active' : ''}`} >
                          <div className="nav-icon">
                            <img src="/assets/img/icon/109970.png" width={50} alt="" />
                          </div>
                          <div className="nav-text fs-14px">{val.zone_name}</div>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pos-content">
              <div className="pos-content-container h-100">
                <div className="product-row">
                  {itempos.map((item, index) =>
                    <div className="product-container" >
                      <a href="javascript:;" onClick={() => addOrderCart(item)}
                        className={`product ${item.quantity <= 0 ? 'not-available ' : ''}`} >
                        <div className="img"
                          style={{
                            backgroundImage: `url('${item.file_image !== '' ? img + 'pos/' + item.file_image : images}')`
                          }} >
                          <span className="badge bg-primary rounded-bottom-0 rounded-end-b">{item.zone_name}</span>
                        </div>
                        <div className="text">
                          <div className="title">{item.tile_name} ( {item.code_id}  )</div>
                          <div className="price text-danger">{item.qty_baht}/{item.option_name}</div>
                          {item.quantity <= 0 && (
                            <div className="not-available-text">
                              <div>ສິນຄ້າໝົດ</div>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  )}

                </div>

                <div className="text-center ">
                  {check === true ? (
                    <div className="panel bg-default input-search">
                      <div className="panel-heading ">
                        <div className="panel-title">
                          <input type="text" onChange={(event) => Filter(event.target.value)} className='form-control form-control-lg border-blue text-center' placeholder='ຄົ້ນຫາ' />
                        </div>
                        <div className="panel-heading-btn pb-5">
                          <a href="javascript:;" onClick={() => openSearch(false)} className="btn btn-xs btn-icon btn-danger"><i className="fa fa-times"></i></a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a href="ajvascrpit:;" onClick={() => openSearch(true)} className="btn btn-primary btn-icon btn-lg  fixed-b">
                      <i className="fas fa-search fs-18px"></i>
                    </a>
                  )}

                </div>
              </div>
            </div>
            <div className="pos-sidebar">
              <div className="h-100 d-flex flex-column p-0">
                <div className="pos-sidebar-header ">
                  <div className="back-btn">
                    <button
                      type="button"
                      data-dismiss-className="pos-sidebar-mobile-toggled"
                      data-target="#pos"
                      className="btn border-0"
                    >
                      <i className="fa fa-chevron-left" />
                    </button>
                  </div>
                  <div className="icon text-plc">
                    <i className="fa-solid fa-user-tie text-plc"></i>
                  </div>
                  <div className="title">{data.first_name + ' ' + data.last_name}</div>
                  <div className="order">
                    ID: <b>{data.id_code}</b>
                  </div>
                </div>
                <div className="pos-sidebar-nav"> </div>
                <div className="pos-sidebar-body "
                  data-scrollbar="true"
                  data-height="100%" >
                  <div className="pos-table">
                    {
                      itemcart.length > 0 ? (
                        itemcart.map((val, index) =>
                          <div className="row pos-table-row py-2">
                            <div className="col-9">
                              <div className="pos-product-thumb">
                                <div className="img"
                                  style={{ backgroundImage: `url('${val.file_image !== '' ? img + 'pos/' + val.file_image : images}')` }} />
                                <div className="info">
                                  <div className="title">{val.tile_name} ( {val.qty_baht + ' ' + val.option_name} )</div>
                                 {val.price_pattern > 0?(
                                   <div className='desc text-green'>+{numeral((val.price_pattern*val.order_qty)*val.qty_baht).format('0,00')}</div>
                                 ):('')}
                                 
                                  <div className="single-price">ໂຊນ: <span className=' text-primary'> {val.zone_name}</span></div>
                                  <div className="input-group qty">
                                    <div className="input-group-append">
                                      <span role='button' onClick={() => heandleMinus(val.cart_id)} className="btn btn-danger">
                                        <i className="fa fa-minus" />
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={val.order_qty}
                                    />
                                    <div className="input-group-prepend">
                                      <span role='button' onClick={() => heandlePlus(val.cart_id)} className="btn btn-success">
                                        <i className="fa fa-plus" />
                                      </span>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-3 total-price">
                              <div>
                                <span role='button' onClick={() => heandleDel(val.cart_id)} className="btn btn-xs btn-danger">
                                  <i className="fa-solid fa-trash"></i>
                                </span>
                              </div>
                              <div>{numeral(((val.price_sale * val.qty_grams) * val.order_qty)+((val.price_pattern*val.order_qty)*val.qty_baht)).format('0,00')}</div>
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className='text-center mt-5'>
                            <img src="assets/img/icon/emptyCart.png" className='mt-3 w-70' alt="" />
                          </div>
                        </>
                      )
                    }


                  </div>
                  {/* </div> */}

                </div>
                <div className="pos-sidebar-footer">
                  <div className="d-flex align-items-center mb-2">
                    <div> ທັງໝົດ</div>
                    <div className="flex-1 text-end h6 mb-0">{numeral(totalBalance).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div> ລວມຄ່າລາຍ</div>
                    <div className="flex-1 text-end h6 mb-0">{numeral(totalPattern).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div>ອາກອນ (0%)</div>
                    <div className="flex-1 text-end h6 mb-0">0.00</div>
                  </div>
                  <hr className="opacity-1 my-10px" />
                  <div className="d-flex align-items-center mb-2">
                    <div>ລວມທັງໝົດ</div>
                    <div className="flex-1 text-end h4 mb-0 text-gold fw-bold">{numeral(totalBalance+totalPattern).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <button type='button' onClick={() => handleModal(true)} className="btn btn-danger rounded-3 text-center me-10px w-70px"  >
                      <i className="fa-solid fa-user-tie d-block fs-18px my-1"></i> ພະນັກງານ
                    </button>
                    <button type='button' className="btn btn-green rounded-3 text-center me-10px w-70px" >
                      <i className="fa fa-receipt d-block fs-18px my-1" /> ພີມບິນ
                    </button>
                    <button type='button' onClick={() => handleGetSale(true)} className={`btn btn-theme rounded-3 text-center flex-1 ${itemcart.length > 0 ? '' : 'disabled'}`}  >
                      <i className="fa-solid fa-hand-holding-dollar d-block fs-18px my-1"></i>
                      ຮັບເງິນ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span role='button'
            className="pos-mobile-sidebar-toggler"
            data-toggle-className="pos-sidebar-mobile-toggled"
            data-target="#pos" >
            <i className="fa-solid fa-cart-plus fs-25px iconify display-6" ></i>
            <span className="badge">{itemcart.length}</span>
          </span>
        </div>
      </div>

      <Modal show={show} backdrop="static" centered  >
        <Modal.Body className='p-4'>
          <div className="row pt-3">
            <div className="col-sm-12 ">
              <form onSubmit={heandleSearch}>
                <div className=" text-center mb-4">
                  <img src="/assets/img/user/user.png" alt="" className="mw-100 w-120px rounded-pill " />
                </div>
                <div className="from-group text-center mb-4">
                  <label htmlFor="" className='form-label fs-16px'>ລະຫັດພະນັກງານ</label>
                  <input type="text" ref={inputRef} autoFocus onChange={(e) => headleCheng('userSale_id', e.target.value)} className='form-control form-control-lg fs-18px border-blue text-center my-input' placeholder='|||||||||||||||||||||||||||||||||' required />
                </div>
              </form>
              <p className='text-center mb-2'><a href='home'  className='text-h-red'><i className="fa-solid fa-hand-point-left"></i>  ຍ້ອນກັບ</a></p>
              {error === true && (
                <div className="alert alert-warning alert-dismissible fade show mb-0">
                  <i className="fa-solid fa-circle-exclamation fa-xl"></i> ລະຫັດພະນັກງານບໍ່ຖຶກຕ້ອງ
                  {/* <button type="button" className="btn-close" data-bs-dismiss="alert"></button> */}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showpay} size='xl' backdrop="static" className='modal-pos' centered  >
        <Modal.Body className='p-0'>
          <>
            <a href="javascript:;" onClick={() => handleGetSale(false)} className="btn-close position-absolute top-0 end-0 m-4" />
            <div className="modal-pos-product">
              <div className="modal-pos-product-img p-3 border-end border-2">
                <div className="fs-4 fw-bold"><i className="fa-solid fa-users me-2 text-danger"></i> ຂໍ້ມູນລູກຄ້າ</div>
                <hr className='mt-2' />
                <div className="row">
                  <div className="col-sm-12 mb-2">
                    <div className="from-groupmb-4" >
                      <label htmlFor="" className='form-label fs-14px'>ເບີໂທລະສັບ</label>
                      <input type="text" className='hide' value={order.customId = custom.customId} />
                      <InputGroup>
                        <Input type="tel" className='' defaultValue={order.cus_tel || custom.cus_tel} onChange={(e) => handleChange('cus_tel', e)} name='cus_tel' placeholder='ເບໂທລະສັບ' />
                        {search && (
                          <InputGroup.Button onClick={handleSearchCust}>
                            <i className="fas fa-search"></i>
                          </InputGroup.Button>
                        )
                        }
                      </InputGroup>
                      <ul className={`dropdown-menu dropdown-menu-end ${activeShow}`}>

                        {
                          itemCust.length > 0 ? (
                            itemCust.map((role, key) => (
                              <li role='button' key={key} onClick={() => handleUsecust(role)} className='dropdown-item text-h-red'><i className="fa-solid fa-phone"></i> : {role.cus_tel} / {role.cus_fname + ' ' + role.cus_lname}</li>
                            ))
                          ) : ('')}

                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ຊື່ລູກຄ້າ</label>
                      <Input type="text" className='' value={order.cus_fname || custom.cus_fname} onChange={(e) => handleChange('cus_fname', e)} name='cus_fname' placeholder='ຊື່ລູກຄ້າ' />
                    </div>
                  </div>
                  <div className="col-sm-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ນາມສະກຸນ</label>
                      <Input type="text" className='' value={order.cus_lname || custom.cus_lname} onChange={(e) => handleChange('cus_lname', e)} name='cus_lname' placeholder='ນາມສະກຸນ' />
                    </div>
                  </div>
                  <div className="col-sm-12 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ທີ່ຢູ່ປະຈຸບັນ</label>
                      {/* <textarea  onChange={(e)=>handleChange('cus_address',e)} name="cus_address" placeholder='ທີ່ຢູ່ປະຈຸບັນ' className='form-control' rows="2"></textarea> */}
                      <Input className='py-3  fs-14px' value={order.cus_address || custom.cus_address} onChange={(e) => handleChange('cus_address', e)} name="cus_address" placeholder='ທີ່ຢູ່ປະຈຸບັນ' />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-pos-product-info">
                <div className="fs-4 fw-bold">ລາຍການສິນຄ້າ</div>
                <hr />
                <div className="option-list mb-2">
                  <table className='table text-nowrap'>
                    <body >

                      {itemcart.map((val, index) =>
                        <tr>
                          <td className='text-center' width={'2%'}>{index + 1} </td>
                          <td width={'3%'} className='with-img dt-type-numeric'>
                            <img src={val.file_image !== '' ? img + 'pos/' + val.file_image : 'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' alt="" />
                          </td>
                          <td>{val.tile_name + ' ' + val.qty_baht + '  ' + val.option_name}</td>
                          <td>{val.order_qty + ' / ' + val.unite_name}</td>
                          <td className='text-end'>{(val.qty_baht * val.qty_grams)} g</td>
                          <td className='text-end'>+ {numeral(val.price_pattern * val.order_qty*val.qty_baht).format('0,00')}</td>
                          <td className='text-end'>{numeral(((val.price_sale * val.qty_grams) * val.order_qty)+val.price_pattern * val.order_qty*val.qty_baht).format('0,00')}</td>
                        </tr>
                      )}
                      <tr className='fs-18px'>
                        <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ :</td>
                        <td className='text-end text-danger'>{itemcart.reduce((acc, val) => acc + parseFloat(val.qty_grams * val.order_qty), 0)} g</td>
                        <td colSpan={2} className='text-end text-gold bg-black'>{numeral(totalBalance+totalPattern).format('0,00')}</td>
                      </tr>
                    </body>
                  </table>
                </div>
                <div className="row fs-16px">
                  <div className="col-sm-6 mb-2">
                    <label htmlFor="" className='form-label'>ຮັບເງິນສົດ</label>
                    <Input size='lg' value={numeral(order.balance_cash).format('0,00')} onChange={(e) => handleCashChange('balance_cash', e)} className='bg-lime-100' placeholder='0.00' />
                  </div>
                  <div className="col-sm-6 mb-2">
                    <label htmlFor="" className='form-label'>ຮັບເງິນໂອນ</label>
                    <Input size='lg' value={numeral(order.balance_transfer).format('0,00')} onChange={(e) => handleTransferChange('balance_transfer', e)} className='bg-lime-100' readOnly={checkOnly} placeholder='0.00' />
                  </div>
                  <div className="col-sm-12 mb-2">
                    <input type="text" value={order.balance_payment = balancePayment} className='hide' />
                    <label htmlFor="" className='form-label'>ເງິນທອນ</label>
                    <Input size='lg' value={numeral(order.balance_return = balanceReturn).format('0,00')} placeholder='0.00' className='bg-orange-100' readOnly />
                  </div>
                  <div className="col-sm-12">
                    <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                    <input type="text" value={order.total_grams = itemcart.reduce((acc, val) => acc + parseFloat(val.qty_grams * val.order_qty), 0)} className='hide' />
                    <input type="text" value={order.balance_total = balanceTotal} className='hide' />
                    <Input name="sale_remark" onChange={(e) => handleChange('sale_remark', e)} id="" className='fs-14px py-3' placeholder='ໝາຍເຫດ' />
                  </div>
                </div>
                <hr />
                <div className="row gx-3">
                  <div className="col-4">
                    <button type='button' onClick={() => handleGetSale(false)} className="btn btn-danger w-100 fs-14px rounded-3 fw-bold mb-0 d-block py-3"  >
                      <i className="fa-solid fa-rotate-left"></i> ຍົກເລິກ
                    </button>
                  </div>
                  <div className="col-8">
                    <button type='submit' onClick={handlePayment} className="btn btn-theme w-100 fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0">
                      ບັນທຶກຂາຍ <i className="fa fa-check ms-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>

        </Modal.Body>
      </Modal>


      <Modal size='lg' show={showView} onHide={() => modalView(false)} animation={false} className=' modal-pos'>
        <Modal.Body className='p-0'>
          <span role='button' onClick={() => modalView(false)} class="btn-close position-absolute top-0 end-0 m-4"></span>
          <div class="modal-pos-product">
            <div class="modal-pos-product-img">
              <div
                className="img"
                style={{ backgroundImage: `url('${dataps.file_image !== '' ? img + 'pos/' + dataps.file_image : images}')` }}
              />
            </div>
            <div class="modal-pos-product-info">
              <div class="fs-4 fw-bold">{dataps.tile_name +' '+ dataps.qty_baht +' '+ dataps.option_name} ( {dataps.code_id} )</div>
              <div class="fs-6 text-body text-opacity-50 mb-2">
               {dataps.zone_name} / ນ້ຳໜັກ: {dataps.grams} ກຣາມ
              </div>
              <div class="fs-3 fw-bolder mb-3">{numeral(dataps.grams*dataps.price_sale).format('0,00')} ກີບ</div>
              <div class="option-row">
              <div class="d-flex mb-3">
          <button type='button' onClick={() => setOrderQty(prevQty => Math.max(parseInt(prevQty) - 1, 1))}  class="btn btn-danger btn-sm d-flex align-items-center"><i class="fa fa-minus"></i></button>
          <input type="text" class="form-control w-40px fw-bold fs-5 px-0 mx-2 text-center border-0" name="qty"  value={orderQty > 0 ? orderQty : '1'} 
          onChange={(e) => setOrderQty(Math.max(parseInt(e.target.value), 1))} />
          <button type='button' onClick={() => setOrderQty(prevQty => parseInt(prevQty) + 1)} class="btn btn-green btn-sm d-flex align-items-center"><i class="fa fa-plus"></i></button>
        </div>
              </div>
              <hr />
              <div class="mb-3">
                <div class="fw-bold fs-6">ລາຍ</div>
                <div class="option-list">
                  <div class="option " >
                    <input type="radio" id="size" name="size[]" onChange={()=>setPattern('0')} class="option-input"  />
                    <label class="option-label bg-black-100" for="size" role='button'>
                      <span class="option-text">ບໍ່ມີຄ່າລາຍ</span>
                      <span class="option-price">+0.00</span>
                    </label>
                  </div>
                  {itemPattern.map((item, key) => (
                  <div key={key} class="option" role='button'>
                    <input type="radio" id={`size${key+1}`} name='size[]' onChange={()=>setPattern(item.pattern_pirce)} class="option-input" />
                    <label class="option-label" for={`size${key+1}`} role='button'>
                      <span class="option-text">{item.pattern_name}</span>
                      <span class="option-price">+{numeral(item.pattern_pirce).format('0,00') }</span>
                    </label>
                  </div>
                  ))}
                </div>
              </div>
              
              <hr />
              <div class="row gx-3">
                <div class="col-4">
                  <button type='button' class="btn btn-danger w-100 fs-14px rounded-3 fw-bold mb-0 d-block py-3" onClick={() => modalView(false)}>ຍົກເລີກ</button>
                </div>
                <div class="col-8">
                  <button type='button' onClick={confirmOrder} class="btn btn-theme w-100 fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0">ເພີ່ມກະຕ່າ <i class="fa fa-plus ms-3"></i></button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default FormSale