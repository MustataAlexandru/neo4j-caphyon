import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub, BsInstagram } from "react-icons/bs";

export default function Foter() {
  return (
    <Footer container style={{ borderTop: "1px solid rgb(55 65 81 )" }}>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div></div>
          <div className="w-full gap-8 sm:flex sm:items-center sm:justify-center">
            <Footer.Copyright
              href="#"
              by="Mustata Alexandru-Cristian"
              year={2024}
            />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon
                href="https://www.facebook.com/alecs.pdm"
                icon={BsFacebook}
              />
              <Footer.Icon
                href="https://www.instagram.com/mustata_alexandru123/"
                icon={BsInstagram}
              />
              <Footer.Icon
                href="https://github.com/MustataAlexandru"
                icon={BsGithub}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Resources" />
              <Footer.LinkGroup row>
                <Footer.Link >Flowbite</Footer.Link>
                <Footer.Link >Tailwind</Footer.Link>
                <Footer.Link >Express.js</Footer.Link>
                <Footer.Link >React.js</Footer.Link>
                <Footer.Link >Neo4j</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="About me" />
              <Footer.LinkGroup row>
                <Footer.Link href="https://github.com/MustataAlexandru">
                  Github
                </Footer.Link>

                <Footer.Link href="https://www.instagram.com/mustata_alexandru123/">
                  Instagram
                </Footer.Link>
                <Footer.Link href="https://www.facebook.com/alecs.pdm">
                  Facebook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div></div>
          </div>
        </div>
        <Footer.Divider />
      </div>
    </Footer>
  );
}
