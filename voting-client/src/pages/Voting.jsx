import React from "react";
import Section from "../components/Section";
import NotInitialised from "../components/shared/NotInitialised";
import getWeb3 from "../utilities/connectWeb3";
import Election from "../contracts/Election.json";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Verification from "../components/Voting/Verification";
const Voting = () => {
  const [registeredVoters, setRegisteredVoters] = React.useState(0);
  const [electionInstance, setElectionInstance] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [elStarted, setElStarted] = React.useState(false);
  const [elEnded, setElEnded] = React.useState(false);
  const [candidates, setCandidates] = React.useState([]);
  const [elDetails, setElDetails] = React.useState(null);
  const [currentvoter, setCurrentVoter] = React.useState({
    address: undefined,
    name: "",
    aadhar: "",
    phone: "",
    isRegistered: false,
    isAdhaarVerified: false,
    isVerified: false,
    hasVoted: false,
  });
  const [votedCandidate, setVotedCandidate] = React.useState(null);
  const candidateCount = candidates.length;

  const formRef = React.useRef(null);
  React.useEffect(() => {
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
        const candidateCnt = await instance.methods.getTotalCandidate().call();
        const _candidates = [];
        for (let i = 0; i < candidateCnt; i++) {
          const candidateDetails = await instance?.methods
            .candidateDetails(i)
            .call();

          _candidates.push({
            id: candidateDetails.candidateId,
            header: candidateDetails.header,
            slogan: candidateDetails.slogan,
          });
        }
        setCandidates(_candidates);
        setIsAdmin(admin === accounts[0]);
        const totalVoter = await instance.methods.getTotalVoter().call();

        console.log("admin", admin === accounts[0], accounts[0], totalVoter);
        const voter = await instance.methods.voterDetails(accounts[0]).call();
        console.log("voter", voter);
        setCurrentVoter((currentvoter) => ({
          ...currentvoter,
          address: voter.voterAddress,
          name: voter.name,
          aadhar: voter.aadhar,
          phone: voter.phone,
          isRegistered: voter.isRegistered,
          isAdhaarVerified: voter.aadharVerified,
          isVerified: voter.isVerified,
          hasVoted: voter.hasVoted,
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
        <center className="text-white text-lg">
          Loading Web3, accounts, and contract...
        </center>
      </>
    );
  }
  if (!elStarted && !elEnded) {
    return <NotInitialised />;
  }
  if (!elStarted && elEnded) {
    return (
      <Section>
        <div className="container  h-[32rem] items-center justify-center flex flex-col gap-6">
          <h2 className="h2">Election has Ended</h2>
          <Button className="min-w-[200px]" href={"/results"}>
            View Results
          </Button>
        </div>
      </Section>
    );
  }
  const renderVoterPage = () => {
    if (!currentvoter?.isVerified) {
      return (
        <div className="container  h-[32rem] items-center justify-center flex flex-col gap-6">
          <h2 className="h2">Voting Page</h2>
          <p className="body-2 mt-4 text-n-4">
            You are not verified to vote. Please verify first.
          </p>
          {isAdmin && (
            <Button className="min-w-[200px]" href={"/verification"}>
              Verification Page
            </Button>
          )}
        </div>
      );
    }
    if (currentvoter?.hasVoted) {
      return (
        <div className="container  h-[32rem] items-center justify-center flex flex-col gap-6">
          <h2 className="h2">Voting Page</h2>
          <p className="body-2 mt-4 text-n-4">You've casted your vote.</p>
          <Button className="min-w-[200px]" href={"/results"}>
            See Results
          </Button>
        </div>
      );
    }
    const castVote = async (id) => {
      await electionInstance.methods
        .vote(id)
        .send({ from: account, gas: 1000000 });
      window.location.reload();
    };
    const confirmVote = (id, header) => {
      var r = window.confirm(
        "Vote for " + header + " with Id " + id + ".\nAre you sure?"
      );
      if (r === true) {
        castVote(id);
      }
    };
    return (
      <div className="container relative">
        <div className="container-main">
          <Heading
            title="Candidates"
            text="Vote for your favorite candidate"
            tag={`Total candidates: ${candidateCount}`}
          />
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {candidates?.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col gap-4 justify-center items-center"
              >
                <div className="w-[200px] h-[200px] bg-n-8 rounded-[2.4375rem] overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${"arya sah"}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-y-0 min-h-[300px]">
                  <h3 className="body-2">{candidate.header}</h3>
                  <p className="body-3 italic">{candidate.slogan}</p>
                  <Button
                    className="min-w-[200px] my-3"
                    onClick={() => {
                      setVotedCandidate({
                        id: candidate.id,
                        header: candidate.header,
                        phone: currentvoter.phone,
                      });
                    }}
                  >
                    Vote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <dialog
          id="modal"
          class="modal absolute left-0 right-0 top-0 bottom-0 h-screen w-[100%] z-[100]  bg-red-500"
          open={votedCandidate !== null}
        >
          <Verification votedCandidate={votedCandidate} confirmVote={confirmVote}/>
        </dialog>
      </div>
    );
  };
  return (
    <Section>
      <div className="container">
        {currentvoter?.isRegistered ? (
          <>{renderVoterPage()}</>
        ) : (
          <>
            <div className="container  h-[32rem] items-center justify-center flex flex-col gap-6">
              <h2 className="h2">Voting Page</h2>
              <p className="body-2 mt-4 text-n-4">
                You are not registered to vote. Please register first.
              </p>
              <Button className="min-w-[200px]" href={"/registrations"}>
                Registration Page
              </Button>
            </div>
          </>
        )}
      </div>
    </Section>
  );
};

export default Voting;
