import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

function ListAlbum() {
  const [data, setData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAlbums = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/album/list`);
      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (err) {
      console.log("ERROR : ", err);
      console.log("error from ListAlbum.jsx in admin : ", err?.message);
      toast.error("Error occured");
    }
  }, [backendUrl]);

  const removeAlbum = async (e, id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/album/remove`, {
        id
      });
      if (response.data.success) {
        toast.success(response.data.message);
        // we will refetch the albums
        // await fetchAlbums();
        e.target.parentNode.remove();
      }
    } catch (err) {
      console.log("ERROR : ", err);
      console.log(
        "error from ListAlbum.jsx in admin for delete album : ",
        err?.message
      );
      toast.error("Error occured");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);
  return (
    <div>
      <p>All Album List</p>
      <br />
      <div className="mb-8">
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
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
                alt={`album-${item?._id}`}
              />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input
                type="color"
                className="hidden sm:block"
                value={item.bgColor}
                readOnly
              />
              <p
                onClick={(e) => removeAlbum(e, item?._id)}
                className="cursor-pointer"
              >
                X
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ListAlbum;
