/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { config } from 'dotenv';
console.log('::: Think Hub :::');

const handler = async () => {
  config();
  console.log('Running ThinkHub...');

  const api = axios.create({ baseURL: process.env.JIRA_API_URL });
  api.interceptors.request.use(async (config: any) => {
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization = `Basic ${Buffer.from(
      [process.env.JIRA_API_KEY, process.env.JIRA_API_TOKEN].join(':'),
    ).toString('base64')}`;
    return config;
  });

  // GET ANNOUNCEMENTS
  //   const response = await api.get("/announcementBanner");
  //   console.log(response.data);

  //   // UPDATE ANNOUNCEMENT
  //   const response = await api.put("/announcementBanner", {
  //     visibility: "public",
  //     isDismissible: true,
  //     isEnabled: true,
  //     message: "ThinkHub is Comming in 2024 🚀",
  //   });
  //   console.log(response.data);

  //   // GET ALL DASHBOARDS
  //   const response = await api.get("/dashboard");
  //   console.log(response.data);

  // // GET ALL PROJECTS
  // const response = await api.get("/project");
  // console.log(response.data);

  // // GET PROJECT COMPONENTS
  // const response = await api.get('/search?jql=project = TF');
  // console.log(response.data);

  //   response.data.issues.map((issue) => {
  //     console.log(issue);
  //   });
};

handler();
