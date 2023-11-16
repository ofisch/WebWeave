import { useEffect, useState } from "react";
import style from "../assets/style";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router";

export const LogData = () => {
  const navigate = useNavigate();

  const [jsonData, setJsonData] = useState<any>(null);
  const [modelData, setModelData] = useState<any[]>([]);

  const parseTimeToSeconds = (timeString: string): number => {
    const [value, unit] = timeString?.split(" ");
    if (unit === "sec") {
      return parseFloat(value);
    } else if (unit === "min") {
      const [minutes, seconds] = value?.split(":").map(parseFloat);
      return minutes * 60 + (seconds || 0);
    }
    return 0;
  };

  useEffect(() => {
    const logData = localStorage.getItem("log.json");
    if (logData) {
      const data = JSON.parse(logData);
      setJsonData(data);
    }
  }, []);

  useEffect(() => {
    if (jsonData) {
      const models: Record<
        string,
        { totalRequestTime: number; totalTokensUsed: number; count: number }
      > = {};
      jsonData.forEach((item: any) => {
        const model = item.model;
        const requestTime = item.requestTime;

        if (requestTime) {
          if (!models[model]) {
            models[model] = {
              totalRequestTime: 0,
              totalTokensUsed: 0,
              count: 0,
            };
          }
          models[model].totalRequestTime += parseTimeToSeconds(requestTime);
          models[model].totalTokensUsed += item.tokenTotal;
          models[model].count += 1;
        }
      });

      const modelList = Object.keys(models).map((modelName) => {
        const modelInfo = models[modelName];
        const avgRequestTime =
          modelInfo.count > 0
            ? modelInfo.totalRequestTime / modelInfo.count
            : 0;
        const avgTokensUsed =
          modelInfo.count > 0 ? modelInfo.totalTokensUsed / modelInfo.count : 0;
        return {
          model: modelName,
          avgRequestTime,
          avgTokensUsed,
          requests: modelInfo.count,
        };
      });

      setModelData(modelList);
    }
  }, [jsonData]);

  const goTo = (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.logsTop}>
          <header className={style.header}>
            <div onClick={() => goTo("/")}>
              <h1>&lt;Webweave/&gt;</h1>
              <button className="transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-125 hover:cursor-pointer hover:opacity-75 duration-70">
                <HomeIcon />
              </button>
            </div>
          </header>
        </div>
        <div>
          <h1 className={style.logsH1}>Log data</h1>

          {modelData.map((model) => (
            <div key={model.model} className={style.logData}>
              <h2 className={style.logsH2}>Model: {model.model}</h2>

              <ul className={style.logsUl}>
                <li>
                  <p>Total requests</p>
                  <p>{model.requests}</p>
                </li>
                <li>
                  <p>Avg. Request time</p>
                  <p>{model.avgRequestTime.toFixed(2)}</p>
                </li>
                <li>
                  <p>Avg. Tokens used</p>
                  <p>{model.avgTokensUsed.toFixed(2)}</p>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
