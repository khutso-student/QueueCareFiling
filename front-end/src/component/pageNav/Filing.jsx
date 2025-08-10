import React, { useState, useEffect } from "react";
import { IoAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  getAllFilings,
  createFiling,
  updateFiling,
  deleteFiling,
} from "../../services/filingAPI";

const Provinces = [
  "Gauteng",
  "Limpopo",
  "NorthWest",
  "FreeState",
  "WesternCape",
  "KwazuluNatala",
  "EasternCape",
  "Mpumalanga",
  "NorthCape",
];

  // Helper function to parse filingRow
function parseFilingRow(filingRow) {
  const letterPart = filingRow.match(/[A-Za-z]+/)?.[0] || "";
  const numberPartStr = filingRow.match(/\d+/)?.[0] || "";
  const numberPart = numberPartStr ? parseInt(numberPartStr, 10) : null;
  return { letterPart, numberPart };
}

export default function Filing() {
    const [showForm, setShowForm] = useState(false);
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRow, setFilterRow] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);


  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    province: "",
    email: "",
    phoneNumber: "",
    postalCode: "",
    filingRowPart: "",
    filingColumnPart: "",
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getAllFilings();

      // Ensure all DOBs are in YYYY-MM-DD format
      const formattedData = data.map(file => ({
        ...file,
        dateOfBirth: file.dateOfBirth
          ? new Date(file.dateOfBirth).toISOString().split("T")[0]
          : ""
      }));

      setFiles(formattedData);
    } catch (err) {
      console.error(err);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedFilingRow = formData.filingRowPart + formData.filingColumnPart;

    const finalData = {
        ...formData,
        filingRow: combinedFilingRow,
    };

    delete finalData.filingRowPart;
    delete finalData.filingColumnPart;

    try {
        if (isEditing && editingId) {
        await updateFiling(editingId, finalData);
        } else {
        await createFiling(finalData);
        }

        // Reset state after submit
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
        fullName: "",
        idNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        province: "",
        email: "",
        phoneNumber: "",
        postalCode: "",
        filingRowPart: "",
        filingColumnPart: "",
        });
        fetchFiles();
    } catch (err) {
        console.error(err);
    }
    };

    const handleEdit = (file) => {
        const rowPart = file.filingRow.match(/[A-Za-z]+/)?.[0] || "";
        const colPart = file.filingRow.match(/\d+/)?.[0] || "";

        setFormData({
            ...file,
            filingRowPart: rowPart,
            filingColumnPart: colPart,
        });
        setEditingId(file._id);
        setIsEditing(true);
        setShowForm(true);
    };



    const handleDelete = async (id) => {
    // if (!admin) return alert("Only admins can delete appointments.");
    try {
      await deleteFiling(id);
      fetchFiles();
    } catch (err) {
      console.error("Error deleting File", err);
    }
  };

  // Filter files by search term (in fullName or idNumber) and filingRow filter
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.idNumber.includes(searchTerm);
    const matchesRow =
      !filterRow || file.filingRow.toLowerCase().startsWith(filterRow.toLowerCase());
    return matchesSearch && matchesRow;
  });



