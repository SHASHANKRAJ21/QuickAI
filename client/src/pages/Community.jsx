import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // Fetch published creations
  const fetchCreation = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch creations.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle like
  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreation(); // refresh likes
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to toggle like.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreation();
    }
  }, [user]);

  return  !loading ?(
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold mb-4">Creations</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading creations...</div>
      ) : creations.length === 0 ? (
        <div className="text-center text-gray-400">No creations found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {creations.map((creation) => (
            <div key={creation.id} className="relative group rounded-lg overflow-hidden shadow-md">
              <img
                src={creation.content}
                alt="Generated"
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-4 flex flex-col justify-end">
                <p className="text-sm mb-2">{creation.prompt}</p>

                <div className="flex items-center justify-between">
                  <p>{creation.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                      creation.likes.includes(user.id)
                        ? "fill-red-500 text-red-600"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) :(
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 
       border-primary border-t-transparent animate-span"></span>
    </div>
  )
};

export default Community;