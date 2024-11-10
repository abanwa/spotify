import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

function AddSong() {
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);

      // call the API to add the song to our database
      const response = await axios.post(`${backendUrl}/api/song/add`, formData);
      // we will check the success response
      if (response.data.success) {
        toast.success("song added");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      console.log("AddSong Admin error ", err?.message);
      toast.error("Error occured");
    }

    setLoading(false);
  };

  const loadAlbumData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error("Unable to load album data");
      }
    } catch (err) {
      console.log("ERROR : ", err);
      console.log(
        "error from AddSong.jsx in admin when loading loadAlbumData : ",
        err?.message
      );
      toast.error("Error occured");
    }
  }, [backendUrl]);

  useEffect(() => {
    loadAlbumData();
  }, [loadAlbumData]);

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
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>Upload song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              className="w-24 cursor-pointer"
              alt="upload_song"
            />
          </label>
        </div>
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
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Song description</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          onChange={(e) => setAlbum(e.target.value)}
          defaultValue={album}
          className="bg-transparent  outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {albumData.length > 0 &&
            albumData.map((item) => (
              <option value={item.name} key={item?._id}>
                {item.name}
              </option>
            ))}
        </select>
      </div>

      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
}

export default AddSong;
