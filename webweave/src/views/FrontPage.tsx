import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "../assets/rootStyle.css";
import frontPageStyle from "../assets/frontPageStyle";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const FrontPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
      console.log(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleContrast = () => {
      const scrollPosition = window.scrollY;
      const screenHeight = window.innerHeight;
      setContrast(scrollPosition > screenHeight);
      if (scrollPosition > screenHeight) {
        console.log("Contrast true");
      }
    };

    window.addEventListener("scroll", handleContrast);
    return () => {
      window.removeEventListener("scroll", handleContrast);
    };
  }, []);

  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <body className={frontPageStyle.container}>
      <header
        className={
          isScrolled ? frontPageStyle.headerSticky : frontPageStyle.header
        }
      >
        <div
          className={
            contrast
              ? frontPageStyle.headerContentContrast
              : frontPageStyle.headerContent
          }
        >
          <h1 className={frontPageStyle.headerH1}>&lt;Webweave/&gt;</h1>
          <div
            className={frontPageStyle.headerContents}
            /*             className={
              contrast
                ? frontPageStyle.headerContentsContrast
                : frontPageStyle.headerContents
            } */
          >
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              href="#info"
            >
              Info
            </a>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              href="#tutorial"
            >
              Tutorial
            </a>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              href="#team"
            >
              Team
            </a>
          </div>
          <div className={frontPageStyle.headerButtons}>
            <button className={frontPageStyle.startCreatingButton}>
              <a onClick={() => goTo("/generator")}>Start Creating</a>
            </button>
            <button
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
            >
              <a onClick={() => goTo("/login")}>Sign In</a>
            </button>
          </div>
        </div>
      </header>
      <div
        className={frontPageStyle.bgImage}
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20230528/original/pngtree-bedroom-office-scene-with-window-and-sunrises-picture-image_2778965.jpg')",
        }}
      >
        <div className={frontPageStyle.imgContent}>
          <div
            className={
              isScrolled
                ? frontPageStyle.header
                : frontPageStyle.imgContentTitle
            }
          >
            <h2>&lt;Webweave/&gt;</h2>
          </div>

          <div className={frontPageStyle.imgContentSlogan}>
            <h3 className={frontPageStyle.sloganContent}>
              AI based Website Generator
            </h3>
            <p>
              Page made using <span className="text-action">Webweave</span>
            </p>
          </div>
          <div
            className={
              isScrolled
                ? frontPageStyle.header
                : frontPageStyle.imgContentButtons
            }
          >
            <button>
              <p
                className={frontPageStyle.imgContentCreateButton}
                onClick={() => goTo("/generator")}
              >
                Start Creating
              </p>
            </button>
            <button className={frontPageStyle.imgContentSignButton}>
              <p onClick={() => goTo("/login")}>Sign In</p>
            </button>
          </div>
        </div>
      </div>

      <section className={frontPageStyle.infoSection} id="info">
        <div className={frontPageStyle.teamContainer}>
          <h2 className={frontPageStyle.teamHeading}>
            What can you do with <span className="text-action">Webweave</span>?
          </h2>
          <div className="grid grid-cols-2 gap-10">
            <div className={frontPageStyle.infoContainer}>
              <div
                className={frontPageStyle.infoImg}
                style={{
                  backgroundImage:
                    "url('https://cdn.discordapp.com/attachments/1181546521397821440/1181547162463649872/image.png?ex=6581748b&is=656eff8b&hm=811bad903d11c502f76be292bf7d84719475c8361811ad6f3670ef18eed23e8d&')",
                }}
              >
                <div className={frontPageStyle.imgDarken}></div>
              </div>
            </div>
            <div className={frontPageStyle.infoText}>
              <p>
                <span className="text-action">Webweave</span> offers a variety
                of benefits and functionalities for users looking to create a
                professional and polished website. Users can effortlessly design
                custom websites with minimal technical knowledge or experience
                required. The AI technology leverages data and information
                provided by the user to generate a visually appealing and
                responsive website tailored to their specific needs and
                preferences. Users can easily choose from a range of color
                schemes, fonts, and layouts to customize the look and feel of
                their website. Additionally,{" "}
                <span className="text-action">Webweave</span> can help optimize
                the site for search engines, ensuring maximum visibility and
                traffic. With its intuitive interface and automated design
                capabilities, users can save time and effort while still
                achieving a high-quality web presence. Whether it's for a
                personal blog, business portfolio, or e-commerce site,{" "}
                <span className="text-action">Webweave</span> provides a
                user-friendly solution for creating a professional and engaging
                online platform at a low cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={frontPageStyle.infoSection} id="tutorial">
        <div className={frontPageStyle.teamContainer}>
          <div className="grid grid-cols-3">
            <button className={frontPageStyle.moveButton}>
              <KeyboardArrowLeftIcon />
            </button>
            <h2 className={frontPageStyle.teamHeading}>How to use?</h2>
            <button className={frontPageStyle.moveButton}>
              <KeyboardArrowRightIcon />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className={frontPageStyle.infoText}>
              <p>
                <span className="text-action">Webweave</span> offers a variety
                of benefits and functionalities for users looking to create a
                professional and polished website. Users can effortlessly design
                custom websites with minimal technical knowledge or experience
                required. The AI technology leverages data and information
                provided by the user to generate a visually appealing and
                responsive website tailored to their specific needs and
                preferences. Users can easily choose from a range of color
                schemes, fonts, and layouts to customize the look and feel of
                their website. Additionally,{" "}
                <span className="text-action">Webweave</span> can help optimize
                the site for search engines, ensuring maximum visibility and
                traffic. With its intuitive interface and automated design
                capabilities, users can save time and effort while still
                achieving a high-quality web presence. Whether it's for a
                personal blog, business portfolio, or e-commerce site,{" "}
                <span className="text-action">Webweave</span> provides a
                user-friendly solution for creating a professional and engaging
                online platform at a low cost.
              </p>
            </div>
            <div className={frontPageStyle.infoContainer}>
              <div
                className={frontPageStyle.infoImg}
                style={{
                  backgroundImage:
                    "url('https://cdn.discordapp.com/attachments/1181546521397821440/1181547162463649872/image.png?ex=6581748b&is=656eff8b&hm=811bad903d11c502f76be292bf7d84719475c8361811ad6f3670ef18eed23e8d&')",
                }}
              >
                <div className={frontPageStyle.imgDarken}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={frontPageStyle.teamSection}>
        <div className={frontPageStyle.teamContainer}>
          <h2 className={frontPageStyle.teamHeading} id="team">
            About us
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className={frontPageStyle.memberContainer}>
              <div
                className={frontPageStyle.teamImg}
                style={{
                  backgroundImage:
                    "url('https://cdn.discordapp.com/attachments/1077685085916102781/1181234424084434964/IMG_5737.JPG?ex=65805148&is=656ddc48&hm=3b44922c81afc186e35fb909471807346583b83e286b4c42d80e90528da18124&')",
                }}
              >
                <div className={frontPageStyle.imgDarken}></div>
              </div>

              <div className="py-6">
                <h2 className={frontPageStyle.name}>Lassi Aaltonen</h2>
                <p className={frontPageStyle.email}>
                  lassi.antero.aaltonen@gmail.com
                </p>
                <p className={frontPageStyle.info}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p>Socials</p>
              </div>
            </div>

            <div className={frontPageStyle.memberContainer}>
              <div
                className={frontPageStyle.teamImg}
                style={{
                  backgroundImage:
                    "url('https://cdn.discordapp.com/attachments/1077685085916102781/1181219686763991080/IMG_2152.jpg?ex=6580438f&is=656dce8f&hm=30bac9527c13ead3787b847355647f62c1c823ae58245ca3562c996fd91323d3&')",
                }}
              >
                <div className={frontPageStyle.imgDarken}></div>
              </div>
              <div className="py-6">
                <h2 className={frontPageStyle.name}>Onni Fischer</h2>
                <p className={frontPageStyle.email}>onni.fischer@gmail.com</p>
                <p className={frontPageStyle.info}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p>Socials</p>
              </div>
            </div>

            <div className={frontPageStyle.memberContainer}>
              <div
                className={frontPageStyle.teamImg}
                style={{
                  backgroundImage:
                    "url('https://cdn.discordapp.com/attachments/1077685085916102781/1181219926481063956/IMG-20220922-WA0003.jpg?ex=658043c8&is=656dcec8&hm=727ce7c5919a485dd6cdf3cd12189a56fadaf6fca6ac80a2d1f7d9d26e5cbfc9&')",
                }}
              >
                <div className={frontPageStyle.imgDarken}></div>
              </div>
              <div className="py-6">
                <h2 className={frontPageStyle.name}>Eetu Pasonen</h2>
                <p className={frontPageStyle.email}>eetu.pasonen@hotmail.com</p>
                <p className={frontPageStyle.info}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p>Socials</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </body>
  );
};

export default FrontPage;
