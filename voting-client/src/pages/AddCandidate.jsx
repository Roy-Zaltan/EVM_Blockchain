import React from "react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Election from "../contracts/Election.json";
import getWeb3 from "../utilities/connectWeb3";
import { useEffect } from "react";

const loadAddedCandidates = (candidates) => {
  if (candidates.length === 0) {
    return (
      <>
        <center>No Candidates added yet.</center>
      </>
    );
  }
  return (
    <>
      {candidates.map((candidate, index) => {
        return (
          <div className="container-list success w-full">
            <div className="flex justify-start items-center gap-3">
              {candidate.id ?? 1}
              {index + 1}. <strong>{candidate.header ?? "BJP"}</strong>
              {candidate.slogan ?? "sabka sath sabka bikas"}
            </div>
          </div>
        );
      })}
    </>
  );
};
const AddCandidate = () => {
  const [candidateCount, setCandidateCount] = React.useState(0);
  const [electionInstance, setElectionInstance] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [candidates, setCandidates] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const ref = React.useRef(null);
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
        console.log("admin", instance);
        const candidateCnt = await instance?.methods.getTotalCandidate().call();
        // console.log('candidate Count',candidateCnt);
        setCandidateCount(candidateCnt);
        let _candidates = [];
        for (let i = 0; i < candidateCnt; i++) {
          const candidateDetails = await instance?.methods
            .candidateDetails(i)
            .call();

          console.log("candidateDetails", candidateDetails);
          _candidates.push({
            id: candidateDetails.candidateId,
            header: candidateDetails.header,
            slogan: candidateDetails.slogan,
          });
        }
        setCandidates(_candidates);
        setIsAdmin(admin === accounts[0]);
      } catch (error) {
        console.error(error);
      }
    };
    loadWeb3();
  }, []);

  const addCandidate = async (event) => {
    event.preventDefault();
    console.log(isAdmin);
    console.log(ref.current);
    const formData = new FormData(ref.current);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log(formDataObject);
    // const header = event.target.elements[0].value;
    // const slogan = event.target.elements[1].value;
    try {
      const header =
        formDataObject.floating_first_name +
        " " +
        formDataObject.floating_last_name;
      const slogan = formDataObject.slogan;
      await electionInstance?.methods
        .addCandidate(header, slogan)
        .send({ from: account, gas: 1000000 });
        console.log("candidate added");
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
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
  if (!isAdmin) {
    return (
      <>
        <div className="flex-1 h-full w-full">
          <center>You are not authorized to access this page.</center>
        </div>
      </>
    );
  }
  return (
    <>
      <Section>
        <div className="container">
          <Heading
            title="Add a new Candidate."
            text=""
            tag={`Total candidates: ${candidateCount}`}
          />

          <div className="relative">
            <div className="flex flex-1 justify-center h-full items-center p-8 lg:p-16 mb-10 border border-n-1/10 rounded-3xl">
              <form
                ref={ref}
                onSubmit={addCandidate}
                className="flex flex-col w-full h-full items-center justify-start"
              >
                <h3 className="w-full text-left leading-9">About Candidate</h3>
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
                      First Name
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
                    name="slogan"
                    id="slogan"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                  />
                  <label
                    htmlFor="slogan"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Slogan
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="aadhar_no"
                    id="aadhar_no"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="aadhar_no"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Aadhar Number
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="organisation_name"
                    id="organisation_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="organisation_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Organisation name
                  </label>
                </div>
                <div className="w-full text-center py-4">
                  <Button type="submit" white>
                    Add Candidate
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <Heading title="Candidate List Registered" />
          <div className="relative w-full">
            <div className="flex flex-col justify-center h-full w-full items-center p-8 lg:p-16 mb-10 border border-n-1/10 rounded-3xl">
              {loadAddedCandidates(candidates)}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default AddCandidate;
