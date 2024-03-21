import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./pages/Layout";
import AddCandidate from "./pages/AddCandidate";
import Registration from "./pages/Registration";
import VerificationPage from "./pages/VerificationPage";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    children: [
      {
        id: "home",
        path: "",
        Component: Home,
      },
      {
        id: "add-candidate",
        path: "/add-candidate",
        Component: AddCandidate,
      },
      {
        id: "registration",
        path: "/registration",
        Component: Registration,
      },
      {
        id: "verification",
        path: "/verification",
        Component: VerificationPage,
      },
      {
        id: "voting",
        path: "/voting",
        Component: Voting,
      },
      {
        id: "results",
        path: "/results",
        Component: Results,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <RouterProvider
          router={router}
          fallbackElement={<p>Initial Load...</p>}
        />

        {/* <Route exact path="/AddCandidate" component={AddCandidate} />
          <Route exact path="/Voting" component={Voting} />
          <Route exact path="/Results" component={Results} />
          <Route exact path="/Registration" component={Registration} />
          <Route exact path="/Verification" component={Verification} />
          <Route exact path="/test" component={test} />
          <Route exact path="*" component={NotFound} /> */}
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
