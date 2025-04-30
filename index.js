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
    const { data } = await axios.get("https://www.coursejoiner.com/category/free-udemy/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    
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
