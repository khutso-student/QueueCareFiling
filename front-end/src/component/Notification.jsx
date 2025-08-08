import React, { useState } from "react";
import { GoBell } from "react-icons/go";
export default function Notification() {
    const [model, setModel] = useState(false)
    return(
        <div onClick={() => setModel(!model)}
        className="relative flex justify-center items-center w-10 h-10 rounded-lg hover:bg-[#7976763a] cursor-pointer">
            <GoBell className="text-[23px] text-[#807e7e]" />

            {model && (
                <div className="absolute top-14 right-1 w-60 h-50 border border-[#cecece] bg-white rounded-lg">

                </div>
            )}
        </div>

    )
}