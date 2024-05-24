import { remove } from "lodash";
import React,{useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const Logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('branch_Id');
    navigate(`/login`);
  }
const userName=localStorage.getItem('username');
  useEffect(()=>{
  },[userName])
  return (
    <div id="header" className="app-header">
      <div className="navbar-header">
        <Link to={"home"} className="navbar-brand">
          <span className="navbar-logo">
            <img src="./assets/img/logo/logo.png" alt="logo"className="w-50px" />
          </span>
          <b className="me-1 text-gold">ຮ້ານຄຳ </b>
          <span className="text-white">ນາງວຽງຄຳ</span>
        </Link>
        <button
          type="button"
          className="navbar-mobile-toggler"
          data-toggle="app-top-menu-mobile"
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className="navbar-nav">
        <div className="navbar-item navbar-form">
          <form action="" method="POST" name="search">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter keyword"
              />
              <button type="submit" className="btn btn-search">
                <ion-icon name="search" />
              </button>
            </div>
          </form>
        </div>
    
        <div className="navbar-item navbar-user dropdown">
          <a href="javascript:;" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown" >
            <img src="/assets/img/user/user.png" alt="" />
            <span className="text-white">
              <span className="d-none d-md-inline">{userName}</span>
              {/* <b className="caret" /> */}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end me-1">
           
            {/* <div className="dropdown-divider" /> */}
            <a href="javascript:;" onClick={Logout} className="dropdown-item">
            <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
