import React, { useContext, useEffect, useState } from 'react';
import AreaFilingChart from '../AreaChats';
import PieChartGender from '../PieCHart';
import { AuthContext } from '../../context/AuthContext';

import { MdOutlinePersonalInjury } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";
import { LiaFemaleSolid } from "react-icons/lia";
import { LiaMaleSolid } from "react-icons/lia";
import { LuHouse } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

const StartCard = ({ bg, icon, IconColor, label, value }) => (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-2 bg-white  h-24 py-4 px-5 border border-[#c9c9c9] rounded-lg hover:shadow-sm duration-300">
        <div style={{ backgroundColor: bg }} className="flex justify-center items-center  w-12 h-15 sm:h-12 rounded-lg">
            <div style={{ color: IconColor }} className="text-[26px]">
                {icon}
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[#535050] text-xs sm:text-sm">{label}</p>
            <h1 className="text-[#3D3A3A] font-bold">{value}</h1>
        </div>
    </div>
);

const ActionCard = ({
  title,
  description,
  icon: Icon,
  bgColor = "#30A3A6",
  textColor = "#FFFFFF"
}) => (
    <div className="flex flex-col justify-center w-full h-25 rounded-lg p-3 border border-[#c9c9c979]"
        style={{ backgroundColor: bgColor }}>
        {Icon && <Icon className="mb-2 text-xl" style={{ color: textColor }} />}
        <h1 className="font-bold" style={{ color: textColor }}>{title}</h1>
        <p className="text-sm font-light" style={{ color: textColor }}>{description}</p>
    </div>
);

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalFiles: 0,
        femaleCount: 0,
        maleCount: 0,
        monthlyFiles: [],
    });

    const genderData = [
    { name: 'Female', value: stats.femaleCount || 0 },
    { name: 'Male', value: stats.maleCount || 0 },
    ];



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");  // get the token

        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load dashboard stats: ${res.statusText}`);
        }

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error.message);
      }
        };

        if (user) {  // only fetch if user is logged in
        fetchStats();
        }
  }, [user]);
  return(
    <div className="flex flex-col w-full h-full py-1 px-2">
      <h1 className="text-[#3D3A3A] text-xl sm:text-[30px] font-semibold">
        QueueCare Filing Dashboard 
      </h1>
      <p className="text-[#535050] text-sm sm:text-md">
        Monitor and manage patient files
      </p>
      {/* QUICK STATS */}
      <div className="flex flex-col lg:flex-row gap-1 sm:gap-4 w-full">
        {/* right */}
        <div className="flex flex-col  w-full h-auto  py-3">
          <p className="text-[#535050] text-xs sm:text-md font-semibold mb-1">QUICK STATS</p>
          <div className="flex justify-between gap-3 sm:gap-1 mb-2 w-full h-auto py-1 overflow-x-auto md:overflow-x-visible scrollbar-hide whitespace-nowrap">
            <StartCard 
              bg='#CAEBEC'
              icon={<MdOutlinePersonalInjury />}
              IconColor='#1FBEC3'
              label='Number of Patients'
              value={stats.totalFiles} 
            />

            <StartCard 
              bg='#D4FFD7'
              icon={<RiArticleLine />}
              IconColor='#38B641'
              label='Number of Files'
              value={stats.totalFiles} 
            />

            <StartCard 
              bg='#E6B9EF'
              icon={<LiaFemaleSolid />}
              IconColor='#9505B2'
              label='Number of Females'
              value={stats.femaleCount} 
            />

            <StartCard 
              bg='#FEB4B4'
              icon={<LiaMaleSolid />}
              IconColor='#DA2C2C'
              label='Number of Males'
              value={stats.maleCount} 
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full h-auto py-4 mb-2 bg-white border border-[#c9c9c9] rounded-lg">
            <AreaFilingChart data={stats.monthlyFiles || []} />
            <PieChartGender data={genderData} />
          </div>
          <div className='hidden sm:flex justify-between items-center gap-2 p-1  w-full h-30 rounded-lg'>
            <ActionCard
              title="Dashboard"
              description="Track Your Filing Updates"
              icon={LuHouse}
              bgColor="#1ca0a5"
              textColor="#fff"
            />

            <ActionCard
              title="Filing"
              description="Handle Files"
              icon={MdOutlineArticle}
              bgColor="#E5E5E5"
              textColor="#888888"
            />

            <ActionCard
              title="Settings"
              description="Updates Your Profile"
              icon={IoSettingsOutline}
              bgColor="#E5E5E5"
              textColor="#888888"
            />
          </div>
        </div>

        {/* left */}
        <div className="w-full sm:w-90 h-full  px-2 py-3">
          <p className="text-[#535050] text-xs sm:text-md font-semibold mb-1">PROFILE </p>
          <div className="flex flex-col justify-center items-center w-full h-60 bg-white p-2 rounded-lg border border-[#c9c9c9]">
            <div className="bg-black w-25 h-25 rounded-full mb-2"></div>
            <h1 className="text-[#3D3A3A] text-[18px] font-bold mb-1">Khutso Makunyane</h1>
            <p className="text-[#535050] text-sm mb-2">khutsomakunyane1@gmail.com</p>
            <div className="bg-[#1fbec346] px-5 py-1 rounded-lg hover:bg-[#1fbec373] duration-300">
              <p className="text-[#1FBEC3] text-sm font-semibold">ADMIN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
