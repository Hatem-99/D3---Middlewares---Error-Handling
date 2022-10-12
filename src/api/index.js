import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import {checkBooksSchema, checkValidationResult} from './valditor.js'

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);

console.log("TARGET --> ", blogsJSONPath);

const blogsRouter = express.Router();

blogsRouter.post("/",   checkBooksSchema,
checkValidationResult, async (req, res, next) => {
try {
  const newblog = { ...req.body, createdAt: new Date(), id: uniqid() };

  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  blogsArray.push(newblog);

  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

  res.status(201).send({ id: newblog.id });
} catch (error) {
  next(error)
}
});

blogsRouter.get("/", (req, res, next) => {
try {
  const fileContent = fs.readFileSync(blogsJSONPath);
  console.log("FILE CONTENT: ", fileContent);

  const blogs = JSON.parse(fileContent);

  res.send(blogs);
} catch (error) {
  next(error)
}
});

blogsRouter.get("/:blogId", async (req, res, next) => {
try {
  const blogID = req.params.blogId;

  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const foundblog = blogsArray.find((blog) => blog.id === blogID);

  res.send(foundblog);
} catch (error) {
  next(error)
}
});

blogsRouter.put("/:blogId", (req, res, next) => {
try {
  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const index = blogsArray.findIndex(
    (blog) => blog.id === req.params.blogId
  );
  const oldblog = blogsArray[index];

  const updatedblog = { ...oldblog, ...req.body, updatedAt: new Date() };

  blogsArray[index] = updatedblog;

  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

  res.send(updatedblog)
} catch (error) {
  next(error)
  
};
});

blogsRouter.delete("/:blogId", (req, res, next) => {
try {
  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const remainingblogs = blogsArray.filter(
    (blog) => blog.id !== req.params.blogId
  );

  fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingblogs));

  res.status(204).send();
} catch (error) {
  next(error)
}
});

export default blogsRouter;
