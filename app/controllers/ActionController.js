import axios from "axios";
import SearchController from "./SearchConrtoller";

const ActionResponse = async (req, res) => {
  res.status(200).end();
  const body = JSON.parse(req.body.payload);
  const text = body.actions[0].value;
  const search = await SearchController.searchFromYoutube(text);
  search.data.items.forEach(i => {
    const message = {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: req.body.channel_id ? req.body.channel_id : "DNQFY2DRT",
      text: `<https://www.youtube.com/watch?v=${i.id.videoId}>`,
    };
    const response = axios.post("https://slack.com/api/chat.postMessage", message, {
      headers: {
        "Content-type": "application/json",
        charset: "utf-8",
        Authorization: `Bearer ${process.env.SLACK_AUTH_TOKEN}`,
      },
    });
  });
};

const EventResponse = async (req, res) => {
  res
    .status(200)
    .send("challenge")
    .end();
};

export default {
  ActionResponse,
  EventResponse,
};
