import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ListSong() {
  const [data, setData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchSongs = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (err) {
      console.log("ERROR : ", err);
      console.log("error from ListSong.jsx in admin : ", err?.message);
      toast.error("Error occured");
    }
  }, [backendUrl]);

  const removeSong = async (e, id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/song/remove`, {
        id
      });
      if (response.data.success) {
        toast.success(response.data.message);

        // we will refetch the songs
        // await fetchSongs();
        e.target.parentNode.remove();
      }
    } catch (err) {
      console.log("ERROR : ", err);
      console.log(
        "error from ListSong.jsx in admin for delete song : ",
        err?.message
      );
      toast.error("Error occured");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);
  return (
    <div>
      <p>All Song List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.length > 0 &&
          data.map((item) => (
            <div
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
              key={item?._id}
            >
              <img
                src={item.image}
                className="w-12 hidden sm:block"
                alt={`song-${item?._id}`}
              />
              <p>{item.name}</p>
              <p>{item.album}</p>
              <p className="hidden sm:block">{item.duration}</p>
              <p
                className="cursor-pointer"
                onClick={(e) => removeSong(e, item?._id)}
              >
                X
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ListSong;
