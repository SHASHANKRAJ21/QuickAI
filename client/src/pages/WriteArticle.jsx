import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Base URL fallback for local development
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const WriteArticle = () => {
  const articleLengthOptions = [
    { length: 800, text: "Short (500–800 words)" },
    { length: 1200, text: "Medium (800–1,200 words)" },
    { length: 1600, text: "Long (1,200+ words)" }
  ];

  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const prompt = `Write an article about ${input.trim()} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* FORM */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-3 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of Artificial Intelligence is…"
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="flex flex-wrap gap-3 mt-2">
          {articleLengthOptions.map((item) => (
            <span
              key={item.length}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span
              className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"
            ></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* OUTPUT */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click “Generate Article” to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto whitespace-pre-wrap text-sm text-slate-600">
            
            <div className=".reset-tw"><Markdown>{content}</Markdown></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
