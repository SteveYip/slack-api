import axios from "axios";
import moment from "moment";


const observatoryApiCall = async () => {
  const search_url = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc`;
  const search = await axios.get(search_url);
  return search;
};

const replyToSlack = async (req, res) => {
  try {
    res.status(200).end();
    const weather = await observatoryApiCall();
    const time = moment(weather.data.temperature.recordTime).format("YYYY-MM-DD HH:mm:ss");
    //eslint-disable-next-line
    let message = {
      channel: "DNQFY2DRT",
    };
    message.text = `時間係 ${time} 各地區錄得的天氣指數： \n`;

    for (const [index, i] of weather.data.temperature.data.entries()) {
      if (index % 5 == 0) {
        message.text += ` ${i.place}: ${i.value}°C \n`;
      } else {
        message.text += ` ${i.place}: ${i.value}°C `;
      }
    }
    message.text += `\n ${weather.data.uvindex.data[0].place}${weather.data.uvindex.recordDesc}錄得的紫外線指數為${weather.data.uvindex.data[0].value}\n 強度屬於${weather.data.uvindex.data[0].desc}`;

    message.text += `\n 濕度為百分之 ${weather.data.humidity.data[0].value}`;

    const response = await axios.post("https://slack.com/api/chat.postMessage", message, {
      headers: {
        "Content-type": "application/json",
        charset: "utf-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (err) {
    console.log(err);
  }
};

const cronjobToSlack = async () => {
  try {
    const weather = await observatoryApiCall();
    const time = moment(weather.data.temperature.recordTime).format("YYYY-MM-DD HH:mm:ss");
    //eslint-disable-next-line
    let message = {
      channel: "DNQFY2DRT",
    };
    message.text = `時間係 ${time} 各地區錄得的天氣指數： \n`;

    for (const [index, i] of weather.data.temperature.data.entries()) {
      if (index % 5 == 0) {
        message.text += ` ${i.place}: ${i.value}°C \n`;
      } else {
        message.text += ` ${i.place}: ${i.value}°C `;
      }
    }
    message.text += `\n ${weather.data.uvindex.data[0].place}${weather.data.uvindex.recordDesc}錄得的紫外線指數為${weather.data.uvindex.data[0].value}\n 強度屬於${weather.data.uvindex.data[0].desc}`;

    message.text += `\n 濕度為百分之 ${weather.data.humidity.data[0].value}`;

    const response = await axios.post("https://slack.com/api/chat.postMessage", message, {
      headers: {
        "Content-type": "application/json",
        charset: "utf-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (err) {
    console.log(err);
  }
};

export default { replyToSlack, cronjobToSlack, observatoryApiCall };

// var message {
//     text: "線路煩忙"
//     };
// const response = await axios.post(req.body.response_url, message, {
//     headers: {
//         "Content-type": "application/json"
//     }
