import React from "react";
import Image from "next/image"

function GoogleButton() {
  return (
    <React.Fragment>
      <div
        className="hover:cursor-pointer transition duration-300"
      >
        <Image
          src="/google.svg"
          alt="google"
          width="40"
          height="40"
          className="brightness-50 hover:brightness-90  transition duration-300"
        />
      </div>
    </React.Fragment>
  );
}

export default GoogleButton;
