import { Toaster } from "react-hot-toast";

const ToasterWrapper = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default ToasterWrapper;
