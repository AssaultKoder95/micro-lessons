import { useState, useEffect, useRef } from "react";
import { getLessonSet } from "../utils/api.js";

export function usePolling(id, initialData) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    if (data?.status === "completed" || data?.status === "failed") return;

    const poll = async () => {
      try {
        const res = await getLessonSet(id);
        setData(res.data);
        if (res.data.status === "completed" || res.data.status === "failed") {
          clearInterval(timerRef.current);
        }
      } catch (err) {
        setError(err.message);
        clearInterval(timerRef.current);
      }
    };

    timerRef.current = setInterval(poll, 2500);
    return () => clearInterval(timerRef.current);
  }, [id, data?.status]);

  return { data, error };
}
