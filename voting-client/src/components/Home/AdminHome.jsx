import React from "react";
import { benefitImage2, check } from "../../assets";
import { GradientLight } from "../design/Benefits";
import ClipPath from "../../assets/svg/ClipPath";
import Section from "../Section";
import Heading from "../Heading";
import { Gradient, PhotoChatMessage } from "../design/Services";
import Generating from "../Generating";
import { Link } from "react-router-dom";
import Button from "../Button";

const AdminHome = ({
  account,
  registerElection,
  elStarted,
  elEnded,
  elDetails,
}) => {
  const formRef = React.useRef(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formRef.current);
    const name =
      formRef.current["floating_first_name"].value +
      " " +
      formRef.current["floating_last_name"].value;
    const email = formRef.current["floating_email"].value;
    const adminTitle = "Admin";
    const electionTitle = formRef.current["floating_election_name"].value;
    const organisationTitle =
      formRef.current["floating_organisation_name"].value;
    await registerElection({
      name,
      email,
      adminTitle,
      electionTitle,
      organisationTitle,
    });
    // console.log(name, email, adminTitle, electionTitle, organisationTitle);
  };
  if (!elStarted && !elEnded) {
    return (
      <Section id="form">
        <div className="container">
          <Heading
            title="Please Setup Election."
            text="Election has not been initialize."
          />

          <div className="relative">
            <div className="relative z-1 flex flex-row items-center h-[42rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[50rem]">
              <div className="flex flex-1 justify-center h-full items-center p-8 lg:p-16 mb-10 border border-n-1/10 rounded-3xl">
                <form
                  ref={formRef}
                  action=""
                  className="flex flex-col w-full h-full items-center justify-start"
                >
                  <div className={`max-w-[50rem] mx-auto text-left w-full`}>
                    {<h2 className="text-sm italic">{account}</h2>}
                    {
                      <p className="body-2 mt-1 mb-4 text-n-4 text-sm">
                        Your account
                      </p>
                    }
                  </div>
                  <h3 className="w-full text-left leading-9">About Admin</h3>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="email"
                      name="floating_email"
                      id="floating_email"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_email"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email
                    </label>
                  </div>
                  <div className="w-full grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="floating_first_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        First name
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="floating_last_name"
                        id="floating_last_name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Last name
                      </label>
                    </div>
                  </div>
                  <h3 className="w-full text-left leading-9">About Election</h3>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="floating_election_name"
                      id="floating_election_name"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_election_name"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Election Name
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <input
                      type="text"
                      name="floating_organisation_name"
                      id="floating_organisation_name"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_organisation_name"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Organisation name
                    </label>
                  </div>
                  <div className="w-full text-left text-sm leading-6 tracking-wide">
                    <h2>Do not forget to add candidates.</h2>
                    <p>
                      Go to{" "}
                      <Link
                        title="Add a new "
                        to="/add-candidate"
                        className="underline italic"
                      >
                        add candidates
                      </Link>{" "}
                      page.
                    </p>
                  </div>
                  <div className="w-full text-left tracking-wide mt-5">
                    <Button
                      onClick={async (e) => await onSubmit(e)}
                      className="min-w-[200px] px-6"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
              <div className="relative z-1 max-w-[20rem] lg:px-10">
                <h4 className="h4 mb-4">Smartest Election</h4>
                <p className="body-2 mb-[3rem] text-n-3">
                  Smart Elections unlocks the potential of blcokchain in voting
                  applications
                </p>
                <ul className="body-2">
                  <li className="flex items-start py-4 border-t border-n-6">
                    <img width={24} height={24} src={check} />
                    <p className="ml-4">Transparent</p>
                  </li>
                  <li className="flex items-start py-4 border-t border-n-6">
                    <img width={24} height={24} src={check} />
                    <p className="ml-4">Fair</p>
                  </li>
                  <li className="flex items-start py-4 border-t border-n-6">
                    <img width={24} height={24} src={check} />
                    <p className="ml-4">Secure</p>
                  </li>
                </ul>
              </div>
              <Generating className="absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" />
            </div>

            {/* <div className="relative z-1 grid gap-5 lg:grid-cols-2">
              <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={service2}
                    className="h-full w-full object-cover"
                    width={630}
                    height={750}
                    alt="robot"
                  />
                </div>
  
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
                  <h4 className="h4 mb-4">Photo editing</h4>
                  <p className="body-2 mb-[3rem] text-n-3">
                    Automatically enhance your photos using our AI app&apos;s
                    photo editing feature. Try it now!
                  </p>
                </div>
  
                <PhotoChatMessage />
              </div>
  
              <div className="p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[46rem]">
                <div className="py-12 px-4 xl:px-8">
                  <h4 className="h4 mb-4">Video generation</h4>
                  <p className="body-2 mb-[2rem] text-n-3">
                    The world’s most powerful AI photo and video art generation
                    engine. What will you create?
                  </p>
  
                  <ul className="flex items-center justify-between">
                    {brainwaveServicesIcons.map((item, index) => (
                      <li
                        key={index}
                        className={`rounded-2xl flex items-center justify-center ${
                          index === 2
                            ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                            : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15"
                        }`}
                      >
                        <div
                          className={
                            index === 2
                              ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                              : ""
                          }
                        >
                          <img src={item} width={24} height={24} alt={item} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem]">
                  <img
                    src={service3}
                    className="w-full h-full object-cover"
                    width={520}
                    height={400}
                    alt="Scary robot"
                  />
  
                  <VideoChatMessage />
                  <VideoBar />
                </div>
              </div>
            </div> */}

            <Gradient />
          </div>
        </div>
      </Section>
    );
  }
  return (
    <>
      <Section>
        <pre>{JSON.stringify(elDetails)}</pre>
      </Section>
    </>
  );
};

export default AdminHome;
