// index.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const getUdemyCourses = async () => {
  const courses = [];

  try {
    const { data } = await axios.get("https://www.coursejoiner.com/category/free-udemy/");
    const $ = cheerio.load(data);

    $(".td-module-title a").each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");
      if (title && link) {
        courses.push({
          title,
          link,
          source: "CourseJoiner"
        });
      }
    });
  } catch (error) {
    console.error("Error scraping CourseJoiner:", error.message);
  }

  return courses;
};

app.get("/api/courses", async (req, res) => {
  const courseList = await getUdemyCourses();
  res.json(courseList);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
