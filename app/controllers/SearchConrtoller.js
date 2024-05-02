"use strict";
import axios from "axios";
import AimerSongList from "../utils/SongList";
const replyToSlack = async (req, res) => {
  var text = req.body.text ? req.body.text : req.query.text;
  try {
    res.status(200).end();
    for (let i = 0; i < AimerSongList.length; i++) {
      AimerSongList[i] = AimerSongList[i].toLowerCase();
    }
    if (AimerSongList.indexOf(typeof text != "undefined" ? text.toLowerCase() : text) == -1) {
      var callback = await remindSonglist();
      await responseToChannel(req.body.response_url, callback);

      return;
    }
    const search = await searchFromYoutube(text);
    for (const [index, i] of search.data.items.entries()) {
      const message = {
        token: process.env.SLACK_AUTH_TOKEN,
        channel: req.body.channel_id ? req.body.channel_id : "DNQFY2DRT",
        text: `<https://www.youtube.com/watch?v=${i.id.videoId}>`,
      };
      const response = await axios.post("https://slack.com/api/chat.postMessage", message, {
        headers: {
          "Content-type": "application/json",
          charset: "utf-8",
          Authorization: `Bearer ${process.env.SLACK_AUTH_TOKEN}`,
        },
      });
    }
  } catch (err) {
    console.log(err);
    const message = {
      text: "線路煩忙",
    };
    await responseToChannel(req.body.response_url, message);
  }
};

const searchFromYoutube = async text => {
  try {
    const search_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=AIzaSyAd0VrdcTzpHk0Zuvi507PfHU4PjXgxUAA&regionCode=HK&relevanceLanguage=zh-Hant&maxResults=1&q=Aimer ${text}`;
    const search = await axios.get(encodeURI(search_url));
    return search;
  } catch (err) {
    throw new Error(err);
  }
};

const responseToChannel = async (response_url, message) => {
  const response = await axios.post(response_url, message, {
    headers: {
      "Content-type": "application/json",
    },
  });
};

const remindSonglist = async () => {
  let buttonArray = [];
  let songList = AimerSongList;
  for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * songList.length);
    buttonArray.push({
      name: songList[random].toUpperCase(),
      text: songList[random].toUpperCase(),
      type: "button",
      value: songList[random].toUpperCase(),
    });
    songList = songList.filter(function(value, index, arr) {
      return index != random;
    });
  }
  const message = {
    text: "Chosse One Song you want search",
    attachments: [
      {
        text: "Choose one Song list",
        fallback: "Unable to find as song",
        callback_id: "Aimer_song_choice",
        color: "#3AA3E3",
        attachment_type: "default",
        actions: buttonArray,
      },
    ],
  };
  console.log(buttonArray);
  return message;
};
export default {
  replyToSlack,
  searchFromYoutube,
};
