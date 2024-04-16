import React from "react";
import Button from "../Button";

const baseURL = "https://authenticator-backend-jj7b.onrender.com";

const Verification = ({ votedCandidate, confirmVote }) => {
  const [loading, toggleLoading] = React.useState(false);
  const [success, toggleSuccess] = React.useState(false);
  const pollingFunction = (baseURL, loginId) => {
    let pollCount = 1;
    console.log(pollCount);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/login/${loginId}?poll_count=${pollCount}`
        );

        const data = await response.json();
        console.log("pollingData", data);

        if (data) {
          pollCount += 1;
        }

        if (data.data.check_status === "MATCH_SUCCESS") {
          clearInterval(interval);
          toggleLoading(false);
          toggleSuccess(true);
        } else if (data.data.check_status === "MATCH_FAILED") {
          clearInterval(interval);
          toggleLoading(false);

          // Toastify({
          //   text: `Login Failed`,
          //   duration: 3000,
          //   close: true,
          //   className: "toast",
          //   backgroundColor: "#f00",
          //   gravity: "top",
          //   position: "center",
          //   stopOnFocus: true,
          // }).showToast();
          alert("Login Failed", "Please try again", "error");

          return;
        } else if (data.data.check_status === "DENIED") {
          clearInterval(interval);
          toggleLoading(false);

          // Toastify({
          //   text: `Login Request Denied`,
          //   duration: 3000,
          //   close: true,
          //   className: "toast",
          //   backgroundColor: "#f00",
          //   gravity: "top",
          //   position: "center",
          //   stopOnFocus: true,
          // }).showToast();
          alert("Login Request Denied", "Please try again", "error");
        }
      } catch (e) {
        alert("Error", "Something went wrong", "error");
      }
    }, 10000);
  };
  const verifyUser = async () => {
    console.log("votedCandidate", votedCandidate);
    toggleLoading(true);
    const body = { phone_number: votedCandidate?.phone };
    console.log("body", body);
    const response = await fetch(`${baseURL}/api/login`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    const { data } = res;
    console.log("login", res);

    pollingFunction(baseURL, data.login_id);
  };
  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center ">
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-gray-600 bg-stroke-1 p-8 rounded-lg shadow-lg w-[50%] flex justify-start items-center flex-col gap-y-[16px]"
      >
        <h2 className="h3">Confirm Your Vote</h2>
        <p className="body-2 italic text-center">
          You'll be notified in your mobile application to verify your
          identity.Please open and register with same number you register on
          this platform.
        </p>
        <Button
          className={"w-[220px]"}
          onClick={() => {
            success
              ? confirmVote(votedCandidate.id, votedCandidate.header)
              : verifyUser();
          }}
        >
          {loading ? "verifying..." : success ? "Vote" : "Verify"}
        </Button>
      </div>
    </div>
  );
};

export default Verification;
