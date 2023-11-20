import { useEffect, useRef, useState } from "react";
import style from "../assets/style";
import { exportToJSONFile } from "../utils/openai";
import Chart from "chart.js/auto";
import { Heading } from "../components/Heading";

export const LogData = () => {
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

  const avgRequestTimeChartRef = useRef<HTMLCanvasElement | null>(null);
  const avgTokensUsedChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (modelData.length > 0) {
      if (avgRequestTimeChartRef.current) {
        const ctx1 = avgRequestTimeChartRef.current.getContext("2d");
        if (ctx1) {
          const labels = modelData.map((model) => model.model);
          const avgRequestTimes = modelData.map((model) =>
            model.avgRequestTime.toFixed(2)
          );

          new Chart(ctx1, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Avg. Request Time",
                  data: avgRequestTimes,
                  backgroundColor: "rgba(0,191,255, 0.8)",
                  borderColor: "rgba(0,191,255, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "white",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
                x: {
                  ticks: {
                    color: "white",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                  },
                },
              },
            },
          });
        }
      }

      if (avgTokensUsedChartRef.current) {
        const ctx2 = avgTokensUsedChartRef.current.getContext("2d");
        if (ctx2) {
          const labels = modelData.map((model) => model.model);
          const avgTokensUsed = modelData.map((model) =>
            model.avgTokensUsed.toFixed(2)
          );

          new Chart(ctx2, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Avg. Tokens Used",
                  data: avgTokensUsed,
                  backgroundColor: "rgba(150,173,197, 0.8)",
                  borderColor: "rgba(150,173,197, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "white",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
                x: {
                  ticks: {
                    color: "white",
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                  },
                },
              },
            },
          });
        }
      }
    }
  }, [modelData]);

  return (
    <>
      <div className={style.container}>
        <div className={style.logsTop}>
          <header className={style.headerNav}>
            <Heading></Heading>
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
                  <p>{model.avgRequestTime.toFixed(2) + " sec"}</p>
                </li>
                <li>
                  <p>Avg. Tokens used</p>
                  <p>{model.avgTokensUsed.toFixed(2)}</p>
                </li>
              </ul>
            </div>
          ))}
          <div className={style.logsCharts}>
            <canvas ref={avgRequestTimeChartRef} width={400} height={200} />
            <canvas ref={avgTokensUsedChartRef} width={400} height={200} />
          </div>
          <div className={style.downloadSection}>
            <button className={style.logsButton} onClick={exportToJSONFile}>
              Download logs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