// Sort filtered files before rendering
const sortedFiles = filteredFiles.slice().sort((a, b) => {
  const aRow = parseFilingRow(a.filingRow || "");
  const bRow = parseFilingRow(b.filingRow || "");

  if (aRow.letterPart < bRow.letterPart) return -1;
  if (aRow.letterPart > bRow.letterPart) return 1;

  // Treat null numberPart as greater to put "A" after "A01"
  if (aRow.numberPart === null && bRow.numberPart !== null) return 1;
  if (aRow.numberPart !== null && bRow.numberPart === null) return -1;

  if (aRow.numberPart === null && bRow.numberPart === null) return 0;

  return aRow.numberPart - bRow.numberPart;
});


  return (
    <div className="flex flex-col w-full h-full p-2 overflow-x-auto">
      <h1 className="text-[#3D3A3A] text-xl sm:text-[30px] font-semibold">
        QueueCare Filing
      </h1>
      <p className="text-[#535050] text-sm sm:text-md mb-4">
        Add and update patient files
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 mb-4 p-3 rounded-md">
        <input
          type="search"
          placeholder="Search by full name or ID number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white border border-[#c7c7c7] w-full sm:w-1/3 py-2 px-4 text-sm rounded-lg focus:outline-[#c2c1c1]"
        />

        <input
          type="text"
          placeholder="Filter by Filing Row (e.g., A or A01)"
          value={filterRow}
          onChange={(e) => setFilterRow(e.target.value)}
          className="bg-white w-full border border-[#c7c7c7] sm:w-1/4 py-2 px-4 text-sm rounded-lg focus:outline-[#c2c1c1]"
        />

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex justify-center items-center gap-2 bg-[#1FBEC3] hover:bg-[#097c80] text-white text-sm py-2 px-4 rounded-md duration-300 cursor-pointer whitespace-nowrap"
        >
          <IoAddSharp /> Add File
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          className="fixed top-0 left-0 bg-[#00000094] w-full h-full flex justify-center items-center z-50 p-3"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:w-120 h-120 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] scrollbar-hide"

          >
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="ID Number"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
                className="text-sm border rounded p-2"
                required
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="text-sm border rounded p-2"
                required
              />
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="text-sm border rounded p-2"
                required
              >
                <option value="">Select Province</option>
                {Provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="filingRowPart"
                value={formData.filingRowPart}
                onChange={handleChange}
                placeholder="Filing Row (e.g., A)"
                className="text-sm border rounded p-2"
                required
              />
              <input
                name="filingColumnPart"
                value={formData.filingColumnPart}
                onChange={handleChange}
                placeholder="Filing Column (e.g., 01)"
                className="text-sm border rounded p-2"
                required
              />
              <div className="flex justify-end items-center gap-2 w-full mt-2">
                <button
                    type="submit"
                    className="bg-[#1FBEC3] hover:bg-[#0e8d91] text-white text-sm py-1.5 px-2 rounded duration-300"
                    >
                    {isEditing ? "Update File" : "Save File"}
                </button>

                <button onClick={() => setShowForm(false)}
                className="bg-[#292828] hover:bg-black text-white text-sm py-1.5 px-2 rounded duration-300">
                        Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Files Grid */}
    <div className="w-full mt-2">
  {filteredFiles.length === 0 ? (
    <div className="w-full text-center py-6 text-[#999] italic text-sm sm:text-md">
      No file available
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {sortedFiles.map((file) => {
            const filingRow = file.filingRow || "";
            const rowPart = filingRow.charAt(0);
            const colPart = filingRow.slice(1);

        return(
             <div
            key={file._id}
            className="flex flex-col justify-center bg-white rounded-md p-4 shadow-sm border border-[#c2c0c0] w-full mx-auto"
          >
            <div className="flex justify-between w-full mb-3">
              <h1 className="text-[#3D3A3A] text-lg font-bold">{rowPart}</h1>
              <div className="flex justify-center items-center w-12 h-7 bg-[#A8E6E8] rounded-full">
                <h1 className="text-[#0f7275] font-bold">{colPart}</h1>
              </div>
            </div>
            <h1 className="text-[#3D3A3A] font-bold mb-2">{file.fullName}</h1>
            <p className="text-sm text-[#535050] mb-1">{file.idNumber}</p>
            <p className="text-sm text-[#535050] mb-1">{file.gender}</p>
            <p className="text-sm text-[#535050] mb-1">
              {file.dateOfBirth
                ? new Date(file.dateOfBirth).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
          </p>
            <p className="text-sm text-[#535050] mb-1">{file.address}</p>
            <p className="text-sm text-[#535050] mb-1">{file.province}</p>
            <p className="text-sm text-[#535050] mb-1">{file.email}</p>
            <p className="text-sm text-[#535050] mb-1">{file.phoneNumber}</p>
            <p className="text-sm text-[#535050] mb-1">
              {file.createdAt && new Date(file.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-[#535050] mb-3">
              Created by: {file.createdBy?.fullName || file.createdBy?.email || "Unknown"}
            </p>
            <div className="w-full flex justify-end gap-2">
              <button  onClick={() => handleEdit(file)}
               className="flex justify-center items-center bg-[#A8E6E8] hover:bg-[#0b7c809c] cursor-pointer text-[#0f797c] w-8 h-6 rounded-full duration-300">
                <MdEdit />
              </button>
              <button  onClick={() => handleDelete(file._id)}
               className="flex justify-center items-center bg-[#FEB4B4] hover:bg-[#be08088a] cursor-pointer text-[#DA2C2C] w-8 h-6 rounded-full duration-300">
                <RiDeleteBinLine />
              </button>
            </div>
          </div>
        )
      } )}
    </div>
  )}
</div>
    </div>
  );
}



