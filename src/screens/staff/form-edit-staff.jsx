import React,{useState,useEffect} from 'react'
import { Link,useParams,useLocation ,useNavigate} from 'react-router-dom'
import { Input, DatePicker, Button } from 'rsuite';
import axios from 'axios';
import { Config } from '../../config/connenct';
import Alert from '../../utils/config';
import Select from 'react-select'
import { useProvince } from '../../utils/selectOption';
import moment from 'moment';
function FormEditStaff() {
    const api=Config.urlApi;
    const itemPv=useProvince();
    // const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate()
   
    const handleProvice=(name,value)=>{
        showDistrict(value)
        setInputs({
            ...inputs, [name]: value
        });
    }
  
    
    // const [item,setItem]=useState({});
    const [inputs, setInputs] = useState({
        staff_uuid: id,
        first_name: '',
        last_name: '',
        gender: '',
        birthday: '',
        staff_tel: '',
        province_id_fk:'',
        district_id_fk:'',
        village_name:'',
        staff_email: '',
        staff_remark: '',
        register_date: ''
    });
    const fetchStaffs = async () => {
        try {
            const response = await fetch(api + 'staff/single/'+id);
            const jsonData = await response.json();
            showDistrict(jsonData.province_id_fk)
            setInputs({
                staff_uuid: id,
                first_name: jsonData.first_name,
                last_name: jsonData.last_name,
                gender: jsonData.gender,
                birthday: jsonData.birthday,
                staff_tel: jsonData.staff_tel,
                province_id_fk:jsonData.province_id_fk,
                district_id_fk:jsonData.district_id_fk,
                village_name:jsonData.village_name,
                staff_email: jsonData.staff_email,
                staff_remark: jsonData.staff_remark,
                register_date: jsonData.register_date,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    // const [pid,setPvid]=useState('');
    const [itemDistrict,setItemDistrict]=useState([]);
    const showDistrict = async (id) => {
        try {
          const response = await fetch(api + 'district/pv/'+id);
          const jsonData = await response.json();
          setItemDistrict(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      const itemDt = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));
    
    useEffect(() => {
        fetchStaffs();
    }, [id]);

    const handleChange = (name, value) => {
        setInputs({
            ...inputs,
            [name]: value
        });
        showDistrict(value)
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'staff/edit', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        Alert.successData(res.data.message);
                        navigate('/staff')
                    } else {
                        Alert.errorData(res.data.message)
                    }
                });
        } catch (error) {
            Alert.errorData('Error inserting data:', error)
            // console.error('Error inserting data:', error);
        }
    };


    const backPage=()=>{
        navigate('/staff')
    }
    return (
        <>
            <div id="content" className="app-content px-3">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item "><Link to={'/staff'}>ລາຍການພະນັກງານ</Link></li>
                    <li class="breadcrumb-item active">ແບບຟອມບັນທຶກຂໍ້ມູນ</li>
                </ol>
                <h1 className="page-header mb-3"><span role='button' onClick={backPage} className='text-danger me-2'><i class="fa-solid fa-circle-arrow-left"></i></span> ຟອມແກ້ໄຂຂໍ້ມູນພະນັກງານ</h1>
                <div className="panel panel-inverse" >
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ຊື່ພະນັກງານ </label>
                                    <input type="text" name='staff_uuid' value={inputs.staff_uuid} className='hide' />
                                    <Input type="text" name='first_name' value={inputs.first_name }  onChange={(e) => handleChange('first_name', e)} placeholder='ຊື່ພະນັກງານ' required />
                                </div>
                                <div className="col-sm-4  mb-2">
                                    <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                                    <Input type="text" name='last_name' value={inputs.last_name } onChange={(e) => handleChange('last_name', e)} placeholder='ນາມສະກຸນ' required />
                                </div>
                                <div className="col-sm-4  mb-2">
                                    <label htmlFor="" className='form-label'>ວັນເດືອນປິເກີດ</label>
                                    <DatePicker oneTap format="dd/MM/yyyy" name='birthday' value={new Date(inputs.birthday) } onChange={(e) => handleChange('birthday', e)} block placeholder="ວັນເດືອນປິເກີດ" required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ເລືອກແຂວງ</label>
                                    <Select options={itemPv} onChange={(e) => handleProvice('province_id_fk', e.value)} value={itemPv.find(obj => obj.value === inputs.province_id_fk)} block placeholder="ເລືອກແຂວງ" required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ເລືອກເມືອງ </label>
                                    <Select options={itemDt} onChange={(e) => handleChange('district_id_fk', e.value)} value={itemDt.find(obj => obj.value === inputs.district_id_fk)}  block placeholder="ເລືອກເມືອງ" required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ປ້ອນຊື່ບ້ານ</label>
                                    <Input onChange={(e) => handleChange('village_name', e)} value={inputs.village_name}  placeholder='ຊື່ບ້ານ' block required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                    <Input type="text" name='staff_tel' value={inputs.staff_tel} onChange={(e) => handleChange('staff_tel', e)} placeholder='020 ........' required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>Email</label>
                                    <Input type="text" name='staff_email' value={inputs.staff_email} onChange={(e) => handleChange('staff_email', e)} placeholder='****@gmail.com' />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ວັນທີເຂົ້າວຽກ </label>
                                    <DatePicker oneTap format="dd/MM/yyyy"  value={new Date(inputs.register_date)} name='register_date' onChange={(e) => handleChange('register_date', e)} block placeholder="ວັນເດືອນປິເກີດ" />
                                </div>

                                <div className="col-sm-12 mb-2">
                                    <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                                    <Input as="textarea" rows={3} name='staff_remark' value={inputs.staff_remark} onChange={(e) => handleChange('staff_remark', e)} placeholder='ໝາຍເຫດ.......' />
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <Button type='reset' color='red' appearance="primary" startIcon={<i class="fa-solid fa-arrows-rotate" />} block> ຍົກເລີກ</Button>
                                </div>
                                <div className="col-6">
                                    <Button type='submit' appearance="primary" block startIcon={<i class="fa-solid fa-floppy-disk" />}> ບັນທຶກ</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormEditStaff