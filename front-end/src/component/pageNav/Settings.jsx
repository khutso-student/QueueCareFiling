import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import api from '../../services/api';
import { MdModeEditOutline } from "react-icons/md";

export default function Settings() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [model, setModel] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    profileImage: "",
  });

  const [stats, setStats] = useState({
    totalFiles: 0,
    femaleCount: 0,
    maleCount: 0,
    monthlyFiles: [],
    filesCreatedByAdmin: 0,
     adminCount: 0,
  });

  // Fetch user profile
  useEffect(() => {
    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        const data = res.data;  // data is user object directly
        if (data) {
          setUser(data);
          setFormData(data);
          setPreviewImage(data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage && selectedImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, selectedImage]);

  // Fetch dashboard stats
  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const res = await api.get(`/dashboard/stats`);
        const data = res.data;
        if (data) setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, [userId]);

  // Upload profile image
  const handleUpload = async () => {
    if (!selectedImage || !userId) return;

    const uploadData = new FormData();
    uploadData.append("image", selectedImage);

    try {
      setLoading(true);
      const res = await api.post(`/uploads/upload-profile/${userId}`, uploadData);
      const data = res.data;  // updated user object directly
      if (data) {
        setUser(data);
        setPreviewImage(data.profileImage);
        alert("Profile image updated!");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (selectedImage) {
        await handleUpload();
      }

      const { name, email, role } = formData;

      const res = await api.put(`/users/${userId}`, { name, email, role });
      const updatedUser = res.data;  // updated user object directly

      setUser(updatedUser);
      setFormData(updatedUser);
      setPreviewImage(updatedUser.profileImage);
      setModel(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col w-110 h-105 bg-white rounded-lg p-2">
        {/* Banner */}
        <div className="flex justify-center items-center bg-[#1FBEC3] w-full h-30 rounded-lg">
          <h1 className="text-[#ffffff27] text-[40px] font-bold animate-bounce">
            QueueCare Filing
          </h1>
        </div>

        {/* Profile Image */}
        <div className="w-20 h-20 border-7 border-white ml-2 mb-2 mt-[-25px] rounded-full overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full"></div>
          )}
        </div>

        {/* Role */}
        <div className="flex justify-center items-center bg-[#A8E6E8] mb-2 w-25 h-6 rounded-xl">
          <h1 className="text-[#1FBEC3]">{user.role || "Admin"}</h1>
        </div>

        {/* Name, email, stats */}
        <h1 className="text-xl text-[#3D3A3A] mb-2 font-semibold">{user.name}</h1>
        <p className="text-sm text-[#535050] mb-2">{user.email}</p>
        <p className="text-sm text-[#535050] mb-2">
          Files created by you: {stats.filesCreatedByAdmin}
        </p>
        <p className="text-sm text-[#535050] mb-2">
          Total number of files: {stats.totalFiles}
        </p>
        <p className="text-sm text-[#535050] mb-2">
          Total number of Admins: {stats.adminCount}
        </p>

        {/* Buttons */}
        <div className='flex gap-2 w-full mt-2'>
          <button
            onClick={() => setModel(true)}
            className='flex justify-center items-center bg-[#A8E6E8] hover:bg-[#53d4d8d7] text-[#1FBEC3] text-sm w-10 h-8 rounded-lg cursor-pointer duration-300'
          >
            <MdModeEditOutline /> 
          </button>

          <button
            onClick={handleLogout}
            className='bg-red-200 hover:bg-red-300 w-20 h-8 text-red-600 text-sm rounded-lg cursor-pointer duration-300'
          >
            Logout
          </button>
        </div>

        {/* Modal for edit form */}
        {model && (
          <div
            onClick={() => setModel(false)}
            className='fixed top-0 left-0 w-full h-full bg-[#0000009f] flex justify-center items-center'
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='flex flex-col justify-center items-center bg-white w-90 p-4 rounded-lg'
            >
              <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

              {/* Image Preview + Upload */}
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full"></div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
              />

              {/* Form */}
              <form onSubmit={handleSave} className="flex flex-col gap-3 w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1FBEC3] hover:bg-[#18a4a8] text-white p-2 rounded"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
