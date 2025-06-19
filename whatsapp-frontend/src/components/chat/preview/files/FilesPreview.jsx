import { useState } from "react";
import FileViewer from "./FileViewer";
import HandleAndSendWithContext from "./HandleAndSend";
import Header from "./Header";
import Input from "./Input";

export default function FilesPreview() {
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("activeIndex ",activeIndex);
  
  return (
    <div className="relative py-2 w-full flex items-center justify-center ">
      {/*Container*/}
      <div className="w-full flex flex-col items-center">
        {/*Header*/}
        <Header activeIndex={activeIndex} />
        {/*Viewing selected file*/}
        <FileViewer activeIndex={activeIndex} />
        <div className="w-full flex flex-col items-center">
          {/*Message Input*/}
          <Input message={message} setMessage={setMessage} />
          {/*Send and manipulate files*/}
          <HandleAndSendWithContext
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}