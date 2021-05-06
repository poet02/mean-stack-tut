const express = require("express");
const multer = require("multer");
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => { //cb 1 is there error, then path
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    // console.log(file);
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => { //cb 1 is there error, then path
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  // console.log("dam post", req.body)
  const url = req.protocol + '://' + req.get("host")
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    // imagePath: url + '/images/' + req.file.filename,
  });
  if (req.file) {
    post.imagePath = url + '/images/' + req.file.filename
  }
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
        //or use spread
        // title: createdPost.title,
        // content: createdPost.content,
      }
    });
  })
});

router.get("/:id", (req, res, next) => {//check auth is
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.get("", (req, res, next) => {

  // res.json(posts)
  const  pageSize = +req.query.pageSize; //query params are strings, page ish is numeric
  const currentPage = +req.query.page;
  console.log("pageSize ", pageSize)
  console.log("currentPage ", currentPage)
  const postQuery = Post.find();
  let fetchedPosts;
  //mongoose has cool procs
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);//might be bad for large data sets
  }
  postQuery.then((documents) => {
    console.log('documents come tomeee ', documents)
    fetchedPosts = documents
    return Post.count();

  }).then(count => {
    res.status(200).json({
      message: "great success!",
      posts: fetchedPosts,
      maxPosts: count

    });
  })
  .catch((err) => {
    return err;
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(response => {
    res.status(200).json({
      message: "delete post success!",
    });
  })

})

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

module.exports = router;
