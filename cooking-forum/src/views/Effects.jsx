import { useEffect } from "react"

export default function Effects() {

  useEffect(() => {
    const handler = setInterval(() => console.log('tick'), 1000);

    return () => {
      clearInterval(handler);
    };
  }, []);

  return (
    <div>
      <h1>Effects</h1>
    </div>
  )
}