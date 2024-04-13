import React from "react";
import Hero from "../components/Hero";
import { useEffect } from "react";
import getWeb3 from "../utilities/connectWeb3";
import Election from "../contracts/Election.json";
import Section from "../components/Section";
import Heading from "../components/Heading";
import AdminHome from "../components/Home/AdminHome";
import Button from "../components/Button";
const Home = () => {
  const [electionInstance, setElectionInstance] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [elStarted, setElStarted] = React.useState(false);
  const [elEnded, setElEnded] = React.useState(false);
  const [elDetails, setElDetails] = React.useState(null);

  const endElection = async () => {
    try {
      await electionInstance.methods
        .endElection()
        .send({ from: account, gas: 3000000 });
      setElEnded(true);
    } catch (error) {
      console.error(error);
    }
  };
  const regiserElection = async (data) => {
    const { name, email, adminTitle, electionTitle, organisationTitle } = data;
    try {
      await electionInstance.methods
        .setElectionDetails(
          name,
          email,
          adminTitle,
          electionTitle,
          organisationTitle
        )
        .send({ from: account, gas: 3000000 });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
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
        const admin = await instance?.methods?.admin().call();
        const started = await instance?.methods?.getStart().call();
        const ended = await instance?.methods?.getEnd().call();
        const details = await instance?.methods?.getElectionDetails().call();
        setIsAdmin(admin === accounts[0]);
        setElStarted(started);
        setElEnded(ended);
        setElDetails((elDetails) => ({
          adminName: details?.adminName,
          adminEmail: details?.adminEmail,
          adminTitle: details?.adminTitle,
          electionTitle: details?.electionTitle,
          organizationTitle: details?.organizationTitle,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    loadWeb3();
  }, []);

  if (!web3) {
    return (
      <>
        <Hero />
        <center className="text-white text-lg">
          Loading Web3, accounts, and contract...
        </center>
      </>
    );
  }
  const renderUserBasedOnCondition = () => {
    if (elStarted && !elEnded) {
      return (
        <>
          <Heading
            title="Voting is Live."
            text="Your vote is very important."
          />
          <div className="relative">
            <div className="relative z-1 flex flex-row items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-fit">
              <div className="w-full h-fit rounded-3xl">
                <div className="flex flex-col items-center justify-center h-full p-8 gap-y-6">
                  <h2 className=" h2 ">
                    {elDetails?.electionTitle ?? "Campus Election"}
                  </h2>
                  <p className="body-2 text-xl mt-4 text-n-4">
                    {elDetails?.organizationTitle ?? "Shree Jain Vidyalaya"}
                  </p>

                  <p className="text-lg body-2">
                    {elDetails?.adminTitle ?? "Organiser"} -{" "}
                    {elDetails?.adminName ?? "Arya Sah"}
                  </p>
                  <p className="text-lg body-2 0">
                    {elDetails?.adminEmail ?? "aryasah30@gmail.com"}
                  </p>
                </div>
                <div className="py-4 w-full flex justify-center items-center">
                  <Button href="/pricing" white>
                    Vote Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (elEnded) {
      return (
        <>
          <Heading title="Voting Ended." text="Thank you for voting." />
        </>
      );
    }
    return (
      <>
        <Heading title="Voting Not Started." text="Voting will start soon." />
      </>
    );
  };
  return (
    <>
      <Hero />
      {/* <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
      >
      </Section> */}
      {isAdmin ? (
        <>
          <AdminHome
            registerElection={regiserElection}
            account={account}
            elStarted={elStarted}
            elEnded={elEnded}
            elDetails={elDetails}
          />
          <div className="container">
            {elStarted && !elEnded && (
              <div className="flex justify-center items-center gap-4">
                <Button onClick={endElection} white>
                  End Election
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Section id="form">
          <div className="container">{renderUserBasedOnCondition()}</div>
        </Section>
      )}
    </>
  );
};

export default Home;
