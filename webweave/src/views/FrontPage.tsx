import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "../assets/rootStyle.css";
import frontPageStyle from "../assets/frontPageStyle";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { tutorials } from "../components/tutorialPages/tutorials";

const FrontPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [contrast, setContrast] = useState(false);

  const jsonData = [
    {
      heading: "Generate a homepage for a small local coffee shop",
      explanation:
        "Developing a website for your coffee shop serves as an exceptional platform to spotlight your distinctive menu, ambiance, and offerings, while also offering vital details for potential customers. However, this endeavor might pose financial challenges for a small business seeking visibility. The website showcased here is tailored for a local coffee shop, emphasizing the importance of cost-effectiveness for businesses aiming to enhance their online presence.",
      prompt: "generate a homepage for a small local coffee shop",
      htmlCode: tutorials.tutorial1,
    },
    {
      heading: "Adding an image to the site",
      explanation:
        "By using the image bank feature you can add images to your site. In this example we will add an image behind the heading. In the prompt you can specify where you want the image to be added and what image you want to add. ",
      prompt:
        "Add this image behind the heading: https://t3.ftcdn.net/jpg/05/68/26/64/360_F_568266450_wwY8p50EyOHULpd68D0z0QvMyNOu7Xls.jpg",
      htmlCode: tutorials.tutorial2,
    },
    {
      heading: "Generating content",
      explanation:
        "With the generate content feature you can add content to your site. In this example we will add a section with a heading and a paragraph. You can generate content by simply telling the generator to make a paragraph about a certain topic. Then just copy the given paragraph and use it in the prompt.",
      prompt: `add an "About" section with this information:
Welcome to our cozy neighborhood coffee shop! We are dedicated to providing our community with high quality coffee and a warm, inviting atmosphere. Our beans are locally sourced and roasted to perfection, creating delicious and aromatic coffee creations. Whether you're looking for a quick morning pick-me-up or a relaxing place to meet with friends, our small coffee shop is the perfect place to savor your favorite brew. Come in and enjoy the friendly service and delightful ambiance at our local coffee shop.
      `,
      htmlCode: tutorials.tutorial3,
    },
    {
      heading: "Changing the look",
      explanation:
        "If you are not happy with how the site looks you can change the look by changing the colors, fonts and layout. In this example we will change the color scheme of the site. You can change the color scheme by specifying the colors you want to use in the prompt or just asking for the tool to pick the colors.",
      prompt: `change the color scheme to something more user friendly`,
      htmlCode: tutorials.tutorial4,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentData, setCurrentData] = useState(jsonData[currentIndex]);

  const goToNext = () => {
    if (currentIndex < jsonData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentData(jsonData[nextIndex]);
      setActiveDot(nextIndex);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setCurrentIndex(previousIndex);
      setCurrentData(jsonData[previousIndex]);
      setActiveDot(previousIndex);
    }
  };

  const [activeDot, setActiveDot] = useState(0);

  const handleNavigation = (index: number) => {
    setCurrentIndex(index);
    setCurrentData(jsonData[index]);
    setActiveDot(index);
  };

  const dotIndicators = jsonData.map((_, index) => (
    <span
      key={index}
      className={
        index === activeDot ? frontPageStyle.activeDot : frontPageStyle.dot
      }
      onClick={() => handleNavigation(index)}
    />
  ));

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

  const smoothScroll = (linkId: string, targetId: string): void => {
    const scrollLink = document.getElementById(linkId);

    if (scrollLink) {
      scrollLink.addEventListener("click", (event) => {
        event.preventDefault();

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  };

  useEffect(() => {
    smoothScroll("top-link", "top");
    smoothScroll("info-link", "info");
    smoothScroll("tutorial-link", "tutorial");
    smoothScroll("intro-link", "intro");
    smoothScroll("team-link", "team");
  }, []);

  return (
    <body className={frontPageStyle.container} id="top">
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
          <h1
            className={frontPageStyle.headerH1}
            id="top-link"
            style={{ cursor: "pointer" }}
          >
            &lt;Webweave/&gt;
          </h1>
          <div className={frontPageStyle.headerContents}>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              id="info-link"
            >
              Introduction
            </a>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              id="tutorial-link"
            >
              Tutorial
            </a>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              id="intro-link"
            >
              Video
            </a>
            <a
              className={
                contrast
                  ? frontPageStyle.headerAContrast
                  : frontPageStyle.headerA
              }
              id="team-link"
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

      <section className={frontPageStyle.tutorialSection} id="tutorial">
        <div className={frontPageStyle.teamContainer}>
          <div className="grid grid-cols-3">
            <button
              onClick={goToPrevious}
              className={frontPageStyle.moveButtonL}
            >
              <KeyboardArrowLeftIcon />
            </button>
            <h2 className={frontPageStyle.teamHeading}>How to use?</h2>
            <button onClick={goToNext} className={frontPageStyle.moveButtonR}>
              <KeyboardArrowRightIcon />
            </button>
          </div>
          <div className={frontPageStyle.dotIndicators}>{dotIndicators}</div>
          <div className="grid grid-cols-2 gap-10">
            <div className={frontPageStyle.tutorialText}>
              <div>
                <h4 className={frontPageStyle.explanationH4}>
                  {currentData.heading}
                </h4>
                <p className={frontPageStyle.explanation}>
                  {currentData.explanation}
                </p>
              </div>
              <div className={frontPageStyle.tutorialPrompt}>
                <h4 className={frontPageStyle.promptH4}>Prompt:</h4>
                <textarea
                  value={currentData.prompt}
                  readOnly
                  className={frontPageStyle.prompt}
                ></textarea>
              </div>
            </div>
            <div>
              <iframe
                className={frontPageStyle.iframe}
                srcDoc={currentData.htmlCode}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className={frontPageStyle.infoSection} id="intro">
        <div className={frontPageStyle.teamContainer}>
          <h2 className={frontPageStyle.teamHeading}>
            Introduction to <span className="text-action">Webweave</span>
          </h2>
          <div className="grid grid-cols-1">
            <iframe
              className={frontPageStyle.iframeVideo}
              src="https://www.youtube.com/embed/EjvIJuuK824?si=2IVw0cBdyxH3m_WD"
              title="Webweave introduction video"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
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
                <div className="flex flex-row justify-center gap-1">
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.instagram.com/lassiaa_/"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.linkedin.com/in/lassi-aaltonen-033042298"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
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
                <div className="flex flex-row justify-center gap-1">
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.instagram.com/olioonni/"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.linkedin.com/in/onni-fischer-ab3923266/"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
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
                <div className="flex flex-row justify-center gap-1">
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.instagram.com/eetupasonen/"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    className={frontPageStyle.icon}
                    href="https://www.linkedin.com/in/eetu-pasonen-246b6b2a3/"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </body>
  );
};

export default FrontPage;
