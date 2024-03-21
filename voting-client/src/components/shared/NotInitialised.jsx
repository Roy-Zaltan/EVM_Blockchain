import React from "react";
import Heading from "../Heading";
import Section from "../Section";

const NotInitialised = () => {
  return (
    <Section>
      <div className="container h-[32rem] items-center justify-center flex">
        <Heading
          title="Election has not been initialized"
          text="Please wait for the election to be initialized by the admin"
        //   tag={`Total candidates: ${registeredVoters}`}
        />
      </div>
    </Section>
  );
};

export default NotInitialised;
