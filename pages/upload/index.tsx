import { useState, ChangeEvent } from "react";

const Upload = () => {
  const [file, setFile] = useState<File>();

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    let thisFile = e.target.files[0];
    if (!thisFile) return;
    setFile(thisFile);
  }

  async function upload() {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const response = await (
      await fetch("/api/upload", {
        method: "POST",
        body,
      })
    ).json();
  }

  return (
    <div>
      <h1>Upload</h1>
      <input type="file" onChange={handleInput} />
      <button onClick={upload}>submit</button>
    </div>
  );
};

export default Upload;
