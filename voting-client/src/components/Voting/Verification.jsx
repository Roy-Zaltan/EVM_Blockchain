import React from "react";

const baseURL = "https://authenticator-backend-jj7b.onrender.com";

const Verification = ({ votedCandidate,confirmVote }) => {
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
    <div className="w-full h-screen bg-gray-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[50%]">
        <h2 className="text-2xl font-bold mb-4">confirm Your Vote</h2>
        <p className="text-gray-600 italic">
          You'll be notified in your mobile application to verify your
          identity.Please open and register with same number you register on
          this platform.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          onClick={() => {
            success
              ? confirmVote(votedCandidate.id, votedCandidate.header)
              : verifyUser();
          }}
        >
          {success ? "Vote" : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default Verification;
