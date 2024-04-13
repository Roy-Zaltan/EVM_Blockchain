import React, { useEffect } from "react";
import getWeb3 from "../utilities/connectWeb3";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Section from "../components/Section";
import { Gradient } from "../components/design/Hero";
import NotInitialised from "../components/shared/NotInitialised";
import Election from "../contracts/Election.json";

const Registration = () => {
  const [registeredVoters, setRegisteredVoters] = React.useState(0);
  const [electionInstance, setElectionInstance] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [elStarted, setElStarted] = React.useState(false);
  const [elEnded, setElEnded] = React.useState(false);
  const [elDetails, setElDetails] = React.useState(null);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [voterDetails, setVoterDetails] = React.useState({
    address: "0x0",
    name: "",
    phone: "",
    hasVoted: false,
    isVerified: false,
    isRegistered: false,
    isAadharVerified: false,
  });
  const formRef = React.useRef(null);
  useEffect(() => {
    const loadWeb3 = async () => {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
      try {
        // Getting the netwrok provider and web3 instance.
        const web3 = await getWeb3();
        console.log("web3", web3);

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address
        );
        setElectionInstance(instance);
        setWeb3(web3);
        setAccount(accounts[0]);
        const admin = await instance.methods.admin().call();
        const start = await instance.methods.getStart().call();
        setElStarted(start);
        const end = await instance.methods.getEnd().call();
        setElEnded(end);

        // Total number of voters
        const voterCount = await instance.methods.getTotalVoter().call();
        setRegisteredVoters(voterCount);

        // load current account
        const voterDetails = await instance.methods
          .voterDetails(accounts[0])
          .call();
        console.log("voter Details", voterDetails);
        if (voterDetails) {
          console.log("voterDetails", voterDetails);
          formRef.current["floating_first_name"].value =
            voterDetails?.name?.split(" ")[0] ?? "";
          formRef.current["floating_last_name"].value =
            voterDetails?.name?.split(" ")[1] ?? "";
          formRef.current["phone_number"].value = voterDetails?.phone;
          formRef.current["aadhar_number"].value = voterDetails?.aadhar;
          setVoterDetails((voterDetails) => ({
            ...voterDetails,
            isRegistered: voterDetails?.isRegistered,
            isVerified: voterDetails?.isVerified,
            isRegistered: voterDetails?.isRegistered,
            isAadharVerified: voterDetails?.aadharVerified,
            name: voterDetails?.name,
            phone: voterDetails?.phone,
            address: voterDetails?.address,
          }));
        }
        setIsRegistered(voterDetails?.isRegistered);
        setIsAdmin(admin === accounts[0]);
      } catch (error) {
        console.error(error);
      }
    };
    loadWeb3();
  }, []);

  const registerVoter = async (e) => {
    e.preventDefault();
    const firstName = formRef.current["floating_first_name"].value;
    const lastName = formRef.current["floating_last_name"].value;
    const phone = formRef.current["phone_number"].value;
    const aadhar = formRef.current["aadhar_number"].value;
    console.log({
      firstName,
      lastName,
      phone,
    });
    try {
      await electionInstance.methods
        .registerAsVoter(firstName + lastName, phone,aadhar)
        .send({ from: account, gas: 1000000 });
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Error occured while registering. Please try again later.");
    }
  };
  if (!web3) {
    return (
      <>
        <center className="text-white text-lg">
          Loading Web3, accounts, and contract...
        </center>
      </>
    );
  }
  // if (!elStarted && !elEnded) {
  //   return <NotInitialised />;
  // }
  return (
    <Section>
      <div className="container">
        <Heading
          title="Registration"
          text="Each voter can only vote once. Please register to vote."
          tag={`Total candidates: ${registeredVoters}`}
        />

        <div className="relative">
          <div className="relative z-1 flex flex-row items-center h-fit  mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 ">
            <form
              ref={formRef}
              // action="reload"
              onSubmit={registerVoter}
              className="flex flex-col w-full h-full items-center justify-start"
            >
              <div className={`mx-auto  text-left my-2 w-full`}>
                {<h2 className="text-sm tracking-wide italic">{account}</h2>}
                {
                  <p className="body-2 mt-1 mb-4 text-n-4 text-sm">
                    Your account
                  </p>
                }
              </div>
              {/* <div className="relative z-0 w-full mb-5 group">
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
                </div> */}
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
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="phone_number"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone Number
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="aadhar_number"
                  id="aadhar_number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="aadhar_number"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Aadhar Number
                </label>
              </div>
              <div className={`${voterDetails?.isRegistered ? 'flex' : 'hidden'} w-full flex-col md:flex-row justify-start items-center`}>
                <div className="relative w-full md:w-1/2 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="candidates"
                      aria-describedby="candidates-description"
                      name="candidates"
                      type="checkbox"
                      checked={voterDetails?.isVerified ?? false}
                      className="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-gray-500"
                    >
                      Admin Verified
                    </label>
                    {/* <p id="candidates-description" className="text-gray-500">
                    It is verified by the admin.
                  </p> */}
                  </div>
                </div>
                <div className="relative w-full md:w-1/2 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="candidates"
                      aria-describedby="candidates-description"
                      name="candidates"
                      type="checkbox"
                      checked={voterDetails?.isAadharVerified ?? false}
                      className="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-gray-500"
                    >
                      Aadhar Verified
                    </label>
                    {/* <p id="candidates-description" className="text-gray-500">
                    It is verified by the user.
                  </p> */}
                  </div>
                </div>
              </div>
              <div className="w-full text-left text-xs md:text-sm text-n-4 leading-7 my-5 tracking-wide">
                <h2>Do not forget to verify aadhar once registered.</h2>
                <p>
                  Make sure your account address and Phone number are correct.{" "}
                  <br /> Admin might not approve your account if the provided
                  Phone number nub does not matches the account address
                  registered in admins catalogue. page.
                </p>
              </div>
              <div className="w-full flex justify-start items-center">
                <Button typ="submit" white>
                  {isRegistered ? "Update" : "Register"}
                </Button>
              </div>
            </form>
          </div>
          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Registration;
