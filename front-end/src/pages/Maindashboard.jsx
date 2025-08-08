import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Dashboard from '../component/pageNav/Dashboard';
import Filing from '../component/pageNav/Filing';
import Settings from '../component/pageNav/Settings';
import Notification from '../component/Notification';
import { AuthContext } from '../context/AuthContext';

import QueueCare from '../assets/Logo.svg';
import { LuHouse } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineArrowUturnRight } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";

export default function MainDasboard(){
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobile, setMobile] = useState(false);    

     const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

    const navButtonClass = (tabName) =>
    `flex justify-center items-center w-35 py-2 px-5 gap-2 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
      activeTab === tabName
        ? 'bg-[#1FBEC3] text-white'
        : 'text-gray-500 hover:bg-[#1ca0a5] hover:text-white'
    }`;

    const handleLogout = () => {
        logout();
        navigate('/login'); 
  };

    return(
        <div className="flex flex-col bg-[#F2F6FF] w-full h-screen ">
            <div className='flex justify-between items-center w-full gap-2 h-18 bg-white p-2'>
                {/* log */}
                <a href="">
                <img src={QueueCare} className='w-30 sm:w-35' alt="QueueCare Logo" />
                </a>
                {/* headers */}
                <div className='hidden md:flex w-100 justify-center  gap-4 items-center p-3'>
                    <button onClick={() => handleTabChange('Dashboard')}
                        className={navButtonClass('Dashboard')}>
                       <LuHouse /> Dashboard
                    </button>

                    <button onClick={() => handleTabChange('Filing')}
                         className={navButtonClass('Filing')}>
                       <MdOutlineArticle /> Filing
                    </button>

                     <button onClick={() => handleTabChange('Settings')}
                         className={navButtonClass('Settings')}>
                      <IoSettingsOutline />  Settings
                    </button>

                    <button onClick={handleLogout}
                    className='flex justify-center items-center w-35 py-2 px-5 gap-2 text-[#747272] text-sm rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-[#1ca0a5] hover:text-white' >
                        <HiOutlineArrowUturnRight /> Logout
                    </button>
                </div>
                {/* Notification */}
                <div className='flex justify-center items-center gap-2 w-auto p-2'>
                    <Notification />
                    <div className='bg-black w-8 h-8 rounded-full'></div>
                    <div className="md:hidden flex justify-center items-center">
                       <button onClick={() => setMobile(!mobile)}
                       className='flex justify-center items-center  text-white w-8 h-8 bg-[#1FBEC3] rounded-full'>
                        <RxHamburgerMenu />
                       </button>
                    </div>
                </div>
                {mobile && (
                    <div className="fixed inset-0 z-50 flex">
                            {/* Overlay */}
                        <div
                            className="w-full h-full bg-[#00000080]"
                            onClick={() => setMobile(false)}
                        ></div>

                            {/* Sliding Side Nav */}
                            <div
                            className={`fixed top-0 left-0 h-full bg-white w-0 transition-all duration-300 ease-in-out ${
                                mobile ? 'w-50' : 'w-0'
                            } flex flex-col gap-2 py-2 px-2.5 shadow-lg`}
                            >
                            {/* Close button */}
                            <button
                                className="flex justify-center items-center  w-8 h-8 rounded-lg self-end bg-[#1FBEC3] text-[#fff] text-lg"
                                onClick={() => setMobile(false)}
                            >
                             <GrClose />
                            </button>

                            <p className='text-[#535050] text-xs'>
                                MENU
                            </p>

                            {/* Nav Items */}
                            <button
                                onClick={() => {
                                handleTabChange('Dashboard');
                                setMobile(false);
                                }}
                                className={`${navButtonClass('Dashboard')} w-full justify-start`}
                            >
                                <LuHouse /> Dashboard
                            </button>

                            <button
                                onClick={() => {
                                handleTabChange('Filing');
                                setMobile(false);
                                }}
                                className={`${navButtonClass('Filing')} w-full justify-start`}
                            >
                                <MdOutlineArticle /> Filing
                            </button>

                            <button
                                onClick={() => {
                                handleTabChange('Settings');
                                setMobile(false);
                                }}
                                className={`${navButtonClass('Settings')} w-full justify-start`}
                            >
                                <IoSettingsOutline /> Settings
                            </button>

                            <button
                                onClick={() => {
                                handleLogout();
                                setMobile(false);
                                }}
                                className="w-full flex items-center justify-start gap-2 text-[#747272] text-sm rounded-lg hover:bg-[#1ca0a5] hover:text-white py-2 px-5"
                            >
                                <HiOutlineArrowUturnRight /> Logout
                            </button>
                            </div>

                    </div>
                    )}

            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'Dashboard' && <Dashboard />}
                {activeTab === 'Filing' && <Filing />}
                {activeTab === 'Settings' && <Settings />}
            </div>
        </div>
    )
}