import { Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import logo from "./logo_Caphyon_RGB.webp";

export default function Nav() {
  return (
    <Navbar className="cstm_fixed border-b border-gray-200" fluid rounded>
      <Navbar.Brand href={logo}>
        <img
          src={logo}
          className="cstm-logo dark:color-white mr-3 sm:h-9"
          alt="Flowbite React Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="cst-collapse"></Navbar.Collapse>
    </Navbar>
  );
}
