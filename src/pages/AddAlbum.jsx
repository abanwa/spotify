import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

function AddAlbum() {
  const [image, setImage] = useState(false);
  const [color, setColor] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColor", color);

      const response = await axios.post(
        `${backendUrl}/api/album/add`,
        formData
      );
      if (response.data.success) {
        toast.success("Album added");
        setImage(false);
        setColor("#121212");
        setName("");
        setDesc("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      console.log("AddAlbum Admin error ", err?.message);
      toast.error("Error occured");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[80vh]">
        <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600 mb-8"
    >
      <div className="flex flex-col gap-4">
        <p>Upload Image</p>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          accept="image/*"
          hidden
        />
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            className="w-24 cursor-pointer"
            alt="upload_area"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album name</p>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album description</p>
        <input
          type="text"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p>Background Color</p>
        <input type="color" onChange={(e) => setColor(e.target.value)} />
      </div>

      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        Add
      </button>
    </form>
  );
}

export default AddAlbum;
