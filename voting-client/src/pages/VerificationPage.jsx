import React from "react";
import Section from "../components/Section";
import Election from "../contracts/Election.json";
import getWeb3 from "../utilities/connectWeb3";
import { useEffect } from "react";
import Heading from "../components/Heading";
import Button from "../components/Button";

const VerificationPage = () => {
  const [registeredVoters, setRegisteredVoters] = React.useState(0);
  const [electionInstance, setElectionInstance] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [elStarted, setElStarted] = React.useState(false);
  const [elEnded, setElEnded] = React.useState(false);
  const [elDetails, setElDetails] = React.useState(null);
  const [voters, setVoters] = React.useState([]);

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

        setIsAdmin(admin === accounts[0]);
        console.log("admin", admin === accounts[0]);
        let _voters = [];
        for (let i = 0; i < voterCount; i++) {
          const voterAddress = await instance?.methods?.voters(i).call();
          const voter = await instance?.methods
            ?.voterDetails(voterAddress)
            .call();
          console.log("voter", voter);
          _voters.push({
            address: voter.voterAddress,
            name: voter.name,
            aadhar: voter.aadhar,
            phone: voter.phone,
            isRegistered: voter.isRegistered,
            isAdhaarVerified: voter.aadharVerified,
            isVerified: voter.isVerified,
            hasVoted: voter.hasVoted,
          });
        }
        setVoters([..._voters]);
      } catch (error) {
        console.error(error);
      }
    };
    loadWeb3();
  }, []);
  if (!isAdmin) {
    return (
      <Section>
        <div className="container">
          <Heading
            title="Verification Page"
            text="You are not authorized to view this page."
          />
        </div>
      </Section>
    );
  }
  if (!web3) {
    return (
      <>
        <center className="text-white text-lg">
          Loading Web3, accounts, and contract...
        </center>
      </>
    );
  }

  const renderUnverifiedVoters = (voter) => {
    const verifyVoter = async (verifiedStatus, address) => {
      try {
        await electionInstance.methods
          .verifyVoter(verifiedStatus, address)
          .send({
            from: account,
          });
      } catch (e) {
        console.log(e);
        alert("Error in verifying voter");
      }
      window.location.reload();
    };
    return (
      <div
        className={`md:flex h-fit  even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-conic-gradient`}
      >
        <div className="relative p-8 w-full bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-8">
          <div className="relative z-2 flex flex-col p-[2.4rem]  text-n-3">
            <div className="grid gap-y-6 grid-cols-2 text-lg tracking-wide items-center">
              <h5 className=" col-span-2">
                Account Address:{" "}
                <span className="text-n-2">{voter?.address}</span>
              </h5>
              <p className="">
                Name: <span className="text-n-2">{voter?.name}</span>
              </p>
              <p className="">
                Phone: <span className="text-n-2">{`+91 ${voter.phone}`}</span>
              </p>
              <p className=" col-span-1">
                Aadhar Number: <span className="text-n-2">{voter?.aadhar}</span>
              </p>
              <p className="">
                Voted: <span className="text-n-2">{voter?.hasVoted ? "true" : "false"}</span>
              </p>
              <p className="">
                Adhaar Verified:{" "}
                <span className="text-n-2">{voter?.isAdhaarVerified ? "true" : "false"}</span>
              </p>
              {voter.isVerified ? (
                <p className="">
                  Admin Verified:{" "}
                  <span className="text-n-2">
                    {Boolean(voter?.isVerified) ? "true" : "false"}
                  </span>
                </p>
              ) : (
                <Button
                  className="w-2/3"
                  onClick={async () => {
                    console.log("voter", voter);

                    await verifyVoter(true, voter.address);
                  }}
                >
                  Approve
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Section>
      <div className="container">
        <Heading
          title="Verification Page"
          text="Verify the voters who have registered for the election."
          tag={`Total Registered Voters: ${registeredVoters}`}
        />
        <div className="relative grid gap-6 md:grid-cols-1 md:gap-4 md:pb-[7rem]">
          {voters?.map((voter) => renderUnverifiedVoters(voter))}
        </div>
      </div>
    </Section>
  );
};

export default VerificationPage;
