import React from "react";
import { Heading } from "../components/Heading";
import style from "../assets/style";
import yoda from "../assets/img/yoda.jpg";
import sus from "../assets/img/sus.jpg";
import cafe from "../assets/img/cafe.jpg";
import mclaren from "../assets/img/mclaren.jpg";

const Creations: React.FC = () => {
  interface Creation {
    name: string;
    description: string;
    image: string;
  }

  const creations: Record<string, Creation> = {
    yoda: {
      name: "Yoda",
      description:
        "May the wisdom of Yoda guide you on your quest for knowledge!",
      image: yoda,
    },
    sus: {
      name: "Sus",
      description: "Step into the world of intrigue and suspicion...",
      image: sus,
    },
    cafe: {
      name: "Cafe",
      description: "A place to relax and enjoy a cup of coffee.",
      image: cafe,
    },
    mclaren: {
      name: "McLaren",
      description:
        "McLaren F1 Team is a British Formula One racing team. It is one of the oldest and most successful teams in the sport.",
      image: mclaren,
    },
  };

  return (
    <div>
      <header className={style.headerNav}>
        <Heading></Heading>
      </header>
      <main>
        <div className="grid grid-cols-3 gap-4 pt-4">
          {Object.keys(creations).map((key) => (
            <div className={style.creationsCard} key={key}>
              <img
                className={style.creationsCardImg}
                src={creations[key].image}
                alt={creations[key].name}
              />
              <div className={style.creationsCardContent}>
                <div className={style.creationsCardTitle}>
                  {creations[key].name}
                </div>
                <p className={style.creationsCardText}>
                  {creations[key].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Creations;
